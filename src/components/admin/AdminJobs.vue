<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Briefcase,
  Search,
  Plus,
  MapPin,
  Trash2,
  Building2,
  Eye,
  Edit2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  ExternalLink,
  DollarSign,
  Banknote
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getJobs } from '@/services/dataService'
import type { Job } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// LOAD AND PERSIST USER JOBS
// -------------------------------------------------------------
function loadJobs(): Job[] {
  const base = getJobs()
  try {
    const saved = localStorage.getItem('camlife_user_jobs')
    if (saved) {
      const parsed: Job[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {}
  return [...base]
}

const jobs = ref<Job[]>(loadJobs())

function persistUserJobs() {
  try {
    const customJobs = jobs.value.filter(j => j.id.startsWith('job-custom-'))
    localStorage.setItem('camlife_user_jobs', JSON.stringify(customJobs))
  } catch {}
}

// -------------------------------------------------------------
// FILTERS & SEARCH STATE
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedType = ref('All')
const selectedSalaryFilter = ref('All')

const categories = [
  'All',
  'IT',
  'Finance',
  'Healthcare',
  'Education',
  'Marketing',
  'Hospitality',
  'Engineering',
  'Other'
]

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalJobsCount = computed(() => jobs.value.length)
const fullTimeJobsCount = computed(() => jobs.value.filter(j => j.type === 'Full-time').length)
const highSalaryJobsCount = computed(() => jobs.value.filter(j => (j.salaryMin || 0) >= 1000 || (j.salaryMax || 0) >= 1000).length)
const companiesCount = computed(() => new Set(jobs.value.map(j => j.company.trim())).size)

// -------------------------------------------------------------
// FILTERED JOBS
// -------------------------------------------------------------
const filteredJobs = computed(() => {
  return jobs.value.filter(j => {
    // 1. Category Filter
    const matchCat = selectedCategory.value === 'All' || j.category === selectedCategory.value

    // 2. Type Filter
    const matchType = selectedType.value === 'All' || j.type === selectedType.value

    // 3. Salary Tier Filter
    let matchSalary = true
    if (selectedSalaryFilter.value === 'Under500') {
      matchSalary = (j.salaryMax || 0) <= 500
    } else if (selectedSalaryFilter.value === '500-1000') {
      matchSalary = ((j.salaryMin || 0) >= 500 && (j.salaryMin || 0) <= 1000) || ((j.salaryMax || 0) >= 500 && (j.salaryMax || 0) <= 1000)
    } else if (selectedSalaryFilter.value === '1000-2000') {
      matchSalary = ((j.salaryMin || 0) >= 1000 && (j.salaryMin || 0) <= 2000) || ((j.salaryMax || 0) >= 1000 && (j.salaryMax || 0) <= 2000)
    } else if (selectedSalaryFilter.value === 'Above2000') {
      matchSalary = (j.salaryMax || 0) >= 2000 || (j.salaryMin || 0) >= 2000
    }

    // 4. Search Query
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat && matchType && matchSalary

    const matchSearch =
      j.title.toLowerCase().includes(q) ||
      (j.titleKh && j.titleKh.toLowerCase().includes(q)) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q) ||
      j.category.toLowerCase().includes(q)

    return matchCat && matchType && matchSalary && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredJobs.value.length / itemsPerPage.value) || 1)

const paginatedJobs = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredJobs.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedCategory, selectedType, selectedSalaryFilter, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// CATEGORY & TYPE HELPERS
// -------------------------------------------------------------
function getCategoryLabel(cat: string): string {
  if (currentLanguage.value === 'kh') {
    switch (cat) {
      case 'All': return 'គ្រប់វិស័យ'
      case 'IT': return 'ព័ត៌មានវិទ្យា (IT)'
      case 'Finance': return 'ធនាគារ & ហិរញ្ញវត្ថុ'
      case 'Healthcare': return 'សុខាភិបាល'
      case 'Education': return 'ការអប់រំ & បណ្តុះបណ្តាល'
      case 'Marketing': return 'ទីផ្សារ & ប្រព័ន្ធផ្សព្វផ្សាយ'
      case 'Hospitality': return 'បដិសណ្ឋារកិច្ច & ទេសចរណ៍'
      case 'Engineering': return 'វិស្វកម្ម & សំណង់'
      case 'Other': return 'វិស័យផ្សេងៗ'
      default: return cat
    }
  }
  return cat
}

function getCategoryColor(cat: string) {
  switch (cat) {
    case 'IT':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200', iconBg: 'bg-blue-100 text-blue-600' }
    case 'Finance':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-100 text-emerald-600' }
    case 'Healthcare':
      return { bg: 'bg-rose-50 text-rose-700 border-rose-200', iconBg: 'bg-rose-100 text-rose-600' }
    case 'Education':
      return { bg: 'bg-amber-50 text-amber-700 border-amber-200', iconBg: 'bg-amber-100 text-amber-600' }
    case 'Marketing':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200', iconBg: 'bg-purple-100 text-purple-600' }
    case 'Hospitality':
      return { bg: 'bg-orange-50 text-orange-700 border-orange-200', iconBg: 'bg-orange-100 text-orange-600' }
    case 'Engineering':
      return { bg: 'bg-cyan-50 text-cyan-700 border-cyan-200', iconBg: 'bg-cyan-100 text-cyan-600' }
    default:
      return { bg: 'bg-slate-50 text-slate-700 border-slate-200', iconBg: 'bg-slate-100 text-slate-600' }
  }
}

function getTypeColor(type: string) {
  switch (type) {
    case 'Full-time':
      return 'bg-blue-50 text-blue-700 border-blue-200/90'
    case 'Part-time':
      return 'bg-amber-50 text-amber-700 border-amber-200/90'
    case 'Internship':
      return 'bg-purple-50 text-purple-700 border-purple-200/90'
    case 'Freelance':
      return 'bg-teal-50 text-teal-700 border-teal-200/90'
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200/90'
  }
}

function getTypeLabel(type: string) {
  if (currentLanguage.value === 'kh') {
    switch (type) {
      case 'Full-time': return 'ពេញម៉ោង'
      case 'Part-time': return 'ក្រៅម៉ោង'
      case 'Internship': return 'កម្មសិក្សា'
      case 'Freelance': return 'ឯករាជ្យ'
      default: return type
    }
  }
  return type
}

function formatSalaryDisplay(j: Job): string {
  if (j.salary) {
    return j.salary.replace('/month', '/mo')
  }
  if (j.salaryMin && j.salaryMax) {
    return `$${j.salaryMin.toLocaleString()} - $${j.salaryMax.toLocaleString()}/mo`
  }
  if (j.salaryMin) {
    return `$${j.salaryMin.toLocaleString()}+/mo`
  }
  return currentLanguage.value === 'kh' ? 'ចរចា' : 'Negotiable'
}

// -------------------------------------------------------------
// DETAIL MODAL (View Full Job Specifications)
// -------------------------------------------------------------
const selectedDetailJob = ref<Job | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(job: Job) {
  selectedDetailJob.value = job
  isDetailModalOpen.value = true
}

// -------------------------------------------------------------
// ADD / EDIT FORM MODAL STATE
// -------------------------------------------------------------
const isFormModalOpen = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingJobId = ref<string | null>(null)

const formState = reactive({
  title: '',
  titleKh: '',
  company: '',
  category: 'IT',
  type: 'Full-time' as Job['type'],
  salaryMin: 500,
  salaryMax: 1500,
  location: 'Phnom Penh',
  description: '',
  descriptionKh: '',
  requirementsText: '',
  benefitsText: '',
  applyUrl: ''
})

function openAddModal() {
  formMode.value = 'add'
  editingJobId.value = null
  formState.title = ''
  formState.titleKh = ''
  formState.company = ''
  formState.category = 'IT'
  formState.type = 'Full-time'
  formState.salaryMin = 500
  formState.salaryMax = 1500
  formState.location = 'Phnom Penh'
  formState.description = ''
  formState.descriptionKh = ''
  formState.requirementsText = '3+ years experience in relevant domain\nBachelor degree in related field\nGood communication skills'
  formState.benefitsText = 'Competitive monthly salary\nNSSF & health insurance\nAnnual leave & 13th month bonus'
  formState.applyUrl = '#'
  isFormModalOpen.value = true
}

function openEditModal(job: Job) {
  formMode.value = 'edit'
  editingJobId.value = job.id
  formState.title = job.title
  formState.titleKh = job.titleKh || job.title
  formState.company = job.company
  formState.category = job.category
  formState.type = job.type
  formState.salaryMin = job.salaryMin || 500
  formState.salaryMax = job.salaryMax || 1500
  formState.location = job.location
  formState.description = job.description || ''
  formState.descriptionKh = job.descriptionKh || ''
  formState.requirementsText = (job.requirements || []).join('\n')
  formState.benefitsText = (job.benefits || []).join('\n')
  formState.applyUrl = job.applyUrl || '#'
  isFormModalOpen.value = true
}

function saveJob() {
  if (!formState.title.trim() || !formState.company.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញមុខតំណែង និងឈ្មោះក្រុមហ៊ុន!' : 'Please enter job title and company!')
    return
  }

  const reqs = formState.requirementsText
    .split('\n')
    .map(r => r.trim())
    .filter(Boolean)

  const bens = formState.benefitsText
    .split('\n')
    .map(b => b.trim())
    .filter(Boolean)

  const salaryDisplay = `$${formState.salaryMin.toLocaleString()} - $${formState.salaryMax.toLocaleString()}/month`

  if (formMode.value === 'edit' && editingJobId.value) {
    const idx = jobs.value.findIndex(j => j.id === editingJobId.value)
    if (idx !== -1) {
      const existing = jobs.value[idx]
      jobs.value[idx] = {
        ...existing,
        title: formState.title.trim(),
        titleKh: formState.titleKh.trim() || formState.title.trim(),
        company: formState.company.trim(),
        category: formState.category,
        type: formState.type,
        salary: salaryDisplay,
        salaryMin: Number(formState.salaryMin),
        salaryMax: Number(formState.salaryMax),
        location: formState.location.trim(),
        description: formState.description.trim() || existing.description,
        descriptionKh: formState.descriptionKh.trim() || existing.descriptionKh,
        requirements: reqs.length ? reqs : existing.requirements,
        benefits: bens.length ? bens : existing.benefits,
        applyUrl: formState.applyUrl.trim() || '#'
      }
      persistUserJobs()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែព័ត៌មានការងារជោគជ័យ!' : 'Job listing updated successfully!')
    }
  } else {
    const newJobItem: Job = {
      id: 'job-custom-' + Date.now(),
      title: formState.title.trim(),
      titleKh: formState.titleKh.trim() || formState.title.trim(),
      company: formState.company.trim(),
      category: formState.category,
      type: formState.type,
      salary: salaryDisplay,
      salaryMin: Number(formState.salaryMin),
      salaryMax: Number(formState.salaryMax),
      location: formState.location.trim(),
      postedDate: new Date().toISOString().split('T')[0],
      description: formState.description.trim() || `Exciting career opportunity at ${formState.company.trim()}.`,
      descriptionKh: formState.descriptionKh.trim() || `ឱកាសការងារដ៏ល្អនៅក្រុមហ៊ុន ${formState.company.trim()}។`,
      requirements: reqs.length ? reqs : ['Experience in relevant domain', 'Strong teamwork & communication'],
      benefits: bens.length ? bens : ['Competitive salary package', 'Health insurance & annual bonus'],
      applyUrl: formState.applyUrl.trim() || '#'
    }
    jobs.value.unshift(newJobItem)
    persistUserJobs()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបង្កើតការងារថ្មីដោយជោគជ័យ!' : 'Job posted successfully!')
  }

  isFormModalOpen.value = false
}

// -------------------------------------------------------------
// DELETE MODAL (CONFIRMATION)
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingJob = ref<Job | null>(null)

function promptDelete(job: Job) {
  deletingJob.value = job
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingJob.value) {
    const id = deletingJob.value.id
    jobs.value = jobs.value.filter(j => j.id !== id)
    persistUserJobs()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបការងារដោយជោគជ័យ!' : 'Job listing deleted!')
  }
  isDeleteModalOpen.value = false
  deletingJob.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Jobs -->
      <div
        @click="selectedCategory = 'All'; selectedType = 'All'; selectedSalaryFilter = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'All' && selectedType === 'All' && selectedSalaryFilter === 'All'
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សរុបទាំងអស់' : 'All Roles' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalJobsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ឱកាសការងារសរុប' : 'Total Opportunities' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: Full-Time Positions -->
      <div
        @click="selectedType = 'Full-time'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedType === 'Full-time'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ពេញម៉ោង' : 'Full-time' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ fullTimeJobsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ការងារពេញម៉ោង' : 'Full-Time Positions' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: High Salary ($1,000+) -->
      <div
        @click="selectedSalaryFilter = 'Above2000'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedSalaryFilter === 'Above2000'
            ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20'
            : 'border-slate-200/90 hover:border-amber-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Banknote class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? '$១,០០០+' : 'High Tier' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ highSalaryJobsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ប្រាក់បៀវត្សខ្ពស់ ($1K+)' : 'High Salary Tier ($1K+)' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Hiring Companies -->
      <div
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 hover:border-purple-300 shadow-2xs transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Building2 class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ស្ថាប័ន' : 'Employers' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ companiesCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ក្រុមហ៊ុន & ស្ថាប័ន' : 'Hiring Organizations' }}
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកការងារ, ក្រុមហ៊ុន, ទីក្រុង...' : 'Search jobs, company, city...'"
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
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់វិស័យការងារ' : 'All Categories' }}</option>
            <option v-for="c in categories.filter(c => c !== 'All')" :key="c" :value="c">{{ getCategoryLabel(c) }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Job Type Dropdown -->
        <div class="relative">
          <select
            v-model="selectedType"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទកិច្ចសន្យា' : 'All Types' }}</option>
            <option value="Full-time">{{ currentLanguage === 'kh' ? 'ពេញម៉ោង (Full-time)' : 'Full-time' }}</option>
            <option value="Part-time">{{ currentLanguage === 'kh' ? 'ក្រៅម៉ោង (Part-time)' : 'Part-time' }}</option>
            <option value="Internship">{{ currentLanguage === 'kh' ? 'កម្មសិក្សា (Internship)' : 'Internship' }}</option>
            <option value="Freelance">{{ currentLanguage === 'kh' ? 'ឯករាជ្យ (Freelance)' : 'Freelance' }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Salary Tier Dropdown -->
        <div class="relative">
          <select
            v-model="selectedSalaryFilter"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'ប្រាក់បៀវត្ស (ទាំងអស់)' : 'All Salaries' }}</option>
            <option value="Under500">&lt; $500/mo</option>
            <option value="500-1000">$500 - $1,000/mo</option>
            <option value="1000-2000">$1,000 - $2,000/mo</option>
            <option value="Above2000">&gt; $2,000/mo</option>
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
          <span>{{ currentLanguage === 'kh' ? 'បង្កើតការងារថ្មី' : 'Post New Job' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. JOBS DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[28%]">{{ currentLanguage === 'kh' ? 'មុខតំណែង & វិស័យ' : 'Job Title & Sector' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[18%]">{{ currentLanguage === 'kh' ? 'ក្រុមហ៊ុន & ស្ថាប័ន' : 'Company' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[15%]">{{ currentLanguage === 'kh' ? 'ប្រាក់បៀវត្ស' : 'Salary' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'ទីតាំង' : 'Location' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[12%]">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Contract Type' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="j in paginatedJobs"
              :key="j.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Job Title & Category -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105', getCategoryColor(j.category).iconBg]">
                    <Briefcase class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                      :title="currentLanguage === 'kh' && j.titleKh ? j.titleKh : j.title"
                    >
                      {{ currentLanguage === 'kh' && j.titleKh ? j.titleKh : j.title }}
                    </span>

                    <div class="flex items-center gap-1.5 mt-0.5 min-w-0 truncate">
                      <span :class="['inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-semibold border shrink-0', getCategoryColor(j.category).bg]">
                        {{ getCategoryLabel(j.category) }}
                      </span>
                      <span class="inline-flex items-center gap-0.5 text-[9.5px] text-slate-400 font-medium truncate">
                        <Clock class="w-2.5 h-2.5 shrink-0 text-slate-400" />
                        <span class="truncate">{{ j.postedDate || 'Active' }}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Company & Employer -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="flex items-center gap-1.5 min-w-0" :title="j.company">
                  <div class="w-5 h-5 rounded-md bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                    <Building2 class="w-3 h-3" />
                  </div>
                  <span class="font-bold text-slate-800 truncate text-[11px]">
                    {{ j.company }}
                  </span>
                </div>
              </td>

              <!-- 3. Salary Range -->
              <td class="py-1.5 px-2.5 align-middle">
                <div :title="j.salary">
                  <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/90 font-mono shadow-2xs truncate max-w-full">
                    <DollarSign class="w-3 h-3 text-emerald-600 shrink-0" />
                    <span class="truncate">{{ formatSalaryDisplay(j) }}</span>
                  </span>
                </div>
              </td>

              <!-- 4. Location -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium max-w-full truncate" :title="j.location">
                  <MapPin class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate font-khmer">{{ j.location }}</span>
                </div>
              </td>

              <!-- 5. Contract Type -->
              <td class="py-1.5 px-2.5 align-middle">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border font-khmer shadow-2xs truncate max-w-full', getTypeColor(j.type)]">
                  <span class="truncate">{{ getTypeLabel(j.type) }}</span>
                </span>
              </td>

              <!-- 6. Executive Action Toolbar -->
              <td class="py-1.5 px-3 text-right align-middle">
                <div class="flex items-center justify-end gap-1.5">
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(j)"
                    class="w-7 h-7 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200/60 hover:border-blue-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(j)"
                    class="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/60 hover:border-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit Job'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(j)"
                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 hover:border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete Job'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredJobs.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញការងារដែលអ្នកស្វែងរកទេ' : 'No job listings found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try clearing your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedCategory = 'All'; selectedType = 'All'; selectedSalaryFilter = 'All'"
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
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredJobs.length)} នៃ ${filteredJobs.length} ការងារសរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredJobs.length)} of ${filteredJobs.length} jobs` 
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

    <!-- ------------------------------------------------------------- -->
    <!-- VIEW DETAIL MODAL -->
    <!-- ------------------------------------------------------------- -->
    <div
      v-if="isDetailModalOpen && selectedDetailJob"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-start justify-between bg-slate-50/70">
          <div class="flex items-start gap-3 min-w-0">
            <div :class="['w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs mt-0.5', getCategoryColor(selectedDetailJob.category).iconBg]">
              <Briefcase class="w-5 h-5" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2 flex-wrap">
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold border font-khmer', getCategoryColor(selectedDetailJob.category).bg]">
                  {{ getCategoryLabel(selectedDetailJob.category) }}
                </span>
                <span :class="['px-2 py-0.5 rounded-full text-[10px] font-bold border font-khmer', getTypeColor(selectedDetailJob.type)]">
                  {{ getTypeLabel(selectedDetailJob.type) }}
                </span>
              </div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 font-khmer mt-1 leading-snug">
                {{ currentLanguage === 'kh' && selectedDetailJob.titleKh ? selectedDetailJob.titleKh : selectedDetailJob.title }}
              </h3>
              <p class="text-xs font-semibold text-slate-500 mt-0.5 flex items-center gap-1">
                <Building2 class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ selectedDetailJob.company }}</span>
                <span>•</span>
                <MapPin class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ selectedDetailJob.location }}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 sm:p-5 space-y-4 max-h-[68vh] overflow-y-auto text-xs">
          
          <!-- Key Meta Highlights -->
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <span class="text-[10px] font-semibold text-slate-400 block font-khmer">{{ currentLanguage === 'kh' ? 'ប្រាក់បៀវត្ស' : 'Salary' }}</span>
              <span class="text-xs font-bold text-emerald-700 mt-0.5 block font-mono">
                {{ formatSalaryDisplay(selectedDetailJob) }}
              </span>
            </div>
            <div>
              <span class="text-[10px] font-semibold text-slate-400 block font-khmer">{{ currentLanguage === 'kh' ? 'ទីតាំងបំពេញការងារ' : 'Workplace' }}</span>
              <span class="text-xs font-bold text-slate-700 mt-0.5 block font-khmer">
                {{ selectedDetailJob.location }}
              </span>
            </div>
            <div>
              <span class="text-[10px] font-semibold text-slate-400 block font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទប្រកាស' : 'Date Posted' }}</span>
              <span class="text-xs font-bold text-slate-700 mt-0.5 block">
                {{ selectedDetailJob.postedDate || 'Recently' }}
              </span>
            </div>
          </div>

          <!-- Description -->
          <div>
            <h4 class="text-xs font-bold text-slate-900 font-khmer mb-1 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-blue-600" />
              <span>{{ currentLanguage === 'kh' ? 'ការពិពណ៌នាការងារ' : 'Job Description' }}</span>
            </h4>
            <p class="text-xs text-slate-600 font-khmer leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-200/60">
              {{ currentLanguage === 'kh' && selectedDetailJob.descriptionKh ? selectedDetailJob.descriptionKh : selectedDetailJob.description }}
            </p>
          </div>

          <!-- Requirements -->
          <div v-if="selectedDetailJob.requirements && selectedDetailJob.requirements.length > 0">
            <h4 class="text-xs font-bold text-slate-900 font-khmer mb-1.5 flex items-center gap-1.5">
              <CheckCircle2 class="w-3.5 h-3.5 text-blue-600" />
              <span>{{ currentLanguage === 'kh' ? 'លក្ខខណ្ឌតម្រូវការ' : 'Requirements & Qualifications' }}</span>
            </h4>
            <ul class="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-200/60">
              <li
                v-for="(req, i) in selectedDetailJob.requirements"
                :key="i"
                class="flex items-start gap-2 text-slate-700 text-xs font-khmer"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></div>
                <span class="leading-snug">{{ req }}</span>
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div v-if="selectedDetailJob.benefits && selectedDetailJob.benefits.length > 0">
            <h4 class="text-xs font-bold text-slate-900 font-khmer mb-1.5 flex items-center gap-1.5">
              <Zap class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ currentLanguage === 'kh' ? 'អត្ថប្រយោជន៍ និងការលើកទឹកចិត្ត' : 'Benefits & Perks' }}</span>
            </h4>
            <ul class="space-y-1.5 bg-slate-50/50 p-3 rounded-xl border border-slate-200/60">
              <li
                v-for="(ben, i) in selectedDetailJob.benefits"
                :key="i"
                class="flex items-start gap-2 text-slate-700 text-xs font-khmer"
              >
                <div class="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></div>
                <span class="leading-snug">{{ ben }}</span>
              </li>
            </ul>
          </div>

        </div>

        <!-- Modal Footer -->
        <div class="p-3 sm:p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50/70">
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-200/70 text-slate-700 text-xs font-bold font-khmer transition-all cursor-pointer shadow-2xs"
          >
            {{ currentLanguage === 'kh' ? 'បិទផ្ទាំង' : 'Close' }}
          </button>
          
          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="isDetailModalOpen = false; openEditModal(selectedDetailJob!)"
              class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white border border-emerald-200 text-xs font-bold font-khmer transition-all cursor-pointer shadow-2xs inline-flex items-center gap-1.5"
            >
              <Edit2 class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit' }}</span>
            </button>
            <a
              v-if="selectedDetailJob.applyUrl && selectedDetailJob.applyUrl !== '#'"
              :href="selectedDetailJob.applyUrl"
              target="_blank"
              class="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold font-khmer transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
            >
              <ExternalLink class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ទំព័រដាក់ពាក្យ' : 'Apply Link' }}</span>
            </a>
          </div>
        </div>

      </div>
    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- ADD / EDIT JOB MODAL -->
    <!-- ------------------------------------------------------------- -->
    <div
      v-if="isFormModalOpen"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      @click.self="isFormModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-auto">
        
        <!-- Modal Header -->
        <div class="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/70">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Briefcase class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-bold text-slate-900 font-khmer leading-none">
                {{ formMode === 'add'
                  ? (currentLanguage === 'kh' ? 'បង្កើតឱកាសការងារថ្មី' : 'Post New Career Opportunity')
                  : (currentLanguage === 'kh' ? 'កែសម្រួលព័ត៌មានការងារ' : 'Edit Job Listing')
                }}
              </h3>
              <p class="text-[11px] text-slate-400 font-khmer mt-0.5">
                {{ currentLanguage === 'kh' ? 'បំពេញព័ត៌មានលម្អិតអំពីតម្រូវការការងារ និងប្រាក់បៀវត្ស' : 'Fill in comprehensive job description and employment package.' }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="isFormModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Form Content -->
        <form @submit.prevent="saveJob" class="p-4 sm:p-5 space-y-3.5 max-h-[70vh] overflow-y-auto text-xs">
          
          <!-- Job Title (EN & KH) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'មុខតំណែង (English) *' : 'Job Title (English) *' }}
              </label>
              <input
                v-model="formState.title"
                type="text"
                required
                placeholder="e.g. Senior Frontend Developer"
                class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'មុខតំណែង (ភាសាខ្មែរ)' : 'Job Title (Khmer)' }}
              </label>
              <input
                v-model="formState.titleKh"
                type="text"
                placeholder="ឧ. អ្នកអភិវឌ្ឍន៍គេហទំព័រជាន់ខ្ពស់"
                class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs"
              />
            </div>
          </div>

          <!-- Company & Category -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ឈ្មោះក្រុមហ៊ុន / ស្ថាប័ន *' : 'Company / Organization *' }}
              </label>
              <input
                v-model="formState.company"
                type="text"
                required
                placeholder="e.g. Wing Bank (Cambodia) Plc"
                class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'វិស័យការងារ (Category)' : 'Job Category' }}
              </label>
              <select
                v-model="formState.category"
                class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 font-khmer shadow-2xs cursor-pointer"
              >
                <option v-for="c in categories.filter(c => c !== 'All')" :key="c" :value="c">
                  {{ getCategoryLabel(c) }}
                </option>
              </select>
            </div>
          </div>

          <!-- Contract Type & Location -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភេទកិច្ចសន្យា (Job Type)' : 'Employment Type' }}
              </label>
              <select
                v-model="formState.type"
                class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 font-khmer shadow-2xs cursor-pointer"
              >
                <option value="Full-time">{{ currentLanguage === 'kh' ? 'ពេញម៉ោង (Full-time)' : 'Full-time' }}</option>
                <option value="Part-time">{{ currentLanguage === 'kh' ? 'ក្រៅម៉ោង (Part-time)' : 'Part-time' }}</option>
                <option value="Internship">{{ currentLanguage === 'kh' ? 'កម្មសិក្សា (Internship)' : 'Internship' }}</option>
                <option value="Freelance">{{ currentLanguage === 'kh' ? 'ឯករាជ្យ (Freelance)' : 'Freelance' }}</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ទីតាំងបំពេញការងារ (Location)' : 'Workplace Location' }}
              </label>
              <input
                v-model="formState.location"
                type="text"
                placeholder="Phnom Penh"
                class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs"
              />
            </div>
          </div>

          <!-- Salary Min & Max -->
          <div class="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រាក់ខែអប្បបរមា ($ Min)' : 'Min Salary ($)' }}
              </label>
              <input
                v-model.number="formState.salaryMin"
                type="number"
                min="0"
                step="50"
                class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រាក់ខែអតិបរមា ($ Max)' : 'Max Salary ($)' }}
              </label>
              <input
                v-model.number="formState.salaryMax"
                type="number"
                min="0"
                step="50"
                class="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-mono font-bold focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
          </div>

          <!-- Job Description -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'ការពិពណ៌នាអំពីការងារ (Description)' : 'Job Description' }}
            </label>
            <textarea
              v-model="formState.description"
              rows="3"
              placeholder="Provide an overview of the role, team, and day-to-day responsibilities..."
              class="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs resize-none"
            ></textarea>
          </div>

          <!-- Requirements (One per line) -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'លក្ខខណ្ឌតម្រូវការ (មួយបន្ទាត់ = ១ ចំណុច)' : 'Requirements (One per line)' }}
            </label>
            <textarea
              v-model="formState.requirementsText"
              rows="3"
              placeholder="3+ years Vue.js experience&#10;Proficiency with REST APIs&#10;Degree in Computer Science"
              class="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs resize-none"
            ></textarea>
          </div>

          <!-- Benefits (One per line) -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'អត្ថប្រយោជន៍ និងការធានារ៉ាប់រង (មួយបន្ទាត់ = ១ ចំណុច)' : 'Benefits (One per line)' }}
            </label>
            <textarea
              v-model="formState.benefitsText"
              rows="2.5"
              placeholder="13th month bonus&#10;NSSF healthcare & dental&#10;Paid annual leave"
              class="w-full px-3 py-2 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs resize-none"
            ></textarea>
          </div>

          <!-- Apply URL -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'តំណភ្ជាប់សម្រាប់ដាក់ពាក្យ (Apply Link)' : 'Application URL or Email' }}
            </label>
            <input
              v-model="formState.applyUrl"
              type="text"
              placeholder="https://company.com/careers or hr@company.com"
              class="w-full px-3 py-1.5 bg-slate-50 focus:bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
            />
          </div>

          <!-- Modal Actions -->
          <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-200">
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold font-khmer transition-colors cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold font-khmer shadow-xs transition-all cursor-pointer"
            >
              {{ formMode === 'add'
                ? (currentLanguage === 'kh' ? 'ផ្សព្វផ្សាយការងារ' : 'Publish Job')
                : (currentLanguage === 'kh' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes')
              }}
            </button>
          </div>

        </form>

      </div>
    </div>

    <!-- ------------------------------------------------------------- -->
    <!-- DELETE CONFIRMATION MODAL -->
    <!-- ------------------------------------------------------------- -->
    <div
      v-if="isDeleteModalOpen && deletingJob"
      class="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 text-center animate-in fade-in zoom-in-95 duration-150">
        <div class="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Trash2 class="w-6 h-6" />
        </div>
        <h3 class="text-sm sm:text-base font-bold text-slate-900 font-khmer">
          {{ currentLanguage === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបការងារនេះ?' : 'Delete Job Listing?' }}
        </h3>
        <p class="text-xs text-slate-500 font-khmer mt-1 leading-relaxed">
          <span class="font-bold text-slate-800">{{ deletingJob.title }}</span>
          <br />
          <span class="text-[11px] text-slate-400">({{ deletingJob.company }})</span>
        </p>
        <div class="flex items-center justify-center gap-2 mt-4">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-xs font-bold font-khmer shadow-xs transition-all cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'យល់ព្រមលុប' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
