import { useEffect } from 'react';
import { hapticTap, isInteractiveTapTarget } from '../lib/haptics';

export function useTapHaptics(): void {
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      if (!isInteractiveTapTarget(event.target)) {
        return;
      }

      hapticTap();
    };

    document.addEventListener('pointerdown', handlePointerDown, { capture: true });
    return () => document.removeEventListener('pointerdown', handlePointerDown, { capture: true });
  }, []);
}
