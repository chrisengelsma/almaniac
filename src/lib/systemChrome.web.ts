import { WebPlugin } from '@capacitor/core';
import type { SafeAreaInsets, SystemChromePlugin } from './systemChrome';

export class SystemChromeWeb extends WebPlugin implements SystemChromePlugin {
  async setColors(): Promise<void> {}

  async getSafeArea(): Promise<SafeAreaInsets> {
    return { top: 0, right: 0, bottom: 0, left: 0 };
  }
}
