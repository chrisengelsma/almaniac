import { useCallback, useEffect, useRef, useState } from 'react';
import type { CalendarId } from '../lib/calendarRegistry';
import { clearScheduledHaptics, scheduleThemeTransitionHaptics } from '../lib/haptics';
import {
  createThemeTransitionDelays,
  themeTransitionDuration,
  type ThemeTransitionDelays,
} from '../lib/themeTransition';

export function useThemeTransition(visibleCalendarIds: CalendarId[]) {
  const [activeDelays, setActiveDelays] = useState<ThemeTransitionDelays | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const hapticTimeoutsRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      clearScheduledHaptics(hapticTimeoutsRef.current);
    };
  }, []);

  const beginThemeTransition = useCallback(
    (runToggle: () => void) => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        runToggle();
        return;
      }

      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
      clearScheduledHaptics(hapticTimeoutsRef.current);

      const delays = createThemeTransitionDelays(visibleCalendarIds);
      setActiveDelays(delays);
      hapticTimeoutsRef.current = scheduleThemeTransitionHaptics(delays);
      runToggle();

      timeoutRef.current = window.setTimeout(() => {
        timeoutRef.current = null;
        clearScheduledHaptics(hapticTimeoutsRef.current);
        hapticTimeoutsRef.current = [];
        setActiveDelays(null);
      }, themeTransitionDuration(delays));
    },
    [visibleCalendarIds],
  );

  return {
    isThemeTransitioning: activeDelays !== null,
    themeTransitionDelays: activeDelays,
    beginThemeTransition,
  };
}
