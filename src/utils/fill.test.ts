import { describe, expect, it } from "vitest";

import type { Color } from "../types";
import { floodFill } from "./fill";
import { createBuffer, getPixel, setPixel } from "./pixelBuffer";

const RED: Color = { r: 255, g: 0, b: 0, a: 255 };
const BLUE: Color = { r: 0, g: 0, b: 255, a: 255 };
const GREEN: Color = { r: 0, g: 255, b: 0, a: 255 };

function fillWith(color: Color, width: number, height: number) {
  const buf = createBuffer({ width, height });
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) setPixel(buf, x, y, width, color);
  return buf;
}

function allPixelsMatch(
  buf: ReturnType<typeof createBuffer>,
  color: Color,
  w: number,
  h: number,
) {
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++)
      if (
        !Object.entries(getPixel(buf, x, y, w)).every(
          ([k, v]) => color[k as keyof Color] === v,
        )
      )
        return false;
  return true;
}

describe("floodFill", () => {
  it("fills an entirely uniform canvas", () => {
    const buf = fillWith(RED, 3, 3);
    const result = floodFill(buf, 0, 0, BLUE, { width: 3, height: 3 });
    expect(allPixelsMatch(result, BLUE, 3, 3)).toBe(true);
  });

  it("only fills connected pixels of the target color", () => {
    // 3×3: RED border, GREEN center
    const buf = fillWith(RED, 3, 3);
    setPixel(buf, 1, 1, 3, GREEN);
    const result = floodFill(buf, 0, 0, BLUE, { width: 3, height: 3 });
    // border becomes BLUE, center stays GREEN
    expect(getPixel(result, 0, 0, 3)).toEqual(BLUE);
    expect(getPixel(result, 1, 0, 3)).toEqual(BLUE);
    expect(getPixel(result, 1, 1, 3)).toEqual(GREEN);
  });

  it("does not bleed across a boundary color", () => {
    // 5×1 row: RED RED GREEN RED RED — fill from (0,0) only hits the two left reds
    const buf = createBuffer({ width: 5, height: 1 });
    [0, 1, 3, 4].forEach((x) => setPixel(buf, x, 0, 5, RED));
    setPixel(buf, 2, 0, 5, GREEN);
    const result = floodFill(buf, 0, 0, BLUE, { width: 5, height: 1 });
    expect(getPixel(result, 0, 0, 5)).toEqual(BLUE);
    expect(getPixel(result, 1, 0, 5)).toEqual(BLUE);
    expect(getPixel(result, 2, 0, 5)).toEqual(GREEN);
    expect(getPixel(result, 3, 0, 5)).toEqual(RED);
    expect(getPixel(result, 4, 0, 5)).toEqual(RED);
  });

  it("fills a fully transparent canvas", () => {
    const buf = createBuffer({ width: 4, height: 4 });
    const result = floodFill(buf, 0, 0, RED, { width: 4, height: 4 });
    expect(allPixelsMatch(result, RED, 4, 4)).toBe(true);
  });

  it("returns the original buffer when fill color equals target color", () => {
    const buf = fillWith(RED, 3, 3);
    const result = floodFill(buf, 1, 1, RED, { width: 3, height: 3 });
    expect(result).toBe(buf); // same reference — no allocation
  });

  it("returns the original buffer unchanged for out-of-bounds start", () => {
    const buf = fillWith(RED, 3, 3);
    const result = floodFill(buf, 10, 10, BLUE, { width: 3, height: 3 });
    expect(result).toBe(buf);
  });

  it("fills the interior of a closed region without escaping", () => {
    // 5×5: RED border, transparent interior — fill interior from (2,2)
    const size = { width: 5, height: 5 };
    const buf = createBuffer(size);
    for (let x = 0; x < 5; x++) {
      setPixel(buf, x, 0, 5, RED);
      setPixel(buf, x, 4, 5, RED);
    }
    for (let y = 1; y < 4; y++) {
      setPixel(buf, 0, y, 5, RED);
      setPixel(buf, 4, y, 5, RED);
    }
    const result = floodFill(buf, 2, 2, BLUE, size);
    // Interior filled with blue
    expect(getPixel(result, 2, 2, 5)).toEqual(BLUE);
    expect(getPixel(result, 1, 1, 5)).toEqual(BLUE);
    // Border untouched
    expect(getPixel(result, 0, 0, 5)).toEqual(RED);
    expect(getPixel(result, 4, 4, 5)).toEqual(RED);
  });

  it("does not mutate the original buffer", () => {
    const buf = fillWith(RED, 3, 3);
    const original = buf.slice();
    floodFill(buf, 0, 0, BLUE, { width: 3, height: 3 });
    expect(Array.from(buf)).toEqual(Array.from(original));
  });
});
