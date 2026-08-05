import {
  BahaiCalendar,
  ChineseCalendar,
  CopticCalendar,
  EthiopianCalendar,
  FrenchRepublicanCalendar,
  GregorianCalendar,
  HebrewCalendar,
  IndianCivilCalendar,
  IslamicCalendar,
  IslamicCalendarMode,
  JulianCalendar,
  JulianDay,
  MayaCalendar,
  PersianCalendar,
  SovietCalendar,
} from 'calendar-converter/calendars';
import { toGregorianCalendar, toIslamicCalendar } from 'calendar-converter/services';
import type { CalendarId } from './calendarRegistry';
import { DEFAULT_CALENDAR_ORDER } from './calendarRegistry';
import { CALENDAR_NAMES } from '../theme/calendarTheme';
import type { IslamicCalendarMode as AppIslamicCalendarMode } from './appSettings';
import {
  astronomicalToDisplay,
  createGregorianDate,
  daysInGregorianMonth,
  type GregorianEra,
} from './gregorianDate';

export type PickerValues = Record<string, string>;

export interface PickerContext {
  islamicCalendarMode?: AppIslamicCalendarMode;
}

function converterIslamicMode(context?: PickerContext): IslamicCalendarMode {
  return context?.islamicCalendarMode === 'ummAlQura'
    ? IslamicCalendarMode.UmmAlQura
    : IslamicCalendarMode.Tabular;
}

export interface PickerFieldOption {
  value: string;
  label: string;
}

export type PickerFieldType = 'number' | 'select' | 'era';

export interface PickerFieldDef {
  key: string;
  label: string;
  type: PickerFieldType;
  min?: number;
  step?: number;
  placeholder?: string;
  hint?: string;
  getOptions?: (values: PickerValues) => PickerFieldOption[];
  getMax?: (values: PickerValues) => number;
}

export const PICKER_CALENDAR_IDS: CalendarId[] = DEFAULT_CALENDAR_ORDER;

export const PICKER_CALENDAR_OPTIONS = PICKER_CALENDAR_IDS.map((id) => ({
  id,
  label: CALENDAR_NAMES[id],
  searchText: `${CALENDAR_NAMES[id]} ${id}`.toLowerCase(),
}));

function gregorianMonthOptions(): PickerFieldOption[] {
  return Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: GregorianCalendar.MonthName(index + 1),
  }));
}

function julianMonthOptions(): PickerFieldOption[] {
  return Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: JulianCalendar.MonthName(index + 1),
  }));
}

function eraMonthOptions(
  count: number,
  monthName: (month: number) => string,
): PickerFieldOption[] {
  return Array.from({ length: count }, (_, index) => ({
    value: String(index + 1),
    label: monthName(index + 1),
  }));
}

function islamicMonthOptions(): PickerFieldOption[] {
  return Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: IslamicCalendar.MonthName(index + 1),
  }));
}

function hebrewMonthOptions(year: number): PickerFieldOption[] {
  const count = HebrewCalendar.NumberOfMonthsInYear(year);
  return Array.from({ length: count }, (_, index) => ({
    value: String(index + 1),
    label: HebrewCalendar.MonthName(index + 1),
  }));
}

function persianMonthOptions(): PickerFieldOption[] {
  return Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: PersianCalendar.MonthName(index + 1),
  }));
}

function bahaiMonthOptions(): PickerFieldOption[] {
  return Array.from({ length: 20 }, (_, index) => ({
    value: String(index + 1),
    label: BahaiCalendar.MonthName(index + 1),
  }));
}

function indianCivilMonthOptions(): PickerFieldOption[] {
  return Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: IndianCivilCalendar.MonthName(index + 1),
  }));
}

function frcMonthOptions(): PickerFieldOption[] {
  const regular = Array.from({ length: 12 }, (_, index) => ({
    value: String(index + 1),
    label: FrenchRepublicanCalendar.MonthName(index + 1),
  }));
  return [...regular, { value: '13', label: 'Sansculottides' }];
}

function chineseMonthOptions(year: number): PickerFieldOption[] {
  const options: PickerFieldOption[] = [];
  for (let month = 1; month <= 12; month++) {
    options.push({
      value: `${month}:0`,
      label: ChineseCalendar.MonthName(month),
    });
    try {
      ChineseCalendar.NumberOfDaysInMonth(year, month, true);
      options.push({
        value: `${month}:1`,
        label: ChineseCalendar.MonthName(month, true),
      });
    } catch {
      // Not a leap month for this year.
    }
  }
  return options;
}

function sovietSlotOptions(year: number): PickerFieldOption[] {
  const slots = SovietCalendar.buildYearSlots(year);
  return slots.map((slot, index) => ({
    value: String(index),
    label: slot.isEpagomenal
      ? SovietCalendar.EpagomenalName(slot.epagomenalIndex)
      : `${slot.day} ${SovietCalendar.MonthName(slot.month)}`,
  }));
}

function parseNumber(values: PickerValues, key: string): number | null {
  const parsed = Number.parseInt(values[key] ?? '', 10);
  return Number.isInteger(parsed) ? parsed : null;
}

function parseFloatValue(values: PickerValues, key: string): number | null {
  const parsed = Number.parseFloat(values[key] ?? '');
  return Number.isFinite(parsed) ? parsed : null;
}

export function getPickerFields(calendarId: CalendarId, context?: PickerContext): PickerFieldDef[] {
  switch (calendarId) {
    case 'gregorian':
      return [
        {
          key: 'year',
          label: 'Year',
          type: 'number',
          min: 1,
          placeholder: 'e.g. 100',
          hint: 'Type any year — including ancient dates like 100 BCE.',
        },
        { key: 'era', label: 'Era', type: 'era' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => gregorianMonthOptions(),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year');
            const era = (values.era ?? 'CE') as GregorianEra;
            const month = parseNumber(values, 'month') ?? 1;
            if (!year || year < 1) {
              return Array.from({ length: 31 }, (_, index) => ({
                value: String(index + 1),
                label: String(index + 1),
              }));
            }
            const maxDay = daysInGregorianMonth(year, era, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'julian':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 44' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => julianMonthOptions(),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = JulianCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'ethiopian':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 2018' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => eraMonthOptions(13, EthiopianCalendar.MonthName),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = EthiopianCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'coptic':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 1742' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => eraMonthOptions(13, CopticCalendar.MonthName),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = CopticCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'chinese':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 2026' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: (values) => chineseMonthOptions(parseNumber(values, 'year') ?? 1),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const monthKey = values.month ?? '1:0';
            const [monthPart, leapPart] = monthKey.split(':');
            const month = Number.parseInt(monthPart, 10);
            const isLeapMonth = leapPart === '1';
            let maxDay = 30;
            try {
              maxDay = ChineseCalendar.NumberOfDaysInMonth(year, month, isLeapMonth);
            } catch {
              maxDay = 30;
            }
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'soviet':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 1930' },
        {
          key: 'slot',
          label: 'Day',
          type: 'select',
          getOptions: (values) => sovietSlotOptions(parseNumber(values, 'year') ?? 1),
        },
      ];
    case 'frc':
      return [
        { key: 'year', label: 'Year', type: 'number', min: 1, placeholder: 'e.g. 3' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => frcMonthOptions(),
        },
        {
          key: 'week',
          label: 'Décade',
          type: 'select',
          getOptions: (values) => {
            const month = parseNumber(values, 'month') ?? 1;
            const count = month === 13 ? 1 : 3;
            return Array.from({ length: count }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = month === 13 ? (FrenchRepublicanCalendar.IsLeapYear(year) ? 6 : 5) : 10;
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'maya':
      return [
        { key: 'baktun', label: 'Baktun', type: 'number', min: 0, placeholder: '0' },
        { key: 'katun', label: 'Katun', type: 'number', min: 0, getMax: () => 19, placeholder: '0' },
        { key: 'tun', label: 'Tun', type: 'number', min: 0, getMax: () => 19, placeholder: '0' },
        { key: 'uinal', label: 'Uinal', type: 'number', min: 0, getMax: () => 17, placeholder: '0' },
        { key: 'kin', label: 'Kin', type: 'number', min: 0, getMax: () => 19, placeholder: '0' },
      ];
    case 'islamic':
      return [
        { key: 'year', label: 'Year', type: 'number', min: 1, placeholder: 'e.g. 1447' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => islamicMonthOptions(),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = IslamicCalendar.NumberOfDaysInMonthInYear(
              month,
              year,
              undefined,
              converterIslamicMode(context),
            );
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'hebrew':
      return [
        { key: 'year', label: 'Year', type: 'number', min: 1, placeholder: 'e.g. 5786' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: (values) => hebrewMonthOptions(parseNumber(values, 'year') ?? 1),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = HebrewCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'persian':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 1404' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => persianMonthOptions(),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = PersianCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'bahai':
      return [
        { key: 'year', label: 'Year', type: 'number', min: 1, placeholder: 'e.g. 181' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => bahaiMonthOptions(),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = BahaiCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'indianCivil':
      return [
        { key: 'year', label: 'Year', type: 'number', placeholder: 'e.g. 1948' },
        {
          key: 'month',
          label: 'Month',
          type: 'select',
          getOptions: () => indianCivilMonthOptions(),
        },
        {
          key: 'day',
          label: 'Day',
          type: 'select',
          getOptions: (values) => {
            const year = parseNumber(values, 'year') ?? 1;
            const month = parseNumber(values, 'month') ?? 1;
            const maxDay = IndianCivilCalendar.NumberOfDaysInMonth(year, month);
            return Array.from({ length: maxDay }, (_, index) => ({
              value: String(index + 1),
              label: String(index + 1),
            }));
          },
        },
      ];
    case 'julianDay':
      return [
        {
          key: 'jd',
          label: 'Julian Day',
          type: 'number',
          step: 0.5,
          placeholder: 'e.g. 2460000',
          hint: 'Enter a Julian Day number (may include .5 for noon).',
        },
      ];
    default:
      return [];
  }
}

export function extractPickerValues(
  calendarId: CalendarId,
  anchor: GregorianCalendar,
  context?: PickerContext,
): PickerValues {
  switch (calendarId) {
    case 'gregorian': {
      const { year, era } = astronomicalToDisplay(anchor.year);
      return {
        year: String(year),
        era,
        month: String(anchor.month),
        day: String(anchor.day),
      };
    }
    case 'julian': {
      const julian = new JulianCalendar(anchor);
      return {
        year: String(julian.year),
        month: String(julian.month),
        day: String(julian.day),
      };
    }
    case 'ethiopian': {
      const ethiopian = new EthiopianCalendar(anchor);
      return {
        year: String(ethiopian.year),
        month: String(ethiopian.month),
        day: String(ethiopian.day),
      };
    }
    case 'coptic': {
      const coptic = new CopticCalendar(anchor);
      return {
        year: String(coptic.year),
        month: String(coptic.month),
        day: String(coptic.day),
      };
    }
    case 'chinese': {
      const chinese = new ChineseCalendar(anchor);
      return {
        year: String(chinese.year),
        month: `${chinese.month}:${chinese.isLeapMonth ? 1 : 0}`,
        day: String(chinese.day),
      };
    }
    case 'soviet': {
      const soviet = new SovietCalendar(anchor);
      const slotIndex = SovietCalendar.slotIndex(soviet);
      return {
        year: String(soviet.year),
        slot: String(Math.max(slotIndex, 0)),
      };
    }
    case 'frc': {
      const frc = new FrenchRepublicanCalendar(anchor);
      return {
        year: String(frc.year),
        month: String(frc.month),
        week: String(frc.week),
        day: String(frc.day),
      };
    }
    case 'maya': {
      const maya = new MayaCalendar(anchor);
      return {
        baktun: String(maya.baktun),
        katun: String(maya.katun),
        tun: String(maya.tun),
        uinal: String(maya.uinal),
        kin: String(maya.kin),
      };
    }
    case 'islamic': {
      const islamic = toIslamicCalendar(anchor, converterIslamicMode(context));
      return {
        year: String(islamic.year),
        month: String(islamic.month),
        day: String(islamic.day),
      };
    }
    case 'hebrew': {
      const hebrew = new HebrewCalendar(anchor);
      return {
        year: String(hebrew.year),
        month: String(hebrew.month),
        day: String(hebrew.day),
      };
    }
    case 'persian': {
      const persian = new PersianCalendar(anchor);
      return {
        year: String(persian.year),
        month: String(persian.month),
        day: String(persian.day),
      };
    }
    case 'bahai': {
      const bahai = new BahaiCalendar(anchor);
      return {
        year: String(bahai.year),
        month: String(bahai.month),
        day: String(bahai.day),
      };
    }
    case 'indianCivil': {
      const indian = new IndianCivilCalendar(anchor);
      return {
        year: String(indian.year),
        month: String(indian.month),
        day: String(indian.day),
      };
    }
    case 'julianDay': {
      const jd = new JulianDay(anchor);
      return { jd: String(jd.value) };
    }
    default:
      return {};
  }
}

export function pickerValuesToGregorian(
  calendarId: CalendarId,
  values: PickerValues,
  context?: PickerContext,
): GregorianCalendar | null {
  try {
    switch (calendarId) {
      case 'gregorian': {
        const year = parseNumber(values, 'year');
        const era = (values.era ?? 'CE') as GregorianEra;
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (!year || year < 1 || !month || !day) {
          return null;
        }
        return createGregorianDate(year, era, month, day);
      }
      case 'julian': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (year === null || !month || !day) {
          return null;
        }
        if (day > JulianCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new JulianCalendar(year, month, day));
      }
      case 'ethiopian': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (!year || !month || !day) {
          return null;
        }
        if (day > EthiopianCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new EthiopianCalendar(year, month, day));
      }
      case 'coptic': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (!year || !month || !day) {
          return null;
        }
        if (day > CopticCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new CopticCalendar(year, month, day));
      }
      case 'chinese': {
        const year = parseNumber(values, 'year');
        const monthKey = values.month ?? '1:0';
        const [monthPart, leapPart] = monthKey.split(':');
        const month = Number.parseInt(monthPart, 10);
        const isLeapMonth = leapPart === '1';
        const day = parseNumber(values, 'day');
        if (!year || !month || !day) {
          return null;
        }
        if (day > ChineseCalendar.NumberOfDaysInMonth(year, month, isLeapMonth)) {
          return null;
        }
        return toGregorianCalendar(new ChineseCalendar(year, month, day, isLeapMonth));
      }
      case 'soviet': {
        const year = parseNumber(values, 'year');
        const slotIndex = parseNumber(values, 'slot');
        if (!year || slotIndex === null || slotIndex < 0) {
          return null;
        }
        const slots = SovietCalendar.buildYearSlots(year);
        const slot = slots[slotIndex];
        if (!slot) {
          return null;
        }
        return toGregorianCalendar(
          new SovietCalendar(year, slot.month, slot.day, slot.isEpagomenal, slot.epagomenalIndex),
        );
      }
      case 'frc': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const week = parseNumber(values, 'week');
        const day = parseNumber(values, 'day');
        if (!year || year < 1 || !month || !week || !day) {
          return null;
        }
        const maxDay = month === 13 ? (FrenchRepublicanCalendar.IsLeapYear(year) ? 6 : 5) : 10;
        if (day > maxDay || (month !== 13 && week > 3) || (month === 13 && week !== 1)) {
          return null;
        }
        return toGregorianCalendar(new FrenchRepublicanCalendar(year, month, day, week));
      }
      case 'maya': {
        const baktun = parseNumber(values, 'baktun');
        const katun = parseNumber(values, 'katun');
        const tun = parseNumber(values, 'tun');
        const uinal = parseNumber(values, 'uinal');
        const kin = parseNumber(values, 'kin');
        if (
          baktun === null ||
          katun === null ||
          tun === null ||
          uinal === null ||
          kin === null ||
          baktun < 0 ||
          katun < 0 ||
          katun > 19 ||
          tun < 0 ||
          tun > 19 ||
          uinal < 0 ||
          uinal > 17 ||
          kin < 0 ||
          kin > 19
        ) {
          return null;
        }
        return toGregorianCalendar(new MayaCalendar(baktun, katun, tun, uinal, kin));
      }
      case 'islamic': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (!year || year < 1 || !month || !day) {
          return null;
        }
        if (day > IslamicCalendar.NumberOfDaysInMonthInYear(month, year, undefined, converterIslamicMode(context))) {
          return null;
        }
        const mode = converterIslamicMode(context);
        return toGregorianCalendar(
          new IslamicCalendar(year, month, day, undefined, undefined, mode),
        );
      }
      case 'hebrew': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (!year || year < 1 || !month || !day) {
          return null;
        }
        if (month > HebrewCalendar.NumberOfMonthsInYear(year)) {
          return null;
        }
        if (day > HebrewCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new HebrewCalendar(year, month, day));
      }
      case 'persian': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (year === null || !month || !day) {
          return null;
        }
        if (day > PersianCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new PersianCalendar(year, month, day));
      }
      case 'bahai': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (!year || year < 1 || !month || !day) {
          return null;
        }
        if (day > BahaiCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new BahaiCalendar(year, month, day));
      }
      case 'indianCivil': {
        const year = parseNumber(values, 'year');
        const month = parseNumber(values, 'month');
        const day = parseNumber(values, 'day');
        if (year === null || !month || !day) {
          return null;
        }
        if (day > IndianCivilCalendar.NumberOfDaysInMonth(year, month)) {
          return null;
        }
        return toGregorianCalendar(new IndianCivilCalendar(year, month, day));
      }
      case 'julianDay': {
        const jd = parseFloatValue(values, 'jd');
        if (jd === null) {
          return null;
        }
        return toGregorianCalendar(new JulianDay(jd));
      }
      default:
        return null;
    }
  } catch {
    return null;
  }
}

export function clampPickerValues(
  calendarId: CalendarId,
  values: PickerValues,
  context?: PickerContext,
): PickerValues {
  const fields = getPickerFields(calendarId, context);
  const next = { ...values };

  for (const field of fields) {
    if (field.type !== 'select' || !field.getOptions) {
      continue;
    }
    const options = field.getOptions(next);
    if (options.length === 0) {
      continue;
    }
    const current = next[field.key];
    if (!options.some((option) => option.value === current)) {
      next[field.key] = options[0].value;
    }
  }

  if (calendarId === 'gregorian') {
    const year = parseNumber(next, 'year');
    const era = (next.era ?? 'CE') as GregorianEra;
    const month = parseNumber(next, 'month') ?? 1;
    const day = parseNumber(next, 'day') ?? 1;
    if (year && year >= 1) {
      const maxDay = daysInGregorianMonth(year, era, month);
      if (day > maxDay) {
        next.day = String(maxDay);
      }
    }
  }

  if (calendarId === 'frc') {
    const month = parseNumber(next, 'month') ?? 1;
    if (month === 13) {
      next.week = '1';
    }
  }

  return next;
}

export function filterCalendarOptions(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return PICKER_CALENDAR_OPTIONS;
  }
  return PICKER_CALENDAR_OPTIONS.filter((option) => option.searchText.includes(normalized));
}
