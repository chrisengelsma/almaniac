import { useEffect, useState } from 'react';

export function useSecondClock(active: boolean): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    if (!active) {
      return;
    }

    const refresh = () => setNow(new Date());
    refresh();

    const intervalId = window.setInterval(refresh, 1000);
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refresh();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [active]);

  return now;
}
