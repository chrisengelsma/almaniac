import { useEffect, useMemo, useState } from 'react';
import { syncWidgetData } from './lib/widgetData';
import { AboutModal } from './components/AboutModal';
import { DonateModal } from './components/DonateModal';
import { CalendarInfoModal } from './components/CalendarInfoModal';
import { CalendarList } from './components/CalendarList';
import { DatePickerModal } from './components/DatePickerModal';
import { FullscreenDateView } from './components/FullscreenDateView';
import { SettingsSheet } from './components/SettingsSheet';
import { TopBar } from './components/TopBar';
import {
  loadAppSettings,
  saveAppSettings,
  setIslamicCalendarMode,
  setIslamicDayAdjustment,
  setColorTheme,
  setTransliterateToEnglish,
  setUseModifiedJulianDay,
  toggleCalendarVisibility,
  toggleColorScheme,
  type AppSettings,
} from './lib/appSettings';
import {
  DEFAULT_CALENDAR_ORDER,
  getOrderedCalendarRows,
  shiftGregorianDate,
  todayGregorianDate,
  type CalendarId,
  type CalendarRowData,
  type GregorianCalendar,
} from './lib/calendarRegistry';
import { viewportRectFromDom, type ViewportRect } from './lib/fullscreenRect';
import { useDocumentTheme } from './hooks/useDocumentTheme';
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
  const [fullscreen, setFullscreen] = useState<{
    row: CalendarRowData;
    originRect: ViewportRect;
    textOriginRect: ViewportRect;
  } | null>(null);

  const rows = useMemo(
    () => getOrderedCalendarRows(order, anchor, settings),
    [order, anchor, settings],
  );

  const activeFullscreen = useMemo(() => {
    if (!fullscreen) {
      return null;
    }

    const row = rows.find((item) => item.entry.id === fullscreen.row.entry.id) ?? fullscreen.row;
    return {
      row,
      originRect: fullscreen.originRect,
      textOriginRect: fullscreen.textOriginRect,
    };
  }, [fullscreen, rows]);

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

  useDocumentTheme(settings);

  return (
    <div className="app" data-color-scheme={settings.colorScheme} data-color-theme={settings.colorTheme}>
      <TopBar
        onDonateOpen={() => setDonateOpen(true)}
        onCustomizeOpen={() => setSheetOpen(true)}
        onDateClick={() => setDatePickerOpen(true)}
        onBack30={() => setAnchor((current) => shiftGregorianDate(current, -30))}
        onBack1={() => setAnchor((current) => shiftGregorianDate(current, -1))}
        onToday={() => setAnchor(todayGregorianDate())}
        onForward1={() => setAnchor((current) => shiftGregorianDate(current, 1))}
        onForward30={() => setAnchor((current) => shiftGregorianDate(current, 30))}
      />
      <SettingsSheet
        open={sheetOpen}
        settings={settings}
        onClose={() => setSheetOpen(false)}
        onColorSchemeToggle={() => updateSettings((current) => toggleColorScheme(current))}
        onColorThemeChange={(value) => updateSettings((current) => setColorTheme(current, value))}
        onToggleCalendar={(id) => updateSettings((current) => toggleCalendarVisibility(current, id))}
        onTransliterateChange={(value) => updateSettings((current) => setTransliterateToEnglish(current, value))}
        onIslamicCalendarModeChange={(value) =>
          updateSettings((current) => setIslamicCalendarMode(current, value))
        }
        onIslamicAdjustmentChange={(value) =>
          updateSettings((current) => setIslamicDayAdjustment(current, value))
        }
        onUseModifiedJulianDayChange={(value) =>
          updateSettings((current) => setUseModifiedJulianDay(current, value))
        }
        onAboutOpen={() => setAboutOpen(true)}
      />
      <CalendarList
        order={order}
        anchor={anchor}
        settings={settings}
        onReorder={setOrder}
        onInfoClick={setInfoCalendarId}
        onFullscreen={(row, originRect, textOriginRect) =>
          setFullscreen({
            row,
            originRect: viewportRectFromDom(originRect),
            textOriginRect: viewportRectFromDom(textOriginRect),
          })
        }
        fullscreenCalendarId={activeFullscreen?.row.entry.id ?? null}
      />
      <DonateModal open={donateOpen} onClose={() => setDonateOpen(false)} />
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <CalendarInfoModal
        calendarId={infoCalendarId}
        settings={settings}
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
      {activeFullscreen ? (
        <FullscreenDateView
          row={activeFullscreen.row}
          originRect={activeFullscreen.originRect}
          textOriginRect={activeFullscreen.textOriginRect}
          colorScheme={settings.colorScheme}
          colorTheme={settings.colorTheme}
          onClose={() => setFullscreen(null)}
        />
      ) : null}
    </div>
  );
}

export default App;
