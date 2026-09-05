import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';

const DEVELOPER_DEVICE_VENDOR_ID_KEY = 'almaniac.developerDeviceVendorId.v1';

const DEFAULT_DEVELOPER_DEVICE_NAME_PATTERNS = [/chris/i];

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function developerDeviceNamePatterns(): RegExp[] {
  const fromEnv = import.meta.env.VITE_DEVELOPER_DEVICE_NAMES;
  const envPatterns = fromEnv
    ? fromEnv
        .split(',')
        .map((entry: string) => entry.trim())
        .filter(Boolean)
        .map((entry: string) => new RegExp(escapeRegExp(entry), 'i'))
    : [];

  return [...DEFAULT_DEVELOPER_DEVICE_NAME_PATTERNS, ...envPatterns];
}

function developerDeviceIds(): string[] {
  const raw = import.meta.env.VITE_DEVELOPER_DEVICE_ID;
  if (!raw) {
    return [];
  }

  return raw
    .split(',')
    .map((entry: string) => entry.trim())
    .filter(Boolean);
}

export function isBuildTimeDeveloperSupporterUnlockEnabled(): boolean {
  return import.meta.env.VITE_DEV_SUPPORTER_UNLOCK === 'true';
}

export function isDeveloperSupporterUnlockCached(): boolean {
  if (typeof localStorage === 'undefined') {
    return false;
  }

  return Boolean(localStorage.getItem(DEVELOPER_DEVICE_VENDOR_ID_KEY));
}

function cacheDeveloperDeviceId(identifier: string): void {
  localStorage.setItem(DEVELOPER_DEVICE_VENDOR_ID_KEY, identifier);
}

function clearDeveloperDeviceIdCache(): void {
  localStorage.removeItem(DEVELOPER_DEVICE_VENDOR_ID_KEY);
}

function matchesDeveloperDeviceName(name: string | undefined): boolean {
  if (!name) {
    return false;
  }

  return developerDeviceNamePatterns().some((pattern) => pattern.test(name));
}

async function matchesDeveloperDevice(): Promise<boolean> {
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

    const { identifier } = await Device.getId();
    const cachedIdentifier = localStorage.getItem(DEVELOPER_DEVICE_VENDOR_ID_KEY);

    if (cachedIdentifier && cachedIdentifier === identifier) {
      return true;
    }

    if (developerDeviceIds().includes(identifier)) {
      return true;
    }

    if (matchesDeveloperDeviceName(info.name)) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
}

export async function shouldForceDeveloperSupporterUnlock(): Promise<boolean> {
  const matched = await matchesDeveloperDevice();

  if (!matched) {
    if (Capacitor.isNativePlatform()) {
      try {
        const { identifier } = await Device.getId();
        const cachedIdentifier = localStorage.getItem(DEVELOPER_DEVICE_VENDOR_ID_KEY);
        if (cachedIdentifier && cachedIdentifier !== identifier) {
          clearDeveloperDeviceIdCache();
        }
      } catch {
        clearDeveloperDeviceIdCache();
      }
    }

    return false;
  }

  if (Capacitor.isNativePlatform()) {
    try {
      const { identifier } = await Device.getId();
      cacheDeveloperDeviceId(identifier);
    } catch {
      // Ignore cache write failures; unlock still applies this session.
    }
  }

  return true;
}
