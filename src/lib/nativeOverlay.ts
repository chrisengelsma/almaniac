import { Capacitor } from '@capacitor/core';

export function focusWithoutScroll(element: HTMLElement | null | undefined): void {
  if (!element) {
    return;
  }

  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

export function setBodyScrollLocked(locked: boolean): void {
  if (Capacitor.isNativePlatform()) {
    return;
  }

  document.body.style.overflow = locked ? 'hidden' : '';
}
