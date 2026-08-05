export function DragHandle() {
  return (
    <span className="drag-handle" aria-hidden="true">
      {Array.from({ length: 6 }, (_, index) => (
        <span key={index} className="drag-handle__dot" />
      ))}
    </span>
  );
}
