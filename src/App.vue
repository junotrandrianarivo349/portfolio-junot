<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useLocaleSync } from '@/composables/useLocale'

const { t } = useI18n()
useLocaleSync()
</script>

<template>
  <a
    href="#main"
    class="sr-only z-50 rounded-md bg-accent px-4 py-2 font-semibold text-on-accent focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
  >{{ t('a11y.skip') }}</a>
  <div id="top">
    <AppHeader />
    <main
      id="main"
      tabindex="-1"
      class="outline-none"
    />
    <AppFooter />
  </div>
</template>
