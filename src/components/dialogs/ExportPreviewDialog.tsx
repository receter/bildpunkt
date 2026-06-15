import { useEffect, useMemo, useState } from "react";

import type { CanvasSize, PixelBuffer } from "../../types";
import { bufferToDataUrlScaled } from "../../utils/export";

interface Props {
  buffer: PixelBuffer;
  size: CanvasSize;
  onConfirm: (scale: number) => void;
  onCancel: () => void;
}

const SCALE_OPTIONS = [
  { value: 1, label: "1x (native)" },
  { value: 4, label: "4x" },
  { value: 8, label: "8x" },
];

function getDefaultScale(size: CanvasSize): number {
  return Math.max(size.width, size.height) <= 32 ? 4 : 1;
}

export function ExportPreviewDialog({
  buffer,
  size,
  onConfirm,
  onCancel,
}: Props) {
  const [scale, setScale] = useState(() => getDefaultScale(size));

  const previewUrl = useMemo(
    () => bufferToDataUrlScaled(buffer, size, scale),
    [buffer, size, scale],
  );

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm(scale);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel, onConfirm, scale]);

  const scaledWidth = size.width * scale;
  const scaledHeight = size.height * scale;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-preview-title"
        className="w-96 rounded-xl bg-neutral-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="export-preview-title"
          className="mb-5 text-lg font-semibold text-white"
        >
          Export PNG
        </h2>

        <div className="mb-5">
          <p className="mb-3 text-sm text-neutral-400">
            Choose export scale (nearest-neighbor)
          </p>
          <div
            role="radiogroup"
            aria-label="Export scale"
            className="flex gap-2"
          >
            {SCALE_OPTIONS.map((option) => (
              <button
                key={option.value}
                role="radio"
                aria-checked={scale === option.value}
                onClick={() => setScale(option.value)}
                className={[
                  "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800",
                  scale === option.value
                    ? "bg-white text-neutral-900"
                    : "bg-neutral-700 text-white hover:bg-neutral-600",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 text-xs text-neutral-500">Preview</p>
          <div className="flex items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900 p-4">
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Export preview"
                className="max-h-48 max-w-full"
                style={{ imageRendering: "pixelated" }}
              />
            )}
          </div>
          <p className="mt-2 text-center font-mono text-xs text-neutral-400">
            {scaledWidth}×{scaledHeight} px
          </p>
        </div>

        <div className="flex gap-2">
          <button
            className="flex-1 rounded-lg bg-white px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => onConfirm(scale)}
          >
            Download
          </button>
          <button
            className="flex-1 rounded-lg bg-neutral-700 px-4 py-2 text-sm text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-white"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
