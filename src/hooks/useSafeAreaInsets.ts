import { useEffect } from 'react';

function measureSafeAreaInsets() {
  const probe = document.createElement('div');
  probe.style.cssText = [
    'position: fixed',
    'top: 0',
    'left: 0',
    'visibility: hidden',
    'pointer-events: none',
    'padding-top: env(safe-area-inset-top)',
    'padding-right: env(safe-area-inset-right)',
    'padding-bottom: env(safe-area-inset-bottom)',
    'padding-left: env(safe-area-inset-left)',
  ].join(';');
  document.documentElement.appendChild(probe);
  const style = getComputedStyle(probe);

  const insets = {
    top: style.paddingTop,
    right: style.paddingRight,
    bottom: style.paddingBottom,
    left: style.paddingLeft,
  };

  probe.remove();
  return insets;
}

function applySafeAreaInsets() {
  const insets = measureSafeAreaInsets();
  const root = document.documentElement.style;

  root.setProperty('--safe-area-inset-top', insets.top);
  root.setProperty('--safe-area-inset-right', insets.right);
  root.setProperty('--safe-area-inset-bottom', insets.bottom);
  root.setProperty('--safe-area-inset-left', insets.left);
}

export function useSafeAreaInsets(): void {
  useEffect(() => {
    applySafeAreaInsets();

    window.addEventListener('resize', applySafeAreaInsets);
    window.visualViewport?.addEventListener('resize', applySafeAreaInsets);

    return () => {
      window.removeEventListener('resize', applySafeAreaInsets);
      window.visualViewport?.removeEventListener('resize', applySafeAreaInsets);
    };
  }, []);
}
