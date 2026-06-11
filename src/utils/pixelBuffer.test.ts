import { describe, expect, it } from "vitest";

import {
  clearBuffer,
  cloneBuffer,
  createBuffer,
  getPixel,
  setPixel,
} from "./pixelBuffer";

describe("createBuffer", () => {
  it("allocates width * height * 4 bytes", () => {
    expect(createBuffer({ width: 4, height: 4 }).length).toBe(64);
  });
  it("initializes to all zeros (transparent black)", () => {
    expect(Array.from(createBuffer({ width: 1, height: 2 }))).toEqual([
      0, 0, 0, 0, 0, 0, 0, 0,
    ]);
  });
});

describe("cloneBuffer", () => {
  it("produces an independent copy", () => {
    const buf = createBuffer({ width: 1, height: 1 });
    buf[0] = 255;
    const clone = cloneBuffer(buf);
    clone[0] = 100;
    expect(buf[0]).toBe(255);
    expect(clone[0]).toBe(100);
  });
  it("clone has the same length", () => {
    const buf = createBuffer({ width: 8, height: 8 });
    expect(cloneBuffer(buf).length).toBe(buf.length);
  });
});

describe("setPixel / getPixel", () => {
  it("round-trips a pixel at an arbitrary position", () => {
    const buf = createBuffer({ width: 4, height: 4 });
    setPixel(buf, 2, 3, 4, { r: 255, g: 128, b: 64, a: 200 });
    expect(getPixel(buf, 2, 3, 4)).toEqual({ r: 255, g: 128, b: 64, a: 200 });
  });
  it("does not affect neighboring pixels", () => {
    const buf = createBuffer({ width: 4, height: 4 });
    setPixel(buf, 0, 0, 4, { r: 1, g: 2, b: 3, a: 4 });
    expect(getPixel(buf, 1, 0, 4)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
    expect(getPixel(buf, 0, 1, 4)).toEqual({ r: 0, g: 0, b: 0, a: 0 });
  });
  it("handles the origin pixel (0,0)", () => {
    const buf = createBuffer({ width: 1, height: 1 });
    setPixel(buf, 0, 0, 1, { r: 10, g: 20, b: 30, a: 40 });
    expect(getPixel(buf, 0, 0, 1)).toEqual({ r: 10, g: 20, b: 30, a: 40 });
  });
  it("overwrites a pixel's existing value", () => {
    const buf = createBuffer({ width: 2, height: 2 });
    setPixel(buf, 1, 1, 2, { r: 100, g: 0, b: 0, a: 255 });
    setPixel(buf, 1, 1, 2, { r: 0, g: 200, b: 0, a: 255 });
    expect(getPixel(buf, 1, 1, 2).r).toBe(0);
    expect(getPixel(buf, 1, 1, 2).g).toBe(200);
  });
});

describe("clearBuffer", () => {
  it("resets all bytes to zero", () => {
    const buf = createBuffer({ width: 2, height: 2 });
    setPixel(buf, 0, 0, 2, { r: 255, g: 255, b: 255, a: 255 });
    clearBuffer(buf);
    expect(Array.from(buf)).toEqual(new Array(16).fill(0));
  });
  it("mutates the buffer in place", () => {
    const buf = createBuffer({ width: 1, height: 1 });
    buf[0] = 99;
    const ref = buf;
    clearBuffer(buf);
    expect(ref[0]).toBe(0);
  });
});
