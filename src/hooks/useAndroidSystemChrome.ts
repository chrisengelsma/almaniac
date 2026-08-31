import { useEffect } from 'react';
import type { AppSettings } from '../lib/appSettings';
import { isAndroidNative, readAndroidSafeArea, syncAndroidSystemChrome } from '../lib/systemChrome';

function readThemeBackground(): string {
  return getComputedStyle(document.documentElement).getPropertyValue('--top-bar-bg').trim() || '#faf9f4';
}

function applySafeAreaInsets(insets: { top: number; right: number; bottom: number; left: number }): void {
  const root = document.documentElement.style;
  root.setProperty('--safe-area-inset-top', `${insets.top}px`);
  root.setProperty('--safe-area-inset-right', `${insets.right}px`);
  root.setProperty('--safe-area-inset-bottom', `${insets.bottom}px`);
  root.setProperty('--safe-area-inset-left', `${insets.left}px`);
}

function applyChromeBackground(background: string): void {
  document.documentElement.style.backgroundColor = background;
  document.body.style.backgroundColor = background;
}

async function syncAndroidChrome(): Promise<void> {
  const background = readThemeBackground();

  applyChromeBackground(background);
  await syncAndroidSystemChrome(background, false);

  const insets = await readAndroidSafeArea();
  applySafeAreaInsets(insets);
}

export function useAndroidSystemChrome(settings: Pick<AppSettings, 'colorScheme' | 'colorTheme'>): void {
  useEffect(() => {
    if (!isAndroidNative()) {
      return;
    }

    let cancelled = false;

    const sync = () => {
      void syncAndroidChrome().then(() => {
        if (cancelled) {
          return;
        }
      });
    };

    sync();

    window.addEventListener('resize', sync);
    window.addEventListener('orientationchange', sync);
    window.visualViewport?.addEventListener('resize', sync);

    return () => {
      cancelled = true;
      window.removeEventListener('resize', sync);
      window.removeEventListener('orientationchange', sync);
      window.visualViewport?.removeEventListener('resize', sync);
    };
  }, [settings.colorScheme, settings.colorTheme]);
}
