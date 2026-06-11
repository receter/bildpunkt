import { useCallback, useState } from "react";

import type { CanvasSize, PixelBuffer } from "../types";
import { cloneBuffer, createBuffer } from "../utils/pixelBuffer";

export const MAX_SNAPSHOTS = 50;

interface HistoryState {
  current: PixelBuffer;
  past: PixelBuffer[];
  future: PixelBuffer[];
}

export function useHistory(initial: PixelBuffer) {
  const [state, setState] = useState<HistoryState>(() => ({
    current: cloneBuffer(initial),
    past: [],
    future: [],
  }));

  const commit = useCallback((buf: PixelBuffer) => {
    setState((s) => ({
      current: cloneBuffer(buf),
      past: [...s.past.slice(-(MAX_SNAPSHOTS - 1)), s.current],
      future: [],
    }));
  }, []);

  const undo = useCallback(() => {
    setState((s) => {
      if (s.past.length === 0) return s;
      return {
        current: s.past[s.past.length - 1],
        past: s.past.slice(0, -1),
        future: [s.current, ...s.future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((s) => {
      if (s.future.length === 0) return s;
      return {
        current: s.future[0],
        past: [...s.past, s.current],
        future: s.future.slice(1),
      };
    });
  }, []);

  const reset = useCallback((buf: PixelBuffer) => {
    setState({ current: cloneBuffer(buf), past: [], future: [] });
  }, []);

  const resetToSize = useCallback((size: CanvasSize) => {
    setState({ current: createBuffer(size), past: [], future: [] });
  }, []);

  return {
    current: state.current,
    commit,
    undo,
    redo,
    reset,
    resetToSize,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
