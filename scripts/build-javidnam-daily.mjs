/**
 * Builds a compact solar-date → name map for the daily Javidnam line.
 * Source: https://github.com/TheRealHizha/JavidNaman (MIT) — names only.
 * Run: node scripts/build-javidnam-daily.mjs
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const SOURCE_URL =
  'https://raw.githubusercontent.com/TheRealHizha/JavidNaman/main/assets/javidnams_data.json';

const PERSIAN_MONTH_LENGTHS = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];

function stableIndex(month, day, length) {
  const seed = month * 397 + day * 1013;
  return ((seed * 2654435761) >>> 0) % length;
}

const response = await fetch(SOURCE_URL);
if (!response.ok) {
  throw new Error(`Failed to fetch Javidnam source: ${response.status}`);
}

const people = await response.json();
const names = people.map((row) => row.name).filter((name) => typeof name === 'string' && name.trim());
if (names.length === 0) {
  throw new Error('No names in source data');
}

const bySolarDate = {};
for (let month = 1; month <= 12; month += 1) {
  const maxDay = PERSIAN_MONTH_LENGTHS[month - 1];
  for (let day = 1; day <= maxDay; day += 1) {
    const key = `${month}-${day}`;
    bySolarDate[key] = names[stableIndex(month, day, names.length)];
  }
}

const outPath = join(dirname(fileURLToPath(import.meta.url)), '../src/data/javidnamDaily.json');
writeFileSync(
  outPath,
  `${JSON.stringify({ source: 'TheRealHizha/JavidNaman', generatedAt: new Date().toISOString().slice(0, 10), bySolarDate }, null, 0)}\n`,
);

console.log(`Wrote ${Object.keys(bySolarDate).length} entries to ${outPath}`);
