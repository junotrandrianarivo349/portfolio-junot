import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useHead } from '@unhead/vue'
import type { AppLocale } from '@/i18n'
import { LOCALE_PATHS, OG_LOCALES, SITE_URL } from '@/data/site'
// Fonts used above the fold, preloaded so text is not repainted late when they arrive (LCP).
import plexRegular from '@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff2?url'
import bricolage from '@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2?url'

const fontPreloads = [plexRegular, bricolage].map(
  (href) => ({ rel: 'preload', as: 'font', type: 'font/woff2', href, crossorigin: 'anonymous' }) as const,
)

/**
 * Per-language <head>: lang, title, description, canonical, hreflang alternates and Open Graph.
 * Rendered into the static HTML at build time, so crawlers and link previews see the right language.
 * Call it once, in App.vue.
 */
export function useLocaleHead() {
  const { locale, t } = useI18n()
  useHead(
    computed(() => {
      const lang = locale.value as AppLocale
      const url = SITE_URL + LOCALE_PATHS[lang]
      return {
        htmlAttrs: { lang },
        title: t('meta.title'),
        meta: [
          { name: 'description', content: t('meta.description') },
          { property: 'og:title', content: t('meta.title') },
          { property: 'og:description', content: t('meta.description') },
          { property: 'og:url', content: url },
          { property: 'og:locale', content: OG_LOCALES[lang] },
          { property: 'og:locale:alternate', content: OG_LOCALES[lang === 'en' ? 'fr' : 'en'] },
        ],
        link: [
          ...fontPreloads,
          { rel: 'canonical', href: url },
          { rel: 'alternate', hreflang: 'en', href: SITE_URL + LOCALE_PATHS.en },
          { rel: 'alternate', hreflang: 'fr', href: SITE_URL + LOCALE_PATHS.fr },
          { rel: 'alternate', hreflang: 'x-default', href: SITE_URL + LOCALE_PATHS.en },
        ],
      }
    }),
  )
}

/**
 * Language switch target: the other language's page, keeping the current #section.
 * Rendered as a real link, so it also works without JavaScript; the choice is remembered on click.
 */
export function useLocaleToggle() {
  const { locale } = useI18n()
  const route = useRoute()
  const next = computed<AppLocale>(() => (locale.value === 'en' ? 'fr' : 'en'))
  const to = computed(() => ({ path: LOCALE_PATHS[next.value], hash: route.hash }))
  function remember() {
    try {
      localStorage.setItem('locale', next.value)
    } catch {
      /* storage unavailable: the URL still carries the language */
    }
  }
  return { locale, next, to, remember }
}
