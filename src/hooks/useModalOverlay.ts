import { useEffect, useRef, type RefObject } from 'react';
import { focusWithoutScroll, setBodyScrollLocked } from '../lib/nativeOverlay';

/** Blocks scroll and pointer events on the app shell while an overlay is active. */
export function useOverlayPointerBlock(active: boolean): void {
  useEffect(() => {
    if (!active) {
      return;
    }

    setBodyScrollLocked(true);

    return () => {
      setBodyScrollLocked(false);
    };
  }, [active]);
}

interface ModalOverlayOptions {
  focusTarget?: RefObject<HTMLElement | null> | null;
  /** When set, Escape invokes this instead of `onClose`. */
  onEscape?: () => void;
  escapeCapture?: boolean;
}

/**
 * Standard overlay lifecycle: app pointer block, optional initial focus, Escape to dismiss.
 */
export function useModalOverlay(
  active: boolean,
  onClose: () => void,
  options: ModalOverlayOptions = {},
): void {
  const { focusTarget = null, onEscape, escapeCapture = false } = options;
  const onCloseRef = useRef(onClose);
  const onEscapeRef = useRef(onEscape);
  const wasActiveRef = useRef(false);

  onCloseRef.current = onClose;
  onEscapeRef.current = onEscape;

  useOverlayPointerBlock(active);

  useEffect(() => {
    if (!active) {
      wasActiveRef.current = false;
      return;
    }

    if (!wasActiveRef.current) {
      wasActiveRef.current = true;
      focusWithoutScroll(focusTarget?.current ?? null);
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      if (onEscapeRef.current) {
        onEscapeRef.current();
      } else {
        onCloseRef.current();
      }
    };

    if (escapeCapture) {
      document.addEventListener('keydown', onKeyDown, { capture: true });
      return () => document.removeEventListener('keydown', onKeyDown, { capture: true });
    }

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [active, focusTarget, escapeCapture]);
}
