import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  type DragOverEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { AppSettings } from '../lib/appSettings';
import type { ThemeTransitionDelays } from '../lib/themeTransition';
import {
  DEFAULT_CALENDAR_ORDER,
  getOrderedCalendarRows,
  reorderCalendars,
  type CalendarId,
  type CalendarRowData,
  type GregorianCalendar,
} from '../lib/calendarRegistry';
import type { CalendarCopy } from '../i18n/calendarCopy';
import { hapticDragHover, hapticTap } from '../lib/haptics';
import { CalendarRow } from './CalendarRow';

interface CalendarListProps {
  order: CalendarId[];
  anchor: GregorianCalendar;
  settings: AppSettings;
  calendarCopy: CalendarCopy;
  julianDayAt?: Date;
  themeTransitionDelays?: ThemeTransitionDelays | null;
  onReorder: (order: CalendarId[]) => void;
  onHideCalendar: (id: CalendarId) => void;
  onInfoClick: (id: CalendarId) => void;
  onFullscreen: (row: CalendarRowData, originRect: DOMRectReadOnly, textOriginRect: DOMRectReadOnly) => void;
  fullscreenCalendarId?: CalendarId | null;
}

export function CalendarList({
  order,
  anchor,
  settings,
  calendarCopy,
  julianDayAt,
  themeTransitionDelays = null,
  onReorder,
  onHideCalendar,
  onInfoClick,
  onFullscreen,
  fullscreenCalendarId = null,
}: CalendarListProps) {
  const { t } = useTranslation();
  const listRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const dragOverIdRef = useRef<string | null>(null);
  const [showAddHint, setShowAddHint] = useState(false);
  const [fillsViewport, setFillsViewport] = useState(true);
  const [isEntering, setIsEntering] = useState(true);
  const [exitingIds, setExitingIds] = useState<CalendarId[]>([]);
  const allRows = getOrderedCalendarRows(order, anchor, settings, calendarCopy, julianDayAt);
  const visibleRows = allRows.filter((row) => row.visible);
  const displayRows = allRows.filter(
    (row) => row.visible || exitingIds.includes(row.entry.id),
  );
  const hasHiddenCalendars = visibleRows.length < DEFAULT_CALENDAR_ORDER.length;

  const handleHideCalendar = useCallback(
    (id: CalendarId) => {
      setExitingIds((current) => (current.includes(id) ? current : [...current, id]));
      onHideCalendar(id);
    },
    [onHideCalendar],
  );

  const handleRemoveComplete = useCallback((id: CalendarId) => {
    setExitingIds((current) => current.filter((item) => item !== id));
  }, []);

  useEffect(() => {
    const enterDuration = 440 + Math.max(visibleRows.length - 1, 0) * 70;
    const timer = window.setTimeout(() => setIsEntering(false), enterDuration);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    const rowsEl = rowsRef.current;
    if (!list || !rowsEl) {
      return;
    }

    const updateHint = () => {
      const rowsOverflow = rowsEl.scrollHeight > list.clientHeight + 1;
      setFillsViewport(!rowsOverflow);

      if (!hasHiddenCalendars) {
        setShowAddHint(false);
        return;
      }

      setShowAddHint(!rowsOverflow);
    };

    updateHint();

    const observer = new ResizeObserver(updateHint);
    observer.observe(list);
    observer.observe(rowsEl);

    return () => observer.disconnect();
  }, [hasHiddenCalendars, visibleRows.length]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const handleDragOver = (event: DragOverEvent) => {
    const overId = event.over ? String(event.over.id) : null;
    if (overId === dragOverIdRef.current) {
      return;
    }

    dragOverIdRef.current = overId;
    if (overId !== null && overId !== String(event.active.id)) {
      hapticDragHover();
    }
  };

  const resetDragHover = () => {
    dragOverIdRef.current = null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    resetDragHover();
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const visibleIds = visibleRows.map((row) => row.entry.id);
    const oldIndex = visibleIds.indexOf(active.id as CalendarId);
    const newIndex = visibleIds.indexOf(over.id as CalendarId);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    onReorder(reorderCalendars(order, arrayMove(visibleIds, oldIndex, newIndex)));
  };

  return (
    <div className="calendar-list-shell">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
        onDragCancel={resetDragHover}
      >
        <SortableContext
          items={displayRows.map((row) => row.entry.id)}
          strategy={verticalListSortingStrategy}
        >
          <section
            className={[
              'calendar-list',
              isEntering ? 'calendar-list--entering' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            ref={listRef}
            aria-label={t('calendars.listAria')}
          >
            <div className="calendar-list__rows" ref={rowsRef}>
              {displayRows.map((row, index) => (
                <CalendarRow
                  key={row.entry.id}
                  row={row}
                  staggerIndex={isEntering && row.visible ? index : undefined}
                  themeTransitionDelay={themeTransitionDelays?.[row.entry.id]}
                  isExiting={exitingIds.includes(row.entry.id)}
                  onInfoClick={onInfoClick}
                  onHide={() => handleHideCalendar(row.entry.id)}
                  onRemoveComplete={() => handleRemoveComplete(row.entry.id)}
                  onDismissStart={() => hapticTap()}
                  onFullscreen={onFullscreen}
                  isFullscreenSource={fullscreenCalendarId === row.entry.id}
                />
              ))}
              {fillsViewport ? <div className="calendar-list__spacer" aria-hidden="true" /> : null}
            </div>
            {showAddHint ? (
              <p className="calendar-list__hint">{t('calendars.addHint')}</p>
            ) : null}
          </section>
        </SortableContext>
      </DndContext>
    </div>
  );
}
