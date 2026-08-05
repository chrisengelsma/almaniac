import { useMemo, useState } from 'react';
import { countryName } from '../data/countryNames';
import type { CalendarInfo } from '../data/calendarInfo';
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
  mapColors: { background: string; stroke: string; fill: string };
}

function TimelineEventList({ title, codes }: { title: string; codes: string[] }) {
  if (codes.length === 0) {
    return null;
  }

  return (
    <div className="adoption-slider__event">
      <h4>{title}</h4>
      <ul className="info-modal__countries adoption-slider__countries">
        {codes.map((code) => (
          <li key={code}>{countryName(code)}</li>
        ))}
      </ul>
    </div>
  );
}

export function JulianMapSection({ info, mapColors }: JulianMapSectionProps) {
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

  return (
    <section className="info-modal__map-section" aria-label="Geographic usage">
      <div className="info-modal__map-tabs" role="tablist" aria-label="Map views">
        <button
          type="button"
          role="tab"
          id="julian-map-tab-usage"
          aria-selected={activeTab === 'usage'}
          aria-controls="julian-map-panel-usage"
          className={`info-modal__map-tab${activeTab === 'usage' ? ' info-modal__map-tab--active' : ''}`}
          onClick={() => setActiveTab('usage')}
        >
          Where it is used
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
          Adoption timeline
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
            backgroundColor={mapColors.background}
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
          id="julian-map-panel-timeline"
          role="tabpanel"
          aria-labelledby="julian-map-tab-timeline"
        >
          <div className="adoption-slider">
            <label className="adoption-slider__label" htmlFor="julian-timeline-year">
              Reveal adoption and replacement through time
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
              {activeCountries.length} {activeCountries.length === 1 ? 'country' : 'countries'} using
              the Julian calendar at this point in time
            </p>
          </div>

          <WorldUsageMap
            highlighted={activeCountries}
            backgroundColor={mapColors.background}
            strokeColor={mapColors.stroke}
            fillColor={mapColors.fill}
          />

          <div className="adoption-slider__new adoption-slider__new--dual">
            <TimelineEventList title={`Adopted in ${yearLabel}`} codes={startedInYear} />
            <TimelineEventList title={`Stopped using in ${yearLabel}`} codes={stoppedInYear} />
          </div>
        </div>
      )}
    </section>
  );
}
