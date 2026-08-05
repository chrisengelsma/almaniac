import { WebPlugin } from '@capacitor/core';
import type { WidgetBridgePlugin } from './widgetBridge';

export class WidgetBridgeWeb extends WebPlugin implements WidgetBridgePlugin {
  async syncSnapshot(): Promise<void> {
    // No-op on web.
  }
}
