<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconMail from '~icons/lucide/mail'
import BaseButton from '@/components/ui/BaseButton.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'
import SyncDemo from '@/components/hero/SyncDemo.vue'
import { contact } from '@/data/contact'

const { t } = useI18n()
const facts = ['location', 'remote', 'language'] as const
</script>

<template>
  <section
    aria-labelledby="hero-title"
    class="relative isolate overflow-hidden"
  >
    <!-- Topographic lines, drawn with the theme's text colour through a mask so they work in both themes. -->
    <div
      class="topo pointer-events-none absolute inset-0 -z-10"
      aria-hidden="true"
    />

    <div class="mx-auto grid max-w-6xl items-start gap-14 px-4 pt-12 pb-20 sm:px-6 md:pt-20 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-20 lg:pb-28">
      <div class="max-w-[40rem] lg:pt-8">
        <h1
          id="hero-title"
          class="text-[clamp(2.6rem,7vw,4.75rem)] leading-[1.02] font-extrabold tracking-tight"
        >
          {{ t('hero.name') }}
        </h1>
        <p class="mt-5 font-display text-xl leading-snug font-semibold text-cyan-ink sm:text-2xl">
          <span class="block">{{ t('hero.role') }}</span>
          <span class="block text-fg">{{ t('hero.stack') }}</span>
        </p>
        <p class="mt-5 max-w-[34rem] text-lg text-muted sm:text-xl">
          {{ t('hero.tagline') }}
        </p>

        <div class="mt-9 flex flex-wrap items-center gap-3">
          <BaseButton href="#projects">
            {{ t('hero.ctaProjects') }}
          </BaseButton>
          <BaseButton
            :href="`mailto:${contact.email}`"
            variant="ghost"
          >
            <IconMail
              class="size-4"
              aria-hidden="true"
            />
            {{ t('hero.ctaContact') }}
          </BaseButton>
          <SocialLinks />
        </div>

        <div class="mt-12 flex items-center gap-4">
          <picture>
            <source
              srcset="/images/avatar.webp"
              type="image/webp"
            >
            <img
              src="/images/avatar.jpg"
              :alt="t('hero.photoAlt')"
              width="128"
              height="128"
              fetchpriority="high"
              class="size-16 shrink-0 rounded-full border-2 border-line object-cover"
            >
          </picture>
          <ul class="flex flex-col text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-5">
            <li
              v-for="fact in facts"
              :key="fact"
            >
              {{ t(`hero.facts.${fact}`) }}
            </li>
          </ul>
        </div>
      </div>

      <SyncDemo />
    </div>
  </section>
</template>

<style scoped>
.topo {
  /* hero-topo.svg strokes are at 14 % alpha: opacity 1 → 0.14 in dark, 0.5 → 0.07 in light. */
  background-color: var(--color-fg);
  opacity: 0.5;
  /* Fade out under the text column so lines never cross the headline. */
  mask-image: url('/images/hero-topo.svg'), linear-gradient(to right, transparent 30%, #000 70%);
  mask-composite: intersect;
  mask-size: cover, 100% 100%;
  mask-position: right top, 0 0;
  mask-repeat: no-repeat;
}
:global(.dark) .topo {
  opacity: 1;
}
</style>
