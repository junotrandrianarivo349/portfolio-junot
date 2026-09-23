import { createApp } from 'vue'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource-variable/figtree'
import './assets/main.css'
import App from './App.vue'
import { i18n } from './i18n'
import { vReveal } from './directives/vReveal'

createApp(App).use(i18n).directive('reveal', vReveal).mount('#app')
