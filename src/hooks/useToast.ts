import { useCallback, useRef, useState } from "react";

interface ToastAction {
  label: string;
  onClick: () => void;
}

export function useToast(duration = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const [action, setAction] = useState<ToastAction | undefined>(undefined);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string, toastAction?: ToastAction) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      setAction(toastAction);
      timerRef.current = setTimeout(() => {
        setMessage(null);
        setAction(undefined);
      }, duration);
    },
    [duration],
  );

  return { message, action, showToast };
}
