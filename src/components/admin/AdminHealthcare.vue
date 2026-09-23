<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  Search,
  Phone,
  PhoneCall,
  MapPin,
  Star,
  Trash2,
  ShieldCheck,
  Building2,
  Ambulance,
  Clock,
  Plus,
  Eye,
  Edit2,
  X,
  Hospital as HospitalIcon,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowLeft,
  CheckCircle2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals, saveCustomHospitals } from '@/services/dataService'
import type { Hospital } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// MAIN STATE
// -------------------------------------------------------------
const hospitals = ref<Hospital[]>(getHospitals())

function persistHospitals() {
  saveCustomHospitals(hospitals.value)
}
const searchQuery = ref('')
const selectedLocation = ref('All')
const selectedCategory = ref('All')
const selectedOwnership = ref('All')
const selectedNssf = ref('All')
const selected24h = ref(false)

// -------------------------------------------------------------
// PROVINCE / LOCATION DICTIONARY (Khmer)
// -------------------------------------------------------------
const provinceNamesKh: Record<string, string> = {
  'Phnom Penh': 'រាជធានីភ្នំពេញ',
  'Siem Reap': 'សៀមរាប',
  'Battambang': 'បាត់ដំបង',
  'Banteay Meanchey': 'បន្ទាយមានជ័យ',
  'Kampong Cham': 'កំពង់ចាម',
  'Kampong Chhnang': 'កំពង់ឆ្នាំង',
  'Kampong Speu': 'កំពង់ស្ពឺ',
  'Kampong Thom': 'កំពង់ធំ',
  'Kampot': 'កំពត',
  'Kandal': 'កណ្តាល',
  'Kep': 'កែប',
  'Koh Kong': 'កោះកុង',
  'Kratie': 'ក្រចេះ',
  'Mondulkiri': 'មណ្ឌលគិរី',
  'Oddar Meanchey': 'ឧត្តរមានជ័យ',
  'Pailin': 'ប៉ៃលិន',
  'Preah Sihanouk': 'ព្រះសីហនុ',
  'Sihanoukville': 'ព្រះសីហនុ',
  'Preah Vihear': 'ព្រះវិហារ',
  'Prey Veng': 'ព្រៃវែង',
  'Pursat': 'ពោធិ៍សាត់',
  'Ratanakiri': 'រតនគិរី',
  'Stung Treng': 'ស្ទឹងត្រែង',
  'Svay Rieng': 'ស្វាយរៀង',
  'Takeo': 'តាកែវ',
  'Tboung Khmum': 'ត្បូងឃ្មុំ'
}

function getLocationName(loc: string): string {
  if (loc === 'All') return currentLanguage.value === 'kh' ? 'គ្រប់ខេត្ត/ក្រុង' : 'All Provinces'
  return currentLanguage.value === 'kh' ? (provinceNamesKh[loc] || loc) : loc
}

const locations = computed(() => {
  const locs = new Set(hospitals.value.map(h => h.location))
  return ['All', ...Array.from(locs).sort()]
})

// -------------------------------------------------------------
// CATEGORY & OWNERSHIP HELPERS
// -------------------------------------------------------------
function getCategoryLabel(cat: string): string {
  if (cat === 'hospital') return currentLanguage.value === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital'
  if (cat === 'clinic') return currentLanguage.value === 'kh' ? 'គ្លីនិក' : 'Clinic'
  if (cat === 'pharmacy') return currentLanguage.value === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacy'
  return cat
}

function getCategoryColor(cat: string) {
  if (cat === 'hospital') {
    return {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-600'
    }
  }
  if (cat === 'clinic') {
    return {
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-600'
    }
  }
  if (cat === 'pharmacy') {
    return {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-600'
    }
  }
  return {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600'
  }
}

function getOwnershipLabel(own?: string): string {
  if (own === 'public') return currentLanguage.value === 'kh' ? 'រដ្ឋ' : 'Public'
  if (own === 'private') return currentLanguage.value === 'kh' ? 'ឯកជន' : 'Private'
  return currentLanguage.value === 'kh' ? 'ទូទៅ' : 'General'
}

// -------------------------------------------------------------
// KPI COMPUTED COUNTS
// -------------------------------------------------------------
const totalHospitalsCount = computed(() => hospitals.value.length)
const nssfHospitalsCount = computed(() => hospitals.value.filter(h => h.acceptsNssf).length)
const publicHospitalsCount = computed(() => hospitals.value.filter(h => h.ownership === 'public').length)
const emergency24hCount = computed(() =>
  hospitals.value.filter(h => (h.openingHours || '').toLowerCase().includes('24/7') || Boolean(h.emergencyHotline)).length
)

function resetAllFilters() {
  selectedLocation.value = 'All'
  selectedCategory.value = 'All'
  selectedOwnership.value = 'All'
  selectedNssf.value = 'All'
  selected24h.value = false
  searchQuery.value = ''
}

// -------------------------------------------------------------
// FILTERING & PAGINATION (5 items per page for Single Screen)
// -------------------------------------------------------------
const filteredHospitals = computed(() => {
  return hospitals.value.filter(h => {
    if (selectedLocation.value !== 'All' && h.location !== selectedLocation.value) return false
    if (selectedCategory.value !== 'All' && h.category !== selectedCategory.value) return false
    if (selectedOwnership.value !== 'All' && h.ownership !== selectedOwnership.value) return false
    if (selectedNssf.value === 'yes' && !h.acceptsNssf) return false
    if (selectedNssf.value === 'no' && h.acceptsNssf) return false
    if (selected24h.value && !(h.openingHours || '').toLowerCase().includes('24/7')) return false

    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return true

    const locKh = provinceNamesKh[h.location || ''] || ''
    return (
      (h.name || '').toLowerCase().includes(q) ||
      (h.nameKh && h.nameKh.toLowerCase().includes(q)) ||
      (h.location || '').toLowerCase().includes(q) ||
      locKh.includes(q) ||
      (h.address && h.address.toLowerCase().includes(q)) ||
      (h.addressKh && h.addressKh.toLowerCase().includes(q)) ||
      (h.phone && h.phone.toLowerCase().includes(q)) ||
      (h.emergencyHotline && h.emergencyHotline.toLowerCase().includes(q)) ||
      (Array.isArray(h.services) && h.services.some(s => (s || '').toLowerCase().includes(q)))
    )
  })
})

const currentPage = ref(1)
const itemsPerPage = 8

const totalPages = computed(() => Math.ceil(filteredHospitals.value.length / itemsPerPage) || 1)

const paginatedHospitals = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredHospitals.value.slice(start, start + itemsPerPage)
})

function formatHospitalId(index: number): string {
  const num = (currentPage.value - 1) * itemsPerPage + index + 1
  return `MED-${String(num).padStart(2, '0')}`
}

function hasDistinctPhone(h: Hospital): boolean {
  if (!h.phone || !h.emergencyHotline) return false
  const p1 = h.phone.replace(/\D/g, '')
  const p2 = h.emergencyHotline.replace(/\D/g, '')
  return p1.length > 0 && p2.length > 0 && p1 !== p2
}

watch([searchQuery, selectedLocation, selectedCategory, selectedOwnership, selectedNssf, selected24h], () => {
  currentPage.value = 1
})

// -------------------------------------------------------------
// PAGE VIEW STATE ('list' | 'detail' | 'form')
// -------------------------------------------------------------
const currentView = ref<'list' | 'detail' | 'form'>('list')

function backToList() {
  currentView.value = 'list'
  selectedDetailHospital.value = null
  isEditing.value = false
  editingId.value = ''
}

// -------------------------------------------------------------
// DETAIL SUB-PAGE VIEW
// -------------------------------------------------------------
const selectedDetailHospital = ref<Hospital | null>(null)

function openDetailModal(hospital: Hospital) {
  selectedDetailHospital.value = hospital
  currentView.value = 'detail'
}

// -------------------------------------------------------------
// ADD / EDIT FORM STATE
// -------------------------------------------------------------
const isEditing = ref(false)
const editingId = ref('')

const formState = ref({
  name: '',
  nameKh: '',
  category: 'hospital' as 'hospital' | 'clinic' | 'pharmacy',
  ownership: 'public' as 'public' | 'private',
  location: 'Phnom Penh',
  phone: '',
  emergencyHotline: '',
  openingHours: '24/7',
  acceptsNssf: true,
  image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
  address: '',
  addressKh: '',
  servicesInput: 'សង្គ្រោះបន្ទាន់, ពិគ្រោះជំងឺទូទៅ, មន្ទីរពិសោធន៍',
  description: '',
  descriptionKh: ''
})

function openAddModal() {
  isEditing.value = false
  editingId.value = ''
  formState.value = {
    name: '',
    nameKh: '',
    category: 'hospital',
    ownership: 'public',
    location: 'Phnom Penh',
    phone: '023 123 456',
    emergencyHotline: '023 999 115',
    openingHours: '24/7',
    acceptsNssf: true,
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    address: 'Phnom Penh, Cambodia',
    addressKh: 'រាជធានីភ្នំពេញ កម្ពុជា',
    servicesInput: 'សង្គ្រោះបន្ទាន់, ពិគ្រោះជំងឺទូទៅ, វះកាត់ទូទៅ, មន្ទីរពិសោធន៍',
    description: 'Comprehensive medical facility providing outpatient and emergency care.',
    descriptionKh: 'មណ្ឌលវេជ្ជសាស្ត្រផ្តល់សេវាពិនិត្យ ព្យាបាល និងសង្គ្រោះបន្ទាន់កម្រិតស្តង់ដារ។'
  }
  currentView.value = 'form'
}

function openEditModal(hospital: Hospital) {
  isEditing.value = true
  editingId.value = hospital.id
  formState.value = {
    name: hospital.name,
    nameKh: hospital.nameKh || hospital.name,
    category: hospital.category,
    ownership: hospital.ownership || 'public',
    location: hospital.location,
    phone: hospital.phone || '',
    emergencyHotline: hospital.emergencyHotline || '',
    openingHours: hospital.openingHours || '24/7',
    acceptsNssf: Boolean(hospital.acceptsNssf),
    image: hospital.image,
    address: hospital.address || '',
    addressKh: hospital.addressKh || '',
    servicesInput: hospital.services ? hospital.services.join(', ') : '',
    description: hospital.description || '',
    descriptionKh: hospital.descriptionKh || ''
  }
  currentView.value = 'form'
}

function saveForm() {
  if (!formState.value.name.trim() && !formState.value.nameKh.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបញ្ចូលឈ្មោះមន្ទីរពេទ្យ!' : 'Please enter facility name!')
    return
  }

  const parsedServices = formState.value.servicesInput
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)

  if (isEditing.value) {
    const idx = hospitals.value.findIndex(h => h.id === editingId.value)
    if (idx !== -1) {
      const existing = hospitals.value[idx]
      hospitals.value[idx] = {
        ...existing,
        name: formState.value.name.trim() || formState.value.nameKh.trim(),
        nameKh: formState.value.nameKh.trim() || formState.value.name.trim(),
        category: formState.value.category,
        ownership: formState.value.ownership,
        location: formState.value.location,
        phone: formState.value.phone.trim(),
        emergencyHotline: formState.value.emergencyHotline.trim(),
        openingHours: formState.value.openingHours.trim(),
        acceptsNssf: formState.value.acceptsNssf,
        image: formState.value.image.trim() || existing.image,
        address: formState.value.address.trim(),
        addressKh: formState.value.addressKh.trim(),
        services: parsedServices.length ? parsedServices : existing.services,
        description: formState.value.description.trim() || existing.description,
        descriptionKh: formState.value.descriptionKh.trim() || existing.descriptionKh
      }
      persistHospitals()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែទិន្នន័យមន្ទីរពេទ្យជោគជ័យ!' : 'Hospital details updated!')
    }
  } else {
    const newHospitalId = `h-new-${Date.now().toString().slice(-4)}`
    const newHospitalItem: Hospital = {
      id: newHospitalId,
      name: formState.value.name.trim() || formState.value.nameKh.trim(),
      nameKh: formState.value.nameKh.trim() || formState.value.name.trim(),
      category: formState.value.category,
      ownership: formState.value.ownership,
      location: formState.value.location,
      phone: formState.value.phone.trim(),
      emergencyHotline: formState.value.emergencyHotline.trim(),
      openingHours: formState.value.openingHours.trim(),
      acceptsNssf: formState.value.acceptsNssf,
      image: formState.value.image.trim() || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
      address: formState.value.address.trim(),
      addressKh: formState.value.addressKh.trim(),
      services: parsedServices.length ? parsedServices : ['សង្គ្រោះបន្ទាន់', 'ពិគ្រោះជំងឺទូទៅ'],
      description: formState.value.description.trim() || 'Modern healthcare facility.',
      descriptionKh: formState.value.descriptionKh.trim() || 'មណ្ឌលសុខភាពផ្តល់សេវាព្យាបាលស្តង់ដារ។',
      rating: 4.8,
      reviews: 1,
      coordinates: { lat: 11.5564, lng: 104.9282 }
    }

    hospitals.value.unshift(newHospitalItem)
    persistHospitals()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមមណ្ឌលសុខភាពថ្មីជោគជ័យ!' : 'New medical facility added!')
  }

  backToList()
}

// -------------------------------------------------------------
// DELETE CONFIRMATION MODAL
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingHospital = ref<Hospital | null>(null)

function promptDelete(hospital: Hospital) {
  deletingHospital.value = hospital
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingHospital.value) {
    const id = deletingHospital.value.id
    hospitals.value = hospitals.value.filter(h => h.id !== id)
    persistHospitals()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបមន្ទីរពេទ្យដោយជោគជ័យ!' : 'Hospital removed!')
  }
  isDeleteModalOpen.value = false
  deletingHospital.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- ======================================================== -->
    <!-- VIEW 1: HEALTHCARE & HOSPITALS LIST VIEW                 -->
    <!-- ======================================================== -->
    <div v-if="currentView === 'list'" class="h-full flex flex-col justify-between gap-2 sm:gap-2.5">
      
      <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE HEALTHCARE KPIS) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Facilities -->
      <div
        @click="resetAllFilters"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'All' && selectedOwnership === 'All' && selectedNssf === 'All' && !selected24h
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <HospitalIcon class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សេវាជាតិ' : 'National' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalHospitalsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាពសរុប' : 'Total Facilities' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: NSSF Accredited -->
      <div
        @click="selectedNssf = selectedNssf === 'yes' ? 'All' : 'yes'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedNssf === 'yes'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សុខុមាលភាព' : 'NSSF Support' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-emerald-600 block leading-tight">
            {{ nssfHospitalsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'គាំទ្រ ប.ស.ស' : 'NSSF Accredited' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Public Hospitals -->
      <div
        @click="selectedOwnership = selectedOwnership === 'public' ? 'All' : 'public'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedOwnership === 'public'
            ? 'border-indigo-300 ring-2 ring-indigo-400/20 bg-indigo-50/20'
            : 'border-slate-200/90 hover:border-indigo-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'រដ្ឋបាលរដ្ឋ' : 'State Facilities' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-indigo-700 block leading-tight">
            {{ publicHospitalsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យរដ្ឋ' : 'Public Hospitals' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: 24/7 Emergency Facilities -->
      <div
        @click="selected24h = !selected24h"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selected24h
            ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/20'
            : 'border-slate-200/90 hover:border-rose-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Ambulance class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'បន្ទាន់ ២៤ម៉ោង' : '24/7 Active' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-rose-600 block leading-tight">
            {{ emergency24hCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សង្គ្រោះបន្ទាន់ ២៤/៧' : '24/7 Emergency' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION & FILTER TOOLBAR -->
    <div class="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
      
      <!-- Left: Search & Filter Dropdowns -->
      <div class="flex flex-wrap items-center gap-2 flex-1">
        
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 min-w-[190px] max-w-xs">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមន្ទីរពេទ្យ, គ្លីនិក, សង្គ្រោះបន្ទាន់...' : 'Search hospital, clinic, hotline...'"
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
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទមណ្ឌល' : 'All Categories' }}</option>
            <option value="hospital">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospitals' }}</option>
            <option value="clinic">{{ currentLanguage === 'kh' ? 'គ្លីនិក' : 'Clinics' }}</option>
            <option value="pharmacy">{{ currentLanguage === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacies' }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Ownership Dropdown -->
        <div class="relative">
          <select
            v-model="selectedOwnership"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'កម្មសិទ្ធិ (ទាំងអស់)' : 'All Ownership' }}</option>
            <option value="public">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យរដ្ឋ' : 'Public' }}</option>
            <option value="private">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យឯកជន' : 'Private' }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Province / Location Dropdown -->
        <div class="relative">
          <select
            v-model="selectedLocation"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ខេត្ត/ក្រុង' : 'All Locations' }}</option>
            <option v-for="loc in locations.filter(l => l !== 'All')" :key="loc" :value="loc">
              {{ getLocationName(loc) }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- NSSF Filter Dropdown -->
        <div class="relative">
          <select
            v-model="selectedNssf"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'ប.ស.ស (ទាំងអស់)' : 'All NSSF' }}</option>
            <option value="yes">{{ currentLanguage === 'kh' ? 'គាំទ្រ ប.ស.ស' : 'Accepts NSSF' }}</option>
            <option value="no">{{ currentLanguage === 'kh' ? 'មិនគាំទ្រ ប.ស.ស' : 'No NSSF' }}</option>
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
          <span>{{ currentLanguage === 'kh' ? 'បន្ថែមមន្ទីរពេទ្យថ្មី' : 'Add Facility' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. HEALTHCARE DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full text-left text-xs border-collapse">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2.5 px-4 font-khmer w-[28%]">{{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាព & លេខសម្គាល់' : 'Facility & ID' }}</th>
              <th class="py-2.5 px-3 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'ប្រភេទ & កម្មសិទ្ធិ' : 'Type & Ownership' }}</th>
              <th class="py-2.5 px-3 font-khmer w-[18%]">{{ currentLanguage === 'kh' ? 'ទីតាំង & អាសយដ្ឋាន' : 'Location & Address' }}</th>
              <th class="py-2.5 px-3 font-khmer w-[16%]">{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ & បន្ទាន់' : 'Hotline & Phone' }}</th>
              <th class="py-2.5 px-3 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'ប.ស.ស & ការវាយតម្លៃ' : 'NSSF & Rating' }}</th>
              <th class="py-2.5 px-4 text-right font-khmer w-[10%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 6 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="(h, idx) in paginatedHospitals"
              :key="h.id"
              class="hover:bg-blue-50/25 transition-all duration-150 group h-12.5 sm:h-13"
            >
              
              <!-- 1. Facility Title & ID -->
              <td class="py-2 px-4 align-middle">
                <div class="flex items-center gap-2.5">
                  <div class="relative shrink-0">
                    <img
                      :src="h.image"
                      :alt="h.name"
                      class="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200/90 shadow-2xs group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                    <div
                      v-if="h.openingHours.toLowerCase().includes('24/7')"
                      class="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white absolute -bottom-0.5 -right-0.5"
                    ></div>
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-snug text-xs sm:text-[13px] group-hover:text-blue-600 transition-colors truncate max-w-[240px]"
                    >
                      {{ currentLanguage === 'kh' ? (h.nameKh || h.name) : h.name }}
                    </span>

                    <div class="flex items-center gap-1.5 mt-0.5">
                      <span class="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-mono border border-slate-200/80 font-medium">
                        {{ formatHospitalId(idx) }}
                      </span>
                      <span class="text-slate-300">·</span>
                      <span
                        v-if="h.openingHours.toLowerCase().includes('24/7')"
                        class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 font-khmer"
                      >
                        <Clock class="w-2.5 h-2.5" />
                        {{ currentLanguage === 'kh' ? '២៤/៧' : '24/7' }}
                      </span>
                      <span
                        v-else
                        class="inline-flex items-center gap-1 text-[10px] text-slate-400 font-mono"
                      >
                        <Clock class="w-2.5 h-2.5 text-slate-300" />
                        {{ h.openingHours }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Type & Ownership Badge -->
              <td class="py-2 px-3 align-middle">
                <div class="flex flex-col gap-0.5 items-start">
                  <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border font-khmer shadow-2xs whitespace-nowrap', getCategoryColor(h.category).bg]">
                    {{ getCategoryLabel(h.category) }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[10px] text-slate-400 font-khmer mt-0.5">
                    <Building2 v-if="h.ownership === 'public'" class="w-2.5 h-2.5 text-indigo-500" />
                    <span>{{ getOwnershipLabel(h.ownership) }}</span>
                  </span>
                </div>
              </td>

              <!-- 3. Location & Address -->
              <td class="py-2 px-3 align-middle">
                <div class="flex flex-col min-w-0">
                  <span class="inline-flex items-center gap-1 font-bold text-slate-800 text-[11.5px] font-khmer whitespace-nowrap">
                    <MapPin class="w-3 h-3 text-rose-500 shrink-0" />
                    {{ getLocationName(h.location) }}
                  </span>
                  <span class="text-[10px] text-slate-400 truncate max-w-[210px] font-khmer mt-0.5">
                    {{ currentLanguage === 'kh' ? (h.addressKh || h.address) : (h.address || h.location) }}
                  </span>
                </div>
              </td>

              <!-- 4. Hotline & Phone -->
              <td class="py-2 px-3 align-middle">
                <div class="flex flex-col gap-0.5 items-start">
                  <div v-if="h.emergencyHotline">
                    <a
                      :href="`tel:${h.emergencyHotline.replace(/\s+/g, '')}`"
                      class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/90 font-mono shadow-2xs whitespace-nowrap transition-colors"
                    >
                      <PhoneCall class="w-2.5 h-2.5 text-rose-600 shrink-0 animate-pulse" />
                      <span>{{ h.emergencyHotline }}</span>
                    </a>
                  </div>
                  <div v-else-if="h.phone">
                    <span class="inline-flex items-center gap-1 text-[10.5px] font-semibold text-slate-600 font-mono whitespace-nowrap">
                      <Phone class="w-2.5 h-2.5 text-slate-400 shrink-0" />
                      <span>{{ h.phone }}</span>
                    </span>
                  </div>

                  <!-- Only show secondary phone if genuinely distinct from hotline -->
                  <div v-if="hasDistinctPhone(h)">
                    <span class="inline-flex items-center gap-1 text-[9.5px] text-slate-400 font-mono mt-0.5">
                      <Phone class="w-2 h-2 text-slate-300 shrink-0" />
                      <span>{{ h.phone }}</span>
                    </span>
                  </div>
                </div>
              </td>

              <!-- 5. NSSF & Rating -->
              <td class="py-2 px-3 align-middle">
                <div class="flex flex-col gap-0.5 items-start">
                  <span
                    v-if="h.acceptsNssf"
                    class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-khmer shadow-2xs whitespace-nowrap"
                  >
                    <ShieldCheck class="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                    <span>{{ currentLanguage === 'kh' ? 'ប.ស.ស' : 'NSSF' }}</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] text-slate-400 font-khmer"
                  >
                    {{ currentLanguage === 'kh' ? 'គ្មាន ប.ស.ស' : 'No NSSF' }}
                  </span>

                  <span class="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 font-mono whitespace-nowrap mt-0.5">
                    <Star class="w-2.5 h-2.5 fill-amber-400 text-amber-400 shrink-0" />
                    <span>{{ h.rating }} ({{ h.reviews }})</span>
                  </span>
                </div>
              </td>

              <!-- 6. Executive Action Toolbar (Modern clean micro-buttons) -->
              <td class="py-2 px-4 text-right align-middle">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(h)"
                    class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-blue-50 text-slate-400 hover:text-blue-600 border border-slate-200/80 hover:border-blue-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(h)"
                    class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600 border border-slate-200/80 hover:border-emerald-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                    :title="currentLanguage === 'kh' ? 'កែប្រែទិន្នន័យ' : 'Edit Facility'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(h)"
                    class="w-7 h-7 rounded-lg bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200/80 hover:border-rose-300 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                    :title="currentLanguage === 'kh' ? 'លុបចេញ' : 'Delete'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty Results Row -->
            <tr v-if="filteredHospitals.length === 0">
              <td colspan="6" class="py-10 text-center text-slate-400 font-khmer">
                <div class="flex flex-col items-center justify-center gap-1.5">
                  <HospitalIcon class="w-8 h-8 text-slate-300 stroke-1" />
                  <span class="text-xs font-medium">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញមន្ទីរពេទ្យ ឬគ្លីនិកដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ' : 'No facilities found matching your criteria.' }}
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Table Footer: Clean Pagination Only -->
      <div class="px-4 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end shrink-0">
        <!-- Pagination Controls -->
        <div class="flex items-center gap-1">
          <button
            type="button"
            :disabled="currentPage <= 1"
            @click="currentPage--"
            class="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors text-[11px] font-bold font-khmer flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <ChevronLeft class="w-3 h-3" />
            <span>{{ currentLanguage === 'kh' ? 'មុន' : 'Prev' }}</span>
          </button>

          <div class="flex items-center gap-1 mx-1">
            <button
              v-for="p in totalPages"
              :key="p"
              type="button"
              @click="currentPage = p"
              :class="[
                'w-6 h-6 rounded-lg text-[11px] font-bold font-mono flex items-center justify-center transition-all cursor-pointer shadow-2xs',
                currentPage === p
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              ]"
            >
              {{ p }}
            </button>
          </div>

          <button
            type="button"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
            class="px-2 py-1 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none transition-colors text-[11px] font-bold font-khmer flex items-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>{{ currentLanguage === 'kh' ? 'បន្ទាប់' : 'Next' }}</span>
            <ChevronRight class="w-3 h-3" />
          </button>
        </div>
      </div>

    </div>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW 2: FULL HEALTHCARE FACILITY DETAIL SUB-PAGE         -->
    <!-- ======================================================== -->
    <div v-else-if="currentView === 'detail' && selectedDetailHospital" class="h-full flex flex-col gap-3 overflow-hidden select-text animate-in fade-in duration-200">
      
      <!-- Top Action Bar with Back button & Breadcrumb -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="backToList"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs font-khmer transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft class="w-4 h-4 text-slate-600" />
            <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Back' }}</span>
          </button>

          <div class="h-4 w-px bg-slate-200"></div>

          <div class="flex items-center gap-1.5 text-xs font-khmer">
            <span class="text-slate-400 font-medium cursor-pointer hover:text-slate-700" @click="backToList">
              {{ currentLanguage === 'kh' ? 'សុខាភិបាល & មន្ទីរពេទ្យ' : 'Healthcare & Hospitals' }}
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
            <span class="font-bold text-slate-800 truncate max-w-[280px]">
              {{ currentLanguage === 'kh' ? (selectedDetailHospital.nameKh || selectedDetailHospital.name) : selectedDetailHospital.name }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="openEditModal(selectedDetailHospital)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-khmer transition-colors shadow-xs cursor-pointer"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែទិន្នន័យ' : 'Edit Facility' }}</span>
          </button>
        </div>
      </div>

      <!-- Detail Content Area (Full Page Card) -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 overflow-y-auto space-y-6">
        
        <!-- Header Banner with Image -->
        <div class="relative h-44 sm:h-56 rounded-2xl overflow-hidden shadow-xs">
          <img
            :src="selectedDetailHospital.image"
            :alt="selectedDetailHospital.name"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/40 to-transparent"></div>

          <div class="absolute bottom-4 left-5 right-5 text-white">
            <div class="flex items-center gap-2 mb-1.5 flex-wrap">
              <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-khmer', getCategoryColor(selectedDetailHospital.category).bg]">
                {{ getCategoryLabel(selectedDetailHospital.category) }}
              </span>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 font-khmer">
                {{ getOwnershipLabel(selectedDetailHospital.ownership) }}
              </span>
              <span
                v-if="selectedDetailHospital.acceptsNssf"
                class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/90 text-white border border-emerald-400 font-khmer flex items-center gap-1"
              >
                <ShieldCheck class="w-3 h-3" />
                {{ currentLanguage === 'kh' ? 'គាំទ្រ ប.ស.ស (NSSF)' : 'NSSF Accredited' }}
              </span>
            </div>
            <h2 class="text-xl sm:text-2xl font-black font-khmer leading-tight">
              {{ currentLanguage === 'kh' ? (selectedDetailHospital.nameKh || selectedDetailHospital.name) : selectedDetailHospital.name }}
            </h2>
            <p v-if="selectedDetailHospital.nameKh && selectedDetailHospital.name !== selectedDetailHospital.nameKh" class="text-xs text-slate-300 mt-0.5">
              {{ selectedDetailHospital.name }}
            </p>
          </div>
        </div>

        <!-- 4 Quick Fact Metrics -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ទីតាំងខេត្ត/ក្រុង' : 'Location' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-khmer">{{ getLocationName(selectedDetailHospital.location) }}</span>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទទូទៅ' : 'Phone' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-mono">{{ selectedDetailHospital.phone || 'N/A' }}</span>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'សង្គ្រោះបន្ទាន់' : 'Hotline 24/7' }}</span>
            <span class="text-sm font-black text-rose-600 block mt-1 font-mono font-bold">{{ selectedDetailHospital.emergencyHotline || '115' }}</span>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ម៉ោងដំណើរការ' : 'Hours' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-khmer">{{ selectedDetailHospital.openingHours || '24/7' }}</span>
          </div>
        </div>

        <!-- Address & Details -->
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-700 font-khmer">
          <MapPin class="w-4 h-4 text-rose-500 shrink-0" />
          <span>{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន៖' : 'Address:' }}</span>
          <span class="font-bold text-slate-900">{{ currentLanguage === 'kh' ? (selectedDetailHospital.addressKh || selectedDetailHospital.address) : selectedDetailHospital.address }}</span>
        </div>

        <!-- Services -->
        <div v-if="selectedDetailHospital.services && selectedDetailHospital.services.length" class="space-y-2.5">
          <h4 class="text-xs font-black text-slate-800 font-khmer uppercase tracking-wider flex items-center gap-1.5">
            <Stethoscope class="w-4 h-4 text-blue-600" />
            <span>{{ currentLanguage === 'kh' ? 'សេវាកម្មពិនិត្យ & ព្យាបាល' : 'Available Medical Services' }}</span>
          </h4>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="(service, idx) in selectedDetailHospital.services"
              :key="idx"
              class="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-medium font-khmer"
            >
              {{ service }}
            </span>
          </div>
        </div>

        <!-- Description -->
        <div v-if="selectedDetailHospital.descriptionKh || selectedDetailHospital.description" class="space-y-2">
          <h4 class="text-xs font-black text-slate-800 font-khmer uppercase tracking-wider">
            {{ currentLanguage === 'kh' ? 'អំពីមណ្ឌលសុខភាព' : 'About Medical Facility' }}
          </h4>
          <p class="text-xs sm:text-sm text-slate-600 font-khmer leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {{ currentLanguage === 'kh' ? (selectedDetailHospital.descriptionKh || selectedDetailHospital.description) : selectedDetailHospital.description }}
          </p>
        </div>

      </div>

    </div>

    <!-- ======================================================== -->
    <!-- VIEW 3: FULL ADD / EDIT FACILITY SUB-PAGE                -->
    <!-- ======================================================== -->
    <div v-else-if="currentView === 'form'" class="h-full flex flex-col gap-3 overflow-hidden select-text animate-in fade-in duration-200">
      
      <!-- Top Action Bar with Back button & Breadcrumb -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="backToList"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs font-khmer transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft class="w-4 h-4 text-slate-600" />
            <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Back' }}</span>
          </button>

          <div class="h-4 w-px bg-slate-200"></div>

          <div class="flex items-center gap-1.5 text-xs font-khmer">
            <span class="text-slate-400 font-medium cursor-pointer hover:text-slate-700" @click="backToList">
              {{ currentLanguage === 'kh' ? 'សុខាភិបាល & មន្ទីរពេទ្យ' : 'Healthcare & Hospitals' }}
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
            <span class="font-bold text-slate-800">
              {{ isEditing
                ? (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានមន្ទីរពេទ្យ' : 'Edit Facility')
                : (currentLanguage === 'kh' ? 'បន្ថែមមណ្ឌលសុខភាពថ្មី' : 'Add New Facility')
              }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="backToList"
            class="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="saveForm"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs font-khmer transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>{{ isEditing ? (currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save Changes') : (currentLanguage === 'kh' ? 'បង្កើតថ្មី' : 'Create Facility') }}</span>
          </button>
        </div>
      </div>

      <!-- Form Inputs Area (Full Page Card) -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 overflow-y-auto space-y-5">
        
        <div class="pb-4 border-b border-slate-100">
          <h2 class="text-lg font-black text-slate-900 font-khmer">
            {{ isEditing
              ? (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានមន្ទីរពេទ្យ / គ្លីនិក' : 'Edit Medical Facility Information')
              : (currentLanguage === 'kh' ? 'ចុះបញ្ជីមណ្ឌលសុខភាព ឬមន្ទីរពេទ្យថ្មី' : 'Register New Medical Facility in CamLife')
            }}
          </h2>
          <p class="text-xs text-slate-400 font-medium mt-0.5">
            {{ isEditing ? `ID: ${editingId}` : 'Register a new verified public/private healthcare facility.' }}
          </p>
        </div>

        <div class="space-y-4 text-xs">
          <!-- Name Khmer & English -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះមន្ទីរពេទ្យ (ភាសាខ្មែរ) *</label>
              <input
                v-model="formState.nameKh"
                type="text"
                placeholder="ឧទាហរណ៍៖ មន្ទីរពេទ្យបង្អែករាជធានី"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-khmer font-medium text-xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះមន្ទីរពេទ្យ (ភាសាអង់គ្លេស) *</label>
              <input
                v-model="formState.name"
                type="text"
                placeholder="e.g. Municipal Referral Hospital"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>
          </div>

          <!-- Category & Ownership Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភេទមណ្ឌល' : 'Category' }}
              </label>
              <select
                v-model="formState.category"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer font-khmer text-xs"
              >
                <option value="hospital">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital' }}</option>
                <option value="clinic">{{ currentLanguage === 'kh' ? 'គ្លីនិក' : 'Clinic' }}</option>
                <option value="pharmacy">{{ currentLanguage === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacy' }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'កម្មសិទ្ធិ' : 'Ownership' }}
              </label>
              <select
                v-model="formState.ownership"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer font-khmer text-xs"
              >
                <option value="public">{{ currentLanguage === 'kh' ? 'រដ្ឋ' : 'Public' }}</option>
                <option value="private">{{ currentLanguage === 'kh' ? 'ឯកជន' : 'Private' }}</option>
              </select>
            </div>
          </div>

          <!-- Location & Opening Hours Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ខេត្ត/ក្រុង' : 'Province / Location' }}
              </label>
              <select
                v-model="formState.location"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer font-khmer text-xs"
              >
                <option v-for="loc in locations.filter(l => l !== 'All')" :key="loc" :value="loc">
                  {{ getLocationName(loc) }}
                </option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ម៉ោងបំពេញការងារ' : 'Opening Hours' }}
              </label>
              <input
                v-model="formState.openingHours"
                type="text"
                placeholder="24/7 or 8:00 AM - 5:00 PM"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>
          </div>

          <!-- Phone & Emergency Hotline Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ទូរស័ព្ទទំនាក់ទំនង' : 'General Phone' }}
              </label>
              <input
                v-model="formState.phone"
                type="text"
                placeholder="023 123 456"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ទូរស័ព្ទសង្គ្រោះបន្ទាន់' : 'Emergency Hotline' }}
              </label>
              <input
                v-model="formState.emergencyHotline"
                type="text"
                placeholder="023 999 115"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>
          </div>

          <!-- Accepts NSSF Checkbox -->
          <div class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200">
            <input
              id="nssfCheck"
              v-model="formState.acceptsNssf"
              type="checkbox"
              class="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
            <label for="nssfCheck" class="text-xs font-bold text-slate-800 font-khmer cursor-pointer">
              {{ currentLanguage === 'kh' ? 'គាំទ្រការប្រើប្រាស់ប័ណ្ណ ប.ស.ស (NSSF Accredited Facility)' : 'Accepts NSSF Health Insurance' }}
            </label>
          </div>

          <!-- Address Khmer -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'អាសយដ្ឋានលម្អិត (ភាសាខ្មែរ)' : 'Address (Khmer)' }}
            </label>
            <input
              v-model="formState.addressKh"
              type="text"
              placeholder="ផ្លូវលេខ... សង្កាត់... ខណ្ឌ..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-khmer font-medium text-xs"
            />
          </div>

          <!-- Services (Comma-separated) -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'សេវាកម្មព្យាបាល (ញែកដោយសញ្ញាក្បៀស)' : 'Services (Comma-separated)' }}
            </label>
            <input
              v-model="formState.servicesInput"
              type="text"
              placeholder="សង្គ្រោះបន្ទាន់, វះកាត់ទូទៅ, មន្ទីរពិសោធន៍"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-khmer font-medium text-xs"
            />
          </div>

          <!-- Description Khmer -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'ការពិពណ៌នា (ភាសាខ្មែរ)' : 'Description (Khmer)' }}
            </label>
            <textarea
              v-model="formState.descriptionKh"
              rows="3"
              placeholder="ព័ត៌មានសង្ខេបអំពីមន្ទីរពេទ្យ..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-khmer font-medium text-xs resize-none"
            ></textarea>
          </div>
        </div>

        <!-- Bottom Save Bar -->
        <div class="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            @click="backToList"
            class="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-khmer cursor-pointer transition-colors"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="saveForm"
            class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold font-khmer cursor-pointer shadow-xs transition-all"
          >
            {{ isEditing ? (currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save Changes') : (currentLanguage === 'kh' ? 'បង្កើតថ្មី' : 'Create Facility') }}
          </button>
        </div>

      </div>

    </div>

    <!-- 6. DELETE CONFIRMATION MODAL -->
    <div
      v-if="isDeleteModalOpen && deletingHospital"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs select-text animate-fade-in"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-200 p-5 text-center">
        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <AlertCircle class="w-6 h-6" />
        </div>
        <h3 class="text-sm font-black text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបមន្ទីរពេទ្យនេះ?' : 'Delete Medical Facility?' }}
        </h3>
        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">{{ currentLanguage === 'kh' ? (deletingHospital.nameKh || deletingHospital.name) : deletingHospital.name }}</strong>
          {{ currentLanguage === 'kh' ? ' នឹងត្រូវលុបចេញពីបញ្ជីជាអចិន្ត្រៃយ៍។' : ' will be permanently removed.' }}
        </p>
        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-600 text-xs font-bold font-khmer hover:bg-slate-50 transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-khmer shadow-xs transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'លុបចេញ' : 'Confirm Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
