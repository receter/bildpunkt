import type { CanvasSize, PixelBuffer } from "../types";

export function dataUrlToFile(dataUrl: string, filename = "image.png"): File {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] ?? "image/png";
  const binary = atob(base64 ?? "");
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new File([bytes], filename, { type: mime });
}

export function importImageFile(
  file: File,
  targetSize: CanvasSize,
): Promise<PixelBuffer> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = targetSize.width;
      canvas.height = targetSize.height;
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, 0, 0, targetSize.width, targetSize.height);
      const { data } = ctx.getImageData(
        0,
        0,
        targetSize.width,
        targetSize.height,
      );
      URL.revokeObjectURL(url);
      resolve(new Uint8ClampedArray(data));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
