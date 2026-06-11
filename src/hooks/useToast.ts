import { useCallback, useRef, useState } from "react";

export function useToast(duration = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      setMessage(msg);
      timerRef.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  return { message, showToast };
}
