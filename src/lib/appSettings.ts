import type { CalendarId } from './calendarRegistry';
import { DEFAULT_CALENDAR_ORDER } from './calendarRegistry';

export type IslamicDayAdjustment = -1 | 0 | 1;
export type IslamicCalendarMode = 'tabular' | 'ummAlQura';

export interface AppSettings {
  visibleCalendars: Record<CalendarId, boolean>;
  transliterateToEnglish: boolean;
  islamicCalendarMode: IslamicCalendarMode;
  islamicDayAdjustment: IslamicDayAdjustment;
  showChristianHolidays: boolean;
  showJewishHolidays: boolean;
  showIslamicHolidays: boolean;
}

const STORAGE_KEY = 'almanac.settings.v1';

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
    transliterateToEnglish: false,
    islamicCalendarMode: 'tabular',
    islamicDayAdjustment: 0,
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
      transliterateToEnglish: parsed.transliterateToEnglish ?? defaults.transliterateToEnglish,
      islamicCalendarMode: parsed.islamicCalendarMode ?? defaults.islamicCalendarMode,
      islamicDayAdjustment: parsed.islamicDayAdjustment ?? defaults.islamicDayAdjustment,
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

export function setShowChristianHolidays(settings: AppSettings, value: boolean): AppSettings {
  return { ...settings, showChristianHolidays: value };
}

export function setShowJewishHolidays(settings: AppSettings, value: boolean): AppSettings {
  return { ...settings, showJewishHolidays: value };
}

export function setShowIslamicHolidays(settings: AppSettings, value: boolean): AppSettings {
  return { ...settings, showIslamicHolidays: value };
}
