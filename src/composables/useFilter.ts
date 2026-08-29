import { ref, type Ref } from 'vue'

export function useFilter<T>(items: Ref<T[]>) {
  const activeFilters = ref<Record<string, string>>({})

  function setFilter(key: string, value: string) {
    if (value === '' || value === 'All') {
      const newFilters = { ...activeFilters.value }
      delete newFilters[key]
      activeFilters.value = newFilters
    } else {
      activeFilters.value = { ...activeFilters.value, [key]: value }
    }
  }

  function clearFilters() {
    activeFilters.value = {}
  }

  function getFilteredItems(filterFn: (item: T, filters: Record<string, string>) => boolean): T[] {
    const filters = activeFilters.value
    if (Object.keys(filters).length === 0) return items.value
    return items.value.filter(item => filterFn(item, filters))
  }

  return {
    activeFilters,
    setFilter,
    clearFilters,
    getFilteredItems
  }
}

export function useRatingFilter() {
  const minRating = ref(0)

  function setMinRating(rating: number) {
    minRating.value = rating
  }

  function filterByRating<T extends { rating: number }>(items: T[]): T[] {
    if (minRating.value === 0) return items
    return items.filter(item => item.rating >= minRating.value)
  }

  return {
    minRating,
    setMinRating,
    filterByRating
  }
}

export function useSalaryFilter() {
  const salaryRange = ref<[number, number]>([0, 10000])

  function setSalaryRange(min: number, max: number) {
    salaryRange.value = [min, max]
  }

  function filterBySalary<T extends { salaryMin: number; salaryMax: number }>(items: T[]): T[] {
    const [min, max] = salaryRange.value
    if (min === 0 && max === 10000) return items
    return items.filter(item => item.salaryMin >= min && item.salaryMax <= max)
  }

  return {
    salaryRange,
    setSalaryRange,
    filterBySalary
  }
}
