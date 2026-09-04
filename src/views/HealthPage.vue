<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  MapPin,
  RotateCcw,
  ChevronRight,
  ChevronDown,
  Check,
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
  FileText
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'
import { CAMBODIAN_PROVINCES } from '@/composables/useLocation'
import type { Hospital } from '@/types'

const { t, currentLanguage, localized } = useLanguage()

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

// 25 Provinces Selector Popover
const isLocationDropdownOpen = ref(false)
const provinceSearchQuery = ref('')

const provinceOptions = computed(() => [
  {
    id: 'All',
    name: 'All Locations (Nationwide)',
    nameKh: 'ទីតាំងទាំងអស់ (ទូទាំង ២៥ ខេត្ត-ក្រុង)',
    code: 'KH'
  },
  ...CAMBODIAN_PROVINCES
])

const filteredProvinceOptions = computed(() => {
  const q = provinceSearchQuery.value.toLowerCase().trim()
  if (!q) return provinceOptions.value
  return provinceOptions.value.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.nameKh.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q)
  )
})

const selectedProvinceLabel = computed(() => {
  if (activeLocation.value === 'All') {
    return currentLanguage.value === 'kh' ? 'ទីតាំងទាំងអស់ (២៥ ខេត្ត-ក្រុង)' : 'All 25 Provinces'
  }
  const found = CAMBODIAN_PROVINCES.find(p => p.name.toLowerCase() === activeLocation.value.toLowerCase() || p.id === activeLocation.value)
  if (found) {
    return currentLanguage.value === 'kh' ? found.nameKh : found.name
  }
  return activeLocation.value
})

function selectProvince(provName: string) {
  activeLocation.value = provName === 'All Locations (Nationwide)' ? 'All' : provName
  isLocationDropdownOpen.value = false
  provinceSearchQuery.value = ''
  scrollToResults()
}

function onWindowClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.health-location-dropdown-container')) {
    isLocationDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
})

// Quick Filter Chips tailored for Cambodian citizens
const quickChips = computed(() => [
  { id: 'all', label: 'All Facilities', labelKh: 'ទាំងអស់', icon: HeartPulse },
  { id: 'public', label: 'Public Hospitals', labelKh: '🏛️ មន្ទីរពេទ្យរដ្ឋ', icon: Building2 },
  { id: 'private', label: 'Private Hospitals', labelKh: '🏥 មន្ទីរពេទ្យឯកជន', icon: HospitalIcon },
  { id: 'clinic', label: 'Clinics', labelKh: '🩺 គ្លីនិកឯកទេស', icon: Stethoscope },
  { id: 'pharmacy', label: 'Pharmacies', labelKh: '💊 ឱសថស្ថានស្របច្បាប់', icon: Pill },
  { id: 'nssf', label: 'NSSF Accepted', labelKh: '🛡️ ទទួលប័ណ្ណ ប.ស.ស', icon: ShieldCheck },
  { id: '24-7', label: '24/7 Emergency', labelKh: '🚨 សង្គ្រោះបន្ទាន់ ២៤/៧', icon: Ambulance },
  { id: 'top-rated', label: 'Top Rated 4.5+', labelKh: '⭐ ពិន្ទុ ៤.៥+', icon: Star }
])

const filteredHospitals = computed(() => {
  let result = [...allHospitals]

  // Location filter (25 provinces)
  if (activeLocation.value !== 'All') {
    const targetProvince = CAMBODIAN_PROVINCES.find(
      p => p.name.toLowerCase() === activeLocation.value.toLowerCase() || p.id === activeLocation.value
    )
    const engName = (targetProvince ? targetProvince.name : activeLocation.value).toLowerCase()
    const khName = targetProvince
      ? targetProvince.nameKh.replace('ខេត្ត', '').replace('រាជធានី', '').trim().toLowerCase()
      : ''

    result = result.filter(h => {
      const loc = (h.location || '').toLowerCase()
      const addr = (h.address || '').toLowerCase()
      const addrKh = (h.addressKh || '').toLowerCase()
      return (
        loc.includes(engName) ||
        (khName && (loc.includes(khName) || addrKh.includes(khName))) ||
        addr.includes(engName)
      )
    })
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
          <!-- Top Row: Breadcrumb -->
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <nav class="flex items-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
              <router-link to="/" class="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <span>🏠 {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}</span>
              </router-link>
              <ChevronRight class="w-3.5 h-3.5 text-white/40" />
              <span class="text-white font-bold tracking-wide">
                {{ currentLanguage === 'kh' ? 'សុខាភិបាល និងមន្ទីរពេទ្យ' : 'Healthcare & Hospitals' }}
              </span>
            </nav>
          </div>

          <!-- Main Banner Header Content -->
          <div class="max-w-3xl space-y-3.5">
            <!-- Authority Badges -->
            <div class="flex flex-wrap items-center gap-2.5">
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black backdrop-blur-md shadow-xs">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span>🇰🇭 ព្រះរាជាណាចក្រកម្ពុជា • {{ currentLanguage === 'kh' ? 'បញ្ជីរាយនាមសុខាភិបាលផ្លូវការ' : 'Verified Cambodian Healthcare Directory' }}</span>
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
                {{ currentLanguage === 'kh' ? `បង្ហាញមណ្ឌលសុខភាពក្នុង ${selectedProvinceLabel}` : `Showing facilities in ${selectedProvinceLabel}` }}
              </p>
            </div>

            <!-- 25 Provinces Selector (Moved from Banner to Results Toolbar) -->
            <div class="flex items-center gap-2">
              <span class="hidden sm:inline text-xs text-slate-500 dark:text-slate-400 font-bold">
                {{ currentLanguage === 'kh' ? 'រាជធានី-ខេត្ត:' : 'Province / City:' }}
              </span>
              <div class="relative health-location-dropdown-container">
                <button
                  type="button"
                  @click="isLocationDropdownOpen = !isLocationDropdownOpen"
                  class="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200/90 bg-slate-50 hover:bg-white dark:border-slate-700 dark:bg-slate-900/60 dark:hover:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-100 transition-all shadow-xs cursor-pointer select-none"
                >
                  <div class="flex items-center justify-center rounded-lg p-1 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <MapPin class="w-3.5 h-3.5 shrink-0" />
                  </div>

                  <div class="flex items-center gap-1.5 text-left">
                    <span class="max-w-[130px] sm:max-w-[180px] truncate font-extrabold">
                      {{ selectedProvinceLabel }}
                    </span>
                    <span class="text-[10px] px-1.5 py-0.5 rounded-md font-black bg-slate-200/80 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {{ currentLanguage === 'kh' ? '២៥ ខេត្ត-ក្រុង' : '25 Prov.' }}
                    </span>
                  </div>

                  <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isLocationDropdownOpen }" />
                </button>

              <!-- Popover Content -->
              <div
                v-if="isLocationDropdownOpen"
                class="absolute left-0 top-full mt-2 w-[280px] sm:w-[320px] rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden"
              >
                <div class="p-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <div class="relative">
                    <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                    <input
                      v-model="provinceSearchQuery"
                      type="text"
                      :placeholder="currentLanguage === 'kh' ? 'ស្វែងរក ២៥ ខេត្ត-ក្រុង...' : 'Search 25 provinces...'"
                      class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      @click.stop
                    />
                  </div>
                </div>

                <div class="max-h-60 overflow-y-auto p-1.5 space-y-0.5">
                  <button
                    v-for="prov in filteredProvinceOptions"
                    :key="prov.id"
                    type="button"
                    @click="selectProvince(prov.name)"
                    class="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-left transition-colors cursor-pointer"
                    :class="[
                      (activeLocation === 'All' && prov.id === 'All') || (activeLocation === prov.name)
                        ? 'bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 font-black'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 font-medium'
                    ]"
                  >
                    <div class="flex items-center gap-2 min-w-0">
                      <span class="text-xs">📍</span>
                      <p class="font-bold truncate">{{ currentLanguage === 'kh' ? prov.nameKh : prov.name }}</p>
                    </div>
                    <Check
                      v-if="(activeLocation === 'All' && prov.id === 'All') || (activeLocation === prov.name)"
                      class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400"
                    />
                  </button>
                </div>
              </div>
            </div>
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
                <option value="rating">⭐ {{ currentLanguage === 'kh' ? 'ពិន្ទុខ្ពស់បំផុត' : 'Top Rated' }}</option>
                <option value="reviews">💬 {{ currentLanguage === 'kh' ? 'ការវាយតម្លៃច្រើន' : 'Most Reviews' }}</option>
                <option value="name">🔤 {{ currentLanguage === 'kh' ? 'ឈ្មោះ (A-Z)' : 'Name (A-Z)' }}</option>
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
                <span>⊞</span>
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
                <span>🗺️</span>
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
                    <span>⭐ {{ hospital.rating }}</span>
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
                      {{ hospital.ownership === 'public' ? (currentLanguage === 'kh' ? '🏛️ មន្ទីរពេទ្យរដ្ឋ' : 'Public Hospital') : (currentLanguage === 'kh' ? '🏥 ឯកជន' : 'Private') }}
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
            <!-- Stylized Vector Map Canvas -->
            <div class="lg:col-span-7 relative min-h-[380px] sm:min-h-[440px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700 bg-slate-900 shadow-inner flex flex-col justify-between p-4">
              <div class="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:22px_22px] opacity-40" />
              <div class="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-950/80" />

              <!-- Vector Map Roads -->
              <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-25" xmlns="http://www.w3.org/2000/svg">
                <path d="M-30,220 Q200,100 450,280 T900,200" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="4,4" />
                <path d="M120,-20 Q280,220 380,500" fill="none" stroke="#64748b" stroke-width="1.5" />
                <circle cx="350" cy="240" r="120" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.2" />
              </svg>

              <!-- Map Header Note -->
              <div class="relative z-10 flex items-center justify-between">
                <span class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                  <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាព ' + filteredHospitals.length + ' ទីតាំង' : filteredHospitals.length + ' Verified Centers' }}</span>
                </span>
              </div>

              <!-- Clickable Facility Pins on Map -->
              <div class="absolute inset-0 z-20 pointer-events-none">
                <button
                  v-for="(hosp, idx) in filteredHospitals.slice(0, 12)"
                  :key="hosp.id"
                  type="button"
                  @click="selectedMapHospital = hosp"
                  :style="{
                    left: `${18 + (idx * 21) % 68}%`,
                    top: `${16 + (idx * 29) % 68}%`
                  }"
                  :class="[
                    'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none z-20',
                    selectedMapHospital?.id === hosp.id ? 'scale-125 z-30' : ''
                  ]"
                  :title="hosp.nameKh || hosp.name"
                >
                  <div
                    :class="[
                      'relative flex h-9 w-9 items-center justify-center rounded-2xl shadow-lg border-2 border-white transition-all',
                      hosp.category === 'hospital' ? 'bg-blue-600 text-white' :
                      hosp.category === 'clinic' ? 'bg-violet-600 text-white' :
                      'bg-emerald-600 text-white',
                      selectedMapHospital?.id === hosp.id ? 'ring-4 ring-white/50' : ''
                    ]"
                  >
                    <HeartPulse v-if="hosp.category === 'hospital'" class="h-4.5 w-4.5" />
                    <Stethoscope v-else-if="hosp.category === 'clinic'" class="h-4.5 w-4.5" />
                    <Pill v-else class="h-4.5 w-4.5" />
                  </div>

                  <span class="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md border border-white/10 z-40">
                    {{ hosp.nameKh || hosp.name }}
                  </span>
                </button>
              </div>

              <!-- Map Legend -->
              <div class="relative z-10 flex flex-wrap items-center gap-3 bg-slate-900/85 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-[11px] text-white">
                <span class="flex items-center gap-1.5 font-bold">
                  <span class="h-2.5 w-2.5 rounded-full bg-blue-500" />
                  {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital' }}
                </span>
                <span class="flex items-center gap-1.5 font-bold">
                  <span class="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  {{ currentLanguage === 'kh' ? 'គ្លីនិកឯកទេស' : 'Clinic' }}
                </span>
                <span class="flex items-center gap-1.5 font-bold">
                  <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  {{ currentLanguage === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacy' }}
                </span>
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
                    <span class="text-amber-500 text-xs font-bold">⭐ {{ selectedMapHospital.rating }}</span>
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
              <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-200 dark:border-slate-700/60">
                <a
                  :href="`tel:${selectedMapHospital.phone}`"
                  class="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-all active:scale-95 shadow-xs"
                >
                  <PhoneCall class="h-3.5 w-3.5" />
                  <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ' : 'Call' }}</span>
                </a>

                <router-link
                  :to="'/health/' + selectedMapHospital.id"
                  class="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-all shadow-xs"
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
          <div class="rounded-2xl border border-rose-100 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20 p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm">
                <Ambulance class="h-5 w-5" />
              </div>
              <span class="text-xs font-black text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-900/60 px-2.5 py-1 rounded-full">
                Free 119
              </span>
            </div>
            <h3 class="text-sm font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? '១. សង្គ្រោះបន្ទាន់ (SAMU 119)' : '1. Emergency Care (SAMU 119)' }}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'ក្នុងករណីមានគ្រោះថ្នាក់ចរាចរណ៍ ឬជំងឺធ្ងន់ធ្ងរ សូមទាក់ទងលេខ ១១៩ ភ្លាមៗដោយឥតគិតថ្លៃ និងប្រាប់ទីតាំងឱ្យបានច្បាស់លាស់។'
                : 'For critical trauma, cardiac events, or accidents, call 119 immediately with precise landmarks for free ambulance dispatch.'
              }}
            </p>
            <a
              href="tel:119"
              class="inline-flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400 hover:underline pt-1"
            >
              <span>{{ currentLanguage === 'kh' ? 'ហៅទូរស័ព្ទ ១១៩ ឥឡូវ' : 'Call 119 Hotline' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Guide 2: NSSF Health Insurance -->
          <div class="rounded-2xl border border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20 p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm">
                <ShieldCheck class="h-5 w-5" />
              </div>
              <span class="text-xs font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-900/60 px-2.5 py-1 rounded-full">
                Hotline 1286
              </span>
            </div>
            <h3 class="text-sm font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? '២. ប័ណ្ណរបបសន្តិសុខសង្គម (ប.ស.ស)' : '2. NSSF Healthcare Card' }}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'មន្ទីរពេទ្យរដ្ឋ និងគ្លីនិកដៃគូទទួលពិនិត្យ និងព្យាបាលអ្នកមានប័ណ្ណ ប.ស.ស ដោយឥតគិតថ្លៃ ឬទទួលបានការឧបត្ថម្ភស្របច្បាប់។'
                : 'Public referral hospitals and certified partner clinics provide free or subsidized treatment for active NSSF cardholders.'
              }}
            </p>
            <a
              href="tel:1286"
              class="inline-flex items-center gap-1.5 text-xs font-black text-emerald-600 dark:text-emerald-400 hover:underline pt-1"
            >
              <span>{{ currentLanguage === 'kh' ? 'ទាក់ទង ប.ស.ស ១២៨៦' : 'Call NSSF 1286' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </a>
          </div>

          <!-- Guide 3: Patient Documents -->
          <div class="rounded-2xl border border-blue-100 bg-blue-50/50 dark:border-blue-900/40 dark:bg-blue-950/20 p-5 space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <FileText class="h-5 w-5" />
              </div>
              <span class="text-xs font-black text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/60 px-2.5 py-1 rounded-full">
                Checklist
              </span>
            </div>
            <h3 class="text-sm font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? '៣. ឯកសារនាំយកពេលទៅពេទ្យ' : '3. Patient Admission Documents' }}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'សូមភ្ជាប់មកជាមួយនូវអត្តសញ្ញាណប័ណ្ណ ប័ណ្ណ ប.ស.ស (បើមាន) និងសៀវភៅតាមដានសុខភាព ឬវេជ្ជបញ្ជាចាស់ៗ។'
                : 'Always bring your National ID card, active NSSF card, and previous prescription records for seamless patient intake.'
              }}
            </p>
            <router-link
              to="/emergency"
              class="inline-flex items-center gap-1.5 text-xs font-black text-blue-600 dark:text-blue-400 hover:underline pt-1"
            >
              <span>{{ currentLanguage === 'kh' ? 'មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់' : 'Emergency Center' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </section>
    </div>
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
