<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import IconMail from '~icons/lucide/mail'
import IconCopy from '~icons/lucide/copy'
import IconCheck from '~icons/lucide/check'
import IconDownload from '~icons/lucide/download'
import IconWhatsapp from '~icons/simple-icons/whatsapp'
import IconGithub from '~icons/simple-icons/github'
import IconLinkedin from '~icons/simple-icons/linkedin'
import BaseButton from '@/components/ui/BaseButton.vue'
import { contact, whatsappUrl } from '@/data/contact'

const { t } = useI18n()

const channels = computed(() =>
  [
    { id: 'whatsapp', href: whatsappUrl(t('contact.whatsappMessage')), value: contact.phoneDisplay, icon: IconWhatsapp },
    { id: 'linkedin', href: contact.linkedin, value: contact.linkedin.replace(/^https?:\/\/(www\.)?/, ''), icon: IconLinkedin },
    { id: 'github', href: contact.github, value: contact.github.replace(/^https?:\/\//, ''), icon: IconGithub },
  ].filter((c) => c.href),
)

// Copy-to-clipboard: useful when the visitor has no mail client configured.
const copied = ref(false)
async function copyEmail() {
  try {
    await navigator.clipboard.writeText(contact.email)
    copied.value = true
    setTimeout(() => (copied.value = false), 2500)
  } catch {
    /* clipboard blocked: the mailto link remains available */
  }
}
</script>

<template>
  <section
    id="contact"
    aria-labelledby="contact-title"
    class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div
      v-reveal
      class="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16"
    >
      <div>
        <h2
          id="contact-title"
          class="text-[clamp(2.25rem,7vw,4rem)] leading-none font-extrabold tracking-tight"
        >
          {{ t('contact.title') }}
        </h2>
        <p class="mt-5 max-w-md text-lg text-muted">
          {{ t('contact.text') }}
        </p>
        <BaseButton
          class="mt-8"
          :href="t('contact.cvFile')"
          variant="ghost"
          download
        >
          <IconDownload
            class="size-4"
            aria-hidden="true"
          />
          {{ t('contact.cv') }}
        </BaseButton>
      </div>

      <ul class="min-w-0 self-start divide-y divide-line rounded-3xl border border-line bg-surface">
        <li class="flex items-center gap-2 p-2 pr-3">
          <a
            :href="`mailto:${contact.email}`"
            class="flex min-w-0 flex-1 items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-raised"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-full bg-accent text-on-accent">
              <IconMail
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <span class="min-w-0">
              <span class="block text-sm text-muted">{{ t('contact.email') }}</span>
              <span class="block font-semibold break-all">{{ contact.email }}</span>
            </span>
          </a>
          <button
            type="button"
            class="grid size-11 shrink-0 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-fg"
            :aria-label="t('contact.copy')"
            :title="t('contact.copy')"
            @click="copyEmail"
          >
            <IconCheck
              v-if="copied"
              class="size-5 text-accent-ink"
              aria-hidden="true"
            />
            <IconCopy
              v-else
              class="size-5"
              aria-hidden="true"
            />
          </button>
          <span
            class="sr-only"
            role="status"
          >{{ copied ? t('contact.copied') : '' }}</span>
        </li>
        <li
          v-for="c in channels"
          :key="c.id"
          class="p-2"
        >
          <a
            :href="c.href"
            target="_blank"
            rel="noopener noreferrer"
            class="flex items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-raised"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-full bg-raised text-fg">
              <component
                :is="c.icon"
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <span class="min-w-0">
              <span class="block text-sm text-muted">{{ t(`contact.${c.id}`) }}<span class="sr-only"> ({{ t('a11y.newTab') }})</span></span>
              <span class="block truncate font-semibold">{{ c.value }}</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
