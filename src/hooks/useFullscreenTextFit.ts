import { useLayoutEffect, useState, type RefObject } from 'react';

const FIT_PADDING_PX = 48;
const MAX_SCALE = 12;

function measureFitScale(container: HTMLElement, content: HTMLElement): number {
  const availableWidth = Math.max(container.clientWidth - FIT_PADDING_PX, 1);
  const availableHeight = Math.max(container.clientHeight - FIT_PADDING_PX, 1);
  const contentWidth = Math.max(content.scrollWidth, 1);
  const contentHeight = Math.max(content.scrollHeight, 1);

  const scale = Math.min(availableWidth / contentWidth, availableHeight / contentHeight, MAX_SCALE);
  return Number.isFinite(scale) && scale > 0 ? scale : 1;
}

export function useFullscreenTextFit(
  active: boolean,
  containerRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLElement | null>,
  contentKey: string,
): number {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    if (!active) {
      setScale(1);
      return;
    }

    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) {
      return;
    }

    const fit = () => {
      setScale(measureFitScale(container, content));
    };

    fit();

    const resizeObserver = new ResizeObserver(fit);
    resizeObserver.observe(container);
    resizeObserver.observe(content);

    const onViewportChange = () => {
      window.requestAnimationFrame(fit);
    };

    const onTransitionEnd = (event: TransitionEvent) => {
      if (event.propertyName === 'font-size' || event.propertyName === 'width' || event.propertyName === 'height') {
        fit();
      }
    };

    content.addEventListener('transitionend', onTransitionEnd);
    container.addEventListener('transitionend', onTransitionEnd);

    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
    window.visualViewport?.addEventListener('resize', onViewportChange);

    const settleTimer = window.setTimeout(fit, 620);

    return () => {
      window.clearTimeout(settleTimer);
      resizeObserver.disconnect();
      content.removeEventListener('transitionend', onTransitionEnd);
      container.removeEventListener('transitionend', onTransitionEnd);
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('orientationchange', onViewportChange);
      window.visualViewport?.removeEventListener('resize', onViewportChange);
    };
  }, [active, containerRef, contentRef, contentKey]);

  return scale;
}
