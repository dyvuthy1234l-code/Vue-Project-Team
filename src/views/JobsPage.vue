<script setup lang="ts">
import { ref, computed } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import JobCard from '@/components/JobCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getJobs } from '@/services/dataService'

const { t } = useLanguage()

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

function resetFilters() {
  searchQuery.value = ''
  activeLocation.value = 'All'
  activeCategory.value = 'All'
  activeType.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <SectionHeader
      :title="t('jobs.title')"
      :subtitle="t('jobs.subtitle')"
      badge="Cambodian Career Hub"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('jobs.searchPlaceholder')" large />

      <!-- Filter Controls -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100">
        <!-- Location -->
        <div class="relative">
          <select
            v-model="activeLocation"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-camlife-navy focus:outline-none focus:ring-2 focus:ring-camlife-action/30 focus:border-camlife-action appearance-none transition-all"
          >
            <option v-for="loc in locations" :key="loc" :value="loc">
              📍 {{ loc === 'All' ? t('jobs.filters.allLocations') : loc }}
            </option>
          </select>
        </div>

        <!-- Category -->
        <div class="relative">
          <select
            v-model="activeCategory"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-camlife-navy focus:outline-none focus:ring-2 focus:ring-camlife-action/30 focus:border-camlife-action appearance-none transition-all"
          >
            <option v-for="cat in categories" :key="cat" :value="cat">
              💼 {{ cat === 'All' ? t('jobs.filters.allCategories') : cat }}
            </option>
          </select>
        </div>

        <!-- Job Type -->
        <div class="relative">
          <select
            v-model="activeType"
            class="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-camlife-navy focus:outline-none focus:ring-2 focus:ring-camlife-action/30 focus:border-camlife-action appearance-none transition-all"
          >
            <option v-for="type in types" :key="type" :value="type">
              ⏳ {{ type === 'All' ? t('jobs.filters.allTypes') : type }}
            </option>
          </select>
        </div>
      </div>

      <div v-if="searchQuery || activeLocation !== 'All' || activeCategory !== 'All' || activeType !== 'All'" class="flex justify-end pt-2">
        <button
          @click="resetFilters"
          class="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Job Filters</span>
        </button>
      </div>
    </div>

    <!-- Results Count -->
    <div class="flex justify-between items-center text-xs font-bold text-slate-500 px-1">
      <p>Showing <span class="text-camlife-navy font-black">{{ filteredJobs.length }}</span> job openings</p>
    </div>

    <!-- Jobs Grid/List -->
    <div v-if="filteredJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <JobCard v-for="job in filteredJobs" :key="job.id" :job="job" />
    </div>

    <EmptyState v-else :message="t('jobs.noResults')" @reset="resetFilters" />
  </div>
</template>
