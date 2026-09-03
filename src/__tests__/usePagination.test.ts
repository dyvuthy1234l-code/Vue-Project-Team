import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { usePagination } from '../composables/usePagination'

describe('usePagination', () => {
  function createItems(count: number) {
    return ref(Array.from({ length: count }, (_, i) => ({ id: i + 1 })))
  }

  it('should return all items when total is less than page size', () => {
    const items = createItems(3)
    const { paginatedItems, totalPages, currentPage } = usePagination(items, 6)
    expect(paginatedItems.value.length).toBe(3)
    expect(totalPages.value).toBe(1)
    expect(currentPage.value).toBe(1)
  })

  it('should paginate items correctly', () => {
    const items = createItems(15)
    const { paginatedItems, totalPages } = usePagination(items, 6)
    expect(totalPages.value).toBe(3)
    expect(paginatedItems.value.length).toBe(6)
  })

  it('should navigate to next page', () => {
    const items = createItems(15)
    const { paginatedItems, currentPage, nextPage } = usePagination(items, 6)
    nextPage()
    expect(currentPage.value).toBe(2)
    expect(paginatedItems.value.length).toBe(6)
  })

  it('should navigate to previous page', () => {
    const items = createItems(15)
    const { currentPage, nextPage, prevPage } = usePagination(items, 6)
    nextPage()
    nextPage()
    expect(currentPage.value).toBe(3)
    prevPage()
    expect(currentPage.value).toBe(2)
  })

  it('should not go below page 1', () => {
    const items = createItems(15)
    const { currentPage, prevPage } = usePagination(items, 6)
    prevPage()
    expect(currentPage.value).toBe(1)
  })

  it('should not go beyond total pages', () => {
    const items = createItems(15)
    const { currentPage, nextPage, totalPages } = usePagination(items, 6)
    nextPage()
    nextPage()
    nextPage()
    nextPage()
    expect(currentPage.value).toBe(totalPages.value)
  })

  it('should go to specific page', () => {
    const items = createItems(30)
    const { currentPage, goToPage } = usePagination(items, 6)
    goToPage(3)
    expect(currentPage.value).toBe(3)
  })

  it('should show correct from/to values', () => {
    const items = createItems(15)
    const { showingFrom, showingTo, nextPage } = usePagination(items, 6)
    expect(showingFrom.value).toBe(1)
    expect(showingTo.value).toBe(6)
    nextPage()
    expect(showingFrom.value).toBe(7)
    expect(showingTo.value).toBe(12)
  })

  it('should handle last page correctly', () => {
    const items = createItems(15)
    const { showingTo, goToPage } = usePagination(items, 6)
    goToPage(3)
    expect(showingTo.value).toBe(15)
  })

  it('should handle empty array', () => {
    const items = ref<{ id: number }[]>([])
    const { paginatedItems, totalPages, showingFrom } = usePagination(items, 6)
    expect(paginatedItems.value.length).toBe(0)
    expect(totalPages.value).toBe(1)
    expect(showingFrom.value).toBe(0)
  })
})
