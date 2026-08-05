import { useEffect, useRef, useState } from 'react';
import {
  CALENDAR_INFO,
  CALENDAR_TYPE_LABELS,
  type CalendarSystemType,
} from '../data/calendarInfo';
import type { CalendarId } from '../lib/calendarRegistry';
import { CALENDAR_NAMES } from '../theme/calendarTheme';
import { WorldUsageMap } from './WorldUsageMap';

interface CalendarInfoModalProps {
  calendarId: CalendarId | null;
  onClose: () => void;
}

const MODAL_TRANSITION_MS = 280;

function CalendarTypeIcon({ type }: { type: CalendarSystemType }) {
  if (type === 'lunar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 14.5A8.5 8.5 0 0 1 9.5 3 7 7 0 1 0 21 14.5Z" />
      </svg>
    );
  }

  if (type === 'lunisolar') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="7" cy="12" r="3" />
        <path d="M7 6.25v1.75M7 15v1.75M3.25 12H2.25" />
        <path d="M18.25 14.75A5 5 0 0 1 13.25 8 4 4 0 1 0 18.25 14.75Z" />
      </svg>
    );
  }

  if (type === 'continuous') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 7h16M4 12h16M4 17h10" />
        <circle cx="19" cy="17" r="2" />
      </svg>
    );
  }

  if (type === 'mixed') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="8" cy="12" r="4" />
        <path d="M16 8v8M12 12h8" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
    </svg>
  );
}

export function CalendarInfoModal({ calendarId, onClose }: CalendarInfoModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [renderedId, setRenderedId] = useState<CalendarId | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (calendarId) {
      setRenderedId(calendarId);
      const frame = window.requestAnimationFrame(() => {
        setVisible(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    setVisible(false);
  }, [calendarId]);

  useEffect(() => {
    if (visible || !renderedId || calendarId) {
      return;
    }

    const timer = window.setTimeout(() => setRenderedId(null), MODAL_TRANSITION_MS);
    return () => window.clearTimeout(timer);
  }, [visible, renderedId, calendarId]);

  useEffect(() => {
    if (!renderedId || !visible) {
      return;
    }

    closeButtonRef.current?.focus();
  }, [renderedId, visible]);

  useEffect(() => {
    if (!renderedId) {
      return;
    }

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
  }, [renderedId, onClose]);

  if (!renderedId) {
    return null;
  }

  const info = CALENDAR_INFO[renderedId];
  const title = CALENDAR_NAMES[renderedId];

  return (
    <div className={`info-modal${visible ? ' info-modal--visible' : ''}`} role="presentation">
      <button type="button" className="info-modal__backdrop" aria-label="Close calendar info" onClick={onClose} />
      <div
        className="info-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-info-title"
      >
        <div className="info-modal__hero">
          <div className="info-modal__hero-placeholder" aria-hidden="true">
            <span>Image coming soon</span>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="info-modal__close"
            aria-label="Close"
            onClick={onClose}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <div className="info-modal__content">
          <h2 id="calendar-info-title" className="info-modal__title">
            {title}
          </h2>

          <dl className="info-modal__facts">
            <div className="info-modal__fact">
              <dt>Type</dt>
              <dd>
                <span className="info-modal__type-badge">
                  <CalendarTypeIcon type={info.calendarType} />
                  {CALENDAR_TYPE_LABELS[info.calendarType]}
                </span>
              </dd>
            </div>
            <div className="info-modal__fact">
              <dt>First implemented</dt>
              <dd>{info.firstImplemented}</dd>
            </div>
          </dl>

          <p className="info-modal__history">{info.history}</p>

          <section className="info-modal__map-section" aria-label="Geographic usage">
            <h3>Where it is used</h3>
            <WorldUsageMap highlighted={info.mapCountries} />
            <ul className="info-modal__countries">
              {info.usedIn.map((place) => (
                <li key={place}>{place}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
