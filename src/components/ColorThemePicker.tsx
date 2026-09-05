import { useTranslation } from 'react-i18next';
import {
  isSupporterOnlyTheme,
  THEME_PALETTE,
  type ColorThemeId,
} from '../theme/themePalette';

interface ColorThemePickerProps {
  value: ColorThemeId;
  supporterUnlocked: boolean;
  onChange: (value: ColorThemeId) => void;
  onRequestSupporterUnlock: () => void;
}

function IconLock() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10V8a5 5 0 0 1 10 0v2M6 10h12v10H6V10Z" />
    </svg>
  );
}

export function ColorThemePicker({
  value,
  supporterUnlocked,
  onChange,
  onRequestSupporterUnlock,
}: ColorThemePickerProps) {
  const { t } = useTranslation();

  return (
    <ul className="theme-picker-list" role="radiogroup" aria-label={t('settings.colorThemeAria')}>
      {THEME_PALETTE.map((entry) => {
        const selected = value === entry.id;
        const locked = !supporterUnlocked && isSupporterOnlyTheme(entry.id);
        const label = t(entry.labelKey);

        return (
          <li key={entry.id}>
            <button
              type="button"
              className={[
                'theme-picker-card',
                selected ? 'theme-picker-card--selected' : '',
                locked ? 'theme-picker-card--locked' : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() => {
                if (locked) {
                  onRequestSupporterUnlock();
                  return;
                }
                onChange(entry.id);
              }}
              role="radio"
              aria-checked={selected}
              aria-disabled={locked}
              aria-label={
                locked
                  ? t('settings.supporterLockedAria', { label })
                  : t('settings.colorThemeOptionAria', { label })
              }
            >
              <span className="theme-picker-card__header">
                <span className="theme-picker-card__label">{label}</span>
                {locked ? (
                  <span className="theme-picker-card__lock" aria-hidden="true">
                    <IconLock />
                  </span>
                ) : null}
              </span>
              <span className="theme-picker-card__swatches" aria-hidden="true">
                {entry.previewColors.map((color, index) => (
                  <span
                    key={index}
                    className="theme-picker-card__swatch"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
