import { describe, expect, it } from 'vitest';
import { buildWidgetSnapshot, WIDGET_TIMELINE_DAY_COUNT } from '../widgetData';
import { shiftGregorianDate, todayGregorianDate } from '../calendarRegistry';
import { testSettings } from './testFixtures';

describe('buildWidgetSnapshot', () => {
  it('precomputes daily widget dates through the timeline horizon', () => {
    const anchor = todayGregorianDate();
    const snapshot = buildWidgetSnapshot(anchor, testSettings(), new Date());
    const gregorian = snapshot.calendars.gregorian;

    expect(gregorian.daily).toBeDefined();
    expect(Object.keys(gregorian.daily ?? {})).toHaveLength(WIDGET_TIMELINE_DAY_COUNT);

    const tomorrow = shiftGregorianDate(anchor, 1);
    const tomorrowKey = `${tomorrow.year}-${String(tomorrow.month).padStart(2, '0')}-${String(tomorrow.day).padStart(2, '0')}`;
    const tomorrowDaily = gregorian.daily?.[tomorrowKey];

    expect(tomorrowDaily?.date).toBeTruthy();
    expect(tomorrowDaily?.date).not.toBe(gregorian.date);
  });
});
