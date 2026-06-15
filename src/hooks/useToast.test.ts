import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useToast } from "./useToast";

describe("useToast", () => {
  it("starts with no message", () => {
    const { result } = renderHook(() => useToast());
    expect(result.current.message).toBeNull();
    expect(result.current.action).toBeUndefined();
  });

  it("shows a toast message", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("Test message");
    });

    expect(result.current.message).toBe("Test message");
  });

  it("shows a toast with an action", () => {
    const { result } = renderHook(() => useToast());
    const action = { label: "Click me", onClick: vi.fn() };

    act(() => {
      result.current.showToast("Test message", action);
    });

    expect(result.current.message).toBe("Test message");
    expect(result.current.action).toEqual(action);
  });

  it("clears message after duration", () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(1000));

    act(() => {
      result.current.showToast("Test message");
    });

    expect(result.current.message).toBe("Test message");

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.message).toBeNull();
    expect(result.current.action).toBeUndefined();

    vi.useRealTimers();
  });

  it("replaces existing toast when showing a new one", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.showToast("First message");
    });

    expect(result.current.message).toBe("First message");

    act(() => {
      result.current.showToast("Second message");
    });

    expect(result.current.message).toBe("Second message");
  });

  it("clears action when showing a new toast without action", () => {
    const { result } = renderHook(() => useToast());
    const action = { label: "Click", onClick: vi.fn() };

    act(() => {
      result.current.showToast("With action", action);
    });

    expect(result.current.action).toEqual(action);

    act(() => {
      result.current.showToast("Without action");
    });

    expect(result.current.message).toBe("Without action");
    expect(result.current.action).toBeUndefined();
  });
});
