import { useRef, useState, type CSSProperties } from 'react';
import { useTranslation } from 'react-i18next';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { copyTextToClipboard } from '../lib/copyText';
import { calendarTextClassName, calendarTextLang, calendarTextStyle } from '../lib/calendarTextStyle';
import type { CalendarRowData } from '../lib/calendarRegistry';
import { DragHandle } from './DragHandle';
import { MayaLongCount } from './MayaLongCount';
import { MayaHaabDate, MayaLordOfNight, MayaTzolkinDate } from './MayaRoundDate';

interface CalendarRowProps {
  row: CalendarRowData;
  staggerIndex?: number;
  themeTransitionDelay?: number;
  onInfoClick: (id: CalendarRowData['entry']['id']) => void;
  onFullscreen: (row: CalendarRowData, originRect: DOMRectReadOnly, textOriginRect: DOMRectReadOnly) => void;
  isFullscreenSource?: boolean;
}

export function CalendarRow({
  row,
  staggerIndex,
  themeTransitionDelay,
  onInfoClick,
  onFullscreen,
  isFullscreenSource = false,
}: CalendarRowProps) {
  const { t } = useTranslation();
  const { entry, visible } = row;
  const rowRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const scriptClass = calendarTextClassName(entry.scriptFont);
  const scriptStyle = calendarTextStyle(entry.scriptFont);
  const scriptLang = calendarTextLang(entry.scriptFont);
  const detailScriptClass = calendarTextClassName(entry.detailScriptFont ?? entry.scriptFont);
  const detailScriptStyle = calendarTextStyle(entry.detailScriptFont ?? entry.scriptFont);
  const detailScriptLang = calendarTextLang(entry.detailScriptFont ?? entry.scriptFont);
  const dateText = entry.date || '-';
  const canCopy = Boolean(entry.date && entry.date !== '-');
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id, disabled: !visible });

  const isEntering = staggerIndex !== undefined;

  const style: CSSProperties & {
    '--calendar-accent'?: string;
    '--stagger-index'?: number;
    '--theme-transition-delay'?: string;
  } = {
    backgroundColor: row.backgroundColor,
    '--calendar-accent': row.backgroundColor,
    transform: isEntering ? undefined : CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
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
        visible ? 'calendar-row--visible' : 'calendar-row--hidden',
        isEntering ? 'calendar-row--entering' : '',
        isDragging ? 'calendar-row--dragging' : '',
        isFullscreenSource ? 'calendar-row--fullscreen-source' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!visible}
    >
      <div className="calendar-row__surface">
        <div className="calendar-row__date-wrap">
          <p
            className={`calendar-row__date ${scriptClass}`.trim()}
            style={scriptStyle}
            lang={scriptLang}
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
          disabled={!visible}
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
          {entry.mayaLordOfNight && !entry.mayaUseGlyphs ? (
            <div className="calendar-row__center-top">
              <MayaLordOfNight {...entry.mayaLordOfNight} transliterated />
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
                <span className="calendar-row__weekday" style={scriptStyle} lang={scriptLang}>
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
                <span className={`calendar-row__weekday ${detailScriptClass}`.trim()} style={detailScriptStyle} lang={detailScriptLang}>
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
    </article>
    </>
  );
}
