import { useMemo } from 'react';
import countryShapes from 'world-map-country-shapes';
import type { MapHighlight } from '../data/calendarInfo';

interface WorldUsageMapProps {
  highlighted: MapHighlight;
}

const VIEWBOX = '0 0 2000 1001';

export function WorldUsageMap({ highlighted }: WorldUsageMapProps) {
  const activeCountries = useMemo(() => {
    if (highlighted === 'all') {
      return new Set(countryShapes.map((country) => country.id));
    }

    return new Set(highlighted);
  }, [highlighted]);

  return (
    <div className="world-map">
      <svg viewBox={VIEWBOX} role="img" aria-label="World map showing calendar usage">
        <rect className="world-map__ocean" x="0" y="0" width="2000" height="1001" />
        {countryShapes.map((country) => {
          const isActive = activeCountries.has(country.id);

          return (
            <path
              key={country.id}
              d={country.shape}
              className={isActive ? 'world-map__country world-map__country--active' : 'world-map__country'}
            />
          );
        })}
      </svg>
    </div>
  );
}
