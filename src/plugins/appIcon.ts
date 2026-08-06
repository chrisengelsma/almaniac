import { registerPlugin } from '@capacitor/core';

export type AppIconChoice = 'light' | 'dark';

export interface AppIconPlugin {
  setIcon(options: { icon: AppIconChoice }): Promise<{ icon: AppIconChoice }>;
  getIcon(): Promise<{ icon: AppIconChoice }>;
}

export const AppIcon = registerPlugin<AppIconPlugin>('AppIcon', {
  web: () => import('./appIcon.web').then((module) => new module.AppIconWeb()),
});
