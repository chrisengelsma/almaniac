import type { CalendarId } from './calendarRegistry';

export const THEME_TRANSITION_MS = 450;
export const THEME_STAGGER_MAX_MS = 320;
export const THEME_ICON_MS = 320;

export type ThemeTransitionDelays = Record<string, number>;

export function createThemeTransitionDelays(visibleCalendarIds: CalendarId[]): ThemeTransitionDelays {
  const chunks = ['top-bar-app', 'top-bar-controls', ...visibleCalendarIds];

  return Object.fromEntries(
    chunks.map((id) => [id, Math.floor(Math.random() * THEME_STAGGER_MAX_MS)]),
  );
}

export function themeTransitionDuration(delays: ThemeTransitionDelays): number {
  const maxDelay = Math.max(0, ...Object.values(delays));
  return THEME_TRANSITION_MS + maxDelay + 80;
}
