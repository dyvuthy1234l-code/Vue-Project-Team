<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  MapPin,
  RotateCcw,
  HeartPulse,
  Hospital as HospitalIcon,
  Stethoscope,
  Pill,
  Search,
  PhoneCall,
  ShieldCheck,
  Building2,
  Ambulance,
  BadgeCheck,
  CheckCircle2,
  SlidersHorizontal,
  ArrowRight,
  Navigation,
  Star,
  FileText,
  ExternalLink,
  X,
  Check
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'
import { useLocation } from '@/composables/useLocation'
import type { Hospital } from '@/types'

const router = useRouter()

const { t, currentLanguage, localized } = useLanguage()
const { selectedProvince } = useLocation()

usePageMeta({
  title: 'សេវាសុខាភិបាល និងមន្ទីរពេទ្យ — CamLife Healthcare Directory',
  description: 'ស្វែងរកមន្ទីរពេទ្យរដ្ឋ និងឯកជន គ្លីនិកឯកទេស ឱសថស្ថានស្របច្បាប់ និងសង្គ្រោះបន្ទាន់ ២៤/៧ ទូទាំងកម្ពុជា'
})

const allHospitals = getHospitals()
const searchQuery = ref('')
const activePill = ref('all')
const activeLocation = ref('All')
const sortBy = ref<'rating' | 'reviews' | 'name'>('rating')
const viewMode = ref<'grid' | 'map'>('grid')



// Quick Filter Chips tailored for Cambodian citizens
const quickChips = computed(() => [
  { id: 'all', label: 'All Facilities', labelKh: 'ទាំងអស់', icon: HeartPulse },
  { id: 'public', label: 'Public Hospitals', labelKh: 'មន្ទីរពេទ្យរដ្ឋ', icon: Building2 },
  { id: 'private', label: 'Private Hospitals', labelKh: 'មន្ទីរពេទ្យឯកជន', icon: HospitalIcon },
  { id: 'clinic', label: 'Clinics', labelKh: 'គ្លីនិកឯកទេស', icon: Stethoscope },
  { id: 'pharmacy', label: 'Pharmacies', labelKh: 'ឱសថស្ថានស្របច្បាប់', icon: Pill },
  { id: 'nssf', label: 'NSSF Accepted', labelKh: 'ទទួលប័ណ្ណ ប.ស.ស', icon: ShieldCheck },
  { id: '24-7', label: '24/7 Emergency', labelKh: 'សង្គ្រោះបន្ទាន់ ២៤/៧', icon: Ambulance },
  { id: 'top-rated', label: 'Top Rated 4.5+', labelKh: 'ពិន្ទុ ៤.៥+', icon: Star }
])

const filteredHospitals = computed(() => {
  let result = [...allHospitals]

  // Location filter (from Global Location Selector in Navbar)
  if (selectedProvince.value && selectedProvince.value.id !== 'all') {
    const prov = selectedProvince.value
    const engName = (prov.name || '').toLowerCase()
    const khName = prov.nameKh
      ? prov.nameKh.replace('ខេត្ត', '').replace('រាជធានី', '').trim().toLowerCase()
      : ''

    const matched = result.filter(h => {
      const loc = (h.location || '').toLowerCase()
      const addr = (h.address || '').toLowerCase()
      const addrKh = (h.addressKh || '').toLowerCase()
      return (
        loc.includes(engName) ||
        (khName && (loc.includes(khName) || addrKh.includes(khName))) ||
        addr.includes(engName)
      )
    })
    result = matched
  }

  // Quick Chips filter
  if (activePill.value === 'public') {
    result = result.filter(h => h.ownership === 'public' || h.category === 'hospital' && (
      h.name.toLowerCase().includes('calmette') ||
      h.name.toLowerCase().includes('friendship') ||
      h.name.toLowerCase().includes('kossamak') ||
      h.name.toLowerCase().includes('angkor') ||
      h.name.toLowerCase().includes('provincial') ||
      h.name.toLowerCase().includes('pediatric')
    ))
  } else if (activePill.value === 'private') {
    result = result.filter(h => h.category === 'hospital' && h.ownership === 'private')
  } else if (activePill.value === 'clinic') {
    result = result.filter(h => h.category === 'clinic')
  } else if (activePill.value === 'pharmacy') {
    result = result.filter(h => h.category === 'pharmacy')
  } else if (activePill.value === 'nssf') {
    result = result.filter(h => h.acceptsNssf === true)
  } else if (activePill.value === '24-7') {
    result = result.filter(h => h.openingHours.toLowerCase().includes('24/7'))
  } else if (activePill.value === 'top-rated') {
    result = result.filter(h => h.rating >= 4.5)
  }

  // Keyword search
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(h =>
      h.name.toLowerCase().includes(query) ||
      (h.nameKh && h.nameKh.toLowerCase().includes(query)) ||
      h.description.toLowerCase().includes(query) ||
      (h.descriptionKh && h.descriptionKh.toLowerCase().includes(query)) ||
      h.location.toLowerCase().includes(query) ||
      (h.addressKh && h.addressKh.toLowerCase().includes(query)) ||
      (h.address && h.address.toLowerCase().includes(query)) ||
      h.services.some(s => s.toLowerCase().includes(query))
    )
  }

  // Sort
  if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'reviews') {
    result.sort((a, b) => b.reviews - a.reviews)
  } else if (sortBy.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  }

  return result
})

// Pagination (6 per page in Grid view)
const {
  currentPage,
  totalPages,
  paginatedItems: paginatedHospitals,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredHospitals, 6)

const selectedMapHospital = ref<Hospital>(allHospitals[0])

watch(
  filteredHospitals,
  (newVal) => {
    if (newVal && newVal.length > 0) {
      if (!selectedMapHospital.value || !newVal.some(h => h.id === selectedMapHospital.value.id)) {
        selectedMapHospital.value = newVal[0]
      }
    }
  },
  { immediate: true }
)

const mapEmbedUrl = computed(() => {
  if (selectedMapHospital.value?.coordinates?.lat && selectedMapHospital.value?.coordinates?.lng) {
    return `https://www.google.com/maps?q=${selectedMapHospital.value.coordinates.lat},${selectedMapHospital.value.coordinates.lng}&z=15&output=embed`
  }
  const provCoords = selectedProvince.value?.coordinates
  if (provCoords?.lat && provCoords?.lng) {
    return `https://www.google.com/maps?q=${provCoords.lat},${provCoords.lng}&z=13&output=embed`
  }
  return 'https://www.google.com/maps?q=Phnom+Penh+Cambodia&z=13&output=embed'
})

const directionsUrl = computed(() => {
  if (selectedMapHospital.value?.coordinates?.lat && selectedMapHospital.value?.coordinates?.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${selectedMapHospital.value.coordinates.lat},${selectedMapHospital.value.coordinates.lng}`
  }
  if (selectedMapHospital.value?.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMapHospital.value.address)}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedMapHospital.value?.name || 'Hospital')}`
})

function selectQuickPill(pillId: string) {
  activePill.value = pillId
  scrollToResults()
}

function handleSearch() {
  scrollToResults()
}

function resetFilters() {
  searchQuery.value = ''
  activePill.value = 'all'
  activeLocation.value = 'All'
  sortBy.value = 'rating'
}

function scrollToResults() {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('healthcare-results-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

function getDirectionsUrl(hosp: Hospital) {
  if (hosp.coordinates?.lat && hosp.coordinates?.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${hosp.coordinates.lat},${hosp.coordinates.lng}`
  }
  if (hosp.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hosp.address)}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hosp.name + ' ' + (hosp.location || 'Cambodia'))}`
}

// 3 Essential Guidelines Interactivity & Modals
const isDocModalOpen = ref(false)
const isNssfModalOpen = ref(false)

const nssfHospitalsCount = computed(() => allHospitals.filter(h => h.acceptsNssf).length)

function openEmergency() {
  router.push('/emergency')
}

function filterByNssf() {
  activePill.value = 'nssf'
  isNssfModalOpen.value = false
  scrollToResults()
}

function openNssfModal() {
  isNssfModalOpen.value = true
}

function openDocModal() {
  isDocModalOpen.value = true
}

// Checklist state for documents modal
const checkedDocs = ref<Record<string, boolean>>({
  idCard: false,
  nssfCard: false,
  healthBook: false,
  medications: false,
  allergyCard: false,
  emergencyContact: false
})

function toggleDoc(key: string) {
  checkedDocs.value[key] = !checkedDocs.value[key]
}

function resetDocChecklist() {
  for (const k in checkedDocs.value) {
    checkedDocs.value[k] = false
  }
}
</script>

<template>
  <div class="health-page-container min-h-screen pb-16 text-[#0A2540] dark:text-white font-khmer">
    <!-- Ambient Background Glow -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-gradient-to-b from-blue-100/50 via-teal-50/30 to-transparent dark:from-blue-950/25 dark:via-teal-950/15 dark:to-transparent" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
      <!-- FLAGSHIP ROYAL MEDICAL HERO BANNER -->
      <section class="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/20 border border-blue-900/30 bg-[#061838] text-white">
        <!-- Background Modern Medical Visual with High-End Overlay -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/pillars/health.jpg"
            alt="Modern Hospital Architecture"
            class="w-full h-full object-cover object-center lg:object-right opacity-30 filter contrast-125"
            @error="($event.target as HTMLImageElement).src = '/images/pillars/government-hero.jpg'"
          />
          <!-- Deep Royal Medical Gradient (Seamless navy to clear facade) -->
          <div class="absolute inset-0 bg-gradient-to-r from-[#051532] via-[#051532]/95 via-50% to-[#051532]/40" />
          <div class="absolute inset-0 bg-gradient-to-t from-[#051532] via-transparent to-[#051532]/50 lg:hidden" />
        </div>

        <!-- Ambient Glow Orbs -->
        <div class="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />
        <div class="pointer-events-none absolute left-1/2 -bottom-24 h-64 w-64 rounded-full bg-emerald-500/15 blur-3xl" />

        <!-- Inner Content Container -->
        <div class="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">


          <!-- Main Banner Header Content -->
          <div class="max-w-3xl space-y-3.5">
            <!-- Authority Badges -->
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black backdrop-blur-md shadow-xs">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span class="inline-flex items-center gap-1.5"><Landmark class="w-3.5 h-3.5 text-[#D4AF37]" /> <span>ព្រះរាជាណាចក្រកម្ពុជា • {{ currentLanguage === 'kh' ? 'បញ្ជីរាយនាមសុខាភិបាលផ្លូវការ' : 'Verified Cambodian Healthcare Directory' }}</span></span>
              </div>

              <div class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold text-white/90 backdrop-blur-xs">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
                <span>{{ currentLanguage === 'kh' ? 'ស្ដង់ដារវេជ្ជសាស្ត្រ ១០០%' : '100% Licensed & Verified' }}</span>
              </div>
            </div>

            <!-- Main Title -->
            <div class="space-y-1">
              <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-teal-200">
                  {{ currentLanguage === 'kh' ? 'សេវាសុខាភិបាល និងមន្ទីរពេទ្យ' : 'Healthcare & Hospitals' }}
                </span>
              </h1>
              <p class="text-xs sm:text-sm font-bold text-blue-200/90 leading-relaxed max-w-2xl">
                {{ currentLanguage === 'kh'
                  ? 'ស្វែងរកមន្ទីរពេទ្យរដ្ឋ និងឯកជន គ្លីនិកឯកទេស ឱសថស្ថានស្របច្បាប់ សេវាទទួលប័ណ្ណ ប.ស.ស និងសង្គ្រោះបន្ទាន់ ២៤/៧ ទូទាំងកម្ពុជា'
                  : 'Find verified public & private hospitals, specialist clinics, pharmacies, NSSF coverage, and 24/7 trauma emergency care across Cambodia.'
                }}
              </p>
            </div>
          </div>

          <!-- Ultra-Clean Search Console (Input + Enter Key + Clear + Search Button) -->
          <div class="max-w-2xl pt-1">
            <form @submit.prevent="handleSearch" class="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/20 p-1.5 focus-within:ring-4 focus-within:ring-blue-400/20 transition-all">
              <div class="pl-3.5 text-slate-400">
                <Search class="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <input
                v-model="searchQuery"
                type="text"
                @keyup.enter="handleSearch"
                :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមន្ទីរពេទ្យ គ្លីនិក ឯកទេស (ឧ. កាល់ម៉ែត, ព្រះកុសុមៈ, បេះដូង, សម្ភព, ICU, ប.ស.ស...)' : 'Search hospitals, clinics, specialties (e.g. Calmette, Kossamak, Cardiology, ICU, NSSF...)'"
                class="w-full px-3 py-2.5 text-xs sm:text-sm font-bold bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden font-khmer"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; scrollToResults()"
                type="button"
                class="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                ✕
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-500 hover:to-teal-500 text-white font-black text-xs transition-all shadow-md cursor-pointer shrink-0"
              >
                {{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}
              </button>
            </form>
          </div>

          <!-- Sleek Quick Filter Chips (Natural Horizontal Wrap) -->
          <div class="flex flex-wrap items-center gap-2 pt-1">
            <button
              v-for="chip in quickChips"
              :key="chip.id"
              @click="selectQuickPill(chip.id)"
              type="button"
              class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs select-none"
              :class="activePill === chip.id
                ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white border-blue-400 shadow-md scale-105 ring-2 ring-teal-400/30 font-black'
                : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border-white/10 backdrop-blur-xs'"
            >
              <component :is="chip.icon" class="w-3.5 h-3.5 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? chip.labelKh : chip.label }}</span>
            </button>
          </div>

          <!-- Bottom Healthcare Stats & SAMU 119 Hotline Strip -->
          <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
            <div class="flex flex-wrap items-center gap-4 sm:gap-6">
              <span class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{{ allHospitals.length }} {{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាពផ្លូវការ' : 'Verified Facilities' }}</span>
              </span>
              <span class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{{ currentLanguage === 'kh' ? 'សង្គ្រោះបន្ទាន់ ២៤/៧' : '24/7 Trauma Care' }}</span>
              </span>
              <span class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{{ currentLanguage === 'kh' ? 'ទទួលប័ណ្ណ ប.ស.ស' : 'NSSF Health Insurance' }}</span>
              </span>
              <span class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{{ currentLanguage === 'kh' ? '២៥ រាជធានី-ខេត្ត' : '25 Provinces' }}</span>
              </span>
            </div>

            <!-- SAMU 119 Ambulance Hotline -->
            <div class="flex items-center gap-2">
              <span class="text-slate-300 font-bold">{{ currentLanguage === 'kh' ? 'រថយន្តសង្គ្រោះបន្ទាន់ជាតិ:' : 'National Ambulance:' }}</span>
              <a
                href="tel:119"
                class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black transition-all hover:scale-105 shadow-md shadow-rose-600/30 animate-pulse"
              >
                <Ambulance class="w-3.5 h-3.5" />
                <span>SAMU 119 (Free Call)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- FILTER CONTROLS & VIEW MODE TOOLBAR -->
      <div id="healthcare-results-section" class="scroll-mt-24 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-xs">
          <!-- Left: Count & Active Province Popover -->
          <div class="flex flex-wrap items-center gap-3">
            <div>
              <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                <span>{{ currentLanguage === 'kh' ? 'បញ្ជីមណ្ឌលសុខាភិបាល' : 'Healthcare Directory' }}</span>
                <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
                  {{ filteredHospitals.length }} {{ currentLanguage === 'kh' ? 'ទីតាំង' : 'Facilities' }}
                </span>
              </h2>
              <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? `បង្ហាញមណ្ឌលសុខភាពក្នុង ${selectedProvince ? selectedProvince.nameKh : '២៥ រាជធានី-ខេត្ត'}` : `Showing facilities in ${selectedProvince ? selectedProvince.name : 'All Provinces'}` }}
              </p>
            </div>
          </div>

        <!-- Right: Sort & View Mode Switcher -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Reset Button if filtered -->
            <button
              v-if="searchQuery || activePill !== 'all' || activeLocation !== 'All'"
              @click="resetFilters"
              class="px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              type="button"
            >
              <RotateCcw class="w-3 h-3" />
              <span>{{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset' }}</span>
            </button>

            <!-- Sort By -->
            <div class="relative">
              <select
                v-model="sortBy"
                class="appearance-none rounded-xl border border-slate-200/90 bg-slate-50 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900 pl-3 pr-7 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 outline-none transition cursor-pointer shadow-2xs"
              >
                <option value="rating">{{ currentLanguage === 'kh' ? 'ពិន្ទុខ្ពស់បំផុត' : 'Top Rated' }}</option>
                <option value="reviews">{{ currentLanguage === 'kh' ? 'ការវាយតម្លៃច្រើន' : 'Most Reviews' }}</option>
                <option value="name">{{ currentLanguage === 'kh' ? 'ឈ្មោះ (A-Z)' : 'Name (A-Z)' }}</option>
              </select>
              <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
                <SlidersHorizontal class="w-3 h-3" />
              </div>
            </div>

            <!-- View Switcher (Grid vs Map) -->
            <div class="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-2xl border border-slate-200/80 dark:border-slate-700">
              <button
                type="button"
                @click="viewMode = 'grid'"
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                ]"
              >
                <LayoutGrid class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'កាតបញ្ជី' : 'Grid' }}</span>
              </button>

              <button
                type="button"
                @click="viewMode = 'map'"
                :class="[
                  'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                  viewMode === 'map'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-300 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                ]"
              >
                <Map class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ផែនទី' : 'Map' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- VIEW 1: MODERN CARDS GRID -->
        <div v-if="viewMode === 'grid' && paginatedHospitals.length > 0" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="hospital in paginatedHospitals"
              :key="hospital.id"
              class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <!-- High-Resolution Cover Image Banner -->
                <div class="relative h-52 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
                  <img
                    :src="hospital.image"
                    :alt="hospital.nameKh || hospital.name"
                    @error="($event.target as HTMLImageElement).src = '/images/pillars/health.jpg'"
                    class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20 pointer-events-none" />

                  <!-- Top-Left Rating & Reviews -->
                  <div class="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-black bg-slate-900/85 text-amber-300 backdrop-blur-md shadow-xs border border-white/10">
                    <span class="inline-flex items-center gap-1"><Star class="w-3 h-3 text-amber-400 fill-amber-400" /> {{ hospital.rating }}</span>
                    <span class="text-[10px] text-slate-300">({{ hospital.reviews }})</span>
                  </div>

                  <!-- Top-Right Badges: Ownership & NSSF -->
                  <div class="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <!-- Ownership Badge -->
                    <span
                      class="px-2.5 py-1 rounded-xl text-[10px] font-black border uppercase shadow-sm backdrop-blur-md"
                      :class="hospital.ownership === 'public'
                        ? 'bg-blue-600/90 text-white border-blue-400'
                        : 'bg-violet-600/90 text-white border-violet-400'"
                    >
                      <span class="inline-flex items-center gap-1"><component :is="hospital.ownership === 'public' ? Building2 : HospitalIcon" class="w-3 h-3" /> <span>{{ hospital.ownership === 'public' ? (currentLanguage === 'kh' ? 'មន្ទីរពេទ្យរដ្ឋ' : 'Public Hospital') : (currentLanguage === 'kh' ? 'ឯកជន' : 'Private') }}</span></span>
                    </span>

                    <!-- NSSF Acceptance Badge -->
                    <span
                      v-if="hospital.acceptsNssf"
                      class="px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-600/95 text-white border border-emerald-300 shadow-sm backdrop-blur-md flex items-center gap-1"
                    >
                      <ShieldCheck class="w-3 h-3" />
                      <span>{{ currentLanguage === 'kh' ? 'ប.ស.ស (NSSF)' : 'NSSF' }}</span>
                    </span>
                  </div>

                  <!-- Bottom-Left Category Tag -->
                  <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-md shadow-xs">
                    {{ hospital.category === 'hospital' ? (currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital') :
                       hospital.category === 'clinic' ? (currentLanguage === 'kh' ? 'គ្លីនិកឯកទេស' : 'Specialist Clinic') :
                       (currentLanguage === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacy') }}
                  </span>

                  <!-- Bottom-Right 24/7 Live Dot -->
                  <div class="absolute bottom-3 right-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black bg-emerald-950/85 text-emerald-300 border border-emerald-500/40 backdrop-blur-md">
                    <span class="relative flex h-2 w-2">
                      <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span>{{ hospital.openingHours }}</span>
                  </div>
                </div>

                <!-- Card Content -->
                <div class="p-5 space-y-3">
                  <div>
                    <h3 class="text-base font-black text-[#0A2540] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
                      {{ hospital.nameKh || hospital.name }}
                    </h3>
                    <p class="text-xs text-slate-400 font-semibold mt-0.5 line-clamp-1">
                      {{ hospital.name }}
                    </p>
                  </div>

                  <!-- Address & Location Pin -->
                  <div class="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                    <MapPin class="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                    <span class="line-clamp-1 font-medium">{{ hospital.addressKh || hospital.address }}</span>
                  </div>

                  <!-- Description -->
                  <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                    {{ localized(hospital.description, hospital.descriptionKh) }}
                  </p>

                  <!-- Department / Service Chips -->
                  <div class="flex flex-wrap gap-1.5 pt-1">
                    <span
                      v-for="svc in hospital.services.slice(0, 3)"
                      :key="svc"
                      class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 border border-blue-100 dark:border-blue-900"
                    >
                      {{ svc }}
                    </span>
                    <span
                      v-if="hospital.services.length > 3"
                      class="px-1.5 py-0.5 rounded-lg text-[10px] font-bold text-slate-400"
                    >
                      +{{ hospital.services.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Card Action Bar -->
              <div class="p-5 pt-0">
                <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-2">
                  <!-- Direct Call Button -->
                  <a
                    :href="'tel:' + hospital.phone"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 text-xs font-black border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <PhoneCall class="w-3.5 h-3.5" />
                    <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ' : 'Call' }}</span>
                  </a>

                  <!-- Google Maps Directions -->
                  <a
                    :href="getDirectionsUrl(hospital)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
                    :title="currentLanguage === 'kh' ? 'នាំផ្លូវតាម Google Maps' : 'Directions'"
                  >
                    <Navigation class="w-4 h-4 text-blue-600" />
                  </a>

                  <!-- View Details Link -->
                  <router-link
                    :to="'/health/' + hospital.id"
                    class="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-colors shadow-2xs"
                  >
                    <span>{{ currentLanguage === 'kh' ? 'មើលលម្អិត' : 'Details' }}</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Pagination Bar -->
          <PaginationBar
            v-if="paginatedHospitals.length > 0"
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

        <!-- VIEW 2: INTERACTIVE NEARBY MAP VIEW -->
        <div v-else-if="viewMode === 'map' && filteredHospitals.length > 0" class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-6">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-500/20 dark:bg-blue-950/50 dark:text-blue-300">
                <MapPin class="h-3.5 w-3.5 text-blue-600" />
                <span>{{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាពក្បែរអ្នក' : 'Nearby Healthcare Locator' }}</span>
              </div>
              <h2 class="mt-2 text-lg sm:text-2xl font-black tracking-tight text-[#0A2458] dark:text-white">
                {{ currentLanguage === 'kh' ? 'ផែនទីមន្ទីរពេទ្យ និងគ្លីនិកឯកទេស' : 'Interactive Healthcare Map' }}
              </h2>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <!-- Real Interactive Google Map Column -->
            <div class="lg:col-span-7 flex flex-col gap-3">
              <div class="relative min-h-[380px] sm:min-h-[460px] flex-1 rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-inner">
                <!-- Google Maps Real Embed iframe -->
                <iframe
                  :key="mapEmbedUrl"
                  :src="mapEmbedUrl"
                  :title="selectedMapHospital?.nameKh || selectedMapHospital?.name || 'Healthcare Location Map'"
                  class="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerpolicy="no-referrer-when-downgrade"
                />

                <!-- Top Floating Overlay Bar -->
                <div class="absolute top-3 inset-x-3 z-10 flex items-center justify-between gap-2 pointer-events-none">
                  <span class="pointer-events-auto inline-flex items-center gap-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white backdrop-blur-md shadow-md border border-slate-200/80 dark:border-slate-700">
                    <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាព ' + filteredHospitals.length + ' ទីតាំង' : filteredHospitals.length + ' Healthcare Centers' }}</span>
                  </span>

                  <a
                    :href="directionsUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 dark:bg-slate-900/90 hover:bg-white text-slate-800 dark:text-white font-bold text-xs shadow-md border border-slate-200/80 dark:border-slate-700 backdrop-blur-md transition-all active:scale-95"
                    :title="currentLanguage === 'kh' ? 'បើកមើលក្នុង Google Maps' : 'Open in Google Maps'"
                  >
                    <Navigation class="w-3.5 h-3.5 text-blue-600" />
                    <span>{{ currentLanguage === 'kh' ? 'ទិសដៅផែនទី' : 'Directions' }}</span>
                    <ExternalLink class="w-3 h-3 text-slate-400" />
                  </a>
                </div>

                <!-- Bottom Floating Active Hospital Overlay -->
                <div class="absolute bottom-3 inset-x-3 z-10 pointer-events-none">
                  <div class="pointer-events-auto flex items-center justify-between gap-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-2xl border border-slate-200/90 dark:border-slate-700 shadow-lg">
                    <div class="flex items-center gap-2.5 min-w-0">
                      <div
                        :class="[
                          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl shadow-xs text-white font-bold',
                          selectedMapHospital?.category === 'hospital' ? 'bg-blue-600' :
                          selectedMapHospital?.category === 'clinic' ? 'bg-violet-600' : 'bg-emerald-600'
                        ]"
                      >
                        <HeartPulse v-if="selectedMapHospital?.category === 'hospital'" class="h-4.5 w-4.5" />
                        <Stethoscope v-else-if="selectedMapHospital?.category === 'clinic'" class="h-4.5 w-4.5" />
                        <Pill v-else class="h-4.5 w-4.5" />
                      </div>
                      <div class="min-w-0">
                        <div class="truncate text-xs font-black text-slate-900 dark:text-white">
                          {{ selectedMapHospital?.nameKh || selectedMapHospital?.name }}
                        </div>
                        <div class="truncate text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                          <MapPin class="w-3 h-3 text-rose-500 shrink-0" />
                          <span class="truncate">{{ selectedMapHospital?.addressKh || selectedMapHospital?.address }}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      :href="directionsUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] hover:bg-blue-100 font-bold text-xs border border-blue-200 transition-colors"
                    >
                      <Navigation class="w-3 h-3" />
                      <span>{{ currentLanguage === 'kh' ? 'នាំផ្លូវ' : 'Directions' }}</span>
                    </a>
                  </div>
                </div>
              </div>

              <!-- Quick Facility Selection Chips Under the Real Map -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold px-1">
                  <span>{{ currentLanguage === 'kh' ? 'ចុចជ្រើសរើសមណ្ឌលសុខភាពដើម្បីមើលលើផែនទី៖' : 'Select a facility to view on real map:' }}</span>
                  <span class="text-[11px] font-medium text-slate-400">{{ filteredHospitals.length }} {{ currentLanguage === 'kh' ? 'ទីតាំង' : 'places' }}</span>
                </div>
                <div class="flex gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                  <button
                    v-for="hosp in filteredHospitals"
                    :key="hosp.id"
                    type="button"
                    @click="selectedMapHospital = hosp"
                    :class="[
                      'shrink-0 flex items-center gap-2 px-3 py-2 rounded-2xl text-xs font-bold transition-all border text-left',
                      selectedMapHospital?.id === hosp.id
                        ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-sm ring-2 ring-blue-300 dark:ring-blue-800'
                        : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60'
                    ]"
                  >
                    <div
                      :class="[
                        'w-2 h-2 rounded-full shrink-0',
                        hosp.category === 'hospital' ? 'bg-blue-400' : hosp.category === 'clinic' ? 'bg-violet-400' : 'bg-emerald-400'
                      ]"
                    />
                    <span class="truncate max-w-[150px]">{{ hosp.nameKh || hosp.name }}</span>
                  </button>
                </div>
              </div>
            </div>

            <!-- Split Right: Selected Facility Card -->
            <div v-if="selectedMapHospital" class="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-900/50 p-5 sm:p-6 space-y-4">
              <div class="space-y-3.5">
                <div class="relative h-44 w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-200">
                  <img
                    :src="selectedMapHospital.image"
                    :alt="selectedMapHospital.name"
                    @error="($event.target as HTMLImageElement).src = '/images/pillars/health.jpg'"
                    class="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div class="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span class="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-blue-700 dark:text-blue-300 shadow-sm backdrop-blur-xs">
                      {{ selectedMapHospital.category?.toUpperCase() }}
                    </span>
                    <span
                      v-if="selectedMapHospital.acceptsNssf"
                      class="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-600 text-white shadow-sm"
                    >
                      {{ currentLanguage === 'kh' ? 'ប.ស.ស' : 'NSSF' }}
                    </span>
                  </div>
                  <div class="absolute bottom-2.5 right-2.5">
                    <span class="px-2.5 py-1 rounded-lg text-[10px] font-black bg-emerald-600 text-white shadow-sm">
                      {{ selectedMapHospital.openingHours }}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 class="text-base sm:text-lg font-black text-[#0A2458] dark:text-white leading-snug">
                    {{ selectedMapHospital.nameKh || selectedMapHospital.name }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                    {{ selectedMapHospital.name }}
                  </p>
                  <div class="flex items-center gap-2 mt-1.5">
                    <span class="inline-flex items-center gap-1 text-amber-500 text-xs font-bold"><Star class="w-3.5 h-3.5 fill-amber-400" /> {{ selectedMapHospital.rating }}</span>
                    <span class="text-slate-400 text-xs">({{ selectedMapHospital.reviews }} reviews)</span>
                  </div>
                </div>

                <div class="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs">
                  <div class="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                    <MapPin class="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                    <span class="leading-relaxed">{{ selectedMapHospital.addressKh || selectedMapHospital.address }}</span>
                  </div>
                  <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <PhoneCall class="h-4 w-4 text-emerald-500 shrink-0" />
                    <span class="font-bold tracking-wide">{{ selectedMapHospital.phone }}</span>
                  </div>
                </div>
              </div>

              <!-- Actions -->
              <div class="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <a
                  :href="`tel:${selectedMapHospital.phone}`"
                  class="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all active:scale-95 shadow-xs"
                >
                  <PhoneCall class="h-3.5 w-3.5" />
                  <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ' : 'Call' }}</span>
                </a>

                <a
                  :href="directionsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs transition-all active:scale-95 border border-slate-200 dark:border-slate-700 shadow-xs"
                >
                  <Navigation class="h-3.5 w-3.5 text-blue-600" />
                  <span>{{ currentLanguage === 'kh' ? 'នាំផ្លូវ' : 'Map' }}</span>
                </a>

                <router-link
                  :to="'/health/' + selectedMapHospital.id"
                  class="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs"
                >
                  <span>{{ currentLanguage === 'kh' ? 'មើលលម្អិត' : 'Details' }}</span>
                  <ArrowRight class="h-3.5 w-3.5" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- EMPTY STATE -->
        <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
          <EmptyState
            :title="t('health.noResults')"
            :action-label="currentLanguage === 'kh' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset Filters'"
            @action="resetFilters"
          />
        </div>
      </div>

      <!-- PATIENT ESSENTIAL GUIDELINES & HOTLINES SECTION -->
      <section class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-6">
        <div class="max-w-3xl">
          <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1456E5] ring-1 ring-blue-500/20 dark:bg-blue-950/50 dark:text-blue-300">
            <BadgeCheck class="h-3.5 w-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'មគ្គុទ្ទេសក៍សុខភាពសាធារណៈ' : 'Public Healthcare Guidelines' }}</span>
          </div>
          <h2 class="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#0A2540] dark:text-white">
            {{ currentLanguage === 'kh' ? 'ការណែនាំសម្រាប់ការប្រើប្រាស់សេវាសុខាភិបាល' : 'Essential Patient Guidelines & Emergency Help' }}
          </h2>
          <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ currentLanguage === 'kh'
              ? 'ព័ត៌មានមានប្រយោជន៍សម្រាប់ពលរដ្ឋកម្ពុជាក្នុងការទទួលបានសេវាថែទាំសុខភាព ការប្រើប្រាស់ប័ណ្ណ ប.ស.ស និងការហៅសង្គ្រោះបន្ទាន់'
              : 'Helpful guidance for Cambodian citizens on accessing healthcare, utilizing NSSF insurance, and trauma emergency response.'
            }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <!-- Guide 1: Emergency SAMU 119 -->
          <div
            @click="openEmergency"
            role="button"
            tabindex="0"
            @keydown.enter="openEmergency"
            class="group cursor-pointer rounded-2xl border border-rose-200/80 bg-rose-50/50 hover:bg-rose-50/90 dark:border-rose-900/40 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 p-5 space-y-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-rose-900/5 hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-md shadow-rose-600/25 group-hover:scale-110 transition-transform">
                <Ambulance class="h-5 w-5" />
              </div>
              <span class="text-xs font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-1 rounded-full border border-rose-200/70 dark:border-rose-800">
                Free 119
              </span>
            </div>
            <div>
              <h3 class="text-sm font-black text-[#0A2540] dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                {{ currentLanguage === 'kh' ? '១. សង្គ្រោះបន្ទាន់ (SAMU 119)' : '1. Emergency Care (SAMU 119)' }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                {{ currentLanguage === 'kh'
                  ? 'ក្នុងករណីមានគ្រោះថ្នាក់ចរាចរណ៍ ឬជំងឺធ្ងន់ធ្ងរ សូមទាក់ទងលេខ ១១៩ ភ្លាមៗដោយឥតគិតថ្លៃ និងប្រាប់ទីតាំងឱ្យបានច្បាស់លាស់។'
                  : 'For critical trauma, cardiac events, or accidents, call 119 immediately with precise landmarks for free ambulance dispatch.'
                }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-1 gap-2">
              <a
                href="tel:119"
                @click.stop
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-xs transition-all active:scale-95"
              >
                <PhoneCall class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ហៅ ១១៩' : 'Call 119' }}</span>
              </a>
              <span class="inline-flex items-center gap-1 text-xs font-black text-rose-600 dark:text-rose-400 group-hover:underline">
                <span>{{ currentLanguage === 'kh' ? 'ទំព័រសង្គ្រោះបន្ទាន់' : 'Emergency Center' }}</span>
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          <!-- Guide 2: NSSF Health Insurance -->
          <div
            @click="openNssfModal"
            role="button"
            tabindex="0"
            @keydown.enter="openNssfModal"
            class="group cursor-pointer rounded-2xl border border-emerald-200/80 bg-emerald-50/50 hover:bg-emerald-50/90 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/30 p-5 space-y-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-emerald-900/5 hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/25 group-hover:scale-110 transition-transform">
                <ShieldCheck class="h-5 w-5" />
              </div>
              <span class="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full border border-emerald-200/70 dark:border-emerald-800">
                Hotline 1286
              </span>
            </div>
            <div>
              <h3 class="text-sm font-black text-[#0A2540] dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {{ currentLanguage === 'kh' ? '២. ប័ណ្ណរបបសន្តិសុខសង្គម (ប.ស.ស)' : '2. NSSF Healthcare Card' }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                {{ currentLanguage === 'kh'
                  ? 'មន្ទីរពេទ្យរដ្ឋ និងគ្លីនិកដៃគូទទួលពិនិត្យ និងព្យាបាលអ្នកមានប័ណ្ណ ប.ស.ស ដោយឥតគិតថ្លៃ ឬទទួលបានការឧបត្ថម្ភស្របច្បាប់។'
                  : 'Public referral hospitals and certified partner clinics provide free or subsidized treatment for active NSSF cardholders.'
                }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-1 gap-2">
              <button
                type="button"
                @click.stop="filterByNssf"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-xs transition-all active:scale-95"
              >
                <ShieldCheck class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'មើលពេទ្យ ប.ស.ស' : 'NSSF Hospitals' }}</span>
              </button>
              <span class="inline-flex items-center gap-1 text-xs font-black text-emerald-600 dark:text-emerald-400 group-hover:underline">
                <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិត' : 'Guide Details' }}</span>
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>

          <!-- Guide 3: Patient Documents -->
          <div
            @click="openDocModal"
            role="button"
            tabindex="0"
            @keydown.enter="openDocModal"
            class="group cursor-pointer rounded-2xl border border-blue-200/80 bg-blue-50/50 hover:bg-blue-50/90 dark:border-blue-900/40 dark:bg-blue-950/20 dark:hover:bg-blue-950/30 p-5 space-y-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5"
          >
            <div class="flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/25 group-hover:scale-110 transition-transform">
                <FileText class="h-5 w-5" />
              </div>
              <span class="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 rounded-full border border-blue-200/70 dark:border-blue-800">
                Checklist
              </span>
            </div>
            <div>
              <h3 class="text-sm font-black text-[#0A2540] dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {{ currentLanguage === 'kh' ? '៣. ឯកសារនាំយកពេលទៅពេទ្យ' : '3. Patient Admission Documents' }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mt-1">
                {{ currentLanguage === 'kh'
                  ? 'សូមភ្ជាប់មកជាមួយនូវអត្តសញ្ញាណប័ណ្ណ ប័ណ្ណ ប.ស.ស (បើមាន) និងសៀវភៅតាមដានសុខភាព ឬវេជ្ជបញ្ជាចាស់ៗ។'
                  : 'Always bring your National ID card, active NSSF card, and previous prescription records for seamless patient intake.'
                }}
              </p>
            </div>
            <div class="flex items-center justify-between pt-1 gap-2">
              <button
                type="button"
                @click.stop="openDocModal"
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-xs transition-all active:scale-95"
              >
                <FileText class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'បើកបញ្ជីឯកសារ' : 'Open Checklist' }}</span>
              </button>
              <span class="inline-flex items-center gap-1 text-xs font-black text-blue-600 dark:text-blue-400 group-hover:underline">
                <span>{{ currentLanguage === 'kh' ? '៦ ឯកសារចាំបាច់' : '6 Key Items' }}</span>
                <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- MODAL 1: NSSF HEALTHCARE CARD GUIDE MODAL -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isNssfModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
          @click.self="isNssfModalOpen = false"
        >
          <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-scaleUp">
            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                  <ShieldCheck class="w-5 h-5" />
                </span>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {{ currentLanguage === 'kh' ? 'ការណែនាំអំពីការប្រើប្រាស់ប័ណ្ណ ប.ស.ស' : 'NSSF Healthcare Card User Guide' }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ currentLanguage === 'kh' ? 'បេឡាជាតិសន្តិសុខសង្គម — ក្រសួងការងារ និងបណ្តុះបណ្តាលវិជ្ជាជីវៈ' : 'National Social Security Fund — Healthcare Scheme' }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="isNssfModalOpen = false"
                class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              <!-- Benefit Points -->
              <div class="space-y-3">
                <h4 class="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{{ currentLanguage === 'kh' ? 'សិទ្ធិ និងអត្ថប្រយោជន៍ដែលទទួលបាន៖' : 'Benefits & Coverage:' }}</span>
                </h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div class="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                    <strong class="font-bold text-emerald-950 dark:text-emerald-200 block text-xs">
                      {{ currentLanguage === 'kh' ? '១. ពិនិត្យ និងព្យាបាលឥតគិតថ្លៃ' : '1. Free Consultation & Treatment' }}
                    </strong>
                    <p class="text-xs text-slate-600 dark:text-slate-300">
                      {{ currentLanguage === 'kh' ? 'ពិនិត្យជំងឺទូទៅ សម្រាកពេទ្យ វះកាត់ និងថ្នាំពេទ្យតាមកម្រិតកំណត់នៅមន្ទីរពេទ្យរដ្ឋ និងដៃគូ។' : 'General care, in-patient hospitalization, surgery, and prescription drugs.' }}
                    </p>
                  </div>
                  <div class="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                    <strong class="font-bold text-emerald-950 dark:text-emerald-200 block text-xs">
                      {{ currentLanguage === 'kh' ? '២. សេវាសម្ភព និងសម្រាលកូន' : '2. Maternity & Delivery Care' }}
                    </strong>
                    <p class="text-xs text-slate-600 dark:text-slate-300">
                      {{ currentLanguage === 'kh' ? 'ការពិនិត្យផ្ទៃពោះ សម្រាលកូន និងប្រាក់ឧបត្ថម្ភរាជរដ្ឋាភិបាលសម្រាប់កម្មការិនី។' : 'Free prenatal checks, delivery, and government maternity cash subsidies.' }}
                    </p>
                  </div>
                  <div class="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                    <strong class="font-bold text-emerald-950 dark:text-emerald-200 block text-xs">
                      {{ currentLanguage === 'kh' ? '៣. សង្គ្រោះបន្ទាន់ និងគ្រោះថ្នាក់' : '3. Emergency & Occupational Injury' }}
                    </strong>
                    <p class="text-xs text-slate-600 dark:text-slate-300">
                      {{ currentLanguage === 'kh' ? 'ការសង្គ្រោះបន្ទាន់ពេលមានគ្រោះថ្នាក់ការងារ ឬគ្រោះថ្នាក់តាមផ្លូវធ្វើដំណើរទៅបំពេញការងារ។' : 'Immediate emergency treatment for work-related accidents and commuting injuries.' }}
                    </p>
                  </div>
                  <div class="p-3.5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 space-y-1">
                    <strong class="font-bold text-emerald-950 dark:text-emerald-200 block text-xs">
                      {{ currentLanguage === 'kh' ? '៤. ការបញ្ជូនអ្នកជំងឺ (Ambulance)' : '4. Emergency Ambulance Dispatch' }}
                    </strong>
                    <p class="text-xs text-slate-600 dark:text-slate-300">
                      {{ currentLanguage === 'kh' ? 'សេវារថយន្តសង្គ្រោះបន្ទាន់បញ្ជូនពីកន្លែងកើតហេតុទៅកាន់មន្ទីរពេទ្យដៃគូដែលនៅជិតបំផុត។' : 'Free ambulance transport to certified referral hospitals during emergencies.' }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- How to Use Step by Step -->
              <div class="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 class="font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span class="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>{{ currentLanguage === 'kh' ? 'របៀបប្រើប្រាស់ប័ណ្ណពេលទៅមន្ទីរពេទ្យ៖' : 'How to Access Healthcare with NSSF:' }}</span>
                </h4>
                <ol class="space-y-2 text-xs text-slate-600 dark:text-slate-300 list-decimal pl-4 leading-relaxed">
                  <li>{{ currentLanguage === 'kh' ? 'យកប័ណ្ណ ប.ស.ស (ប័ណ្ណរឹង ឬប័ណ្ណអេឡិចត្រូនិកក្នុង App NSSF Member) ភ្ជាប់ជាមួយអត្តសញ្ញាណប័ណ្ណ។' : 'Present your physical NSSF card or digital e-card on the NSSF Member app along with your National ID.' }}</li>
                  <li>{{ currentLanguage === 'kh' ? 'បង្ហាញប័ណ្ណនៅបញ្ជរបម្រើសេវា ប.ស.ស នៅផ្នែកចុះឈ្មោះអ្នកជំងឺនៃមន្ទីរពេទ្យដៃគូ។' : 'Show your card at the dedicated NSSF registration counter at the referral hospital.' }}</li>
                  <li>{{ currentLanguage === 'kh' ? 'ពិនិត្យព្យាបាលតាមវេជ្ជបញ្ជាដោយមិនបាច់បង់ប្រាក់លើសេវាដែលមានចែងក្នុងតារាងឧបត្ថម្ភ។' : 'Receive diagnosis and care without out-of-pocket payment for covered treatments.' }}</li>
                </ol>
              </div>

              <!-- Hotline banner -->
              <div class="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div class="flex items-center gap-3">
                  <PhoneCall class="w-6 h-6 shrink-0" />
                  <div>
                    <div class="font-black text-sm">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទទាន់ហេតុការណ៍ ប.ស.ស' : 'NSSF National Hotline' }}</div>
                    <div class="text-xs text-emerald-100">{{ currentLanguage === 'kh' ? 'ហៅឥតគិតថ្លៃរៀងរាល់ម៉ោងធ្វើការ (ច័ន្ទ - សុក្រ)' : 'Toll-free Mon - Fri 7:30 - 17:00' }}</div>
                  </div>
                </div>
                <a
                  href="tel:1286"
                  class="shrink-0 px-4 py-2 rounded-xl bg-white text-emerald-800 font-black text-xs hover:bg-emerald-50 transition-all shadow-sm active:scale-95"
                >
                  {{ currentLanguage === 'kh' ? 'ហៅទៅលេខ ១២៨៦' : 'Dial 1286' }}
                </a>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
              <span class="text-xs text-slate-500 font-medium">
                {{ currentLanguage === 'kh' ? 'មានមន្ទីរពេទ្យចំនួន ' + nssfHospitalsCount + ' ទទួលប័ណ្ណ ប.ស.ស' : nssfHospitalsCount + ' facilities accept NSSF' }}
              </span>
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  @click="isNssfModalOpen = false"
                  class="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800"
                >
                  {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
                </button>
                <button
                  type="button"
                  @click="filterByNssf"
                  class="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
                >
                  <ShieldCheck class="w-3.5 h-3.5" />
                  <span>{{ currentLanguage === 'kh' ? 'បង្ហាញមន្ទីរពេទ្យ ប.ស.ស ទាំងអស់' : 'Show All NSSF Hospitals' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- MODAL 2: PATIENT DOCUMENT CHECKLIST MODAL -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-200"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div
          v-if="isDocModalOpen"
          class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
          @click.self="isDocModalOpen = false"
        >
          <div class="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-6 animate-scaleUp">
            <!-- Modal Header -->
            <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-blue-50/50 dark:bg-blue-950/20">
              <div class="flex items-center gap-3">
                <span class="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
                  <FileText class="w-5 h-5" />
                </span>
                <div>
                  <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {{ currentLanguage === 'kh' ? 'បញ្ជីឯកសារចាំបាច់ពេលទៅពិនិត្យ ឬសម្រាកពេទ្យ' : 'Patient Hospital Visit Document Checklist' }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    {{ currentLanguage === 'kh' ? 'ចុចធីកលើប្រអប់ដើម្បីផ្ទៀងផ្ទាត់ឯកសារមុនចេញដំណើរ' : 'Check off items as you prepare them before visiting the hospital' }}
                  </p>
                </div>
              </div>
              <button
                type="button"
                @click="isDocModalOpen = false"
                class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X class="w-5 h-5" />
              </button>
            </div>

            <!-- Modal Content (Interactive Checklist) -->
            <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs sm:text-sm">
              <div class="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-900 text-xs text-blue-900 dark:text-blue-200 flex items-start gap-2.5">
                <BadgeCheck class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{{ currentLanguage === 'kh' ? 'ការរៀបចំឯកសារបានត្រឹមត្រូវជួយសន្សំពេលវេលាចុះឈ្មោះ និងធានាថាអ្នកទទួលបានអត្ថប្រយោជន៍ព្យាបាលពេញលេញ។' : 'Bringing proper documentation prevents intake delays and guarantees access to full insurance and subsidy coverage.' }}</span>
              </div>

              <!-- Category A: Identity & Coverage -->
              <div class="space-y-2.5">
                <h4 class="font-black text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {{ currentLanguage === 'kh' ? 'ក. ឯកសារសម្គាល់ខ្លួន និងសិទ្ធិព្យាបាល' : 'A. Identity & Insurance Coverage' }}
                </h4>
                <div class="space-y-2">
                  <!-- Item 1 -->
                  <div
                    @click="toggleDoc('idCard')"
                    role="button"
                    tabindex="0"
                    class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                    :class="checkedDocs.idCard ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'"
                  >
                    <div
                      class="h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                      :class="checkedDocs.idCard ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'"
                    >
                      <Check v-if="checkedDocs.idCard" class="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div class="font-black text-xs">{{ currentLanguage === 'kh' ? '១. អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID)' : '1. National ID Card' }}</div>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ currentLanguage === 'kh' ? 'ឬលិខិតឆ្លងដែន (Passport) ឬសំបុត្រកំណើតច្បាប់ដើម (សម្រាប់កុមារ)' : 'Or passport / original birth certificate for minors.' }}</div>
                    </div>
                  </div>

                  <!-- Item 2 -->
                  <div
                    @click="toggleDoc('nssfCard')"
                    role="button"
                    tabindex="0"
                    class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                    :class="checkedDocs.nssfCard ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'"
                  >
                    <div
                      class="h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                      :class="checkedDocs.nssfCard ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'"
                    >
                      <Check v-if="checkedDocs.nssfCard" class="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div class="font-black text-xs">{{ currentLanguage === 'kh' ? '២. ប័ណ្ណរបបសន្តិសុខសង្គម (ប.ស.ស) ឬប័ណ្ណសមធម៌' : '2. NSSF Card or Health Equity Card' }}</div>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ currentLanguage === 'kh' ? 'ប័ណ្ណរឹង ឬ App NSSF Member ឬប័ណ្ណមូលនិធិសមធម៌សុខភាព (ប័ណ្ណក្រីក្រ)' : 'Active physical/digital NSSF card or poverty health equity card.' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Category B: Medical History -->
              <div class="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h4 class="font-black text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {{ currentLanguage === 'kh' ? 'ខ. ប្រវត្តិវេជ្ជសាស្ត្រ និងឱសថ' : 'B. Medical History & Current Prescriptions' }}
                </h4>
                <div class="space-y-2">
                  <!-- Item 3 -->
                  <div
                    @click="toggleDoc('healthBook')"
                    role="button"
                    tabindex="0"
                    class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                    :class="checkedDocs.healthBook ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'"
                  >
                    <div
                      class="h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                      :class="checkedDocs.healthBook ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'"
                    >
                      <Check v-if="checkedDocs.healthBook" class="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div class="font-black text-xs">{{ currentLanguage === 'kh' ? '៣. សៀវភៅតាមដានសុខភាព ឬលទ្ធផលពិនិត្យចាស់ៗ' : '3. Medical History & Previous Test Results' }}</div>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ currentLanguage === 'kh' ? 'លទ្ធផលពិនិត្យឈាម អេកូ X-Ray ស្កេន CT ឬវេជ្ជបញ្ជាដែលធ្លាប់ព្យាបាលកន្លងមក' : 'Recent blood panels, X-rays, ultrasound reports, or past discharge summaries.' }}</div>
                    </div>
                  </div>

                  <!-- Item 4 -->
                  <div
                    @click="toggleDoc('medications')"
                    role="button"
                    tabindex="0"
                    class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                    :class="checkedDocs.medications ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'"
                  >
                    <div
                      class="h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                      :class="checkedDocs.medications ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'"
                    >
                      <Check v-if="checkedDocs.medications" class="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div class="font-black text-xs">{{ currentLanguage === 'kh' ? '៤. ថ្នាំពេទ្យដែលកំពុងលេបប្រចាំថ្ងៃ' : '4. Current Medication List & Dosages' }}</div>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ currentLanguage === 'kh' ? 'យកកញ្ចប់ថ្នាំជាក់ស្តែងមកជាមួយ (ជាពិសេសថ្នាំលើសសម្ពាធឈាម ទឹកនោមផ្អែម បេះដូង)' : 'Bring actual medication boxes (hypertension, diabetes, heart prescriptions).' }}</div>
                    </div>
                  </div>

                  <!-- Item 5 -->
                  <div
                    @click="toggleDoc('allergyCard')"
                    role="button"
                    tabindex="0"
                    class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                    :class="checkedDocs.allergyCard ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'"
                  >
                    <div
                      class="h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                      :class="checkedDocs.allergyCard ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'"
                    >
                      <Check v-if="checkedDocs.allergyCard" class="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div class="font-black text-xs">{{ currentLanguage === 'kh' ? '៥. កាតកត់ត្រាប្រតិកម្មថ្នាំ (Allergies Card)' : '5. Drug & Food Allergy Records' }}</div>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ currentLanguage === 'kh' ? 'ប្រាប់គ្រូពេទ្យជាមុនប្រសិនបើអ្នកធ្លាប់មានប្រតិកម្មជាមួយថ្នាំ Penicillin ឬថ្នាំស្ពឹក' : 'Crucial: notify triage staff of any allergies to penicillin, anesthesia, or foods.' }}</div>
                    </div>
                  </div>

                  <!-- Item 6 -->
                  <div
                    @click="toggleDoc('emergencyContact')"
                    role="button"
                    tabindex="0"
                    class="flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none"
                    :class="checkedDocs.emergencyContact ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200' : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700'"
                  >
                    <div
                      class="h-5 w-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 border transition-colors"
                      :class="checkedDocs.emergencyContact ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700'"
                    >
                      <Check v-if="checkedDocs.emergencyContact" class="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <div class="font-black text-xs">{{ currentLanguage === 'kh' ? '៦. លេខទូរស័ព្ទសាច់ញាតិ ឬអាណាព្យាបាលបន្ទាន់' : '6. Emergency Contact Details' }}</div>
                      <div class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទសាច់ញាតិជិតស្និទ្ធយ៉ាងតិច ២ នាក់ដែលអាចទំនាក់ទំនងបានគ្រប់ពេល' : 'At least two active telephone numbers of family members or legal guardians.' }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Emergency Note -->
              <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-200 leading-relaxed">
                <strong>{{ currentLanguage === 'kh' ? 'ចំណាំសង្គ្រោះបន្ទាន់៖' : 'Emergency Note:' }}</strong>
                {{ currentLanguage === 'kh' ? ' ក្នុងករណីសង្គ្រោះបន្ទាន់គំរាមកំហែងដល់អាយុជីវិត សូមប្រញាប់ទៅមន្ទីរពេទ្យភ្លាមៗ។ គ្រូពេទ្យនឹងសង្គ្រោះជាបន្ទាន់ ដោយឯកសារអាចបំពេញបន្ថែមពេលក្រោយបាន។' : ' In life-threatening emergencies, proceed to the nearest ER immediately. Triage will stabilize the patient before requesting documents.' }}
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button
                type="button"
                @click="resetDocChecklist"
                class="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 underline font-medium"
              >
                {{ currentLanguage === 'kh' ? 'សម្អាតការធីកឡើងវិញ' : 'Reset Checkmarks' }}
              </button>
              <button
                type="button"
                @click="isDocModalOpen = false"
                class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all"
              >
                {{ currentLanguage === 'kh' ? 'បានយល់ព្រម & បិទ' : 'Done & Close' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.health-page-container {
  background:
    radial-gradient(55rem 25rem at 50% 0%, rgba(224, 242, 254, .55), transparent 70%),
    linear-gradient(180deg, #f8fbff 0%, #f4f8fe 40%, #edf4fc 100%);
}

:global(.dark) .health-page-container {
  background-color: #0b1727;
  background-image: none;
}
</style>
