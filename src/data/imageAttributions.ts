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
  /** Short subject labels shown next to the Source link in the banner hero. */
  subjects: string;
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
    subjects: 'Gregory XIII | Saint Peter\'s Basilica',
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
        title: 'Saint Peter Basilica Rome',
        author: 'Perituss',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Saint_Peter_Basilica_Rome.jpg',
      },
    ],
    derivedLicense: 'CC0 1.0',
    derivedLicenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  julian: {
    calendarId: 'julian',
    subjects: 'Julius Caesar | Colosseum',
    aboutNote:
      'The Julian calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the terms of the CC BY 2.0 source, the adapted banner is offered under CC BY 2.0.',
    sources: [
      {
        title: 'Roma—Statua di Cesare',
        author: 'Dan Kamminga',
        license: 'CC BY 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Roma-Statua_di_cesare.jpg',
      },
      {
        title: 'Colosseum romanum',
        author: 'maiterozas',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Colosseum_romanum.jpg',
      },
    ],
    derivedLicense: 'CC BY 2.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by/2.0/',
  },
  ethiopian: {
    calendarId: 'ethiopian',
    subjects: 'Priest in Lalibela | Bete Giyorgis',
    aboutNote:
      'The Ethiopian calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the ShareAlike terms of those licenses, the adapted banner is offered under CC BY-SA 4.0.',
    sources: [
      {
        title: 'Priest in Lalibela',
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
  coptic: {
    calendarId: 'coptic',
    subjects: 'Monastery of Saint Bishoy | Monastery of Saint Anthony',
    aboutNote:
      'The Coptic calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the ShareAlike terms of the CC BY-SA 2.0 source, the adapted banner is offered under CC BY-SA 2.0.',
    sources: [
      {
        title: 'Coptic monk at the Monastery of Saint Bishoy',
        author: 'Mark Fischer',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Monastery_of_Saint_Bishoy_monk_with_cross.jpg',
      },
      {
        title: 'Monastery of Saint Anthony, general view',
        author: 'Kazazian / Dumbarton Oaks',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Monastery_of_Saint_Anthony,_Egypt_-_Monastery,_general_view_-_MSBZ004_A103_-_Dumbarton_Oaks.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 2.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  chinese: {
    calendarId: 'chinese',
    subjects: 'Huangdi | Temple of Heaven',
    aboutNote:
      'The Chinese calendar banner is derivative artwork adapted from the source images below.',
    sources: [
      {
        title: 'Huangdi Temple with Statue of the Yellow Emperor',
        author: 'Gary Todd',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Huangdi_Temple_with_Statue_of_the_%22Yellow_Emperor%22.jpg',
      },
      {
        title: 'Temple of Heaven',
        author: 'Михаил Лазарев',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Temple_of_Heaven_(22986892500).jpg',
      },
    ],
    derivedLicense: 'CC0 1.0',
    derivedLicenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  soviet: {
    calendarId: 'soviet',
    subjects: 'Joseph Stalin | Moscow Red Square',
    aboutNote:
      'The Soviet Revolutionary calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the ShareAlike terms of the CC BY-SA 3.0 source, the adapted banner is offered under CC BY-SA 3.0.',
    sources: [
      {
        title: 'Joseph Stalin, 1930',
        author: 'Workers Library Publishers',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Stalin-Joseph-1930.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Stalin-Joseph-1930.jpg',
      },
      {
        title: 'Moscow Red Square',
        author: 'Laban66',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Moscow_RedSquare.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 3.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  frc: {
    calendarId: 'frc',
    subjects: 'Triumph of the Republic | The Panthéon',
    aboutNote:
      'The French Republican calendar banner is derivative artwork adapted from the source images below.',
    sources: [
      {
        title: 'Le Triomphe de la République',
        author: 'Pierre Petit',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:Le_triomphe_de_la_R%C3%A9publique,_monument_de_la_place_de_la_Nation,_Paris,_PH80941.jpg',
      },
      {
        title: 'The Panthéon, Paris',
        author: 'Library of Congress Photochrom Print Collection',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:The_Pantheon,_Paris,_France-LCCN2001698512.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:The_Pantheon,_Paris,_France-LCCN2001698512.jpg',
      },
    ],
    derivedLicense: 'CC0 1.0',
    derivedLicenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
  },
  japanese: {
    calendarId: 'japanese',
    subjects: 'Emperor Meiji | Nijubashi Bridge',
    aboutNote:
      'The Japanese Wareki calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the ShareAlike terms of the CC BY-SA 3.0 source, the adapted banner is offered under CC BY-SA 3.0.',
    sources: [
      {
        title: 'Emperor Meiji',
        author: 'Uchida Kuichi',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Meiji_Emperor.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Meiji_Emperor.jpg',
      },
      {
        title: 'Imperial Palace Tokyo, Nijubashi Bridge',
        author: 'Chris 73',
        license: 'CC BY-SA 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Imperial_Palace_Tokyo_Nijubashi_Bridge.JPG',
      },
    ],
    derivedLicense: 'CC BY-SA 3.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
  },
  maya: {
    calendarId: 'maya',
    subjects: "K'inich Janaab Pakal I | Palenque",
    aboutNote:
      'The Maya calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the ShareAlike terms of the CC BY-SA 2.0 source, the adapted banner is offered under CC BY-SA 2.0.',
    sources: [
      {
        title: "Stucco portrait of K'inich Janaab Pakal I",
        author: 'Simon Burchell',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:K%27inich_Janaab_Pakal_I_v2.jpg',
      },
      {
        title: 'Panoramic view of Palenque',
        author: 'Ulises00',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Panoramica_de_Palenke_Mexico.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Panoramica_de_Palenke_Mexico.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 2.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  islamic: {
    calendarId: 'islamic',
    subjects: 'Al-Biruni | Mecca',
    aboutNote:
      'The Islamic calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the ShareAlike terms of the CC BY-SA 4.0 source, the adapted banner is offered under CC BY-SA 4.0.',
    sources: [
      {
        title: 'Al-Biruni Portrait',
        author: 'Michel Bakni (modified from a Soviet stamp)',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Al-Biruni_Portrait.jpg',
      },
      {
        title: 'Makkah Panorama',
        author: 'Wurzelgnohm',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Makkah-Panorama-2011.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 4.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  hebrew: {
    calendarId: 'hebrew',
    subjects: 'Maimonides | Jerusalem Old City',
    aboutNote:
      'The Hebrew calendar banner is derivative artwork adapted from the source photographs below. ' +
      'Under the ShareAlike terms of the CC BY-SA 2.0 source, the adapted banner is offered under CC BY-SA 2.0.',
    sources: [
      {
        title: 'Statue of Maimonides',
        author: 'Jerzy Kociatkiewicz',
        license: 'CC BY-SA 2.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:A_statue_of_Maimonides.jpg',
      },
      {
        title: 'Jerusalem Old City',
        author: 'Gary Todd',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jerusalem_Old_City_%2829305951318%29.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 2.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/2.0/',
  },
  persian: {
    calendarId: 'persian',
    subjects: 'Omar Khayyam | Naqsh-e Jahan Square',
    aboutNote:
      'The Persian calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the ShareAlike terms of the CC BY-SA 4.0 source, the adapted banner is offered under CC BY-SA 4.0.',
    sources: [
      {
        title: 'Omar Khayyam Statue',
        author: 'Vacatio',
        license: 'CC0 1.0',
        licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Omar_Khayyam_at_the_University_of_Oklahoma.jpg',
      },
      {
        title: 'Naqsh-e Jahan Square, Isfahan',
        author: 'Majid eslamdoust',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Isfahan-Naqsh-e_Jahan_Square.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 4.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  bahai: {
    calendarId: 'bahai',
    subjects: 'Shrine of the Báb | Haifa',
    aboutNote:
      'The Baháʼí calendar banner is derivative artwork adapted from the source photograph below.',
    sources: [
      {
        title: 'Shrine of the Báb and Gardens',
        author: 'Da voli',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Baha%27i_Shrine.JPG',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Baha%27i_Shrine.JPG',
      },
    ],
    derivedLicense: 'Public domain',
    derivedLicenseUrl: 'https://commons.wikimedia.org/wiki/File:Baha%27i_Shrine.JPG',
  },
  thaiBuddhist: {
    calendarId: 'thaiBuddhist',
    subjects: 'King Chulalongkorn | Wat Arun',
    aboutNote:
      'The Thai Buddhist calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the terms of the CC BY 3.0 source, the adapted banner is offered under CC BY 3.0.',
    sources: [
      {
        title: 'King Chulalongkorn',
        author: 'Unknown artist',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:King_Chulalongkorn.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:King_Chulalongkorn.jpg',
      },
      {
        title: 'Wat Arun, Temple of Dawn',
        author: 'Diego Fernando García Peña',
        license: 'CC BY 3.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wat_Arun_Temple_Of_Dawn_%28121412175%29.jpeg',
      },
    ],
    derivedLicense: 'CC BY 3.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by/3.0/',
  },
  discordian: {
    calendarId: 'discordian',
    subjects: 'Eris | Asbury Lanes',
    aboutNote:
      'The Discordian calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the ShareAlike terms of the CC BY-SA 4.0 source, the adapted banner is offered under CC BY-SA 4.0.',
    sources: [
      {
        title: 'Illustration of Eris',
        author: 'Katolophyromai (Spencer Alexander McDaniel)',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Illustration_of_Eris.jpg',
      },
      {
        title: 'Asbury Lanes Interior',
        author: 'Baron Maddock',
        license: 'CC BY 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Asbury_Lanes_Interior.jpg',
      },
    ],
    derivedLicense: 'CC BY-SA 4.0',
    derivedLicenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
  },
  indianCivil: {
    calendarId: 'indianCivil',
    subjects: 'Meghnad Saha | Jantar Mantar',
    aboutNote:
      'The Indian Civil calendar banner is derivative artwork adapted from the source images below.',
    sources: [
      {
        title: 'Photograph of Scientist Meghnad Saha',
        author: 'Unknown author',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Photograph_of_Scientist_Meghnad_Saha.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Photograph_of_Scientist_Meghnad_Saha.jpg',
      },
      {
        title: 'Jantar Mantar at Jaipur',
        author: 'Knowledge Seeker',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Jantar_Mantar_at_Jaipur.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Jantar_Mantar_at_Jaipur.jpg',
      },
    ],
    derivedLicense: 'Public domain',
    derivedLicenseUrl: 'https://commons.wikimedia.org/wiki/File:Jantar_Mantar_at_Jaipur.jpg',
  },
  isoWeek: {
    calendarId: 'isoWeek',
    subjects: 'NBS Atomic Clock | Earth from Apollo 17',
    aboutNote:
      'The ISO Week calendar banner is derivative artwork adapted from the source images below.',
    sources: [
      {
        title: 'NBS atomic clock',
        author: 'National Institute of Standards and Technology',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Atomic_Clock048.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Atomic_Clock048.jpg',
      },
      {
        title: 'The Earth seen from Apollo 17 (Original Orientation)',
        author: 'NASA',
        license: 'Public domain',
        licenseUrl:
          'https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17_%28Original_Orientation%29.jpg',
        sourceUrl:
          'https://commons.wikimedia.org/wiki/File:The_Earth_seen_from_Apollo_17_%28Original_Orientation%29.jpg',
      },
    ],
    derivedLicense: 'Public domain',
    derivedLicenseUrl: 'https://commons.wikimedia.org/wiki/File:Atomic_Clock048.jpg',
  },
  julianDay: {
    calendarId: 'julianDay',
    subjects: 'Joseph Justus Scaliger | Old Observatory, Leiden',
    aboutNote:
      'The Julian Day calendar banner is derivative artwork adapted from the source images below. ' +
      'Under the ShareAlike terms of the CC BY-SA 4.0 source, the adapted banner is offered under CC BY-SA 4.0.',
    sources: [
      {
        title: 'Joseph Justus Scaliger portrait',
        author: 'Gérard Edelinck and Charles E. Wagstaff',
        license: 'Public domain',
        licenseUrl: 'https://commons.wikimedia.org/wiki/File:Joseph_Justus_Scaliger_portrait.jpg',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Joseph_Justus_Scaliger_portrait.jpg',
      },
      {
        title: 'Old Observatory, Leiden',
        author: 'AWossink',
        license: 'CC BY-SA 4.0',
        licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:Oude_Sterrewacht,_Leiden.jpg',
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
