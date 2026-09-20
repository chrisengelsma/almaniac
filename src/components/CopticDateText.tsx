export interface CopticDateParts {
  day: string;
  month: string;
  year: string;
}

interface CopticDateTextProps {
  parts: CopticDateParts;
}

export function CopticDateText({ parts }: CopticDateTextProps) {
  return (
    <>
      <span className="calendar-row__coptic-digit">{parts.day}</span>
      {' '}
      <span className="calendar-row__coptic-script">{parts.month}</span>
      {' '}
      <span className="calendar-row__coptic-digit">{parts.year}</span>
    </>
  );
}
