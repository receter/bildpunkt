import { describe, expect, it } from "vitest";

import type { CanvasSize, Color } from "../types";
import { createBuffer, getPixel } from "./pixelBuffer";
import { drawCircle, drawLine, drawRectangle } from "./shapes";

const WHITE: Color = { r: 255, g: 255, b: 255, a: 255 };
const BLACK: Color = { r: 0, g: 0, b: 0, a: 255 };
const TRANSPARENT: Color = { r: 0, g: 0, b: 0, a: 0 };

describe("drawLine", () => {
  it("draws a horizontal line", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawLine(buffer, 1, 2, 3, 2, WHITE, size);

    expect(getPixel(result, 1, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 2, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 3, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 1, size.width)).toEqual(TRANSPARENT);
  });

  it("draws a vertical line", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawLine(buffer, 2, 1, 2, 3, WHITE, size);

    expect(getPixel(result, 2, 1, size.width)).toEqual(WHITE);
    expect(getPixel(result, 2, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 2, 3, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 2, size.width)).toEqual(TRANSPARENT);
  });

  it("draws a diagonal line", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawLine(buffer, 0, 0, 4, 4, WHITE, size);

    expect(getPixel(result, 0, 0, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 1, size.width)).toEqual(WHITE);
    expect(getPixel(result, 2, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 3, 3, size.width)).toEqual(WHITE);
    expect(getPixel(result, 4, 4, size.width)).toEqual(WHITE);
  });

  it("handles single pixel line", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawLine(buffer, 2, 2, 2, 2, WHITE, size);

    expect(getPixel(result, 2, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 2, size.width)).toEqual(TRANSPARENT);
  });
});

describe("drawRectangle", () => {
  it("draws a filled rectangle", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawRectangle(buffer, 1, 1, 3, 3, WHITE, size, true);

    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        expect(getPixel(result, x, y, size.width)).toEqual(WHITE);
      }
    }
    expect(getPixel(result, 0, 0, size.width)).toEqual(TRANSPARENT);
    expect(getPixel(result, 4, 4, size.width)).toEqual(TRANSPARENT);
  });

  it("draws an outline rectangle", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawRectangle(buffer, 1, 1, 3, 3, WHITE, size, false);

    expect(getPixel(result, 1, 1, size.width)).toEqual(WHITE);
    expect(getPixel(result, 3, 1, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 3, size.width)).toEqual(WHITE);
    expect(getPixel(result, 3, 3, size.width)).toEqual(WHITE);
    expect(getPixel(result, 2, 2, size.width)).toEqual(TRANSPARENT);
    expect(getPixel(result, 0, 0, size.width)).toEqual(TRANSPARENT);
  });

  it("handles rectangles with reversed coordinates", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawRectangle(buffer, 3, 3, 1, 1, WHITE, size, true);

    for (let y = 1; y <= 3; y++) {
      for (let x = 1; x <= 3; x++) {
        expect(getPixel(result, x, y, size.width)).toEqual(WHITE);
      }
    }
  });

  it("handles single pixel rectangle", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawRectangle(buffer, 2, 2, 2, 2, WHITE, size, false);

    expect(getPixel(result, 2, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 2, size.width)).toEqual(TRANSPARENT);
  });
});

describe("drawCircle", () => {
  it("draws a filled circle", () => {
    const size: CanvasSize = { width: 10, height: 10 };
    const buffer = createBuffer(size);
    const result = drawCircle(buffer, 5, 5, 8, 5, WHITE, size, true);

    expect(getPixel(result, 5, 5, size.width)).toEqual(WHITE);
    expect(getPixel(result, 6, 5, size.width)).toEqual(WHITE);
    expect(getPixel(result, 7, 5, size.width)).toEqual(WHITE);
    expect(getPixel(result, 8, 5, size.width)).toEqual(WHITE);
  });

  it("draws an outline circle", () => {
    const size: CanvasSize = { width: 10, height: 10 };
    const buffer = createBuffer(size);
    const result = drawCircle(buffer, 5, 5, 8, 5, BLACK, size, false);

    expect(getPixel(result, 8, 5, size.width)).toEqual(BLACK);
    expect(getPixel(result, 2, 5, size.width)).toEqual(BLACK);
    expect(getPixel(result, 5, 8, size.width)).toEqual(BLACK);
    expect(getPixel(result, 5, 2, size.width)).toEqual(BLACK);
    expect(getPixel(result, 5, 5, size.width)).toEqual(TRANSPARENT);
  });

  it("handles single pixel circle (zero radius)", () => {
    const size: CanvasSize = { width: 5, height: 5 };
    const buffer = createBuffer(size);
    const result = drawCircle(buffer, 2, 2, 2, 2, WHITE, size, false);

    expect(getPixel(result, 2, 2, size.width)).toEqual(WHITE);
    expect(getPixel(result, 1, 2, size.width)).toEqual(TRANSPARENT);
  });

  it("handles small circles", () => {
    const size: CanvasSize = { width: 10, height: 10 };
    const buffer = createBuffer(size);
    const result = drawCircle(buffer, 5, 5, 6, 5, WHITE, size, false);

    expect(getPixel(result, 6, 5, size.width)).toEqual(WHITE);
    expect(getPixel(result, 4, 5, size.width)).toEqual(WHITE);
  });
});
