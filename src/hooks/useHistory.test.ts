import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createBuffer, getPixel, setPixel } from "../utils/pixelBuffer";
import { MAX_SNAPSHOTS, useHistory } from "./useHistory";

function makeBuffer(r: number) {
  const buf = createBuffer({ width: 2, height: 2 });
  setPixel(buf, 0, 0, 2, { r, g: 0, b: 0, a: 255 });
  return buf;
}

describe("useHistory", () => {
  it("initial current matches the buffer passed in", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(42)));
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(42);
  });

  it("initial state has no history", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("commit makes a new current and enables undo", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    act(() => result.current.commit(makeBuffer(100)));
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(100);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("commit clones the buffer so caller mutations do not affect history", () => {
    const buf = makeBuffer(50);
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    act(() => result.current.commit(buf));
    buf[0] = 99; // mutate the original
    expect(result.current.current[0]).not.toBe(99);
  });

  it("undo restores the previous state", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    act(() => result.current.commit(makeBuffer(100)));
    act(() => result.current.undo());
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(0);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it("redo replays the undone state", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    act(() => result.current.commit(makeBuffer(100)));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(100);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
  });

  it("commit clears the redo stack", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    act(() => result.current.commit(makeBuffer(100)));
    act(() => result.current.undo());
    act(() => result.current.commit(makeBuffer(200)));
    expect(result.current.canRedo).toBe(false);
  });

  it("undo is a no-op when there is nothing to undo", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(7)));
    act(() => result.current.undo());
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(7);
  });

  it("redo is a no-op when there is nothing to redo", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(7)));
    act(() => result.current.redo());
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(7);
  });

  it("past stack never exceeds MAX_SNAPSHOTS entries", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    for (let i = 1; i <= MAX_SNAPSHOTS + 10; i++) {
      act(() => result.current.commit(makeBuffer(i % 256)));
    }
    let undoCount = 0;
    while (result.current.canUndo) {
      act(() => result.current.undo());
      undoCount++;
      if (undoCount > MAX_SNAPSHOTS + 5) break; // safety
    }
    expect(undoCount).toBe(MAX_SNAPSHOTS);
  });

  it("reset clears history and installs a new buffer", () => {
    const { result } = renderHook(() => useHistory(makeBuffer(0)));
    act(() => result.current.commit(makeBuffer(100)));
    act(() => result.current.reset(makeBuffer(255)));
    expect(getPixel(result.current.current, 0, 0, 2).r).toBe(255);
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });
});
