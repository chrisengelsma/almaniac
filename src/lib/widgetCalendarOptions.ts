import type {
  AppSettings,
  IslamicCalendarMode,
  IslamicDayAdjustment,
  JulianCalendarMode,
} from './appSettings';
import type { CalendarId } from './calendarRegistry';

export interface WidgetDateVariant {
  label: string;
  calendarName: string;
  weekday: string;
  date: string;
  dateTransliterated: string;
}

export type WidgetCalendarOptionOverrides = Pick<
  AppSettings,
  | 'islamicCalendarMode'
  | 'islamicDayAdjustment'
  | 'julianCalendarMode'
  | 'mayaUseHieroglyphs'
  | 'frcUseRomanNumerals'
  | 'useModifiedJulianDay'
>;

const ISLAMIC_MODES: IslamicCalendarMode[] = ['tabular', 'ummAlQura'];
const ISLAMIC_ADJUSTMENTS: IslamicDayAdjustment[] = [-1, 0, 1];
const JULIAN_MODES: JulianCalendarMode[] = ['julian', 'revisedJulian'];

export function calendarHasWidgetOptions(calendarId: CalendarId): boolean {
  return (
    calendarId === 'islamic'
    || calendarId === 'julian'
    || calendarId === 'maya'
    || calendarId === 'frc'
    || calendarId === 'julianDay'
  );
}

export function widgetOptionCombinations(calendarId: CalendarId): WidgetCalendarOptionOverrides[] {
  switch (calendarId) {
    case 'islamic':
      return ISLAMIC_MODES.flatMap((islamicCalendarMode) =>
        ISLAMIC_ADJUSTMENTS.map((islamicDayAdjustment) => ({
          islamicCalendarMode,
          islamicDayAdjustment,
        })),
      );
    case 'julian':
      return JULIAN_MODES.map((julianCalendarMode) => ({ julianCalendarMode }));
    case 'maya':
      return [{ mayaUseHieroglyphs: true }, { mayaUseHieroglyphs: false }];
    case 'frc':
      return [{ frcUseRomanNumerals: true }, { frcUseRomanNumerals: false }];
    case 'julianDay':
      return [{ useModifiedJulianDay: false }, { useModifiedJulianDay: true }];
    default:
      return [];
  }
}

export function widgetVariantKey(
  calendarId: CalendarId,
  settings: Pick<AppSettings, keyof WidgetCalendarOptionOverrides>,
): string {
  switch (calendarId) {
    case 'islamic':
      return `${settings.islamicCalendarMode}:${settings.islamicDayAdjustment}`;
    case 'julian':
      return settings.julianCalendarMode;
    case 'maya':
      return settings.mayaUseHieroglyphs ? 'hieroglyphs' : 'latin';
    case 'frc':
      return settings.frcUseRomanNumerals ? 'roman' : 'arabic';
    case 'julianDay':
      return settings.useModifiedJulianDay ? 'modified' : 'standard';
    default:
      return 'default';
  }
}

export function widgetOptionsFromSettings(
  calendarId: CalendarId,
  settings: AppSettings,
): WidgetCalendarOptionOverrides {
  switch (calendarId) {
    case 'islamic':
      return {
        islamicCalendarMode: settings.islamicCalendarMode,
        islamicDayAdjustment: settings.islamicDayAdjustment,
      };
    case 'julian':
      return { julianCalendarMode: settings.julianCalendarMode };
    case 'maya':
      return { mayaUseHieroglyphs: settings.mayaUseHieroglyphs };
    case 'frc':
      return { frcUseRomanNumerals: settings.frcUseRomanNumerals };
    case 'julianDay':
      return { useModifiedJulianDay: settings.useModifiedJulianDay };
    default:
      return {};
  }
}
