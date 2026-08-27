import { mayaNumeralSrc } from '../data/mayaGlyphAssets';
import { MayaFontNumeral } from './MayaFontNumeral';
import { MayaGlyph } from './MayaGlyph';

export type MayaNumeralVariant = 'hieroglyph' | 'font';

interface MayaNumeralProps {
  value: number;
  className?: string;
  variant?: MayaNumeralVariant;
}

export function MayaNumeral({ value, className, variant = 'hieroglyph' }: MayaNumeralProps) {
  if (value < 0 || value > 19) {
    return null;
  }

  if (variant === 'font') {
    return <MayaFontNumeral value={value} className={className} />;
  }

  return (
    <MayaGlyph
      className={['maya-numeral', className].filter(Boolean).join(' ')}
      src={mayaNumeralSrc(value)}
    />
  );
}
