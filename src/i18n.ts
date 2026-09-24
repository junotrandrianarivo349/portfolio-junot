import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

export type MessageSchema = typeof en
export type AppLocale = 'en' | 'fr'
export const LOCALES: AppLocale[] = ['en', 'fr']

/**
 * One i18n instance per app: during prerendering, `/` and `/fr/` are rendered
 * as separate apps, so a shared instance would leak the locale between them.
 * `legacy: false` enables the Composition API (`useI18n()`).
 * Typing with MessageSchema makes `fr.json` fail the type-check if a key is missing.
 */
export function createAppI18n(locale: AppLocale) {
  return createI18n<[MessageSchema], AppLocale, false>({
    legacy: false,
    locale,
    fallbackLocale: 'en',
    messages: { en, fr },
  })
}
