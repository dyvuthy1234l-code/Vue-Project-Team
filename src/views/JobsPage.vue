<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  ChevronDown,
  Check,
  Search,
  CheckCircle2,
  Award,
  LayoutGrid,
  List,
  Zap,
  UploadCloud,
  Send,
  X,
  Calendar as CalendarIcon,
  Hash,
  Link as LinkIcon,
  Tag,
  FileSpreadsheet,
  GraduationCap,
  Briefcase,
  CheckCircle
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
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
  title: 'ឱកាសការងារចុងក្រោយ — BongThom Style Careers Portal',
  description: 'ស្វែងរកឱកាសការងារ ការងារក្រៅម៉ោង កម្មសិក្សា និងអាហារូបករណ៍ពីស្ថាប័ន និងក្រុមហ៊ុនឈានមុខនៅកម្ពុជា'
})

// Persistent User Posted Jobs from LocalStorage
const userPostedJobs = ref<Job[]>([])

onMounted(() => {
  window.addEventListener('click', onWindowClick)
  try {
    const savedJobsJson = localStorage.getItem('camlife_user_jobs')
    if (savedJobsJson) {
      userPostedJobs.value = JSON.parse(savedJobsJson)
    }
  } catch (e) {
    console.error('Failed to load user posted jobs', e)
  }

  try {
    const savedAppsJson = localStorage.getItem('camlife_job_applications')
    if (savedAppsJson) {
      userApplications.value = JSON.parse(savedAppsJson)
    }
  } catch (e) {
    console.error('Failed to load job applications', e)
  }
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
})

// All Jobs List (Combining Mock Data + User Posted Jobs)
const initialJobs = getJobs()
const allJobs = computed<Job[]>(() => {
  return [...userPostedJobs.value, ...initialJobs]
})

// User Applications Tracking
interface JobApplication {
  id: string
  jobId: string
  jobTitle: string
  company: string
  fullName: string
  phone: string
  email: string
  cvFileName: string
  appliedAt: string
}
const userApplications = ref<JobApplication[]>([])

function hasApplied(jobId: string): boolean {
  return userApplications.value.some(app => app.jobId === jobId)
}

// Primary Search & Filters State
const searchQuery = ref('')
const activeLocation = ref('All')
const activeCategory = ref('All')
const activeQuickLink = ref('all') // 'all' | 'jobs' | 'internships' | 'consultancies' | 'scholarships' | 'procurement' | 'parttime' | 'shortterm' | 'appliedlabour'
const activeType = ref('All')
const selectedLetter = ref('')
const dateFilterType = ref<'posting' | 'close'>('posting')
const selectedDateDay = ref<number | null>(null)
const sortBy = ref<'newest' | 'salary' | 'company' | 'deadline'>('newest')
const viewMode = ref<'list' | 'grid'>('list')

// Accordion Collapsible States for Left Sidebar (BongThom style)
const isRecentSearchOpen = ref(true)
const isQuickLinksOpen = ref(true)
const isCategoryOpen = ref(true)
const isCompanyLetterOpen = ref(true)
const isDateFilterOpen = ref(true)

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

// Alphabet list for Company Starting Letter (A-Z)
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

function selectLetter(letter: string) {
  selectedLetter.value = selectedLetter.value === letter ? '' : letter
  scrollToResults()
}

// Quick Links Menu (BongThom Sidebar Quick Links matching screenshot)
const quickLinks = computed(() => [
  { id: 'jobs', labelEn: 'Job Opportunities', labelKh: 'ឱកាសការងារ', icon: Briefcase },
  { id: 'internships', labelEn: 'Internships', labelKh: 'កម្មសិក្សា', icon: GraduationCap },
  { id: 'consultancies', labelEn: 'Consultancies', labelKh: 'ការពិគ្រោះយោបល់', icon: FileSpreadsheet },
  { id: 'scholarships', labelEn: 'Scholarships', labelKh: 'អាហារូបករណ៍', icon: Award },
  { id: 'procurement', labelEn: 'Procurement Ads', labelKh: 'ការប្រកាសដេញថ្លៃ', icon: FileSpreadsheet },
  { id: 'parttime', labelEn: 'Part Time Jobs', labelKh: 'ការងារក្រៅម៉ោង', icon: Clock },
  { id: 'shortterm', labelEn: 'Short Term Jobs', labelKh: 'ការងាររយៈពេលខ្លី', icon: Zap },
  { id: 'appliedlabour', labelEn: 'Applied Labour Jobs', labelKh: 'ពលកម្មជំនាញ', icon: Briefcase }
])

// Categories metadata with count pills
const categories = computed(() => {
  const meta = [
    { value: 'Other', labelKh: 'Business Administration', labelEn: 'Business Administration' },
    { value: 'Education', labelKh: 'Educate/Train/Teaching', labelEn: 'Educate/Train/Teaching' },
    { value: 'Exec', labelKh: 'Exec. / Management', labelEn: 'Exec. / Management' },
    { value: 'Marketing', labelKh: 'Sales / Marketing', labelEn: 'Sales / Marketing' },
    { value: 'Accounting', labelKh: 'Accounting', labelEn: 'Accounting' },
    { value: 'Finance', labelKh: 'Banking / Finance', labelEn: 'Banking / Finance' },
    { value: 'Agriculture', labelKh: 'Agriculture', labelEn: 'Agriculture' }
  ]

  return meta.map(cat => {
    const count = allJobs.value.filter(j => matchesCategory(j, cat.value)).length
    return {
      ...cat,
      label: cat.labelEn,
      count
    }
  })
})

function matchesCategory(j: Job, catValue: string): boolean {
  const cat = catValue.toLowerCase()
  const jCat = j.category.toLowerCase()
  const title = j.title.toLowerCase()
  const desc = j.description.toLowerCase()

  if (cat === 'other') {
    return jCat === 'other' || title.includes('admin') || title.includes('business') || title.includes('logistics') || title.includes('trade') || title.includes('supervisor')
  }
  if (cat === 'education') {
    return jCat === 'education' || title.includes('teacher') || title.includes('instructor') || title.includes('school') || desc.includes('student')
  }
  if (cat === 'exec') {
    return jCat === 'exec' || title.includes('manager') || title.includes('director') || title.includes('executive') || title.includes('supervisor') || title.includes('head')
  }
  if (cat === 'marketing') {
    return jCat === 'marketing' || title.includes('marketing') || title.includes('sales') || title.includes('designer') || title.includes('creative') || title.includes('photographer')
  }
  if (cat === 'accounting') {
    return jCat === 'accounting' || title.includes('accountant') || title.includes('accounting') || title.includes('audit')
  }
  if (cat === 'finance') {
    return jCat === 'finance' || jCat === 'banking' || title.includes('finance') || title.includes('bank') || title.includes('credit') || title.includes('loan')
  }
  if (cat === 'agriculture') {
    return jCat === 'agriculture' || title.includes('agri') || title.includes('farm') || title.includes('cooperative') || desc.includes('crop')
  }
  return jCat === cat
}

// BongThom Job ID Generator
function getBongThomJobId(job: Job): string {
  let hash = 0
  for (let i = 0; i < job.id.length; i++) {
    hash = (hash << 5) - hash + job.id.charCodeAt(i)
    hash |= 0
  }
  const idNum = 67600 + (Math.abs(hash) % 100)
  return `# 676${(idNum % 100).toString().padStart(2, '0')}`
}

// Duration remaining generator
function getBongThomDaysLeft(job: Job): { daysEn: string; daysKh: string; daysNum: number } {
  let hash = 0
  for (let i = 0; i < job.id.length; i++) {
    hash = (hash << 3) + job.id.charCodeAt(i)
  }
  const days = 2 + (Math.abs(hash) % 8)
  return {
    daysEn: `${days} days`,
    daysKh: `${days} ថ្ងៃ`,
    daysNum: days
  }
}

// Closing date generator
function getBongThomClosingDate(job: Job): string {
  const dateObj = new Date(job.postedDate)
  dateObj.setDate(dateObj.getDate() + 15)
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsKh = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
  const m = dateObj.getMonth()
  const d = dateObj.getDate()
  const y = dateObj.getFullYear() + 1
  if (currentLanguage.value === 'kh') {
    return `${d}-${monthsKh[m]}-${y}`
  }
  return `${d}-${monthsEn[m]}-${y}`
}

function selectCategoryFilter(catVal: string) {
  activeCategory.value = activeCategory.value === catVal ? 'All' : catVal
  scrollToResults()
}

function selectQuickLinkFilter(linkId: string) {
  activeQuickLink.value = activeQuickLink.value === linkId ? 'all' : linkId
  scrollToResults()
}

function selectDateDay(day: number) {
  selectedDateDay.value = selectedDateDay.value === day ? null : day
  scrollToResults()
}

function scrollToResults() {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('bongthom-jobs-feed')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

// Comprehensive Filtering Engine
const filteredJobs = computed(() => {
  let result = [...allJobs.value]

  // Company Starting Letter Filter (A-Z)
  if (selectedLetter.value) {
    const letter = selectedLetter.value.toUpperCase()
    const matchesLetter = result.filter(j =>
      j.company.toUpperCase().startsWith(letter) || j.title.toUpperCase().startsWith(letter)
    )
    result = matchesLetter.length > 0
      ? matchesLetter
      : result.filter(j => j.company.toUpperCase().includes(letter) || j.title.toUpperCase().includes(letter))
  }

  // Location Filter
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
      return loc.includes(engName) || (khName && loc.includes(khName))
    })
  }

  // Quick Links Filter
  if (activeQuickLink.value !== 'all') {
    const ql = activeQuickLink.value
    if (ql === 'internships') {
      result = result.filter(j => j.type.toLowerCase() === 'internship' || j.title.toLowerCase().includes('intern'))
    } else if (ql === 'consultancies') {
      result = result.filter(j => j.title.toLowerCase().includes('consultant') || j.title.toLowerCase().includes('advisor') || j.description.toLowerCase().includes('consultant') || j.title.toLowerCase().includes('bid'))
    } else if (ql === 'scholarships') {
      result = result.filter(j => j.title.toLowerCase().includes('scholarship') || j.description.toLowerCase().includes('scholarship') || j.category === 'Education')
    } else if (ql === 'procurement') {
      result = result.filter(j => j.title.toLowerCase().includes('procurement') || j.title.toLowerCase().includes('bid') || j.title.toLowerCase().includes('supply') || j.description.toLowerCase().includes('procurement'))
    } else if (ql === 'parttime') {
      result = result.filter(j => j.type.toLowerCase() === 'part-time')
    } else if (ql === 'shortterm') {
      result = result.filter(j => j.type.toLowerCase() === 'freelance' || j.type.toLowerCase() === 'contract' || j.type.toLowerCase() === 'part-time')
    } else if (ql === 'appliedlabour') {
      result = result.filter(j => j.category === 'Other' || j.title.toLowerCase().includes('labour') || j.title.toLowerCase().includes('technician') || j.title.toLowerCase().includes('officer') || j.title.toLowerCase().includes('nurse'))
    }
  }

  // Category Filter
  if (activeCategory.value !== 'All') {
    result = result.filter(j => matchesCategory(j, activeCategory.value))
  }

  // Job Type Filter
  if (activeType.value !== 'All') {
    result = result.filter(j => j.type.toLowerCase() === activeType.value.toLowerCase())
  }

  // Date Filter (By day of month)
  if (selectedDateDay.value !== null) {
    result = result.filter(j => {
      const pDay = new Date(j.postedDate).getDate()
      const cDay = (pDay + 15) % 30 || 1
      return dateFilterType.value === 'posting' ? pDay === selectedDateDay.value : cDay === selectedDateDay.value
    })
  }

  // Search Query
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
  } else if (sortBy.value === 'deadline') {
    result.sort((a, b) => getBongThomDaysLeft(a).daysNum - getBongThomDaysLeft(b).daysNum)
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedJobs,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredJobs, 10)

const hasActiveFilters = computed(() => {
  return (
    searchQuery.value !== '' ||
    activeLocation.value !== 'All' ||
    activeCategory.value !== 'All' ||
    activeType.value !== 'All' ||
    activeQuickLink.value !== 'all' ||
    selectedLetter.value !== '' ||
    selectedDateDay.value !== null
  )
})

function resetFilters() {
  searchQuery.value = ''
  activeLocation.value = 'All'
  activeCategory.value = 'All'
  activeType.value = 'All'
  activeQuickLink.value = 'all'
  selectedLetter.value = ''
  selectedDateDay.value = null
  sortBy.value = 'newest'
}

// Quick Apply Modal & Application Submission
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
  if (!applyForm.value.fullName || !applyForm.value.phone || !selectedJobForApply.value) return
  
  const newApp: JobApplication = {
    id: 'app-' + Date.now(),
    jobId: selectedJobForApply.value.id,
    jobTitle: selectedJobForApply.value.title,
    company: selectedJobForApply.value.company,
    fullName: applyForm.value.fullName,
    phone: applyForm.value.phone,
    email: applyForm.value.email,
    cvFileName: applyForm.value.cvFileName || 'CV_Resume.pdf',
    appliedAt: new Date().toISOString()
  }

  userApplications.value.unshift(newApp)
  try {
    localStorage.setItem('camlife_job_applications', JSON.stringify(userApplications.value))
  } catch (e) {
    console.error('Failed to save application', e)
  }

  isApplySubmitted.value = true
}

// Post Ad Modal (Employer Posting)
const isPostAdModalOpen = ref(false)
const postAdForm = ref({
  companyName: '',
  jobTitle: '',
  contactPhone: '',
  email: '',
  location: 'Phnom Penh',
  salary: '$800 - $1,500/month',
  category: 'IT',
  description: ''
})
const isPostAdSubmitted = ref(false)

function submitPostAd() {
  if (!postAdForm.value.companyName || !postAdForm.value.jobTitle) return
  
  const newJob: Job = {
    id: 'job-user-' + Date.now(),
    title: postAdForm.value.jobTitle,
    company: postAdForm.value.companyName,
    location: postAdForm.value.location || 'Phnom Penh',
    salary: postAdForm.value.salary || '$600 - $1,200/month',
    salaryMin: 600,
    salaryMax: 1200,
    type: 'Full-time',
    category: postAdForm.value.category || 'IT',
    postedDate: new Date().toISOString().split('T')[0],
    description: postAdForm.value.description || `Classified job ad posted by ${postAdForm.value.companyName}. Direct contact phone: ${postAdForm.value.contactPhone}.`,
    requirements: ['Relevant qualification or experience in field', 'Good communication skills'],
    benefits: ['Competitive compensation', 'NSSF healthcare & staff bonuses'],
    applyUrl: `tel:${postAdForm.value.contactPhone}`
  }

  userPostedJobs.value.unshift(newJob)
  try {
    localStorage.setItem('camlife_user_jobs', JSON.stringify(userPostedJobs.value))
  } catch (e) {
    console.error('Failed to save posted job', e)
  }

  isPostAdSubmitted.value = true
  scrollToResults()
}
</script>

<template>
  <div class="bongthom-jobs-portal min-h-screen pb-20 text-slate-800 dark:text-white font-khmer bg-[#F2F4F7] dark:bg-slate-950">
    
    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-4 space-y-4">
      
      <!-- Top Search Bar -->
      <div class="bg-white dark:bg-slate-900 rounded-xl p-2.5 shadow-xs border border-slate-200 dark:border-slate-800">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800 gap-2 lg:gap-0">
          
          <!-- Search Input -->
          <div class="flex-1 flex items-center px-3 py-1.5 gap-2 min-w-0">
            <Search class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
            <input
              v-model="searchQuery"
              type="text"
              @keyup.enter="scrollToResults"
              :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមុខតំណែង, ក្រុមហ៊ុន ឬពាក្យគន្លឹះ...' : 'Search job title, company, or keywords...'"
              class="w-full bg-transparent text-xs sm:text-sm font-bold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden font-khmer"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; scrollToResults()"
              type="button"
              class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- 25 Cambodian Provinces Selector -->
          <div class="relative jobs-location-dropdown-container px-3 py-1.5 lg:w-72 shrink-0">
            <button
              type="button"
              @click="isLocationDropdownOpen = !isLocationDropdownOpen"
              class="w-full flex items-center justify-between gap-2 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] transition-colors cursor-pointer select-none"
            >
              <div class="flex items-center gap-2 min-w-0">
                <MapPin class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span class="truncate text-left">{{ selectedProvinceLabel }}</span>
              </div>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': isLocationDropdownOpen }" />
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
                      class="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-hidden font-khmer"
                      @click.stop
                    />
                  </div>
                </div>

                <div class="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
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
                      <MapPin class="w-3.5 h-3.5 text-blue-500 shrink-0" />
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

          <!-- Search Button -->
          <div class="p-1 shrink-0">
            <button
              @click="scrollToResults"
              type="button"
              class="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-5 py-2 bg-[#003366] hover:bg-[#0A2E6E] text-white rounded-lg font-bold text-xs shadow-xs transition-all cursor-pointer"
            >
              <Search class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 2. BONGTHOM TWO-COLUMN PORTAL LAYOUT                         -->
      <!-- ============================================================ -->
      <div id="bongthom-jobs-feed" class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-4 gap-4">
        
        <!-- ========================================================== -->
        <!-- LEFT SIDEBAR: COMPLETE BONGTHOM ACCORDION STACK             -->
        <!-- ========================================================== -->
        <aside class="lg:col-span-1 space-y-3">
          
          <!-- Card 1: Recent Search History -->
          <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <button
              @click="isRecentSearchOpen = !isRecentSearchOpen"
              type="button"
              class="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <span class="flex items-center gap-1.5">
                <Search class="w-3.5 h-3.5 text-slate-400" />
                <span>Recent Search History</span>
              </span>
              <ChevronDown class="w-3 h-3 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isRecentSearchOpen }" />
            </button>

            <div v-if="isRecentSearchOpen" class="p-3 text-[11px] text-slate-400 italic text-left">
              <div v-if="searchQuery" class="flex items-center justify-between gap-1 text-slate-700 dark:text-slate-200 font-bold">
                <span>"{{ searchQuery }}"</span>
                <button @click="searchQuery = ''" class="text-xs text-rose-500 hover:underline">Clear</button>
              </div>
              <span v-else>No recent searches have been made</span>
            </div>
          </div>

          <!-- Card 2: Quick Links (BongThom Quick Links Menu) -->
          <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <button
              @click="isQuickLinksOpen = !isQuickLinksOpen"
              type="button"
              class="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <span class="flex items-center gap-1.5">
                <LinkIcon class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
                <span>Quick Links</span>
              </span>
              <ChevronDown class="w-3 h-3 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isQuickLinksOpen }" />
            </button>

            <div v-if="isQuickLinksOpen" class="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
              <button
                v-for="ql in quickLinks"
                :key="ql.id"
                @click="selectQuickLinkFilter(ql.id)"
                type="button"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer',
                  activeQuickLink === ql.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                ]"
              >
                <span>{{ ql.labelEn }}</span>
                <Check v-if="activeQuickLink === ql.id" class="w-3 h-3 text-[#0D47A1] dark:text-blue-400" />
              </button>
            </div>
          </div>

          <!-- Card 3: Career Category (BongThom Pill Badge Counts) -->
          <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <button
              @click="isCategoryOpen = !isCategoryOpen"
              type="button"
              class="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <span class="flex items-center gap-1.5">
                <Tag class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Career Category</span>
              </span>
              <ChevronDown class="w-3 h-3 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isCategoryOpen }" />
            </button>

            <div v-if="isCategoryOpen" class="divide-y divide-slate-100 dark:divide-slate-800/60 text-[11px]">
              <button
                v-for="cat in categories"
                :key="cat.value"
                @click="selectCategoryFilter(cat.value)"
                type="button"
                :class="[
                  'w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer',
                  activeCategory === cat.value
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                ]"
              >
                <span class="truncate pr-1">{{ cat.label }}</span>
                <span class="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-slate-600 text-white dark:bg-slate-700 shrink-0">
                  {{ cat.count }}
                </span>
              </button>

              <button
                @click="activeCategory = 'All'; scrollToResults()"
                type="button"
                class="w-full text-left px-3 py-2 text-[10px] font-black text-[#0D47A1] dark:text-blue-400 hover:underline uppercase tracking-wider bg-slate-50/50 dark:bg-slate-800/30"
              >
                List ALL...
              </button>
            </div>
          </div>

          <!-- Card 4: Company Starting Letter (A-Z Grid selector) -->
          <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <button
              @click="isCompanyLetterOpen = !isCompanyLetterOpen"
              type="button"
              class="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <div class="flex items-center gap-1.5">
                <span>Company Starting Letter</span>
                <span v-if="selectedLetter" class="text-[10px] text-blue-600 font-black">({{ selectedLetter }})</span>
              </div>
              <ChevronDown class="w-3 h-3 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isCompanyLetterOpen }" />
            </button>

            <div v-if="isCompanyLetterOpen" class="p-2.5">
              <div class="flex flex-wrap gap-1 text-[11px] font-bold text-[#0D47A1] justify-center">
                <button
                  v-for="lettr in alphabet"
                  :key="lettr"
                  @click="selectLetter(lettr)"
                  type="button"
                  :class="[
                    'w-5 h-5 flex items-center justify-center rounded-xs transition-colors cursor-pointer text-[11px]',
                    selectedLetter === lettr
                      ? 'bg-[#0D47A1] text-white font-black'
                      : 'hover:bg-blue-50 text-[#0D47A1] hover:underline'
                  ]"
                >
                  {{ lettr }}
                </button>
              </div>
            </div>
          </div>

          <!-- Card 5: Filter on Date (Posting Date vs Close Date + Mini Calendar) -->
          <div class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs overflow-hidden">
            <button
              @click="isDateFilterOpen = !isDateFilterOpen"
              type="button"
              class="w-full flex items-center justify-between p-2.5 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <div class="flex items-center gap-1.5">
                <span>Filter on Date</span>
                <span v-if="selectedDateDay !== null" class="text-[10px] text-rose-600 font-black">(Day {{ selectedDateDay }})</span>
              </div>
              <ChevronDown class="w-3 h-3 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isDateFilterOpen }" />
            </button>

            <div v-if="isDateFilterOpen" class="p-3 space-y-2.5 text-[11px]">
              <!-- Radio Options -->
              <div class="flex items-center justify-around gap-2 font-medium text-slate-700 dark:text-slate-300">
                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" value="posting" v-model="dateFilterType" class="text-[#0D47A1]" />
                  <span>Posting Date</span>
                </label>
                <label class="inline-flex items-center gap-1.5 cursor-pointer">
                  <input type="radio" value="close" v-model="dateFilterType" class="text-[#0D47A1]" />
                  <span>Close Date</span>
                </label>
              </div>

              <!-- Mini Calendar Picker Header -->
              <div class="border border-slate-200 dark:border-slate-800 rounded-lg p-2 bg-slate-50/50 dark:bg-slate-800/30 text-center">
                <div class="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 text-[10px] pb-1 border-b border-slate-100 dark:border-slate-800">
                  <span>‹</span>
                  <span>September 2026</span>
                  <span>›</span>
                </div>
                <!-- Day Names -->
                <div class="grid grid-cols-7 gap-1 text-[9px] text-slate-400 font-bold py-1">
                  <span>SUN</span><span>MON</span><span>TUE</span><span>WED</span><span>THU</span><span>FRI</span><span>SAT</span>
                </div>
                <!-- Day Numbers Grid -->
                <div class="grid grid-cols-7 gap-1 text-[10px] font-medium">
                  <button
                    v-for="d in 30"
                    :key="d"
                    @click="selectDateDay(d)"
                    type="button"
                    :class="[
                      'w-5 h-5 flex items-center justify-center rounded-xs transition-colors mx-auto cursor-pointer',
                      selectedDateDay === d
                        ? 'bg-[#0D47A1] text-white font-black'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    ]"
                  >
                    {{ d }}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </aside>

        <!-- ========================================================== -->
        <!-- RIGHT MAIN FEED: BONGTHOM LATEST JOBS LIST                 -->
        <!-- ========================================================== -->
        <main class="lg:col-span-3 space-y-3">
          
          <!-- Feed Header: "Latest Jobs" + View Switcher + Sort -->
          <div class="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            
            <div class="flex items-center gap-2">
              <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight">
                Latest Jobs
              </h2>
              <span class="text-[11px] px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-900">
                {{ filteredJobs.length }} Jobs
              </span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Reset Filters -->
              <button
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                type="button"
              >
                Clear Filters
              </button>

              <!-- View Switcher -->
              <div class="flex items-center p-0.5 bg-slate-100 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'p-1 rounded transition-all cursor-pointer',
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-700'
                  ]"
                  type="button"
                >
                  <List class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="viewMode = 'grid'"
                  :class="[
                    'p-1 rounded transition-all cursor-pointer',
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-700'
                  ]"
                  type="button"
                >
                  <LayoutGrid class="w-3.5 h-3.5" />
                </button>
              </div>

              <!-- Sort Dropdown -->
              <div class="relative">
                <select
                  v-model="sortBy"
                  class="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer shadow-2xs pr-6 appearance-none"
                >
                  <option value="newest">Newest</option>
                  <option value="deadline">Closing Soon</option>
                  <option value="salary">Highest Salary</option>
                  <option value="company">Company A-Z</option>
                </select>
                <ChevronDown class="w-3 h-3 text-slate-400 pointer-events-none absolute right-2 top-1/2 -translate-y-1/2" />
              </div>
            </div>

          </div>

          <!-- ======================================================== -->
          <!-- BONGTHOM JOB ROW LIST (EXACT SCREENSHOT MATCH)           -->
          <!-- ======================================================== -->
          <div v-if="paginatedJobs.length > 0 && viewMode === 'list'" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg divide-y divide-slate-150 dark:divide-slate-800 overflow-hidden shadow-2xs">
            
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="relative group p-3 sm:p-3.5 hover:bg-blue-50/40 dark:hover:bg-slate-800/50 transition-all duration-150 flex items-start justify-between gap-3"
            >
              <!-- Bookmark Ribbon Icon on Top Right Corner of Row -->
              <button
                @click.stop="toggleSaveJob(job.id)"
                class="absolute top-2.5 right-3 text-blue-700 dark:text-blue-400 hover:scale-110 transition-transform cursor-pointer p-0.5"
                :title="isJobSaved(job.id) ? 'Saved' : 'Save Job'"
                type="button"
              >
                <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1]" />
                <Bookmark v-else class="w-4 h-4 text-slate-400 hover:text-[#0D47A1]" />
              </button>

              <!-- Left: Square Company Logo Frame + Details -->
              <div class="flex items-start gap-3 min-w-0 flex-1 pr-6">
                
                <!-- BongThom Small Square Logo Frame -->
                <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-md border border-slate-200 dark:border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0 shadow-2xs overflow-hidden mt-0.5">
                  <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" loading="lazy" />
                  <span v-else class="font-black text-sm text-[#0D47A1] dark:text-blue-400">{{ job.company.charAt(0) }}</span>
                </div>

                <!-- Content Details -->
                <div class="space-y-0.5 min-w-0 flex-1">
                  
                  <!-- Clickable Blue Job Title -->
                  <router-link :to="'/jobs/' + job.id" class="inline-block">
                    <h3 class="text-xs sm:text-sm font-bold text-[#0D47A1] dark:text-blue-400 group-hover:underline transition-colors leading-snug">
                      {{ job.title }}
                    </h3>
                  </router-link>

                  <!-- Company Full Name -->
                  <p class="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                    {{ job.company }}
                  </p>

                  <!-- BongThom Metadata Line: # ID | Duration | Closing Date -->
                  <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-0.5">
                    
                    <!-- Job ID Badge (BongThom style: e.g. # 67699) -->
                    <span class="inline-flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-300">
                      <Hash class="w-3 h-3 text-slate-400" />
                      <span>{{ getBongThomJobId(job) }}</span>
                    </span>

                    <!-- Duration Remaining (e.g. 2 days) -->
                    <span class="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                      <Clock class="w-3 h-3 text-slate-400" />
                      <span>{{ getBongThomDaysLeft(job).daysEn }}</span>
                    </span>

                    <!-- Closing Expiry Date (e.g. 18-Sep-2026) -->
                    <span class="inline-flex items-center gap-1 font-medium text-slate-600 dark:text-slate-300">
                      <CalendarIcon class="w-3 h-3 text-slate-400" />
                      <span>{{ getBongThomClosingDate(job) }}</span>
                    </span>

                    <!-- Quick Apply Badge / Applied Status -->
                    <div class="ml-auto sm:ml-0">
                      <span v-if="hasApplied(job.id)" class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-extrabold">
                        <CheckCircle class="w-3 h-3 text-emerald-600" />
                        <span>Applied</span>
                      </span>
                      <button
                        v-else
                        @click="openApplyModal(job)"
                        type="button"
                        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 text-[10px] font-black hover:bg-blue-100 cursor-pointer"
                      >
                        <Zap class="w-3 h-3 text-amber-500" />
                        <span>Apply</span>
                      </button>
                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>

          <!-- ======================================================== -->
          <!-- BONGTHOM JOB GRID VIEW                                   -->
          <!-- ======================================================== -->
          <div v-else-if="paginatedJobs.length > 0 && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="group bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-2xs hover:shadow-md hover:border-blue-400 transition-all duration-150 flex flex-col justify-between"
            >
              <div class="space-y-2">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <div class="w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
                      <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" />
                      <span v-else class="font-black text-[#0D47A1] text-base">{{ job.company.charAt(0) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ job.company }}</p>
                      <span class="text-[10px] text-slate-400 font-semibold">{{ getBongThomJobId(job) }}</span>
                    </div>
                  </div>

                  <button
                    @click.stop="toggleSaveJob(job.id)"
                    class="text-[#0D47A1] cursor-pointer"
                    type="button"
                  >
                    <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1]" />
                    <Bookmark v-else class="w-4 h-4 text-slate-400" />
                  </button>
                </div>

                <div>
                  <router-link :to="'/jobs/' + job.id">
                    <h3 class="text-xs font-bold text-[#0D47A1] dark:text-blue-400 group-hover:underline line-clamp-2 leading-snug">
                      {{ job.title }}
                    </h3>
                  </router-link>
                </div>

                <div class="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span class="inline-flex items-center gap-1"><Clock class="w-3 h-3 text-slate-400" /> {{ getBongThomDaysLeft(job).daysEn }}</span>
                  <span class="inline-flex items-center gap-1"><CalendarIcon class="w-3 h-3 text-slate-400" /> {{ getBongThomClosingDate(job) }}</span>
                </div>
              </div>

              <div class="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span class="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                  {{ job.salary }}
                </span>

                <span v-if="hasApplied(job.id)" class="text-[10px] font-black text-emerald-600">✓ Applied</span>
                <button
                  v-else
                  @click="openApplyModal(job)"
                  type="button"
                  class="px-3 py-1 bg-[#003366] text-white rounded text-xs font-bold cursor-pointer"
                >
                  Apply
                </button>
              </div>

            </div>

          </div>

          <!-- Empty State -->
          <div v-else class="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 text-center shadow-2xs">
            <EmptyState
              :title="t('jobs.emptyTitle') || 'No Career Openings Found'"
              :subtitle="t('jobs.emptySubtitle') || 'Try selecting another category or clearing filters'"
              action-label="Reset All Filters"
              @action="resetFilters"
            />
          </div>

          <!-- Exact BongThom Pagination matching screenshot bottom: < 1 2 3 4 5 6 7 8 > -->
          <div v-if="totalPages > 1" class="flex items-center justify-center gap-1 pt-3 pb-6">
            <button
              @click="prevPage"
              :disabled="currentPage === 1"
              class="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-100"
              type="button"
            >
              &lt;
            </button>

            <button
              v-for="p in totalPages"
              :key="p"
              @click="goToPage(p)"
              type="button"
              :class="[
                'w-7 h-7 rounded border text-xs font-bold transition-colors cursor-pointer',
                currentPage === p
                  ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              ]"
            >
              {{ p }}
            </button>

            <button
              @click="nextPage"
              :disabled="currentPage === totalPages"
              class="w-7 h-7 rounded border border-slate-200 dark:border-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 disabled:opacity-40 cursor-pointer hover:bg-slate-100"
              type="button"
            >
              &gt;
            </button>
          </div>

        </main>
      </div>

    </div>

    <!-- QUICK APPLY MODAL -->
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
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <button @click="closeApplyModal" class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer" type="button">
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1 pr-6">
            <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black">
              <Zap class="w-3 h-3 text-amber-500" />
              <span>Easy Application</span>
            </div>
            <h3 class="text-base font-black text-slate-900 dark:text-white leading-snug">
              {{ selectedJobForApply.title }}
            </h3>
            <p class="text-xs font-bold text-slate-500">
              {{ selectedJobForApply.company }} • <span class="text-emerald-600">{{ selectedJobForApply.salary }}</span>
            </p>
          </div>

          <div v-if="isApplySubmitted" class="py-6 text-center space-y-3">
            <CheckCircle2 class="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 class="text-base font-black text-slate-900 dark:text-white">
              Application Sent Successfully!
            </h4>
            <p class="text-xs text-slate-500">
              Your application for <strong>{{ selectedJobForApply.title }}</strong> has been recorded. The hiring team at {{ selectedJobForApply.company }} will review your CV and contact you at {{ applyForm.phone }}.
            </p>
            <button @click="closeApplyModal" type="button" class="px-5 py-2 rounded-lg bg-[#003366] text-white font-bold text-xs cursor-pointer">
              Done
            </button>
          </div>

          <form v-else @submit.prevent="submitJobApplication" class="space-y-3 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">Full Name *</label>
              <input v-model="applyForm.fullName" required type="text" placeholder="e.g. Sok Chanthon" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">Phone / Telegram *</label>
                <input v-model="applyForm.phone" required type="tel" placeholder="012 345 678" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" />
              </div>
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">Email</label>
                <input v-model="applyForm.email" type="email" placeholder="name@example.com" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">Attach CV (.pdf, .docx) *</label>
              <div class="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center hover:bg-slate-50 transition-colors">
                <input type="file" accept=".pdf,.doc,.docx" @change="handleCvFileChange" class="absolute inset-0 opacity-0 cursor-pointer" />
                <div class="flex items-center justify-center gap-2 text-slate-500">
                  <UploadCloud class="w-4 h-4 text-[#0D47A1]" />
                  <span v-if="applyForm.cvFileName" class="text-xs font-bold text-emerald-600">✓ {{ applyForm.cvFileName }}</span>
                  <span v-else class="text-xs">Click or drag CV file here</span>
                </div>
              </div>
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button @click="closeApplyModal" type="button" class="px-4 py-2 text-slate-500 font-bold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-lg bg-[#003366] text-white font-bold text-xs cursor-pointer flex items-center gap-1.5">
                <Send class="w-3 h-3" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

    <!-- POST AD MODAL (Employer Posting) -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isPostAdModalOpen"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-khmer"
        @click.self="isPostAdModalOpen = false"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <button @click="isPostAdModalOpen = false" class="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer" type="button">
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1">
            <h3 class="text-base font-black text-slate-900 dark:text-white">Post Classified Ad / Register CV</h3>
            <p class="text-xs text-slate-500">Reach thousands of Cambodian jobseekers & recruiters</p>
          </div>

          <div v-if="isPostAdSubmitted" class="py-6 text-center space-y-2">
            <CheckCircle2 class="w-10 h-10 text-emerald-500 mx-auto" />
            <h4 class="text-sm font-black">Job Ad Published Successfully!</h4>
            <p class="text-xs text-slate-500">Your job posting for <strong>{{ postAdForm.jobTitle }}</strong> at <strong>{{ postAdForm.companyName }}</strong> is now live on the Latest Jobs feed.</p>
            <button @click="isPostAdModalOpen = false; isPostAdSubmitted = false" class="px-4 py-1.5 bg-[#003366] text-white font-bold text-xs rounded cursor-pointer">View Feed</button>
          </div>

          <form v-else @submit.prevent="submitPostAd" class="space-y-3 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">Company Name *</label>
              <input v-model="postAdForm.companyName" required type="text" placeholder="e.g. ABA Bank / ETEC Center" class="w-full px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold" />
            </div>
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">Job Title *</label>
              <input v-model="postAdForm.jobTitle" required type="text" placeholder="e.g. Senior Accountant / IT Support" class="w-full px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold" />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">Contact Phone *</label>
                <input v-model="postAdForm.contactPhone" required type="tel" placeholder="012 345 678" class="w-full px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold" />
              </div>
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">Salary Range</label>
                <input v-model="postAdForm.salary" type="text" placeholder="$600 - $1,200/month" class="w-full px-3 py-1.5 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold" />
              </div>
            </div>
            <div class="pt-2 flex justify-end gap-2">
              <button @click="isPostAdModalOpen = false" type="button" class="px-3 py-1.5 text-slate-500 font-bold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded cursor-pointer">Publish Ad Now</button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </div>
</template>
