<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  MapPin,
  Phone,
  Navigation,
  RotateCcw,
  Hospital,
  ShieldAlert,
  Building,
  Bus,
  Compass,
  FileCheck2,
  Clock,
  PhoneCall,
  Search,
  CheckCircle2,
  Map as MapIcon
} from 'lucide-vue-next'
import ServiceHeroBanner from '@/components/ServiceHeroBanner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import LazyImage from '@/components/LazyImage.vue'
import type { LocationItem } from '@/types'
import { useLanguage } from '@/composables/useLanguage'
import { getLocations } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'
import { useLocation } from '@/composables/useLocation'

const { t, localized, currentLanguage } = useLanguage()
const { selectedProvince } = useLocation()

usePageMeta({
  title: 'ទីតាំងរដ្ឋបាលសាធារណៈ & ច្រកចេញចូលតែមួយ (OWSO) — CamLife Civic Offices',
  description: 'ស្វែងរកសាលាខណ្ឌ សាលាសង្កាត់ ការិយាល័យច្រកចេញចូលតែមួយ (OWSO) ប៉ុស្តិ៍នគរបាល និងមន្ទីរពេទ្យរដ្ឋ'
})

const defaultCategoryImages: Record<string, string> = {
  'Hospital': 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
  'Police Station': 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=800&q=80',
  'Government/OWSO': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  'Bus Station': 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
  'Bank/ATM': 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?auto=format&fit=crop&w=800&q=80',
  'Gas Station': 'https://images.unsplash.com/photo-1527018607636-96b010c2627e?auto=format&fit=crop&w=800&q=80',
  'Tourist Attraction': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80'
}

function getLocationImage(loc: LocationItem): string {
  return loc.image || defaultCategoryImages[loc.category] || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
}

const allLocations = getLocations()
const searchQuery = ref('')
const activeCategory = ref('All')
const viewMode = ref<'grid' | 'map'>('grid')
const selectedLocation = ref<LocationItem>(allLocations[0] ?? ({} as LocationItem))

const categories = computed(() => [
  { value: 'All', labelKh: 'គ្រប់ការិយាល័យ & ទីតាំង', labelEn: 'All Public Offices', icon: Compass },
  { value: 'Government/OWSO', labelKh: 'ច្រកចេញចូលតែមួយ & សាលាសង្កាត់ (OWSO)', labelEn: 'OWSO & Communes', icon: Building },
  { value: 'Police Station', labelKh: 'ស្នងការ & ប៉ុស្តិ៍នគរបាល', labelEn: 'Police Stations', icon: ShieldAlert },
  { value: 'Hospital', labelKh: 'មន្ទីរពេទ្យសាធារណៈ', labelEn: 'Public Hospitals', icon: Hospital },
  { value: 'Bus Station', labelKh: 'ស្ថានីយរថយន្តក្រុង', labelEn: 'Public Transit Hubs', icon: Bus }
])

const filteredLocations = computed(() => {
  let result = allLocations

  if (activeCategory.value !== 'All') {
    result = result.filter(l => l.category === activeCategory.value)
  }

  // Location filter (from Global Location Selector in Navbar)
  if (selectedProvince.value && selectedProvince.value.id !== 'all') {
    const provName = selectedProvince.value.name.toLowerCase()
    const provNameKh = selectedProvince.value.nameKh
      ? selectedProvince.value.nameKh.replace('ខេត្ត', '').replace('រាជធានី', '').trim().toLowerCase()
      : ''
    const matched = result.filter(l => {
      const text = (l.address + ' ' + (l.addressKh || '') + ' ' + l.name + ' ' + (l.nameKh || '')).toLowerCase()
      return text.includes(provName) || (provNameKh && text.includes(provNameKh))
    })
    if (matched.length > 0) {
      result = matched
    }
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

watch(filteredLocations, (newVal) => {
  if (newVal.length > 0) {
    selectedLocation.value = newVal[0]
  }
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

function selectOffice(loc: LocationItem) {
  selectedLocation.value = loc
}

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Service Hero Banner with 25 Provinces Selector -->
    <ServiceHeroBanner
      :title="t('locations.title')"
      :subtitle="t('locations.subtitle')"
      badge="Government & OWSO Locator"
      badge-kh="ទីតាំងរដ្ឋបាល & ច្រកចេញចូលតែមួយ (OWSO)"
      banner-image="/images/pillars/locations.jpg"
      :breadcrumb-current="t('nav.locations')"
    />

    <!-- OWSO Citizen Paperwork Guide Callout Banner -->
    <div class="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
      <div class="relative z-10 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shrink-0">
              <FileCheck2 class="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-black tracking-tight">
                  {{ currentLanguage === 'kh' ? 'ការិយាល័យច្រកចេញចូលតែមួយ (One Window Service Office - OWSO)' : 'One Window Service Offices (OWSO) Network' }}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase">
                  {{ currentLanguage === 'kh' ? 'សេវាសាធារណៈរហ័ស' : 'Citizen Services' }}
                </span>
              </div>
              <p class="text-xs text-blue-100 mt-1">
                {{ currentLanguage === 'kh' ? 'ផ្តល់សេវារដ្ឋបាលប្រកបដោយតម្លាភាព គណនេយ្យភាព និងមានតម្លៃកម្រៃសេវាកំណត់ដោយច្បាប់ច្បាស់លាស់៖' : 'Standardized municipal administrative service counters providing transparent fees and turnaround times:' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1 text-xs font-bold text-white">
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'សំបុត្រកំណើត/អាពាហ៍ពិពាហ៍' : 'Civil Registry' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'សៀវភៅស្នាក់នៅ/គ្រួសារ' : 'Residence / Family' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ចុះបញ្ជីអាជីវកម្មខ្នាតតូច' : 'Business Permits' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'លិខិតអនុញ្ញាតសាងសង់' : 'Building Permits' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'បញ្ជាក់នីត្យានុកូលភាព' : 'Document Legalization' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Control Panel & View Mode Switcher -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-4">
      <!-- Search Input + View Toggle Buttons -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសាលាខណ្ឌ, សាលាសង្កាត់, ការិយាល័យច្រកចេញចូលតែមួយ (OWSO), ប៉ុស្តិ៍នគរបាល...' : 'Search OWSO offices, district halls, police stations, hospitals...'"
            class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
          />
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="viewMode = 'grid'"
            type="button"
            class="px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border shadow-2xs"
            :class="viewMode === 'grid'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
          >
            <span>{{ currentLanguage === 'kh' ? '⊞ បញ្ជីកាត' : '⊞ Directory Grid' }}</span>
          </button>
          <button
            @click="viewMode = 'map'"
            type="button"
            class="px-4 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border shadow-2xs"
            :class="viewMode === 'map'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
          >
            <span class="inline-flex items-center gap-1.5"><MapIcon class="w-3.5 h-3.5" /> <span>{{ currentLanguage === 'kh' ? 'ផែនទីទីតាំង' : 'Interactive Map' }}</span></span>
          </button>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            type="button"
            class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border"
            :class="activeCategory === cat.value
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
          >
            <component :is="cat.icon" class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? cat.labelKh : cat.labelEn }}</span>
          </button>
        </div>
      </div>

      <!-- Active Filters Reset -->
      <div
        v-if="searchQuery || activeCategory !== 'All'"
        class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs"
      >
        <span class="text-slate-400 font-medium">
          {{ currentLanguage === 'kh' ? 'តម្រងសកម្ម' : 'Filters Active' }}
        </span>
        <button
          @click="resetFilters"
          class="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset Filters' }}</span>
        </button>
      </div>
    </div>

    <!-- Result Count -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        {{ currentLanguage === 'kh' ? 'រកឃើញការិយាល័យ & ទីតាំងរដ្ឋបាលចំនួន' : 'Found' }}
        <span class="text-[#0A2540] dark:text-white font-black">{{ filteredLocations.length }}</span>
        {{ currentLanguage === 'kh' ? 'កន្លែង' : 'civic locations' }}
      </p>
      <VerificationBadge compact />
    </div>

    <!-- INTERACTIVE MAP VIEW -->
    <div v-if="viewMode === 'map'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <!-- Interactive Real Google Maps -->
      <div class="lg:col-span-8 bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-sm relative min-h-[460px] p-4 flex flex-col justify-between">
        <!-- Map Overlay Header -->
        <div class="flex items-center justify-between z-10 pb-3">
          <span class="px-3 py-1 rounded-xl bg-slate-800/90 text-white text-xs font-bold border border-slate-700 backdrop-blur-md flex items-center gap-1.5">
            <Compass class="w-3.5 h-3.5 text-blue-400" />
            <span>{{ currentLanguage === 'kh' ? `ផែនទី Google Maps ទីតាំងរដ្ឋបាល ${selectedProvince.nameKh}` : `Google Maps: ${selectedProvince.name} Civic Offices` }}</span>
          </span>
          <span class="text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-xl">
            {{ filteredLocations.length }} {{ currentLanguage === 'kh' ? 'ទីតាំង' : 'locations' }}
          </span>
        </div>

        <!-- Real Google Maps Iframe -->
        <div class="relative h-80 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <iframe
            :src="`https://maps.google.com/maps?q=${selectedLocation?.coordinates?.lat || selectedProvince.coordinates.lat},${selectedLocation?.coordinates?.lng || selectedProvince.coordinates.lng}&z=14&output=embed`"
            class="w-full h-full border-0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <!-- Location Quick-Pick Selector Buttons -->
        <div class="pt-3 flex flex-wrap items-center gap-2 z-10">
          <button
            v-for="loc in filteredLocations.slice(0, 6)"
            :key="loc.id"
            @click="selectOffice(loc)"
            type="button"
            class="px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5"
            :class="selectedLocation?.id === loc.id
              ? 'bg-amber-400 text-slate-950 border-amber-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'"
          >
            <Building v-if="loc.category === 'Government/OWSO'" class="w-3 h-3 text-blue-400" />
            <Hospital v-else-if="loc.category === 'Hospital'" class="w-3 h-3 text-emerald-400" />
            <ShieldAlert v-else-if="loc.category === 'Police Station'" class="w-3 h-3 text-rose-400" />
            <Bus v-else class="w-3 h-3 text-amber-400" />
            <span class="truncate max-w-[150px]">{{ localized(loc.name, loc.nameKh) }}</span>
          </button>
        </div>
      </div>

      <!-- Selected Office Details Drawer -->
      <div class="lg:col-span-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm space-y-4 sticky top-6">
        <div v-if="selectedLocation && selectedLocation.id" class="space-y-4">
          <div class="relative h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-700">
            <LazyImage
              :src="getLocationImage(selectedLocation)"
              :alt="localized(selectedLocation.name, selectedLocation.nameKh)"
              img-class="w-full h-44 object-cover"
            />
            <span class="absolute top-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-white/95 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 border border-slate-200/60 shadow-sm backdrop-blur-md">
              {{ selectedLocation.category }}
            </span>
          </div>

          <div>
            <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white leading-snug">
              {{ localized(selectedLocation.name, selectedLocation.nameKh) }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              {{ localized(selectedLocation.description, selectedLocation.descriptionKh) }}
            </p>
          </div>

          <!-- Working Hours -->
          <div class="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700 text-xs space-y-1">
            <div class="flex items-center gap-1.5 text-slate-400 font-bold uppercase text-[10px]">
              <Clock class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ម៉ោងបំពេញការងារ' : 'Office Operating Hours' }}</span>
            </div>
            <p class="font-black text-slate-700 dark:text-slate-200">
              ច័ន្ទ - សុក្រ៖ 8:00 ព្រឹក - 11:30 ព្រឹក | 2:00 រសៀល - 5:00 ល្ងាច
            </p>
          </div>

          <!-- Address -->
          <div class="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
            <MapPin class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span class="leading-relaxed">{{ localized(selectedLocation.address, selectedLocation.addressKh) }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="pt-2 grid grid-cols-2 gap-2 text-xs font-bold">
            <a
              :href="'tel:' + selectedLocation.phone"
              class="py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] border border-slate-200 dark:border-slate-600 flex items-center justify-center gap-1.5 transition-all"
            >
              <PhoneCall class="w-3.5 h-3.5 text-blue-600" />
              <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ' : 'Call' }}</span>
            </a>

            <a
              :href="getDirectionsUrl(selectedLocation)"
              target="_blank"
              rel="noopener noreferrer"
              class="py-2.5 px-3 rounded-xl bg-[#0D47A1] hover:bg-blue-700 text-white flex items-center justify-center gap-1.5 transition-all shadow-2xs"
            >
              <Navigation class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'នាំផ្លូវ' : 'Directions' }}</span>
            </a>
          </div>
        </div>

        <div v-else class="text-center py-12 text-slate-400 text-xs">
          {{ currentLanguage === 'kh' ? 'សូមចុចលើចំណុចផែនទី ដើម្បីមើលព័ត៌មានលម្អិត' : 'Click any map pin to view office details' }}
        </div>
      </div>
    </div>

    <!-- DIRECTORY GRID VIEW -->
    <div v-else class="space-y-6">
      <div v-if="paginatedLocations.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="item in paginatedLocations"
          :key="item.id"
          class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <!-- Representative Image Banner -->
            <div class="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <LazyImage
                :src="getLocationImage(item)"
                :alt="localized(item.name, item.nameKh)"
                img-class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              <!-- Category Badge -->
              <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                <span class="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#0A2540] dark:text-white border border-slate-200/60 shadow-sm backdrop-blur-md flex items-center gap-1.5">
                  <component :is="categories.find(c => c.value === item.category)?.icon || Building" class="w-3.5 h-3.5 text-blue-600" />
                  <span>{{ item.category }}</span>
                </span>

                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-sm">
                  <CheckCircle2 class="w-3 h-3" />
                  <span>Open Today</span>
                </span>
              </div>
            </div>

            <div class="p-6 space-y-3.5">
              <!-- Name & Description -->
              <div>
                <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {{ localized(item.name, item.nameKh) }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {{ localized(item.description, item.descriptionKh) }}
                </p>
              </div>

              <!-- Address Box -->
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700 space-y-1">
                <div class="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <MapPin class="w-3 h-3 text-red-500" />
                  <span>{{ currentLanguage === 'kh' ? 'អាសយដ្ឋានផ្លូវការ' : 'Official Address' }}</span>
                </div>
                <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {{ localized(item.address, item.addressKh) }}
                </p>
              </div>

              <!-- Phone & Schedule -->
              <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <span class="flex items-center gap-1 font-bold">
                  <Clock class="w-3.5 h-3.5 text-blue-600" />
                  <span>8:00 AM - 5:00 PM</span>
                </span>
                <span class="flex items-center gap-1 font-bold text-[#0D47A1] dark:text-blue-400">
                  <Phone class="w-3.5 h-3.5" />
                  <span>{{ item.phone }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div class="px-6 pb-6 pt-0">
            <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <a
                :href="'tel:' + item.phone"
                class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-400"
              >
                <PhoneCall class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ហៅទូរស័ព្ទ' : 'Call Office' }}</span>
              </a>

              <a
                :href="getDirectionsUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0D47A1] dark:text-blue-300 hover:bg-[#0D47A1] hover:text-white dark:hover:bg-blue-600 text-xs font-bold border border-blue-200/70 dark:border-blue-700/60 transition-all cursor-pointer"
              >
                <Navigation class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'នាំផ្លូវលើ Google Maps' : 'Directions' }}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
        <EmptyState
          :title="t('locations.emptyTitle')"
          :subtitle="t('locations.emptySubtitle')"
          :action-label="t('locations.resetSearch')"
          @action="resetFilters"
        />
      </div>

      <!-- Pagination -->
      <PaginationBar
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :showing-from="showingFrom"
        :showing-to="showingTo"
        :total-items="totalItems"
        @page-change="goToPage"
        @prev="prevPage"
        @next="nextPage"
      />
    </div>
  </div>
</template>
