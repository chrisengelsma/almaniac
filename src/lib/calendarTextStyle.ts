import { SCRIPT_FONTS } from '../theme/scriptFonts';
import type { ScriptFont } from './nativeCalendarText';

const SCRIPT_CLASS: Record<ScriptFont, string> = {
  latin: '',
  arabic: 'calendar-row__text--rtl',
  persian: 'calendar-row__text--rtl',
  hebrew: 'calendar-row__text--rtl',
  devanagari: '',
  nepali: '',
  bengali: '',
  chinese: '',
  vietnamese: '',
  cyrillic: '',
  ethiopic: '',
  coptic: '',
  japanese: '',
  korean: '',
  thai: '',
};

const SCRIPT_LANG: Record<ScriptFont, string | undefined> = {
  latin: undefined,
  arabic: 'ar',
  persian: 'fa',
  hebrew: 'he',
  devanagari: 'hi',
  nepali: 'ne',
  bengali: 'bn',
  chinese: 'zh',
  vietnamese: 'vi',
  cyrillic: 'ru',
  ethiopic: 'am',
  coptic: 'cop',
  japanese: 'ja',
  korean: 'ko',
  thai: 'th',
};

export function calendarTextClassName(scriptFont: ScriptFont): string {
  return SCRIPT_CLASS[scriptFont];
}

export function calendarTextLang(scriptFont: ScriptFont): string | undefined {
  return SCRIPT_LANG[scriptFont];
}

export function calendarTextStyle(scriptFont: ScriptFont): { fontFamily?: string } | undefined {
  if (scriptFont === 'latin') {
    return undefined;
  }

  const fontFamily = SCRIPT_FONTS[scriptFont];
  return fontFamily ? { fontFamily } : undefined;
}
