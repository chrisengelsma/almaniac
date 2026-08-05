import { useEffect, useState } from 'react';

function readOrientationAngle(): number {
  if (typeof window === 'undefined') {
    return 0;
  }

  if (screen.orientation?.angle != null) {
    return screen.orientation.angle;
  }

  const legacy = (window as Window & { orientation?: number }).orientation;
  if (typeof legacy === 'number') {
    return legacy < 0 ? legacy + 360 : legacy;
  }

  return 0;
}

export function useDeviceOrientation(active: boolean): number {
  const [angle, setAngle] = useState(() => readOrientationAngle());

  useEffect(() => {
    if (!active) {
      return;
    }

    const update = () => setAngle(readOrientationAngle());

    update();
    screen.orientation?.addEventListener('change', update);
    window.addEventListener('orientationchange', update);

    return () => {
      screen.orientation?.removeEventListener('change', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [active]);

  return angle;
}
