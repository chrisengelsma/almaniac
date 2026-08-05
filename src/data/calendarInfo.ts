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
  chinese: {
    id: 'chinese',
    calendarType: 'lunisolar',
    firstImplemented: 'c. 14th century BCE (legendary); fixed rules c. 104 BCE',
    history:
      'The traditional Chinese calendar (农历) follows lunar months anchored by solar terms. Leap months keep festivals aligned with seasons. It governs cultural holidays such as Lunar New Year and the Mid-Autumn Festival; the Gregorian calendar is used for civil administration in China.',
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
      'A purely lunar calendar of twelve months totaling about 354 days. Months begin at the sighting of the new crescent. It marks religious observances and is the official calendar in many Muslim-majority countries.',
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
