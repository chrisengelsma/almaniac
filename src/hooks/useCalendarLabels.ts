import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { CalendarId } from '../lib/calendarRegistry';
import type { CalendarSystemType } from '../data/calendarInfo';

export function useCalendarLabels() {
  const { t } = useTranslation();

  return useMemo(
    () => ({
      getName: (id: CalendarId) => t(`calendars.name.${id}`),
      getLabel: (id: CalendarId) => t(`calendars.label.${id}`),
      getTypeLabel: (type: CalendarSystemType) => t(`calendars.type.${type}`),
    }),
    [t],
  );
}
