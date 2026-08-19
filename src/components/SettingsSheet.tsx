import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { APP_LANGUAGES, LANGUAGE_LABELS, type AppLanguagePreference } from '../i18n/language';
import {
  DEFAULT_CALENDAR_ORDER,
  type CalendarId,
} from '../lib/calendarRegistry';
import type { AppSettings, IslamicCalendarMode, IslamicDayAdjustment, ColorTheme, AppIconChoice } from '../lib/appSettings';
import appIconLight from '../assets/app-icon-light.png';
import appIconDark from '../assets/app-icon-dark.png';
import appIconSupporter from '../assets/app-icon-teal.png';
import { COLOR_THEME_SWATCHES } from '../theme/calendarColors';
import { isSupporterAppIcon, isSupporterColorTheme } from '../lib/supporterPerks';
import { focusWithoutScroll, setBodyScrollLocked } from '../lib/nativeOverlay';
import { SheetSlider, SheetToggle } from './DrawerControls';

const COLOR_THEME_OPTIONS: Array<{ id: ColorTheme; labelKey: string }> = [
  { id: 'distinct', labelKey: 'settings.colorThemeDistinct' },
  { id: 'mono', labelKey: 'settings.colorThemeMono' },
  { id: 'sepia', labelKey: 'settings.colorThemeSepia' },
  { id: 'supporter', labelKey: 'settings.colorThemeSupporter' },
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
  onRememberLastOpenedDateChange: (value: boolean) => void;
  onAppIconChange: (value: AppIconChoice) => void;
  onRequestSupporterUnlock: () => void;
  onAppLanguageChange: (value: AppLanguagePreference) => void;
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

const APP_ICON_OPTIONS: Array<{ id: AppIconChoice; labelKey: string; preview: string }> = [
  { id: 'light', labelKey: 'settings.appIconLight', preview: appIconLight },
  { id: 'dark', labelKey: 'settings.appIconDark', preview: appIconDark },
  { id: 'supporter', labelKey: 'settings.appIconSupporter', preview: appIconSupporter },
];

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Z" />
    </svg>
  );
}

interface ColorThemePickerProps {
  value: ColorTheme;
  supporterUnlocked: boolean;
  onChange: (value: ColorTheme) => void;
  onRequestSupporterUnlock: () => void;
}

function ColorThemePicker({
  value,
  supporterUnlocked,
  onChange,
  onRequestSupporterUnlock,
}: ColorThemePickerProps) {
  const { t } = useTranslation();

  return (
    <div className="settings-sheet__theme-grid" role="radiogroup" aria-label={t('settings.colorThemeAria')}>
      {COLOR_THEME_OPTIONS.map((option) => {
        const selected = value === option.id;
        const locked = !supporterUnlocked && isSupporterColorTheme(option.id);
        const label = t(option.labelKey);
        return (
          <button
            key={option.id}
            type="button"
            className={[
              'settings-sheet__theme-option',
              selected ? 'settings-sheet__theme-option--selected' : '',
              locked ? 'settings-sheet__theme-option--locked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              if (locked) {
                onRequestSupporterUnlock();
                return;
              }
              onChange(option.id);
            }}
            role="radio"
            aria-checked={selected}
            aria-disabled={locked}
            aria-label={
              locked
                ? t('settings.supporterLockedAria', { label })
                : t('settings.colorThemeOptionAria', { label })
            }
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
            <span className="settings-sheet__theme-label">
              {label}
              {locked ? (
                <span className="settings-sheet__lock-badge" aria-hidden="true">
                  <IconLock />
                </span>
              ) : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface AppIconPickerProps {
  value: AppIconChoice;
  supporterUnlocked: boolean;
  onChange: (value: AppIconChoice) => void;
  onRequestSupporterUnlock: () => void;
}

function AppIconPicker({
  value,
  supporterUnlocked,
  onChange,
  onRequestSupporterUnlock,
}: AppIconPickerProps) {
  const { t } = useTranslation();

  return (
    <div className="settings-sheet__icon-grid" role="radiogroup" aria-label={t('settings.appIconAria')}>
      {APP_ICON_OPTIONS.map((option) => {
        const selected = value === option.id;
        const locked = !supporterUnlocked && isSupporterAppIcon(option.id);
        const label = t(option.labelKey);
        return (
          <button
            key={option.id}
            type="button"
            className={[
              'settings-sheet__icon-option',
              selected ? 'settings-sheet__icon-option--selected' : '',
              locked ? 'settings-sheet__icon-option--locked' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => {
              if (locked) {
                onRequestSupporterUnlock();
                return;
              }
              onChange(option.id);
            }}
            role="radio"
            aria-checked={selected}
            aria-disabled={locked}
            aria-label={
              locked ? t('settings.supporterLockedAria', { label }) : t('settings.appIconOptionAria', { label })
            }
          >
            <span className="settings-sheet__icon-frame">
              <img src={option.preview} alt="" className="settings-sheet__icon-preview" />
              {locked ? (
                <span className="settings-sheet__icon-lock" aria-hidden="true">
                  <IconLock />
                </span>
              ) : null}
            </span>
            <span className="settings-sheet__icon-label">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

function AppIconExpander({
  value,
  supporterUnlocked,
  onChange,
  onRequestSupporterUnlock,
  sheetOpen,
}: AppIconPickerProps & { sheetOpen: boolean }) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const selectedOption =
    APP_ICON_OPTIONS.find((option) => option.id === value) ?? APP_ICON_OPTIONS[0];
  const selectedLabel = t(selectedOption.labelKey);

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
        <span>{t('settings.appIconLabel')}</span>
        <span className="settings-sheet__expander-summary">
          <span className="settings-sheet__icon-frame settings-sheet__icon-frame--summary">
            <img
              src={selectedOption.preview}
              alt=""
              className="settings-sheet__icon-preview settings-sheet__icon-preview--summary"
            />
          </span>
          <span className="settings-sheet__expander-value">{selectedLabel}</span>
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
            supporterUnlocked={supporterUnlocked}
            onChange={(nextValue) => {
              onChange(nextValue);
              setExpanded(false);
            }}
            onRequestSupporterUnlock={onRequestSupporterUnlock}
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
  const { t } = useTranslation();

  return (
    <div className="settings-sheet__calendar-options" role="group" aria-label={t('settings.islamicGroupAria')}>
      <div className="settings-sheet__item settings-sheet__item--stacked">
        <span>{t('settings.islamicSystemLabel')}</span>
        <select
          className="settings-sheet__select"
          value={settings.islamicCalendarMode}
          onChange={(event) =>
            onIslamicCalendarModeChange(event.target.value as IslamicCalendarMode)
          }
          aria-label={t('settings.islamicSystemAria')}
        >
          <option value="tabular">{t('settings.islamicSystemTabular')}</option>
          <option value="ummAlQura">{t('settings.islamicSystemUmmAlQura')}</option>
        </select>
      </div>
      <div className="settings-sheet__item settings-sheet__item--stacked">
        <span>{t('settings.islamicAdjustmentLabel')}</span>
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
  const { t } = useTranslation();

  return (
    <div className="settings-sheet__calendar-options" role="group" aria-label={t('settings.julianDayGroupAria')}>
      <div className="settings-sheet__item settings-sheet__item--stacked">
        <span>{t('settings.julianDayLabel')}</span>
        <SheetToggle
          checked={settings.useModifiedJulianDay}
          label={t('settings.julianDayToggle')}
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
  onRememberLastOpenedDateChange,
  onAppIconChange,
  onRequestSupporterUnlock,
  onAppLanguageChange,
  onAboutOpen,
}: SettingsSheetProps) {
  const { t } = useTranslation();
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
        aria-label={t('settings.closeAria')}
        aria-hidden={!open}
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
                aria-label={t('settings.backAria')}
              >
                <IconChevronLeft />
              </button>
            ) : (
              <span className="settings-sheet__header-spacer" aria-hidden="true" />
            )}
            <h2 id="settings-sheet-title" className="settings-sheet__title">
              {panel === 'calendars' ? t('settings.selectCalendarsTitle') : t('settings.title')}
            </h2>
            <span className="settings-sheet__header-spacer" aria-hidden="true" />
          </div>
        </div>

        <div className="settings-sheet__content">
          {panel === 'main' ? (
            <>
              <section className="settings-sheet__section">
                <h3>{t('settings.sectionCalendars')}</h3>
                <ul className="settings-sheet__list">
                  <li>
                    <button
                      type="button"
                      className="settings-sheet__nav-item"
                      onClick={() => setPanel('calendars')}
                    >
                      <span className="settings-sheet__nav-copy">
                        <span className="settings-sheet__nav-label">{t('settings.selectCalendarsTitle')}</span>
                        <span className="settings-sheet__nav-detail">
                          {t('settings.selectCalendarsCount', {
                            count: visibleCalendarCount,
                            total: DEFAULT_CALENDAR_ORDER.length,
                          })}
                        </span>
                      </span>
                      <IconChevronRight />
                    </button>
                  </li>
                </ul>
              </section>

              <section className="settings-sheet__section">
                <h3>{t('settings.sectionSettings')}</h3>
                <ul className="settings-sheet__list">
                  <li className="settings-sheet__item settings-sheet__item--stacked">
                    <span>{t('settings.language')}</span>
                    <select
                      className="settings-sheet__select"
                      value={settings.appLanguagePreference}
                      onChange={(event) =>
                        onAppLanguageChange(event.target.value as AppLanguagePreference)
                      }
                      aria-label={t('settings.languageAria')}
                    >
                      <option value="system">{t('settings.languageSystem')}</option>
                      {APP_LANGUAGES.map((language) => (
                        <option key={language} value={language}>
                          {LANGUAGE_LABELS[language]}
                        </option>
                      ))}
                    </select>
                  </li>
                  <li className="settings-sheet__item">
                    <span>{t('settings.transliterateLabel')}</span>
                    <SheetToggle
                      checked={settings.transliterateToEnglish}
                      label={t('settings.transliterateAria')}
                      onChange={() => onTransliterateChange(!settings.transliterateToEnglish)}
                    />
                  </li>
                  <li className="settings-sheet__item">
                    <span>{t('settings.rememberLastDateLabel')}</span>
                    <SheetToggle
                      checked={settings.rememberLastOpenedDate}
                      label={t('settings.rememberLastDateAria')}
                      onChange={() =>
                        onRememberLastOpenedDateChange(!settings.rememberLastOpenedDate)
                      }
                    />
                  </li>
                  <li className="settings-sheet__item settings-sheet__item--stacked">
                    <span>{t('settings.colorThemeLabel')}</span>
                    <ColorThemePicker
                      value={settings.colorTheme}
                      supporterUnlocked={settings.supporterUnlocked}
                      onChange={onColorThemeChange}
                      onRequestSupporterUnlock={onRequestSupporterUnlock}
                    />
                  </li>
                  <AppIconExpander
                    value={settings.appIcon}
                    supporterUnlocked={settings.supporterUnlocked}
                    onChange={onAppIconChange}
                    onRequestSupporterUnlock={onRequestSupporterUnlock}
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
                        <span className="settings-sheet__nav-label">{t('settings.about')}</span>
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
                      <span>{t(`calendars.name.${id}`)}</span>
                      <SheetToggle
                        checked={settings.visibleCalendars[id]}
                        label={t('settings.selectCalendarsToggleAria', { calendar: t(`calendars.name.${id}`) })}
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
