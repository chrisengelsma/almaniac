import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { syncWidgetData } from './lib/widgetData';
import { AboutModal } from './components/AboutModal';
import { DonateModal } from './components/DonateModal';
import { CalendarInfoModal } from './components/CalendarInfoModal';
import { CalendarList } from './components/CalendarList';
import { DatePickerModal } from './components/DatePickerModal';
import { FullscreenDateView } from './components/FullscreenDateView';
import { SettingsSheet } from './components/SettingsSheet';
import { TopBar } from './components/TopBar';
import { applyAppIcon } from './lib/appIcon';
import {
  anchorFromPersistedState,
  createPersistedAppState,
  loadPersistedAppState,
  savePersistedAppState,
  setAppIcon,
  setAppLanguagePreference,
  setIslamicCalendarMode,
  setIslamicDayAdjustment,
  setJulianCalendarMode,
  setColorTheme,
  setSupporterUnlocked,
  setRememberLastOpenedDate,
  setHapticsEnabled,
  setTransliterateToEnglish,
  setMayaUseHieroglyphs,
  setUseModifiedJulianDay,
  toggleCalendarVisibility,
  toggleColorScheme,
  type AppIconChoice,
  type AppSettings,
  type ColorTheme,
} from './lib/appSettings';
import {
  isSupporterAppIcon,
  isSupporterColorTheme,
  SUPPORTER_COLOR_THEME,
} from './lib/supporterPerks';
import {
  getOrderedCalendarRows,
  shiftGregorianDate,
  todayGregorianDate,
  type CalendarId,
  type CalendarRowData,
  type GregorianCalendar,
} from './lib/calendarRegistry';
import { viewportRectFromDom, type ViewportRect } from './lib/fullscreenRect';
import { useDocumentTheme } from './hooks/useDocumentTheme';
import { useAppReviewPrompt } from './hooks/useAppReviewPrompt';
import { useTapHaptics } from './hooks/useTapHaptics';
import { setHapticsEnabled as setHapticsRuntimeEnabled } from './lib/haptics';
import { useThemeTransition } from './hooks/useThemeTransition';
import { useViewportHeight } from './hooks/useViewportHeight';
import { useAndroidViewportSync } from './hooks/useAndroidViewportSync';
import { useAndroidSystemChrome } from './hooks/useAndroidSystemChrome';
import { useSafeAreaInsets } from './hooks/useSafeAreaInsets';
import { useAppLanguage } from './hooks/useAppLanguage';
import { useSupporterUnlock } from './hooks/useSupporterUnlock';
import { useSupporterThemeTilt } from './hooks/useSupporterThemeTilt';
import { useSecondClock } from './hooks/useSecondClock';
import { createCalendarCopy } from './i18n/calendarCopy';
import { isSameGregorianDay } from './lib/julianDayValue';
import './App.css';

function App() {
  const { t } = useTranslation();
  const [initialState] = useState(() => loadPersistedAppState());
  const [anchor, setAnchor] = useState<GregorianCalendar>(() => anchorFromPersistedState(initialState));
  const [order, setOrder] = useState<CalendarId[]>(() => initialState.calendarOrder);
  const [settings, setSettings] = useState<AppSettings>(() => initialState.settings);
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

  const calendarCopy = useMemo(() => createCalendarCopy(t), [t]);
  const julianDayTickActive =
    settings.visibleCalendars.julianDay &&
    isSameGregorianDay(anchor, todayGregorianDate());
  const now = useSecondClock(julianDayTickActive);

  const rows = useMemo(
    () =>
      getOrderedCalendarRows(
        order,
        anchor,
        settings,
        calendarCopy,
        julianDayTickActive ? now : undefined,
      ),
    [order, anchor, settings, calendarCopy, julianDayTickActive, now],
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
    savePersistedAppState(createPersistedAppState(settings, order, anchor));
  }, [settings, order, anchor]);

  useEffect(() => {
    void syncWidgetData(settings);
  }, [settings]);

  useEffect(() => {
    void applyAppIcon(settings.appIcon);
  }, [settings.appIcon]);

  useEffect(() => {
    setHapticsRuntimeEnabled(settings.hapticsEnabled);
  }, [settings.hapticsEnabled]);

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

  const visibleCalendarIds = useMemo(
    () => rows.filter((row) => row.visible).map((row) => row.entry.id),
    [rows],
  );

  const { isThemeTransitioning, themeTransitionDelays, beginThemeTransition } =
    useThemeTransition(visibleCalendarIds);

  const grantSupporterUnlock = useCallback(() => {
    updateSettings((current) =>
      current.supporterUnlocked ? current : setSupporterUnlocked(current, true),
    );
  }, []);

  useDocumentTheme(settings);
  useAppLanguage(settings.appLanguagePreference);
  useSupporterUnlock(settings.supporterUnlocked, grantSupporterUnlock);
  useSupporterThemeTilt(settings.colorTheme === SUPPORTER_COLOR_THEME);
  useViewportHeight();
  useAndroidViewportSync();
  useAndroidSystemChrome(settings);
  useSafeAreaInsets();
  useAppReviewPrompt();
  useTapHaptics();

  const handleColorSchemeToggle = () => {
    beginThemeTransition(() => {
      updateSettings((current) => toggleColorScheme(current));
    });
  };

  const handleColorThemeChange = (value: ColorTheme) => {
    if (value === settings.colorTheme) {
      return;
    }

    if (!settings.supporterUnlocked && isSupporterColorTheme(value)) {
      setDonateOpen(true);
      return;
    }

    beginThemeTransition(() => {
      updateSettings((current) => setColorTheme(current, value));
    });
  };

  const handleAppIconChange = (value: AppIconChoice) => {
    if (!settings.supporterUnlocked && isSupporterAppIcon(value)) {
      setDonateOpen(true);
      return;
    }

    updateSettings((current) => setAppIcon(current, value));
    void applyAppIcon(value);
  };

  return (
    <div
      className={['app', isThemeTransitioning ? 'app--theme-transitioning' : '']
        .filter(Boolean)
        .join(' ')}
      data-color-scheme={settings.colorScheme}
      data-color-theme={settings.colorTheme}
    >
      <TopBar
        colorScheme={settings.colorScheme}
        onDonateOpen={() => setDonateOpen(true)}
        onCustomizeOpen={() => setSheetOpen(true)}
        onDateClick={() => setDatePickerOpen(true)}
        onColorSchemeToggle={handleColorSchemeToggle}
        themeTransitionDelays={themeTransitionDelays}
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
        onColorThemeChange={handleColorThemeChange}
        onToggleCalendar={(id) => updateSettings((current) => toggleCalendarVisibility(current, id))}
        onTransliterateChange={(value) => updateSettings((current) => setTransliterateToEnglish(current, value))}
        onIslamicCalendarModeChange={(value) =>
          updateSettings((current) => setIslamicCalendarMode(current, value))
        }
        onIslamicAdjustmentChange={(value) =>
          updateSettings((current) => setIslamicDayAdjustment(current, value))
        }
        onJulianCalendarModeChange={(value) =>
          updateSettings((current) => setJulianCalendarMode(current, value))
        }
        onMayaUseHieroglyphsChange={(value) =>
          updateSettings((current) => setMayaUseHieroglyphs(current, value))
        }
        onUseModifiedJulianDayChange={(value) =>
          updateSettings((current) => setUseModifiedJulianDay(current, value))
        }
        onRememberLastOpenedDateChange={(value) => {
          updateSettings((current) => setRememberLastOpenedDate(current, value));
          if (!value) {
            setAnchor(todayGregorianDate());
          }
        }}
        onHapticsEnabledChange={(value) =>
          updateSettings((current) => setHapticsEnabled(current, value))
        }
        onAppIconChange={handleAppIconChange}
        onRequestSupporterUnlock={() => setDonateOpen(true)}
        onAppLanguageChange={(value) =>
          updateSettings((current) => setAppLanguagePreference(current, value))
        }
        onAboutOpen={() => setAboutOpen(true)}
      />
      <CalendarList
        order={order}
        anchor={anchor}
        settings={settings}
        calendarCopy={calendarCopy}
        julianDayAt={julianDayTickActive ? now : undefined}
        themeTransitionDelays={themeTransitionDelays}
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
      <DonateModal
        open={donateOpen}
        onClose={() => setDonateOpen(false)}
        onSupporterUnlock={grantSupporterUnlock}
      />
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
