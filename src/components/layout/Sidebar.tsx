import type { CanvasSize, Color } from "../../types";
import { colorToHex } from "../../utils/color";
import { ColorPalette } from "../palette/ColorPalette";

interface Props {
  size: CanvasSize;
  primaryColor: Color;
  projectName: string;
  isDirty: boolean;
  onColorChange: (color: Color) => void;
  onSave: () => void;
  onExportPng: () => void;
  onImportImage: () => void;
  onOpenBrowser: () => void;
  onRenameProject: (name: string) => void;
}

export function Sidebar({
  size,
  primaryColor,
  projectName,
  isDirty,
  onColorChange,
  onSave,
  onExportPng,
  onImportImage,
  onOpenBrowser,
  onRenameProject,
}: Props) {
  const hex = colorToHex(primaryColor);

  return (
    <div className="flex flex-col gap-5 overflow-y-auto">
      <section aria-label="File">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          File
        </p>
        <div className="mb-2 flex items-center gap-1.5">
          <label htmlFor="project-name" className="sr-only">
            Project name
          </label>
          <input
            id="project-name"
            type="text"
            value={projectName}
            onChange={(e) => onRenameProject(e.target.value)}
            className="min-w-0 flex-1 rounded bg-neutral-700 px-2 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-white"
          />
          {isDirty && (
            <span
              className="text-amber-400"
              title="Unsaved changes"
              aria-label="Unsaved changes"
            >
              ●
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onSave}
            title="Save to browser (Ctrl+S)"
            className="rounded bg-white px-3 py-1 text-xs font-medium text-neutral-900 hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Save
          </button>
          <button
            onClick={onOpenBrowser}
            title="Open project (Ctrl+O)"
            className="rounded bg-neutral-600 px-3 py-1 text-xs text-white hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Open
          </button>
          <button
            onClick={onExportPng}
            title="Export PNG (Ctrl+Shift+S)"
            className="rounded bg-neutral-600 px-3 py-1 text-xs text-white hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Export PNG
          </button>
          <button
            onClick={onImportImage}
            title="Import image from file"
            className="rounded bg-neutral-600 px-3 py-1 text-xs text-white hover:bg-neutral-500 focus:outline-none focus:ring-2 focus:ring-white"
          >
            Import
          </button>
        </div>
      </section>

      <section aria-label="Color">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Color
        </p>
        <div className="mb-3 flex items-center gap-3">
          <label htmlFor="primary-color" className="sr-only">
            Primary color
          </label>
          <input
            id="primary-color"
            type="color"
            value={hex}
            onChange={(e) => {
              const v = e.target.value;
              onColorChange({
                r: parseInt(v.slice(1, 3), 16),
                g: parseInt(v.slice(3, 5), 16),
                b: parseInt(v.slice(5, 7), 16),
                a: 255,
              });
            }}
            className="h-9 w-9 cursor-pointer rounded border-0 bg-transparent p-0 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Pick primary color"
          />
          <span
            className="font-mono text-xs text-neutral-400"
            aria-live="polite"
          >
            {hex}
          </span>
        </div>
        <ColorPalette
          primaryColor={primaryColor}
          onColorChange={onColorChange}
        />
      </section>

      <section aria-label="Canvas info">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
          Canvas
        </p>
        <p className="font-mono text-sm text-neutral-300">
          {size.width}×{size.height} px
        </p>
      </section>
    </div>
  );
}
