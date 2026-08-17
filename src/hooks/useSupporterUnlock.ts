import { useEffect } from 'react';
import { detectSupporterUnlockFromPurchases } from '../lib/supporterUnlock';

export function useSupporterUnlock(supporterUnlocked: boolean, onUnlock: () => void): void {
  useEffect(() => {
    if (supporterUnlocked) {
      return;
    }

    let cancelled = false;

    void detectSupporterUnlockFromPurchases().then((unlocked) => {
      if (!cancelled && unlocked) {
        onUnlock();
      }
    });

    return () => {
      cancelled = true;
    };
  }, [supporterUnlocked, onUnlock]);
}
