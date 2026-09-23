import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import fr from './locales/fr.json'

export type MessageSchema = typeof en
export type AppLocale = 'en' | 'fr'
export const LOCALES: AppLocale[] = ['en', 'fr']

function initialLocale(): AppLocale {
  try {
    const saved = localStorage.getItem('locale')
    if (saved === 'en' || saved === 'fr') return saved
  } catch {
    /* storage unavailable (private mode): fall back to default */
  }
  return 'en' // English by default: the site targets remote clients and recruiters.
}

// `legacy: false` enables the Composition API (`useI18n()`), the modern way in Vue 3.
// Typing with MessageSchema makes `fr.json` fail the type-check if a key is missing.
export const i18n = createI18n<[MessageSchema], AppLocale>({
  legacy: false,
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages: { en, fr },
})
