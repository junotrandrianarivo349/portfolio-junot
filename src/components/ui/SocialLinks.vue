<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import IconGithub from '~icons/simple-icons/github'
import IconLinkedin from '~icons/simple-icons/linkedin'
import { contact } from '@/data/contact'

const { t } = useI18n()
const links = [
  { href: contact.github, label: 'contact.github', icon: IconGithub },
  { href: contact.linkedin, label: 'contact.linkedin', icon: IconLinkedin },
].filter((l) => l.href)
</script>

<template>
  <ul
    v-if="links.length"
    class="flex items-center gap-1"
  >
    <li
      v-for="link in links"
      :key="link.label"
    >
      <a
        :href="link.href"
        target="_blank"
        rel="noopener noreferrer"
        class="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-raised hover:text-fg"
        :aria-label="`${t(link.label)} (${t('a11y.newTab')})`"
      >
        <component
          :is="link.icon"
          class="size-5"
          aria-hidden="true"
        />
      </a>
    </li>
  </ul>
</template>
