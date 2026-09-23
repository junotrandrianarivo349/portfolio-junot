<script setup lang="ts">
import { useI18n } from 'vue-i18n'
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
    <div class="mx-auto grid max-w-6xl gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
      <div>
        <h2
          id="skills-title"
          class="text-3xl font-bold tracking-tight sm:text-4xl"
        >
          {{ t('skills.title') }}
        </h2>
        <p class="mt-3 text-lg text-muted">
          {{ t('skills.intro') }}
        </p>
        <!-- Differentiators: plain text, no cards. -->
        <h3 class="mt-10 text-lg font-bold">
          {{ t('skills.highlightsTitle') }}
        </h3>
        <ul class="mt-4 space-y-5">
          <li
            v-for="h in highlights"
            :key="h.id"
            class="border-l-2 border-cyan-ink pl-4"
          >
            <p class="font-semibold">
              {{ t(`skills.highlights.${h.id}.title`) }}
            </p>
            <p class="mt-1 text-muted">
              {{ t(`skills.highlights.${h.id}.text`) }}
            </p>
          </li>
        </ul>
      </div>

      <dl class="grid gap-x-10 gap-y-6 self-start sm:grid-cols-2">
        <div
          v-for="cat in skillCategories"
          :key="cat.id"
        >
          <dt class="text-sm font-semibold text-muted">
            {{ t(`skills.categories.${cat.id}`) }}
          </dt>
          <dd class="mt-1">
            <ul class="skill-list flex flex-wrap gap-y-0.5">
              <li
                v-for="skill in cat.items"
                :key="skill.key ?? skill.name"
                :class="skill.highlight ? 'font-semibold' : ''"
              >
                {{ label(skill) }}
              </li>
            </ul>
          </dd>
        </div>
      </dl>
    </div>
  </section>
</template>

<style scoped>
/* Middle dot between items so neighbouring names never read as one. */
.skill-list li:not(:last-child)::after {
  content: '·';
  margin-inline: 0.5rem;
  color: var(--color-muted);
  font-weight: 400;
}
</style>
