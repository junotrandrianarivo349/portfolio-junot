<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconCheck from '~icons/lucide/check'
import IconCloudOff from '~icons/lucide/cloud-off'
import IconRefresh from '~icons/lucide/refresh-cw'
import IconWifi from '~icons/lucide/wifi'
import IconWifiOff from '~icons/lucide/wifi-off'
import { useSyncDemo } from '@/composables/useSyncDemo'

const { t } = useI18n()

// Read once on the client; during prerendering there is no window.
const reduced = ref(false)
onMounted(() => {
  reduced.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
})

const { online, queue, synced, inFlight, status, nextMember, queueFull, save, setOnline } = useSyncDemo({
  reducedMotion: () => reduced.value,
})

const statusText = computed(() =>
  status.value === 'pending' ? t('hero.demo.status.pending', { n: queue.value.length }, queue.value.length) : t(`hero.demo.status.${status.value}`),
)
const pendingShown = computed(() => (inFlight.value ? [inFlight.value, ...queue.value] : queue.value))
</script>

<template>
  <figure
    class="mx-auto w-full max-w-[21rem]"
    aria-labelledby="demo-title"
  >
    <p
      id="demo-title"
      class="mb-4 font-display text-lg leading-snug font-semibold"
    >
      {{ t('hero.demo.title') }}
    </p>

    <!-- Stylised device -->
    <div class="rounded-[var(--radius-device)] border-2 border-line bg-surface p-3 pb-4">
      <div
        class="mx-auto mb-3 h-1.5 w-16 rounded-full bg-line"
        aria-hidden="true"
      />
      <div class="rounded-[18px] bg-bg p-4">
        <div class="flex items-start justify-between gap-3">
          <p class="font-display text-base font-bold">
            {{ t('hero.demo.app') }}
          </p>
          <!-- Status: text + distinct icon, never colour alone. -->
          <p
            class="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-badge)] border px-2 py-0.5 text-xs font-semibold"
            :class="!online ? 'border-laterite text-laterite-ink' : 'border-cyan-ink text-cyan-ink'"
          >
            <IconCloudOff
              v-if="!online"
              class="size-3.5"
              aria-hidden="true"
            />
            <IconRefresh
              v-else-if="status === 'syncing'"
              class="size-3.5 motion-safe:animate-spin"
              aria-hidden="true"
            />
            <IconCheck
              v-else
              class="size-3.5"
              aria-hidden="true"
            />
            <span class="max-w-[9.5rem] truncate">{{ online ? statusText : t('hero.demo.offline') }}</span>
          </p>
        </div>

        <dl class="mt-4 space-y-2 text-sm">
          <div class="rounded-md border border-line bg-surface px-3 py-2">
            <dt class="text-xs text-muted">
              {{ t('hero.demo.member') }}
            </dt>
            <dd class="font-medium">
              {{ nextMember.name }}
            </dd>
          </div>
          <div class="rounded-md border border-line bg-surface px-3 py-2">
            <dt class="text-xs text-muted">
              {{ t('hero.demo.commune') }}
            </dt>
            <dd class="font-medium">
              {{ nextMember.commune }}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          class="mt-4 min-h-11 w-full rounded-full bg-cyan px-4 text-sm font-semibold text-on-cyan transition-colors hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="queueFull"
          @click="save"
        >
          {{ t('hero.demo.save') }}
        </button>
        <p
          v-if="queueFull"
          class="mt-2 text-xs text-laterite-ink"
        >
          {{ t('hero.demo.queueFull') }}
        </p>

        <!-- Queues -->
        <div class="mt-4 min-h-[7.5rem] text-sm">
          <template v-if="pendingShown.length">
            <p class="text-xs font-semibold text-laterite-ink">
              {{ t('hero.demo.pendingList') }}
            </p>
            <TransitionGroup
              tag="ul"
              name="rec"
              class="relative mt-1.5 space-y-1.5"
            >
              <li
                v-for="r in pendingShown"
                :key="r.id"
                class="flex items-center gap-2 rounded-md border-l-4 border-laterite bg-surface px-2.5 py-1.5"
              >
                <IconCloudOff
                  class="size-3.5 shrink-0 text-laterite-ink"
                  aria-hidden="true"
                />
                <span class="flex-1 truncate">{{ r.name }}</span>
                <span class="text-xs text-muted">{{ t('hero.demo.pendingItem') }}</span>
              </li>
            </TransitionGroup>
          </template>
          <template v-else-if="synced.length">
            <p class="text-xs font-semibold text-cyan-ink">
              {{ t('hero.demo.syncedList') }}
            </p>
            <TransitionGroup
              tag="ul"
              name="rec"
              class="relative mt-1.5 space-y-1.5"
            >
              <li
                v-for="r in synced"
                :key="r.id"
                class="flex items-center gap-2 rounded-md border-l-4 border-cyan-ink bg-surface px-2.5 py-1.5"
              >
                <IconCheck
                  class="size-3.5 shrink-0 text-cyan-ink"
                  aria-hidden="true"
                />
                <span class="flex-1 truncate">{{ r.name }}</span>
                <span class="text-xs text-muted">{{ t('hero.demo.syncedItem') }}</span>
              </li>
            </TransitionGroup>
          </template>
          <p
            v-else
            class="pt-2 text-xs text-muted"
          >
            {{ t('hero.demo.hint') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Network switch -->
    <button
      type="button"
      role="switch"
      :aria-checked="online"
      class="mt-4 flex min-h-11 w-full items-center justify-between gap-3 rounded-[var(--radius-panel)] border px-4 py-2 text-sm transition-colors"
      :class="online ? 'border-line bg-surface' : 'border-laterite bg-surface'"
      @click="setOnline(!online)"
    >
      <span class="flex items-center gap-2 font-semibold">
        <IconWifi
          v-if="online"
          class="size-4 text-cyan-ink"
          aria-hidden="true"
        />
        <IconWifiOff
          v-else
          class="size-4 text-laterite-ink"
          aria-hidden="true"
        />
        {{ t('hero.demo.network') }}
        <span :class="online ? 'text-cyan-ink' : 'text-laterite-ink'">{{ online ? t('hero.demo.networkOn') : t('hero.demo.networkOff') }}</span>
      </span>
      <span
        class="relative h-6 w-11 shrink-0 rounded-full transition-colors"
        :class="online ? 'bg-cyan-ink' : 'bg-laterite'"
        aria-hidden="true"
      >
        <span
          class="absolute top-0.5 size-5 rounded-full bg-bg transition-[left]"
          :class="online ? 'left-[1.375rem]' : 'left-0.5'"
        />
      </span>
    </button>

    <figcaption class="mt-3 text-xs leading-relaxed text-muted">
      {{ t('hero.demo.caption') }}
    </figcaption>

    <!-- One polite announcement per state change, not per animation frame. -->
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ statusText }}
    </p>
  </figure>
</template>

<style scoped>
.rec-enter-active,
.rec-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.rec-enter-from {
  opacity: 0;
  transform: translateY(-6px);
}
.rec-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
.rec-leave-active {
  position: absolute;
}
</style>
