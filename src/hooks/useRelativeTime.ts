import { useEffect, useState } from "react";

/**
 * Returns a human-readable relative time string (e.g. "just now", "2 min ago")
 * Updates automatically every second.
 */
export function useRelativeTime(timestamp: number | null): string | null {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (timestamp === null) return;

    // Update every second
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [timestamp]);

  if (timestamp === null) return null;

  const secondsAgo = Math.floor((now - timestamp) / 1000);

  if (secondsAgo < 5) return "just now";
  if (secondsAgo < 60) return `${secondsAgo}s ago`;

  const minutesAgo = Math.floor(secondsAgo / 60);
  if (minutesAgo < 60) return `${minutesAgo} min ago`;

  const hoursAgo = Math.floor(minutesAgo / 60);
  if (hoursAgo < 24) return `${hoursAgo}h ago`;

  const daysAgo = Math.floor(hoursAgo / 24);
  return `${daysAgo}d ago`;
}
