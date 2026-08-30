import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { createPortal } from 'react-dom';
import type { ColorScheme, ColorTheme } from '../lib/appSettings';
import { calendarTextClassName, calendarTextLang, calendarTextStyle } from '../lib/calendarTextStyle';
import type { CalendarRowData } from '../lib/calendarRegistry';
import {
  fitMayaFullscreenInscription,
  maxFullscreenFontPx,
  measureFullscreenFit,
} from '../lib/fitFullscreenText';
import {
  fullscreenScaleVars,
  measureCalendarRowDateRect,
  measureCalendarRowRect,
  prefersReducedMotion,
  type ViewportRect,
} from '../lib/fullscreenRect';
import { MayaLongCount } from './MayaLongCount';

const CLOSE_PROMPT_MS = 5000;
const FIT_TRANSITION_MS = 180;
const ROW_TEXT_SIZE = 'clamp(1.35rem, 4.8vw, 1.85rem)';

type FullscreenPhase = 'enter' | 'open' | 'exit';

interface FullscreenDateViewProps {
  row: CalendarRowData;
  originRect: ViewportRect;
  textOriginRect: ViewportRect;
  colorScheme: ColorScheme;
  colorTheme: ColorTheme;
  onClose: () => void;
}

export function FullscreenDateView({
  row,
  originRect,
  textOriginRect,
  colorScheme,
  colorTheme,
  onClose,
}: FullscreenDateViewProps) {
  const { t } = useTranslation();
  const { entry, backgroundColor, textStyle: rowTextStyle } = row;
  const [phase, setPhase] = useState<FullscreenPhase>(() => (prefersReducedMotion() ? 'open' : 'enter'));
  const [exitRect, setExitRect] = useState(originRect);
  const [exitTextRect, setExitTextRect] = useState(textOriginRect);
  const [awaitingClose, setAwaitingClose] = useState(false);
  const closeTimerRef = useRef<number | null>(null);
  const textWrapRef = useRef<HTMLDivElement>(null);
  const orientRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const fitFrameRef = useRef<number | null>(null);
  const scriptClass = calendarTextClassName(entry.scriptFont);
  const scriptStyle = calendarTextStyle(entry.scriptFont);
  const textLang = calendarTextLang(entry.scriptFont);
  const dateText = entry.date || '-';
  const isExpanded = phase === 'open';
  const scaleRect = phase === 'exit' ? exitRect : originRect;
  const textRect = phase === 'exit' ? exitTextRect : textOriginRect;
  const textColor = rowTextStyle.foreground;
  const textShadow = rowTextStyle.textShadow;
  const expandBackgroundColor = backgroundColor;

  const clearCloseTimer = () => {
    if (closeTimerRef.current != null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

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

  const fitFullscreenText = useCallback(() => {
    const wrap = textWrapRef.current;
    const orient = orientRef.current;
    const text = textRef.current;
    if (!isExpanded || !wrap || !orient || !text) {
      return;
    }

    if (entry.mayaLongCount) {
      fitMayaFullscreenInscription(wrap, orient, text);
      return;
    }

    const { fontSizePx, scale } = measureFullscreenFit(wrap, orient, text);
    text.style.fontSize = `${fontSizePx}px`;
    orient.style.transform = `scale(${scale})`;
  }, [isExpanded, entry.mayaLongCount]);

  const scheduleFit = useCallback(() => {
    if (fitFrameRef.current != null) {
      window.cancelAnimationFrame(fitFrameRef.current);
    }

    fitFrameRef.current = window.requestAnimationFrame(() => {
      fitFrameRef.current = null;
      fitFullscreenText();
    });
  }, [fitFullscreenText]);

  useLayoutEffect(() => {
    if (!isExpanded) {
      if (orientRef.current) {
        orientRef.current.style.transform = '';
      }
      return;
    }

    scheduleFit();
    const settleFit = window.setTimeout(scheduleFit, 650);
    return () => window.clearTimeout(settleFit);
  }, [isExpanded, scheduleFit]);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const wrap = textWrapRef.current;
    if (!wrap) {
      return;
    }

    const onViewportChange = () => scheduleFit();
    const resizeObserver = new ResizeObserver(() => scheduleFit());

    resizeObserver.observe(wrap);
    window.addEventListener('resize', onViewportChange);
    window.addEventListener('orientationchange', onViewportChange);
    window.visualViewport?.addEventListener('resize', onViewportChange);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', onViewportChange);
      window.removeEventListener('orientationchange', onViewportChange);
      window.visualViewport?.removeEventListener('resize', onViewportChange);
      if (fitFrameRef.current != null) {
        window.cancelAnimationFrame(fitFrameRef.current);
        fitFrameRef.current = null;
      }
    };
  }, [isExpanded, scheduleFit]);

  const handleTextWrapTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (isExpanded && (event.propertyName === 'width' || event.propertyName === 'height')) {
      scheduleFit();
    }
  };

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
      clearCloseTimer();
    };
  }, []);

  const finishClose = () => {
    clearCloseTimer();
    setAwaitingClose(false);

    if (prefersReducedMotion()) {
      onClose();
      return;
    }

    const measuredRow = measureCalendarRowRect(entry.id);
    const measuredText = measureCalendarRowDateRect(entry.id);
    if (measuredRow) {
      setExitRect(measuredRow);
    }
    if (measuredText) {
      setExitTextRect(measuredText);
    }

    setPhase('exit');
  };

  const handleTap = () => {
    if (phase !== 'open') {
      return;
    }

    if (!awaitingClose) {
      setAwaitingClose(true);
      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        setAwaitingClose(false);
        closeTimerRef.current = null;
      }, CLOSE_PROMPT_MS);
      return;
    }

    finishClose();
  };

  const handleExpandTransitionEnd = (event: React.TransitionEvent<HTMLDivElement>) => {
    if (event.propertyName !== 'transform' || phase !== 'exit') {
      return;
    }

    onClose();
  };

  const shellStyle = {
    ...fullscreenScaleVars(scaleRect),
    '--calendar-accent': backgroundColor,
  } as CSSProperties;

  const textWrapStyle: CSSProperties = isExpanded
    ? {
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
      }
    : {
        left: textRect.left,
        top: textRect.top,
        width: textRect.width,
        height: textRect.height,
        padding: 0,
      };

  const dateTextStyle: CSSProperties = {
    ...scriptStyle,
    color: textColor,
    textShadow,
    fontSize: isExpanded ? `${maxFullscreenFontPx()}px` : ROW_TEXT_SIZE,
  };

  const content = (
    <div
      className={`fullscreen-date${isExpanded ? ' fullscreen-date--open' : ''}${entry.mayaLongCount ? ' fullscreen-date--maya' : ''}`}
      style={shellStyle}
      data-color-scheme={colorScheme}
      data-color-theme={colorTheme}
      role="dialog"
      aria-modal="true"
      aria-label={t('calendars.fullscreenAriaView', { label: entry.label })}
      onClick={handleTap}
    >
      <div
        className="fullscreen-date__expand"
        style={{ backgroundColor: expandBackgroundColor }}
        onTransitionEnd={handleExpandTransitionEnd}
      />
      <div
        className="fullscreen-date__text-wrap"
        ref={textWrapRef}
        style={textWrapStyle}
        onTransitionEnd={handleTextWrapTransitionEnd}
      >
        <div
          ref={orientRef}
          className="fullscreen-date__orient"
          style={{ transitionDuration: `${FIT_TRANSITION_MS}ms` }}
        >
          <p
            ref={textRef}
            className={`fullscreen-date__text ${scriptClass}`.trim()}
            style={dateTextStyle}
            lang={textLang}
            aria-label={entry.mayaLongCount ? dateText : undefined}
          >
            {entry.mayaLongCount ? (
              <MayaLongCount
                parts={entry.mayaLongCount}
                expanded
                useHieroglyphs={entry.mayaUseHieroglyphs ?? true}
                tzolkin={entry.mayaTzolkin}
                haab={entry.mayaHaab}
                lordOfNight={entry.mayaUseGlyphs ? entry.mayaLordOfNight : undefined}
              />
            ) : (
              dateText
            )}
          </p>
        </div>
      </div>
      {awaitingClose && phase === 'open' ? (
        <p className="fullscreen-date__prompt" role="status">
          {t('calendars.tapToClose')}
        </p>
      ) : null}
    </div>
  );

  return createPortal(content, document.body);
}
