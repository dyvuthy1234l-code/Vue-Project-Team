<script setup lang="ts">
import { ref, computed } from 'vue'
import { MapPin, Phone, Navigation, RotateCcw } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getLocations } from '@/services/dataService'

const { t, localized } = useLanguage()

const allLocations = getLocations()
const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => [
  { value: 'All', label: t('locations.categories.all') },
  { value: 'Hospital', label: t('locations.categories.hospital') },
  { value: 'Police Station', label: t('locations.categories.policeStation') },
  { value: 'Bank/ATM', label: t('locations.categories.bankAtm') },
  { value: 'Gas Station', label: t('locations.categories.gasStation') },
  { value: 'Bus Station', label: t('locations.categories.busStation') },
  { value: 'Tourist Attraction', label: t('locations.categories.touristAttraction') },
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
      l.address.toLowerCase().includes(query) ||
      l.description.toLowerCase().includes(query) ||
      l.category.toLowerCase().includes(query)
    )
  }

  return result
})

function getDirectionsUrl(location: { coordinates: { lat: number; lng: number }; address: string }) {
  return `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`
}

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <SectionHeader
      :title="t('locations.title')"
      :subtitle="t('locations.subtitle')"
      badge="Cambodian Points of Interest"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('locations.searchPlaceholder')" large />

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

    <!-- Location Cards Grid -->
    <div v-if="filteredLocations.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="location in filteredLocations"
        :key="location.id"
        class="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <span class="px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-bold rounded-full">
              {{ location.category }}
            </span>

            <a
              :href="getDirectionsUrl(location)"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-camlife-action hover:bg-camlife-action-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Navigation class="w-3.5 h-3.5" />
              <span>{{ t('locations.getDirections') }}</span>
            </a>
          </div>

          <div>
            <h3 class="font-extrabold text-camlife-navy text-lg group-hover:text-camlife-action transition-colors leading-snug">
              {{ localized(location.name, location.nameKh) }}
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mt-1">
              {{ localized(location.description, location.descriptionKh) }}
            </p>
          </div>

          <!-- Metadata -->
          <div class="space-y-2 pt-3 border-t border-slate-100 text-xs">
            <div class="flex items-start space-x-2.5 text-slate-600">
              <MapPin class="w-4 h-4 text-camlife-action mt-0.5 flex-shrink-0" />
              <span class="font-semibold">{{ localized(location.address, location.addressKh) }}</span>
            </div>

            <div v-if="location.phone" class="flex items-center space-x-2.5 text-slate-600">
              <Phone class="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <a :href="'tel:' + location.phone.replace(/\s/g, '')" class="font-bold text-camlife-action hover:underline">
                {{ location.phone }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState v-else :message="t('locations.noResults')" @reset="resetFilters" />
  </div>
</template>
