import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useRelativeTime } from "./useRelativeTime";

describe("useRelativeTime", () => {
  it("returns null for null timestamp", () => {
    const { result } = renderHook(() => useRelativeTime(null));
    expect(result.current).toBeNull();
  });

  it('returns "just now" for very recent timestamps', () => {
    const now = Date.now();
    const { result } = renderHook(() => useRelativeTime(now));
    expect(result.current).toBe("just now");
  });

  it("returns seconds for timestamps less than 60 seconds ago", () => {
    const now = Date.now();
    const thirtySecondsAgo = now - 30 * 1000;
    const { result } = renderHook(() => useRelativeTime(thirtySecondsAgo));
    expect(result.current).toMatch(/^\d+s ago$/);
  });

  it("returns minutes for timestamps less than 60 minutes ago", () => {
    const now = Date.now();
    const fiveMinutesAgo = now - 5 * 60 * 1000;
    const { result } = renderHook(() => useRelativeTime(fiveMinutesAgo));
    expect(result.current).toBe("5 min ago");
  });

  it("returns hours for timestamps less than 24 hours ago", () => {
    const now = Date.now();
    const twoHoursAgo = now - 2 * 60 * 60 * 1000;
    const { result } = renderHook(() => useRelativeTime(twoHoursAgo));
    expect(result.current).toBe("2h ago");
  });

  it("returns days for timestamps more than 24 hours ago", () => {
    const now = Date.now();
    const threeDaysAgo = now - 3 * 24 * 60 * 60 * 1000;
    const { result } = renderHook(() => useRelativeTime(threeDaysAgo));
    expect(result.current).toBe("3d ago");
  });

  it("updates every second", async () => {
    vi.useFakeTimers();
    const now = Date.now();
    const tenSecondsAgo = now - 10 * 1000;

    const { result } = renderHook(() => useRelativeTime(tenSecondsAgo));
    expect(result.current).toBe("10s ago");

    // Advance time by 1 second
    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("11s ago");

    vi.useRealTimers();
  });
});
