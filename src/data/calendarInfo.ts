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
    firstImplemented: '45 BCE',
    history:
      'Reformed by Julius Caesar from the Roman republican calendar. It uses a simple leap-year rule (every fourth year) and remains the liturgical calendar of several Eastern Orthodox churches.',
    usedIn: [
      'Russia (until 1918)',
      'Eastern Orthodox churches',
      'Ethiopia (with variations)',
      'Serbia',
      'Jerusalem Patriarchate',
      'Mount Athos',
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
      'The traditional Chinese calendar (农历) follows lunar months anchored by solar terms, with years named by the sexagenary cycle (干支) of heavenly stems and earthly branches — each year also carries a zodiac animal (生肖). Leap months keep festivals aligned with seasons.',
    usedIn: ['China', 'Taiwan', 'Hong Kong', 'Macau', 'Singapore', 'Malaysia', 'Overseas Chinese communities'],
    mapCountries: ['CN', 'TW', 'HK', 'MO', 'SG', 'MY'],
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
      'The Classic Maya used interlocking cycles—the 260-day Tzolkʼin, the 365-day Haab, and the Long Count that tracks days from a mythic creation date. This display uses the Long Count notation familiar from monuments and codices.',
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
  indianCivil: {
    id: 'indianCivil',
    calendarType: 'solar',
    firstImplemented: '1957 CE (official adoption)',
    history:
      'The Indian national calendar (Śaka era) aligns months with the tropical zodiac. Chaitra, the first month, begins near the March equinox. It is used alongside the Gregorian calendar for government gazettes and radio broadcasts.',
    usedIn: ['India'],
    mapCountries: ['IN'],
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
