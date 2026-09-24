import type {} from 'vite-ssg' // brings the `ssgOptions` type into Vite's config
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import Icons from 'unplugin-icons/vite'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    // Icons are compiled to inline SVG components at build time: no network request, only used icons are shipped.
    Icons({ compiler: 'vue3' }),
    // Compiles the locale JSON at build time and ships the runtime-only vue-i18n (no message compiler in the browser).
    VueI18nPlugin({
      include: [fileURLToPath(new URL('./src/locales/**', import.meta.url))],
      compositionOnly: true,
      fullInstall: false,
      dropMessageCompiler: true,
    }),
  ],
  // Static prerendering (vite-ssg): one HTML file per language, critical CSS inlined by beasties.
  ssgOptions: {
    dirStyle: 'nested', // /fr/ → dist/fr/index.html
    formatting: 'minify',
    script: 'async',
    // Inline critical CSS, but do not preload every font subset (cyrillic, greek…):
    // the two above-the-fold fonts are preloaded explicitly in useLocaleHead().
    beastiesOptions: { preloadFonts: false, inlineFonts: false },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
