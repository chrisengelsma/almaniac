import type { CalendarId } from '../lib/calendarRegistry';

export const CALENDAR_NAMES: Record<CalendarId, string> = {
  gregorian: 'Gregorian Calendar',
  julian: 'Julian Calendar',
  chinese: 'Chinese Calendar',
  soviet: 'Soviet Revolutionary Calendar',
  frc: 'French Republican Calendar',
  maya: 'Maya Calendar',
  islamic: 'Islamic Calendar',
  hebrew: 'Hebrew Calendar',
  persian: 'Persian Calendar',
  indianCivil: 'Indian Civil Calendar',
  julianDay: 'Julian Day',
};

export const ROW_BACKGROUNDS: Record<CalendarId, string> = {
  gregorian: '#e3eab8',
  julian: '#d9e894',
  chinese: '#d2e48e',
  soviet: '#cce288',
  frc: '#cfe8a8',
  maya: '#c0e6b0',
  islamic: '#b3e3ba',
  hebrew: '#a4e0c4',
  persian: '#95dccd',
  indianCivil: '#87d8d6',
  julianDay: '#7ad4df',
};
