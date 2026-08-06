import { useEffect, useRef } from 'react';
import { DONATION_URL, getAppReviewUrl, getReviewStoreLabel } from '../theme/supportLinks';

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
}

function IconCoffee() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 8h11v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8Z" />
      <path d="M17 10h1.8a2.2 2.2 0 0 1 0 4.4H17M7 5v1.5M11 5v1.5M15 5v1.5" />
    </svg>
  );
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2l2.45 4.96 5.48.8-3.96 3.86.93 5.46L12 15.9l-4.9 2.58.93-5.46-3.96-3.86 5.48-.8L12 3.2Z" />
    </svg>
  );
}

export function DonateModal({ open, onClose }: DonateModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  const reviewStoreLabel = getReviewStoreLabel();

  const openAppReview = () => {
    window.open(getAppReviewUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <div className={`donate-modal${open ? ' donate-modal--visible' : ''}`} aria-hidden={!open}>
      <button type="button" className="donate-modal__backdrop" onClick={onClose} aria-label="Close" />
      <div
        className="donate-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donate-modal-title"
      >
        <header className="donate-modal__header">
          <div className="donate-modal__title-row">
            <span className="donate-modal__icon">
              <IconCoffee />
            </span>
            <h2 id="donate-modal-title">Support Almaniac</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="donate-modal__close"
            onClick={onClose}
            aria-label="Close"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="donate-modal__body">
          <p>
            I&apos;m Chris Engelsma. I built Almaniac to compare dates across calendar systems
            without jumping between converters.
          </p>
          <p>
            Almaniac is free to use, with no ads, subscriptions, or tracking.
          </p>
          <p>
            If you like the app, a 5-star rating on the App Store or Google Play helps a lot. It
            also helps other people find Almaniac.
          </p>
          <p>
            You&apos;re also welcome to buy me a coffee as a thank-you. Either way, thanks for
            using Almaniac.
          </p>
        </div>

        <footer className="donate-modal__footer">
          <div className="donate-modal__footer-actions">
            <button type="button" className="donate-modal__btn donate-modal__btn--primary" onClick={openAppReview}>
              <span className="donate-modal__btn-star" aria-hidden="true">
                <IconStar />
              </span>
              Rate 5-star {reviewStoreLabel}
            </button>
            <a
              className="donate-modal__btn donate-modal__btn--coffee"
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconCoffee />
              Buy me a coffee
            </a>
          </div>
          <button type="button" className="donate-modal__btn donate-modal__btn--ghost" onClick={onClose}>
            Not now
          </button>
        </footer>
      </div>
    </div>
  );
}
