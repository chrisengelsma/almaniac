import { useEffect, useRef, useState } from 'react';
import { CALENDAR_NAMES } from '../theme/calendarTheme';
import {
  DEFAULT_CALENDAR_ORDER,
  type CalendarId,
} from '../lib/calendarRegistry';
import type { AppSettings, IslamicCalendarMode, IslamicDayAdjustment } from '../lib/appSettings';
import { SheetSlider, SheetToggle } from './DrawerControls';

const DISMISS_THRESHOLD_PX = 80;
const SHEET_TRANSITION_MS = 320;

interface SettingsSheetProps {
  open: boolean;
  settings: AppSettings;
  onClose: () => void;
  onToggleCalendar: (id: CalendarId) => void;
  onTransliterateChange: (value: boolean) => void;
  onIslamicCalendarModeChange: (value: IslamicCalendarMode) => void;
  onIslamicAdjustmentChange: (value: IslamicDayAdjustment) => void;
  onChristianHolidaysChange: (value: boolean) => void;
  onJewishHolidaysChange: (value: boolean) => void;
  onIslamicHolidaysChange: (value: boolean) => void;
}

export function SettingsSheet({
  open,
  settings,
  onClose,
  onToggleCalendar,
  onTransliterateChange,
  onIslamicCalendarModeChange,
  onIslamicAdjustmentChange,
  onChristianHolidaysChange,
  onJewishHolidaysChange,
  onIslamicHolidaysChange,
}: SettingsSheetProps) {
  const sheetRef = useRef<HTMLElement>(null);
  const dragStartY = useRef<number | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!open) {
      setDragOffset(0);
      setIsDragging(false);
      dragStartY.current = null;
      return;
    }

    sheetRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

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
        <div
          className="settings-sheet__header"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
        >
          <div className="settings-sheet__handle" aria-hidden="true" />
          <h2 id="settings-sheet-title" className="settings-sheet__title">
            Customize
          </h2>
        </div>

        <div className="settings-sheet__content">
          <section className="settings-sheet__section">
            <h3>Calendars</h3>
            <ul className="settings-sheet__list">
              {DEFAULT_CALENDAR_ORDER.map((id) => (
                <li key={id} className="settings-sheet__item">
                  <span>{CALENDAR_NAMES[id]}</span>
                  <SheetToggle
                    checked={settings.visibleCalendars[id]}
                    label={`Toggle ${CALENDAR_NAMES[id]}`}
                    onChange={() => onToggleCalendar(id)}
                  />
                </li>
              ))}
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
              </li>
              <li className="settings-sheet__item settings-sheet__item--stacked">
                <span>Islamic Calendar Day Adjustment</span>
                <SheetSlider
                  min={-1}
                  max={1}
                  value={settings.islamicDayAdjustment}
                  onChange={(value) => onIslamicAdjustmentChange(value as IslamicDayAdjustment)}
                />
              </li>
            </ul>
          </section>

          <section className="settings-sheet__section">
            <h3>Holidays</h3>
            <ul className="settings-sheet__list">
              <li className="settings-sheet__item">
                <span>Christian holidays</span>
                <SheetToggle
                  checked={settings.showChristianHolidays}
                  label="Show Christian holidays"
                  onChange={() => onChristianHolidaysChange(!settings.showChristianHolidays)}
                />
              </li>
              <li className="settings-sheet__item">
                <span>Jewish holidays</span>
                <SheetToggle
                  checked={settings.showJewishHolidays}
                  label="Show Jewish holidays"
                  onChange={() => onJewishHolidaysChange(!settings.showJewishHolidays)}
                />
              </li>
              <li className="settings-sheet__item">
                <span>Islamic holidays</span>
                <SheetToggle
                  checked={settings.showIslamicHolidays}
                  label="Show Islamic holidays"
                  onChange={() => onIslamicHolidaysChange(!settings.showIslamicHolidays)}
                />
              </li>
            </ul>
          </section>
        </div>
      </aside>
    </>
  );
}
