import { ref, watch } from 'vue'

const STORAGE_KEY = 'camlife-dark-mode'

function getInitialTheme(): boolean {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) return stored === 'true'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}

const isDark = ref(getInitialTheme())

function applyTheme() {
  if (isDark.value) {
    document.documentElement.classList.add('dark')
  } else {
    document.documentElement.classList.remove('dark')
  }
}

// Apply on load
applyTheme()

watch(isDark, () => {
  applyTheme()
  localStorage.setItem(STORAGE_KEY, String(isDark.value))
})

export function useDarkMode() {
  function toggleDarkMode() {
    isDark.value = !isDark.value
  }

  function setDarkMode(value: boolean) {
    isDark.value = value
  }

  return {
    isDark,
    toggleDarkMode,
    setDarkMode
  }
}
