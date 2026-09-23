<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconCheck from '~icons/lucide/check'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import TechBadge from '@/components/ui/TechBadge.vue'
import { leadProject, projects, sprints } from '@/data/projects'

const { t } = useI18n()
const tech = (name: string) => (name === 'restApi' ? t('skills.items.restApi') : name)
const p = (key: string) => t(`projects.items.${key}`)
</script>

<template>
  <section
    id="projects"
    aria-labelledby="projects-title"
    class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <SectionTitle
      id="projects-title"
      :title="t('projects.title')"
      :intro="t('projects.intro')"
    />

    <!-- Lead project: the renewed contract is the strongest proof of client trust. -->
    <article
      :aria-labelledby="`project-${leadProject.id}`"
      class="grid gap-8 rounded-3xl border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-12"
    >
      <div>
        <h3
          :id="`project-${leadProject.id}`"
          class="text-3xl font-extrabold tracking-tight"
        >
          {{ leadProject.name }}
        </h3>
        <p class="mt-1 text-muted">
          {{ p(`${leadProject.id}.client`) }}
        </p>
        <StatusBadge
          class="mt-5"
          :status="leadProject.status"
          :label="p(`${leadProject.id}.status`)"
        />
        <dl class="mt-7 space-y-5">
          <div>
            <dt class="text-sm font-semibold text-accent-ink">
              {{ t('projects.problem') }}
            </dt>
            <dd class="mt-1">
              {{ p(`${leadProject.id}.problem`) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-semibold text-accent-ink">
              {{ t('projects.role') }}
            </dt>
            <dd class="mt-1">
              {{ p(`${leadProject.id}.role`) }}
            </dd>
          </div>
          <div>
            <dt class="text-sm font-semibold text-accent-ink">
              {{ t('projects.stack') }}
            </dt>
            <dd class="mt-2">
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="s in leadProject.stack"
                  :key="s"
                >
                  <TechBadge :label="tech(s)" />
                </li>
              </ul>
            </dd>
          </div>
        </dl>
      </div>

      <div class="rounded-2xl bg-bg p-6">
        <p class="font-display text-lg leading-snug font-semibold">
          {{ t('projects.items.efameno.trust') }}
        </p>
        <h4 class="mt-7 text-sm font-semibold text-muted">
          {{ t('projects.items.efameno.sprintsLabel') }}
        </h4>
        <!-- Real sequence, so an ordered list with step markers. -->
        <ol class="mt-4">
          <li
            v-for="(s, i) in sprints"
            :key="s.id"
            class="relative flex gap-4 pb-6 last:pb-0"
          >
            <span
              v-if="i < sprints.length - 1"
              class="absolute top-8 bottom-0 left-[0.9375rem] w-0.5"
              :class="s.state === 'done' ? 'bg-accent' : 'bg-line'"
              aria-hidden="true"
            />
            <span
              class="relative grid size-8 shrink-0 place-items-center rounded-full text-sm font-bold"
              :class="{
                'bg-accent text-on-accent': s.state === 'done',
                'border-2 border-accent bg-bg text-accent-ink': s.state === 'current',
                'border-2 border-dashed border-muted bg-bg text-muted': s.state === 'next',
              }"
              aria-hidden="true"
            >
              <IconCheck
                v-if="s.state === 'done'"
                class="size-4"
              />
              <template v-else>{{ i + 1 }}</template>
            </span>
            <div class="pt-0.5">
              <p class="font-semibold">
                {{ t(`projects.items.efameno.sprints.${s.id}.name`) }}
                <span
                  class="ml-1 rounded-md px-1.5 py-0.5 text-xs font-semibold"
                  :class="s.state === 'next' ? 'bg-raised text-fg' : 'bg-accent/15 text-accent-ink'"
                >{{ t(`projects.items.efameno.sprints.${s.id}.state`) }}</span>
              </p>
              <p class="mt-1 text-sm text-muted">
                {{ t(`projects.items.efameno.sprints.${s.id}.text`) }}
              </p>
            </div>
          </li>
        </ol>
      </div>
    </article>

    <div
      class="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <article
        v-for="project in projects"
        :key="project.id"
        :aria-labelledby="`project-${project.id}`"
        class="flex flex-col overflow-hidden rounded-3xl border border-line bg-surface"
      >
        <img
          v-if="project.image"
          :src="project.image"
          alt=""
          width="480"
          height="220"
          loading="lazy"
          class="aspect-[480/220] w-full object-cover"
        >
        <div class="flex flex-1 flex-col p-6">
          <h3
            :id="`project-${project.id}`"
            class="text-2xl font-extrabold tracking-tight"
          >
            {{ project.name }}
          </h3>
          <p class="mt-1 text-sm text-muted">
            {{ p(`${project.id}.client`) }}
          </p>
          <StatusBadge
            class="mt-4 self-start"
            :status="project.status"
            :label="p(`${project.id}.status`)"
          />
          <dl class="mt-5 flex-1 space-y-4 text-[0.95rem]">
            <div>
              <dt class="text-sm font-semibold text-accent-ink">
                {{ t('projects.problem') }}
              </dt>
              <dd class="mt-1">
                {{ p(`${project.id}.problem`) }}
              </dd>
            </div>
            <div>
              <dt class="text-sm font-semibold text-accent-ink">
                {{ t('projects.role') }}
              </dt>
              <dd class="mt-1">
                {{ p(`${project.id}.role`) }}
              </dd>
            </div>
          </dl>
          <p class="sr-only">
            {{ t('projects.stack') }}
          </p>
          <ul class="mt-6 flex flex-wrap gap-2">
            <li
              v-for="s in project.stack"
              :key="s"
            >
              <TechBadge :label="tech(s)" />
            </li>
          </ul>
        </div>
      </article>
    </div>
  </section>
</template>
