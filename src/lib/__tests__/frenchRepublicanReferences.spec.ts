import { describe, expect, it } from 'vitest';
import { FrenchRepublicanCalendar, GregorianCalendar } from 'calendar-converter/calendars';
import { FrenchRepublicanCalendarConstants } from 'calendar-converter/constants';
import {
  formatFrenchRepublicanDate,
  frenchRepublicanAgriculturalDayName,
  frenchRepublicanComplementaryDayName,
  frenchRepublicanDecadeDayName,
} from '../nativeCalendarText';
import { getAllCalendarEntries } from '../calendarRegistry';
import { TEST_CALENDAR_COPY, testSettings } from './testFixtures';

/** First month day names per Wikipedia / frenchrepublicancalendar.com. */
const VENDEMIAIRE_DAY_NAMES = [
  'Raisin', 'Safran', 'Châtaigne', 'Colchique', 'Cheval',
  'Balsamine', 'Carotte', 'Amaranthe', 'Panais', 'Cuve',
  'Pomme de terre', 'Immortelle', 'Potiron', 'Réséda', 'Âne',
  'Belle de nuit', 'Citrouille', 'Sarrasin', 'Tournesol', 'Pressoir',
  'Chanvre', 'Pêche', 'Navet', 'Amaryllis', 'Bœuf',
  'Aubergine', 'Piment', 'Tomate', 'Orge', 'Tonneau',
];

const DECADE_WEEKDAYS = [
  'Primidi', 'Duodi', 'Tridi', 'Quartidi', 'Quintidi',
  'Sextidi', 'Septidi', 'Octidi', 'Nonidi', 'Décadi',
];

/** Equinox-based conversion spot checks (calendar-converter + Delambre-style year boundaries). */
const REFERENCE_DATES: {
  gregorian: [number, number, number];
  year: number;
  month: number;
  week: number;
  dayInDecade: number;
  dayOfMonth: number;
  decadeWeekday: string;
  agricultural?: string;
  complementaryFeast?: string;
}[] = [
  {
    gregorian: [1792, 9, 22],
    year: 1,
    month: 1,
    week: 1,
    dayInDecade: 1,
    dayOfMonth: 1,
    decadeWeekday: 'Primidi',
    agricultural: 'Raisin',
  },
  {
    gregorian: [1792, 9, 26],
    year: 1,
    month: 1,
    week: 1,
    dayInDecade: 5,
    dayOfMonth: 5,
    decadeWeekday: 'Quintidi',
    agricultural: 'Cheval',
  },
  {
    gregorian: [2025, 9, 5],
    year: 233,
    month: 12,
    week: 2,
    dayInDecade: 9,
    dayOfMonth: 19,
    decadeWeekday: 'Nonidi',
    agricultural: 'Tagette',
  },
  {
    gregorian: [2025, 9, 17],
    year: 233,
    month: 13,
    week: 1,
    dayInDecade: 1,
    dayOfMonth: 1,
    decadeWeekday: '',
    complementaryFeast: 'La Fête de la Vertu',
  },
  {
    gregorian: [2025, 9, 21],
    year: 233,
    month: 13,
    week: 1,
    dayInDecade: 5,
    dayOfMonth: 5,
    decadeWeekday: '',
    complementaryFeast: 'La Fête des Récompenses',
  },
  {
    gregorian: [2025, 9, 22],
    year: 234,
    month: 1,
    week: 1,
    dayInDecade: 1,
    dayOfMonth: 1,
    decadeWeekday: 'Primidi',
    agricultural: 'Raisin',
  },
  {
    gregorian: [2026, 9, 21],
    year: 234,
    month: 13,
    week: 1,
    dayInDecade: 5,
    dayOfMonth: 5,
    decadeWeekday: '',
    complementaryFeast: 'La Fête des Récompenses',
  },
];

describe('French Republican name tables', () => {
  it('lists ten décade weekdays in standard order', () => {
    expect(FrenchRepublicanCalendarConstants.weekDayNames).toEqual(DECADE_WEEKDAYS);
    for (let day = 1; day <= 10; day += 1) {
      expect(frenchRepublicanDecadeDayName(day)).toBe(DECADE_WEEKDAYS[day - 1]);
    }
  });

  it('has thirty rural day names per regular month', () => {
    for (let month = 0; month < 12; month += 1) {
      expect(FrenchRepublicanCalendarConstants.dayNames[month]).toHaveLength(30);
    }
    expect(FrenchRepublicanCalendarConstants.dayNames[12]).toHaveLength(6);
  });

  it('matches Wikipedia for Vendémiaire rural names', () => {
    expect(FrenchRepublicanCalendarConstants.dayNames[0]).toEqual(VENDEMIAIRE_DAY_NAMES);
  });

  it('uses decree titles for complementary feasts', () => {
    expect(frenchRepublicanComplementaryDayName(1)).toBe('La Fête de la Vertu');
    expect(frenchRepublicanComplementaryDayName(2)).toBe('La Fête du Génie');
    expect(frenchRepublicanComplementaryDayName(3)).toBe('La Fête du Travail');
    expect(frenchRepublicanComplementaryDayName(6)).toBe('La Fête de la Révolution');
  });
});

describe('French Republican reference dates', () => {
  for (const ref of REFERENCE_DATES) {
    const label = ref.gregorian.join('-');
    it(`matches conversion for ${label}`, () => {
      const anchor = new GregorianCalendar(...ref.gregorian);
      const frc = new FrenchRepublicanCalendar(anchor);

      expect(frc.year).toBe(ref.year);
      expect(frc.month).toBe(ref.month);
      expect(frc.week).toBe(ref.week);
      expect(frc.day).toBe(ref.dayInDecade);
      expect(frc.dayLongform).toBe(ref.dayOfMonth);
      expect(frc.getWeekDay()).toBe(ref.decadeWeekday);

      if (ref.agricultural) {
        expect(frenchRepublicanAgriculturalDayName(frc)).toBe(ref.agricultural);
        expect(frenchRepublicanDecadeDayName(frc.day)).toBe(ref.decadeWeekday);
      }

      if (ref.complementaryFeast) {
        expect(frenchRepublicanComplementaryDayName(frc.day)).toBe(ref.complementaryFeast);
      }
    });
  }

  it('formats epoch per standard references', () => {
    const anchor = new GregorianCalendar(1792, 9, 22);
    const entry = getAllCalendarEntries(['frc'], anchor, testSettings(), TEST_CALENDAR_COPY)[0];

    expect(entry.weekday).toBe('Primidi');
    expect(entry.date).toBe('Raisin, 1 Vendémiaire, I');
  });

  it('shows complementary feast on last day of republican year 233', () => {
    const frc = new FrenchRepublicanCalendar(new GregorianCalendar(2025, 9, 21));
    expect(formatFrenchRepublicanDate(frc, true)).toBe('La Fête des Récompenses, CCXXXIII');
  });

  it('starts year 234 on autumn equinox 2025', () => {
    const frc = new FrenchRepublicanCalendar(new GregorianCalendar(2025, 9, 22));
    expect(formatFrenchRepublicanDate(frc, true)).toBe('Raisin, 1 Vendémiaire, CCXXXIV');
  });
});
