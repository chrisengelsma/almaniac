export type AppLanguage =
  | 'en'
  | 'fr'
  | 'ar'
  | 'fa'
  | 'es'
  | 'de'
  | 'it'
  | 'pt'
  | 'ru'
  | 'zh'
  | 'ja'
  | 'ko'
  | 'hi'
  | 'tr'
  | 'id';

export type AppLanguagePreference = AppLanguage | 'system';

export const APP_LANGUAGES: AppLanguage[] = [
  'en',
  'fr',
  'ar',
  'fa',
  'es',
  'de',
  'it',
  'pt',
  'ru',
  'zh',
  'ja',
  'ko',
  'hi',
  'tr',
  'id',
];

export const LANGUAGE_LABELS: Record<AppLanguage, string> = {
  en: 'English',
  fr: 'Français',
  ar: 'العربية',
  fa: 'فارسی',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  pt: 'Português',
  ru: 'Русский',
  zh: '中文',
  ja: '日本語',
  ko: '한국어',
  hi: 'हिन्दी',
  tr: 'Türkçe',
  id: 'Bahasa Indonesia',
};

const LOCALE_MAP: Record<AppLanguage, string> = {
  en: 'en',
  fr: 'fr',
  ar: 'ar',
  fa: 'fa',
  es: 'es',
  de: 'de',
  it: 'it',
  pt: 'pt',
  ru: 'ru',
  zh: 'zh-CN',
  ja: 'ja',
  ko: 'ko',
  hi: 'hi',
  tr: 'tr',
  id: 'id',
};

export function isAppLanguage(value: unknown): value is AppLanguage {
  return typeof value === 'string' && APP_LANGUAGES.includes(value as AppLanguage);
}

export function isAppLanguagePreference(value: unknown): value is AppLanguagePreference {
  return value === 'system' || isAppLanguage(value);
}

export function toIntlLocale(language: AppLanguage): string {
  return LOCALE_MAP[language];
}

export function isRtlLanguage(language: AppLanguage): boolean {
  return language === 'ar' || language === 'fa';
}

export function detectSystemLanguage(): AppLanguage {
  if (typeof navigator === 'undefined') {
    return 'en';
  }

  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const candidate of candidates) {
    const normalized = candidate.toLowerCase();
    if (normalized.startsWith('fr')) return 'fr';
    if (normalized.startsWith('ar')) return 'ar';
    if (normalized.startsWith('fa') || normalized.startsWith('pes')) return 'fa';
    if (normalized.startsWith('es')) return 'es';
    if (normalized.startsWith('de')) return 'de';
    if (normalized.startsWith('it')) return 'it';
    if (normalized.startsWith('pt')) return 'pt';
    if (normalized.startsWith('ru')) return 'ru';
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('ja')) return 'ja';
    if (normalized.startsWith('ko')) return 'ko';
    if (normalized.startsWith('hi')) return 'hi';
    if (normalized.startsWith('tr')) return 'tr';
    if (normalized.startsWith('id')) return 'id';
    if (normalized.startsWith('en')) return 'en';
  }

  return 'en';
}

export function resolveAppLanguage(preference: AppLanguagePreference): AppLanguage {
  if (preference === 'system') {
    return detectSystemLanguage();
  }

  return preference;
}
