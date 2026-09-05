import { describe, expect, it } from 'vitest';
import { IslamicCalendarMode, JulianCalendarMode } from 'calendar-converter/calendars';
import {
  toIslamicCalendar,
  toJulianCalendar,
} from 'calendar-converter/services';
import {
  ALL_CALENDAR_IDS,
  TEST_ANCHOR_DATES,
  TEST_CALENDAR_COPY,
  testSettings,
} from './testFixtures';
import { getAllCalendarEntries } from '../calendarRegistry';

describe('calendar entries', () => {
  for (const anchor of TEST_ANCHOR_DATES) {
    it(`builds non-empty entries for ${anchor.year}-${anchor.month}-${anchor.day}`, () => {
      const settings = testSettings();
      const entries = getAllCalendarEntries(ALL_CALENDAR_IDS, anchor, settings, TEST_CALENDAR_COPY);

      expect(entries).toHaveLength(ALL_CALENDAR_IDS.length);

      for (const entry of entries) {
        expect(entry.label.length).toBeGreaterThan(0);
        expect(entry.calendarName.length).toBeGreaterThan(0);
        expect(entry.date.length).toBeGreaterThan(0);
      }
    });
  }

  it('applies Islamic day adjustment in displayed entries', () => {
    const anchor = TEST_ANCHOR_DATES[0];
    const baselineSettings = testSettings({ islamicDayAdjustment: 0, transliterateToEnglish: true });
    const adjustedSettings = testSettings({ islamicDayAdjustment: 1, transliterateToEnglish: true });

    const baseline = getAllCalendarEntries(['islamic'], anchor, baselineSettings, TEST_CALENDAR_COPY)[0];
    const adjusted = getAllCalendarEntries(['islamic'], anchor, adjustedSettings, TEST_CALENDAR_COPY)[0];

    const baseIslamic = toIslamicCalendar(anchor, IslamicCalendarMode.Tabular);
    baseIslamic.addDays(1);

    expect(adjusted.date).not.toEqual(baseline.date);
    expect(adjusted.date).toContain(String(baseIslamic.day));
  });

  it('uses revised Julian mode in Julian calendar name', () => {
    const anchor = TEST_ANCHOR_DATES[0];
    const settings = testSettings({ julianCalendarMode: 'revisedJulian' });
    const entry = getAllCalendarEntries(['julian'], anchor, settings, TEST_CALENDAR_COPY)[0];

    expect(entry.calendarName).toBe('revisedJulian');
    expect(toJulianCalendar(anchor, JulianCalendarMode.RevisedJulian).month).toBe(anchor.month);
  });

  it('includes Maya long count parts when glyphs are enabled', () => {
    const anchor = TEST_ANCHOR_DATES[0];
    const settings = testSettings({ transliterateToEnglish: false, mayaUseHieroglyphs: true });
    const entry = getAllCalendarEntries(['maya'], anchor, settings, TEST_CALENDAR_COPY)[0];

    expect(entry.mayaLongCount).toEqual(expect.arrayContaining([expect.any(Number)]));
    expect(entry.mayaHaab?.label.length).toBeGreaterThan(0);
    expect(entry.mayaTzolkin?.label.length).toBeGreaterThan(0);
    expect(entry.mayaLordOfNight).toBeTruthy();
  });
});
