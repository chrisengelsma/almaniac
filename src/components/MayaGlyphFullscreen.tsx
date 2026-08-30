import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import {
  fullscreenScaleVars,
  prefersReducedMotion,
  type ViewportRect,
} from '../lib/fullscreenRect';
import { MayaGlyph } from './MayaGlyph';

type FullscreenPhase = 'enter' | 'open' | 'exit';

export interface MayaGlyphFullscreenTarget {
  src: string;
  label: string;
  detail?: string;
  rotated?: boolean;
  originRect: ViewportRect;
}

interface MayaGlyphFullscreenProps {
  target: MayaGlyphFullscreenTarget;
  onClose: () => void;
}

export function MayaGlyphFullscreen({ target, onClose }: MayaGlyphFullscreenProps) {
  const { t } = useTranslation();
  const [phase, setPhase] = useState<FullscreenPhase>(() => (prefersReducedMotion() ? 'open' : 'enter'));
  const [exitRect, setExitRect] = useState(target.originRect);
  const glyphRef = useRef<HTMLSpanElement>(null);
  const isExpanded = phase === 'open';
  const scaleRect = phase === 'exit' ? exitRect : target.originRect;

  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }

    let frame2 = 0;
    const frame1 = window.requestAnimationFrame(() => {
      frame2 = window.requestAnimationFrame(() => setPhase('open'));
    });

    return () => {
      window.cancelAnimationFrame(frame1);
      if (frame2) {
        window.cancelAnimationFrame(frame2);
      }
    };
  }, []);

  const finishClose = useCallback(() => {
    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    const measured = glyphRef.current?.getBoundingClientRect();
    if (measured) {
      setExitRect({
        top: measured.top,
        left: measured.left,
        width: measured.width,
        height: measured.height,
      });
    }

    setPhase('exit');
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return;
      }

      event.stopImmediatePropagation();
      finishClose();
    };

    document.addEventListener('keydown', onKeyDown, { capture: true });
    return () => document.removeEventListener('keydown', onKeyDown, { capture: true });
  }, [finishClose]);

  const handleExpandTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform' || phase !== 'exit') {
      return;
    }

    onClose();
  };

  const shellStyle = fullscreenScaleVars(scaleRect) as CSSProperties;

  const contentStyle: CSSProperties = isExpanded
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }
    : {
        left: target.originRect.left,
        top: target.originRect.top,
        width: target.originRect.width,
        height: target.originRect.height,
      };

  const content = (
    <div
      className={`maya-glyph-fullscreen${isExpanded ? ' maya-glyph-fullscreen--open' : ''}`}
      style={shellStyle}
      role="dialog"
      aria-modal="true"
      aria-label={t('modals.calendarInfo.maya.glyphFullscreenAria', { label: target.label })}
      onClick={finishClose}
    >
      <div
        className="maya-glyph-fullscreen__expand"
        onTransitionEnd={handleExpandTransitionEnd}
      />
      <div className="maya-glyph-fullscreen__content" style={contentStyle}>
        <span
          ref={glyphRef}
          className={[
            'maya-glyph-fullscreen__glyph-wrap',
            target.rotated ? 'maya-glyph-fullscreen__glyph-wrap--rotated' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <MayaGlyph className="maya-glyph-fullscreen__glyph" src={target.src} />
        </span>
        <p className="maya-glyph-fullscreen__label">{target.label}</p>
        {target.detail ? <p className="maya-glyph-fullscreen__detail">{target.detail}</p> : null}
        <p className="maya-glyph-fullscreen__prompt" role="status">
          {t('calendars.tapToClose')}
        </p>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
