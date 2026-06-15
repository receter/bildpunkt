import type { CanvasSize, Color, PixelBuffer } from "../types";
import { cloneBuffer, setPixel } from "./pixelBuffer";

export function drawLine(
  buffer: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: Color,
  size: CanvasSize,
): PixelBuffer {
  const next = cloneBuffer(buffer);
  const { width, height } = size;

  const dx = Math.abs(x1 - x0);
  const dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;

  let x = x0;
  let y = y0;

  while (true) {
    if (x >= 0 && x < width && y >= 0 && y < height) {
      setPixel(next, x, y, width, color);
    }

    if (x === x1 && y === y1) break;

    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }

  return next;
}

export function drawRectangle(
  buffer: PixelBuffer,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: Color,
  size: CanvasSize,
  filled: boolean,
): PixelBuffer {
  const next = cloneBuffer(buffer);
  const { width, height } = size;

  const minX = Math.max(0, Math.min(x0, x1));
  const maxX = Math.min(width - 1, Math.max(x0, x1));
  const minY = Math.max(0, Math.min(y0, y1));
  const maxY = Math.min(height - 1, Math.max(y0, y1));

  if (filled) {
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        setPixel(next, x, y, width, color);
      }
    }
  } else {
    for (let x = minX; x <= maxX; x++) {
      setPixel(next, x, minY, width, color);
      setPixel(next, x, maxY, width, color);
    }
    for (let y = minY; y <= maxY; y++) {
      setPixel(next, minX, y, width, color);
      setPixel(next, maxX, y, width, color);
    }
  }

  return next;
}

export function drawCircle(
  buffer: PixelBuffer,
  cx: number,
  cy: number,
  x1: number,
  y1: number,
  color: Color,
  size: CanvasSize,
  filled: boolean,
): PixelBuffer {
  const next = cloneBuffer(buffer);
  const { width, height } = size;

  const dx = x1 - cx;
  const dy = y1 - cy;
  const radius = Math.round(Math.sqrt(dx * dx + dy * dy));

  if (radius === 0) {
    if (cx >= 0 && cx < width && cy >= 0 && cy < height) {
      setPixel(next, cx, cy, width, color);
    }
    return next;
  }

  if (filled) {
    for (let y = -radius; y <= radius; y++) {
      for (let x = -radius; x <= radius; x++) {
        if (x * x + y * y <= radius * radius) {
          const px = cx + x;
          const py = cy + y;
          if (px >= 0 && px < width && py >= 0 && py < height) {
            setPixel(next, px, py, width, color);
          }
        }
      }
    }
  } else {
    let x = 0;
    let y = radius;
    let d = 3 - 2 * radius;

    const plot = (px: number, py: number) => {
      if (px >= 0 && px < width && py >= 0 && py < height) {
        setPixel(next, px, py, width, color);
      }
    };

    const plotCirclePoints = (xc: number, yc: number, x: number, y: number) => {
      plot(xc + x, yc + y);
      plot(xc - x, yc + y);
      plot(xc + x, yc - y);
      plot(xc - x, yc - y);
      plot(xc + y, yc + x);
      plot(xc - y, yc + x);
      plot(xc + y, yc - x);
      plot(xc - y, yc - x);
    };

    plotCirclePoints(cx, cy, x, y);

    while (y >= x) {
      x++;
      if (d > 0) {
        y--;
        d = d + 4 * (x - y) + 10;
      } else {
        d = d + 4 * x + 6;
      }
      plotCirclePoints(cx, cy, x, y);
    }
  }

  return next;
}
