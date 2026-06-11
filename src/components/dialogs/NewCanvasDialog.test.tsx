import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { NewCanvasDialog } from "./NewCanvasDialog";

describe("NewCanvasDialog", () => {
  it("renders Small, Medium, and Large preset options", () => {
    render(<NewCanvasDialog onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText("Small")).toBeInTheDocument();
    expect(screen.getByText("Medium")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
  });

  it("calls onConfirm with 16×16 when Small is clicked", () => {
    const onConfirm = vi.fn();
    render(<NewCanvasDialog onConfirm={onConfirm} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText("Small").closest("button")!);
    expect(onConfirm).toHaveBeenCalledWith({ width: 16, height: 16 });
  });

  it("calls onConfirm with 32×32 when Medium is clicked", () => {
    const onConfirm = vi.fn();
    render(<NewCanvasDialog onConfirm={onConfirm} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText("Medium").closest("button")!);
    expect(onConfirm).toHaveBeenCalledWith({ width: 32, height: 32 });
  });

  it("calls onConfirm with 64×64 when Large is clicked", () => {
    const onConfirm = vi.fn();
    render(<NewCanvasDialog onConfirm={onConfirm} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByText("Large").closest("button")!);
    expect(onConfirm).toHaveBeenCalledWith({ width: 64, height: 64 });
  });

  it("calls onCancel when Escape is pressed", () => {
    const onCancel = vi.fn();
    render(<NewCanvasDialog onConfirm={vi.fn()} onCancel={onCancel} />);
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when the backdrop is clicked", () => {
    const onCancel = vi.fn();
    const { container } = render(
      <NewCanvasDialog onConfirm={vi.fn()} onCancel={onCancel} />,
    );
    fireEvent.click(container.firstChild!);
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("calls onCancel when the Cancel button is clicked", () => {
    const onCancel = vi.fn();
    render(<NewCanvasDialog onConfirm={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("does not call onCancel when the dialog content is clicked", () => {
    const onCancel = vi.fn();
    render(<NewCanvasDialog onConfirm={vi.fn()} onCancel={onCancel} />);
    fireEvent.click(screen.getByRole("dialog"));
    expect(onCancel).not.toHaveBeenCalled();
  });
});
