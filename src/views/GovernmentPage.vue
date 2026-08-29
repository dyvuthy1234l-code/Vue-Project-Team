<script setup lang="ts">
import { ref, computed } from 'vue'
import { FileText, ArrowRight, ShieldCheck, RotateCcw } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServices } from '@/services/dataService'

const { t, localized } = useLanguage()

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
      s.description.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query)
    )
  }

  return result
})

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <SectionHeader
      :title="t('government.title')"
      :subtitle="t('government.subtitle')"
      badge="Official Civic Guides"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('government.searchPlaceholder')" large />

      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          @select="activeCategory = $event"
        />

        <button
          v-if="searchQuery || activeCategory !== 'All'"
          @click="resetFilters"
          class="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Cards Grid -->
    <div v-if="filteredServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <router-link
        v-for="service in filteredServices"
        :key="service.id"
        :to="'/government/' + service.id"
        class="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-camlife-action group-hover:bg-camlife-action group-hover:text-white transition-colors">
              <FileText class="w-6 h-6" />
            </div>
            <span class="px-3 py-1 bg-slate-100 text-slate-600 text-[11px] font-bold rounded-full">
              {{ service.category }}
            </span>
          </div>

          <div>
            <h3 class="font-extrabold text-camlife-navy text-lg group-hover:text-camlife-action transition-colors leading-snug">
              {{ localized(service.title, service.titleKh) }}
            </h3>
            <p class="text-xs text-slate-600 line-clamp-2 mt-2 leading-relaxed">
              {{ localized(service.description, service.descriptionKh) }}
            </p>
          </div>

          <!-- Document Preview pill -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs space-y-1">
            <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Processing Time</span>
            <span class="font-bold text-slate-700 block">{{ localized(service.processingTime, service.processingTimeKh) }}</span>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-camlife-action">
          <span class="flex items-center gap-1 text-slate-500 font-medium">
            <ShieldCheck class="w-4 h-4 text-emerald-500" /> Official Guide
          </span>
          <span class="inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
            <span>View Guide</span>
            <ArrowRight class="w-4 h-4" />
          </span>
        </div>
      </router-link>
    </div>

    <EmptyState v-else :message="t('government.noResults')" @reset="resetFilters" />
  </div>
</template>
