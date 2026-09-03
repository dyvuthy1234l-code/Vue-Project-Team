<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
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
  Calendar,
  CheckCircle2
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
  description: 'CamLife is Cambodia\'s comprehensive life-service portal for healthcare, government procedures, jobs, transport, emergency hotlines, and daily services.'
})

const searchQuery = ref('')
const isSearchModalOpen = ref(false)

const popularSearches = [
  { label: 'Hospitals', labelKh: 'មន្ទីរពេទ្យ', path: '/health' },
  { label: 'Jobs', labelKh: 'ការងារ', path: '/jobs' },
  { label: 'Driving License', labelKh: 'ប័ណ្ណបើកបរ', path: '/government' },
  { label: 'Passport', labelKh: 'លិខិតឆ្លងដែន', path: '/government' },
  { label: 'Emergency', labelKh: 'សង្គ្រោះបន្ទាន់', path: '/emergency' }
]

function handleSearchSubmit() {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return

  if (q.includes('job') || q.includes('work') || q.includes('career') || q.includes('hire')) {
    router.push({ path: '/jobs', query: { q: searchQuery.value.trim() } })
  } else if (q.includes('emerg') || q.includes('police') || q.includes('fire') || q.includes('ambulance') || q.includes('117') || q.includes('119')) {
    router.push('/emergency')
  } else if (q.includes('passport') || q.includes('license') || q.includes('gov') || q.includes('tax') || q.includes('id card') || q.includes('birth')) {
    router.push({ path: '/government', query: { q: searchQuery.value.trim() } })
  } else if (q.includes('bus') || q.includes('train') || q.includes('taxi') || q.includes('transit') || q.includes('flight')) {
    router.push('/transport')
  } else if (q.includes('clean') || q.includes('plumb') || q.includes('electric') || q.includes('repair') || q.includes('ac')) {
    router.push('/home-services')
  } else if (q.includes('news')) {
    router.push('/news')
  } else {
    // Default to health or search
    router.push({ path: '/health', query: { q: searchQuery.value.trim() } })
  }
}

// 7 Key Service Categories
const servicesList = [
  {
    category: 'Emergency',
    categoryKh: 'សង្គ្រោះបន្ទាន់',
    title: 'Emergency Hotlines',
    titleKh: 'សេវាសង្គ្រោះបន្ទាន់',
    description: 'Instant 1-touch dial for Police (117), Ambulance (119), and Fire (666).',
    descriptionKh: 'ទូរស័ព្ទហៅបន្ទាន់ទៅកាន់ប៉ូលិស (១១៧) រថយន្តសង្គ្រោះ (១១៩) និងពន្លត់អគ្គិភ័យ (៦៦៦)។',
    path: '/emergency',
    icon: ShieldAlert,
    accent: '#E53935',
    tag: 'Urgent 24/7',
    tagClass: 'bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200 dark:border-red-900',
    iconBg: 'bg-red-50 text-[#E53935] dark:bg-red-950/50 dark:text-red-400'
  },
  {
    category: 'Health',
    categoryKh: 'សុខាភិបាល',
    title: 'Hospitals & Clinics',
    titleKh: 'មន្ទីរពេទ្យ និងគ្លីនិក',
    description: 'Verified public & private medical centers, pharmacies, and specialists.',
    descriptionKh: 'ស្វែងរកមន្ទីរពេទ្យរដ្ឋ និងឯកជន គ្លីនិក និងឱសថស្ថាននៅទូទាំងប្រទេសកម្ពុជា។',
    path: '/health',
    icon: HeartPulse,
    accent: '#16A34A',
    tag: 'Healthcare',
    tagClass: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
    iconBg: 'bg-emerald-50 text-[#16A34A] dark:bg-emerald-950/50 dark:text-emerald-400'
  },
  {
    category: 'Government',
    categoryKh: 'រដ្ឋបាលសាធារណៈ',
    title: 'Public Services & Guides',
    titleKh: 'សេវារដ្ឋបាល និងការណែនាំ',
    description: 'Official step-by-step requirements for Passports, Driving Licenses, and ID Cards.',
    descriptionKh: 'នីតិវិធី និងឯកសារតម្រូវសម្រាប់ធ្វើលិខិតឆ្លងដែន ប័ណ្ណបើកបរ និងអត្តសញ្ញាណប័ណ្ណ។',
    path: '/government',
    icon: Building2,
    accent: '#0D47A1',
    tag: 'Official',
    tagClass: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200 dark:border-blue-900',
    iconBg: 'bg-blue-50 text-[#0D47A1] dark:bg-blue-950/50 dark:text-blue-400'
  },
  {
    category: 'Jobs',
    categoryKh: 'ការងារ',
    title: 'Jobs & Careers',
    titleKh: 'ឱកាសការងារ និងអាជីព',
    description: 'Discover full-time, part-time, and internship opportunities in Cambodia.',
    descriptionKh: 'ស្វែងរកឱកាសការងារពេញម៉ោង ក្រៅម៉ោង និងកម្មសិក្សាពីក្រុមហ៊ុនឈានមុខ។',
    path: '/jobs',
    icon: Briefcase,
    accent: '#7E57C2',
    tag: 'Career Hub',
    tagClass: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200 dark:border-purple-900',
    iconBg: 'bg-purple-50 text-[#7E57C2] dark:bg-purple-950/50 dark:text-purple-400'
  },
  {
    category: 'Transport',
    categoryKh: 'ដឹកជញ្ជូន',
    title: 'Transport & Transit',
    titleKh: 'ការធ្វើដំណើរ និងដឹកជញ្ជូន',
    description: 'City bus lines, airport shuttles, inter-province express, and schedules.',
    descriptionKh: 'ព័ត៌មានរថយន្តក្រុងក្រុងភ្នំពេញ រថភ្លើង និងការធ្វើដំណើររវាងខេត្ត។',
    path: '/transport',
    icon: Bus,
    accent: '#F59E0B',
    tag: 'Transit',
    tagClass: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200 dark:border-amber-900',
    iconBg: 'bg-amber-50 text-[#F59E0B] dark:bg-amber-950/50 dark:text-amber-400'
  },
  {
    category: 'Home Services',
    categoryKh: 'សេវាកម្មគេហដ្ឋាន',
    title: 'Home & Utility Repair',
    titleKh: 'ជួសជុល និងសេវាផ្ទះ',
    description: 'Electricians, plumbers, air conditioning technicians, and cleaners.',
    descriptionKh: 'ជាងភ្លើង ជាងទឹក ជាងជួសជុលម៉ាស៊ីនត្រជាក់ និងសេវាសម្អាតគេហដ្ឋាន។',
    path: '/home-services',
    icon: Wrench,
    accent: '#0891B2',
    tag: 'Local Pros',
    tagClass: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900',
    iconBg: 'bg-cyan-50 text-[#0891B2] dark:bg-cyan-950/50 dark:text-cyan-400'
  },
  {
    category: 'News',
    categoryKh: 'ព័ត៌មាន',
    title: 'Public Bulletins',
    titleKh: 'សេចក្តីប្រកាសព័ត៌មាន',
    description: 'Important public announcements, advisories, and national updates.',
    descriptionKh: 'សេចក្តីប្រកាស និងព័ត៌មានសំខាន់ៗអំពីការអភិវឌ្ឍសង្គម និងជាតិ។',
    path: '/news',
    icon: Newspaper,
    accent: '#EC4899',
    tag: 'Updates',
    tagClass: 'bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300 border-pink-200 dark:border-pink-900',
    iconBg: 'bg-pink-50 text-[#EC4899] dark:bg-pink-950/50 dark:text-pink-400'
  }
]

// 4 Emergency Speed-Dial buttons (Clean, non-overwhelming)
const emergencyDials = [
  { label: 'Police', labelKh: 'នគរបាលជាតិ', number: '117', icon: ShieldAlert, color: 'text-blue-600', tel: 'tel:117' },
  { label: 'Ambulance', labelKh: 'រថយន្តសង្គ្រោះ', number: '119', icon: Ambulance, color: 'text-red-600', tel: 'tel:119' },
  { label: 'Fire', labelKh: 'ពន្លត់អគ្គិភ័យ', number: '666', icon: Flame, color: 'text-orange-600', tel: 'tel:666' },
  { label: 'Emergency', labelKh: 'សង្គ្រោះបន្ទាន់', number: '112', icon: Phone, color: 'text-emerald-600', tel: 'tel:112' }
]

// 3 Latest News
const latestNews = computed(() => getNews().slice(0, 3))

// 5 Trust Pillars
const trustPillars = [
  {
    title: 'Reliable Information',
    titleKh: 'ព័ត៌មានផ្លូវការទុកចិត្តបាន',
    desc: 'All government guides and civic procedures are verified from official sources.',
    icon: ShieldCheck
  },
  {
    title: '24/7 Fast Access',
    titleKh: 'ដំណើរការគ្រប់ពេលវេលា',
    desc: 'Direct helplines and essential directory contacts available at all times.',
    icon: Clock
  },
  {
    title: 'For Everyone',
    titleKh: 'សម្រាប់ប្រជាជនគ្រប់រូប',
    desc: 'Accessible bilingual platform designed for every citizen in Cambodia.',
    icon: Users
  },
  {
    title: 'Easy to Use',
    titleKh: 'ងាយស្រួលប្រើប្រាស់',
    desc: 'Clean, mobile-first design with 1-tap dial and fast keyword search.',
    icon: Compass
  },
  {
    title: 'Cambodia Focused',
    titleKh: 'ផ្ដោតលើប្រទេសកម្ពុជា',
    desc: 'Tailored specifically around the real daily needs of life in Cambodia.',
    icon: Sparkles
  }
]
</script>

<template>
  <div class="space-y-16 sm:space-y-24 pb-16">

    <!-- =========================================================
         SECTION 1: HERO (Modern, Clean, Spacious, Trustworthy)
    ========================================================== -->
    <section class="relative bg-gradient-to-b from-blue-50/60 via-slate-50/40 to-transparent dark:from-slate-900/80 dark:via-[#0B1727] dark:to-transparent pt-12 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-slate-200/60 dark:border-slate-800/60">
      <!-- Ambient subtle background blur circles -->
      <div class="absolute top-0 right-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div class="absolute bottom-0 left-1/4 w-80 h-80 bg-emerald-400/10 dark:bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          <!-- Left Column: Headline, Subtitle, Search Bar -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <!-- Pill Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-xs">
              <span class="w-2 h-2 rounded-full bg-[#0D47A1] dark:bg-blue-400 animate-pulse" />
              <span class="text-xs font-bold text-[#0D47A1] dark:text-blue-300 uppercase tracking-wider">
                Cambodia Public Life Platform
              </span>
            </div>

            <!-- Headline -->
            <h1 class="text-3xl sm:text-5xl lg:text-[52px] font-black tracking-tight text-[#0A2540] dark:text-white leading-[1.12]">
              Everything You Need<br />
              <span class="text-[#0D47A1] dark:text-blue-400">For Life in Cambodia</span>
            </h1>

            <!-- Khmer Subtitle & English text -->
            <div class="space-y-1 max-w-2xl mx-auto lg:mx-0">
              <p class="text-lg sm:text-xl font-khmer text-slate-700 dark:text-slate-200 font-medium">
                សេវាកម្មគ្រប់យ៉ាង ដើម្បីជីវិតកាន់តែងាយស្រួល
              </p>
              <p class="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                Find essential healthcare, verified government procedures, job openings, transit routes, and daily services in one clean place.
              </p>
            </div>

            <!-- Large Search Bar Container -->
            <form @submit.prevent="handleSearchSubmit" class="max-w-2xl mx-auto lg:mx-0 pt-2">
              <div class="flex items-center bg-white dark:bg-slate-800 rounded-2xl shadow-card border border-slate-200/90 dark:border-slate-700 p-2 focus-within:ring-3 focus-within:ring-blue-500/20 focus-within:border-[#0D47A1] dark:focus-within:border-blue-400 transition-all">
                <div class="pl-3 pr-2 text-slate-400">
                  <Search class="w-5 h-5" />
                </div>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search services, jobs, hospitals, news..."
                  class="w-full py-2.5 bg-transparent text-sm sm:text-base font-medium text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  class="shrink-0 px-5 sm:px-6 py-3 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors duration-150 active:scale-95 flex items-center gap-1.5"
                >
                  <span>Search</span>
                  <ArrowRight class="w-4 h-4 hidden sm:inline" />
                </button>
              </div>
            </form>

            <!-- Popular Searches Tag Pills -->
            <div class="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1">
              <span class="text-xs font-semibold text-slate-400 dark:text-slate-500">
                Popular:
              </span>
              <router-link
                v-for="tag in popularSearches"
                :key="tag.path"
                :to="tag.path"
                class="px-3 py-1 bg-white dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-400 rounded-full text-xs font-semibold border border-slate-200/80 dark:border-slate-700 shadow-xs transition-colors"
              >
                {{ currentLanguage === 'kh' ? tag.labelKh : tag.label }}
              </router-link>
            </div>
          </div>

          <!-- Right Column: High Quality Cambodian Landmark Graphic Card -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-700 group bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=85"
                alt="Royal Palace and Skyline Phnom Penh Cambodia"
                class="w-full h-80 sm:h-96 object-cover object-center group-hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

              <!-- Overlay Card Badge Info -->
              <div class="absolute bottom-5 left-5 right-5 text-white">
                <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-2">
                  <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kingdom of Cambodia · ព្រះរាជាណាចក្រកម្ពុជា</span>
                </div>
                <h3 class="text-lg font-bold text-white leading-snug">
                  Modern Citizen Portal
                </h3>
                <p class="text-xs text-slate-200 line-clamp-2 mt-0.5">
                  Connecting citizens and residents with nationwide essential life services.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

    <!-- =========================================================
         SECTION 2: SERVICES DIRECTORY GRID (7 Modern Cards)
    ========================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400 uppercase tracking-wider mb-1">
            <span>Essential Categories</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0A2540] dark:text-white tracking-tight">
            Explore Life Services
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-khmer">
            សេវាកម្មប្រចាំថ្ងៃដែលអ្នកត្រូវការបំផុត ក្នុងកន្លែងតែមួយ
          </p>
        </div>
      </div>

      <!-- Grid of 7 Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <router-link
          v-for="service in servicesList"
          :key="service.category"
          :to="service.path"
          class="group bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200/90 dark:border-slate-700 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <!-- Card Header: Icon & Category Tag -->
            <div class="flex items-center justify-between mb-4">
              <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200', service.iconBg]">
                <component :is="service.icon" class="w-5 h-5" />
              </div>
              <span :class="['text-[11px] font-bold px-2.5 py-0.5 rounded-full border', service.tagClass]">
                {{ service.tag }}
              </span>
            </div>

            <!-- Title (Khmer & English) -->
            <h3 class="text-base font-bold text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors">
              {{ currentLanguage === 'kh' ? service.titleKh : service.title }}
            </h3>
            <p v-if="currentLanguage !== 'kh'" class="text-xs text-slate-400 dark:text-slate-500 font-khmer mt-0.5">
              {{ service.titleKh }}
            </p>

            <!-- Description -->
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed line-clamp-2">
              {{ currentLanguage === 'kh' ? service.descriptionKh : service.description }}
            </p>
          </div>

          <!-- Bottom Action link -->
          <div class="mt-5 pt-3.5 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#0D47A1] dark:text-blue-400">
            <span>Explore</span>
            <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </router-link>
      </div>
    </section>

    <!-- =========================================================
         SECTION 3: EMERGENCY SECTION (Highest Visual Urgency, Red Only In Context)
    ========================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-white dark:bg-slate-800 rounded-3xl border-2 border-red-200 dark:border-red-900/60 shadow-lg p-6 sm:p-10 relative overflow-hidden">
        <!-- Subtle Red Ambient Accent in background -->
        <div class="absolute -right-20 -top-20 w-72 h-72 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

        <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          <!-- Left Info Column -->
          <div class="lg:col-span-5 space-y-3">
            <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 dark:bg-red-950/50 text-[#E53935] text-xs font-bold border border-red-200 dark:border-red-800">
              <span class="w-2 h-2 rounded-full bg-[#E53935] animate-ping" />
              <span>National 24/7 Helplines</span>
            </div>

            <h2 class="text-2xl sm:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight leading-tight">
              Need Help Now?
            </h2>

            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-khmer">
              សេវាសង្គ្រោះបន្ទាន់ជាតិត្រៀមរួចជាស្រេច ដើម្បីជួយសង្គ្រោះអ្នកគ្រប់ពេលវេលា។
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              Free 24/7 emergency dispatch services across all provinces of Cambodia. Tap any number below to call directly.
            </p>

            <div class="pt-2">
              <router-link
                to="/emergency"
                class="inline-flex items-center gap-2 text-xs font-bold text-[#E53935] hover:text-red-700 underline underline-offset-4"
              >
                <span>View Full Emergency Contacts Directory</span>
                <ArrowRight class="w-3.5 h-3.5" />
              </router-link>
            </div>
          </div>

          <!-- Right: 4 Speed Dial Cards Grid -->
          <div class="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            <a
              v-for="dial in emergencyDials"
              :key="dial.number"
              :href="dial.tel"
              class="group flex flex-col items-center text-center p-4 rounded-2xl bg-red-50/70 dark:bg-red-950/30 border border-red-200/80 dark:border-red-900/50 hover:bg-[#E53935] hover:border-[#E53935] hover:text-white transition-all duration-200 shadow-xs hover:shadow-md hover:-translate-y-1 focus:outline-none"
            >
              <div class="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 group-hover:bg-white/20 text-[#E53935] group-hover:text-white flex items-center justify-center mb-2 shadow-xs transition-colors">
                <component :is="dial.icon" class="w-6 h-6" />
              </div>
              <span class="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-white transition-colors">
                {{ dial.label }}
              </span>
              <span class="text-2xl sm:text-3xl font-black text-[#E53935] group-hover:text-white tracking-tight my-1 transition-colors">
                {{ dial.number }}
              </span>
              <span class="text-[10px] text-slate-500 dark:text-slate-400 group-hover:text-white/80 font-khmer transition-colors">
                {{ dial.labelKh }}
              </span>
            </a>
          </div>

        </div>
      </div>
    </section>

    <!-- =========================================================
         SECTION 4: LATEST NEWS & PUBLIC BULLETINS
    ========================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400 uppercase tracking-wider mb-1">
            <span>Official Updates</span>
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0A2540] dark:text-white tracking-tight">
            Latest News & Announcements
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 font-khmer">
            ព័ត៌មាន និងសេចក្តីប្រកាសសំខាន់ៗអំពីសង្គម និងការរស់នៅ
          </p>
        </div>

        <router-link
          to="/news"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline"
        >
          <span>View All News</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <!-- 3-Column News Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <article
          v-for="item in latestNews"
          :key="item.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <!-- Cover Image with Fixed Aspect Ratio -->
            <div class="relative aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-700">
              <LazyImage
                :src="item.image"
                :alt="localized(item.title, item.titleKh)"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                class="w-full h-full"
              />
              <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/95 dark:bg-slate-900/95 text-[#0D47A1] dark:text-blue-400 shadow-xs">
                {{ item.category }}
              </span>
            </div>

            <!-- Content Area -->
            <div class="p-5 space-y-2.5">
              <div class="flex items-center gap-3 text-xs text-slate-400">
                <span class="flex items-center gap-1">
                  <Calendar class="w-3.5 h-3.5 text-slate-400" />
                  <span>{{ item.date }}</span>
                </span>
                <span>·</span>
                <span>{{ item.source }}</span>
              </div>

              <h3 class="text-base font-bold text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                <router-link :to="'/news/' + item.id">
                  {{ localized(item.title, item.titleKh) }}
                </router-link>
              </h3>

              <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {{ localized(item.description, item.descriptionKh) }}
              </p>
            </div>
          </div>

          <!-- Card Footer -->
          <div class="p-5 pt-0">
            <router-link
              :to="'/news/' + item.id"
              class="inline-flex items-center gap-1 text-xs font-bold text-[#0D47A1] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
            >
              <span>Read Full Article</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </article>
      </div>
    </section>

    <!-- =========================================================
         SECTION 5: TRUST SECTION (Clean, Minimal, Modern)
    ========================================================== -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="bg-slate-50 dark:bg-slate-800/60 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <span class="text-xs font-bold text-[#0D47A1] dark:text-blue-400 uppercase tracking-wider">
            Why CamLife
          </span>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0A2540] dark:text-white tracking-tight mt-1">
            Built For A Better Cambodia
          </h2>
          <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 font-khmer">
            គោលបំណងរបស់យើងគឺជួយសម្រួលដល់ការរស់នៅ និងការទទួលបានសេវាសាធារណៈរបស់ប្រជាពលរដ្ឋ
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          <div
            v-for="pillar in trustPillars"
            :key="pillar.title"
            class="flex flex-col items-center text-center p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 shadow-xs space-y-2.5"
          >
            <div class="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center">
              <component :is="pillar.icon" class="w-5 h-5" />
            </div>
            <h3 class="text-sm font-bold text-[#0A2540] dark:text-white">
              {{ pillar.title }}
            </h3>
            <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ pillar.desc }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Global Search Modal -->
    <SearchModal :is-open="isSearchModalOpen" @close="isSearchModalOpen = false" />
  </div>
</template>
