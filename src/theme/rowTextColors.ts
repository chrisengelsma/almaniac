import type { ColorTheme } from '../lib/appSettings';

export const ROW_TEXT_PRIMARY = '#1e2a31';
export const ROW_TEXT_MUTED = '#4f5f68';
export const ROW_TEXT_SHADOW = 'none';

const SEPIA_TEXT_PRIMARY = '#2e2216';
const SEPIA_TEXT_MUTED = '#6b5344';
const MONO_TEXT_PRIMARY = '#1a1a1a';
const MONO_TEXT_MUTED = '#5c5c5c';

export interface RowTextColors {
  foreground: string;
  foregroundMuted: string;
  textShadow: string;
}

/** Dark foreground for text on pastel row backgrounds (all themes and color schemes). */
export function rowTextColors(colorTheme: ColorTheme): RowTextColors {
  if (colorTheme === 'sepia') {
    return {
      foreground: SEPIA_TEXT_PRIMARY,
      foregroundMuted: SEPIA_TEXT_MUTED,
      textShadow: ROW_TEXT_SHADOW,
    };
  }

  if (colorTheme === 'mono') {
    return {
      foreground: MONO_TEXT_PRIMARY,
      foregroundMuted: MONO_TEXT_MUTED,
      textShadow: ROW_TEXT_SHADOW,
    };
  }

  return {
    foreground: ROW_TEXT_PRIMARY,
    foregroundMuted: ROW_TEXT_MUTED,
    textShadow: ROW_TEXT_SHADOW,
  };
}
