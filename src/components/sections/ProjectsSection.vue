<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionTitle from '@/components/ui/SectionTitle.vue'
import ContractPath from '@/components/projects/ContractPath.vue'
import { caseStudies } from '@/data/projects'

const { t } = useI18n()
const tech = (name: string) => (name === 'restApi' ? t('skills.items.restApi') : name)
const fields = ['problem', 'built', 'role', 'status'] as const
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

    <div class="divide-y divide-line">
      <article
        v-for="(cs, i) in caseStudies"
        :key="cs.id"
        :aria-labelledby="`case-${cs.id}`"
        class="grid gap-8 py-14 first:pt-0 last:pb-0 lg:grid-cols-12 lg:items-start lg:gap-14 lg:py-20"
      >
        <!-- Image and text alternate sides on large screens; image always first on small ones. -->
        <figure
          class="mx-auto w-full max-w-2xl lg:sticky lg:top-24 lg:col-span-7 lg:max-w-none"
          :class="i % 2 === 1 ? 'lg:order-last' : ''"
        >
          <img
            :src="cs.image"
            :alt="t(`projects.items.${cs.id}.alt`)"
            width="1200"
            height="680"
            loading="lazy"
            decoding="async"
            class="aspect-[1200/680] w-full rounded-[var(--radius-panel)] border border-line"
          >
          <figcaption class="mt-2 text-xs text-muted">
            {{ cs.confidential ? t('projects.captionConfidential') : t('projects.caption') }}
          </figcaption>
        </figure>

        <div class="max-w-[62ch] lg:col-span-5">
          <h3
            :id="`case-${cs.id}`"
            class="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            {{ cs.name }}
          </h3>
          <p class="mt-1 text-muted">
            {{ t(`projects.items.${cs.id}.client`) }}
          </p>

          <dl class="mt-6 space-y-4">
            <div
              v-for="f in fields"
              :key="f"
            >
              <dt class="text-sm font-semibold text-muted">
                {{ t(`projects.labels.${f}`) }}
              </dt>
              <dd
                class="mt-0.5"
                :class="f === 'status' ? 'font-semibold' : ''"
              >
                {{ t(`projects.items.${cs.id}.${f}`) }}
              </dd>
            </div>
            <div>
              <dt class="sr-only">
                {{ t('projects.labels.stack') }}
              </dt>
              <dd>
                <ul class="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
                  <li
                    v-for="s in cs.stack"
                    :key="s"
                    class="font-medium"
                  >
                    {{ tech(s) }}
                  </li>
                </ul>
              </dd>
            </div>
          </dl>

          <ContractPath v-if="cs.id === 'efameno'" />
        </div>
      </article>
    </div>
  </section>
</template>
