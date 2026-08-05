import { useEffect, useRef, useState } from 'react';
import {
  DndContext,
  PointerSensor,
  TouchSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { AppSettings } from '../lib/appSettings';
import {
  DEFAULT_CALENDAR_ORDER,
  getOrderedCalendarRows,
  reorderCalendars,
  type CalendarId,
  type GregorianCalendar,
} from '../lib/calendarRegistry';
import { CalendarRow } from './CalendarRow';

interface CalendarListProps {
  order: CalendarId[];
  anchor: GregorianCalendar;
  settings: AppSettings;
  onReorder: (order: CalendarId[]) => void;
  onInfoClick: (id: CalendarId) => void;
}

export function CalendarList({ order, anchor, settings, onReorder, onInfoClick }: CalendarListProps) {
  const listRef = useRef<HTMLElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const [showAddHint, setShowAddHint] = useState(false);
  const rows = getOrderedCalendarRows(order, anchor, settings);
  const visibleRows = rows.filter((row) => row.visible);
  const hasHiddenCalendars = visibleRows.length < DEFAULT_CALENDAR_ORDER.length;

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

  const handleDragEnd = (event: DragEndEvent) => {
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
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={visibleRows.map((row) => row.entry.id)}
          strategy={verticalListSortingStrategy}
        >
          <section className="calendar-list" ref={listRef} aria-label="Calendar conversions">
            <div className="calendar-list__rows" ref={rowsRef}>
              {rows.map((row) => (
                <CalendarRow key={row.entry.id} row={row} onInfoClick={onInfoClick} />
              ))}
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
