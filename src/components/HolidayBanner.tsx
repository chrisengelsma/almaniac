import type { ReligiousHoliday } from '../lib/religiousHolidays';

interface HolidayBannerProps {
  holidays: ReligiousHoliday[];
}

const TRADITION_LABEL: Record<ReligiousHoliday['tradition'], string> = {
  christian: 'Christian',
  jewish: 'Jewish',
  islamic: 'Islamic',
};

export function HolidayBanner({ holidays }: HolidayBannerProps) {
  if (holidays.length === 0) {
    return null;
  }

  return (
    <section className="holiday-banner" aria-label="Religious holidays on this date">
      <ul className="holiday-banner__list">
        {holidays.map((holiday) => (
          <li
            key={`${holiday.tradition}-${holiday.name}`}
            className={`holiday-banner__chip holiday-banner__chip--${holiday.tradition}`}
          >
            <span className="holiday-banner__tradition">{TRADITION_LABEL[holiday.tradition]}</span>
            <span className="holiday-banner__name">{holiday.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
