import { Capacitor } from '@capacitor/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { DonationThankYouModal } from './DonationThankYouModal';
import { useTranslation } from 'react-i18next';
import { IconTipJar } from './IconTipJar';
import { useTipJar } from '../hooks/useTipJar';
import { requestNativeAppReview } from '../lib/appReview';
import { focusWithoutScroll, setBodyScrollLocked } from '../lib/nativeOverlay';
import {
  TIP_PRODUCT_IDS,
  TIP_PRODUCT_LABEL_KEYS,
  TIP_PRODUCT_PRICE_HINTS_USD,
  TIP_PRODUCT_TIERS,
  TIP_TIERS,
  TIP_TIER_LABEL_KEYS,
} from '../data/tipProducts';
import { toIntlLocale, type AppLanguage } from '../i18n/language';
import {
  getAppReviewUrl,
  getDonationChannel,
  getExternalTipUrl,
} from '../theme/supportLinks';

interface DonateModalProps {
  open: boolean;
  onClose: () => void;
  onSupporterUnlock?: () => void;
}

function IconStar() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3.2l2.45 4.96 5.48.8-3.96 3.86.93 5.46L12 15.9l-4.9 2.58.93-5.46-3.96-3.86 5.48-.8L12 3.2Z" />
    </svg>
  );
}

function formatTipPrice(amountUsd: number, language: string): string {
  return new Intl.NumberFormat(toIntlLocale(language as AppLanguage), {
    style: 'currency',
    currency: 'USD',
  }).format(amountUsd);
}

export function DonateModal({
  open,
  onClose,
  onSupporterUnlock,
}: DonateModalProps) {
  const { t, i18n } = useTranslation();
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [thankYouOpen, setThankYouOpen] = useState(false);
  const handlePurchaseSuccess = useCallback(() => {
    onSupporterUnlock?.();
    setThankYouOpen(true);
  }, [onSupporterUnlock]);
  const { products, status, purchasingId, feedback, buyTip, isAvailable: tipJarAvailable } =
    useTipJar(open, handlePurchaseSuccess);
  const donationChannel = getDonationChannel();
  const showIapTips = donationChannel === 'iap' && tipJarAvailable;
  const showExternalTips = donationChannel === 'external';
  const showTips = showIapTips || showExternalTips;
  const productById = new Map(products.map((product) => [product.id, product]));

  useEffect(() => {
    if (!open) {
      setThankYouOpen(false);
    }
  }, [open]);

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

  const platform = Capacitor.getPlatform();
  const reviewStoreLabel =
    platform === 'android'
      ? t('modals.donate.storeGooglePlay')
      : t('modals.donate.storeAppStore');

  const openAppReview = () => {
    if (Capacitor.isNativePlatform()) {
      void requestNativeAppReview();
      return;
    }

    window.open(getAppReviewUrl(), '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <div
        className={`donate-modal${open && !thankYouOpen ? ' donate-modal--visible' : ''}`}
        aria-hidden={!(open && !thankYouOpen)}
      >
      <button type="button" className="donate-modal__backdrop" onClick={onClose} aria-label={t('common.close')} />
      <div
        className="donate-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="donate-modal-title"
      >
        <header className="donate-modal__header">
          <div className="donate-modal__title-row">
            <span className="donate-modal__icon">
              <IconTipJar />
            </span>
            <h2 id="donate-modal-title">{t('modals.donate.title')}</h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            className="donate-modal__close"
            onClick={onClose}
            aria-label={t('common.close')}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="donate-modal__body">
          <p>{t('modals.donate.intro')}</p>
          <p>{t('modals.donate.free')}</p>
          <p>{t('modals.donate.rating', { store: reviewStoreLabel })}</p>
          {showTips ? <p>{t('modals.donate.tipJar')}</p> : <p>{t('modals.donate.thanks')}</p>}
        </div>

        <footer className="donate-modal__footer">
          <div className="donate-modal__footer-actions">
            <button type="button" className="donate-modal__btn donate-modal__btn--primary" onClick={openAppReview}>
              <span className="donate-modal__btn-star" aria-hidden="true">
                <IconStar />
              </span>
              {t('modals.donate.rateButton', { store: reviewStoreLabel })}
            </button>

            {showTips ? (
              <div className="donate-modal__tip-jar" aria-label={t('modals.donate.tipsAria')}>
                {showIapTips && status === 'loading' ? (
                  <p className="donate-modal__tip-status">{t('modals.donate.loadingTips')}</p>
                ) : null}
                {showIapTips
                  ? TIP_PRODUCT_IDS.map((productId) => {
                      const product = productById.get(productId);
                      const tier = TIP_PRODUCT_TIERS[productId];
                      return (
                        <button
                          key={productId}
                          type="button"
                          className="donate-modal__tip-btn"
                          onClick={() => void buyTip(productId)}
                          disabled={purchasingId !== null || status === 'loading'}
                        >
                          <span className="donate-modal__tip-btn-label">
                            {t(TIP_PRODUCT_LABEL_KEYS[productId])}
                          </span>
                          <span className="donate-modal__tip-btn-price">
                            {product?.priceString ??
                              formatTipPrice(TIP_PRODUCT_PRICE_HINTS_USD[tier], i18n.language)}
                          </span>
                        </button>
                      );
                    })
                  : TIP_TIERS.map((tier) => (
                    <a
                      key={tier}
                      className="donate-modal__tip-btn donate-modal__tip-btn--link"
                      href={getExternalTipUrl(tier)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="donate-modal__tip-btn-label">{t(TIP_TIER_LABEL_KEYS[tier])}</span>
                      <span className="donate-modal__tip-btn-price">
                        {formatTipPrice(TIP_PRODUCT_PRICE_HINTS_USD[tier], i18n.language)}
                      </span>
                    </a>
                  ))}
              </div>
            ) : null}
          </div>

          {feedback ? <p className="donate-modal__feedback">{feedback}</p> : null}

          <button type="button" className="donate-modal__btn donate-modal__btn--ghost" onClick={onClose}>
            {t('modals.donate.notNow')}
          </button>
        </footer>
      </div>
      </div>
      <DonationThankYouModal
        open={open && thankYouOpen}
        onClose={() => {
          setThankYouOpen(false);
          onClose();
        }}
      />
    </>
  );
}
