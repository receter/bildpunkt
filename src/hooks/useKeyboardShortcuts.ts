import { useEffect, useRef } from "react";

export function useKeyboardShortcuts(handlers: Record<string, () => void>) {
  const handlersRef = useRef(handlers);

  // Keep the ref current after every render so the listener always sees
  // the latest handlers without re-registering on the window.
  useEffect(() => {
    handlersRef.current = handlers;
  });

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as EventTarget;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      // For printable non-letter/digit chars (like + - = ), the key already encodes
      // any shift state, so don't prepend "Shift". For letters/digits, include it.
      const isLetterOrDigit = /^[a-zA-Z0-9]$/.test(e.key);
      const key = [
        e.ctrlKey || e.metaKey ? "Ctrl" : "",
        e.shiftKey && isLetterOrDigit ? "Shift" : "",
        e.key,
      ]
        .filter(Boolean)
        .join("+");

      if (handlersRef.current[key]) {
        e.preventDefault();
        handlersRef.current[key]();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
