import { useEffect } from 'react';
import { shouldForceDeveloperSupporterUnlock } from '../lib/developerSupporterUnlock';
import { detectSupporterUnlockFromPurchases } from '../lib/supporterUnlock';

export function useSupporterUnlock(supporterUnlocked: boolean, onUnlock: () => void): void {
  useEffect(() => {
    if (supporterUnlocked) {
      return;
    }

    let cancelled = false;

    const checkUnlock = () => {
      void Promise.all([detectSupporterUnlockFromPurchases(), shouldForceDeveloperSupporterUnlock()]).then(
        ([fromPurchases, fromDeveloper]) => {
          if (!cancelled && (fromPurchases || fromDeveloper)) {
            onUnlock();
          }
        },
      );
    };

    checkUnlock();

    const syncOnForeground = () => {
      if (document.visibilityState === 'visible') {
        checkUnlock();
      }
    };

    document.addEventListener('visibilitychange', syncOnForeground);
    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', syncOnForeground);
    };
  }, [supporterUnlocked, onUnlock]);
}
