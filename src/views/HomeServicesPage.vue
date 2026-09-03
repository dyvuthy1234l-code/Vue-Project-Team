<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Phone,
  Star,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Wrench,
  Sparkles,
  Droplets,
  Zap,
  Wifi,
  Wind,
  ChevronRight
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHomeServices } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized } = useLanguage()

usePageMeta({
  title: 'Home & Utility Services — CamLife',
  description: 'Verified electricians, plumbers, aircon technicians, internet, and cleaners in Cambodia.'
})

const allServices = getHomeServices()
const searchQuery = ref('')
const activeCategory = ref('All')
const activeLocation = ref('All')

const categoryIcons: Record<string, any> = {
  All: Wrench,
  Cleaning: Sparkles,
  Plumbing: Droplets,
  Electricity: Zap,
  Internet: Wifi,
  'Air Conditioning': Wind
}

const categories = computed(() => {
  const cats = [...new Set(allServices.map(s => s.category))]
  return [
    { value: 'All', label: t('common.all'), icon: Wrench },
    ...cats.map(c => ({ value: c, label: c, icon: categoryIcons[c] || Wrench }))
  ]
})

const locations = computed(() => {
  return ['All', ...new Set(allServices.map(s => s.location))]
})

const filteredServices = computed(() => {
  let result = allServices

  if (activeCategory.value !== 'All') {
    result = result.filter(s => s.category === activeCategory.value)
  }

  if (activeLocation.value !== 'All') {
    result = result.filter(s => s.location === activeLocation.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(s =>
      s.serviceName.toLowerCase().includes(query) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(query)) ||
      s.provider.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      (s.descriptionKh && s.descriptionKh.toLowerCase().includes(query)) ||
      s.location.toLowerCase().includes(query)
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
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.homeServices') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('homeServicesPage.title')"
      :subtitle="t('homeServicesPage.subtitle')"
      badge="Verified Home Services"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row gap-3">
        <div class="flex-1">
          <SearchBar v-model="searchQuery" :placeholder="t('homeServicesPage.searchPlaceholder')" large />
        </div>

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

    <!-- Result Count -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredServices.length }}</span> verified providers
      </p>
    </div>

    <!-- Provider Cards Grid -->
    <div v-if="paginatedServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in paginatedServices"
        :key="service.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <!-- Card Image / Header Banner -->
          <div class="relative aspect-[16/10] bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <LazyImage
              v-if="service.image"
              :src="service.image"
              :alt="localized(service.serviceName, service.serviceNameKh)"
              img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              class="w-full h-full"
            />
            <div v-else class="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400">
              <Wrench class="w-10 h-10 opacity-40" />
            </div>

            <!-- Category & Rating Overlays -->
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
              <span class="px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#0891B2] dark:text-cyan-400 text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-xs">
                {{ service.category }}
              </span>

              <div class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-xs">
                <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{{ service.rating.toFixed(1) }}</span>
              </div>
            </div>

            <!-- Availability Badge Bottom Left -->
            <div class="absolute bottom-3 left-3 pointer-events-none">
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-xs">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available Daily</span>
              </span>
            </div>
          </div>

          <!-- Content Details -->
          <div class="p-5 space-y-3">
            <div>
              <h3 class="font-bold text-base text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
                {{ localized(service.serviceName, service.serviceNameKh) }}
              </h3>
              <p v-if="service.serviceNameKh" class="text-xs font-khmer text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                {{ service.serviceNameKh }}
              </p>
            </div>

            <!-- Provider & Location Row -->
            <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span class="font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
                <span>{{ service.provider }}</span>
              </span>
              <span>·</span>
              <span class="flex items-center gap-1">
                <MapPin class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400 shrink-0" />
                <span>{{ service.location }}</span>
              </span>
            </div>

            <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
              {{ localized(service.description, service.descriptionKh) }}
            </p>
          </div>
        </div>

        <!-- Contact Action Buttons -->
        <div class="p-5 pt-0">
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <a
              :href="'tel:' + service.phone"
              class="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#0D47A1] hover:bg-[#1565C0] text-white transition-colors shadow-xs"
            >
              <Phone class="w-3.5 h-3.5" />
              <span>Call Provider ({{ service.phone }})</span>
            </a>
          </div>
        </div>
      </div>
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
