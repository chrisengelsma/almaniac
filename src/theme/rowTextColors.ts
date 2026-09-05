import type { ColorScheme } from '../lib/appSettings';
import type { ColorThemeId } from '../theme/themePalette';
import { getThemeBehavior } from '../theme/themePalette';

export const ROW_TEXT_PRIMARY = '#1e2a31';
export const ROW_TEXT_MUTED = '#4f5f68';
export const ROW_TEXT_SHADOW =
  '0 1px 0 rgba(255, 255, 255, 0.62), 0 1px 3px rgba(10, 20, 28, 0.16)';

const SEPIA_TEXT_PRIMARY = '#2e2216';
const SEPIA_TEXT_MUTED = '#6b5344';
const MONO_TEXT_PRIMARY = '#1a1a1a';
const MONO_TEXT_MUTED = '#5c5c5c';

const DARK_TEXT_PRIMARY = '#eceff1';
const DARK_TEXT_MUTED = 'rgba(236, 239, 241, 0.78)';
const DARK_TEXT_SHADOW = '0 1px 2px rgba(0, 0, 0, 0.42), 0 0 1px rgba(0, 0, 0, 0.28)';

const SUPPORTER_DARK_TEXT_PRIMARY = '#e8fff9';
const SUPPORTER_DARK_TEXT_MUTED = 'rgba(232, 255, 249, 0.78)';
const SUPPORTER_DARK_TEXT_SHADOW =
  '0 1px 3px rgba(0, 0, 0, 0.5), 0 0 10px rgba(255, 255, 255, 0.1)';

export interface RowTextColors {
  foreground: string;
  foregroundMuted: string;
  textShadow: string;
}

interface Rgb {
  r: number;
  g: number;
  b: number;
}

function parseCssColor(color: string): Rgb | null {
  const trimmed = color.trim();

  if (trimmed.startsWith('#')) {
    const raw = trimmed.slice(1);
    const expanded =
      raw.length === 3
        ? raw
            .split('')
            .map((char) => char + char)
            .join('')
        : raw;

    if (expanded.length !== 6) {
      return null;
    }

    return {
      r: Number.parseInt(expanded.slice(0, 2), 16),
      g: Number.parseInt(expanded.slice(2, 4), 16),
      b: Number.parseInt(expanded.slice(4, 6), 16),
    };
  }

  const hslMatch = trimmed.match(/^hsla?\(([^)]+)\)$/i);
  if (!hslMatch) {
    return null;
  }

  const [hRaw, sRaw, lRaw] = hslMatch[1].split(',').map((part) => part.trim());
  const hue = Number.parseFloat(hRaw);
  const saturation = Number.parseFloat(sRaw) / 100;
  const lightness = Number.parseFloat(lRaw) / 100;

  if ([hue, saturation, lightness].some((value) => Number.isNaN(value))) {
    return null;
  }

  const chroma = (1 - Math.abs(2 * lightness - 1)) * saturation;
  const huePrime = hue / 60;
  const x = chroma * (1 - Math.abs((huePrime % 2) - 1));
  let r1 = 0;
  let g1 = 0;
  let b1 = 0;

  if (huePrime >= 0 && huePrime < 1) {
    r1 = chroma;
    g1 = x;
  } else if (huePrime < 2) {
    r1 = x;
    g1 = chroma;
  } else if (huePrime < 3) {
    g1 = chroma;
    b1 = x;
  } else if (huePrime < 4) {
    g1 = x;
    b1 = chroma;
  } else if (huePrime < 5) {
    r1 = x;
    b1 = chroma;
  } else {
    r1 = chroma;
    b1 = x;
  }

  const match = lightness - chroma / 2;

  return {
    r: Math.round((r1 + match) * 255),
    g: Math.round((g1 + match) * 255),
    b: Math.round((b1 + match) * 255),
  };
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (value: number) => {
    const normalized = value / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Dark foreground for text on light row backgrounds. */
export function rowTextColors(colorTheme: ColorThemeId): RowTextColors {
  if (getThemeBehavior(colorTheme) === 'sepia') {
    return {
      foreground: SEPIA_TEXT_PRIMARY,
      foregroundMuted: SEPIA_TEXT_MUTED,
      textShadow: ROW_TEXT_SHADOW,
    };
  }

  if (getThemeBehavior(colorTheme) === 'mono') {
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

function mutedAccentColor(color: string): string {
  const parsed = parseCssColor(color);
  if (!parsed) {
    return color;
  }

  return `rgba(${parsed.r}, ${parsed.g}, ${parsed.b}, 0.82)`;
}

export function distinctDarkRowTextColors(accentColor: string): RowTextColors {
  return {
    foreground: accentColor,
    foregroundMuted: mutedAccentColor(accentColor),
    textShadow: DARK_TEXT_SHADOW,
  };
}

export function sepiaDarkRowTextColors(): RowTextColors {
  return {
    foreground: '#e8dcc8',
    foregroundMuted: 'rgba(232, 220, 200, 0.78)',
    textShadow: DARK_TEXT_SHADOW,
  };
}

function darkRowTextColors(colorTheme: ColorThemeId): RowTextColors {
  if (getThemeBehavior(colorTheme) === 'supporter') {
    return {
      foreground: SUPPORTER_DARK_TEXT_PRIMARY,
      foregroundMuted: SUPPORTER_DARK_TEXT_MUTED,
      textShadow: SUPPORTER_DARK_TEXT_SHADOW,
    };
  }

  return {
    foreground: DARK_TEXT_PRIMARY,
    foregroundMuted: DARK_TEXT_MUTED,
    textShadow: DARK_TEXT_SHADOW,
  };
}

/** Foreground colors tuned for each row background. */
export function rowTextColorsForBackground(
  backgroundColor: string,
  colorTheme: ColorThemeId,
  colorScheme: ColorScheme,
  accentColor?: string,
): RowTextColors {
  const behavior = getThemeBehavior(colorTheme);

  if (behavior === 'distinct') {
    if (colorScheme === 'dark') {
      return accentColor
        ? distinctDarkRowTextColors(accentColor)
        : darkRowTextColors(colorTheme);
    }

    return rowTextColors(colorTheme);
  }

  if (colorScheme === 'dark') {
    if (behavior === 'sepia') {
      return sepiaDarkRowTextColors();
    }
  }

  const parsed = parseCssColor(backgroundColor);
  if (!parsed) {
    return colorScheme === 'dark'
      ? darkRowTextColors(colorTheme)
      : rowTextColors(colorTheme);
  }

  if (relativeLuminance(parsed) >= 0.55) {
    return rowTextColors(colorTheme);
  }

  return darkRowTextColors(colorTheme);
}
