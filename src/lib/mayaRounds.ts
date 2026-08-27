import type { MayaCalendar } from 'calendar-converter/calendars';
import {
  getMayaHaab,
  getMayaLordOfNight,
  getMayaNahual,
  getMayaRoundDate,
  getMayaTzolkin,
  mayaTotalDays as mayaTotalDaysFromParts,
  type MayaHaabDate,
  type MayaLordOfNight,
  type MayaNahual,
  type MayaTzolkinDate,
} from 'calendar-converter/calendars';

export type { MayaHaabDate, MayaLordOfNight, MayaNahual, MayaTzolkinDate };

export function formatHaabDate(totalDays: number): string {
  return getMayaHaab(totalDays).label;
}

export function formatTzolkinDate(totalDays: number): string {
  return getMayaTzolkin(totalDays).label;
}

export interface MayaHaabParts {
  day: number;
  monthIndex: number;
  label: string;
}

export interface MayaTzolkinParts {
  number: number;
  dayIndex: number;
  label: string;
}

export function getHaabParts(totalDays: number): MayaHaabParts {
  const haab = getMayaHaab(totalDays);
  return {
    day: haab.day,
    monthIndex: haab.monthIndex,
    label: haab.label,
  };
}

export function getTzolkinParts(totalDays: number): MayaTzolkinParts {
  const tzolkin = getMayaTzolkin(totalDays);
  return {
    number: tzolkin.number,
    dayIndex: tzolkin.dayIndex,
    label: tzolkin.label,
  };
}

export function getLordOfNightParts(maya: MayaCalendar): MayaLordOfNight {
  return getMayaLordOfNight(maya);
}

export function getNahualParts(totalDays: number): MayaNahual {
  return getMayaNahual(totalDays);
}

export function mayaTotalDays(maya: MayaCalendar): number {
  return mayaTotalDaysFromParts(maya);
}

export { mayaTotalDaysFromParts };

export function getMayaParts(maya: MayaCalendar) {
  return getMayaRoundDate(maya);
}
