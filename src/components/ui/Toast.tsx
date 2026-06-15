interface Props {
  message: string | null;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast({ message, action }: Props) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-neutral-700 px-4 py-2 text-sm text-white shadow-xl"
    >
      {action ? (
        <button
          onClick={action.onClick}
          className="hover:underline focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-neutral-700"
        >
          {message}{" "}
          <span className="font-semibold text-blue-300">{action.label}</span>
        </button>
      ) : (
        message
      )}
    </div>
  );
}
