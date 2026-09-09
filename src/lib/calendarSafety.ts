import type { CalendarId } from './calendarRegistry';
import type { GregorianCalendar } from 'calendar-converter/calendars';

/** Earliest Gregorian date supported by the modern Japanese Wareki era table. */
export const JAPANESE_WAREKI_EPOCH = {
  year: 1868,
  month: 9,
  day: 8,
} as const;

/** Historical start of the Gregorian calendar (not proleptic). */
export const GREGORIAN_HISTORICAL_EPOCH = {
  year: 1582,
  month: 10,
  day: 15,
} as const;

/** Historical start of the French Republican calendar (Year I). */
export const FRENCH_REPUBLICAN_EPOCH = {
  year: 1792,
  month: 9,
  day: 22,
} as const;

export type CalendarUnavailableReason =
  | 'japaneseBeforeMeiji'
  | 'frcBeforeEpoch'
  | 'conversionFailed';

export function compareGregorianYmd(
  left: Pick<GregorianCalendar, 'year' | 'month' | 'day'>,
  right: Pick<GregorianCalendar, 'year' | 'month' | 'day'>,
): number {
  if (left.year !== right.year) {
    return left.year < right.year ? -1 : 1;
  }
  if (left.month !== right.month) {
    return left.month < right.month ? -1 : 1;
  }
  if (left.day !== right.day) {
    return left.day < right.day ? -1 : 1;
  }
  return 0;
}

export function isBeforeJapaneseWarekiEpoch(anchor: GregorianCalendar): boolean {
  return compareGregorianYmd(anchor, JAPANESE_WAREKI_EPOCH) < 0;
}

export function isBeforeGregorianHistoricalEpoch(anchor: GregorianCalendar): boolean {
  return compareGregorianYmd(anchor, GREGORIAN_HISTORICAL_EPOCH) < 0;
}

export function isBeforeFrenchRepublicanEpoch(anchor: GregorianCalendar): boolean {
  return compareGregorianYmd(anchor, FRENCH_REPUBLICAN_EPOCH) < 0;
}

export function getCalendarUnavailableReason(
  id: CalendarId,
  anchor: GregorianCalendar,
): CalendarUnavailableReason | null {
  if (id === 'japanese' && isBeforeJapaneseWarekiEpoch(anchor)) {
    return 'japaneseBeforeMeiji';
  }
  if (id === 'frc' && isBeforeFrenchRepublicanEpoch(anchor)) {
    return 'frcBeforeEpoch';
  }
  return null;
}

export function isCalendarDateSupported(id: CalendarId, anchor: GregorianCalendar): boolean {
  return getCalendarUnavailableReason(id, anchor) === null;
}
