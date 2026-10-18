import { describe, expect, it } from 'vitest';
import { GregorianCalendar } from 'calendar-converter/calendars';
import {
  getAllCalendarEntries,
} from '../calendarRegistry';
import { iranianSolarTraditionDetailLabel } from '../iranianSolarTraditions';
import { javidnamForSolarDate } from '../javidnam';
import { TEST_CALENDAR_COPY, testSettings } from './testFixtures';

describe('iranianSolarTraditions', () => {
  it('labels Zoroastrian day 1 and Thursday planetary weekday in English', () => {
    const anchor = new GregorianCalendar(2025, 3, 20);
    expect(anchor.getWeekDayNumber()).toBe(4);
    expect(iranianSolarTraditionDetailLabel(1, anchor.getWeekDayNumber(), true)).toBe(
      'Hormuzd · Hormoz-shid',
    );
  });

  it('adds tradition and Javidnam lines on Persian and Shahanshahi rows', () => {
    const anchor = new GregorianCalendar(2025, 3, 20);
    const settings = testSettings({
      transliterateToEnglish: true,
      showIranianSolarTraditions: true,
      showJavidnamDaily: true,
    });
    const persian = getAllCalendarEntries(['persian'], anchor, settings, TEST_CALENDAR_COPY)[0];
    const shahanshahi = getAllCalendarEntries(['shahanshahi'], anchor, settings, TEST_CALENDAR_COPY)[0];

    expect(persian.detailLabel).toBe('Hormuzd · Hormoz-shid');
    expect(shahanshahi.detailLabel).toBe('Hormuzd · Hormoz-shid');
    expect(persian.secondaryDetailLabel).toBe(javidnamForSolarDate(1, 1));
    expect(shahanshahi.secondaryDetailLabel).toBe(javidnamForSolarDate(1, 1));
  });

  it('hides extras when settings are off', () => {
    const anchor = new GregorianCalendar(2025, 3, 20);
    const settings = testSettings({
      showIranianSolarTraditions: false,
      showJavidnamDaily: false,
    });
    const persian = getAllCalendarEntries(['persian'], anchor, settings, TEST_CALENDAR_COPY)[0];

    expect(persian.detailLabel).toBeUndefined();
    expect(persian.secondaryDetailLabel).toBeUndefined();
  });
});
