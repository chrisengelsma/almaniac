const GLYPH_ROOT = '/maya-glyphs';

export const MAYA_LONG_PERIOD_GLYPHS = ['baktun', 'katun', 'tun', 'uinal', 'kin'] as const;

export function mayaNumeralSrc(value: number): string {
  return `${GLYPH_ROOT}/numerals/${value}.png`;
}

export function mayaLongPeriodSrc(index: number): string {
  return `${GLYPH_ROOT}/long/long${index}.png`;
}

export function mayaTzolkinSrc(dayIndex: number): string {
  return `${GLYPH_ROOT}/tzolkin/${dayIndex}.png`;
}

export function mayaHaabSrc(monthIndex: number): string {
  return `${GLYPH_ROOT}/haab/${monthIndex}.png`;
}

export function mayaLordOfNightSrc(lord: number): string {
  return `${GLYPH_ROOT}/night/g${lord}.png`;
}
