import type { CalendarId } from '../lib/calendarRegistry';
import type { ColorScheme } from '../lib/appSettings';
import type { ColorThemeId } from './themePalette';
import { getThemeBehavior } from './themePalette';
import { rowTextColorsForBackground, type RowTextColors } from './rowTextColors';

export type CalendarColorMap = Record<CalendarId, string>;

export interface CalendarColorContext {
  colorTheme: ColorThemeId;
  colorScheme: ColorScheme;
  calendarColors?: Partial<CalendarColorMap>;
}

export interface SupporterGradientIndex {
  index: number;
  total: number;
}

const SUPPORTER_GRADIENT_LIGHT_START = { h: 72, s: 48, l: 86 };
const SUPPORTER_GRADIENT_LIGHT_END = { h: 168, s: 42, l: 78 };
const SUPPORTER_GRADIENT_DARK_START = { h: 172, s: 58, l: 42 };
const SUPPORTER_GRADIENT_DARK_END = { h: 282, s: 54, l: 46 };

export function getSupporterThemeRowColor(
  index: number,
  total: number,
  colorScheme: ColorScheme = 'light',
): string {
  const start =
    colorScheme === 'dark' ? SUPPORTER_GRADIENT_DARK_START : SUPPORTER_GRADIENT_LIGHT_START;
  const end = colorScheme === 'dark' ? SUPPORTER_GRADIENT_DARK_END : SUPPORTER_GRADIENT_LIGHT_END;
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
  shahanshahi: '#9cc8d8', // imperial turquoise
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

const DISTINCT_DARK_ROW = '#263238';
const MONO_LIGHT_ROW = '#e8e8e8';
const MONO_DARK_ROW = '#2a2a2a';

const SEPIA_LIGHT_ROW = '#ebe0c8';
const SEPIA_DARK_ROW = '#3d3228';

/** Five-swatch previews for the color-theme picker in settings. */
export const COLOR_THEME_SWATCHES: Record<
  'distinct' | 'mono' | 'sepia' | 'supporter',
  readonly string[]
> = {
  distinct: [
    DEFAULT_CALENDAR_COLORS.gregorian,
    DEFAULT_CALENDAR_COLORS.julian,
    DEFAULT_CALENDAR_COLORS.islamic,
    DEFAULT_CALENDAR_COLORS.hebrew,
    DEFAULT_CALENDAR_COLORS.frc,
  ],
  mono: ['#f5f5f5', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#616161'],
  sepia: ['#f8f0e0', '#ebe0c8', '#d4c4a0', '#b8a078', '#8b6914'],
  supporter: ['#e8edc8', '#b8e4c4', '#4a9e9a', '#6a5a9a', '#7d5cad'],
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

export function getCalendarAccentColor(
  id: CalendarId,
  context: CalendarColorContext,
): string {
  return context.calendarColors?.[id] ?? DEFAULT_CALENDAR_COLORS[id];
}

export function getWidgetTextColor(
  backgroundColor: string,
  context: Pick<CalendarColorContext, 'colorTheme' | 'colorScheme'>,
  accentColor?: string,
): string {
  return getCalendarRowTextStyle(backgroundColor, context, accentColor).foreground;
}

export type CalendarRowTextStyle = RowTextColors;

/** Foreground colors tuned for text sitting on each calendar row background. */
export function getCalendarRowTextStyle(
  backgroundColor: string,
  context: Pick<CalendarColorContext, 'colorTheme' | 'colorScheme'>,
  accentColor?: string,
): CalendarRowTextStyle {
  return rowTextColorsForBackground(
    backgroundColor,
    context.colorTheme,
    context.colorScheme,
    accentColor,
  );
}

export function getCalendarColor(
  id: CalendarId,
  context: CalendarColorContext,
  gradientIndex?: SupporterGradientIndex,
): string {
  const behavior = getThemeBehavior(context.colorTheme);

  if (behavior === 'mono') {
    return context.colorScheme === 'dark' ? MONO_DARK_ROW : MONO_LIGHT_ROW;
  }

  if (behavior === 'sepia') {
    return context.colorScheme === 'dark' ? SEPIA_DARK_ROW : SEPIA_LIGHT_ROW;
  }

  if (behavior === 'supporter') {
    if (gradientIndex) {
      return getSupporterThemeRowColor(
        gradientIndex.index,
        gradientIndex.total,
        context.colorScheme,
      );
    }

    return getSupporterThemeRowColor(4, 9, context.colorScheme);
  }

  if (context.colorScheme === 'dark') {
    return DISTINCT_DARK_ROW;
  }

  return getCalendarAccentColor(id, context);
}

export function getCalendarMapColors(
  id: CalendarId,
  context: CalendarColorContext,
): { stroke: string; fill: string } {
  const behavior = getThemeBehavior(context.colorTheme);

  if (behavior === 'mono') {
    if (context.colorScheme === 'dark') {
      return {
        stroke: 'rgba(255, 255, 255, 0.35)',
        fill: '#bdbdbd',
      };
    }

    return {
      stroke: 'rgba(0, 0, 0, 0.28)',
      fill: '#616161',
    };
  }

  if (behavior === 'sepia') {
    if (context.colorScheme === 'dark') {
      return {
        stroke: 'rgba(232, 220, 200, 0.35)',
        fill: '#c4a882',
      };
    }

    return {
      stroke: 'rgba(61, 47, 31, 0.28)',
      fill: '#8b6914',
    };
  }

  const accent = getCalendarColor(id, context);
  const stroke =
    context.colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.55)';

  return {
    stroke,
    fill: accent,
  };
}
