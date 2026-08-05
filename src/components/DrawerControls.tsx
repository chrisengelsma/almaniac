interface SheetToggleProps {
  checked: boolean;
  label: string;
  onChange: () => void;
}

export function SheetToggle({ checked, label, onChange }: SheetToggleProps) {
  return (
    <button
      type="button"
      className={`sheet__toggle${checked ? ' sheet__toggle--on' : ''}`}
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
    />
  );
}

interface SheetSliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}

export function SheetSlider({ value, min, max, onChange }: SheetSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="sheet__slider">
      <span>{min}</span>
      <label className="sheet__slider-track">
        <input
          type="range"
          min={min}
          max={max}
          step={1}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
        />
        <span className="sheet__slider-thumb" style={{ left: `${percent}%` }} />
      </label>
      <span>{max > 0 ? `+${max}` : max}</span>
    </div>
  );
}

// Backward-compatible aliases
export const DrawerToggle = SheetToggle;
export const DrawerSlider = SheetSlider;
