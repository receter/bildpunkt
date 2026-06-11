import type { CanvasSize, Color, PixelBuffer } from "../types";
import { colorsEqual } from "./color";
import { cloneBuffer, getPixel, setPixel } from "./pixelBuffer";

export function floodFill(
  buffer: PixelBuffer,
  startX: number,
  startY: number,
  fillColor: Color,
  size: CanvasSize,
): PixelBuffer {
  const { width, height } = size;

  if (startX < 0 || startX >= width || startY < 0 || startY >= height)
    return buffer;

  const target = getPixel(buffer, startX, startY, width);
  if (colorsEqual(target, fillColor)) return buffer;

  const next = cloneBuffer(buffer);
  const stack: [number, number][] = [[startX, startY]];
  const visited = new Uint8Array(width * height);

  while (stack.length > 0) {
    const entry = stack.pop()!;
    const x = entry[0];
    const y = entry[1];

    if (x < 0 || x >= width || y < 0 || y >= height) continue;

    const idx = y * width + x;
    if (visited[idx]) continue;
    visited[idx] = 1;

    if (!colorsEqual(getPixel(next, x, y, width), target)) continue;

    setPixel(next, x, y, width, fillColor);
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return next;
}
