import { useEffect, useState } from "react";

interface Props {
  message: string;
  onDismiss: () => void;
  autoHideDuration?: number;
}

export function ContextualHint({
  message,
  onDismiss,
  autoHideDuration = 5000,
}: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const showTimer = setTimeout(() => setIsVisible(true), 100);
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onDismiss, 300);
    }, autoHideDuration);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [autoHideDuration, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-blue-600 px-4 py-2 text-sm text-white shadow-xl transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div className="flex items-center gap-3">
        <span>{message}</span>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onDismiss, 300);
          }}
          aria-label="Dismiss hint"
          className="rounded p-0.5 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-white"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
