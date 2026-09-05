import type { AppIconChoice, AppSettings } from './appSettings';
import {
  DEFAULT_COLOR_THEME,
  isSupporterOnlyTheme,
  type ColorThemeId,
} from '../theme/themePalette';

export const SUPPORTER_COLOR_THEME = 'supporter' as const satisfies ColorThemeId;
export const SUPPORTER_APP_ICON = 'supporter' as const satisfies AppIconChoice;

export function isSupporterColorTheme(theme: ColorThemeId): boolean {
  return isSupporterOnlyTheme(theme);
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
    colorTheme: isSupporterColorTheme(settings.colorTheme) ? DEFAULT_COLOR_THEME : settings.colorTheme,
    appIcon: isSupporterAppIcon(settings.appIcon) ? 'light' : settings.appIcon,
  };
}

export function clearSupporterUnlock(settings: AppSettings): AppSettings {
  return sanitizeSupporterSelections({
    ...settings,
    supporterUnlocked: false,
  });
}
