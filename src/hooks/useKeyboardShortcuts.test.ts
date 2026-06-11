import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useKeyboardShortcuts } from "./useKeyboardShortcuts";

function press(
  key: string,
  mods: { ctrlKey?: boolean; shiftKey?: boolean } = {},
  target?: Element,
) {
  const el = target ?? window;
  el.dispatchEvent(
    new KeyboardEvent("keydown", { key, bubbles: true, ...mods }),
  );
}

describe("useKeyboardShortcuts", () => {
  afterEach(() => vi.clearAllMocks());

  it("calls the handler for a matching key", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ p: handler }));
    press("p");
    expect(handler).toHaveBeenCalledOnce();
  });

  it("ignores unregistered keys", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ p: handler }));
    press("q");
    expect(handler).not.toHaveBeenCalled();
  });

  it("handles Ctrl+key combos", () => {
    const handler = vi.fn();
    renderHook(() => useKeyboardShortcuts({ "Ctrl+z": handler }));
    press("z", { ctrlKey: true });
    expect(handler).toHaveBeenCalledOnce();
  });

  it("handles Ctrl+Shift+key combos", () => {
    const handler = vi.fn();
    // Shift+Z sends e.key = "Z" (uppercase)
    renderHook(() => useKeyboardShortcuts({ "Ctrl+Shift+Z": handler }));
    press("Z", { ctrlKey: true, shiftKey: true });
    expect(handler).toHaveBeenCalledOnce();
  });

  it("does not fire when target is an input element", () => {
    const handler = vi.fn();
    const input = document.createElement("input");
    document.body.appendChild(input);
    renderHook(() => useKeyboardShortcuts({ p: handler }));
    press("p", {}, input);
    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it("does not fire when target is a textarea", () => {
    const handler = vi.fn();
    const ta = document.createElement("textarea");
    document.body.appendChild(ta);
    renderHook(() => useKeyboardShortcuts({ p: handler }));
    press("p", {}, ta);
    expect(handler).not.toHaveBeenCalled();
    document.body.removeChild(ta);
  });

  it("uses the latest handlers without re-registering the listener", () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();
    let currentHandler = handler1;
    const { rerender } = renderHook(() =>
      useKeyboardShortcuts({ p: currentHandler }),
    );
    currentHandler = handler2;
    rerender();
    press("p");
    expect(handler1).not.toHaveBeenCalled();
    expect(handler2).toHaveBeenCalledOnce();
  });
});
