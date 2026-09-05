import { describe, expect, it } from 'vitest';
import { GregorianCalendar } from 'calendar-converter/calendars';
import {
  extractPickerValues,
  pickerValuesToGregorian,
} from '../datePickerConfig';
import {
  ALL_CALENDAR_IDS,
  expectSameGregorianDay,
  pickerContextFromSettings,
  TEST_ANCHOR_DATES,
  testSettings,
} from './testFixtures';

describe('date picker round trips', () => {
  for (const calendarId of ALL_CALENDAR_IDS) {
    for (const anchor of TEST_ANCHOR_DATES) {
      it(`round-trips ${calendarId} for ${anchor.year}-${anchor.month}-${anchor.day}`, () => {
        const settings = testSettings();
        const context = pickerContextFromSettings(settings);
        const values = extractPickerValues(calendarId, anchor, context);
        const roundTrip = pickerValuesToGregorian(calendarId, values, context);

        expectSameGregorianDay(roundTrip, anchor);
      });
    }
  }

  it('round-trips Modified Julian Day picker values', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const settings = testSettings({ useModifiedJulianDay: true });
    const context = pickerContextFromSettings(settings);
    const values = extractPickerValues('julianDay', anchor, context);
    const roundTrip = pickerValuesToGregorian('julianDay', values, context);

    expectSameGregorianDay(roundTrip, anchor);
  });

  it('round-trips Revised Julian picker values', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const settings = testSettings({ julianCalendarMode: 'revisedJulian' });
    const context = pickerContextFromSettings(settings);
    const values = extractPickerValues('julian', anchor, context);
    const roundTrip = pickerValuesToGregorian('julian', values, context);

    expectSameGregorianDay(roundTrip, anchor);
  });

  it('round-trips Umm al-Qura Islamic picker values', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const settings = testSettings({ islamicCalendarMode: 'ummAlQura' });
    const context = pickerContextFromSettings(settings);
    const values = extractPickerValues('islamic', anchor, context);
    const roundTrip = pickerValuesToGregorian('islamic', values, context);

    expectSameGregorianDay(roundTrip, anchor);
  });

  it('round-trips Islamic picker values with day adjustment', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const settings = testSettings({ islamicDayAdjustment: 1 });
    const context = pickerContextFromSettings(settings);
    const values = extractPickerValues('islamic', anchor, context);
    const roundTrip = pickerValuesToGregorian('islamic', values, context);

    expect(values.day).not.toBe('12');
    expectSameGregorianDay(roundTrip, anchor);
  });

  it('rejects invalid picker values', () => {
    expect(pickerValuesToGregorian('gregorian', { year: '0', era: 'CE', month: '1', day: '1' })).toBeNull();
    expect(pickerValuesToGregorian('persian', { year: '1404', month: '1', day: '32' })).toBeNull();
  });
});
