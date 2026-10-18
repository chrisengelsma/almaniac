/** Zoroastrian day-of-month names (1–30) and planetary weekday names (Iranian tradition). */

const ZOROASTRIAN_DAYS_FA = [
  'هرمزد',
  'بهمن',
  'اردیبهشت',
  'شهریور',
  'اسپندارمذ',
  'خرداد',
  'امرداد',
  'دی‌به‌آذر',
  'آذر',
  'آبان',
  'خورشید',
  'ماه',
  'تیر',
  'گوش',
  'دی‌به‌مهر',
  'مهر',
  'سروش',
  'رشن',
  'فروردین',
  'بهرام',
  'رام',
  'گواد',
  'دی‌به‌دین',
  'دین',
  'اشیشوَنگ',
  'اشتاد',
  'آسمان',
  'زامیاد',
  'مهرسپند',
  'انیران',
] as const;

const ZOROASTRIAN_DAYS_EN = [
  'Hormuzd',
  'Bahman',
  'Ordibehesht',
  'Shahrivar',
  'Espandarmaz',
  'Khordad',
  'Amordad',
  'Day-pa-Adar',
  'Adar',
  'Aban',
  'Khorshed',
  'Mah',
  'Tir',
  'Gush',
  'Day-pa-Mehr',
  'Mehr',
  'Soroush',
  'Rashn',
  'Farvardin',
  'Bahram',
  'Ram',
  'Govad',
  'Day-pa-Din',
  'Din',
  'Ashishvang',
  'Ashtad',
  'Asman',
  'Zamyad',
  'Marespand',
  'Aneran',
] as const;

/** Gregorian `getDay()` index: 0 = Sunday … 6 = Saturday. */
const PLANETARY_WEEKDAYS_FA = [
  'مهر‌شید',
  'ماه‌شید',
  'بهرام‌شید',
  'تیر‌شید',
  'هرمز‌شید',
  'ناهید‌شید',
  'کیوان‌شید',
] as const;

const PLANETARY_WEEKDAYS_EN = [
  'Mehr-shid',
  'Mah-shid',
  'Bahram-shid',
  'Tir-shid',
  'Hormoz-shid',
  'Nahid-shid',
  'Keyvan-shid',
] as const;

export function zoroastrianDayName(day: number, transliterateToEnglish: boolean): string | undefined {
  if (day < 1 || day > 30) {
    return undefined;
  }
  return transliterateToEnglish ? ZOROASTRIAN_DAYS_EN[day - 1] : ZOROASTRIAN_DAYS_FA[day - 1];
}

export function iranianPlanetaryWeekdayName(
  gregorianWeekdayIndex: number,
  transliterateToEnglish: boolean,
): string | undefined {
  if (gregorianWeekdayIndex < 0 || gregorianWeekdayIndex > 6) {
    return undefined;
  }
  return transliterateToEnglish
    ? PLANETARY_WEEKDAYS_EN[gregorianWeekdayIndex]
    : PLANETARY_WEEKDAYS_FA[gregorianWeekdayIndex];
}

export function iranianSolarTraditionDetailLabel(
  solarDay: number,
  gregorianWeekdayIndex: number,
  transliterateToEnglish: boolean,
): string | undefined {
  const dayName = zoroastrianDayName(solarDay, transliterateToEnglish);
  const weekdayName = iranianPlanetaryWeekdayName(gregorianWeekdayIndex, transliterateToEnglish);
  if (!dayName || !weekdayName) {
    return undefined;
  }
  return `${dayName} · ${weekdayName}`;
}
