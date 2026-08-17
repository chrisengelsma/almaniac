import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { countryName } from '../data/countryNames';
import type { CalendarInfo } from '../data/calendarInfo';
import type { AppLanguage } from '../i18n/language';
import {
  JULIAN_TIMELINE_EVENT_YEARS,
  getJulianStartsInYear,
  getJulianStopsInYear,
  getJulianUsersAtYear,
} from '../data/julianUsage';
import { formatHistoricalYear } from '../lib/historicalYear';
import { WorldUsageMap } from './WorldUsageMap';

type MapTab = 'usage' | 'timeline';

interface JulianMapSectionProps {
  info: CalendarInfo;
  mapColors: { stroke: string; fill: string };
  language: AppLanguage;
  usedIn: string[];
}

function TimelineEventList({
  title,
  codes,
  language,
}: {
  title: string;
  codes: string[];
  language: AppLanguage;
}) {
  if (codes.length === 0) {
    return null;
  }

  return (
    <div className="adoption-slider__event">
      <h4>{title}</h4>
      <ul className="info-modal__countries adoption-slider__countries">
        {codes.map((code) => (
          <li key={code}>{countryName(code, language)}</li>
        ))}
      </ul>
    </div>
  );
}

export function JulianMapSection({ info, mapColors, language, usedIn }: JulianMapSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MapTab>('usage');
  const [timelineYearIndex, setTimelineYearIndex] = useState(0);
  const timelineYear = JULIAN_TIMELINE_EVENT_YEARS[timelineYearIndex];

  const activeCountries = useMemo(
    () => getJulianUsersAtYear(timelineYear),
    [timelineYear],
  );

  const startedInYear = useMemo(
    () => getJulianStartsInYear(timelineYear),
    [timelineYear],
  );

  const stoppedInYear = useMemo(
    () => getJulianStopsInYear(timelineYear),
    [timelineYear],
  );

  const yearLabel = formatHistoricalYear(timelineYear);
  const countryLabel =
    activeCountries.length === 1 ? t('common.country') : t('common.countries');

  return (
    <section className="info-modal__map-section" aria-label={t('modals.calendarInfo.geoAria')}>
      <div className="info-modal__map-tabs" role="tablist" aria-label={t('modals.calendarInfo.mapTabsAria')}>
        <button
          type="button"
          role="tab"
          id="julian-map-tab-usage"
          aria-selected={activeTab === 'usage'}
          aria-controls="julian-map-panel-usage"
          className={`info-modal__map-tab${activeTab === 'usage' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          {t('modals.calendarInfo.whereUsed')}
        </button>
        <button
          type="button"
          role="tab"
          id="julian-map-tab-timeline"
          aria-selected={activeTab === 'timeline'}
          aria-controls="julian-map-panel-timeline"
          className={`info-modal__map-tab${activeTab === 'timeline' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('timeline')}
        >
          {t('modals.calendarInfo.timelineTab')}
        </button>
      </div>

      {activeTab === 'usage' ? (
        <div
          id="julian-map-panel-usage"
          role="tabpanel"
          aria-labelledby="julian-map-tab-usage"
        >
          <WorldUsageMap
            highlighted={info.mapCountries}
            strokeColor={mapColors.stroke}
            fillColor={mapColors.fill}
          />
          <ul className="info-modal__countries">
            {usedIn.map((place) => (
              <li key={place}>{place}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div
          id="julian-map-panel-timeline"
          role="tabpanel"
          aria-labelledby="julian-map-tab-timeline"
        >
          <div className="adoption-slider">
            <label className="adoption-slider__label" htmlFor="julian-timeline-year">
              {t('modals.calendarInfo.julianSliderLabel')}
            </label>
            <div className="adoption-slider__row">
              <span className="adoption-slider__bound adoption-slider__bound--wide">
                {formatHistoricalYear(JULIAN_TIMELINE_EVENT_YEARS[0])}
              </span>
              <input
                id="julian-timeline-year"
                className="adoption-slider__input"
                type="range"
                min={0}
                max={JULIAN_TIMELINE_EVENT_YEARS.length - 1}
                step={1}
                value={timelineYearIndex}
                onChange={(event) => setTimelineYearIndex(Number(event.target.value))}
                aria-valuetext={yearLabel}
              />
              <span className="adoption-slider__bound adoption-slider__bound--wide">
                {formatHistoricalYear(
                  JULIAN_TIMELINE_EVENT_YEARS[JULIAN_TIMELINE_EVENT_YEARS.length - 1],
                )}
              </span>
            </div>
            <p className="adoption-slider__year" aria-live="polite">
              <strong>{yearLabel}</strong>
            </p>
            <p className="adoption-slider__summary">
              {t('modals.calendarInfo.julianUsageSummary', {
                count: activeCountries.length,
                countryLabel,
              })}
            </p>
          </div>

          <WorldUsageMap
            highlighted={activeCountries}
            strokeColor={mapColors.stroke}
            fillColor={mapColors.fill}
          />

          <div className="adoption-slider__new adoption-slider__new--dual">
            <TimelineEventList
              title={t('modals.calendarInfo.julianAdoptedIn', { yearLabel })}
              codes={startedInYear}
              language={language}
            />
            <TimelineEventList
              title={t('modals.calendarInfo.julianStoppedIn', { yearLabel })}
              codes={stoppedInYear}
              language={language}
            />
          </div>
        </div>
      )}
    </section>
  );
}
