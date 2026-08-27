const MIN_SCALE = 0.2;
const MARGIN = 0.94;
const MAYA_MIN_FONT_PX = 8;
const MAYA_MAX_FONT_PX = 400;

export function maxFullscreenFontPx(): number {
  const vmin = Math.min(window.innerWidth, window.innerHeight);
  return Math.min(vmin * 0.2, 80);
}

export interface FitFullscreenResult {
  fontSizePx: number;
  scale: number;
}

export interface FitFullscreenOptions {
  mayaInscription?: boolean;
  allowUpscale?: boolean;
}

function getContentBoxSize(container: HTMLElement): { width: number; height: number } {
  const style = window.getComputedStyle(container);
  const paddingX = Number.parseFloat(style.paddingLeft) + Number.parseFloat(style.paddingRight);
  const paddingY = Number.parseFloat(style.paddingTop) + Number.parseFloat(style.paddingBottom);

  return {
    width: Math.max(container.clientWidth - paddingX, 1),
    height: Math.max(container.clientHeight - paddingY, 1),
  };
}

function measureContentSize(textElement: HTMLElement): { width: number; height: number } {
  return {
    width: Math.max(textElement.scrollWidth, textElement.offsetWidth, 1),
    height: Math.max(textElement.scrollHeight, textElement.offsetHeight, 1),
  };
}

function inscriptionFits(
  inscription: HTMLElement,
  available: { width: number; height: number },
): boolean {
  const rect = inscription.getBoundingClientRect();
  return rect.width <= available.width && rect.height <= available.height;
}

/** Binary-search font size so the Maya inscription fits the container content box. */
export function fitMayaFullscreenInscription(
  container: HTMLElement,
  orient: HTMLElement,
  text: HTMLElement,
): number {
  const inscription = text.querySelector('.maya-inscription');
  if (!(inscription instanceof HTMLElement)) {
    return maxFullscreenFontPx();
  }

  orient.style.transform = 'none';

  const available = getContentBoxSize(container);
  let lo = MAYA_MIN_FONT_PX;
  let hi = MAYA_MAX_FONT_PX;
  let best = lo;

  const tryFont = (fontPx: number): boolean => {
    text.style.fontSize = `${fontPx}px`;
    return inscriptionFits(inscription, available);
  };

  while (lo <= hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (tryFont(mid)) {
      best = mid;
      lo = mid + 1;
    } else {
      hi = mid - 1;
    }
  }

  let fontSizePx = Math.max(MAYA_MIN_FONT_PX, Math.floor(best * MARGIN));
  while (fontSizePx > MAYA_MIN_FONT_PX && !tryFont(fontSizePx)) {
    fontSizePx -= 1;
  }

  text.style.fontSize = `${fontSizePx}px`;
  return fontSizePx;
}

/** Size text at the max font, then scale to fit the container with margin. */
export function measureFullscreenFit(
  container: HTMLElement,
  content: HTMLElement,
  textElement: HTMLElement,
  options: FitFullscreenOptions = {},
): FitFullscreenResult {
  const { allowUpscale = false } = options;
  const fontSizePx = maxFullscreenFontPx();
  textElement.style.fontSize = `${fontSizePx}px`;
  content.style.transform = 'scale(1)';

  const available = getContentBoxSize(container);
  const measured = measureContentSize(textElement);
  const widthScale = available.width / measured.width;
  const heightScale = available.height / measured.height;

  let scale = Math.min(widthScale, heightScale);
  scale = Math.max(MIN_SCALE, scale * MARGIN);
  if (!allowUpscale) {
    scale = Math.min(scale, 1);
  }

  return { fontSizePx, scale };
}
