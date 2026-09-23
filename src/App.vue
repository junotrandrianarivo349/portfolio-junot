<script setup lang="ts">
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
import { useLocaleHead } from '@/composables/useLocale'
import { syncThemeFromDocument } from '@/composables/useTheme'

const { t } = useI18n()
useLocaleHead()
onMounted(syncThemeFromDocument)
</script>

<template>
  <a
    href="#main"
    class="sr-only z-50 rounded-md bg-cyan px-4 py-2 font-semibold text-on-cyan focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
  >{{ t('a11y.skip') }}</a>
  <div id="top">
    <AppHeader />
    <main
      id="main"
      tabindex="-1"
      class="outline-none"
    >
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
