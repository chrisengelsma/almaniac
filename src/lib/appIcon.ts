import { Capacitor } from '@capacitor/core';
import { AppIcon, type AppIconChoice } from '../plugins/appIcon';

export async function applyAppIcon(icon: AppIconChoice): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) {
    return true;
  }

  try {
    const nativeIcon = await getNativeAppIcon();
    if (nativeIcon === icon) {
      return true;
    }

    const result = await AppIcon.setIcon({ icon });
    return result.icon === icon;
  } catch (error) {
    console.error('Failed to set app icon:', error);
    return false;
  }
}

export async function getNativeAppIcon(): Promise<AppIconChoice | null> {
  if (!Capacitor.isNativePlatform()) {
    return null;
  }

  try {
    const result = await AppIcon.getIcon();
    return result.icon;
  } catch (error) {
    console.error('Failed to read app icon:', error);
    return null;
  }
}
