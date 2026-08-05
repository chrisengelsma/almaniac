/** Format an astronomical year for display (45 BCE = -44, 1 CE = 1). */
export function formatHistoricalYear(year: number): string {
  if (year <= 0) {
    return `${1 - year} BCE`;
  }

  return `${year} CE`;
}
