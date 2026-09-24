import pluginVue from 'eslint-plugin-vue'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import globals from 'globals'

export default defineConfigWithVueTs(
  { ignores: ['dist/**', 'node_modules/**'] },
  pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,
  {
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      // Section components are named after their role (HeroSection, AboutSection…), always multi-word.
      'vue/multi-word-component-names': 'off',
      // Guarantee every visible string goes through i18n.
      'vue/no-bare-strings-in-template': ['error', { allowlist: ['@', '·', '—', '–', '/', '(', ')', ',', '.', ':', '+', '&', '|', 'FR', 'EN', 'JR'] }],
    },
  },
)
