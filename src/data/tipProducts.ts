/** Consumable tip product IDs — smallest to largest. */
export const TIP_PRODUCT_IDS = [
  'app.engelsma.almaniac.tip.small',
  'app.engelsma.almaniac.tip.medium',
  'app.engelsma.almaniac.tip.large',
] as const;

export type TipProductId = (typeof TIP_PRODUCT_IDS)[number];

export const TIP_PRODUCT_LABEL_KEYS: Record<TipProductId, string> = {
  'app.engelsma.almaniac.tip.small': 'modals.donate.tipSmall',
  'app.engelsma.almaniac.tip.medium': 'modals.donate.tipMedium',
  'app.engelsma.almaniac.tip.large': 'modals.donate.tipLarge',
};

/** Suggested App Store Connect price tiers (USD). */
export const TIP_PRODUCT_PRICE_HINTS_USD = {
  small: 0.99,
  medium: 2.99,
  large: 4.99,
} as const;

export type TipTier = keyof typeof TIP_PRODUCT_PRICE_HINTS_USD;

export const TIP_TIERS: TipTier[] = ['small', 'medium', 'large'];

export const TIP_TIER_LABEL_KEYS: Record<TipTier, string> = {
  small: 'modals.donate.tipSmall',
  medium: 'modals.donate.tipMedium',
  large: 'modals.donate.tipLarge',
};

export const TIP_PRODUCT_TIERS: Record<TipProductId, TipTier> = {
  'app.engelsma.almaniac.tip.small': 'small',
  'app.engelsma.almaniac.tip.medium': 'medium',
  'app.engelsma.almaniac.tip.large': 'large',
};

/** Buy Me a Coffee `amount` query values for external tips (USD, whole dollars). */
export const EXTERNAL_TIP_COFFEE_AMOUNTS: Record<TipTier, number> = {
  small: 1,
  medium: 3,
  large: 5,
};
