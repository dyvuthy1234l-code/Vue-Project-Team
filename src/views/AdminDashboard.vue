<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  LayoutDashboard,
  FileText,
  Hospital as HospitalIcon,
  Briefcase,
  Bus,
  Home,
  Building2,
  Newspaper,
  Users,
  MessageSquare,
  Settings,
  ShieldAlert,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Search,
  Bell,
  Globe,
  ChevronDown,
  Calendar,
  CheckCircle2,
  Plus,
  Trash2,
  Check,
  Sparkles,
  MapPin,
  DollarSign,
  Phone,
  Eye,
  Wrench,
  Construction,
  Clock
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useFeedback } from '@/composables/useFeedback'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'
import {
  getGovernmentServices,
  getHospitals,
  getJobs,
  getHomeServices,
  getTransport,
  getNews,
  getLocations
} from '@/services/dataService'
import type { Job, HomeService } from '@/types'

const router = useRouter()
const { currentLanguage, setLanguage, localized } = useLanguage()
const { currentUser, logout } = useAuth()
const { reports, updateReportStatus } = useFeedback()

usePageMeta({
  title: 'CamLife Admin CMS — Management Portal',
  description: 'Manage citizen public services, health directory, jobs board, reports and user access.'
})

// RBAC Check
const isAdmin = computed(() => {
  if (!currentUser.value) return false
  const role = currentUser.value.role || ''
  return role === 'Administrator' || role === 'Admin'
})

// Navigation Tabs
type AdminNavTab =
  | 'dashboard'
  | 'government'
  | 'health'
  | 'jobs'
  | 'transport'
  | 'homeservices'
  | 'offices'
  | 'news'
  | 'users'
  | 'feedback'
  | 'settings'
  | 'logs'

const activeTab = ref<AdminNavTab>('dashboard')
const isSidebarOpen = ref(true)
const isMobileSidebarOpen = ref(false)

// Notifications State
const isNotifDropdownOpen = ref(false)
const isProfileDropdownOpen = ref(false)
const isLanguageDropdownOpen = ref(false)
const isSearchModalOpen = ref(false)
const globalSearchQuery = ref('')

// Toast Notification
const toastMessage = ref('')
function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3500)
}

// -------------------------------------------------------------
// REAL DATA SOURCES & LOCAL STORAGE PERSISTENCE
// -------------------------------------------------------------
const governmentServices = getGovernmentServices()
const hospitals = getHospitals()
const transportList = getTransport()
const newsList = getNews()
const locationsList = getLocations()

// Load jobs merging built-in data + user/admin posted jobs from localStorage
function loadAllJobs(): Job[] {
  const base = getJobs()
  try {
    const saved = localStorage.getItem('camlife_user_jobs')
    if (saved) {
      const parsed: Job[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {
    // fallback
  }
  return [...base]
}

// Load home specialists merging built-in data + admin added specialists from localStorage
function loadAllHomeServices(): HomeService[] {
  const base = getHomeServices()
  try {
    const saved = localStorage.getItem('camlife_custom_home_services')
    if (saved) {
      const parsed: HomeService[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {
    // fallback
  }
  return [...base]
}

const adminJobs = ref<Job[]>(loadAllJobs())
const adminHomeServices = ref<HomeService[]>(loadAllHomeServices())

// Timeframe selector for Service Usage chart
const usageTimeframe = ref<'30days' | '7days' | 'year'>('30days')

// Dynamic KPI metric values from REAL data
const totalServicesCount = computed(() => governmentServices.length + hospitals.length + transportList.length + adminHomeServices.value.length)
const activeJobsCount = computed(() => adminJobs.value.length)
const locationsCount = computed(() => locationsList.length)
const newsCount = computed(() => newsList.length)
const totalUsersCount = computed(() => '12,458')

// Service Usage Chart Data bound to category distributions
const serviceUsageStats = computed(() => [
  { name: 'Government', nameKh: 'រដ្ឋបាល', views: `${governmentServices.length * 2.5}K`, heightPercent: 85, color: '#2563EB', textColor: 'text-blue-600' },
  { name: 'Healthcare', nameKh: 'សុខាភិបាល', views: `${hospitals.length}K`, heightPercent: 65, color: '#14B8A6', textColor: 'text-teal-600' },
  { name: 'Jobs', nameKh: 'ការងារ', views: `${adminJobs.value.length * 1.5}K`, heightPercent: 55, color: '#0284C7', textColor: 'text-sky-600' },
  { name: 'Transport', nameKh: 'ដឹកជញ្ជូន', views: `${transportList.length * 2}K`, heightPercent: 42, color: '#8B5CF6', textColor: 'text-purple-600' },
  { name: 'Home Services', nameKh: 'សេវាតាមផ្ទះ', views: `${adminHomeServices.value.length * 1.2}K`, heightPercent: 35, color: '#06B6D4', textColor: 'text-cyan-600' },
  { name: 'Offices', nameKh: 'ការិយាល័យ', views: `${locationsList.length}K`, heightPercent: 28, color: '#F59E0B', textColor: 'text-amber-600' },
  { name: 'News', nameKh: 'ព័ត៌មាន', views: `${newsList.length * 1.5}K`, heightPercent: 22, color: '#818CF8', textColor: 'text-indigo-600' },
  { name: 'Emergency', nameKh: 'បន្ទាន់', views: '6K', heightPercent: 16, color: '#F43F5E', textColor: 'text-rose-600' }
])

// Live Activity Feed
const activities = ref([
  {
    id: 'act-1',
    title: 'Government service updated',
    titleKh: 'បានកែប្រែសេវាសាធារណៈ',
    detail: governmentServices[0]?.title || 'Cambodian Passport Guide',
    detailKh: governmentServices[0]?.titleKh || 'មគ្គុទ្ទេសក៍ធ្វើលិខិតឆ្លងដែន',
    time: '5 minutes ago',
    timeKh: '៥ នាទីមុន',
    color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
  },
  {
    id: 'act-2',
    title: 'New job submitted',
    titleKh: 'មានការងារថ្មីបានដាក់ស្នើ',
    detail: adminJobs.value[0]?.title || 'Senior Frontend Developer',
    detailKh: adminJobs.value[0]?.title || 'អ្នកអភិវឌ្ឍ Frontend',
    time: '20 minutes ago',
    timeKh: '២០ នាទីមុន',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
  },
  {
    id: 'act-3',
    title: 'Location verified',
    titleKh: 'បានផ្ទៀងផ្ទាត់ទីតាំង',
    detail: locationsList[0]?.name || 'OWSO Daun Penh',
    detailKh: locationsList[0]?.nameKh || 'ច្រកចេញចូលតែមួយ ដូនពេញ',
    time: '1 hour ago',
    timeKh: '១ ម៉ោងមុន',
    color: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
  },
  {
    id: 'act-4',
    title: 'News bulletin published',
    titleKh: 'បានផ្សព្វផ្សាយព័ត៌មានថ្មី',
    detail: newsList[0]?.title || 'New transport policy',
    detailKh: newsList[0]?.titleKh || 'គោលនយោបាយដឹកជញ្ជូនថ្មី',
    time: '2 hours ago',
    timeKh: '២ ម៉ោងមុន',
    color: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
  },
  {
    id: 'act-5',
    title: 'Citizen report logged',
    titleKh: 'មានពលរដ្ឋរាយការណ៍បញ្ហា',
    detail: reports.value[0]?.serviceTitle || 'Public Service Fee Verification',
    detailKh: reports.value[0]?.serviceTitle || 'ផ្ទៀងផ្ទាត់តម្លៃសេវាសាធារណៈ',
    time: '3 hours ago',
    timeKh: '៣ ម៉ោងមុន',
    color: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
  }
])

// Pending Approvals Queue
const pendingApprovals = ref([
  {
    id: 'p-1',
    type: 'job',
    title: 'Job: Senior Vue.js Developer',
    titleKh: 'ការងារ: Senior Vue.js Developer',
    entity: 'Wing Bank (Cambodia)',
    time: 'Submitted 10 min ago',
    timeKh: 'បានដាក់ស្នើ ១០ នាទីមុន',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
  },
  {
    id: 'p-2',
    type: 'news',
    title: 'News: New Health Guidelines 2026',
    titleKh: 'ព័ត៌មាន: គោលការណ៍ណែនាំសុខភាពថ្មី ២០២៦',
    entity: 'Ministry of Health',
    time: 'Submitted 1 hour ago',
    timeKh: 'បានដាក់ស្នើ ១ ម៉ោងមុន',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
  },
  {
    id: 'p-3',
    type: 'location',
    title: 'Location: Sen Sok Referral Clinic',
    titleKh: 'ទីតាំង: មជ្ឈមណ្ឌលសុខភាពសែនសុខ',
    entity: 'Sangkat Phnom Penh Thmei',
    time: 'Submitted 2 hours ago',
    timeKh: 'បានដាក់ស្នើ ២ ម៉ោងមុន',
    iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400'
  }
])

function handleApprovePending(id: string) {
  const item = pendingApprovals.value.find(p => p.id === id)
  if (item) {
    if (item.type === 'job') {
      const approvedJob: Job = {
        id: 'job-approved-' + Date.now(),
        title: 'Senior Vue.js Developer',
        titleKh: 'អ្នកអភិវឌ្ឍជាន់ខ្ពស់ Senior Vue.js Developer',
        company: 'Wing Bank (Cambodia)',
        category: 'IT',
        location: 'Phnom Penh',
        salary: '$1,500 - $2,500',
        salaryMin: 1500,
        salaryMax: 2500,
        type: 'Full-time',
        postedDate: 'Today',
        description: 'Position reviewed and approved by CamLife Administrator.',
        descriptionKh: 'ការងារត្រូវបានត្រួតពិនិត្យ និងអនុម័តដោយរដ្ឋបាល CamLife។',
        requirements: ['3+ years Vue/TypeScript experience', 'RESTful API integration', 'Good English'],
        benefits: ['13th-month bonus', 'Health insurance', 'Provident fund'],
        applyUrl: '#'
      }
      adminJobs.value.unshift(approvedJob)
      try {
        const existingStr = localStorage.getItem('camlife_user_jobs')
        const existing: Job[] = existingStr ? JSON.parse(existingStr) : []
        existing.unshift(approvedJob)
        localStorage.setItem('camlife_user_jobs', JSON.stringify(existing))
      } catch {}
    }

    pendingApprovals.value = pendingApprovals.value.filter(p => p.id !== id)
    activities.value.unshift({
      id: 'act-' + Date.now(),
      title: 'Item approved by Admin',
      titleKh: 'Admin បានអនុម័តសំណើ',
      detail: item.title,
      detailKh: item.titleKh,
      time: 'Just now',
      timeKh: 'ទើបតែឥឡូវនេះ',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400'
    })
    showToast(currentLanguage.value === 'kh' ? `បានអនុម័ត ${item.titleKh} និងផ្សាយលើ Website ភ្លាមៗ!` : `Approved ${item.title} and published live!`)
  }
}

function handleRejectPending(id: string) {
  const item = pendingApprovals.value.find(p => p.id === id)
  if (item) {
    pendingApprovals.value = pendingApprovals.value.filter(p => p.id !== id)
    showToast(currentLanguage.value === 'kh' ? `បានបដិសេធ ${item.titleKh}!` : `Rejected ${item.title}!`)
  }
}

// REAL RECENT SERVICES BOUND DIRECTLY TO CAMLIFE DATA
const recentServices = computed(() => [
  {
    id: governmentServices[0]?.id || 'id-card',
    name: governmentServices[0]?.title || 'National ID Card',
    nameKh: governmentServices[0]?.titleKh || 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ',
    category: 'Government',
    categoryKh: 'រដ្ឋបាល',
    status: 'Published',
    statusKh: 'បានផ្សាយ',
    updated: 'Today',
    updatedKh: 'ថ្ងៃនេះ',
    route: `/government/${governmentServices[0]?.id || ''}`
  },
  {
    id: governmentServices[1]?.id || 'passport',
    name: governmentServices[1]?.title || 'Cambodian Passport',
    nameKh: governmentServices[1]?.titleKh || 'លិខិតឆ្លងដែនកម្ពុជា',
    category: 'Government',
    categoryKh: 'រដ្ឋបាល',
    status: 'Published',
    statusKh: 'បានផ្សាយ',
    updated: 'Today',
    updatedKh: 'ថ្ងៃនេះ',
    route: `/government/${governmentServices[1]?.id || ''}`
  },
  {
    id: transportList[0]?.id || 'bus-01',
    name: transportList[0]?.name || 'City Bus Route 01',
    nameKh: transportList[0]?.nameKh || 'ឡានក្រុងសាធារណៈ ខ្សែរត់ ០១',
    category: 'Transport',
    categoryKh: 'ដឹកជញ្ជូន',
    status: 'Draft',
    statusKh: 'ព្រាង',
    updated: 'Yesterday',
    updatedKh: 'ម្សិលមិញ',
    route: '/transport'
  },
  {
    id: hospitals[0]?.id || 'calmette',
    name: hospitals[0]?.name || 'Calmette Hospital',
    nameKh: hospitals[0]?.nameKh || 'មន្ទីរពេទ្យកាល់ម៉ែត',
    category: 'Healthcare',
    categoryKh: 'សុខាភិបាល',
    status: 'Published',
    statusKh: 'បានផ្សាយ',
    updated: 'Yesterday',
    updatedKh: 'ម្សិលមិញ',
    route: `/health/${hospitals[0]?.id || ''}`
  },
  {
    id: locationsList[0]?.id || 'owso-phnom-penh',
    name: locationsList[0]?.name || 'OWSO Phnom Penh',
    nameKh: locationsList[0]?.nameKh || 'ច្រកចេញចូលតែមួយ រាជធានីភ្នំពេញ',
    category: 'Public Offices',
    categoryKh: 'ការិយាល័យសាធារណៈ',
    status: 'Published',
    statusKh: 'បានផ្សាយ',
    updated: '2 days ago',
    updatedKh: '២ ថ្ងៃមុន',
    route: '/locations'
  }
])

// Current formatted date
const formattedDate = computed(() => {
  const d = new Date()
  const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }
  return d.toLocaleDateString(currentLanguage.value === 'kh' ? 'km-KH' : 'en-US', options)
})

// Keyboard Shortcut for Ctrl+K
function onKeyDown(e: KeyboardEvent) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchModalOpen.value = !isSearchModalOpen.value
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})

// -------------------------------------------------------------
// ENTERPRISE FORM MODEL: JOBS CMS
// -------------------------------------------------------------
const jobFilterCategory = ref('all')
const jobQuery = ref('')
const isAddJobModalOpen = ref(false)
const jobFormActiveTab = ref<'form' | 'preview'>('form')

const cambodiaProvinces = [
  'Phnom Penh',
  'Siem Reap',
  'Battambang',
  'Sihanoukville',
  'Kampong Cham',
  'Kandal',
  'Kampot',
  'Takeo',
  'Kampong Thom',
  'Kampong Chhnang',
  'Pursat',
  'Koh Kong',
  'Kep',
  'Banteay Meanchey',
  'Preah Vihear',
  'Ratanakiri',
  'Mondulkiri',
  'Stung Treng',
  'Kratie',
  'Prey Veng',
  'Svay Rieng',
  'Tboung Khmum',
  'Oddar Meanchey',
  'Pailin',
  'Kampong Speu'
]

const newJob = reactive({
  title: '',
  titleKh: '',
  company: '',
  category: 'IT',
  type: 'Full-time' as 'Full-time' | 'Part-time' | 'Internship' | 'Freelance',
  workplaceType: 'On-site' as 'On-site' | 'Hybrid' | 'Remote',
  salaryMin: 600,
  salaryMax: 1200,
  location: 'Phnom Penh',
  description: '',
  descriptionKh: '',
  requirements: [
    'Strong analytical and problem-solving skills',
    'Good communication in Khmer and English',
    'Self-motivated with team collaboration mindset'
  ],
  benefits: [
    'Competitive salary & 13th-month bonus',
    'NSSF and private medical coverage',
    'Annual performance incentive bonus'
  ],
  applyUrl: '',
  contactEmail: '',
  contactPhone: '012 888 999'
})

// Interactive tag adder for job requirements
const newRequirementInput = ref('')
function addRequirement() {
  const val = newRequirementInput.value.trim()
  if (val && !newJob.requirements.includes(val)) {
    newJob.requirements.push(val)
    newRequirementInput.value = ''
  }
}
function removeRequirement(index: number) {
  newJob.requirements.splice(index, 1)
}

// Interactive tag adder for job benefits
const newBenefitInput = ref('')
function addBenefit() {
  const val = newBenefitInput.value.trim()
  if (val && !newJob.benefits.includes(val)) {
    newJob.benefits.push(val)
    newBenefitInput.value = ''
  }
}
function removeBenefit(index: number) {
  newJob.benefits.splice(index, 1)
}

// Salary preset helpers
function applySalaryPreset(min: number, max: number) {
  newJob.salaryMin = min
  newJob.salaryMax = max
}

const filteredAdminJobs = computed(() => {
  return adminJobs.value.filter(j => {
    const matchCat = jobFilterCategory.value === 'all' || j.category.toLowerCase() === jobFilterCategory.value.toLowerCase()
    const q = jobQuery.value.trim().toLowerCase()
    const matchQ = !q ||
      j.title.toLowerCase().includes(q) ||
      (j.titleKh && j.titleKh.toLowerCase().includes(q)) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    return matchCat && matchQ
  })
})

function handleAddJob() {
  if (!newJob.title.trim() || !newJob.company.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញចំណងជើងការងារ និងឈ្មោះក្រុមហ៊ុន!' : 'Please fill job title and company name!')
    return
  }

  const salaryDisplay = `$${newJob.salaryMin} - $${newJob.salaryMax}/month`

  const createdJob: Job = {
    id: 'job-admin-' + Date.now(),
    title: newJob.title.trim(),
    titleKh: newJob.titleKh.trim() || newJob.title.trim(),
    company: newJob.company.trim(),
    category: newJob.category,
    location: newJob.location,
    salary: salaryDisplay,
    salaryMin: Number(newJob.salaryMin) || 600,
    salaryMax: Number(newJob.salaryMax) || 1200,
    type: newJob.type,
    postedDate: 'Today',
    description: newJob.description.trim() || `Position at ${newJob.company}. Contact recruitment for complete job description.`,
    descriptionKh: newJob.descriptionKh.trim() || `ឱកាសការងារនៅក្រុមហ៊ុន ${newJob.company}។ សូមទាក់ទងមកកាន់ផ្នែកជ្រើសរើសបុគ្គលិកដើម្បីទទួលបានព័ត៌មានលម្អិត។`,
    requirements: [...newJob.requirements],
    benefits: [...newJob.benefits],
    applyUrl: newJob.applyUrl.trim() || '#'
  }

  // Prepend to reactive state
  adminJobs.value.unshift(createdJob)

  // Persist to localStorage 'camlife_user_jobs' so JobsPage.vue gets it immediately!
  try {
    const existingStr = localStorage.getItem('camlife_user_jobs')
    const existing: Job[] = existingStr ? JSON.parse(existingStr) : []
    existing.unshift(createdJob)
    localStorage.setItem('camlife_user_jobs', JSON.stringify(existing))
  } catch (e) {
    console.error(e)
  }

  // Record into live activities
  activities.value.unshift({
    id: 'act-' + Date.now(),
    title: 'New job posted by Admin',
    titleKh: 'Admin បានបង្ហោះការងារថ្មី',
    detail: `${createdJob.title} at ${createdJob.company}`,
    detailKh: `${createdJob.title} នៅ ${createdJob.company}`,
    time: 'Just now',
    timeKh: 'ទើបតែឥឡូវនេះ',
    color: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
  })

  isAddJobModalOpen.value = false
  newJob.title = ''
  newJob.titleKh = ''
  newJob.company = ''
  newJob.description = ''
  newJob.descriptionKh = ''
  newJob.applyUrl = ''
  showToast(currentLanguage.value === 'kh' ? 'បានបន្ថែមការងារថ្មី និងផ្សាយលើ Website ដោយជោគជ័យ!' : 'New job posted and deployed live!')
}

function handleDeleteJob(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកពិតជាចង់លុបការងារនេះមែនទេ?' : 'Are you sure you want to delete this job?')) {
    adminJobs.value = adminJobs.value.filter(j => j.id !== id)
    try {
      const existingStr = localStorage.getItem('camlife_user_jobs')
      if (existingStr) {
        const existing: Job[] = JSON.parse(existingStr)
        const filtered = existing.filter(j => j.id !== id)
        localStorage.setItem('camlife_user_jobs', JSON.stringify(filtered))
      }
    } catch (e) {
      console.error(e)
    }
    showToast(currentLanguage.value === 'kh' ? 'បានលុបការងាររួចរាល់' : 'Job deleted successfully')
  }
}

// -------------------------------------------------------------
// ENTERPRISE FORM MODEL: HOME SPECIALISTS CMS
// -------------------------------------------------------------
const serviceFilterCategory = ref('all')
const serviceQuery = ref('')
const isAddServiceModalOpen = ref(false)

const newService = reactive({
  serviceName: '',
  serviceNameKh: '',
  provider: '',
  category: 'Air Conditioning',
  location: 'Phnom Penh',
  phone: '012 345 678',
  priceMin: 20,
  priceMax: 45,
  experienceYears: 5,
  isCertified: true,
  hasWarranty: true,
  skills: ['Emergency repair', 'Free diagnosis', '1-Month warranty guarantee']
})

// Interactive skill tag adder
const newSkillInput = ref('')
function addSkill() {
  const val = newSkillInput.value.trim()
  if (val && !newService.skills.includes(val)) {
    newService.skills.push(val)
    newSkillInput.value = ''
  }
}
function removeSkill(index: number) {
  newService.skills.splice(index, 1)
}

const filteredHomeServices = computed(() => {
  return adminHomeServices.value.filter(s => {
    const matchCat = serviceFilterCategory.value === 'all' || s.category.toLowerCase() === serviceFilterCategory.value.toLowerCase()
    const q = serviceQuery.value.trim().toLowerCase()
    const matchQ = !q ||
      s.serviceName.toLowerCase().includes(q) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(q)) ||
      s.provider.toLowerCase().includes(q)
    return matchCat && matchQ
  })
})

function handleAddService() {
  if (!newService.serviceName.trim() || !newService.provider.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះសេវា និងឈ្មោះអ្នកផ្តល់សេវា!' : 'Please fill service title and provider name!')
    return
  }

  const priceRange = `$${newService.priceMin} - $${newService.priceMax}`

  const createdService: HomeService = {
    id: 'service-admin-' + Date.now(),
    serviceName: newService.serviceName.trim(),
    serviceNameKh: newService.serviceNameKh.trim() || newService.serviceName.trim(),
    provider: newService.provider.trim(),
    category: newService.category,
    location: newService.location,
    phone: newService.phone.trim() || '012 888 777',
    priceEstimate: priceRange,
    rating: 5.0,
    reviews: 1,
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
    description: `Specialized ${newService.category} services provided by ${newService.provider}. Fully certified with warranty guarantee.`,
    descriptionKh: `សេវាកម្មជំនាញផ្នែក ${newService.category} ដោយ ${newService.provider}។ មានវិញ្ញាបនបត្របញ្ជាក់ច្បាស់លាស់ និងការធានាគុណភាពជូនអតិថិជន។`
  }

  adminHomeServices.value.unshift(createdService)

  // Persist to localStorage 'camlife_custom_home_services' so HomeServicesPage.vue gets it immediately!
  try {
    const existingStr = localStorage.getItem('camlife_custom_home_services')
    const existing: HomeService[] = existingStr ? JSON.parse(existingStr) : []
    existing.unshift(createdService)
    localStorage.setItem('camlife_custom_home_services', JSON.stringify(existing))
  } catch (e) {
    console.error(e)
  }

  // Record into live activities
  activities.value.unshift({
    id: 'act-' + Date.now(),
    title: 'New specialist registered',
    titleKh: 'បានចុះឈ្មោះជាងជំនាញថ្មី',
    detail: `${createdService.serviceName} (${createdService.provider})`,
    detailKh: `${createdService.serviceNameKh} (${createdService.provider})`,
    time: 'Just now',
    timeKh: 'ទើបតែឥឡូវនេះ',
    color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
  })

  isAddServiceModalOpen.value = false
  newService.serviceName = ''
  newService.serviceNameKh = ''
  newService.provider = ''
  showToast(currentLanguage.value === 'kh' ? 'បានបន្ថែមជាងជំនាញថ្មី និងផ្សាយលើ Website ដោយជោគជ័យ!' : 'Specialist registered and deployed live!')
}

function handleDeleteService(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកពិតជាចង់លុបសេវានេះមែនទេ?' : 'Are you sure you want to delete this service?')) {
    adminHomeServices.value = adminHomeServices.value.filter(s => s.id !== id)
    try {
      const existingStr = localStorage.getItem('camlife_custom_home_services')
      if (existingStr) {
        const existing: HomeService[] = JSON.parse(existingStr)
        const filtered = existing.filter(s => s.id !== id)
        localStorage.setItem('camlife_custom_home_services', JSON.stringify(filtered))
      }
    } catch (e) {
      console.error(e)
    }
    showToast(currentLanguage.value === 'kh' ? 'បានលុបសេវារួចរាល់' : 'Service deleted successfully')
  }
}

// -------------------------------------------------------------
// REAL INPUT: CITIZEN REPORT STATUS CHANGERS
// -------------------------------------------------------------
function handleUpdateReportStatus(id: string, status: 'pending' | 'verified' | 'resolved') {
  updateReportStatus(id, status)
  activities.value.unshift({
    id: 'act-' + Date.now(),
    title: `Report marked as ${status}`,
    titleKh: `បានប្តូរស្ថានភាពបណ្តឹងទៅជា ${status}`,
    detail: `Report ID #${id.slice(0, 6)}`,
    detailKh: `លេខសម្គាល់បណ្តឹង #${id.slice(0, 6)}`,
    time: 'Just now',
    timeKh: 'ទើបតែឥឡូវនេះ',
    color: status === 'resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
  })
  showToast(
    currentLanguage.value === 'kh'
      ? `បានប្តូរស្ថានភាពបណ្តឹងទៅជា "${status}"`
      : `Report status changed to "${status}"`
  )
}

// -------------------------------------------------------------
// REAL INPUT: USER DIRECTORY ROLE TOGGLE
// -------------------------------------------------------------
const dummyUsers = ref([
  { id: 'u-1', name: 'Admin Officer', email: 'admin@camlife.gov.kh', phone: '012 999 888', role: 'Administrator', status: 'Active' },
  { id: 'u-2', name: 'Sok Vuthy', email: 'demo.citizen@camlife.kh', phone: '012 345 678', role: 'Citizen', status: 'Active' },
  { id: 'u-3', name: 'Khem Chantha', email: 'chantha.khem@gmail.com', phone: '098 765 432', role: 'Citizen', status: 'Active' },
  { id: 'u-4', name: 'Dr. Heng Sopheap', email: 'sopheap.calmette@gov.kh', phone: '011 223 344', role: 'Administrator', status: 'Active' }
])

function toggleUserRole(userId: string) {
  const target = dummyUsers.value.find(u => u.id === userId)
  if (target) {
    target.role = target.role === 'Administrator' ? 'Citizen' : 'Administrator'
    showToast(
      currentLanguage.value === 'kh'
        ? `បានប្តូរសិទ្ធិ ${target.name} ទៅជា ${target.role}`
        : `Changed ${target.name}'s role to ${target.role}`
    )
  }
}

function handleSignOut() {
  logout()
  showToast(currentLanguage.value === 'kh' ? 'បានចាកចេញពីគណនី' : 'Signed out')
  router.push('/')
}
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-100 flex flex-col">
    <!-- ============================================================== -->
    <!-- ACCESS CONTROL GATE (Shown when guest or citizen visits /admin)-->
    <!-- ============================================================== -->
    <div v-if="!isAdmin" class="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-[#0B132B] to-slate-900 text-white font-khmer">
      <div class="max-w-lg w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-center relative overflow-hidden">
        <div class="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div class="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Real CamLife Logo with badge -->
        <div class="flex items-center justify-center gap-3 mb-6">
          <div class="w-12 h-12 rounded-2xl bg-white p-1 shadow-lg flex items-center justify-center">
            <img src="/logo.png" alt="CamLife" class="w-full h-full object-contain" />
          </div>
          <div class="text-left">
            <h2 class="text-lg font-black text-white leading-tight">CamLife</h2>
            <span class="text-[10px] font-extrabold text-blue-400 uppercase tracking-wider">Administration Console</span>
          </div>
        </div>

        <div class="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-4 shadow-xl ring-8 ring-amber-500/10">
          <Construction class="w-8 h-8 text-amber-400 animate-bounce" />
        </div>

        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-950/60 text-amber-400 border border-amber-700/60 mb-3">
          <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធស្ថិតក្រោមការអភិវឌ្ឍន៍ • Version 2.0 In Progress' : 'System Under Development • Version 2.0 In Progress' }}</span>
        </div>

        <h1 class="text-2xl font-black mb-3 text-white">
          {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាលមិនទាន់រួចរាល់ទេ' : 'Admin CMS Under Construction' }}
        </h1>
        <p class="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed max-w-md mx-auto">
          {{ currentLanguage === 'kh'
            ? 'សូមអភ័យទោស! ផ្ទាំងគ្រប់គ្រងទិន្នន័យរដ្ឋបាលកណ្តាល (Admin CMS) មិនទាន់បញ្ចប់ការសរសេរកូដរួចរាល់ជាស្ថាពរនៅឡើយទេ។ ក្រុមការងារបច្ចេកវិទ្យាកំពុងរៀបចំប្រព័ន្ធសុវត្ថិភាពទិន្នន័យជាតិ និងការតភ្ជាប់ API ជាមួយក្រសួង-ស្ថាប័ន។ មុខងារនេះនឹងបើកដំណើរការជាផ្លូវការក្នុងពេលឆាប់ៗនេះ។'
            : 'The central Administration CMS is currently undergoing security hardening and data pipeline setup by our development team. Admin access is temporarily restricted during this phase.' }}
        </p>

        <!-- Development Progress Roadmap -->
        <div class="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 mb-6 text-left space-y-2.5">
          <div class="flex items-center justify-between text-xs font-bold text-slate-300">
            <span class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'UI/UX Admin Studio Layout' : 'Admin Studio Interface' }}</span>
            </span>
            <span class="text-[10px] text-emerald-400 font-extrabold bg-emerald-950/80 px-2 py-0.5 rounded">100% រួចរាល់</span>
          </div>
          <div class="flex items-center justify-between text-xs font-bold text-slate-300">
            <span class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-amber-400 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធផ្ទៀងផ្ទាត់ 2FA & Multi-Tenant Audit' : 'Multi-Factor Auth & Audit Log' }}</span>
            </span>
            <span class="text-[10px] text-amber-400 font-extrabold bg-amber-950/80 px-2 py-0.5 rounded">{{ currentLanguage === 'kh' ? 'កំពុងធ្វើ' : 'In Progress' }}</span>
          </div>
          <div class="flex items-center justify-between text-xs font-bold text-slate-300">
            <span class="flex items-center gap-2">
              <Clock class="w-4 h-4 text-amber-400 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'ការតភ្ជាប់ទិន្នន័យ Database ថ្នាក់ជាតិ' : 'National Ministry Database Linkage' }}</span>
            </span>
            <span class="text-[10px] text-amber-400 font-extrabold bg-amber-950/80 px-2 py-0.5 rounded">{{ currentLanguage === 'kh' ? 'កំពុងធ្វើ' : 'In Progress' }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <router-link
            to="/"
            class="w-full py-3.5 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black rounded-2xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm"
          >
            <ExternalLink class="w-4 h-4" />
            <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅគេហទំព័រសាធារណៈ' : 'Return to Public Website' }}</span>
          </router-link>
        </div>

        <div class="mt-6 pt-5 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-center gap-1">
          <Sparkles class="w-3.5 h-3.5 text-blue-400" />
          <span>CamLife Civic Operating System © 2026</span>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MAIN ADMIN CMS INTERFACE (When isAdmin is true)                -->
    <!-- ============================================================== -->
    <div v-else class="min-h-screen flex flex-1 overflow-hidden">
      <!-- 1. LEFT SIDEBAR -->
      <aside
        :class="[
          'bg-[#0B132B] text-slate-300 flex flex-col transition-all duration-300 z-40 fixed md:static inset-y-0 left-0 shadow-2xl md:shadow-none',
          isSidebarOpen ? 'w-64' : 'w-20',
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        ]"
      >
        <!-- Sidebar Brand Header -->
        <div class="h-16 px-4 flex items-center justify-between border-b border-slate-800/80">
          <div class="flex items-center gap-3 overflow-hidden">
            <div class="w-9 h-9 rounded-xl bg-white p-0.5 flex items-center justify-center shadow-md flex-shrink-0">
              <img src="/logo.png" alt="CamLife" class="w-full h-full object-contain rounded-lg" />
            </div>
            <div v-if="isSidebarOpen" class="flex flex-col min-w-0 transition-opacity">
              <span class="text-base font-black text-white tracking-tight leading-tight">CamLife</span>
              <span class="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Admin CMS</span>
            </div>
          </div>
          <!-- Close button on mobile -->
          <button
            @click="isMobileSidebarOpen = false"
            class="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Sidebar Navigation List -->
        <nav class="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          <!-- MAIN DASHBOARD -->
          <div>
            <button
              @click="activeTab = 'dashboard'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer',
                activeTab === 'dashboard'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <LayoutDashboard class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង (Dashboard)' : 'Dashboard' }}</span>
            </button>
          </div>

          <!-- SECTION: CONTENT MANAGEMENT -->
          <div class="space-y-1">
            <div v-if="isSidebarOpen" class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងមាតិកា' : 'Content Management' }}
            </div>

            <button
              @click="activeTab = 'government'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'government' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <FileText class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈ' : 'Government Services' }}</span>
            </button>

            <button
              @click="activeTab = 'health'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'health' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <HospitalIcon class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'សុខាភិបាល & មន្ទីរពេទ្យ' : 'Healthcare & Hospitals' }}</span>
            </button>

            <button
              @click="activeTab = 'jobs'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'jobs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Briefcase class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ការងារ & អាជីព' : 'Jobs' }}</span>
            </button>

            <button
              @click="activeTab = 'transport'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'transport' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Bus class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ដឹកជញ្ជូន & ឡានក្រុង' : 'Transport' }}</span>
            </button>

            <button
              @click="activeTab = 'homeservices'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'homeservices' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Home class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'សេវាជួសជុលតាមផ្ទះ' : 'Home Services' }}</span>
            </button>

            <button
              @click="activeTab = 'offices'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'offices' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Building2 class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ការិយាល័យ & ច្រក OWSO' : 'Public Offices & OWSO' }}</span>
            </button>

            <button
              @click="activeTab = 'news'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'news' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Newspaper class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ព័ត៌មាន & សេចក្តីជូនដំណឹង' : 'News & Bulletins' }}</span>
            </button>
          </div>

          <!-- SECTION: USER & SUPPORT -->
          <div class="space-y-1">
            <div v-if="isSidebarOpen" class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់ & ជំនួយ' : 'User & Support' }}
            </div>

            <button
              @click="activeTab = 'users'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Users class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'គណនី & សិទ្ធិប្រើប្រាស់' : 'Users' }}</span>
            </button>

            <button
              @click="activeTab = 'feedback'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'feedback' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <MessageSquare class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'របាយការណ៍ & មតិពលរដ្ឋ' : 'Feedback & Reports' }}</span>
            </button>
          </div>

          <!-- SECTION: SYSTEM -->
          <div class="space-y-1">
            <div v-if="isSidebarOpen" class="px-3 text-[10px] font-black uppercase tracking-wider text-slate-500">
              {{ currentLanguage === 'kh' ? 'ប្រព័ន្ធ' : 'System' }}
            </div>

            <button
              @click="activeTab = 'settings'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'settings' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <Settings class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ការកំណត់ (Settings)' : 'Settings' }}</span>
            </button>

            <button
              @click="activeTab = 'logs'"
              :class="[
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer',
                activeTab === 'logs' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              ]"
            >
              <ShieldAlert class="w-4 h-4 flex-shrink-0" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'កំណត់ហេតុ Admin (Logs)' : 'Admin Logs' }}</span>
            </button>
          </div>
        </nav>

        <!-- Sidebar Footer Profile & Sign Out -->
        <div class="p-3 border-t border-slate-800/80 bg-slate-900/40 space-y-2">
          <div class="flex items-center gap-3 px-2 py-1.5">
            <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-xs flex-shrink-0 ring-2 ring-blue-500/30">
              A
            </div>
            <div v-if="isSidebarOpen" class="min-w-0 flex-1">
              <p class="text-xs font-bold text-white truncate">{{ currentUser?.name || 'Admin Officer' }}</p>
              <p class="text-[10px] text-slate-400 truncate">Administrator</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-1 pt-1">
            <router-link
              to="/"
              class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              :title="currentLanguage === 'kh' ? 'ត្រឡប់ទៅ Website' : 'Back to Public Website'"
            >
              <ExternalLink class="w-3.5 h-3.5" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'Website' : 'Portal' }}</span>
            </router-link>

            <button
              @click="handleSignOut"
              class="flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-[11px] font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors cursor-pointer"
              :title="currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out'"
            >
              <LogOut class="w-3.5 h-3.5" />
              <span v-if="isSidebarOpen">{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Mobile Backdrop Overlay -->
      <div
        v-if="isMobileSidebarOpen"
        @click="isMobileSidebarOpen = false"
        class="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-xs"
      ></div>

      <!-- 2. MAIN CONTENT AREA -->
      <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <!-- TOPBAR HEADER -->
        <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-20">
          <!-- Left: Hamburger + Search Input -->
          <div class="flex items-center gap-3 md:gap-4 flex-1 max-w-xl">
            <!-- Sidebar toggle (Desktop) -->
            <button
              @click="isSidebarOpen = !isSidebarOpen"
              class="hidden md:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <Menu class="w-5 h-5" />
            </button>
            <!-- Sidebar toggle (Mobile) -->
            <button
              @click="isMobileSidebarOpen = true"
              class="md:hidden p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Menu class="w-5 h-5" />
            </button>

            <!-- Search Bar with Ctrl+K shortcut -->
            <div
              @click="isSearchModalOpen = true"
              class="relative flex-1 cursor-pointer group"
            >
              <div class="w-full flex items-center gap-2 px-3.5 py-2 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/70 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-400 dark:text-slate-400 text-xs transition-colors">
                <Search class="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                <span class="flex-1 truncate">
                  {{ currentLanguage === 'kh' ? 'ស្វែងរកសេវា, មាតិកា, អ្នកប្រើប្រាស់...' : 'Search services, content, users...' }}
                </span>
                <span class="hidden sm:inline-flex px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-300 shadow-xs">
                  Ctrl K
                </span>
              </div>
            </div>
          </div>

          <!-- Right: Notifications, Language, Profile -->
          <div class="flex items-center gap-2 md:gap-4">
            <!-- Notifications Bell -->
            <div class="relative">
              <button
                @click="isNotifDropdownOpen = !isNotifDropdownOpen"
                class="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative cursor-pointer"
              >
                <Bell class="w-5 h-5" />
                <span class="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
                  {{ pendingApprovals.length }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <div
                v-if="isNotifDropdownOpen"
                class="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div class="px-4 pb-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span class="text-xs font-black text-slate-800 dark:text-white">
                    {{ currentLanguage === 'kh' ? 'ការជូនដំណឹង' : 'Notifications' }}
                  </span>
                  <span class="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                    {{ pendingApprovals.length }} New
                  </span>
                </div>
                <div class="divide-y divide-slate-100 dark:divide-slate-800 max-h-64 overflow-y-auto">
                  <div
                    v-for="p in pendingApprovals"
                    :key="p.id"
                    class="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs space-y-1"
                  >
                    <p class="font-bold text-slate-800 dark:text-slate-200">{{ currentLanguage === 'kh' ? p.titleKh : p.title }}</p>
                    <p class="text-[11px] text-slate-400">{{ p.entity }}</p>
                    <p class="text-[10px] text-blue-500">{{ currentLanguage === 'kh' ? p.timeKh : p.time }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Language Switcher -->
            <div class="relative">
              <button
                @click="isLanguageDropdownOpen = !isLanguageDropdownOpen"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              >
                <Globe class="w-4 h-4 text-blue-600" />
                <span>{{ currentLanguage.toUpperCase() }}</span>
                <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div
                v-if="isLanguageDropdownOpen"
                class="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 text-xs"
              >
                <button
                  @click="setLanguage('en'); isLanguageDropdownOpen = false"
                  :class="['w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between', currentLanguage === 'en' ? 'font-black text-blue-600' : '']"
                >
                  <span>English (EN)</span>
                  <Check v-if="currentLanguage === 'en'" class="w-3.5 h-3.5 text-blue-600" />
                </button>
                <button
                  @click="setLanguage('kh'); isLanguageDropdownOpen = false"
                  :class="['w-full text-left px-3 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center justify-between', currentLanguage === 'kh' ? 'font-black text-blue-600' : '']"
                >
                  <span>ខ្មែរ (KH)</span>
                  <Check v-if="currentLanguage === 'kh'" class="w-3.5 h-3.5 text-blue-600" />
                </button>
              </div>
            </div>

            <!-- Admin Profile Dropdown Pill -->
            <div class="relative">
              <button
                @click="isProfileDropdownOpen = !isProfileDropdownOpen"
                class="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <div class="w-8 h-8 rounded-full bg-slate-800 dark:bg-slate-700 text-white flex items-center justify-center font-black text-xs ring-2 ring-slate-200 dark:ring-slate-700">
                  A
                </div>
                <div class="hidden sm:flex flex-col text-left">
                  <span class="text-xs font-black text-slate-800 dark:text-white leading-tight">Admin</span>
                  <span class="text-[10px] text-slate-400 font-medium leading-none">Administrator</span>
                </div>
                <ChevronDown class="w-3.5 h-3.5 text-slate-400" />
              </button>

              <div
                v-if="isProfileDropdownOpen"
                class="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-xs"
              >
                <div class="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                  <p class="font-bold text-slate-800 dark:text-white">{{ currentUser?.name || 'Admin Officer' }}</p>
                  <p class="text-[10px] text-slate-400">{{ currentUser?.email || 'admin@camlife.gov.kh' }}</p>
                </div>
                <button
                  @click="activeTab = 'settings'; isProfileDropdownOpen = false"
                  class="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-300"
                >
                  <Settings class="w-4 h-4" />
                  <span>{{ currentLanguage === 'kh' ? 'ការកំណត់' : 'Settings' }}</span>
                </button>
                <router-link
                  to="/"
                  class="w-full text-left px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-600 dark:text-slate-300"
                >
                  <ExternalLink class="w-4 h-4" />
                  <span>{{ currentLanguage === 'kh' ? 'ទៅកាន់គេហទំព័រ' : 'Public Site' }}</span>
                </router-link>
                <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                <button
                  @click="handleSignOut"
                  class="w-full text-left px-3 py-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 flex items-center gap-2 font-bold cursor-pointer"
                >
                  <LogOut class="w-4 h-4" />
                  <span>{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <!-- DASHBOARD MAIN BODY -->
        <main class="flex-1 p-4 md:p-8 space-y-8 max-w-7xl w-full mx-auto">
          <!-- ============================================================== -->
          <!-- VIEW 1: DASHBOARD OVERVIEW (Centerpiece matching mockup image) -->
          <!-- ============================================================== -->
          <div v-if="activeTab === 'dashboard'" class="space-y-8 animate-in fade-in duration-300">
            <!-- 1. GREETING & DATE ROW -->
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 class="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                  {{ currentLanguage === 'kh' ? 'អរុណសួស្តី អ្នកគ្រប់គ្រង Admin!' : 'Good morning, Admin!' }}
                </h1>
                <p class="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {{ currentLanguage === 'kh'
                    ? 'នេះជាបច្ចុប្បន្នភាព និងដំណើរការប្រព័ន្ធ CamLife សម្រាប់ថ្ងៃនេះ។'
                    : "Here's what's happening with CamLife today." }}
                </p>
              </div>

              <!-- Live Date Pill & Motto -->
              <div class="flex flex-col sm:items-end">
                <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs">
                  <Calendar class="w-4 h-4 text-blue-600" />
                  <span>{{ formattedDate }}</span>
                </div>
                <span class="text-[11px] font-semibold text-slate-400 mt-1">
                  Manage · Inform · Serve Cambodia
                </span>
              </div>
            </div>

            <!-- 2. TOP 5 METRICS ROW (BOUND TO REAL DATA) -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
              <!-- Card 1: Total Services -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer" @click="activeTab = 'government'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center flex-shrink-0">
                    <FileText class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {{ currentLanguage === 'kh' ? 'សេវាសរុប' : 'Total Services' }}
                    </p>
                    <p class="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {{ totalServicesCount }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                  <span>↑ 8.2%</span>
                  <span class="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              <!-- Card 2: Active Jobs -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer" @click="activeTab = 'jobs'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <Briefcase class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {{ currentLanguage === 'kh' ? 'ការងារសកម្ម' : 'Active Jobs' }}
                    </p>
                    <p class="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {{ activeJobsCount }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                  <span>↑ 12.4%</span>
                  <span class="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              <!-- Card 3: Locations -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer" @click="activeTab = 'offices'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center flex-shrink-0">
                    <MapPin class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {{ currentLanguage === 'kh' ? 'ទីតាំង OWSO' : 'Locations' }}
                    </p>
                    <p class="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {{ locationsCount }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                  <span>↑ 5.6%</span>
                  <span class="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              <!-- Card 4: News Articles -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer" @click="activeTab = 'news'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center flex-shrink-0">
                    <Newspaper class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {{ currentLanguage === 'kh' ? 'អត្ថបទព័ត៌មាន' : 'News Articles' }}
                    </p>
                    <p class="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {{ newsCount }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                  <span>↑ 6.1%</span>
                  <span class="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>

              <!-- Card 5: Total Users -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-shadow cursor-pointer" @click="activeTab = 'users'">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center flex-shrink-0">
                    <Users class="w-5 h-5" />
                  </div>
                  <div>
                    <p class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      {{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់សរុប' : 'Total Users' }}
                    </p>
                    <p class="text-xl font-black text-slate-900 dark:text-white leading-tight">
                      {{ totalUsersCount }}
                    </p>
                  </div>
                </div>
                <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center text-[11px] font-bold text-emerald-600 dark:text-emerald-400 gap-1">
                  <span>↑ 15.3%</span>
                  <span class="text-slate-400 font-normal">vs last month</span>
                </div>
              </div>
            </div>

            <!-- 3. MIDDLE ROW: SERVICE USAGE (60%) + RECENT ACTIVITY (40%) -->
            <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <!-- Left Chart: Service Usage (7 cols / ~60%) -->
              <div class="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                  <div>
                    <h2 class="text-base font-black text-slate-900 dark:text-white">
                      {{ currentLanguage === 'kh' ? 'ការប្រើប្រាស់សេវា (Service Usage)' : 'Service Usage' }}
                    </h2>
                    <p class="text-xs text-slate-400 mt-0.5">
                      {{ currentLanguage === 'kh' ? 'ចំនួនអ្នកមើលតាមប្រភេទសេវា (៣០ ថ្ងៃចុងក្រោយ)' : 'Page views by service category (Last 30 days)' }}
                    </p>
                  </div>

                  <!-- Dropdown selector -->
                  <div class="inline-flex items-center gap-2">
                    <select
                      v-model="usageTimeframe"
                      class="text-xs font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
                    >
                      <option value="30days">{{ currentLanguage === 'kh' ? '៣០ ថ្ងៃចុងក្រោយ' : 'Last 30 days' }}</option>
                      <option value="7days">{{ currentLanguage === 'kh' ? '៧ ថ្ងៃចុងក្រោយ' : 'Last 7 days' }}</option>
                      <option value="year">{{ currentLanguage === 'kh' ? 'ឆ្នាំនេះ' : 'This year' }}</option>
                    </select>
                  </div>
                </div>

                <!-- Custom Visual Bar Chart with Values on Top -->
                <div class="flex-1 flex flex-col justify-end pt-6">
                  <div class="relative h-64 w-full flex items-end justify-between gap-2 sm:gap-4 px-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <!-- Background Horizontal Grid Lines -->
                    <div class="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-40">
                      <div class="border-b border-dashed border-slate-200 dark:border-slate-700 w-full"></div>
                      <div class="border-b border-dashed border-slate-200 dark:border-slate-700 w-full"></div>
                      <div class="border-b border-dashed border-slate-200 dark:border-slate-700 w-full"></div>
                      <div class="border-b border-dashed border-slate-200 dark:border-slate-700 w-full"></div>
                    </div>

                    <!-- Left Y-Axis labels -->
                    <div class="absolute -left-1 top-0 bottom-2 flex flex-col justify-between text-[10px] text-slate-400 pointer-events-none">
                      <span>40K</span>
                      <span>30K</span>
                      <span>20K</span>
                      <span>10K</span>
                      <span>0</span>
                    </div>

                    <!-- Bars -->
                    <div
                      v-for="(item, idx) in serviceUsageStats"
                      :key="idx"
                      class="flex-1 flex flex-col items-center justify-end h-full group relative z-10"
                    >
                      <!-- Value Label on Top of Bar -->
                      <span class="text-[10px] sm:text-[11px] font-black text-slate-700 dark:text-slate-200 mb-1.5 group-hover:scale-110 transition-transform">
                        {{ item.views }}
                      </span>

                      <!-- Animated Colored Bar -->
                      <div
                        class="w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-85 shadow-xs"
                        :style="{ height: item.heightPercent + '%', backgroundColor: item.color }"
                      ></div>
                    </div>
                  </div>

                  <!-- X-Axis Category Labels -->
                  <div class="flex items-center justify-between gap-2 sm:gap-4 px-2 pt-3">
                    <div
                      v-for="(item, idx) in serviceUsageStats"
                      :key="idx"
                      class="flex-1 text-center truncate"
                    >
                      <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 block truncate" :title="item.name">
                        {{ currentLanguage === 'kh' ? item.nameKh : item.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Feed: Recent Activity (5 cols / ~40%) -->
              <div class="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-base font-black text-slate-900 dark:text-white">
                    {{ currentLanguage === 'kh' ? 'សកម្មភាពថ្មីៗ (Recent Activity)' : 'Recent Activity' }}
                  </h2>
                  <button
                    @click="activeTab = 'logs'"
                    class="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់ →' : 'View All →' }}</span>
                  </button>
                </div>

                <div class="flex-1 divide-y divide-slate-100 dark:divide-slate-800/80">
                  <div
                    v-for="act in activities"
                    :key="act.id"
                    class="py-3.5 flex items-start justify-between gap-3 first:pt-1 last:pb-1"
                  >
                    <div class="flex items-start gap-3 min-w-0">
                      <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5', act.color]">
                        <FileText class="w-4 h-4" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                          {{ currentLanguage === 'kh' ? act.titleKh : act.title }}
                        </p>
                        <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {{ currentLanguage === 'kh' ? act.detailKh : act.detail }}
                        </p>
                      </div>
                    </div>
                    <span class="text-[10px] text-slate-400 font-medium flex-shrink-0 whitespace-nowrap">
                      {{ currentLanguage === 'kh' ? act.timeKh : act.time }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 4. BOTTOM ROW: PENDING APPROVAL (50%) + RECENT SERVICES TABLE (50%) -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Column 1: Pending Approval with Functional Approve/Reject -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs">
                <div class="flex items-center justify-between mb-4">
                  <div class="flex items-center gap-2">
                    <h2 class="text-base font-black text-slate-900 dark:text-white">
                      {{ currentLanguage === 'kh' ? 'រង់ចាំការអនុម័ត' : 'Pending Approval' }}
                    </h2>
                    <span class="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                      {{ pendingApprovals.length }}
                    </span>
                  </div>
                  <button
                    @click="activeTab = 'feedback'"
                    class="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់ →' : 'View All →' }}</span>
                  </button>
                </div>

                <div v-if="pendingApprovals.length === 0" class="py-12 text-center text-slate-400 text-xs">
                  {{ currentLanguage === 'kh' ? 'គ្មានពាក្យស្នើសុំរង់ចាំការអនុម័តទេ' : 'No items pending approval.' }}
                </div>

                <div v-else class="divide-y divide-slate-100 dark:divide-slate-800/80">
                  <div
                    v-for="item in pendingApprovals"
                    :key="item.id"
                    class="py-3.5 flex items-center justify-between gap-3 first:pt-1 last:pb-1"
                  >
                    <div class="flex items-center gap-3 min-w-0">
                      <div :class="['w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', item.iconBg]">
                        <Briefcase v-if="item.type === 'job'" class="w-4 h-4" />
                        <Newspaper v-else-if="item.type === 'news'" class="w-4 h-4" />
                        <MapPin v-else class="w-4 h-4" />
                      </div>
                      <div class="min-w-0">
                        <p class="text-xs font-bold text-slate-800 dark:text-white leading-tight">
                          {{ currentLanguage === 'kh' ? item.titleKh : item.title }}
                        </p>
                        <p class="text-[11px] text-slate-400 truncate">
                          {{ item.entity }} · {{ currentLanguage === 'kh' ? item.timeKh : item.time }}
                        </p>
                      </div>
                    </div>

                    <!-- Action Buttons: Approve & Reject (Real inputs!) -->
                    <div class="flex items-center gap-2 flex-shrink-0">
                      <button
                        @click="handleApprovePending(item.id)"
                        class="px-3 py-1.5 rounded-xl border border-emerald-500/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-xs font-black transition-colors cursor-pointer"
                      >
                        {{ currentLanguage === 'kh' ? 'អនុម័ត' : 'Approve' }}
                      </button>
                      <button
                        @click="handleRejectPending(item.id)"
                        class="px-3 py-1.5 rounded-xl border border-rose-500/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-black transition-colors cursor-pointer"
                      >
                        {{ currentLanguage === 'kh' ? 'បដិសេធ' : 'Reject' }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Column 2: Recent Services Table (REAL DATA FROM CAMLIFE) -->
              <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl p-6 shadow-xs flex flex-col">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-base font-black text-slate-900 dark:text-white">
                    {{ currentLanguage === 'kh' ? 'សេវាថ្មីៗ (Recent Services)' : 'Recent Services' }}
                  </h2>
                  <button
                    @click="activeTab = 'government'"
                    class="text-xs font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
                  >
                    <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់ →' : 'View All →' }}</span>
                  </button>
                </div>

                <div class="overflow-x-auto flex-1">
                  <table class="w-full text-left text-xs">
                    <thead>
                      <tr class="text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                        <th class="pb-2.5 font-bold">{{ currentLanguage === 'kh' ? 'សេវាកម្ម' : 'Service' }}</th>
                        <th class="pb-2.5 font-bold">{{ currentLanguage === 'kh' ? 'ផ្នែក' : 'Category' }}</th>
                        <th class="pb-2.5 font-bold">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                        <th class="pb-2.5 font-bold">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Updated' }}</th>
                        <th class="pb-2.5 font-bold text-right">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60">
                      <tr
                        v-for="srv in recentServices"
                        :key="srv.id"
                        class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                      >
                        <td class="py-3 pr-3 font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <div class="w-6 h-6 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 flex-shrink-0">
                            <FileText class="w-3.5 h-3.5" />
                          </div>
                          <router-link :to="srv.route" class="hover:text-blue-600 transition-colors truncate">
                            {{ currentLanguage === 'kh' ? srv.nameKh : srv.name }}
                          </router-link>
                        </td>
                        <td class="py-3 pr-3 text-slate-500 dark:text-slate-400">
                          {{ currentLanguage === 'kh' ? srv.categoryKh : srv.category }}
                        </td>
                        <td class="py-3 pr-3">
                          <span
                            :class="[
                              'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black',
                              srv.status === 'Published'
                                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400'
                                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                            ]"
                          >
                            <span :class="['w-1.5 h-1.5 rounded-full', srv.status === 'Published' ? 'bg-emerald-500' : 'bg-amber-500']"></span>
                            {{ currentLanguage === 'kh' ? srv.statusKh : srv.status }}
                          </span>
                        </td>
                        <td class="py-3 pr-3 text-slate-400 text-[11px]">
                          {{ currentLanguage === 'kh' ? srv.updatedKh : srv.updated }}
                        </td>
                        <td class="py-3 text-right">
                          <router-link
                            :to="srv.route"
                            class="p-1 rounded-lg text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 inline-flex items-center"
                            title="View Public Page"
                          >
                            <ExternalLink class="w-3.5 h-3.5" />
                          </router-link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 2: JOBS CMS (REAL INPUT WITH LOCALSTORAGE SYNC)           -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'jobs'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងឱកាសការងារ (Jobs CMS)' : 'Jobs Board Management' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'បន្ថែម កែប្រែ ឬលុបការងារពីប្រព័ន្ធ — បង្ហាញលើទំព័រ /jobs ភ្លាមៗ' : 'Manage active job postings and employer listings — syncs live with public /jobs' }}
                </p>
              </div>
              <button
                @click="isAddJobModalOpen = true"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'បន្ថែមការងារថ្មី (Enterprise Form)' : 'Post New Job' }}</span>
              </button>
            </div>

            <!-- Filter and Search Bar -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-3">
              <div class="relative flex-1">
                <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  v-model="jobQuery"
                  type="text"
                  :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកតាមចំណងជើង ឬក្រុមហ៊ុន...' : 'Search title or company...'"
                  class="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                v-model="jobFilterCategory"
                class="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none"
              >
                <option value="all">{{ currentLanguage === 'kh' ? 'គ្រប់ផ្នែកទាំងអស់' : 'All Categories' }}</option>
                <option value="it">IT & Software</option>
                <option value="banking">Banking & Finance</option>
                <option value="hospitality">Hospitality</option>
                <option value="education">Education</option>
              </select>
            </div>

            <!-- Jobs Table -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ចំណងជើង / ក្រុមហ៊ុន' : 'Job Title / Company' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ផ្នែក' : 'Category' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ប្រាក់ខែ' : 'Salary' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ទីតាំង' : 'Location' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="job in filteredAdminJobs" :key="job.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4">
                      <p class="font-bold text-slate-800 dark:text-white">{{ localized(job.title, job.titleKh) }}</p>
                      <p class="text-[11px] text-slate-400">{{ job.company }}</p>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300">
                        {{ job.category }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {{ job.salary }}
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ job.location }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button
                        @click="handleDeleteJob(job.id)"
                        class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                        title="Delete Job"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 3: HOME SERVICES CMS (REAL INPUT WITH LOCALSTORAGE SYNC)  -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'homeservices'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងជាងជួសជុល (Home Services)' : 'Home Specialists Directory' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'បញ្ជីអ្នកជំនាញជួសជុលតាមផ្ទះ — បង្ហាញលើទំព័រ /home-services ភ្លាមៗ' : 'Verified local home technicians and specialists — syncs live with /home-services' }}
                </p>
              </div>
              <button
                @click="isAddServiceModalOpen = true"
                class="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'បន្ថែមជាងថ្មី (Enterprise Form)' : 'Add Specialist' }}</span>
              </button>
            </div>

            <!-- Services Table -->
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'សេវាកម្ម / ឈ្មោះអ្នកផ្តល់សេវា' : 'Service / Provider' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ផ្នែក' : 'Category' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'តម្លៃប៉ាន់ស្មាន' : 'Price Estimate' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="srv in filteredHomeServices" :key="srv.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4">
                      <p class="font-bold text-slate-800 dark:text-white">{{ localized(srv.serviceName, srv.serviceNameKh) }}</p>
                      <p class="text-[11px] text-slate-400">{{ srv.provider }} · {{ srv.location }}</p>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-300">
                        {{ srv.category }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-bold text-slate-700 dark:text-slate-200">
                      {{ srv.priceEstimate || 'Contact' }}
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ srv.phone }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button
                        @click="handleDeleteService(srv.id)"
                        class="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg cursor-pointer transition-colors"
                        title="Delete Specialist"
                      >
                        <Trash2 class="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 4: GOVERNMENT SERVICES CMS (REAL DATA)                    -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'government'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈ (Government Services)' : 'Public Administrative Services' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'មគ្គុទ្ទេសក៍នីតិវិធី តម្លៃសេវាកំណត់ដោយរដ្ឋ និងឯកសារតម្រូវ' : 'Official procedural guides, requirements and government fees' }}
                </p>
              </div>
              <router-link
                to="/government"
                class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'មើលលើទំព័រសាធារណៈ' : 'View Public Portal' }}</span>
              </router-link>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ឈ្មោះសេវា' : 'Service Name' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ផ្នែក' : 'Category' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'តម្លៃសេវា' : 'Official Fee' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'រយៈពេលរង់ចាំ' : 'Processing Time' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="g in governmentServices" :key="g.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      <router-link :to="`/government/${g.id}`" class="hover:text-blue-600 transition-colors">
                        {{ localized(g.title, g.titleKh) }}
                      </router-link>
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                        {{ g.category }}
                      </span>
                    </td>
                    <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {{ localized(g.fee, g.feeKh) }}
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ localized(g.processingTime, g.processingTimeKh) }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check class="w-3 h-3" /> Live
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 5: HEALTHCARE & HOSPITALS CMS (REAL DATA)                 -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'health'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'សុខាភិបាល & មន្ទីរពេទ្យ (Healthcare CMS)' : 'Healthcare & Hospitals Directory' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'បណ្តាញមន្ទីរពេទ្យបង្អែកទាំង ២៥ រាជធានី-ខេត្ត និងការទទួលប័ណ្ណ ប.ស.ស' : 'Provincial referral hospitals and NSSF emergency acceptance' }}
                </p>
              </div>
              <router-link
                to="/health"
                class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'មើលលើទំព័រសាធារណៈ' : 'View Health Portal' }}</span>
              </router-link>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital Name' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ខេត្ត/ក្រុង' : 'Location' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'លេខសង្គ្រោះបន្ទាន់' : 'Hotline' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ប.ស.ស' : 'NSSF' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="h in hospitals" :key="h.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      <router-link :to="`/health/${h.id}`" class="hover:text-blue-600 transition-colors">
                        {{ localized(h.name, h.nameKh) }}
                      </router-link>
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ h.location }}
                    </td>
                    <td class="py-3 px-4 font-bold text-rose-600 dark:text-rose-400">
                      {{ h.phone || h.emergencyHotline }}
                    </td>
                    <td class="py-3 px-4">
                      <span v-if="h.acceptsNssf" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                        NSSF Accepted
                      </span>
                      <span v-else class="text-slate-400 text-[10px]">-</span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check class="w-3 h-3" /> 24/7 Verified
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 6: TRANSPORT CMS (REAL DATA)                              -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'transport'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'ដឹកជញ្ជូន & ឡានក្រុងរដ្ឋ (Transport CMS)' : 'City Bus & Public Transit CMS' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងខ្សែរត់ឡានក្រុងរាជធានីភ្នំពេញ តម្លៃសំបុត្រ និងម៉ោងចេញដំណើរ' : 'Phnom Penh City Bus Authority line schedules and routes' }}
                </p>
              </div>
              <router-link
                to="/transport"
                class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'មើលលើទំព័រសាធារណៈ' : 'View Public Transport' }}</span>
              </router-link>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ខ្សែរត់ / យានជំនិះ' : 'Route / Vehicle' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ទិសដៅរត់' : 'Route Path' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ម៉ោងដំណើរការ' : 'Schedule' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'តម្លៃ' : 'Price' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="tr in transportList" :key="tr.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      {{ localized(tr.name, tr.nameKh) }}
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ tr.route }}
                    </td>
                    <td class="py-3 px-4 font-semibold text-slate-700 dark:text-slate-300">
                      {{ tr.schedule }}
                    </td>
                    <td class="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                      {{ tr.price }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check class="w-3 h-3" /> Active Route
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 7: PUBLIC OFFICES & OWSO CMS (REAL DATA)                  -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'offices'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'ច្រកចេញចូលតែមួយ (OWSO Offices)' : 'One Window Service Offices' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'ការិយាល័យច្រកចេញចូលតែមួយ និងទីតាំងសេវាសាធារណៈក្រុង-ស្រុក' : 'Directory of official OWSO district offices across Cambodia' }}
                </p>
              </div>
              <router-link
                to="/locations"
                class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'មើលលើផែនទីសាធារណៈ' : 'View Public Map' }}</span>
              </router-link>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ការិយាល័យ' : 'Office Name' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន' : 'Address' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="loc in locationsList" :key="loc.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      {{ localized(loc.name, loc.nameKh) }}
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ localized(loc.address, loc.addressKh) }}
                    </td>
                    <td class="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">
                      {{ loc.phone }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check class="w-3 h-3" /> Verified
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 8: NEWS & BULLETINS CMS (REAL DATA)                       -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'news'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'ព័ត៌មាន & សេចក្តីជូនដំណឹង (News CMS)' : 'News & Announcements CMS' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'សេចក្តីជូនដំណឹងផ្លូវការ និងព័ត៌មានពលរដ្ឋកម្ពុជា' : 'Official civic announcements, regulations and health advisories' }}
                </p>
              </div>
              <router-link
                to="/news"
                class="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl flex items-center gap-2"
              >
                <ExternalLink class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'មើលលើទំព័រសាធារណៈ' : 'View Public News' }}</span>
              </router-link>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ចំណងជើង' : 'Title' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ផ្នែក' : 'Category' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ប្រភព' : 'Source' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="nw in newsList" :key="nw.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      {{ localized(nw.title, nw.titleKh) }}
                    </td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
                        {{ nw.category }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ nw.source }}
                    </td>
                    <td class="py-3 px-4 text-slate-400 text-[11px]">
                      {{ nw.date }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <span class="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        <Check class="w-3 h-3" /> Published
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 9: USERS DIRECTORY & ROLES (REAL INPUT)                   -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'users'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'គណនី & សិទ្ធិប្រើប្រាស់ (User Directory)' : 'User Directory & Access Control' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងសិទ្ធិពលរដ្ឋ និងអ្នកគ្រប់គ្រងប្រព័ន្ធ' : 'Manage citizen and administrator permissions' }}
                </p>
              </div>
            </div>

            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ឈ្មោះ' : 'Name' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'អ៊ីមែល' : 'Email' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'តួនាទី' : 'Role' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ប្តូរសិទ្ធិ' : 'Toggle Role' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="u in dummyUsers" :key="u.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
                      {{ u.name }}
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                      {{ u.email }}
                    </td>
                    <td class="py-3 px-4">
                      <span
                        :class="[
                          'px-2.5 py-0.5 rounded-full text-[10px] font-black',
                          u.role === 'Administrator'
                            ? 'bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-300'
                            : 'bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-300'
                        ]"
                      >
                        {{ u.role }}
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Active
                      </span>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <button
                        @click="toggleUserRole(u.id)"
                        class="px-2.5 py-1 text-[10px] font-black rounded-lg border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                      >
                        {{ u.role === 'Administrator' ? 'Switch to Citizen' : 'Promote to Admin' }}
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 10: FEEDBACK & CITIZEN REPORTS (REAL DATA & STATUS INPUT) -->
          <!-- ============================================================== -->
          <div v-else-if="activeTab === 'feedback'" class="space-y-6 animate-in fade-in duration-300">
            <div class="flex items-center justify-between">
              <div>
                <h1 class="text-2xl font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'របាយការណ៍ & មតិពលរដ្ឋ (Citizen Reports)' : 'Citizen Reports & Feedback Queue' }}
                </h1>
                <p class="text-xs text-slate-400 mt-1">
                  {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់ និងដោះស្រាយបណ្តឹងពលរដ្ឋអំពីសេវាសាធារណៈ' : 'Moderate public reports and issues submitted by Cambodian citizens' }}
                </p>
              </div>
            </div>

            <div v-if="reports.length === 0" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 text-xs">
              {{ currentLanguage === 'kh' ? 'មិនមានរបាយការណ៍ថ្មីៗឡើយ។' : 'No citizen reports found.' }}
            </div>

            <div v-else class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
              <table class="w-full text-left text-xs">
                <thead class="bg-slate-50 dark:bg-slate-800/60 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'សេវា / បញ្ហា' : 'Service / Issue' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'អ្នករាយការណ៍' : 'Submitter' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                    <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date' }}</th>
                    <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'ប្តូរស្ថានភាព' : 'Action' }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr v-for="r in reports" :key="r.id" class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="py-3 px-4">
                      <p class="font-bold text-slate-800 dark:text-white">{{ r.serviceTitle }}</p>
                      <p class="text-[11px] text-slate-400">{{ r.reasonLabel }} — {{ r.details }}</p>
                    </td>
                    <td class="py-3 px-4 text-slate-500 dark:text-slate-400">
                      {{ r.contactEmail || 'Citizen' }}
                    </td>
                    <td class="py-3 px-4">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded-full text-[10px] font-black uppercase',
                          r.status === 'resolved'
                            ? 'bg-emerald-50 text-emerald-600'
                            : r.status === 'verified'
                            ? 'bg-blue-50 text-blue-600'
                            : 'bg-amber-50 text-amber-600'
                        ]"
                      >
                        {{ r.status }}
                      </span>
                    </td>
                    <td class="py-3 px-4 text-slate-400 text-[11px]">
                      {{ new Date(r.createdAt).toLocaleDateString() }}
                    </td>
                    <td class="py-3 px-4 text-right space-x-1">
                      <button
                        @click="handleUpdateReportStatus(r.id, 'verified')"
                        class="px-2 py-1 text-[10px] font-bold rounded-md bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer"
                      >
                        Verify
                      </button>
                      <button
                        @click="handleUpdateReportStatus(r.id, 'resolved')"
                        class="px-2 py-1 text-[10px] font-bold rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                      >
                        Resolve
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- ============================================================== -->
          <!-- VIEW 11: SYSTEM SETTINGS & AUDIT LOGS                          -->
          <!-- ============================================================== -->
          <div v-else class="space-y-6 animate-in fade-in duration-300">
            <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6">
              <h1 class="text-xl font-black text-slate-900 dark:text-white mb-2">
                {{ activeTab === 'settings' ? 'System Settings & Security' : 'Audit Logs & Registry' }}
              </h1>
              <p class="text-xs text-slate-400 mb-6">
                {{ currentLanguage === 'kh' ? 'ការត្រួតពិនិត្យ និងសុវត្ថិភាពទិន្នន័យប្រព័ន្ធ CamLife ទាំងមូល' : 'Core infrastructure settings, security tokens and freshness audit' }}
              </p>

              <div class="space-y-4 text-xs">
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">API Data Freshness Engine</p>
                    <p class="text-slate-400 text-[11px]">Automatic synchronization with Cambodia Open Data Portals</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600">Active</span>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">Local Storage State Synchronization</p>
                    <p class="text-slate-400 text-[11px]">Synchronized with camlife_user_jobs, camlife_custom_home_services, and camlife-reports</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600">Connected</span>
                </div>
                <div class="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-between">
                  <div>
                    <p class="font-bold text-slate-800 dark:text-white">Role-Based Access Enforcement</p>
                    <p class="text-slate-400 text-[11px]">JWT token and session integrity for Administrator roles</p>
                  </div>
                  <span class="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600">Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- GLOBAL SEARCH MODAL (Ctrl + K)                                 -->
    <!-- ============================================================== -->
    <div
      v-if="isSearchModalOpen"
      class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4"
      @click.self="isSearchModalOpen = false"
    >
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search class="w-5 h-5 text-blue-600" />
          <input
            v-model="globalSearchQuery"
            type="text"
            autofocus
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវា ការងារ មន្ទីរពេទ្យ ឬអ្នកប្រើប្រាស់...' : 'Type to search services, jobs, hospitals or users...'"
            class="flex-1 bg-transparent text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
          />
          <button @click="isSearchModalOpen = false" class="p-1 text-slate-400 hover:text-slate-600">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="p-4 max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div class="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-xl cursor-pointer" @click="activeTab = 'government'; isSearchModalOpen = false">
            <div>
              <p class="font-bold text-slate-800 dark:text-white">{{ governmentServices[0]?.title || 'Cambodian Passport' }}</p>
              <p class="text-[11px] text-slate-400">Government Services · Ministry of Interior</p>
            </div>
            <span class="text-[10px] font-bold text-blue-600">Open →</span>
          </div>
          <div class="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-xl cursor-pointer" @click="activeTab = 'health'; isSearchModalOpen = false">
            <div>
              <p class="font-bold text-slate-800 dark:text-white">{{ hospitals[0]?.name || 'Calmette Hospital' }}</p>
              <p class="text-[11px] text-slate-400">Healthcare · {{ hospitals[0]?.location || 'Phnom Penh' }}</p>
            </div>
            <span class="text-[10px] font-bold text-blue-600">Open →</span>
          </div>
          <div class="py-2.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/60 px-2 rounded-xl cursor-pointer" @click="activeTab = 'jobs'; isSearchModalOpen = false">
            <div>
              <p class="font-bold text-slate-800 dark:text-white">{{ adminJobs[0]?.title || 'Senior Frontend Developer' }}</p>
              <p class="text-[11px] text-slate-400">Jobs · {{ adminJobs[0]?.company || 'Wing Bank' }}</p>
            </div>
            <span class="text-[10px] font-bold text-blue-600">Open →</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 2026 ENTERPRISE MODAL: POST JOB LISTING STUDIO                 -->
    <!-- ============================================================== -->
    <div
      v-if="isAddJobModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      @click.self="isAddJobModalOpen = false"
    >
      <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        <!-- Enterprise Modal Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 flex items-center justify-center shadow-xs">
              <Briefcase class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'ប្រកាសជ្រើសរើសបុគ្គលិកថ្មី (Job Studio)' : 'Publish New Career Opportunity' }}
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-500/30">
                  Live Sync
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? 'បំពេញព័ត៌មានការងារ — ទិន្នន័យនឹងត្រូវផ្សាយលើទំព័រ /jobs ភ្លាមៗ' : 'Listings will sync live to the public /jobs portal upon publishing.' }}
              </p>
            </div>
          </div>

          <!-- View Switcher Tabs: Form vs Live Citizen Preview -->
          <div class="flex items-center gap-2">
            <div class="bg-slate-200/70 dark:bg-slate-800 p-1 rounded-xl flex items-center gap-1 text-[11px] font-bold">
              <button
                type="button"
                @click="jobFormActiveTab = 'form'"
                :class="['px-3 py-1 rounded-lg transition-all', jobFormActiveTab === 'form' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800']"
              >
                Form Editor
              </button>
              <button
                type="button"
                @click="jobFormActiveTab = 'preview'"
                :class="['px-3 py-1 rounded-lg transition-all flex items-center gap-1', jobFormActiveTab === 'preview' ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-xs' : 'text-slate-500 hover:text-slate-800']"
              >
                <Eye class="w-3 h-3" />
                Live Preview
              </button>
            </div>

            <button
              @click="isAddJobModalOpen = false"
              class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Close (Esc)"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Enterprise Modal Body -->
        <div class="p-6 overflow-y-auto flex-1 space-y-6">
          <!-- TAB 1: FORM EDITOR -->
          <form v-if="jobFormActiveTab === 'form'" @submit.prevent="handleAddJob" id="job-post-form" class="space-y-6 text-xs">
            <!-- SECTION 1: ROLE IDENTITY -->
            <div class="space-y-4">
              <div class="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span class="w-5 h-5 rounded-md bg-blue-600 text-white text-[10px] font-black flex items-center justify-center">1</span>
                <span class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
                  {{ currentLanguage === 'kh' ? 'ព័ត៌មានតួនាទី & ក្រុមហ៊ុន' : 'Role Specification & Employer' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Title (English) <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <Briefcase class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      v-model="newJob.title"
                      required
                      type="text"
                      placeholder="e.g. Senior Fullstack Developer (Vue/Node)"
                      class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Job Title (Khmer)
                  </label>
                  <input
                    v-model="newJob.titleKh"
                    type="text"
                    placeholder="ឧ. អ្នកអភិវឌ្ឍន៍កម្មវិធីជាន់ខ្ពស់ Fullstack"
                    class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Hiring Organization / Company <span class="text-rose-500">*</span>
                  </label>
                  <div class="relative">
                    <Building2 class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      v-model="newJob.company"
                      required
                      type="text"
                      placeholder="e.g. Wing Bank (Cambodia) Plc"
                      class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Industry Category
                  </label>
                  <select
                    v-model="newJob.category"
                    class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                  >
                    <option value="IT">IT & Software Engineering</option>
                    <option value="Banking">Banking & Digital Finance</option>
                    <option value="Hospitality">Hospitality & Tourism</option>
                    <option value="Education">Education & Training</option>
                    <option value="Healthcare">Healthcare & Pharmacy</option>
                    <option value="Logistics">Logistics & Supply Chain</option>
                  </select>
                </div>
              </div>

              <!-- Employment Type Chips -->
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-2">Employment Arrangement</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    v-for="t in ['Full-time', 'Part-time', 'Internship', 'Freelance']"
                    :key="t"
                    @click="newJob.type = t as any"
                    :class="[
                      'px-3.5 py-1.5 rounded-xl font-bold transition-all border cursor-pointer',
                      newJob.type === t
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    ]"
                  >
                    {{ t }}
                  </button>
                </div>
              </div>
            </div>

            <!-- SECTION 2: COMPENSATION & LOCATION -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span class="w-5 h-5 rounded-md bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">2</span>
                <span class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
                  {{ currentLanguage === 'kh' ? 'ប្រាក់បំណាច់ & ទីតាំងបំពេញការងារ' : 'Compensation & Workplace Location' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Salary Min (USD)</label>
                  <div class="relative">
                    <DollarSign class="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      v-model.number="newJob.salaryMin"
                      type="number"
                      step="50"
                      class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Salary Max (USD)</label>
                  <div class="relative">
                    <DollarSign class="w-4 h-4 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      v-model.number="newJob.salaryMax"
                      type="number"
                      step="50"
                      class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Workplace Model</label>
                  <select
                    v-model="newJob.workplaceType"
                    class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                  >
                    <option value="On-site">🏢 On-site Office</option>
                    <option value="Hybrid">💻 Hybrid Working</option>
                    <option value="Remote">🌐 100% Remote</option>
                  </select>
                </div>
              </div>

              <!-- Quick Presets -->
              <div class="flex items-center gap-2 pt-1">
                <span class="text-[11px] font-bold text-slate-400">Quick Presets:</span>
                <button type="button" @click="applySalaryPreset(400, 700)" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">$400 - $700</button>
                <button type="button" @click="applySalaryPreset(800, 1500)" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">$800 - $1.5K</button>
                <button type="button" @click="applySalaryPreset(1500, 2500)" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">$1.5K - $2.5K</button>
                <button type="button" @click="applySalaryPreset(2500, 4000)" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[10px] font-bold hover:bg-blue-50 hover:text-blue-600 transition-colors">$2.5K - $4K</button>
              </div>

              <!-- Location Province Picker -->
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Province / Administrative City</label>
                <div class="relative">
                  <MapPin class="w-4 h-4 text-purple-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    v-model="newJob.location"
                    class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold cursor-pointer"
                  >
                    <option v-for="prov in cambodiaProvinces" :key="prov" :value="prov">
                      {{ prov }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- SECTION 3: DESCRIPTION, REQUIREMENTS & PERKS -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span class="w-5 h-5 rounded-md bg-indigo-600 text-white text-[10px] font-black flex items-center justify-center">3</span>
                <span class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
                  {{ currentLanguage === 'kh' ? 'លក្ខខណ្ឌតម្រូវ & អត្ថប្រយោជន៍' : 'Key Responsibilities & Qualifications' }}
                </span>
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Job Overview / Description</label>
                <textarea
                  v-model="newJob.description"
                  rows="2"
                  placeholder="Describe main responsibilities, team culture, and day-to-day work..."
                  class="w-full p-3 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium leading-relaxed"
                ></textarea>
              </div>

              <!-- Interactive Requirements Tag Adder -->
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Candidate Requirements (Click tags to remove)</label>
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newRequirementInput"
                    @keydown.enter.prevent="addRequirement"
                    type="text"
                    placeholder="Type a qualification (e.g. 2+ years Vue.js experience) & press Enter..."
                    class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <button
                    type="button"
                    @click="addRequirement"
                    class="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-blue-600 hover:text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(req, idx) in newJob.requirements"
                    :key="idx"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[11px] font-bold border border-blue-200/60 dark:border-blue-800"
                  >
                    <span>{{ req }}</span>
                    <button type="button" @click="removeRequirement(idx)" class="text-blue-400 hover:text-rose-500">×</button>
                  </span>
                </div>
              </div>

              <!-- Interactive Benefits Tag Adder -->
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Perks & Benefits</label>
                <div class="flex gap-2 mb-2">
                  <input
                    v-model="newBenefitInput"
                    @keydown.enter.prevent="addBenefit"
                    type="text"
                    placeholder="Type a perk (e.g. 13th month salary, NSSF) & press Enter..."
                    class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  />
                  <button
                    type="button"
                    @click="addBenefit"
                    class="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-600 hover:text-white font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    + Add
                  </button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="(ben, idx) in newJob.benefits"
                    :key="idx"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[11px] font-bold border border-emerald-200/60 dark:border-emerald-800"
                  >
                    <span>{{ ben }}</span>
                    <button type="button" @click="removeBenefit(idx)" class="text-emerald-400 hover:text-rose-500">×</button>
                  </span>
                </div>
              </div>
            </div>

            <!-- SECTION 4: APPLICATION URL & CONTACT -->
            <div class="space-y-4 pt-2">
              <div class="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
                <span class="w-5 h-5 rounded-md bg-rose-600 text-white text-[10px] font-black flex items-center justify-center">4</span>
                <span class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
                  {{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង & ដាក់ពាក្យ' : 'Application Channel & Contacts' }}
                </span>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Direct Application URL</label>
                  <div class="relative">
                    <ExternalLink class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      v-model="newJob.applyUrl"
                      type="url"
                      placeholder="https://company.com/careers/apply"
                      class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Recruiter Phone Hotline</label>
                  <div class="relative">
                    <Phone class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      v-model="newJob.contactPhone"
                      type="text"
                      placeholder="012 888 777"
                      class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>

          <!-- TAB 2: LIVE CITIZEN PREVIEW -->
          <div v-else class="space-y-4">
            <div class="p-3 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-200 dark:border-blue-900 flex items-center justify-between text-xs">
              <span class="font-bold text-blue-800 dark:text-blue-300">
                ⚡ Citizen Live Preview: Here is how this card renders on the public /jobs page:
              </span>
              <span class="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black">Public View</span>
            </div>

            <!-- Job Card Render Preview -->
            <div class="bg-white dark:bg-slate-800 border-2 border-blue-500/30 rounded-3xl p-6 shadow-xl space-y-4">
              <div class="flex items-start justify-between gap-4">
                <div class="flex items-start gap-3">
                  <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black flex items-center justify-center text-base shadow-md">
                    {{ (newJob.company || 'CL').slice(0, 2).toUpperCase() }}
                  </div>
                  <div>
                    <h4 class="text-base font-black text-slate-900 dark:text-white">
                      {{ newJob.title || 'Untitled Job Opportunity' }}
                    </h4>
                    <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
                      {{ newJob.company || 'Hiring Company' }} · <span class="text-blue-600 font-black">{{ newJob.location }}</span>
                    </p>
                  </div>
                </div>
                <span class="px-3 py-1 rounded-full text-xs font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-600 border border-emerald-500/20">
                  ${{ newJob.salaryMin }} - ${{ newJob.salaryMax }}/mo
                </span>
              </div>

              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {{ newJob.description || 'No job description provided yet. Recruiter will provide full specs.' }}
              </p>

              <div class="flex flex-wrap gap-1.5 pt-1">
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                  {{ newJob.type }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10px] font-bold">
                  {{ newJob.workplaceType }}
                </span>
                <span v-for="(b, i) in newJob.benefits.slice(0, 3)" :key="i" class="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-[10px] font-bold">
                  ✓ {{ b }}
                </span>
              </div>

              <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <span class="text-[11px] text-slate-400">Posted Today · Verified by CamLife</span>
                <button type="button" class="px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black">
                  Apply Now →
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Enterprise Modal Footer -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
          <div class="flex items-center gap-2 text-slate-400 text-xs">
            <Sparkles class="w-4 h-4 text-blue-500" />
            <span class="hidden sm:inline">Will sync to /jobs and local storage immediately</span>
          </div>

          <div class="flex items-center gap-2">
            <button
              type="button"
              @click="isAddJobModalOpen = false"
              class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="job-post-form"
              class="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
            >
              <Check class="w-4 h-4" />
              <span>{{ currentLanguage === 'kh' ? 'ផ្សព្វផ្សាយការងារ (Publish Live)' : 'Publish & Deploy Live' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- 2026 ENTERPRISE MODAL: ADD SPECIALIST FORM                     -->
    <!-- ============================================================== -->
    <div
      v-if="isAddServiceModalOpen"
      class="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      @click.self="isAddServiceModalOpen = false"
    >
      <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[92vh]">
        <!-- Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20 flex items-center justify-center shadow-xs">
              <Wrench class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-slate-900 dark:text-white">
                  {{ currentLanguage === 'kh' ? 'ចុះឈ្មោះជាងជួសជុលមានការធានា' : 'Register Certified Home Specialist' }}
                </h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-50 dark:bg-teal-950 text-teal-600 border border-teal-500/30">
                  Verified
                </span>
              </div>
              <p class="text-[11px] text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? 'ជាងជំនាញនឹងបង្ហាញលើទំព័រ /home-services ភ្លាមៗ' : 'Specialist will appear live on /home-services upon registration.' }}
              </p>
            </div>
          </div>

          <button
            @click="isAddServiceModalOpen = false"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Body -->
        <form @submit.prevent="handleAddService" id="service-post-form" class="p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          <!-- Section 1 -->
          <div class="space-y-3">
            <div class="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span class="w-5 h-5 rounded-md bg-teal-600 text-white text-[10px] font-black flex items-center justify-center">1</span>
              <span class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
                {{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណជាង & សេវាកម្ម' : 'Specialist Identity & Trade' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Service Title (English) *</label>
                <input
                  v-model="newService.serviceName"
                  required
                  type="text"
                  placeholder="e.g. Master Inverter AC Cleaning & Gas Refill"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Service Title (Khmer)</label>
                <input
                  v-model="newService.serviceNameKh"
                  type="text"
                  placeholder="ឧ. ជាងជំនាញលាង និងបញ្ចូលហ្គាសម៉ាស៊ីនត្រជាក់"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Lead Technician / Business Name *</label>
                <input
                  v-model="newService.provider"
                  required
                  type="text"
                  placeholder="e.g. Sok Piseth (Khmer AC Pro)"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Service Category</label>
                <select
                  v-model="newService.category"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold cursor-pointer"
                >
                  <option value="Air Conditioning">Air Conditioning Repair & Cleaning</option>
                  <option value="Electrician">Electrician & Electrical Wiring</option>
                  <option value="Plumber">Plumbing & Water Leakage</option>
                  <option value="Deep Cleaning">Home Deep Cleaning & Disinfection</option>
                  <option value="Painting">Painting & Wall Renovation</option>
                  <option value="Auto Repair">Mobile Automotive Mechanics</option>
                  <option value="Handyman">General Home Handyman</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Section 2 -->
          <div class="space-y-3 pt-2">
            <div class="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-800">
              <span class="w-5 h-5 rounded-md bg-emerald-600 text-white text-[10px] font-black flex items-center justify-center">2</span>
              <span class="font-black text-slate-800 dark:text-white uppercase tracking-wider text-[11px]">
                {{ currentLanguage === 'kh' ? 'តម្លៃសេវា & ទំនាក់ទំនង' : 'Rates, Phone & Coverage' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Min Rate ($)</label>
                <input
                  v-model.number="newService.priceMin"
                  type="number"
                  step="5"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Max Rate ($)</label>
                <input
                  v-model.number="newService.priceMax"
                  type="number"
                  step="5"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>

              <div>
                <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Operating Province</label>
                <select
                  v-model="newService.location"
                  class="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold cursor-pointer"
                >
                  <option v-for="p in cambodiaProvinces" :key="p" :value="p">{{ p }}</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Booking Hotline Phone *</label>
              <div class="relative">
                <Phone class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  v-model="newService.phone"
                  required
                  type="text"
                  placeholder="012 345 678"
                  class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold"
                />
              </div>
            </div>

            <!-- Interactive Skills Tag Input -->
            <div>
              <label class="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">Specializations & Skills</label>
              <div class="flex gap-2 mb-2">
                <input
                  v-model="newSkillInput"
                  @keydown.enter.prevent="addSkill"
                  type="text"
                  placeholder="Type a skill (e.g. Free Leak Diagnosis) & press Enter..."
                  class="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                />
                <button
                  type="button"
                  @click="addSkill"
                  class="px-3.5 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-teal-600 hover:text-white font-bold rounded-xl transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="(sk, idx) in newService.skills"
                  :key="idx"
                  class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 text-[11px] font-bold border border-teal-200/60 dark:border-teal-800"
                >
                  <span>{{ sk }}</span>
                  <button type="button" @click="removeSkill(idx)" class="text-teal-400 hover:text-rose-500">×</button>
                </span>
              </div>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-end gap-2">
          <button
            type="button"
            @click="isAddServiceModalOpen = false"
            class="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="service-post-form"
            class="px-6 py-2.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-all transform active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <Check class="w-4 h-4" />
            <span>{{ currentLanguage === 'kh' ? 'ចុះឈ្មោះជាង (Register Specialist)' : 'Register & Deploy Live' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- FLOATING NOTIFICATION TOAST                                    -->
    <!-- ============================================================== -->
    <transition name="toast">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold"
      >
        <CheckCircle2 class="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
</style>
