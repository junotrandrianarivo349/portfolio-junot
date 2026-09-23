<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocaleToggle } from '@/composables/useLocale'

const { t } = useI18n()
const { locale, next, to, remember } = useLocaleToggle()
</script>

<template>
  <!-- Link to the other language's page (works without JS). Shows both languages; the active one is highlighted. -->
  <RouterLink
    :to="to"
    :hreflang="next"
    class="flex h-10 items-center gap-1 rounded-full border border-line px-3 text-sm font-semibold transition-colors hover:border-cyan-ink"
    :title="t('a11y.switchLang')"
    @click="remember"
  >
    <span :class="locale === 'en' ? 'text-cyan-ink' : 'text-muted'">EN</span>
    <span
      class="text-line"
      aria-hidden="true"
    >/</span>
    <span :class="locale === 'fr' ? 'text-cyan-ink' : 'text-muted'">FR</span>
    <span
      class="sr-only"
      :lang="locale === 'en' ? 'fr' : 'en'"
    >({{ t('a11y.switchLang') }})</span>
  </RouterLink>
</template>
