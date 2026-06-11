import { useEffect, useRef, useState } from "react";

import type { CanvasSize, PixelBuffer } from "../../types";

interface Props {
  buffer: PixelBuffer;
  size: CanvasSize;
  zoom: number;
  showGrid: boolean;
  ariaLabel: string;
  onDraw: (x: number, y: number) => void;
  onCommit: () => void;
  onHover?: (pos: { x: number; y: number } | null) => void;
}

function screenToPixel(
  e: React.MouseEvent<HTMLCanvasElement>,
  rect: DOMRect,
  zoom: number,
  size: CanvasSize,
): { x: number; y: number } | null {
  const x = Math.floor((e.clientX - rect.left) / zoom);
  const y = Math.floor((e.clientY - rect.top) / zoom);
  if (x < 0 || x >= size.width || y < 0 || y >= size.height) return null;
  return { x, y };
}

export function PixelCanvas({
  buffer,
  size,
  zoom,
  showGrid,
  ariaLabel,
  onDraw,
  onCommit,
  onHover,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);

  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

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

    if (showGrid && zoom >= 4) {
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
    }

    if (isFocused) {
      ctx.fillStyle = "rgba(255,255,255,0.25)";
      ctx.fillRect(cursorPos.x * zoom, cursorPos.y * zoom, zoom, zoom);
      ctx.strokeStyle = "rgba(255,255,255,0.9)";
      ctx.lineWidth = 1;
      ctx.strokeRect(
        cursorPos.x * zoom + 0.5,
        cursorPos.y * zoom + 0.5,
        zoom - 1,
        zoom - 1,
      );
    }
  }, [buffer, size, zoom, showGrid, cursorPos, isFocused]);

  function handleMouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    if (e.button !== 0) return;
    isDrawing.current = true;
    const pos = screenToPixel(
      e,
      e.currentTarget.getBoundingClientRect(),
      zoom,
      size,
    );
    if (pos) onDraw(pos.x, pos.y);
  }

  function handleMouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    const pos = screenToPixel(
      e,
      e.currentTarget.getBoundingClientRect(),
      zoom,
      size,
    );
    onHover?.(pos);
    if (isDrawing.current && pos) onDraw(pos.x, pos.y);
  }

  function handleMouseUp() {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    onCommit();
  }

  function handleMouseLeave() {
    onHover?.(null);
    handleMouseUp();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    const HANDLED = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "];
    if (!HANDLED.includes(e.key)) return;
    e.preventDefault();

    if (e.key === " ") {
      onDraw(cursorPos.x, cursorPos.y);
      onCommit();
      return;
    }

    setCursorPos((p) => {
      let { x, y } = p;
      if (e.key === "ArrowLeft") x = Math.max(0, x - 1);
      if (e.key === "ArrowRight") x = Math.min(size.width - 1, x + 1);
      if (e.key === "ArrowUp") y = Math.max(0, y - 1);
      if (e.key === "ArrowDown") y = Math.min(size.height - 1, y + 1);
      return { x, y };
    });
  }

  return (
    <div
      className="rounded border border-neutral-700"
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
        width={size.width * zoom}
        height={size.height * zoom}
        style={{ imageRendering: "pixelated", display: "block" }}
        className="cursor-crosshair focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-neutral-700"
        role="img"
        aria-label={ariaLabel}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onContextMenu={(e) => e.preventDefault()}
      />
    </div>
  );
}
