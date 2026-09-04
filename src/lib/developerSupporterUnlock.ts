import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

const DEVELOPER_DEVICE_NAME_PATTERN = /chris/i;

export function isBuildTimeDeveloperSupporterUnlockEnabled(): boolean {
  return import.meta.env.VITE_DEV_SUPPORTER_UNLOCK === 'true';
}

export async function shouldForceDeveloperSupporterUnlock(): Promise<boolean> {
  if (isBuildTimeDeveloperSupporterUnlockEnabled()) {
    return true;
  }

  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  try {
    const info = await Device.getInfo();

    if (info.isVirtual) {
      return true;
    }

    if (info.platform === 'ios' && DEVELOPER_DEVICE_NAME_PATTERN.test(info.name ?? '')) {
      return true;
    }

    const developerDeviceId = import.meta.env.VITE_DEVELOPER_DEVICE_ID;
    if (developerDeviceId) {
      const { identifier } = await Device.getId();
      return identifier === developerDeviceId;
    }
  } catch {
    return false;
  }

  return false;
}
