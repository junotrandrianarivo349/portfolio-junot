<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import IconSun from '~icons/lucide/sun'
import IconMoon from '~icons/lucide/moon'
import { useTheme } from '@/composables/useTheme'

const { t } = useI18n()
const { theme, toggle } = useTheme()
// The label describes the action, not the current state.
const label = computed(() => (theme.value === 'dark' ? t('a11y.toLight') : t('a11y.toDark')))
</script>

<template>
  <button
    type="button"
    class="grid size-10 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-fg"
    :aria-label="label"
    :title="label"
    @click="toggle"
  >
    <IconSun
      v-if="theme === 'dark'"
      class="size-5"
      aria-hidden="true"
    />
    <IconMoon
      v-else
      class="size-5"
      aria-hidden="true"
    />
  </button>
</template>
