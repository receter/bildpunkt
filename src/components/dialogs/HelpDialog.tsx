import { useEffect, useRef } from "react";

interface Props {
  onClose: () => void;
}

const SHORTCUTS: { key: string; desc: string }[] = [
  { key: "P", desc: "Pencil" },
  { key: "E", desc: "Eraser" },
  { key: "F", desc: "Fill" },
  { key: "K", desc: "Color picker" },
  { key: "+ / -", desc: "Zoom in / out" },
  { key: "G", desc: "Toggle grid" },
  { key: "?", desc: "Toggle help" },
  { key: "Ctrl+Z", desc: "Undo" },
  { key: "Ctrl+Y", desc: "Redo" },
  { key: "Ctrl+S", desc: "Save to browser" },
  { key: "Ctrl+O", desc: "Open project" },
  { key: "Ctrl+Shift+S", desc: "Export PNG" },
  { key: "Ctrl+N", desc: "New canvas" },
  { key: "Ctrl+V", desc: "Paste image from clipboard" },
  { key: "↑ ↓ ← →", desc: "Move cursor (canvas focused)" },
  { key: "Space", desc: "Draw at cursor (canvas focused)" },
  { key: "Escape", desc: "Close dialog" },
];

export function HelpDialog({ onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="help-title"
        className="w-full max-w-sm rounded-xl bg-neutral-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-700 px-6 py-4">
          <h2 id="help-title" className="font-semibold text-white">
            Keyboard Shortcuts
          </h2>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close help"
            className="rounded p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
          >
            ✕
          </button>
        </div>
        <div className="max-h-96 overflow-y-auto p-6">
          <dl className="space-y-2.5">
            {SHORTCUTS.map(({ key, desc }) => (
              <div key={key} className="flex items-center gap-4">
                <dt className="shrink-0">
                  <kbd className="rounded bg-neutral-700 px-2 py-0.5 font-mono text-xs text-neutral-200">
                    {key}
                  </kbd>
                </dt>
                <dd className="text-sm text-neutral-400">{desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
