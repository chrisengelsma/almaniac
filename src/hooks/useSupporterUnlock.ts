import { useEffect } from 'react';
import { shouldForceDeveloperSupporterUnlock } from '../lib/developerSupporterUnlock';
import { detectSupporterUnlockFromPurchases } from '../lib/supporterUnlock';

export function useSupporterUnlock(supporterUnlocked: boolean, onUnlock: () => void): void {
  useEffect(() => {
    if (supporterUnlocked) {
      return;
    }

    let cancelled = false;

    void Promise.all([detectSupporterUnlockFromPurchases(), shouldForceDeveloperSupporterUnlock()]).then(
      ([fromPurchases, fromDeveloper]) => {
        if (!cancelled && (fromPurchases || fromDeveloper)) {
          onUnlock();
        }
      },
    );

    return () => {
      cancelled = true;
    };
  }, [supporterUnlocked, onUnlock]);
}
