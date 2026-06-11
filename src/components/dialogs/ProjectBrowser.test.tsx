import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { Project } from "../../types";
import { ProjectBrowser } from "./ProjectBrowser";

function makeProject(id: string, name: string): Project {
  return {
    id,
    name,
    size: { width: 16, height: 16 },
    dataUrl: "data:image/png;base64,abc",
    savedAt: 0,
  };
}

const defaultProps = {
  projects: [],
  onOpen: vi.fn(),
  onRename: vi.fn(),
  onDelete: vi.fn(),
  onClose: vi.fn(),
};

describe("ProjectBrowser", () => {
  it("shows an empty-state message when no projects exist", () => {
    render(<ProjectBrowser {...defaultProps} />);
    expect(screen.getByText(/no saved projects/i)).toBeInTheDocument();
  });

  it("renders all project names", () => {
    const projects = [makeProject("a", "Art A"), makeProject("b", "Art B")];
    render(<ProjectBrowser {...defaultProps} projects={projects} />);
    expect(screen.getByText("Art A")).toBeInTheDocument();
    expect(screen.getByText("Art B")).toBeInTheDocument();
  });

  it("calls onOpen with the correct project when the thumbnail is clicked", () => {
    const onOpen = vi.fn();
    const projects = [makeProject("a", "My Art")];
    render(
      <ProjectBrowser {...defaultProps} projects={projects} onOpen={onOpen} />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Open My Art" }));
    expect(onOpen).toHaveBeenCalledWith(projects[0]);
  });

  it("shows delete confirmation before calling onDelete", () => {
    const onDelete = vi.fn();
    const projects = [makeProject("a", "My Art")];
    render(
      <ProjectBrowser
        {...defaultProps}
        projects={projects}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete My Art" }));
    expect(screen.getByRole("button", { name: "Delete" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "No" })).toBeInTheDocument();
    expect(onDelete).not.toHaveBeenCalled();
  });

  it("calls onDelete after confirming deletion", () => {
    const onDelete = vi.fn();
    const projects = [makeProject("a", "My Art")];
    render(
      <ProjectBrowser
        {...defaultProps}
        projects={projects}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete My Art" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete" }));
    expect(onDelete).toHaveBeenCalledWith("a");
  });

  it("cancels deletion when No is clicked", () => {
    const onDelete = vi.fn();
    const projects = [makeProject("a", "My Art")];
    render(
      <ProjectBrowser
        {...defaultProps}
        projects={projects}
        onDelete={onDelete}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Delete My Art" }));
    fireEvent.click(screen.getByRole("button", { name: "No" }));
    expect(onDelete).not.toHaveBeenCalled();
    expect(
      screen.queryByRole("button", { name: "Delete" }),
    ).not.toBeInTheDocument();
  });

  it("calls onClose when Escape is pressed", () => {
    const onClose = vi.fn();
    render(<ProjectBrowser {...defaultProps} onClose={onClose} />);
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the backdrop is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <ProjectBrowser {...defaultProps} onClose={onClose} />,
    );
    fireEvent.click(container.firstChild!);
    expect(onClose).toHaveBeenCalledOnce();
  });

  it("calls onClose when the ✕ button is clicked", () => {
    const onClose = vi.fn();
    render(<ProjectBrowser {...defaultProps} onClose={onClose} />);
    fireEvent.click(
      screen.getByRole("button", { name: "Close project browser" }),
    );
    expect(onClose).toHaveBeenCalledOnce();
  });
});
