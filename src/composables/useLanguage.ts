import { ref, computed } from 'vue'
import type { Language } from '@/types'
import { en } from '@/locales/en'
import { kh } from '@/locales/kh'

const currentLanguage = ref<Language>(
  (localStorage.getItem('camlife-language') as Language) || 'kh'
)

const translations = computed(() => {
  return currentLanguage.value === 'en' ? en : kh
})

export function useLanguage() {
  function setLanguage(lang: Language) {
    currentLanguage.value = lang
    localStorage.setItem('camlife-language', lang)
  }

  function toggleLanguage() {
    setLanguage(currentLanguage.value === 'en' ? 'kh' : 'en')
  }

  function t(key: string): string {
    const keys = key.split('.')
    let result: unknown = translations.value
    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in (result as Record<string, unknown>)) {
        result = (result as Record<string, unknown>)[k]
      } else {
        return key
      }
    }
    return typeof result === 'string' ? result : key
  }

  function tArray(key: string): string[] {
    const keys = key.split('.')
    let result: unknown = translations.value
    for (const k of keys) {
      if (typeof result === 'object' && result !== null && k in (result as Record<string, unknown>)) {
        result = (result as Record<string, unknown>)[k]
      } else {
        return []
      }
    }
    return Array.isArray(result) ? (result as string[]) : []
  }

  // Helper to get localized field from data objects
  function localized(enStr: string, khStr?: string): string {
    return currentLanguage.value === 'en' ? enStr : (khStr || enStr)
  }

  return {
    currentLanguage,
    translations,
    setLanguage,
    toggleLanguage,
    t,
    tArray,
    localized
  }
}
