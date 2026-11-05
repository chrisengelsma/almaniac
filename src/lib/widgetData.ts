import { getResolvedAppLanguage, type AppSettings, type ColorScheme } from './appSettings';
import {
  DEFAULT_CALENDAR_ORDER,
  getAllCalendarEntries,
  shiftGregorianDate,
  todayGregorianDate,
  type CalendarId,
  type GregorianCalendar,
} from './calendarRegistry';
import {
  calendarColorContext,
  getCalendarAccentColor,
  getCalendarColor,
  getWidgetTextColor,
} from '../theme/calendarColors';
import { COLOR_THEME_IDS, getThemeBehavior, type ColorThemeId } from '../theme/themePalette';
import { WidgetBridge } from '../plugins/widgetBridge';
import i18n from '../i18n';
import { createCalendarCopy } from '../i18n/calendarCopy';
import {
  calendarHasWidgetOptions,
  widgetOptionCombinations,
  widgetVariantKey,
  type WidgetDateVariant,
} from './widgetCalendarOptions';

export interface WidgetThemeColors {
  backgroundColor: string;
  textColor: string;
}

export interface WidgetThemeVariants {
  light: WidgetThemeColors;
  dark: WidgetThemeColors;
}

export interface WidgetDailySnapshot {
  weekday: string;
  date: string;
  dateTransliterated: string;
  variants?: Record<string, WidgetDateVariant>;
}

export interface WidgetCalendarSnapshot {
  label: string;
  calendarName: string;
  weekday: string;
  date: string;
  dateTransliterated: string;
  variants?: Record<string, WidgetDateVariant>;
  daily?: Record<string, WidgetDailySnapshot>;
  themes: Record<ColorThemeId, WidgetThemeVariants>;
}

/** Days of precomputed dates stored for widget timelines (iOS + Android). */
export const WIDGET_TIMELINE_DAY_COUNT = 45;

export interface WidgetSnapshot {
  version: 1;
  gregorianDate: string;
  updatedAt: string;
  calendars: Record<CalendarId, WidgetCalendarSnapshot>;
}

const COLOR_THEMES = COLOR_THEME_IDS;
const COLOR_SCHEMES: ColorScheme[] = ['light', 'dark'];

function formatGregorianDate(anchor: GregorianCalendar): string {
  const year = anchor.year;
  const month = String(anchor.month).padStart(2, '0');
  const day = String(anchor.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function instantForAnchor(
  anchor: GregorianCalendar,
  isToday: boolean,
  referenceAt: Date,
): Date {
  if (isToday) {
    return referenceAt;
  }
  return new Date(anchor.year, anchor.month - 1, anchor.day, 12, 0, 0);
}

function buildCalendarDailyMap(
  id: CalendarId,
  startAnchor: GregorianCalendar,
  settings: AppSettings,
  copy: ReturnType<typeof createCalendarCopy>,
  referenceAt: Date,
): Record<string, WidgetDailySnapshot> {
  const daily: Record<string, WidgetDailySnapshot> = {};
  const todayKey = formatGregorianDate(startAnchor);

  for (let offset = 0; offset < WIDGET_TIMELINE_DAY_COUNT; offset += 1) {
    const anchor = shiftGregorianDate(startAnchor, offset);
    const key = formatGregorianDate(anchor);
    const isToday = key === todayKey;
    const at = instantForAnchor(anchor, isToday, referenceAt);
    const nativeSettings = { ...settings, transliterateToEnglish: false };
    const transliteratedSettings = { ...settings, transliterateToEnglish: true };
    const [nativeEntry] = getAllCalendarEntries([id], anchor, nativeSettings, copy, at);
    const [transliteratedEntry] = getAllCalendarEntries(
      [id],
      anchor,
      transliteratedSettings,
      copy,
      at,
    );
    if (!nativeEntry) {
      continue;
    }

    daily[key] = {
      weekday: nativeEntry.weekday,
      date: nativeEntry.date,
      dateTransliterated: transliteratedEntry?.date ?? nativeEntry.date,
      variants: buildCalendarDateVariants(id, anchor, settings, copy, at),
    };
  }

  return daily;
}

function buildThemeVariants(
  id: CalendarId,
  settings: AppSettings,
): Record<ColorThemeId, WidgetThemeVariants> {
  return COLOR_THEMES.reduce(
    (themes, colorTheme) => {
      const variants = COLOR_SCHEMES.reduce(
        (acc, colorScheme) => {
          const context = calendarColorContext({ ...settings, colorTheme, colorScheme });
          const orderIndex = DEFAULT_CALENDAR_ORDER.indexOf(id);
          const accentColor = getCalendarAccentColor(id, context);
          const backgroundColor = getCalendarColor(
            id,
            context,
            getThemeBehavior(colorTheme) === 'supporter'
              ? { index: orderIndex, total: DEFAULT_CALENDAR_ORDER.length }
              : undefined,
          );
          acc[colorScheme] = {
            backgroundColor,
            textColor: getWidgetTextColor(backgroundColor, context, accentColor),
          };
          return acc;
        },
        {} as WidgetThemeVariants,
      );

      themes[colorTheme] = variants;
      return themes;
    },
    {} as Record<ColorThemeId, WidgetThemeVariants>,
  );
}

function buildCalendarDateVariants(
  id: CalendarId,
  anchor: GregorianCalendar,
  settings: AppSettings,
  copy: ReturnType<typeof createCalendarCopy>,
  at: Date | undefined,
): Record<string, WidgetDateVariant> | undefined {
  if (!calendarHasWidgetOptions(id)) {
    return undefined;
  }

  const variants = widgetOptionCombinations(id).reduce(
    (acc, overrides) => {
      const nativeSettings = { ...settings, ...overrides, transliterateToEnglish: false };
      const transliteratedSettings = { ...settings, ...overrides, transliterateToEnglish: true };
      const [nativeEntry] = getAllCalendarEntries([id], anchor, nativeSettings, copy, at);
      const [transliteratedEntry] = getAllCalendarEntries([id], anchor, transliteratedSettings, copy, at);
      if (!nativeEntry) {
        return acc;
      }

      const key = widgetVariantKey(id, { ...settings, ...overrides });
      acc[key] = {
        label: nativeEntry.label,
        calendarName: nativeEntry.calendarName,
        weekday: nativeEntry.weekday,
        date: nativeEntry.date,
        dateTransliterated: transliteratedEntry?.date ?? nativeEntry.date,
      };
      return acc;
    },
    {} as Record<string, WidgetDateVariant>,
  );

  return Object.keys(variants).length > 0 ? variants : undefined;
}

export function buildWidgetSnapshot(
  anchor: GregorianCalendar,
  settings: AppSettings,
  at: Date = new Date(),
): WidgetSnapshot {
  const copy = createCalendarCopy(i18n.getFixedT(getResolvedAppLanguage(settings)));
  const nativeEntries = getAllCalendarEntries(DEFAULT_CALENDAR_ORDER, anchor, {
    ...settings,
    transliterateToEnglish: false,
  }, copy, at);
  const transliteratedEntries = getAllCalendarEntries(DEFAULT_CALENDAR_ORDER, anchor, {
    ...settings,
    transliterateToEnglish: true,
  }, copy, at);
  const transliteratedById = new Map(
    transliteratedEntries.map((entry) => [entry.id, entry.date] as const),
  );

  const calendars = nativeEntries.reduce(
    (acc, entry) => {
      acc[entry.id] = {
        label: entry.label,
        calendarName: entry.calendarName,
        weekday: entry.weekday,
        date: entry.date,
        dateTransliterated: transliteratedById.get(entry.id) ?? entry.date,
        variants: buildCalendarDateVariants(entry.id, anchor, settings, copy, at),
        daily: buildCalendarDailyMap(entry.id, anchor, settings, copy, at),
        themes: buildThemeVariants(entry.id, settings),
      };
      return acc;
    },
    {} as Record<CalendarId, WidgetCalendarSnapshot>,
  );

  return {
    version: 1,
    gregorianDate: formatGregorianDate(anchor),
    updatedAt: new Date().toISOString(),
    calendars,
  };
}

export async function syncWidgetData(settings: AppSettings): Promise<void> {
  try {
    const anchor = todayGregorianDate();
    const snapshot = buildWidgetSnapshot(anchor, settings, new Date());
    await WidgetBridge.syncSnapshot({ snapshot: JSON.stringify(snapshot) });
  } catch {
    // Widget sync is best-effort and may run before the native bridge is ready.
  }
}
