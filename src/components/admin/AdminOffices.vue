<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Building2,
  Landmark,
  ShieldCheck,
  Search,
  MapPin,
  Phone,
  Clock,
  Plus,
  Eye,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Compass
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getLocations } from '@/services/dataService'
import type { LocationItem } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// LOAD AND PERSIST LOCATIONS / OFFICES
// -------------------------------------------------------------
function loadLocations(): LocationItem[] {
  const base = getLocations()
  try {
    const saved = localStorage.getItem('camlife_custom_locations')
    if (saved) {
      const parsed: LocationItem[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {}
  return [...base]
}

const locationList = ref<LocationItem[]>(loadLocations())

function persistUserLocations() {
  try {
    const custom = locationList.value.filter(l => l.id.startsWith('loc-custom-'))
    localStorage.setItem('camlife_custom_locations', JSON.stringify(custom))
  } catch {}
}

// -------------------------------------------------------------
// FILTERS & SEARCH STATE
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedCategory = ref('All')

const officeCategories = computed(() => {
  const set = new Set(locationList.value.map(l => l.category))
  return ['All', ...Array.from(set)]
})

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalOfficesCount = computed(() => locationList.value.length)
const owsoCount = computed(() => locationList.value.filter(l => l.category.toLowerCase().includes('owso') || l.name.toLowerCase().includes('owso') || l.name.toLowerCase().includes('one window')).length)
const govMinistryCount = computed(() => locationList.value.filter(l => l.category.toLowerCase().includes('gov') || l.category.toLowerCase().includes('ministry') || l.category.toLowerCase().includes('hall') || l.category.toLowerCase().includes('district')).length)
const hospitalSafetyCount = computed(() => locationList.value.filter(l => l.category.toLowerCase().includes('hospital') || l.category.toLowerCase().includes('police')).length)

// -------------------------------------------------------------
// FILTERED LOCATIONS
// -------------------------------------------------------------
const filteredLocations = computed(() => {
  return locationList.value.filter(l => {
    // 1. Category filter
    const matchCat = selectedCategory.value === 'All' || l.category === selectedCategory.value

    // 2. Search query
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat

    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      (l.nameKh && l.nameKh.toLowerCase().includes(q)) ||
      l.address.toLowerCase().includes(q) ||
      (l.addressKh && l.addressKh.toLowerCase().includes(q)) ||
      l.category.toLowerCase().includes(q) ||
      l.phone.toLowerCase().includes(q)

    return matchCat && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredLocations.value.length / itemsPerPage.value) || 1)

const paginatedLocations = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredLocations.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedCategory, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// CATEGORY HELPERS
// -------------------------------------------------------------
function getCategoryLabel(cat: string): string {
  if (currentLanguage.value === 'kh') {
    switch (cat.toLowerCase()) {
      case 'owso': return 'ច្រកចេញចូលតែមួយ (OWSO)'
      case 'government': return 'ស្ថាប័នរដ្ឋ (Gov)'
      case 'hospital': return 'មន្ទីរពេទ្យសាធារណៈ'
      case 'police': return 'ប៉ុស្តិ៍នគរបាលជាតិ'
      case 'embassy': return 'ស្ថានទូតអន្តរជាតិ'
      case 'district': return 'សាលាខណ្ឌ/ស្រុក'
      default: return cat
    }
  }
  return cat
}

function getCategoryColor(cat: string) {
  const c = cat.toLowerCase()
  if (c.includes('owso')) {
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90', iconBg: 'bg-emerald-100 text-emerald-600' }
  }
  if (c.includes('hospital')) {
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200/90', iconBg: 'bg-rose-100 text-rose-600' }
  }
  if (c.includes('police')) {
    return { bg: 'bg-amber-50 text-amber-700 border-amber-200/90', iconBg: 'bg-amber-100 text-amber-600' }
  }
  if (c.includes('embassy')) {
    return { bg: 'bg-sky-50 text-sky-700 border-sky-200/90', iconBg: 'bg-sky-100 text-sky-600' }
  }
  return { bg: 'bg-purple-50 text-purple-700 border-purple-200/90', iconBg: 'bg-purple-100 text-purple-600' }
}

function getCategoryIcon(cat: string) {
  const c = cat.toLowerCase()
  if (c.includes('owso')) return Compass
  if (c.includes('hospital')) return Building2
  if (c.includes('police')) return ShieldCheck
  if (c.includes('embassy')) return Landmark
  return Building2
}

// -------------------------------------------------------------
// DETAIL MODAL (View Full Office Specifications)
// -------------------------------------------------------------
const selectedDetailOffice = ref<LocationItem | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(loc: LocationItem) {
  selectedDetailOffice.value = loc
  isDetailModalOpen.value = true
}

// -------------------------------------------------------------
// ADD / EDIT MODAL STATE
// -------------------------------------------------------------
const isFormModalOpen = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingOfficeId = ref<string | null>(null)

const formState = reactive({
  name: '',
  nameKh: '',
  category: 'OWSO',
  address: '',
  addressKh: '',
  phone: '+855 23 720 001',
  lat: 11.5564,
  lng: 104.9282,
  description: '',
  descriptionKh: '',
  image: ''
})

function openAddModal() {
  formMode.value = 'add'
  editingOfficeId.value = null
  formState.name = ''
  formState.nameKh = ''
  formState.category = 'OWSO'
  formState.address = ''
  formState.addressKh = ''
  formState.phone = '+855 23 720 001'
  formState.lat = 11.5564
  formState.lng = 104.9282
  formState.description = ''
  formState.descriptionKh = ''
  formState.image = ''
  isFormModalOpen.value = true
}

function openEditModal(loc: LocationItem) {
  formMode.value = 'edit'
  editingOfficeId.value = loc.id
  formState.name = loc.name
  formState.nameKh = loc.nameKh || loc.name
  formState.category = loc.category
  formState.address = loc.address
  formState.addressKh = loc.addressKh || loc.address
  formState.phone = loc.phone
  formState.lat = loc.coordinates?.lat || 11.5564
  formState.lng = loc.coordinates?.lng || 104.9282
  formState.description = loc.description || ''
  formState.descriptionKh = loc.descriptionKh || ''
  formState.image = loc.image || ''
  isFormModalOpen.value = true
}

function saveOffice() {
  if (!formState.name.trim() || !formState.address.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះការិយាល័យ និងអាសយដ្ឋាន!' : 'Please enter office name and address!')
    return
  }

  if (formMode.value === 'edit' && editingOfficeId.value) {
    const idx = locationList.value.findIndex(l => l.id === editingOfficeId.value)
    if (idx !== -1) {
      const existing = locationList.value[idx]
      locationList.value[idx] = {
        ...existing,
        name: formState.name.trim(),
        nameKh: formState.nameKh.trim() || formState.name.trim(),
        category: formState.category,
        address: formState.address.trim(),
        addressKh: formState.addressKh.trim() || formState.address.trim(),
        phone: formState.phone.trim() || existing.phone,
        coordinates: { lat: Number(formState.lat), lng: Number(formState.lng) },
        description: formState.description.trim() || existing.description,
        descriptionKh: formState.descriptionKh.trim() || existing.descriptionKh,
        image: formState.image.trim() || existing.image
      }
      persistUserLocations()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែព័ត៌មានការិយាល័យជោគជ័យ!' : 'Office updated successfully!')
    }
  } else {
    const newOffice: LocationItem = {
      id: 'loc-custom-' + Date.now(),
      name: formState.name.trim(),
      nameKh: formState.nameKh.trim() || formState.name.trim(),
      category: formState.category,
      address: formState.address.trim(),
      addressKh: formState.addressKh.trim() || formState.address.trim(),
      phone: formState.phone.trim() || '+855 23 720 001',
      coordinates: { lat: Number(formState.lat) || 11.5564, lng: Number(formState.lng) || 104.9282 },
      description: formState.description.trim() || 'Public administrative and citizen service facility.',
      descriptionKh: formState.descriptionKh.trim() || 'ទីតាំងរដ្ឋបាល និងផ្តល់សេវាសាធារណៈជូនប្រជាពលរដ្ឋ។',
      image: formState.image.trim() || undefined
    }
    locationList.value.unshift(newOffice)
    persistUserLocations()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមទីតាំងថ្មីដោយជោគជ័យ!' : 'New office location added!')
  }

  isFormModalOpen.value = false
}

// -------------------------------------------------------------
// DELETE MODAL (CONFIRMATION)
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingOffice = ref<LocationItem | null>(null)

function promptDelete(loc: LocationItem) {
  deletingOffice.value = loc
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingOffice.value) {
    const id = deletingOffice.value.id
    locationList.value = locationList.value.filter(l => l.id !== id)
    persistUserLocations()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបទីតាំងជោគជ័យ!' : 'Office deleted!')
  }
  isDeleteModalOpen.value = false
  deletingOffice.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Offices -->
      <div
        @click="selectedCategory = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'All' && !searchQuery
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សរុបទាំងអស់' : 'All Offices' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalOfficesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ទីតាំងការិយាល័យសាធារណៈ' : 'Total Public Offices' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: One Window Service Offices (OWSO) -->
      <div
        @click="selectedCategory = 'OWSO'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'OWSO'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Compass class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ច្រក OWSO' : 'OWSO Halls' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ owsoCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ច្រកចេញចូលតែមួយ OWSO' : 'One Window Offices' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Government & Ministries -->
      <div
        @click="selectedCategory = 'Government'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'Government'
            ? 'border-purple-300 ring-2 ring-purple-400/20 bg-purple-50/20'
            : 'border-slate-200/90 hover:border-purple-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Landmark class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ស្ថាប័នជាតិ' : 'National' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ govMinistryCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ក្រសួង & រដ្ឋបាលរាជធានី' : 'Ministries & Halls' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Hospital & Public Safety -->
      <div
        @click="selectedCategory = 'Hospital'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'Hospital' || selectedCategory === 'Police'
            ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/20'
            : 'border-slate-200/90 hover:border-rose-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សុខភាព/សន្តិសុខ' : 'Medical & Safety' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ hospitalSafetyCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ & ប៉ុស្តិ៍នគរបាល' : 'Hospitals & Police' }}
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកការិយាល័យ, ច្រក OWSO, អាសយដ្ឋាន...' : 'Search offices, OWSO, address...'"
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
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទស្ថាប័ន' : 'All Categories' }}</option>
            <option v-for="cat in officeCategories.filter(c => c !== 'All')" :key="cat" :value="cat">
              {{ getCategoryLabel(cat) }}
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
          <span>{{ currentLanguage === 'kh' ? 'បង្កើតទីតាំងថ្មី' : 'Add Office' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. OFFICES DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[28%]">{{ currentLanguage === 'kh' ? 'ឈ្មោះការិយាល័យ & លេខកូដ' : 'Office Name & ID' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'ប្រភេទស្ថាប័ន' : 'Category' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[24%]">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន' : 'Address' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[9%]">{{ currentLanguage === 'kh' ? 'ម៉ោងធ្វើការ' : 'Hours' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[12%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="loc in paginatedLocations"
              :key="loc.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Office Name & ID -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105', getCategoryColor(loc.category).iconBg]">
                    <component :is="getCategoryIcon(loc.category)" class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                      :title="currentLanguage === 'kh' && loc.nameKh ? loc.nameKh : loc.name"
                    >
                      {{ currentLanguage === 'kh' && loc.nameKh ? loc.nameKh : loc.name }}
                    </span>

                    <div class="flex items-center gap-1.5 mt-0.5 min-w-0 truncate">
                      <span class="inline-flex items-center text-[9px] font-mono text-slate-400 truncate">
                        ID: {{ loc.id }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Category Badge -->
              <td class="py-1.5 px-2.5 align-middle">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs truncate max-w-full', getCategoryColor(loc.category).bg]">
                  {{ getCategoryLabel(loc.category) }}
                </span>
              </td>

              <!-- 3. Address -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium max-w-full truncate" :title="currentLanguage === 'kh' && loc.addressKh ? loc.addressKh : loc.address">
                  <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate font-khmer">{{ currentLanguage === 'kh' && loc.addressKh ? loc.addressKh : loc.address }}</span>
                </div>
              </td>

              <!-- 4. Phone -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 max-w-full truncate font-mono" :title="loc.phone">
                  <Phone class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate">{{ loc.phone }}</span>
                </div>
              </td>

              <!-- 5. Hours -->
              <td class="py-1.5 px-2.5 align-middle">
                <span class="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                  <Clock class="w-2.5 h-2.5 text-slate-400" />
                  <span>8AM-5PM</span>
                </span>
              </td>

              <!-- 6. Actions (View Details, Edit, Delete) -->
              <td class="py-1.5 px-3 align-middle text-right">
                <div class="flex items-center justify-end gap-1">
                  
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(loc)"
                    class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200/60 hover:border-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(loc)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white border border-amber-200/60 hover:border-amber-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit Office'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(loc)"
                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 hover:border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete Office'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredLocations.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញការិយាល័យដែលអ្នកស្វែងរកទេ' : 'No office locations found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try adjusting your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedCategory = 'All'"
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
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredLocations.length)} នៃ ${filteredLocations.length} ទីតាំងសរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredLocations.length)} of ${filteredLocations.length} locations` 
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
    <!-- MODAL 1: VIEW OFFICE SPECIFICATIONS (DETAIL MODAL)       -->
    <!-- ======================================================== -->
    <div
      v-if="isDetailModalOpen && selectedDetailOffice"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs', getCategoryColor(selectedDetailOffice.category).iconBg]">
              <component :is="getCategoryIcon(selectedDetailOffice.category)" class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 font-khmer leading-snug">
                {{ currentLanguage === 'kh' && selectedDetailOffice.nameKh ? selectedDetailOffice.nameKh : selectedDetailOffice.name }}
              </h3>
              <p class="text-[11px] text-slate-500 font-mono">
                ID: {{ selectedDetailOffice.id }}
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
          
          <!-- Image preview if available -->
          <div v-if="selectedDetailOffice.image" class="relative rounded-xl overflow-hidden h-36 bg-slate-100 border border-slate-200">
            <img :src="selectedDetailOffice.image" :alt="selectedDetailOffice.name" class="w-full h-full object-cover" />
            <div class="absolute top-2.5 right-2.5">
              <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border capitalize shadow-md backdrop-blur-xs', getCategoryColor(selectedDetailOffice.category).bg]">
                {{ getCategoryLabel(selectedDetailOffice.category) }}
              </span>
            </div>
          </div>

          <!-- Quick Metrics Card -->
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-khmer">
                <Building2 class="w-3.5 h-3.5 text-blue-600" />
                <span>{{ currentLanguage === 'kh' ? 'ប្រភេទស្ថាប័ន' : 'Category' }}</span>
              </div>
              <span class="text-xs font-bold text-slate-800">
                {{ getCategoryLabel(selectedDetailOffice.category) }}
              </span>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-khmer">
                <Phone class="w-3.5 h-3.5 text-emerald-600" />
                <span>{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទផ្លូវការ' : 'Phone' }}</span>
              </div>
              <a :href="'tel:' + selectedDetailOffice.phone" class="text-xs font-bold text-blue-600 hover:underline font-mono">
                {{ selectedDetailOffice.phone }}
              </a>
            </div>

            <div class="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 col-span-2">
              <div class="flex items-center gap-1.5 text-slate-500 text-[11px] mb-1 font-khmer">
                <MapPin class="w-3.5 h-3.5 text-indigo-600" />
                <span>{{ currentLanguage === 'kh' ? 'អាសយដ្ឋានទីតាំង' : 'Full Address' }}</span>
              </div>
              <span class="text-xs font-medium text-slate-800 font-khmer">
                {{ currentLanguage === 'kh' && selectedDetailOffice.addressKh ? selectedDetailOffice.addressKh : selectedDetailOffice.address }}
              </span>
              <div v-if="selectedDetailOffice.coordinates" class="mt-1 text-[10px] text-slate-400 font-mono">
                Coordinates: {{ selectedDetailOffice.coordinates.lat }}, {{ selectedDetailOffice.coordinates.lng }}
              </div>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-khmer">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតអំពីស្ថាប័ន' : 'Office Overview' }}
            </h4>
            <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed font-khmer">
              {{ currentLanguage === 'kh' && selectedDetailOffice.descriptionKh ? selectedDetailOffice.descriptionKh : selectedDetailOffice.description }}
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            @click="isDetailModalOpen = false; openEditModal(selectedDetailOffice)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែទីតាំងនេះ' : 'Edit Office' }}</span>
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
    <!-- MODAL 2: ADD / EDIT OFFICE FORM                         -->
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
              <Building2 class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 font-khmer">
              {{ formMode === 'add' 
                ? (currentLanguage === 'kh' ? 'បង្កើតទីតាំងការិយាល័យថ្មី' : 'Add New Office Location') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានការិយាល័យ' : 'Edit Office Location') 
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
        <form @submit.prevent="saveOffice" class="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          
          <!-- Name (En) & Name (Kh) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Office Name (English) *
              </label>
              <input
                v-model="formState.name"
                type="text"
                required
                placeholder="e.g. Khan Sen Sok OWSO Office"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ឈ្មោះការិយាល័យ (ភាសាខ្មែរ)
              </label>
              <input
                v-model="formState.nameKh"
                type="text"
                placeholder="ឧ. ការិយាល័យច្រកចេញចូលតែមួយ ខណ្ឌសែនសុខ"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
          </div>

          <!-- Category & Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភេទស្ថាប័ន *' : 'Office Category *' }}
              </label>
              <select
                v-model="formState.category"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="OWSO">ច្រកចេញចូលតែមួយ (OWSO)</option>
                <option value="Government">ស្ថាប័នរដ្ឋ / ក្រសួង (Government)</option>
                <option value="Hospital">មន្ទីរពេទ្យសាធារណៈ (Hospital)</option>
                <option value="Police">ប៉ុស្តិ៍នគរបាលជាតិ (Police)</option>
                <option value="Embassy">ស្ថានទូត (Embassy)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទទំនាក់ទំនង *' : 'Contact Phone *' }}
              </label>
              <input
                v-model="formState.phone"
                type="text"
                required
                placeholder="+855 23 720 001"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
          </div>

          <!-- Address (English & Khmer) -->
          <div class="space-y-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                អាសយដ្ឋាន (ភាសាខ្មែរ) *
              </label>
              <input
                v-model="formState.addressKh"
                type="text"
                required
                placeholder="ឧ. ផ្លូវ ១៩៨៦ សង្កាត់ភ្នំពេញថ្មី ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Address (English) *
              </label>
              <input
                v-model="formState.address"
                type="text"
                required
                placeholder="e.g. St. 1986, Sangkat Phnom Penh Thmey, Khan Sen Sok, Phnom Penh"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Coordinates (Lat & Lng) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Latitude (Lat)
              </label>
              <input
                v-model="formState.lat"
                type="number"
                step="any"
                placeholder="11.5564"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Longitude (Lng)
              </label>
              <input
                v-model="formState.lng"
                type="number"
                step="any"
                placeholder="104.9282"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
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
                placeholder="រៀបរាប់ពីសេវាកម្ម និងតួនាទីរបស់ការិយាល័យនេះ..."
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
                placeholder="Office scope, services offered, and citizen procedures..."
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
                ? (currentLanguage === 'kh' ? 'រក្សាទុកទីតាំង' : 'Save Office') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាន' : 'Update Office') 
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
      v-if="isDeleteModalOpen && deletingOffice"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 text-center">
        
        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 class="w-5 h-5" />
        </div>

        <h3 class="text-sm font-bold text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកពិតជាចង់លុបទីតាំងនេះមែនទេ?' : 'Confirm Office Deletion' }}
        </h3>

        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">
            {{ currentLanguage === 'kh' && deletingOffice.nameKh ? deletingOffice.nameKh : deletingOffice.name }}
          </strong>
          <br />
          {{ currentLanguage === 'kh' ? 'ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់មកវិញបានទេ។' : 'This public office record will be permanently deleted.' }}
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
