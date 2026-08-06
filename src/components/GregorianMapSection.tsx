import { useMemo, useState } from 'react';
import { countryName } from '../data/countryNames';
import type { CalendarInfo } from '../data/calendarInfo';
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
}

export function GregorianMapSection({ info, mapColors }: GregorianMapSectionProps) {
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

  return (
    <section className="info-modal__map-section" aria-label="Geographic usage">
      <div className="info-modal__map-tabs" role="tablist" aria-label="Map views">
        <button
          type="button"
          role="tab"
          id="gregorian-map-tab-usage"
          aria-selected={activeTab === 'usage'}
          aria-controls="gregorian-map-panel-usage"
          className={`info-modal__map-tab${activeTab === 'usage' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          Where it is used
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
          Date of adoption
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
            {info.usedIn.map((place) => (
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
              Reveal adoption through time
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
                aria-valuetext={`${adoptionYear} CE`}
              />
              <span className="adoption-slider__bound">
                {GREGORIAN_ADOPTION_EVENT_YEARS[GREGORIAN_ADOPTION_EVENT_YEARS.length - 1]}
              </span>
            </div>
            <p className="adoption-slider__year" aria-live="polite">
              <strong>{adoptionYear} CE</strong>
            </p>
            <p className="adoption-slider__summary">
              {adoptedCountries.length} {adoptedCountries.length === 1 ? 'country' : 'countries'} using
              the Gregorian calendar by this year
            </p>
          </div>

          <WorldUsageMap
            highlighted={adoptedCountries}
            strokeColor={mapColors.stroke}
            fillColor={mapColors.fill}
          />

          <div className="adoption-slider__new">
            <h4>Adopted in {adoptionYear}</h4>
            <ul className="info-modal__countries adoption-slider__countries">
              {newlyAdopted.map((code) => (
                <li key={code}>{countryName(code)}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
}
