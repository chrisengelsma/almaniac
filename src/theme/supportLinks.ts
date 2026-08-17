import { Capacitor } from '@capacitor/core';
import type { TipTier } from '../data/tipProducts';
import { EXTERNAL_TIP_COFFEE_AMOUNTS } from '../data/tipProducts';

/** Update this once your Buy Me a Coffee page is live. */
export const DONATION_URL = 'https://buymeacoffee.com/chrisengelsma';

export type DonationChannel = 'iap' | 'external';

/**
 * Resolve how optional tips should be offered on this device.
 * Native iOS can briefly report platform "web" before Capacitor finishes booting;
 * treat any native non-Android session as IAP so external links never flash.
 */
export function getDonationChannel(): DonationChannel {
  const platform = Capacitor.getPlatform();

  if (platform === 'ios') {
    return 'iap';
  }

  if (platform === 'android') {
    return 'external';
  }

  if (Capacitor.isNativePlatform()) {
    return 'iap';
  }

  return 'external';
}

/** App Store guidelines require external donation links to use IAP on iOS. */
export function isExternalDonationAllowed(): boolean {
  return getDonationChannel() === 'external';
}

export function getExternalTipUrl(tier: TipTier): string {
  const amount = EXTERNAL_TIP_COFFEE_AMOUNTS[tier];
  const url = new URL(DONATION_URL);
  url.searchParams.set('amount', String(amount));
  return url.toString();
}

export const SITE_URL = 'https://engelsma.dev';

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
    return 'on Google Play';
  }

  return 'on the App Store';
}
