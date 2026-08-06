import { useEffect, useRef, useState } from 'react';
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
import { hapticDragHover } from '../lib/haptics';
import { CalendarRow } from './CalendarRow';

interface CalendarListProps {
  order: CalendarId[];
  anchor: GregorianCalendar;
  settings: AppSettings;
  themeTransitionDelays?: ThemeTransitionDelays | null;
  onReorder: (order: CalendarId[]) => void;
  onInfoClick: (id: CalendarId) => void;
  onFullscreen: (row: CalendarRowData, originRect: DOMRectReadOnly, textOriginRect: DOMRectReadOnly) => void;
  fullscreenCalendarId?: CalendarId | null;
}

export function CalendarList({
  order,
  anchor,
  settings,
  themeTransitionDelays = null,
  onReorder,
  onInfoClick,
  onFullscreen,
  fullscreenCalendarId = null,
}: CalendarListProps) {
  const listRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const dragOverIdRef = useRef<string | null>(null);
  const [showAddHint, setShowAddHint] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const rows = getOrderedCalendarRows(order, anchor, settings);
  const visibleRows = rows.filter((row) => row.visible);
  const hasHiddenCalendars = visibleRows.length < DEFAULT_CALENDAR_ORDER.length;

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
      if (!hasHiddenCalendars) {
        setShowAddHint(false);
        return;
      }

      const rowsOverflow = rowsEl.scrollHeight > list.clientHeight + 1;
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
          items={visibleRows.map((row) => row.entry.id)}
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
            aria-label="Calendar conversions"
          >
            <div className="calendar-list__rows" ref={rowsRef}>
              {(() => {
                let visibleIndex = 0;

                return rows.map((row) => {
                  const staggerIndex = row.visible ? visibleIndex++ : undefined;

                  return (
                    <CalendarRow
                      key={row.entry.id}
                      row={row}
                      staggerIndex={isEntering ? staggerIndex : undefined}
                      themeTransitionDelay={themeTransitionDelays?.[row.entry.id]}
                      onInfoClick={onInfoClick}
                      onFullscreen={onFullscreen}
                      isFullscreenSource={fullscreenCalendarId === row.entry.id}
                    />
                  );
                });
              })()}
            </div>
            {showAddHint ? (
              <p className="calendar-list__hint">Add another calendar from the menu</p>
            ) : null}
          </section>
        </SortableContext>
      </DndContext>
    </div>
  );
}
