import { useEffect } from 'react';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function tiltHueFromOrientation(beta: number | null, gamma: number | null): number {
  const tiltX = gamma ?? 0;
  const tiltY = (beta ?? 0) - 45;
  return clamp(tiltX * 0.35 + tiltY * 0.18, -18, 18);
}

function tiltHueFromMotion(x: number, y: number, z: number): number {
  const tiltX = Math.atan2(x, z) * (180 / Math.PI);
  const tiltY = Math.atan2(y, z) * (180 / Math.PI);
  return clamp(tiltX * 0.22 + tiltY * 0.12, -18, 18);
}

type OrientationPermissionEvent = {
  requestPermission?: () => Promise<'granted' | 'denied' | 'default'>;
};

export function useSupporterThemeTilt(active: boolean): void {
  useEffect(() => {
    const root = document.documentElement;

    if (!active) {
      root.style.removeProperty('--supporter-tilt-hue');
      return;
    }

    let frame = 0;
    let orientationHandler: ((event: DeviceOrientationEvent) => void) | null = null;
    let motionHandler: ((event: DeviceMotionEvent) => void) | null = null;
    let orientationActive = false;

    const applyHue = (hue: number) => {
      cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        root.style.setProperty('--supporter-tilt-hue', hue.toFixed(2));
      });
    };

    const startOrientation = () => {
      orientationHandler = (event: DeviceOrientationEvent) => {
        orientationActive = event.beta != null || event.gamma != null;
        applyHue(tiltHueFromOrientation(event.beta, event.gamma));
      };

      window.addEventListener('deviceorientation', orientationHandler);
    };

    const startMotionFallback = () => {
      motionHandler = (event: DeviceMotionEvent) => {
        if (orientationActive) {
          return;
        }

        const gravity = event.accelerationIncludingGravity;
        if (!gravity) {
          return;
        }

        applyHue(tiltHueFromMotion(gravity.x ?? 0, gravity.y ?? 0, gravity.z ?? 0));
      };

      window.addEventListener('devicemotion', motionHandler);
    };

    const requestPermission = (DeviceOrientationEvent as unknown as OrientationPermissionEvent)
      .requestPermission;

    const init = async () => {
      if (requestPermission) {
        try {
          const result = await requestPermission();
          if (result !== 'granted') {
            startMotionFallback();
            return;
          }
        } catch {
          startMotionFallback();
          return;
        }
      }

      startOrientation();
      startMotionFallback();
    };

    void init();

    return () => {
      cancelAnimationFrame(frame);
      if (orientationHandler) {
        window.removeEventListener('deviceorientation', orientationHandler);
      }
      if (motionHandler) {
        window.removeEventListener('devicemotion', motionHandler);
      }
      root.style.removeProperty('--supporter-tilt-hue');
    };
  }, [active]);
}
