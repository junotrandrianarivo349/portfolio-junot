<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import TechBadge from '@/components/ui/TechBadge.vue'
import { highlights, skillCategories, type Skill } from '@/data/skills'

const { t } = useI18n()
const label = (skill: Skill) => (skill.key ? t(`skills.items.${skill.key}`) : skill.name)
</script>

<template>
  <section
    id="skills"
    aria-labelledby="skills-title"
    class="border-y border-line bg-surface"
  >
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
      <SectionTitle
        id="skills-title"
        :title="t('skills.title')"
        :intro="t('skills.intro')"
      />

      <!-- Differentiators first, then the full inventory. -->
      <div
        class="mb-14"
      >
        <h3 class="mb-5 text-xl font-bold">
          {{ t('skills.highlightsTitle') }}
        </h3>
        <ul class="grid gap-4 md:grid-cols-3">
          <li
            v-for="h in highlights"
            :key="h.id"
            class="rounded-2xl border-l-4 border-accent bg-bg p-6"
          >
            <component
              :is="h.icon"
              class="size-7 text-accent-ink"
              aria-hidden="true"
            />
            <p class="mt-4 font-display text-lg font-bold">
              {{ t(`skills.highlights.${h.id}.title`) }}
            </p>
            <p class="mt-2 text-muted">
              {{ t(`skills.highlights.${h.id}.text`) }}
            </p>
          </li>
        </ul>
      </div>

      <div
        class="grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-4"
      >
        <div
          v-for="cat in skillCategories"
          :key="cat.id"
        >
          <h3 class="mb-3 text-base font-bold">
            {{ t(`skills.categories.${cat.id}`) }}
          </h3>
          <ul class="flex flex-wrap gap-2">
            <li
              v-for="skill in cat.items"
              :key="skill.key ?? skill.name"
            >
              <TechBadge
                :label="label(skill)"
                :icon="skill.icon"
                :highlight="skill.highlight"
              />
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>
