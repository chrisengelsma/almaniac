import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { GregorianCalendar } from '../lib/calendarRegistry';
import type { CalendarId } from '../lib/calendarRegistry';
import type { AppSettings } from '../lib/appSettings';
import {
  clampPickerValues,
  extractPickerValues,
  getPickerFields,
  PICKER_CALENDAR_IDS,
  pickerValuesToGregorian,
  type PickerContext,
  type PickerFieldDef,
  type PickerValues,
} from '../lib/datePickerConfig';
import type { GregorianEra } from '../lib/gregorianDate';

interface DatePickerModalProps {
  open: boolean;
  anchor: GregorianCalendar;
  settings: AppSettings;
  onClose: () => void;
  onApply: (date: GregorianCalendar) => void;
}

interface PickerCalendarOption {
  id: CalendarId;
  label: string;
  searchText: string;
}

function pickerContextFromSettings(settings: AppSettings): PickerContext {
  return {
    islamicCalendarMode: settings.islamicCalendarMode,
    julianCalendarMode: settings.julianCalendarMode,
    useModifiedJulianDay: settings.useModifiedJulianDay,
  };
}

const CALENDAR_YEAR_FIELD_KEYS: Partial<Record<CalendarId, string>> = {
  thaiBuddhist: 'buddhistYear',
  bengali: 'bengaliYear',
  nepali: 'nepaliYear',
  minguo: 'minguoYear',
  koreanDangi: 'dangiYear',
  juche: 'jucheYear',
  isoWeek: 'isoWeekYear',
  discordian: 'yoldYear',
};

function getFieldLabel(
  field: PickerFieldDef,
  calendarId: CalendarId,
  exists: (key: string) => boolean,
  t: (key: string) => string,
): string {
  if (field.key === 'year') {
    const specializedKey = CALENDAR_YEAR_FIELD_KEYS[calendarId];
    if (specializedKey) {
      const specializedI18nKey = `datePicker.field.${specializedKey}`;
      if (exists(specializedI18nKey)) {
        return t(specializedI18nKey);
      }
    }
  }

  const key = `datePicker.field.${field.key}`;
  return exists(key) ? t(key) : field.label;
}

function CalendarSearchSelect({
  calendarId,
  options,
  onChange,
}: {
  calendarId: CalendarId;
  options: PickerCalendarOption[];
  onChange: (id: CalendarId) => void;
}) {
  const { t } = useTranslation();
  const listId = useId();
  const [query, setQuery] = useState('');
  const [openList, setOpenList] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.id === calendarId);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return options;
    }

    return options.filter((option) => option.searchText.includes(normalized));
  }, [options, query]);

  useEffect(() => {
    if (!openList) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenList(false);
        setQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, [openList]);

  return (
    <div className="date-modal__search" ref={containerRef}>
      <label htmlFor={listId}>{t('datePicker.calendarLabel')}</label>
      <input
        id={listId}
        type="text"
        role="combobox"
        aria-expanded={openList}
        aria-autocomplete="list"
        value={openList ? query : (selected?.label ?? '')}
        placeholder={t('datePicker.searchPlaceholder')}
        onFocus={() => {
          setOpenList(true);
          setQuery('');
        }}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpenList(true);
        }}
      />
      {openList ? (
        <ul className="date-modal__search-results" role="listbox">
          {filtered.length === 0 ? (
            <li className="date-modal__search-empty">{t('datePicker.noResults')}</li>
          ) : (
            filtered.map((option) => (
              <li key={option.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={option.id === calendarId}
                  className={`date-modal__search-option${option.id === calendarId ? ' date-modal__search-option--active' : ''}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(option.id);
                    setQuery('');
                    setOpenList(false);
                  }}
                >
                  {option.label}
                </button>
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}

function PickerField({
  calendarId,
  field,
  values,
  onChange,
}: {
  calendarId: CalendarId;
  field: PickerFieldDef;
  values: PickerValues;
  onChange: (key: string, value: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const label = getFieldLabel(field, calendarId, i18n.exists.bind(i18n), t);

  if (field.type === 'era') {
    const era = (values.era ?? 'CE') as GregorianEra;
    return (
      <div className="date-modal__field">
        <span className="date-modal__field-label">{label}</span>
        <div className="date-modal__era" role="group" aria-label={t('datePicker.eraAria')}>
          <button
            type="button"
            className={`date-modal__era-btn${era === 'CE' ? ' date-modal__era-btn--active' : ''}`}
            onClick={() => onChange('era', 'CE')}
          >
            {t('datePicker.eraCe')}
          </button>
          <button
            type="button"
            className={`date-modal__era-btn${era === 'BCE' ? ' date-modal__era-btn--active' : ''}`}
            onClick={() => onChange('era', 'BCE')}
          >
            {t('datePicker.eraBce')}
          </button>
        </div>
      </div>
    );
  }

  if (field.type === 'select') {
    const options = field.getOptions?.(values) ?? [];
    return (
      <div className="date-modal__field">
        <label htmlFor={`picker-${field.key}`}>{label}</label>
        <select
          id={`picker-${field.key}`}
          value={values[field.key] ?? options[0]?.value ?? ''}
          onChange={(event) => onChange(field.key, event.target.value)}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="date-modal__field">
      <label htmlFor={`picker-${field.key}`}>{label}</label>
      <input
        id={`picker-${field.key}`}
        type="number"
        inputMode={field.step && field.step < 1 ? 'decimal' : 'numeric'}
        min={field.min}
        max={field.getMax?.(values)}
        step={field.step ?? 1}
        value={values[field.key] ?? ''}
        placeholder={field.placeholder}
        onChange={(event) => onChange(field.key, event.target.value)}
      />
      {field.hint ? <p className="date-modal__hint">{field.hint}</p> : null}
    </div>
  );
}

export function DatePickerModal({ open, anchor, settings, onClose, onApply }: DatePickerModalProps) {
  const { t } = useTranslation();
  const titleId = useId();
  const [calendarId, setCalendarId] = useState<CalendarId>('gregorian');
  const [values, setValues] = useState<PickerValues>({});
  const [error, setError] = useState<string | null>(null);
  const pickerContext = useMemo(() => pickerContextFromSettings(settings), [settings]);

  const calendarOptions = useMemo<PickerCalendarOption[]>(
    () =>
      PICKER_CALENDAR_IDS.map((id) => {
        const label = t(`calendars.name.${id}`);
        return {
          id,
          label,
          searchText: `${label} ${id}`.toLowerCase(),
        };
      }),
    [t],
  );

  const fields = useMemo(() => getPickerFields(calendarId, pickerContext), [calendarId, pickerContext]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setCalendarId('gregorian');
    setValues(extractPickerValues('gregorian', anchor, pickerContext));
    setError(null);
  }, [open, anchor, pickerContext]);

  const handleCalendarChange = (nextCalendarId: CalendarId) => {
    setCalendarId(nextCalendarId);
    setValues(clampPickerValues(nextCalendarId, extractPickerValues(nextCalendarId, anchor, pickerContext), pickerContext));
    setError(null);
  };

  const handleValueChange = (key: string, value: string) => {
    setValues((current) => clampPickerValues(calendarId, { ...current, [key]: value }, pickerContext));
    setError(null);
  };

  const handleApply = () => {
    const next = pickerValuesToGregorian(calendarId, values, pickerContext);
    if (!next) {
      setError(t('datePicker.invalidDate'));
      return;
    }

    onApply(next);
    onClose();
  };

  const mayaFields = fields.filter((field) =>
    ['baktun', 'katun', 'tun', 'uinal', 'kin'].includes(field.key),
  );
  const regularFields = fields.filter((field) => !mayaFields.includes(field));

  return (
    <div className={`date-modal${open ? ' date-modal--visible' : ''}`} aria-hidden={!open}>
      <button type="button" className="date-modal__backdrop" onClick={onClose} aria-label={t('common.close')} />
      <div
        className="date-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className="date-modal__header">
          <h2 id={titleId}>{t('datePicker.title')}</h2>
          <button type="button" className="date-modal__close" onClick={onClose} aria-label={t('common.close')}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        <div className="date-modal__body">
          <CalendarSearchSelect
            calendarId={calendarId}
            options={calendarOptions}
            onChange={handleCalendarChange}
          />

          {regularFields.length > 0 ? (
            <div className="date-modal__fields">
              {calendarId === 'gregorian' ? (
                <>
                  <div className="date-modal__year-row">
                    <PickerField
                      calendarId={calendarId}
                      field={regularFields.find((field) => field.key === 'year')!}
                      values={values}
                      onChange={handleValueChange}
                    />
                    <PickerField
                      calendarId={calendarId}
                      field={regularFields.find((field) => field.key === 'era')!}
                      values={values}
                      onChange={handleValueChange}
                    />
                  </div>
                  <div className="date-modal__row">
                    <PickerField
                      calendarId={calendarId}
                      field={regularFields.find((field) => field.key === 'month')!}
                      values={values}
                      onChange={handleValueChange}
                    />
                    <PickerField
                      calendarId={calendarId}
                      field={regularFields.find((field) => field.key === 'day')!}
                      values={values}
                      onChange={handleValueChange}
                    />
                  </div>
                </>
              ) : (
                regularFields.map((field) => (
                  <PickerField
                    key={field.key}
                    calendarId={calendarId}
                    field={field}
                    values={values}
                    onChange={handleValueChange}
                  />
                ))
              )}
            </div>
          ) : null}

          {mayaFields.length > 0 ? (
            <div className="date-modal__maya-grid">
              {mayaFields.map((field) => (
                <PickerField
                  key={field.key}
                  calendarId={calendarId}
                  field={field}
                  values={values}
                  onChange={handleValueChange}
                />
              ))}
            </div>
          ) : null}

          {error ? <p className="date-modal__error" role="alert">{error}</p> : null}
        </div>

        <footer className="date-modal__footer">
          <button type="button" className="date-modal__btn date-modal__btn--ghost" onClick={onClose}>
            {t('datePicker.cancel')}
          </button>
          <button type="button" className="date-modal__btn date-modal__btn--primary" onClick={handleApply}>
            {t('datePicker.apply')}
          </button>
        </footer>
      </div>
    </div>
  );
}
