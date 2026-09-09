import { describe, expect, it } from 'vitest';
import {
  displayJulianDay,
  formatJulianDayValue,
  isSameGregorianDay,
  julianDayForAnchor,
} from '../julianDayValue';
import { todayGregorianDate } from '../calendarRegistry';
import { toJulianDay } from 'calendar-converter/services';
import { DateTime } from 'luxon';

describe('julianDayValue', () => {
  it('shows sub-day precision when viewing today with a clock time', () => {
    const anchor = todayGregorianDate();
    const at = new Date(anchor.year, anchor.month - 1, anchor.day, 14, 30, 45);

    expect(isSameGregorianDay(anchor, anchor)).toBe(true);

    const jd = julianDayForAnchor(anchor, at);
    const noonOnly = julianDayForAnchor(anchor);

    expect(jd).toBeGreaterThan(noonOnly);
    expect(displayJulianDay(anchor, false, at)).toMatch(/\.\d{5}$/);
    expect(displayJulianDay(anchor, false)).toBe(String(noonOnly));
  });

  it('snaps Julian Day display to whole seconds', () => {
    const value = 2460000.5 + 45 / 86_400;
    expect(formatJulianDayValue(value, true)).toBe((2460000.5 + 45 / 86_400).toFixed(5));
  });

  it('adds local time to today anchor JD', () => {
    const anchor = todayGregorianDate();
    const at = new Date();
    const base = toJulianDay(anchor).value;
    const dt = DateTime.fromJSDate(at);
    const secs = Math.floor(dt.diff(dt.startOf('day'), 'seconds').seconds);
    const expected = base + secs / 86_400;

    expect(julianDayForAnchor(anchor, at)).toBeCloseTo(expected, 5);
    expect(displayJulianDay(anchor, false, at)).toMatch(/\.\d{5}$/);
    expect(displayJulianDay(anchor, false)).toBe(String(base));
  });
});
