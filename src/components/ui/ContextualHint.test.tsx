import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ContextualHint } from "./ContextualHint";

describe("ContextualHint", () => {
  it("renders the hint message", () => {
    render(
      <ContextualHint
        message="Click the canvas to start drawing"
        onDismiss={vi.fn()}
      />,
    );

    expect(
      screen.getByText("Click the canvas to start drawing"),
    ).toBeInTheDocument();
  });

  it("has proper ARIA attributes for status announcement", () => {
    render(<ContextualHint message="Test hint" onDismiss={vi.fn()} />);

    const hint = screen.getByRole("status");
    expect(hint).toHaveAttribute("aria-live", "polite");
    expect(hint).toHaveAttribute("aria-atomic", "true");
  });

  it("renders dismiss button", () => {
    render(<ContextualHint message="Test hint" onDismiss={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Dismiss hint" }),
    ).toBeInTheDocument();
  });
});
