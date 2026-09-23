import { ref } from 'vue'

type Theme = 'dark' | 'light'

// Module-level state: every component calling useTheme() shares the same ref.
const theme = ref<Theme>(document.documentElement.classList.contains('dark') ? 'dark' : 'light')

function apply(value: Theme) {
  document.documentElement.classList.toggle('dark', value === 'dark')
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', value === 'dark' ? '#0e2230' : '#eaf2f4')
  try {
    localStorage.setItem('theme', value)
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
}

export function useTheme() {
  function toggle() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    apply(theme.value)
  }
  return { theme, toggle }
}
