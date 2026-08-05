import type {
  ChineseCalendar,
  HebrewCalendar,
  IndianCivilCalendar,
  IslamicCalendar,
  PersianCalendar,
  SovietCalendar,
} from 'calendar-converter/calendars';
import type { CalendarId } from './calendarRegistry';

export type ScriptFont = 'latin' | 'arabic' | 'hebrew' | 'devanagari' | 'chinese' | 'cyrillic';

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

const ISLAMIC_MONTHS_AR = [
  'مُحَرَّم',
  'صَفَر',
  'رَبِيع الأَوَّل',
  'رَبِيع الآخِر',
  'جُمَادى الأولى',
  'جُمَادى الآخِرة',
  'رَجَب',
  'شَعْبَان',
  'رَمَضَان',
  'شَوَّال',
  'ذُو القَعْدَة',
  'ذُو الحِجَّة',
];

const ISLAMIC_WEEKDAYS_AR = [
  'الأَحَد',
  'الإثْنَيْن',
  'الثُّلاثاء',
  'الأَرْبِعاء',
  'الخَمِيس',
  'الجُمُعَة',
  'السَّبْت',
];

const PERSIAN_MONTHS_FA = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];

const PERSIAN_WEEKDAYS_FA = [
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنجشنبه',
  'جمعه',
  'شنبه',
];

const HEBREW_MONTHS = [
  'ניסן',
  'אייר',
  'סיוון',
  'תמוז',
  'אב',
  'אלול',
  'תשרי',
  'מרחשוון',
  'כסלו',
  'טבת',
  'שבט',
  'אדר',
  'אדר ב',
];

const HEBREW_WEEKDAYS = [
  'יוֹם רִאשׁוֹן',
  'יוֹם שֵׁנִי',
  'יוֹם שְׁלִישִׁי',
  'יוֹם רְבִיעִי',
  'יוֹם חֲמִישִׁי',
  'יוֹם שִׁשִׁי',
  'שַׁבָּת',
];

const INDIAN_MONTHS_HI = [
  'चैत्र',
  'वैशाख',
  'ज्येष्ठ',
  'आषाढ़',
  'श्रावण',
  'भाद्र',
  'आश्विन',
  'कार्तिक',
  'अग्रहायण',
  'पौष',
  'माघ',
  'फाल्गुन',
];

const INDIAN_WEEKDAYS_HI = [
  'रविवार',
  'सोमवार',
  'मंगलवार',
  'बुधवार',
  'गुरुवार',
  'शुक्रवार',
  'शनिवार',
];

const CHINESE_MONTHS = [
  '正月',
  '二月',
  '三月',
  '四月',
  '五月',
  '六月',
  '七月',
  '八月',
  '九月',
  '十月',
  '十一月',
  '腊月',
];

const CHINESE_WEEKDAYS = [
  '星期日',
  '星期一',
  '星期二',
  '星期三',
  '星期四',
  '星期五',
  '星期六',
];

const SOVIET_MONTHS = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
];

const SOVIET_WEEKDAYS = [
  'Первый день',
  'Второй день',
  'Третий день',
  'Четвёртый день',
  'Пятый день',
];

const SOVIET_EPAGOMENAL = [
  'День Ленина',
  'День труда I',
  'День труда II',
  'День индустрии I',
  'День индустрии II',
  'Високосный день',
];

function toArabicDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => ARABIC_DIGITS[Number(digit)])
    .join('');
}

function toDevanagariDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => DEVANAGARI_DIGITS[Number(digit)])
    .join('');
}

export function scriptFontForCalendar(id: CalendarId, transliterateToEnglish: boolean): ScriptFont {
  if (transliterateToEnglish) {
    return 'latin';
  }

  switch (id) {
    case 'islamic':
    case 'persian':
      return 'arabic';
    case 'hebrew':
      return 'hebrew';
    case 'indianCivil':
      return 'devanagari';
    case 'chinese':
      return 'chinese';
    case 'soviet':
      return 'cyrillic';
    default:
      return 'latin';
  }
}

export function formatIslamicNative(calendar: IslamicCalendar): string {
  const month = ISLAMIC_MONTHS_AR[calendar.month - 1] ?? '';
  return `${toArabicDigits(calendar.day)} ${month} ${toArabicDigits(calendar.year)}`;
}

export function formatIslamicEnglish(calendar: IslamicCalendar): string {
  return `${calendar.day} ${calendar.getMonthName()}, ${calendar.year}`;
}

export function formatPersianNative(calendar: PersianCalendar): string {
  const month = PERSIAN_MONTHS_FA[calendar.month - 1] ?? '';
  return `${toArabicDigits(calendar.day)} ${month} ${toArabicDigits(calendar.year)}`;
}

export function formatPersianEnglish(calendar: PersianCalendar): string {
  return `${calendar.getMonthName()} ${calendar.day}, ${calendar.year}`;
}

export function formatHebrewNative(calendar: HebrewCalendar): string {
  const month = HEBREW_MONTHS[calendar.month - 1] ?? '';
  return `${calendar.day} ${month} ${calendar.year}`;
}

export function formatHebrewEnglish(calendar: HebrewCalendar): string {
  return `${calendar.day} ${calendar.getMonthName()}, ${calendar.year}`;
}

export function formatIndianCivilNative(calendar: IndianCivilCalendar): string {
  const month = INDIAN_MONTHS_HI[calendar.month - 1] ?? '';
  return `${toDevanagariDigits(calendar.day)} ${month} ${toDevanagariDigits(calendar.year)}`;
}

export function formatIndianCivilEnglish(calendar: IndianCivilCalendar): string {
  return `${calendar.getMonthName()} ${calendar.day}, ${calendar.year}`;
}

export function formatChineseNative(calendar: ChineseCalendar): string {
  const month = CHINESE_MONTHS[calendar.month - 1] ?? '';
  const monthLabel = calendar.isLeapMonth ? `闰${month}` : month;
  return `${calendar.year}年${monthLabel}${calendar.day}日`;
}

export function formatChineseEnglish(calendar: ChineseCalendar): string {
  return calendar.getDate();
}

export function formatSovietNative(calendar: SovietCalendar): string {
  if (calendar.isEpagomenal) {
    const name = SOVIET_EPAGOMENAL[calendar.epagomenalIndex - 1] ?? calendar.getMonthName();
    return `${name}, ${calendar.year}`;
  }
  const month = SOVIET_MONTHS[calendar.month - 1] ?? calendar.getMonthName();
  return `${calendar.day} ${month}, ${calendar.year}`;
}

export function formatSovietEnglish(calendar: SovietCalendar): string {
  return calendar.getDate();
}

export function nativeWeekday(
  id: CalendarId,
  weekdayIndex: number,
  transliterateToEnglish: boolean,
): string | undefined {
  if (transliterateToEnglish) {
    return undefined;
  }

  switch (id) {
    case 'islamic':
      return ISLAMIC_WEEKDAYS_AR[weekdayIndex];
    case 'persian':
      return PERSIAN_WEEKDAYS_FA[weekdayIndex];
    case 'hebrew':
      return HEBREW_WEEKDAYS[weekdayIndex];
    case 'indianCivil':
      return INDIAN_WEEKDAYS_HI[weekdayIndex];
    case 'chinese':
      return CHINESE_WEEKDAYS[weekdayIndex];
    case 'soviet':
      return SOVIET_WEEKDAYS[weekdayIndex];
    default:
      return undefined;
  }
}
