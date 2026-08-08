import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';

interface TapMark {
  id: number;
  x: number;
  y: number;
  hit: string;
}

interface ViewportDebug {
  innerWidth: number;
  innerHeight: number;
  screenWidth: number;
  screenHeight: number;
  vvScale: number;
  orientation: string;
  webViewWidth: number | null;
  webViewHeight: number | null;
  scrollX: number | null;
  scrollY: number | null;
  webViewScale: number | null;
}

declare global {
  interface Window {
    AlmaniacViewportDebug?: {
      getWebViewWidthPx: () => number;
      getWebViewHeightPx: () => number;
      getScrollXPx: () => number;
      getScrollYPx: () => number;
      getScale: () => number;
    };
  }
}

const MARK_LIFETIME_MS = 1200;
const MARK_SIZE_PX = 28;

function readNativeViewport(): Pick<
  ViewportDebug,
  'webViewWidth' | 'webViewHeight' | 'scrollX' | 'scrollY' | 'webViewScale'
> {
  const bridge = window.AlmaniacViewportDebug;
  if (!bridge) {
    return {
      webViewWidth: null,
      webViewHeight: null,
      scrollX: null,
      scrollY: null,
      webViewScale: null,
    };
  }

  try {
    return {
      webViewWidth: bridge.getWebViewWidthPx(),
      webViewHeight: bridge.getWebViewHeightPx(),
      scrollX: bridge.getScrollXPx(),
      scrollY: bridge.getScrollYPx(),
      webViewScale: bridge.getScale(),
    };
  } catch {
    return {
      webViewWidth: null,
      webViewHeight: null,
      scrollX: null,
      scrollY: null,
      webViewScale: null,
    };
  }
}

function readViewportDebug(): ViewportDebug {
  const vv = window.visualViewport;
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    vvScale: vv?.scale ?? 1,
    orientation: window.screen?.orientation?.type ?? 'unknown',
    ...readNativeViewport(),
  };
}

function describeHitTarget(clientX: number, clientY: number): string {
  const target = document.elementFromPoint(clientX, clientY);
  if (!target || target === document.documentElement || target === document.body) {
    return 'none';
  }

  const element = target as HTMLElement;
  return element.className
    ? `${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]}`
    : element.tagName.toLowerCase();
}

export function TapIndicator() {
  const [marks, setMarks] = useState<TapMark[]>([]);
  const [debug, setDebug] = useState<ViewportDebug>({
    innerWidth: 0,
    innerHeight: 0,
    screenWidth: 0,
    screenHeight: 0,
    vvScale: 1,
    orientation: 'unknown',
    webViewWidth: null,
    webViewHeight: null,
    scrollX: null,
    scrollY: null,
    webViewScale: null,
  });

  useEffect(() => {
    if (Capacitor.getPlatform() !== 'android') {
      return;
    }

    let nextId = 0;

    const refreshDebug = () => {
      setDebug(readViewportDebug());
    };

    const onPointerDown = (event: PointerEvent) => {
      refreshDebug();

      const mark: TapMark = {
        id: nextId++,
        x: event.clientX,
        y: event.clientY,
        hit: describeHitTarget(event.clientX, event.clientY),
      };

      setMarks((current) => [...current, mark]);
      window.setTimeout(() => {
        setMarks((current) => current.filter((item) => item.id !== mark.id));
      }, MARK_LIFETIME_MS);
    };

    refreshDebug();
    window.addEventListener('resize', refreshDebug);
    window.visualViewport?.addEventListener('resize', refreshDebug);
    window.visualViewport?.addEventListener('scroll', refreshDebug);
    document.addEventListener('pointerdown', onPointerDown, { capture: true });

    return () => {
      window.removeEventListener('resize', refreshDebug);
      window.visualViewport?.removeEventListener('resize', refreshDebug);
      window.visualViewport?.removeEventListener('scroll', refreshDebug);
      document.removeEventListener('pointerdown', onPointerDown, { capture: true });
    };
  }, []);

  if (Capacitor.getPlatform() !== 'android') {
    return null;
  }

  const sizeMismatch =
    debug.webViewWidth != null &&
    debug.webViewHeight != null &&
    (Math.abs(debug.webViewWidth - debug.innerWidth) > 1 ||
      Math.abs(debug.webViewHeight - debug.innerHeight) > 1);
  const scrollDrift = (debug.scrollX ?? 0) !== 0 || (debug.scrollY ?? 0) !== 0;
  const orientationMismatch =
    debug.screenWidth > debug.screenHeight && debug.innerWidth < debug.innerHeight;

  return (
    <div className="tap-indicator-layer" aria-hidden="true">
      <div className="tap-indicator-debug">
        css {debug.innerWidth}×{debug.innerHeight} · screen {debug.screenWidth}×{debug.screenHeight}
        {debug.webViewWidth != null ? ` · wv ${debug.webViewWidth}×${debug.webViewHeight}` : ''}
        {debug.scrollX != null ? ` · scroll ${debug.scrollX},${debug.scrollY}` : ''}
        {debug.webViewScale != null ? ` · wvScale ${debug.webViewScale.toFixed(2)}` : ''}
        {orientationMismatch ? ' · ROTATE' : ''}
        {sizeMismatch ? ' · SIZE MISMATCH' : ''}
        {scrollDrift ? ' · SCROLL DRIFT' : ''}
      </div>
      {marks.map((mark) => (
        <div key={mark.id}>
          <span
            className="tap-indicator"
            style={{
              left: `${mark.x}px`,
              top: `${mark.y}px`,
              width: `${MARK_SIZE_PX}px`,
              height: `${MARK_SIZE_PX}px`,
            }}
          />
          <span
            className="tap-indicator-hit"
            style={{
              left: `${mark.x}px`,
              top: `${mark.y + MARK_SIZE_PX * 0.75}px`,
            }}
          >
            {mark.hit}
          </span>
        </div>
      ))}
    </div>
  );
}
