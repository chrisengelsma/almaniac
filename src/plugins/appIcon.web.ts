import { WebPlugin } from '@capacitor/core';
import type { AppIconChoice, AppIconPlugin } from './appIcon';

export class AppIconWeb extends WebPlugin implements AppIconPlugin {
  async setIcon(options: { icon: AppIconChoice }): Promise<{ icon: AppIconChoice }> {
    return { icon: options.icon };
  }

  async getIcon(): Promise<{ icon: AppIconChoice }> {
    return { icon: 'light' };
  }
}
