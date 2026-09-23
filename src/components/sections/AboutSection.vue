<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconMapPin from '~icons/lucide/map-pin'
import IconGlobe from '~icons/lucide/globe'
import IconLanguages from '~icons/lucide/languages'
import SectionTitle from '@/components/ui/SectionTitle.vue'

const { t } = useI18n()
const facts = [
  { key: 'location', icon: IconMapPin },
  { key: 'remote', icon: IconGlobe },
  { key: 'language', icon: IconLanguages },
] as const
</script>

<template>
  <section
    id="about"
    aria-labelledby="about-title"
    class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div v-reveal>
      <SectionTitle
        id="about-title"
        :title="t('about.title')"
      />
      <div class="grid gap-10 md:grid-cols-[1.6fr_1fr] md:gap-16">
        <div class="max-w-[65ch] space-y-5 text-lg">
          <p>{{ t('about.p1') }}</p>
          <p>{{ t('about.p2') }}</p>
          <p>{{ t('about.p3') }}</p>
        </div>
        <ul class="h-fit space-y-4 rounded-2xl border border-line p-6">
          <li
            v-for="fact in facts"
            :key="fact.key"
            class="flex items-start gap-3"
          >
            <component
              :is="fact.icon"
              class="mt-0.5 size-5 shrink-0 text-accent-ink"
              aria-hidden="true"
            />
            <span>{{ t(`about.facts.${fact.key}`) }}</span>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>
