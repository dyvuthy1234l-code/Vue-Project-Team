<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
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
  LogOut,
  ExternalLink,
  Bell,
  Globe,
  CheckCircle2,
  Plus,
  Trash2,
  ShieldCheck,
  Clock,
  X,
  Eye
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
const { currentLanguage, setLanguage } = useLanguage()
const { currentUser, login, logout } = useAuth()
const { reports, updateReportStatus } = useFeedback()

usePageMeta({
  title: 'CamLife Admin CMS — Management Portal',
  description: 'Single-screen central management dashboard for CamLife civic platform.'
})

// Auto-login as Admin on mount so the user gets direct access immediately
onMounted(() => {
  if (!currentUser.value || (currentUser.value.role !== 'Administrator' && currentUser.value.role !== 'Admin')) {
    login({
      name: 'Admin Officer',
      email: 'admin@camlife.gov.kh',
      phone: '012 999 888',
      role: 'Administrator'
    })
  }
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

// Dropdown & Modal states
const isNotifDropdownOpen = ref(false)

// Toast Notification
const toastMessage = ref('')
function showToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Data Sources & State
const governmentServices = getGovernmentServices()
const hospitals = getHospitals()
const transportList = getTransport()
const newsList = getNews()
const locationsList = getLocations()

function loadAllJobs(): Job[] {
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

function loadAllHomeServices(): HomeService[] {
  const base = getHomeServices()
  try {
    const saved = localStorage.getItem('camlife_custom_home_services')
    if (saved) {
      const parsed: HomeService[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {}
  return [...base]
}

const adminJobs = ref<Job[]>(loadAllJobs())
const adminHomeServices = ref<HomeService[]>(loadAllHomeServices())

// Timeframe selector
const usageTimeframe = ref<'30days' | '7days' | 'year'>('30days')

// KPI Counts
const totalServicesCount = computed(() => governmentServices.length + hospitals.length + transportList.length + adminHomeServices.value.length)
const activeJobsCount = computed(() => adminJobs.value.length)
const newsCount = computed(() => newsList.length)
const totalUsersCount = computed(() => '12,458')
const citizenReportsCount = computed(() => reports.value.length)

// Analytics Data
const serviceUsageStats = computed(() => [
  { name: 'Government', nameKh: 'រដ្ឋបាលសាធារណៈ', views: `${governmentServices.length * 2.5}K`, heightPercent: 85, color: '#2563EB' },
  { name: 'Healthcare', nameKh: 'សុខាភិបាល', views: `${hospitals.length * 1.8}K`, heightPercent: 65, color: '#0D9488' },
  { name: 'Jobs', nameKh: 'ឱកាសការងារ', views: `${adminJobs.value.length * 1.5}K`, heightPercent: 55, color: '#0284C7' },
  { name: 'Transport', nameKh: 'ដឹកជញ្ជូន', views: `${transportList.length * 2}K`, heightPercent: 45, color: '#7C3AED' },
  { name: 'Home Services', nameKh: 'សេវាជួសជុល', views: `${adminHomeServices.value.length * 1.2}K`, heightPercent: 35, color: '#0891B2' },
  { name: 'Offices', nameKh: 'ច្រក OWSO', views: `${locationsList.length * 1.4}K`, heightPercent: 30, color: '#D97706' },
  { name: 'News', nameKh: 'ព័ត៌មាន', views: `${newsList.length * 1.5}K`, heightPercent: 25, color: '#4F46E5' }
])

// Activities Feed
const activities = ref([
  { id: 'act-1', title: 'Gov Service updated', titleKh: 'បានកែប្រែសេវាសាធារណៈ', detail: governmentServices[0]?.title || 'Passport Guide', detailKh: governmentServices[0]?.titleKh || 'មគ្គុទ្ទេសក៍លិខិតឆ្លងដែន', time: '5 នាទីមុន', timeEn: '5m ago' },
  { id: 'act-2', title: 'New Job posted', titleKh: 'បានបង្ហោះការងារថ្មី', detail: adminJobs.value[0]?.title || 'Frontend Dev', detailKh: adminJobs.value[0]?.titleKh || 'អ្នកអភិវឌ្ឍ Frontend', time: '20 នាទីមុន', timeEn: '20m ago' },
  { id: 'act-3', title: 'Location verified', titleKh: 'បានផ្ទៀងផ្ទាត់ទីតាំង', detail: locationsList[0]?.name || 'OWSO Daun Penh', detailKh: locationsList[0]?.nameKh || 'ច្រក OWSO ដូនពេញ', time: '1 ម៉ោងមុន', timeEn: '1h ago' },
  { id: 'act-4', title: 'News Published', titleKh: 'បានផ្សព្វផ្សាយព័ត៌មាន', detail: newsList[0]?.title || 'Transport policy', detailKh: newsList[0]?.titleKh || 'គោលការណ៍ដឹកជញ្ជូន', time: '2 ម៉ោងមុន', timeEn: '2h ago' }
])

// Pending Approvals
const pendingApprovals = ref([
  { id: 'p-1', type: 'job', title: 'Job: Senior Vue Developer', titleKh: 'ការងារ: Senior Vue Developer', entity: 'Wing Bank', time: '10 នាទីមុន', timeEn: '10m ago' },
  { id: 'p-2', type: 'news', title: 'News: Health Guidelines 2026', titleKh: 'ព័ត៌មាន: គោលការណ៍ណែនាំសុខភាព ២០២៦', entity: 'Ministry of Health', time: '1 ម៉ោងមុន', timeEn: '1h ago' },
  { id: 'p-3', type: 'location', title: 'Location: Sen Sok Clinic', titleKh: 'ទីតាំង: មជ្ឈមណ្ឌលសុខភាពសែនសុខ', entity: 'Phnom Penh Thmei', time: '2 ម៉ោងមុន', timeEn: '2h ago' }
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
        requirements: ['3+ years Vue/TypeScript experience', 'RESTful API integration'],
        benefits: ['13th-month bonus', 'Health insurance'],
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
    showToast(currentLanguage.value === 'kh' ? `បានអនុម័ត ${item.titleKh}!` : `Approved ${item.title}!`)
  }
}

function handleRejectPending(id: string) {
  const item = pendingApprovals.value.find(p => p.id === id)
  if (item) {
    pendingApprovals.value = pendingApprovals.value.filter(p => p.id !== id)
    showToast(currentLanguage.value === 'kh' ? `បានបដិសេធ ${item.titleKh}` : `Rejected ${item.title}`)
  }
}

// Add Job Modal State
const isAddJobModalOpen = ref(false)
const newJob = reactive({
  title: '',
  titleKh: '',
  company: '',
  category: 'IT',
  type: 'Full-time' as const,
  salaryMin: 600,
  salaryMax: 1200,
  location: 'Phnom Penh',
  description: ''
})

function handleAddJob() {
  if (!newJob.title || !newJob.company) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញចំណងជើងការងារ និងឈ្មោះក្រុមហ៊ុន!' : 'Please fill job title and company!')
    return
  }
  const createdJob: Job = {
    id: 'job-admin-' + Date.now(),
    title: newJob.title,
    titleKh: newJob.titleKh || newJob.title,
    company: newJob.company,
    category: newJob.category,
    location: newJob.location,
    salary: `$${newJob.salaryMin} - $${newJob.salaryMax}`,
    salaryMin: Number(newJob.salaryMin),
    salaryMax: Number(newJob.salaryMax),
    type: newJob.type,
    postedDate: 'Today',
    description: newJob.description || `Job position at ${newJob.company}.`,
    descriptionKh: `ឱកាសការងារនៅក្រុមហ៊ុន ${newJob.company}។`,
    requirements: ['Strong problem solving', 'Good team player'],
    benefits: ['Competitive salary', 'Medical insurance'],
    applyUrl: '#'
  }
  adminJobs.value.unshift(createdJob)
  try {
    const existingStr = localStorage.getItem('camlife_user_jobs')
    const existing: Job[] = existingStr ? JSON.parse(existingStr) : []
    existing.unshift(createdJob)
    localStorage.setItem('camlife_user_jobs', JSON.stringify(existing))
  } catch {}
  isAddJobModalOpen.value = false
  newJob.title = ''
  newJob.company = ''
  showToast(currentLanguage.value === 'kh' ? 'បានបន្ថែមការងារថ្មី!' : 'New job posted successfully!')
}

function handleDeleteJob(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកពិតជាចង់លុបការងារនេះមែនទេ?' : 'Delete this job?')) {
    adminJobs.value = adminJobs.value.filter(j => j.id !== id)
    try {
      const existingStr = localStorage.getItem('camlife_user_jobs')
      if (existingStr) {
        const existing: Job[] = JSON.parse(existingStr)
        localStorage.setItem('camlife_user_jobs', JSON.stringify(existing.filter(j => j.id !== id)))
      }
    } catch {}
    showToast(currentLanguage.value === 'kh' ? 'បានលុបការងារ' : 'Job deleted')
  }
}

// Citizen Report Status Update
function handleUpdateReportStatus(id: string, status: 'pending' | 'verified' | 'resolved') {
  updateReportStatus(id, status)
  showToast(currentLanguage.value === 'kh' ? `បានប្តូរស្ថានភាពទៅជា ${status}` : `Report marked as ${status}`)
}

// User List Toggle
const dummyUsers = ref([
  { id: 'u-1', name: 'Admin Officer', email: 'admin@camlife.gov.kh', role: 'Administrator', status: 'Active' },
  { id: 'u-2', name: 'Sok Vuthy', email: 'vuthy.sok@camlife.kh', role: 'Citizen', status: 'Active' },
  { id: 'u-3', name: 'Khem Chantha', email: 'chantha.khem@gmail.com', role: 'Citizen', status: 'Active' },
  { id: 'u-4', name: 'Dr. Heng Sopheap', email: 'sopheap.calmette@gov.kh', role: 'Administrator', status: 'Active' }
])

function toggleUserRole(userId: string) {
  const u = dummyUsers.value.find(user => user.id === userId)
  if (u) {
    u.role = u.role === 'Administrator' ? 'Citizen' : 'Administrator'
    showToast(currentLanguage.value === 'kh' ? `បានប្តូរសិទ្ធិទៅជា ${u.role}` : `Role updated to ${u.role}`)
  }
}

function handleSignOut() {
  logout()
  router.push('/')
}
</script>

<template>
  <!-- 100% SINGLE SCREEN LIGHT MODE CONTAINER -->
  <div class="h-screen max-h-screen overflow-hidden flex flex-col bg-[#F8FAFC] text-slate-800 font-sans select-none">

    <!-- Toast Notification -->
    <div
      v-if="toastMessage"
      class="fixed top-4 right-4 z-50 bg-emerald-600 text-white px-4 py-2 rounded-xl shadow-2xl text-xs font-bold flex items-center gap-2 animate-bounce font-khmer"
    >
      <CheckCircle2 class="w-4 h-4" />
      <span>{{ toastMessage }}</span>
    </div>

    <!-- ============================================================== -->
    <!-- TOP COMPACT LIGHT HEADER BAR (CLEAN LOGO, NO BADGE, NO SEARCH, NO DATE) -->
    <!-- ============================================================== -->
    <header class="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs">
      
      <!-- Left: Beautiful CamLife Brand Logo & Title -->
      <router-link to="/" class="flex items-center gap-3 group focus:outline-none">
        <img
          src="/logo.png"
          alt="CamLife"
          class="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
        />
        <div class="flex flex-col">
          <h1 class="text-base font-black text-slate-900 tracking-tight leading-none">CamLife</h1>
          <p class="text-[11px] text-blue-600 font-extrabold uppercase tracking-wider mt-0.5 font-khmer">
            {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងរដ្ឋបាលកណ្តាល' : 'Central Administration CMS' }}
          </p>
        </div>
      </router-link>

      <!-- Right Controls: Bilingual Segmented Switch Pill (KH ~ EN), Notifs, Admin Badge, Exit -->
      <div class="flex items-center gap-3 font-khmer">
        
        <!-- BILINGUAL SWITCH BUTTON PILL (KH ~ EN) -->
        <div class="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            @click="setLanguage('kh')"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer',
              currentLanguage === 'kh'
                ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            ]"
            type="button"
          >
            <Globe class="w-3.5 h-3.5 text-blue-600" />
            <span>ខ្មែរ (KH)</span>
          </button>

          <button
            @click="setLanguage('en')"
            :class="[
              'px-3 py-1 rounded-lg text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer',
              currentLanguage === 'en'
                ? 'bg-white text-blue-700 shadow-xs ring-1 ring-blue-500/20 font-black'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            ]"
            type="button"
          >
            <span>English (EN)</span>
          </button>
        </div>

        <!-- Notifications Dropdown Trigger -->
        <div class="relative">
          <button
            @click="isNotifDropdownOpen = !isNotifDropdownOpen"
            class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 relative cursor-pointer transition-colors"
            type="button"
            :title="currentLanguage === 'kh' ? 'ការជូនដំណឹង' : 'Notifications'"
          >
            <Bell class="w-4 h-4" />
            <span v-if="pendingApprovals.length" class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
              {{ pendingApprovals.length }}
            </span>
          </button>

          <!-- Notifications Dropdown -->
          <div v-if="isNotifDropdownOpen" class="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-2xl p-3 z-50 text-xs">
            <div class="flex items-center justify-between pb-2 border-b border-slate-100">
              <span class="font-black text-slate-800">{{ currentLanguage === 'kh' ? 'សំណើរង់ចាំការអនុម័ត' : 'Pending Approvals' }}</span>
              <span class="text-[10px] bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full font-bold border border-rose-200">{{ pendingApprovals.length }} {{ currentLanguage === 'kh' ? 'សំណើ' : 'Items' }}</span>
            </div>
            <div class="divide-y divide-slate-100 max-h-48 overflow-y-auto my-1">
              <div v-for="p in pendingApprovals" :key="p.id" class="py-2 space-y-1">
                <p class="font-bold text-slate-800">{{ currentLanguage === 'kh' ? p.titleKh : p.title }}</p>
                <div class="flex items-center justify-between">
                  <span class="text-[10px] text-slate-500">{{ p.entity }}</span>
                  <button @click="handleApprovePending(p.id)" class="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] rounded-lg font-bold cursor-pointer">
                    {{ currentLanguage === 'kh' ? 'អនុម័ត' : 'Approve' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Profile Badge -->
        <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div class="w-8 h-8 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center font-black text-xs shadow-xs">
            A
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-black text-slate-900 leading-tight">
              {{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រងរដ្ឋបាល' : 'Admin Officer' }}
            </p>
            <p class="text-[10px] text-blue-600 font-bold">
              {{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Administrator' }}
            </p>
          </div>
          <router-link
            to="/"
            class="ml-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
            :title="currentLanguage === 'kh' ? 'ទៅកាន់គេហទំព័រសាធារណៈ' : 'Return to public site'"
          >
            <ExternalLink class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden xl:inline text-[11px]">{{ currentLanguage === 'kh' ? 'គេហទំព័រ' : 'Public Site' }}</span>
          </router-link>
        </div>
      </div>
    </header>

    <!-- ============================================================== -->
    <!-- TOP KPI METRICS RIBBON (BILINGUAL)                             -->
    <!-- ============================================================== -->
    <div class="bg-slate-100/90 border-b border-slate-200/90 px-4 py-2 shrink-0 font-khmer">
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <!-- Metric 1: Total Services -->
        <div
          @click="activeTab = 'government'"
          class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs"
        >
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <FileText class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'សេវាសរុប' : 'Total Services' }}</p>
            <p class="text-sm font-black text-slate-900 leading-tight">{{ totalServicesCount }}</p>
          </div>
        </div>

        <!-- Metric 2: Active Jobs -->
        <div
          @click="activeTab = 'jobs'"
          class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs"
        >
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <Briefcase class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ការងារសកម្ម' : 'Active Jobs' }}</p>
            <p class="text-sm font-black text-slate-900 leading-tight">{{ activeJobsCount }}</p>
          </div>
        </div>

        <!-- Metric 3: Healthcare -->
        <div
          @click="activeTab = 'health'"
          class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs"
        >
          <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
            <HospitalIcon class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospitals' }}</p>
            <p class="text-sm font-black text-slate-900 leading-tight">{{ hospitals.length }}</p>
          </div>
        </div>

        <!-- Metric 4: News Articles -->
        <div
          @click="activeTab = 'news'"
          class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs"
        >
          <div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <Newspaper class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ព័ត៌មាន' : 'News Bulletins' }}</p>
            <p class="text-sm font-black text-slate-900 leading-tight">{{ newsCount }}</p>
          </div>
        </div>

        <!-- Metric 5: Citizen Reports -->
        <div
          @click="activeTab = 'feedback'"
          class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs"
        >
          <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <MessageSquare class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'បណ្តឹងពលរដ្ឋ' : 'Reports' }}</p>
            <p class="text-sm font-black text-slate-900 leading-tight">{{ citizenReportsCount }}</p>
          </div>
        </div>

        <!-- Metric 6: Users -->
        <div
          @click="activeTab = 'users'"
          class="bg-white hover:bg-slate-50 border border-slate-200 rounded-xl p-2 flex items-center gap-2.5 cursor-pointer transition-all shadow-2xs"
        >
          <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <Users class="w-4 h-4" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-[10px] font-bold text-slate-500 truncate uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់' : 'Users' }}</p>
            <p class="text-sm font-black text-slate-900 leading-tight">{{ totalUsersCount }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================== -->
    <!-- MAIN SINGLE-SCREEN LIGHT SPLIT CONTENT AREA                    -->
    <!-- ============================================================== -->
    <div class="flex-1 min-h-0 flex overflow-hidden p-3 gap-3">

      <!-- LEFT NAVIGATION SIDEBAR (FULLY BILINGUAL) -->
      <aside class="w-52 xl:w-56 shrink-0 bg-white border border-slate-200 rounded-2xl p-2 flex flex-col justify-between overflow-hidden shadow-xs font-khmer">
        <div class="space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 pr-0.5">
          <div class="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-slate-400">
            {{ currentLanguage === 'kh' ? 'ម៉ឺនុយគ្រប់គ្រងប្រព័ន្ធ' : 'System Navigation' }}
          </div>

          <button
            @click="activeTab = 'dashboard'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer', activeTab === 'dashboard' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <LayoutDashboard class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ផ្ទាំងសង្ខេប' : 'Dashboard Overview' }}</span>
          </button>

          <button
            @click="activeTab = 'government'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'government' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <FileText class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈ' : 'Government Services' }}</span>
          </button>

          <button
            @click="activeTab = 'health'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'health' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <HospitalIcon class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'សុខាភិបាល & មន្ទីរពេទ្យ' : 'Healthcare Directory' }}</span>
          </button>

          <button
            @click="activeTab = 'jobs'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'jobs' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <Briefcase class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ការងារ & អាជីព' : 'Jobs Board' }}</span>
          </button>

          <button
            @click="activeTab = 'transport'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'transport' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <Bus class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ដឹកជញ្ជូន & ឡានក្រុង' : 'Transport Routes' }}</span>
          </button>

          <button
            @click="activeTab = 'homeservices'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'homeservices' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <Home class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'សេវាជួសជុលតាមផ្ទះ' : 'Home Services' }}</span>
          </button>

          <button
            @click="activeTab = 'offices'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'offices' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <Building2 class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ច្រក OWSO & ទីតាំង' : 'Public Offices & OWSO' }}</span>
          </button>

          <button
            @click="activeTab = 'news'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'news' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <Newspaper class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ព័ត៌មាន & សេចក្តីជូនដំណឹង' : 'News Articles' }}</span>
          </button>

          <button
            @click="activeTab = 'feedback'"
            :class="['w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'feedback' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <span class="flex items-center gap-2.5 truncate">
              <MessageSquare class="w-4 h-4 shrink-0" />
              <span class="truncate">{{ currentLanguage === 'kh' ? 'បណ្តឹង & មតិពលរដ្ឋ' : 'Citizen Reports' }}</span>
            </span>
            <span v-if="citizenReportsCount" class="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-100 text-amber-800 border border-amber-200">{{ citizenReportsCount }}</span>
          </button>

          <button
            @click="activeTab = 'users'"
            :class="['w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer', activeTab === 'users' ? 'bg-[#0D47A1] text-white shadow-md font-black' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100/80']"
            type="button"
          >
            <Users class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'គណនីអ្នកប្រើប្រាស់' : 'User Access Directory' }}</span>
          </button>
        </div>

        <!-- Sidebar Bottom Sign Out -->
        <div class="pt-2 border-t border-slate-200">
          <button
            @click="handleSignOut"
            class="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
            type="button"
          >
            <LogOut class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
          </button>
        </div>
      </aside>

      <!-- CENTER & RIGHT DASHBOARD GRID (BILINGUAL LIGHT MODE) -->
      <main class="flex-1 min-h-0 bg-white border border-slate-200 rounded-2xl p-3.5 flex flex-col overflow-hidden shadow-xs font-khmer">

        <!-- ============================================================== -->
        <!-- TAB 1: OVERVIEW DASHBOARD (BILINGUAL)                          -->
        <!-- ============================================================== -->
        <div v-if="activeTab === 'dashboard'" class="flex-1 min-h-0 grid grid-cols-12 gap-3.5 overflow-hidden">

          <!-- Left Column (7 cols): Service Analytics & Visual Chart -->
          <div class="col-span-12 lg:col-span-7 flex flex-col min-h-0 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-4 overflow-hidden">
            <div class="flex items-center justify-between mb-2 shrink-0">
              <div>
                <h3 class="text-sm font-black text-slate-900 leading-tight">
                  {{ currentLanguage === 'kh' ? 'ការវិភាគ និងការប្រើប្រាស់សេវា' : 'Service Usage & Analytics' }}
                </h3>
                <p class="text-[11px] text-slate-500 font-semibold mt-0.5">
                  {{ currentLanguage === 'kh' ? 'ទិន្នន័យនៃការចូលមើលសេវាកម្មសាធារណៈដោយពលរដ្ឋ' : 'Citizen interaction metrics across platform modules' }}
                </p>
              </div>
              <select
                v-model="usageTimeframe"
                class="text-[11px] font-bold bg-white border border-slate-200 text-slate-700 rounded-xl px-2.5 py-1 focus:outline-none cursor-pointer shadow-2xs"
              >
                <option value="30days">{{ currentLanguage === 'kh' ? '៣០ ថ្ងៃចុងក្រោយ' : 'Last 30 Days' }}</option>
                <option value="7days">{{ currentLanguage === 'kh' ? '៧ ថ្ងៃចុងក្រោយ' : 'Last 7 Days' }}</option>
                <option value="year">{{ currentLanguage === 'kh' ? 'ឆ្នាំនេះ' : 'This Year' }}</option>
              </select>
            </div>

            <!-- Custom Visual Bar Chart Container -->
            <div class="flex-1 min-h-0 flex flex-col justify-end pt-2 pb-1">
              <div class="flex-1 min-h-0 relative flex items-end justify-between gap-2 px-1 pb-1 border-b border-slate-200">
                <!-- Bars -->
                <div
                  v-for="(item, idx) in serviceUsageStats"
                  :key="idx"
                  class="flex-1 flex flex-col items-center justify-end h-full group"
                >
                  <span class="text-[10px] font-bold text-slate-700 mb-1 group-hover:scale-110 transition-transform">{{ item.views }}</span>
                  <div
                    class="w-full max-w-[34px] rounded-t-lg transition-all duration-300 group-hover:opacity-85 shadow-2xs"
                    :style="{ height: item.heightPercent + '%', backgroundColor: item.color }"
                  ></div>
                </div>
              </div>

              <!-- Bar Labels -->
              <div class="flex items-center justify-between gap-2 px-1 pt-2 shrink-0">
                <div v-for="(item, idx) in serviceUsageStats" :key="idx" class="flex-1 text-center truncate">
                  <span class="text-[10px] font-bold text-slate-700 block truncate">{{ currentLanguage === 'kh' ? item.nameKh : item.name }}</span>
                </div>
              </div>
            </div>

            <!-- Quick Action Buttons Strip -->
            <div class="pt-3 border-t border-slate-200 flex items-center justify-between shrink-0">
              <div class="flex items-center gap-2">
                <button
                  @click="isAddJobModalOpen = true"
                  class="px-3.5 py-1.5 bg-[#0D47A1] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                  type="button"
                >
                  <Plus class="w-3.5 h-3.5" />
                  <span>{{ currentLanguage === 'kh' ? '+ បង្ហោះការងារថ្មី' : '+ Post New Job' }}</span>
                </button>
                <button
                  @click="activeTab = 'feedback'"
                  class="px-3.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-2xs"
                  type="button"
                >
                  <MessageSquare class="w-3.5 h-3.5 text-amber-600" />
                  <span>{{ currentLanguage === 'kh' ? 'ពិនិត្យរបាយការណ៍' : 'Review Reports' }}</span>
                </button>
              </div>
              <span class="text-[11px] text-emerald-600 font-bold flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធដំណើរការ ១០០%' : 'System Online (100%)' }}</span>
              </span>
            </div>
          </div>

          <!-- Right Column (5 cols): Pending Approvals & Live Activities -->
          <div class="col-span-12 lg:col-span-5 flex flex-col min-h-0 gap-3.5 overflow-hidden">
            <!-- Pending Approvals Box -->
            <div class="flex-1 min-h-0 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col overflow-hidden">
              <div class="flex items-center justify-between mb-2 shrink-0">
                <h4 class="text-xs font-black text-slate-900 flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-amber-600" />
                  <span>{{ currentLanguage === 'kh' ? 'បញ្ជីរង់ចាំការអនុម័ត' : 'Pending Approval Queue' }}</span>
                </h4>
                <span class="text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">{{ pendingApprovals.length }} {{ currentLanguage === 'kh' ? 'សំណើ' : 'items' }}</span>
              </div>

              <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                <div v-for="p in pendingApprovals" :key="p.id" class="py-2 first:pt-0 last:pb-0 space-y-1">
                  <p class="text-xs font-bold text-slate-800 leading-snug">{{ currentLanguage === 'kh' ? p.titleKh : p.title }}</p>
                  <div class="flex items-center justify-between text-[10px]">
                    <span class="text-slate-500 font-medium">{{ p.entity }} · {{ currentLanguage === 'kh' ? p.time : p.timeEn }}</span>
                    <div class="flex items-center gap-1">
                      <button @click="handleApprovePending(p.id)" class="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold cursor-pointer" type="button">
                        {{ currentLanguage === 'kh' ? 'អនុម័ត' : 'Approve' }}
                      </button>
                      <button @click="handleRejectPending(p.id)" class="px-2 py-0.5 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md font-bold border border-rose-200 cursor-pointer" type="button">
                        {{ currentLanguage === 'kh' ? 'បដិសេធ' : 'Reject' }}
                      </button>
                    </div>
                  </div>
                </div>
                <div v-if="!pendingApprovals.length" class="text-center py-4 text-xs text-slate-400 font-semibold">
                  {{ currentLanguage === 'kh' ? 'គ្មានសំណើរង់ចាំទេ!' : 'All submissions approved!' }}
                </div>
              </div>
            </div>

            <!-- Recent System Activity Box -->
            <div class="h-44 shrink-0 bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 flex flex-col overflow-hidden">
              <h4 class="text-xs font-black text-slate-900 mb-2 flex items-center gap-1.5 shrink-0">
                <ShieldCheck class="w-3.5 h-3.5 text-blue-600" />
                <span>{{ currentLanguage === 'kh' ? 'កំណត់ហេតុសកម្មភាពប្រព័ន្ធ' : 'Live Audit Activity Log' }}</span>
              </h4>
              <div class="flex-1 min-h-0 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-slate-200">
                <div v-for="act in activities" :key="act.id" class="text-[11px] flex items-center justify-between gap-2 p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
                  <div class="min-w-0">
                    <p class="font-bold text-slate-800 truncate">{{ currentLanguage === 'kh' ? act.titleKh : act.title }}</p>
                    <p class="text-[10px] text-slate-500 truncate">{{ currentLanguage === 'kh' ? act.detailKh : act.detail }}</p>
                  </div>
                  <span class="text-[10px] text-slate-400 shrink-0 font-medium">{{ currentLanguage === 'kh' ? act.time : act.timeEn }}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!-- ============================================================== -->
        <!-- TAB 2: GOVERNMENT SERVICES CMS TABS                             -->
        <!-- ============================================================== -->
        <div v-else-if="activeTab === 'government'" class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 class="text-sm font-black text-slate-900">
                {{ currentLanguage === 'kh' ? 'បញ្ជីសេវារដ្ឋបាលសាធារណៈផ្លូវការ' : 'Government Public Services Registry' }}
              </h3>
              <p class="text-[11px] text-slate-500 font-semibold">
                {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងមគ្គុទ្ទេសក៍ តម្លៃសេវា និងរៀបចំឯកសារ' : 'Manage official government guides, fees, and required documents' }}
              </p>
            </div>
            <span class="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-xl border border-blue-200">
              {{ governmentServices.length }} {{ currentLanguage === 'kh' ? 'សេវាសកម្ម' : 'Active Guides' }}
            </span>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80 bg-slate-50/70 rounded-2xl border border-slate-200 p-2 scrollbar-thin scrollbar-thumb-slate-200">
            <div v-for="g in governmentServices" :key="g.id" class="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-white rounded-xl transition-colors">
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-900">{{ currentLanguage === 'kh' ? g.titleKh : g.title }}</p>
                <p class="text-[11px] text-slate-500 truncate mt-0.5">
                  {{ g.category }} · {{ currentLanguage === 'kh' ? 'តម្លៃ: ' + g.feeKh : 'Fee: ' + g.fee }} · {{ currentLanguage === 'kh' ? 'រយៈពេល: ' + g.processingTimeKh : 'Time: ' + g.processingTime }}
                </p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <router-link :to="`/government/${g.id}`" class="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-blue-600 rounded-lg shadow-2xs">
                  <Eye class="w-3.5 h-3.5" />
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- TAB 3: HEALTHCARE & HOSPITALS                                  -->
        <!-- ============================================================== -->
        <div v-else-if="activeTab === 'health'" class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 class="text-sm font-black text-slate-900">
                {{ currentLanguage === 'kh' ? 'បញ្ជីមន្ទីរពេទ្យ និងមណ្ឌលសុខភាព' : 'Healthcare Facilities Directory' }}
              </h3>
              <p class="text-[11px] text-slate-500 font-semibold">
                {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងព័ត៌មានមន្ទីរពេទ្យ និងលេខទូរស័ព្ទសង្គ្រោះបន្ទាន់' : 'Manage healthcare directory and emergency hotlines' }}
              </p>
            </div>
            <span class="text-xs font-bold text-teal-700 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
              {{ hospitals.length }} {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospitals' }}
            </span>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80 bg-slate-50/70 rounded-2xl border border-slate-200 p-2 scrollbar-thin scrollbar-thumb-slate-200">
            <div v-for="h in hospitals" :key="h.id" class="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-white rounded-xl transition-colors">
              <div>
                <p class="text-xs font-bold text-slate-900">{{ currentLanguage === 'kh' ? h.nameKh : h.name }}</p>
                <p class="text-[11px] text-slate-500 mt-0.5">
                  {{ currentLanguage === 'kh' ? h.addressKh : h.location }} · {{ currentLanguage === 'kh' ? 'សង្គ្រោះបន្ទាន់: ' : 'Emergency: ' }}{{ h.emergencyHotline || h.phone }}
                </p>
              </div>
              <router-link :to="`/health/${h.id}`" class="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-teal-600 rounded-lg shadow-2xs">
                <Eye class="w-3.5 h-3.5" />
              </router-link>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- TAB 4: JOBS BOARD CMS                                          -->
        <!-- ============================================================== -->
        <div v-else-if="activeTab === 'jobs'" class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 class="text-sm font-black text-slate-900">
                {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងឱកាសការងារ និងអាជីព' : 'Jobs Board & Career Opportunities' }}
              </h3>
              <p class="text-[11px] text-slate-500 font-semibold">
                {{ currentLanguage === 'kh' ? 'បង្ហោះ ត្រួតពិនិត្យ និងលុបការងារលើ CamLife' : 'Post, review, and remove job listings shown on CamLife Jobs' }}
              </p>
            </div>
            <button @click="isAddJobModalOpen = true" class="px-3.5 py-1.5 bg-[#0D47A1] hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs" type="button">
              <Plus class="w-3.5 h-3.5" /> {{ currentLanguage === 'kh' ? '+ បង្ហោះការងារ' : '+ Post Job' }}
            </button>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80 bg-slate-50/70 rounded-2xl border border-slate-200 p-2 scrollbar-thin scrollbar-thumb-slate-200">
            <div v-for="j in adminJobs" :key="j.id" class="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-white rounded-xl transition-colors">
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-900">{{ currentLanguage === 'kh' ? j.titleKh : j.title }}</p>
                <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ j.company }} · {{ j.location }} · {{ j.salary }}</p>
              </div>
              <div class="flex items-center gap-2 shrink-0">
                <button @click="handleDeleteJob(j.id)" class="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 rounded-lg cursor-pointer" type="button">
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- TAB 5: CITIZEN REPORTS & FEEDBACK                              -->
        <!-- ============================================================== -->
        <div v-else-if="activeTab === 'feedback'" class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 class="text-sm font-black text-slate-900">
                {{ currentLanguage === 'kh' ? 'ប្រអប់ទទួលបណ្តឹង និងមតិពលរដ្ឋ' : 'Citizen Reports & Feedback Inbox' }}
              </h3>
              <p class="text-[11px] text-slate-500 font-semibold">
                {{ currentLanguage === 'kh' ? 'ពិនិត្យ និងប្តូរស្ថានភាពបណ្តឹងពលរដ្ឋ' : 'Review and update status of reports filed by citizens' }}
              </p>
            </div>
            <span class="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1 rounded-xl border border-amber-200">
              {{ reports.length }} {{ currentLanguage === 'kh' ? 'បណ្តឹងកត់ត្រា' : 'Reports Logged' }}
            </span>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80 bg-slate-50/70 rounded-2xl border border-slate-200 p-2 scrollbar-thin scrollbar-thumb-slate-200">
            <div v-for="r in reports" :key="r.id" class="py-3 px-3 space-y-1.5 hover:bg-white rounded-xl transition-colors">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-900">{{ r.serviceTitle }}</span>
                <span :class="['text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border', r.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200']">
                  {{ r.status === 'resolved' ? (currentLanguage === 'kh' ? 'ដោះស្រាយរួច' : 'Resolved') : (currentLanguage === 'kh' ? 'កំពុងពិនិត្យ' : 'Pending') }}
                </span>
              </div>
              <p class="text-xs text-slate-700 bg-white p-2.5 rounded-xl border border-slate-200 shadow-2xs">{{ r.details }}</p>
              <div class="flex items-center justify-between text-[10px] text-slate-500">
                <span>{{ currentLanguage === 'kh' ? 'ដោយពលរដ្ឋ: ' : 'By: ' }}{{ r.contactEmail || 'Citizen' }}</span>
                <div class="flex items-center gap-1.5">
                  <button @click="handleUpdateReportStatus(r.id, 'verified')" class="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold cursor-pointer" type="button">
                    {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់' : 'Mark Verified' }}
                  </button>
                  <button @click="handleUpdateReportStatus(r.id, 'resolved')" class="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold cursor-pointer" type="button">
                    {{ currentLanguage === 'kh' ? 'ដោះស្រាយរួច' : 'Mark Resolved' }}
                  </button>
                </div>
              </div>
            </div>
            <div v-if="!reports.length" class="text-center py-6 text-slate-400 text-xs font-semibold">
              {{ currentLanguage === 'kh' ? 'គ្មានបណ្តឹងពលរដ្ឋទេ' : 'No citizen reports recorded yet.' }}
            </div>
          </div>
        </div>

        <!-- ============================================================== -->
        <!-- TAB 6: USER ACCESS DIRECTORY                                   -->
        <!-- ============================================================== -->
        <div v-else-if="activeTab === 'users'" class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <div>
              <h3 class="text-sm font-black text-slate-900">
                {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងគណនីអ្នកប្រើប្រាស់ និងសិទ្ធិ' : 'Registered Users & Role Management' }}
              </h3>
              <p class="text-[11px] text-slate-500 font-semibold">
                {{ currentLanguage === 'kh' ? 'ប្តូរសិទ្ធិប្រើប្រាស់រវាង ពលរដ្ឋ និង Admin' : 'Manage roles between Citizen and Administrator' }}
              </p>
            </div>
            <span class="text-xs font-bold text-sky-800 bg-sky-50 px-3 py-1 rounded-xl border border-sky-200">
              {{ dummyUsers.length }} {{ currentLanguage === 'kh' ? 'គណនី' : 'Accounts' }}
            </span>
          </div>

          <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-200/80 bg-slate-50/70 rounded-2xl border border-slate-200 p-2 scrollbar-thin scrollbar-thumb-slate-200">
            <div v-for="u in dummyUsers" :key="u.id" class="py-2.5 px-3 flex items-center justify-between gap-3 hover:bg-white rounded-xl transition-colors">
              <div>
                <p class="text-xs font-bold text-slate-900">{{ u.name }} <span class="text-[10px] text-slate-500">({{ u.email }})</span></p>
                <p class="text-[10px] text-slate-500 font-medium">
                  {{ currentLanguage === 'kh' ? 'សិទ្ធិ: ' : 'Role: ' }}<span class="font-bold text-blue-600">{{ u.role }}</span>
                </p>
              </div>
              <button @click="toggleUserRole(u.id)" class="px-3 py-1.5 bg-white hover:bg-slate-100 text-xs text-slate-700 rounded-xl border border-slate-200 font-bold cursor-pointer shadow-2xs" type="button">
                {{ currentLanguage === 'kh' ? 'ប្តូរសិទ្ធិ Admin' : 'Toggle Admin Role' }}
              </button>
            </div>
          </div>
        </div>

        <!-- DEFAULT / OTHER TABS (Transport, Home Services, Offices, News, Settings, Logs) -->
        <div v-else class="flex-1 min-h-0 flex flex-col overflow-hidden">
          <div class="flex items-center justify-between mb-3 shrink-0">
            <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">{{ activeTab }} Module</h3>
            <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-200">
              {{ currentLanguage === 'kh' ? 'ស្ថានភាព: សកម្ម' : 'Status: Active' }}
            </span>
          </div>
          <div class="flex-1 min-h-0 bg-slate-50/80 border border-slate-200 rounded-2xl p-4 flex flex-col justify-center items-center text-center">
            <ShieldCheck class="w-10 h-10 text-blue-600 mb-2 animate-bounce" />
            <h4 class="text-sm font-bold text-slate-900 mb-1">
              {{ currentLanguage === 'kh' ? 'ប្រព័ន្ធដំណើរការប្រក្រតី' : 'Module Operational' }}
            </h4>
            <p class="text-xs text-slate-500 max-w-sm font-medium">
              {{ currentLanguage === 'kh' ? `ទិន្នន័យនៃផ្នែក ${activeTab} ត្រូវបានតភ្ជាប់ និងធ្វើបច្ចុប្បន្នភាពពេញលេញ។` : `All live data pipelines for ${activeTab} are synchronized and responding cleanly.` }}
            </p>
            <button @click="activeTab = 'dashboard'" class="mt-4 px-4 py-2 bg-[#0D47A1] hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs" type="button">
              {{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅផ្ទាំងសង្ខេប' : 'Return to Dashboard Overview' }}
            </button>
          </div>
        </div>

      </main>

    </div>

    <!-- ============================================================== -->
    <!-- MODAL: ADD JOB POPUP OVERLAY (BILINGUAL)                       -->
    <!-- ============================================================== -->
    <div v-if="isAddJobModalOpen" class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 font-khmer">
      <div class="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 class="text-sm font-black text-slate-900">
            {{ currentLanguage === 'kh' ? 'បង្ហោះឱកាសការងារថ្មី' : 'Post New Job Opportunity' }}
          </h3>
          <button @click="isAddJobModalOpen = false" class="text-slate-400 hover:text-slate-700" type="button">
            <X class="w-4 h-4" />
          </button>
        </div>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block text-slate-700 mb-1 font-bold">
              {{ currentLanguage === 'kh' ? 'ចំណងជើងការងារ (អង់គ្លេស/ខ្មែរ)' : 'Job Title' }}
            </label>
            <input v-model="newJob.title" type="text" placeholder="e.g. Senior Frontend Developer" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold" />
          </div>
          <div>
            <label class="block text-slate-700 mb-1 font-bold">
              {{ currentLanguage === 'kh' ? 'ឈ្មោះក្រុមហ៊ុន' : 'Company Name' }}
            </label>
            <input v-model="newJob.company" type="text" placeholder="e.g. Wing Bank (Cambodia)" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-slate-700 mb-1 font-bold">
                {{ currentLanguage === 'kh' ? 'ប្រាក់ខែអប្បបរមា ($)' : 'Min Salary ($)' }}
              </label>
              <input v-model.number="newJob.salaryMin" type="number" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold" />
            </div>
            <div>
              <label class="block text-slate-700 mb-1 font-bold">
                {{ currentLanguage === 'kh' ? 'ប្រាក់ខែអតិបរមា ($)' : 'Max Salary ($)' }}
              </label>
              <input v-model.number="newJob.salaryMax" type="number" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold" />
            </div>
          </div>
          <div>
            <label class="block text-slate-700 mb-1 font-bold">
              {{ currentLanguage === 'kh' ? 'ទីតាំង' : 'Location' }}
            </label>
            <input v-model="newJob.location" type="text" placeholder="Phnom Penh" class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold" />
          </div>
        </div>
        <div class="pt-2 flex justify-end gap-2">
          <button @click="isAddJobModalOpen = false" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 cursor-pointer" type="button">
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button @click="handleAddJob" class="px-5 py-2 bg-[#0D47A1] hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer shadow-xs" type="button">
            {{ currentLanguage === 'kh' ? 'ផ្សព្វផ្សាយការងារ' : 'Publish Job' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 4px;
}
</style>
