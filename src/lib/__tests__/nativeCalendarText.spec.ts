import { describe, expect, it } from 'vitest';
import { BahaiCalendar, GregorianCalendar, HebrewCalendar } from 'calendar-converter/calendars';
import { formatBahaiNative, formatHebrewNative, nativeWeekday } from '../nativeCalendarText';

describe('Baháʼí native calendar text', () => {
  it('uses Badíʿ weekday names instead of Islamic weekday names', () => {
    const saturday = new GregorianCalendar(2025, 9, 6);
    const sunday = new GregorianCalendar(2025, 9, 7);
    const friday = new GregorianCalendar(2025, 9, 5);

    expect(nativeWeekday('bahai', saturday.getWeekDayNumber(), false)).toBe('جلال');
    expect(nativeWeekday('bahai', sunday.getWeekDayNumber(), false)).toBe('جمال');
    expect(nativeWeekday('bahai', friday.getWeekDayNumber(), false)).toBe('استقلال');
  });

  it('formats native Baháʼí dates with Western digits and Arabic month names', () => {
    const calendar = new BahaiCalendar(181, 1, 1);
    expect(formatBahaiNative(calendar)).toBe('1 بهاء 181');
  });
});

describe('Hebrew native calendar text', () => {
  const niqqud = /[\u0591-\u05C7]/;

  it('uses weekday names without niqqud', () => {
    for (let index = 0; index < 7; index += 1) {
      const weekday = nativeWeekday('hebrew', index, false) ?? '';
      expect(weekday).not.toMatch(niqqud);
    }
    expect(nativeWeekday('hebrew', 0, false)).toBe('יום ראשון');
    expect(nativeWeekday('hebrew', 6, false)).toBe('שבת');
  });

  it('does not use native Hebrew weekday labels when transliterating', () => {
    expect(nativeWeekday('hebrew', 0, true)).toBeUndefined();
  });

  it('formats native dates with conventional Hebrew numerals', () => {
    const calendar = new HebrewCalendar(new GregorianCalendar(2026, 9, 20));
    expect(formatHebrewNative(calendar)).toBe('ט׳ תשרי ה׳תשפ״ז');
  });

  it('uses ט״ו and ט״ז for the 15th and 16th of the month', () => {
    const fifteenth = new HebrewCalendar(new GregorianCalendar(2025, 4, 13));
    const sixteenth = new HebrewCalendar(new GregorianCalendar(2025, 4, 14));
    expect(formatHebrewNative(fifteenth)).toBe('ט״ו ניסן ה׳תשפ״ה');
    expect(formatHebrewNative(sixteenth)).toBe('ט״ז ניסן ה׳תשפ״ה');
  });
});
