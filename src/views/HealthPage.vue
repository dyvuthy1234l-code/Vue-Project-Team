<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, RotateCcw, ChevronRight, HeartPulse, Hospital as HospitalIcon, Stethoscope, Pill } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t } = useLanguage()

usePageMeta({
  title: 'Health & Hospitals — CamLife',
  description: 'Find verified hospitals, clinics, and pharmacies across Cambodia.'
})

const allHospitals = getHospitals()
const searchQuery = ref('')
const activeCategory = ref('All')
const activeLocation = ref('All')

const categories = computed(() => [
  { value: 'All', label: t('health.categories.all'), icon: HeartPulse },
  { value: 'hospital', label: t('health.categories.hospital'), icon: HospitalIcon },
  { value: 'clinic', label: t('health.categories.clinic'), icon: Stethoscope },
  { value: 'pharmacy', label: t('health.categories.pharmacy'), icon: Pill }
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
      (h.nameKh && h.nameKh.toLowerCase().includes(query)) ||
      h.description.toLowerCase().includes(query) ||
      (h.descriptionKh && h.descriptionKh.toLowerCase().includes(query)) ||
      h.location.toLowerCase().includes(query) ||
      (h.addressKh && h.addressKh.toLowerCase().includes(query)) ||
      h.services.some(s => s.toLowerCase().includes(query))
    )
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedHospitals,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredHospitals, 6)

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
  activeLocation.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        {{ t('nav.home') }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.health') }}</span>
    </nav>

    <!-- Page Header -->
    <SectionHeader
      :title="t('health.title')"
      :subtitle="t('health.subtitle')"
      badge="Healthcare Directory"
    />

    <!-- Unified Filter Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row gap-3">
        <!-- Search Input -->
        <div class="flex-1">
          <SearchBar v-model="searchQuery" :placeholder="t('health.searchPlaceholder')" large />
        </div>

        <!-- Location Dropdown -->
        <div class="relative min-w-[200px]">
          <select
            v-model="activeLocation"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/90 dark:border-slate-600 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] appearance-none transition-all cursor-pointer"
          >
            <option value="All">All Locations (ទូទាំងប្រទេស)</option>
            <option v-for="loc in locations.slice(1)" :key="loc" :value="loc">
              📍 {{ loc }}
            </option>
          </select>
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <MapPin class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Filter Categories & Reset -->
      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          @select="activeCategory = $event"
        />

        <button
          v-if="searchQuery || activeCategory !== 'All' || activeLocation !== 'All'"
          @click="resetFilters"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Result Count Indicator -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredHospitals.length }}</span> healthcare facilities
      </p>
    </div>

    <!-- Cards Grid -->
    <div v-if="paginatedHospitals.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <ServiceCard
        v-for="hospital in paginatedHospitals"
        :key="hospital.id"
        :title="hospital.name"
        :title-kh="hospital.nameKh"
        :category="hospital.category"
        :rating="hospital.rating"
        :reviews="hospital.reviews"
        :location="hospital.location"
        :phone="hospital.phone"
        :description="hospital.description"
        :description-kh="hospital.descriptionKh"
        :opening-hours="hospital.openingHours"
        :image="hospital.image"
        :address="hospital.address"
        :coordinates="hospital.coordinates"
        :link-to="'/health/' + hospital.id"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :message="t('health.noResults')"
      @reset="resetFilters"
    />

    <!-- Pagination -->
    <PaginationBar
      :current-page="currentPage"
      :total-pages="totalPages"
      :showing-from="showingFrom"
      :showing-to="showingTo"
      :total-items="totalItems"
      @go-to-page="goToPage"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>
