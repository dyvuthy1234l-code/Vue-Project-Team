<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MapPin,
  Phone,
  Navigation,
  RotateCcw,
  ChevronRight,
  Hospital,
  ShieldAlert,
  Building,
  Fuel,
  Bus,
  Palmtree,
  Compass
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getLocations } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized } = useLanguage()

usePageMeta({
  title: 'Key Locations & Points of Interest — CamLife',
  description: 'Essential public points of interest across Cambodia: hospitals, police stations, transit hubs, and banks.'
})

const allLocations = getLocations()
const searchQuery = ref('')
const activeCategory = ref('All')

const categoryIcons: Record<string, any> = {
  All: Compass,
  Hospital: Hospital,
  'Police Station': ShieldAlert,
  'Bank/ATM': Building,
  'Gas Station': Fuel,
  'Bus Station': Bus,
  'Tourist Attraction': Palmtree
}

const categories = computed(() => [
  { value: 'All', label: t('locations.categories.all'), icon: Compass },
  { value: 'Hospital', label: t('locations.categories.hospital'), icon: Hospital },
  { value: 'Police Station', label: t('locations.categories.policeStation'), icon: ShieldAlert },
  { value: 'Bank/ATM', label: t('locations.categories.bankAtm'), icon: Building },
  { value: 'Gas Station', label: t('locations.categories.gasStation'), icon: Fuel },
  { value: 'Bus Station', label: t('locations.categories.busStation'), icon: Bus },
  { value: 'Tourist Attraction', label: t('locations.categories.touristAttraction'), icon: Palmtree }
])

const filteredLocations = computed(() => {
  let result = allLocations

  if (activeCategory.value !== 'All') {
    result = result.filter(l => l.category === activeCategory.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(l =>
      l.name.toLowerCase().includes(query) ||
      (l.nameKh && l.nameKh.toLowerCase().includes(query)) ||
      l.address.toLowerCase().includes(query) ||
      (l.addressKh && l.addressKh.toLowerCase().includes(query)) ||
      l.description.toLowerCase().includes(query) ||
      (l.descriptionKh && l.descriptionKh.toLowerCase().includes(query)) ||
      l.category.toLowerCase().includes(query)
    )
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedLocations,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredLocations, 6)

function getDirectionsUrl(location: { coordinates: { lat: number; lng: number }; address: string }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`
}

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
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.locations') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('locations.title')"
      :subtitle="t('locations.subtitle')"
      badge="Points of Interest"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('locations.searchPlaceholder')" large />

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

    <!-- Result Count -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredLocations.length }}</span> points of interest
      </p>
    </div>

    <!-- Location Cards Grid -->
    <div v-if="paginatedLocations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="loc in paginatedLocations"
        :key="loc.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      >
        <div class="space-y-3">
          <!-- Top Row: Icon & Category Badge -->
          <div class="flex items-center justify-between">
            <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <component :is="categoryIcons[loc.category] || MapPin" class="w-5 h-5" />
            </div>
            <span class="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
              {{ loc.category }}
            </span>
          </div>

          <!-- Name & Khmer Name -->
          <div>
            <h3 class="font-bold text-base text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug">
              {{ localized(loc.name, loc.nameKh) }}
            </h3>
            <p v-if="loc.nameKh" class="text-xs font-khmer text-slate-400 dark:text-slate-500 mt-0.5">
              {{ loc.nameKh }}
            </p>
          </div>

          <!-- Address -->
          <div class="flex items-start gap-2 text-xs text-slate-500 dark:text-slate-400">
            <MapPin class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0 mt-0.5" />
            <span class="leading-relaxed">{{ localized(loc.address, loc.addressKh) }}</span>
          </div>

          <!-- Description -->
          <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
            {{ localized(loc.description, loc.descriptionKh) }}
          </p>
        </div>

        <!-- Action Row -->
        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
          <a
            v-if="loc.phone"
            :href="'tel:' + loc.phone"
            class="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-400 flex items-center gap-1"
          >
            <Phone class="w-3.5 h-3.5 text-emerald-600" />
            <span>{{ loc.phone }}</span>
          </a>
          <div v-else />

          <a
            :href="getDirectionsUrl(loc)"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 hover:bg-[#0D47A1] text-[#0D47A1] dark:text-blue-300 hover:text-white dark:hover:text-white text-xs font-bold transition-colors"
          >
            <Navigation class="w-3.5 h-3.5" />
            <span>Directions</span>
          </a>
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
