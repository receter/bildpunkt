import { useCallback, useState } from "react";

const ONBOARDING_KEY = "bildpunkt:onboarding:completed";
const HINTS_KEY = "bildpunkt:onboarding:hints";

export interface OnboardingState {
  tutorialCompleted: boolean;
  hintsShown: {
    welcome: boolean;
    drawing: boolean;
    colors: boolean;
    saving: boolean;
  };
}

function readOnboardingState(): OnboardingState {
  try {
    const tutorialCompleted = localStorage.getItem(ONBOARDING_KEY) === "true";
    const hintsShown = JSON.parse(
      localStorage.getItem(HINTS_KEY) ?? "{}",
    ) as Partial<OnboardingState["hintsShown"]>;

    return {
      tutorialCompleted,
      hintsShown: {
        welcome: hintsShown.welcome ?? false,
        drawing: hintsShown.drawing ?? false,
        colors: hintsShown.colors ?? false,
        saving: hintsShown.saving ?? false,
      },
    };
  } catch {
    return {
      tutorialCompleted: false,
      hintsShown: {
        welcome: false,
        drawing: false,
        colors: false,
        saving: false,
      },
    };
  }
}

export function useOnboarding() {
  const [state, setState] = useState<OnboardingState>(readOnboardingState);

  const completeTutorial = useCallback(() => {
    localStorage.setItem(ONBOARDING_KEY, "true");
    setState((prev) => ({ ...prev, tutorialCompleted: true }));
  }, []);

  const markHintShown = useCallback(
    (hint: keyof OnboardingState["hintsShown"]) => {
      setState((prev) => {
        const newHintsShown = { ...prev.hintsShown, [hint]: true };
        localStorage.setItem(HINTS_KEY, JSON.stringify(newHintsShown));
        return { ...prev, hintsShown: newHintsShown };
      });
    },
    [],
  );

  return {
    state,
    completeTutorial,
    markHintShown,
  };
}
