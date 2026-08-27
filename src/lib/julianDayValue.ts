import { DateTime } from 'luxon';
import { JulianDay, type GregorianCalendar } from 'calendar-converter/calendars';
import { toJulianDay } from 'calendar-converter/services';

const SECONDS_PER_DAY = 86_400;

export function isSameGregorianDay(
  a: GregorianCalendar,
  b: GregorianCalendar,
): boolean {
  return a.year === b.year && a.month === b.month && a.day === b.day;
}

function secondsIntoLocalDay(at: Date): number {
  const dateTime = DateTime.fromJSDate(at);
  const startOfDay = dateTime.startOf('day');
  return Math.floor(dateTime.diff(startOfDay, 'seconds').seconds);
}

export function julianDayForAnchor(anchor: GregorianCalendar, at?: Date): number {
  const baseJd = toJulianDay(anchor).value;
  if (!at) {
    return baseJd;
  }

  const dateTime = DateTime.fromJSDate(at);
  if (
    dateTime.year !== anchor.year ||
    dateTime.month !== anchor.month ||
    dateTime.day !== anchor.day
  ) {
    return baseJd;
  }

  return baseJd + secondsIntoLocalDay(at) / SECONDS_PER_DAY;
}

export function formatJulianDayValue(value: number, withSubDayPrecision: boolean): string {
  if (!withSubDayPrecision) {
    return String(value);
  }

  const snapped = Math.round(value * SECONDS_PER_DAY) / SECONDS_PER_DAY;
  return snapped.toFixed(5);
}

export function displayJulianDay(
  anchor: GregorianCalendar,
  useModifiedJulianDay: boolean,
  at?: Date,
): string {
  const jd = julianDayForAnchor(anchor, at);
  const displayValue = useModifiedJulianDay ? jd - JulianDay.Epoch.value : jd;
  return formatJulianDayValue(displayValue, Boolean(at));
}
