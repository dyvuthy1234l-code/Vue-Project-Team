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
  BarChart3,
  Activity,
  PieChart
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

// KPI Metrics
const totalServices = computed(() => govServices.length + hospitals.length + transportList.length + homeServicesList.length)
const totalJobs = computed(() => jobsList.length)
const totalLocations = computed(() => locationsList.length)
const totalNews = computed(() => newsList.length)

// Timeframe selector & Chart modes
const selectedTimeframe = ref('Last 30 days')
const isTimeframeOpen = ref(false)
const timeframes = ['Last 7 days', 'Last 30 days', 'This Year']
const chartMode = ref<'bar' | 'area' | 'donut'>('bar')
const hoveredIdx = ref<number | null>(null)

interface ChartItem {
  nameKh: string
  nameEn: string
  val: string
  num: number
  heightPercent: number
  bg: string
  colorHex: string
}

const timeframeData: Record<string, ChartItem[]> = {
  'Last 7 days': [
    { nameKh: 'ច័ន្ទ', nameEn: 'Mon', val: '4.8K', num: 4800, heightPercent: 48, bg: 'bg-blue-600', colorHex: '#2563eb' },
    { nameKh: 'អង្គារ', nameEn: 'Tue', val: '6.2K', num: 6200, heightPercent: 62, bg: 'bg-indigo-600', colorHex: '#4f46e5' },
    { nameKh: 'ពុធ', nameEn: 'Wed', val: '7.9K', num: 7900, heightPercent: 79, bg: 'bg-emerald-600', colorHex: '#059669' },
    { nameKh: 'ព្រហ', nameEn: 'Thu', val: '8.8K', num: 8800, heightPercent: 88, bg: 'bg-teal-600', colorHex: '#0d9488' },
    { nameKh: 'សុក្រ', nameEn: 'Fri', val: '9.6K', num: 9600, heightPercent: 96, bg: 'bg-cyan-600', colorHex: '#0891b2' },
    { nameKh: 'សៅរ៍', nameEn: 'Sat', val: '6.4K', num: 6400, heightPercent: 64, bg: 'bg-amber-500', colorHex: '#f59e0b' },
    { nameKh: 'អាទិត្យ', nameEn: 'Sun', val: '3.9K', num: 3900, heightPercent: 39, bg: 'bg-rose-500', colorHex: '#f43f5e' }
  ],
  'Last 30 days': [
    { nameKh: 'រដ្ឋបាល', nameEn: 'Admin', val: '32K', num: 32000, heightPercent: 82, bg: 'bg-[#1E40AF]', colorHex: '#1e40af' },
    { nameKh: 'សុខភាព', nameEn: 'Health', val: '24K', num: 24000, heightPercent: 62, bg: 'bg-[#10B981]', colorHex: '#10b981' },
    { nameKh: 'ការងារ', nameEn: 'Jobs', val: '18K', num: 18000, heightPercent: 46, bg: 'bg-[#06B6D4]', colorHex: '#06b6d4' },
    { nameKh: 'ដឹកជញ្ជូន', nameEn: 'Transit', val: '15K', num: 15000, heightPercent: 38, bg: 'bg-[#3B82F6]', colorHex: '#3b82f6' },
    { nameKh: 'ជួសជុល', nameEn: 'Repair', val: '12K', num: 12000, heightPercent: 30, bg: 'bg-[#0D9488]', colorHex: '#0d9488' },
    { nameKh: 'ការិយាល័យ', nameEn: 'Offices', val: '10K', num: 10000, heightPercent: 25, bg: 'bg-[#F59E0B]', colorHex: '#f59e0b' },
    { nameKh: 'ព័ត៌មាន', nameEn: 'News', val: '8K', num: 8000, heightPercent: 20, bg: 'bg-[#EF4444]', colorHex: '#ef4444' },
    { nameKh: 'បន្ទាន់', nameEn: 'Emergency', val: '6K', num: 6000, heightPercent: 15, bg: 'bg-[#64748B]', colorHex: '#64748b' }
  ],
  'This Year': [
    { nameKh: 'ត្រីមាស ១', nameEn: 'Q1', val: '112K', num: 112000, heightPercent: 68, bg: 'bg-blue-700', colorHex: '#1d4ed8' },
    { nameKh: 'ត្រីមាស ២', nameEn: 'Q2', val: '138K', num: 138000, heightPercent: 82, bg: 'bg-indigo-600', colorHex: '#4f46e5' },
    { nameKh: 'ត្រីមាស ៣', nameEn: 'Q3', val: '154K', num: 154000, heightPercent: 92, bg: 'bg-emerald-600', colorHex: '#059669' },
    { nameKh: 'ត្រីមាស ៤', nameEn: 'Q4', val: '165K', num: 165000, heightPercent: 98, bg: 'bg-cyan-600', colorHex: '#0891b2' }
  ]
}

function selectTimeframe(tf: string) {
  selectedTimeframe.value = tf
  isTimeframeOpen.value = false
  hoveredIdx.value = null
}

const currentChartData = computed(() => {
  return timeframeData[selectedTimeframe.value] || timeframeData['Last 30 days']
})

const svgPoints = computed(() => {
  const data = currentChartData.value
  const count = data.length
  if (count <= 1) return []
  const width = 460
  const stepX = width / (count - 1)
  return data.map((d, i) => {
    const x = 20 + i * stepX
    const y = 95 - (d.heightPercent / 100) * 80
    return { x, y, item: d }
  })
})

const areaPathD = computed(() => {
  const pts = svgPoints.value
  if (pts.length === 0) return ''
  let d = `M ${pts[0].x} ${pts[0].y}`
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1]
    const curr = pts[i]
    const cpx1 = prev.x + (curr.x - prev.x) / 2
    const cpy1 = prev.y
    const cpx2 = prev.x + (curr.x - prev.x) / 2
    const cpy2 = curr.y
    d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`
  }
  return d
})

const areaFillD = computed(() => {
  const lineD = areaPathD.value
  const pts = svgPoints.value
  if (!lineD || pts.length === 0) return ''
  const last = pts[pts.length - 1]
  const first = pts[0]
  return `${lineD} L ${last.x} 115 L ${first.x} 115 Z`
})


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
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 lg:gap-3 select-none">
    
    <!-- 1. ADMIN ROLE QUICK ACTIONS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      <button
        type="button"
        @click="emit('navigate', 'government')"
        class="py-1.5 px-2.5 sm:py-2 sm:px-3 bg-white hover:bg-blue-50/50 rounded-xl border border-slate-200/90 shadow-2xs hover:border-blue-300 transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
      >
        <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <FileText class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-[11px] sm:text-xs font-bold text-slate-900 font-khmer block truncate leading-tight">
            {{ currentLanguage === 'kh' ? 'បន្ថែមសេវារដ្ឋបាល' : 'Add Government Service' }}
          </span>
          <span class="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate block mt-0.5 leading-tight">
            {{ currentLanguage === 'kh' ? 'បង្កើតសេចក្តីណែនាំថ្មី' : 'Create new guide' }}
          </span>
        </div>
      </button>

      <button
        type="button"
        @click="emit('navigate', 'jobs')"
        class="py-1.5 px-2.5 sm:py-2 sm:px-3 bg-white hover:bg-emerald-50/50 rounded-xl border border-slate-200/90 shadow-2xs hover:border-emerald-300 transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
      >
        <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Briefcase class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-[11px] sm:text-xs font-bold text-slate-900 font-khmer block truncate leading-tight">
            {{ currentLanguage === 'kh' ? 'ផ្សាយការងារថ្មី' : 'Post Career Opening' }}
          </span>
          <span class="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate block mt-0.5 leading-tight">
            {{ currentLanguage === 'kh' ? 'ឱកាសការងារសាធារណៈ' : 'Public & private jobs' }}
          </span>
        </div>
      </button>

      <button
        type="button"
        @click="emit('navigate', 'news')"
        class="py-1.5 px-2.5 sm:py-2 sm:px-3 bg-white hover:bg-rose-50/50 rounded-xl border border-slate-200/90 shadow-2xs hover:border-rose-300 transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
      >
        <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Newspaper class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-[11px] sm:text-xs font-bold text-slate-900 font-khmer block truncate leading-tight">
            {{ currentLanguage === 'kh' ? 'ចុះផ្សាយព័ត៌មាន' : 'Publish News Bulletin' }}
          </span>
          <span class="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate block mt-0.5 leading-tight">
            {{ currentLanguage === 'kh' ? 'សេចក្តីជូនដំណឹងជាតិ' : 'Official press release' }}
          </span>
        </div>
      </button>

      <button
        type="button"
        @click="emit('navigate', 'users')"
        class="py-1.5 px-2.5 sm:py-2 sm:px-3 bg-white hover:bg-purple-50/50 rounded-xl border border-slate-200/90 shadow-2xs hover:border-purple-300 transition-all flex items-center gap-2 sm:gap-2.5 text-left group cursor-pointer"
      >
        <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
          <Users class="w-3.5 h-3.5" />
        </div>
        <div class="min-w-0 flex-1">
          <span class="text-[11px] sm:text-xs font-bold text-slate-900 font-khmer block truncate leading-tight">
            {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងតួនាទី' : 'Manage Users & Roles' }}
          </span>
          <span class="text-[9px] sm:text-[10px] text-slate-400 font-medium truncate block mt-0.5 leading-tight">
            {{ currentLanguage === 'kh' ? 'កំណត់សិទ្ធិ Role Admin' : 'Assign roles & privileges' }}
          </span>
        </div>
      </button>
    </div>

    <!-- 2. 5 RESPONSIVE KPI METRIC CARDS -->
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- Card 1: Total Services -->
      <div
        @click="emit('navigate', 'government')"
        class="bg-white rounded-xl py-2 px-2.5 sm:px-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileText class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
            <TrendingUp class="w-2.5 h-2.5" /> +8.2%
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg lg:text-xl font-black text-slate-900 block leading-tight">
            {{ totalServices }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'សរុបសេវាកម្ម' : 'Total Services' }}
          </span>
        </div>
      </div>

      <!-- Card 2: Active Jobs -->
      <div
        @click="emit('navigate', 'jobs')"
        class="bg-white rounded-xl py-2 px-2.5 sm:px-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-emerald-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
            <TrendingUp class="w-2.5 h-2.5" /> +12.4%
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg lg:text-xl font-black text-slate-900 block leading-tight">
            {{ totalJobs }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ឱកាសការងារ' : 'Active Jobs' }}
          </span>
        </div>
      </div>

      <!-- Card 3: Locations / OWSO -->
      <div
        @click="emit('navigate', 'offices')"
        class="bg-white rounded-xl py-2 px-2.5 sm:px-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-purple-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MapPin class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
            <TrendingUp class="w-2.5 h-2.5" /> +5.6%
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg lg:text-xl font-black text-slate-900 block leading-tight">
            {{ totalLocations }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ទីតាំងរដ្ឋបាល' : 'Public Offices' }}
          </span>
        </div>
      </div>

      <!-- Card 4: Public News & Bulletins -->
      <div
        @click="emit('navigate', 'news')"
        class="bg-white rounded-xl py-2 px-2.5 sm:px-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-rose-300 transition-all cursor-pointer group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Newspaper class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
            <TrendingUp class="w-2.5 h-2.5" /> +6.1%
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg lg:text-xl font-black text-slate-900 block leading-tight">
            {{ totalNews }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ព័ត៌មានជាតិ' : 'Public News' }}
          </span>
        </div>
      </div>

      <!-- Card 5: Users -->
      <div
        @click="emit('navigate', 'users')"
        class="bg-white rounded-xl py-2 px-2.5 sm:px-3 border border-slate-200/90 shadow-2xs hover:shadow-xs hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between col-span-2 sm:col-span-1"
      >
        <div class="flex items-center justify-between">
          <div class="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full flex items-center gap-0.5">
            <TrendingUp class="w-2.5 h-2.5" /> +15.3%
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg lg:text-xl font-black text-slate-900 block leading-tight">
            12,458
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-500 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់' : 'System Users' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 3. MIDDLE ROW: Service Usage Analytics Chart + Recent Activity Feed -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3 flex-1 min-h-0">
      
      <!-- Left: Service Usage Bar & Area Chart (2 cols) -->
      <div class="lg:col-span-2 bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-0">
        
        <!-- Header with Title, Mode Switcher & Timeframe Dropdown -->
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0 gap-2">
          <div>
            <div class="flex items-center gap-1.5">
              <h3 class="text-xs sm:text-sm font-black text-slate-900 font-khmer leading-none">
                {{ currentLanguage === 'kh' ? 'ស្ថិតិនៃការប្រើប្រាស់សេវាកម្ម' : 'Service Utilization Analytics' }}
              </h3>
              <span class="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded-full hidden sm:inline font-mono">
                +14.8% ↑
              </span>
            </div>
            <p class="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5 font-khmer">
              {{ currentLanguage === 'kh' ? 'អន្តរកម្មពលរដ្ឋតាមពេលវេលាជាក់ស្តែង' : 'Citizen interactions by sector' }}
            </p>
          </div>

          <!-- Chart Controls: Mode Toggle + Timeframe -->
          <div class="flex items-center gap-1.5">
            
            <!-- Mode Toggle (Bar | Curve | Donut) -->
            <div class="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80">
              <button
                type="button"
                @click="chartMode = 'bar'"
                :class="[
                  'p-1 rounded-md text-xs transition-all cursor-pointer',
                  chartMode === 'bar' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
                title="Bar Chart Mode"
              >
                <BarChart3 class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                @click="chartMode = 'area'"
                :class="[
                  'p-1 rounded-md text-xs transition-all cursor-pointer',
                  chartMode === 'area' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
                title="Area Curve Mode"
              >
                <Activity class="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                @click="chartMode = 'donut'"
                :class="[
                  'p-1 rounded-md text-xs transition-all cursor-pointer',
                  chartMode === 'donut' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                ]"
                title="Donut Share Mode"
              >
                <PieChart class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Timeframe Dropdown -->
            <div class="relative">
              <button
                type="button"
                @click="isTimeframeOpen = !isTimeframeOpen"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-50 text-[10px] sm:text-[11px] font-bold text-slate-700 cursor-pointer shadow-2xs"
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
                  :class="['w-full px-3 py-1.5 text-left text-[11px] font-bold hover:bg-slate-50 cursor-pointer font-khmer', selectedTimeframe === tf ? 'text-blue-600 bg-blue-50/50' : 'text-slate-700']"
                >
                  {{ tf }}
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- 1. MODE: VERTICAL BAR CHART -->
        <div v-if="chartMode === 'bar'" class="flex-1 min-h-0 flex flex-col justify-end pt-2">
          <!-- Bars Container -->
          <div class="relative flex-1 min-h-[75px] max-h-[125px] flex items-end justify-between gap-1 sm:gap-2 px-1.5 sm:px-3">
            
            <!-- Horizontal Guides -->
            <div class="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] sm:text-[9px] text-slate-300 font-mono">
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>100%</span></div>
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>75%</span></div>
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>50%</span></div>
              <div class="border-b border-slate-100 w-full flex items-center justify-between pb-0.5"><span>25%</span></div>
              <div class="border-b border-slate-200 w-full flex items-center justify-between pb-0.5"><span>0</span></div>
            </div>

            <!-- Bars -->
            <div
              v-for="(item, idx) in currentChartData"
              :key="idx"
              @mouseenter="hoveredIdx = idx"
              @mouseleave="hoveredIdx = null"
              class="relative z-10 flex-1 flex flex-col items-center h-full justify-end group cursor-pointer"
            >
              <!-- Hover Tooltip -->
              <div
                v-if="hoveredIdx === idx"
                class="absolute -top-7 px-1.5 py-0.5 bg-slate-900 text-white rounded text-[9px] font-mono font-bold whitespace-nowrap shadow-md z-30"
              >
                {{ item.val }} ({{ item.heightPercent }}%)
              </div>

              <!-- Bar Value Label -->
              <span class="text-[8px] sm:text-[9px] font-black text-slate-700 mb-0.5 block leading-none opacity-0 group-hover:opacity-100 transition-opacity">
                {{ item.val }}
              </span>
              
              <!-- Color Bar -->
              <div
                :class="['w-full max-w-[28px] sm:max-w-[32px] rounded-t-md transition-all duration-300 hover:brightness-110 shadow-xs group-hover:scale-y-105 origin-bottom', item.bg]"
                :style="{ height: `${item.heightPercent}%` }"
              ></div>
            </div>
          </div>

          <!-- X-Axis Category Labels -->
          <div class="flex items-center justify-between gap-1 px-1.5 sm:px-3 pt-1 border-t border-slate-200 text-center shrink-0">
            <div
              v-for="(item, idx) in currentChartData"
              :key="idx"
              class="flex-1 min-w-0"
            >
              <span class="text-[9px] sm:text-[10px] font-bold text-slate-700 font-khmer truncate block leading-tight">
                {{ currentLanguage === 'kh' ? item.nameKh : item.nameEn }}
              </span>
              <span class="text-[8px] sm:text-[9px] text-slate-400 font-semibold font-mono block">
                {{ item.val }}
              </span>
            </div>
          </div>
        </div>

        <!-- 2. MODE: INTERACTIVE SVG AREA CURVE -->
        <div v-else-if="chartMode === 'area'" class="flex-1 min-h-0 flex flex-col justify-between pt-1">
          <div class="relative flex-1 min-h-[90px] max-h-[125px] w-full">
            <svg viewBox="0 0 500 120" class="w-full h-full overflow-visible" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#2563eb" stop-opacity="0.35" />
                  <stop offset="100%" stop-color="#2563eb" stop-opacity="0.0" />
                </linearGradient>
              </defs>

              <!-- Subtle Grid lines -->
              <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="55" x2="480" y2="55" stroke="#f1f5f9" stroke-width="1" />
              <line x1="20" y1="90" x2="480" y2="90" stroke="#f1f5f9" stroke-width="1" />

              <!-- Area Fill -->
              <path :d="areaFillD" fill="url(#areaGrad)" />

              <!-- Spline Line -->
              <path :d="areaPathD" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round" />

              <!-- Interactive Points -->
              <g v-for="(pt, idx) in svgPoints" :key="idx">
                <circle
                  :cx="pt.x"
                  :cy="pt.y"
                  r="4"
                  class="fill-white stroke-blue-600 stroke-2 hover:r-6 transition-all cursor-pointer"
                  @mouseenter="hoveredIdx = idx"
                  @mouseleave="hoveredIdx = null"
                />
              </g>
            </svg>
          </div>

          <!-- X-Axis Labels for Curve -->
          <div class="flex items-center justify-between gap-1 px-2 pt-1 border-t border-slate-100 text-center shrink-0">
            <div
              v-for="(item, idx) in currentChartData"
              :key="idx"
              class="flex-1 min-w-0"
            >
              <span class="text-[9px] sm:text-[10px] font-bold text-slate-700 font-khmer truncate block">
                {{ currentLanguage === 'kh' ? item.nameKh : item.nameEn }}
              </span>
            </div>
          </div>
        </div>

        <!-- 3. MODE: DONUT SHARE -->
        <div v-else class="flex-1 min-h-0 flex items-center justify-around gap-4 py-2">
          
          <!-- SVG Donut Representation -->
          <div class="relative w-24 h-24 sm:w-28 sm:h-28 shrink-0">
            <svg viewBox="0 0 36 36" class="w-full h-full transform -rotate-90">
              <!-- Background ring -->
              <path
                class="text-slate-100"
                stroke-width="4"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <!-- Slices -->
              <path
                class="text-blue-600"
                stroke-dasharray="32, 100"
                stroke-width="4.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-emerald-500"
                stroke-dasharray="24, 100"
                stroke-dashoffset="-32"
                stroke-width="4.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="text-cyan-500"
                stroke-dasharray="18, 100"
                stroke-dashoffset="-56"
                stroke-width="4.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span class="text-xs font-black text-slate-800">100%</span>
              <span class="text-[8px] text-slate-400 font-khmer">សរុបសេវា</span>
            </div>
          </div>

          <!-- Legend Grid -->
          <div class="grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
            <div
              v-for="(item, idx) in currentChartData.slice(0, 6)"
              :key="idx"
              class="flex items-center gap-1.5"
            >
              <span class="w-2 h-2 rounded-full shrink-0" :class="item.bg"></span>
              <span class="text-[10px] text-slate-600 font-khmer truncate max-w-[80px]">
                {{ currentLanguage === 'kh' ? item.nameKh : item.nameEn }}
              </span>
              <span class="text-[10px] font-bold text-slate-800 font-mono">{{ item.val }}</span>
            </div>
          </div>

        </div>

      </div>

      <!-- Right: Recent Activity Feed (1 col) -->
      <div class="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-0">
        
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-xs sm:text-sm font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'សកម្មភាពថ្មីៗក្នុងប្រព័ន្ធ' : 'Recent System Activity' }}
            </h3>
            <p class="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">Audit log records</p>
          </div>

          <button
            type="button"
            @click="emit('navigate', 'logs')"
            class="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-khmer cursor-pointer hover:underline"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
            <ArrowUpRight class="w-3 h-3" />
          </button>
        </div>

        <div class="divide-y divide-slate-100 flex-1 min-h-0 overflow-y-auto pr-0.5">
          <div
            v-for="act in recentActivities"
            :key="act.id"
            class="py-1.5 flex items-center gap-2 hover:bg-slate-50/80 rounded-lg px-1.5 -mx-1.5 transition-colors"
          >
            <div :class="['w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0', act.iconBg]">
              <component :is="act.icon" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
            <div class="flex-1 min-w-0">
              <h4 class="text-[11px] sm:text-xs font-bold text-slate-900 leading-tight font-khmer truncate">
                {{ currentLanguage === 'kh' ? act.titleKh : act.titleEn }}
              </h4>
              <p class="text-[10px] text-slate-400 font-medium truncate mt-0.2">
                {{ act.sub }}
              </p>
            </div>
            <span class="text-[9px] text-slate-400 shrink-0 font-medium font-mono">
              {{ act.time }}
            </span>
          </div>
        </div>

      </div>

    </div>

    <!-- 4. BOTTOM ROW: Pending Approvals (50%) + Recent Content Table (50%) -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-2.5 lg:gap-3 flex-1 min-h-0">
      
      <!-- Left: Pending Approval Card -->
      <div class="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-0">
        
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div class="flex items-center gap-1.5">
            <h3 class="text-xs sm:text-sm font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'សំណើរង់ចាំការអនុម័ត' : 'Pending Approvals' }}
            </h3>
            <span class="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black leading-none">
              {{ pendingApprovals.length }}
            </span>
          </div>

          <button
            type="button"
            @click="emit('navigate', 'jobs')"
            class="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-khmer cursor-pointer hover:underline"
          >
            <span>{{ currentLanguage === 'kh' ? 'ពិនិត្យទាំងអស់' : 'Review all' }}</span>
            <ArrowUpRight class="w-3 h-3" />
          </button>
        </div>

        <div class="divide-y divide-slate-100 flex-1 min-h-0 overflow-y-auto pr-0.5">
          <div
            v-for="item in pendingApprovals"
            :key="item.id"
            class="py-1.5 flex items-center justify-between gap-2"
          >
            <div class="flex items-center gap-2 min-w-0">
              <div :class="['w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0', item.iconBg]">
                <component :is="item.icon" class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
              <div class="min-w-0">
                <h4 class="text-[11px] sm:text-xs font-bold text-slate-900 font-khmer truncate leading-tight">
                  {{ currentLanguage === 'kh' ? item.titleKh : item.titleEn }}
                </h4>
                <p class="text-[10px] text-slate-400 truncate">
                  {{ item.entity }} · {{ item.time }}
                </p>
              </div>
            </div>

            <!-- Approve & Reject Buttons -->
            <div class="flex items-center gap-1 shrink-0">
              <button
                type="button"
                @click="approvePending(item.id)"
                class="px-2 py-0.5 rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] sm:text-[11px] font-bold font-khmer transition-colors cursor-pointer shadow-2xs"
              >
                {{ currentLanguage === 'kh' ? 'អនុម័ត' : 'Approve' }}
              </button>
              <button
                type="button"
                @click="rejectPending(item.id)"
                class="px-2 py-0.5 rounded-lg border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-700 text-[10px] sm:text-[11px] font-bold font-khmer transition-colors cursor-pointer shadow-2xs"
              >
                {{ currentLanguage === 'kh' ? 'បដិសេធ' : 'Reject' }}
              </button>
            </div>
          </div>

          <div v-if="pendingApprovals.length === 0" class="py-4 text-center text-[11px] text-slate-400 font-khmer">
            {{ currentLanguage === 'kh' ? 'គ្មានសំណើរង់ចាំការអនុម័តទេ' : 'No items pending approval.' }}
          </div>
        </div>

      </div>

      <!-- Right: Recent Content Table -->
      <div class="bg-white rounded-xl p-2.5 sm:p-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between min-h-0">
        
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100 shrink-0">
          <div>
            <h3 class="text-xs sm:text-sm font-black text-slate-900 font-khmer leading-none">
              {{ currentLanguage === 'kh' ? 'មាតិកាដែលបានផ្សាយចុងក្រោយ' : 'Recently Published Content' }}
            </h3>
            <p class="text-[10px] sm:text-[11px] text-slate-400 font-medium mt-0.5">Live civic resources</p>
          </div>

          <button
            type="button"
            @click="emit('navigate', 'government')"
            class="text-[10px] sm:text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 font-khmer cursor-pointer hover:underline"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
            <ArrowUpRight class="w-3 h-3" />
          </button>
        </div>

        <!-- Table Structure -->
        <div class="overflow-x-auto flex-1 min-h-0">
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
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="c in recentContents"
                :key="c.id"
                class="hover:bg-slate-50/70 transition-colors"
              >
                <!-- Image / Name -->
                <td class="py-1 pr-2">
                  <div class="flex items-center gap-2">
                    <img :src="c.image" :alt="c.title" class="w-6 h-6 rounded-md object-cover border border-slate-200 shrink-0 shadow-2xs" />
                    <span class="font-bold text-slate-900 truncate max-w-[130px] block font-khmer text-[11px] sm:text-xs">
                      {{ currentLanguage === 'kh' ? c.titleKh : c.title }}
                    </span>
                  </div>
                </td>

                <!-- Category -->
                <td class="py-1 pr-2 text-slate-600 font-medium text-[10px] sm:text-[11px] font-khmer">
                  {{ currentLanguage === 'kh' ? c.categoryKh : c.category }}
                </td>

                <!-- Status Badge -->
                <td class="py-1 pr-2">
                  <span
                    v-if="c.status === 'published'"
                    class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 font-khmer"
                  >
                    <span class="w-1 h-1 rounded-full bg-emerald-500"></span>
                    <span>{{ currentLanguage === 'kh' ? 'បានផ្សាយ' : 'Published' }}</span>
                  </span>
                  <span
                    v-else
                    class="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200 font-khmer"
                  >
                    <span class="w-1 h-1 rounded-full bg-amber-500"></span>
                    <span>{{ currentLanguage === 'kh' ? 'ព្រាង' : 'Draft' }}</span>
                  </span>
                </td>

                <!-- Updated Date -->
                <td class="py-1 pr-2 text-slate-400 text-[10px] sm:text-[11px]">
                  {{ c.updatedDate }}
                </td>

                <!-- Action dots -->
                <td class="py-1 text-right">
                  <button type="button" class="p-0.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer">
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
