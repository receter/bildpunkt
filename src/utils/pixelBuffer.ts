import type { CanvasSize, Color, PixelBuffer } from "../types";

export function createBuffer({ width, height }: CanvasSize): PixelBuffer {
  return new Uint8ClampedArray(width * height * 4);
}

export function cloneBuffer(buf: PixelBuffer): PixelBuffer {
  return buf.slice();
}

export function pixelIndex(x: number, y: number, width: number): number {
  return (y * width + x) * 4;
}

export function getPixel(
  buf: PixelBuffer,
  x: number,
  y: number,
  width: number,
): Color {
  const i = pixelIndex(x, y, width);
  return { r: buf[i], g: buf[i + 1], b: buf[i + 2], a: buf[i + 3] };
}

export function setPixel(
  buf: PixelBuffer,
  x: number,
  y: number,
  width: number,
  color: Color,
): void {
  const i = pixelIndex(x, y, width);
  buf[i] = color.r;
  buf[i + 1] = color.g;
  buf[i + 2] = color.b;
  buf[i + 3] = color.a;
}

export function clearBuffer(buf: PixelBuffer): void {
  buf.fill(0);
}
