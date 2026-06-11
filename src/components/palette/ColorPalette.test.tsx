import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Color } from "../../types";
import { hexToColor } from "../../utils/color";
import { DEFAULT_PALETTE } from "../../utils/palette";
import { ColorPalette } from "./ColorPalette";

const BLACK: Color = { r: 0, g: 0, b: 0, a: 255 };

describe("ColorPalette", () => {
  it(`renders ${DEFAULT_PALETTE.length} color swatches`, () => {
    render(<ColorPalette primaryColor={BLACK} onColorChange={vi.fn()} />);
    expect(screen.getAllByRole("button")).toHaveLength(DEFAULT_PALETTE.length);
  });

  it("marks the active swatch as aria-pressed=true", () => {
    const firstColor = hexToColor(DEFAULT_PALETTE[0]);
    render(<ColorPalette primaryColor={firstColor} onColorChange={vi.fn()} />);
    const pressed = screen.getAllByRole("button", { pressed: true });
    expect(pressed).toHaveLength(1);
    expect(pressed[0]).toHaveAttribute("title", DEFAULT_PALETTE[0]);
  });

  it("marks all other swatches as aria-pressed=false when none match", () => {
    const notInPalette: Color = { r: 1, g: 2, b: 3, a: 255 };
    render(
      <ColorPalette primaryColor={notInPalette} onColorChange={vi.fn()} />,
    );
    const pressed = screen.queryAllByRole("button", { pressed: true });
    expect(pressed).toHaveLength(0);
  });

  it("calls onColorChange with a Color object when a swatch is clicked", () => {
    const onColorChange = vi.fn();
    render(<ColorPalette primaryColor={BLACK} onColorChange={onColorChange} />);
    fireEvent.click(screen.getAllByRole("button")[1]);
    expect(onColorChange).toHaveBeenCalledOnce();
    const arg = onColorChange.mock.calls[0][0] as Color;
    expect(arg).toMatchObject({
      r: expect.any(Number),
      g: expect.any(Number),
      b: expect.any(Number),
      a: expect.any(Number),
    });
  });

  it("calls onColorChange with the color matching the clicked swatch", () => {
    const onColorChange = vi.fn();
    render(<ColorPalette primaryColor={BLACK} onColorChange={onColorChange} />);
    const firstSwatch = screen.getAllByRole("button")[0];
    fireEvent.click(firstSwatch);
    expect(onColorChange).toHaveBeenCalledWith(hexToColor(DEFAULT_PALETTE[0]));
  });
});
