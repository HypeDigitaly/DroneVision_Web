// ---------------------------------------------------------------------------
// quiz.ts — Calculation helpers for the solar-panel degradation quiz
// ---------------------------------------------------------------------------

import type { ManufactureYearRange, DegradationMap, PricingTier } from '../types/quiz';

export const ENERGY_PRICE_KC_PER_KWH = 4.20;
export const ANNUAL_PRODUCTION_HOURS = 1100;

export const DEGRADATION_RATES: DegradationMap = {
  '2008-2014': { rate: 0.30, label_cs: 'Starší panely (2008–2014)', label_en: 'Older panels (2008–2014)' },
  '2015-2019': { rate: 0.16, label_cs: 'Středně staré (2015–2019)', label_en: 'Mid-age panels (2015–2019)' },
  '2020+':     { rate: 0.08, label_cs: 'Moderní panely (2020+)',    label_en: 'Modern panels (2020+)'     },
};

export const PRICING_TIERS: PricingTier[] = [
  { maxKw: 100,  price: 14690, label: 'do 100 kWp' },
  { maxKw: 250,  price: 19490, label: 'do 250 kWp' },
  { maxKw: 500,  price: 24290, label: 'do 500 kWp' },
  { maxKw: 750,  price: 26690, label: 'do 750 kWp' },
  { maxKw: 1000, price: 29090, label: 'do 1 MWp'   },
];

/**
 * Returns the estimated annual energy loss in CZK caused by panel degradation.
 *
 * Formula: capacityKw × degradationRate × ANNUAL_PRODUCTION_HOURS × ENERGY_PRICE_KC_PER_KWH
 *
 * @example calculateAnnualLoss(100, '2008-2014') // 138600
 * @example calculateAnnualLoss(50,  '2020+')     // 18480
 */
export function calculateAnnualLoss(capacityKw: number, yearRange: ManufactureYearRange): number {
  const degradation = DEGRADATION_RATES[yearRange];
  if (!degradation) return 0;
  return Math.round(capacityKw * degradation.rate * ANNUAL_PRODUCTION_HOURS * ENERGY_PRICE_KC_PER_KWH);
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
export function getPricingTier(capacityKw: number): { price: number; label: string } | { price: null; label: string } {
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
  return amount.toLocaleString('cs-CZ');
}
