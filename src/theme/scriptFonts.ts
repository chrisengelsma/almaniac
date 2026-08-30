/**
 * Script fonts chosen for uniform (monolinear) stroke width.
 *
 * IBM Plex Sans is a grotesque family with the same design language across scripts,
 * without the thick/thin contrast of calligraphic faces like Noto Naskh Arabic.
 */
export const SCRIPT_FONTS = {
  arabic: '"IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif',
  persian: '"Vazirmatn", "IBM Plex Sans Arabic", "IBM Plex Sans", sans-serif',
  hebrew: '"IBM Plex Sans Hebrew", "IBM Plex Sans", sans-serif',
  devanagari: '"IBM Plex Sans Devanagari", "IBM Plex Sans", sans-serif',
  nepali: '"Noto Sans Devanagari", "IBM Plex Sans Devanagari", "IBM Plex Sans", sans-serif',
  bengali: '"Noto Sans Bengali", sans-serif',
  chinese: '"IBM Plex Sans SC", "IBM Plex Sans", sans-serif',
  cyrillic: '"IBM Plex Sans", sans-serif',
  ethiopic: '"Noto Sans Ethiopic", sans-serif',
  coptic: '"Noto Sans Coptic", sans-serif',
  japanese: '"IBM Plex Sans JP", "IBM Plex Sans", sans-serif',
  korean: '"IBM Plex Sans KR", "IBM Plex Sans", sans-serif',
  thai: '"IBM Plex Sans Thai", "IBM Plex Sans", sans-serif',
} as const;
