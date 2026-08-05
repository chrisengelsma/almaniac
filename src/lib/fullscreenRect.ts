import type { CalendarId } from './calendarRegistry';

export interface ViewportRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function viewportRectFromDom(rect: DOMRectReadOnly): ViewportRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
}

export function measureCalendarRowRect(calendarId: CalendarId): ViewportRect | null {
  const element = document.querySelector(`[data-calendar-row="${calendarId}"]`);
  if (!element) {
    return null;
  }

  return viewportRectFromDom(element.getBoundingClientRect());
}

export function measureCalendarRowDateRect(calendarId: CalendarId): ViewportRect | null {
  const element = document.querySelector(`[data-calendar-row="${calendarId}"] .calendar-row__date`);
  if (!element) {
    return measureCalendarRowRect(calendarId);
  }

  return viewportRectFromDom(element.getBoundingClientRect());
}

export function fullscreenScaleVars(rect: ViewportRect): Record<string, string> {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scaleX = rect.width / viewportWidth;
  const scaleY = rect.height / viewportHeight;

  return {
    '--fs-scale-x': String(scaleX),
    '--fs-scale-y': String(scaleY),
    '--fs-origin-x': `${((rect.left + rect.width / 2) / viewportWidth) * 100}%`,
    '--fs-origin-y': `${((rect.top + rect.height / 2) / viewportHeight) * 100}%`,
  };
}

export function fullscreenTextVars(rect: ViewportRect): Record<string, string> {
  return {
    '--fs-text-left': `${rect.left}px`,
    '--fs-text-top': `${rect.top}px`,
    '--fs-text-width': `${rect.width}px`,
    '--fs-text-height': `${rect.height}px`,
  };
}

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
