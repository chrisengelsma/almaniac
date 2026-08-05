import { useEffect, useRef } from 'react';
import { APP_TITLE } from '../theme/appBranding';
import { CALENDAR_NAMES } from '../theme/calendarTheme';
import { getAllBannerAttributions } from '../data/imageAttributions';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const attributions = getAllBannerAttributions();

  useEffect(() => {
    if (!open) {
      return;
    }

    closeButtonRef.current?.focus();

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

  return (
    <div className={`about-modal${open ? ' about-modal--visible' : ''}`} aria-hidden={!open}>
      <button type="button" className="about-modal__backdrop" onClick={onClose} aria-label="Close" />
      <div
        className="about-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        <header className="about-modal__header">
          <h2 id="about-modal-title">About {APP_TITLE}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="about-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="about-modal__body">
          <p>
            Almaniac shows one date across many calendar systems — from the Gregorian and Julian
            calendars to Hebrew, Islamic, Chinese, Maya, and more.
          </p>

          {attributions.length > 0 ? (
            <section className="about-modal__credits" aria-labelledby="about-credits-title">
              <h3 id="about-credits-title">Image credits</h3>
              {attributions.map((entry) => (
                <article key={entry.calendarId} className="about-modal__credit-group">
                  <h4>{CALENDAR_NAMES[entry.calendarId]} banner</h4>
                  <p>{entry.aboutNote}</p>
                  <ul className="about-modal__credit-list">
                    {entry.sources.map((source) => (
                      <li key={source.sourceUrl}>
                        <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {source.title}
                        </a>
                        {' by '}
                        {source.author}
                        {' — '}
                        <a href={source.licenseUrl} target="_blank" rel="noopener noreferrer">
                          {source.license}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="about-modal__derived-license">
                    Derivative banner shared under{' '}
                    <a href={entry.derivedLicenseUrl} target="_blank" rel="noopener noreferrer">
                      {entry.derivedLicense}
                    </a>
                    .
                  </p>
                </article>
              ))}
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
