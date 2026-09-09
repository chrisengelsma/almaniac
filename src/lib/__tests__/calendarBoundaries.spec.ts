import { describe, expect, it, vi } from 'vitest';
import { GregorianCalendar } from 'calendar-converter/calendars';
import {
  ALL_CALENDAR_IDS,
  TEST_CALENDAR_COPY,
  testSettings,
} from './testFixtures';
import { getAllCalendarEntries, todayGregorianDate } from '../calendarRegistry';
import { extractPickerValues } from '../datePickerConfig';
import { isBeforeGregorianHistoricalEpoch, isBeforeJapaneseWarekiEpoch } from '../calendarSafety';
import { displayJulianDay } from '../julianDayValue';

const BOUNDARY_DATES: GregorianCalendar[] = [
  new GregorianCalendar(-100, 1, 1),
  new GregorianCalendar(1582, 10, 4),
  new GregorianCalendar(1582, 10, 15),
  new GregorianCalendar(1868, 9, 7),
  new GregorianCalendar(1868, 9, 8),
  new GregorianCalendar(1868, 10, 1),
  new GregorianCalendar(1911, 12, 31),
  new GregorianCalendar(1912, 1, 1),
];

describe('calendar boundary dates', () => {
  for (const anchor of BOUNDARY_DATES) {
    it(`renders all calendars without throwing for ${anchor.year}-${anchor.month}-${anchor.day}`, () => {
      const settings = testSettings();
      const entries = getAllCalendarEntries(ALL_CALENDAR_IDS, anchor, settings, TEST_CALENDAR_COPY);

      expect(entries).toHaveLength(ALL_CALENDAR_IDS.length);
      for (const entry of entries) {
        expect(entry.date.length).toBeGreaterThan(0);
      }
    });

    it(`extracts picker values without throwing for ${anchor.year}-${anchor.month}-${anchor.day}`, () => {
      for (const id of ALL_CALENDAR_IDS) {
        expect(() => extractPickerValues(id, anchor, { useModifiedJulianDay: false })).not.toThrow();
      }
    });
  }

  it('shows a Japanese fallback before Meiji', () => {
    const anchor = new GregorianCalendar(1868, 9, 7);
    const entry = getAllCalendarEntries(['japanese'], anchor, testSettings(), TEST_CALENDAR_COPY)[0];

    expect(entry.date).toBe('—');
    expect(entry.unavailableReason).toBe('japaneseBeforeMeiji');
  });

  it('shows a French Republican fallback before Year I', () => {
    const anchor = new GregorianCalendar(1582, 10, 4);
    const entry = getAllCalendarEntries(['frc'], anchor, testSettings(), TEST_CALENDAR_COPY)[0];

    expect(entry.date).toBe('—');
    expect(entry.unavailableReason).toBe('frcBeforeEpoch');
  });

  it('notes proleptic Gregorian before the historical adoption date', () => {
    const anchor = new GregorianCalendar(1582, 10, 4);
    const entry = getAllCalendarEntries(['gregorian'], anchor, testSettings(), TEST_CALENDAR_COPY)[0];

    expect(isBeforeGregorianHistoricalEpoch(anchor)).toBe(true);
    expect(entry.detailLabelKey).toBe('prolepticGregorian');
    expect(entry.date.length).toBeGreaterThan(0);
  });

  it('defaults the Japanese picker to Meiji 1 when the anchor is earlier', () => {
    const anchor = new GregorianCalendar(1800, 1, 1);
    expect(isBeforeJapaneseWarekiEpoch(anchor)).toBe(true);

    const values = extractPickerValues('japanese', anchor, { useModifiedJulianDay: false });
    expect(values).toEqual({
      eraId: 'meiji',
      eraYear: '1',
      month: '9',
      day: '8',
    });
  });

  it('shows sub-day Julian Day in calendar entries when viewing today', () => {
    const anchor = todayGregorianDate();
    const at = new Date(anchor.year, anchor.month - 1, anchor.day, 9, 15, 20);
    const entry = getAllCalendarEntries(['julianDay'], anchor, testSettings(), TEST_CALENDAR_COPY, at)[0];

    expect(entry.date).toBe(displayJulianDay(anchor, false, at));
    expect(entry.date).toMatch(/\.\d{5}$/);
  });

  it('shows live Julian Day precision in the picker when viewing today', () => {
    const anchor = todayGregorianDate();
    const at = new Date(anchor.year, anchor.month - 1, anchor.day, 12, 0, 30);
    const expected = displayJulianDay(anchor, false, at);

    vi.useFakeTimers();
    vi.setSystemTime(at);
    try {
      const values = extractPickerValues('julianDay', anchor, { useModifiedJulianDay: false });
      expect(values.jd).toBe(expected);
      expect(values.jd).toMatch(/\.\d{5}$/);
    } finally {
      vi.useRealTimers();
    }
  });
});
