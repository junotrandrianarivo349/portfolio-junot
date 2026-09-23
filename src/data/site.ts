import type { AppLocale } from '@/i18n'

/** Production origin, used for canonical, hreflang and Open Graph URLs. */
export const SITE_URL = 'https://portfolio-junot.vercel.app'

/** One prerendered page per language. */
export const LOCALE_PATHS: Record<AppLocale, string> = { en: '/', fr: '/fr/' }
export const OG_LOCALES: Record<AppLocale, string> = { en: 'en_US', fr: 'fr_FR' }
