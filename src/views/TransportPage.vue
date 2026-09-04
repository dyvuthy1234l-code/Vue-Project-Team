<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Clock,
  Compass,
  Bus,
  Car,
  Train,
  Plane,
  Ship,
  RotateCcw,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowRightLeft,
  Smartphone,
  ExternalLink,
  CreditCard,
  Ticket
} from 'lucide-vue-next'
import ServiceHeroBanner from '@/components/ServiceHeroBanner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getTransport } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized, currentLanguage } = useLanguage()

usePageMeta({
  title: 'ការធ្វើដំណើរ និងរថយន្តក្រុងសាធារណៈ — CamLife Public Transit & Routes',
  description: 'មគ្គុទ្ទេសក៍ខ្សែរថយន្តក្រុងរាជធានីភ្នំពេញ តម្លៃសំបុត្រ និងគោលការណ៍ជិះឥតគិតថ្លៃសម្រាប់ពលរដ្ឋ'
})

const allTransport = getTransport()

// Active View: 'all-routes' vs 'city-bus-lines'
const activeViewTab = ref<'all-routes' | 'city-bus-lines'>('all-routes')

// Journey Planner State
const originStation = ref('')
const destinationStation = ref('')
const selectedType = ref('All')

// Common Stations for rapid picking
const popularHubs = [
  { name: 'Phnom Penh', nameKh: 'រាជធានីភ្នំពេញ' },
  { name: 'Siem Reap', nameKh: 'ខេត្តសៀមរាប' },
  { name: 'Sihanoukville', nameKh: 'ក្រុងព្រះសីហនុ' },
  { name: 'Battambang', nameKh: 'ខេត្តបាត់ដំបង' },
  { name: 'Kampot', nameKh: 'ខេត្តកំពត' },
  { name: 'Koh Rong', nameKh: 'កោះរ៉ុង' },
  { name: 'Poipet', nameKh: 'ក្រុងប៉ោយប៉ែត' }
]

// Official Phnom Penh City Bus Lines data
interface CityBusLine {
  id: string
  number: string
  color: string
  name: string
  nameKh: string
  stops: string[]
  stopsKh: string[]
  operatingHours: string
  frequency: string
  fare: string
  fareKh: string
}

const cityBusLines: CityBusLine[] = [
  {
    id: 'line-1a',
    number: 'Line 01A',
    color: 'bg-rose-600 text-white border-rose-700',
    name: 'Prek Pnov Bus Station ⇄ Chbar Ampov Terminal',
    nameKh: 'ចំណតព្រែកព្នៅ ⇄ ចំណតច្បារអំពៅ (តាមមហាវិថីព្រះមុនីវង្ស)',
    stops: ['Prek Pnov', 'Kilometer 9', 'Calmette Hospital', 'Central Market', 'Monivong Bridge', 'Chbar Ampov'],
    stopsKh: ['ព្រែកព្នៅ', 'គីឡូម៉ែត្រលេខ ៩', 'មន្ទីរពេទ្យកាល់ម៉ែត', 'ផ្សារធំថ្មី', 'ស្ពានព្រះមុនីវង្ស', 'ច្បារអំពៅ'],
    operatingHours: '5:30 AM - 8:30 PM',
    frequency: '10 - 15 mins',
    fare: '1,500 KHR / Free for Students & Seniors',
    fareKh: '១,៥០០ រៀល / ឥតគិតថ្លៃសម្រាប់សិស្ស និងមនុស្សចាស់'
  },
  {
    id: 'line-02',
    number: 'Line 02',
    color: 'bg-emerald-600 text-white border-emerald-700',
    name: 'Kouch Kanong Roundabout ⇄ Ta Khmao Town',
    nameKh: 'រង្វង់មូលគួចកាណុង ⇄ ក្រុងតាខ្មៅ (តាមផ្លូវជាតិលេខ ២)',
    stops: ['Kouch Kanong', 'Wat Phnom', 'Independence Monument', 'Chak Angre', 'Ta Khmao'],
    stopsKh: ['គួចកាណុង', 'វត្តភ្នំ', 'វិមានឯករាជ្យ', 'ចាក់អង្រែ', 'ក្រុងតាខ្មៅ'],
    operatingHours: '5:30 AM - 8:30 PM',
    frequency: '10 - 15 mins',
    fare: '1,500 KHR / Free for Students & Seniors',
    fareKh: '១,៥០០ រៀល / ឥតគិតថ្លៃសម្រាប់សិស្ស និងមនុស្សចាស់'
  },
  {
    id: 'line-03',
    number: 'Line 03',
    color: 'bg-blue-600 text-white border-blue-700',
    name: 'Russey Keo Park ⇄ Borey Santepheap 2 (Russian Blvd)',
    nameKh: 'សួនឬស្សីកែវ ⇄ បុរីសន្តិភាព ២ (តាមមហាវិថីសហព័ន្ធរុស្ស៊ី)',
    stops: ['Russey Keo', 'Toul Kork Antenna', 'Airport (PNH)', 'Chom Chao', 'Borey Santepheap 2'],
    stopsKh: ['ឬស្សីកែវ', 'អង់តែនទួលគោក', 'ព្រលានយន្តហោះភ្នំពេញ', 'ចោមចៅ', 'បុរីសន្តិភាព ២'],
    operatingHours: '5:30 AM - 8:30 PM',
    frequency: '12 - 15 mins',
    fare: '1,500 KHR / Free for Students & Seniors',
    fareKh: '១,៥០០ រៀល / ឥតគិតថ្លៃសម្រាប់សិស្ស និងមនុស្សចាស់'
  },
  {
    id: 'line-04a',
    number: 'Line 04A',
    color: 'bg-purple-600 text-white border-purple-700',
    name: 'Russey Keo ⇄ Borey Santepheap 2 (via Veng Sreng)',
    nameKh: 'សួនឬស្សីកែវ ⇄ បុរីសន្តិភាព ២ (តាមផ្លូវវេងស្រេង)',
    stops: ['Russey Keo', 'Phsar Depo', 'Stung Meanchey', 'Veng Sreng', 'Borey Santepheap 2'],
    stopsKh: ['ឬស្សីកែវ', 'ផ្សារដេប៉ូ', 'ស្ទឹងមានជ័យ', 'វេងស្រេង', 'បុរីសន្តិភាព ២'],
    operatingHours: '5:30 AM - 8:30 PM',
    frequency: '15 mins',
    fare: '1,500 KHR / Free for Students & Seniors',
    fareKh: '១,៥០០ រៀល / ឥតគិតថ្លៃសម្រាប់សិស្ស និងមនុស្សចាស់'
  },
  {
    id: 'line-05',
    number: 'Line 05',
    color: 'bg-amber-600 text-white border-amber-700',
    name: 'Aeon Mall Sen Sok (Aeon 2) ⇄ Koh Pich / Aeon 1',
    nameKh: 'ផ្សារអ៊ីអន ២ សែនសុខ ⇄ កោះពេជ្រ / អ៊ីអន ១',
    stops: ['Aeon 2 Sen Sok', 'Phnom Penh Thmey', 'Phsar Thom Thmey', 'NagaWorld', 'Koh Pich'],
    stopsKh: ['អ៊ីអន ២ សែនសុខ', 'ភ្នំពេញថ្មី', 'ផ្សារធំថ្មី', 'ណាហ្គាវើលដ៍', 'កោះពេជ្រ'],
    operatingHours: '5:30 AM - 8:30 PM',
    frequency: '15 - 20 mins',
    fare: '1,500 KHR / Free for Students & Seniors',
    fareKh: '១,៥០០ រៀល / ឥតគិតថ្លៃសម្រាប់សិស្ស និងមនុស្សចាស់'
  },
  {
    id: 'line-06',
    number: 'Line 06',
    color: 'bg-teal-600 text-white border-teal-700',
    name: 'Kouch Kanong Roundabout ⇄ Century Plaza Market',
    nameKh: 'រង្វង់មូលគួចកាណុង ⇄ ផ្សារស៊ិនជូរីផ្លាហ្សា (តាមផ្លូវលេខ ២៧១)',
    stops: ['Kouch Kanong', 'French Embassy', 'Depo Market', '271 Medical Center', 'Century Plaza'],
    stopsKh: ['គួចកាណុង', 'ស្ថានទូតបារាំង', 'ផ្សារដេប៉ូ', 'ផ្លូវ ២៧១', 'ស៊ិនជូរីផ្លាហ្សា'],
    operatingHours: '5:30 AM - 8:30 PM',
    frequency: '15 mins',
    fare: '1,500 KHR / Free for Students & Seniors',
    fareKh: '១,៥០០ រៀល / ឥតគិតថ្លៃសម្រាប់សិស្ស និងមនុស្សចាស់'
  }
]

const selectedBusLine = ref<CityBusLine | null>(cityBusLines[0] ?? null)

// Transit types for filter
const transitTypes = computed(() => [
  { value: 'All', label: currentLanguage.value === 'kh' ? 'គ្រប់ប្រភេទ' : 'All Modes', icon: Compass },
  { value: 'bus', label: currentLanguage.value === 'kh' ? 'រថយន្តក្រុង (Bus)' : 'City & Intercity Bus', icon: Bus },
  { value: 'taxi', label: currentLanguage.value === 'kh' ? 'កង់បី/តាក់ស៊ី (Ride-Hail)' : 'Tuk-Tuk & Taxis', icon: Car },
  { value: 'train', label: currentLanguage.value === 'kh' ? 'រថភ្លើង (Train)' : 'Royal Railway', icon: Train },
  { value: 'plane', label: currentLanguage.value === 'kh' ? 'យន្តហោះ (Air)' : 'Domestic Flights', icon: Plane },
  { value: 'ferry', label: currentLanguage.value === 'kh' ? 'ទូកល្បឿនលឿន (Ferry)' : 'Speed Ferry', icon: Ship },
])

const filteredTransport = computed(() => {
  let result = allTransport

  if (selectedType.value !== 'All') {
    result = result.filter(tItem => tItem.type === selectedType.value)
  }

  const orig = originStation.value.toLowerCase().trim()
  const dest = destinationStation.value.toLowerCase().trim()

  if (orig) {
    result = result.filter(tItem =>
      tItem.route.toLowerCase().includes(orig) ||
      tItem.location.toLowerCase().includes(orig) ||
      tItem.name.toLowerCase().includes(orig) ||
      (tItem.nameKh && tItem.nameKh.toLowerCase().includes(orig))
    )
  }

  if (dest) {
    result = result.filter(tItem =>
      tItem.route.toLowerCase().includes(dest) ||
      tItem.location.toLowerCase().includes(dest) ||
      tItem.description.toLowerCase().includes(dest) ||
      (tItem.descriptionKh && tItem.descriptionKh.toLowerCase().includes(dest))
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

const typeStyles: Record<string, { icon: any; badge: string; color: string }> = {
  bus: { icon: Bus, badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200', color: 'text-emerald-600' },
  taxi: { icon: Car, badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200', color: 'text-amber-600' },
  train: { icon: Train, badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200', color: 'text-blue-600' },
  plane: { icon: Plane, badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200', color: 'text-purple-600' },
  ferry: { icon: Ship, badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200', color: 'text-cyan-600' }
}

function swapStations() {
  const temp = originStation.value
  originStation.value = destinationStation.value
  destinationStation.value = temp
}

function setHub(hubName: string) {
  if (!originStation.value) {
    originStation.value = hubName
  } else {
    destinationStation.value = hubName
  }
}

function resetPlanner() {
  originStation.value = ''
  destinationStation.value = ''
  selectedType.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Service Hero Banner with 25 Provinces Selector -->
    <ServiceHeroBanner
      :title="t('transport.title')"
      :subtitle="t('transport.subtitle')"
      badge="Public Transit & Route Network"
      badge-kh="បណ្តាញដឹកជញ្ជូន & រថយន្តក្រុងសាធារណៈ"
      banner-image="/images/pillars/transport.jpg"
      :breadcrumb-current="t('nav.transport')"
    />

    <!-- Free Public Bus Policy Callout Banner for Cambodian Citizens -->
    <div class="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Bus class="w-64 h-64 text-white" />
      </div>

      <div class="relative z-10 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shrink-0">
              <Bus class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-black tracking-tight">
                  {{ currentLanguage === 'kh' ? 'គោលការណ៍ជិះរថយន្តក្រុងសាធារណៈដោយឥតគិតថ្លៃ (Free Bus Policy)' : 'Phnom Penh Municipal Free Bus Policy' }}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 border border-white/30 uppercase">
                  100% Free / ឥតគិតថ្លៃ
                </span>
              </div>
              <p class="text-xs text-emerald-100 mt-1">
                {{ currentLanguage === 'kh' ? 'រដ្ឋបាលរាជធានីភ្នំពេញ ផ្តល់សេវាជិះរថយន្តក្រុងសាធារណៈដោយឥតគិតថ្លៃ ជូនចំពោះប្រជាពលរដ្ឋអាទិភាពដូចខាងក្រោម៖' : 'Phnom Penh Capital Administration grants free public transit passes to priority citizens:' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1 text-xs font-bold text-white">
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'សិស្ស-និស្សិត' : 'Students' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ព្រះសង្ឃ' : 'Monks' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'មនុស្សចាស់ (៧០+)' : 'Elderly (70+)' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'អ្នកកាន់ប័ណ្ណ ប.ស.ស' : 'NSSF Cardholders' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'កម្មកររោងចក្រ' : 'Factory Workers' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ជនមានពិការភាព' : 'Persons with Disability' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main View Switcher: Journey Route Planner vs Phnom Penh City Bus Lines -->
    <div class="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
      <div class="flex items-center gap-2">
        <button
          @click="activeViewTab = 'all-routes'"
          class="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
          :class="activeViewTab === 'all-routes'
            ? 'bg-[#0D47A1] text-white shadow-md'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
        >
          <Compass class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ស្វែងរកជើងធ្វើដំណើរ & បណ្តាញផ្លូវរត់' : 'Journey Planner & All Transit' }}</span>
        </button>

        <button
          @click="activeViewTab = 'city-bus-lines'"
          class="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
          :class="activeViewTab === 'city-bus-lines'
            ? 'bg-emerald-600 text-white shadow-md'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
        >
          <Bus class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ខ្សែរត់រថយន្តក្រុងភ្នំពេញ (City Bus Lines)' : 'Phnom Penh City Bus Lines (PPA)' }}</span>
        </button>
      </div>

      <div class="hidden md:block">
        <VerificationBadge compact />
      </div>
    </div>

    <!-- VIEW 1: JOURNEY PLANNER & ALL TRANSIT ROUTES -->
    <div v-if="activeViewTab === 'all-routes'" class="space-y-8">
      <!-- Interactive Route Finder Console (FROM ➔ TO Console) -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-5">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2.5 h-2.5 rounded-full bg-[#0D47A1]" />
            <h3 class="text-xs font-black uppercase tracking-wider text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? 'រៀបចំផែនការធ្វើដំណើរ (Cambodia Route Finder)' : 'Cambodia Intercity & Transit Route Finder' }}
            </h3>
          </div>
          <button
            v-if="originStation || destinationStation || selectedType !== 'All'"
            @click="resetPlanner"
            class="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw class="w-3 h-3" />
            <span>{{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset' }}</span>
          </button>
        </div>

        <!-- FROM ➔ TO Search Inputs with Swap Button -->
        <div class="grid grid-cols-1 md:grid-cols-11 gap-3 items-center">
          <!-- Origin Station -->
          <div class="md:col-span-5 relative">
            <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">
              {{ currentLanguage === 'kh' ? 'ចេញដំណើរពី (Origin Station / City)' : 'Departing From' }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-emerald-600">
                <MapPin class="w-4 h-4" />
              </div>
              <input
                v-model="originStation"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ឧ. Phnom Penh, Prek Pnov, Siem Reap...' : 'e.g., Phnom Penh, Siem Reap...'"
                class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
              />
            </div>
          </div>

          <!-- Swap Button -->
          <div class="md:col-span-1 flex justify-center pt-5">
            <button
              @click="swapStations"
              class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105"
              type="button"
              title="Swap Origin and Destination"
            >
              <ArrowRightLeft class="w-4 h-4" />
            </button>
          </div>

          <!-- Destination Station -->
          <div class="md:col-span-5 relative">
            <label class="block text-[11px] font-bold text-slate-400 dark:text-slate-500 mb-1">
              {{ currentLanguage === 'kh' ? 'ទៅកាន់ (Destination Station / City)' : 'Arrival Destination' }}
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-red-500">
                <MapPin class="w-4 h-4" />
              </div>
              <input
                v-model="destinationStation"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ឧ. Siem Reap, Sihanoukville, Kampot...' : 'e.g., Siem Reap, Sihanoukville...'"
                class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
              />
            </div>
          </div>
        </div>

        <!-- Quick Hub Selector Chips -->
        <div class="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span class="text-slate-400 font-bold mr-1">{{ currentLanguage === 'kh' ? 'តំបន់សំខាន់ៗ៖' : 'Key Hubs:' }}</span>
          <button
            v-for="hub in popularHubs"
            :key="hub.name"
            @click="setHub(hub.name)"
            type="button"
            class="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-300 font-bold border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? hub.nameKh : hub.name }}
          </button>
        </div>

        <!-- Mode Pills Filter -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="mode in transitTypes"
              :key="mode.value"
              @click="selectedType = mode.value"
              type="button"
              class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border"
              :class="selectedType === mode.value
                ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
            >
              <component :is="mode.icon" class="w-3.5 h-3.5" />
              <span>{{ mode.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Result Count Banner -->
      <div class="flex items-center justify-between">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          {{ currentLanguage === 'kh' ? 'រកឃើញជម្រើសធ្វើដំណើរចំនួន' : 'Found' }}
          <span class="text-[#0A2540] dark:text-white font-black">{{ filteredTransport.length }}</span>
          {{ currentLanguage === 'kh' ? 'ខ្សែរត់ និងប្រតិបត្តិករ' : 'transit lines & operators' }}
        </p>
      </div>

      <!-- Transport Route Cards with Visual Route Timeline -->
      <div v-if="paginatedTransport.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in paginatedTransport"
          :key="item.id"
          class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <!-- Representative Transit Image Banner -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <LazyImage
                v-if="item.image"
                :src="item.image"
                :alt="localized(item.name, item.nameKh)"
                img-class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-700 dark:to-slate-800 text-amber-600"
              >
                <Bus class="w-12 h-12 opacity-50" />
              </div>

              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

              <!-- Top Row: Type Badge + Location Overlaid on Image -->
              <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span :class="['px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xl border flex items-center gap-1.5 shadow-sm backdrop-blur-md', typeStyles[item.type]?.badge || 'bg-slate-100 text-slate-700 border-slate-200']">
                  <component :is="typeStyles[item.type]?.icon || Bus" class="w-3.5 h-3.5" />
                  <span>{{ item.type }}</span>
                </span>

                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 shadow-sm backdrop-blur-md">
                  <MapPin class="w-3 h-3 text-red-500" />
                  <span>{{ item.location }}</span>
                </span>
              </div>

              <!-- Price Floating Tag -->
              <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span class="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-400/40">
                  <Ticket class="w-3.5 h-3.5" />
                  <span>{{ item.price }}</span>
                </span>
                <span class="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <Clock class="w-3 h-3 text-blue-300" />
                  <span>{{ item.schedule }}</span>
                </span>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <!-- Name & Route Details -->
              <div>
                <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {{ localized(item.name, item.nameKh) }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {{ localized(item.description, item.descriptionKh) }}
                </p>
              </div>

              <!-- Route Path Visual Timeline -->
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{{ currentLanguage === 'kh' ? 'ទិសដៅខ្សែរត់ (Route Coverage)' : 'Route Coverage' }}</span>
                  <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck class="w-3 h-3" />
                    <span>Official Service</span>
                  </span>
                </div>
                <div class="text-xs font-black text-[#0D47A1] dark:text-blue-300 flex items-start gap-2">
                  <MapPin class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span class="leading-relaxed">{{ item.route }}</span>
                </div>
              </div>

              <!-- Useful Information Tip Box -->
              <div v-if="item.usefulInformation || item.usefulInformationKh" class="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Smartphone class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p class="text-[11px] leading-relaxed">
                  {{ localized(item.usefulInformation, item.usefulInformationKh) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div class="px-6 pb-6 pt-0">
            <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <span class="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <CreditCard class="w-3.5 h-3.5 text-slate-400" />
                <span>Cash & KHQR</span>
              </span>

              <a
                :href="'https://www.google.com/maps/search/' + encodeURIComponent(item.route + ' ' + item.location + ' Cambodia')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0D47A1] dark:text-blue-300 hover:bg-[#0D47A1] hover:text-white dark:hover:bg-blue-600 text-xs font-bold border border-blue-200/70 dark:border-blue-700/60 transition-all cursor-pointer"
              >
                <span>{{ currentLanguage === 'kh' ? 'មើលផែនទី & ស្ថានីយ' : 'View Route on Maps' }}</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
        <EmptyState
          :title="t('transport.emptyTitle')"
          :subtitle="t('transport.emptySubtitle')"
          :action-label="t('transport.resetSearch')"
          @action="resetPlanner"
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

    <!-- VIEW 2: PHNOM PENH CITY BUS LINES (PPA) VISUAL EXPLORER -->
    <div v-else-if="activeViewTab === 'city-bus-lines'" class="space-y-6">
      <!-- Intro Card for City Bus -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white">
                {{ currentLanguage === 'kh' ? 'បណ្តាញរថយន្តក្រុងសាធារណៈរាជធានីភ្នំពេញ (PPA Municipal Bus Lines)' : 'Phnom Penh City Bus Authority Municipal Network' }}
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-3xl">
              {{ currentLanguage === 'kh' ? 'រថយន្តក្រុងសាធារណៈម៉ាស៊ីនត្រជាក់ ដំណើរការជារៀងរាល់ថ្ងៃ ចាប់ពីម៉ោង 5:30 ព្រឹក ដល់ 8:30 យប់។ សំបុត្រតម្លៃ ១,៥០០ រៀល ឬឥតគិតថ្លៃសម្រាប់សិស្ស-និស្សិត និងមនុស្សចាស់។' : 'Clean air-conditioned municipal buses operating daily from 5:30 AM to 8:30 PM with departures every 10-15 minutes.' }}
            </p>
          </div>

          <!-- Live App Tip -->
          <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl flex items-center gap-3 shrink-0">
            <Smartphone class="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p class="text-xs font-black text-emerald-900 dark:text-emerald-200">
                {{ currentLanguage === 'kh' ? 'កម្មវិធីទូរស័ព្ទ "City Bus"' : 'Official "City Bus" App' }}
              </p>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-300">
                {{ currentLanguage === 'kh' ? 'តាមដានទីតាំងឡានក្រុងតាម GPS ជាក់ស្តែង' : 'Live GPS tracking for all lines' }}
              </p>
            </div>
          </div>
        </div>

        <!-- City Bus Line Selectors -->
        <div class="pt-6 border-t border-slate-100 dark:border-slate-700/60 mt-6">
          <label class="block text-xs font-bold text-slate-400 mb-2">
            {{ currentLanguage === 'kh' ? 'ជ្រើសរើសខ្សែរត់រថយន្តក្រុង ដើម្បីមើលចំណតលម្អិត៖' : 'Select a City Bus Line to view route stations & timetable:' }}
          </label>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="line in cityBusLines"
              :key="line.id"
              @click="selectedBusLine = line"
              type="button"
              class="px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border shadow-2xs"
              :class="selectedBusLine?.id === line.id
                ? `${line.color} ring-2 ring-offset-2 ring-emerald-500`
                : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'"
            >
              <Bus class="w-3.5 h-3.5" />
              <span>{{ line.number }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Active City Bus Line Details & Visual Station Stop Sequence -->
      <div v-if="selectedBusLine" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <span :class="['px-3 py-1 rounded-xl text-xs font-black inline-block mb-2', selectedBusLine.color]">
              {{ selectedBusLine.number }}
            </span>
            <h3 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white">
              {{ localized(selectedBusLine.name, selectedBusLine.nameKh) }}
            </h3>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-xs">
            <div class="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200/60 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5" />
              <span>{{ selectedBusLine.operatingHours }} ({{ selectedBusLine.frequency }})</span>
            </div>
            <div class="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-200/60 flex items-center gap-1.5">
              <Ticket class="w-3.5 h-3.5" />
              <span>{{ localized(selectedBusLine.fare, selectedBusLine.fareKh) }}</span>
            </div>
          </div>
        </div>

        <!-- Visual Station Stop Timeline -->
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400">
            {{ currentLanguage === 'kh' ? 'លំដាប់ស្ថានីយចំណតសំខាន់ៗ (Key Bus Stations Sequence)' : 'Key Bus Stations Sequence' }}
          </h4>

          <div class="relative overflow-x-auto py-4">
            <div class="flex items-center min-w-max gap-3 sm:gap-4 px-2">
              <template v-for="(stop, index) in (currentLanguage === 'kh' ? selectedBusLine.stopsKh : selectedBusLine.stops)" :key="index">
                <!-- Station Stop Node -->
                <div class="flex flex-col items-center text-center max-w-[120px]">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-4 ring-white dark:ring-slate-800"
                    :class="index === 0 || index === (selectedBusLine.stops.length - 1)
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'"
                  >
                    {{ index + 1 }}
                  </div>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200 mt-2 line-clamp-2">
                    {{ stop }}
                  </span>
                  <span class="text-[10px] text-slate-400 mt-0.5">
                    {{ index === 0 ? (currentLanguage === 'kh' ? 'ដើមខ្សែ' : 'Terminal') : (index === selectedBusLine.stops.length - 1 ? (currentLanguage === 'kh' ? 'ចុងខ្សែ' : 'Terminal') : (currentLanguage === 'kh' ? 'ចំណត' : 'Stop')) }}
                  </span>
                </div>

                <!-- Connector Arrow (if not last) -->
                <div v-if="index < selectedBusLine.stops.length - 1" class="flex items-center text-slate-300 dark:text-slate-600 px-1">
                  <div class="w-8 sm:w-12 h-0.5 bg-slate-300 dark:bg-slate-600 relative">
                    <ArrowRight class="w-3 h-3 absolute -right-1.5 -top-1 text-slate-400" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Google Maps Direct Link -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p class="text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {{ currentLanguage === 'kh' ? 'ចំណាំ៖ រថយន្តក្រុងឈប់នៅតាមផ្លាកសញ្ញាចំណតរថយន្តក្រុង (Bus Stop Signs) តាមបណ្តោយខ្សែរត់នីមួយៗ។' : 'Note: Buses only board and alight passengers at designated municipal bus stops along the corridor.' }}
          </p>
          <a
            :href="'https://www.google.com/maps/search/' + encodeURIComponent(selectedBusLine.name + ' Phnom Penh Bus Stop')"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-blue-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទីតាំងចំណតលើ Google Maps' : 'View Stops on Google Maps' }}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
