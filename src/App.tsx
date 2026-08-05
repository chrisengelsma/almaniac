import { useEffect, useMemo, useState } from 'react';
import { syncWidgetData } from './lib/widgetData';
import { AboutModal } from './components/AboutModal';
import { DonateModal } from './components/DonateModal';
import { CalendarInfoModal } from './components/CalendarInfoModal';
import { CalendarList } from './components/CalendarList';
import { DatePickerModal } from './components/DatePickerModal';
import { HolidayBanner } from './components/HolidayBanner';
import { SettingsSheet } from './components/SettingsSheet';
import { TopBar } from './components/TopBar';
import {
  loadAppSettings,
  saveAppSettings,
  setIslamicCalendarMode,
  setIslamicDayAdjustment,
  setShowChristianHolidays,
  setShowIslamicHolidays,
  setShowJewishHolidays,
  setTransliterateToEnglish,
  toggleCalendarVisibility,
  type AppSettings,
} from './lib/appSettings';
import {
  DEFAULT_CALENDAR_ORDER,
  shiftGregorianDate,
  todayGregorianDate,
  type CalendarId,
  type GregorianCalendar,
} from './lib/calendarRegistry';
import { getReligiousHolidays } from './lib/religiousHolidays';
import './App.css';

function App() {
  const [anchor, setAnchor] = useState<GregorianCalendar>(() => todayGregorianDate());
  const [order, setOrder] = useState<CalendarId[]>(DEFAULT_CALENDAR_ORDER);
  const [settings, setSettings] = useState<AppSettings>(() => loadAppSettings());
  const [sheetOpen, setSheetOpen] = useState(false);
  const [donateOpen, setDonateOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [infoCalendarId, setInfoCalendarId] = useState<CalendarId | null>(null);

  const holidays = useMemo(
    () =>
      getReligiousHolidays(anchor, {
        showChristianHolidays: settings.showChristianHolidays,
        showJewishHolidays: settings.showJewishHolidays,
        showIslamicHolidays: settings.showIslamicHolidays,
        islamicDayAdjustment: settings.islamicDayAdjustment,
        islamicCalendarMode: settings.islamicCalendarMode,
      }),
    [anchor, settings],
  );

  useEffect(() => {
    saveAppSettings(settings);
  }, [settings]);

  useEffect(() => {
    void syncWidgetData(settings);
  }, [settings]);

  useEffect(() => {
    const syncOnForeground = () => {
      if (document.visibilityState === 'visible') {
        void syncWidgetData(settings);
      }
    };

    document.addEventListener('visibilitychange', syncOnForeground);
    return () => document.removeEventListener('visibilitychange', syncOnForeground);
  }, [settings]);

  const updateSettings = (updater: (current: AppSettings) => AppSettings) => {
    setSettings((current) => updater(current));
  };

  return (
    <div className="app">
      <TopBar
        onDonateOpen={() => setDonateOpen(true)}
        onAboutOpen={() => setAboutOpen(true)}
        onCustomizeOpen={() => setSheetOpen(true)}
        onDateClick={() => setDatePickerOpen(true)}
        onBack30={() => setAnchor((current) => shiftGregorianDate(current, -30))}
        onBack1={() => setAnchor((current) => shiftGregorianDate(current, -1))}
        onToday={() => setAnchor(todayGregorianDate())}
        onForward1={() => setAnchor((current) => shiftGregorianDate(current, 1))}
        onForward30={() => setAnchor((current) => shiftGregorianDate(current, 30))}
      />
      <HolidayBanner holidays={holidays} />
      <SettingsSheet
        open={sheetOpen}
        settings={settings}
        onClose={() => setSheetOpen(false)}
        onToggleCalendar={(id) => updateSettings((current) => toggleCalendarVisibility(current, id))}
        onTransliterateChange={(value) => updateSettings((current) => setTransliterateToEnglish(current, value))}
        onIslamicCalendarModeChange={(value) =>
          updateSettings((current) => setIslamicCalendarMode(current, value))
        }
        onIslamicAdjustmentChange={(value) =>
          updateSettings((current) => setIslamicDayAdjustment(current, value))
        }
        onChristianHolidaysChange={(value) =>
          updateSettings((current) => setShowChristianHolidays(current, value))
        }
        onJewishHolidaysChange={(value) =>
          updateSettings((current) => setShowJewishHolidays(current, value))
        }
        onIslamicHolidaysChange={(value) =>
          updateSettings((current) => setShowIslamicHolidays(current, value))
        }
      />
      <CalendarList
        order={order}
        anchor={anchor}
        settings={settings}
        onReorder={setOrder}
        onInfoClick={setInfoCalendarId}
      />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CalendarInfoModal
        calendarId={infoCalendarId}
        onClose={() => setInfoCalendarId(null)}
        onAboutOpen={() => {
          setInfoCalendarId(null);
          setAboutOpen(true);
        }}
      />
      <DatePickerModal
        open={datePickerOpen}
        anchor={anchor}
        onClose={() => setDatePickerOpen(false)}
        onApply={setAnchor}
        settings={settings}
      />
    </div>
  );
}

export default App;
