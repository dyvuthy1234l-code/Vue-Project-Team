<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  FileText,
  UserCheck,
  Key,
  ShieldCheck,
  Search,
  Download,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  Monitor,
  CheckCircle2,
  Info,
  AlertTriangle
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

export type LogCategory = 'Approve' | 'Update' | 'Publish' | 'Delete' | 'Auth'
export type LogSeverity = 'success' | 'info' | 'warning'

interface LogEntry {
  id: string
  action: string
  actionKh: string
  category: LogCategory
  user: string
  userRole: string
  target: string
  module: string
  ip: string
  device: string
  time: string
  date: string
  severity: LogSeverity
  details?: string
}

const defaultLogs: LogEntry[] = [
  {
    id: 'log-01',
    action: 'Approve Job Listing',
    actionKh: 'អនុម័តការងារថ្មីក្នុងប្រព័ន្ធ',
    category: 'Approve',
    user: 'Admin Officer',
    userRole: 'Administrator',
    target: 'Senior Vue Developer #job-402',
    module: 'Careers & Jobs',
    ip: '103.216.48.12',
    device: 'Chrome / Windows 11',
    time: '10 នាទីមុន (10m ago)',
    date: '2026-03-13 14:52',
    severity: 'success',
    details: 'Verified employer registration and published job vacancy to public civic job board.'
  },
  {
    id: 'log-02',
    action: 'Update Hospital Profile',
    actionKh: 'កែប្រែព័ត៌មានមន្ទីរពេទ្យបង្អែក',
    category: 'Update',
    user: 'Khem Sreypov',
    userRole: 'Gov Officer',
    target: 'Takeo Referral Hospital',
    module: 'Hospitals & Health',
    ip: '103.216.48.15',
    device: 'Safari / macOS',
    time: '45 នាទីមុន (45m ago)',
    date: '2026-03-13 14:17',
    severity: 'info',
    details: 'Updated emergency contact number and expanded ICU bed capacity metrics.'
  },
  {
    id: 'log-03',
    action: 'Publish News Article',
    actionKh: 'ផ្សព្វផ្សាយព័ត៌មានគោលនយោបាយថ្មី',
    category: 'Publish',
    user: 'Pich Samnang',
    userRole: 'Officer',
    target: 'Public Transport Policy 2026',
    module: 'News & Media',
    ip: '119.15.89.44',
    device: 'Chrome / Windows 11',
    time: '1 ម៉ោងមុន (1h ago)',
    date: '2026-03-13 13:45',
    severity: 'success',
    details: 'Press release published under Category: Public Infrastructure & City Bus.'
  },
  {
    id: 'log-04',
    action: 'Resolve Citizen Report',
    actionKh: 'ដោះស្រាយរបាយការណ៍អំពូលភ្លើងខូច',
    category: 'Update',
    user: 'Sok Dara',
    userRole: 'Specialist',
    target: 'Report #rep-03 (Broken Streetlight)',
    module: 'Feedback & Reports',
    ip: '103.216.48.12',
    device: 'Firefox / Linux',
    time: '2 ម៉ោងមុន (2h ago)',
    date: '2026-03-13 12:30',
    severity: 'success',
    details: 'Technician dispatched, repaired wiring, and marked ticket as Resolved.'
  },
  {
    id: 'log-05',
    action: 'Administrative Login',
    actionKh: 'ចូលប្រើប្រាស់ប្រព័ន្ធរដ្ឋបាល',
    category: 'Auth',
    user: 'Admin Officer',
    userRole: 'Administrator',
    target: 'CMS Admin Portal Session',
    module: 'Authentication',
    ip: '103.216.48.12',
    device: 'Chrome / Windows 11',
    time: '3 ម៉ោងមុន (3h ago)',
    date: '2026-03-13 11:20',
    severity: 'info',
    details: 'Successful 2FA OTP login from authorized government subnet IP.'
  },
  {
    id: 'log-06',
    action: 'Delete Suspended Account',
    actionKh: 'លុបគណនីក្លែងក្លាយដែលបានផ្អាក',
    category: 'Delete',
    user: 'Admin Officer',
    userRole: 'Administrator',
    target: 'User #usr-99 (spam_bot)',
    module: 'User Directory',
    ip: '103.216.48.12',
    device: 'Chrome / Windows 11',
    time: '4 ម៉ោងមុន (4h ago)',
    date: '2026-03-13 10:15',
    severity: 'warning',
    details: 'Permanently wiped bot account following spam violation reports.'
  },
  {
    id: 'log-07',
    action: 'Approve Business License',
    actionKh: 'អនុម័តពាក្យស្នើសុំអាជ្ញាប័ណ្ណអាជីវកម្ម',
    category: 'Approve',
    user: 'Khem Sreypov',
    userRole: 'Gov Officer',
    target: 'Application #OWSO-2026-88',
    module: 'OWSO Services',
    ip: '103.216.48.15',
    device: 'Edge / Windows 10',
    time: '5 ម៉ោងមុន (5h ago)',
    date: '2026-03-13 09:40',
    severity: 'success',
    details: 'Passed tax identification review and issued digital certificate QR code.'
  },
  {
    id: 'log-08',
    action: 'System Backup Archive',
    actionKh: 'បង្កើតឯកសារបម្រុងទុកប្រព័ន្ធ',
    category: 'Update',
    user: 'System Cron',
    userRole: 'Automated Daemon',
    target: 'Daily DB Snapshot #snap-20260313',
    module: 'Core System',
    ip: '127.0.0.1 (Internal)',
    device: 'Linux Server Cron',
    time: '12 ម៉ោងមុន (12h ago)',
    date: '2026-03-13 02:00',
    severity: 'info',
    details: 'Database dump of 42.8 MB created and synced to encrypted cold storage.'
  },
  {
    id: 'log-09',
    action: 'Update Emergency Hotline',
    actionKh: 'កែប្រែលេខទូរស័ព្ទសង្គ្រោះបន្ទាន់',
    category: 'Update',
    user: 'Admin Officer',
    userRole: 'Administrator',
    target: 'Fire Department Contact #118',
    module: 'Emergency Contacts',
    ip: '103.216.48.12',
    device: 'Chrome / Windows 11',
    time: '1 ថ្ងៃមុន (1d ago)',
    date: '2026-03-12 16:30',
    severity: 'info',
    details: 'Added alternative backup telephone line for Phnom Penh municipal fire station.'
  },
  {
    id: 'log-10',
    action: 'Failed Login Attempt',
    actionKh: 'ការព្យាយាមចូលប្រើប្រាស់មិនជោគជ័យ',
    category: 'Auth',
    user: 'Unknown IP',
    userRole: 'Unauthenticated',
    target: 'Portal Gateway /admin/login',
    module: 'Security Firewall',
    ip: '45.154.255.8',
    device: 'Python-requests / Unknown',
    time: '1 ថ្ងៃមុន (1d ago)',
    date: '2026-03-12 04:12',
    severity: 'warning',
    details: 'Blocked 3 consecutive failed password attempts. IP rate-limited for 60 minutes.'
  }
]

const logs = ref<LogEntry[]>(defaultLogs)

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalLogs = computed(() => logs.value.length)
const totalAdminActions = computed(() => logs.value.filter(l => l.category === 'Approve' || l.category === 'Update' || l.category === 'Publish').length)
const totalSecurityEvents = computed(() => logs.value.filter(l => l.category === 'Auth').length)

// -------------------------------------------------------------
// SEARCH & FILTERS
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedCategory = ref('All')
const selectedSeverity = ref('All')

const filteredLogs = computed(() => {
  return logs.value.filter(l => {
    const matchCat = selectedCategory.value === 'All' || l.category === selectedCategory.value
    const matchSev = selectedSeverity.value === 'All' || l.severity === selectedSeverity.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat && matchSev
    const matchSearch =
      l.action.toLowerCase().includes(q) ||
      l.actionKh.toLowerCase().includes(q) ||
      l.user.toLowerCase().includes(q) ||
      l.target.toLowerCase().includes(q) ||
      l.module.toLowerCase().includes(q) ||
      l.ip.toLowerCase().includes(q) ||
      l.id.toLowerCase().includes(q)
    return matchCat && matchSev && matchSearch
  })
})

// -------------------------------------------------------------
// INTERACTIVE PAGINATION
// -------------------------------------------------------------
const pageSize = ref<number>(8)
const currentPage = ref<number>(1)

const totalPages = computed(() => Math.max(1, Math.ceil(filteredLogs.value.length / pageSize.value)))

watch([searchQuery, selectedCategory, selectedSeverity, pageSize], () => {
  currentPage.value = 1
})

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredLogs.value.slice(start, start + pageSize.value)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

function resetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'All'
  selectedSeverity.value = 'All'
}

function exportLogs() {
  emit('show-toast', currentLanguage.value === 'kh' ? 'បានទាញយកទិន្នន័យកំណត់ហេតុ (Audit Logs) ជោគជ័យ!' : 'Audit logs downloaded successfully as CSV!')
}

// -------------------------------------------------------------
// VIEW DETAIL MODAL
// -------------------------------------------------------------
const isDetailModalOpen = ref(false)
const viewingLog = ref<LogEntry | null>(null)

function openDetailModal(log: LogEntry) {
  viewingLog.value = log
  isDetailModalOpen.value = true
}

function closeDetailModal() {
  isDetailModalOpen.value = false
  viewingLog.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- Card 1: Total Operations -->
      <div
        @click="resetFilters"
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs cursor-pointer hover:border-blue-300 transition-all flex flex-col justify-between group"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ប្រវត្តិសរុប' : 'All Events' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalLogs }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'កំណត់ហេតុប្រតិបត្តិការ' : 'Total Audit Logs' }}
          </span>
        </div>
      </div>

      <!-- Card 2: Admin Actions -->
      <div
        @click="selectedCategory = 'Approve'; searchQuery = ''"
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs cursor-pointer hover:border-purple-300 transition-all flex flex-col justify-between group"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <UserCheck class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Admin Works' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalAdminActions }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ការអនុម័ត & កែប្រែទិន្នន័យ' : 'Administrative Actions' }}
          </span>
        </div>
      </div>

      <!-- Card 3: Security & Auth Events -->
      <div
        @click="selectedCategory = 'Auth'; searchQuery = ''"
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs cursor-pointer hover:border-amber-300 transition-all flex flex-col justify-between group"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Key class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-khmer">
            2FA & Auth
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalSecurityEvents }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ព្រឹត្តិការណ៍ចូលប្រព័ន្ធ' : 'Security & Logins' }}
          </span>
        </div>
      </div>

      <!-- Card 4: System Integrity -->
      <div class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between group hover:border-emerald-300 transition-all">
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck class="w-3.5 h-3.5" />
          </div>
          <span class="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            {{ currentLanguage === 'kh' ? 'សុវត្ថិភាព' : 'Secure' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">100% Normal</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សុចរិតភាពប្រព័ន្ធរដ្ឋបាល' : 'Security Health' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. MAIN CARD: TOOLBAR + TABLE-FIXED DATA TABLE + PAGINATION -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-2xs flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
      
      <!-- SEARCH & ACTION TOOLBAR -->
      <div class="p-2 sm:p-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-slate-50/50">
        
        <!-- Left: Search & Filter Dropdowns -->
        <div class="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          
          <!-- Search input -->
          <div class="relative flex-1 min-w-[150px] max-w-xs">
            <Search class="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសកម្មភាព, អ្នកប្រើ, IP...' : 'Search action, user, IP...'"
              class="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-khmer"
            />
          </div>

          <!-- Category filter -->
          <select
            v-model="selectedCategory"
            class="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-khmer cursor-pointer"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'ប្រភេទសកម្មភាពទាំងអស់' : 'All Categories' }}</option>
            <option value="Approve">{{ currentLanguage === 'kh' ? 'ការអនុម័ត (Approve)' : 'Approve' }}</option>
            <option value="Update">{{ currentLanguage === 'kh' ? 'ការកែប្រែ (Update)' : 'Update' }}</option>
            <option value="Publish">{{ currentLanguage === 'kh' ? 'ការផ្សព្វផ្សាយ (Publish)' : 'Publish' }}</option>
            <option value="Auth">{{ currentLanguage === 'kh' ? 'សុវត្ថិភាព/ចូល (Auth)' : 'Auth & Login' }}</option>
            <option value="Delete">{{ currentLanguage === 'kh' ? 'ការលុប (Delete)' : 'Delete' }}</option>
          </select>

          <!-- Severity filter -->
          <select
            v-model="selectedSeverity"
            class="px-2 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-khmer cursor-pointer"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'កម្រិតទាំងអស់ (All Levels)' : 'All Levels' }}</option>
            <option value="success">{{ currentLanguage === 'kh' ? 'ជោគជ័យ (Success)' : 'Success' }}</option>
            <option value="info">{{ currentLanguage === 'kh' ? 'ព័ត៌មាន (Info)' : 'Info' }}</option>
            <option value="warning">{{ currentLanguage === 'kh' ? 'ព្រមាន (Warning)' : 'Warning' }}</option>
          </select>

          <!-- Reset filter button if filtered -->
          <button
            v-if="searchQuery || selectedCategory !== 'All' || selectedSeverity !== 'All'"
            type="button"
            @click="resetFilters"
            class="text-[11px] text-blue-600 hover:text-blue-700 font-bold font-khmer underline cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'សម្អាត' : 'Reset' }}
          </button>
        </div>

        <!-- Right: Export logs button -->
        <div class="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            @click="exportLogs"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer font-khmer shadow-2xs"
            title="Download audit logs"
          >
            <Download class="w-3.5 h-3.5 text-slate-600" />
            <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'ទាញយកកំណត់ហេតុ' : 'Export Logs' }}</span>
          </button>
        </div>

      </div>

      <!-- DATA TABLE (FITTED SINGLE-SCREEN) -->
      <div class="flex-1 min-h-0 overflow-y-auto divide-y divide-slate-100 relative">
        <table class="w-full text-left text-xs table-fixed">
          
          <thead class="bg-slate-50/90 text-slate-600 font-black text-[10.5px] uppercase tracking-wider sticky top-0 z-10 border-b border-slate-200/80 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3 font-khmer w-[24%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព & លេខសម្គាល់' : 'Action & ID' }}</th>
              <th class="py-2 px-3 font-khmer w-[18%]">{{ currentLanguage === 'kh' ? 'អ្នកអនុវត្ត' : 'Operator' }}</th>
              <th class="py-2 px-3 font-khmer w-[22%]">{{ currentLanguage === 'kh' ? 'ទិន្នន័យគោលដៅ' : 'Target Module' }}</th>
              <th class="py-2 px-3 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន IP' : 'IP & Device' }}</th>
              <th class="py-2 px-3 font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ & ស្ថានភាព' : 'Timestamp' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[8%]">{{ currentLanguage === 'kh' ? 'មើល' : 'Action' }}</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-slate-100/80">
            <tr
              v-for="l in paginatedLogs"
              :key="l.id"
              class="hover:bg-slate-50/80 transition-colors group"
            >
              <!-- 1. Action & ID -->
              <td class="py-2 px-3 truncate">
                <div class="flex items-center gap-1.5">
                  <span
                    :class="[
                      'w-2 h-2 rounded-full shrink-0',
                      l.severity === 'success' ? 'bg-emerald-500' : l.severity === 'warning' ? 'bg-amber-500' : 'bg-blue-500'
                    ]"
                  ></span>
                  <div class="min-w-0">
                    <span class="font-bold text-slate-900 text-xs block font-khmer truncate">
                      {{ currentLanguage === 'kh' ? l.actionKh : l.action }}
                    </span>
                    <span class="text-[10px] text-slate-400 font-mono block">
                      {{ l.id }} • {{ l.category }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 2. Operator -->
              <td class="py-2 px-3 truncate">
                <div class="flex items-center gap-1.5">
                  <div class="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 text-slate-600">
                    <User class="w-3 h-3" />
                  </div>
                  <div class="min-w-0">
                    <span class="font-bold text-slate-800 text-xs block truncate">{{ l.user }}</span>
                    <span class="text-[10px] text-slate-400 block truncate">{{ l.userRole }}</span>
                  </div>
                </div>
              </td>

              <!-- 3. Target Module -->
              <td class="py-2 px-3 truncate">
                <div class="min-w-0">
                  <span class="font-medium text-slate-800 text-xs block truncate">{{ l.target }}</span>
                  <span class="text-[10px] text-blue-600 font-medium block truncate">{{ l.module }}</span>
                </div>
              </td>

              <!-- 4. IP & Device -->
              <td class="py-2 px-3 truncate">
                <div class="min-w-0">
                  <span class="font-mono text-slate-700 text-[11px] block truncate font-medium">{{ l.ip }}</span>
                  <span class="text-[10px] text-slate-400 flex items-center gap-1 truncate">
                    <Monitor class="w-2.5 h-2.5 shrink-0" />
                    {{ l.device }}
                  </span>
                </div>
              </td>

              <!-- 5. Timestamp & Severity Badge -->
              <td class="py-2 px-3 truncate">
                <div class="min-w-0">
                  <span class="font-medium text-slate-700 text-[11px] block truncate font-khmer">{{ l.time }}</span>
                  <span
                    :class="[
                      'inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.2 rounded-md font-khmer mt-0.5',
                      l.severity === 'success'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : l.severity === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                    ]"
                  >
                    <CheckCircle2 v-if="l.severity === 'success'" class="w-2.5 h-2.5" />
                    <AlertTriangle v-else-if="l.severity === 'warning'" class="w-2.5 h-2.5" />
                    <Info v-else class="w-2.5 h-2.5" />
                    {{ l.severity.toUpperCase() }}
                  </span>
                </div>
              </td>

              <!-- 6. View Action Button -->
              <td class="py-2 px-3 text-right">
                <button
                  type="button"
                  @click="openDetailModal(l)"
                  class="w-7 h-7 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  :title="currentLanguage === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View Details'"
                >
                  <Eye class="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="paginatedLogs.length === 0">
              <td colspan="6" class="py-12 text-center text-slate-400">
                <FileText class="w-8 h-8 mx-auto mb-2 text-slate-300 stroke-1" />
                <p class="text-xs font-khmer">{{ currentLanguage === 'kh' ? 'រកមិនឃើញកំណត់ហេតុណាមួយឡើយ' : 'No audit logs found matching your filter' }}</p>
                <button
                  type="button"
                  @click="resetFilters"
                  class="mt-2 text-xs text-blue-600 font-bold hover:underline font-khmer cursor-pointer"
                >
                  {{ currentLanguage === 'kh' ? 'សម្អាតការស្វែងរក' : 'Reset filters' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 3. INTERACTIVE PAGINATION FOOTER -->
      <div class="p-2 sm:p-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-slate-50/60">
        
        <!-- Left: Rows per page & range -->
        <div class="flex items-center gap-2 text-xs text-slate-500">
          <span class="font-khmer text-[11px]">{{ currentLanguage === 'kh' ? 'ជួរដេកក្នុងមួយទំព័រ:' : 'Rows per page:' }}</span>
          <select
            v-model.number="pageSize"
            class="px-1.5 py-0.5 text-xs bg-white border border-slate-200 rounded text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option :value="8">8</option>
            <option :value="10">10</option>
            <option :value="15">15</option>
          </select>
          <span class="text-[11px] text-slate-400 hidden sm:inline">
            {{ currentLanguage === 'kh' ? 'បង្ហាញ' : 'Showing' }}
            <strong class="text-slate-700 font-sans">
              {{ filteredLogs.length > 0 ? (currentPage - 1) * pageSize + 1 : 0 }} - {{ Math.min(currentPage * pageSize, filteredLogs.length) }}
            </strong>
            {{ currentLanguage === 'kh' ? 'នៃ' : 'of' }}
            <strong class="text-slate-700 font-sans">{{ filteredLogs.length }}</strong>
          </span>
        </div>

        <!-- Right: Page Controls -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="prevPage"
            :disabled="currentPage === 1"
            class="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            title="Previous Page"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          
          <span class="text-xs font-bold text-slate-700 px-2 font-mono">
            {{ currentPage }} / {{ totalPages }}
          </span>

          <button
            type="button"
            @click="nextPage"
            :disabled="currentPage >= totalPages"
            class="p-1 rounded-md border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-600 transition-colors"
            title="Next Page"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>

    <!-- 4. LOG DETAIL MODAL -->
    <div
      v-if="isDetailModalOpen && viewingLog"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-xs select-text"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Header -->
        <div class="p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div class="flex items-center gap-2">
            <div class="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileText class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-black text-slate-900 font-khmer">
                {{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតកំណត់ហេតុ' : 'Audit Log Details' }}
              </h3>
              <p class="text-[10px] text-slate-400 font-mono">{{ viewingLog.id }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="closeDetailModal"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-4 space-y-3 overflow-y-auto text-xs flex-1">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
            <div>
              <span class="text-[10px] text-slate-400 font-bold block uppercase tracking-wider font-khmer">
                {{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Action' }}
              </span>
              <span class="font-bold text-slate-900 text-sm font-khmer block">
                {{ currentLanguage === 'kh' ? viewingLog.actionKh : viewingLog.action }}
              </span>
            </div>
            <div class="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
              <div>
                <span class="text-[10px] text-slate-400 font-bold block">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}</span>
                <span class="font-semibold text-slate-700">{{ viewingLog.category }}</span>
              </div>
              <div>
                <span class="text-[10px] text-slate-400 font-bold block">{{ currentLanguage === 'kh' ? 'កម្រិតសុវត្ថិភាព' : 'Severity' }}</span>
                <span class="font-semibold text-slate-700 uppercase">{{ viewingLog.severity }}</span>
              </div>
            </div>
          </div>

          <div class="space-y-2">
            <div class="flex justify-between py-1.5 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'អ្នកអនុវត្ត' : 'Operator' }}</span>
              <span class="font-bold text-slate-800">{{ viewingLog.user }} ({{ viewingLog.userRole }})</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'ផ្នែកគោលដៅ' : 'Module' }}</span>
              <span class="font-medium text-blue-600">{{ viewingLog.module }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'ទិន្នន័យគោលដៅ' : 'Target Item' }}</span>
              <span class="font-medium text-slate-800">{{ viewingLog.target }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន IP' : 'IP Address' }}</span>
              <span class="font-mono text-slate-700">{{ viewingLog.ip }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'ឧបករណ៍/កម្មវិធីរុករក' : 'Device / Agent' }}</span>
              <span class="text-slate-700">{{ viewingLog.device }}</span>
            </div>
            <div class="flex justify-between py-1.5 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ & ម៉ោង' : 'Date & Time' }}</span>
              <span class="text-slate-700">{{ viewingLog.date }} ({{ viewingLog.time }})</span>
            </div>
          </div>

          <div v-if="viewingLog.details" class="pt-2">
            <span class="text-[10px] text-slate-400 font-bold block uppercase mb-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'កំណត់ចំណាំប្រតិបត្តិការ' : 'Payload & Operation Notes' }}
            </span>
            <div class="p-2.5 bg-slate-900 text-slate-200 font-mono text-[11px] rounded-lg leading-relaxed">
              {{ viewingLog.details }}
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-3 border-t border-slate-100 bg-slate-50/50 flex justify-end shrink-0">
          <button
            type="button"
            @click="closeDetailModal"
            class="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
