interface Props {
  message: string | null;
}

export function Toast({ message }: Props) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-lg bg-neutral-700 px-4 py-2 text-sm text-white shadow-xl"
    >
      {message}
    </div>
  );
}
