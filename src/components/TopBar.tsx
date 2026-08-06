import type { CSSProperties } from 'react';
import { APP_LOGO, APP_TAGLINE, APP_TITLE } from '../theme/appBranding';
import type { ColorScheme } from '../lib/appSettings';
import type { ThemeTransitionDelays } from '../lib/themeTransition';
import { ThemeToggleButton } from './ThemeToggleButton';

interface TopBarProps {
  colorScheme: ColorScheme;
  onDonateOpen: () => void;
  onCustomizeOpen: () => void;
  onDateClick: () => void;
  onColorSchemeToggle: () => void;
  themeTransitionDelays?: ThemeTransitionDelays | null;
  onBack30: () => void;
  onBack1: () => void;
  onToday: () => void;
  onForward1: () => void;
  onForward30: () => void;
}

function IconCoffee() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h11v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
      <path d="M17 10h1.8a2.2 2.2 0 0 1 0 4.4H17M7 5v1.5M11 5v1.5M15 5v1.5" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 3v2M17 3v2M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 12h2M8 12h12M4 17h8M16 17h4M16 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM8 10.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM14 15.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
    </svg>
  );
}

function IconUndo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 7H5v4M5 11c1.7-3.5 5.3-5.5 9-4.5 3.2 0.9 5.4 3.8 5.4 7.1 0 4.1-3.3 7.4-7.4 7.4-2.8 0-5.3-1.6-6.5-4" />
    </svg>
  );
}

function IconRedo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15 7h4v4M19 11c-1.7-3.5-5.3-5.5-9-4.5-3.2 0.9-5.4 3.8-5.4 7.1 0 4.1 3.3 7.4 7.4 7.4 2.8 0 5.3-1.6 6.5-4" />
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

function IconChevronRight() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 6l6 6-6 6" />
    </svg>
  );
}

function IconToday() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 4a8 8 0 1 0 8 8" />
      <path d="M12 2v4M12 12l4.5 2.5" />
    </svg>
  );
}

export function TopBar({
  colorScheme,
  onDonateOpen,
  onCustomizeOpen,
  onDateClick,
  onColorSchemeToggle,
  themeTransitionDelays = null,
  onBack30,
  onBack1,
  onToday,
  onForward1,
  onForward30,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <div
        className="top-bar__app-bar theme-chunk"
        style={
          themeTransitionDelays
            ? ({ '--theme-transition-delay': `${themeTransitionDelays['top-bar-app'] ?? 0}ms` } as CSSProperties)
            : undefined
        }
      >
        <button
          type="button"
          className="icon-button"
          onClick={onDonateOpen}
          aria-label="Support Almaniac"
        >
          <IconCoffee />
        </button>
        <h1 className="top-bar__logo" aria-label={APP_TITLE}>
          <span className="top-bar__logo-word">{APP_LOGO}</span>
          <span className="top-bar__logo-tagline">{APP_TAGLINE}</span>
        </h1>
        <div className="top-bar__actions">
          <button
            type="button"
            className="icon-button"
            onClick={onDateClick}
            aria-label="Jump to date"
          >
            <IconCalendar />
          </button>
          <ThemeToggleButton colorScheme={colorScheme} onToggle={onColorSchemeToggle} />
          <button
            type="button"
            className="icon-button"
            onClick={onCustomizeOpen}
            aria-label="Customize calendars and settings"
          >
            <IconSliders />
          </button>
        </div>
      </div>
      <div
        className="top-bar__controls theme-chunk"
        role="toolbar"
        aria-label="Date navigation"
        style={
          themeTransitionDelays
            ? ({ '--theme-transition-delay': `${themeTransitionDelays['top-bar-controls'] ?? 0}ms` } as CSSProperties)
            : undefined
        }
      >
        <button type="button" className="icon-button" onClick={onBack30} aria-label="Back 30 days">
          <IconUndo />
        </button>
        <button type="button" className="icon-button" onClick={onBack1} aria-label="Back 1 day">
          <IconChevronLeft />
        </button>
        <button type="button" className="icon-button" onClick={onToday} aria-label="Go to today">
          <IconToday />
        </button>
        <button type="button" className="icon-button" onClick={onForward1} aria-label="Forward 1 day">
          <IconChevronRight />
        </button>
        <button type="button" className="icon-button" onClick={onForward30} aria-label="Forward 30 days">
          <IconRedo />
        </button>
      </div>
    </header>
  );
}
