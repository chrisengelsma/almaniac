import { useMemo, type CSSProperties } from 'react';
import countryShapes from 'world-map-country-shapes';
import type { MapHighlight } from '../data/calendarInfo';

interface WorldUsageMapProps {
  highlighted: MapHighlight;
  strokeColor: string;
  fillColor: string;
}

const VIEWBOX = '0 0 2000 1001';

export function WorldUsageMap({
  highlighted,
  strokeColor,
  fillColor,
}: WorldUsageMapProps) {
  const activeCountries = useMemo(() => {
    if (highlighted === 'all') {
      return new Set(countryShapes.map((country) => country.id));
    }

    return new Set(highlighted);
  }, [highlighted]);

  const mapStyle = {
    '--map-stroke': strokeColor,
    '--map-fill': fillColor,
  } as CSSProperties;

  return (
    <div className="world-map" style={mapStyle}>
      <svg viewBox={VIEWBOX} role="img" aria-label="World map showing calendar usage">
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
