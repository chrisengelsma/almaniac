import {
  DEFAULT_CALENDAR_ORDER,
  todayGregorianDate,
  type CalendarId,
  type GregorianCalendar,
} from './calendarRegistry';
import { GregorianCalendar as GregorianCalendarClass } from 'calendar-converter/calendars';
import type { CalendarColorMap } from '../theme/calendarColors';

export type IslamicDayAdjustment = -1 | 0 | 1;
export type IslamicCalendarMode = 'tabular' | 'ummAlQura';
export type ColorScheme = 'light' | 'dark';
export type ColorTheme = 'distinct' | 'mono' | 'sepia';
export type AppIconChoice = 'light' | 'dark';

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
  appIcon: AppIconChoice;
}

const STORAGE_KEY = 'almaniac.settings.v1';

export interface AnchorDateParts {
  year: number;
  month: number;
  day: number;
}

export interface PersistedAppState {
  settings: AppSettings;
  calendarOrder: CalendarId[];
  anchorDate: AnchorDateParts;
}

interface LegacyStoredSettings extends Partial<AppSettings> {
  visibleCalendars?: Record<CalendarId, boolean>;
}

function systemColorScheme(): ColorScheme {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const DEFAULT_VISIBLE_CALENDARS = new Set<CalendarId>([
  'gregorian',
  'julian',
  'islamic',
  'hebrew',
]);

function defaultVisibility(): Record<CalendarId, boolean> {
  return DEFAULT_CALENDAR_ORDER.reduce(
    (acc, id) => {
      acc[id] = DEFAULT_VISIBLE_CALENDARS.has(id);
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
    appIcon: 'light',
  };
}


export function loadAppSettings(): AppSettings {
  return loadPersistedAppState().settings;
}

function loadAppSettingsFromPartial(parsed: Partial<AppSettings>): AppSettings {
  const defaults = defaultAppSettings();

  return {
    visibleCalendars: { ...defaults.visibleCalendars, ...parsed.visibleCalendars },
    calendarColors: { ...defaults.calendarColors, ...parsed.calendarColors },
    colorTheme:
      parsed.colorTheme === 'distinct' ||
      parsed.colorTheme === 'mono' ||
      parsed.colorTheme === 'sepia'
        ? parsed.colorTheme
        : defaults.colorTheme,
    colorScheme: parsed.colorScheme ?? defaults.colorScheme,
    transliterateToEnglish: parsed.transliterateToEnglish ?? defaults.transliterateToEnglish,
    islamicCalendarMode: parsed.islamicCalendarMode ?? defaults.islamicCalendarMode,
    islamicDayAdjustment: parsed.islamicDayAdjustment ?? defaults.islamicDayAdjustment,
    useModifiedJulianDay: parsed.useModifiedJulianDay ?? defaults.useModifiedJulianDay,
    showChristianHolidays: parsed.showChristianHolidays ?? defaults.showChristianHolidays,
    showJewishHolidays: parsed.showJewishHolidays ?? defaults.showJewishHolidays,
    showIslamicHolidays: parsed.showIslamicHolidays ?? defaults.showIslamicHolidays,
    appIcon:
      parsed.appIcon === 'light' || parsed.appIcon === 'dark' ? parsed.appIcon : defaults.appIcon,
  };
}

function anchorDateFromGregorian(anchor: GregorianCalendar): AnchorDateParts {
  return {
    year: anchor.year,
    month: anchor.month,
    day: anchor.day,
  };
}

function anchorDateToGregorian(parts: AnchorDateParts | undefined): GregorianCalendar {
  if (
    !parts ||
    !Number.isFinite(parts.year) ||
    !Number.isFinite(parts.month) ||
    !Number.isFinite(parts.day) ||
    parts.month < 1 ||
    parts.month > 12 ||
    parts.day < 1 ||
    parts.day > 31
  ) {
    return todayGregorianDate();
  }

  return new GregorianCalendarClass(parts.year, parts.month, parts.day);
}

function normalizeCalendarOrder(order: CalendarId[] | undefined): CalendarId[] {
  if (!order?.length) {
    return [...DEFAULT_CALENDAR_ORDER];
  }

  const known = new Set(DEFAULT_CALENDAR_ORDER);
  const normalized: CalendarId[] = [];

  for (const id of order) {
    if (known.has(id) && !normalized.includes(id)) {
      normalized.push(id);
    }
  }

  for (const id of DEFAULT_CALENDAR_ORDER) {
    if (!normalized.includes(id)) {
      normalized.push(id);
    }
  }

  return normalized;
}

function isPersistedAppState(value: unknown): value is PersistedAppState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'settings' in value &&
    'calendarOrder' in value &&
    'anchorDate' in value
  );
}

function isLegacyStoredSettings(value: unknown): value is LegacyStoredSettings {
  return typeof value === 'object' && value !== null && 'visibleCalendars' in value;
}

export function loadPersistedAppState(): PersistedAppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const settings = defaultAppSettings();
      return {
        settings,
        calendarOrder: [...DEFAULT_CALENDAR_ORDER],
        anchorDate: anchorDateFromGregorian(todayGregorianDate()),
      };
    }

    const parsed = JSON.parse(raw) as unknown;

    if (isPersistedAppState(parsed)) {
      return {
        settings: loadAppSettingsFromPartial(parsed.settings),
        calendarOrder: normalizeCalendarOrder(parsed.calendarOrder),
        anchorDate: parsed.anchorDate,
      };
    }

    if (isLegacyStoredSettings(parsed)) {
      const settings = loadAppSettingsFromPartial(parsed);
      return {
        settings,
        calendarOrder: [...DEFAULT_CALENDAR_ORDER],
        anchorDate: anchorDateFromGregorian(todayGregorianDate()),
      };
    }
  } catch {
    // Fall through to defaults.
  }

  const settings = defaultAppSettings();
  return {
    settings,
    calendarOrder: [...DEFAULT_CALENDAR_ORDER],
    anchorDate: anchorDateFromGregorian(todayGregorianDate()),
  };
}

export function saveAppSettings(settings: AppSettings): void {
  const current = loadPersistedAppState();
  savePersistedAppState({
    ...current,
    settings,
  });
}

export function savePersistedAppState(state: PersistedAppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function createPersistedAppState(
  settings: AppSettings,
  calendarOrder: CalendarId[],
  anchor: GregorianCalendar,
): PersistedAppState {
  return {
    settings,
    calendarOrder: normalizeCalendarOrder(calendarOrder),
    anchorDate: anchorDateFromGregorian(anchor),
  };
}

export function anchorFromPersistedState(state: PersistedAppState): GregorianCalendar {
  return anchorDateToGregorian(state.anchorDate);
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

export function setAppIcon(settings: AppSettings, value: AppIconChoice): AppSettings {
  return { ...settings, appIcon: value };
}
