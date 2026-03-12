import type { Language } from '../types';

export type { Language };

/**
 * Extract bilingual value from an object with _cs/_en suffix keys.
 * Falls back to Czech if English value is missing or empty.
 *
 * @example
 *   t(hero, 'headline', 'cs')  // returns hero.headline_cs
 *   t(hero, 'headline', 'en')  // returns hero.headline_en, falls back to hero.headline_cs
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function t(obj: any, key: string, lang: Language): string {
  const value = obj[`${key}_${lang}`];
  if (typeof value === 'string' && value.length > 0) return value;
  // Fallback to Czech
  const fallback = obj[`${key}_cs`];
  return typeof fallback === 'string' ? fallback : '';
}

/**
 * Get localized href — appends ?lang=en for English, clean URL for Czech.
 *
 * @example
 *   getLocalizedHref('/kontakt', 'cs')           // '/kontakt'
 *   getLocalizedHref('/kontakt', 'en')           // '/kontakt?lang=en'
 *   getLocalizedHref('/blog?page=2', 'en')       // '/blog?page=2&lang=en'
 */
export function getLocalizedHref(path: string, lang: Language): string {
  if (lang === 'en') {
    const separator = path.includes('?') ? '&' : '?';
    return `${path}${separator}lang=en`;
  }
  return path;
}
