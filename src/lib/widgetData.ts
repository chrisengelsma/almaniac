import { getResolvedAppLanguage, type AppSettings, type ColorScheme, type ColorTheme } from './appSettings';
import {
  DEFAULT_CALENDAR_ORDER,
  getAllCalendarEntries,
  todayGregorianDate,
  type CalendarId,
  type GregorianCalendar,
} from './calendarRegistry';
import {
  calendarColorContext,
  getCalendarColor,
  getWidgetTextColor,
} from '../theme/calendarColors';
import { WidgetBridge } from '../plugins/widgetBridge';
import i18n from '../i18n';
import { createCalendarCopy } from '../i18n/calendarCopy';

export interface WidgetThemeColors {
  backgroundColor: string;
  textColor: string;
}

export interface WidgetThemeVariants {
  light: WidgetThemeColors;
  dark: WidgetThemeColors;
}

export interface WidgetCalendarSnapshot {
  label: string;
  calendarName: string;
  weekday: string;
  date: string;
  dateTransliterated: string;
  themes: Record<ColorTheme, WidgetThemeVariants>;
}

export interface WidgetSnapshot {
  version: 1;
  gregorianDate: string;
  updatedAt: string;
  calendars: Record<CalendarId, WidgetCalendarSnapshot>;
}

const COLOR_THEMES: ColorTheme[] = ['distinct', 'mono', 'sepia', 'supporter'];
const COLOR_SCHEMES: ColorScheme[] = ['light', 'dark'];

function formatGregorianDate(anchor: GregorianCalendar): string {
  const year = anchor.year;
  const month = String(anchor.month).padStart(2, '0');
  const day = String(anchor.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function buildThemeVariants(
  id: CalendarId,
  settings: AppSettings,
): Record<ColorTheme, WidgetThemeVariants> {
  return COLOR_THEMES.reduce(
    (themes, colorTheme) => {
      const variants = COLOR_SCHEMES.reduce(
        (acc, colorScheme) => {
          const context = calendarColorContext({ ...settings, colorTheme, colorScheme });
          const orderIndex = DEFAULT_CALENDAR_ORDER.indexOf(id);
          const backgroundColor = getCalendarColor(
            id,
            context,
            colorTheme === 'supporter'
              ? { index: orderIndex, total: DEFAULT_CALENDAR_ORDER.length }
              : undefined,
          );
          acc[colorScheme] = {
            backgroundColor,
            textColor: getWidgetTextColor(backgroundColor, context),
          };
          return acc;
        },
        {} as WidgetThemeVariants,
      );

      themes[colorTheme] = variants;
      return themes;
    },
    {} as Record<ColorTheme, WidgetThemeVariants>,
  );
}

export function buildWidgetSnapshot(
  anchor: GregorianCalendar,
  settings: AppSettings,
): WidgetSnapshot {
  const copy = createCalendarCopy(i18n.getFixedT(getResolvedAppLanguage(settings)));
  const nativeEntries = getAllCalendarEntries(DEFAULT_CALENDAR_ORDER, anchor, {
    ...settings,
    transliterateToEnglish: false,
  }, copy);
  const transliteratedEntries = getAllCalendarEntries(DEFAULT_CALENDAR_ORDER, anchor, {
    ...settings,
    transliterateToEnglish: true,
  }, copy);
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
    const snapshot = buildWidgetSnapshot(anchor, settings);
    await WidgetBridge.syncSnapshot({ snapshot: JSON.stringify(snapshot) });
  } catch {
    // Widget sync is best-effort and may run before the native bridge is ready.
  }
}
