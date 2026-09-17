<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Home,
  Wrench,
  Zap,
  Star,
  Phone,
  MapPin,
  DollarSign,
  Search,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Award
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getHomeServices, saveCustomHomeServices } from '@/services/dataService'
import homeServicesData from '@/data/home-services.json'
import type { HomeService } from '@/types'

const baseHSSIds = new Set((homeServicesData as HomeService[]).map(s => s.id))

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// LOAD AND PERSIST HOME SERVICES
// -------------------------------------------------------------
const serviceList = ref<HomeService[]>(getHomeServices())

function persistUserHomeServices() {
  try {
    const custom = serviceList.value.filter(s => !baseHSSIds.has(s.id) || s.id.startsWith('srv-custom-') || s.id.startsWith('hs-'))
    saveCustomHomeServices(custom)
  } catch {}
}

// -------------------------------------------------------------
// FILTERS & SEARCH STATE
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedLocation = ref('All')

const homeCategories = [
  'All',
  'AC Repair',
  'Electrician',
  'Plumber',
  'Cleaning',
  'Painting',
  'Car Repair',
  'Handyman',
  'Other Services'
] as const

const locations = ['All', 'Phnom Penh', 'Siem Reap', 'Battambang'] as const

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalServicesCount = computed(() => serviceList.value.length)
const acPlumbingCount = computed(() => serviceList.value.filter(s => s.category === 'AC Repair' || s.category === 'Plumber').length)
const topRatedCount = computed(() => serviceList.value.filter(s => s.rating >= 4.8).length)
const electricianCleaningCount = computed(() => serviceList.value.filter(s => s.category === 'Electrician' || s.category === 'Cleaning').length)

// -------------------------------------------------------------
// FILTERED SERVICES
// -------------------------------------------------------------
const filteredServices = computed(() => {
  return serviceList.value.filter(s => {
    // 1. Category filter
    const matchCat = selectedCategory.value === 'All' || s.category === selectedCategory.value

    // 2. Location filter
    const matchLoc = selectedLocation.value === 'All' ||
      s.location.toLowerCase().includes(selectedLocation.value.toLowerCase())

    // 3. Search query
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat && matchLoc

    const matchSearch =
      s.serviceName.toLowerCase().includes(q) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(q)) ||
      s.provider.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)

    return matchCat && matchLoc && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage.value) || 1)

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredServices.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedCategory, selectedLocation, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// CATEGORY & BADGE HELPERS
// -------------------------------------------------------------
function getCategoryLabel(cat: string): string {
  if (currentLanguage.value === 'kh') {
    switch (cat) {
      case 'AC Repair': return 'ជួសជុលម៉ាស៊ីនត្រជាក់'
      case 'Electrician': return 'ជាងអគ្គិសនី'
      case 'Plumber': return 'ជាងទុយោទឹក'
      case 'Cleaning': return 'សេវាបោសសម្អាត'
      case 'Painting': return 'ជាងលាបថ្នាំ'
      case 'Car Repair': return 'ជួសជុលរថយន្ត'
      case 'Handyman': return 'ជាងជួសជុលទូទៅ'
      case 'Other Services': return 'សេវាកម្មផ្សេងៗ'
      default: return cat
    }
  }
  return cat
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'AC Repair':
      return { bg: 'bg-sky-50 text-sky-700 border-sky-200/90', iconBg: 'bg-sky-100 text-sky-600' }
    case 'Electrician':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200/90', iconBg: 'bg-amber-100 text-amber-600' }
    case 'Plumber':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200/90', iconBg: 'bg-blue-100 text-blue-600' }
    case 'Cleaning':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90', iconBg: 'bg-emerald-100 text-emerald-600' }
    case 'Painting':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200/90', iconBg: 'bg-purple-100 text-purple-600' }
    case 'Car Repair':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200/90', iconBg: 'bg-rose-100 text-rose-600' }
    case 'Handyman':
      return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/90', iconBg: 'bg-indigo-100 text-indigo-600' }
    default:
      return { bg: 'bg-teal-50 text-teal-700 border-teal-200/90', iconBg: 'bg-teal-100 text-teal-600' }
  }
}

function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'AC Repair': return Sparkles
    case 'Electrician': return Zap
    case 'Plumber': return Wrench
    case 'Cleaning': return Sparkles
    case 'Painting': return Award
    case 'Car Repair': return Wrench
    case 'Handyman': return Home
    default: return Home
  }
}

function getCityLabel(city: string): string {
  if (currentLanguage.value === 'kh') {
    switch (city) {
      case 'All': return 'គ្រប់ទីតាំងទាំងអស់'
      case 'Phnom Penh': return 'ភ្នំពេញ (Phnom Penh)'
      case 'Siem Reap': return 'សៀមរាប (Siem Reap)'
      case 'Battambang': return 'បាត់ដំបង (Battambang)'
      default: return city
    }
  }
  return city === 'All' ? 'All Locations' : city
}

// -------------------------------------------------------------
// DETAIL MODAL (View Full Service Specifications)
// -------------------------------------------------------------
const selectedDetailService = ref<HomeService | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(s: HomeService) {
  selectedDetailService.value = s
  isDetailModalOpen.value = true
}

// -------------------------------------------------------------
// ADD / EDIT MODAL STATE
// -------------------------------------------------------------
const isFormModalOpen = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingServiceId = ref<string | null>(null)

const formState = reactive({
  serviceName: '',
  serviceNameKh: '',
  provider: '',
  category: 'AC Repair' as HomeService['category'],
  image: '',
  location: 'Phnom Penh',
  rating: 4.8,
  reviews: 25,
  priceEstimate: '$15 - $40',
  phone: '+855 12 345 678',
  description: '',
  descriptionKh: ''
})

function openAddModal() {
  formMode.value = 'add'
  editingServiceId.value = null
  formState.serviceName = ''
  formState.serviceNameKh = ''
  formState.provider = ''
  formState.category = 'AC Repair'
  formState.image = 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80'
  formState.location = 'Phnom Penh'
  formState.rating = 4.8
  formState.reviews = 20
  formState.priceEstimate = '$15 - $40'
  formState.phone = '+855 12 345 678'
  formState.description = ''
  formState.descriptionKh = ''
  isFormModalOpen.value = true
}

function openEditModal(s: HomeService) {
  formMode.value = 'edit'
  editingServiceId.value = s.id
  formState.serviceName = s.serviceName
  formState.serviceNameKh = s.serviceNameKh || s.serviceName
  formState.provider = s.provider
  formState.category = s.category
  formState.image = s.image || ''
  formState.location = s.location
  formState.rating = s.rating || 4.8
  formState.reviews = s.reviews || 20
  formState.priceEstimate = s.priceEstimate || '$15 - $35'
  formState.phone = s.phone
  formState.description = s.description || ''
  formState.descriptionKh = s.descriptionKh || ''
  isFormModalOpen.value = true
}

function saveService() {
  if (!formState.serviceName.trim() || !formState.provider.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះសេវា និងឈ្មោះអ្នកផ្តល់សេវា!' : 'Please enter service name and provider!')
    return
  }

  if (formMode.value === 'edit' && editingServiceId.value) {
    const idx = serviceList.value.findIndex(s => s.id === editingServiceId.value)
    if (idx !== -1) {
      const existing = serviceList.value[idx]
      serviceList.value[idx] = {
        ...existing,
        serviceName: formState.serviceName.trim(),
        serviceNameKh: formState.serviceNameKh.trim() || formState.serviceName.trim(),
        provider: formState.provider.trim(),
        category: formState.category,
        image: formState.image.trim() || existing.image,
        location: formState.location.trim() || existing.location,
        rating: Number(formState.rating),
        reviews: Number(formState.reviews),
        priceEstimate: formState.priceEstimate.trim() || existing.priceEstimate,
        phone: formState.phone.trim() || existing.phone,
        description: formState.description.trim() || existing.description,
        descriptionKh: formState.descriptionKh.trim() || existing.descriptionKh
      }
      persistUserHomeServices()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែព័ត៌មានសេវាជោគជ័យ!' : 'Service updated successfully!')
    }
  } else {
    const newService: HomeService = {
      id: 'srv-custom-' + Date.now(),
      serviceName: formState.serviceName.trim(),
      serviceNameKh: formState.serviceNameKh.trim() || formState.serviceName.trim(),
      provider: formState.provider.trim(),
      category: formState.category,
      image: formState.image.trim() || 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=800&q=80',
      location: formState.location.trim() || 'Phnom Penh',
      rating: Number(formState.rating) || 4.8,
      reviews: Number(formState.reviews) || 15,
      priceEstimate: formState.priceEstimate.trim() || '$15 - $35',
      phone: formState.phone.trim() || '+855 12 345 678',
      description: formState.description.trim() || 'Reliable residential and commercial repair service.',
      descriptionKh: formState.descriptionKh.trim() || 'សេវាជួសជុល និងថែទាំគេហដ្ឋានប្រកបដោយជំនាញវិជ្ជាជីវៈ។'
    }
    serviceList.value.unshift(newService)
    persistUserHomeServices()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមសេវាថ្មីដោយជោគជ័យ!' : 'New home service added!')
  }

  isFormModalOpen.value = false
}

// -------------------------------------------------------------
// DELETE MODAL (CONFIRMATION)
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingService = ref<HomeService | null>(null)

function promptDelete(s: HomeService) {
  deletingService.value = s
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingService.value) {
    const id = deletingService.value.id
    serviceList.value = serviceList.value.filter(s => s.id !== id)
    persistUserHomeServices()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបសេវាជោគជ័យ!' : 'Service deleted!')
  }
  isDeleteModalOpen.value = false
  deletingService.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Services -->
      <div
        @click="selectedCategory = 'All'; selectedLocation = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'All' && selectedLocation === 'All' && !searchQuery
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Wrench class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សរុបទាំងអស់' : 'All Services' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalServicesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សេវាជាង & ជួសជុលសរុប' : 'Total Home Services' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: AC & Plumbing -->
      <div
        @click="selectedCategory = 'AC Repair'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'AC Repair' || selectedCategory === 'Plumber'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ម៉ាស៊ីនត្រជាក់/ទឹក' : 'AC & Plumbing' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ acPlumbingCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ម៉ាស៊ីនត្រជាក់ & ទុយោទឹក' : 'Cooling & Pipes' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Top Rated (4.8+ Stars) -->
      <div
        @click="selectedCategory = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          topRatedCount > 0
            ? 'border-slate-200/90 hover:border-amber-300'
            : 'border-slate-200/90'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Star class="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? '៤.៨★ ឡើង' : 'Rating 4.8★+' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ topRatedCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ជាងឆ្នើមមានការវាយតម្លៃខ្ពស់' : 'Top Rated Specialists' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Electrician & Cleaning -->
      <div
        @click="selectedCategory = 'Electrician'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'Electrician' || selectedCategory === 'Cleaning'
            ? 'border-purple-300 ring-2 ring-purple-400/20 bg-purple-50/20'
            : 'border-slate-200/90 hover:border-purple-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ភ្លើង & សម្អាត' : 'Power & Clean' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ electricianCleaningCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ជាងភ្លើង & សេវាសម្អាត' : 'Electric & Cleaning' }}
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកជាង, សេវាកម្ម, ក្រុមហ៊ុន...' : 'Search specialists, service, provider...'"
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

        <!-- Category Dropdown -->
        <div class="relative">
          <select
            v-model="selectedCategory"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទសេវាកម្ម' : 'All Categories' }}</option>
            <option v-for="cat in homeCategories.filter(c => c !== 'All')" :key="cat" :value="cat">
              {{ getCategoryLabel(cat) }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Location Dropdown -->
        <div class="relative">
          <select
            v-model="selectedLocation"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option v-for="loc in locations" :key="loc" :value="loc">
              {{ getCityLabel(loc) }}
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
          <span>{{ currentLanguage === 'kh' ? 'បង្កើតសេវាថ្មី' : 'Add Service' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. SERVICES DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[27%]">{{ currentLanguage === 'kh' ? 'ឈ្មោះសេវា & អ្នកផ្តល់សេវា' : 'Service & Provider' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'ប្រភេទសេវាកម្ម' : 'Category' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'តម្លៃប៉ាន់ស្មាន' : 'Price' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[17%]">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ & ទីតាំង' : 'Contact & Hub' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'ការវាយតម្លៃ' : 'Rating' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[16%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="s in paginatedServices"
              :key="s.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Service Name & Provider -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105', getCategoryColor(s.category).iconBg]">
                    <component :is="getCategoryIcon(s.category)" class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                      :title="currentLanguage === 'kh' && s.serviceNameKh ? s.serviceNameKh : s.serviceName"
                    >
                      {{ currentLanguage === 'kh' && s.serviceNameKh ? s.serviceNameKh : s.serviceName }}
                    </span>

                    <div class="flex items-center gap-1.5 mt-0.5 min-w-0 truncate">
                      <span class="inline-flex items-center text-[9.5px] font-semibold text-slate-500 truncate" :title="s.provider">
                        {{ s.provider }}
                      </span>
                      <span class="text-slate-300">•</span>
                      <span class="inline-flex items-center text-[9px] font-mono text-slate-400 truncate">
                        ID: {{ s.id }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Category Badge -->
              <td class="py-1.5 px-2.5 align-middle">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs truncate max-w-full', getCategoryColor(s.category).bg]">
                  {{ getCategoryLabel(s.category) }}
                </span>
              </td>

              <!-- 3. Price Estimate -->
              <td class="py-1.5 px-2.5 align-middle">
                <div :title="s.priceEstimate">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-mono shadow-2xs truncate max-w-full">
                    <DollarSign class="w-3 h-3 text-emerald-600 shrink-0" />
                    <span class="truncate">{{ s.priceEstimate || '$10 - $25' }}</span>
                  </span>
                </div>
              </td>

              <!-- 4. Phone & Location -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 truncate max-w-full">
                    <Phone class="w-3 h-3 text-blue-500 shrink-0" />
                    <span class="truncate font-mono">{{ s.phone }}</span>
                  </div>
                  <div class="inline-flex items-center gap-0.5 text-[9.5px] text-slate-400 mt-0.5 truncate max-w-full">
                    <MapPin class="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span class="truncate">{{ s.location }}</span>
                  </div>
                </div>
              </td>

              <!-- 5. Rating & Reviews -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="flex items-center gap-1.5">
                  <span class="inline-flex items-center gap-1 font-bold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.5 rounded-md text-[10.5px] font-mono shadow-2xs">
                    <Star class="w-3 h-3 fill-amber-500 text-amber-500" />
                    {{ s.rating.toFixed(1) }}
                  </span>
                  <span class="text-[9.5px] text-slate-400 font-medium">
                    ({{ s.reviews || 12 }})
                  </span>
                </div>
              </td>

              <!-- 6. Actions (View Details, Edit, Delete) -->
              <td class="py-1.5 px-3 align-middle text-right">
                <div class="flex items-center justify-end gap-1">
                  
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(s)"
                    class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200/60 hover:border-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(s)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white border border-amber-200/60 hover:border-amber-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit Service'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(s)"
                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 hover:border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete Service'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredServices.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញសេវាជាងដែលអ្នកស្វែងរកទេ' : 'No home services found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try adjusting your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedCategory = 'All'; selectedLocation = 'All'"
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
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredServices.length)} នៃ ${filteredServices.length} សេវាសរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredServices.length)} of ${filteredServices.length} services` 
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
    <!-- MODAL 1: VIEW SERVICE SPECIFICATIONS (DETAIL MODAL)      -->
    <!-- ======================================================== -->
    <div
      v-if="isDetailModalOpen && selectedDetailService"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs', getCategoryColor(selectedDetailService.category).iconBg]">
              <component :is="getCategoryIcon(selectedDetailService.category)" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 font-khmer leading-snug">
                {{ currentLanguage === 'kh' && selectedDetailService.serviceNameKh ? selectedDetailService.serviceNameKh : selectedDetailService.serviceName }}
              </h3>
              <p class="text-[11px] text-slate-500 font-mono">
                {{ selectedDetailService.provider }} • {{ selectedDetailService.location }}
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
          
          <!-- Image preview -->
          <div v-if="selectedDetailService.image" class="relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
            <img :src="selectedDetailService.image" :alt="selectedDetailService.serviceName" class="w-full h-full object-cover" />
            <div class="absolute top-2.5 right-2.5">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border capitalize shadow-md backdrop-blur-xs', getCategoryColor(selectedDetailService.category).bg]">
                {{ getCategoryLabel(selectedDetailService.category) }}
              </span>
            </div>
          </div>

          <!-- Quick Metrics Card -->
          <div class="grid grid-cols-3 gap-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1 text-slate-500 text-[10.5px] mb-1 font-khmer">
                <DollarSign class="w-3 h-3 text-emerald-600" />
                <span>{{ currentLanguage === 'kh' ? 'តម្លៃប៉ាន់ស្មាន' : 'Est. Price' }}</span>
              </div>
              <span class="text-xs font-black text-emerald-700 font-mono">
                {{ selectedDetailService.priceEstimate || '$10 - $30' }}
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1 text-slate-500 text-[10.5px] mb-1 font-khmer">
                <Star class="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{{ currentLanguage === 'kh' ? 'ការវាយតម្លៃ' : 'Rating' }}</span>
              </div>
              <span class="text-xs font-bold text-amber-800">
                {{ selectedDetailService.rating.toFixed(1) }} ★ ({{ selectedDetailService.reviews || 10 }})
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1 text-slate-500 text-[10.5px] mb-1 font-khmer">
                <Phone class="w-3 h-3 text-blue-600" />
                <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទកក់' : 'Phone' }}</span>
              </div>
              <a :href="'tel:' + selectedDetailService.phone" class="text-xs font-bold text-blue-600 hover:underline font-mono truncate block">
                {{ selectedDetailService.phone }}
              </a>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-khmer">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតអំពីសេវាកម្ម' : 'Service Overview' }}
            </h4>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed font-khmer">
              {{ currentLanguage === 'kh' && selectedDetailService.descriptionKh ? selectedDetailService.descriptionKh : selectedDetailService.description }}
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            @click="isDetailModalOpen = false; openEditModal(selectedDetailService)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែសេវានេះ' : 'Edit Service' }}</span>
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
    <!-- MODAL 2: ADD / EDIT SERVICE FORM                        -->
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
              <Wrench class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 font-khmer">
              {{ formMode === 'add' 
                ? (currentLanguage === 'kh' ? 'បង្កើតសេវាជាងថ្មី' : 'Add New Home Service') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានសេវា' : 'Edit Home Service') 
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
        <form @submit.prevent="saveService" class="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          
          <!-- Name (En) & Name (Kh) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Service Name (English) *
              </label>
              <input
                v-model="formState.serviceName"
                type="text"
                required
                placeholder="e.g. Master AC Cleaning"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ឈ្មោះសេវាកម្ម (ភាសាខ្មែរ)
              </label>
              <input
                v-model="formState.serviceNameKh"
                type="text"
                placeholder="ឧ. សេវាលាងម៉ាស៊ីនត្រជាក់ ម៉ាស្ទ័រ"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
          </div>

          <!-- Provider & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'អ្នកផ្តល់សេវា / ក្រុមហ៊ុន *' : 'Provider / Technician *' }}
              </label>
              <input
                v-model="formState.provider"
                type="text"
                required
                placeholder="e.g. Borey AC Co."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភេទសេវាកម្ម *' : 'Service Category *' }}
              </label>
              <select
                v-model="formState.category"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option v-for="c in homeCategories.filter(c => c !== 'All')" :key="c" :value="c">
                  {{ getCategoryLabel(c) }} ({{ c }})
                </option>
              </select>
            </div>
          </div>

          <!-- Price Estimate & Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'តម្លៃប៉ាន់ស្មាន' : 'Price Estimate' }}
              </label>
              <input
                v-model="formState.priceEstimate"
                type="text"
                placeholder="e.g. $15 - $35"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទទំនាក់ទំនង *' : 'Contact Phone *' }}
              </label>
              <input
                v-model="formState.phone"
                type="text"
                required
                placeholder="+855 12 345 678"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <!-- Location & Image URL -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ទីតាំង / ខេត្ត-ក្រុង' : 'City / Location' }}
              </label>
              <input
                v-model="formState.location"
                type="text"
                placeholder="Phnom Penh, Siem Reap, etc."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
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
                placeholder="រៀបរាប់ពីព័ត៌មានលម្អិតអំពីសេវាកម្ម..."
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
                placeholder="Service overview and repair scope..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              ></textarea>
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
                ? (currentLanguage === 'kh' ? 'រក្សាទុកសេវា' : 'Save Service') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាន' : 'Update Service') 
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
      v-if="isDeleteModalOpen && deletingService"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 text-center">
        
        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 class="w-5 h-5" />
        </div>

        <h3 class="text-sm font-bold text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកពិតជាចង់លុបសេវានេះមែនទេ?' : 'Confirm Service Deletion' }}
        </h3>

        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">
            {{ currentLanguage === 'kh' && deletingService.serviceNameKh ? deletingService.serviceNameKh : deletingService.serviceName }}
          </strong>
          <br />
          {{ currentLanguage === 'kh' ? 'ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់មកវិញបានទេ។' : 'This service record will be permanently deleted.' }}
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
