import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

function updateViewportHeight() {
  if (Capacitor.isNativePlatform()) {
    document.documentElement.style.removeProperty('--app-height');
    return;
  }

  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty('--app-height', `${height}px`);
}

export function useViewportHeight(): void {
  useEffect(() => {
    updateViewportHeight();

    if (Capacitor.isNativePlatform()) {
      return;
    }

    window.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.visualViewport?.addEventListener('scroll', updateViewportHeight);

    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      window.visualViewport?.removeEventListener('scroll', updateViewportHeight);
    };
  }, []);
}
