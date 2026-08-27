import { MAYA_NUMERAL_GLYPHS } from '../data/mayaNumeralGlyphs';

interface MayaFontNumeralProps {
  value: number;
  className?: string;
}

export function MayaFontNumeral({ value, className }: MayaFontNumeralProps) {
  if (value < 0 || value > 19) {
    return null;
  }

  const glyph = MAYA_NUMERAL_GLYPHS[String(value) as keyof typeof MAYA_NUMERAL_GLYPHS];

  return (
    <svg
      className={['maya-font-numeral', className].filter(Boolean).join(' ')}
      viewBox={glyph.viewBox}
      role="img"
      aria-hidden="true"
    >
      <path fill="currentColor" d={glyph.d} />
    </svg>
  );
}
