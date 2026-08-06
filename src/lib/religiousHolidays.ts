import {
  GregorianCalendar,
  HebrewCalendar,
  IslamicCalendar,
  IslamicCalendarMode,
} from 'calendar-converter/calendars';
import { toIslamicCalendar } from 'calendar-converter/services';
import type { IslamicCalendarMode as AppIslamicCalendarMode, IslamicDayAdjustment } from './appSettings';

export type HolidayTradition = 'christian' | 'jewish' | 'islamic';

export interface ReligiousHoliday {
  name: string;
  tradition: HolidayTradition;
}

export interface HolidaySettings {
  showChristianHolidays: boolean;
  showJewishHolidays: boolean;
  showIslamicHolidays: boolean;
  islamicCalendarMode: AppIslamicCalendarMode;
  islamicDayAdjustment: IslamicDayAdjustment;
}

interface HolidayContext {
  gregorian: GregorianCalendar;
  hebrew: HebrewCalendar;
  islamic: IslamicCalendar;
  easterSunday: { month: number; day: number } | null;
}

function computeGregorianEasterSunday(year: number): { month: number; day: number } | null {
  if (year < 1) {
    return null;
  }

  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

function offsetGregorianDate(
  anchor: GregorianCalendar,
  dayOffset: number,
): { month: number; day: number } {
  const shifted = new GregorianCalendar(anchor);
  if (dayOffset > 0) {
    shifted.addDays(dayOffset);
  } else if (dayOffset < 0) {
    shifted.subtractDays(-dayOffset);
  }
  return { month: shifted.month, day: shifted.day };
}

function matchesGregorian(
  anchor: GregorianCalendar,
  month: number,
  day: number,
): boolean {
  return anchor.month === month && anchor.day === day;
}

function matchesHebrew(hebrew: HebrewCalendar, month: number, day: number): boolean {
  return hebrew.month === month && hebrew.day === day;
}

function matchesIslamic(islamic: IslamicCalendar, month: number, day: number): boolean {
  return islamic.month === month && islamic.day === day;
}

function isWithinHebrewRange(
  hebrew: HebrewCalendar,
  startMonth: number,
  startDay: number,
  durationDays: number,
): boolean {
  const anchor = new HebrewCalendar(hebrew.year, hebrew.month, hebrew.day);
  const start = new HebrewCalendar(hebrew.year, startMonth, startDay);

  if (anchor.isBefore(start)) {
    return false;
  }

  const end = new HebrewCalendar(start);
  end.addDays(durationDays - 1);
  return !anchor.isAfter(end);
}

function isWithinIslamicMonth(islamic: IslamicCalendar, month: number): boolean {
  return islamic.month === month;
}

function buildContext(
  anchor: GregorianCalendar,
  islamicCalendarMode: AppIslamicCalendarMode,
  islamicDayAdjustment: IslamicDayAdjustment,
): HolidayContext {
  const mode = islamicCalendarMode === 'ummAlQura'
    ? IslamicCalendarMode.UmmAlQura
    : IslamicCalendarMode.Tabular;
  const hebrew = new HebrewCalendar(anchor);
  const islamic = toIslamicCalendar(anchor, mode);

  if (islamicDayAdjustment !== 0) {
    if (islamicDayAdjustment > 0) {
      islamic.addDays(islamicDayAdjustment);
    } else {
      islamic.subtractDays(-islamicDayAdjustment);
    }
  }

  return {
    gregorian: anchor,
    hebrew,
    islamic,
    easterSunday: computeGregorianEasterSunday(anchor.year),
  };
}

function collectHolidays(context: HolidayContext): ReligiousHoliday[] {
  const { gregorian, hebrew, islamic, easterSunday } = context;
  const holidays: ReligiousHoliday[] = [];

  // Jewish
  if (matchesHebrew(hebrew, 7, 1) || matchesHebrew(hebrew, 7, 2)) {
    holidays.push({ name: 'Rosh Hashanah', tradition: 'jewish' });
  }
  if (matchesHebrew(hebrew, 7, 10)) {
    holidays.push({ name: 'Yom Kippur', tradition: 'jewish' });
  }
  if (isWithinHebrewRange(hebrew, 7, 15, 7)) {
    holidays.push({ name: 'Sukkot', tradition: 'jewish' });
  }
  if (isWithinHebrewRange(hebrew, 9, 25, 8)) {
    holidays.push({ name: 'Hanukkah', tradition: 'jewish' });
  }
  if (matchesHebrew(hebrew, 12, 14) || matchesHebrew(hebrew, 13, 14)) {
    holidays.push({ name: 'Purim', tradition: 'jewish' });
  }
  if (isWithinHebrewRange(hebrew, 1, 15, 8)) {
    holidays.push({ name: 'Passover', tradition: 'jewish' });
  }
  if (matchesHebrew(hebrew, 3, 6)) {
    holidays.push({ name: 'Shavuot', tradition: 'jewish' });
  }
  if (matchesHebrew(hebrew, 5, 9)) {
    holidays.push({ name: "Tisha B'Av", tradition: 'jewish' });
  }

  // Christian, fixed
  if (matchesGregorian(gregorian, 1, 6)) {
    holidays.push({ name: 'Epiphany', tradition: 'christian' });
  }
  if (matchesGregorian(gregorian, 12, 25)) {
    holidays.push({ name: 'Christmas', tradition: 'christian' });
  }
  if (matchesGregorian(gregorian, 11, 1)) {
    holidays.push({ name: 'All Saints\' Day', tradition: 'christian' });
  }

  // Christian, movable (Gregorian Easter computus)
  if (easterSunday) {
    const palmSunday = offsetGregorianDate(
      new GregorianCalendar(gregorian.year, easterSunday.month, easterSunday.day),
      -7,
    );
    const goodFriday = offsetGregorianDate(
      new GregorianCalendar(gregorian.year, easterSunday.month, easterSunday.day),
      -2,
    );
    const ashWednesday = offsetGregorianDate(
      new GregorianCalendar(gregorian.year, easterSunday.month, easterSunday.day),
      -46,
    );
    const ascension = offsetGregorianDate(
      new GregorianCalendar(gregorian.year, easterSunday.month, easterSunday.day),
      39,
    );
    const pentecost = offsetGregorianDate(
      new GregorianCalendar(gregorian.year, easterSunday.month, easterSunday.day),
      49,
    );

    if (matchesGregorian(gregorian, ashWednesday.month, ashWednesday.day)) {
      holidays.push({ name: 'Ash Wednesday', tradition: 'christian' });
    }
    if (matchesGregorian(gregorian, palmSunday.month, palmSunday.day)) {
      holidays.push({ name: 'Palm Sunday', tradition: 'christian' });
    }
    if (matchesGregorian(gregorian, goodFriday.month, goodFriday.day)) {
      holidays.push({ name: 'Good Friday', tradition: 'christian' });
    }
    if (matchesGregorian(gregorian, easterSunday.month, easterSunday.day)) {
      holidays.push({ name: 'Easter Sunday', tradition: 'christian' });
    }
    if (matchesGregorian(gregorian, ascension.month, ascension.day)) {
      holidays.push({ name: 'Ascension Day', tradition: 'christian' });
    }
    if (matchesGregorian(gregorian, pentecost.month, pentecost.day)) {
      holidays.push({ name: 'Pentecost', tradition: 'christian' });
    }
  }

  // Islamic
  if (matchesIslamic(islamic, 1, 1)) {
    holidays.push({ name: 'Islamic New Year', tradition: 'islamic' });
  }
  if (matchesIslamic(islamic, 1, 10)) {
    holidays.push({ name: 'Ashura', tradition: 'islamic' });
  }
  if (matchesIslamic(islamic, 3, 12)) {
    holidays.push({ name: 'Mawlid al-Nabi', tradition: 'islamic' });
  }
  if (matchesIslamic(islamic, 9, 1)) {
    holidays.push({ name: 'Start of Ramadan', tradition: 'islamic' });
  }
  if (matchesIslamic(islamic, 9, 27)) {
    holidays.push({ name: 'Laylat al-Qadr', tradition: 'islamic' });
  }
  if (matchesIslamic(islamic, 10, 1)) {
    holidays.push({ name: 'Eid al-Fitr', tradition: 'islamic' });
  }
  if (matchesIslamic(islamic, 12, 10)) {
    holidays.push({ name: 'Eid al-Adha', tradition: 'islamic' });
  }
  if (isWithinIslamicMonth(islamic, 9) && !matchesIslamic(islamic, 9, 1)) {
    holidays.push({ name: 'Ramadan', tradition: 'islamic' });
  }

  return holidays;
}

export function getReligiousHolidays(
  anchor: GregorianCalendar,
  settings: HolidaySettings,
): ReligiousHoliday[] {
  const context = buildContext(
    anchor,
    settings.islamicCalendarMode,
    settings.islamicDayAdjustment,
  );

  return collectHolidays(context).filter((holiday) => {
    if (holiday.tradition === 'christian') {
      return settings.showChristianHolidays;
    }
    if (holiday.tradition === 'jewish') {
      return settings.showJewishHolidays;
    }
    return settings.showIslamicHolidays;
  });
}
