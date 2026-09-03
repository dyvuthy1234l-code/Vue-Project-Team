<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  X,
  CornerDownLeft,
  HeartPulse,
  Building2,
  Briefcase,
  Wrench,
  Bus,
  Newspaper,
  MapPin
} from 'lucide-vue-next'
import { globalSearch } from '@/services/dataService'
import type { SearchResult } from '@/types'

const router = useRouter()
const query = ref('')
const isOpen = ref(false)
const results = ref<SearchResult[]>([])

watch(query, (newQuery) => {
  if (newQuery.trim().length >= 2) {
    results.value = globalSearch(newQuery)
    isOpen.value = true
  } else {
    results.value = []
    isOpen.value = false
  }
})

function navigateToResult(result: SearchResult) {
  router.push(result.route)
  query.value = ''
  isOpen.value = false
}

function closeSearch() {
  isOpen.value = false
  query.value = ''
}

const typeConfig: Record<string, { label: string; icon: any; badgeClass: string }> = {
  hospital: { label: 'Healthcare', icon: HeartPulse, badgeClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200' },
  government: { label: 'Government', icon: Building2, badgeClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200' },
  job: { label: 'Job Opportunity', icon: Briefcase, badgeClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200' },
  'home-service': { label: 'Home Service', icon: Wrench, badgeClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200' },
  transport: { label: 'Transport', icon: Bus, badgeClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200' },
  news: { label: 'News & Advisory', icon: Newspaper, badgeClass: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200' },
  location: { label: 'Important Location', icon: MapPin, badgeClass: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 border-indigo-200' }
}

const groupedResults = computed(() => {
  const groups: Record<string, SearchResult[]> = {}
  results.value.forEach(r => {
    if (!groups[r.type]) groups[r.type] = []
    groups[r.type].push(r)
  })
  return groups
})

defineProps<{
  placeholder?: string
  large?: boolean
}>()
</script>

<template>
  <div class="relative w-full z-40">
    <div class="relative group">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-[#0D47A1] dark:group-focus-within:text-blue-400 transition-colors">
        <Search :class="large ? 'w-5 h-5' : 'w-4 h-4'" />
      </div>

      <input
        v-model="query"
        type="text"
        :placeholder="placeholder || 'What service or guide do you need today?'"
        :class="[
          'w-full pl-11 pr-10 border bg-white dark:bg-slate-800 text-[#0F172A] dark:text-white placeholder:text-slate-400 rounded-2xl shadow-xs focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-[#0D47A1] dark:focus:border-blue-400 transition-all duration-150',
          large ? 'py-3.5 text-base sm:text-lg border-slate-200/90 dark:border-slate-700' : 'py-2.5 text-sm border-slate-200 dark:border-slate-700'
        ]"
        @focus="isOpen = query.length >= 2"
      />

      <button
        v-if="query"
        @click="closeSearch"
        class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        aria-label="Clear search"
        type="button"
      >
        <X class="w-4 h-4" />
      </button>
    </div>

    <!-- Results Dropdown -->
    <div
      v-if="isOpen && query.length >= 2"
      class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#1E293B] rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 max-h-96 overflow-y-auto z-50 divide-y divide-slate-100 dark:divide-slate-700/60 animate-fadeIn"
    >
      <!-- No Results -->
      <div v-if="results.length === 0" class="p-8 text-center">
        <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Search class="w-6 h-6" />
        </div>
        <p class="text-slate-800 dark:text-white font-bold text-sm mb-1">
          No matches found for "{{ query }}"
        </p>
        <p class="text-xs text-slate-400 max-w-xs mx-auto">
          Try keywords like "Hospital", "Passport", "Driving", or "Electrician".
        </p>
      </div>

      <!-- Grouped Results -->
      <div v-else>
        <div v-for="(items, type) in groupedResults" :key="type" class="p-2">
          <div class="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <component :is="typeConfig[type]?.icon || Search" class="w-3.5 h-3.5" />
            <span>{{ typeConfig[type]?.label || type }}</span>
          </div>

          <button
            v-for="result in items.slice(0, 4)"
            :key="result.id"
            @click="navigateToResult(result)"
            class="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl transition-colors flex items-center justify-between group"
            type="button"
          >
            <div class="flex-1 min-w-0 pr-3">
              <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors block truncate">
                {{ result.title }}
              </span>
              <p class="text-xs text-slate-400 truncate mt-0.5">{{ result.description }}</p>
            </div>

            <div class="flex items-center gap-2">
              <span :class="['text-[10px] px-2 py-0.5 rounded-md border font-bold whitespace-nowrap', typeConfig[type]?.badgeClass || 'bg-slate-100 text-slate-600']">
                {{ result.category }}
              </span>
              <CornerDownLeft class="w-3.5 h-3.5 text-slate-300 dark:text-slate-500 group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors hidden sm:inline-block" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-transparent z-30"
      @click="closeSearch"
    />
  </div>
</template>
