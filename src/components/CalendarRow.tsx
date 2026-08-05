import { useState } from 'react';
import { CSS } from '@dnd-kit/utilities';
import { useSortable } from '@dnd-kit/sortable';
import { copyTextToClipboard } from '../lib/copyText';
import { ROW_BACKGROUNDS } from '../theme/calendarTheme';
import { SCRIPT_FONTS } from '../theme/scriptFonts';
import type { CalendarRowData } from '../lib/calendarRegistry';
import { DragHandle } from './DragHandle';
import { MayaLongCount } from './MayaLongCount';

interface CalendarRowProps {
  row: CalendarRowData;
  onInfoClick: (id: CalendarRowData['entry']['id']) => void;
}

const SCRIPT_CLASS: Record<CalendarRowData['entry']['scriptFont'], string> = {
  latin: '',
  arabic: 'calendar-row__text--rtl',
  hebrew: 'calendar-row__text--rtl',
  devanagari: '',
  chinese: '',
  cyrillic: '',
  ethiopic: '',
  coptic: '',
};

const SCRIPT_STYLE: Record<CalendarRowData['entry']['scriptFont'], string | undefined> = {
  latin: undefined,
  arabic: SCRIPT_FONTS.arabic,
  hebrew: SCRIPT_FONTS.hebrew,
  devanagari: SCRIPT_FONTS.devanagari,
  chinese: SCRIPT_FONTS.chinese,
  cyrillic: SCRIPT_FONTS.cyrillic,
  ethiopic: SCRIPT_FONTS.ethiopic,
  coptic: SCRIPT_FONTS.coptic,
};

export function CalendarRow({ row, onInfoClick }: CalendarRowProps) {
  const { entry, visible } = row;
  const [copied, setCopied] = useState(false);
  const scriptClass = SCRIPT_CLASS[entry.scriptFont];
  const scriptStyle = SCRIPT_STYLE[entry.scriptFont]
    ? { fontFamily: SCRIPT_STYLE[entry.scriptFont] }
    : undefined;
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

  const style = {
    backgroundColor: ROW_BACKGROUNDS[entry.id],
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

  return (
    <>
      {copied && (
        <div className="copy-notice" role="status" aria-live="polite">
          Copied to clipboard
        </div>
      )}
      <article
      ref={setNodeRef}
      style={style}
      className={[
        'calendar-row',
        visible ? 'calendar-row--visible' : 'calendar-row--hidden',
        isDragging ? 'calendar-row--dragging' : '',
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
            <span className="calendar-row__weekday" style={scriptStyle}>
              {entry.weekday}
            </span>
            <span className="calendar-row__calendar-name">{entry.calendarName}</span>
          </div>
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
