<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  RotateCcw,
  ChevronRight,
  MapPin,
  Briefcase,
  Layers,
  Bookmark
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import JobCard from '@/components/JobCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { getJobs } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t } = useLanguage()
const { savedJobIds } = useSavedJobs()

usePageMeta({
  title: 'Jobs & Careers in Cambodia — CamLife',
  description: 'Explore full-time, part-time, and internship positions from top Cambodian employers.'
})

const allJobs = getJobs()
const searchQuery = ref('')
const activeLocation = ref('All')
const activeCategory = ref('All')
const activeType = ref('All')

const locations = computed(() => {
  return ['All', ...new Set(allJobs.map(j => j.location))]
})

const categories = computed(() => {
  return ['All', ...new Set(allJobs.map(j => j.category))]
})

const types = ['All', 'Full-time', 'Part-time', 'Internship', 'Freelance']

const filteredJobs = computed(() => {
  let result = allJobs

  if (activeLocation.value !== 'All') {
    result = result.filter(j => j.location === activeLocation.value)
  }

  if (activeCategory.value !== 'All') {
    result = result.filter(j => j.category === activeCategory.value)
  }

  if (activeType.value !== 'All') {
    result = result.filter(j => j.type === activeType.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(j =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.description.toLowerCase().includes(query)
    )
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedJobs,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredJobs, 6)

function resetFilters() {
  searchQuery.value = ''
  activeLocation.value = 'All'
  activeCategory.value = 'All'
  activeType.value = 'All'
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
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.jobs') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('jobs.title')"
      :subtitle="t('jobs.subtitle')"
      badge="Cambodian Career Hub"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('jobs.searchPlaceholder')" large />

      <!-- Multi-select Filter Controls Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <!-- Location Dropdown -->
        <div class="relative">
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

        <!-- Category Dropdown -->
        <div class="relative">
          <select
            v-model="activeCategory"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/90 dark:border-slate-600 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] appearance-none transition-all cursor-pointer"
          >
            <option value="All">All Job Categories</option>
            <option v-for="cat in categories.slice(1)" :key="cat" :value="cat">
              💼 {{ cat }}
            </option>
          </select>
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Layers class="w-4 h-4" />
          </div>
        </div>

        <!-- Type Dropdown -->
        <div class="relative">
          <select
            v-model="activeType"
            class="w-full px-4 py-3 bg-slate-50 dark:bg-slate-700/60 border border-slate-200/90 dark:border-slate-600 rounded-xl text-xs font-bold text-[#0F172A] dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] appearance-none transition-all cursor-pointer"
          >
            <option value="All">All Employment Types</option>
            <option v-for="typ in types.slice(1)" :key="typ" :value="typ">
              ⏱️ {{ typ }}
            </option>
          </select>
          <div class="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Briefcase class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Reset Filter button row -->
      <div v-if="searchQuery || activeLocation !== 'All' || activeCategory !== 'All' || activeType !== 'All'" class="pt-2 flex justify-end">
        <button
          @click="resetFilters"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Result Count & Saved Jobs Quick Access -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredJobs.length }}</span> job opportunities
      </p>

      <router-link
        to="/saved-jobs"
        class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline"
      >
        <Bookmark class="w-3.5 h-3.5" />
        <span>Saved Jobs ({{ savedJobIds.length }})</span>
      </router-link>
    </div>

    <!-- Job Cards Grid -->
    <div v-if="paginatedJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <JobCard v-for="job in paginatedJobs" :key="job.id" :job="job" />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      message="No job openings matched your criteria"
      subtitle="Try searching with other titles or clearing your location and employment type filters."
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
