<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Clock3,
  Users,
  Compass,
  Sparkles,
  Phone,
  ShieldAlert,
  Flame,
  Ambulance,
  HeartPulse,
  Building2,
  Briefcase,
  Bus,
  Wrench,
  Newspaper,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  PhoneCall,
  X
} from 'lucide-vue-next'

import { getNews } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'
import { useLanguage } from '@/composables/useLanguage'
import LazyImage from '@/components/LazyImage.vue'
import SearchModal from '@/components/SearchModal.vue'

const router = useRouter()
const { currentLanguage, localized } = useLanguage()

usePageMeta({
  title: 'CamLife — Everything You Need For Life in Cambodia',
  description:
    "CamLife is Cambodia's premier life-service portal for healthcare, government services, jobs, transport, emergency contacts and everyday services.",
})

const searchQuery = ref('')
const isSearchModalOpen = ref(false)

const popularSearches = [
  { label: 'Hospitals', labelKh: 'មន្ទីរពេទ្យ', path: '/health' },
  { label: 'Jobs', labelKh: 'ការងារ', path: '/jobs' },
  { label: 'Driving License', labelKh: 'ប័ណ្ណបើកបរ', path: '/government' },
  { label: 'Passport', labelKh: 'លិខិតឆ្លងដែន', path: '/government' },
  { label: 'Emergency', labelKh: 'សង្គ្រោះបន្ទាន់', path: '/emergency' },
]

const stats = [
  { value: '50+', label: 'Healthcare Centers', labelKh: 'មន្ទីរពេទ្យ និងគ្លីនិក', icon: HeartPulse },
  { value: '30+', label: 'Official Procedures', labelKh: 'សេវារដ្ឋបាលសាធារណៈ', icon: Building2 },
  { value: '100+', label: 'Career Openings', labelKh: 'ឱកាសការងារ', icon: Briefcase },
  { value: '24/7', label: 'Toll-Free Hotlines', labelKh: 'សង្គ្រោះបន្ទាន់ ២៤/៧', icon: PhoneCall },
]

function handleSearchSubmit() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return

  if (
    q.includes('job') ||
    q.includes('work') ||
    q.includes('career') ||
    q.includes('hire')
  ) {
    router.push({
      path: '/jobs',
      query: { q: searchQuery.value.trim() },
    })
  } else if (
    q.includes('emerg') ||
    q.includes('police') ||
    q.includes('fire') ||
    q.includes('ambulance') ||
    q.includes('117') ||
    q.includes('119')
  ) {
    router.push('/emergency')
  } else if (
    q.includes('passport') ||
    q.includes('license') ||
    q.includes('gov') ||
    q.includes('tax') ||
    q.includes('id card') ||
    q.includes('birth')
  ) {
    router.push({
      path: '/government',
      query: { q: searchQuery.value.trim() },
    })
  } else if (
    q.includes('bus') ||
    q.includes('train') ||
    q.includes('taxi') ||
    q.includes('transit') ||
    q.includes('flight')
  ) {
    router.push('/transport')
  } else if (
    q.includes('clean') ||
    q.includes('plumb') ||
    q.includes('electric') ||
    q.includes('repair') ||
    q.includes('ac')
  ) {
    router.push('/home-services')
  } else if (q.includes('news')) {
    router.push('/news')
  } else {
    router.push({
      path: '/health',
      query: { q: searchQuery.value.trim() },
    })
  }
}

const servicesList = [
  {
    category: 'Emergency',
    categoryKh: 'សង្គ្រោះបន្ទាន់',
    title: 'Emergency Hotlines',
    titleKh: 'សង្គ្រោះបន្ទាន់ជាតិ',
    description: 'Police, ambulance, fire rescue and 24/7 toll-free crisis lines.',
    descriptionKh: 'ទំនាក់ទំនងបន្ទាន់សម្រាប់ប៉ូលិស រថយន្តសង្គ្រោះ និងពន្លត់អគ្គិភ័យ។',
    path: '/emergency',
    icon: ShieldAlert,
    accent: '#E53935',
    iconBg: 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400',
    highlight: true,
  },
  {
    category: 'Health',
    categoryKh: 'សុខាភិបាល',
    title: 'Healthcare & Hospitals',
    titleKh: 'សុខភាព និងមន្ទីរពេទ្យ',
    description: 'Find verified hospitals, clinics, and 24/7 medical centers.',
    descriptionKh: 'ស្វែងរកមន្ទីរពេទ្យ គ្លីនិក និងសេវាសុខាភិបាលទូទាំងប្រទេស។',
    path: '/health',
    icon: HeartPulse,
    accent: '#16A34A',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400',
  },
  {
    category: 'Government',
    categoryKh: 'រដ្ឋបាល',
    title: 'Public Civic Guides',
    titleKh: 'សេវារដ្ឋបាលសាធារណៈ',
    description: 'Step-by-step guides for passports, driving licenses, and IDs.',
    descriptionKh: 'ការណែនាំសម្រាប់លិខិតឆ្លងដែន ប័ណ្ណបើកបរ និងសេវារដ្ឋ។',
    path: '/government',
    icon: Building2,
    accent: '#0D47A1',
    iconBg: 'bg-blue-50 text-[#0D47A1] dark:bg-blue-950/40 dark:text-blue-400',
  },
  {
    category: 'Jobs',
    categoryKh: 'ការងារ',
    title: 'Jobs & Careers',
    titleKh: 'ឱកាសការងារ និងអាជីព',
    description: 'Explore full-time, part-time jobs, and internship positions.',
    descriptionKh: 'ស្វែងរកការងារ កម្មសិក្សា និងឱកាសអាជីពថ្មីៗ។',
    path: '/jobs',
    icon: Briefcase,
    accent: '#7C3AED',
    iconBg: 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400',
  },
  {
    category: 'Transport',
    categoryKh: 'ដឹកជញ្ជូន',
    title: 'Transit & Transport',
    titleKh: 'ការធ្វើដំណើរ និងដឹកជញ្ជូន',
    description: 'Bus routes, provincial lines, train schedules, and taxi contacts.',
    descriptionKh: 'ព័ត៌មានផ្លូវធ្វើដំណើរ កាលវិភាគរថភ្លើង និងរថយន្តក្រុង។',
    path: '/transport',
    icon: Bus,
    accent: '#D97706',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400',
  },
  {
    category: 'Home Services',
    categoryKh: 'សេវាផ្ទះ',
    title: 'Home & Utilities',
    titleKh: 'សេវាកម្មគេហដ្ឋាន',
    description: 'Verified electricians, plumbers, AC technicians, and cleaners.',
    descriptionKh: 'ស្វែងរកជាងជំនាញ និងសេវាកម្មជួសជុលសម្រាប់គេហដ្ឋាន។',
    path: '/home-services',
    icon: Wrench,
    accent: '#0891B2',
    iconBg: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/40 dark:text-cyan-400',
  },
  {
    category: 'News',
    categoryKh: 'ព័ត៌មាន',
    title: 'Public Bulletins',
    titleKh: 'ព័ត៌មាន និងសេចក្តីប្រកាស',
    description: 'Stay updated with verified official announcements and advisories.',
    descriptionKh: 'សេចក្តីប្រកាស និងព័ត៌មានផ្លូវការសំខាន់ៗប្រចាំថ្ងៃ។',
    path: '/news',
    icon: Newspaper,
    accent: '#DB2777',
    iconBg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/40 dark:text-pink-400',
  },
]

const emergencyDials = [
  {
    label: 'Police Department',
    labelKh: 'នគរបាលជាតិ',
    number: '117',
    icon: ShieldAlert,
    tel: 'tel:117',
    desc: 'Crime, safety & urgent dispatch',
    descKh: 'បទល្មើស ចោរកម្ម និងសន្តិសុខ',
    gradient: 'from-blue-600/20 to-indigo-600/10 hover:border-blue-500/50',
    numberColor: 'text-white',
  },
  {
    label: 'Ambulance & SAMU',
    labelKh: 'រថយន្តសង្គ្រោះបន្ទាន់',
    number: '119',
    icon: Ambulance,
    tel: 'tel:119',
    desc: 'Medical trauma & emergency care',
    descKh: 'សង្គ្រោះវេជ្ជសាស្ត្របន្ទាន់',
    gradient: 'from-red-600/20 to-rose-600/10 hover:border-red-500/50',
    numberColor: 'text-red-400',
  },
  {
    label: 'Fire Department',
    labelKh: 'ពន្លត់អគ្គិភ័យ',
    number: '666',
    icon: Flame,
    tel: 'tel:666',
    desc: 'Fire rescue & hazard control',
    descKh: 'អគ្គិភ័យ និងការជួយសង្គ្រោះ',
    gradient: 'from-amber-600/20 to-orange-600/10 hover:border-amber-500/50',
    numberColor: 'text-amber-400',
  },
  {
    label: 'National Emergency',
    labelKh: 'សង្គ្រោះបន្ទាន់ទូទៅ',
    number: '112',
    icon: Phone,
    tel: 'tel:112',
    desc: 'Nationwide 24/7 hotline',
    descKh: 'ខ្សែទូរស័ព្ទទាន់ហេតុការណ៍ជាតិ',
    gradient: 'from-purple-600/20 to-violet-600/10 hover:border-purple-500/50',
    numberColor: 'text-purple-300',
  },
]

const latestNews = computed(() => getNews().slice(0, 3))

const trustPillars = [
  {
    title: 'Verified Information',
    titleKh: 'ព័ត៌មានផ្លូវការច្បាស់លាស់',
    desc: 'Directly sourced and curated from official ministries and vetted providers.',
    icon: ShieldCheck,
  },
  {
    title: 'Always Available 24/7',
    titleKh: 'ប្រើប្រាស់បាន ២៤/៧',
    desc: 'Immediate access to critical hotlines and information whenever you need it.',
    icon: Clock3,
  },
  {
    title: 'Built For Everyone',
    titleKh: 'សម្រាប់ប្រជាពលរដ្ឋគ្រប់គ្នា',
    desc: 'Fully bilingual in Khmer and English, accessible on mobile and desktop.',
    icon: Users,
  },
  {
    title: 'Fast & Intuitive',
    titleKh: 'រហ័ស និងងាយស្រួល',
    desc: 'Find directions, phone numbers, and guidelines in seconds with zero friction.',
    icon: Compass,
  },
]
</script>

<template>
  <div class="min-h-screen bg-[#F8FAFC] dark:bg-[#07111F] text-slate-900 dark:text-white transition-colors duration-300">

    <!-- =====================================================
         HERO SECTION WITH SMOOTH AMBIENT ANIMATIONS
    ====================================================== -->
    <section class="relative overflow-hidden pt-10 sm:pt-16 lg:pt-20 pb-14 lg:pb-24">
      <!-- Ambient Glow Orbs -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div class="absolute -top-32 -right-32 w-[540px] h-[540px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px] animate-pulse-glow" />
        <div class="absolute top-48 -left-32 w-[460px] h-[460px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/15 blur-[120px] animate-pulse-glow-delay" />
        <div class="absolute bottom-0 right-1/4 w-[360px] h-[360px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px]" />
      </div>

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">

          <!-- LEFT COLUMN: Headline, Subtitle, Interactive Search -->
          <div class="space-y-6 sm:space-y-8 animate-fade-in-up">
            <!-- Brand Badge -->
            <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-xs backdrop-blur-md">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span class="text-[11px] sm:text-xs font-black tracking-wider uppercase text-[#0D47A1] dark:text-blue-400">
                Cambodia Life Service Portal
              </span>
            </div>

            <!-- Main Heading with Dual Script -->
            <div class="space-y-3">
              <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#0A2540] dark:text-white leading-[1.1] sm:leading-[1.08]">
                Everything you need for life in
                <span class="relative inline-block text-[#0D47A1] dark:text-blue-400">
                  Cambodia
                  <svg class="absolute -bottom-1 left-0 w-full h-2 text-[#0D47A1]/20 dark:text-blue-400/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                    <path d="M0,0 Q50,12 100,0" stroke="currentColor" stroke-width="4" fill="none" />
                  </svg>
                </span>
              </h1>

              <p class="text-base sm:text-xl font-khmer text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                សេវាកម្មសាធារណៈ សុខាភិបាល ការងារ និងព័ត៌មានសំខាន់ៗសម្រាប់ការរស់នៅប្រចាំថ្ងៃ
              </p>

              <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed">
                Find healthcare centers, official administrative procedures, career opportunities, transit routes, and 24/7 toll-free emergency contacts in one clean place.
              </p>
            </div>

            <!-- Elevated Interactive Search Bar -->
            <div class="space-y-3 pt-1">
              <form
                @submit.prevent="handleSearchSubmit"
                class="group relative flex items-center bg-white dark:bg-slate-800/90 border-2 border-slate-200/90 dark:border-slate-700 rounded-2xl p-2 shadow-card hover:border-[#0D47A1]/60 focus-within:border-[#0D47A1] focus-within:ring-4 focus-within:ring-blue-500/10 transition-all duration-300 backdrop-blur-md"
              >
                <div class="pl-3 text-slate-400 group-focus-within:text-[#0D47A1] dark:group-focus-within:text-blue-400 transition-colors">
                  <Search class="w-5 h-5" />
                </div>

                <input
                  v-model="searchQuery"
                  type="text"
                  :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមន្ទីរពេទ្យ ការងារ សេវារដ្ឋ...' : 'Search hospitals, jobs, civic guides, transit...'"
                  class="flex-1 min-w-0 bg-transparent border-0 outline-none px-3.5 py-3 text-sm sm:text-base text-slate-900 dark:text-white placeholder:text-slate-400 font-medium"
                />

                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  type="button"
                  class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg mr-1 transition-colors"
                  aria-label="Clear search"
                >
                  <X class="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  class="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] active:scale-98 text-white text-xs sm:text-sm font-bold shadow-xs transition-all duration-200 shrink-0"
                >
                  <span>{{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}</span>
                  <ArrowRight class="w-4 h-4" />
                </button>
              </form>

              <!-- Popular Search Chips -->
              <div class="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span class="font-bold text-slate-400 uppercase tracking-wider text-[11px]">
                  {{ currentLanguage === 'kh' ? 'ពេញនិយម:' : 'Popular:' }}
                </span>

                <router-link
                  v-for="tag in popularSearches"
                  :key="tag.label"
                  :to="tag.path"
                  class="px-3 py-1 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/70 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:border-[#0D47A1] hover:text-[#0D47A1] dark:hover:text-blue-400 hover:shadow-xs transition-all duration-200 active:scale-95"
                >
                  {{ currentLanguage === 'kh' ? tag.labelKh : tag.label }}
                </router-link>
              </div>
            </div>
          </div>

          <!-- RIGHT COLUMN: Official Emblem Graphic Card with Smooth Floating Animation -->
          <div class="relative lg:pl-4">
            <!-- Glow under card -->
            <div class="absolute -inset-2 bg-gradient-to-r from-blue-600/20 via-cyan-500/20 to-indigo-600/20 rounded-[2.5rem] blur-2xl opacity-75 dark:opacity-50 pointer-events-none" />

            <div class="relative rounded-[2rem] bg-gradient-to-br from-[#0A2540] via-[#0F3156] to-[#0A2540] border border-white/10 p-7 sm:p-9 shadow-2xl overflow-hidden animate-float">
              <!-- Geometric Mesh Overlay -->
              <div class="absolute inset-0 opacity-[0.06] pointer-events-none" style="background-image: radial-gradient(#fff 1px, transparent 1px); background-size: 24px 24px;" />

              <!-- Card Header -->
              <div class="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
                <div class="flex items-center gap-2.5">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span class="text-xs font-bold text-blue-200 tracking-wider uppercase">
                    Kingdom of Cambodia
                  </span>
                </div>

                <div class="px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-[10px] font-extrabold text-blue-300 tracking-wider">
                  OFFICIAL DIRECTORY
                </div>
              </div>

              <!-- Official Logo Emblem Showcase -->
              <div class="relative z-10 py-8 flex flex-col items-center justify-center text-center space-y-4">
                <div class="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white p-3 shadow-xl flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/logo.png"
                    alt="CamLife Cambodia"
                    class="w-full h-full object-contain"
                  />
                </div>

                <div class="space-y-1">
                  <h2 class="text-xl sm:text-2xl font-black text-white tracking-tight">
                    CamLife Platform
                  </h2>
                  <p class="text-xs font-khmer text-blue-200">
                    សេវាកម្មជីវិតកម្ពុជា • ងាយស្រួល ទំនុកចិត្ត រហ័ស
                  </p>
                </div>
              </div>

              <!-- Quick Highlight Mini Grid -->
              <div class="relative z-10 grid grid-cols-3 gap-2.5 pt-4 border-t border-white/10">
                <router-link
                  to="/health"
                  class="rounded-xl bg-white/10 hover:bg-white/15 p-3 text-center transition-all duration-200 group border border-white/5"
                >
                  <HeartPulse class="w-5 h-5 mx-auto text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span class="block text-[11px] font-bold text-white mt-1.5">Health</span>
                  <span class="block text-[9px] text-blue-200/70">24/7 Care</span>
                </router-link>

                <router-link
                  to="/government"
                  class="rounded-xl bg-white/10 hover:bg-white/15 p-3 text-center transition-all duration-200 group border border-white/5"
                >
                  <Building2 class="w-5 h-5 mx-auto text-blue-300 group-hover:scale-110 transition-transform" />
                  <span class="block text-[11px] font-bold text-white mt-1.5">Civic</span>
                  <span class="block text-[9px] text-blue-200/70">Procedures</span>
                </router-link>

                <router-link
                  to="/jobs"
                  class="rounded-xl bg-white/10 hover:bg-white/15 p-3 text-center transition-all duration-200 group border border-white/5"
                >
                  <Briefcase class="w-5 h-5 mx-auto text-violet-300 group-hover:scale-110 transition-transform" />
                  <span class="block text-[11px] font-bold text-white mt-1.5">Jobs</span>
                  <span class="block text-[9px] text-blue-200/70">Careers</span>
                </router-link>
              </div>

              <!-- Floating Verification Chip -->
              <div class="absolute -bottom-3 -left-3 sm:-left-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl px-4 py-2.5 flex items-center gap-2.5 backdrop-blur-md">
                <div class="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 class="w-4 h-4" />
                </div>
                <div>
                  <div class="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                    Verified Public Data
                  </div>
                  <div class="text-[10px] text-slate-500 font-khmer">
                    ទិន្នន័យមានការផ្ទៀងផ្ទាត់
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- =====================================================
         KEY STATS RIBBON
    ====================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 sm:pb-16">
      <div class="bg-white dark:bg-slate-800/70 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-7 shadow-xs backdrop-blur-md">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-100 dark:divide-slate-700/60">
          <div
            v-for="(item, idx) in stats"
            :key="item.label"
            :class="['flex items-center gap-3.5', idx > 0 ? 'pt-4 sm:pt-0 sm:pl-6' : '']"
          >
            <div class="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center shrink-0 shadow-xs">
              <component :is="item.icon" class="w-6 h-6" />
            </div>

            <div>
              <div class="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight">
                {{ item.value }}
              </div>
              <div class="text-xs font-bold text-slate-700 dark:text-slate-200 leading-tight mt-0.5">
                {{ currentLanguage === 'kh' ? item.labelKh : item.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         EXPLORE ALL SERVICES (7 Modern Service Cards)
    ====================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <!-- Section Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
            <Sparkles class="w-3.5 h-3.5" />
            <span>Essential Services</span>
          </div>

          <h2 class="mt-2.5 text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-[#0A2540] dark:text-white">
            What do you need today?
          </h2>

          <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-khmer">
            ជ្រើសរើសសេវាកម្មដែលលោកអ្នកត្រូវការសម្រាប់ការរស់នៅប្រចាំថ្ងៃ
          </p>
        </div>

        <router-link
          to="/services"
          class="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D47A1] dark:text-blue-400 hover:gap-2.5 transition-all group"
        >
          <span>View all services directory</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- Services Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
        <router-link
          v-for="(service, index) in servicesList"
          :key="service.category"
          :to="service.path"
          class="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
          :class="index === 0 ? 'sm:col-span-2 lg:col-span-2' : ''"
        >
          <!-- Top Row: Icon + Arrow -->
          <div>
            <div class="flex items-start justify-between gap-3">
              <div
                :class="[
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-xs',
                  service.iconBg
                ]"
              >
                <component :is="service.icon" class="w-6 h-6" />
              </div>

              <div class="flex items-center gap-1">
                <span
                  v-if="service.highlight"
                  class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400"
                >
                  24/7 Hotline
                </span>

                <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/60 text-slate-400 group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 flex items-center justify-center group-hover:translate-x-1 transition-all">
                  <ChevronRight class="w-4 h-4" />
                </div>
              </div>
            </div>

            <!-- Content -->
            <div class="mt-5 space-y-1.5">
              <span class="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-400 block">
                {{ currentLanguage === 'kh' ? service.categoryKh : service.category }}
              </span>

              <h3 class="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug">
                {{ currentLanguage === 'kh' ? service.titleKh : service.title }}
              </h3>

              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                {{ currentLanguage === 'kh' ? service.descriptionKh : service.description }}
              </p>
            </div>
          </div>

          <!-- Bottom Accent Hover Line -->
          <div
            class="absolute bottom-0 left-0 right-0 h-[3px] scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300"
            :style="{ backgroundColor: service.accent }"
          />
        </router-link>
      </div>
    </section>

    <!-- =====================================================
         EMERGENCY SECTION (Clean High-Urgency Speed Dials)
    ====================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="relative overflow-hidden rounded-3xl bg-[#0B1727] dark:bg-[#07111F] border border-red-900/40 p-6 sm:p-10 lg:p-12 shadow-2xl text-white">
        <!-- Ambient Red Glow -->
        <div class="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
        <div class="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div class="relative z-10 grid lg:grid-cols-[0.85fr_1.15fr] gap-8 lg:gap-12 items-center">
          <!-- Left: Urgent Headline -->
          <div class="space-y-4">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider border border-red-500/30">
              <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span>Free 24/7 Nationwide Hotlines</span>
            </div>

            <h2 class="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Need Help Right Now?
            </h2>

            <p class="text-xs sm:text-sm font-khmer text-red-200/90 leading-relaxed">
              ពេលមានហេតុការណ៍បន្ទាន់ សូមហៅទូរស័ព្ទទៅកាន់លេខសង្គ្រោះបន្ទាន់ជាតិដោយឥតគិតថ្លៃ។
            </p>

            <p class="text-xs text-slate-300 leading-relaxed">
              Direct emergency dispatch from any mobile or landline across Cambodia. Available day and night.
            </p>

            <div class="pt-2">
              <router-link
                to="/emergency"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all active:scale-95"
              >
                <span>View All Emergency Helplines</span>
                <ArrowRight class="w-4 h-4" />
              </router-link>
            </div>
          </div>

          <!-- Right: 4 Speed-Dial Cards -->
          <div class="grid grid-cols-2 gap-3 sm:gap-4">
            <a
              v-for="dial in emergencyDials"
              :key="dial.number"
              :href="dial.tel"
              class="group relative rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-red-500/40 p-4 sm:p-5 transition-all duration-200 flex flex-col justify-between active:scale-98"
            >
              <div class="flex items-center justify-between">
                <span :class="['text-3xl sm:text-4xl font-black tracking-tight', dial.numberColor]">
                  {{ dial.number }}
                </span>

                <div class="w-9 h-9 rounded-xl bg-white/10 group-hover:bg-red-600 text-white flex items-center justify-center transition-colors duration-200">
                  <PhoneCall class="w-4 h-4" />
                </div>
              </div>

              <div class="mt-3">
                <div class="text-xs font-bold text-white group-hover:text-red-300 transition-colors">
                  {{ dial.label }}
                </div>
                <div class="text-[10px] font-khmer text-slate-400 mt-0.5">
                  {{ dial.labelKh }}
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         LATEST NEWS & OFFICIAL BULLETINS
    ====================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="flex items-end justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-400 border border-blue-200/60 dark:border-blue-900/60">
            <Newspaper class="w-3.5 h-3.5" />
            <span>Public Bulletins</span>
          </div>

          <h2 class="mt-2.5 text-2xl sm:text-3xl font-black tracking-tight text-[#0A2540] dark:text-white">
            Latest News & Announcements
          </h2>

          <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-khmer">
            ព័ត៌មាន និងសេចក្តីប្រកាសសំខាន់ៗប្រចាំថ្ងៃ
          </p>
        </div>

        <router-link
          to="/news"
          class="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0D47A1] dark:text-blue-400 hover:gap-2.5 transition-all group"
        >
          <span>See all news</span>
          <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <!-- News Cards Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="item in latestNews"
          :key="item.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <router-link :to="'/news/' + item.id">
              <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
                <LazyImage
                  :src="item.image"
                  :alt="localized(item.title, item.titleKh)"
                  img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  class="w-full h-full"
                />

                <div class="absolute top-3 left-3">
                  <span class="px-2.5 py-1 rounded-lg bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[10px] font-bold text-[#0D47A1] dark:text-blue-400 shadow-xs uppercase tracking-wider">
                    {{ item.category }}
                  </span>
                </div>
              </div>
            </router-link>

            <div class="p-5 space-y-2.5">
              <div class="flex items-center gap-2 text-[11px] font-semibold text-slate-400">
                <CalendarDays class="w-3.5 h-3.5" />
                <span>{{ item.date }}</span>
                <span>•</span>
                <span>{{ item.source }}</span>
              </div>

              <router-link :to="'/news/' + item.id">
                <h3 class="text-base font-bold leading-snug text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {{ localized(item.title, item.titleKh) }}
                </h3>
              </router-link>

              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {{ localized(item.description, item.descriptionKh) }}
              </p>
            </div>
          </div>

          <div class="p-5 pt-0">
            <router-link
              :to="'/news/' + item.id"
              class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400 group-hover:gap-2.5 transition-all"
            >
              <span>Read article</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- =====================================================
         TRUST & QUALITY PILLARS
    ====================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div class="rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 p-7 sm:p-10 lg:p-12 shadow-sm">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-400">
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>Why CamLife</span>
          </div>

          <h2 class="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#0A2540] dark:text-white">
            Built to make everyday life simpler.
          </h2>

          <p class="mt-1 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-khmer">
            បង្កើតឡើងដើម្បីសម្រួលដល់ការស្វែងរកសេវាកម្មប្រចាំថ្ងៃ និងព័ត៌មានរដ្ឋបាលសាធារណៈ
          </p>
        </div>

        <div class="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="pillar in trustPillars"
            :key="pillar.title"
            class="group p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-750 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xs transition-all duration-200"
          >
            <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
              <component :is="pillar.icon" class="w-5 h-5" />
            </div>

            <h3 class="mt-4 text-sm font-bold text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? pillar.titleKh : pillar.title }}
            </h3>

            <p class="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              {{ pillar.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CLEAN FINAL CALL TO ACTION
    ====================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#0A2540] p-8 sm:p-12 text-center text-white shadow-xl">
        <div class="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />

        <div class="relative max-w-2xl mx-auto space-y-4">
          <Sparkles class="w-8 h-8 mx-auto text-blue-200 animate-pulse" />

          <h2 class="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Find what you need in seconds.
          </h2>

          <p class="text-xs sm:text-sm text-blue-100 font-khmer">
            ស្វែងរកសេវាកម្មសំខាន់ៗសម្រាប់ការរស់នៅប្រចាំថ្ងៃរបស់អ្នកដោយឥតគិតថ្លៃ។
          </p>

          <div class="pt-3 flex flex-col sm:flex-row justify-center gap-3">
            <router-link
              to="/services"
              class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-[#0D47A1] text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
            >
              <span>Explore All Services</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>

            <router-link
              to="/emergency"
              class="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95"
            >
              <span>Emergency Hotlines</span>
              <Phone class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Search Modal -->
    <SearchModal
      :is-open="isSearchModalOpen"
      @close="isSearchModalOpen = false"
    />

  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes pulseGlow {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.05);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-pulse-glow {
  animation: pulseGlow 8s ease-in-out infinite;
}

.animate-pulse-glow-delay {
  animation: pulseGlow 8s ease-in-out infinite 4s;
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@media (prefers-reduced-motion: reduce) {
  .animate-float,
  .animate-pulse-glow,
  .animate-pulse-glow-delay,
  .animate-fade-in-up {
    animation: none !important;
  }
}
</style>
