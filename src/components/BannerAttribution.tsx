import { useTranslation } from 'react-i18next';
import type { CalendarId } from '../lib/calendarRegistry';

interface BannerAttributionProps {
  calendarId: CalendarId;
  onAboutOpen?: () => void;
}

export function BannerAttribution({ calendarId, onAboutOpen }: BannerAttributionProps) {
  const { t } = useTranslation();

  if (!onAboutOpen) {
    return null;
  }

  return (
    <p className="info-modal__hero-attribution">
      <span className="info-modal__hero-attribution-subjects">
        {t(`modals.about.banners.${calendarId}.subjects`)}
      </span>
      <button type="button" className="info-modal__hero-attribution-link" onClick={onAboutOpen}>
        {t('modals.about.sourceLink')}
      </button>
    </p>
  );
}
