import type { CalendarId } from '../lib/calendarRegistry';

/** Hero banner images for calendar info modals. Add paths as assets become available. */
export const CALENDAR_BANNERS: Partial<Record<CalendarId, string>> = {
  gregorian: '/banners/gregorian.png',
  julian: '/banners/julian.png',
  ethiopian: '/banners/ethiopian.png',
};
