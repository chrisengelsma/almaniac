import { useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { CSS } from '@dnd-kit/utilities';
import { defaultAnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { copyTextToClipboard } from '../lib/copyText';
import { calendarTextClassName, calendarTextLang, calendarTextStyle } from '../lib/calendarTextStyle';
import type { CalendarRowData } from '../lib/calendarRegistry';
import { useSwipeToDismiss } from '../hooks/useSwipeToDismiss';
import { DragHandle } from './DragHandle';
import { MayaLongCount } from './MayaLongCount';
import { MayaHaabDate, MayaLordOfNight, MayaTzolkinDate } from './MayaRoundDate';

interface CalendarRowProps {
  row: CalendarRowData;
  staggerIndex?: number;
  themeTransitionDelay?: number;
  isExiting?: boolean;
  onInfoClick: (id: CalendarRowData['entry']['id']) => void;
  onHide: () => void;
  onRemoveComplete?: () => void;
  onDismissStart?: () => void;
  onFullscreen: (row: CalendarRowData, originRect: DOMRectReadOnly, textOriginRect: DOMRectReadOnly) => void;
  isFullscreenSource?: boolean;
}

export function CalendarRow({
  row,
  staggerIndex,
  themeTransitionDelay,
  isExiting = false,
  onInfoClick,
  onHide,
  onRemoveComplete,
  onDismissStart,
  onFullscreen,
  isFullscreenSource = false,
}: CalendarRowProps) {
  const { t } = useTranslation();
  const { entry, visible } = row;
  const showAsVisible = visible || isExiting;
  const rowRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const scriptClass = calendarTextClassName(entry.scriptFont);
  const scriptStyle = calendarTextStyle(entry.scriptFont);
  const textLang = calendarTextLang(entry.scriptFont);
  const detailScriptClass = calendarTextClassName(entry.detailScriptFont ?? entry.scriptFont);
  const detailScriptStyle = calendarTextStyle(entry.detailScriptFont ?? entry.scriptFont);
  const detailTextLang = calendarTextLang(entry.detailScriptFont ?? entry.scriptFont);
  const dateText = entry.date || '-';
  const canCopy = Boolean(entry.date && entry.date !== '-');
  const isEntering = staggerIndex !== undefined;

  const {
    surfaceRef,
    offsetX,
    phase,
    slideDirection,
    isSwiping,
    isRemoving,
    swipeHandlers,
  } = useSwipeToDismiss({
    onDismiss: onHide,
    onDismissComplete: onRemoveComplete,
    rowRef,
    disabled: !showAsVisible || isEntering,
    onDismissStart,
  });

  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: entry.id,
    disabled: !showAsVisible || isRemoving,
    animateLayoutChanges: defaultAnimateLayoutChanges,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style: CSSProperties & {
    '--calendar-accent'?: string;
    '--calendar-row-fg'?: string;
    '--calendar-row-fg-muted'?: string;
    '--calendar-row-text-shadow'?: string;
    '--maya-row-fg'?: string;
    '--stagger-index'?: number;
    '--theme-transition-delay'?: string;
  } = {
    '--calendar-accent': row.accentColor,
    '--calendar-row-fg': row.textStyle.foreground,
    '--calendar-row-fg-muted': row.textStyle.foregroundMuted,
    '--calendar-row-text-shadow': row.textStyle.textShadow,
    '--maya-row-fg': row.textStyle.foreground,
    transform: isEntering || isRemoving ? undefined : CSS.Transform.toString(transform),
    transition: isEntering || isRemoving ? undefined : transition,
    ...(isEntering ? { '--stagger-index': staggerIndex } : {}),
    ...(themeTransitionDelay !== undefined
      ? { '--theme-transition-delay': `${themeTransitionDelay}ms` }
      : {}),
  };

  const handleCopy = async () => {
    if (!canCopy) {
      return;
    }

    const didCopy = await copyTextToClipboard(entry.date);
    if (!didCopy) {
      return;
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 2200);
  };

  const handleFullscreen = () => {
    const element = rowRef.current;
    if (!element) {
      return;
    }

    const dateElement = element.querySelector('.calendar-row__date');
    const textRect = dateElement?.getBoundingClientRect() ?? element.getBoundingClientRect();
    onFullscreen(row, element.getBoundingClientRect(), textRect);
  };

  const holidayNames = row.holidays.map((holiday) => t(`holidays.${holiday.id}`));

  return (
    <>
      {copied && (
        <div className="copy-notice" role="status" aria-live="polite">
          {t('calendars.copied')}
        </div>
      )}
      <article
      ref={(node) => {
        rowRef.current = node;
        setNodeRef(node);
      }}
      data-calendar-row={entry.id}
      style={style}
      className={[
        'calendar-row',
        'theme-chunk',
        showAsVisible ? 'calendar-row--visible' : 'calendar-row--hidden',
        isEntering ? 'calendar-row--entering' : '',
        isDragging ? 'calendar-row--dragging' : '',
        isSwiping ? 'calendar-row--swiping' : '',
        phase === 'slideOut' ? 'calendar-row--slide-out' : '',
        phase === 'snapBack' ? 'calendar-row--snap-back' : '',
        phase === 'collapse' ? 'calendar-row--removing' : '',
        isRemoving ? 'calendar-row--removing-active' : '',
        isFullscreenSource ? 'calendar-row--fullscreen-source' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!showAsVisible}
    >
      <div className="calendar-row__swipe">
        <div
          className={[
            'calendar-row__swipe-action',
            slideDirection < 0 ? 'calendar-row__swipe-action--left' : '',
            slideDirection > 0 ? 'calendar-row__swipe-action--right' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          aria-hidden="true"
          style={{
            opacity: isSwiping || phase === 'slideOut'
              ? Math.min(1, Math.abs(offsetX) / 72)
              : 0,
          }}
        >
          <span className="calendar-row__swipe-label">{t('calendars.dismissLabel')}</span>
        </div>
        <div
          ref={surfaceRef}
          className="calendar-row__surface"
          style={{
            backgroundColor: row.backgroundColor,
            transform: phase === 'idle' && offsetX === 0
              ? undefined
              : `translateX(${offsetX}px)`,
          }}
          {...swipeHandlers}
        >
        <div className="calendar-row__date-wrap">
          <p
            className={`calendar-row__date ${scriptClass}`.trim()}
            style={scriptStyle}
            lang={textLang}
            aria-label={entry.mayaLongCount ? dateText : undefined}
          >
            {entry.mayaLongCount ? (
              <MayaLongCount
                parts={entry.mayaLongCount}
                useHieroglyphs={entry.mayaUseHieroglyphs ?? true}
              />
            ) : (
              dateText
            )}
          </p>
        </div>
        <button
          type="button"
          ref={setActivatorNodeRef}
          className="calendar-row__drag-handle"
          aria-label={t('calendars.reorderAria', { label: entry.label })}
          {...attributes}
          {...listeners}
          disabled={!showAsVisible}
        >
          <DragHandle />
        </button>
        <div className="calendar-row__body">
          {row.holidays.length > 0 ? (
            <div
              className="calendar-row__holiday"
              aria-label={t('calendars.holidayAria', { names: holidayNames.join(', ') })}
            >
              {holidayNames.join(' · ')}
            </div>
          ) : null}
          {entry.mayaLordOfNight && entry.mayaUseGlyphs ? (
            <div className="calendar-row__center-top">
              <MayaLordOfNight {...entry.mayaLordOfNight} />
            </div>
          ) : null}
          <div className="calendar-row__meta">
            {entry.weekday ? (
              entry.mayaHaab ? (
                <MayaHaabDate
                  {...entry.mayaHaab}
                  transliterated={!entry.mayaUseGlyphs}
                  useHieroglyphs={entry.mayaUseHieroglyphs ?? true}
                />
              ) : (
                <span className="calendar-row__weekday" style={scriptStyle} lang={textLang}>
                  {entry.weekday}
                </span>
              )
            ) : null}
            <span className="calendar-row__calendar-name">{entry.calendarName}</span>
          </div>
          {entry.detailLabel ? (
            <div className="calendar-row__meta calendar-row__meta--bottom">
              {entry.mayaTzolkin ? (
                <MayaTzolkinDate
                  {...entry.mayaTzolkin}
                  transliterated={!entry.mayaUseGlyphs}
                  useHieroglyphs={entry.mayaUseHieroglyphs ?? true}
                />
              ) : (
                <span className={`calendar-row__weekday ${detailScriptClass}`.trim()} style={detailScriptStyle} lang={detailTextLang}>
                  {entry.detailLabel}
                </span>
              )}
            </div>
          ) : null}
          <div className="calendar-row__actions">
            <button
              type="button"
              className="calendar-row__action"
              aria-label={t('calendars.copyAria', { label: entry.label })}
              disabled={!canCopy}
              onClick={handleCopy}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="12" height="14" rx="1.5" />
                <path d="M6 16H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>
            <button
              type="button"
              className="calendar-row__action"
              aria-label={t('calendars.fullscreenAria', { label: entry.label })}
              disabled={!canCopy}
              onClick={handleFullscreen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <rect x="8" y="8" width="8" height="8" rx="1" />
                <path d="M4 9V4h5" />
                <path d="M15 4h5v5" />
                <path d="M20 15v5h-5" />
                <path d="M9 20H4v-5" />
              </svg>
            </button>
            <button
              type="button"
              className="calendar-row__action"
              aria-label={t('calendars.aboutAria', { label: entry.label })}
              onClick={() => onInfoClick(entry.id)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 11v6M12 8h.01" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      </div>
    </article>
    </>
  );
}
