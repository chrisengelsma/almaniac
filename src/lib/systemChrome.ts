import { Capacitor, registerPlugin } from '@capacitor/core';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

export interface SystemChromePlugin {
  setColors(options: { background: string; lightStatusBarIcons: boolean }): Promise<void>;
  getSafeArea(): Promise<SafeAreaInsets>;
}

const SystemChrome = registerPlugin<SystemChromePlugin>('SystemChrome', {
  web: () => import('./systemChrome.web').then((module) => new module.SystemChromeWeb()),
});

export function isAndroidNative(): boolean {
  return Capacitor.getPlatform() === 'android';
}

export async function syncAndroidSystemChrome(background: string, lightStatusBarIcons: boolean): Promise<void> {
  if (!isAndroidNative()) {
    return;
  }

  await SystemChrome.setColors({ background, lightStatusBarIcons });
}

export async function readAndroidSafeArea(): Promise<SafeAreaInsets> {
  if (!isAndroidNative()) {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }

  return SystemChrome.getSafeArea();
}
