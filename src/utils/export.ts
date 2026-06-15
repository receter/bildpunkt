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

export function bufferToDataUrlScaled(
  buffer: PixelBuffer,
  size: CanvasSize,
  scale: number,
): string {
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = size.width;
  tempCanvas.height = size.height;
  const tempCtx = tempCanvas.getContext("2d")!;
  tempCtx.putImageData(
    new ImageData(new Uint8ClampedArray(buffer), size.width, size.height),
    0,
    0,
  );

  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = size.width * scale;
  scaledCanvas.height = size.height * scale;
  const scaledCtx = scaledCanvas.getContext("2d")!;
  scaledCtx.imageSmoothingEnabled = false;
  scaledCtx.drawImage(
    tempCanvas,
    0,
    0,
    size.width,
    size.height,
    0,
    0,
    size.width * scale,
    size.height * scale,
  );

  return scaledCanvas.toDataURL("image/png");
}

export function exportAsPng(
  buffer: PixelBuffer,
  size: CanvasSize,
  filename: string,
  scale = 1,
): void {
  const dataUrl =
    scale === 1
      ? bufferToDataUrl(buffer, size)
      : bufferToDataUrlScaled(buffer, size, scale);
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename.endsWith(".png") ? filename : `${filename}.png`;
  a.click();
}
