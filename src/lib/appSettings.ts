import type { CalendarId } from './calendarRegistry';
import type { CalendarColorMap } from '../theme/calendarColors';
import { DEFAULT_CALENDAR_ORDER } from './calendarRegistry';

export type IslamicDayAdjustment = -1 | 0 | 1;
export type IslamicCalendarMode = 'tabular' | 'ummAlQura';
export type ColorScheme = 'light' | 'dark';
export type ColorTheme = 'distinct' | 'mono';

export interface AppSettings {
  visibleCalendars: Record<CalendarId, boolean>;
  calendarColors: Partial<CalendarColorMap>;
  colorTheme: ColorTheme;
  colorScheme: ColorScheme;
  transliterateToEnglish: boolean;
  islamicCalendarMode: IslamicCalendarMode;
  islamicDayAdjustment: IslamicDayAdjustment;
  useModifiedJulianDay: boolean;
  showChristianHolidays: boolean;
  showJewishHolidays: boolean;
  showIslamicHolidays: boolean;
}

const STORAGE_KEY = 'almaniac.settings.v1';

function systemColorScheme(): ColorScheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function defaultVisibility(): Record<CalendarId, boolean> {
  return DEFAULT_CALENDAR_ORDER.reduce(
    (acc, id) => {
      acc[id] = true;
      return acc;
    },
    {} as Record<CalendarId, boolean>,
  );
}

export function defaultAppSettings(): AppSettings {
  return {
    visibleCalendars: defaultVisibility(),
    calendarColors: {},
    colorTheme: 'distinct',
    colorScheme: systemColorScheme(),
    transliterateToEnglish: false,
    islamicCalendarMode: 'tabular',
    islamicDayAdjustment: 0,
    useModifiedJulianDay: false,
    showChristianHolidays: true,
    showJewishHolidays: true,
    showIslamicHolidays: true,
  };
}

export function loadAppSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return defaultAppSettings();
    }

    const parsed = JSON.parse(raw) as Partial<AppSettings>;
    const defaults = defaultAppSettings();

    return {
      visibleCalendars: { ...defaults.visibleCalendars, ...parsed.visibleCalendars },
      calendarColors: { ...defaults.calendarColors, ...parsed.calendarColors },
      colorTheme: parsed.colorTheme ?? defaults.colorTheme,
      colorScheme: parsed.colorScheme ?? defaults.colorScheme,
      transliterateToEnglish: parsed.transliterateToEnglish ?? defaults.transliterateToEnglish,
      islamicCalendarMode: parsed.islamicCalendarMode ?? defaults.islamicCalendarMode,
      islamicDayAdjustment: parsed.islamicDayAdjustment ?? defaults.islamicDayAdjustment,
      useModifiedJulianDay: parsed.useModifiedJulianDay ?? defaults.useModifiedJulianDay,
      showChristianHolidays: parsed.showChristianHolidays ?? defaults.showChristianHolidays,
      showJewishHolidays: parsed.showJewishHolidays ?? defaults.showJewishHolidays,
      showIslamicHolidays: parsed.showIslamicHolidays ?? defaults.showIslamicHolidays,
    };
  } catch {
    return defaultAppSettings();
  }
}

export function saveAppSettings(settings: AppSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function toggleCalendarVisibility(
  settings: AppSettings,
  id: CalendarId,
): AppSettings {
  return {
    ...settings,
    visibleCalendars: {
      ...settings.visibleCalendars,
      [id]: !settings.visibleCalendars[id],
    },
  };
}

export function setTransliterateToEnglish(
  settings: AppSettings,
  value: boolean,
): AppSettings {
  return { ...settings, transliterateToEnglish: value };
}

export function setIslamicCalendarMode(
  settings: AppSettings,
  value: IslamicCalendarMode,
): AppSettings {
  return { ...settings, islamicCalendarMode: value };
}

export function setIslamicDayAdjustment(
  settings: AppSettings,
  value: IslamicDayAdjustment,
): AppSettings {
  return { ...settings, islamicDayAdjustment: value };
}

export function setUseModifiedJulianDay(
  settings: AppSettings,
  value: boolean,
): AppSettings {
  return { ...settings, useModifiedJulianDay: value };
}

export function setShowChristianHolidays(settings: AppSettings, value: boolean): AppSettings {
  return { ...settings, showChristianHolidays: value };
}

export function setShowJewishHolidays(settings: AppSettings, value: boolean): AppSettings {
  return { ...settings, showJewishHolidays: value };
}

export function setShowIslamicHolidays(settings: AppSettings, value: boolean): AppSettings {
  return { ...settings, showIslamicHolidays: value };
}

export function setCalendarColor(
  settings: AppSettings,
  id: CalendarId,
  color: string,
): AppSettings {
  return {
    ...settings,
    calendarColors: {
      ...settings.calendarColors,
      [id]: color,
    },
  };
}

export function toggleColorScheme(settings: AppSettings): AppSettings {
  return {
    ...settings,
    colorScheme: settings.colorScheme === 'dark' ? 'light' : 'dark',
  };
}

export function setColorTheme(settings: AppSettings, value: ColorTheme): AppSettings {
  return { ...settings, colorTheme: value };
}
