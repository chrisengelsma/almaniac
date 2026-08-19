import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { focusWithoutScroll, setBodyScrollLocked } from '../lib/nativeOverlay';

interface DonationThankYouModalProps {
  open: boolean;
  onClose: () => void;
}

export function DonationThankYouModal({ open, onClose }: DonationThankYouModalProps) {
  const { t } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

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

  return (
    <div className={`donation-thank-you${open ? ' donation-thank-you--visible' : ''}`} aria-hidden={!open}>
      <button
        type="button"
        className="donation-thank-you__backdrop"
        onClick={onClose}
        aria-label={t('common.close')}
      />
      <div
        className="donation-thank-you__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donation-thank-you-title"
      >
        <span className="donation-thank-you__emoji" aria-hidden="true">
          🙏
        </span>
        <h2 id="donation-thank-you-title" className="donation-thank-you__title">
          {t('modals.donate.thankYouTitle')}
        </h2>
        <p className="donation-thank-you__message">{t('modals.donate.thankYouMessage')}</p>
        <p className="donation-thank-you__perk">{t('modals.donate.thankYouPerk')}</p>
        <button
          ref={closeButtonRef}
          type="button"
          className="donation-thank-you__btn"
          onClick={onClose}
        >
          {t('modals.donate.thankYouDismiss')}
        </button>
      </div>
    </div>
  );
}
