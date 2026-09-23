import { watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AppLocale } from '@/i18n'

/**
 * Keeps the document in sync with the active language:
 * <html lang> (screen readers, SEO), <title> and meta description.
 * Call it once, in App.vue.
 */
export function useLocaleSync() {
  const { locale, t } = useI18n()
  watch(
    locale,
    (value) => {
      document.documentElement.lang = value
      document.title = t('meta.title')
      document.querySelector('meta[name="description"]')?.setAttribute('content', t('meta.description'))
      try {
        localStorage.setItem('locale', value)
      } catch {
        /* storage unavailable */
      }
    },
    { immediate: true },
  )
}

export function useLocaleToggle() {
  const { locale } = useI18n()
  function toggle() {
    locale.value = (locale.value === 'en' ? 'fr' : 'en') satisfies AppLocale
  }
  return { locale, toggle }
}
