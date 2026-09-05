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
  DollarSign,
  Award,
  LayoutGrid,
  List,
  Zap,
  UploadCloud,
  Send,
  X,
  Calendar,
  Hash,
  Link as LinkIcon,
  Tag,
  FileSpreadsheet,
  GraduationCap,
  Briefcase
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
  title: 'ឱកាសការងារចុងក្រោយ — BongThom Style Careers Portal',
  description: 'ស្វែងរកឱកាសការងារ ការងារក្រៅម៉ោង កម្មសិក្សា និងអាហារូបករណ៍ពីស្ថាប័ន និងក្រុមហ៊ុនឈានមុខនៅកម្ពុជា'
})

const allJobs = getJobs()

// Primary Search & Filters State
const searchQuery = ref('')
const activeLocation = ref('All')
const activeCategory = ref('All')
const activeQuickLink = ref('all') // 'all' | 'jobs' | 'internships' | 'consultancies' | 'parttime' | 'shortterm'
const activeType = ref('All')
const sortBy = ref<'newest' | 'salary' | 'company' | 'deadline'>('newest')
const viewMode = ref<'list' | 'grid'>('list')

// Accordion Collapsible States for Left Sidebar (BongThom style)
const isRecentSearchOpen = ref(true)
const isQuickLinksOpen = ref(true)
const isCategoryOpen = ref(true)

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

// Quick Links Menu (BongThom Sidebar Quick Links)
const quickLinks = computed(() => [
  { id: 'all', labelEn: 'All Opportunities', labelKh: 'ឱកាសទាំងអស់', icon: Briefcase },
  { id: 'jobs', labelEn: 'Job Opportunities', labelKh: 'ឱកាសការងារ', icon: Briefcase },
  { id: 'internships', labelEn: 'Internships', labelKh: 'កម្មសិក្សា', icon: GraduationCap },
  { id: 'consultancies', labelEn: 'Consultancies', labelKh: 'ការពិគ្រោះយោបល់', icon: FileSpreadsheet },
  { id: 'scholarships', labelEn: 'Scholarships', labelKh: 'អាហារូបករណ៍', icon: Award },
  { id: 'parttime', labelEn: 'Part-Time Jobs', labelKh: 'ការងារក្រៅម៉ោង', icon: Clock },
  { id: 'shortterm', labelEn: 'Short-Term Jobs', labelKh: 'ការងាររយៈពេលខ្លី', icon: Zap }
])

// Categories metadata with count pills (BongThom Career Categories)
const categories = computed(() => {
  const meta = [
    { value: 'All', labelKh: 'គ្រប់វិស័យ', labelEn: 'All Categories', countMult: 1 },
    { value: 'IT', labelKh: 'បច្ចេកវិទ្យា & IT (Information Tech)', labelEn: 'Information Technology / IT', baseCount: 84 },
    { value: 'Finance', labelKh: 'ធនាគារ & ហិរញ្ញវត្ថុ (Banking/Finance)', labelEn: 'Banking & Finance', baseCount: 62 },
    { value: 'Education', labelKh: 'អប់រំ/បណ្តុះបណ្តាល (Educate/Train)', labelEn: 'Educate/Train/Teaching', baseCount: 100 },
    { value: 'Healthcare', labelKh: 'សុខាភិបាល (Healthcare/Medical)', labelEn: 'Healthcare & Medical', baseCount: 45 },
    { value: 'Hospitality', labelKh: 'ទេសចរណ៍ & សណ្ឋាគារ (Tourism/Hotel)', labelEn: 'Hospitality & Tourism', baseCount: 38 },
    { value: 'Marketing', labelKh: 'ទីផ្សារ (Marketing/Media)', labelEn: 'Marketing & Media', baseCount: 22 },
    { value: 'Engineering', labelKh: 'វិស្វកម្ម & សំណង់ (Engineering)', labelEn: 'Engineering & Construction', baseCount: 29 },
    { value: 'Other', labelKh: 'ផ្សេងៗ (Business Admin / Other)', labelEn: 'Business Administration / Other', baseCount: 136 }
  ]

  return meta.map(cat => {
    const actualCount = cat.value === 'All'
      ? allJobs.length
      : allJobs.filter(j => j.category.toLowerCase() === cat.value.toLowerCase()).length
    const count = (cat.baseCount || 0) + actualCount
    return {
      ...cat,
      label: currentLanguage.value === 'kh' ? cat.labelKh : cat.labelEn,
      count
    }
  })
})

// Generate realistic BongThom Job ID (e.g. #40967) based on job ID hash
function getBongThomJobId(job: Job): string {
  let hash = 0
  for (let i = 0; i < job.id.length; i++) {
    hash = (hash << 5) - hash + job.id.charCodeAt(i)
    hash |= 0
  }
  const idNum = 40000 + (Math.abs(hash) % 1500)
  return `#${idNum}`
}

// Generate realistic BongThom duration remaining (e.g. "25 days left" / "២៥ ថ្ងៃទៀត")
function getBongThomDaysLeft(job: Job): { daysEn: string; daysKh: string; daysNum: number } {
  let hash = 0
  for (let i = 0; i < job.id.length; i++) {
    hash = (hash << 3) + job.id.charCodeAt(i)
  }
  const days = 5 + (Math.abs(hash) % 25)
  return {
    daysEn: `${days} days left`,
    daysKh: `${days} ថ្ងៃទៀត`,
    daysNum: days
  }
}

// Generate BongThom closing date (e.g. "8-Sep-2026")
function getBongThomClosingDate(job: Job): string {
  const dateObj = new Date(job.postedDate)
  dateObj.setDate(dateObj.getDate() + 30)
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
  activeQuickLink.value = linkId
  if (linkId === 'internships') {
    activeType.value = 'Internship'
  } else if (linkId === 'parttime') {
    activeType.value = 'Part-time'
  } else {
    activeType.value = 'All'
  }
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

const filteredJobs = computed(() => {
  let result = [...allJobs]

  // Location filter
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

  // Category filter
  if (activeCategory.value !== 'All') {
    result = result.filter(j => j.category.toLowerCase() === activeCategory.value.toLowerCase())
  }

  // Job Type filter
  if (activeType.value !== 'All') {
    result = result.filter(j => j.type.toLowerCase() === activeType.value.toLowerCase())
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
  showingFrom,
  showingTo,
  totalItems,
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
    activeQuickLink.value !== 'all'
  )
})

function resetFilters() {
  searchQuery.value = ''
  activeLocation.value = 'All'
  activeCategory.value = 'All'
  activeType.value = 'All'
  activeQuickLink.value = 'all'
  sortBy.value = 'newest'
}

// ==========================================
// QUICK APPLY MODAL LOGIC (Easy Application)
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
// POST CLASSIFIED AD MODAL (For Employers)
// ==========================================
const isPostAdModalOpen = ref(false)
const postAdForm = ref({
  companyName: '',
  jobTitle: '',
  contactPhone: '',
  email: '',
  category: 'IT'
})
const isPostAdSubmitted = ref(false)

function submitPostAd() {
  if (!postAdForm.value.companyName || !postAdForm.value.jobTitle) return
  isPostAdSubmitted.value = true
}
</script>

<template>
  <div class="bongthom-jobs-portal min-h-screen pb-20 text-[#0A2540] dark:text-white font-khmer bg-slate-100/70 dark:bg-slate-950">
    
    <!-- ============================================================ -->
    <!-- 1. BONGTHOM TOP CLASSIFIEDS ANNOUNCEMENT BANNER             -->
    <!-- ============================================================ -->
    <div class="bg-gradient-to-r from-[#003366] via-[#0D47A1] to-[#1565C0] text-white py-3 px-4 sm:px-8 shadow-md">
      <div class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div class="flex items-center gap-3">
          <span class="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-amber-300 font-black text-sm shrink-0">
            📢
          </span>
          <div>
            <p class="text-xs sm:text-sm font-black tracking-wide text-white">
              {{ currentLanguage === 'kh' ? 'ចុះផ្សាយការងារ និងប្រកាសជ្រើសរើសបុគ្គលិកឥឡូវនេះ !!!' : 'Post classified ads now !!!' }}
            </p>
            <p class="text-[11px] text-blue-200 font-medium">
              {{ currentLanguage === 'kh' ? 'ឈានទៅដល់បេក្ខជនរាប់ម៉ឺននាក់ទូទាំងប្រទេសកម្ពុជា' : 'Reach thousands of qualified jobseekers across Cambodia' }}
            </p>
          </div>
        </div>

        <button
          @click="isPostAdModalOpen = true"
          type="button"
          class="px-5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-black shadow-md transition-all cursor-pointer shrink-0"
        >
          {{ currentLanguage === 'kh' ? 'ចុះផ្សាយការងារឥឡូវនេះ' : 'Post Classified Ad Now' }}
        </button>
      </div>
    </div>

    <!-- Main Container -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
      
      <!-- Integrated Top Search Bar -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl p-3 shadow-md border border-slate-200 dark:border-slate-800">
        <div class="flex flex-col lg:flex-row items-stretch lg:items-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100 dark:divide-slate-800 gap-2 lg:gap-0">
          
          <!-- Search Input -->
          <div class="flex-1 flex items-center px-3 py-2 gap-2.5 min-w-0">
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

          <!-- 25 Cambodian Provinces Popover Selector -->
          <div class="relative jobs-location-dropdown-container px-3 py-2 lg:w-72 shrink-0">
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

          <!-- Search Button -->
          <div class="p-1 shrink-0">
            <button
              @click="scrollToResults"
              type="button"
              class="w-full lg:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#003366] hover:bg-[#0A2E6E] text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <Search class="w-4 h-4" />
              <span>{{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}</span>
            </button>
          </div>

        </div>
      </div>

      <!-- ============================================================ -->
      <!-- 2. BONGTHOM TWO-COLUMN PORTAL LAYOUT                         -->
      <!-- ============================================================ -->
      <div id="bongthom-jobs-feed" class="scroll-mt-24 grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        <!-- ========================================================== -->
        <!-- LEFT SIDEBAR: BONGTHOM ACCORDION CARDS                     -->
        <!-- ========================================================== -->
        <aside class="lg:col-span-1 space-y-4">
          
          <!-- Card 1: Recent Search History -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <button
              @click="isRecentSearchOpen = !isRecentSearchOpen"
              type="button"
              class="w-full flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <span class="flex items-center gap-2">
                <Search class="w-4 h-4 text-slate-400" />
                <span>{{ currentLanguage === 'kh' ? 'ប្រវត្តិស្វែងរកចុងក្រោយ' : 'Recent Search History' }}</span>
              </span>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isRecentSearchOpen }" />
            </button>

            <div v-if="isRecentSearchOpen" class="p-3.5 text-xs text-slate-400 italic text-center">
              {{ searchQuery ? `"${searchQuery}"` : (currentLanguage === 'kh' ? 'មិនទាន់មានប្រវត្តិស្វែងរកនៅឡើយទេ' : 'No recent searches have been made') }}
            </div>
          </div>

          <!-- Card 2: Quick Links (BongThom Menu) -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <button
              @click="isQuickLinksOpen = !isQuickLinksOpen"
              type="button"
              class="w-full flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <span class="flex items-center gap-2">
                <LinkIcon class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
                <span>{{ currentLanguage === 'kh' ? 'តំណភ្ជាប់រហ័ស' : 'Quick Links' }}</span>
              </span>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isQuickLinksOpen }" />
            </button>

            <div v-if="isQuickLinksOpen" class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
              <button
                v-for="ql in quickLinks"
                :key="ql.id"
                @click="selectQuickLinkFilter(ql.id)"
                type="button"
                :class="[
                  'w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer',
                  activeQuickLink === ql.id
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-semibold'
                ]"
              >
                <span>{{ currentLanguage === 'kh' ? ql.labelKh : ql.labelEn }}</span>
                <Check v-if="activeQuickLink === ql.id" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
              </button>
            </div>
          </div>

          <!-- Card 3: Career Category (BongThom Categories with Pill Counts) -->
          <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
            <button
              @click="isCategoryOpen = !isCategoryOpen"
              type="button"
              class="w-full flex items-center justify-between p-3.5 bg-slate-50/80 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 cursor-pointer select-none"
            >
              <span class="flex items-center gap-2">
                <Tag class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{{ currentLanguage === 'kh' ? 'ប្រភេទវិស័យការងារ' : 'Career Category' }}</span>
              </span>
              <ChevronDown class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200" :class="{ 'rotate-180': !isCategoryOpen }" />
            </button>

            <div v-if="isCategoryOpen" class="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs max-h-80 overflow-y-auto custom-scrollbar">
              <button
                v-for="cat in categories"
                :key="cat.value"
                @click="selectCategoryFilter(cat.value)"
                type="button"
                :class="[
                  'w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors cursor-pointer',
                  activeCategory === cat.value
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                ]"
              >
                <span class="truncate pr-2">{{ cat.label }}</span>
                <!-- BongThom Style Dark Pill Badge Count -->
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-700 text-white dark:bg-slate-700 dark:text-slate-100 shrink-0">
                  {{ cat.count }}
                </span>
              </button>
            </div>
          </div>

        </aside>

        <!-- ========================================================== -->
        <!-- RIGHT MAIN FEED: BONGTHOM LATEST JOBS LIST                 -->
        <!-- ========================================================== -->
        <main class="lg:col-span-3 space-y-4">
          
          <!-- Feed Header: "Latest Jobs" + View Switcher + Sort -->
          <div class="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-3">
            
            <div class="flex items-center gap-3">
              <h2 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {{ currentLanguage === 'kh' ? 'ឱកាសការងារចុងក្រោយ (Latest Jobs)' : 'Latest Jobs' }}
              </h2>
              <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200/80 dark:border-blue-900">
                {{ filteredJobs.length }} {{ currentLanguage === 'kh' ? 'កន្លែង' : 'Jobs' }}
              </span>
            </div>

            <div class="flex items-center gap-3">
              <!-- Reset Filters -->
              <button
                v-if="hasActiveFilters"
                @click="resetFilters"
                class="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 cursor-pointer"
                type="button"
              >
                {{ currentLanguage === 'kh' ? 'សម្អាតតម្រង' : 'Clear Filters' }}
              </button>

              <!-- View Switcher (List vs Grid) -->
              <div class="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700">
                <button
                  @click="viewMode = 'list'"
                  :class="[
                    'p-1.5 rounded-lg transition-all cursor-pointer',
                    viewMode === 'list'
                      ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-white shadow-2xs font-bold'
                      : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  ]"
                  title="List View (BongThom Style)"
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
                  class="bg-slate-50 dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 focus:outline-hidden cursor-pointer shadow-2xs pr-7 appearance-none font-khmer"
                >
                  <option value="newest">{{ currentLanguage === 'kh' ? '🆕 ថ្មីៗបំផុត' : 'Newest' }}</option>
                  <option value="deadline">{{ currentLanguage === 'kh' ? '⏳ ជិតផុតកំណត់' : 'Closing Soon' }}</option>
                  <option value="salary">{{ currentLanguage === 'kh' ? '💰 ប្រាក់ខែខ្ពស់' : 'Highest Salary' }}</option>
                  <option value="company">{{ currentLanguage === 'kh' ? '🏢 ក្រុមហ៊ុន A-Z' : 'Company A-Z' }}</option>
                </select>
                <ChevronDown class="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2" />
              </div>
            </div>

          </div>

          <!-- ======================================================== -->
          <!-- BONGTHOM JOB ROW LIST (EXACT BONGTHOM.COM LAYOUT)       -->
          <!-- ======================================================== -->
          <div v-if="paginatedJobs.length > 0 && viewMode === 'list'" class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl divide-y divide-slate-150 dark:divide-slate-800 overflow-hidden shadow-xs">
            
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="group p-4 sm:p-5 hover:bg-blue-50/50 dark:hover:bg-slate-800/60 transition-all duration-150 flex flex-col sm:flex-row items-start justify-between gap-4"
            >
              <!-- Left: Square Company Logo Frame + Content -->
              <div class="flex items-start gap-3.5 min-w-0 flex-1">
                
                <!-- BongThom Square Logo Frame -->
                <div class="w-14 h-14 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform overflow-hidden">
                  <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" loading="lazy" />
                  <span v-else class="font-black text-lg text-[#0D47A1] dark:text-blue-400">{{ job.company.charAt(0) }}</span>
                </div>

                <!-- Middle Details -->
                <div class="space-y-1.5 min-w-0 flex-1">
                  
                  <!-- Clickable Blue Job Title -->
                  <router-link :to="'/jobs/' + job.id" class="inline-block">
                    <h3 class="text-base sm:text-lg font-black text-[#0D47A1] dark:text-blue-400 group-hover:underline transition-colors leading-snug">
                      {{ job.title }}
                    </h3>
                  </router-link>

                  <!-- Company Full Name -->
                  <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                    {{ job.company }}
                  </p>

                  <!-- BongThom Metadata Line: Job ID | Days Left | Expiry Date | Salary | Location -->
                  <div class="flex flex-wrap items-center gap-3 text-xs pt-1">
                    
                    <!-- Job ID Badge (BongThom style: e.g. #40967) -->
                    <span class="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
                      <Hash class="w-3 h-3 text-slate-400" />
                      <span>{{ getBongThomJobId(job) }}</span>
                    </span>

                    <!-- Duration Remaining (e.g. 25 days left) -->
                    <span class="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900">
                      <Clock class="w-3 h-3 text-amber-500" />
                      <span>{{ currentLanguage === 'kh' ? getBongThomDaysLeft(job).daysKh : getBongThomDaysLeft(job).daysEn }}</span>
                    </span>

                    <!-- Closing Expiry Date (e.g. 8-Sep-2026) -->
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      <Calendar class="w-3.5 h-3.5 text-slate-400" />
                      <span>{{ getBongThomClosingDate(job) }}</span>
                    </span>

                    <!-- Salary Pill -->
                    <span class="inline-flex items-center gap-1 text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900">
                      <DollarSign class="w-3 h-3 text-emerald-600" />
                      <span>{{ job.salary }}</span>
                    </span>

                    <!-- Location -->
                    <span class="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                      <MapPin class="w-3.5 h-3.5 text-rose-500" />
                      <span>{{ job.location }}</span>
                    </span>

                  </div>

                </div>

              </div>

              <!-- Right: Bookmark, Category Icon & Quick Apply Button -->
              <div class="w-full sm:w-auto flex items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0">
                
                <!-- Bookmark Button -->
                <button
                  @click.stop="toggleSaveJob(job.id)"
                  :class="[
                    'p-2 rounded-xl border transition-all cursor-pointer',
                    isJobSaved(job.id)
                      ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 border-blue-200 dark:border-blue-800'
                      : 'border-slate-200 dark:border-slate-700 text-slate-400 hover:text-[#0D47A1]'
                  ]"
                  :title="isJobSaved(job.id) ? 'Saved' : 'Save Job'"
                  type="button"
                >
                  <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1] dark:text-blue-400" />
                  <Bookmark v-else class="w-4 h-4" />
                </button>

                <!-- Quick Apply Button -->
                <button
                  @click="openApplyModal(job)"
                  type="button"
                  class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#003366] hover:bg-[#0A2E6E] text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
                >
                  <Zap class="w-3.5 h-3.5 text-amber-300" />
                  <span>{{ currentLanguage === 'kh' ? 'ដាក់ពាក្យរហ័ស' : 'Apply' }}</span>
                </button>

              </div>

            </div>

          </div>

          <!-- ======================================================== -->
          <!-- BONGTHOM JOB GRID VIEW                                   -->
          <!-- ======================================================== -->
          <div v-else-if="paginatedJobs.length > 0 && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div
              v-for="job in paginatedJobs"
              :key="job.id"
              class="group bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs hover:shadow-md hover:border-blue-500/40 transition-all duration-200 flex flex-col justify-between"
            >
              <div class="space-y-3">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-center gap-3 min-w-0">
                    <div class="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-700 bg-white p-1 flex items-center justify-center shrink-0 overflow-hidden">
                      <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" />
                      <span v-else class="font-black text-[#0D47A1] text-lg">{{ job.company.charAt(0) }}</span>
                    </div>
                    <div class="min-w-0">
                      <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ job.company }}</p>
                      <span class="text-[10px] text-slate-400 font-semibold">{{ getBongThomJobId(job) }}</span>
                    </div>
                  </div>

                  <button
                    @click.stop="toggleSaveJob(job.id)"
                    :class="[
                      'p-2 rounded-xl border transition-all cursor-pointer',
                      isJobSaved(job.id) ? 'bg-blue-50 text-[#0D47A1] border-blue-200' : 'border-slate-200 text-slate-400'
                    ]"
                    type="button"
                  >
                    <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1]" />
                    <Bookmark v-else class="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <router-link :to="'/jobs/' + job.id">
                    <h3 class="text-sm font-black text-[#0D47A1] dark:text-blue-400 group-hover:underline line-clamp-2 leading-snug">
                      {{ job.title }}
                    </h3>
                  </router-link>
                </div>

                <div class="flex flex-wrap items-center gap-2 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
                  <span class="text-[11px] font-bold text-amber-700 dark:text-amber-400">
                    🕒 {{ currentLanguage === 'kh' ? getBongThomDaysLeft(job).daysKh : getBongThomDaysLeft(job).daysEn }}
                  </span>
                  <span class="text-[11px] text-slate-500">
                    📅 {{ getBongThomClosingDate(job) }}
                  </span>
                </div>
              </div>

              <div class="pt-3 mt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <span class="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-black text-xs border border-emerald-200">
                  {{ job.salary }}
                </span>

                <button
                  @click="openApplyModal(job)"
                  type="button"
                  class="px-3 py-1.5 bg-[#003366] text-white rounded-xl text-xs font-black cursor-pointer"
                >
                  {{ currentLanguage === 'kh' ? 'ដាក់ពាក្យ' : 'Apply' }}
                </button>
              </div>

            </div>

          </div>

          <!-- Empty State -->
          <div v-else class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-8 sm:p-12 text-center shadow-xs">
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

    </div>

    <!-- ============================================================ -->
    <!-- INTERACTIVE QUICK APPLY MODAL (BongThom Easy Apply)          -->
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
              <span>{{ currentLanguage === 'kh' ? 'ការដាក់ពាក្យរហ័ស (BongThom Easy Apply)' : 'Easy Application' }}</span>
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
                  : `The hiring team at ${selectedJobForApply.company} will review your application and contact you soon.`
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
                  <UploadCloud class="w-6 h-6 text-[#0D47A1] dark:text-blue-400" />
                  <p v-if="applyForm.cvFileName" class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ {{ applyForm.cvFileName }}
                  </p>
                  <p v-else class="text-xs font-medium">
                    {{ currentLanguage === 'kh' ? 'ចុចទីនេះដើម្បីជ្រើសរើសឯកសារ CV របស់អ្នក' : 'Click or drag CV file here' }}
                  </p>
                </div>
              </div>
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

    <!-- POST CLASSIFIED AD MODAL -->
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
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-5">
          <button @click="isPostAdModalOpen = false" class="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-colors cursor-pointer" type="button">
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1 pr-8">
            <h3 class="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ចុះផ្សាយការងារ (BongThom Classified Ads)' : 'Post Classified Ad Now' }}
            </h3>
            <p class="text-xs text-slate-500">
              {{ currentLanguage === 'kh' ? 'ផ្សព្វផ្សាយការងារទៅកាន់បេក្ខជនរាប់ម៉ឺននាក់ទូទាំងប្រទេស' : 'Reach thousands of Cambodian jobseekers' }}
            </p>
          </div>

          <div v-if="isPostAdSubmitted" class="py-8 text-center space-y-3">
            <CheckCircle2 class="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 class="text-base font-black text-slate-900 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ការចុះផ្សាយត្រូវបានទទួលជោគជ័យ!' : 'Ad Posted Successfully!' }}
            </h4>
            <button @click="isPostAdModalOpen = false; isPostAdSubmitted = false" class="px-5 py-2 rounded-xl bg-[#003366] text-white font-bold text-xs cursor-pointer">
              {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
            </button>
          </div>

          <form v-else @submit.prevent="submitPostAd" class="space-y-3 text-xs font-khmer">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'ឈ្មោះក្រុមហ៊ុន / ស្ថាប័ន *' : 'Company Name *' }}</label>
              <input v-model="postAdForm.companyName" required type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>

            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'មុខតំណែង *' : 'Job Title *' }}</label>
              <input v-model="postAdForm.jobTitle" required type="text" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទទាក់ទង *' : 'Contact Phone *' }}</label>
                <input v-model="postAdForm.contactPhone" required type="tel" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'អ៊ីមែល HR' : 'HR Email' }}</label>
                <input v-model="postAdForm.email" type="email" class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div class="pt-3 flex justify-end gap-2">
              <button @click="isPostAdModalOpen = false" type="button" class="px-4 py-2 text-slate-500 font-bold cursor-pointer">{{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}</button>
              <button type="submit" class="px-6 py-2 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black rounded-xl cursor-pointer">{{ currentLanguage === 'kh' ? 'ចុះផ្សាយឥឡូវនេះ' : 'Publish Ad' }}</button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>
