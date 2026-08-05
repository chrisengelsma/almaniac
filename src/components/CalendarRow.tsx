import { useRef, useState, type CSSProperties } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { copyTextToClipboard } from '../lib/copyText';
import { calendarTextClassName, calendarTextStyle } from '../lib/calendarTextStyle';
import type { CalendarRowData } from '../lib/calendarRegistry';
import { DragHandle } from './DragHandle';
import { MayaLongCount } from './MayaLongCount';

interface CalendarRowProps {
  row: CalendarRowData;
  onInfoClick: (id: CalendarRowData['entry']['id']) => void;
  onFullscreen: (row: CalendarRowData, originRect: DOMRectReadOnly, textOriginRect: DOMRectReadOnly) => void;
  isFullscreenSource?: boolean;
}

export function CalendarRow({ row, onInfoClick, onFullscreen, isFullscreenSource = false }: CalendarRowProps) {
  const { entry, visible } = row;
  const rowRef = useRef<HTMLElement | null>(null);
  const [copied, setCopied] = useState(false);
  const scriptClass = calendarTextClassName(entry.scriptFont);
  const scriptStyle = calendarTextStyle(entry.scriptFont);
  const detailScriptClass = calendarTextClassName(entry.detailScriptFont ?? entry.scriptFont);
  const detailScriptStyle = calendarTextStyle(entry.detailScriptFont ?? entry.scriptFont);
  const dateText = entry.date || '—';
  const canCopy = Boolean(entry.date && entry.date !== '—');
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: entry.id, disabled: !visible });

  const style: CSSProperties & { '--calendar-accent'?: string } = {
    backgroundColor: row.backgroundColor,
    '--calendar-accent': row.backgroundColor,
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : undefined,
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

  return (
    <>
      {copied && (
        <div className="copy-notice" role="status" aria-live="polite">
          Copied to clipboard
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
        visible ? 'calendar-row--visible' : 'calendar-row--hidden',
        isDragging ? 'calendar-row--dragging' : '',
        isFullscreenSource ? 'calendar-row--fullscreen-source' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden={!visible}
    >
      <div className="calendar-row__surface">
        <button
          type="button"
          ref={setActivatorNodeRef}
          className="calendar-row__drag-handle"
          aria-label={`Reorder ${entry.label}`}
          {...attributes}
          {...listeners}
          disabled={!visible}
        >
          <DragHandle />
        </button>
        <div className="calendar-row__body">
          <div className="calendar-row__date-wrap">
            <p
              className={`calendar-row__date ${scriptClass}`.trim()}
              style={scriptStyle}
              aria-label={entry.mayaLongCount ? dateText : undefined}
            >
              {entry.mayaLongCount ? (
                <MayaLongCount parts={entry.mayaLongCount} />
              ) : (
                dateText
              )}
            </p>
          </div>
          <div className="calendar-row__meta">
            {entry.weekday ? (
              <span className="calendar-row__weekday" style={scriptStyle}>
                {entry.weekday}
              </span>
            ) : null}
            <span className="calendar-row__calendar-name">{entry.calendarName}</span>
          </div>
          {entry.detailLabel ? (
            <div className="calendar-row__meta calendar-row__meta--bottom">
              <span className={`calendar-row__weekday ${detailScriptClass}`.trim()} style={detailScriptStyle}>
                {entry.detailLabel}
              </span>
            </div>
          ) : null}
          <div className="calendar-row__actions">
            <button
              type="button"
              className="calendar-row__action"
              aria-label={`Copy ${entry.label} date`}
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
              aria-label={`Show ${entry.label} date fullscreen`}
              disabled={!canCopy}
              onClick={handleFullscreen}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8 3H5a2 2 0 0 0-2 2v3M16 3h3a2 2 0 0 1 2 2v3M8 21H5a2 2 0 0 1-2-2v-3M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            </button>
            <button
              type="button"
              className="calendar-row__action"
              aria-label={`About the ${entry.label}`}
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
