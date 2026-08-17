import { Capacitor } from '@capacitor/core';

const ANDROID_VIEWPORT =
  'width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no';

export function syncAndroidViewportMetrics(): void {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }

  const width = Math.round(window.innerWidth);
  const height = Math.round(window.innerHeight);

  document.documentElement.style.setProperty('--app-width', `${width}px`);
  document.documentElement.style.setProperty('--app-height', `${height}px`);
}

export function ensureAndroidViewportMeta(): void {
  if (Capacitor.getPlatform() !== 'android') {
    return;
  }

  document
    .querySelector('meta[name="viewport"]')
    ?.setAttribute('content', ANDROID_VIEWPORT);
}

// Run before React paints so the WebView never lays out at the wrong scale.
if (Capacitor.getPlatform() === 'android') {
  ensureAndroidViewportMeta();
  syncAndroidViewportMetrics();
}
