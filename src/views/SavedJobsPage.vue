<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Bookmark,
  Trash2,
  Briefcase,
  ArrowRight,
  ChevronRight
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import JobCard from '@/components/JobCard.vue'
import SearchBar from '@/components/SearchBar.vue'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { getJobById } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'
import type { Job } from '@/types'

const { savedJobIds } = useSavedJobs()

usePageMeta({
  title: 'Saved Jobs — CamLife',
  description: 'Manage and review your bookmarked career opportunities.'
})

const searchQuery = ref('')

const allSavedJobs = computed(() => {
  return savedJobIds.value
    .map(id => getJobById(id))
    .filter((j): j is Job => j !== undefined)
})

const filteredSavedJobs = computed(() => {
  const q = searchQuery.value.toLowerCase().trim()
  if (!q) return allSavedJobs.value
  return allSavedJobs.value.filter(j =>
    j.title.toLowerCase().includes(q) ||
    j.company.toLowerCase().includes(q) ||
    j.location.toLowerCase().includes(q)
  )
})

function clearAll() {
  if (confirm('Are you sure you want to remove all saved jobs?')) {
    savedJobIds.value.splice(0, savedJobIds.value.length)
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        Home
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <router-link to="/jobs" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        Jobs
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">Saved Jobs</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      title="Saved Jobs"
      subtitle="Review and apply for the career opportunities you have bookmarked"
      badge="Personal Bookmarks"
    />

    <!-- When User Has Saved Jobs -->
    <div v-if="allSavedJobs.length > 0" class="space-y-6">
      <!-- Search and Actions Bar -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="w-full sm:w-80">
          <SearchBar v-model="searchQuery" placeholder="Search within saved jobs..." />
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
          <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
            <span class="text-[#0A2540] dark:text-white font-black">{{ allSavedJobs.length }}</span> bookmarked job{{ allSavedJobs.length > 1 ? 's' : '' }}
          </p>

          <button
            @click="clearAll"
            class="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40"
            type="button"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      <!-- Saved Jobs Grid -->
      <div v-if="filteredSavedJobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <JobCard v-for="job in filteredSavedJobs" :key="job.id" :job="job" />
      </div>

      <div v-else class="text-center py-12 text-slate-400 text-xs">
        No saved jobs match "{{ searchQuery }}".
      </div>
    </div>

    <!-- Empty State When No Jobs Saved -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-10 sm:p-14 text-center shadow-sm max-w-lg mx-auto space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center mx-auto shadow-xs">
        <Bookmark class="w-8 h-8" />
      </div>

      <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
        No Saved Jobs Yet
      </h2>

      <p class="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
        Browse open positions and click the bookmark icon on any job card to save it here for later.
      </p>

      <div class="pt-2">
        <router-link
          to="/jobs"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        >
          <Briefcase class="w-4 h-4" />
          <span>Browse Available Jobs</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </div>
  </div>
</template>
