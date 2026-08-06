import { Capacitor } from '@capacitor/core';

/** Update this once your Buy Me a Coffee page is live. */
export const DONATION_URL = 'https://buymeacoffee.com/chrisengelsma';

export const APP_PACKAGE_ID = 'app.engelsma.almaniac';

/** Set once the app is live on the App Store. */
export const APP_STORE_ID = '';

const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${APP_PACKAGE_ID}`;

export function getAppReviewUrl(): string {
  const platform = Capacitor.getPlatform();

  if (platform === 'ios' && APP_STORE_ID) {
    return `itms-apps://itunes.apple.com/app/id${APP_STORE_ID}?action=write-review`;
  }

  if (platform === 'android') {
    return `market://details?id=${APP_PACKAGE_ID}`;
  }

  return PLAY_STORE_URL;
}

export function getReviewStoreLabel(): string {
  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    return 'on the App Store';
  }

  if (platform === 'android') {
    return 'on the Play Store';
  }

  return 'on the Play Store';
}
