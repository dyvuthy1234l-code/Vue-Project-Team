<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { Search, X, CornerDownLeft } from 'lucide-vue-next'
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

const typeLabels: Record<string, string> = {
  hospital: 'Healthcare',
  government: 'Government Service',
  job: 'Job Opportunity',
  'home-service': 'Home Service',
  transport: 'Transport & Travel',
  news: 'News & Advisory',
  location: 'Important Location'
}

const typeColors: Record<string, string> = {
  hospital: 'bg-red-50 text-red-700 border-red-200',
  government: 'bg-blue-50 text-blue-700 border-blue-200',
  job: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'home-service': 'bg-amber-50 text-amber-700 border-amber-200',
  transport: 'bg-purple-50 text-purple-700 border-purple-200',
  news: 'bg-pink-50 text-pink-700 border-pink-200',
  location: 'bg-indigo-50 text-indigo-700 border-indigo-200'
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
      <div class="absolute left-4.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-slate-400 group-focus-within:text-camlife-action transition-colors">
        <Search :class="large ? 'w-6 h-6' : 'w-5 h-5'" />
      </div>

      <input
        v-model="query"
        type="text"
        :placeholder="placeholder || 'What do you need today?'"
        :class="[
          'w-full pl-13 pr-12 border bg-white/95 text-camlife-navy placeholder:text-slate-400 rounded-2xl shadow-dropdown focus:outline-none focus:ring-4 focus:ring-camlife-action/20 focus:border-camlife-action transition-all duration-200',
          large ? 'py-4 text-base sm:text-lg font-medium border-slate-200/90' : 'py-3 text-sm border-slate-200'
        ]"
        @focus="isOpen = query.length >= 2"
      />

      <button
        v-if="query"
        @click="closeSearch"
        class="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Clear search"
        type="button"
      >
        <X class="w-5 h-5" />
      </button>
    </div>

    <!-- Results Dropdown -->
    <div
      v-if="isOpen && query.length >= 2"
      class="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-dropdown border border-slate-200/90 max-h-100 overflow-y-auto z-50 divide-y divide-slate-100 animate-fadeIn"
    >
      <div v-if="results.length === 0" class="p-8 text-center">
        <div class="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
          <Search class="w-6 h-6" />
        </div>
        <p class="text-camlife-navy font-semibold text-sm mb-1">No matches found for "{{ query }}"</p>
        <p class="text-xs text-camlife-muted">Try searching with different keywords such as "Hospital", "Passport", or "Electrician".</p>
      </div>

      <div v-else>
        <div v-for="(items, type) in groupedResults" :key="type" class="p-2">
          <div class="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            {{ typeLabels[type] || type }}
          </div>

          <button
            v-for="result in items.slice(0, 4)"
            :key="result.id"
            @click="navigateToResult(result)"
            class="w-full text-left px-3.5 py-3 hover:bg-camlife-light/60 rounded-xl transition-all flex items-center justify-between group/item"
          >
            <div class="flex-1 min-w-0 pr-3">
              <div class="flex items-center space-x-2">
                <span class="text-sm font-bold text-camlife-navy group-hover/item:text-camlife-action transition-colors truncate">
                  {{ result.title }}
                </span>
              </div>
              <p class="text-xs text-slate-500 truncate mt-0.5">{{ result.description }}</p>
            </div>

            <div class="flex items-center space-x-2">
              <span :class="['text-[11px] px-2.5 py-0.5 rounded-full border font-semibold whitespace-nowrap', typeColors[type] || 'bg-slate-100 text-slate-700 border-slate-200']">
                {{ result.category }}
              </span>
              <CornerDownLeft class="w-3.5 h-3.5 text-slate-300 group-hover/item:text-camlife-action transition-colors hidden sm:inline-block" />
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Backdrop overlay -->
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-slate-900/10 backdrop-blur-xs z-30"
      @click="closeSearch"
    />
  </div>
</template>
