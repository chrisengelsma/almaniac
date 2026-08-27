import type { MayaHaabParts, MayaLordOfNight, MayaTzolkinParts } from '../lib/mayaRounds';
import {
  MAYA_LONG_PERIOD_GLYPHS,
  mayaHaabSrc,
  mayaLongPeriodSrc,
  mayaLordOfNightSrc,
  mayaTzolkinSrc,
} from '../data/mayaGlyphAssets';
import { MayaGlyph } from './MayaGlyph';
import { MayaNumeral } from './MayaNumeral';

export type MayaLongCountParts = [number, number, number, number, number];

interface MayaLongCountProps {
  parts: MayaLongCountParts;
  expanded?: boolean;
  useHieroglyphs?: boolean;
  tzolkin?: MayaTzolkinParts;
  haab?: MayaHaabParts;
  lordOfNight?: MayaLordOfNight;
}

function numeralVariant(useHieroglyphs: boolean): 'hieroglyph' | 'font' {
  return useHieroglyphs ? 'hieroglyph' : 'font';
}

function MayaInscriptionColumn({
  numeral,
  glyphSrc,
  glyphClassName,
  useHieroglyphs,
}: {
  numeral?: number;
  glyphSrc?: string;
  glyphClassName?: string;
  useHieroglyphs: boolean;
}) {
  const variant = numeralVariant(useHieroglyphs);

  return (
    <span className="maya-inscription__column">
      {numeral != null ? (
        <MayaNumeral value={numeral} variant={variant} className="maya-inscription__numeral" />
      ) : null}
      {useHieroglyphs && glyphSrc ? (
        <MayaGlyph
          className={['maya-inscription__glyph', glyphClassName].filter(Boolean).join(' ')}
          src={glyphSrc}
        />
      ) : null}
    </span>
  );
}

function MayaLongCountGroup({
  value,
  index,
  useHieroglyphs,
}: {
  value: number;
  index: number;
  useHieroglyphs: boolean;
}) {
  const variant = numeralVariant(useHieroglyphs);

  return (
    <span className="maya-long-count__group">
      <MayaNumeral value={value} variant={variant} />
      {useHieroglyphs ? (
        <MayaGlyph className="maya-long-count__glyph" src={mayaLongPeriodSrc(index)} />
      ) : null}
    </span>
  );
}

function MayaFontInscriptionColumn({ numerals }: { numerals: number[] }) {
  return (
    <span className="maya-inscription__column maya-inscription__column--font">
      {numerals.map((value, index) => (
        <MayaNumeral
          key={`${value}-${index}`}
          value={value}
          variant="font"
          className="maya-inscription__numeral"
        />
      ))}
    </span>
  );
}

export function MayaLongCount({
  parts,
  expanded = false,
  useHieroglyphs = true,
  tzolkin,
  haab,
  lordOfNight,
}: MayaLongCountProps) {
  if (!expanded) {
    return (
      <span
        className={[
          'maya-long-count',
          useHieroglyphs ? '' : 'maya-long-count--font',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      >
        {parts.map((value, index) => (
          <MayaLongCountGroup
            key={MAYA_LONG_PERIOD_GLYPHS[index]}
            value={value}
            index={index}
            useHieroglyphs={useHieroglyphs}
          />
        ))}
      </span>
    );
  }

  return (
    <span
      className={[
        'maya-inscription',
        useHieroglyphs ? '' : 'maya-inscription--font',
      ]
        .filter(Boolean)
        .join(' ')}
      aria-hidden="true"
    >
      {parts.map((value, index) => (
        <MayaInscriptionColumn
          key={MAYA_LONG_PERIOD_GLYPHS[index]}
          numeral={value}
          glyphSrc={mayaLongPeriodSrc(index)}
          useHieroglyphs={useHieroglyphs}
        />
      ))}
      {tzolkin ? (
        useHieroglyphs ? (
          <MayaInscriptionColumn
            numeral={tzolkin.number}
            glyphSrc={mayaTzolkinSrc(tzolkin.dayIndex)}
            useHieroglyphs
          />
        ) : (
          <MayaFontInscriptionColumn numerals={[tzolkin.number, tzolkin.dayIndex]} />
        )
      ) : null}
      {haab ? (
        useHieroglyphs ? (
          <MayaInscriptionColumn
            numeral={haab.day}
            glyphSrc={mayaHaabSrc(haab.monthIndex)}
            useHieroglyphs
          />
        ) : (
          <MayaFontInscriptionColumn numerals={[haab.day, haab.monthIndex]} />
        )
      ) : null}
      {useHieroglyphs && lordOfNight ? (
        <MayaInscriptionColumn glyphSrc={mayaLordOfNightSrc(lordOfNight.lord)} useHieroglyphs />
      ) : null}
    </span>
  );
}
