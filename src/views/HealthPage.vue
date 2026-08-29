<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, RotateCcw } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals } from '@/services/dataService'

const { t, localized } = useLanguage()

const allHospitals = getHospitals()
const searchQuery = ref('')
const activeCategory = ref('All')
const activeLocation = ref('All')

const categories = computed(() => [
  { value: 'All', label: t('health.categories.all') },
  { value: 'hospital', label: t('health.categories.hospital') },
  { value: 'clinic', label: t('health.categories.clinic') },
  { value: 'pharmacy', label: t('health.categories.pharmacy') },
])

const locations = computed(() => {
  const locs = [...new Set(allHospitals.map(h => h.location))]
  return ['All', ...locs]
})

const filteredHospitals = computed(() => {
  let result = allHospitals

  if (activeCategory.value !== 'All') {
    result = result.filter(h => h.category === activeCategory.value)
  }

  if (activeLocation.value !== 'All') {
    result = result.filter(h => h.location === activeLocation.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(h =>
      h.name.toLowerCase().includes(query) ||
      h.description.toLowerCase().includes(query) ||
      h.location.toLowerCase().includes(query) ||
      h.services.some(s => s.toLowerCase().includes(query))
    )
  }

  return result
})

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
  activeLocation.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <SectionHeader
      :title="t('health.title')"
      :subtitle="t('health.subtitle')"
      badge="Healthcare Directory"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      <div class="flex flex-col md:flex-row gap-4">
        <!-- Search bar -->
        <div class="flex-1">
          <SearchBar v-model="searchQuery" :placeholder="t('health.searchPlaceholder')" large />
        </div>

        <!-- Location Dropdown -->
        <div class="relative min-w-[200px]">
          <div class="absolute left-3.5 top-1/2 -translate-y-1/2 text-camlife-action pointer-events-none">
            <MapPin class="w-4 h-4" />
          </div>
          <select
            v-model="activeLocation"
            class="w-full pl-10 pr-8 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-camlife-navy focus:outline-none focus:ring-2 focus:ring-camlife-action/30 focus:border-camlife-action appearance-none transition-all"
          >
            <option v-for="loc in locations" :key="loc" :value="loc">
              {{ loc === 'All' ? t('jobs.filters.allLocations') : loc }}
            </option>
          </select>
        </div>
      </div>

      <!-- Categories & Reset Row -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          @select="activeCategory = $event"
        />

        <button
          v-if="searchQuery || activeCategory !== 'All' || activeLocation !== 'All'"
          @click="resetFilters"
          class="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
      <p>Showing <span class="text-camlife-navy font-black">{{ filteredHospitals.length }}</span> healthcare providers</p>
    </div>

    <!-- Grid -->
    <div v-if="filteredHospitals.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <ServiceCard
        v-for="hospital in filteredHospitals"
        :key="hospital.id"
        :title="localized(hospital.name, hospital.nameKh)"
        :category="hospital.category"
        :rating="hospital.rating"
        :reviews="hospital.reviews"
        :location="hospital.location"
        :phone="hospital.phone"
        :description="localized(hospital.description, hospital.descriptionKh)"
        :opening-hours="hospital.openingHours"
        :image="hospital.image"
        :link-to="'/health/' + hospital.id"
      />
    </div>

    <EmptyState v-else :message="t('health.noResults')" @reset="resetFilters" />
  </div>
</template>
