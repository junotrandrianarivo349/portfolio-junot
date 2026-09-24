<script setup lang="ts">
import { defineAsyncComponent, hydrateOnVisible, type AsyncComponentLoader } from 'vue'
import HeroSection from '@/components/sections/HeroSection.vue'

// The HTML of every section is prerendered. Only the hero is hydrated right away (it holds the demo);
// the sections below are hydrated when they scroll into view, which keeps the main thread free on load.
const lazy = (loader: AsyncComponentLoader) =>
  defineAsyncComponent({ loader, hydrate: hydrateOnVisible({ rootMargin: '200px' }) })

const ProjectsSection = lazy(() => import('@/components/sections/ProjectsSection.vue'))
const AboutSection = lazy(() => import('@/components/sections/AboutSection.vue'))
const SkillsSection = lazy(() => import('@/components/sections/SkillsSection.vue'))
const ExperienceSection = lazy(() => import('@/components/sections/ExperienceSection.vue'))
const ContactSection = lazy(() => import('@/components/sections/ContactSection.vue'))
</script>

<template>
  <HeroSection />
  <ProjectsSection />
  <AboutSection />
  <SkillsSection />
  <ExperienceSection />
  <ContactSection />
</template>
