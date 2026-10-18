import dailyData from '../data/javidnamDaily.json';

const BY_SOLAR_DATE = dailyData.bySolarDate as Record<string, string>;

export function javidnamForSolarDate(month: number, day: number): string | undefined {
  if (month < 1 || month > 12 || day < 1) {
    return undefined;
  }
  return BY_SOLAR_DATE[`${month}-${day}`];
}
