import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import type { ThemeTransitionDelays } from './themeTransition';

const INTERACTIVE_SELECTOR = [
  'button:not(:disabled)',
  'a[href]',
  '[role="button"]:not([aria-disabled="true"])',
  '[role="dialog"]',
  'input:not(:disabled)',
  'select:not(:disabled)',
  'textarea:not(:disabled)',
  'label[for]',
].join(', ');

function canUseHaptics(): boolean {
  return Capacitor.isNativePlatform();
}

async function runHaptic(action: () => Promise<void>): Promise<void> {
  if (!canUseHaptics()) {
    return;
  }

  try {
    await action();
  } catch {
    // Haptics are best-effort and may be unavailable on some devices.
  }
}

export function hapticTap(): void {
  void runHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
}

export function hapticDragHover(): void {
  void runHaptic(() => Haptics.selectionChanged());
}

export function hapticThemeBlip(): void {
  void runHaptic(() => Haptics.impact({ style: ImpactStyle.Light }));
}

export function isInteractiveTapTarget(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return false;
  }

  const interactive = target.closest(INTERACTIVE_SELECTOR);
  if (!interactive) {
    return false;
  }

  if (interactive instanceof HTMLInputElement && interactive.disabled) {
    return false;
  }

  if (interactive instanceof HTMLButtonElement && interactive.disabled) {
    return false;
  }

  return true;
}

export function scheduleThemeTransitionHaptics(delays: ThemeTransitionDelays): number[] {
  return Object.values(delays).map((delay) =>
    window.setTimeout(() => {
      hapticThemeBlip();
    }, delay),
  );
}

export function clearScheduledHaptics(timeoutIds: number[]): void {
  timeoutIds.forEach((timeoutId) => {
    window.clearTimeout(timeoutId);
  });
}
