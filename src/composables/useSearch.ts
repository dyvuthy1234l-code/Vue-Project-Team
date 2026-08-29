import { ref, computed, type Ref } from 'vue'

export function useSearch<T>(items: Ref<T[]>, searchFields: (keyof T)[]) {
  const searchQuery = ref('')

  const filteredBySearch = computed(() => {
    const query = searchQuery.value.toLowerCase().trim()
    if (!query) return items.value

    return items.value.filter(item => {
      return searchFields.some(field => {
        const value = item[field]
        if (typeof value === 'string') {
          return value.toLowerCase().includes(query)
        }
        if (Array.isArray(value)) {
          return value.some(v => typeof v === 'string' && v.toLowerCase().includes(query))
        }
        return false
      })
    })
  })

  function clearSearch() {
    searchQuery.value = ''
  }

  return {
    searchQuery,
    filteredBySearch,
    clearSearch
  }
}
