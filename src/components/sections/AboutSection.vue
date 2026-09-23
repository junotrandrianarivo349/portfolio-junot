<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section
    id="about"
    aria-labelledby="about-title"
    class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div class="grid gap-10 md:grid-cols-[14rem_minmax(0,1fr)] md:gap-14 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <picture>
        <source
          srcset="/images/photo.webp"
          type="image/webp"
        >
        <img
          src="/images/photo.jpg"
          :alt="t('hero.photoAlt')"
          width="560"
          height="700"
          loading="lazy"
          decoding="async"
          class="aspect-[4/5] w-40 rounded-[var(--radius-panel)] object-cover sm:w-48 md:w-full"
        >
      </picture>
      <div class="max-w-[65ch]">
        <h2
          id="about-title"
          class="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {{ t('about.title') }}
        </h2>
        <div class="mt-6 space-y-5 text-lg">
          <p>{{ t('about.p1') }}</p>
          <p>{{ t('about.p2') }}</p>
          <p>{{ t('about.p3') }}</p>
        </div>
      </div>
    </div>
  </section>
</template>
