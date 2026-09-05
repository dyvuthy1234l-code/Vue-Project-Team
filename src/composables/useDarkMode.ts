import { ref } from 'vue'

const isDark = ref(false)

if (typeof document !== 'undefined') {
  try {
    localStorage.removeItem('camlife-dark-mode')
    document.documentElement.classList.remove('dark')
  } catch {
    // ignore
  }
}

export function useDarkMode() {
  function toggleDarkMode() {
    isDark.value = false
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
    }
  }

  function setDarkMode(_value: boolean) {
    isDark.value = false
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    toggleDarkMode,
    setDarkMode
  }
}

