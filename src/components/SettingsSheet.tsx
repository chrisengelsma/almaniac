import { useEffect, useRef, useState } from 'react';
import { CALENDAR_NAMES } from '../theme/calendarTheme';
import {
  DEFAULT_CALENDAR_ORDER,
  type CalendarId,
} from '../lib/calendarRegistry';
import type { AppSettings, IslamicCalendarMode, IslamicDayAdjustment, ColorTheme, AppIconChoice } from '../lib/appSettings';
import appIconLight from '../assets/app-icon-light.png';
import appIconDark from '../assets/app-icon-dark.png';
import { COLOR_THEME_SWATCHES } from '../theme/calendarColors';
import { focusWithoutScroll, setBodyScrollLocked } from '../lib/nativeOverlay';
import { SheetSlider, SheetToggle } from './DrawerControls';

const COLOR_THEME_OPTIONS: Array<{ id: ColorTheme; label: string }> = [
  { id: 'distinct', label: 'Distinct' },
  { id: 'mono', label: 'Mono' },
  { id: 'sepia', label: 'Sepia' },
];

const DISMISS_THRESHOLD_PX = 80;
const SHEET_TRANSITION_MS = 320;

type SettingsPanel = 'main' | 'calendars';

interface SettingsSheetProps {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onToggleCalendar: (id: CalendarId) => void;
  onColorThemeChange: (value: ColorTheme) => void;
  onTransliterateChange: (value: boolean) => void;
  onIslamicCalendarModeChange: (value: IslamicCalendarMode) => void;
  onIslamicAdjustmentChange: (value: IslamicDayAdjustment) => void;
  onUseModifiedJulianDayChange: (value: boolean) => void;
  onAppIconChange: (value: AppIconChoice) => void;
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

function IconChevronDown() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

const APP_ICON_OPTIONS: Array<{ id: AppIconChoice; label: string; preview: string }> = [
  { id: 'light', label: 'Light', preview: appIconLight },
  { id: 'dark', label: 'Dark', preview: appIconDark },
];

interface AppIconPickerProps {
  value: AppIconChoice;
  onChange: (value: AppIconChoice) => void;
}

interface ColorThemePickerProps {
  value: ColorTheme;
  onChange: (value: ColorTheme) => void;
}

function ColorThemePicker({ value, onChange }: ColorThemePickerProps) {
  return (
    <div className="settings-sheet__theme-grid" role="radiogroup" aria-label="Color theme">
      {COLOR_THEME_OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={`settings-sheet__theme-option${selected ? ' settings-sheet__theme-option--selected' : ''}`}
            onClick={() => onChange(option.id)}
            role="radio"
            aria-checked={selected}
            aria-label={`${option.label} color theme`}
          >
            <span className="settings-sheet__theme-swatches" aria-hidden="true">
              {COLOR_THEME_SWATCHES[option.id].map((color, index) => (
                <span
                  key={index}
                  className="settings-sheet__theme-swatch"
                  style={{ backgroundColor: color }}
                />
              ))}
            </span>
            <span className="settings-sheet__theme-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AppIconPicker({ value, onChange }: AppIconPickerProps) {
  return (
    <div className="settings-sheet__icon-grid" role="radiogroup" aria-label="App icon">
      {APP_ICON_OPTIONS.map((option) => {
        const selected = value === option.id;
        return (
          <button
            key={option.id}
            type="button"
            className={`settings-sheet__icon-option${selected ? ' settings-sheet__icon-option--selected' : ''}`}
            onClick={() => onChange(option.id)}
            role="radio"
            aria-checked={selected}
            aria-label={`${option.label} app icon`}
          >
            <span className="settings-sheet__icon-frame">
              <img src={option.preview} alt="" className="settings-sheet__icon-preview" />
            </span>
            <span className="settings-sheet__icon-label">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AppIconExpander({
  value,
  onChange,
  sheetOpen,
}: AppIconPickerProps & { sheetOpen: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const selectedOption =
    APP_ICON_OPTIONS.find((option) => option.id === value) ?? APP_ICON_OPTIONS[0];

  useEffect(() => {
    if (!sheetOpen) {
      setExpanded(false);
    }
  }, [sheetOpen]);

  return (
    <li className="settings-sheet__expander-group">
      <button
        type="button"
        className="settings-sheet__expander-trigger"
        aria-expanded={expanded}
        aria-controls="settings-app-icon-panel"
        onClick={() => setExpanded((current) => !current)}
      >
        <span>App icon</span>
        <span className="settings-sheet__expander-summary">
          <span className="settings-sheet__icon-frame settings-sheet__icon-frame--summary">
            <img
              src={selectedOption.preview}
              alt=""
              className="settings-sheet__icon-preview settings-sheet__icon-preview--summary"
            />
          </span>
          <span className="settings-sheet__expander-value">{selectedOption.label}</span>
          <span
            className={`settings-sheet__expander-chevron${expanded ? ' settings-sheet__expander-chevron--open' : ''}`}
            aria-hidden="true"
          >
            <IconChevronDown />
          </span>
        </span>
      </button>
      {expanded ? (
        <div
          id="settings-app-icon-panel"
          className="settings-sheet__expander-panel"
        >
          <AppIconPicker
            value={value}
            onChange={(nextValue) => {
              onChange(nextValue);
              setExpanded(false);
            }}
          />
        </div>
      ) : null}
    </li>
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
  onColorThemeChange,
  onTransliterateChange,
  onIslamicCalendarModeChange,
  onIslamicAdjustmentChange,
  onUseModifiedJulianDayChange,
  onAppIconChange,
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

    focusWithoutScroll(sheetRef.current);

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
    setBodyScrollLocked(true);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      setBodyScrollLocked(false);
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
                  <li className="settings-sheet__item">
                    <span>Transliterate To English</span>
                    <SheetToggle
                      checked={settings.transliterateToEnglish}
                      label="Transliterate to English"
                      onChange={() => onTransliterateChange(!settings.transliterateToEnglish)}
                    />
                  </li>
                  <li className="settings-sheet__item settings-sheet__item--stacked">
                    <span>Color theme</span>
                    <ColorThemePicker value={settings.colorTheme} onChange={onColorThemeChange} />
                  </li>
                  <AppIconExpander
                    value={settings.appIcon}
                    onChange={onAppIconChange}
                    sheetOpen={open}
                  />
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
