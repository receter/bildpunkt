import { useState } from "react";

import type { CanvasSize, Color, EditorState, ToolName } from "../types";

const DEFAULT_COLOR: Color = { r: 0, g: 0, b: 0, a: 255 };
const DEFAULT_SIZE: CanvasSize = { width: 32, height: 32 };

export function useEditor() {
  const [state, setState] = useState<EditorState>({
    tool: "pencil",
    primaryColor: DEFAULT_COLOR,
    canvasSize: DEFAULT_SIZE,
    zoom: 12,
    showGrid: true,
    brushSize: 1,
  });

  function setTool(tool: ToolName) {
    setState((s) => ({ ...s, tool }));
  }

  function setColor(primaryColor: Color) {
    setState((s) => ({ ...s, primaryColor }));
  }

  function setZoom(zoom: number) {
    setState((s) => ({ ...s, zoom: Math.min(32, Math.max(1, zoom)) }));
  }

  function toggleGrid() {
    setState((s) => ({ ...s, showGrid: !s.showGrid }));
  }

  function setCanvasSize(canvasSize: CanvasSize) {
    setState((s) => ({ ...s, canvasSize }));
  }

  function setBrushSize(brushSize: 1 | 2 | 3) {
    setState((s) => ({ ...s, brushSize }));
  }

  return {
    state,
    setTool,
    setColor,
    setZoom,
    toggleGrid,
    setCanvasSize,
    setBrushSize,
  };
}
