import {
  type Calendar,
  BahaiCalendar,
  ChineseCalendar,
  VietnameseCalendar,
  CopticCalendar,
  EthiopianCalendar,
  FrenchRepublicanCalendar,
  GregorianCalendar,
  HebrewCalendar,
  IndianCivilCalendar,
  IslamicCalendar,
  IslamicCalendarMode,
  JapaneseWarekiCalendar,
  JulianCalendar,
  JulianCalendarMode,
  MayaCalendar,
  PersianCalendar,
  SovietCalendar,
  ThaiBuddhistCalendar,
  BengaliCalendar,
  MinguoCalendar,
  IsoWeekCalendar,
  DiscordianCalendar,
  NepaliCalendar,
  KoreanDangiCalendar,
  JucheCalendar,
} from 'calendar-converter/calendars';
import { toIslamicCalendar, toJulianCalendar, toJulianDay } from 'calendar-converter/services';
import type { MayaLongCountParts } from '../components/MayaLongCount';
import type { MayaHaabParts, MayaLordOfNight, MayaTzolkinParts } from './mayaRounds';
import type { AppSettings } from './appSettings';
import { getMayaParts } from './mayaRounds';
import {
  formatChineseEnglish,
  formatChineseNative,
  chineseYearDetailLabel,
  formatVietnameseEnglish,
  formatVietnameseNative,
  vietnameseYearDetailLabel,
  formatCopticEnglish,
  formatCopticNative,
  formatEthiopianEnglish,
  formatEthiopianNative,
  formatBahaiEnglish,
  formatBahaiNative,
  formatHebrewEnglish,
  formatHebrewNative,
  formatIndianCivilEnglish,
  formatIndianCivilNative,
  formatIslamicEnglish,
  formatIslamicNative,
  islamicCalendarSystemLabel,
  formatJapaneseEnglish,
  formatJapaneseNative,
  formatPersianEnglish,
  formatPersianNative,
  formatSovietEnglish,
  formatSovietNative,
  formatThaiBuddhistEnglish,
  formatThaiBuddhistNative,
  formatBengaliEnglish,
  formatBengaliNative,
  formatMinguoEnglish,
  formatMinguoNative,
  formatIsoWeekEnglish,
  formatIsoWeekNative,
  formatDiscordianEnglish,
  formatDiscordianNative,
  formatNepaliEnglish,
  formatNepaliNative,
  formatKoreanDangiEnglish,
  formatKoreanDangiNative,
  formatJucheEnglish,
  formatJucheNative,
  nativeWeekday,
  scriptFontForCalendar,
  type ScriptFont,
} from './nativeCalendarText';
import type { CalendarCopy } from '../i18n/calendarCopy';
import { calendarColorContext, getCalendarColor, getCalendarRowTextStyle, type CalendarRowTextStyle } from '../theme/calendarColors';
import { displayJulianDay } from './julianDayValue';
import { getReligiousHolidays, type HolidayTradition, type ReligiousHoliday } from './religiousHolidays';

export type CalendarId =
  | 'gregorian'
  | 'julian'
  | 'ethiopian'
  | 'coptic'
  | 'chinese'
  | 'vietnamese'
  | 'soviet'
  | 'frc'
  | 'maya'
  | 'islamic'
  | 'hebrew'
  | 'persian'
  | 'bahai'
  | 'japanese'
  | 'minguo'
  | 'koreanDangi'
  | 'juche'
  | 'thaiBuddhist'
  | 'bengali'
  | 'nepali'
  | 'isoWeek'
  | 'discordian'
  | 'indianCivil'
  | 'julianDay';

export interface CalendarEntry {
  id: CalendarId;
  label: string;
  calendarName: string;
  weekday: string;
  date: string;
  scriptFont: ScriptFont;
  mayaLongCount?: MayaLongCountParts;
  mayaUseGlyphs?: boolean;
  mayaUseHieroglyphs?: boolean;
  mayaHaab?: MayaHaabParts;
  mayaTzolkin?: MayaTzolkinParts;
  mayaLordOfNight?: MayaLordOfNight;
  detailLabel?: string;
  detailScriptFont?: ScriptFont;
}

export const DEFAULT_CALENDAR_ORDER: CalendarId[] = [
  'gregorian',
  'julian',
  'ethiopian',
  'coptic',
  'chinese',
  'vietnamese',
  'japanese',
  'minguo',
  'koreanDangi',
  'juche',
  'soviet',
  'frc',
  'maya',
  'islamic',
  'hebrew',
  'persian',
  'bahai',
  'thaiBuddhist',
  'bengali',
  'nepali',
  'isoWeek',
  'discordian',
  'indianCivil',
  'julianDay',
];

function islamicCalendarMode(settings: AppSettings): IslamicCalendarMode {
  return settings.islamicCalendarMode === 'ummAlQura'
    ? IslamicCalendarMode.UmmAlQura
    : IslamicCalendarMode.Tabular;
}

function julianCalendarMode(settings: AppSettings): JulianCalendarMode {
  return settings.julianCalendarMode === 'revisedJulian'
    ? JulianCalendarMode.RevisedJulian
    : JulianCalendarMode.Julian;
}

function buildJulianCalendar(anchor: GregorianCalendar, settings: AppSettings): JulianCalendar {
  return toJulianCalendar(anchor, julianCalendarMode(settings));
}

function buildIslamicCalendar(anchor: GregorianCalendar, settings: AppSettings): IslamicCalendar {
  return toIslamicCalendar(anchor, islamicCalendarMode(settings));
}

function getWeekday(calendar: Calendar, anchor: GregorianCalendar): string {
  if ('getWeekDay' in calendar && typeof calendar.getWeekDay === 'function') {
    return calendar.getWeekDay();
  }
  return new GregorianCalendar(anchor).getWeekDay();
}

function buildCalendar(id: CalendarId, anchor: GregorianCalendar, settings: AppSettings): Calendar {
  switch (id) {
    case 'gregorian':
      return new GregorianCalendar(anchor);
    case 'julian':
      return buildJulianCalendar(anchor, settings);
    case 'ethiopian':
      return new EthiopianCalendar(anchor);
    case 'coptic':
      return new CopticCalendar(anchor);
    case 'chinese':
      return new ChineseCalendar(anchor);
    case 'vietnamese':
      return new VietnameseCalendar(anchor);
    case 'soviet':
      return new SovietCalendar(anchor);
    case 'frc':
      return new FrenchRepublicanCalendar(anchor);
    case 'maya':
      return new MayaCalendar(anchor);
    case 'islamic':
      return buildIslamicCalendar(anchor, settings);
    case 'hebrew':
      return new HebrewCalendar(anchor);
    case 'persian':
      return new PersianCalendar(anchor);
    case 'bahai':
      return new BahaiCalendar(anchor);
    case 'japanese':
      return new JapaneseWarekiCalendar(anchor);
    case 'minguo':
      return new MinguoCalendar(anchor);
    case 'koreanDangi':
      return new KoreanDangiCalendar(anchor);
    case 'juche':
      return new JucheCalendar(anchor);
    case 'thaiBuddhist':
      return new ThaiBuddhistCalendar(anchor);
    case 'bengali':
      return new BengaliCalendar(anchor);
    case 'nepali':
      return new NepaliCalendar(anchor);
    case 'isoWeek':
      return new IsoWeekCalendar(anchor);
    case 'discordian':
      return new DiscordianCalendar(anchor);
    case 'indianCivil':
      return new IndianCivilCalendar(anchor);
    case 'julianDay':
      return toJulianDay(anchor);
    default:
      return new GregorianCalendar(anchor);
  }
}

function applyIslamicAdjustment(calendar: IslamicCalendar, adjustment: number): IslamicCalendar {
  if (adjustment === 0) {
    return calendar;
  }

  const adjusted = new IslamicCalendar(
    calendar.year,
    calendar.month,
    calendar.day,
    calendar.calendarType,
    calendar.leapYearRule,
    calendar.calendarMode,
  );
  if (adjustment > 0) {
    adjusted.addDays(adjustment);
  } else {
    adjusted.subtractDays(-adjustment);
  }
  return adjusted;
}

function formatDate(
  id: CalendarId,
  calendar: Calendar,
  transliterateToEnglish: boolean,
): string {
  if (transliterateToEnglish) {
    switch (id) {
      case 'islamic':
        return formatIslamicEnglish(calendar as IslamicCalendar);
      case 'persian':
        return formatPersianEnglish(calendar as PersianCalendar);
      case 'hebrew':
        return formatHebrewEnglish(calendar as HebrewCalendar);
      case 'indianCivil':
        return formatIndianCivilEnglish(calendar as IndianCivilCalendar);
      case 'chinese':
        return formatChineseEnglish(calendar as ChineseCalendar);
      case 'vietnamese':
        return formatVietnameseEnglish(calendar as VietnameseCalendar);
      case 'soviet':
        return formatSovietEnglish(calendar as SovietCalendar);
      case 'ethiopian':
        return formatEthiopianEnglish(calendar as EthiopianCalendar);
      case 'coptic':
        return formatCopticEnglish(calendar as CopticCalendar);
      case 'bahai':
        return formatBahaiEnglish(calendar as BahaiCalendar);
      case 'japanese':
        return formatJapaneseEnglish(calendar as JapaneseWarekiCalendar);
      case 'thaiBuddhist':
        return formatThaiBuddhistEnglish(calendar as ThaiBuddhistCalendar);
      case 'bengali':
        return formatBengaliEnglish(calendar as BengaliCalendar);
      case 'nepali':
        return formatNepaliEnglish(calendar as NepaliCalendar);
      case 'koreanDangi':
        return formatKoreanDangiEnglish(calendar as KoreanDangiCalendar);
      case 'juche':
        return formatJucheEnglish(calendar as JucheCalendar);
      case 'minguo':
        return formatMinguoEnglish(calendar as MinguoCalendar);
      case 'isoWeek':
        return formatIsoWeekEnglish(calendar as IsoWeekCalendar);
      case 'discordian':
        return formatDiscordianEnglish(calendar as DiscordianCalendar);
      default:
        return calendar.getDate();
    }
  }

  switch (id) {
    case 'islamic':
      return formatIslamicNative(calendar as IslamicCalendar);
    case 'persian':
      return formatPersianNative(calendar as PersianCalendar);
    case 'hebrew':
      return formatHebrewNative(calendar as HebrewCalendar);
    case 'indianCivil':
      return formatIndianCivilNative(calendar as IndianCivilCalendar);
    case 'chinese':
      return formatChineseNative(calendar as ChineseCalendar);
    case 'vietnamese':
      return formatVietnameseNative(calendar as VietnameseCalendar);
    case 'soviet':
      return formatSovietNative(calendar as SovietCalendar);
    case 'ethiopian':
      return formatEthiopianNative(calendar as EthiopianCalendar);
    case 'coptic':
      return formatCopticNative(calendar as CopticCalendar);
    case 'bahai':
      return formatBahaiNative(calendar as BahaiCalendar);
    case 'japanese':
      return formatJapaneseNative(calendar as JapaneseWarekiCalendar);
    case 'thaiBuddhist':
      return formatThaiBuddhistNative(calendar as ThaiBuddhistCalendar);
    case 'bengali':
      return formatBengaliNative(calendar as BengaliCalendar);
    case 'nepali':
      return formatNepaliNative(calendar as NepaliCalendar);
    case 'koreanDangi':
      return formatKoreanDangiNative(calendar as KoreanDangiCalendar);
    case 'juche':
      return formatJucheNative(calendar as JucheCalendar);
    case 'minguo':
      return formatMinguoNative(calendar as MinguoCalendar);
    case 'isoWeek':
      return formatIsoWeekNative(calendar as IsoWeekCalendar);
    case 'discordian':
      return formatDiscordianNative(calendar as DiscordianCalendar);
    default:
      return calendar.getDate();
  }
}

function buildCalendarEntry(
  id: CalendarId,
  anchor: GregorianCalendar,
  settings: AppSettings,
  copy: CalendarCopy,
  at?: Date,
): CalendarEntry {
  let calendar = buildCalendar(id, anchor, settings);

  if (id === 'islamic') {
    calendar = applyIslamicAdjustment(
      calendar as IslamicCalendar,
      settings.islamicDayAdjustment,
    );
  }

  const weekdayIndex = calendar.getWeekDayNumber();
  const nativeDay = nativeWeekday(id, weekdayIndex, settings.transliterateToEnglish);
  const weekday = id === 'julianDay' ? '' : (nativeDay ?? getWeekday(calendar, anchor));

  const entry: CalendarEntry = {
    id,
    label: copy.getLabel(id, settings.useModifiedJulianDay),
    calendarName: copy.getName(id, settings.useModifiedJulianDay),
    weekday,
    date: formatDate(id, calendar, settings.transliterateToEnglish),
    scriptFont: scriptFontForCalendar(id, settings.transliterateToEnglish),
  };

  if (id === 'julianDay') {
    entry.date = displayJulianDay(anchor, settings.useModifiedJulianDay, at);
  }

  if (id === 'maya') {
    const maya = calendar as MayaCalendar;
    const round = getMayaParts(maya);
    entry.weekday = round.haab.label;
    entry.detailLabel = round.tzolkin.label;
    entry.mayaHaab = {
      day: round.haab.day,
      monthIndex: round.haab.monthIndex,
      label: round.haab.label,
    };
    entry.mayaTzolkin = {
      number: round.tzolkin.number,
      dayIndex: round.tzolkin.dayIndex,
      label: round.tzolkin.label,
    };
    entry.mayaLordOfNight = round.lordOfNight;
    entry.mayaUseGlyphs = !settings.transliterateToEnglish;
    entry.mayaUseHieroglyphs = settings.mayaUseHieroglyphs;
    entry.detailScriptFont = 'latin';
    if (entry.mayaUseGlyphs) {
      entry.mayaLongCount = [maya.baktun, maya.katun, maya.tun, maya.uinal, maya.kin];
    }
  }

  if (id === 'islamic') {
    entry.detailLabel = islamicCalendarSystemLabel(
      settings.islamicCalendarMode,
      settings.transliterateToEnglish,
    );
  }

  if (id === 'julian') {
    entry.calendarName = copy.getJulianName(settings.julianCalendarMode);
  }

  if (id === 'chinese') {
    entry.detailLabel = chineseYearDetailLabel(calendar as ChineseCalendar);
    entry.detailScriptFont = 'latin';
  }

  if (id === 'vietnamese') {
    entry.detailLabel = vietnameseYearDetailLabel(
      calendar as VietnameseCalendar,
      settings.transliterateToEnglish,
    );
    entry.detailScriptFont = settings.transliterateToEnglish ? 'latin' : 'vietnamese';
  }

  return entry;
}

export interface CalendarRowData {
  entry: CalendarEntry;
  visible: boolean;
  backgroundColor: string;
  textStyle: CalendarRowTextStyle;
  holidays: ReligiousHoliday[];
}

const CALENDAR_HOLIDAY_TRADITIONS: Partial<Record<CalendarId, HolidayTradition>> = {
  gregorian: 'christian',
  julian: 'christian',
  coptic: 'christian',
  ethiopian: 'christian',
  hebrew: 'jewish',
  islamic: 'islamic',
};

function holidaysForCalendar(
  calendarId: CalendarId,
  holidays: ReligiousHoliday[],
): ReligiousHoliday[] {
  const tradition = CALENDAR_HOLIDAY_TRADITIONS[calendarId];
  if (!tradition) {
    return [];
  }

  return holidays.filter((holiday) => holiday.tradition === tradition);
}

export function getOrderedCalendarRows(
  order: CalendarId[],
  anchor: GregorianCalendar,
  settings: AppSettings,
  copy: CalendarCopy,
  at?: Date,
): CalendarRowData[] {
  const holidays = getReligiousHolidays(anchor, settings);
  const context = calendarColorContext(settings);
  const visibleOrder = order.filter((id) => settings.visibleCalendars[id]);

  return order.map((id) => {
    const visible = settings.visibleCalendars[id];
    const visibleIndex = visibleOrder.indexOf(id);
    const backgroundColor = getCalendarColor(
      id,
      context,
      context.colorTheme === 'supporter' && visible
        ? { index: visibleIndex, total: visibleOrder.length }
        : undefined,
    );

    return {
      entry: buildCalendarEntry(id, anchor, settings, copy, at),
      visible,
      backgroundColor,
      textStyle: getCalendarRowTextStyle(backgroundColor, context),
      holidays: holidaysForCalendar(id, holidays),
    };
  });
}

export function getCalendarEntries(
  order: CalendarId[],
  anchor: GregorianCalendar,
  settings: AppSettings,
  copy: CalendarCopy,
  at?: Date,
): CalendarEntry[] {
  return getOrderedCalendarRows(order, anchor, settings, copy, at)
    .filter((row) => row.visible)
    .map((row) => row.entry);
}

export function getAllCalendarEntries(
  order: CalendarId[],
  anchor: GregorianCalendar,
  settings: AppSettings,
  copy: CalendarCopy,
): CalendarEntry[] {
  return order.map((id) => buildCalendarEntry(id, anchor, settings, copy));
}

export function shiftGregorianDate(
  anchor: GregorianCalendar,
  deltaDays: number,
): GregorianCalendar {
  const next = new GregorianCalendar(anchor);
  if (deltaDays > 0) {
    next.addDays(deltaDays);
  } else if (deltaDays < 0) {
    next.subtractDays(-deltaDays);
  }
  return next;
}

export function todayGregorianDate(): GregorianCalendar {
  return new GregorianCalendar();
}

export function reorderCalendars(
  order: CalendarId[],
  reorderedVisible: CalendarId[],
): CalendarId[] {
  const visibleSet = new Set(reorderedVisible);
  let visibleIndex = 0;

  return order.map((id) => {
    if (visibleSet.has(id)) {
      return reorderedVisible[visibleIndex++] ?? id;
    }
    return id;
  });
}

export type { GregorianCalendar };
