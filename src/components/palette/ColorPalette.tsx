import type { Color } from "../../types";
import { colorToHex, hexToColor } from "../../utils/color";
import { DEFAULT_PALETTE } from "../../utils/palette";

interface Props {
  primaryColor: Color;
  onColorChange: (color: Color) => void;
}

export function ColorPalette({ primaryColor, onColorChange }: Props) {
  const activeHex = colorToHex(primaryColor);

  return (
    <div
      role="group"
      aria-label="Color palette"
      className="grid grid-cols-8 gap-0.5"
    >
      {DEFAULT_PALETTE.map((hex) => {
        const isActive = activeHex === hex;
        return (
          <button
            key={hex}
            aria-label={hex}
            aria-pressed={isActive}
            title={hex}
            onClick={() => onColorChange(hexToColor(hex))}
            className={[
              "h-6 w-6 rounded-sm border-2 transition-transform hover:scale-110",
              "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 focus:ring-offset-neutral-800",
              isActive ? "border-white" : "border-transparent",
            ].join(" ")}
            style={{ backgroundColor: hex }}
          />
        );
      })}
    </div>
  );
}
