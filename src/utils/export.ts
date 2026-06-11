import type { CanvasSize, PixelBuffer } from "../types";

export function bufferToDataUrl(buffer: PixelBuffer, size: CanvasSize): string {
  const canvas = document.createElement("canvas");
  canvas.width = size.width;
  canvas.height = size.height;
  const ctx = canvas.getContext("2d")!;
  ctx.putImageData(
    new ImageData(new Uint8ClampedArray(buffer), size.width, size.height),
    0,
    0,
  );
  return canvas.toDataURL("image/png");
}

export function exportAsPng(
  buffer: PixelBuffer,
  size: CanvasSize,
  filename: string,
): void {
  const dataUrl = bufferToDataUrl(buffer, size);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
}
