import { GREGORIAN_ADOPTION_YEARS } from './gregorianAdoption';

/** Countries where Julian remains in liturgical use (no end date on the timeline). */
const LITURGICAL_JULIAN = new Set([
  'BG', 'BY', 'ET', 'GE', 'GR', 'MD', 'ME', 'MK', 'RS', 'RU', 'UA',
]);

/** Approximate year the Julian calendar began in each region (astronomical: 45 BCE = -44). */
const JULIAN_START_OVERRIDES: Record<string, number> = {
  BG: 864,
  BY: 988,
  ET: 326,
  RU: 988,
  UA: 988,
};

export interface JulianUsagePeriod {
  start: number;
  end?: number;
}

export const JULIAN_USAGE: Record<string, JulianUsagePeriod> = {};

for (const [code, gregorianYear] of Object.entries(GREGORIAN_ADOPTION_YEARS)) {
  JULIAN_USAGE[code] = {
    start: JULIAN_START_OVERRIDES[code] ?? -44,
    end: LITURGICAL_JULIAN.has(code) ? undefined : gregorianYear,
  };
}

for (const code of LITURGICAL_JULIAN) {
  if (!JULIAN_USAGE[code]) {
    JULIAN_USAGE[code] = {
      start: JULIAN_START_OVERRIDES[code] ?? 900,
    };
  }
}

export const JULIAN_TIMELINE_START = -44;
export const JULIAN_TIMELINE_END = 2026;

/** Sorted years in which at least one region adopted or stopped using the Julian calendar. */
export const JULIAN_TIMELINE_EVENT_YEARS = [
  ...new Set(
    Object.values(JULIAN_USAGE).flatMap((period) =>
      period.end === undefined ? [period.start] : [period.start, period.end],
    ),
  ),
].sort((a, b) => a - b);

function isJulianActiveAtYear(code: string, year: number): boolean {
  const period = JULIAN_USAGE[code];
  if (!period) {
    return false;
  }

  if (period.start > year) {
    return false;
  }

  if (period.end !== undefined && period.end <= year) {
    return false;
  }

  return true;
}

export function getJulianUsersAtYear(year: number): string[] {
  return Object.keys(JULIAN_USAGE).filter((code) => isJulianActiveAtYear(code, year));
}

export function getJulianStartsInYear(year: number): string[] {
  return Object.entries(JULIAN_USAGE)
    .filter(([, period]) => period.start === year)
    .map(([id]) => id);
}

export function getJulianStopsInYear(year: number): string[] {
  return Object.entries(JULIAN_USAGE)
    .filter(([, period]) => period.end === year)
    .map(([id]) => id);
}
