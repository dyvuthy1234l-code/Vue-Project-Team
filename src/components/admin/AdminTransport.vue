<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Bus,
  Car,
  Train,
  Plane,
  Ship,
  Navigation,
  MapPin,
  Clock,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  DollarSign,
  Sparkles,
  Ticket,
  Compass
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getTransport, saveCustomTransport } from '@/services/dataService'
import transportData from '@/data/transport.json'
import type { Transport } from '@/types'

const baseTransIds = new Set((transportData as Transport[]).map(t => t.id))

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// LOAD AND PERSIST TRANSPORT ROUTES
// -------------------------------------------------------------
const transportList = ref<Transport[]>(getTransport())

function persistUserTransport() {
  try {
    const custom = transportList.value.filter(t => !baseTransIds.has(t.id) || t.id.startsWith('route-custom-') || t.id.startsWith('trans-'))
    saveCustomTransport(custom)
  } catch {}
}

// -------------------------------------------------------------
// FILTERS & SEARCH STATE
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedType = ref('All')
const selectedDestination = ref('All')

const transitTypes = ['All', 'bus', 'taxi', 'train', 'plane', 'ferry'] as const

const destinations = [
  'All',
  'Phnom Penh',
  'Siem Reap',
  'Sihanoukville',
  'Battambang',
  'Kampot'
]

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalTransportCount = computed(() => transportList.value.length)
const busCount = computed(() => transportList.value.filter(t => t.type === 'bus').length)
const taxiCount = computed(() => transportList.value.filter(t => t.type === 'taxi').length)
const multiModalCount = computed(() => transportList.value.filter(t => t.type === 'train' || t.type === 'plane' || t.type === 'ferry').length)

// -------------------------------------------------------------
// FILTERED TRANSPORT ROUTES
// -------------------------------------------------------------
const filteredTransport = computed(() => {
  return transportList.value.filter(t => {
    // 1. Type filter
    const matchType = selectedType.value === 'All' || t.type === selectedType.value

    // 2. Destination / City filter
    const matchDest = selectedDestination.value === 'All' ||
      t.location.toLowerCase().includes(selectedDestination.value.toLowerCase()) ||
      t.route.toLowerCase().includes(selectedDestination.value.toLowerCase())

    // 3. Search query
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchType && matchDest

    const matchSearch =
      t.name.toLowerCase().includes(q) ||
      (t.nameKh && t.nameKh.toLowerCase().includes(q)) ||
      t.route.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.type.toLowerCase().includes(q)

    return matchType && matchDest && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredTransport.value.length / itemsPerPage.value) || 1)

const paginatedTransport = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredTransport.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedType, selectedDestination, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// TYPE & FORMATTING HELPERS
// -------------------------------------------------------------
function getTypeLabel(type: string): string {
  if (currentLanguage.value === 'kh') {
    switch (type.toLowerCase()) {
      case 'bus': return 'រថយន្តក្រុង (Bus)'
      case 'taxi': return 'តាក់ស៊ី/កង់បី (Taxi)'
      case 'train': return 'រថភ្លើង (Train)'
      case 'plane': return 'យន្តហោះ (Flight)'
      case 'ferry': return 'ទូកល្បឿនលឿន (Ferry)'
      default: return type
    }
  }
  switch (type.toLowerCase()) {
    case 'bus': return 'Bus Service'
    case 'taxi': return 'Taxi & TukTuk'
    case 'train': return 'Train & Rail'
    case 'plane': return 'Domestic Flight'
    case 'ferry': return 'Island Ferry'
    default: return type
  }
}

function getTypeColor(type: string) {
  switch (type.toLowerCase()) {
    case 'bus':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200/90', iconBg: 'bg-blue-100 text-blue-600' }
    case 'taxi':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200/90', iconBg: 'bg-amber-100 text-amber-600' }
    case 'train':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90', iconBg: 'bg-emerald-100 text-emerald-600' }
    case 'plane':
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200/90', iconBg: 'bg-sky-100 text-sky-600' }
    case 'ferry':
      return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200/90', iconBg: 'bg-cyan-100 text-cyan-600' }
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200/90', iconBg: 'bg-slate-100 text-slate-600' }
  }
}

function getVehicleIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'bus': return Bus
    case 'taxi': return Car
    case 'train': return Train
    case 'plane': return Plane
    case 'ferry': return Ship
    default: return Compass
  }
}

function getCityLabel(city: string): string {
  if (currentLanguage.value === 'kh') {
    switch (city) {
      case 'All': return 'គ្រប់គោលដៅទាំងអស់'
      case 'Phnom Penh': return 'ភ្នំពេញ (Phnom Penh)'
      case 'Siem Reap': return 'សៀមរាប (Siem Reap)'
      case 'Sihanoukville': return 'ព្រះសីហនុ (Sihanoukville)'
      case 'Battambang': return 'បាត់ដំបង (Battambang)'
      case 'Kampot': return 'កំពត (Kampot)'
      default: return city
    }
  }
  return city === 'All' ? 'All Destinations' : city
}

function formatPrice(t: Transport): string {
  const p = t.price
  if (p.includes('1,500 KHR')) return '1,500 ៛ ($0.37)'
  if (p.includes('$12 - $17')) return '$12 - $17'
  if (p.includes('$9 - $15')) return '$9 - $15'
  if (p.includes('3,000 KHR')) return '3,000 ៛ + km'
  if (p.includes('Fixed upfront')) return currentLanguage.value === 'kh' ? 'គិតតាមចម្ងាយ (Fixed)' : 'Meter / Fixed'
  if (p.includes('$6 - $10')) return '$6 - $10'
  if (p.includes('$45 - $95')) return '$45 - $95'
  if (p.includes('$25')) return '$25 Return'
  return p.split('/')[0].split('(')[0].trim() || p
}

function formatSchedule(t: Transport): string {
  const s = t.schedule
  if (s.includes('5:30 AM')) return '5:30 AM - 8:30 PM'
  if (s.includes('24/7')) return '24/7 On-Demand'
  if (s.includes('6:00 AM and 5:00 PM')) return '6:00 AM - 5:00 PM'
  if (s.includes('Friday, Saturday')) return 'Fri - Mon (7AM/Aft)'
  if (s.includes('Multiple daily')) return currentLanguage.value === 'kh' ? 'ជើងហោះហើរប្រចាំថ្ងៃ' : 'Multiple Daily'
  if (s.includes('8:00 AM, 11:00 AM')) return 'Daily: 8AM, 11AM, 2PM'
  if (s.includes('8:30 AM, 11:30 AM')) return 'Daily: 8:30AM, 11:30AM'
  if (s.includes('6:30 AM to 3:30 PM')) return '6:30 AM - 3:30 PM'
  return s.split('(')[0].trim() || s
}

// -------------------------------------------------------------
// DETAIL MODAL (View Full Route Specifications)
// -------------------------------------------------------------
const selectedDetailTransport = ref<Transport | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(t: Transport) {
  selectedDetailTransport.value = t
  isDetailModalOpen.value = true
}

// -------------------------------------------------------------
// ADD / EDIT MODAL STATE
// -------------------------------------------------------------
const isFormModalOpen = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingTransportId = ref<string | null>(null)

const formState = reactive({
  name: '',
  nameKh: '',
  type: 'bus' as Transport['type'],
  route: '',
  price: '',
  schedule: '',
  location: 'Phnom Penh',
  image: '',
  description: '',
  descriptionKh: '',
  usefulInformation: '',
  usefulInformationKh: ''
})

function openAddModal() {
  formMode.value = 'add'
  editingTransportId.value = null
  formState.name = ''
  formState.nameKh = ''
  formState.type = 'bus'
  formState.route = ''
  formState.price = '$10 - $15'
  formState.schedule = '6:00 AM - 6:00 PM daily'
  formState.location = 'Phnom Penh'
  formState.image = 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
  formState.description = ''
  formState.descriptionKh = ''
  formState.usefulInformation = 'Tickets can be purchased at terminal counter or online booking portals.'
  formState.usefulInformationKh = 'អាចទិញសំបុត្រផ្ទាល់នៅបញ្ជរបេនឡាន ឬកក់តាមអនឡាញ។'
  isFormModalOpen.value = true
}

function openEditModal(t: Transport) {
  formMode.value = 'edit'
  editingTransportId.value = t.id
  formState.name = t.name
  formState.nameKh = t.nameKh || t.name
  formState.type = t.type
  formState.route = t.route
  formState.price = t.price
  formState.schedule = t.schedule
  formState.location = t.location
  formState.image = t.image || ''
  formState.description = t.description || ''
  formState.descriptionKh = t.descriptionKh || ''
  formState.usefulInformation = t.usefulInformation || ''
  formState.usefulInformationKh = t.usefulInformationKh || ''
  isFormModalOpen.value = true
}

function saveTransport() {
  if (!formState.name.trim() || !formState.route.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះសេវា និងខ្សែផ្លូវ!' : 'Please enter service name and route!')
    return
  }

  if (formMode.value === 'edit' && editingTransportId.value) {
    const idx = transportList.value.findIndex(t => t.id === editingTransportId.value)
    if (idx !== -1) {
      const existing = transportList.value[idx]
      transportList.value[idx] = {
        ...existing,
        name: formState.name.trim(),
        nameKh: formState.nameKh.trim() || formState.name.trim(),
        type: formState.type,
        route: formState.route.trim(),
        price: formState.price.trim() || existing.price,
        schedule: formState.schedule.trim() || existing.schedule,
        location: formState.location.trim() || existing.location,
        image: formState.image.trim() || existing.image,
        description: formState.description.trim() || existing.description,
        descriptionKh: formState.descriptionKh.trim() || existing.descriptionKh,
        usefulInformation: formState.usefulInformation.trim() || existing.usefulInformation,
        usefulInformationKh: formState.usefulInformationKh.trim() || existing.usefulInformationKh
      }
      persistUserTransport()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែព័ត៌មានខ្សែរត់ជោគជ័យ!' : 'Transport route updated!')
    }
  } else {
    const newRoute: Transport = {
      id: 'route-custom-' + Date.now(),
      name: formState.name.trim(),
      nameKh: formState.nameKh.trim() || formState.name.trim(),
      type: formState.type,
      route: formState.route.trim(),
      price: formState.price.trim() || '$10 - $15',
      schedule: formState.schedule.trim() || 'Daily schedule',
      location: formState.location.trim() || 'Cambodia',
      image: formState.image.trim() || 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
      description: formState.description.trim() || 'Reliable commuter and passenger transport service in Cambodia.',
      descriptionKh: formState.descriptionKh.trim() || 'សេវាដឹកជញ្ជូនអ្នកដំណើរប្រកបដោយផាសុកភាព និងសុវត្ថិភាព។',
      usefulInformation: formState.usefulInformation.trim() || 'Advance booking recommended during holiday seasons.',
      usefulInformationKh: formState.usefulInformationKh.trim() || 'សូមកក់សំបុត្រទុកមុនអំឡុងពេលបុណ្យទាន។'
    }
    transportList.value.unshift(newRoute)
    persistUserTransport()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមខ្សែរត់ថ្មីដោយជោគជ័យ!' : 'New transport route added!')
  }

  isFormModalOpen.value = false
}

// -------------------------------------------------------------
// DELETE MODAL (CONFIRMATION)
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingTransport = ref<Transport | null>(null)

function promptDelete(t: Transport) {
  deletingTransport.value = t
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingTransport.value) {
    const id = deletingTransport.value.id
    transportList.value = transportList.value.filter(t => t.id !== id)
    persistUserTransport()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបខ្សែរត់ដោយជោគជ័យ!' : 'Transport route deleted!')
  }
  isDeleteModalOpen.value = false
  deletingTransport.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Routes -->
      <div
        @click="selectedType = 'All'; selectedDestination = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedType === 'All' && selectedDestination === 'All' && !searchQuery
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Navigation class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សរុបគ្រប់ប្រភេទ' : 'All Modes' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalTransportCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ខ្សែរត់សរុបទាំងអស់' : 'Total Transit Routes' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: Bus Network -->
      <div
        @click="selectedType = 'bus'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedType === 'bus'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Bus class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'រថយន្តក្រុង' : 'Bus Network' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ busCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'រថយន្តក្រុង & ឡានក្រុង' : 'City & Intercity Buses' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Taxi & Ride-Hailing -->
      <div
        @click="selectedType = 'taxi'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedType === 'taxi'
            ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20'
            : 'border-slate-200/90 hover:border-amber-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Car class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? '24/7 សេវាកម្ម' : '24/7 On-Demand' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ taxiCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'តាក់ស៊ី & កង់បី PassApp/Grab' : 'Taxi & Ride-Hailing' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Multi-Modal (Train, Plane, Ferry) -->
      <div
        @click="selectedType = 'train'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedType === 'train' || selectedType === 'plane' || selectedType === 'ferry'
            ? 'border-purple-300 ring-2 ring-purple-400/20 bg-purple-50/20'
            : 'border-slate-200/90 hover:border-purple-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Train class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ពហុមធ្យោបាយ' : 'Multi-Modal' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ multiModalCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'រថភ្លើង, យន្តហោះ & ទូក' : 'Rail, Flight & Ferry' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION & FILTER TOOLBAR -->
    <div class="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
      
      <!-- Left: Search & Filters -->
      <div class="flex flex-wrap items-center gap-2 flex-1">
        
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកខ្សែរត់, ក្រុមហ៊ុន, គោលដៅ...' : 'Search routes, operators, city...'"
            class="w-full pl-9 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-khmer shadow-2xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Transit Type Dropdown -->
        <div class="relative">
          <select
            v-model="selectedType"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទមធ្យោបាយ' : 'All Transit Types' }}</option>
            <option v-for="tp in transitTypes.filter(t => t !== 'All')" :key="tp" :value="tp">
              {{ getTypeLabel(tp) }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Destination / City Hub Dropdown -->
        <div class="relative">
          <select
            v-model="selectedDestination"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option v-for="d in destinations" :key="d" :value="d">
              {{ getCityLabel(d) }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

      </div>

      <!-- Right: Action Button -->
      <div class="flex items-center gap-2 shrink-0 justify-end">
        <button
          type="button"
          @click="openAddModal"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold font-khmer shadow-xs transition-all cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'បង្កើតខ្សែរត់ថ្មី' : 'Add Route' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. TRANSPORT DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[27%]">{{ currentLanguage === 'kh' ? 'ឈ្មោះសេវា & លេខសម្គាល់' : 'Service & ID' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'ប្រភេទមធ្យោបាយ' : 'Mode' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[21%]">{{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវ & គោលដៅ' : 'Route Path' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'តម្លៃសំបុត្រ' : 'Fare' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[12%]">{{ currentLanguage === 'kh' ? 'ម៉ោងដំណើរការ' : 'Schedule' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="t in paginatedTransport"
              :key="t.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Service Name & ID -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105', getTypeColor(t.type).iconBg]">
                    <component :is="getVehicleIcon(t.type)" class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                      :title="currentLanguage === 'kh' && t.nameKh ? t.nameKh : t.name"
                    >
                      {{ currentLanguage === 'kh' && t.nameKh ? t.nameKh : t.name }}
                    </span>

                    <div class="flex items-center gap-1.5 mt-0.5 min-w-0 truncate">
                      <span class="inline-flex items-center text-[9.5px] font-mono text-slate-400 truncate">
                        ID: {{ t.id }}
                      </span>
                      <span class="text-slate-300">•</span>
                      <span class="inline-flex items-center gap-0.5 text-[9.5px] text-slate-500 font-medium truncate">
                        <MapPin class="w-2.5 h-2.5 shrink-0 text-slate-400" />
                        <span class="truncate">{{ t.location }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Transit Type Badge -->
              <td class="py-1.5 px-2.5 align-middle">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs truncate max-w-full', getTypeColor(t.type).bg]">
                  {{ getTypeLabel(t.type) }}
                </span>
              </td>

              <!-- 3. Route / Path -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] text-slate-700 font-medium max-w-full truncate" :title="t.route">
                  <Navigation class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate">{{ t.route }}</span>
                </div>
              </td>

              <!-- 4. Fare / Price -->
              <td class="py-1.5 px-2.5 align-middle">
                <div :title="t.price">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-mono shadow-2xs truncate max-w-full">
                    <DollarSign class="w-3 h-3 text-emerald-600 shrink-0" />
                    <span class="truncate">{{ formatPrice(t) }}</span>
                  </span>
                </div>
              </td>

              <!-- 5. Schedule / Hours -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium max-w-full truncate" :title="t.schedule">
                  <Clock class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate">{{ formatSchedule(t) }}</span>
                </div>
              </td>

              <!-- 6. Actions (View Details, Edit, Delete) -->
              <td class="py-1.5 px-3 align-middle text-right">
                <div class="flex items-center justify-end gap-1">
                  
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(t)"
                    class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200/60 hover:border-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(t)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white border border-amber-200/60 hover:border-amber-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit Route'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(t)"
                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 hover:border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete Route'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredTransport.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញខ្សែរត់ដែលអ្នកស្វែងរកទេ' : 'No transport routes found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try adjusting your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedType = 'All'; selectedDestination = 'All'"
                    class="mt-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold font-khmer cursor-pointer transition-colors"
                  >
                    {{ currentLanguage === 'kh' ? 'សម្អាតការស្វែងរក' : 'Clear filters' }}
                  </button>
                </div>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <!-- Table Footer with Interactive Pagination Controls -->
      <div class="p-2 sm:p-2.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
        <!-- Showing entries count info -->
        <div class="text-[11px] text-slate-600 font-medium font-khmer">
          {{ currentLanguage === 'kh' 
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredTransport.length)} នៃ ${filteredTransport.length} ខ្សែរត់សរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredTransport.length)} of ${filteredTransport.length} routes` 
          }}
        </div>

        <div class="flex items-center gap-3">
          <!-- Page size selector -->
          <div class="flex items-center gap-1.5 text-[11px] font-khmer">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'ក្នុងមួយទំព័រ:' : 'Show:' }}</span>
            <select
              v-model="itemsPerPage"
              class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option :value="8">8</option>
              <option :value="10">10</option>
              <option :value="15">15 ({{ currentLanguage === 'kh' ? 'ទាំងអស់' : 'All' }})</option>
            </select>
          </div>

          <!-- Pagination Buttons -->
          <div class="flex items-center gap-1">
            <!-- Previous Button -->
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'មុន' : 'Prev' }}</span>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                @click="goToPage(p)"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center',
                  currentPage === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <span>{{ currentLanguage === 'kh' ? 'បន្ទាប់' : 'Next' }}</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================== -->
    <!-- MODAL 1: VIEW ROUTE SPECIFICATIONS (DETAIL MODAL)        -->
    <!-- ======================================================== -->
    <div
      v-if="isDetailModalOpen && selectedDetailTransport"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs', getTypeColor(selectedDetailTransport.type).iconBg]">
              <component :is="getVehicleIcon(selectedDetailTransport.type)" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 font-khmer leading-snug">
                {{ currentLanguage === 'kh' && selectedDetailTransport.nameKh ? selectedDetailTransport.nameKh : selectedDetailTransport.name }}
              </h3>
              <p class="text-[11px] text-slate-500 font-mono">
                ID: {{ selectedDetailTransport.id }} • {{ selectedDetailTransport.location }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          
          <!-- Route Banner Image -->
          <div v-if="selectedDetailTransport.image" class="relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
            <img :src="selectedDetailTransport.image" :alt="selectedDetailTransport.name" class="w-full h-full object-cover" />
            <div class="absolute top-2.5 right-2.5">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border capitalize shadow-md backdrop-blur-xs', getTypeColor(selectedDetailTransport.type).bg]">
                {{ getTypeLabel(selectedDetailTransport.type) }}
              </span>
            </div>
          </div>

          <!-- Quick Metrics Card -->
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-khmer">
                <Ticket class="w-3.5 h-3.5 text-emerald-600" />
                <span>{{ currentLanguage === 'kh' ? 'តម្លៃសំបុត្រ' : 'Fare / Ticket Price' }}</span>
              </div>
              <span class="text-xs font-black text-emerald-700 font-mono">
                {{ selectedDetailTransport.price }}
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-khmer">
                <Clock class="w-3.5 h-3.5 text-blue-600" />
                <span>{{ currentLanguage === 'kh' ? 'កាលវិភាគ & ម៉ោងដំណើរការ' : 'Hours & Schedule' }}</span>
              </div>
              <span class="text-xs font-bold text-slate-800">
                {{ selectedDetailTransport.schedule }}
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2">
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-khmer">
                <Navigation class="w-3.5 h-3.5 text-indigo-600" />
                <span>{{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវធ្វើដំណើរ' : 'Operating Route' }}</span>
              </div>
              <span class="text-xs font-bold text-slate-800">
                {{ selectedDetailTransport.route }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-khmer">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតអំពីសេវាកម្ម' : 'Route Overview' }}
            </h4>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed font-khmer">
              {{ currentLanguage === 'kh' && selectedDetailTransport.descriptionKh ? selectedDetailTransport.descriptionKh : selectedDetailTransport.description }}
            </div>
          </div>

          <!-- Useful Tips / Instructions -->
          <div v-if="selectedDetailTransport.usefulInformation || selectedDetailTransport.usefulInformationKh" class="space-y-1.5">
            <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-khmer flex items-center gap-1">
              <Sparkles class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានមានប្រយោជន៍សម្រាប់អ្នកដំណើរ' : 'Passenger Travel Tips' }}</span>
            </h4>
            <div class="p-3 bg-amber-50/60 rounded-xl border border-amber-200/70 text-amber-900 leading-relaxed font-khmer text-[11px]">
              {{ currentLanguage === 'kh' && selectedDetailTransport.usefulInformationKh ? selectedDetailTransport.usefulInformationKh : selectedDetailTransport.usefulInformation }}
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            @click="isDetailModalOpen = false; openEditModal(selectedDetailTransport)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែខ្សែរត់នេះ' : 'Edit Route' }}</span>
          </button>
          
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
          </button>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 2: ADD / EDIT ROUTE FORM                          -->
    <!-- ======================================================== -->
    <div
      v-if="isFormModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isFormModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Bus class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 font-khmer">
              {{ formMode === 'add' 
                ? (currentLanguage === 'kh' ? 'បង្កើតខ្សែរត់ដឹកជញ្ជូនថ្មី' : 'Add New Transport Route') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានខ្សែរត់' : 'Edit Transport Route') 
              }}
            </h3>
          </div>
          <button
            type="button"
            @click="isFormModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveTransport" class="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          
          <!-- Name (En) & Name (Kh) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Route Name (English) *
              </label>
              <input
                v-model="formState.name"
                type="text"
                required
                placeholder="e.g. Phnom Penh City Bus Line 1"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ឈ្មោះខ្សែរត់ (ភាសាខ្មែរ)
              </label>
              <input
                v-model="formState.nameKh"
                type="text"
                placeholder="ឧ. រថយន្តក្រុងរាជធានីភ្នំពេញ ខ្សែទី១"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
          </div>

          <!-- Type & Location / Hub -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភេទមធ្យោបាយ *' : 'Transit Mode *' }}
              </label>
              <select
                v-model="formState.type"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 capitalize"
              >
                <option value="bus">រថយន្តក្រុង (Bus)</option>
                <option value="taxi">តាក់ស៊ី & កង់បី (Taxi)</option>
                <option value="train">រថភ្លើង (Train)</option>
                <option value="plane">យន្តហោះ (Flight)</option>
                <option value="ferry">ទូកល្បឿនលឿន (Ferry)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ទីតាំង / មជ្ឈមណ្ឌល' : 'Location / Hub' }}
              </label>
              <input
                v-model="formState.location"
                type="text"
                placeholder="Phnom Penh, Siem Reap, etc."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
          </div>

          <!-- Route Path & Price / Fare -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវធ្វើដំណើរ *' : 'Route / Path *' }}
              </label>
              <input
                v-model="formState.route"
                type="text"
                required
                placeholder="e.g. Phnom Penh - Siem Reap"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'តម្លៃសំបុត្រ / សេវា' : 'Fare / Price' }}
              </label>
              <input
                v-model="formState.price"
                type="text"
                placeholder="e.g. $10 - $15 or 1,500 KHR"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Schedule & Image URL -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ម៉ោងដំណើរការ & កាលវិភាគ' : 'Operating Schedule' }}
              </label>
              <input
                v-model="formState.schedule"
                type="text"
                placeholder="e.g. 5:30 AM - 8:30 PM daily"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'តំណភ្ជាប់រូបភាព (Image URL)' : 'Image URL' }}
              </label>
              <input
                v-model="formState.image"
                type="url"
                placeholder="https://..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Description (Khmer & English) -->
          <div class="space-y-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ការពិពណ៌នាជាភាសាខ្មែរ
              </label>
              <textarea
                v-model="formState.descriptionKh"
                rows="2"
                placeholder="រៀបរាប់ពីព័ត៌មានលម្អិតអំពីខ្សែរត់ និងការផ្ដល់សេវា..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              ></textarea>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Description (English)
              </label>
              <textarea
                v-model="formState.description"
                rows="2"
                placeholder="Detailed description of transit service..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Useful Info (Khmer & English) -->
          <div class="space-y-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ព័ត៌មានមានប្រយោជន៍សម្រាប់អ្នកដំណើរ (ភាសាខ្មែរ)
              </label>
              <input
                v-model="formState.usefulInformationKh"
                type="text"
                placeholder="ឧ. អាចទិញសំបុត្រទុកមុន ឬប្រើប្រាស់កម្មវិធី..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Useful Travel Tips (English)
              </label>
              <input
                v-model="formState.usefulInformation"
                type="text"
                placeholder="e.g. Booking in advance recommended for weekend trips."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-khmer shadow-sm transition-all cursor-pointer"
            >
              {{ formMode === 'add' 
                ? (currentLanguage === 'kh' ? 'រក្សាទុកខ្សែរត់' : 'Save Route') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាន' : 'Update Route') 
              }}
            </button>
          </div>

        </form>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 3: DELETE CONFIRMATION DIALOG                     -->
    <!-- ======================================================== -->
    <div
      v-if="isDeleteModalOpen && deletingTransport"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 text-center">
        
        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 class="w-5 h-5" />
        </div>

        <h3 class="text-sm font-bold text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកពិតជាចង់លុបខ្សែរត់នេះមែនទេ?' : 'Confirm Route Deletion' }}
        </h3>

        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">
            {{ currentLanguage === 'kh' && deletingTransport.nameKh ? deletingTransport.nameKh : deletingTransport.name }}
          </strong>
          <br />
          {{ currentLanguage === 'kh' ? 'ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់មកវិញបានទេ។' : 'This transit route will be permanently removed.' }}
        </p>

        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-khmer shadow-sm transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'យល់ព្រមលុប' : 'Yes, Delete' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
