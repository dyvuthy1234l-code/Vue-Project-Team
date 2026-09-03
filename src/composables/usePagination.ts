import { ref, computed, watch, type Ref } from 'vue'

export function usePagination<T>(items: Ref<T[]>, pageSize = 6) {
  const currentPage = ref(1)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / pageSize))
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * pageSize
    return items.value.slice(start, start + pageSize)
  })

  const totalItems = computed(() => items.value.length)

  const showingFrom = computed(() =>
    items.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize + 1
  )

  const showingTo = computed(() =>
    Math.min(currentPage.value * pageSize, items.value.length)
  )

  // Reset to page 1 when items change (e.g., filter applied)
  watch(() => items.value.length, () => {
    currentPage.value = 1
  })

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function nextPage() {
    goToPage(currentPage.value + 1)
  }

  function prevPage() {
    goToPage(currentPage.value - 1)
  }

  return {
    currentPage,
    totalPages,
    totalItems,
    paginatedItems,
    showingFrom,
    showingTo,
    goToPage,
    nextPage,
    prevPage
  }
}
