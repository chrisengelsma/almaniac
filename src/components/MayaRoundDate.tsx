import { useTranslation } from 'react-i18next';
import { mayaHaabSrc, mayaLordOfNightSrc, mayaTzolkinSrc } from '../data/mayaGlyphAssets';
import { MayaGlyph } from './MayaGlyph';
import { MayaNumeral } from './MayaNumeral';

interface MayaHaabDateProps {
  day: number;
  monthIndex: number;
  label: string;
  transliterated?: boolean;
  useHieroglyphs?: boolean;
}

interface MayaTzolkinDateProps {
  number: number;
  dayIndex: number;
  label: string;
  transliterated?: boolean;
  useHieroglyphs?: boolean;
}

interface MayaLordOfNightProps {
  label: string;
  lord: number;
  transliterated?: boolean;
}

function MayaSignGlyph({ src, className }: { src: string; className?: string }) {
  return (
    <MayaGlyph
      className={['maya-round-date__sign', className].filter(Boolean).join(' ')}
      src={src}
    />
  );
}

function MayaRoundDateText({
  fieldLabel,
  value,
  ariaLabel,
  className,
}: {
  fieldLabel: string;
  value: string;
  ariaLabel: string;
  className?: string;
}) {
  return (
    <span
      className={['maya-round-date', 'maya-round-date--text', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
      <span className="maya-round-date__label">{fieldLabel}:</span>
      <span className="maya-round-date__value">{value}</span>
    </span>
  );
}

function numeralVariant(useHieroglyphs: boolean): 'hieroglyph' | 'font' {
  return useHieroglyphs ? 'hieroglyph' : 'font';
}

export function MayaHaabDate({
  day,
  monthIndex,
  label,
  transliterated,
  useHieroglyphs = true,
}: MayaHaabDateProps) {
  const { t } = useTranslation();

  if (transliterated) {
    return (
      <MayaRoundDateText
        fieldLabel={t('calendars.maya.haab')}
        value={label}
        ariaLabel={label}
      />
    );
  }

  const variant = numeralVariant(useHieroglyphs);

  return (
    <span className="maya-round-date" aria-label={label}>
      <MayaNumeral value={day} variant={variant} />
      {useHieroglyphs ? (
        <MayaSignGlyph src={mayaHaabSrc(monthIndex)} />
      ) : (
        <MayaNumeral value={monthIndex} variant="font" />
      )}
    </span>
  );
}

export function MayaTzolkinDate({
  number,
  dayIndex,
  label,
  transliterated,
  useHieroglyphs = true,
}: MayaTzolkinDateProps) {
  const { t } = useTranslation();

  if (transliterated) {
    return (
      <MayaRoundDateText
        fieldLabel={t('calendars.maya.tzolkin')}
        value={label}
        ariaLabel={label}
      />
    );
  }

  const variant = numeralVariant(useHieroglyphs);

  return (
    <span className="maya-round-date" aria-label={label}>
      <MayaNumeral value={number} variant={variant} />
      {useHieroglyphs ? (
        <MayaSignGlyph src={mayaTzolkinSrc(dayIndex)} />
      ) : (
        <MayaNumeral value={dayIndex} variant="font" />
      )}
    </span>
  );
}

export function MayaLordOfNight({ label, lord, transliterated }: MayaLordOfNightProps) {
  const { t } = useTranslation();

  if (transliterated) {
    const fieldLabel = t('calendars.maya.lordOfTheNight');

    return (
      <MayaRoundDateText
        fieldLabel={fieldLabel}
        value={label}
        ariaLabel={`${fieldLabel}: ${label}`}
        className="maya-round-date--lord"
      />
    );
  }

  return (
    <span className="maya-round-date maya-round-date--lord" aria-label={label}>
      <MayaSignGlyph src={mayaLordOfNightSrc(lord)} />
    </span>
  );
}
