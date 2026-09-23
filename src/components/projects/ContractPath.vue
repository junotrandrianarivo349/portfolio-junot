<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconCheck from '~icons/lucide/check'
import { sprints } from '@/data/projects'

const { t } = useI18n()
const k = (key: string) => t(`projects.items.efameno.${key}`)
</script>

<template>
  <!-- The shift from subcontractor to direct client, then renewed sprints: the proof of trust. -->
  <div class="rounded-[var(--radius-panel)] border border-line p-5 sm:p-6">
    <h4 class="text-base font-bold">
      {{ k('pathTitle') }}
    </h4>
    <ol class="mt-4 space-y-5 border-l-2 border-line pl-5">
      <li class="relative text-sm">
        <span
          class="absolute top-1.5 -left-[1.6875rem] size-3 rounded-full bg-line"
          aria-hidden="true"
        />
        <span class="font-semibold">{{ k('phase1') }}</span>
        <span class="text-muted">, {{ k('phase1Date') }}</span>
        <span class="mt-1 block max-w-[70ch] text-muted">{{ k('phase1Done') }}</span>
      </li>
      <li class="relative text-sm">
        <span
          class="absolute top-1.5 -left-[1.6875rem] size-3 rounded-full bg-cyan-ink"
          aria-hidden="true"
        />
        <span class="font-semibold">{{ k('phase2') }}</span>
        <ol class="mt-3 grid gap-2 sm:grid-cols-3">
          <li
            v-for="(s, i) in sprints"
            :key="s.id"
            class="rounded-[var(--radius-panel)] border p-3"
            :class="s.state === 'next' ? 'border-dashed border-line' : 'border-line bg-surface'"
          >
            <span class="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold">
              <span
                class="grid size-5 shrink-0 place-items-center rounded-full"
                :class="{
                  'bg-cyan-ink text-bg': s.state === 'done',
                  'border-2 border-cyan-ink text-cyan-ink': s.state === 'current',
                  'border border-dashed border-muted text-muted': s.state === 'next',
                }"
                aria-hidden="true"
              >
                <IconCheck
                  v-if="s.state === 'done'"
                  class="size-3"
                />
                <template v-else>{{ i + 1 }}</template>
              </span>
              {{ k(`sprints.${s.id}.name`) }}
              <span :class="s.state === 'next' ? 'text-muted' : 'text-cyan-ink'">{{ k(`sprints.${s.id}.state`) }}</span>
            </span>
            <span class="mt-2 block text-sm leading-snug text-muted">{{ k(`sprints.${s.id}.text`) }}</span>
          </li>
        </ol>
      </li>
    </ol>
  </div>
</template>
