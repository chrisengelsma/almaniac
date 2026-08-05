import { GregorianCalendar } from 'calendar-converter/calendars';

export type GregorianEra = 'CE' | 'BCE';

/** Astronomical year (no year 0) → display parts. */
export function astronomicalToDisplay(year: number): { year: number; era: GregorianEra } {
  if (year <= 0) {
    return { year: 1 - year, era: 'BCE' };
  }
  return { year, era: 'CE' };
}

/** User-facing year + era → astronomical year used by calendar-converter. */
export function displayToAstronomical(displayYear: number, era: GregorianEra): number {
  if (era === 'BCE') {
    return 1 - displayYear;
  }
  return displayYear;
}

export function formatGregorianAnchorDate(calendar: GregorianCalendar): string {
  const { year, era } = astronomicalToDisplay(calendar.year);
  const month = GregorianCalendar.MonthName(calendar.month);
  const eraSuffix = era === 'BCE' ? ' BCE' : '';
  return `${month} ${calendar.day}, ${year}${eraSuffix}`;
}

export function formatGregorianAnchorShort(calendar: GregorianCalendar): string {
  const { year, era } = astronomicalToDisplay(calendar.year);
  const eraSuffix = era === 'BCE' ? ' BCE' : '';
  return `${calendar.month}/${calendar.day}/${year}${eraSuffix}`;
}

export function isValidGregorianDate(year: number, month: number, day: number): boolean {
  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return false;
  }
  if (month < 1 || month > 12 || day < 1) {
    return false;
  }
  return day <= GregorianCalendar.NumberOfDaysInMonth(year, month);
}

export function createGregorianDate(
  displayYear: number,
  era: GregorianEra,
  month: number,
  day: number,
): GregorianCalendar | null {
  const astronomicalYear = displayToAstronomical(displayYear, era);
  if (!isValidGregorianDate(astronomicalYear, month, day)) {
    return null;
  }
  return new GregorianCalendar(astronomicalYear, month, day);
}

export function daysInGregorianMonth(displayYear: number, era: GregorianEra, month: number): number {
  const astronomicalYear = displayToAstronomical(displayYear, era);
  return GregorianCalendar.NumberOfDaysInMonth(astronomicalYear, month);
}
