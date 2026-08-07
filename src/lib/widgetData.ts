import type { AppSettings } from './appSettings';
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

export interface WidgetCalendarSnapshot {
  label: string;
  calendarName: string;
  weekday: string;
  date: string;
  dateTransliterated: string;
  backgroundColor: string;
  textColor: string;
}

export interface WidgetSnapshot {
  version: 1;
  gregorianDate: string;
  updatedAt: string;
  calendars: Record<CalendarId, WidgetCalendarSnapshot>;
}

function formatGregorianDate(anchor: GregorianCalendar): string {
  const year = anchor.year;
  const month = String(anchor.month).padStart(2, '0');
  const day = String(anchor.day).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function buildWidgetSnapshot(
  anchor: GregorianCalendar,
  settings: AppSettings,
): WidgetSnapshot {
  const colorContext = calendarColorContext(settings);
  const nativeEntries = getAllCalendarEntries(DEFAULT_CALENDAR_ORDER, anchor, {
    ...settings,
    transliterateToEnglish: false,
  });
  const transliteratedEntries = getAllCalendarEntries(DEFAULT_CALENDAR_ORDER, anchor, {
    ...settings,
    transliterateToEnglish: true,
  });
  const transliteratedById = new Map(
    transliteratedEntries.map((entry) => [entry.id, entry.date] as const),
  );

  const calendars = nativeEntries.reduce(
    (acc, entry) => {
      const backgroundColor = getCalendarColor(entry.id, colorContext);
      acc[entry.id] = {
        label: entry.label,
        calendarName: entry.calendarName,
        weekday: entry.weekday,
        date: entry.date,
        dateTransliterated: transliteratedById.get(entry.id) ?? entry.date,
        backgroundColor,
        textColor: getWidgetTextColor(backgroundColor, colorContext),
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
  const anchor = todayGregorianDate();
  const snapshot = buildWidgetSnapshot(anchor, settings);

  try {
    await WidgetBridge.syncSnapshot({ snapshot: JSON.stringify(snapshot) });
  } catch {
    // Widget bridge is only available on native builds.
  }
}
