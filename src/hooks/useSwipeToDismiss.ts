import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

const AXIS_LOCK_PX = 10;
const DISMISS_THRESHOLD_PX = 72;
const SLIDE_OUT_MS = 280;
const COLLAPSE_MS = 340;
const SNAP_BACK_MS = 280;

export type SwipeDismissPhase = 'idle' | 'swiping' | 'slideOut' | 'snapBack' | 'collapse';

interface UseSwipeToDismissOptions {
  onDismiss: () => void;
  onDismissComplete?: () => void;
  rowRef: RefObject<HTMLElement | null>;
  disabled?: boolean;
  onDismissStart?: () => void;
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function useSwipeToDismiss({
  onDismiss,
  onDismissComplete,
  rowRef,
  disabled = false,
  onDismissStart,
}: UseSwipeToDismissOptions) {
  const startX = useRef<number | null>(null);
  const startY = useRef<number | null>(null);
  const axis = useRef<'x' | 'y' | null>(null);
  const pointerId = useRef<number | null>(null);
  const surfaceRef = useRef<HTMLDivElement | null>(null);
  const dismissCommittedRef = useRef(false);
  const dismissCompleteRef = useRef(false);
  const [phase, setPhase] = useState<SwipeDismissPhase>('idle');
  const [offsetX, setOffsetX] = useState(0);
  const [slideDirection, setSlideDirection] = useState<-1 | 0 | 1>(0);

  const reset = useCallback(() => {
    startX.current = null;
    startY.current = null;
    axis.current = null;
    pointerId.current = null;
    setPhase('idle');
    setOffsetX(0);
    setSlideDirection(0);
  }, []);

  const commitDismiss = useCallback(() => {
    if (dismissCommittedRef.current) {
      return;
    }

    dismissCommittedRef.current = true;
    onDismiss();
  }, [onDismiss]);

  const completeDismiss = useCallback(() => {
    if (dismissCompleteRef.current) {
      return;
    }

    dismissCompleteRef.current = true;
    onDismissComplete?.();
  }, [onDismissComplete]);

  const beginCollapse = useCallback(() => {
    commitDismiss();

    requestAnimationFrame(() => {
      setPhase('collapse');
    });
  }, [commitDismiss]);

  const finishDismiss = useCallback(
    (direction: -1 | 1) => {
      onDismissStart?.();

      if (prefersReducedMotion()) {
        beginCollapse();
        return;
      }

      setSlideDirection(direction);
      setPhase('slideOut');

      requestAnimationFrame(() => {
        const width = surfaceRef.current?.offsetWidth ?? window.innerWidth;
        setOffsetX(direction * width);
      });
    },
    [beginCollapse, onDismissStart],
  );

  const snapBack = useCallback(() => {
    if (prefersReducedMotion() || offsetX === 0) {
      reset();
      return;
    }

    setPhase('snapBack');
    requestAnimationFrame(() => {
      setOffsetX(0);
    });
  }, [offsetX, reset]);

  useEffect(() => {
    if (phase !== 'slideOut') {
      return;
    }

    const surface = surfaceRef.current;
    if (!surface) {
      beginCollapse();
      return;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== surface || event.propertyName !== 'transform') {
        return;
      }
      beginCollapse();
    };

    surface.addEventListener('transitionend', handleTransitionEnd);
    const fallback = window.setTimeout(beginCollapse, SLIDE_OUT_MS + 32);

    return () => {
      surface.removeEventListener('transitionend', handleTransitionEnd);
      window.clearTimeout(fallback);
    };
  }, [beginCollapse, phase]);

  useEffect(() => {
    if (phase !== 'collapse') {
      return;
    }

    const row = rowRef.current;
    if (!row) {
      completeDismiss();
      return;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== row) {
        return;
      }
      if (event.propertyName !== 'height' && event.propertyName !== 'flex-basis') {
        return;
      }
      completeDismiss();
    };

    row.addEventListener('transitionend', handleTransitionEnd);
    const fallback = window.setTimeout(completeDismiss, COLLAPSE_MS + 32);

    return () => {
      row.removeEventListener('transitionend', handleTransitionEnd);
      window.clearTimeout(fallback);
    };
  }, [completeDismiss, phase, rowRef]);

  useEffect(() => {
    if (phase !== 'snapBack') {
      return;
    }

    const surface = surfaceRef.current;
    if (!surface) {
      reset();
      return;
    }

    const handleTransitionEnd = (event: TransitionEvent) => {
      if (event.target !== surface || event.propertyName !== 'transform') {
        return;
      }
      reset();
    };

    surface.addEventListener('transitionend', handleTransitionEnd);
    const fallback = window.setTimeout(reset, SNAP_BACK_MS + 32);

    return () => {
      surface.removeEventListener('transitionend', handleTransitionEnd);
      window.clearTimeout(fallback);
    };
  }, [phase, reset]);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (disabled || phase !== 'idle' || event.button !== 0) {
        return;
      }

      const target = event.target as HTMLElement;
      if (target.closest('.calendar-row__drag-handle, button, a, input, textarea, select, label')) {
        return;
      }

      startX.current = event.clientX;
      startY.current = event.clientY;
      axis.current = null;
      pointerId.current = event.pointerId;
    },
    [disabled, phase],
  );

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (
        disabled ||
        (phase !== 'idle' && phase !== 'swiping') ||
        startX.current === null ||
        startY.current === null ||
        pointerId.current !== event.pointerId
      ) {
        return;
      }

      const deltaX = event.clientX - startX.current;
      const deltaY = event.clientY - startY.current;

      if (axis.current === null) {
        if (Math.abs(deltaX) < AXIS_LOCK_PX && Math.abs(deltaY) < AXIS_LOCK_PX) {
          return;
        }

        axis.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
        if (axis.current === 'y') {
          startX.current = null;
          startY.current = null;
          pointerId.current = null;
          return;
        }

        setPhase('swiping');
        event.currentTarget.setPointerCapture(event.pointerId);
      }

      if (axis.current === 'x') {
        setOffsetX(deltaX);
        setSlideDirection(deltaX === 0 ? 0 : deltaX < 0 ? -1 : 1);
      }
    },
    [disabled, phase],
  );

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (phase === 'slideOut' || phase === 'collapse') {
        return;
      }

      if (
        startX.current === null ||
        axis.current !== 'x' ||
        pointerId.current !== event.pointerId
      ) {
        return;
      }

      const deltaX = event.clientX - startX.current;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }

      startX.current = null;
      startY.current = null;
      axis.current = null;
      pointerId.current = null;

      if (Math.abs(deltaX) >= DISMISS_THRESHOLD_PX) {
        finishDismiss(deltaX < 0 ? -1 : 1);
        return;
      }

      snapBack();
    },
    [finishDismiss, phase, snapBack],
  );

  const handlePointerCancel = useCallback(() => {
    if (phase === 'slideOut' || phase === 'collapse') {
      return;
    }

    if (phase === 'swiping') {
      snapBack();
      return;
    }

    reset();
  }, [phase, reset, snapBack]);

  return {
    surfaceRef,
    offsetX,
    phase,
    slideDirection,
    swipeDirection: slideDirection,
    isSwiping: phase === 'swiping',
    isRemoving: phase === 'slideOut' || phase === 'collapse',
    swipeHandlers: {
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onPointerCancel: handlePointerCancel,
    },
  };
}
