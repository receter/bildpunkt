export type ToolName = "pencil" | "eraser" | "fill" | "picker";

export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface CanvasSize {
  width: number;
  height: number;
}

export type PixelBuffer = Uint8ClampedArray;

export interface Project {
  id: string;
  name: string;
  size: CanvasSize;
  dataUrl: string;
  savedAt: number;
}

export interface ProjectIndex {
  ids: string[];
}

export interface EditorState {
  tool: ToolName;
  primaryColor: Color;
  canvasSize: CanvasSize;
  zoom: number;
  showGrid: boolean;
}
