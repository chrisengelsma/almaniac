import type { CSSProperties } from 'react';

interface MayaGlyphProps {
  src: string;
  className?: string;
}

export function MayaGlyph({ src, className }: MayaGlyphProps) {
  return (
    <span
      className={['maya-glyph', className].filter(Boolean).join(' ')}
      style={{ '--maya-glyph-src': `url(${src})` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
