import { useTranslation } from 'react-i18next';
import type { ReligiousHoliday } from '../lib/religiousHolidays';

interface HolidayBannerProps {
  holidays: ReligiousHoliday[];
}

export function HolidayBanner({ holidays }: HolidayBannerProps) {
  const { t } = useTranslation();

  if (holidays.length === 0) {
    return null;
  }

  return (
    <section className="holiday-banner" aria-label={t('holidays.bannerAria')}>
      <ul className="holiday-banner__list">
        {holidays.map((holiday) => (
          <li
            key={`${holiday.tradition}-${holiday.id}`}
            className={`holiday-banner__chip holiday-banner__chip--${holiday.tradition}`}
          >
            <span className="holiday-banner__tradition">
              {t(`holidays.tradition.${holiday.tradition}`)}
            </span>
            <span className="holiday-banner__name">{t(`holidays.${holiday.id}`)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
