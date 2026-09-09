<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileText,
  Briefcase,
  MapPin,
  Newspaper,
  Users,
  Calendar,
  ChevronDown,
  TrendingUp,
  MoreHorizontal
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import {
  getGovernmentServices,
  getHospitals,
  getJobs,
  getTransport,
  getHomeServices,
  getLocations,
  getNews
} from '@/services/dataService'

const emit = defineEmits<{
  (e: 'navigate', tab: string): void
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// Real Data Counts from CamLife Services
const govServices = getGovernmentServices()
const hospitals = getHospitals()
const jobsList = getJobs()
const transportList = getTransport()
const homeServicesList = getHomeServices()
const locationsList = getLocations()
const newsList = getNews()

// Dynamic formatted date
const currentDateFormatted = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
})

// KPI Metrics
const totalServices = computed(() => govServices.length + hospitals.length + transportList.length + homeServicesList.length)
const totalJobs = computed(() => jobsList.length)
const totalLocations = computed(() => locationsList.length)
const totalNews = computed(() => newsList.length)

// Timeframe selector
const selectedTimeframe = ref('Last 30 days')
const isTimeframeOpen = ref(false)
const timeframes = ['Last 7 days', 'Last 30 days', 'This Year']

function selectTimeframe(tf: string) {
  selectedTimeframe.value = tf
  isTimeframeOpen.value = false
}

// Chart Categories matching the image
const chartData = [
  { nameKh: 'សេវារដ្ឋបាល', nameEn: 'Admin', val: '32K', heightPercent: 82, bg: 'bg-[#1E40AF]' },
  { nameKh: 'សុខភាព', nameEn: 'Health', val: '24K', heightPercent: 62, bg: 'bg-[#10B981]' },
  { nameKh: 'ការងារ', nameEn: 'Jobs', val: '18K', heightPercent: 46, bg: 'bg-[#06B6D4]' },
  { nameKh: 'ដឹកជញ្ជូន', nameEn: 'Transport', val: '15K', heightPercent: 38, bg: 'bg-[#3B82F6]' },
  { nameKh: 'សេវាជួសជុល', nameEn: 'Repair', val: '12K', heightPercent: 30, bg: 'bg-[#0D9488]' },
  { nameKh: 'ការិយាល័យ', nameEn: 'Offices', val: '10K', heightPercent: 25, bg: 'bg-[#F59E0B]' },
  { nameKh: 'ព័ត៌មាន', nameEn: 'News', val: '8K', heightPercent: 20, bg: 'bg-[#EF4444]' },
  { nameKh: 'សង្គ្រោះបន្ទាន់', nameEn: 'Emergency', val: '6K', heightPercent: 15, bg: 'bg-[#64748B]' }
]

// Recent Activity List (4 compact rows for single screen)
const recentActivities = ref([
  {
    id: 1,
    titleKh: 'បានធ្វើបច្ចុប្បន្នភាពសេវា',
    titleEn: 'Service Guide Updated',
    sub: 'Passport Guide',
    time: '5m ago',
    icon: FileText,
    iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  },
  {
    id: 2,
    titleKh: 'ការងារថ្មីត្រូវបានផ្សាយ',
    titleEn: 'New Job Published',
    sub: 'Frontend Developer at ABC Company',
    time: '20m ago',
    icon: Briefcase,
    iconBg: 'bg-blue-50 text-blue-600 border border-blue-100'
  },
  {
    id: 3,
    titleKh: 'បានបញ្ចូលទីតាំងថ្មី',
    titleEn: 'New Location Added',
    sub: 'OWSO Phnom Penh',
    time: '1h ago',
    icon: MapPin,
    iconBg: 'bg-purple-50 text-purple-600 border border-purple-100'
  },
  {
    id: 4,
    titleKh: 'បានផ្សាយព័ត៌មានថ្មី',
    titleEn: 'News Published',
    sub: 'New transport policy',
    time: '2h ago',
    icon: Newspaper,
    iconBg: 'bg-rose-50 text-rose-600 border border-rose-100'
  }
])

// Pending Approvals (3 items)
const pendingApprovals = ref([
  {
    id: 'pa-1',
    titleKh: 'ការងារ: Senior Developer',
    titleEn: 'Job: Senior Developer',
    entity: 'ABC Technology',
    time: '10m ago',
    icon: Briefcase,
    iconBg: 'bg-blue-100 text-blue-600'
  },
  {
    id: 'pa-2',
    titleKh: 'ព័ត៌មាន: New Health Guidelines',
    titleEn: 'News: New Health Guidelines',
    entity: 'Ministry of Health',
    time: '1h ago',
    icon: Newspaper,
    iconBg: 'bg-rose-100 text-rose-600'
  },
  {
    id: 'pa-3',
    titleKh: 'ទីតាំង: New Clinic',
    titleEn: 'Location: New Clinic',
    entity: 'Sangkat Chamkar Mon',
    time: '2h ago',
    icon: MapPin,
    iconBg: 'bg-purple-100 text-purple-600'
  }
])

function approvePending(id: string) {
  const item = pendingApprovals.value.find(p => p.id === id)
  if (item) {
    pendingApprovals.value = pendingApprovals.value.filter(p => p.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? `បានអនុម័ត ${item.titleKh} ជោគជ័យ!` : `Approved ${item.titleEn} successfully!`)
  }
}

function rejectPending(id: string) {
  const item = pendingApprovals.value.find(p => p.id === id)
  if (item) {
    pendingApprovals.value = pendingApprovals.value.filter(p => p.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? `បានបដិសេធ ${item.titleKh}` : `Rejected ${item.titleEn}`)
  }
}

// Recent Content Table Data (4 compact rows for single screen)
const recentContents = [
  {
    id: 1,
    title: 'National ID Card',
    titleKh: 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ',
    category: 'Government',
    categoryKh: 'រដ្ឋបាល',
    status: 'published',
    updatedDate: 'Today',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 2,
    title: 'City Bus Route 01',
    titleKh: 'ខ្សែរថយន្តក្រុងទីក្រុង ខ្សែទី ០១',
    category: 'Transport',
    categoryKh: 'ដឹកជញ្ជូន',
    status: 'draft',
    updatedDate: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 3,
    title: 'Calmette Hospital',
    titleKh: 'មន្ទីរពេទ្យកាល់ម៉ែត',
    category: 'Healthcare',
    categoryKh: 'សុខាភិបាល',
    status: 'published',
    updatedDate: 'Yesterday',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=100&q=80'
  },
  {
    id: 4,
    title: 'OWSO Phnom Penh',
    titleKh: 'ច្រកចេញចូលតែមួយ រាជធានីភ្នំពេញ',
    category: 'Public Offices',
    categoryKh: 'ការិយាល័យ',
    status: 'published',
    updatedDate: '2 days ago',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=100&q=80'
  }
]
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2.5 overflow-hidden select-none">
    
    <!-- 1. TOP ROW: Greeting & Date Banner (Compact Single-screen Header) -->
    <div class="shrink-0 flex items-center justify-between pb-0.5">
      <div>
        <h2 class="text-lg sm:text-xl font-black text-slate-900 tracking-tight font-khmer leading-tight">
          {{ currentLanguage === 'kh' ? 'សួស្ដី, Admin!' : 'Hello, Admin!' }}
        </h2>
        <p class="text-[11px] text-slate-500 font-medium">
          {{ currentLanguage === 'kh' ? 'នេះជាទិដ្ឋភាពទូទៅនៃប្រព័ន្ធ CamLife ថ្ងៃនេះ។' : "Here's what's happening with CamLife today." }}
        </p>
      </div>

      <div class="flex flex-col items-end">
        <div class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 leading-tight">
          <Calendar class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ currentDateFormatted }}</span>
        </div>
        <span class="text-[9px] text-slate-400 font-semibold tracking-wider uppercase mt-0.5">
          Manage · Inform · Serve Cambodia
        </span>
      </div>
    </div>

    <!-- 2. 5 KPI METRIC CARDS (Exact Layout in Mockup - Compact Heights) -->
    <div class="shrink-0 grid grid-cols-5 gap-2.5">
      
      <!-- Card 1: Total Services -->
      <div
        @click="emit('navigate', 'government')"
        class="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-slate-500 font-khmer block truncate">
              {{ currentLanguage === 'kh' ? 'សរុបសេវាកម្ម' : 'Total Services' }}
            </span>
            <span class="text-base sm:text-lg font-black text-slate-900 leading-none block">
              {{ totalServices }}
            </span>
          </div>
        </div>
        <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-emerald-600 leading-none">
          <TrendingUp class="w-2.5 h-2.5" />
          <span>↑ 8.2% vs last month</span>
        </div>
      </div>

      <!-- Card 2: Active Jobs -->
      <div
        @click="emit('navigate', 'jobs')"
        class="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-slate-500 font-khmer block truncate">
              {{ currentLanguage === 'kh' ? 'ការងារសកម្ម' : 'Active Jobs' }}
            </span>
            <span class="text-base sm:text-lg font-black text-slate-900 leading-none block">
              {{ totalJobs }}
            </span>
          </div>
        </div>
        <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-emerald-600 leading-none">
          <TrendingUp class="w-2.5 h-2.5" />
          <span>↑ 12.4% vs last month</span>
        </div>
      </div>

      <!-- Card 3: Locations / OWSO -->
      <div
        @click="emit('navigate', 'offices')"
        class="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MapPin class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-slate-500 font-khmer block truncate">
              {{ currentLanguage === 'kh' ? 'ទីតាំង' : 'Locations' }}
            </span>
            <span class="text-base sm:text-lg font-black text-slate-900 leading-none block">
              {{ totalLocations }}
            </span>
          </div>
        </div>
        <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-emerald-600 leading-none">
          <TrendingUp class="w-2.5 h-2.5" />
          <span>↑ 5.6% vs last month</span>
        </div>
      </div>

      <!-- Card 4: Public News & Bulletins -->
      <div
        @click="emit('navigate', 'news')"
        class="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Newspaper class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-slate-500 font-khmer block truncate">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានសាធារណៈ' : 'Public News' }}
            </span>
            <span class="text-base sm:text-lg font-black text-slate-900 leading-none block">
              {{ totalNews }}
            </span>
          </div>
        </div>
        <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-emerald-600 leading-none">
          <TrendingUp class="w-2.5 h-2.5" />
          <span>↑ 6.1% vs last month</span>
        </div>
      </div>

      <!-- Card 5: Users -->
      <div
        @click="emit('navigate', 'users')"
        class="bg-white rounded-xl p-2.5 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all cursor-pointer group"
      >
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users class="w-4 h-4" />
          </div>
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-slate-500 font-khmer block truncate">
              {{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់' : 'Users' }}
            </span>
            <span class="text-base sm:text-lg font-black text-slate-900 leading-none block">
              12,458
            </span>
          </div>
        </div>
        <div class="mt-1.5 pt-1.5 border-t border-slate-100 flex items-center gap-1 text-[9px] font-bold text-emerald-600 leading-none">
          <TrendingUp class="w-2.5 h-2.5" />
          <span>↑ 15.3% vs last month</span>
        </div>
      </div>

    </div>

    <!-- 3. MIDDLE ROW: Service Usage Bar Chart + Recent Activity Feed (Flex-1) -->
    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-2.5">
      
      <!-- Left: Service Usage Bar Chart (2 cols) -->
      <div class="lg:col-span-2 bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        
        <!-- Header with Title & Filter Dropdown -->
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-xs font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'ប្រើប្រាស់សេវាកម្ម' : 'Service Usage' }}
            </h3>
            <p class="text-[10px] text-slate-400 font-medium leading-none mt-0.5">
              Service views by category (Last 30 days)
            </p>
          </div>

          <!-- Timeframe Dropdown -->
          <div class="relative">
            <button
              type="button"
              @click="isTimeframeOpen = !isTimeframeOpen"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[11px] font-bold text-slate-700 cursor-pointer"
            >
              <Calendar class="w-3 h-3 text-slate-400" />
              <span>{{ selectedTimeframe }}</span>
              <ChevronDown class="w-2.5 h-2.5 text-slate-400" />
            </button>

            <div
              v-if="isTimeframeOpen"
              class="absolute right-0 mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-lg py-1 z-30"
            >
              <button
                v-for="tf in timeframes"
                :key="tf"
                type="button"
                @click="selectTimeframe(tf)"
                :class="['w-full px-3 py-1 text-left text-xs font-bold hover:bg-slate-50 cursor-pointer', selectedTimeframe === tf ? 'text-blue-600' : 'text-slate-700']"
              >
                {{ tf }}
              </button>
            </div>
          </div>
        </div>

        <!-- Vertical Bar Chart Visual (Scales dynamically with remaining flex height) -->
        <div class="flex-1 min-h-0 flex flex-col justify-between py-1">
          <!-- Bars Container -->
          <div class="relative flex-1 min-h-0 flex items-end justify-between gap-2 px-3 sm:px-6">
            
            <!-- Horizontal Guides -->
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none text-[9px] text-slate-300">
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>40K</span></div>
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>30K</span></div>
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>20K</span></div>
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>10K</span></div>
              <div class="border-b border-slate-200 w-full flex items-center justify-between pb-0.5"><span>0</span></div>
            </div>

            <!-- Bars -->
            <div
              v-for="(item, idx) in chartData"
              :key="idx"
              class="relative z-10 flex-1 flex flex-col items-center h-full justify-end group"
            >
              <!-- Bar Value Label -->
              <span class="text-[9px] font-black text-slate-700 mb-0.5 block leading-none">
                {{ item.val }}
              </span>
              
              <!-- Color Bar -->
              <div
                :class="['w-full max-w-[32px] rounded-t-md transition-all duration-300 hover:brightness-110 shadow-2xs', item.bg]"
                :style="{ height: `${item.heightPercent}%` }"
              ></div>
            </div>
          </div>

          <!-- X-Axis Category Labels -->
          <div class="flex items-center justify-between gap-1 px-3 sm:px-6 pt-1 border-t border-slate-200 text-center shrink-0">
            <div
              v-for="(item, idx) in chartData"
              :key="idx"
              class="flex-1 min-w-0"
            >
              <span class="text-[9px] font-bold text-slate-600 font-khmer truncate block leading-tight">
                {{ currentLanguage === 'kh' ? item.nameKh : item.nameEn }}
              </span>
            </div>
          </div>
        </div>

      </div>

      <!-- Right: Recent Activity Feed (1 col) -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-xs font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'សកម្មភាពថ្មីៗ' : 'Recent Activity' }}
            </h3>
            <p class="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Recent Activity</p>
          </div>

          <button
            type="button"
            @click="emit('navigate', 'logs')"
            class="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-khmer cursor-pointer hover:underline leading-none"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
            <span>➔</span>
          </button>
        </div>

        <div class="flex-1 min-h-0 flex flex-col justify-between divide-y divide-slate-50 pt-0.5">
          <div
            v-for="act in recentActivities"
            :key="act.id"
            class="py-1 flex items-center gap-2.5 hover:bg-slate-50/70 rounded-lg px-1.5 -mx-1.5 transition-colors"
          >
            <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0', act.iconBg]">
              <component :is="act.icon" class="w-3.5 h-3.5" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-xs font-bold text-slate-800 leading-tight font-khmer truncate">
                {{ currentLanguage === 'kh' ? act.titleKh : act.titleEn }}
              </h4>
              <p class="text-[10px] text-slate-400 font-medium truncate leading-tight">
                {{ act.sub }}
              </p>
            </div>
            <span class="text-[9px] text-slate-400 shrink-0 font-medium">
              {{ act.time }}
            </span>
          </div>
        </div>

      </div>

    </div>

    <!-- 4. BOTTOM ROW: Pending Approvals (50%) + Recent Content Table (50%) (Flex-1) -->
    <div class="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-2.5">
      
      <!-- Left: Pending Approval Card -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div class="flex items-center gap-1.5">
            <h3 class="text-xs font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'អត្ថបទរង់ចាំការអនុម័ត' : 'Pending Approval' }}
            </h3>
            <span class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center leading-none">
              {{ pendingApprovals.length }}
            </span>
          </div>

          <button
            type="button"
            @click="emit('navigate', 'jobs')"
            class="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-khmer cursor-pointer hover:underline leading-none"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
            <span>➔</span>
          </button>
        </div>

        <div class="flex-1 min-h-0 flex flex-col justify-between divide-y divide-slate-50 pt-0.5">
          <div
            v-for="item in pendingApprovals"
            :key="item.id"
            class="py-1 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 min-w-0">
              <div :class="['w-7 h-7 rounded-lg flex items-center justify-center shrink-0', item.iconBg]">
                <component :is="item.icon" class="w-3.5 h-3.5" />
              </div>
              <div class="min-w-0">
                <h4 class="text-xs font-bold text-slate-900 font-khmer truncate leading-tight">
                  {{ currentLanguage === 'kh' ? item.titleKh : item.titleEn }}
                </h4>
                <p class="text-[10px] text-slate-400 truncate leading-tight">
                  {{ item.entity }} · {{ item.time }}
                </p>
              </div>
            </div>

            <!-- Approve & Reject Buttons -->
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="button"
                @click="approvePending(item.id)"
                class="px-2.5 py-1 rounded-md border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold font-khmer transition-colors cursor-pointer leading-none"
              >
                {{ currentLanguage === 'kh' ? 'អនុម័ត' : 'Approve' }}
              </button>
              <button
                type="button"
                @click="rejectPending(item.id)"
                class="px-2.5 py-1 rounded-md border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] font-bold font-khmer transition-colors cursor-pointer leading-none"
              >
                {{ currentLanguage === 'kh' ? 'បដិសេធ' : 'Reject' }}
              </button>
            </div>
          </div>

          <div v-if="pendingApprovals.length === 0" class="py-4 text-center text-xs text-slate-400">
            {{ currentLanguage === 'kh' ? 'គ្មានសំណើរង់ចាំការអនុម័តទេ' : 'No items pending approval.' }}
          </div>
        </div>

      </div>

      <!-- Right: Recent Content Table -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between overflow-hidden">
        
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-xs font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'មាតិកាចុងក្រោយ' : 'Recent Content' }}
            </h3>
            <p class="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Recent Content</p>
          </div>

          <button
            type="button"
            @click="emit('navigate', 'government')"
            class="text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-khmer cursor-pointer hover:underline leading-none"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
            <span>➔</span>
          </button>
        </div>

        <!-- Table Structure -->
        <div class="flex-1 min-h-0 overflow-hidden flex flex-col justify-between pt-0.5">
          <table class="w-full text-left text-xs">
            <thead>
              <tr class="text-[10px] font-bold text-slate-400 border-b border-slate-100">
                <th class="pb-1 font-khmer">{{ currentLanguage === 'kh' ? 'រូប/ឈ្មោះ' : 'Image / Name' }}</th>
                <th class="pb-1 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}</th>
                <th class="pb-1 font-khmer">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
                <th class="pb-1 font-khmer">{{ currentLanguage === 'kh' ? 'ថ្ងៃកែប្រែ' : 'Updated' }}</th>
                <th class="pb-1 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Action' }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              <tr
                v-for="c in recentContents"
                :key="c.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <!-- Image / Name -->
                <td class="py-1.5 pr-2">
                  <div class="flex items-center gap-2">
                    <img :src="c.image" :alt="c.title" class="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0" />
                    <span class="font-bold text-slate-800 truncate max-w-[130px] block leading-tight">
                      {{ currentLanguage === 'kh' ? c.titleKh : c.title }}
                    </span>
                  </div>
                </td>

                <!-- Category -->
                <td class="py-1.5 pr-2 text-slate-600 font-medium text-[11px]">
                  {{ currentLanguage === 'kh' ? c.categoryKh : c.category }}
                </td>

                <!-- Status Badge -->
                <td class="py-1.5 pr-2">
                  <span
                    v-if="c.status === 'published'"
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-khmer leading-none"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>{{ currentLanguage === 'kh' ? 'បានផ្សាយ' : 'Published' }}</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-khmer leading-none"
                  >
                    <span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    <span>{{ currentLanguage === 'kh' ? 'ព្រាង' : 'Draft' }}</span>
                  </span>
                </td>

                <!-- Updated Date -->
                <td class="py-1.5 pr-2 text-slate-400 text-[10px]">
                  {{ c.updatedDate }}
                </td>

                <!-- Action dots -->
                <td class="py-1.5 text-right">
                  <button type="button" class="p-0.5 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer">
                    <MoreHorizontal class="w-3.5 h-3.5 inline" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>

    </div>

  </div>
</template>
