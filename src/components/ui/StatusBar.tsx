import type { CanvasSize, ToolName } from "../../types";

interface Props {
  hoverPos: { x: number; y: number } | null;
  size: CanvasSize;
  zoom: number;
  tool: ToolName;
  isDirty: boolean;
}

export function StatusBar({ hoverPos, size, zoom, tool, isDirty }: Props) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="false"
      className="flex items-center gap-5 border-t border-neutral-700 px-3 py-1 text-xs text-neutral-500"
    >
      <span aria-label="Cursor position">
        {hoverPos ? `${hoverPos.x}, ${hoverPos.y}` : "—, —"}
      </span>
      <span>
        {size.width}×{size.height}
      </span>
      <span aria-label={`Zoom: ${zoom}×`}>{zoom}×</span>
      <span className="capitalize">{tool}</span>
      {isDirty && (
        <span className="text-amber-400" aria-label="Unsaved changes">
          ●
        </span>
      )}
    </div>
  );
}
