export type ThemeBehavior = 'distinct' | 'mono' | 'sepia' | 'supporter';

export type ColorThemeId = 'distinct' | 'mono' | 'sepia' | 'supporter';

export type ColorTheme = ColorThemeId;

const BASE_THEME_SWATCHES = {
  distinct: ['#d4dfe8', '#e6d5c3', '#b8d4b0', '#c8d4ec', '#e8dfa0'],
  mono: ['#f5f5f5', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#616161'],
  sepia: ['#f8f0e0', '#ebe0c8', '#d4c4a0', '#b8a078', '#8b6914'],
  supporter: ['#e8edc8', '#b8e4c4', '#4a9e9a', '#6a5a9a', '#7d5cad'],
} as const;

export interface ThemePaletteEntry {
  id: ColorThemeId;
  labelKey: string;
  previewColors: readonly string[];
  behavior: ThemeBehavior;
  supporterOnly?: boolean;
}

export const THEME_PALETTE: readonly ThemePaletteEntry[] = [
  {
    id: 'distinct',
    labelKey: 'settings.colorThemeDistinct',
    previewColors: BASE_THEME_SWATCHES.distinct,
    behavior: 'distinct',
  },
  {
    id: 'mono',
    labelKey: 'settings.colorThemeMono',
    previewColors: BASE_THEME_SWATCHES.mono,
    behavior: 'mono',
  },
  {
    id: 'sepia',
    labelKey: 'settings.colorThemeSepia',
    previewColors: BASE_THEME_SWATCHES.sepia,
    behavior: 'sepia',
  },
  {
    id: 'supporter',
    labelKey: 'settings.colorThemeSupporter',
    previewColors: BASE_THEME_SWATCHES.supporter,
    behavior: 'supporter',
    supporterOnly: true,
  },
];

export const DEFAULT_COLOR_THEME: ColorThemeId = 'distinct';

export const COLOR_THEME_IDS: ColorThemeId[] = THEME_PALETTE.map((entry) => entry.id);

export function getThemePaletteEntry(id: ColorThemeId): ThemePaletteEntry {
  return THEME_PALETTE.find((entry) => entry.id === id) ?? THEME_PALETTE[0];
}

export function getThemeBehavior(id: ColorThemeId): ThemeBehavior {
  return getThemePaletteEntry(id).behavior;
}

export function isSupporterOnlyTheme(id: ColorThemeId): boolean {
  return getThemePaletteEntry(id).supporterOnly === true;
}

export function isValidColorTheme(value: unknown): value is ColorThemeId {
  return typeof value === 'string' && COLOR_THEME_IDS.includes(value as ColorThemeId);
}

export function normalizeColorTheme(value: unknown): ColorThemeId {
  if (value === 'teal') {
    return 'supporter';
  }

  return isValidColorTheme(value) ? value : DEFAULT_COLOR_THEME;
}
