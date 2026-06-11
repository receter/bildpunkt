import { useEffect } from "react";

import type { CanvasSize } from "../../types";

interface Props {
  onConfirm: (size: CanvasSize) => void;
  onCancel: () => void;
}

const PRESETS: { label: string; size: CanvasSize }[] = [
  { label: "Small", size: { width: 16, height: 16 } },
  { label: "Medium", size: { width: 32, height: 32 } },
  { label: "Large", size: { width: 64, height: 64 } },
];

export function NewCanvasDialog({ onConfirm, onCancel }: Props) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-canvas-title"
        className="w-72 rounded-xl bg-neutral-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2
          id="new-canvas-title"
          className="mb-5 text-lg font-semibold text-white"
        >
          New Canvas
        </h2>
        <p className="mb-4 text-sm text-neutral-400">
          Choose a size — this will clear the current artwork.
        </p>
        <div className="flex flex-col gap-2">
          {PRESETS.map(({ label, size }, i) => (
            <button
              key={label}
              autoFocus={i === 1}
              className="flex items-center justify-between rounded-lg bg-neutral-700 px-4 py-3 text-sm font-medium text-white hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-800"
              onClick={() => onConfirm(size)}
            >
              <span>{label}</span>
              <span className="font-mono text-neutral-400">
                {size.width}×{size.height}
              </span>
            </button>
          ))}
        </div>
        <button
          className="mt-4 w-full rounded-lg px-4 py-2 text-sm text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-500"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
