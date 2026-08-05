import type { CalendarId } from '../lib/calendarRegistry';

export interface ImageAttribution {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export interface CalendarBannerAttribution {
  calendarId: CalendarId;
  /** Longer note for the About page. */
  aboutNote: string;
  sources: ImageAttribution[];
  /** License applied to the derivative banner artwork. */
  derivedLicense: string;
  derivedLicenseUrl: string;
}

export const CALENDAR_BANNER_ATTRIBUTIONS: Partial<Record<CalendarId, CalendarBannerAttribution>> = {
  gregorian: {
    calendarId: 'gregorian',
    aboutNote:
      'The Gregorian calendar banner is derivative artwork adapted from the source images below.',
    sources: [
      {
        title: 'Ritratto di Gregorio XIII',
        author: 'Passarotti',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Ritratto_di_Gregorio_XIII_-_Passarotti.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Ritratto_di_Gregorio_XIII_-_Passarotti.jpg',
      },
      {
        title: "Saint Peter's Basilica, Rome",
        author: 'Perituss',
        license: 'CC0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Saint_Peter_Basilica_Rome.jpg',
      },
    ],
    derivedLicense: 'CC0',
    derivedLicenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  julian: {
    calendarId: 'julian',
    aboutNote:
      'The Julian calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the terms of the CC BY 2.0 source, the adapted banner is offered under CC BY 2.0.',
    sources: [
      {
        title: 'Caesar statue, Rome',
        author: 'Dan Kamminga',
        license: 'CC BY 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Roma-Statua_di_cesare.jpg',
      },
      {
        title: 'Colosseum',
        author: 'maiterozas',
        license: 'CC0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Colosseum_romanum.jpg',
      },
    ],
    derivedLicense: 'CC BY 2.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  ethiopian: {
    calendarId: 'ethiopian',
    aboutNote:
      'The Ethiopian calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the ShareAlike terms of those licenses, the adapted banner is offered under CC BY-SA 4.0.',
    sources: [
      {
        title: 'Priest in Lalibella',
        author: 'Lucy Shaw',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Priest_in_Lalibella.jpg',
      },
      {
        title: 'Bete Giyorgis',
        author: 'Bernard Gagnon',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Bete_Giyorgis_01.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 4.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
};

export function getBannerAttribution(calendarId: CalendarId): CalendarBannerAttribution | undefined {
  return CALENDAR_BANNER_ATTRIBUTIONS[calendarId];
}

export function getAllBannerAttributions(): CalendarBannerAttribution[] {
  return Object.values(CALENDAR_BANNER_ATTRIBUTIONS);
}
