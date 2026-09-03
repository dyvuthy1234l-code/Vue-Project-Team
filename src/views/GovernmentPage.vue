<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileText,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  ChevronRight,
  Clock,
  DollarSign,
  Layers
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServices } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized } = useLanguage()

usePageMeta({
  title: 'Government Services & Civic Guides — CamLife',
  description: 'Verified public procedures and step-by-step guides for Cambodian citizens.'
})

const allServices = getGovernmentServices()
const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => {
  const cats = [...new Set(allServices.map(s => s.category))]
  return [
    { value: 'All', label: t('common.all') },
    ...cats.map(c => ({ value: c, label: c }))
  ]
})

const filteredServices = computed(() => {
  let result = allServices

  if (activeCategory.value !== 'All') {
    result = result.filter(s => s.category === activeCategory.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(s =>
      s.title.toLowerCase().includes(query) ||
      (s.titleKh && s.titleKh.toLowerCase().includes(query)) ||
      s.description.toLowerCase().includes(query) ||
      (s.descriptionKh && s.descriptionKh.toLowerCase().includes(query)) ||
      s.category.toLowerCase().includes(query)
    )
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedServices,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredServices, 6)

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
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
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.government') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('government.title')"
      :subtitle="t('government.subtitle')"
      badge="Official Civic Guides"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('government.searchPlaceholder')" large />

      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          @select="activeCategory = $event"
        />

        <button
          v-if="searchQuery || activeCategory !== 'All'"
          @click="resetFilters"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Result count -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredServices.length }}</span> official civic guides
      </p>
    </div>

    <!-- Modern Government Cards Grid -->
    <div v-if="paginatedServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="service in paginatedServices"
        :key="service.id"
        :to="'/government/' + service.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      >
        <div class="space-y-4">
          <!-- Top Row: Icon, Official Badge, Category -->
          <div class="flex items-start justify-between gap-2">
            <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText class="w-6 h-6" />
            </div>

            <div class="flex flex-col items-end gap-1">
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 border border-blue-200/70 dark:border-blue-900">
                <ShieldCheck class="w-3 h-3 text-emerald-500" />
                <span>Official</span>
              </span>
              <span class="text-[10px] font-semibold text-slate-400">
                {{ service.category }}
              </span>
            </div>
          </div>

          <!-- Service Titles -->
          <div>
            <h3 class="font-bold text-base text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug">
              {{ localized(service.title, service.titleKh) }}
            </h3>
            <p v-if="service.titleKh" class="text-xs font-khmer text-slate-400 dark:text-slate-500 mt-0.5">
              {{ service.titleKh }}
            </p>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
            {{ localized(service.description, service.descriptionKh) }}
          </p>

          <!-- Key Meta Pills: Fee, Time, Steps -->
          <div class="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold">
            <div class="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 truncate">
              <Clock class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span class="truncate">{{ service.processingTime }}</span>
            </div>

            <div class="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50 text-slate-600 dark:text-slate-300 truncate">
              <DollarSign class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span class="truncate">{{ service.fee }}</span>
            </div>
          </div>
        </div>

        <!-- Footer Action -->
        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 flex items-center gap-1">
            <Layers class="w-3.5 h-3.5" />
            <span>{{ service.process.length }} Steps Procedure</span>
          </span>

          <span class="inline-flex items-center gap-1 text-xs font-bold text-[#0D47A1] dark:text-blue-400 group-hover:translate-x-1 transition-transform">
            <span>{{ t('common.viewDetails') }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </span>
        </div>
      </router-link>
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :message="t('common.noResults')"
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
