import type { CalendarId } from '../lib/calendarRegistry';
import type { ColorScheme, ColorTheme } from '../lib/appSettings';
import { rowTextColors, type RowTextColors } from './rowTextColors';

export type CalendarColorMap = Record<CalendarId, string>;

export interface CalendarColorContext {
  colorTheme: ColorTheme;
  colorScheme: ColorScheme;
  calendarColors?: Partial<CalendarColorMap>;
}

export interface SupporterGradientIndex {
  index: number;
  total: number;
}

const SUPPORTER_GRADIENT_LIGHT_START = { h: 72, s: 48, l: 86 };
const SUPPORTER_GRADIENT_LIGHT_END = { h: 168, s: 42, l: 78 };

export function getSupporterThemeRowColor(
  index: number,
  total: number,
): string {
  const start = SUPPORTER_GRADIENT_LIGHT_START;
  const end = SUPPORTER_GRADIENT_LIGHT_END;
  const t = total <= 1 ? 0 : index / (total - 1);
  const h = start.h + (end.h - start.h) * t;
  const s = start.s + (end.s - start.s) * t;
  const l = start.l + (end.l - start.l) * t;

  return `hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
}

/** Default row colors: muted, distinct, and loosely evocative of each calendar tradition. */
export const DEFAULT_CALENDAR_COLORS: CalendarColorMap = {
  gregorian: '#d4dfe8', // cool civil blue-grey
  julian: '#e6d5c3', // Roman stone
  ethiopian: '#b5c99a', // highland olive green
  coptic: '#f0e6cc', // desert sand / gold
  chinese: '#e8c4bc', // muted vermillion
  vietnamese: '#d8e4c0', // muted bamboo green
  soviet: '#ddb8b8', // dusty revolutionary red
  frc: '#e8dfa0', // republican wheat gold
  maya: '#b8ddd0', // jade teal
  islamic: '#b8d4b0', // sage green
  hebrew: '#c8d4ec', // ceremonial blue
  persian: '#a8d4dc', // turquoise tile
  bahai: '#d4c8e0', // soft lavender
  japanese: '#e8d0d8', // cherry blossom blush
  minguo: '#d0dce8', // republic blue-grey
  koreanDangi: '#e4dce8', // soft hanbok lavender
  juche: '#d8d0e0', // muted Juche violet-grey
  thaiBuddhist: '#e0d4a8', // temple saffron gold
  bengali: '#d8e8c8', // monsoon green
  nepali: '#dce8d0', // Himalayan foothill green
  isoWeek: '#c8d8ec', // standards blue
  discordian: '#e0b8e8', // fnord purple
  indianCivil: '#ecd8b0', // saffron cream
  julianDay: '#b8c4d4', // astronomical slate
};

const MONO_ROW = '#e8e8e8';
const SEPIA_ROW = '#ebe0c8';

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
  sepia: ['#f8f0e0', '#ebe0c8', '#d4c4a0', '#b8a078', '#8b6914'],
  supporter: ['#e8edc8', '#b8e4c4', '#c8e8e4', '#d4c8e8', '#e0d4f0'],
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

export function getWidgetTextColor(
  _backgroundColor: string,
  context: Pick<CalendarColorContext, 'colorTheme' | 'colorScheme'>,
): string {
  return getCalendarRowTextStyle(_backgroundColor, context).foreground;
}

export type CalendarRowTextStyle = RowTextColors;

/** Foreground colors for calendar rows — always dark text on pastel backgrounds. */
export function getCalendarRowTextStyle(
  _backgroundColor: string,
  context: Pick<CalendarColorContext, 'colorTheme' | 'colorScheme'>,
): CalendarRowTextStyle {
  return rowTextColors(context.colorTheme);
}

export function getCalendarColor(
  id: CalendarId,
  context: CalendarColorContext,
  gradientIndex?: SupporterGradientIndex,
): string {
  if (context.colorTheme === 'mono') {
    return MONO_ROW;
  }

  if (context.colorTheme === 'sepia') {
    return SEPIA_ROW;
  }

  if (context.colorTheme === 'supporter') {
    if (gradientIndex) {
      return getSupporterThemeRowColor(gradientIndex.index, gradientIndex.total);
    }

    return getSupporterThemeRowColor(4, 9);
  }

  return context.calendarColors?.[id] ?? DEFAULT_CALENDAR_COLORS[id];
}

export function getCalendarMapColors(
  id: CalendarId,
  context: CalendarColorContext,
): { stroke: string; fill: string } {
  if (context.colorTheme === 'mono') {
    return {
      stroke: 'rgba(0, 0, 0, 0.28)',
      fill: '#9e9e9e',
    };
  }

  if (context.colorTheme === 'sepia') {
    return {
      stroke: 'rgba(61, 47, 31, 0.28)',
      fill: '#b8a078',
    };
  }

  const accent = getCalendarColor(id, context);

  return {
    stroke: 'rgba(0, 0, 0, 0.45)',
    fill: accent,
  };
}
