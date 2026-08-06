import { useEffect, useRef, useState } from 'react';
import type { ColorScheme } from '../lib/appSettings';
import { THEME_ICON_MS } from '../lib/themeTransition';

const ANIMATION_MS = THEME_ICON_MS;

interface ThemeToggleButtonProps {
  colorScheme: ColorScheme;
  onToggle: () => void;
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" />
    </svg>
  );
}

function IconSun() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function ThemeToggleButton({ colorScheme, onToggle }: ThemeToggleButtonProps) {
  const isDark = colorScheme === 'dark';
  const [phase, setPhase] = useState<'idle' | 'to-dark' | 'to-light'>('idle');
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    if (phase !== 'idle') {
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onToggle();
      return;
    }

    const nextPhase = isDark ? 'to-light' : 'to-dark';
    setPhase(nextPhase);
    onToggle();

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setPhase('idle');
    }, ANIMATION_MS);
  };

  const modeClass =
    phase === 'idle'
      ? isDark
        ? 'theme-toggle--dark'
        : 'theme-toggle--light'
      : `theme-toggle--animating-${phase}`;

  return (
    <button
      type="button"
      className={`icon-button theme-toggle ${modeClass}`}
      onClick={handleClick}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
    >
      <span className="theme-toggle__viewport" aria-hidden="true">
        <span className="theme-toggle__icon theme-toggle__icon--sun">
          <IconSun />
        </span>
        <span className="theme-toggle__icon theme-toggle__icon--moon">
          <IconMoon />
        </span>
      </span>
    </button>
  );
}
