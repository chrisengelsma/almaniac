interface BannerAttributionProps {
  onAboutOpen?: () => void;
}

export function BannerAttribution({ onAboutOpen }: BannerAttributionProps) {
  if (!onAboutOpen) {
    return null;
  }

  return (
    <p className="info-modal__hero-attribution">
      <button type="button" className="info-modal__hero-attribution-link" onClick={onAboutOpen}>
        Credits
      </button>
    </p>
  );
}
