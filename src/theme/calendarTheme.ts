import type { CalendarId } from '../lib/calendarRegistry';

export const CALENDAR_NAMES: Record<CalendarId, string> = {
  gregorian: 'Gregorian Calendar',
  julian: 'Julian Calendar',
  ethiopian: 'Ethiopian Calendar',
  coptic: 'Coptic Calendar',
  chinese: 'Chinese Calendar',
  soviet: 'Soviet Revolutionary Calendar',
  frc: 'French Republican Calendar',
  maya: 'Maya Calendar',
  islamic: 'Islamic Calendar',
  hebrew: 'Hebrew Calendar',
  persian: 'Persian Calendar',
  bahai: 'Baháʼí Calendar',
  indianCivil: 'Indian Civil Calendar',
  julianDay: 'Julian Day',
};

export const ROW_BACKGROUNDS: Record<CalendarId, string> = {
  gregorian: '#e3eab8',
  julian: '#d9e894',
  ethiopian: '#d6e491',
  coptic: '#d3e48f',
  chinese: '#d2e48e',
  soviet: '#cce288',
  frc: '#cfe8a8',
  maya: '#c0e6b0',
  islamic: '#b3e3ba',
  hebrew: '#a4e0c4',
  persian: '#95dccd',
  bahai: '#8edad2',
  indianCivil: '#87d8d6',
  julianDay: '#7ad4df',
};
