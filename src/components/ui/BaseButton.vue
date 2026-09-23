<script setup lang="ts">
/**
 * Link styled as a button. Rendered as a disabled <button> when `href` is empty,
 * so a missing URL never produces a broken link.
 */
withDefaults(
  defineProps<{
    href?: string
    variant?: 'primary' | 'ghost'
    external?: boolean
    download?: boolean
  }>(),
  { href: '', variant: 'primary', external: false, download: false },
)
</script>

<template>
  <a
    v-if="href"
    :href="href"
    :target="external ? '_blank' : undefined"
    :rel="external ? 'noopener noreferrer' : undefined"
    :download="download || undefined"
    class="btn"
    :class="`btn-${variant}`"
  ><slot /></a>
  <button
    v-else
    type="button"
    disabled
    class="btn cursor-not-allowed opacity-50"
    :class="`btn-${variant}`"
  >
    <slot />
  </button>
</template>

<style scoped>
@reference '../../assets/main.css';

.btn {
  @apply inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[0.95rem] font-semibold transition-colors;
}
.btn-primary {
  @apply bg-accent text-on-accent;
}
.btn-primary:not(:disabled):hover {
  @apply bg-cyan-300;
}
.btn-ghost {
  @apply border border-line text-fg;
}
.btn-ghost:not(:disabled):hover {
  @apply border-accent-ink text-accent-ink;
}
</style>
