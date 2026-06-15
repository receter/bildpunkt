import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { useOnboarding } from "./useOnboarding";

const ONBOARDING_KEY = "bildpunkt:onboarding:completed";
const HINTS_KEY = "bildpunkt:onboarding:hints";

describe("useOnboarding", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("initializes with tutorial not completed and no hints shown", () => {
    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state.tutorialCompleted).toBe(false);
    expect(result.current.state.hintsShown).toEqual({
      welcome: false,
      drawing: false,
      colors: false,
      saving: false,
    });
  });

  it("marks tutorial as completed", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.completeTutorial();
    });

    expect(result.current.state.tutorialCompleted).toBe(true);
    expect(localStorage.getItem(ONBOARDING_KEY)).toBe("true");
  });

  it("persists tutorial completion across hook instances", () => {
    const { result: result1 } = renderHook(() => useOnboarding());

    act(() => {
      result1.current.completeTutorial();
    });

    const { result: result2 } = renderHook(() => useOnboarding());
    expect(result2.current.state.tutorialCompleted).toBe(true);
  });

  it("marks individual hints as shown", () => {
    const { result } = renderHook(() => useOnboarding());

    act(() => {
      result.current.markHintShown("drawing");
    });

    expect(result.current.state.hintsShown.drawing).toBe(true);
    expect(result.current.state.hintsShown.colors).toBe(false);
    expect(result.current.state.hintsShown.saving).toBe(false);
  });

  it("persists hint state across hook instances", () => {
    const { result: result1 } = renderHook(() => useOnboarding());

    act(() => {
      result1.current.markHintShown("drawing");
      result1.current.markHintShown("colors");
    });

    const { result: result2 } = renderHook(() => useOnboarding());
    expect(result2.current.state.hintsShown.drawing).toBe(true);
    expect(result2.current.state.hintsShown.colors).toBe(true);
    expect(result2.current.state.hintsShown.saving).toBe(false);
  });

  it("handles corrupted localStorage data gracefully", () => {
    localStorage.setItem(HINTS_KEY, "not valid json");

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state.hintsShown).toEqual({
      welcome: false,
      drawing: false,
      colors: false,
      saving: false,
    });
  });

  it("reads existing onboarding state from localStorage", () => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    localStorage.setItem(
      HINTS_KEY,
      JSON.stringify({ drawing: true, colors: true }),
    );

    const { result } = renderHook(() => useOnboarding());

    expect(result.current.state.tutorialCompleted).toBe(true);
    expect(result.current.state.hintsShown.drawing).toBe(true);
    expect(result.current.state.hintsShown.colors).toBe(true);
    expect(result.current.state.hintsShown.saving).toBe(false);
  });
});
