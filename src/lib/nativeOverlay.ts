import { Capacitor } from '@capacitor/core';

const OVERLAY_PRESENT_CLASS = 'overlay-present';

let overlayLockCount = 0;

function syncOverlayPresentClass(): void {
  document.documentElement.classList.toggle(OVERLAY_PRESENT_CLASS, overlayLockCount > 0);
}

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
  if (locked) {
    overlayLockCount += 1;
  } else {
    overlayLockCount = Math.max(0, overlayLockCount - 1);
  }

  syncOverlayPresentClass();

  if (!Capacitor.isNativePlatform()) {
    document.body.style.overflow = overlayLockCount > 0 ? 'hidden' : '';
  }
}
