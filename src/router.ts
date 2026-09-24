import type { RouteRecordRaw } from 'vue-router'
import type { AppLocale } from '@/i18n'
import HomePage from '@/pages/HomePage.vue'

declare module 'vue-router' {
  interface RouteMeta {
    locale: AppLocale
  }
}

// The URL decides the language, so each version has its own prerendered HTML (SEO, link previews).
export const routes: RouteRecordRaw[] = [
  { path: '/', component: HomePage, meta: { locale: 'en' } },
  { path: '/fr/', component: HomePage, meta: { locale: 'fr' } },
]
