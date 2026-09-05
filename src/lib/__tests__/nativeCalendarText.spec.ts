import { describe, expect, it } from 'vitest';
import { BahaiCalendar, GregorianCalendar } from 'calendar-converter/calendars';
import { formatBahaiNative, nativeWeekday } from '../nativeCalendarText';

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
