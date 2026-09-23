<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseButton from '@/components/ui/BaseButton.vue'
import SocialLinks from '@/components/ui/SocialLinks.vue'

const { t } = useI18n()
const steps = ['code', 'build', 'deploy', 'live'] as const
// If the photo fails to load, the "JR" monogram is shown instead.
const photoFailed = ref(false)
</script>

<template>
  <section
    aria-labelledby="hero-title"
    class="relative overflow-hidden"
  >
    <div class="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto] md:gap-12 lg:gap-16 md:pt-20 md:pb-24">
      <div class="order-2 md:order-1">
        <h1
          id="hero-title"
          class="text-[clamp(2.6rem,10.5vw,5.75rem)] leading-[0.95] md:text-[clamp(3rem,6.8vw,5.75rem)] font-extrabold tracking-tight"
        >
          {{ t('hero.name') }}
        </h1>
        <p class="mt-5 font-display text-lg font-semibold text-accent-ink sm:text-xl">
          {{ t('hero.title') }}
        </p>
        <p class="mt-4 max-w-xl text-lg text-muted">
          {{ t('hero.tagline') }}
        </p>

        <div class="mt-8 flex flex-wrap items-center gap-3">
          <BaseButton href="#featured">
            {{ t('hero.ctaProjects') }}
          </BaseButton>
          <BaseButton
            href="#contact"
            variant="ghost"
          >
            {{ t('hero.ctaContact') }}
          </BaseButton>
          <SocialLinks class="ml-1" />
        </div>

        <!-- The one orchestrated animation of the page: the delivery pipeline draws itself on load. -->
        <ol
          class="pipeline mt-12 flex max-w-lg items-center"
          :aria-label="t('hero.pipelineLabel')"
        >
          <li
            v-for="(step, i) in steps"
            :key="step"
            class="flex items-center"
            :class="i < steps.length - 1 ? 'flex-1' : ''"
            :style="{ '--i': i }"
          >
            <span class="flex flex-col items-center gap-2">
              <span
                class="dot size-3 rounded-full"
                :class="step === 'live' ? 'bg-accent ring-4 ring-accent/25' : 'border-2 border-accent bg-bg'"
              />
              <span
                class="text-xs font-medium sm:text-sm"
                :class="step === 'live' ? 'text-accent-ink' : 'text-muted'"
              >{{ t(`hero.pipeline.${step}`) }}</span>
            </span>
            <span
              v-if="i < steps.length - 1"
              class="line mx-2 mb-6 h-0.5 flex-1 origin-left bg-accent/60"
              aria-hidden="true"
            />
          </li>
        </ol>
      </div>

      <div class="order-1 justify-self-start md:order-2 md:justify-self-end">
        <div class="relative w-36 sm:w-48 md:w-56 lg:w-80">
          <!-- Offset frame in the accent color. -->
          <div
            class="absolute inset-0 translate-x-3 translate-y-3 rounded-[2rem] border-2 border-accent md:translate-x-5 md:translate-y-5"
            aria-hidden="true"
          />
          <picture v-if="!photoFailed">
            <source
              srcset="/images/photo.webp"
              type="image/webp"
            >
            <img
              src="/images/photo.jpg"
              :alt="t('hero.photoAlt')"
              width="560"
              height="700"
              fetchpriority="high"
              class="relative aspect-[4/5] w-full rounded-[2rem] object-cover"
              @error="photoFailed = true"
            >
          </picture>
          <div
            v-else
            class="relative grid aspect-[4/5] w-full place-items-center rounded-[2rem] bg-raised font-display text-6xl font-extrabold text-accent-ink"
            role="img"
            :aria-label="t('hero.name')"
          >
            JR
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pipeline .dot {
  animation: pop 0.35s ease-out both;
  animation-delay: calc(var(--i) * 0.45s + 0.2s);
}
.pipeline .line {
  animation: draw 0.4s ease-in-out both;
  animation-delay: calc(var(--i) * 0.45s + 0.45s);
}
</style>
