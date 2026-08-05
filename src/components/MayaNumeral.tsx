interface MayaNumeralProps {
  value: number;
}

const DOT_RADIUS = 2.2;
const DOT_Y = 7;
const DOT_GAP = 5.5;
const BAR_HEIGHT = 3;
const BAR_WIDTH = 22;
const BAR_GAP = 5;

function dotX(index: number, count: number): number {
  const span = (count - 1) * DOT_GAP;
  const start = (28 - span) / 2;
  return start + index * DOT_GAP;
}

function barY(index: number, barCount: number): number {
  const base = 34 - barCount * BAR_GAP;
  return base + index * BAR_GAP;
}

function ShellGlyph() {
  return (
    <>
      <path
        d="M4 18 C4 12, 9 8, 14 8 C19 8, 24 12, 24 18 C24 24, 19 28, 14 28 C9 28, 4 24, 4 18 Z"
        fill="currentColor"
      />
      <path
        d="M8 16 C10 14, 12 14, 14 16 C16 14, 18 14, 20 16 M9 20 C11 18, 13 18, 14 20 C15 18, 17 18, 19 20"
        fill="none"
        stroke="currentColor"
        strokeOpacity="0.35"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </>
  );
}

export function MayaNumeral({ value }: MayaNumeralProps) {
  if (value < 0 || value > 19) {
    return null;
  }

  const bars = Math.floor(value / 5);
  const dots = value % 5;

  return (
    <svg
      className="maya-numeral"
      viewBox="0 0 28 36"
      aria-hidden="true"
      focusable="false"
    >
      {value === 0 ? (
        <ShellGlyph />
      ) : (
        <>
          {Array.from({ length: dots }, (_, index) => (
            <circle
              key={`dot-${index}`}
              cx={dotX(index, dots)}
              cy={DOT_Y}
              r={DOT_RADIUS}
              fill="currentColor"
            />
          ))}
          {Array.from({ length: bars }, (_, index) => (
            <rect
              key={`bar-${index}`}
              x={(28 - BAR_WIDTH) / 2}
              y={barY(index, bars)}
              width={BAR_WIDTH}
              height={BAR_HEIGHT}
              rx={0.8}
              fill="currentColor"
            />
          ))}
        </>
      )}
    </svg>
  );
}
