import { ViteSSG } from 'vite-ssg'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import './assets/main.css'
import App from './App.vue'
import { routes } from './router'
import { createAppI18n } from './i18n'

// vite-ssg renders every route to static HTML at build time, then hydrates it in the browser.
export const createApp = ViteSSG(
  App,
  {
    routes,
    // Anchor links (#projects…) scroll natively; keep the position on back/forward.
    scrollBehavior: (to, _from, saved) => saved ?? (to.hash ? { el: to.hash } : { top: 0 }),
  },
  ({ app, router }) => {
    const i18n = createAppI18n('en')
    app.use(i18n)
    router.beforeEach((to) => {
      i18n.global.locale.value = to.meta.locale
    })
  },
)
