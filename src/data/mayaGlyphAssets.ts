const GLYPH_ROOT = '/maya-glyphs';

export const MAYA_LONG_PERIOD_GLYPHS = ['baktun', 'katun', 'tun', 'uinal', 'kin'] as const;

export function mayaNumeralSrc(value: number): string {
  return `${GLYPH_ROOT}/numerals/${value}.svg`;
}

export function mayaLongPeriodSrc(index: number): string {
  return `${GLYPH_ROOT}/long/long${index}.svg`;
}

export function mayaTzolkinSrc(dayIndex: number): string {
  return `${GLYPH_ROOT}/tzolkin/${dayIndex}.svg`;
}

export function mayaHaabSrc(monthIndex: number): string {
  return `${GLYPH_ROOT}/haab/${monthIndex}.svg`;
}

export function mayaLordOfNightSrc(lord: number): string {
  return `${GLYPH_ROOT}/night/g${lord}.svg`;
}
