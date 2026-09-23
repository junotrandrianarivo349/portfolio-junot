<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{ label: string; icon?: Component; highlight?: boolean }>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-sm"
    :class="highlight ? 'border-accent/50 bg-accent/10 font-medium text-fg' : 'border-line bg-bg text-fg/90'"
  >
    <component
      :is="icon"
      v-if="icon"
      class="size-3.5 shrink-0"
      :class="highlight ? 'text-accent-ink' : 'text-muted'"
      aria-hidden="true"
    />
    {{ label }}
  </span>
</template>
