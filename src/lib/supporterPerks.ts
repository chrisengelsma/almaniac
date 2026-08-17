import type { AppIconChoice, AppSettings, ColorTheme } from './appSettings';

export const SUPPORTER_COLOR_THEME = 'supporter' as const satisfies ColorTheme;
export const SUPPORTER_APP_ICON = 'supporter' as const satisfies AppIconChoice;

export function isSupporterColorTheme(theme: ColorTheme): boolean {
  return theme === SUPPORTER_COLOR_THEME;
}

export function isSupporterAppIcon(icon: AppIconChoice): boolean {
  return icon === SUPPORTER_APP_ICON;
}

export function sanitizeSupporterSelections(settings: AppSettings): AppSettings {
  if (settings.supporterUnlocked) {
    return settings;
  }

  return {
    ...settings,
    colorTheme: isSupporterColorTheme(settings.colorTheme) ? 'distinct' : settings.colorTheme,
    appIcon: isSupporterAppIcon(settings.appIcon) ? 'light' : settings.appIcon,
  };
}

export function clearSupporterUnlock(settings: AppSettings): AppSettings {
  return sanitizeSupporterSelections({
    ...settings,
    supporterUnlocked: false,
  });
}
