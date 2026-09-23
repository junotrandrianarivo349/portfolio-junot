<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconMenu from '~icons/lucide/menu'
import IconX from '~icons/lucide/x'
import ThemeToggle from './ThemeToggle.vue'
import LangToggle from './LangToggle.vue'
import { sections } from '@/data/navigation'

const { t } = useI18n()
const open = ref(false)
const scrolled = ref(false)

function onScroll() {
  scrolled.value = window.scrollY > 8
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape') open.value = false
}
onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <header
    class="sticky top-0 z-40 border-b transition-colors duration-300"
    :class="scrolled || open ? 'border-line bg-bg/90 backdrop-blur-md' : 'border-transparent bg-bg'"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
      <a
        href="#top"
        class="font-display text-lg font-bold tracking-tight"
        :aria-label="t('a11y.home')"
      >
        <span aria-hidden="true">JR<span class="text-accent">.</span></span>
      </a>

      <nav
        :aria-label="t('a11y.primaryNav')"
        class="hidden md:block"
      >
        <ul class="flex items-center gap-1">
          <li
            v-for="id in sections"
            :key="id"
          >
            <a
              :href="`#${id}`"
              class="rounded-full px-3 py-2 text-sm text-muted transition-colors hover:text-fg"
            >{{ t(`nav.${id}`) }}</a>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-2">
        <LangToggle />
        <ThemeToggle />
        <button
          type="button"
          class="grid size-10 place-items-center rounded-full text-muted hover:bg-raised hover:text-fg md:hidden"
          :aria-expanded="open"
          aria-controls="mobile-nav"
          :aria-label="open ? t('a11y.closeMenu') : t('a11y.openMenu')"
          @click="open = !open"
        >
          <IconX
            v-if="open"
            class="size-5"
            aria-hidden="true"
          />
          <IconMenu
            v-else
            class="size-5"
            aria-hidden="true"
          />
        </button>
      </div>
    </div>

    <nav
      v-show="open"
      id="mobile-nav"
      :aria-label="t('a11y.primaryNav')"
      class="border-t border-line px-4 pb-4 md:hidden"
    >
      <ul class="flex flex-col">
        <li
          v-for="id in sections"
          :key="id"
        >
          <a
            :href="`#${id}`"
            class="block border-b border-line/60 py-3 text-base"
            @click="open = false"
          >{{ t(`nav.${id}`) }}</a>
        </li>
      </ul>
    </nav>
  </header>
</template>
