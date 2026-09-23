<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
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
const copyStatus = ref('')
let copyTimer: ReturnType<typeof setTimeout> | undefined
async function copyEmail() {
  clearTimeout(copyTimer)
  copyStatus.value = '' // cleared first so a repeated click is announced again
  try {
    await navigator.clipboard.writeText(contact.email)
    copied.value = true
    await nextTick()
    copyStatus.value = t('contact.copied')
  } catch {
    copied.value = false
    await nextTick()
    copyStatus.value = t('contact.copyFail')
  }
  copyTimer = setTimeout(() => {
    copied.value = false
    copyStatus.value = ''
  }, 2500)
}
// Break the address only after the "@" on narrow screens.
const [emailUser, emailDomain] = contact.email.split('@')
</script>

<template>
  <section
    id="contact"
    aria-labelledby="contact-title"
    class="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28"
  >
    <div
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
        <div class="mt-8 flex flex-wrap gap-3">
          <BaseButton :href="`mailto:${contact.email}`">
            <IconMail
              class="size-4"
              aria-hidden="true"
            />
            {{ t('contact.emailCta') }}
          </BaseButton>
          <BaseButton
            :href="t('contact.cvFile')"
            variant="ghost"
            download
          >
            <IconDownload
              class="size-4"
              aria-hidden="true"
            />
            {{ t('contact.cv') }}
            <span class="font-normal opacity-80">({{ t('contact.cvMeta') }})</span>
          </BaseButton>
        </div>
      </div>

      <ul class="min-w-0 self-start divide-y divide-line rounded-[var(--radius-panel)] border border-line bg-surface">
        <li class="flex items-center gap-2 p-2 pr-3">
          <a
            :href="`mailto:${contact.email}`"
            class="group flex min-w-0 flex-1 items-center gap-4 rounded-[var(--radius-panel)] p-3"
          >
            <span class="grid size-11 shrink-0 place-items-center rounded-full bg-raised text-fg">
              <IconMail
                class="size-5"
                aria-hidden="true"
              />
            </span>
            <span class="min-w-0">
              <span class="block text-sm text-muted">{{ t('contact.email') }}</span>
              <span class="block font-semibold group-hover:underline">{{ emailUser }}<wbr>@{{ emailDomain }}</span>
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
              class="size-5 text-cyan-ink"
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
          >{{ copyStatus }}</span>
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
            class="group flex items-center gap-4 rounded-[var(--radius-panel)] p-3"
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
              <span class="block truncate font-semibold group-hover:underline">{{ c.value }}</span>
            </span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>
