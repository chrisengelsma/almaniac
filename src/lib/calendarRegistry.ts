import {
  type Calendar,
  ChineseCalendar,
  FrenchRepublicanCalendar,
  GregorianCalendar,
  HebrewCalendar,
  IndianCivilCalendar,
  IslamicCalendar,
  JulianCalendar,
  MayaCalendar,
  PersianCalendar,
  SovietCalendar,
} from 'calendar-converter/calendars';
import { toJulianDay } from 'calendar-converter/services';
import type { MayaLongCountParts } from '../components/MayaLongCount';
import type { AppSettings } from './appSettings';
import {
  formatChineseEnglish,
  formatChineseNative,
  formatHebrewEnglish,
  formatHebrewNative,
  formatIndianCivilEnglish,
  formatIndianCivilNative,
  formatIslamicEnglish,
  formatIslamicNative,
  formatPersianEnglish,
  formatPersianNative,
  formatSovietEnglish,
  formatSovietNative,
  nativeWeekday,
  scriptFontForCalendar,
  type ScriptFont,
} from './nativeCalendarText';
import { CALENDAR_NAMES } from '../theme/calendarTheme';

export type CalendarId =
  | 'gregorian'
  | 'julian'
  | 'chinese'
  | 'soviet'
  | 'frc'
  | 'maya'
  | 'islamic'
  | 'hebrew'
  | 'persian'
  | 'indianCivil'
  | 'julianDay';

export interface CalendarEntry {
  id: CalendarId;
  label: string;
  calendarName: string;
  weekday: string;
  date: string;
  scriptFont: ScriptFont;
  mayaLongCount?: MayaLongCountParts;
}

export const DEFAULT_CALENDAR_ORDER: CalendarId[] = [
  'gregorian',
  'julian',
  'chinese',
  'soviet',
  'frc',
  'maya',
  'islamic',
  'hebrew',
  'persian',
  'indianCivil',
  'julianDay',
];

const CALENDAR_LABELS: Record<CalendarId, string> = {
  gregorian: 'Gregorian',
  julian: 'Julian',
  chinese: 'Chinese',
  soviet: 'Soviet',
  frc: 'FRC',
  maya: 'Maya',
  islamic: 'Islamic',
  hebrew: 'Hebrew',
  persian: 'Persian',
  indianCivil: 'Indian Civil',
  julianDay: 'Julian Day',
};

function getWeekday(calendar: Calendar, anchor: GregorianCalendar): string {
  if ('getWeekDay' in calendar && typeof calendar.getWeekDay === 'function') {
    return calendar.getWeekDay();
  }
  return new GregorianCalendar(anchor).getWeekDay();
}

function buildCalendar(id: CalendarId, anchor: GregorianCalendar): Calendar {
  switch (id) {
    case 'gregorian':
      return new GregorianCalendar(anchor);
    case 'julian':
      return new JulianCalendar(anchor);
    case 'chinese':
      return new ChineseCalendar(anchor);
    case 'soviet':
      return new SovietCalendar(anchor);
    case 'frc':
      return new FrenchRepublicanCalendar(anchor);
    case 'maya':
      return new MayaCalendar(anchor);
    case 'islamic':
      return new IslamicCalendar(anchor);
    case 'hebrew':
      return new HebrewCalendar(anchor);
    case 'persian':
      return new PersianCalendar(anchor);
    case 'indianCivil':
      return new IndianCivilCalendar(anchor);
    case 'julianDay':
      return toJulianDay(anchor);
    default:
      return new GregorianCalendar(anchor);
  }
}

function applyIslamicAdjustment(calendar: IslamicCalendar, adjustment: number): IslamicCalendar {
  if (adjustment === 0) {
    return calendar;
  }

  const adjusted = new IslamicCalendar(calendar.year, calendar.month, calendar.day);
  if (adjustment > 0) {
    adjusted.addDays(adjustment);
  } else {
    adjusted.subtractDays(-adjustment);
  }
  return adjusted;
}

function formatDate(
  id: CalendarId,
  calendar: Calendar,
  transliterateToEnglish: boolean,
): string {
  if (transliterateToEnglish) {
    switch (id) {
      case 'islamic':
        return formatIslamicEnglish(calendar as IslamicCalendar);
      case 'persian':
        return formatPersianEnglish(calendar as PersianCalendar);
      case 'hebrew':
        return formatHebrewEnglish(calendar as HebrewCalendar);
      case 'indianCivil':
        return formatIndianCivilEnglish(calendar as IndianCivilCalendar);
      case 'chinese':
        return formatChineseEnglish(calendar as ChineseCalendar);
      case 'soviet':
        return formatSovietEnglish(calendar as SovietCalendar);
      default:
        return calendar.getDate();
    }
  }

  switch (id) {
    case 'islamic':
      return formatIslamicNative(calendar as IslamicCalendar);
    case 'persian':
      return formatPersianNative(calendar as PersianCalendar);
    case 'hebrew':
      return formatHebrewNative(calendar as HebrewCalendar);
    case 'indianCivil':
      return formatIndianCivilNative(calendar as IndianCivilCalendar);
    case 'chinese':
      return formatChineseNative(calendar as ChineseCalendar);
    case 'soviet':
      return formatSovietNative(calendar as SovietCalendar);
    default:
      return calendar.getDate();
  }
}

function buildCalendarEntry(
  id: CalendarId,
  anchor: GregorianCalendar,
  settings: AppSettings,
): CalendarEntry {
  let calendar = buildCalendar(id, anchor);

  if (id === 'islamic') {
    calendar = applyIslamicAdjustment(
      calendar as IslamicCalendar,
      settings.islamicDayAdjustment,
    );
  }

  const weekdayIndex = calendar.getWeekDayNumber();
  const nativeDay = nativeWeekday(id, weekdayIndex, settings.transliterateToEnglish);
  const weekday = nativeDay ?? getWeekday(calendar, anchor);

  const entry: CalendarEntry = {
    id,
    label: CALENDAR_LABELS[id],
    calendarName: CALENDAR_NAMES[id],
    weekday,
    date: formatDate(id, calendar, settings.transliterateToEnglish),
    scriptFont: scriptFontForCalendar(id, settings.transliterateToEnglish),
  };

  if (id === 'maya' && !settings.transliterateToEnglish) {
    const maya = calendar as MayaCalendar;
    entry.mayaLongCount = [maya.baktun, maya.katun, maya.tun, maya.uinal, maya.kin];
  }

  return entry;
}

export interface CalendarRowData {
  entry: CalendarEntry;
  visible: boolean;
}

export function getOrderedCalendarRows(
  order: CalendarId[],
  anchor: GregorianCalendar,
  settings: AppSettings,
): CalendarRowData[] {
  return order.map((id) => ({
    entry: buildCalendarEntry(id, anchor, settings),
    visible: settings.visibleCalendars[id],
  }));
}

export function getCalendarEntries(
  order: CalendarId[],
  anchor: GregorianCalendar,
  settings: AppSettings,
): CalendarEntry[] {
  return getOrderedCalendarRows(order, anchor, settings)
    .filter((row) => row.visible)
    .map((row) => row.entry);
}

export function getAllCalendarEntries(
  order: CalendarId[],
  anchor: GregorianCalendar,
  settings: AppSettings,
): CalendarEntry[] {
  return order.map((id) => buildCalendarEntry(id, anchor, settings));
}

export function shiftGregorianDate(
  anchor: GregorianCalendar,
  deltaDays: number,
): GregorianCalendar {
  const next = new GregorianCalendar(anchor);
  if (deltaDays > 0) {
    next.addDays(deltaDays);
  } else if (deltaDays < 0) {
    next.subtractDays(-deltaDays);
  }
  return next;
}

export function todayGregorianDate(): GregorianCalendar {
  return new GregorianCalendar();
}

export function reorderCalendars(
  order: CalendarId[],
  reorderedVisible: CalendarId[],
): CalendarId[] {
  const visibleSet = new Set(reorderedVisible);
  let visibleIndex = 0;

  return order.map((id) => {
    if (visibleSet.has(id)) {
      return reorderedVisible[visibleIndex++] ?? id;
    }
    return id;
  });
}

export type { GregorianCalendar };
