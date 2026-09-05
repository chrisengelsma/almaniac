import { GregorianCalendar } from 'calendar-converter/calendars';
import type { CalendarCopy } from '../../i18n/calendarCopy';
import { defaultAppSettings, type AppSettings } from '../appSettings';
import type { CalendarId } from '../calendarRegistry';
import { DEFAULT_CALENDAR_ORDER } from '../calendarRegistry';
import type { PickerContext } from '../datePickerConfig';

export const TEST_CALENDAR_COPY: CalendarCopy = {
  getLabel: (id) => id,
  getName: (id) => id,
  getJulianName: (mode) => mode,
};

export const TEST_ANCHOR_DATES: GregorianCalendar[] = [
  new GregorianCalendar(2025, 9, 5),
  new GregorianCalendar(2025, 3, 20),
  new GregorianCalendar(2024, 2, 29),
  new GregorianCalendar(2025, 9, 11),
  new GregorianCalendar(2019, 5, 1),
];

export function testSettings(overrides: Partial<AppSettings> = {}): AppSettings {
  return { ...defaultAppSettings(), ...overrides };
}

export function pickerContextFromSettings(settings: AppSettings): PickerContext {
  return {
    islamicCalendarMode: settings.islamicCalendarMode,
    islamicDayAdjustment: settings.islamicDayAdjustment,
    julianCalendarMode: settings.julianCalendarMode,
    useModifiedJulianDay: settings.useModifiedJulianDay,
  };
}

export const ALL_CALENDAR_IDS: CalendarId[] = DEFAULT_CALENDAR_ORDER;

export function expectSameGregorianDay(
  actual: GregorianCalendar | null,
  expected: GregorianCalendar,
): void {
  if (!actual) {
    throw new Error(`Expected ${expected.year}-${expected.month}-${expected.day}, got null`);
  }

  if (
    actual.year !== expected.year
    || actual.month !== expected.month
    || actual.day !== expected.day
  ) {
    throw new Error(
      `Expected ${expected.year}-${expected.month}-${expected.day}, `
      + `got ${actual.year}-${actual.month}-${actual.day}`,
    );
  }
}
