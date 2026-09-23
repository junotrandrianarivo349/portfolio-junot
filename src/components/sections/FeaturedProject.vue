<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconExternal from '~icons/lucide/external-link'
import IconGithub from '~icons/simple-icons/github'
import BaseButton from '@/components/ui/BaseButton.vue'
import { featured } from '@/data/featured'

const { t } = useI18n()
const isAvailable = Boolean(featured.demoUrl || featured.codeUrl)
</script>

<template>
  <section
    id="featured"
    aria-labelledby="featured-title"
    class="mx-auto max-w-6xl px-4 sm:px-6"
  >
    <div
      v-reveal
      class="grid overflow-hidden rounded-3xl border border-accent/40 bg-surface md:grid-cols-[1.1fr_1fr]"
    >
      <div class="flex flex-col p-6 sm:p-10">
        <div class="flex flex-wrap items-center gap-3">
          <h2
            id="featured-title"
            class="text-sm font-semibold text-accent-ink"
          >
            {{ t('featured.title') }}
          </h2>
          <span
            v-if="!isAvailable"
            class="rounded-full bg-raised px-3 py-1 text-xs font-semibold text-fg"
          >{{ t('featured.status') }}</span>
        </div>
        <p class="mt-4 font-display text-2xl leading-tight font-bold tracking-tight sm:text-3xl">
          {{ t('featured.heading') }}
        </p>
        <p class="mt-4 text-muted">
          {{ t('featured.text') }}
        </p>
        <div class="mt-8 flex flex-wrap gap-3">
          <BaseButton
            :href="featured.demoUrl"
            external
          >
            <IconExternal
              class="size-4"
              aria-hidden="true"
            />
            {{ t('featured.demo') }}
          </BaseButton>
          <BaseButton
            :href="featured.codeUrl"
            variant="ghost"
            external
          >
            <IconGithub
              class="size-4"
              aria-hidden="true"
            />
            {{ t('featured.code') }}
          </BaseButton>
        </div>
        <p
          v-if="!isAvailable"
          class="mt-3 text-sm text-muted"
        >
          {{ t('featured.unavailable') }}
        </p>
      </div>
      <img
        :src="featured.image"
        alt=""
        width="640"
        height="480"
        loading="lazy"
        class="h-full min-h-56 w-full object-cover"
      >
    </div>
  </section>
</template>
