<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useLocaleToggle } from '@/composables/useLocale'

const { t } = useI18n()
const { locale, toggle } = useLocaleToggle()
</script>

<template>
  <!-- Shows both languages; the active one is highlighted. -->
  <button
    type="button"
    class="flex h-10 items-center gap-1 rounded-full border border-line px-3 text-sm font-semibold transition-colors hover:border-accent-ink"
    :aria-label="t('a11y.switchLang')"
    :title="t('a11y.switchLang')"
    @click="toggle"
  >
    <span :class="locale === 'en' ? 'text-accent-ink' : 'text-muted'">EN</span>
    <span
      class="text-line"
      aria-hidden="true"
    >/</span>
    <span :class="locale === 'fr' ? 'text-accent-ink' : 'text-muted'">FR</span>
  </button>
</template>
