import { ref } from 'vue'

type Theme = 'dark' | 'light'

// Module-level state shared by every component. It starts as 'dark' (the prerendered default)
// and is synced with the <html> class after mount, so hydration never sees a different value.
const theme = ref<Theme>('dark')

function apply(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#0e2230' : '#eaf2f4')
  try {
    localStorage.setItem('theme', value)
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
}

/** Reads the theme set by the inline script in index.html. Call once, on mount. */
export function syncThemeFromDocument() {
  theme.value = document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    apply(theme.value)
  }
  return { theme, toggle }
}
