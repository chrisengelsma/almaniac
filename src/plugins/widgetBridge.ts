import { registerPlugin } from '@capacitor/core';

export interface WidgetBridgePlugin {
  syncSnapshot(options: { snapshot: string }): Promise<void>;
}

export const WidgetBridge = registerPlugin<WidgetBridgePlugin>('WidgetBridge', {
  web: () => import('./widgetBridge.web').then((module) => new module.WidgetBridgeWeb()),
});
