import {
  BahaiCalendar,
  ChineseCalendar,
  VietnameseCalendar,
  CopticCalendar,
  EthiopianCalendar,
  FrenchRepublicanCalendar,
} from 'calendar-converter/calendars';
import type {
  DiscordianCalendar,
  HebrewCalendar,
  IndianCivilCalendar,
  IslamicCalendar,
  IsoWeekCalendar,
  JapaneseWarekiCalendar,
  BengaliCalendar,
  MinguoCalendar,
  NepaliCalendar,
  KoreanDangiCalendar,
  JucheCalendar,
  PersianCalendar,
  ShahanshahiCalendar,
  SovietCalendar,
  ThaiBuddhistCalendar,
} from 'calendar-converter/calendars';
import type { CalendarId } from './calendarRegistry';
import type { IslamicCalendarMode } from './appSettings';

export type ScriptFont = 'latin' | 'arabic' | 'persian' | 'hebrew' | 'devanagari' | 'nepali' | 'bengali' | 'chinese' | 'vietnamese' | 'cyrillic' | 'ethiopic' | 'coptic' | 'japanese' | 'korean' | 'thai';

const ARABIC_DIGITS = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
const DEVANAGARI_DIGITS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];
const BENGALI_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
const THAI_DIGITS = ['๐', '๑', '๒', '๓', '๔', '๕', '๖', '๗', '๘', '๙'];

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
  'آدینه',
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
  'יום ראשון',
  'יום שני',
  'יום שלישי',
  'יום רביעי',
  'יום חמישי',
  'יום שישי',
  'שבת',
];

const HEBREW_GEMATRIA_VALUES: ReadonlyArray<readonly [number, string]> = [
  [400, 'ת'],
  [300, 'ש'],
  [200, 'ר'],
  [100, 'ק'],
  [90, 'צ'],
  [80, 'פ'],
  [70, 'ע'],
  [60, 'ס'],
  [50, 'נ'],
  [40, 'מ'],
  [30, 'ל'],
  [20, 'כ'],
  [10, 'י'],
  [9, 'ט'],
  [8, 'ח'],
  [7, 'ז'],
  [6, 'ו'],
  [5, 'ה'],
  [4, 'ד'],
  [3, 'ג'],
  [2, 'ב'],
  [1, 'א'],
];

function hebrewGematriaLetters(value: number): string {
  if (value <= 0) {
    return '';
  }

  let remaining = value;
  let letters = '';
  for (const [amount, letter] of HEBREW_GEMATRIA_VALUES) {
    while (remaining >= amount) {
      letters += letter;
      remaining -= amount;
    }
  }
  return letters;
}

function applyHebrewNumeralPunctuation(letters: string): string {
  if (!letters) {
    return '';
  }
  if (letters.length === 1) {
    return `${letters}׳`;
  }
  return `${letters.slice(0, -1)}״${letters.slice(-1)}`;
}

function formatHebrewDayNumeral(day: number): string {
  if (day === 15) {
    return 'ט״ו';
  }
  if (day === 16) {
    return 'ט״ז';
  }
  return applyHebrewNumeralPunctuation(hebrewGematriaLetters(day));
}

function formatHebrewYearNumeral(year: number): string {
  if (year >= 5000) {
    return `ה׳${applyHebrewNumeralPunctuation(hebrewGematriaLetters(year - 5000))}`;
  }
  return applyHebrewNumeralPunctuation(hebrewGematriaLetters(year));
}

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

const BENGALI_MONTHS = [
  'বৈশাখ',
  'জ্যৈষ্ঠ',
  'আষাঢ়',
  'শ্রাবণ',
  'ভাদ্র',
  'আশ্বিন',
  'কার্তিক',
  'অগ্রহায়ণ',
  'পৌষ',
  'মাঘ',
  'ফাল্গুন',
  'চৈত্র',
];

const BENGALI_WEEKDAYS = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার',
];

const NEPALI_MONTHS = [
  'बैशाख',
  'जेठ',
  'असार',
  'साउन',
  'भदौ',
  'असोज',
  'कात्तिक',
  'मंसिर',
  'पुष',
  'माघ',
  'फागुन',
  'चैत',
];

const NEPALI_WEEKDAYS = [
  'आइतबार',
  'सोमबार',
  'मंगलबार',
  'बुधबार',
  'बिहिबार',
  'शुक्रबार',
  'शनिबार',
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

const VIETNAMESE_MONTHS = [
  'Giêng',
  'Hai',
  'Ba',
  'Tư',
  'Năm',
  'Sáu',
  'Bảy',
  'Tám',
  'Chín',
  'Mười',
  'Mười Một',
  'Chạp',
];

const VIETNAMESE_WEEKDAYS = [
  'Chủ nhật',
  'Thứ hai',
  'Thứ ba',
  'Thứ tư',
  'Thứ năm',
  'Thứ sáu',
  'Thứ bảy',
];

function vietnameseMonthLabel(month: number, isLeap: boolean, english: boolean): string {
  const name = VIETNAMESE_MONTHS[month - 1] ?? '';
  if (english) {
    return isLeap ? `Leap ${name}` : name;
  }
  return isLeap ? `tháng nhuận ${name}` : `tháng ${name}`;
}

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

const ETHIOPIAN_MONTHS = [
  'መስከረም',
  'ጥቅምት',
  'ኅዳር',
  'ታህሣሥ',
  'ጥር',
  'የካቲት',
  'መጋቢት',
  'ሚያዝያ',
  'ግንቦት',
  'ሰኔ',
  'ሐምሌ',
  'ነሐሴ',
  'ጳጉሜ',
];

const ETHIOPIAN_WEEKDAYS = [
  'እሑድ',
  'ሰኞ',
  'ማክሰኞ',
  'ረቡዕ',
  'ሐሙስ',
  'ዓርብ',
  'ቅዳሜ',
];

const COPTIC_MONTHS = [
  'Ⲑⲱⲟⲩⲧ',
  'Ⲡⲁⲟⲡⲓ',
  'Ⲁⲑⲱⲣ',
  'Ⲕⲟⲓⲁⲕ',
  'Ⲧⲱⲃⲓ',
  'Ⲙⲉϣⲓⲣ',
  'Ⲡⲁⲣⲉⲙϩⲁⲧ',
  'Ⲡⲁⲣⲉⲙⲟⲩⲇⲉ',
  'Ⲡⲁϣⲟⲛⲥ',
  'Ⲡⲁⲱⲛⲓ',
  'Ⲉⲡⲓⲡ',
  'Ⲙⲉⲥⲱⲣⲓ',
  'Ⲛⲁⲥⲓⲉ',
];

const COPTIC_WEEKDAYS = [
  'ⲧⲕⲩⲣⲓⲁⲕⲏ',
  'ⲡⲉⲥⲛⲁⲩ',
  'ⲡⲥⲟⲙⲉⲛⲧ',
  'ⲡⲉϥⲧⲟⲟⲩ',
  'ⲡⲓⲧⲟⲩ',
  'ⲡⲓⲥⲟⲩ',
  'ⲡⲥⲁⲃⲃⲁⲧⲟⲛ',
];

const BAHAI_MONTHS_AR = [
  'بهاء',
  'جلال',
  'جمال',
  'عظمة',
  'نور',
  'رحمة',
  'كلمات',
  'كمال',
  'أسماء',
  'عزة',
  'مشية',
  'علم',
  'قدرة',
  'قول',
  'مسائل',
  'شرف',
  'سلطان',
  'ملك',
  'أيام الهاء',
  'علاء',
];

const BAHAI_WEEKDAYS_AR = [
  'جمال',
  'كمال',
  'فضل',
  'عدل',
  'استجلال',
  'استقلال',
  'جلال',
];

const JAPANESE_WEEKDAYS = [
  '日曜日',
  '月曜日',
  '火曜日',
  '水曜日',
  '木曜日',
  '金曜日',
  '土曜日',
];

const KOREAN_WEEKDAYS = [
  '일요일',
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
];

const THAI_MONTHS = [
  'มกราคม',
  'กุมภาพันธ์',
  'มีนาคม',
  'เมษายน',
  'พฤษภาคม',
  'มิถุนายน',
  'กรกฎาคม',
  'สิงหาคม',
  'กันยายน',
  'ตุลาคม',
  'พฤศจิกายน',
  'ธันวาคม',
];

const THAI_WEEKDAYS = [
  'วันอาทิตย์',
  'วันจันทร์',
  'วันอังคาร',
  'วันพุธ',
  'วันพฤหัสบดี',
  'วันศุกร์',
  'วันเสาร์',
];

function toThaiDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => THAI_DIGITS[Number(digit)])
    .join('');
}

function toArabicDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => ARABIC_DIGITS[Number(digit)])
    .join('');
}

function toPersianDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => PERSIAN_DIGITS[Number(digit)])
    .join('');
}

export { toPersianDigits };

export function toDevanagariDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => DEVANAGARI_DIGITS[Number(digit)])
    .join('');
}

function toBengaliDigits(value: number): string {
  return String(value)
    .split('')
    .map((digit) => BENGALI_DIGITS[Number(digit)])
    .join('');
}

export function scriptFontForCalendar(id: CalendarId, transliterateToEnglish: boolean): ScriptFont {
  if (transliterateToEnglish) {
    return 'latin';
  }

  switch (id) {
    case 'islamic':
      return 'arabic';
    case 'persian':
      return 'persian';
    case 'shahanshahi':
      return 'persian';
    case 'hebrew':
      return 'hebrew';
    case 'indianCivil':
      return 'devanagari';
    case 'bengali':
      return 'bengali';
    case 'nepali':
      return 'nepali';
    case 'chinese':
      return 'chinese';
    case 'vietnamese':
      return transliterateToEnglish ? 'latin' : 'vietnamese';
    case 'soviet':
      return 'cyrillic';
    case 'ethiopian':
      return 'ethiopic';
    case 'coptic':
      return 'coptic';
    case 'bahai':
      return 'arabic';
    case 'japanese':
    case 'minguo':
      return 'japanese';
    case 'koreanDangi':
      return 'korean';
    case 'juche':
      return 'korean';
    case 'thaiBuddhist':
      return 'thai';
    default:
      return 'latin';
  }
}

export function bahaiMonthName(month: number): string {
  return BAHAI_MONTHS_AR[month - 1] ?? '';
}

export function nepaliMonthName(month: number): string {
  return NEPALI_MONTHS[month - 1] ?? '';
}

export function formatIslamicNative(calendar: IslamicCalendar): string {
  const month = ISLAMIC_MONTHS_AR[calendar.month - 1] ?? '';
  return `${toArabicDigits(calendar.day)} ${month} ${toArabicDigits(calendar.year)}`;
}

export function formatIslamicEnglish(calendar: IslamicCalendar): string {
  return `${calendar.day} ${calendar.getMonthName()}, ${calendar.year}`;
}

export function islamicCalendarSystemLabel(
  mode: IslamicCalendarMode,
  transliterateToEnglish: boolean,
): string {
  if (transliterateToEnglish) {
    return mode === 'ummAlQura' ? 'Umm al-Qura' : 'Tabular';
  }

  return mode === 'ummAlQura' ? 'أُمُّ القُرَى' : 'جَدَوْلِي';
}

export function persianMonthName(month: number): string {
  return PERSIAN_MONTHS_FA[month - 1] ?? '';
}

export function formatPersianNative(calendar: PersianCalendar): string {
  const month = persianMonthName(calendar.month);
  return `${toPersianDigits(calendar.day)} ${month} ${toPersianDigits(calendar.year)}`;
}

export function formatPersianEnglish(calendar: PersianCalendar): string {
  return `${calendar.getMonthName()} ${calendar.day}, ${calendar.year}`;
}

export function formatShahanshahiNative(calendar: ShahanshahiCalendar): string {
  const month = persianMonthName(calendar.month);
  return `${toPersianDigits(calendar.day)} ${month} ${toPersianDigits(calendar.year)}`;
}

export function formatShahanshahiEnglish(calendar: ShahanshahiCalendar): string {
  return `${calendar.getMonthName()} ${calendar.day}, ${calendar.year}`;
}

export function formatHebrewNative(calendar: HebrewCalendar): string {
  const month = HEBREW_MONTHS[calendar.month - 1] ?? '';
  return `${formatHebrewDayNumeral(calendar.day)} ${month} ${formatHebrewYearNumeral(calendar.year)}`;
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
  return `${calendar.day} ${calendar.getMonthName()}, ${calendar.year}`;
}

export function chineseYearDetailLabel(calendar: ChineseCalendar): string {
  const pillar = ChineseCalendar.YearPillar(calendar.year);
  return `Year of the ${pillar.zodiacEnglish}, ${pillar.sexagenaryPinyin}`;
}

export function formatVietnameseNative(calendar: VietnameseCalendar): string {
  const month = vietnameseMonthLabel(calendar.month, calendar.isLeapMonth, false);
  return `Ngày ${calendar.day} ${month} năm ${calendar.year}`;
}

export function formatVietnameseEnglish(calendar: VietnameseCalendar): string {
  const month = vietnameseMonthLabel(calendar.month, calendar.isLeapMonth, true);
  return `${calendar.day} ${month}, ${calendar.year}`;
}

export function vietnameseYearDetailLabel(
  calendar: VietnameseCalendar,
  transliterateToEnglish: boolean,
): string {
  const pillar = VietnameseCalendar.YearPillar(calendar.year);
  if (transliterateToEnglish) {
    return `Year of the ${pillar.zodiacEnglish}, ${pillar.sexagenaryEnglish}`;
  }
  return `Năm ${pillar.zodiac}, ${pillar.sexagenary}`;
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

export function formatEthiopianNative(calendar: EthiopianCalendar): string {
  const month = ETHIOPIAN_MONTHS[calendar.month - 1] ?? '';
  return `${calendar.day} ${month} ${calendar.year}`;
}

export function formatEthiopianEnglish(calendar: EthiopianCalendar): string {
  return calendar.getDate();
}

export function formatCopticNativeParts(calendar: CopticCalendar): {
  day: string;
  month: string;
  year: string;
} {
  const month = COPTIC_MONTHS[calendar.month - 1] ?? '';
  return {
    day: String(calendar.day),
    month,
    year: String(calendar.year),
  };
}

export function formatCopticNative(calendar: CopticCalendar): string {
  const { day, month, year } = formatCopticNativeParts(calendar);
  return `${day} ${month} ${year}`;
}

export function formatCopticEnglish(calendar: CopticCalendar): string {
  return calendar.getDate();
}

export function formatBahaiNative(calendar: BahaiCalendar): string {
  const month = bahaiMonthName(calendar.month);
  return `${calendar.day} ${month} ${calendar.year}`;
}

export function formatBahaiEnglish(calendar: BahaiCalendar): string {
  return calendar.getDate();
}

export function formatJapaneseNative(calendar: JapaneseWarekiCalendar): string {
  const era = calendar.getEraNameJa();
  const yearPart = calendar.eraYear === 1 ? '元' : String(calendar.eraYear);
  return `${era}${yearPart}年${calendar.month}月${calendar.day}日`;
}

export function formatJapaneseEnglish(calendar: JapaneseWarekiCalendar): string {
  const era = calendar.getEraName();
  const yearPart = calendar.eraYear === 1 ? 'Gannen' : String(calendar.eraYear);
  return `${era} ${yearPart}, ${calendar.getMonthName()} ${calendar.day}`;
}

export function formatThaiBuddhistNative(calendar: ThaiBuddhistCalendar): string {
  const month = THAI_MONTHS[calendar.month - 1] ?? '';
  return `${toThaiDigits(calendar.day)} ${month} ${toThaiDigits(calendar.year)}`;
}

export function formatThaiBuddhistEnglish(calendar: ThaiBuddhistCalendar): string {
  return calendar.getDate();
}

export function formatBengaliNative(calendar: BengaliCalendar): string {
  const month = BENGALI_MONTHS[calendar.month - 1] ?? '';
  return `${toBengaliDigits(calendar.day)} ${month} ${toBengaliDigits(calendar.year)}`;
}

export function formatBengaliEnglish(calendar: BengaliCalendar): string {
  return calendar.getDate();
}

export function formatNepaliNative(calendar: NepaliCalendar): string {
  const month = NEPALI_MONTHS[calendar.month - 1] ?? '';
  return `${toDevanagariDigits(calendar.day)} ${month} ${toDevanagariDigits(calendar.year)}`;
}

export function formatNepaliEnglish(calendar: NepaliCalendar): string {
  return calendar.getDate();
}

export function formatKoreanDangiNative(calendar: KoreanDangiCalendar): string {
  return `${calendar.year}년 ${calendar.month}월 ${calendar.day}일`;
}

export function formatKoreanDangiEnglish(calendar: KoreanDangiCalendar): string {
  return calendar.getDate();
}

export function formatJucheNative(calendar: JucheCalendar): string {
  return `주체${calendar.year}년 ${calendar.month}월 ${calendar.day}일`;
}

export function formatJucheEnglish(calendar: JucheCalendar): string {
  return calendar.getDate();
}

export function formatMinguoNative(calendar: MinguoCalendar): string {
  return `民國${calendar.year}年${calendar.month}月${calendar.day}日`;
}

export function formatMinguoEnglish(calendar: MinguoCalendar): string {
  return calendar.getDate();
}

export function formatIsoWeekNative(calendar: IsoWeekCalendar): string {
  return calendar.getDate();
}

export function formatIsoWeekEnglish(calendar: IsoWeekCalendar): string {
  const week = String(calendar.month).padStart(2, '0');
  return `${calendar.year} Week ${calendar.month} (${week}), ${calendar.getWeekDay()}`;
}

export function formatDiscordianNative(calendar: DiscordianCalendar): string {
  return calendar.getDate();
}

export function formatDiscordianEnglish(calendar: DiscordianCalendar): string {
  return calendar.getDate();
}

const ROMAN_NUMERAL_VALUES: Array<[number, string]> = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

function toRomanNumeral(value: number): string {
  let remaining = value;
  let roman = '';
  for (const [amount, numeral] of ROMAN_NUMERAL_VALUES) {
    while (remaining >= amount) {
      roman += numeral;
      remaining -= amount;
    }
  }
  return roman;
}

export function formatFrenchRepublicanDate(
  calendar: FrenchRepublicanCalendar,
  useRomanYear: boolean,
): string {
  if (calendar.year < 1) {
    return '';
  }

  const yearPart = useRomanYear ? toRomanNumeral(calendar.year) : String(calendar.year);
  return `${calendar.dayLongform} ${calendar.getMonthName()}, ${yearPart}`;
}

const ISO_WEEKDAYS = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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
    case 'shahanshahi':
      return PERSIAN_WEEKDAYS_FA[weekdayIndex];
    case 'hebrew':
      return HEBREW_WEEKDAYS[weekdayIndex];
    case 'indianCivil':
      return INDIAN_WEEKDAYS_HI[weekdayIndex];
    case 'bengali':
      return BENGALI_WEEKDAYS[weekdayIndex];
    case 'nepali':
      return NEPALI_WEEKDAYS[weekdayIndex];
    case 'chinese':
      return CHINESE_WEEKDAYS[weekdayIndex];
    case 'vietnamese':
      return VIETNAMESE_WEEKDAYS[weekdayIndex];
    case 'soviet':
      return SOVIET_WEEKDAYS[weekdayIndex];
    case 'ethiopian':
      return ETHIOPIAN_WEEKDAYS[weekdayIndex];
    case 'coptic':
      return COPTIC_WEEKDAYS[weekdayIndex];
    case 'bahai':
      return BAHAI_WEEKDAYS_AR[weekdayIndex];
    case 'japanese':
      return JAPANESE_WEEKDAYS[weekdayIndex];
    case 'koreanDangi':
      return KOREAN_WEEKDAYS[weekdayIndex];
    case 'juche':
      return KOREAN_WEEKDAYS[weekdayIndex];
    case 'minguo':
      return CHINESE_WEEKDAYS[weekdayIndex];
    case 'thaiBuddhist':
      return THAI_WEEKDAYS[weekdayIndex];
    case 'isoWeek':
      return ISO_WEEKDAYS[weekdayIndex];
    case 'discordian':
      return undefined;
    default:
      return undefined;
  }
}
