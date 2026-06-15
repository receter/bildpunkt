interface Props {
  brushSize: 1 | 2 | 3;
  onBrushSizeChange: (size: 1 | 2 | 3) => void;
}

const BRUSH_SIZES: Array<1 | 2 | 3> = [1, 2, 3];

export function BrushSizeSelector({ brushSize, onBrushSizeChange }: Props) {
  return (
    <div role="radiogroup" aria-label="Brush size" className="flex gap-2">
      {BRUSH_SIZES.map((size) => {
        const isActive = brushSize === size;
        const pixelSize = 3 + size * 2;

        return (
          <button
            key={size}
            role="radio"
            aria-checked={isActive}
            aria-label={`${size}×${size} brush`}
            title={`${size}×${size} brush`}
            onClick={() => onBrushSizeChange(size)}
            className={[
              "flex h-10 w-10 items-center justify-center rounded border-2 transition-colors",
              "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-neutral-800",
              isActive
                ? "border-white bg-neutral-700"
                : "border-neutral-600 bg-neutral-800 hover:border-neutral-500 hover:bg-neutral-700",
            ].join(" ")}
          >
            <div
              className="bg-white"
              style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
              aria-hidden="true"
            />
          </button>
        );
      })}
    </div>
  );
}
