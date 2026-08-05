const MIN_SCALE = 0.2;
const MARGIN = 0.94;

export function maxFullscreenFontPx(): number {
  const vmin = Math.min(window.innerWidth, window.innerHeight);
  return Math.min(vmin * 0.2, 80);
}

export interface FitFullscreenResult {
  fontSizePx: number;
  scale: number;
}

/** Size text at the max font, then scale down to fit the container with margin. */
export function measureFullscreenFit(
  container: HTMLElement,
  content: HTMLElement,
  textElement: HTMLElement,
): FitFullscreenResult {
  const fontSizePx = maxFullscreenFontPx();
  textElement.style.fontSize = `${fontSizePx}px`;
  content.style.transform = 'scale(1)';

  const widthScale = container.clientWidth > 0 ? container.clientWidth / content.scrollWidth : 1;
  const heightScale = container.clientHeight > 0 ? container.clientHeight / content.scrollHeight : 1;
  const scale = Math.max(MIN_SCALE, Math.min(widthScale, heightScale, 1) * MARGIN);

  return { fontSizePx, scale };
}
