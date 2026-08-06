import type { CalendarId } from '../lib/calendarRegistry';
import type { ColorScheme, ColorTheme } from '../lib/appSettings';

export type CalendarColorMap = Record<CalendarId, string>;

export interface CalendarColorContext {
  colorTheme: ColorTheme;
  colorScheme: ColorScheme;
  calendarColors?: Partial<CalendarColorMap>;
}

/** Default row colors — muted, distinct, and loosely evocative of each calendar tradition. */
export const DEFAULT_CALENDAR_COLORS: CalendarColorMap = {
  gregorian: '#d4dfe8', // cool civil blue-grey
  julian: '#e6d5c3', // Roman stone
  ethiopian: '#b5c99a', // highland olive green
  coptic: '#f0e6cc', // desert sand / gold
  chinese: '#e8c4bc', // muted vermillion
  soviet: '#ddb8b8', // dusty revolutionary red
  frc: '#e8dfa0', // republican wheat gold
  maya: '#9ecab8', // jade teal
  islamic: '#b8d4b0', // sage green
  hebrew: '#c8d4ec', // ceremonial blue
  persian: '#a8d4dc', // turquoise tile
  bahai: '#d4c8e0', // soft lavender
  japanese: '#e8d0d8', // cherry blossom blush
  minguo: '#d0dce8', // republic blue-grey
  thaiBuddhist: '#e0d4a8', // temple saffron gold
  bengali: '#d8e8c8', // monsoon green
  isoWeek: '#c8d8ec', // standards blue
  discordian: '#e0b8e8', // fnord purple
  indianCivil: '#ecd8b0', // saffron cream
  julianDay: '#b8c4d4', // astronomical slate
};

const MONO_LIGHT_ROW = '#e8e8e8';
const MONO_DARK_ROW = '#2a2a2a';
const MONO_DARK_TEXT = '#f5f5f5';

/** Five-swatch previews for the color-theme picker in settings. */
export const COLOR_THEME_SWATCHES: Record<ColorTheme, readonly string[]> = {
  distinct: [
    DEFAULT_CALENDAR_COLORS.gregorian,
    DEFAULT_CALENDAR_COLORS.julian,
    DEFAULT_CALENDAR_COLORS.islamic,
    DEFAULT_CALENDAR_COLORS.hebrew,
    DEFAULT_CALENDAR_COLORS.frc,
  ],
  mono: ['#f5f5f5', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#616161'],
};

export function calendarColorContext(
  settings: Pick<CalendarColorContext, 'colorTheme' | 'colorScheme'> & {
    calendarColors?: Partial<CalendarColorMap>;
  },
): CalendarColorContext {
  return {
    colorTheme: settings.colorTheme,
    colorScheme: settings.colorScheme,
    calendarColors: settings.calendarColors,
  };
}

export function resolveCalendarColors(
  overrides: Partial<CalendarColorMap> = {},
): CalendarColorMap {
  return { ...DEFAULT_CALENDAR_COLORS, ...overrides };
}

export function getCalendarColor(id: CalendarId, context: CalendarColorContext): string {
  if (context.colorTheme === 'mono') {
    return context.colorScheme === 'dark' ? MONO_DARK_TEXT : MONO_LIGHT_ROW;
  }

  return context.calendarColors?.[id] ?? DEFAULT_CALENDAR_COLORS[id];
}

export function getCalendarMapColors(
  id: CalendarId,
  context: CalendarColorContext,
): { background: string; stroke: string; fill: string } {
  if (context.colorTheme === 'mono') {
    if (context.colorScheme === 'dark') {
      return {
        background: MONO_DARK_ROW,
        stroke: '#ffffff',
        fill: '#9e9e9e',
      };
    }

    return {
      background: MONO_LIGHT_ROW,
      stroke: '#000000',
      fill: '#757575',
    };
  }

  const accent = getCalendarColor(id, context);
  const stroke = context.colorScheme === 'dark' ? '#ffffff' : '#000000';

  if (context.colorScheme === 'dark') {
    return {
      background: '#263238',
      stroke,
      fill: accent,
    };
  }

  return {
    background: accent,
    stroke,
    fill: accent,
  };
}
