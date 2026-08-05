import { useEffect, useRef, useState } from 'react';
import { CALENDAR_NAMES } from '../theme/calendarTheme';
import {
  DEFAULT_CALENDAR_ORDER,
  type CalendarId,
} from '../lib/calendarRegistry';
import type { AppSettings, IslamicCalendarMode, IslamicDayAdjustment, ColorTheme } from '../lib/appSettings';
import { SheetSlider, SheetToggle } from './DrawerControls';

const DISMISS_THRESHOLD_PX = 80;
const SHEET_TRANSITION_MS = 320;

type SettingsPanel = 'main' | 'calendars';

interface SettingsSheetProps {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onToggleCalendar: (id: CalendarId) => void;
  onColorSchemeToggle: () => void;
  onColorThemeChange: (value: ColorTheme) => void;
  onTransliterateChange: (value: boolean) => void;
  onIslamicCalendarModeChange: (value: IslamicCalendarMode) => void;
  onIslamicAdjustmentChange: (value: IslamicDayAdjustment) => void;
  onUseModifiedJulianDayChange: (value: boolean) => void;
  onAboutOpen: () => void;
}

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}

function IconChevronLeft() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M14 6l-6 6 6 6" />
    </svg>
  );
}

interface IslamicCalendarOptionsProps {
  settings: AppSettings;
  onIslamicCalendarModeChange: (value: IslamicCalendarMode) => void;
  onIslamicAdjustmentChange: (value: IslamicDayAdjustment) => void;
}

function IslamicCalendarOptions({
  settings,
  onIslamicCalendarModeChange,
  onIslamicAdjustmentChange,
}: IslamicCalendarOptionsProps) {
  return (
    <div className="settings-sheet__calendar-options" role="group" aria-label="Islamic calendar settings">
      <div className="settings-sheet__item settings-sheet__item--stacked">
        <span>Islamic Calendar System</span>
        <select
          className="settings-sheet__select"
          value={settings.islamicCalendarMode}
          onChange={(event) =>
            onIslamicCalendarModeChange(event.target.value as IslamicCalendarMode)
          }
          aria-label="Islamic calendar system"
        >
          <option value="tabular">Tabular (arithmetic)</option>
          <option value="ummAlQura">Umm al-Qura (Saudi official)</option>
        </select>
      </div>
      <div className="settings-sheet__item settings-sheet__item--stacked">
        <span>Islamic Calendar Day Adjustment</span>
        <SheetSlider
          min={-1}
          max={1}
          value={settings.islamicDayAdjustment}
          onChange={(value) => onIslamicAdjustmentChange(value as IslamicDayAdjustment)}
        />
      </div>
    </div>
  );
}

interface JulianDayOptionsProps {
  settings: AppSettings;
  onUseModifiedJulianDayChange: (value: boolean) => void;
}

function JulianDayOptions({
  settings,
  onUseModifiedJulianDayChange,
}: JulianDayOptionsProps) {
  return (
    <div className="settings-sheet__calendar-options" role="group" aria-label="Julian Day settings">
      <div className="settings-sheet__item settings-sheet__item--stacked">
        <span>Modified Julian Day</span>
        <SheetToggle
          checked={settings.useModifiedJulianDay}
          label="Use Modified Julian Day"
          onChange={() => onUseModifiedJulianDayChange(!settings.useModifiedJulianDay)}
        />
      </div>
    </div>
  );
}

export function SettingsSheet({
  open,
  settings,
  onClose,
  onToggleCalendar,
  onColorSchemeToggle,
  onColorThemeChange,
  onTransliterateChange,
  onIslamicCalendarModeChange,
  onIslamicAdjustmentChange,
  onUseModifiedJulianDayChange,
  onAboutOpen,
}: SettingsSheetProps) {
  const sheetRef = useRef<HTMLElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [panel, setPanel] = useState<SettingsPanel>('main');

  const visibleCalendarCount = DEFAULT_CALENDAR_ORDER.filter(
    (id) => settings.visibleCalendars[id],
  ).length;

  useEffect(() => {
    if (!open) {
      setDragOffset(0);
      setIsDragging(false);
      dragStartY.current = null;
      setPanel('main');
      return;
    }

    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (panel === 'calendars') {
          setPanel('main');
          return;
        }

        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose, panel]);

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    dragStartY.current = event.clientY;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    const delta = Math.max(0, event.clientY - dragStartY.current);
    setDragOffset(delta);
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartY.current === null) {
      return;
    }

    const delta = event.clientY - dragStartY.current;
    dragStartY.current = null;
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);

    if (delta > DISMISS_THRESHOLD_PX) {
      onClose();
      return;
    }

    setDragOffset(0);
  };

  const handlePointerCancel = () => {
    dragStartY.current = null;
    setIsDragging(false);
    setDragOffset(0);
  };

  const sheetStyle = {
    transform: open ? `translateY(${dragOffset}px)` : 'translateY(100%)',
    transition: isDragging ? 'none' : `transform ${SHEET_TRANSITION_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
  };

  return (
    <>
      <button
        type="button"
        className={`sheet-backdrop${open ? ' sheet-backdrop--open' : ''}`}
        onClick={onClose}
        aria-label="Close customize panel"
        tabIndex={open ? 0 : -1}
      />
      <aside
        ref={sheetRef}
        className={`settings-sheet${open ? ' settings-sheet--open' : ''}`}
        style={sheetStyle}
        aria-hidden={!open}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-sheet-title"
        tabIndex={-1}
      >
        <div className="settings-sheet__header">
          <div
            className="settings-sheet__handle"
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          />
          <div className="settings-sheet__header-row">
            {panel === 'calendars' ? (
              <button
                type="button"
                className="settings-sheet__back"
                onClick={() => setPanel('main')}
                aria-label="Back to settings"
              >
                <IconChevronLeft />
              </button>
            ) : (
              <span className="settings-sheet__header-spacer" aria-hidden="true" />
            )}
            <h2 id="settings-sheet-title" className="settings-sheet__title">
              {panel === 'calendars' ? 'Select Calendars' : 'Customize'}
            </h2>
            <span className="settings-sheet__header-spacer" aria-hidden="true" />
          </div>
        </div>

        <div className="settings-sheet__content">
          {panel === 'main' ? (
            <>
              <section className="settings-sheet__section">
                <h3>Calendars</h3>
                <ul className="settings-sheet__list">
                  <li>
                    <button
                      type="button"
                      className="settings-sheet__nav-item"
                      onClick={() => setPanel('calendars')}
                    >
                      <span className="settings-sheet__nav-copy">
                        <span className="settings-sheet__nav-label">Select Calendars</span>
                        <span className="settings-sheet__nav-detail">
                          {visibleCalendarCount} of {DEFAULT_CALENDAR_ORDER.length} shown
                        </span>
                      </span>
                      <IconChevronRight />
                    </button>
                  </li>
                </ul>
              </section>

              <section className="settings-sheet__section">
                <h3>Settings</h3>
                <ul className="settings-sheet__list">
                  <li className="settings-sheet__item settings-sheet__item--stacked">
                    <span>Color theme</span>
                    <select
                      className="settings-sheet__select"
                      value={settings.colorTheme}
                      onChange={(event) => onColorThemeChange(event.target.value as ColorTheme)}
                      aria-label="Color theme"
                    >
                      <option value="distinct">Distinct</option>
                      <option value="mono">Mono</option>
                    </select>
                  </li>
                  <li className="settings-sheet__item">
                    <span>Dark mode</span>
                    <SheetToggle
                      checked={settings.colorScheme === 'dark'}
                      label="Dark mode"
                      onChange={onColorSchemeToggle}
                    />
                  </li>
                  <li className="settings-sheet__item">
                    <span>Transliterate To English</span>
                    <SheetToggle
                      checked={settings.transliterateToEnglish}
                      label="Transliterate to English"
                      onChange={() => onTransliterateChange(!settings.transliterateToEnglish)}
                    />
                  </li>
                </ul>
              </section>

              <section className="settings-sheet__section">
                <ul className="settings-sheet__list">
                  <li>
                    <button
                      type="button"
                      className="settings-sheet__nav-item"
                      onClick={() => {
                        onClose();
                        onAboutOpen();
                      }}
                    >
                      <span className="settings-sheet__nav-copy">
                        <span className="settings-sheet__nav-label">About</span>
                      </span>
                      <IconChevronRight />
                    </button>
                  </li>
                </ul>
              </section>
            </>
          ) : (
            <section className="settings-sheet__section">
              <ul className="settings-sheet__list">
                {DEFAULT_CALENDAR_ORDER.map((id) => (
                  <li key={id} className="settings-sheet__calendar-group">
                    <div className="settings-sheet__item">
                      <span>{CALENDAR_NAMES[id]}</span>
                      <SheetToggle
                        checked={settings.visibleCalendars[id]}
                        label={`Toggle ${CALENDAR_NAMES[id]}`}
                        onChange={() => onToggleCalendar(id)}
                      />
                    </div>
                    {id === 'islamic' && settings.visibleCalendars.islamic ? (
                      <IslamicCalendarOptions
                        settings={settings}
                        onIslamicCalendarModeChange={onIslamicCalendarModeChange}
                        onIslamicAdjustmentChange={onIslamicAdjustmentChange}
                      />
                    ) : null}
                    {id === 'julianDay' && settings.visibleCalendars.julianDay ? (
                      <JulianDayOptions
                        settings={settings}
                        onUseModifiedJulianDayChange={onUseModifiedJulianDayChange}
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </aside>
    </>
  );
}
