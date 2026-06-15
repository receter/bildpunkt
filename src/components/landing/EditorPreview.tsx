import { useEffect, useRef } from "react";

import type { CanvasSize, PixelBuffer } from "../../types";
import { createBuffer, setPixel } from "../../utils/pixelBuffer";

interface EditorPreviewProps {
  className?: string;
}

function createDemoArtwork(size: CanvasSize): PixelBuffer {
  const buffer = createBuffer(size);

  const colors = [
    { r: 239, g: 68, b: 68, a: 255 },
    { r: 251, g: 146, b: 60, a: 255 },
    { r: 234, g: 179, b: 8, a: 255 },
    { r: 34, g: 197, b: 94, a: 255 },
    { r: 59, g: 130, b: 246, a: 255 },
    { r: 168, g: 85, b: 247, a: 255 },
  ];

  const centerX = Math.floor(size.width / 2);
  const centerY = Math.floor(size.height / 2);

  for (let i = 0; i < colors.length; i++) {
    const angle = (i * Math.PI * 2) / colors.length;
    const radius = Math.min(size.width, size.height) * 0.3;
    const x = Math.floor(centerX + Math.cos(angle) * radius);
    const y = Math.floor(centerY + Math.sin(angle) * radius);

    if (x >= 0 && x < size.width && y >= 0 && y < size.height) {
      setPixel(buffer, x, y, size.width, colors[i]);
      if (x + 1 < size.width) {
        setPixel(buffer, x + 1, y, size.width, colors[i]);
      }
      if (y + 1 < size.height) {
        setPixel(buffer, x, y + 1, size.width, colors[i]);
      }
      if (x + 1 < size.width && y + 1 < size.height) {
        setPixel(buffer, x + 1, y + 1, size.width, colors[i]);
      }
    }
  }

  return buffer;
}

export function EditorPreview({ className = "" }: EditorPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const size: CanvasSize = { width: 32, height: 32 };
    const zoom = 4;
    const buffer = createDemoArtwork(size);

    const offscreen = document.createElement("canvas");
    offscreen.width = size.width;
    offscreen.height = size.height;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.putImageData(
      new ImageData(new Uint8ClampedArray(buffer), size.width, size.height),
      0,
      0,
    );

    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(128,128,128,0.35)";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    for (let x = 0; x <= size.width; x++) {
      ctx.moveTo(x * zoom, 0);
      ctx.lineTo(x * zoom, size.height * zoom);
    }
    for (let y = 0; y <= size.height; y++) {
      ctx.moveTo(0, y * zoom);
      ctx.lineTo(size.width * zoom, y * zoom);
    }
    ctx.stroke();
  }, []);

  return (
    <div
      className={`rounded-lg border-2 border-neutral-700 ${className}`}
      style={{
        backgroundImage: [
          "linear-gradient(45deg,#374151 25%,transparent 25%)",
          "linear-gradient(-45deg,#374151 25%,transparent 25%)",
          "linear-gradient(45deg,transparent 75%,#374151 75%)",
          "linear-gradient(-45deg,transparent 75%,#374151 75%)",
        ].join(","),
        backgroundSize: "16px 16px",
        backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
        backgroundColor: "#4b5563",
      }}
    >
      <canvas
        ref={canvasRef}
        width={128}
        height={128}
        style={{ imageRendering: "pixelated", display: "block" }}
        aria-label="Preview of the pixel art editor interface"
      />
    </div>
  );
}
