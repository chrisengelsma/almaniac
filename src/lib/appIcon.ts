import { Capacitor } from '@capacitor/core';
import { AppIcon, type AppIconChoice } from '../plugins/appIcon';

const VALID_ICONS = new Set<AppIconChoice>(['light', 'dark', 'supporter']);

export async function applyAppIcon(icon: AppIconChoice): Promise<boolean> {
  if (!Capacitor.isNativePlatform() || !VALID_ICONS.has(icon)) {
    return false;
  }

  try {
    const result = await AppIcon.setIcon({ icon });
    return result.icon === icon;
  } catch {
    return false;
  }
}

export async function getNativeAppIcon(): Promise<AppIconChoice | null> {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const result = await AppIcon.getIcon();
    return VALID_ICONS.has(result.icon) ? result.icon : 'light';
  } catch {
    return null;
  }
}

export type { AppIconChoice };
