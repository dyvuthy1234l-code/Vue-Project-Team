import { ref, computed } from 'vue'

export interface SavedServiceItem {
  id: string
  title: string
  titleKh?: string
  category: string
  type: 'government' | 'health' | 'job' | 'transport' | 'emergency'
  route: string
  savedAt: string
}

const savedServices = ref<SavedServiceItem[]>(
  JSON.parse(localStorage.getItem('camlife-saved-services') || '[]')
)

export function useSavedServices() {
  function isSaved(id: string): boolean {
    return savedServices.value.some(s => s.id === id)
  }

  function toggleSave(item: SavedServiceItem) {
    const idx = savedServices.value.findIndex(s => s.id === item.id)
    if (idx >= 0) {
      savedServices.value.splice(idx, 1)
    } else {
      savedServices.value.unshift({
        ...item,
        savedAt: new Date().toISOString()
      })
    }
    localStorage.setItem('camlife-saved-services', JSON.stringify(savedServices.value))
  }

  function removeSaved(id: string) {
    savedServices.value = savedServices.value.filter(s => s.id !== id)
    localStorage.setItem('camlife-saved-services', JSON.stringify(savedServices.value))
  }

  function clearAllSaved() {
    savedServices.value = []
    localStorage.removeItem('camlife-saved-services')
  }

  const savedCount = computed(() => savedServices.value.length)

  return {
    savedServices,
    savedCount,
    isSaved,
    toggleSave,
    removeSaved,
    clearAllSaved
  }
}
