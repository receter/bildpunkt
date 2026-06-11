import { describe, expect, it } from "vitest";

import { colorsEqual, colorToHex, hexToColor } from "./color";

describe("colorToHex", () => {
  it("converts black", () =>
    expect(colorToHex({ r: 0, g: 0, b: 0, a: 255 })).toBe("#000000"));
  it("converts white", () =>
    expect(colorToHex({ r: 255, g: 255, b: 255, a: 255 })).toBe("#ffffff"));
  it("converts red", () =>
    expect(colorToHex({ r: 255, g: 0, b: 0, a: 255 })).toBe("#ff0000"));
  it("pads single-digit hex values", () =>
    expect(colorToHex({ r: 1, g: 2, b: 15, a: 255 })).toBe("#01020f"));
});

describe("hexToColor", () => {
  it("parses #ff0000", () =>
    expect(hexToColor("#ff0000")).toEqual({ r: 255, g: 0, b: 0, a: 255 }));
  it("works without leading hash", () =>
    expect(hexToColor("00ff00")).toEqual({ r: 0, g: 255, b: 0, a: 255 }));
  it("parses #ffffff", () =>
    expect(hexToColor("#ffffff")).toEqual({ r: 255, g: 255, b: 255, a: 255 }));
  it("always sets alpha to 255", () =>
    expect(hexToColor("#123456").a).toBe(255));
});

describe("colorsEqual", () => {
  it("matches identical colors", () =>
    expect(
      colorsEqual({ r: 1, g: 2, b: 3, a: 4 }, { r: 1, g: 2, b: 3, a: 4 }),
    ).toBe(true));
  it("rejects different alpha", () =>
    expect(
      colorsEqual({ r: 1, g: 2, b: 3, a: 4 }, { r: 1, g: 2, b: 3, a: 255 }),
    ).toBe(false));
  it("rejects different red", () =>
    expect(
      colorsEqual({ r: 1, g: 2, b: 3, a: 4 }, { r: 9, g: 2, b: 3, a: 4 }),
    ).toBe(false));
  it("rejects different green", () =>
    expect(
      colorsEqual({ r: 1, g: 2, b: 3, a: 4 }, { r: 1, g: 9, b: 3, a: 4 }),
    ).toBe(false));
  it("rejects different blue", () =>
    expect(
      colorsEqual({ r: 1, g: 2, b: 3, a: 4 }, { r: 1, g: 2, b: 9, a: 4 }),
    ).toBe(false));
});
