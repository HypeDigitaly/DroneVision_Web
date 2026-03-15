// ---------------------------------------------------------------------------
// quiz-shared.ts — Shared constants for quiz-lead.ts
//
// Intentionally co-located here because Netlify Functions cannot easily
// import from src/. Keep these values in sync with src/utils/quiz.ts.
// ---------------------------------------------------------------------------

export const ENERGY_PRICE_KC_PER_KWH = 4.20;
export const ANNUAL_PRODUCTION_HOURS = 1100;

export const DEGRADATION_RATES: Record<string, number> = {
  '2008-2014': 0.30,
  '2015-2019': 0.16,
  '2020+':     0.08,
};

export const PRICING_TIERS = [
  { maxKw: 100,  price: 14690, label: 'do 100 kWp' },
  { maxKw: 250,  price: 19490, label: 'do 250 kWp' },
  { maxKw: 500,  price: 24290, label: 'do 500 kWp' },
  { maxKw: 750,  price: 26690, label: 'do 750 kWp' },
  { maxKw: 1000, price: 29090, label: 'do 1 MWp'   },
];

export const VALID_YEAR_RANGES = ['2008-2014', '2015-2019', '2020+'] as const;

/**
 * Returns the estimated annual energy loss in CZK caused by panel degradation.
 *
 * Formula: capacityKw × degradationRate × ANNUAL_PRODUCTION_HOURS × ENERGY_PRICE_KC_PER_KWH
 *
 * @example calculateAnnualLoss(100, '2008-2014') // 138600
 * @example calculateAnnualLoss(50,  '2020+')     // 18480
 */
export function calculateAnnualLoss(capacityKw: number, yearRange: string): number {
  const rate = DEGRADATION_RATES[yearRange];
  if (rate === undefined) return 0;
  return Math.round(capacityKw * rate * ANNUAL_PRODUCTION_HOURS * ENERGY_PRICE_KC_PER_KWH);
}

/**
 * Returns the inspection price tier that covers the given system capacity.
 * When capacity exceeds all defined tiers (> 1 MWp), returns `price: null`
 * and an individual-quote label.
 *
 * @example getPricingTier(100)  // { price: 14690, label: 'do 100 kWp' }
 * @example getPricingTier(101)  // { price: 19490, label: 'do 250 kWp' }
 * @example getPricingTier(1001) // { price: null,  label: 'nad 1 MWp — individuální nacenění' }
 */
export function getPricingTier(capacityKw: number): { price: number | null; label: string } {
  for (const tier of PRICING_TIERS) {
    if (capacityKw <= tier.maxKw) {
      return { price: tier.price, label: tier.label };
    }
  }
  return { price: null, label: 'nad 1 MWp — individuální nacenění' };
}

/**
 * Formats a numeric amount as a Czech-locale string (e.g. 138 600).
 */
export function formatCzk(amount: number): string {
  return new Intl.NumberFormat('cs-CZ').format(amount);
}

/**
 * Escapes HTML special characters to prevent XSS in generated email content.
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
