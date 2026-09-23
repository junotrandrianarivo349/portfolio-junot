<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import { education, jobs } from '@/data/experience'

const { t } = useI18n()
</script>

<template>
  <section
    id="experience"
    aria-labelledby="experience-title"
    class="border-y border-line bg-surface"
  >
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionTitle
        id="experience-title"
        :title="t('experience.title')"
      />
      <div
        v-reveal
        class="grid gap-14 lg:grid-cols-[1.5fr_1fr] lg:gap-16"
      >
        <div>
          <h3 class="mb-6 text-xl font-bold">
            {{ t('experience.workTitle') }}
          </h3>
          <ol class="relative border-l-2 border-line">
            <li
              v-for="job in jobs"
              :key="job.id"
              class="relative pb-10 pl-8 last:pb-0"
            >
              <span
                class="absolute top-1.5 -left-[9px] size-4 rounded-full border-2 border-accent bg-surface"
                aria-hidden="true"
              />
              <p class="text-sm font-semibold text-accent-ink">
                {{ job.start }} – {{ job.end ?? t('experience.present') }}
              </p>
              <h4 class="mt-1 font-display text-xl font-bold">
                {{ t(`experience.items.${job.id}.role`) }}
              </h4>
              <p class="text-muted">
                {{ t(`experience.items.${job.id}.org`) }}
              </p>
              <p class="mt-3 max-w-[65ch]">
                {{ t(`experience.items.${job.id}.text`) }}
              </p>
            </li>
          </ol>
        </div>

        <div>
          <h3 class="mb-6 text-xl font-bold">
            {{ t('experience.educationTitle') }}
          </h3>
          <ol class="relative border-l-2 border-line">
            <li
              v-for="item in education"
              :key="item.id"
              class="relative pb-8 pl-8 last:pb-0"
            >
              <span
                class="absolute top-1.5 -left-[7px] size-3 rounded-full bg-line"
                aria-hidden="true"
              />
              <p class="text-sm font-semibold text-muted">
                {{ item.period }}
              </p>
              <h4 class="mt-1 font-semibold">
                {{ t(`experience.education.${item.id}.degree`) }}
              </h4>
              <p
                v-if="item.hasSchool"
                class="text-sm text-muted"
              >
                {{ t(`experience.education.${item.id}.school`) }}
              </p>
            </li>
          </ol>
        </div>
      </div>
    </div>
  </section>
</template>
