import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localesDir = resolve(root, 'src/i18n/locales');
const attributionsPath = resolve(root, 'src/data/imageAttributions.ts');

function extractBannerAttributions() {
  const source = readFileSync(attributionsPath, 'utf8');
  const banners = {};
  const blockPattern =
    /(\w+):\s*\{[\s\S]*?calendarId:\s*'(\w+)'[\s\S]*?subjects:\s*'((?:\\'|[^'])*)'[\s\S]*?aboutNote:\s*(?:'((?:\\'|[^'])*)'|(?:\n\s*'((?:\\'|[^'])*)'(?:\s*\+\s*\n\s*'((?:\\'|[^'])*)')?))/g;

  let match;
  while ((match = blockPattern.exec(source)) !== null) {
    const id = match[2];
    const subjects = match[3].replace(/\\'/g, "'");
    const aboutNote = [match[4], match[5], match[6]]
      .filter(Boolean)
      .map((part) => part.replace(/\\'/g, "'"))
      .join(' ');
    banners[id] = { subjects, aboutNote };
  }

  return banners;
}

const tipKeys = {
  tipSmall: 'Small tip',
  tipMedium: 'Medium tip',
  tipLarge: 'Large tip',
};

const bannerAttributions = extractBannerAttributions();

for (const locale of ['en', 'fr', 'ar', 'es', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'hi', 'tr', 'id']) {
  const filePath = resolve(localesDir, `${locale}.json`);
  const data = JSON.parse(readFileSync(filePath, 'utf8'));

  data.modals.donate = {
    ...data.modals.donate,
    ...(locale === 'en' ? tipKeys : {}),
  };

  if (locale === 'en') {
    data.modals.about = {
      ...data.modals.about,
      sourceLink: 'Source',
      banners: bannerAttributions,
    };
  } else if (!data.modals.about.banners) {
    data.modals.about.banners = bannerAttributions;
  }

  writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`);
}

console.log(`Updated tip keys in 14 locales; banner keys in en (${Object.keys(bannerAttributions).length} calendars)`);
