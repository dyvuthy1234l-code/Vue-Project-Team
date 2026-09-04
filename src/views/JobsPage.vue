<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  MapPin,
  Clock,
  ArrowRight,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  ChevronRight,
  ChevronDown,
  Check,
  Search,
  CheckCircle2,
  Building2,
  DollarSign,
  PhoneCall,
  FileText,
  Award,
  Sparkles,
  LayoutGrid,
  List,
  Flame,
  Zap,
  UploadCloud,
  Send,
  X,
  Calendar,
  PlusCircle
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { getJobs } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'
import { CAMBODIAN_PROVINCES } from '@/composables/useLocation'
import type { Job } from '@/types'

const { t, currentLanguage } = useLanguage()
const { isJobSaved, toggleSaveJob } = useSavedJobs()

usePageMeta({
  title: 'វេទិកាស្វែងរកការងារ និងជ្រើសរើសបុគ្គលិកជាតិ — CamLife Careers',
  description: 'ស្វែងរកការងារពេញម៉ោង ក្រៅម៉ោង និងកម្មសិក្សាពីស្ថាប័នរដ្ឋ និងក្រុមហ៊ុនឈានមុខទូទាំង ២៥ រាជធានី-ខេត្តនៅកម្ពុជា'
})

const allJobs = getJobs()

// Primary Search & Filters
const searchQuery = ref('')
const activeLocation = ref('All')
const activeCategory = ref('All')
const activeType = ref('All')
const activeWorkplace = ref('All') // 'All' | 'On-site' | 'Hybrid' | 'Remote'
const activeSalaryRange = ref('All') // 'All' | 'under-500' | '500-1000' | '1000-2000' | 'above-2000'
const activeCompany = ref('All')
const onlyUrgent = ref(false)
const onlyVerified = ref(false)
const sortBy = ref<'newest' | 'salary' | 'company'>('newest')
const viewMode = ref<'list' | 'grid'>('list')

// 25 Cambodian Provinces Popover Dropdown
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
  const found = CAMBODIAN_PROVINCES.find(
    p => p.name.toLowerCase() === activeLocation.value.toLowerCase() || p.id === activeLocation.value
  )
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
  if (!target.closest('.jobs-location-dropdown-container')) {
    isLocationDropdownOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
})

// Top Hiring Companies Ribbon
const topEmployers = computed(() => {
  const map = new Map<string, { company: string; logo: string; count: number }>()
  allJobs.forEach(j => {
    const existing = map.get(j.company)
    if (existing) {
      existing.count++
    } else {
      map.set(j.company, { company: j.company, logo: j.logo || '', count: 1 })
    }
  })
  return Array.from(map.values()).slice(0, 8)
})

// Categories metadata with localized labels
const categories = computed(() => {
  const meta = [
    { value: 'All', labelKh: 'គ្រប់វិស័យការងារ', labelEn: 'All Job Sectors', icon: '🏢' },
    { value: 'IT', labelKh: 'បច្ចេកវិទ្យា & IT', labelEn: 'IT & Software', icon: '💻' },
    { value: 'Finance', labelKh: 'ធនាគារ & ហិរញ្ញវត្ថុ', labelEn: 'Banking & Finance', icon: '💰' },
    { value: 'Healthcare', labelKh: 'សុខាភិបាល & ឱសថ', labelEn: 'Healthcare & Pharma', icon: '🏥' },
    { value: 'Education', labelKh: 'អប់រំ & បណ្តុះបណ្តាល', labelEn: 'Education & Training', icon: '🎓' },
    { value: 'Hospitality', labelKh: 'ទេសចរណ៍ & សណ្ឋាគារ', labelEn: 'Hospitality & Tourism', icon: '🏨' },
    { value: 'Marketing', labelKh: 'ទីផ្សារ & ប្រព័ន្ធផ្សព្វផ្សាយ', labelEn: 'Marketing & Media', icon: '📢' },
    { value: 'Engineering', labelKh: 'វិស្វកម្ម & សំណង់', labelEn: 'Engineering & Construction', icon: '🏗️' },
    { value: 'Other', labelKh: 'ផ្សេងៗ', labelEn: 'Other Careers', icon: '✨' }
  ]

  return meta.map(cat => {
    const count = cat.value === 'All'
      ? allJobs.length
      : allJobs.filter(j => j.category.toLowerCase() === cat.value.toLowerCase()).length
    return {
      ...cat,
      label: currentLanguage.value === 'kh' ? cat.labelKh : cat.labelEn,
      count
    }
  })
})

// Quick trending search keywords
const trendingKeywords = [
  'Vue.js',
  'React',
  'ABA Bank',
  'Wing Bank',
  'Smart Axiata',
  'គណនេយ្យ',
  'ទីផ្សារ',
  'Nurse ICU'
]

function applyKeyword(kw: string) {
  searchQuery.value = kw
  scrollToResults()
}

function selectEmployer(compName: string) {
  activeCompany.value = activeCompany.value === compName ? 'All' : compName
  scrollToResults()
}

function scrollToResults() {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('job-feed-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Check if a job is "Urgent" (e.g. IT & Healthcare or specific high-demand roles)
function isUrgentJob(job: Job): boolean {
  return job.category === 'IT' || job.category === 'Healthcare' || (job.salaryMax && job.salaryMax >= 1500) ? true : false
}

// Work model simulation based on category
function getWorkplaceModel(job: Job): { labelKh: string; labelEn: string; icon: string; bg: string } {
  if (job.category === 'IT') {
    return { labelKh: 'Hybrid (ពាក់កណ្តាលផ្ទះ)', labelEn: 'Hybrid', icon: '🌐', bg: 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300' }
  }
  if (job.type === 'Freelance') {
    return { labelKh: 'ធ្វើការពីផ្ទះ (Remote)', labelEn: 'Remote', icon: '🏠', bg: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300' }
  }
  return { labelKh: 'នៅការិយាល័យ (On-site)', labelEn: 'On-site', icon: '🏢', bg: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200' }
}

// Extracted skills chips for each job
function getJobSkills(job: Job): string[] {
  if (job.category === 'IT') return ['Vue.js / React', 'TypeScript', 'TailwindCSS', 'API / Cloud']
  if (job.category === 'Finance') return ['Financial Analysis', 'Core Banking', 'Risk Assessment', 'Excel']
  if (job.category === 'Healthcare') return ['ICU / Patient Care', 'Clinical License', 'Emergency', 'CPR']
  if (job.category === 'Education') return ['TESOL / CELTA', 'Curriculum Design', 'Classroom Mgmt']
  if (job.category === 'Marketing') return ['Digital Media', 'Content Strategy', 'Social Ads', 'Analytics']
  if (job.category === 'Hospitality') return ['Customer Service', 'F&B Standards', 'English Fluency']
  return ['Communication', 'Teamwork', 'Problem Solving']
}

// Deadlines: e.g. 15-30 days from posted date
function getJobDeadline(job: Job): string {
  if (job.postedDate) {
    const parts = job.postedDate.split('-')
    if (parts.length === 3) {
      const day = parseInt(parts[2], 10) + 20
      return `${Math.min(day, 30)} កញ្ញា 2025`
    }
  }
  return '30 កញ្ញា 2025'
}

const typeBadges: Record<string, { bg: string, text: string, border: string }> = {
  'Full-time': { bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800' },
  'Part-time': { bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-800' },
  'Internship': { bg: 'bg-purple-50 dark:bg-purple-950/40', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800' },
  'Freelance': { bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800' }
}

const filteredJobs = computed(() => {
  let result = [...allJobs]

  // Location filter matching against 25 provinces
  if (activeLocation.value !== 'All') {
    const targetProvince = CAMBODIAN_PROVINCES.find(
      p => p.name.toLowerCase() === activeLocation.value.toLowerCase() || p.id === activeLocation.value
    )
    const engName = (targetProvince ? targetProvince.name : activeLocation.value).toLowerCase()
    const khName = targetProvince
      ? targetProvince.nameKh.replace('ខេត្ត', '').replace('រាជធានី', '').trim().toLowerCase()
      : ''

    result = result.filter(j => {
      const loc = (j.location || '').toLowerCase()
      if (engName.includes('sihanouk') && loc.includes('sihanouk')) return true
      return (
        loc.includes(engName) ||
        (khName && loc.includes(khName))
      )
    })
  }

  // Company filter
  if (activeCompany.value !== 'All') {
    result = result.filter(j => j.company.toLowerCase() === activeCompany.value.toLowerCase())
  }

  // Category filter
  if (activeCategory.value !== 'All') {
    result = result.filter(j => j.category.toLowerCase() === activeCategory.value.toLowerCase())
  }

  // Job Type filter
  if (activeType.value !== 'All') {
    result = result.filter(j => j.type.toLowerCase() === activeType.value.toLowerCase())
  }

  // Workplace Model filter
  if (activeWorkplace.value !== 'All') {
    result = result.filter(j => {
      const wm = getWorkplaceModel(j).labelEn
      return wm.toLowerCase().includes(activeWorkplace.value.toLowerCase())
    })
  }

  // Salary Range filter
  if (activeSalaryRange.value === 'under-500') {
    result = result.filter(j => (j.salaryMax && j.salaryMax < 500) || (j.salaryMin && j.salaryMin < 500))
  } else if (activeSalaryRange.value === '500-1000') {
    result = result.filter(j =>
      ((j.salaryMin && j.salaryMin >= 500 && j.salaryMin <= 1000) ||
       (j.salaryMax && j.salaryMax >= 500 && j.salaryMax <= 1000))
    )
  } else if (activeSalaryRange.value === '1000-2000') {
    result = result.filter(j =>
      ((j.salaryMin && j.salaryMin >= 1000 && j.salaryMin <= 2000) ||
       (j.salaryMax && j.salaryMax >= 1000 && j.salaryMax <= 2200))
    )
  } else if (activeSalaryRange.value === 'above-2000') {
    result = result.filter(j => (j.salaryMax && j.salaryMax >= 2000))
  }

  // Urgent filter
  if (onlyUrgent.value) {
    result = result.filter(j => isUrgentJob(j))
  }

  // Search query
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(j =>
      j.title.toLowerCase().includes(query) ||
      j.company.toLowerCase().includes(query) ||
      j.description.toLowerCase().includes(query) ||
      j.category.toLowerCase().includes(query) ||
      j.location.toLowerCase().includes(query) ||
      (j.requirements && j.requirements.some(r => r.toLowerCase().includes(query)))
    )
  }

  // Sort
  if (sortBy.value === 'newest') {
    result.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
  } else if (sortBy.value === 'salary') {
    result.sort((a, b) => (b.salaryMax || b.salaryMin || 0) - (a.salaryMax || a.salaryMin || 0))
  } else if (sortBy.value === 'company') {
    result.sort((a, b) => a.company.localeCompare(b.company))
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedJobs,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredJobs, 8)

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' ||
    activeLocation.value !== 'All' ||
    activeCategory.value !== 'All' ||
    activeType.value !== 'All' ||
    activeWorkplace.value !== 'All' ||
    activeSalaryRange.value !== 'All' ||
    activeCompany.value !== 'All' ||
    onlyUrgent.value ||
    onlyVerified.value
  )
})

function resetFilters() {
  searchQuery.value = ''
  activeLocation.value = 'All'
  activeCategory.value = 'All'
  activeType.value = 'All'
  activeWorkplace.value = 'All'
  activeSalaryRange.value = 'All'
  activeCompany.value = 'All'
  onlyUrgent.value = false
  onlyVerified.value = false
  sortBy.value = 'newest'
}

// ==========================================
// QUICK APPLY MODAL LOGIC (Real Job Application)
// ==========================================
const isApplyModalOpen = ref(false)
const selectedJobForApply = ref<Job | null>(null)
const applyForm = ref({
  fullName: '',
  phone: '',
  telegram: '',
  email: '',
  experience: '1-3',
  coverNote: '',
  cvFileName: ''
})
const isApplySubmitted = ref(false)

function openApplyModal(job: Job) {
  selectedJobForApply.value = job
  isApplySubmitted.value = false
  isApplyModalOpen.value = true
}

function closeApplyModal() {
  isApplyModalOpen.value = false
  selectedJobForApply.value = null
  isApplySubmitted.value = false
  applyForm.value = {
    fullName: '',
    phone: '',
    telegram: '',
    email: '',
    experience: '1-3',
    coverNote: '',
    cvFileName: ''
  }
}

function handleCvFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    applyForm.value.cvFileName = target.files[0].name
  }
}

function submitJobApplication() {
  if (!applyForm.value.fullName || !applyForm.value.phone) return
  isApplySubmitted.value = true
}

// ==========================================
// POST A JOB MODAL (For Employers / HR)
// ==========================================
const isPostJobModalOpen = ref(false)
const postJobForm = ref({
  companyName: '',
  jobTitle: '',
  location: 'Phnom Penh',
  category: 'IT',
  salary: '$800 - $1,500',
  hrContact: ''
})
const isPostJobSubmitted = ref(false)

function submitPostJob() {
  if (!postJobForm.value.companyName || !postJobForm.value.jobTitle) return
  isPostJobSubmitted.value = true
}
</script>

<template>
  <div class="jobs-portal-page min-h-screen pb-20 text-[#0A2540] dark:text-white font-khmer bg-slate-50/50 dark:bg-slate-950">
    
    <!-- Ambient Top Gradient Glow -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-transparent" />

    <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-8">
      
      <!-- ============================================================ -->
      <!-- 1. FLAGSHIP REAL-PORTAL HERO & DUAL SEARCH CONSOLE           -->
      <!-- ============================================================ -->
      <section class="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/20 border border-blue-900/30 bg-[#061838] text-white">
        <!-- Background Imagery with Royal Overlay -->
        <div class="absolute inset-0 z-0 pointer-events-none">
          <img
            src="/images/pillars/jobs.jpg"
            alt="Cambodia Professional Hiring Portal"
            class="w-full h-full object-cover object-center lg:object-right opacity-25 filter contrast-125 brightness-95"
            @error="($event.target as HTMLImageElement).src = '/images/pillars/government-hero.jpg'"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-[#051532] via-[#051532]/95 via-55% to-[#051532]/50" />
        </div>

        <div class="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div class="pointer-events-none absolute right-10 -bottom-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-3xl" />

        <div class="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
          
          <!-- Top Row: Breadcrumb & Recruiter Post-a-Job CTA Button -->
          <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
            <nav class="flex items-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
              <router-link to="/" class="inline-flex items-center gap-1.5 hover:text-white transition-colors">
                <span>🏠 {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}</span>
              </router-link>
              <ChevronRight class="w-3.5 h-3.5 text-white/40" />
              <span class="text-white font-bold tracking-wide">
                {{ currentLanguage === 'kh' ? 'វេទិកាការងារ & ជ្រើសរើសបុគ្គលិកជាតិ' : 'National Job & Career Portal' }}
              </span>
            </nav>

            <!-- For Employers / Recruiter CTA (Makes portal 100% Real!) -->
            <button
              @click="isPostJobModalOpen = true"
              class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black transition-all shadow-md cursor-pointer select-none"
              type="button"
            >
              <PlusCircle class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'សម្រាប់និយោជក: ចុះផ្សាយការងារ' : 'For Employers: Post a Job' }}</span>
            </button>
          </div>

          <!-- Hero Headline & Subtitle -->
          <div class="max-w-3xl space-y-3">
            <div class="flex flex-wrap items-center gap-2.5">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-black">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{{ currentLanguage === 'kh' ? 'ឱកាសការងារថ្មីៗប្រចាំថ្ងៃ' : 'Fresh Vacancies Daily' }}</span>
              </span>
              <span class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-bold backdrop-blur-xs">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
                <span>{{ currentLanguage === 'kh' ? 'និយោជកស្របច្បាប់ ១០០%' : '100% Verified Employers' }}</span>
              </span>
            </div>

            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-indigo-200">
                {{ currentLanguage === 'kh' ? 'ស្វែងរកការងារ & អាជីពពិតនៅកម្ពុជា' : 'Find Real Jobs & Careers in Cambodia' }}
              </span>
            </h1>

            <p class="text-xs sm:text-sm font-bold text-blue-200/90 leading-relaxed max-w-2xl">
              {{ currentLanguage === 'kh'
                ? 'ស្វែងរកការងារដែលស័ក្តិសមនឹងជំនាញ និងប្រាក់បៀវត្សរ៍របស់អ្នក ពីស្ថាប័នរដ្ឋ និងក្រុមហ៊ុនឯកជនឈានមុខទូទាំង ២៥ រាជធានី-ខេត្ត ដោយមានការគាំពារសិទ្ធិការងារ និង ប.ស.ស។'
                : 'Connect with verified employers, explore top salary packages, and apply directly to career opportunities across all 25 provinces in Cambodia.'
              }}
            </p>
          </div>

          <!-- DUAL-INPUT RECRUITMENT SEARCH BAR (Standard in Real Job Sites) -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-2xl border border-white/20">
            <div class="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800">
              
              <!-- Input 1: Job title, Skill, or Company -->
              <div class="flex-1 flex items-center px-3.5 py-2.5 sm:py-3 gap-3 min-w-0">
                <Search class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                <input
                  v-model="searchQuery"
                  type="text"
                  @keyup.enter="scrollToResults"
                  :placeholder="currentLanguage === 'kh' ? 'មុខតំណែង, ជំនាញ ឬក្រុមហ៊ុន (ឧ. Frontend, ABA, គណនេយ្យ...)' : 'Job title, skill, or company...'"
                  class="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden font-khmer"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''; scrollToResults()"
                  type="button"
                  class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  title="Clear"
                >
                  <X class="w-4 h-4" />
                </button>
              </div>

              <!-- Input 2: 25 Cambodian Provinces Popover Selector -->
              <div class="relative jobs-location-dropdown-container px-3.5 py-2.5 sm:py-3 lg:w-72 shrink-0">
                <button
                  type="button"
                  @click="isLocationDropdownOpen = !isLocationDropdownOpen"
                  class="w-full flex items-center justify-between gap-2 text-xs sm:text-sm font-extrabold text-slate-800 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer select-none"
                >
                  <div class="flex items-center gap-2 min-w-0">
                    <MapPin class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span class="truncate text-left">{{ selectedProvinceLabel }}</span>
                  </div>
                  <ChevronDown class="w-4 h-4 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isLocationDropdownOpen }" />
                </button>

                <!-- Popover Panel -->
                <transition
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-100 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <div
                    v-if="isLocationDropdownOpen"
                    class="absolute left-0 lg:right-0 lg:left-auto top-full mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden"
                  >
                    <div class="p-2.5 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                      <div class="relative">
                        <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        <input
                          v-model="provinceSearchQuery"
                          type="text"
                          :placeholder="currentLanguage === 'kh' ? 'ស្វែងរក ២៥ ខេត្ត-ក្រុង...' : 'Search 25 provinces...'"
                          class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-khmer"
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
                </transition>
              </div>

              <!-- Search CTA Button -->
              <div class="p-1.5 shrink-0">
                <button
                  @click="scrollToResults"
                  type="button"
                  class="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-md transition-all cursor-pointer select-none"
                >
                  <Search class="w-4 h-4" />
                  <span>{{ currentLanguage === 'kh' ? 'ស្វែងរកការងារ' : 'Find Jobs' }}</span>
                </button>
              </div>

            </div>
          </div>

          <!-- Trending Keywords (Like BongThom & CamHR) -->
          <div class="flex flex-wrap items-center gap-2 text-xs">
            <span class="font-bold text-blue-200 flex items-center gap-1 select-none">
              <Sparkles class="w-3.5 h-3.5 text-amber-300" />
              <span>{{ currentLanguage === 'kh' ? 'ពេញនិយម:' : 'Trending:' }}</span>
            </span>
            <button
              v-for="kw in trendingKeywords"
              :key="kw"
              @click="applyKeyword(kw)"
              type="button"
              class="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 text-[11px] font-bold border border-white/10 transition-all cursor-pointer"
            >
              {{ kw }}
            </button>
          </div>

        </div>
      </section>

      <!-- ============================================================ -->
      <!-- 2. TOP HIRING COMPANIES IN CAMBODIA RIBBON                   -->
      <!-- ============================================================ -->
      <section class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-3">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Building2 class="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 class="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ស្ថាប័ន និងក្រុមហ៊ុនកំពុងជ្រើសរើសបុគ្គលិកច្រើន' : 'Top Hiring Companies in Cambodia' }}
            </h3>
          </div>
          <span v-if="activeCompany !== 'All'" class="text-xs font-bold text-blue-600 dark:text-blue-400 cursor-pointer" @click="activeCompany = 'All'">
            {{ currentLanguage === 'kh' ? 'បង្ហាញទាំងអស់ ✕' : 'Clear Filter ✕' }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          <button
            v-for="emp in topEmployers"
            :key="emp.company"
            @click="selectEmployer(emp.company)"
            type="button"
            :class="[
              'p-2.5 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-1.5',
              activeCompany === emp.company
                ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                : 'bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/60 dark:hover:bg-slate-800 border-slate-200/80 dark:border-slate-700'
            ]"
          >
            <div class="w-9 h-9 rounded-xl bg-white dark:bg-slate-700 shadow-xs flex items-center justify-center overflow-hidden shrink-0">
              <img v-if="emp.logo" :src="emp.logo" :alt="emp.company" class="w-full h-full object-cover" />
              <span v-else class="font-black text-xs text-[#0D47A1] dark:text-blue-300">{{ emp.company.charAt(0) }}</span>
            </div>
            <p class="text-[11px] font-bold text-slate-800 dark:text-slate-100 truncate w-full">
              {{ emp.company.split(' ')[0] }}
            </p>
            <span class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {{ emp.count }} {{ currentLanguage === 'kh' ? 'កន្លែង' : 'jobs' }}
            </span>
          </button>
        </div>
      </section>

      <!-- ============================================================ -->
      <!-- 3. REAL JOB PORTAL 2-COLUMN LAYOUT (SIDEBAR + JOB FEED)      -->
      <!-- ============================================================ -->
      <div id="job-feed-section" class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        <!-- ========================================================== -->
        <!-- LEFT COLUMN: FACETED RECRUITMENT FILTER SIDEBAR            -->
        <!-- ========================================================== -->
        <aside class="lg:col-span-1 space-y-6">
          <div class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-xs space-y-6 sticky top-24">
            
            <!-- Sidebar Header -->
            <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 class="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Flame class="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>{{ currentLanguage === 'kh' ? 'តម្រងស្វែងរកការងារ' : 'Job Filters' }}</span>
              </h3>
              <button
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                type="button"
              >
                {{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset All' }}
              </button>
            </div>

            <!-- Filter: Urgent Hiring Only -->
            <div class="space-y-2">
              <label class="flex items-center justify-between p-2.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 cursor-pointer">
                <span class="flex items-center gap-2 text-xs font-black text-amber-900 dark:text-amber-200">
                  <Flame class="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{{ currentLanguage === 'kh' ? 'រើសបន្ទាន់ (Urgent Only)' : 'Urgent Hiring' }}</span>
                </span>
                <input
                  v-model="onlyUrgent"
                  type="checkbox"
                  class="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                />
              </label>
            </div>

            <!-- Filter: Workplace Model (On-site / Hybrid / Remote) -->
            <div class="space-y-2.5">
              <h4 class="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {{ currentLanguage === 'kh' ? 'របៀបបំពេញការងារ' : 'Workplace Model' }}
              </h4>
              <div class="space-y-1 text-xs">
                <button
                  v-for="wm in [
                    { id: 'All', labelKh: 'គ្រប់ប្រភេទ', labelEn: 'All Models' },
                    { id: 'On-site', labelKh: '🏢 នៅការិយាល័យ (On-site)', labelEn: 'On-site' },
                    { id: 'Hybrid', labelKh: '🌐 Hybrid (ពាក់កណ្តាល)', labelEn: 'Hybrid' },
                    { id: 'Remote', labelKh: '🏠 ពីចម្ងាយ (Remote)', labelEn: 'Remote' }
                  ]"
                  :key="wm.id"
                  @click="activeWorkplace = wm.id; scrollToResults()"
                  type="button"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer',
                    activeWorkplace === wm.id
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  ]"
                >
                  <span>{{ currentLanguage === 'kh' ? wm.labelKh : wm.labelEn }}</span>
                  <Check v-if="activeWorkplace === wm.id" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
                </button>
              </div>
            </div>

            <!-- Filter: Salary Range -->
            <div class="space-y-2.5">
              <h4 class="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {{ currentLanguage === 'kh' ? 'កម្រិតប្រាក់បៀវត្សរ៍' : 'Salary Range' }}
              </h4>
              <div class="space-y-1 text-xs">
                <button
                  v-for="sal in [
                    { id: 'All', labelKh: 'គ្រប់កម្រិតប្រាក់ខែ', labelEn: 'Any Salary' },
                    { id: 'under-500', labelKh: 'ក្រោម $500 / ខែ', labelEn: 'Under $500/mo' },
                    { id: '500-1000', labelKh: '$500 - $1,000 / ខែ', labelEn: '$500 - $1,000/mo' },
                    { id: '1000-2000', labelKh: '$1,000 - $2,000 / ខែ', labelEn: '$1,000 - $2,000/mo' },
                    { id: 'above-2000', labelKh: '$2,000+ / ខែ (ប្រាក់ខែខ្ពស់)', labelEn: '$2,000+/mo' }
                  ]"
                  :key="sal.id"
                  @click="activeSalaryRange = sal.id; scrollToResults()"
                  type="button"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer',
                    activeSalaryRange === sal.id
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  ]"
                >
                  <span>{{ currentLanguage === 'kh' ? sal.labelKh : sal.labelEn }}</span>
                  <Check v-if="activeSalaryRange === sal.id" class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                </button>
              </div>
            </div>

            <!-- Filter: Employment Type -->
            <div class="space-y-2.5">
              <h4 class="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {{ currentLanguage === 'kh' ? 'ប្រភេទការងារ' : 'Job Type' }}
              </h4>
              <div class="space-y-1 text-xs">
                <button
                  v-for="jt in [
                    { id: 'All', labelKh: 'គ្រប់ប្រភេទ', labelEn: 'All Types' },
                    { id: 'Full-time', labelKh: '🟢 ពេញម៉ោង (Full-time)', labelEn: 'Full-time' },
                    { id: 'Part-time', labelKh: '🔵 ក្រៅម៉ោង (Part-time)', labelEn: 'Part-time' },
                    { id: 'Internship', labelKh: '🟣 កម្មសិក្សា (Internship)', labelEn: 'Internship' },
                    { id: 'Freelance', labelKh: '🟡 Freelance / Project', labelEn: 'Freelance' }
                  ]"
                  :key="jt.id"
                  @click="activeType = jt.id; scrollToResults()"
                  type="button"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer',
                    activeType === jt.id
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  ]"
                >
                  <span>{{ currentLanguage === 'kh' ? jt.labelKh : jt.labelEn }}</span>
                  <Check v-if="activeType === jt.id" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
                </button>
              </div>
            </div>

            <!-- Filter: Industry / Category -->
            <div class="space-y-2.5">
              <h4 class="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {{ currentLanguage === 'kh' ? 'វិស័យការងារ' : 'Industry Sector' }}
              </h4>
              <div class="space-y-1 text-xs max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                <button
                  v-for="cat in categories"
                  :key="cat.value"
                  @click="activeCategory = cat.value; scrollToResults()"
                  type="button"
                  :class="[
                    'w-full flex items-center justify-between px-3 py-2 rounded-xl text-left transition-colors cursor-pointer',
                    activeCategory === cat.value
                      ? 'bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 font-black'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium'
                  ]"
                >
                  <span class="truncate">{{ cat.icon }} {{ cat.label }}</span>
                  <span class="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {{ cat.count }}
                  </span>
                </button>
              </div>
            </div>

          </div>
        </aside>

        <!-- ========================================================== -->
        <!-- RIGHT COLUMN: RESULTS FEED & CONTROLS                     -->
        <!-- ========================================================== -->
        <main class="lg:col-span-3 space-y-5">
          
          <!-- Results Feed Toolbar -->
          <div class="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-3">
            
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <!-- Left: Job Count -->
              <div>
                <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <span>{{ currentLanguage === 'kh' ? 'ឱកាសការងារកំពុងជ្រើសរើស' : 'Available Job Openings' }}</span>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 font-black border border-blue-200 dark:border-blue-800">
                    {{ filteredJobs.length }}
                  </span>
                </h2>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ currentLanguage === 'kh' ? `បង្ហាញការងារក្នុង ${selectedProvinceLabel}` : `Openings in ${selectedProvinceLabel}` }}
                </p>
              </div>

              <!-- Right: View Switcher & Sort -->
              <div class="flex items-center gap-2 self-end sm:self-auto">
                <!-- View Mode (List vs Grid) -->
                <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700">
                  <button
                    @click="viewMode = 'list'"
                    :class="[
                      'p-1.5 rounded-lg transition-all cursor-pointer',
                      viewMode === 'list'
                        ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-white shadow-2xs font-bold'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    ]"
                    title="List View (LinkedIn / Indeed Style)"
                    type="button"
                  >
                    <List class="w-4 h-4" />
                  </button>
                  <button
                    @click="viewMode = 'grid'"
                    :class="[
                      'p-1.5 rounded-lg transition-all cursor-pointer',
                      viewMode === 'grid'
                        ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-white shadow-2xs font-bold'
                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    ]"
                    title="Grid View"
                    type="button"
                  >
                    <LayoutGrid class="w-4 h-4" />
                  </button>
                </div>

                <!-- Sort Dropdown -->
                <div class="relative">
                  <select
                    v-model="sortBy"
                    class="bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer shadow-2xs pr-7 appearance-none"
                  >
                    <option value="newest">{{ currentLanguage === 'kh' ? '🆕 ថ្មីៗបំផុត' : 'Newest' }}</option>
                    <option value="salary">{{ currentLanguage === 'kh' ? '💰 ប្រាក់ខែខ្ពស់បំផុត' : 'Highest Salary' }}</option>
                    <option value="company">{{ currentLanguage === 'kh' ? '🏢 ក្រុមហ៊ុន (A-Z)' : 'Company A-Z' }}</option>
                  </select>
                  <ChevronDown class="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <!-- Active Filters Chip Bar (Removable) -->
            <div v-if="hasActiveFilters" class="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span class="text-[11px] font-bold text-slate-400 mr-1 select-none">
                {{ currentLanguage === 'kh' ? 'តម្រងសកម្ម:' : 'Active Filters:' }}
              </span>

              <span v-if="searchQuery" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-800">
                <span>"{{ searchQuery }}"</span>
                <button @click="searchQuery = ''" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <span v-if="activeLocation !== 'All'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <span>📍 {{ selectedProvinceLabel }}</span>
                <button @click="activeLocation = 'All'" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <span v-if="activeCategory !== 'All'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <span>{{ activeCategory }}</span>
                <button @click="activeCategory = 'All'" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <span v-if="activeType !== 'All'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <span>{{ activeType }}</span>
                <button @click="activeType = 'All'" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <span v-if="activeWorkplace !== 'All'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold">
                <span>{{ activeWorkplace }}</span>
                <button @click="activeWorkplace = 'All'" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <span v-if="activeSalaryRange !== 'All'" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold">
                <span>{{ activeSalaryRange }}</span>
                <button @click="activeSalaryRange = 'All'" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <span v-if="onlyUrgent" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 font-bold">
                <span>🔥 Urgent</span>
                <button @click="onlyUrgent = false" class="hover:text-rose-500 cursor-pointer">✕</button>
              </span>

              <button
                @click="resetFilters"
                class="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 ml-1 cursor-pointer"
                type="button"
              >
                {{ currentLanguage === 'kh' ? 'សម្អាតទាំងអស់' : 'Clear All' }}
              </button>
            </div>

          </div>

          <!-- ======================================================== -->
          <!-- JOBS FEED (LIST VIEW - PRO REAL PORTAL STYLE)           -->
          <!-- ======================================================== -->
          <div v-if="paginatedJobs.length > 0 && viewMode === 'list'" class="space-y-4">
            
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 relative"
            >
              <div class="flex flex-col sm:flex-row items-start justify-between gap-5">
                
                <!-- Left: Company Logo Avatar & Job Summary -->
                <div class="flex items-start gap-4 min-w-0 flex-1">
                  <!-- Company Logo -->
                  <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 border border-blue-200/80 dark:border-slate-700 text-[#0D47A1] dark:text-blue-300 flex items-center justify-center font-black text-xl shadow-xs shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                    <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" loading="lazy" />
                    <span v-else>{{ job.company.charAt(0) }}</span>
                  </div>

                  <div class="space-y-2 min-w-0 flex-1">
                    <!-- Badges Row: Urgent, Featured, Type, Category -->
                    <div class="flex flex-wrap items-center gap-1.5">
                      <span
                        v-if="isUrgentJob(job)"
                        class="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 font-black"
                      >
                        <Flame class="w-3 h-3 text-rose-500 fill-rose-500" />
                        <span>{{ currentLanguage === 'kh' ? 'រើសបន្ទាន់' : 'Urgent' }}</span>
                      </span>

                      <span
                        :class="[
                          'text-[10px] px-2.5 py-0.5 rounded-full border font-bold',
                          typeBadges[job.type]?.bg || 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
                          typeBadges[job.type]?.text || 'text-slate-700 dark:text-slate-200',
                          typeBadges[job.type]?.border || 'border-slate-200 dark:border-slate-600'
                        ]"
                      >
                        {{ job.type }}
                      </span>

                      <span :class="['text-[10px] px-2.5 py-0.5 rounded-full font-bold', getWorkplaceModel(job).bg]">
                        {{ currentLanguage === 'kh' ? getWorkplaceModel(job).labelKh : getWorkplaceModel(job).labelEn }}
                      </span>

                      <span class="text-[10px] px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full font-medium">
                        {{ job.category }}
                      </span>
                    </div>

                    <!-- Job Title & Company -->
                    <div>
                      <router-link :to="'/jobs/' + job.id" class="inline-block">
                        <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                          {{ job.title }}
                        </h3>
                      </router-link>

                      <div class="flex flex-wrap items-center gap-2 mt-1">
                        <p class="text-xs font-bold text-slate-700 dark:text-slate-300">
                          {{ job.company }}
                        </p>
                        <span class="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{{ currentLanguage === 'kh' ? 'និយោជកផ្ទៀងផ្ទាត់' : 'Verified Employer' }}</span>
                        </span>
                      </div>
                    </div>

                    <!-- Job Description Preview -->
                    <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {{ job.description }}
                    </p>

                    <!-- Skill Chips -->
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                      <span
                        v-for="sk in getJobSkills(job)"
                        :key="sk"
                        class="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60"
                      >
                        {{ sk }}
                      </span>
                    </div>

                    <!-- Location, Deadline & Posted Date Meta -->
                    <div class="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <span class="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                        <MapPin class="w-3.5 h-3.5 text-rose-500" />
                        <span>{{ job.location }}</span>
                      </span>

                      <span class="flex items-center gap-1 text-slate-400">
                        <Clock class="w-3.5 h-3.5" />
                        <span>{{ currentLanguage === 'kh' ? 'ចុះផ្សាយ:' : 'Posted:' }} {{ job.postedDate }}</span>
                      </span>

                      <span class="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
                        <Calendar class="w-3.5 h-3.5" />
                        <span>{{ currentLanguage === 'kh' ? 'ផុតកំណត់:' : 'Deadline:' }} {{ getJobDeadline(job) }}</span>
                      </span>
                    </div>
                  </div>

                </div>

                <!-- Right: Salary Pill, Quick Apply Button & Bookmark -->
                <div class="w-full sm:w-auto flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                  
                  <!-- Salary Badge (Prominent Emerald) -->
                  <span class="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-black text-xs sm:text-sm border border-emerald-200/80 dark:border-emerald-800">
                    <DollarSign class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{{ job.salary }}</span>
                  </span>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-2">
                    <!-- Bookmark -->
                    <button
                      @click.stop="toggleSaveJob(job.id)"
                      :class="[
                        'p-2.5 rounded-xl transition-all cursor-pointer',
                        isJobSaved(job.id)
                          ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                          : 'text-slate-400 hover:text-[#0D47A1] hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-700'
                      ]"
                      :title="isJobSaved(job.id) ? (currentLanguage === 'kh' ? 'បានរក្សាទុក' : 'Saved') : (currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save')"
                      type="button"
                    >
                      <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1] dark:text-blue-400" />
                      <Bookmark v-else class="w-4 h-4" />
                    </button>

                    <!-- Quick Apply CTA (Triggers Modal) -->
                    <button
                      @click="openApplyModal(job)"
                      type="button"
                      class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003366] hover:bg-[#0A2E6E] text-white rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer"
                    >
                      <Zap class="w-3.5 h-3.5 text-amber-300" />
                      <span>{{ currentLanguage === 'kh' ? 'ដាក់ពាក្យរហ័ស' : 'Easy Apply' }}</span>
                    </button>

                    <!-- Details Link -->
                    <router-link
                      :to="'/jobs/' + job.id"
                      class="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      title="View Full Details"
                    >
                      <ArrowRight class="w-4 h-4" />
                    </router-link>
                  </div>

                </div>

              </div>
            </div>

          </div>

          <!-- ======================================================== -->
          <!-- JOBS FEED (GRID VIEW)                                   -->
          <!-- ======================================================== -->
          <div v-else-if="paginatedJobs.length > 0 && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="group bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 flex flex-col justify-between"
            >
              <div class="space-y-3.5">
                <!-- Top Row -->
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-800 dark:to-slate-700 border border-blue-200/80 dark:border-slate-700 text-[#0D47A1] dark:text-blue-300 flex items-center justify-center font-black text-lg shadow-xs shrink-0 overflow-hidden">
                      <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" />
                      <span v-else>{{ job.company.charAt(0) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ job.company }}</p>
                      <span class="inline-flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                        <CheckCircle2 class="w-3 h-3 text-emerald-500 shrink-0" />
                        <span>{{ currentLanguage === 'kh' ? 'និយោជកផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
                      </span>
                    </div>
                  </div>

                  <button
                    @click.stop="toggleSaveJob(job.id)"
                    :class="[
                      'p-2 rounded-xl transition-all cursor-pointer shrink-0',
                      isJobSaved(job.id)
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'text-slate-400 hover:text-[#0D47A1] border border-transparent'
                    ]"
                    type="button"
                  >
                    <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1] dark:text-blue-400" />
                    <Bookmark v-else class="w-4 h-4" />
                  </button>
                </div>

                <!-- Badges -->
                <div class="flex flex-wrap items-center gap-1.5">
                  <span v-if="isUrgentJob(job)" class="text-[10px] px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-black">
                    🔥 {{ currentLanguage === 'kh' ? 'រើសបន្ទាន់' : 'Urgent' }}
                  </span>
                  <span :class="['text-[10px] px-2.5 py-0.5 rounded-full border font-bold', typeBadges[job.type]?.bg, typeBadges[job.type]?.text, typeBadges[job.type]?.border]">
                    {{ job.type }}
                  </span>
                  <span :class="['text-[10px] px-2.5 py-0.5 rounded-full font-bold', getWorkplaceModel(job).bg]">
                    {{ getWorkplaceModel(job).icon }} {{ currentLanguage === 'kh' ? getWorkplaceModel(job).labelKh.split(' ')[0] : getWorkplaceModel(job).labelEn }}
                  </span>
                </div>

                <!-- Title & Description -->
                <div>
                  <router-link :to="'/jobs/' + job.id">
                    <h3 class="text-sm sm:text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                      {{ job.title }}
                    </h3>
                  </router-link>
                  <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {{ job.description }}
                  </p>
                </div>

                <!-- Meta Matrix -->
                <div class="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div class="flex items-center gap-1 text-slate-600 dark:text-slate-300 truncate">
                    <MapPin class="w-3.5 h-3.5 text-rose-500 shrink-0" />
                    <span class="truncate font-semibold">{{ job.location }}</span>
                  </div>
                  <div class="flex items-center gap-1 text-amber-600 dark:text-amber-400 truncate">
                    <Calendar class="w-3.5 h-3.5 shrink-0" />
                    <span class="truncate font-semibold">{{ getJobDeadline(job) }}</span>
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span class="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-black text-xs border border-emerald-200/80 dark:border-emerald-800">
                  <DollarSign class="w-3.5 h-3.5" />
                  <span>{{ job.salary }}</span>
                </span>

                <button
                  @click="openApplyModal(job)"
                  type="button"
                  class="inline-flex items-center gap-1 px-3 py-1.5 bg-[#003366] hover:bg-[#0A2E6E] text-white rounded-xl text-xs font-black transition-all cursor-pointer"
                >
                  <Zap class="w-3 h-3 text-amber-300" />
                  <span>{{ currentLanguage === 'kh' ? 'ដាក់ពាក្យ' : 'Apply' }}</span>
                </button>
              </div>

            </div>

          </div>

          <!-- Empty State -->
          <div v-else class="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xs">
            <EmptyState
              :title="t('jobs.emptyTitle') || (currentLanguage === 'kh' ? 'រកមិនឃើញឱកាសការងារដែលត្រូវនឹងតម្រងស្វែងរករបស់អ្នកទេ' : 'No Career Openings Found')"
              :subtitle="t('jobs.emptySubtitle') || (currentLanguage === 'kh' ? 'សូមសាកល្បងជ្រើសរើសខេត្ត-ក្រុងផ្សេង ឬកំណត់តម្រងស្វែងរកឡើងវិញ' : 'Try selecting another province, clearing search terms, or resetting filters')"
              :action-label="currentLanguage === 'kh' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset All Filters'"
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

        </main>
      </div>

      <!-- ============================================================ -->
      <!-- 4. RECRUITER & EMPLOYER CALL-TO-ACTION STRIP                 -->
      <!-- ============================================================ -->
      <section class="rounded-3xl bg-gradient-to-r from-[#003366] to-[#0A2E6E] text-white p-6 sm:p-8 lg:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="space-y-2 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-amber-300 text-xs font-bold">
            <Sparkles class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'សម្រាប់ម្ចាស់អាជីវកម្ម និងផ្នែកធនធានមនុស្ស (HR)' : 'For Employers & HR Teams' }}</span>
          </div>
          <h3 class="text-xl sm:text-2xl font-black">
            {{ currentLanguage === 'kh' ? 'ស្វែងរកបុគ្គលិកឆ្នើម និងជំនាញខ្ពស់សម្រាប់ស្ថាប័នរបស់អ្នក' : 'Hire Qualified Talent Across Cambodia' }}
          </h3>
          <p class="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            {{ currentLanguage === 'kh'
              ? 'ចុះផ្សាយការងារដោយឥតគិតថ្លៃ ឈានទៅដល់បេក្ខជនរាប់ពាន់នាក់ទូទាំង ២៥ រាជធានី-ខេត្ត ជាមួយប្រព័ន្ធផ្ទៀងផ្ទាត់ស្របច្បាប់ ១០០%។'
              : 'Post your job vacancies, reach verified jobseekers nationwide, and accelerate your recruitment pipeline with CamLife Careers.'
            }}
          </p>
        </div>

        <button
          @click="isPostJobModalOpen = true"
          type="button"
          class="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-xs sm:text-sm shadow-lg transition-all shrink-0 cursor-pointer"
        >
          {{ currentLanguage === 'kh' ? '📢 ចុះផ្សាយការងារឥឡូវនេះ (ឥតគិតថ្លៃ)' : 'Post a Job for Free' }}
        </button>
      </section>

      <!-- ============================================================ -->
      <!-- 5. CITIZEN CAREER GUIDANCE & LABOR PROTECTION SECTION        -->
      <!-- ============================================================ -->
      <section class="rounded-3xl border border-blue-200/80 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/70 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 p-6 sm:p-10 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-blue-100 dark:border-slate-800">
          <div>
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 text-xs font-bold mb-2">
              <ShieldCheck class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>{{ currentLanguage === 'kh' ? 'មជ្ឈមណ្ឌលគាំពារសិទ្ធិការងារជាតិ' : 'National Labor Protection & Career Advisory' }}</span>
            </div>
            <h3 class="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មាន និងការណែនាំសំខាន់ៗសម្រាប់អ្នកស្វែងរកការងារ' : 'Essential Guidance for Cambodian Jobseekers' }}
            </h3>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              {{ currentLanguage === 'kh'
                ? 'ស្វែងយល់ពីច្បាប់ការងារ ប្រព័ន្ធគាំពារសង្គម ប.ស.ស និងគន្លឹះរៀបចំប្រវត្តិរូបសង្ខេប (CV) ប្រកបដោយវិជ្ជាជីវៈ។'
                : 'Learn about Cambodian labor law, NSSF social security benefits, and tips for creating a professional CV.'
              }}
            </p>
          </div>

          <div class="shrink-0">
            <a
              href="tel:1297"
              class="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#003366] hover:bg-[#0A2E6E] text-white text-xs font-black shadow-md transition-all cursor-pointer"
            >
              <PhoneCall class="w-4 h-4 text-amber-300 animate-bounce" />
              <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទទៅក្រសួងការងារ: ១២៩៧' : 'Call MLVT Hotline: 1297' }}</span>
            </a>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
              <PhoneCall class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-black text-slate-800 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ខ្សែទូរស័ព្ទ ១២៩៧' : 'MLVT Hotline 1297' }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'ប្រឹក្សាអំពីកិច្ចសន្យាការងារ ការដោះស្រាយវិវាទ និងព័ត៌មានបណ្តុះបណ្តាលវិជ្ជាជីវៈឥតគិតថ្លៃ។'
                : 'Free consultation on employment contracts, labor dispute mediation, and vocational skills training.'
              }}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-black text-slate-800 dark:text-white">
              {{ currentLanguage === 'kh' ? 'អត្ថប្រយោជន៍ ប.ស.ស' : 'NSSF Health & Pension' }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'និយោជកស្របច្បាប់ត្រូវចុះបញ្ជីបុគ្គលិកក្នុងរបបសន្តិសុខសង្គម គាំពារសុខភាព និងសោធននិវត្តន៍។'
                : 'Legitimate employers must register all staff for NSSF medical coverage and pension benefits.'
              }}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
              <FileText class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-black text-slate-800 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ការរៀបចំ CV ស្តង់ដារ' : 'Professional CV Tips' }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'សរសេរ CV ខ្លីខ្លឹម ១-២ ទំព័រ បង្ហាញសមិទ្ធផលជាក់ស្តែង និងភ្ជាប់មកជាមួយ Reference ត្រឹមត្រូវ។'
                : 'Format a concise 1-2 page resume highlighting tangible project achievements and clear references.'
              }}
            </p>
          </div>

          <div class="bg-white dark:bg-slate-800/90 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-700 shadow-2xs space-y-2">
            <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Award class="w-5 h-5" />
            </div>
            <h4 class="text-sm font-black text-slate-800 dark:text-white">
              {{ currentLanguage === 'kh' ? 'លក្ខខណ្ឌការងារត្រឹមត្រូវ' : 'Labor Standards' }}
            </h4>
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'ច្បាប់ការងារធានាប្រាក់ឈ្នួលអប្បបរមា ថ្ងៃឈប់សម្រាកប្រចាំឆ្នាំ ១៨ ថ្ងៃ និងប្រាក់អតីតភាពការងារ។'
                : 'Cambodian labor law protects minimum wage, 18 days paid annual leave, and seniority indemnity.'
              }}
            </p>
          </div>
        </div>
      </section>

    </div>

    <!-- ============================================================ -->
    <!-- INTERACTIVE QUICK APPLY MODAL (Easy Apply Modal)             -->
    <!-- ============================================================ -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isApplyModalOpen && selectedJobForApply"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-khmer"
        @click.self="closeApplyModal"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5 overflow-hidden">
          
          <!-- Close Button -->
          <button
            @click="closeApplyModal"
            class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            type="button"
          >
            <X class="w-5 h-5" />
          </button>

          <!-- Modal Header -->
          <div class="space-y-1.5 pr-8">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-black">
              <Zap class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ currentLanguage === 'kh' ? 'ការដាក់ពាក្យរហ័ស (Quick Apply)' : 'Easy Application' }}</span>
            </div>
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-snug">
              {{ selectedJobForApply.title }}
            </h3>
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span>{{ selectedJobForApply.company }}</span>
              <span>•</span>
              <span class="text-emerald-600 dark:text-emerald-400">{{ selectedJobForApply.salary }}</span>
            </p>
          </div>

          <!-- Success State -->
          <div v-if="isApplySubmitted" class="py-8 text-center space-y-4">
            <div class="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 class="w-8 h-8" />
            </div>
            <div class="space-y-1">
              <h4 class="text-lg font-black text-slate-900 dark:text-white">
                {{ currentLanguage === 'kh' ? 'ពាក្យសុំរបស់អ្នកត្រូវបានបញ្ជូនជោគជ័យ!' : 'Application Sent Successfully!' }}
              </h4>
              <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                {{ currentLanguage === 'kh'
                  ? `ក្រុមការងារ HR របស់ ${selectedJobForApply.company} នឹងទាក់ទងមកលោកអ្នកតាមរយៈទូរស័ព្ទ ឬ Telegram ក្នុងពេលឆាប់ៗ។`
                  : `The hiring team at ${selectedJobForApply.company} will review your profile and contact you soon.`
                }}
              </p>
            </div>
            <button
              @click="closeApplyModal"
              type="button"
              class="px-6 py-2.5 rounded-xl bg-[#003366] text-white font-black text-xs shadow-md transition-all cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បិទផ្ទាំងនេះ' : 'Done' }}
            </button>
          </div>

          <!-- Application Form -->
          <form v-else @submit.prevent="submitJobApplication" class="space-y-4 text-xs font-khmer">
            
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">
                {{ currentLanguage === 'kh' ? 'ឈ្មោះពេញរបស់បេក្ខជន *' : 'Full Name *' }}
              </label>
              <input
                v-model="applyForm.fullName"
                required
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ឧ. សុខ ចាន់ថន' : 'e.g. Sok Chanthon'"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">
                  {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ / Telegram *' : 'Phone / Telegram *' }}
                </label>
                <input
                  v-model="applyForm.phone"
                  required
                  type="tel"
                  :placeholder="currentLanguage === 'kh' ? 'ឧ. 012 345 678' : 'e.g. 012 345 678'"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">
                  {{ currentLanguage === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address' }}
                </label>
                <input
                  v-model="applyForm.email"
                  type="email"
                  placeholder="name@example.com"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">
                {{ currentLanguage === 'kh' ? 'បទពិសោធន៍ការងារ' : 'Experience Level' }}
              </label>
              <select
                v-model="applyForm.experience"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden cursor-pointer"
              >
                <option value="entry">{{ currentLanguage === 'kh' ? 'ទើបបញ្ចប់ការសិក្សា / គ្មានបទពិសោធន៍ (Entry)' : 'Entry / Fresh Graduate' }}</option>
                <option value="1-3">{{ currentLanguage === 'kh' ? '១ ទៅ ៣ ឆ្នាំ (Junior/Mid)' : '1 - 3 Years' }}</option>
                <option value="3-5">{{ currentLanguage === 'kh' ? '៣ ទៅ ៥ ឆ្នាំ (Senior)' : '3 - 5 Years' }}</option>
                <option value="5+">{{ currentLanguage === 'kh' ? '៥ ឆ្នាំឡើងទៅ (Lead / Manager)' : '5+ Years' }}</option>
              </select>
            </div>

            <!-- CV Upload Input -->
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">
                {{ currentLanguage === 'kh' ? 'ភ្ជាប់ឯកសារ CV / Resume (.pdf, .docx) *' : 'Attach CV / Resume (.pdf, .docx) *' }}
              </label>
              <div class="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  @change="handleCvFileChange"
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div class="flex flex-col items-center justify-center gap-1 text-slate-500">
                  <UploadCloud class="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <p v-if="applyForm.cvFileName" class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ {{ applyForm.cvFileName }}
                  </p>
                  <p v-else class="text-xs font-medium">
                    {{ currentLanguage === 'kh' ? 'ចុចទីនេះដើម្បីជ្រើសរើសឯកសារ CV របស់អ្នក' : 'Click or drag CV file here' }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Short Note -->
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">
                {{ currentLanguage === 'kh' ? 'សារខ្លីទៅកាន់អ្នកជ្រើសរើសបុគ្គលិក (HR)' : 'Cover Note' }}
              </label>
              <textarea
                v-model="applyForm.coverNote"
                rows="2"
                :placeholder="currentLanguage === 'kh' ? 'សរសេរសេចក្តីសង្ខេបខ្លីអំពីភាពខ្លាំងរបស់អ្នក...' : 'Brief summary of your background...'"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold focus:outline-hidden"
              ></textarea>
            </div>

            <div class="pt-2 flex items-center justify-end gap-2">
              <button
                @click="closeApplyModal"
                type="button"
                class="px-4 py-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold cursor-pointer"
              >
                {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
              </button>
              <button
                type="submit"
                class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#003366] to-[#0D47A1] text-white font-black shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <Send class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ផ្ញើពាក្យសុំការងារ' : 'Submit Application' }}</span>
              </button>
            </div>

          </form>

        </div>
      </div>
    </transition>

    <!-- ============================================================ -->
    <!-- POST A JOB MODAL (For Recruiters / Employers)                -->
    <!-- ============================================================ -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPostJobModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-khmer"
        @click.self="isPostJobModalOpen = false"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
          
          <button
            @click="isPostJobModalOpen = false"
            class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            type="button"
          >
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1 pr-8">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ចុះផ្សាយឱកាសការងារ (ឥតគិតថ្លៃ)' : 'Post a Job Vacancy' }}
            </h3>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              {{ currentLanguage === 'kh' ? 'បំពេញព័ត៌មានការងារ ដើម្បីផ្សព្វផ្សាយទៅកាន់បេក្ខជនរាប់ម៉ឺននាក់' : 'Fill details to reach thousands of qualified candidates' }}
            </p>
          </div>

          <div v-if="isPostJobSubmitted" class="py-8 text-center space-y-3">
            <CheckCircle2 class="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 class="text-base font-black text-slate-900 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ការចុះផ្សាយការងារត្រូវបានទទួលជោគជ័យ!' : 'Job Posted Successfully!' }}
            </h4>
            <p class="text-xs text-slate-500">
              {{ currentLanguage === 'kh' ? 'ក្រុមការងារ CamLife Careers នឹងផ្ទៀងផ្ទាត់ និងដាក់ផ្សាយក្នុងរយៈពេល ២ ម៉ោង។' : 'Our team will review and publish your listing within 2 hours.' }}
            </p>
            <button
              @click="isPostJobModalOpen = false; isPostJobSubmitted = false"
              class="px-5 py-2 rounded-xl bg-[#003366] text-white font-bold text-xs cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
            </button>
          </div>

          <form v-else @submit.prevent="submitPostJob" class="space-y-3.5 text-xs font-khmer">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'ឈ្មោះក្រុមហ៊ុន / ស្ថាប័ន *' : 'Company Name *' }}</label>
              <input v-model="postJobForm.companyName" required type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'មុខតំណែងត្រូវការជ្រើសរើស *' : 'Job Title *' }}</label>
              <input v-model="postJobForm.jobTitle" required type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'កម្រិតប្រាក់ខែ' : 'Salary Range' }}</label>
                <input v-model="postJobForm.salary" type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង HR (ទូរស័ព្ទ/អ៊ីមែល) *' : 'HR Contact *' }}</label>
                <input v-model="postJobForm.hrContact" required type="text" class="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div class="pt-3 flex justify-end gap-2">
              <button @click="isPostJobModalOpen = false" type="button" class="px-4 py-2 text-slate-500 font-bold cursor-pointer">{{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}</button>
              <button type="submit" class="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl cursor-pointer">{{ currentLanguage === 'kh' ? 'ដាក់ផ្សាយឥឡូវនេះ' : 'Publish Job' }}</button>
            </div>
          </form>

        </div>
      </div>
    </transition>

  </div>
</template>
