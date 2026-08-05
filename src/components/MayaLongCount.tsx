import { MayaNumeral } from './MayaNumeral';

export type MayaLongCountParts = [number, number, number, number, number];

interface MayaLongCountProps {
  parts: MayaLongCountParts;
}

export function MayaLongCount({ parts }: MayaLongCountProps) {
  return (
    <span className="maya-long-count" aria-hidden="true">
      {parts.map((value, index) => (
        <span key={index} className="maya-long-count__group">
          {index > 0 && <span className="maya-long-count__separator">·</span>}
          <MayaNumeral value={value} />
        </span>
      ))}
    </span>
  );
}
