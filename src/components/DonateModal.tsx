import { useEffect, useRef } from 'react';
import { DONATION_URL } from '../theme/supportLinks';

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
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
          <h2 id="donate-modal-title">Keep Almaniac free</h2>
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
            Almaniac is always free — no ads, no subscriptions, and no tracking. But keeping it
            running takes real work: app stores, hosting, and ongoing development.
          </p>
          <p>
            If you find it useful, a small tip goes a long way. Thank you for being here.
          </p>
        </div>

        <footer className="donate-modal__footer">
          <button type="button" className="donate-modal__btn donate-modal__btn--ghost" onClick={onClose}>
            Not now
          </button>
          <a
            className="donate-modal__btn donate-modal__btn--primary"
            href={DONATION_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            Buy me a coffee
          </a>
        </footer>
      </div>
    </div>
  );
}
