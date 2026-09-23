<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  FileText,
  Search,
  Plus,
  Clock,
  Trash2,
  CheckCircle2,
  Eye,
  Edit2,
  ShieldCheck,
  Zap,
  Building2,
  MapPin,
  X,
  AlertCircle,
  ChevronLeft,
  Banknote,
  ArrowLeft,
  ChevronRight
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServices, saveCustomGovernmentServices } from '@/services/dataService'
import type { GovernmentService } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// Main Services State
const services = ref<GovernmentService[]>(getGovernmentServices())

function persistGovernmentServices() {
  saveCustomGovernmentServices(services.value)
}

// Search & Filters
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedFeeFilter = ref<'All' | 'Free' | 'Paid'>('All')

// Categories List & Translations
const categoryTranslations: Record<string, { kh: string; en: string }> = {
  'ID Card': { kh: 'អត្តសញ្ញាណប័ណ្ណ', en: 'ID Card' },
  'Passport': { kh: 'លិខិតឆ្លងដែន', en: 'Passport' },
  "Driver's License": { kh: 'ប័ណ្ណបើកបរ', en: "Driver's License" },
  'Birth Certificate': { kh: 'សំបុត្រកំណើត', en: 'Birth Certificate' },
  'Family Book': { kh: 'សៀវភៅគ្រួសារ', en: 'Family Book' },
  'Land Titling': { kh: 'កម្មសិទ្ធិដីធ្លី', en: 'Land Titling' },
  'Land Title': { kh: 'កម្មសិទ្ធិដីធ្លី', en: 'Land Title' },
  'Business License': { kh: 'អាជ្ញាប័ណ្ណអាជីវកម្ម', en: 'Business License' },
  'Marriage Certificate': { kh: 'សំបុត្រអាពាហ៍ពិពាហ៍', en: 'Marriage Certificate' },
  'Civil Status': { kh: 'អត្រានុកូលដ្ឋាន', en: 'Civil Status' },
  'Justice & Legal': { kh: 'យុត្តិធម៌ និងច្បាប់', en: 'Justice & Legal' },
  'Transport': { kh: 'ដឹកជញ្ជូន និងយានយន្ត', en: 'Transport' },
  'Construction': { kh: 'សំណង់ និងដីធ្លី', en: 'Construction' },
  'Social Security': { kh: 'សន្តិសុខសង្គម', en: 'Social Security' }
}

function getCategoryLabel(cat: string): string {
  if (cat === 'All') {
    return currentLanguage.value === 'kh' ? 'គ្រប់ប្រភេទសេវា' : 'All Categories'
  }
  if (currentLanguage.value === 'kh') {
    return categoryTranslations[cat]?.kh || cat
  }
  return categoryTranslations[cat]?.en || cat
}

const categories = computed(() => {
  const cats = new Set(services.value.map(s => s.category))
  return ['All', ...Array.from(cats)]
})

// KPI Metrics
const totalServicesCount = computed(() => services.value.length)
const freeServicesCount = computed(() => {
  return services.value.filter(s =>
    (s.fee || '').toLowerCase().includes('free') ||
    Boolean(s.feeKh && s.feeKh.includes('ឥតគិតថ្លៃ'))
  ).length
})
const expressServicesCount = computed(() => {
  return services.value.filter(s => {
    const pt = (s.processingTime || '').toLowerCase()
    return pt.includes('same day') || pt.includes('1-3') || pt.includes('express')
  }).length
})
const categoriesCount = computed(() => categories.value.length - 1)

// Filtered Services List
const filteredServices = computed(() => {
  return services.value.filter(s => {
    // Category match
    const matchCat = selectedCategory.value === 'All' || s.category === selectedCategory.value

    // Fee match
    const isFree = (s.fee || '').toLowerCase().includes('free') || Boolean(s.feeKh && s.feeKh.includes('ឥតគិតថ្លៃ'))
    const matchFee =
      selectedFeeFilter.value === 'All' ||
      (selectedFeeFilter.value === 'Free' && isFree) ||
      (selectedFeeFilter.value === 'Paid' && !isFree)

    // Search query match
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat && matchFee

    const matchSearch =
      (s.title || '').toLowerCase().includes(q) ||
      (s.titleKh && s.titleKh.toLowerCase().includes(q)) ||
      (s.id || '').toLowerCase().includes(q) ||
      (s.category || '').toLowerCase().includes(q) ||
      (categoryTranslations[s.category]?.kh && categoryTranslations[s.category].kh.toLowerCase().includes(q)) ||
      (s.description || '').toLowerCase().includes(q) ||
      (s.location && s.location.toLowerCase().includes(q))

    return matchCat && matchFee && matchSearch
  })
})

// Pagination State (Full Screen Viewport Fit)
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredServices.value.length / itemsPerPage.value) || 1)

const paginatedServices = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredServices.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedCategory, selectedFeeFilter, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// Helpers for Category Color Theme
function getCategoryColor(category: string) {
  const cat = category.toLowerCase()
  if (cat.includes('id') || cat.includes('card')) {
    return {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      iconBg: 'bg-blue-100 text-blue-600'
    }
  }
  if (cat.includes('passport')) {
    return {
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      iconBg: 'bg-indigo-100 text-indigo-600'
    }
  }
  if (cat.includes('driver') || cat.includes('license')) {
    return {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      iconBg: 'bg-amber-100 text-amber-600'
    }
  }
  if (cat.includes('birth') || cat.includes('family') || cat.includes('marriage') || cat.includes('civil') || cat.includes('status')) {
    return {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      iconBg: 'bg-emerald-100 text-emerald-600'
    }
  }
  if (cat.includes('business') || cat.includes('company')) {
    return {
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      iconBg: 'bg-purple-100 text-purple-600'
    }
  }
  if (cat.includes('land') || cat.includes('property')) {
    return {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      iconBg: 'bg-rose-100 text-rose-600'
    }
  }
  if (cat.includes('justice') || cat.includes('legal')) {
    return {
      bg: 'bg-sky-50 text-sky-700 border-sky-200',
      iconBg: 'bg-sky-100 text-sky-600'
    }
  }
  if (cat.includes('transport') || cat.includes('vehicle')) {
    return {
      bg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      iconBg: 'bg-cyan-100 text-cyan-600'
    }
  }
  if (cat.includes('construction')) {
    return {
      bg: 'bg-orange-50 text-orange-700 border-orange-200',
      iconBg: 'bg-orange-100 text-orange-600'
    }
  }
  if (cat.includes('security') || cat.includes('nssf')) {
    return {
      bg: 'bg-teal-50 text-teal-700 border-teal-200',
      iconBg: 'bg-teal-100 text-teal-600'
    }
  }
  return {
    bg: 'bg-slate-50 text-slate-700 border-slate-200',
    iconBg: 'bg-slate-100 text-slate-600'
  }
}

// -------------------------------------------------------------
// TABLE CLEAN FORMATTERS (Concise, single-line presentation)
// -------------------------------------------------------------
function formatProcessingTime(s: GovernmentService): string {
  if (currentLanguage.value === 'kh') {
    const t = s.processingTimeKh || s.processingTime || ''
    if (t.includes('១៥ ដល់ ៣០') || t.includes('15 to 30')) return '១៥ - ៣០ ថ្ងៃ'
    if (t.includes('២០ ថ្ងៃ') || t.includes('១-៣ ថ្ងៃ') || t.includes('20 business')) return '១ ដល់ ២០ ថ្ងៃ'
    if (t.includes('ក្នុងថ្ងៃតែមួយ') || t.includes('Same Day')) return 'ក្នុងថ្ងៃតែមួយ'
    if (t.includes('១ ដល់ ៣') || t.includes('1 to 3')) return '១ - ៣ ថ្ងៃ'
    if (t.includes('៣ ដល់ ៥') || t.includes('3 to 5')) return '៣ - ៥ ថ្ងៃ'
    if (t.includes('៣ ដល់ ៧') || t.includes('3 to 7')) return '៣ - ៧ ថ្ងៃ'
    if (t.includes('៧ ដល់ ១២') || t.includes('7 to 12')) return '៧ - ១២ ថ្ងៃ'
    if (t.includes('៧ ដល់ ១៤') || t.includes('7 to 14')) return '៧ - ១៤ ថ្ងៃ'
    if (t.includes('១០ ដល់ ១៥') || t.includes('10 to 15')) return '១០ - ១៥ ថ្ងៃ'
    if (t.includes('១៥ ដល់ ២៥') || t.includes('15 to 25')) return '១៥ - ២៥ ថ្ងៃ'
    if (t.includes('៣០ ដល់ ៤៥') || t.includes('30 to 45')) return '៣០ - ៤៥ ថ្ងៃ'
    return t.replace(/\(.*?\)/g, '').trim() || t || '-'
  } else {
    const t = s.processingTime || ''
    if (t.includes('15 to 30')) return '15 - 30 days'
    if (t.includes('20 business') || t.includes('Express')) return '1 - 20 days'
    if (t.includes('Same Day')) return 'Same Day'
    if (t.includes('1 to 3')) return '1 - 3 days'
    if (t.includes('3 to 5')) return '3 - 5 days'
    if (t.includes('3 to 7')) return '3 - 7 days'
    if (t.includes('7 to 12')) return '7 - 12 days'
    if (t.includes('7 to 14')) return '7 - 14 days'
    if (t.includes('10 to 15')) return '10 - 15 days'
    if (t.includes('15 to 25')) return '15 - 25 days'
    if (t.includes('30 to 45')) return '30 - 45 days'
    return t.replace(/\(.*?\)/g, '').trim() || t || '-'
  }
}

function isServiceFree(s: GovernmentService): boolean {
  return (
    (s.fee || '').toLowerCase().includes('free') ||
    Boolean(s.feeKh && s.feeKh.includes('ឥតគិតថ្លៃ'))
  )
}

function formatFee(s: GovernmentService): string {
  if (isServiceFree(s)) {
    return currentLanguage.value === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free'
  }
  if (currentLanguage.value === 'kh') {
    const f = s.feeKh || s.fee
    if (f.includes('១១៥') || f.includes('115')) return '$115 - $200'
    if (f.includes('៣០,០០០') || f.includes('30,000')) return '៣០,០០០ - ៩០,០០០ ៛'
    if (f.includes('១០,០០០') || f.includes('10,000')) return '១០,០០០ - ២០,០០០ ៛'
    if (f.includes('១៥,០០០') || f.includes('15,000')) return '១៥,០០០ - ៤៥,០០០ ៛'
    if (f.includes('៥០០') || f.includes('500')) return '~$500 - $700'
    if (f.includes('១២០') || f.includes('120')) return '~$120 - $350'
    return f.replace(/\(.*?\)/g, '').trim() || f
  } else {
    const f = s.fee
    if (f.includes('$115') || f.includes('115')) return '$115 - $200'
    if (f.includes('30,000') || f.includes('Type A')) return '30,000 - 90,000 KHR'
    if (f.includes('10,000') || f.includes('10,000 KHR')) return '10,000 - 20,000 KHR'
    if (f.includes('15,000') || f.includes('15,000 to')) return '15,000 - 45,000 KHR'
    if (f.includes('500') || f.includes('$500')) return '~$500 - $700'
    if (f.includes('120') || f.includes('$120')) return '~$120 - $350'
    return f.replace(/\(.*?\)/g, '').trim() || f
  }
}

function formatValidity(s: GovernmentService): string {
  if (currentLanguage.value === 'kh') {
    const v = s.validityKh || s.validity || 'អចិន្ត្រៃយ៍'
    if (v.includes('១០ ឆ្នាំ') && (v.includes('៥ ឆ្នាំ') || v.includes('កាតគ្រី') || v.includes('ប្រភេទ ក'))) return '១០ ឆ្នាំ / ៥ ឆ្នាំ'
    if (v.includes('១០ ឆ្នាំ')) return '១០ ឆ្នាំ'
    if (v.includes('៣ ខែ')) return '៣ ខែ'
    if (v.includes('១ ឆ្នាំ')) return '១ ឆ្នាំ'
    if (v.includes('អចិន្ត្រៃយ៍') || v.includes('គ្មានកាលកំណត់')) return 'អចិន្ត្រៃយ៍'
    return v.replace(/\(.*?\)/g, '').trim() || v
  } else {
    const v = s.validity || 'Permanent'
    if (v.includes('10 Years') && (v.includes('5 Years') || v.includes('Renewal') || v.includes('Lifetime'))) return '10 Yrs / 5 Yrs'
    if (v.includes('10 Years') || v.includes('10 years')) return '10 Years'
    if (v.includes('3 Months') || v.includes('3 months')) return '3 Months'
    if (v.includes('1 Year') || v.includes('1 year')) return '1 Year'
    if (v.includes('Permanent') || v.includes('Lifetime')) return 'Permanent'
    return v.replace(/\(.*?\)/g, '').trim() || v
  }
}

// -------------------------------------------------------------
// PAGE VIEW STATE ('list' | 'detail' | 'form')
// -------------------------------------------------------------
const currentView = ref<'list' | 'detail' | 'form'>('list')

function backToList() {
  currentView.value = 'list'
  selectedDetailService.value = null
  isEditing.value = false
  editingId.value = ''
}

// -------------------------------------------------------------
// DETAIL VIEW (View Full Procedure, Documents & Location)
// -------------------------------------------------------------
const selectedDetailService = ref<GovernmentService | null>(null)

function openDetailModal(service: GovernmentService) {
  selectedDetailService.value = service
  currentView.value = 'detail'
}

// -------------------------------------------------------------
// ADD / EDIT FORM STATE
// -------------------------------------------------------------
const isEditing = ref(false)
const editingId = ref('')

const formState = ref({
  title: '',
  titleKh: '',
  category: 'Civil Status',
  processingTime: '3-5 business days',
  processingTimeKh: '៣ ដល់ ៥ ថ្ងៃធ្វើការ',
  fee: 'Free of charge (Official government policy)',
  feeKh: 'ឥតគិតថ្លៃ (គោលនយោបាយរាជរដ្ឋាភិបាល)',
  validity: '10 Years',
  validityKh: '១០ ឆ្នាំ',
  location: 'Local Commune/Sangkat Administration Offices & OWSO',
  locationKh: 'សាលាសង្កាត់/ឃុំ និងច្រកចេញចូលតែមួយ (OWSO)',
  description: '',
  descriptionKh: '',
  requirementsText: 'National ID Card, Family Book (Kor.Bou.4)',
  requirementsKhText: 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ, សៀវភៅគ្រួសារ (ក.ប.៤)'
})

function openAddModal() {
  isEditing.value = false
  editingId.value = ''
  formState.value = {
    title: '',
    titleKh: '',
    category: 'ID Card',
    processingTime: '3 to 5 business days',
    processingTimeKh: '៣ ដល់ ៥ ថ្ងៃធ្វើការ',
    fee: 'Free of charge (Official policy)',
    feeKh: 'ឥតគិតថ្លៃ (គោលនយោបាយផ្លូវការ)',
    validity: '10 Years',
    validityKh: '១០ ឆ្នាំ',
    location: 'Commune/Sangkat OWSO Center',
    locationKh: 'ការិយាល័យច្រកចេញចូលតែមួយ សង្កាត់/ខណ្ឌ',
    description: 'Official civic service provided by Royal Government of Cambodia.',
    descriptionKh: 'សេវារដ្ឋបាលសាធារណៈផ្លូវការ ផ្តល់ជូនដោយរាជរដ្ឋាភិបាលកម្ពុជា។',
    requirementsText: 'Original Birth Certificate, Family Book, Passport Photos',
    requirementsKhText: 'សំបុត្រកំណើតច្បាប់ដើម, សៀវភៅគ្រួសារ, រូបថត'
  }
  currentView.value = 'form'
}

function openEditModal(service: GovernmentService) {
  isEditing.value = true
  editingId.value = service.id
  formState.value = {
    title: service.title,
    titleKh: service.titleKh || service.title,
    category: service.category,
    processingTime: service.processingTime,
    processingTimeKh: service.processingTimeKh || service.processingTime,
    fee: service.fee,
    feeKh: service.feeKh || service.fee,
    validity: service.validity,
    validityKh: service.validityKh || service.validity,
    location: service.location,
    locationKh: service.locationKh || service.location,
    description: service.description,
    descriptionKh: service.descriptionKh || service.description,
    requirementsText: service.requirements?.join(', ') || '',
    requirementsKhText: service.requirementsKh?.join(', ') || ''
  }
  currentView.value = 'form'
}

function handleSaveService() {
  if (!formState.value.title.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះសេវាជាភាសាអង់គ្លេស!' : 'Please enter English service title!')
    return
  }

  const reqsEn = formState.value.requirementsText
    ? formState.value.requirementsText.split(',').map(r => r.trim()).filter(Boolean)
    : ['National ID Card']

  const reqsKh = formState.value.requirementsKhText
    ? formState.value.requirementsKhText.split(',').map(r => r.trim()).filter(Boolean)
    : ['អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ']

  if (isEditing.value && editingId.value) {
    const idx = services.value.findIndex(s => s.id === editingId.value)
    if (idx !== -1) {
      services.value[idx] = {
        ...services.value[idx],
        title: formState.value.title.trim(),
        titleKh: formState.value.titleKh.trim() || formState.value.title.trim(),
        category: formState.value.category,
        processingTime: formState.value.processingTime.trim(),
        processingTimeKh: formState.value.processingTimeKh.trim() || formState.value.processingTime.trim(),
        fee: formState.value.fee.trim(),
        feeKh: formState.value.feeKh.trim() || formState.value.fee.trim(),
        validity: formState.value.validity.trim(),
        validityKh: formState.value.validityKh.trim() || formState.value.validity.trim(),
        location: formState.value.location.trim(),
        locationKh: formState.value.locationKh.trim() || formState.value.location.trim(),
        description: formState.value.description.trim(),
        descriptionKh: formState.value.descriptionKh.trim() || formState.value.description.trim(),
        requirements: reqsEn,
        requirementsKh: reqsKh
      }
      persistGovernmentServices()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែទិន្នន័យសេវារដ្ឋបាលជោគជ័យ!' : 'Government service updated!')
    }
  } else {
    const slug = formState.value.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const newServiceId = slug || `gov-${Date.now()}`

    const newServiceItem: GovernmentService = {
      id: newServiceId,
      title: formState.value.title.trim(),
      titleKh: formState.value.titleKh.trim() || formState.value.title.trim(),
      category: formState.value.category,
      description: formState.value.description.trim() || 'Official government service provided by RGC.',
      descriptionKh: formState.value.descriptionKh.trim() || 'សេវាសាធារណៈរបស់រាជរដ្ឋាភិបាលកម្ពុជា។',
      processingTime: formState.value.processingTime.trim(),
      processingTimeKh: formState.value.processingTimeKh.trim() || formState.value.processingTime.trim(),
      fee: formState.value.fee.trim(),
      feeKh: formState.value.feeKh.trim() || formState.value.fee.trim(),
      validity: formState.value.validity.trim(),
      validityKh: formState.value.validityKh.trim() || formState.value.validity.trim(),
      location: formState.value.location.trim(),
      locationKh: formState.value.locationKh.trim() || formState.value.location.trim(),
      ageRequirements: '18+',
      ageRequirementsKh: '១៨ ឆ្នាំឡើង',
      requirements: reqsEn,
      requirementsKh: reqsKh,
      process: [
        {
          step: 1,
          title: 'Submit documents',
          titleKh: 'ដាក់ឯកសារ',
          description: 'Submit supporting documents to local commune/OWSO desk.',
          descriptionKh: 'ដាក់ឯកសារនៅតុការិយាល័យច្រកចេញចូលតែមួយ (OWSO)។'
        },
        {
          step: 2,
          title: 'Verification & Processing',
          titleKh: 'ការត្រួតពិនិត្យ និងដំណើរការ',
          description: 'Official verification by administrative authorities.',
          descriptionKh: 'មន្ត្រីត្រួតពិនិត្យភាពត្រឹមត្រូវ និងដំណើរការស្នើសុំ។'
        },
        {
          step: 3,
          title: 'Receive Certificate / Document',
          titleKh: 'ទទួលលិខិត ឬឯកសារផ្លូវការ',
          description: 'Collect official document upon notification.',
          descriptionKh: 'ទៅបើកយកឯកសារផ្លូវការនៅពេលកំណត់។'
        }
      ],
      faq: []
    }

    services.value.unshift(newServiceItem)
    persistGovernmentServices()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមសេវារដ្ឋបាលថ្មីជោគជ័យ!' : 'New government service added!')
  }

  backToList()
}

// -------------------------------------------------------------
// DELETE CONFIRMATION MODAL
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingService = ref<GovernmentService | null>(null)

function promptDelete(service: GovernmentService) {
  deletingService.value = service
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingService.value) {
    const id = deletingService.value.id
    services.value = services.value.filter(s => s.id !== id)
    persistGovernmentServices()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបសេវារដ្ឋបាលដោយជោគជ័យ!' : 'Service deleted successfully!')
  }
  isDeleteModalOpen.value = false
  deletingService.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- ======================================================== -->
    <!-- VIEW 1: SERVICES TABLE & KPIS LIST VIEW                 -->
    <!-- ======================================================== -->
    <div v-if="currentView === 'list'" class="h-full flex flex-col justify-between gap-2 sm:gap-2.5">
      
      <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Services -->
      <div
        @click="selectedCategory = 'All'; selectedFeeFilter = 'All'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'All' && selectedFeeFilter === 'All'
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សេវាជាតិ' : 'National' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalServicesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសរុប' : 'Total Services' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: Free Public Services -->
      <div
        @click="selectedFeeFilter = 'Free'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedFeeFilter === 'Free'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ' : 'Zero Fee' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ freeServicesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សេវាឥតគិតថ្លៃ' : 'Free Services' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Express / Fast Track -->
      <div
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 hover:border-amber-300 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Zap class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? '១ ~ ៣ ថ្ងៃ' : 'Rapid Track' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ expressServicesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សេវាដំណើរការរហ័ស' : 'Express Track' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Categories -->
      <div
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 hover:border-purple-300 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ក្រសួង' : 'Ministries' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ categoriesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ប្រភេទសេវារដ្ឋបាល' : 'Service Sectors' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION & FILTER TOOLBAR -->
    <div class="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
      
      <!-- Left: Search & Dropdown Filters -->
      <div class="flex flex-wrap items-center gap-2 flex-1">
        
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវា, អត្តសញ្ញាណប័ណ្ណ, លិខិតឆ្លងដែន...' : 'Search services, passport, ID card...'"
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
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទសេវា' : 'All Categories' }}</option>
            <option v-for="c in categories.filter(c => c !== 'All')" :key="c" :value="c">{{ getCategoryLabel(c) }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Fee Filter Dropdown -->
        <div class="relative">
          <select
            v-model="selectedFeeFilter"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'តម្លៃសេវា (ទាំងអស់)' : 'All Fees' }}</option>
            <option value="Free">{{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free Services' }}</option>
            <option value="Paid">{{ currentLanguage === 'kh' ? 'មានគិតកម្រៃ' : 'Paid Services' }}</option>
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
          <span>{{ currentLanguage === 'kh' ? 'បន្ថែមសេវាថ្មី' : 'Add Service' }}</span>
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
              <th class="py-2 px-3.5 font-khmer w-[27%]">{{ currentLanguage === 'kh' ? 'សេវា & លេខសម្គាល់' : 'Service Title & ID' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'រយៈពេល' : 'Processing Time' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[15%]">{{ currentLanguage === 'kh' ? 'តម្លៃសេវា' : 'Fee' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[15%]">{{ currentLanguage === 'kh' ? 'សុពលភាព' : 'Validity' }}</th>
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
              
              <!-- 1. Service Title & ID -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105', getCategoryColor(s.category).iconBg]">
                    <FileText class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                      :title="currentLanguage === 'kh' ? (s.titleKh || s.title) : s.title"
                    >
                      {{ currentLanguage === 'kh' ? (s.titleKh || s.title) : s.title }}
                    </span>

                    <div class="flex items-center gap-1.5 mt-0.5 min-w-0 truncate">
                      <span class="inline-flex items-center px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[9.5px] font-mono border border-slate-200/80 font-medium shrink-0">
                        {{ s.id }}
                      </span>
                      <span v-if="s.location" class="inline-flex items-center gap-1 text-[9.5px] text-slate-400 font-medium truncate" :title="currentLanguage === 'kh' ? (s.locationKh || s.location) : s.location">
                        <MapPin class="w-2.5 h-2.5 shrink-0 text-slate-400" />
                        <span class="truncate font-khmer">{{ currentLanguage === 'kh' ? (s.locationKh || s.location) : s.location }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Category Badge (Single-line whitespace-nowrap) -->
              <td class="py-1.5 px-2.5 align-middle">
                <span
                  :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border font-khmer shadow-2xs truncate max-w-full', getCategoryColor(s.category).bg]"
                  :title="getCategoryLabel(s.category)"
                >
                  <span class="truncate">{{ getCategoryLabel(s.category) }}</span>
                </span>
              </td>

              <!-- 3. Processing Time (Clean single-line badge) -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1.5 max-w-full truncate" :title="currentLanguage === 'kh' ? (s.processingTimeKh || s.processingTime) : s.processingTime">
                  <div
                    :class="[
                      'w-5 h-5 rounded-md flex items-center justify-center shrink-0',
                      (s.processingTime || '').toLowerCase().includes('same day') || (s.processingTime || '').toLowerCase().includes('1-3')
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-slate-100 text-slate-500'
                    ]"
                  >
                    <Clock class="w-3 h-3" />
                  </div>
                  <span class="text-[11px] font-semibold text-slate-700 font-khmer truncate">
                    {{ formatProcessingTime(s) }}
                  </span>
                </div>
              </td>

              <!-- 4. Fee Details (Pill shaped, no truncated raw strings) -->
              <td class="py-1.5 px-2.5 align-middle">
                <div v-if="isServiceFree(s)" :title="currentLanguage === 'kh' ? (s.feeKh || s.fee) : s.fee">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-khmer shadow-2xs truncate max-w-full">
                    <CheckCircle2 class="w-3 h-3 text-emerald-600 shrink-0" />
                    <span class="truncate">{{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free' }}</span>
                  </span>
                </div>
                <div v-else :title="currentLanguage === 'kh' ? (s.feeKh || s.fee) : s.fee">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-blue-50 text-blue-700 border border-blue-200/90 font-khmer shadow-2xs truncate max-w-full">
                    <Banknote class="w-3 h-3 text-blue-600 shrink-0" />
                    <span class="truncate">{{ formatFee(s) }}</span>
                  </span>
                </div>
              </td>

              <!-- 5. Validity Period (Concise single-line pill) -->
              <td class="py-1.5 px-2.5 align-middle">
                <span
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-slate-100 text-slate-700 border border-slate-200/90 font-khmer shadow-2xs truncate max-w-full"
                  :title="currentLanguage === 'kh' ? (s.validityKh || s.validity || 'អចិន្ត្រៃយ៍') : (s.validity || 'Official')"
                >
                  <ShieldCheck class="w-3 h-3 text-blue-600 shrink-0" />
                  <span class="truncate">{{ formatValidity(s) }}</span>
                </span>
              </td>

              <!-- 6. Executive Action Toolbar (Modern micro-buttons) -->
              <td class="py-1.5 px-3 text-right align-middle">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(s)"
                    class="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200/60 hover:border-blue-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(s)"
                    class="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/60 hover:border-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
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
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញសេវារដ្ឋបាលទេ' : 'No government services found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try clearing your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedCategory = 'All'; selectedFeeFilter = 'All'"
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

    </div>

    <!-- ======================================================== -->
    <!-- VIEW 2: FULL SERVICE DETAIL SUB-PAGE                     -->
    <!-- ======================================================== -->
    <div v-else-if="currentView === 'detail' && selectedDetailService" class="h-full flex flex-col gap-3 overflow-hidden select-text animate-in fade-in duration-200">
      
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
              {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាល' : 'Government Services' }}
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
            <span class="font-bold text-slate-800 truncate max-w-[280px]">
              {{ currentLanguage === 'kh' ? (selectedDetailService.titleKh || selectedDetailService.title) : selectedDetailService.title }}
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="openEditModal(selectedDetailService)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs font-khmer transition-colors shadow-xs cursor-pointer"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែទិន្នន័យ' : 'Edit Service' }}</span>
          </button>
        </div>
      </div>

      <!-- Detail Content Area (Full Page Card) -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 overflow-y-auto space-y-6">
        
        <!-- Header Banner -->
        <div class="flex items-start justify-between pb-5 border-b border-slate-100 gap-4">
          <div class="flex items-start gap-3.5 min-w-0">
            <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs', getCategoryColor(selectedDetailService.category).iconBg]">
              <FileText class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2 mb-1">
                <span :class="['px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-khmer', getCategoryColor(selectedDetailService.category).bg]">
                  {{ getCategoryLabel(selectedDetailService.category) }}
                </span>
                <span class="text-[11px] font-mono text-slate-400">ID: {{ selectedDetailService.id }}</span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black text-slate-900 font-khmer leading-tight">
                {{ currentLanguage === 'kh' ? (selectedDetailService.titleKh || selectedDetailService.title) : selectedDetailService.title }}
              </h2>
              <p v-if="selectedDetailService.titleKh && selectedDetailService.title !== selectedDetailService.titleKh" class="text-xs text-slate-400 font-medium mt-0.5">
                {{ selectedDetailService.title }}
              </p>
            </div>
          </div>
        </div>

        <!-- Quick Facts Matrix (4 Key KPIs) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'រយៈពេលដំណើរការ' : 'Processing Time' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-khmer">
              {{ currentLanguage === 'kh' ? (selectedDetailService.processingTimeKh || selectedDetailService.processingTime) : selectedDetailService.processingTime }}
            </span>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'តម្លៃសេវា' : 'Fee' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-khmer">
              {{ currentLanguage === 'kh' ? (selectedDetailService.feeKh || selectedDetailService.fee) : selectedDetailService.fee }}
            </span>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'សុពលភាព' : 'Validity' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-khmer">
              {{ currentLanguage === 'kh' ? (selectedDetailService.validityKh || selectedDetailService.validity) : selectedDetailService.validity }}
            </span>
          </div>

          <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10px] font-bold text-slate-400 font-khmer block uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'អាយុតម្រូវ' : 'Age Req.' }}</span>
            <span class="text-sm font-black text-slate-900 block mt-1 font-khmer">
              {{ currentLanguage === 'kh' ? (selectedDetailService.ageRequirementsKh || selectedDetailService.ageRequirements || '១៨+') : (selectedDetailService.ageRequirements || '18+') }}
            </span>
          </div>
        </div>

        <!-- Service Description -->
        <div class="space-y-2">
          <h4 class="text-xs font-black text-slate-800 font-khmer uppercase tracking-wider">
            {{ currentLanguage === 'kh' ? 'ការពិពណ៌នាសេវារដ្ឋបាល' : 'Service Description' }}
          </h4>
          <p class="text-xs sm:text-sm text-slate-600 font-khmer leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            {{ currentLanguage === 'kh' ? (selectedDetailService.descriptionKh || selectedDetailService.description) : selectedDetailService.description }}
          </p>
        </div>

        <!-- Required Documents Checklist -->
        <div class="space-y-2.5">
          <h4 class="text-xs font-black text-slate-800 font-khmer uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-emerald-600" />
            <span>{{ currentLanguage === 'kh' ? 'ឯកសារតម្រូវចាំបាច់' : 'Mandatory Supporting Documents' }}</span>
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div
              v-for="(req, idx) in (currentLanguage === 'kh' && selectedDetailService.requirementsKh?.length ? selectedDetailService.requirementsKh : selectedDetailService.requirements)"
              :key="idx"
              class="flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs font-medium text-slate-800 font-khmer"
            >
              <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
              <span class="leading-snug">{{ req }}</span>
            </div>
          </div>
        </div>

        <!-- Application Steps Procedure -->
        <div v-if="selectedDetailService.process && selectedDetailService.process.length" class="space-y-2.5">
          <h4 class="text-xs font-black text-slate-800 font-khmer uppercase tracking-wider flex items-center gap-1.5">
            <Clock class="w-4 h-4 text-blue-600" />
            <span>{{ currentLanguage === 'kh' ? 'ដំណាក់កាលនៃនីតិវិធីស្នើសុំ' : 'Application Process Steps' }}</span>
          </h4>
          <div class="space-y-2.5">
            <div
              v-for="step in selectedDetailService.process"
              :key="step.step"
              class="flex items-start gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200/80"
            >
              <span class="w-7 h-7 rounded-lg bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                {{ step.step }}
              </span>
              <div class="min-w-0 flex-1">
                <h5 class="text-xs sm:text-sm font-bold text-slate-900 font-khmer leading-snug">
                  {{ currentLanguage === 'kh' ? (step.titleKh || step.title) : step.title }}
                </h5>
                <p class="text-xs text-slate-500 font-khmer mt-0.5 leading-relaxed">
                  {{ currentLanguage === 'kh' ? (step.descriptionKh || step.description) : step.description }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Location Info -->
        <div class="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2.5 text-xs text-slate-600 font-khmer">
          <MapPin class="w-4 h-4 text-rose-500 shrink-0" />
          <span>{{ currentLanguage === 'kh' ? 'ទីតាំងផ្តល់សេវា៖' : 'Service Location:' }}</span>
          <span class="font-bold text-slate-800">{{ currentLanguage === 'kh' ? (selectedDetailService.locationKh || selectedDetailService.location) : selectedDetailService.location }}</span>
        </div>

      </div>

    </div>

    <!-- ======================================================== -->
    <!-- VIEW 3: FULL ADD / EDIT FORM SUB-PAGE                    -->
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
              {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាល' : 'Government Services' }}
            </span>
            <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
            <span class="font-bold text-slate-800">
              {{ isEditing
                ? (currentLanguage === 'kh' ? 'កែប្រែសេវា' : 'Edit Service')
                : (currentLanguage === 'kh' ? 'បង្កើតសេវាថ្មី' : 'Add Service')
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
            @click="handleSaveService"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs font-khmer transition-all shadow-xs cursor-pointer"
          >
            <CheckCircle2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'រក្សាទុកទិន្នន័យ' : 'Save Service' }}</span>
          </button>
        </div>
      </div>

      <!-- Form Inputs Area (Full Page Card) -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 overflow-y-auto space-y-5">
        
        <div class="pb-4 border-b border-slate-100">
          <h2 class="text-lg font-black text-slate-900 font-khmer">
            {{ isEditing
              ? (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានសេវារដ្ឋបាល' : 'Edit Government Service Information')
              : (currentLanguage === 'kh' ? 'បង្កើត និងចុះបញ្ជីសេវារដ្ឋបាលថ្មី' : 'Add New Government Service to Registry')
            }}
          </h2>
          <p class="text-xs text-slate-400 font-medium mt-0.5">
            {{ isEditing ? `ID: ${editingId}` : 'Fill in the service details, fees, requirements and validity.' }}
          </p>
        </div>

        <div class="space-y-4 text-xs">
          <!-- Title English & Khmer -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះសេវាជាភាសាអង់គ្លេស *</label>
              <input
                v-model="formState.title"
                type="text"
                placeholder="e.g. Cambodian Passport Renewal"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះសេវាជាភាសាខ្មែរ</label>
              <input
                v-model="formState.titleKh"
                type="text"
                placeholder="ឧទាហរណ៍៖ ការបន្តលិខិតឆ្លងដែនកម្ពុជា"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-khmer font-medium text-xs"
              />
            </div>
          </div>

          <!-- Category & Processing Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភេទសេវា' : 'Category' }}
              </label>
              <select
                v-model="formState.category"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-bold text-slate-700 cursor-pointer font-khmer text-xs"
              >
                <option value="ID Card">{{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណ' : 'ID Card' }}</option>
                <option value="Passport">{{ currentLanguage === 'kh' ? 'លិខិតឆ្លងដែន' : 'Passport' }}</option>
                <option value="Driver's License">{{ currentLanguage === 'kh' ? 'ប័ណ្ណបើកបរ' : "Driver's License" }}</option>
                <option value="Birth Certificate">{{ currentLanguage === 'kh' ? 'សំបុត្រកំណើត' : 'Birth Certificate' }}</option>
                <option value="Family Book">{{ currentLanguage === 'kh' ? 'សៀវភៅគ្រួសារ' : 'Family Book' }}</option>
                <option value="Marriage Certificate">{{ currentLanguage === 'kh' ? 'សំបុត្រអាពាហ៍ពិពាហ៍' : 'Marriage Certificate' }}</option>
                <option value="Business Registration">{{ currentLanguage === 'kh' ? 'ចុះបញ្ជីអាជីវកម្ម' : 'Business Registration' }}</option>
                <option value="Land Title">{{ currentLanguage === 'kh' ? 'ប្លង់ដី/អចលនទ្រព្យ' : 'Land Title' }}</option>
                <option value="Civil Status">{{ currentLanguage === 'kh' ? 'អត្រានុកូលដ្ឋាន' : 'Civil Status' }}</option>
              </select>
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'រយៈពេលដំណើរការ' : 'Processing Time' }}
              </label>
              <input
                v-model="formState.processingTime"
                type="text"
                placeholder="e.g. 15 to 30 business days"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>
          </div>

          <!-- Fee & Validity -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'តម្លៃសេវា' : 'Fee' }}
              </label>
              <input
                v-model="formState.fee"
                type="text"
                placeholder="e.g. Free or $115 - $200"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'សុពលភាព' : 'Validity' }}
              </label>
              <input
                v-model="formState.validity"
                type="text"
                placeholder="e.g. 10 Years or Permanent"
                class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
              />
            </div>
          </div>

          <!-- Location & OWSO -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'ទីតាំងផ្តល់សេវា' : 'Service Location / OWSO' }}
            </label>
            <input
              v-model="formState.location"
              type="text"
              placeholder="e.g. Local Commune/Sangkat Administration Offices & OWSO"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs"
            />
          </div>

          <!-- Description -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'ការពិពណ៌នាសេវា' : 'Description' }}
            </label>
            <textarea
              v-model="formState.description"
              rows="3"
              placeholder="Describe what the service provides and who is eligible..."
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs resize-none"
            ></textarea>
          </div>

          <!-- Requirements (comma separated) -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ឯកសារតម្រូវ (បំបែកដោយសញ្ញាក្បៀស ,)</label>
            <textarea
              v-model="formState.requirementsText"
              rows="2"
              placeholder="e.g. National ID Card, Original Birth Certificate, Family Book"
              class="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium text-xs resize-none"
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
            @click="handleSaveService"
            class="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold font-khmer cursor-pointer shadow-xs transition-all"
          >
            {{ currentLanguage === 'kh' ? 'រក្សាទុកទិន្នន័យ' : 'Save Service' }}
          </button>
        </div>

      </div>

    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- 6. DELETE CONFIRMATION MODAL                                  -->
    <!-- ------------------------------------------------------------- -->
    <div
      v-if="isDeleteModalOpen && deletingService"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div class="bg-white rounded-3xl max-w-sm w-full p-5 shadow-2xl border border-slate-200/90 text-center space-y-3">
        <div class="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <Trash2 class="w-6 h-6" />
        </div>
        <h4 class="text-base font-black text-slate-900 font-khmer">
          {{ currentLanguage === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុប?' : 'Delete Government Service?' }}
        </h4>
        <p class="text-xs text-slate-500 font-khmer leading-relaxed">
          {{ currentLanguage === 'kh'
            ? `សេវា "${deletingService.titleKh || deletingService.title}" នឹងត្រូវដកចេញពីប្រព័ន្ធរដ្ឋបាល។`
            : `Are you sure you want to remove "${deletingService.title}" from the registry?`
          }}
        </p>

        <div class="flex items-center justify-center gap-2 pt-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false; deletingService = null"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-khmer cursor-pointer transition-colors"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-khmer cursor-pointer shadow-xs transition-colors"
          >
            {{ currentLanguage === 'kh' ? 'លុបចេញ' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
