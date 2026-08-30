import type { CalendarId } from '../lib/calendarRegistry';

export type CalendarSystemType = 'solar' | 'lunar' | 'lunisolar' | 'mixed' | 'continuous';

/** ISO 3166-1 alpha-2 country codes, or `all` to highlight every country on the map. */
export type MapHighlight = string[] | 'all';

export interface CalendarInfo {
  id: CalendarId;
  calendarType: CalendarSystemType;
  firstImplemented: string;
  history: string;
  usedIn: string[];
  mapCountries: MapHighlight;
}

const ISLAMIC_COUNTRIES = [
  'SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE', 'EG', 'LY', 'SD', 'MA', 'DZ', 'TN', 'MR',
  'ML', 'NE', 'SN', 'GM', 'BF', 'SO', 'DJ', 'KM', 'ID', 'MY', 'PK', 'AF', 'BD', 'TR',
  'JO', 'PS', 'IQ', 'SY', 'LB', 'IR', 'BN', 'MV', 'AZ', 'UZ', 'TM', 'TJ', 'KG', 'KZ',
  'AL', 'BA', 'NG', 'TD', 'ER', 'ET', 'UG', 'TZ', 'KE', 'MW', 'MZ', 'SL', 'GW', 'CI',
  'GA', 'CM', 'GQ', 'CG', 'CD', 'BI', 'RW', 'SC', 'MU', 'LK',
] as const;

const JULIAN_CHURCH_COUNTRIES = ['BG', 'BY', 'ET', 'GE', 'GR', 'MD', 'ME', 'MK', 'RS', 'RU', 'UA'] as const;

const HEBREW_COUNTRIES = ['IL', 'US', 'CA', 'GB', 'FR', 'DE', 'AU', 'AR', 'BR', 'ZA', 'MX', 'RU', 'UA'] as const;

export const CALENDAR_INFO: Record<CalendarId, CalendarInfo> = {
  gregorian: {
    id: 'gregorian',
    calendarType: 'solar',
    firstImplemented: '1582 CE',
    history:
      'Introduced by Pope Gregory XIII to correct drift in the Julian calendar. Leap years skip century years unless divisible by 400. Adopted gradually across Europe and the Americas, it is now the international civil standard.',
    usedIn: [
      'United States',
      'Canada',
      'Mexico',
      'Brazil',
      'United Kingdom',
      'France',
      'Germany',
      'Italy',
      'Spain',
      'Australia',
      'Japan',
      'China (civil use)',
      'India (civil use)',
      'Most of the world',
    ],
    mapCountries: 'all',
  },
  julian: {
    id: 'julian',
    calendarType: 'solar',
    firstImplemented: '45 BCE; revised 1923 CE',
    history:
      'Reformed by Julius Caesar from the Roman republican calendar. It uses a simple leap-year rule (every fourth year) and remains the liturgical calendar of several Eastern Orthodox churches. The Revised Julian (Milanković) calendar uses a more accurate leap-year rule and matches the Gregorian calendar from 1923 through 2800; many Orthodox churches use it for fixed feasts.',
    usedIn: [
      'Russia (until 1918)',
      'Eastern Orthodox churches',
      'Ethiopia (with variations)',
      'Serbia',
      'Jerusalem Patriarchate',
      'Mount Athos',
      'Greece, Romania, Bulgaria (Revised Julian for fixed feasts)',
    ],
    mapCountries: [...JULIAN_CHURCH_COUNTRIES],
  },
  ethiopian: {
    id: 'ethiopian',
    calendarType: 'solar',
    firstImplemented: 'c. 4th century CE',
    history:
      'A solar calendar of thirteen 30-day months plus a short epagomenal period (Pagume). It shares the Julian leap-year rule and is about seven to eight years behind the Gregorian calendar. Ethiopia uses it alongside the Gregorian calendar for civil and religious life.',
    usedIn: ['Ethiopia', 'Eritrean Orthodox communities'],
    mapCountries: ['ET', 'ER'],
  },
  coptic: {
    id: 'coptic',
    calendarType: 'solar',
    firstImplemented: 'c. 3rd century CE',
    history:
      'The liturgical calendar of the Coptic Orthodox Church, structurally identical to the Ethiopian calendar but reckoned from the era of the martyrs (Anno Martyrum). New Year falls on 11 September in the Gregorian calendar (12 September in a leap year before the Gregorian leap).',
    usedIn: ['Egypt', 'Coptic Orthodox Church worldwide'],
    mapCountries: ['EG'],
  },
  chinese: {
    id: 'chinese',
    calendarType: 'lunisolar',
    firstImplemented: 'c. 14th century BCE (legendary); fixed rules c. 104 BCE',
    history:
      'The traditional Chinese calendar (农历) follows lunar months anchored by solar terms, with years named by the sexagenary cycle (干支) of heavenly stems and earthly branches. Each year also carries a zodiac animal (生肖). Leap months keep festivals aligned with seasons.',
    usedIn: ['China', 'Taiwan', 'Hong Kong', 'Macau', 'Singapore', 'Malaysia', 'Overseas Chinese communities'],
    mapCountries: ['CN', 'TW', 'HK', 'MO', 'SG', 'MY'],
  },
  vietnamese: {
    id: 'vietnamese',
    calendarType: 'lunisolar',
    firstImplemented: 'c. 14th century BCE (legendary); fixed rules c. 104 BCE',
    history:
      'The Vietnamese lunisolar calendar (âm lịch) shares astronomical rules with the Chinese calendar but uses Vietnamese month names and cultural conventions, notably the Cat (Mèo) instead of Rabbit for the fourth zodiac animal. Years are named by the Can-Chi sexagenary cycle. Tết Nguyên Đán marks the lunar new year.',
    usedIn: ['Vietnam', 'Vietnamese communities worldwide'],
    mapCountries: ['VN'],
  },
  soviet: {
    id: 'soviet',
    calendarType: 'solar',
    firstImplemented: '1929 CE',
    history:
      'Introduced during Stalin’s industrialization drive, this revolutionary calendar replaced seven-day weeks with five-day production cycles and restructured the year into twelve 30-day months plus national holidays. The Gregorian calendar remained in parallel for daily life; the experiment was abandoned by 1940.',
    usedIn: ['Soviet Union (1929–1940)'],
    mapCountries: ['RU', 'BY', 'UA', 'KZ', 'UZ', 'GE', 'AM', 'AZ', 'LT', 'LV', 'EE', 'MD', 'TJ', 'TM', 'KG'],
  },
  frc: {
    id: 'frc',
    calendarType: 'solar',
    firstImplemented: '1793 CE',
    history:
      'Created during the French Revolution to decimalize timekeeping. Years began at the autumn equinox; months and weeks were renamed and restructured. Napoleon abolished it in 1806; Paris Commune briefly revived it in 1871.',
    usedIn: ['France (1793–1805)', 'Paris Commune (1871)'],
    mapCountries: ['FR'],
  },
  maya: {
    id: 'maya',
    calendarType: 'mixed',
    firstImplemented: 'c. 500 BCE',
    history:
      'The Classic Maya used interlocking cycles: the 260-day Tzolkʼin, the 365-day Haab, and the Long Count that tracks days from a mythic creation date. This display uses the Long Count notation familiar from monuments and codices.',
    usedIn: ['Mexico', 'Guatemala', 'Belize', 'Honduras', 'El Salvador'],
    mapCountries: ['MX', 'GT', 'BZ', 'HN', 'SV'],
  },
  islamic: {
    id: 'islamic',
    calendarType: 'lunar',
    firstImplemented: '622 CE (Hijra epoch)',
    history:
      'A lunar calendar of twelve months totaling about 354 days. This app supports tabular (arithmetic) conversion and the Umm al-Qura calendar used officially in Saudi Arabia (1300–1600 AH). An optional ±1 day adjustment can fine-tune displayed dates for local moon-sighting practice.',
    usedIn: [
      'Saudi Arabia',
      'Egypt',
      'Pakistan',
      'Iran (alongside Solar Hijri)',
      'Turkey (for religious dates)',
      'Indonesia',
      'Malaysia',
      'Morocco',
      'United Arab Emirates',
    ],
    mapCountries: [...ISLAMIC_COUNTRIES],
  },
  hebrew: {
    id: 'hebrew',
    calendarType: 'lunisolar',
    firstImplemented: 'c. 4th century CE (fixed rules)',
    history:
      'Months follow lunar months, with a leap month added in seven of every nineteen years to keep festivals aligned with seasons. The fixed arithmetic calendar replaced observation-based reckoning around the time of Hillel II.',
    usedIn: ['Israel', 'Jewish communities worldwide'],
    mapCountries: [...HEBREW_COUNTRIES],
  },
  persian: {
    id: 'persian',
    calendarType: 'solar',
    firstImplemented: '1079 CE (Jalali reform)',
    history:
      'Also called the Solar Hijri calendar. Months are tied to the vernal equinox, making Nowruz the new year. Omar Khayyam helped refine its leap-year structure; modern Iran and Afghanistan use refined versions.',
    usedIn: ['Iran', 'Afghanistan'],
    mapCountries: ['IR', 'AF'],
  },
  bahai: {
    id: 'bahai',
    calendarType: 'solar',
    firstImplemented: '1844 CE',
    history:
      'The Badíʿ calendar has nineteen months of nineteen days, with intercalary days (Ayyám-i-Há) before the month of fasting. Naw-Rúz is fixed to the vernal equinox in Tehran. Year 1 began at the declaration of the Báb in 1844.',
    usedIn: ['Baháʼí communities worldwide'],
    mapCountries: 'all',
  },
  japanese: {
    id: 'japanese',
    calendarType: 'solar',
    firstImplemented: '1873 CE (Gregorian months adopted)',
    history:
      'Japan’s official civil calendar pairs Gregorian months and leap years with Japanese era names (年号). Each reign begins a new era year counted from 1 (元年, gannen); Reiwa began on 1 May 2019. Dates are written with the era name, year, month, and day.',
    usedIn: ['Japan'],
    mapCountries: ['JP'],
  },
  minguo: {
    id: 'minguo',
    calendarType: 'solar',
    firstImplemented: '1912 CE (Republic of China founded)',
    history:
      'The Minguo calendar numbers years from the founding of the Republic of China in 1912. Year 1 corresponds to 1912 CE; dates otherwise follow the Gregorian month and day structure. It remains in official use in Taiwan alongside the Western year.',
    usedIn: ['Taiwan'],
    mapCountries: ['TW'],
  },
  koreanDangi: {
    id: 'koreanDangi',
    calendarType: 'solar',
    firstImplemented: '2333 BCE (Dangun era); modern use from 1948 CE',
    history:
      'The Dangi calendar (단기, 檀紀) numbers years from the legendary founding of Gojoseon by Dangun. Year 1 is 2333 BCE, so the Dangi year is the Gregorian year plus 2333. South Korea uses it on some official documents and nationalistic occasions alongside the Western year.',
    usedIn: ['South Korea', 'Korean diaspora communities'],
    mapCountries: ['KR'],
  },
  juche: {
    id: 'juche',
    calendarType: 'solar',
    firstImplemented: '1997 CE (official adoption)',
    history:
      'The Juche calendar (주체, “self-reliance”) numbers years from 1912, the birth year of Kim Il-sung. Year 1 corresponds to 1912 CE; dates otherwise follow the Gregorian month and day structure. It appears on official DPRK documents alongside the Western year.',
    usedIn: ['DPRK'],
    mapCountries: ['KP'],
  },
  thaiBuddhist: {
    id: 'thaiBuddhist',
    calendarType: 'solar',
    firstImplemented: 'c. 1st century BCE (BE epoch); official BE dates from 1888 CE',
    history:
      'Thailand’s civil calendar follows the Gregorian structure but numbers years in the Buddhist Era (BE), which is 543 years ahead of the Common Era. It is used on official documents, newspapers, and everyday life alongside the Western year.',
    usedIn: ['Thailand'],
    mapCountries: ['TH'],
  },
  bengali: {
    id: 'bengali',
    calendarType: 'solar',
    firstImplemented: '593 CE (traditional); revised in 1987 CE (Bangladesh)',
    history:
      'The Bengali calendar is used in Bangladesh and West Bengal. The Bangladesh revised calendar fixes Pohela Boishakh on 14 April with six 31-day months, five 30-day months, and a variable-length Choitro. Years are counted from the traditional Bengali era.',
    usedIn: ['Bangladesh', 'West Bengal (India)'],
    mapCountries: ['BD', 'IN'],
  },
  nepali: {
    id: 'nepali',
    calendarType: 'solar',
    firstImplemented: '57 BCE (traditional era); official civil use from 1960 CE',
    history:
      'Bikram Sambat (BS) is Nepal’s official civil calendar. The year begins in mid-April on Baisakh 1, with months of fixed lengths and an extra day in leap years. Years run about 57 years ahead of the Gregorian calendar.',
    usedIn: ['Nepal', 'Nepali diaspora communities'],
    mapCountries: ['NP'],
  },
  indianCivil: {
    id: 'indianCivil',
    calendarType: 'solar',
    firstImplemented: '1957 CE (official adoption)',
    history:
      'The Indian national calendar (Śaka era) aligns months with the tropical zodiac. Chaitra, the first month, begins near the March equinox. It is used alongside the Gregorian calendar for government gazettes and radio broadcasts.',
    usedIn: ['India'],
    mapCountries: ['IN'],
  },
  isoWeek: {
    id: 'isoWeek',
    calendarType: 'mixed',
    firstImplemented: '1988 CE (ISO 8601)',
    history:
      'The ISO week date system numbers weeks Monday through Sunday, with week 1 defined as the week containing January 4. It is widely used in business planning, manufacturing, payroll, and international standards to avoid ambiguity at year boundaries.',
    usedIn: [
      'European Union (business and statistics)',
      'Nordic countries',
      'International standards bodies',
      'Manufacturing and logistics worldwide',
    ],
    mapCountries: ['DE', 'FR', 'SE', 'NO', 'FI', 'NL', 'BE', 'AT', 'CH', 'PL', 'CZ', 'DK'],
  },
  discordian: {
    id: 'discordian',
    calendarType: 'solar',
    firstImplemented: '1963 CE (Principia Discordia)',
    history:
      'A parody religion calendar from the Principia Discordia, aligned to the Gregorian year. Each year has five 73-day seasons (Chaos, Discord, Confusion, Bureaucracy, and The Aftermath) and a five-day week. Leap years gain St. Tib\'s Day between Chaos 59 and 60. Years are counted in YOLD (Year of Our Lady of Discord), Gregorian year plus 1166.',
    usedIn: [
      'United States (origin)',
      'Australia',
      'Canada',
      'Ireland',
      'New Zealand',
      'United Kingdom',
      'Online communities worldwide',
    ],
    mapCountries: ['US', 'CA', 'GB', 'IE', 'AU', 'NZ'],
  },
  julianDay: {
    id: 'julianDay',
    calendarType: 'continuous',
    firstImplemented: '1583 CE (Scaliger)',
    history:
      'Not a civil calendar but a continuous day count used by astronomers and historians. Julian Day 0 begins at noon on 1 January 4713 BCE (proleptic Julian). It avoids ambiguity when comparing dates across calendar systems.',
    usedIn: ['Astronomy', 'Space science', 'Historical research worldwide'],
    mapCountries: 'all',
  },
};

export const CALENDAR_TYPE_LABELS: Record<CalendarSystemType, string> = {
  solar: 'Solar',
  lunar: 'Lunar',
  lunisolar: 'Lunisolar',
  mixed: 'Mixed cycles',
  continuous: 'Continuous count',
};
