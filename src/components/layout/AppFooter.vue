<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { contact } from '@/data/contact'

const { t } = useI18n()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="border-t border-line">
    <div class="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <p>{{ t('footer.rights', { year }) }}</p>
      <p>
        {{ t('footer.built') }}
        <a
          v-if="contact.repo"
          :href="contact.repo"
          target="_blank"
          rel="noopener noreferrer"
          class="underline decoration-line underline-offset-4 hover:text-fg"
        >{{ t('footer.source') }}<span class="sr-only"> ({{ t('a11y.newTab') }})</span></a>
      </p>
    </div>
  </footer>
</template>
