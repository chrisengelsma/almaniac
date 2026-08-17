import type { TFunction } from 'i18next';
import type { CalendarId } from '../lib/calendarRegistry';

export interface CalendarCopy {
  getLabel: (id: CalendarId, useModifiedJulianDay: boolean) => string;
  getName: (id: CalendarId, useModifiedJulianDay: boolean) => string;
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
  };
}
