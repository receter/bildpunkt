import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { ToolName } from "../../types";
import { Toolbar } from "./Toolbar";

const defaultProps = {
  tool: "pencil" as ToolName,
  zoom: 12,
  showGrid: true,
  canUndo: false,
  canRedo: false,
  onNew: vi.fn(),
  onClear: vi.fn(),
  onSetTool: vi.fn(),
  onZoomIn: vi.fn(),
  onZoomOut: vi.fn(),
  onToggleGrid: vi.fn(),
  onUndo: vi.fn(),
  onRedo: vi.fn(),
  onHelp: vi.fn(),
};

describe("Toolbar", () => {
  it("marks the active tool with aria-checked=true", () => {
    render(<Toolbar {...defaultProps} tool="eraser" />);
    expect(screen.getByRole("radio", { name: "Eraser" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Pencil" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("marks all other tools as aria-checked=false", () => {
    render(<Toolbar {...defaultProps} tool="pencil" />);
    const notActive = ["Eraser", "Fill", "Color picker"];
    notActive.forEach((name) => {
      expect(screen.getByRole("radio", { name })).toHaveAttribute(
        "aria-checked",
        "false",
      );
    });
  });

  it("calls onSetTool with the correct tool when a radio is clicked", () => {
    const onSetTool = vi.fn();
    render(<Toolbar {...defaultProps} onSetTool={onSetTool} />);
    fireEvent.click(screen.getByRole("radio", { name: "Fill" }));
    expect(onSetTool).toHaveBeenCalledWith("fill");
  });

  it("undo button is disabled when canUndo=false", () => {
    render(<Toolbar {...defaultProps} canUndo={false} />);
    expect(screen.getByRole("button", { name: "Undo" })).toBeDisabled();
  });

  it("undo button is enabled when canUndo=true", () => {
    render(<Toolbar {...defaultProps} canUndo={true} />);
    expect(screen.getByRole("button", { name: "Undo" })).not.toBeDisabled();
  });

  it("redo button is disabled when canRedo=false", () => {
    render(<Toolbar {...defaultProps} canRedo={false} />);
    expect(screen.getByRole("button", { name: "Redo" })).toBeDisabled();
  });

  it("calls onUndo when the undo button is clicked", () => {
    const onUndo = vi.fn();
    render(<Toolbar {...defaultProps} canUndo={true} onUndo={onUndo} />);
    fireEvent.click(screen.getByRole("button", { name: "Undo" }));
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("calls onRedo when the redo button is clicked", () => {
    const onRedo = vi.fn();
    render(<Toolbar {...defaultProps} canRedo={true} onRedo={onRedo} />);
    fireEvent.click(screen.getByRole("button", { name: "Redo" }));
    expect(onRedo).toHaveBeenCalledOnce();
  });

  it("calls onHelp when the help button is clicked", () => {
    const onHelp = vi.fn();
    render(<Toolbar {...defaultProps} onHelp={onHelp} />);
    fireEvent.click(screen.getByRole("button", { name: "Keyboard shortcuts" }));
    expect(onHelp).toHaveBeenCalledOnce();
  });

  it("displays the current zoom level", () => {
    render(<Toolbar {...defaultProps} zoom={8} />);
    expect(screen.getByText("8×")).toBeInTheDocument();
  });

  it("renders tool buttons with descriptive tooltips", () => {
    render(<Toolbar {...defaultProps} tool="pencil" />);
    expect(
      screen.getByRole("radio", { name: "Pencil" }),
    ).toHaveAttribute(
      "title",
      "Pencil — Draw single pixels (P)",
    );
    expect(
      screen.getByRole("radio", { name: "Eraser" }),
    ).toHaveAttribute(
      "title",
      "Eraser — Erase pixels to transparent (E)",
    );
    expect(
      screen.getByRole("radio", { name: "Fill" }),
    ).toHaveAttribute(
      "title",
      "Fill — Fill connected area with color (F)",
    );
    expect(
      screen.getByRole("radio", { name: "Color picker" }),
    ).toHaveAttribute(
      "title",
      "Color picker — Pick a color from the canvas (K)",
    );
  });

  it("applies prominent active-tool styling", () => {
    render(<Toolbar {...defaultProps} tool="pencil" />);
    const pencil = screen.getByRole("radio", { name: "Pencil" });
    expect(pencil.className).toContain("bg-violet-500");
    expect(pencil.className).toContain("ring-violet-400");

    const eraser = screen.getByRole("radio", { name: "Eraser" });
    expect(eraser.className).toContain("hover:bg-neutral-700");
    expect(eraser.className).not.toContain("bg-violet-500");
  });
});
