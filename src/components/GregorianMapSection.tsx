import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { countryName } from '../data/countryNames';
import type { CalendarInfo } from '../data/calendarInfo';
import type { AppLanguage } from '../i18n/language';
import {
  GREGORIAN_ADOPTION_EVENT_YEARS,
  getAdoptedCountryIds,
  getCountriesAdoptedInYear,
} from '../data/gregorianAdoption';
import { WorldUsageMap } from './WorldUsageMap';

type MapTab = 'usage' | 'adoption';

interface GregorianMapSectionProps {
  info: CalendarInfo;
  mapColors: { stroke: string; fill: string };
  language: AppLanguage;
  usedIn: string[];
}

export function GregorianMapSection({ info, mapColors, language, usedIn }: GregorianMapSectionProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<MapTab>('usage');
  const [adoptionYearIndex, setAdoptionYearIndex] = useState(0);
  const adoptionYear = GREGORIAN_ADOPTION_EVENT_YEARS[adoptionYearIndex];

  const adoptedCountries = useMemo(
    () => getAdoptedCountryIds(adoptionYear),
    [adoptionYear],
  );

  const newlyAdopted = useMemo(
    () => getCountriesAdoptedInYear(adoptionYear),
    [adoptionYear],
  );

  const countryLabel =
    adoptedCountries.length === 1 ? t('common.country') : t('common.countries');

  return (
    <section className="info-modal__map-section" aria-label={t('modals.calendarInfo.geoAria')}>
      <div className="info-modal__map-tabs" role="tablist" aria-label={t('modals.calendarInfo.mapTabsAria')}>
        <button
          type="button"
          role="tab"
          id="gregorian-map-tab-usage"
          aria-selected={activeTab === 'usage'}
          aria-controls="gregorian-map-panel-usage"
          className={`info-modal__map-tab${activeTab === 'usage' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          {t('modals.calendarInfo.whereUsed')}
        </button>
        <button
          type="button"
          role="tab"
          id="gregorian-map-tab-adoption"
          aria-selected={activeTab === 'adoption'}
          aria-controls="gregorian-map-panel-adoption"
          className={`info-modal__map-tab${activeTab === 'adoption' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('adoption')}
        >
          {t('modals.calendarInfo.adoptionTab')}
        </button>
      </div>

      {activeTab === 'usage' ? (
        <div
          id="gregorian-map-panel-usage"
          role="tabpanel"
          aria-labelledby="gregorian-map-tab-usage"
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
          id="gregorian-map-panel-adoption"
          role="tabpanel"
          aria-labelledby="gregorian-map-tab-adoption"
        >
          <div className="adoption-slider">
            <label className="adoption-slider__label" htmlFor="gregorian-adoption-year">
              {t('modals.calendarInfo.gregorianSliderLabel')}
            </label>
            <div className="adoption-slider__row">
              <span className="adoption-slider__bound">{GREGORIAN_ADOPTION_EVENT_YEARS[0]}</span>
              <input
                id="gregorian-adoption-year"
                className="adoption-slider__input"
                type="range"
                min={0}
                max={GREGORIAN_ADOPTION_EVENT_YEARS.length - 1}
                step={1}
                value={adoptionYearIndex}
                onChange={(event) => setAdoptionYearIndex(Number(event.target.value))}
                aria-valuetext={t('modals.calendarInfo.yearCe', { year: adoptionYear })}
              />
              <span className="adoption-slider__bound">
                {GREGORIAN_ADOPTION_EVENT_YEARS[GREGORIAN_ADOPTION_EVENT_YEARS.length - 1]}
              </span>
            </div>
            <p className="adoption-slider__year" aria-live="polite">
              <strong>{t('modals.calendarInfo.yearCe', { year: adoptionYear })}</strong>
            </p>
            <p className="adoption-slider__summary">
              {t('modals.calendarInfo.gregorianAdoptionSummary', {
                count: adoptedCountries.length,
                countryLabel,
              })}
            </p>
          </div>

          <WorldUsageMap
            highlighted={adoptedCountries}
            strokeColor={mapColors.stroke}
            fillColor={mapColors.fill}
          />

          <div className="adoption-slider__new">
            <h4>{t('modals.calendarInfo.adoptedIn', { year: adoptionYear })}</h4>
            <ul className="info-modal__countries adoption-slider__countries">
              {newlyAdopted.map((code) => (
                <li key={code}>{countryName(code, language)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
