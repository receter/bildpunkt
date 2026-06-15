import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { OnboardingTutorial } from "./OnboardingTutorial";

describe("OnboardingTutorial", () => {
  it("renders the first step on mount", () => {
    render(<OnboardingTutorial onComplete={vi.fn()} />);

    expect(screen.getByText("Welcome to Bildpunkt!")).toBeInTheDocument();
    expect(
      screen.getByText(/This is your canvas where you draw pixel art/),
    ).toBeInTheDocument();
  });

  it("advances to next step when Next button is clicked", () => {
    render(<OnboardingTutorial onComplete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    expect(screen.getByText("Choose Your Tool")).toBeInTheDocument();
    expect(
      screen.getByText(/These are your drawing tools/),
    ).toBeInTheDocument();
  });

  it("shows all four steps in sequence", () => {
    render(<OnboardingTutorial onComplete={vi.fn()} />);

    // Step 1
    expect(screen.getByText("Welcome to Bildpunkt!")).toBeInTheDocument();

    // Step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Choose Your Tool")).toBeInTheDocument();

    // Step 3
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("Pick Your Colors")).toBeInTheDocument();

    // Step 4
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByText("You're Ready!")).toBeInTheDocument();
  });

  it("calls onComplete when Get started button is clicked on last step", () => {
    const onComplete = vi.fn();
    render(<OnboardingTutorial onComplete={onComplete} />);

    // Navigate to last step
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    fireEvent.click(screen.getByRole("button", { name: "Next" }));

    // Click Get started
    fireEvent.click(screen.getByRole("button", { name: "Get started!" }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete when Skip tutorial is clicked", () => {
    const onComplete = vi.fn();
    render(<OnboardingTutorial onComplete={onComplete} />);

    fireEvent.click(screen.getByRole("button", { name: "Skip tutorial" }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("calls onComplete when close button (X) is clicked", () => {
    const onComplete = vi.fn();
    render(<OnboardingTutorial onComplete={onComplete} />);

    fireEvent.click(screen.getByRole("button", { name: "Close tutorial" }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it("shows progress indicators for all steps", () => {
    render(<OnboardingTutorial onComplete={vi.fn()} />);

    const progressBars = screen.getAllByLabelText(/Step \d/);
    expect(progressBars).toHaveLength(4);
  });

  it("updates progress indicators as user advances", () => {
    render(<OnboardingTutorial onComplete={vi.fn()} />);

    // On step 1, only first progress bar should be active
    expect(screen.getByLabelText("Step 1 (current)")).toBeInTheDocument();

    // Advance to step 2
    fireEvent.click(screen.getByRole("button", { name: "Next" }));
    expect(screen.getByLabelText("Step 2 (current)")).toBeInTheDocument();
  });

  it("has proper dialog accessibility attributes", () => {
    render(<OnboardingTutorial onComplete={vi.fn()} />);

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "tutorial-title");
    expect(dialog).toHaveAttribute("aria-describedby", "tutorial-description");
  });
});
