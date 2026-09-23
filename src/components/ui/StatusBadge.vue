<script setup lang="ts">
import IconTrusted from '~icons/lucide/badge-check'
import IconProgress from '~icons/lucide/rocket'
import IconLock from '~icons/lucide/lock'
import type { ProjectStatus } from '@/data/projects'

defineProps<{ status: ProjectStatus; label: string }>()

const icons = { trusted: IconTrusted, progress: IconProgress, confidential: IconLock }
const styles: Record<ProjectStatus, string> = {
  trusted: 'bg-accent text-on-accent',
  progress: 'border border-accent/50 text-accent-ink',
  confidential: 'border border-line text-muted',
}
</script>

<template>
  <p
    class="inline-flex items-start gap-1.5 rounded-xl px-3 py-1.5 text-sm leading-snug font-medium"
    :class="styles[status]"
  >
    <component
      :is="icons[status]"
      class="mt-0.5 size-4 shrink-0"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
  </p>
</template>
