import { useEffect } from 'react';
import type { AppSettings } from '../lib/appSettings';

export function useDocumentTheme(settings: Pick<AppSettings, 'colorScheme' | 'colorTheme'>): void {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.colorScheme = settings.colorScheme;
    root.dataset.colorTheme = settings.colorTheme;

    return () => {
      delete root.dataset.colorScheme;
      delete root.dataset.colorTheme;
    };
  }, [settings.colorScheme, settings.colorTheme]);
}
