<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()
const { t, localized, currentLanguage } = useLanguage()
const { selectedProvince } = useLocation()

usePageMeta({
  title: 'ទីតាំងរដ្ឋបាលសាធារណៈ & ច្រកចេញចូលតែមួយ (OWSO) — CamLife Civic Offices',
  description: 'ស្វែងរកសាលាខណ្ឌ សាលាសង្កាត់ ការិយាល័យច្រកចេញចូលតែមួយ (OWSO) ប៉ុស្តិ៍នគរបាល និងមន្ទីរពេទ្យរដ្ឋ'
})

const defaultCategoryImages: Record<string, string> = {
  'Hospital': '/images/locations/calmette-hospital.jpg',
  'Police Station': 'https://upload.wikimedia.org/wikipedia/commons/1/10/Tourist_police_Cambodia.jpg',
  'Government/OWSO': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Phnom_Penh_City_hall.JPG',
  'Bus Station': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Buses_lined_up_near_Phnom_Penh_BRT_Night_Market_terminus_station_on_Sisowath_Quay.jpg',
  'Bank/ATM': 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Railway_Station_in_Phnom_Penh.JPG',
  'Gas Station': 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Police_pick-up_truck_in_Cambodia.jpg',
  'Tourist Attraction': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Royal_Palace%2C_Phnom_Penh_Cambodia_1.jpg'
}

function getLocationImage(loc: LocationItem): string {
  return loc.image || defaultCategoryImages[loc.category] || '/images/locations/calmette-hospital.jpg'
}

const allLocations = getLocations()
const searchQuery = ref('')
const activeCategory = ref((route.query.category as string) || 'Government/OWSO')
const viewMode = ref<'grid' | 'map'>('grid')
const selectedLocation = ref<LocationItem>(allLocations[0] ?? ({} as LocationItem))

const categories = computed(() => [
  { value: 'Government/OWSO', labelKh: 'ច្រកចេញចូលតែមួយ & សាលាសង្កាត់ (OWSO)', labelEn: 'OWSO & Communes', icon: Building },
  { value: 'All', labelKh: 'គ្រប់ការិយាល័យ & ទីតាំង', labelEn: 'All Public Offices', icon: Compass },
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
  activeCategory.value = 'Government/OWSO'
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 space-y-5 sm:space-y-8 font-khmer overflow-x-clip min-w-0">
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
    <div class="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-7 shadow-lg relative overflow-hidden">
      <div class="relative z-10 space-y-3.5 sm:space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shrink-0">
              <FileCheck2 class="w-5 h-5 sm:w-6 sm:h-6 text-amber-300" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-sm sm:text-lg font-black tracking-tight">
                  {{ currentLanguage === 'kh' ? 'ការិយាល័យច្រកចេញចូលតែមួយ (One Window Service Office - OWSO)' : 'One Window Service Offices (OWSO) Network' }}
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase shrink-0">
                  {{ currentLanguage === 'kh' ? 'សេវាសាធារណៈរហ័ស' : 'Citizen Services' }}
                </span>
              </div>
              <p class="text-[11px] sm:text-xs text-blue-100 mt-0.5 line-clamp-2 sm:line-clamp-none">
                {{ currentLanguage === 'kh' ? 'ផ្តល់សេវារដ្ឋបាលប្រកបដោយតម្លាភាព គណនេយ្យភាព និងមានតម្លៃកម្រៃសេវាកំណត់ដោយច្បាប់ច្បាស់លាស់៖' : 'Standardized municipal administrative service counters providing transparent fees and turnaround times:' }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1 text-xs font-bold text-white sm:grid sm:grid-cols-3 md:grid-cols-5">
          <div class="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0 whitespace-nowrap text-[11px] sm:text-xs">
            <CheckCircle2 class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'សំបុត្រកំណើត/អាពាហ៍ពិពាហ៍' : 'Civil Registry' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0 whitespace-nowrap text-[11px] sm:text-xs">
            <CheckCircle2 class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'សៀវភៅស្នាក់នៅ/គ្រួសារ' : 'Residence / Family' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0 whitespace-nowrap text-[11px] sm:text-xs">
            <CheckCircle2 class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ចុះបញ្ជីអាជីវកម្មខ្នាតតូច' : 'Business Permits' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0 whitespace-nowrap text-[11px] sm:text-xs">
            <CheckCircle2 class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'លិខិតអនុញ្ញាតសាងសង់' : 'Building Permits' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 shrink-0 whitespace-nowrap text-[11px] sm:text-xs">
            <CheckCircle2 class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'បញ្ជាក់នីត្យានុកូលភាព' : 'Document Legalization' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Filter Control Panel & View Mode Switcher -->
    <div class="scroll-reveal bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-3.5 sm:p-6 shadow-sm space-y-3.5 sm:space-y-4">
      <!-- Search Input + View Toggle Buttons -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
        <div class="flex-1 relative">
          <div class="absolute inset-y-0 left-0 pl-3 sm:pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search class="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសាលាខណ្ឌ, សាលាសង្កាត់, ការិយាល័យច្រកចេញចូលតែមួយ (OWSO), ប៉ុស្តិ៍នគរបាល...' : 'Search OWSO offices, district halls, police stations, hospitals...'"
            class="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs sm:text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
          />
        </div>

        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            @click="viewMode = 'grid'"
            type="button"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border shadow-2xs"
            :class="viewMode === 'grid'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
          >
            <span>{{ currentLanguage === 'kh' ? '⊞ បញ្ជីកាត' : '⊞ Directory Grid' }}</span>
          </button>
          <button
            @click="viewMode = 'map'"
            type="button"
            class="flex-1 sm:flex-none px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-black transition-all cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 border shadow-2xs"
            :class="viewMode === 'map'
              ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'"
          >
            <span class="inline-flex items-center gap-1.5"><MapIcon class="w-3.5 h-3.5" /> <span>{{ currentLanguage === 'kh' ? 'ផែនទីទីតាំង' : 'Interactive Map' }}</span></span>
          </button>
        </div>
      </div>

      <!-- Category Filter Pills (Horizontal Scroll on Mobile) -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            type="button"
            class="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border shrink-0 whitespace-nowrap"
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
        v-if="searchQuery || activeCategory !== 'Government/OWSO'"
        class="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs"
      >
        <span class="text-slate-400 font-medium text-[11px] sm:text-xs truncate mr-2">
          {{ currentLanguage === 'kh' ? 'តម្រងសកម្ម' : 'Filters Active' }}
        </span>
        <button
          @click="resetFilters"
          class="text-[11px] sm:text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 cursor-pointer shrink-0"
        >
          <RotateCcw class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset Filters' }}</span>
        </button>
      </div>
    </div>

    <!-- Result Count Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        {{ currentLanguage === 'kh' ? 'រកឃើញការិយាល័យ & ទីតាំងរដ្ឋបាលចំនួន' : 'Found' }}
        <span class="text-[#0A2540] dark:text-white font-black">{{ filteredLocations.length }}</span>
        {{ currentLanguage === 'kh' ? 'កន្លែង' : 'civic locations' }}
      </p>
      <div class="self-start sm:self-auto">
        <VerificationBadge compact />
      </div>
    </div>

    <!-- INTERACTIVE MAP VIEW -->
    <div v-if="viewMode === 'map'" class="scroll-reveal grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start w-full min-w-0">
      <!-- Interactive Real Google Maps -->
      <div class="lg:col-span-8 bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-800 overflow-hidden shadow-sm relative min-h-[380px] sm:min-h-[460px] p-3 sm:p-4 flex flex-col justify-between min-w-0">
        <!-- Map Overlay Header -->
        <div class="flex items-center justify-between gap-2 z-10 pb-3 flex-wrap sm:flex-nowrap">
          <span class="px-2.5 sm:px-3 py-1 rounded-xl bg-slate-800/90 text-white text-xs font-bold border border-slate-700 backdrop-blur-md flex items-center gap-1.5 truncate">
            <Compass class="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? `ផែនទី Google Maps ទីតាំងរដ្ឋបាល ${selectedProvince.nameKh}` : `Google Maps: ${selectedProvince.name} Civic Offices` }}</span>
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2 py-1 rounded-xl shrink-0">
            {{ filteredLocations.length }} {{ currentLanguage === 'kh' ? 'ទីតាំង' : 'locations' }}
          </span>
        </div>

        <!-- Real Google Maps Iframe -->
        <div class="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-800 shadow-inner">
          <iframe
            :src="`https://maps.google.com/maps?q=${selectedLocation?.coordinates?.lat || selectedProvince.coordinates.lat},${selectedLocation?.coordinates?.lng || selectedProvince.coordinates.lng}&z=14&output=embed`"
            class="w-full h-full border-0"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <!-- Location Quick-Pick Selector Buttons -->
        <div class="pt-2 sm:pt-3 flex items-center gap-1.5 sm:gap-2 z-10 overflow-x-auto no-scrollbar py-0.5">
          <button
            v-for="loc in filteredLocations.slice(0, 6)"
            :key="loc.id"
            @click="selectOffice(loc)"
            type="button"
            class="px-2.5 py-1 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 shrink-0 whitespace-nowrap"
            :class="selectedLocation?.id === loc.id
              ? 'bg-amber-400 text-slate-950 border-amber-400'
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'"
          >
            <Building v-if="loc.category === 'Government/OWSO'" class="w-3 h-3 text-blue-400 shrink-0" />
            <Hospital v-else-if="loc.category === 'Hospital'" class="w-3 h-3 text-emerald-400 shrink-0" />
            <ShieldAlert v-else-if="loc.category === 'Police Station'" class="w-3 h-3 text-rose-400 shrink-0" />
            <Bus v-else class="w-3 h-3 text-amber-400 shrink-0" />
            <span class="truncate max-w-[130px] sm:max-w-[150px]">{{ localized(loc.name, loc.nameKh) }}</span>
          </button>
        </div>
      </div>

      <!-- Selected Office Details Drawer -->
      <div class="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-6 shadow-sm space-y-3.5 sm:space-y-4 sticky top-6 min-w-0">
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

    <!-- DIRECTORY GRID VIEW: 2 Columns on Mobile, 2 on MD, 3 on LG -->
    <div v-else class="space-y-6">
      <div v-if="paginatedLocations.length > 0" class="scroll-reveal grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-6 w-full min-w-0">
        <div
          v-for="(item, itemIdx) in paginatedLocations"
          :key="item.id"
          class="stagger-item stagger-card group bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-w-0"
          :style="{ animationDelay: `${itemIdx * 35}ms` }"
        >
          <div class="min-w-0">
            <!-- Representative Image Banner -->
            <div class="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <LazyImage
                :src="getLocationImage(item)"
                :alt="localized(item.name, item.nameKh)"
                img-class="w-full h-28 sm:h-44 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/20 to-transparent pointer-events-none" />

              <!-- Category Badge & Open Badge -->
              <div class="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-center justify-between gap-1 pointer-events-none">
                <span class="px-1.5 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-black uppercase tracking-wider rounded-lg sm:rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#0A2540] dark:text-white border border-slate-200/60 shadow-2xs backdrop-blur-md flex items-center gap-1 max-w-[65%] truncate">
                  <component :is="categories.find(c => c.value === item.category)?.icon || Building" class="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                  <span class="truncate">{{ item.category }}</span>
                </span>

                <span class="inline-flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold bg-emerald-600 text-white shadow-2xs shrink-0">
                  <CheckCircle2 class="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span class="hidden sm:inline">Open Today</span>
                  <span class="sm:hidden">បើក</span>
                </span>
              </div>
            </div>

            <div class="p-2.5 sm:p-5 space-y-2 sm:space-y-3.5 min-w-0">
              <!-- Name & Description -->
              <div class="min-w-0">
                <h3 class="text-xs sm:text-base font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-tight sm:leading-snug line-clamp-2 min-h-[2rem] sm:min-h-0">
                  {{ localized(item.name, item.nameKh) }}
                </h3>
                <p class="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed line-clamp-1 sm:line-clamp-2">
                  {{ localized(item.description, item.descriptionKh) }}
                </p>
              </div>

              <!-- Address Box -->
              <div class="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700 space-y-0.5 sm:space-y-1 min-w-0">
                <div class="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 truncate">
                  <MapPin class="w-2.5 h-2.5 sm:w-3 sm:h-3 text-red-500 shrink-0" />
                  <span class="truncate">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន' : 'Address' }}</span>
                </div>
                <p class="text-[10px] sm:text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight sm:leading-relaxed line-clamp-2">
                  {{ localized(item.address, item.addressKh) }}
                </p>
              </div>

              <!-- Phone & Schedule -->
              <div class="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 pt-0.5 sm:pt-1">
                <span class="flex items-center gap-1 font-bold truncate">
                  <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-600 shrink-0" />
                  <span class="truncate">8:00 AM - 5:00 PM</span>
                </span>
                <span class="hidden sm:flex items-center gap-1 font-bold text-[#0D47A1] dark:text-blue-400 truncate">
                  <Phone class="w-3.5 h-3.5 shrink-0" />
                  <span class="truncate">{{ item.phone }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div class="p-2.5 sm:p-5 pt-0">
            <div class="pt-2 sm:pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1.5 sm:gap-2">
              <a
                :href="'tel:' + item.phone"
                class="py-1.5 sm:py-2.5 px-1 sm:px-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-all cursor-pointer shadow-2xs"
              >
                <PhoneCall class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0D47A1] dark:text-blue-400 shrink-0" />
                <span>{{ currentLanguage === 'kh' ? 'ហៅ' : 'Call' }}</span>
              </a>

              <a
                :href="getDirectionsUrl(item)"
                target="_blank"
                rel="noopener noreferrer"
                class="py-1.5 sm:py-2.5 px-1 sm:px-2.5 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-2xs hover:shadow-md cursor-pointer"
              >
                <Navigation class="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
                <span>{{ currentLanguage === 'kh' ? 'ផ្លូវ' : 'Maps' }}</span>
              </a>

              <router-link
                :to="'/locations/' + item.id"
                class="flex-1 py-1.5 sm:py-2.5 px-1 sm:px-2.5 rounded-xl sm:rounded-2xl bg-[#0D47A1] hover:bg-blue-700 text-white font-black text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-all shadow-2xs hover:shadow-md cursor-pointer"
              >
                <span>{{ currentLanguage === 'kh' ? 'លម្អិត' : 'Details' }}</span>
              </router-link>
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
