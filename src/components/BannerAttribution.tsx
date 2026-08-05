interface BannerAttributionProps {
  subjects: string;
  onAboutOpen?: () => void;
}

export function BannerAttribution({ subjects, onAboutOpen }: BannerAttributionProps) {
  if (!onAboutOpen) {
    return null;
  }

  return (
    <p className="info-modal__hero-attribution">
      <span className="info-modal__hero-attribution-subjects">{subjects}</span>
      <button type="button" className="info-modal__hero-attribution-link" onClick={onAboutOpen}>
        Source
      </button>
    </p>
  );
}
