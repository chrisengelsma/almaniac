import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const localesDir = resolve(root, 'src/i18n/locales');

const UI = {
  branding: {
    appTitle: 'Almaniac',
    appLogo: 'almaniac',
    tagline: 'A Calendar Converter',
  },
  common: {
    close: 'Close',
    cancel: 'Cancel',
    by: 'by',
    country: 'country',
    countries: 'countries',
    era: {
      ce: 'CE',
      bce: 'BCE',
      ceYear: '{{year}} CE',
      bceYear: '{{year}} BCE',
    },
  },
  settings: {
    title: 'Customize',
    selectCalendarsTitle: 'Select Calendars',
    sectionCalendars: 'Calendars',
    sectionSettings: 'Settings',
    about: 'About',
    language: 'Language',
    languageSystem: 'System default',
    languageAria: 'App language',
    transliterateLabel: 'Transliterate To English',
    transliterateAria: 'Transliterate to English',
    colorThemeLabel: 'Color theme',
    colorThemeAria: 'Color theme',
    colorThemeOptionAria: '{{label}} color theme',
    colorThemeDistinct: 'Distinct',
    colorThemeMono: 'Mono',
    colorThemeSepia: 'Sepia',
    appIconLabel: 'App icon',
    appIconAria: 'App icon',
    appIconOptionAria: '{{label}} app icon',
    appIconLight: 'Light',
    appIconDark: 'Dark',
    selectCalendarsCount: '{{count}} of {{total}} shown',
    selectCalendarsToggleAria: 'Toggle {{calendar}}',
    islamicSystemLabel: 'Islamic Calendar System',
    islamicSystemAria: 'Islamic calendar system',
    islamicSystemTabular: 'Tabular (arithmetic)',
    islamicSystemUmmAlQura: 'Umm al-Qura (Saudi official)',
    islamicAdjustmentLabel: 'Islamic Calendar Day Adjustment',
    islamicGroupAria: 'Islamic calendar settings',
    julianSystemLabel: 'Julian Calendar System',
    julianSystemAria: 'Julian calendar system',
    julianSystemJulian: 'Julian (traditional)',
    julianSystemRevisedJulian: 'Revised Julian (Milanković)',
    julianGroupAria: 'Julian calendar settings',
    julianDayLabel: 'Modified Julian Day',
    julianDayToggle: 'Use Modified Julian Day',
    julianDayGroupAria: 'Julian Day settings',
    closeAria: 'Close customize panel',
    backAria: 'Back to settings',
    themeToggleLightAria: 'Switch to light mode',
    themeToggleDarkAria: 'Switch to dark mode',
  },
  topBar: {
    supportAria: 'Support Almaniac',
    jumpToDateAria: 'Jump to date',
    customizeAria: 'Customize calendars and settings',
    dateNavAria: 'Date navigation',
    back30Aria: 'Back 30 days',
    back1Aria: 'Back 1 day',
    todayAria: 'Go to today',
    forward1Aria: 'Forward 1 day',
    forward30Aria: 'Forward 30 days',
  },
  modals: {
    donate: {
      title: 'Support Almaniac',
      intro:
        "I'm Chris Engelsma. I built Almaniac to compare dates across calendar systems without jumping between converters.",
      free: 'Almaniac is free to use, with no ads, subscriptions, or tracking.',
      rating:
        'If you like the app, a 5-star rating {{store}} helps a lot. It also helps other people find Almaniac.',
      tipJar:
        "You can also leave an optional tip as a thank-you. Tips don't unlock anything. Apple keeps 15–30% of each tip as its commission.",
      coffee:
        "You're also welcome to buy me a coffee as a thank-you. Either way, thanks for using Almaniac.",
      thanks: 'Thanks for using Almaniac.',
      storeAppStore: 'on the App Store',
      storePlayStore: 'on the Play Store',
      rateButton: 'Rate 5 stars {{store}}',
      tipsAria: 'Optional tips',
      loadingTips: 'Loading tip options…',
      coffeeButton: 'Buy me a coffee',
      notNow: 'Not now',
      feedbackSuccess: 'Thank you for supporting Almaniac!',
      feedbackError: 'Tip could not be completed. Please try again.',
    },
    about: {
      title: 'About {{appTitle}}',
      description:
        'Almaniac shows one date in many calendar systems at once: Gregorian, Julian, Hebrew, Islamic, Chinese, Maya, and more.',
      creditsTitle: 'Image credits',
      bannerTitle: '{{calendar}} banner',
      version: 'Version {{version}}',
      copyright: '© 2026 Chris Engelsma',
      derivedLicensePrefix: 'Derivative banner shared under',
    },
    calendarInfo: {
      closeBackdropAria: 'Close calendar info',
      loadingBanner: 'Loading banner…',
      imageComingSoon: 'Image coming soon',
      source: 'Source',
      type: 'Type',
      firstImplemented: 'First implemented',
      whereUsed: 'Where it is used',
      geoAria: 'Geographic usage',
      mapTabsAria: 'Map views',
      adoptionTab: 'Date of adoption',
      timelineTab: 'Adoption timeline',
      gregorianSliderLabel: 'Reveal adoption through time',
      julianSliderLabel: 'Reveal adoption and replacement through time',
      yearCe: '{{year}} CE',
      gregorianAdoptionSummary:
        '{{count}} {{countryLabel}} using the Gregorian calendar by this year',
      julianUsageSummary:
        '{{count}} {{countryLabel}} using the Julian calendar at this point in time',
      adoptedIn: 'Adopted in {{year}}',
      julianAdoptedIn: 'Adopted in {{yearLabel}}',
      julianStoppedIn: 'Stopped using in {{yearLabel}}',
      mapAria: 'World map showing calendar usage',
    },
  },
  datePicker: {
    title: 'Jump to date',
    calendarLabel: 'Calendar',
    searchPlaceholder: 'Search calendars…',
    noResults: 'No calendars match.',
    eraAria: 'Era',
    eraCe: 'CE',
    eraBce: 'BCE',
    invalidDate: 'That date is not valid for the chosen calendar.',
    cancel: 'Cancel',
    apply: 'Go to date',
    field: {
      year: 'Year',
      era: 'Era',
      month: 'Month',
      day: 'Day',
      eraYear: 'Era year',
      decade: 'Décade',
      baktun: 'Baktun',
      katun: 'Katun',
      tun: 'Tun',
      uinal: 'Uinal',
      kin: 'Kin',
      buddhistYear: 'Buddhist year',
      bengaliYear: 'Bengali year',
      nepaliYear: 'Bikram Sambat year',
      minguoYear: 'Minguo year',
      dangiYear: 'Dangi year',
      jucheYear: 'Juche year',
      isoWeekYear: 'ISO week-year',
      week: 'Week',
      weekday: 'Weekday',
      yoldYear: 'YOLD year',
      season: 'Season',
      julianDay: 'Julian Day',
      modifiedJulianDay: 'Modified Julian Day',
    },
    hint: {
      gregorianYear: 'Type any year, including ancient dates like 100 BCE.',
      julianDay: 'Enter a Julian Day number.',
      modifiedJulianDay: 'Enter a Modified Julian Day number.',
    },
    placeholder: {
      year100: 'e.g. 100',
      julianDay: 'e.g. 2460000',
      modifiedJulianDay: 'e.g. 60000',
    },
    isoWeekWeekN: 'Week {{week}}',
    discordianStTibsDay: "St. Tib's Day",
    frcSansculottides: 'Sansculottides',
    japaneseEra: '{{nameEn}} ({{nameJa}})',
  },
  calendars: {
    listAria: 'Calendar conversions',
    addHint: 'Add another calendar from the menu',
    copied: 'Copied to clipboard',
    reorderAria: 'Reorder {{label}}',
    holidayAria: 'Holiday: {{names}}',
    copyAria: 'Copy {{label}} date',
    fullscreenAria: 'Show {{label}} date fullscreen',
    aboutAria: 'About the {{label}}',
    fullscreenAriaView: '{{label}} date fullscreen',
    tapToClose: 'Tap again to close',
    islamicSystemUmmAlQura: 'Umm al-Qura',
    islamicSystemTabular: 'Tabular',
    chineseZodiacYear: 'Year of the {{zodiac}}, {{pinyin}}',
    vietnameseZodiacYear: 'Year of the {{zodiac}}, {{canChi}}',
    japaneseGannen: 'Gannen',
    isoWeekDateFormat: '{{year}} Week {{week}} ({{padded}}), {{weekday}}',
    name: {
      gregorian: 'Gregorian Calendar',
      julian: 'Julian Calendar',
      ethiopian: 'Ethiopian Calendar',
      coptic: 'Coptic Calendar',
      chinese: 'Chinese Calendar',
      vietnamese: 'Vietnamese Calendar',
      soviet: 'Soviet Revolutionary Calendar',
      frc: 'French Republican Calendar',
      maya: 'Maya Calendar',
      islamic: 'Islamic Calendar',
      hebrew: 'Hebrew Calendar',
      persian: 'Persian Calendar',
      bahai: 'Baháʼí Calendar',
      japanese: 'Japanese Wareki Calendar',
      minguo: 'Minguo Calendar',
      koreanDangi: 'Korean Dangi Calendar',
      juche: 'Juche Calendar',
      thaiBuddhist: 'Thai Buddhist Calendar',
      bengali: 'Bengali Calendar',
      nepali: 'Nepali Calendar',
      isoWeek: 'ISO Week Date',
      discordian: 'Discordian Calendar',
      indianCivil: 'Indian Civil Calendar',
      julianDay: 'Julian Day',
    },
    label: {
      gregorian: 'Gregorian',
      julian: 'Julian',
      ethiopian: 'Ethiopian',
      coptic: 'Coptic',
      chinese: 'Chinese',
      vietnamese: 'Vietnamese',
      soviet: 'Soviet',
      frc: 'FRC',
      maya: 'Maya',
      islamic: 'Islamic',
      hebrew: 'Hebrew',
      persian: 'Persian',
      bahai: 'Baháʼí',
      japanese: 'Japanese',
      minguo: 'Minguo',
      koreanDangi: 'Dangi',
      juche: 'Juche',
      thaiBuddhist: 'Thai Buddhist',
      bengali: 'Bengali',
      nepali: 'Nepali',
      isoWeek: 'ISO Week',
      discordian: 'Discordian',
      indianCivil: 'Indian Civil',
      julianDay: 'Julian Day',
      modifiedJulianDay: 'Modified JD',
    },
    type: {
      solar: 'Solar',
      lunar: 'Lunar',
      lunisolar: 'Lunisolar',
      mixed: 'Mixed cycles',
      continuous: 'Continuous count',
    },
  },
  holidays: {
    bannerAria: 'Religious holidays on this date',
    tradition: {
      christian: 'Christian',
      jewish: 'Jewish',
      islamic: 'Islamic',
    },
    jewish: {
      roshHashanah: 'Rosh Hashanah',
      yomKippur: 'Yom Kippur',
      sukkot: 'Sukkot',
      hanukkah: 'Hanukkah',
      purim: 'Purim',
      passover: 'Passover',
      shavuot: 'Shavuot',
      tishaBAv: "Tisha B'Av",
    },
    christian: {
      epiphany: 'Epiphany',
      christmas: 'Christmas',
      allSaintsDay: "All Saints' Day",
      ashWednesday: 'Ash Wednesday',
      palmSunday: 'Palm Sunday',
      goodFriday: 'Good Friday',
      easterSunday: 'Easter Sunday',
      ascensionDay: 'Ascension Day',
      pentecost: 'Pentecost',
    },
    islamic: {
      newYear: 'Islamic New Year',
      ashura: 'Ashura',
      mawlid: 'Mawlid al-Nabi',
      ramadanStart: 'Start of Ramadan',
      laylatAlQadr: 'Laylat al-Qadr',
      eidAlFitr: 'Eid al-Fitr',
      eidAlAdha: 'Eid al-Adha',
      ramadan: 'Ramadan',
    },
  },
};

function extractCalendarInfo() {
  const source = readFileSync(resolve(root, 'src/data/calendarInfo.ts'), 'utf8');
  const info = {};
  const blockPattern =
    /(\w+):\s*\{[^}]*?id:\s*'(\w+)'[^}]*?firstImplemented:\s*'([^']*)'[^}]*?history:\s*\n\s*'([^']*(?:\\'[^']*)*)'[^}]*?usedIn:\s*(\[[\s\S]*?\]|'[^']*')/g;

  let match;
  while ((match = blockPattern.exec(source)) !== null) {
    const id = match[2];
    const firstImplemented = match[3];
    const history = match[4].replace(/\\'/g, "'");
    let usedIn;
    const usedInRaw = match[5].trim();
    if (usedInRaw.startsWith('[')) {
      usedIn = [...usedInRaw.matchAll(/'([^']*(?:\\'[^']*)*)'/g)].map((item) =>
        item[1].replace(/\\'/g, "'"),
      );
    } else {
      usedIn = [usedInRaw.slice(1, -1)];
    }
    info[id] = { firstImplemented, history, usedIn };
  }

  return info;
}

const en = {
  ...UI,
  calendars: {
    ...UI.calendars,
    info: extractCalendarInfo(),
  },
};

mkdirSync(localesDir, { recursive: true });
writeFileSync(resolve(localesDir, 'en.json'), `${JSON.stringify(en, null, 2)}\n`);

console.log('Wrote en.json with', Object.keys(en.calendars.info).length, 'calendar info entries');
