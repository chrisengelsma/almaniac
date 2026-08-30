import type { TFunction } from 'i18next';
import type { JulianCalendarMode } from '../lib/appSettings';
import type { CalendarId } from '../lib/calendarRegistry';

export interface CalendarCopy {
  getLabel: (id: CalendarId, useModifiedJulianDay: boolean) => string;
  getName: (id: CalendarId, useModifiedJulianDay: boolean) => string;
  getJulianName: (mode: JulianCalendarMode) => string;
}

export function createCalendarCopy(t: TFunction): CalendarCopy {
  return {
    getLabel: (id, useModifiedJulianDay) => {
      if (id === 'julianDay' && useModifiedJulianDay) {
        return t('calendars.label.modifiedJulianDay');
      }

      return t(`calendars.label.${id}`);
    },
    getName: (id, useModifiedJulianDay) => {
      if (id === 'julianDay' && useModifiedJulianDay) {
        return t('datePicker.field.modifiedJulianDay');
      }

      return t(`calendars.name.${id}`);
    },
    getJulianName: (mode) => (
      mode === 'revisedJulian'
        ? t('calendars.name.revisedJulian')
        : t('calendars.name.julian')
    ),
  };
}
