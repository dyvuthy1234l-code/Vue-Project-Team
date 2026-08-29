<script setup lang="ts">
import { ref, computed } from 'vue'
import { Phone, Star, MapPin, ShieldCheck, RotateCcw } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHomeServices } from '@/services/dataService'

const { t, localized } = useLanguage()

const allServices = getHomeServices()
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
      s.serviceName.toLowerCase().includes(query) ||
      s.provider.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.location.toLowerCase().includes(query)
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
      :title="t('homeServicesPage.title')"
      :subtitle="t('homeServicesPage.subtitle')"
      badge="Local Service Network"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('homeServicesPage.searchPlaceholder')" large />

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

    <!-- Provider Cards Grid -->
    <div v-if="filteredServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in filteredServices"
        :key="service.id"
        class="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
      >
        <div>
          <!-- Header Banner -->
          <div class="h-36 bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-4 flex flex-col justify-between text-white relative overflow-hidden">
            <div class="flex justify-between items-start z-10">
              <span class="px-3 py-1 bg-white/90 text-amber-800 text-[11px] font-bold rounded-full uppercase tracking-wider">
                {{ service.category }}
              </span>
              <div class="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
                <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{{ service.rating }}</span>
              </div>
            </div>

            <div class="z-10 flex items-center space-x-2 text-xs font-semibold text-amber-100">
              <ShieldCheck class="w-4 h-4 text-emerald-300" />
              <span>Verified Technician</span>
            </div>

            <div class="absolute -right-4 -bottom-4 text-white/10 font-black text-6xl pointer-events-none">
              REPAIR
            </div>
          </div>

          <div class="p-5 space-y-3">
            <h3 class="font-extrabold text-camlife-navy text-lg leading-snug group-hover:text-camlife-action transition-colors">
              {{ localized(service.serviceName, service.serviceNameKh) }}
            </h3>

            <p class="text-xs font-bold text-slate-500 flex items-center gap-1">
              <span>Provider:</span>
              <span class="text-slate-800">{{ service.provider }}</span>
            </p>

            <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {{ localized(service.description, service.descriptionKh) }}
            </p>

            <div class="flex items-center space-x-1.5 text-xs text-slate-500 pt-2 border-t border-slate-100">
              <MapPin class="w-3.5 h-3.5 text-camlife-action" />
              <span>{{ service.location }}</span>
            </div>
          </div>
        </div>

        <div class="p-5 pt-0">
          <a
            :href="'tel:' + service.phone.replace(/\s/g, '')"
            class="flex items-center justify-center space-x-2 w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all"
          >
            <Phone class="w-4 h-4" />
            <span>{{ t('homeServicesPage.contact') }} ({{ service.phone }})</span>
          </a>
        </div>
      </div>
    </div>

    <EmptyState v-else :message="t('homeServicesPage.noResults')" @reset="resetFilters" />
  </div>
</template>
