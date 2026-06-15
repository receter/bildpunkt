import { useCallback, useEffect, useRef, useState } from "react";

interface Props {
  onComplete: () => void;
}

type Step = 1 | 2 | 3 | 4;

const STEPS: Record<
  Step,
  {
    title: string;
    description: string;
    position: "center" | "left" | "right" | "top";
  }
> = {
  1: {
    title: "Welcome to Bildpunkt!",
    description:
      "This is your canvas where you draw pixel art. Click anywhere on the canvas to place pixels.",
    position: "center",
  },
  2: {
    title: "Choose Your Tool",
    description:
      "These are your drawing tools. Try the pencil to draw, eraser to remove pixels, fill to flood fill areas, or picker to sample colors. Press P, E, F, or K as shortcuts.",
    position: "top",
  },
  3: {
    title: "Pick Your Colors",
    description:
      "Select colors from the palette on the right, or use the color picker to create custom colors. Click any color to start drawing with it.",
    position: "right",
  },
  4: {
    title: "You're Ready!",
    description:
      "Start creating your pixel art! Press ? anytime to see all keyboard shortcuts. Your work is automatically saved when you click Save.",
    position: "center",
  },
};

export function OnboardingTutorial({ onComplete }: Props) {
  const [step, setStep] = useState<Step>(1);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    nextButtonRef.current?.focus();
  }, [step]);

  const handleNext = useCallback(() => {
    if (step < 4) {
      setStep((s) => (s + 1) as Step);
    } else {
      onComplete();
    }
  }, [step, onComplete]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onComplete();
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleNext();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleNext, onComplete]);

  function handleSkip() {
    onComplete();
  }

  const currentStep = STEPS[step];
  const isLastStep = step === 4;

  const overlayPositionClass =
    currentStep.position === "center"
      ? "items-center justify-center"
      : currentStep.position === "left"
        ? "items-center justify-start pl-20"
        : currentStep.position === "right"
          ? "items-center justify-end pr-20"
          : "items-start justify-center pt-20";

  return (
    <div
      className="fixed inset-0 z-[100] flex bg-black/80 p-4"
      style={{ isolation: "isolate" }}
    >
      <div
        className={`flex h-full w-full ${overlayPositionClass}`}
        onClick={(e) => {
          if (e.target === e.currentTarget) handleSkip();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tutorial-title"
          aria-describedby="tutorial-description"
          className="w-full max-w-md rounded-xl bg-neutral-800 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-b border-neutral-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 id="tutorial-title" className="font-semibold text-white">
                {currentStep.title}
              </h2>
              <button
                onClick={handleSkip}
                aria-label="Close tutorial"
                className="rounded p-1 text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 flex gap-1">
              {([1, 2, 3, 4] as const).map((s) => (
                <div
                  key={s}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    s <= step ? "bg-blue-500" : "bg-neutral-700"
                  }`}
                  aria-label={`Step ${s}${s === step ? " (current)" : ""}`}
                />
              ))}
            </div>
          </div>

          <div className="p-6">
            <p
              id="tutorial-description"
              className="text-sm leading-relaxed text-neutral-300"
            >
              {currentStep.description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-neutral-700 px-6 py-4">
            <button
              onClick={handleSkip}
              className="text-sm text-neutral-400 hover:text-white focus:outline-none focus:underline"
            >
              Skip tutorial
            </button>
            <button
              ref={nextButtonRef}
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-neutral-800"
            >
              {isLastStep ? "Get started!" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
