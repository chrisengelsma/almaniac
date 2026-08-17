import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { APP_VERSION } from '../theme/appBranding';
import { SITE_URL } from '../theme/supportLinks';
import { getAllBannerAttributions } from '../data/imageAttributions';
import { focusWithoutScroll, setBodyScrollLocked } from '../lib/nativeOverlay';

interface AboutModalProps {
  open: boolean;
  onClose: () => void;
}

export function AboutModal({ open, onClose }: AboutModalProps) {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const attributions = getAllBannerAttributions();
  const appTitle = t('branding.appTitle');

  useEffect(() => {
    if (!open) {
      return;
    }

    focusWithoutScroll(closeButtonRef.current);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    setBodyScrollLocked(true);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      setBodyScrollLocked(false);
    };
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="about-modal about-modal--visible" aria-hidden={false}>
      <button type="button" className="about-modal__backdrop" onClick={onClose} aria-label={t('common.close')} />
      <div
        className="about-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
      >
        <header className="about-modal__header">
          <h2 id="about-modal-title">{t('modals.about.title', { appTitle })}</h2>
          <button
            ref={closeButtonRef}
            type="button"
            className="about-modal__close"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="about-modal__body">
          <p>{t('modals.about.description')}</p>

          {attributions.length > 0 ? (
            <section className="about-modal__credits" aria-labelledby="about-credits-title">
              <h3 id="about-credits-title">{t('modals.about.creditsTitle')}</h3>
              {attributions.map((entry) => (
                <article key={entry.calendarId} className="about-modal__credit-group">
                  <h4>
                    {t('modals.about.bannerTitle', {
                      calendar: t(`calendars.name.${entry.calendarId}`),
                    })}
                  </h4>
                  <p>{t(`modals.about.banners.${entry.calendarId}.aboutNote`)}</p>
                  <ul className="about-modal__credit-list">
                    {entry.sources.map((source) => (
                      <li key={source.sourceUrl}>
                        <a href={source.sourceUrl} target="_blank" rel="noopener noreferrer">
                          {source.title}
                        </a>
                        {` ${t('common.by')} `}
                        {source.author}
                        {', '}
                        <a href={source.licenseUrl} target="_blank" rel="noopener noreferrer">
                          {source.license}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <p className="about-modal__derived-license">
                    {t('modals.about.derivedLicensePrefix')}{' '}
                    <a href={entry.derivedLicenseUrl} target="_blank" rel="noopener noreferrer">
                      {entry.derivedLicense}
                    </a>
                    .
                  </p>
                </article>
              ))}
            </section>
          ) : null}

          <p className="about-modal__site-link">
            <a href={SITE_URL} target="_blank" rel="noopener noreferrer">
              engelsma.dev
            </a>
          </p>

          <div className="about-modal__meta">
            <span>{t('modals.about.version', { version: APP_VERSION })}</span>
            <span>{t('modals.about.copyright')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
