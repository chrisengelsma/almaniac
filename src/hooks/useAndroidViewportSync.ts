import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { ensureAndroidViewportMeta, syncAndroidViewportMetrics } from '../androidViewport';

export function useAndroidViewportSync(): void {
  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') {
      return;
    }

    ensureAndroidViewportMeta();
    syncAndroidViewportMetrics();

    const onChange = () => {
      syncAndroidViewportMetrics();
    };

    window.addEventListener('resize', onChange);
    window.addEventListener('orientationchange', onChange);
    window.visualViewport?.addEventListener('resize', onChange);

    return () => {
      window.removeEventListener('resize', onChange);
      window.removeEventListener('orientationchange', onChange);
      window.visualViewport?.removeEventListener('resize', onChange);
    };
  }, []);
}
