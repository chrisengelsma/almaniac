import { useEffect, useState } from 'react';
import { setAppLanguage } from '../i18n';
import {
  detectSystemLanguage,
  isRtlLanguage,
  resolveAppLanguage,
  toIntlLocale,
  type AppLanguagePreference,
} from '../i18n/language';

export function useAppLanguage(preference: AppLanguagePreference): void {
  const [systemLanguage, setSystemLanguage] = useState(detectSystemLanguage);
  const resolvedLanguage = resolveAppLanguage(
    preference === 'system' ? systemLanguage : preference,
  );

  useEffect(() => {
    if (preference !== 'system') {
      return;
    }

    const syncSystemLanguage = () => {
      if (document.visibilityState === 'visible') {
        setSystemLanguage(detectSystemLanguage());
      }
    };

    syncSystemLanguage();
    document.addEventListener('visibilitychange', syncSystemLanguage);
    return () => document.removeEventListener('visibilitychange', syncSystemLanguage);
  }, [preference]);

  useEffect(() => {
    setAppLanguage(resolvedLanguage);

    const root = document.documentElement;
    root.lang = toIntlLocale(resolvedLanguage);
    root.dir = isRtlLanguage(resolvedLanguage) ? 'rtl' : 'ltr';
  }, [resolvedLanguage]);
}
