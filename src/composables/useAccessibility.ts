import { ref, onMounted } from 'vue'

export type FontSize = 'sm' | 'md' | 'lg'

const fontSize = ref<FontSize>((localStorage.getItem('camlife-font-size') as FontSize) || 'md')
const isHighContrast = ref<boolean>(localStorage.getItem('camlife-high-contrast') === 'true')
const isReducedMotion = ref<boolean>(localStorage.getItem('camlife-reduced-motion') === 'true')

export function useAccessibility() {
  function setFontSize(size: FontSize) {
    fontSize.value = size
    localStorage.setItem('camlife-font-size', size)
    applyAccessibilitySettings()
  }

  function toggleHighContrast() {
    isHighContrast.value = !isHighContrast.value
    localStorage.setItem('camlife-high-contrast', String(isHighContrast.value))
    applyAccessibilitySettings()
  }

  function toggleReducedMotion() {
    isReducedMotion.value = !isReducedMotion.value
    localStorage.setItem('camlife-reduced-motion', String(isReducedMotion.value))
    applyAccessibilitySettings()
  }

  function applyAccessibilitySettings() {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    // Font size scaling
    root.classList.remove('font-scale-sm', 'font-scale-md', 'font-scale-lg')
    root.classList.add(`font-scale-${fontSize.value}`)

    // High contrast
    if (isHighContrast.value) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Reduced motion
    if (isReducedMotion.value) {
      root.classList.add('reduce-motion')
    } else {
      root.classList.remove('reduce-motion')
    }
  }

  onMounted(() => {
    applyAccessibilitySettings()
  })

  return {
    fontSize,
    isHighContrast,
    isReducedMotion,
    setFontSize,
    toggleHighContrast,
    toggleReducedMotion,
    applyAccessibilitySettings
  }
}
