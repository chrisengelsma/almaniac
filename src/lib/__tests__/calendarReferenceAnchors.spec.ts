import { describe, expect, it } from 'vitest';
import { GregorianCalendar } from 'calendar-converter/calendars';
import {
  toBahaiCalendar,
  toBengaliCalendar,
  toCopticCalendar,
  toEthiopianCalendar,
  toHebrewCalendar,
  toIndianCivilCalendar,
  toIslamicCalendar,
  toJulianCalendar,
  toJulianDay,
  toPersianCalendar,
  toShahanshahiCalendar,
} from 'calendar-converter/services';
import { IslamicCalendarMode, JulianCalendarMode } from 'calendar-converter/calendars';
import { extractPickerValues } from '../datePickerConfig';
import { pickerContextFromSettings, testSettings } from './testFixtures';

describe('calendar reference anchors', () => {
  it('maps Gregorian anchor date', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const values = extractPickerValues('gregorian', anchor);

    expect(values).toEqual({
      year: '2025',
      era: 'CE',
      month: '9',
      day: '5',
    });
  });

  it('maps Julian date thirteen days behind Gregorian in 2025', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const julian = toJulianCalendar(anchor, JulianCalendarMode.Julian);

    expect(julian.year).toBe(2025);
    expect(julian.month).toBe(8);
    expect(julian.day).toBe(23);
  });

  it('opens Persian year on Nowruz 2025', () => {
    const anchor = new GregorianCalendar(2025, 3, 20);
    const persian = toPersianCalendar(anchor);

    expect(persian.year).toBe(1404);
    expect(persian.month).toBe(1);
    expect(persian.day).toBe(1);
  });

  it('offsets Shahanshahi by 1180 years in 2025', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const shahanshahi = toShahanshahiCalendar(anchor);

    expect(shahanshahi.year).toBe(2584);
    expect(shahanshahi.month).toBe(6);
    expect(shahanshahi.day).toBe(15);
  });

  it('maps tabular and Umm al-Qura Islamic dates for September 2025', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const tabular = toIslamicCalendar(anchor, IslamicCalendarMode.Tabular);
    const ummAlQura = toIslamicCalendar(anchor, IslamicCalendarMode.UmmAlQura);

    expect(tabular.year).toBe(1447);
    expect(tabular.month).toBe(3);
    expect(tabular.day).toBe(12);

    expect(ummAlQura.year).toBe(1447);
    expect(ummAlQura.month).toBe(3);
    expect(ummAlQura.day).toBe(13);
  });

  it('opens Indian national year on Chaitra 1 2025', () => {
    const anchor = new GregorianCalendar(2025, 3, 22);
    const indian = toIndianCivilCalendar(anchor);

    expect(indian.year).toBe(1947);
    expect(indian.month).toBe(1);
    expect(indian.day).toBe(1);
  });

  it('maps Ethiopian and Coptic new years on 11 September 2025', () => {
    const anchor = new GregorianCalendar(2025, 9, 11);

    expect(toEthiopianCalendar(anchor).year).toBe(2018);
    expect(toCopticCalendar(anchor).year).toBe(1742);
  });

  it('maps known religious anchors', () => {
    expect(toHebrewCalendar(new GregorianCalendar(2024, 10, 3)).month).toBe(7);
    expect(toHebrewCalendar(new GregorianCalendar(2024, 10, 3)).day).toBe(1);
    expect(toBahaiCalendar(new GregorianCalendar(2024, 3, 20)).year).toBe(181);
    expect(toBengaliCalendar(new GregorianCalendar(2025, 4, 14)).month).toBe(1);
    expect(toBengaliCalendar(new GregorianCalendar(2025, 4, 14)).day).toBe(1);
  });

  it('maps noon Julian Day for 5 September 2025', () => {
    const anchor = new GregorianCalendar(2025, 9, 5);
    const settings = testSettings();
    const values = extractPickerValues('julianDay', anchor, pickerContextFromSettings(settings));

    expect(Number(values.jd)).toBe(toJulianDay(anchor).value);
    expect(toJulianDay(anchor).value).toBe(2460923.5);
  });
});
