<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Clock,
  DollarSign,
  Info,
  Route,
  Compass,
  Bus,
  Car,
  Train,
  Plane,
  Ship,
  ChevronRight,
  RotateCcw,
  CheckCircle2,
  ArrowRight
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getTransport } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized } = useLanguage()

usePageMeta({
  title: 'Transport & Transit Guide — CamLife',
  description: 'Cambodian public buses, provincial transit lines, airport shuttles, and schedules.'
})

const allTransport = getTransport()
const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => [
  { value: 'All', label: t('transport.categories.all'), icon: Compass },
  { value: 'bus', label: t('transport.categories.bus'), icon: Bus },
  { value: 'taxi', label: t('transport.categories.taxi'), icon: Car },
  { value: 'train', label: t('transport.categories.train'), icon: Train },
  { value: 'plane', label: t('transport.categories.plane'), icon: Plane },
  { value: 'ferry', label: t('transport.categories.ferry'), icon: Ship },
])

const filteredTransport = computed(() => {
  let result = allTransport

  if (activeCategory.value !== 'All') {
    result = result.filter(t => t.type === activeCategory.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(t =>
      t.name.toLowerCase().includes(query) ||
      (t.nameKh && t.nameKh.toLowerCase().includes(query)) ||
      t.description.toLowerCase().includes(query) ||
      (t.descriptionKh && t.descriptionKh.toLowerCase().includes(query)) ||
      t.route.toLowerCase().includes(query) ||
      t.type.toLowerCase().includes(query)
    )
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedTransport,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredTransport, 6)

const typeStyles: Record<string, { icon: any; badge: string }> = {
  bus: { icon: Bus, badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200' },
  taxi: { icon: Car, badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200' },
  train: { icon: Train, badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200' },
  plane: { icon: Plane, badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200' },
  ferry: { icon: Ship, badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200' }
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
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.transport') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('transport.title')"
      :subtitle="t('transport.subtitle')"
      badge="Travel & Transit Guide"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <SearchBar v-model="searchQuery" placeholder="Search routes, bus stations, transit lines..." large />

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
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredTransport.length }}</span> transit routes & options
      </p>
    </div>

    <!-- Transport Options Grid -->
    <div v-if="paginatedTransport.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="item in paginatedTransport"
        :key="item.id"
        class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      >
        <div class="space-y-4">
          <!-- Top Row: Type Badge + Status -->
          <div class="flex items-center justify-between">
            <span :class="['px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border flex items-center gap-1.5', typeStyles[item.type]?.badge || 'bg-slate-100 text-slate-700 border-slate-200']">
              <component :is="typeStyles[item.type]?.icon || Bus" class="w-3.5 h-3.5" />
              <span>{{ item.type }}</span>
            </span>

            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
              <CheckCircle2 class="w-3 h-3" />
              <span>Active Service</span>
            </span>
          </div>

          <!-- Title & Subtitle -->
          <div>
            <h3 class="text-lg font-bold text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors">
              {{ localized(item.name, item.nameKh) }}
            </h3>
            <p v-if="item.nameKh" class="text-xs font-khmer text-slate-400 dark:text-slate-500 mt-0.5">
              {{ item.nameKh }}
            </p>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-2">
              {{ localized(item.description, item.descriptionKh) }}
            </p>
          </div>

          <!-- Schedule & Route Details -->
          <div class="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <div v-if="item.route" class="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50">
              <Route class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <span class="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">{{ t('transport.route') }}</span>
                <span class="font-bold text-slate-800 dark:text-white leading-snug">{{ item.route }}</span>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div v-if="item.schedule" class="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50">
                <Clock class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <div>
                  <span class="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">{{ t('transport.schedule') }}</span>
                  <span class="font-semibold text-slate-800 dark:text-white text-xs leading-snug">{{ item.schedule }}</span>
                </div>
              </div>

              <div v-if="item.price" class="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50">
                <!-- Subtle Orange Accent on Price -->
                <DollarSign class="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
                <div>
                  <span class="font-bold text-slate-400 text-[10px] uppercase tracking-wider block">{{ t('transport.price') }}</span>
                  <span class="font-bold text-[#0A2540] dark:text-white text-xs leading-snug">{{ item.price }}</span>
                </div>
              </div>
            </div>

            <!-- Useful Information Pill -->
            <div v-if="item.usefulInformation" class="p-3 bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 rounded-xl text-xs flex items-start gap-2">
              <Info class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0 mt-0.5" />
              <p class="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                {{ localized(item.usefulInformation, item.usefulInformationKh) }}
              </p>
            </div>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
          <span>📍 {{ item.location }}</span>
          <span class="text-[#0D47A1] dark:text-blue-400 font-bold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
            <span>Route Details</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </span>
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
