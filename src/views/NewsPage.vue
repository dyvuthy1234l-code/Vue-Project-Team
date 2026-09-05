<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartPulse,
  Truck,
  Sparkles,
  Search,
  TrendingUp,
  Flame,
  Eye,
  Share2,
  Radio,
  ChevronRight,
  ChevronLeft,
  LayoutGrid,
  List,
  DollarSign,
  CloudSun,
  Send,
  Coins,
  Check,
  Newspaper,
  Award,
  Fuel,
  Sun,
  CloudRain,
  ExternalLink
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import LazyImage from '@/components/LazyImage.vue'
import type { NewsItem } from '@/types'
import { useLanguage } from '@/composables/useLanguage'
import { getNews } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized, currentLanguage } = useLanguage()

usePageMeta({
  title: 'ព័ត៌មានជាតិ & សេចក្តីជូនដំណឹងទាន់ហេតុការណ៍ — CamLife News Portal',
  description: 'គេហទំព័រសារព័ត៌មានជាតិ សេចក្តីប្រកាសពីរាជរដ្ឋាភិបាល សេដ្ឋកិច្ច សុខាភិបាល ចរាចរណ៍ និងការអភិវឌ្ឍសង្គមជាតិ'
})

const defaultCategoryImages: Record<string, string> = {
  National: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  Government: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
  Health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  Infrastructure: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  Traffic: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  Events: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
  Economy: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
}

function getNewsImage(item: NewsItem): string {
  return item.image && item.image.trim() !== ''
    ? item.image
    : (defaultCategoryImages[item.category] || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80')
}

const allNews = ref<NewsItem[]>(getNews())
const searchQuery = ref('')
const activeCategory = ref('All')
const sortBy = ref<'latest' | 'popular'>('latest')
const viewMode = ref<'grid' | 'list'>('grid')

// Live Time for Newspaper Header
const liveTime = ref('')
const khmerDate = ref('')
let timeInterval: any = null

function updateLiveClock() {
  const now = new Date()
  liveTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  
  const khmerDays = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍']
  const khmerMonths = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
  const dayName = khmerDays[now.getDay()]
  const dayNum = String(now.getDate()).padStart(2, '0')
  const monthName = khmerMonths[now.getMonth()]
  const yearNum = now.getFullYear()
  
  khmerDate.value = `ថ្ងៃ${dayName} ទី${dayNum} ខែ${monthName} ឆ្នាំ${yearNum}`
}

// Breaking news ticker items
const breakingNews = computed(() => {
  const items = allNews.value.filter(n => n.breaking)
  return items.length > 0 ? items : allNews.value.slice(0, 3)
})

const currentTickerIndex = ref(0)
let tickerInterval: any = null

function nextTicker() {
  currentTickerIndex.value = (currentTickerIndex.value + 1) % breakingNews.value.length
}

function prevTicker() {
  currentTickerIndex.value = (currentTickerIndex.value - 1 + breakingNews.value.length) % breakingNews.value.length
}

onMounted(() => {
  updateLiveClock()
  timeInterval = setInterval(updateLiveClock, 1000)
  tickerInterval = setInterval(nextTicker, 5000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
  if (tickerInterval) clearInterval(tickerInterval)
})

// Categories
const categories = computed(() => [
  { value: 'All', labelKh: 'គ្រប់ព័ត៌មាន', labelEn: 'All News', icon: Building2 },
  { value: 'National', labelKh: 'ព័ត៌មានជាតិ', labelEn: 'National', icon: Building2 },
  { value: 'Economy', labelKh: 'សេដ្ឋកិច្ច & ពាណិជ្ជកម្ម', labelEn: 'Economy & Business', icon: DollarSign },
  { value: 'Health', labelKh: 'សុខាភិបាល', labelEn: 'Healthcare', icon: HeartPulse },
  { value: 'Infrastructure', labelKh: 'ហេដ្ឋារចនាសម្ព័ន្ធ', labelEn: 'Infrastructure', icon: Truck },
  { value: 'Traffic', labelKh: 'ចរាចរណ៍ & ផ្លូវគោក', labelEn: 'Traffic & Road', icon: Truck },
  { value: 'Events', labelKh: 'វប្បធម៌ & ព្រឹត្តិការណ៍', labelEn: 'Culture & Events', icon: Sparkles }
])

// Filtered & Sorted News
const filteredNews = computed(() => {
  let result = [...allNews.value]

  if (activeCategory.value !== 'All') {
    result = result.filter(n => n.category.toLowerCase() === activeCategory.value.toLowerCase())
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(n =>
      n.title.toLowerCase().includes(query) ||
      (n.titleKh && n.titleKh.toLowerCase().includes(query)) ||
      n.description.toLowerCase().includes(query) ||
      (n.descriptionKh && n.descriptionKh.toLowerCase().includes(query)) ||
      n.category.toLowerCase().includes(query) ||
      n.source.toLowerCase().includes(query) ||
      (n.author && n.author.toLowerCase().includes(query))
    )
  }

  if (sortBy.value === 'popular') {
    result.sort((a, b) => (b.views || 0) - (a.views || 0))
  }

  return result
})

// Lead Hero Article & Sub-Lead Articles for the Newspaper Top Showcase
const leadArticle = computed(() => {
  return allNews.value[0] || null
})

const subLeadArticles = computed(() => {
  return allNews.value.slice(1, 4)
})

// Top 5 Most Read / Trending for Sidebar
const trendingArticles = computed(() => {
  return [...allNews.value]
    .sort((a, b) => (b.views || 0) - (a.views || 0))
    .slice(0, 5)
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedNews,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredNews, 6)

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
  sortBy.value = 'latest'
}

// Copy news link toast
const copiedNewsId = ref<string | null>(null)
function copyNewsLink(id: string) {
  const url = window.location.origin + '/news/' + id
  navigator.clipboard.writeText(url)
  copiedNewsId.value = id
  setTimeout(() => {
    copiedNewsId.value = null
  }, 2000)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-khmer">

    <!-- ============================================================
         1. REAL NEWSPAPER TOP BAR (Live Date, Clock, Exchange & Weather)
         ============================================================ -->
    <header class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-3">
        <!-- Date & Live Digital Clock -->
        <div class="flex items-center gap-3 flex-wrap">
          <div class="flex items-center gap-1.5 font-bold text-slate-800">
            <Calendar class="w-4 h-4 text-[#0D47A1]" />
            <span>{{ currentLanguage === 'kh' ? khmerDate : new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          </div>
          <span class="text-slate-300">|</span>
          <div class="flex items-center gap-1.5 font-mono font-bold text-[#0D47A1] bg-blue-50 px-2 py-0.5 rounded">
            <Clock class="w-3.5 h-3.5 text-[#0D47A1]" />
            <span>{{ liveTime }}</span>
          </div>
        </div>

        <!-- Quick Financial & Weather Ticker -->
        <div class="flex items-center gap-4 text-[11px] font-bold text-slate-600 flex-wrap">
          <span class="flex items-center gap-1 bg-amber-50 text-amber-900 px-2 py-0.5 rounded border border-amber-200/60">
            <DollarSign class="w-3 h-3 text-amber-600" />
            <span>USD: 4,085៛</span>
          </span>
          <span class="hidden sm:flex items-center gap-1 bg-emerald-50 text-emerald-900 px-2 py-0.5 rounded border border-emerald-200/60">
            <Coins class="w-3 h-3 text-emerald-600" />
            <span>មាស: $2,840/oz</span>
          </span>
          <span class="flex items-center gap-1 bg-sky-50 text-sky-900 px-2 py-0.5 rounded border border-sky-200/60">
            <CloudSun class="w-3.5 h-3.5 text-sky-600" />
            <span>ភ្នំពេញ 31°C</span>
          </span>
        </div>
      </div>

      <!-- ============================================================
           2. BREAKING NEWS LIVE TICKER (ព័ត៌មានទាន់ហេតុការណ៍)
           ============================================================ -->
      <div class="flex items-center gap-3 overflow-hidden bg-rose-50/70 border border-rose-100 rounded-xl p-2">
        <div class="flex items-center gap-1.5 bg-rose-600 text-white font-black text-[11px] px-3 py-1 rounded-lg shrink-0 uppercase tracking-wider shadow-xs">
          <Radio class="w-3.5 h-3.5 animate-pulse" />
          <span>{{ currentLanguage === 'kh' ? 'ទាន់ហេតុការណ៍' : 'Breaking News' }}</span>
        </div>

        <div v-if="breakingNews.length > 0" class="flex-1 truncate text-xs font-bold text-slate-900">
          <router-link
            :to="'/news/' + breakingNews[currentTickerIndex].id"
            class="hover:text-rose-600 hover:underline transition-colors"
          >
            <span class="text-rose-600 mr-2">[{{ breakingNews[currentTickerIndex].category }}]</span>
            {{ localized(breakingNews[currentTickerIndex].title, breakingNews[currentTickerIndex].titleKh) }}
          </router-link>
        </div>

        <div class="flex items-center gap-1 shrink-0">
          <button @click="prevTicker" class="p-1 rounded hover:bg-rose-100 text-rose-700 cursor-pointer" title="Previous breaking news">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button @click="nextTicker" class="p-1 rounded hover:bg-rose-100 text-rose-700 cursor-pointer" title="Next breaking news">
            <ChevronRight class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- ============================================================
         3. TOP HEADLINES SHOWCASE (កម្រងព័ត៌មានធំបំផុតប្រចាំថ្ងៃ)
         ============================================================ -->
    <section v-if="leadArticle" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <!-- Main Lead Headline (Left 7 Cols) -->
      <div class="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between group">
        <div class="relative h-64 sm:h-80 w-full overflow-hidden bg-slate-900">
          <LazyImage
            :src="getNewsImage(leadArticle)"
            :alt="localized(leadArticle.title, leadArticle.titleKh)"
            img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            class="w-full h-full"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <!-- Overlay Badges -->
          <div class="absolute top-4 left-4 flex items-center gap-2">
            <span class="px-3 py-1 rounded-xl text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-md flex items-center gap-1">
              <Flame class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានលេចធ្លោ' : 'Top Story' }}</span>
            </span>
            <span class="px-3 py-1 rounded-xl text-xs font-bold uppercase bg-slate-900/80 text-white backdrop-blur-xs">
              {{ leadArticle.category }}
            </span>
          </div>

          <!-- Bottom Title & Meta in Image -->
          <div class="absolute bottom-4 left-4 right-4 text-white space-y-2">
            <div class="flex items-center gap-3 text-xs text-slate-200 font-bold">
              <span class="flex items-center gap-1"><Calendar class="w-3.5 h-3.5 text-amber-400" /> {{ leadArticle.date }}</span>
              <span>·</span>
              <span class="flex items-center gap-1"><Eye class="w-3.5 h-3.5 text-blue-300" /> {{ Number(leadArticle.views || 24890).toLocaleString() }} views</span>
              <span>·</span>
              <span>{{ leadArticle.readTime || '4 នាទី' }}</span>
            </div>

            <h2 class="text-lg sm:text-2xl font-black leading-snug group-hover:text-amber-300 transition-colors">
              <router-link :to="'/news/' + leadArticle.id">
                {{ localized(leadArticle.title, leadArticle.titleKh) }}
              </router-link>
            </h2>
          </div>
        </div>

        <div class="p-6 space-y-4">
          <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
            {{ localized(leadArticle.description, leadArticle.descriptionKh) }}
          </p>

          <div class="flex items-center justify-between pt-3 border-t border-slate-100">
            <div v-if="leadArticle.author" class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-blue-100 text-[#0D47A1] font-black text-xs flex items-center justify-center">
                {{ leadArticle.author.slice(0, 1) }}
              </div>
              <div class="text-[11px]">
                <p class="font-bold text-slate-900">{{ leadArticle.author }}</p>
                <p class="text-slate-400">{{ leadArticle.authorRole || leadArticle.source }}</p>
              </div>
            </div>

            <router-link
              :to="'/news/' + leadArticle.id"
              class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white font-black text-xs transition-colors shadow-xs"
            >
              <span>{{ currentLanguage === 'kh' ? 'អានសេចក្តីពេញលេញ' : 'Read Full Story' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Sub-Lead Articles Stack (Right 5 Cols) -->
      <div class="lg:col-span-5 flex flex-col gap-4">
        <div class="flex items-center justify-between pb-1 border-b-2 border-[#0D47A1]">
          <div class="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wide">
            <TrendingUp class="w-4 h-4 text-[#0D47A1]" />
            <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានសំខាន់ៗបន្ទាប់' : 'Trending Headlines' }}</span>
          </div>
          <span class="text-[11px] font-bold text-slate-400">LIVE FEED</span>
        </div>

        <article
          v-for="sub in subLeadArticles"
          :key="sub.id"
          class="group bg-white rounded-2xl border border-slate-200/90 p-3.5 shadow-2xs hover:shadow-card-hover transition-all flex gap-3.5 items-center"
        >
          <div class="relative w-28 sm:w-32 h-20 sm:h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
            <LazyImage
              :src="getNewsImage(sub)"
              :alt="localized(sub.title, sub.titleKh)"
              img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              class="w-full h-full"
            />
            <span class="absolute top-1.5 left-1.5 px-2 py-0.5 bg-slate-950/80 text-white text-[9px] font-black uppercase rounded backdrop-blur-xs">
              {{ sub.category }}
            </span>
          </div>

          <div class="flex-1 min-w-0 space-y-1.5">
            <div class="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
              <span class="text-[#0D47A1]">{{ sub.source }}</span>
              <span>·</span>
              <span>{{ sub.date }}</span>
            </div>

            <h3 class="font-black text-xs sm:text-sm text-slate-900 group-hover:text-[#0D47A1] transition-colors leading-snug line-clamp-2">
              <router-link :to="'/news/' + sub.id">
                {{ localized(sub.title, sub.titleKh) }}
              </router-link>
            </h3>

            <div class="flex items-center gap-3 text-[10px] text-slate-400">
              <span v-if="sub.views" class="flex items-center gap-1"><Eye class="w-3 h-3" /> {{ Number(sub.views).toLocaleString() }}</span>
              <span v-if="sub.readTime">{{ sub.readTime }}</span>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- ============================================================
         4. CATEGORY NAVIGATION BAR & SEARCH TOOLBAR
         ============================================================ -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
      <!-- Category Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          v-for="cat in categories"
          :key="cat.value"
          @click="activeCategory = cat.value"
          type="button"
          class="px-3.5 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 border"
          :class="activeCategory === cat.value
            ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
            : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'"
        >
          <component :is="cat.icon" class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? cat.labelKh : cat.labelEn }}</span>
        </button>
      </div>

      <!-- Search & Layout Controls Row -->
      <div class="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <!-- Search Input -->
        <div class="relative w-full sm:w-80">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកព័ត៌មាន, ក្រសួង, បាគង, ស្ពាន, សុខាភិបាល...' : 'Search news, economy, infrastructure...'"
            class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
          />
        </div>

        <!-- Sorting & View Mode Switches -->
        <div class="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-3">
          <!-- Sort Options -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              @click="sortBy = 'latest'"
              type="button"
              :class="['px-2.5 py-1 rounded-lg text-xs font-bold transition-all', sortBy === 'latest' ? 'bg-white text-[#0D47A1] shadow-2xs font-black' : 'text-slate-500']"
            >
              {{ currentLanguage === 'kh' ? 'ថ្មីៗបំផុត' : 'Latest' }}
            </button>
            <button
              @click="sortBy = 'popular'"
              type="button"
              :class="['px-2.5 py-1 rounded-lg text-xs font-bold transition-all', sortBy === 'popular' ? 'bg-white text-[#0D47A1] shadow-2xs font-black' : 'text-slate-500']"
            >
              {{ currentLanguage === 'kh' ? 'ពេញនិយម' : 'Popular' }}
            </button>
          </div>

          <!-- View Mode (Grid vs List) -->
          <div class="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              @click="viewMode = 'grid'"
              type="button"
              :class="['p-1 rounded-lg transition-all', viewMode === 'grid' ? 'bg-white text-[#0D47A1] shadow-2xs' : 'text-slate-400']"
              title="Grid view"
            >
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button
              @click="viewMode = 'list'"
              type="button"
              :class="['p-1 rounded-lg transition-all', viewMode === 'list' ? 'bg-white text-[#0D47A1] shadow-2xs' : 'text-slate-400']"
              title="Newspaper List view"
            >
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================
         5. MAIN NEWSPAPER TWO-COLUMN EDITORIAL LAYOUT
         ============================================================ -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

      <!-- ==========================================
           LEFT COLUMN: MAIN NEWS FEED (8 Cols)
           ========================================== -->
      <main class="lg:col-span-8 space-y-6">
        <!-- Section Title & Results Count -->
        <div class="flex items-center justify-between pb-2 border-b-2 border-slate-200">
          <div class="flex items-center gap-2 text-base font-black text-slate-900">
            <Newspaper class="w-5 h-5 text-blue-600 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានទើបចុះផ្សាយ' : 'Latest Dispatches' }}</span>
            <span class="ml-2 px-2 py-0.5 rounded-full bg-blue-50 text-[#0D47A1] text-xs font-black">
              {{ filteredNews.length }}
            </span>
          </div>
          <VerificationBadge compact />
        </div>

        <!-- ==============================
             FEED: GRID CARDS VIEW
             ============================== -->
        <div v-if="paginatedNews.length > 0 && viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <article
            v-for="item in paginatedNews"
            :key="item.id"
            class="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <!-- Cover Image -->
              <div class="relative h-48 w-full overflow-hidden bg-slate-100">
                <LazyImage
                  :src="getNewsImage(item)"
                  :alt="localized(item.title, item.titleKh)"
                  img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  class="w-full h-full"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

                <!-- Badges -->
                <div class="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span class="px-2.5 py-1 text-[10px] font-black uppercase rounded-lg bg-white/95 text-[#0D47A1] shadow-xs backdrop-blur-xs">
                    {{ item.category }}
                  </span>
                  <span v-if="item.breaking" class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-600 text-white shadow-xs flex items-center gap-1 animate-pulse">
                    ● {{ currentLanguage === 'kh' ? 'ទាន់ហេតុការណ៍' : 'Breaking' }}
                  </span>
                  <span v-else class="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-slate-900/80 text-white backdrop-blur-xs flex items-center gap-1">
                    <ShieldCheck class="w-3 h-3 text-emerald-400" />
                    <span>Verified</span>
                  </span>
                </div>

                <!-- Floating Bottom Info on Image -->
                <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
                  <span class="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
                    <Calendar class="w-3 h-3 text-slate-300" />
                    <span>{{ item.date }}</span>
                  </span>
                  <span v-if="item.views" class="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs text-blue-200">
                    <Eye class="w-3 h-3" />
                    <span>{{ Number(item.views).toLocaleString() }}</span>
                  </span>
                </div>
              </div>

              <!-- Article Content -->
              <div class="p-5 space-y-2.5">
                <div class="flex items-center justify-between text-[11px] text-slate-400 font-bold">
                  <span class="text-[#0D47A1]">{{ item.source }}</span>
                  <span v-if="item.readTime">{{ item.readTime }}</span>
                </div>

                <h3 class="font-black text-base text-slate-900 group-hover:text-[#0D47A1] transition-colors leading-snug line-clamp-2">
                  <router-link :to="'/news/' + item.id">
                    {{ localized(item.title, item.titleKh) }}
                  </router-link>
                </h3>

                <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">
                  {{ localized(item.description, item.descriptionKh) }}
                </p>
              </div>
            </div>

            <!-- Card Bottom Bar -->
            <div class="px-5 pb-5 pt-0">
              <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div v-if="item.author" class="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <div class="w-5 h-5 rounded-full bg-blue-100 text-[#0D47A1] text-[10px] font-bold flex items-center justify-center">
                    {{ item.author.slice(0, 1) }}
                  </div>
                  <span class="truncate max-w-[110px] font-medium">{{ item.author }}</span>
                </div>
                <span v-else class="text-[11px] text-slate-400">{{ item.source }}</span>

                <div class="flex items-center gap-2">
                  <button
                    @click="copyNewsLink(item.id)"
                    class="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                    title="Share link"
                  >
                    <Check v-if="copiedNewsId === item.id" class="w-3.5 h-3.5 text-emerald-600" />
                    <Share2 v-else class="w-3.5 h-3.5" />
                  </button>

                  <router-link
                    :to="'/news/' + item.id"
                    class="inline-flex items-center gap-1 text-xs font-black text-[#0D47A1] group-hover:translate-x-1 transition-transform"
                  >
                    <span>{{ currentLanguage === 'kh' ? 'អានលម្អិត' : 'Read' }}</span>
                    <ArrowRight class="w-3.5 h-3.5" />
                  </router-link>
                </div>
              </div>
            </div>
          </article>
        </div>

        <!-- ==============================
             FEED: EDITORIAL LIST VIEW
             ============================== -->
        <div v-else-if="paginatedNews.length > 0 && viewMode === 'list'" class="space-y-4">
          <article
            v-for="item in paginatedNews"
            :key="item.id"
            class="group bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-card-hover transition-all flex flex-col sm:flex-row gap-4 items-center justify-between"
          >
            <div class="relative w-full sm:w-48 h-36 rounded-xl overflow-hidden shrink-0 bg-slate-100">
              <LazyImage
                :src="getNewsImage(item)"
                :alt="localized(item.title, item.titleKh)"
                img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                class="w-full h-full"
              />
              <span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 text-white text-[9px] font-black uppercase">
                {{ item.category }}
              </span>
            </div>

            <div class="flex-1 min-w-0 space-y-2">
              <div class="flex items-center gap-3 text-xs text-slate-400 font-bold">
                <span class="text-[#0D47A1]">{{ item.source }}</span>
                <span>·</span>
                <span>{{ item.date }}</span>
                <span v-if="item.views" class="flex items-center gap-1"><Eye class="w-3 h-3" /> {{ Number(item.views).toLocaleString() }}</span>
              </div>

              <h3 class="font-black text-base text-slate-900 group-hover:text-[#0D47A1] transition-colors leading-snug">
                <router-link :to="'/news/' + item.id">
                  {{ localized(item.title, item.titleKh) }}
                </router-link>
              </h3>

              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ localized(item.description, item.descriptionKh) }}
              </p>

              <div class="flex items-center justify-between pt-2 text-xs">
                <span v-if="item.author" class="text-slate-400">ដោយ៖ <strong class="text-slate-700">{{ item.author }}</strong></span>
                <router-link :to="'/news/' + item.id" class="text-[#0D47A1] font-black flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>{{ currentLanguage === 'kh' ? 'អានសេចក្តីលម្អិត' : 'Read Full Article' }}</span>
                  <ArrowRight class="w-3.5 h-3.5" />
                </router-link>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-3xl border border-slate-200/90 p-8 text-center">
          <EmptyState
            :title="t('news.emptyTitle')"
            :subtitle="t('news.emptySubtitle')"
            :action-label="t('news.resetSearch')"
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

      <!-- ==========================================
           RIGHT COLUMN: AUTHENTIC NEWS SIDEBAR (4 Cols)
           ========================================== -->
      <aside class="lg:col-span-4 space-y-6">

        <!-- ========================================
             SIDEBAR WIDGET 1: TOP 5 TRENDING / MOST READ
             ======================================== -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-2.5 border-b-2 border-amber-500">
            <div class="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wide">
              <Flame class="w-4 h-4 text-amber-500" />
              <span>{{ currentLanguage === 'kh' ? 'អត្ថបទពេញនិយមបំផុត' : 'Most Read / Trending' }}</span>
            </div>
            <span class="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">TOP 5</span>
          </div>

          <div class="space-y-3.5">
            <router-link
              v-for="(item, idx) in trendingArticles"
              :key="item.id"
              :to="'/news/' + item.id"
              class="group flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <!-- Ranking Number Badge -->
              <span
                :class="[
                  'w-7 h-7 rounded-lg shrink-0 flex items-center justify-center font-black text-xs font-mono shadow-2xs',
                  idx === 0 ? 'bg-amber-400 text-slate-900' :
                  idx === 1 ? 'bg-slate-200 text-slate-800' :
                  idx === 2 ? 'bg-amber-700/20 text-amber-900' :
                  'bg-slate-100 text-slate-500'
                ]"
              >
                0{{ idx + 1 }}
              </span>

              <div class="flex-1 min-w-0 space-y-1">
                <h4 class="text-xs font-black text-slate-800 group-hover:text-[#0D47A1] leading-snug line-clamp-2 transition-colors">
                  {{ localized(item.title, item.titleKh) }}
                </h4>
                <div class="flex items-center gap-2 text-[10px] text-slate-400 font-bold">
                  <span>{{ item.category }}</span>
                  <span>·</span>
                  <span class="text-slate-600"><Eye class="w-3 h-3 inline" /> {{ Number(item.views || 15000).toLocaleString() }} មើល</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- ========================================
             SIDEBAR WIDGET 2: LIVE FINANCIAL & MARKET TIER
             ======================================== -->
        <div class="bg-white rounded-3xl border border-slate-200/90 p-5 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-2.5 border-b-2 border-emerald-500">
            <div class="flex items-center gap-2 text-sm font-black text-slate-900 uppercase tracking-wide">
              <Coins class="w-4 h-4 text-emerald-600" />
              <span>{{ currentLanguage === 'kh' ? 'អត្រាប្តូរប្រាក់ & ទីផ្សារ' : 'Exchange Rates & Market' }}</span>
            </div>
            <span class="text-[10px] font-bold text-slate-400">ធនាគារជាតិ NBC</span>
          </div>

          <div class="divide-y divide-slate-100 text-xs font-bold">
            <div class="py-2 flex items-center justify-between">
              <span class="flex items-center gap-2 text-slate-700">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-blue-100 text-blue-800">USD</span>
                <span>USD / KHR</span>
              </span>
              <span class="font-mono text-emerald-700 font-black">4,085.00 ៛</span>
            </div>

            <div class="py-2 flex items-center justify-between">
              <span class="flex items-center gap-2 text-slate-700">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-800">EUR</span>
                <span>EUR / KHR</span>
              </span>
              <span class="font-mono text-slate-800">4,452.10 ៛</span>
            </div>

            <div class="py-2 flex items-center justify-between">
              <span class="flex items-center gap-2 text-slate-700">
                <span class="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-100 text-amber-800">THB</span>
                <span>THB / KHR</span>
              </span>
              <span class="font-mono text-slate-800">118.40 ៛</span>
            </div>

            <div class="py-2 flex items-center justify-between">
              <span class="flex items-center gap-2 text-slate-700">
                <Award class="w-4 h-4 text-amber-500 shrink-0" />
                <span>មាសគីឡូ (Gold Spot)</span>
              </span>
              <span class="font-mono text-amber-700 font-black">$2,840.50 /oz</span>
            </div>

            <div class="py-2 flex items-center justify-between">
              <span class="flex items-center gap-2 text-slate-700">
                <Fuel class="w-4 h-4 text-blue-600 shrink-0" />
                <span>សាំងធម្មតា (EA92)</span>
              </span>
              <span class="font-mono text-blue-700 font-black">4,150 ៛ /L</span>
            </div>
          </div>

          <p class="text-[10px] text-slate-400 text-right">* បច្ចុប្បន្នភាពគិតត្រឹមថ្ងៃនេះ</p>
        </div>

        <!-- ========================================
             SIDEBAR WIDGET 3: CAMBODIA WEATHER REPORT
             ======================================== -->
        <div class="bg-gradient-to-br from-sky-50 to-blue-50/50 rounded-3xl border border-sky-100 p-5 shadow-xs space-y-3">
          <div class="flex items-center justify-between pb-2 border-b border-sky-200/60">
            <div class="flex items-center gap-1.5 text-xs font-black text-sky-950 uppercase">
              <CloudSun class="w-4 h-4 text-sky-600" />
              <span>{{ currentLanguage === 'kh' ? 'ព្យាករណ៍អាកាសធាតុ' : 'Cambodia Weather' }}</span>
            </div>
            <span class="text-[10px] font-bold text-sky-700">ក្រសួងធនធានទឹក</span>
          </div>

          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
              <span class="text-[11px] font-bold text-slate-600">ភ្នំពេញ</span>
              <div class="flex items-center justify-between">
                <span class="text-lg font-black text-slate-900">31°C</span>
                <CloudSun class="w-5 h-5 text-amber-500" />
              </div>
              <p class="text-[10px] text-slate-400">ពពកតិចតួច</p>
            </div>

            <div class="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
              <span class="text-[11px] font-bold text-slate-600">សៀមរាប</span>
              <div class="flex items-center justify-between">
                <span class="text-lg font-black text-slate-900">30°C</span>
                <Sun class="w-5 h-5 text-amber-500" />
              </div>
              <p class="text-[10px] text-slate-400">មេឃស្រឡះ</p>
            </div>

            <div class="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
              <span class="text-[11px] font-bold text-slate-600">ព្រះសីហនុ</span>
              <div class="flex items-center justify-between">
                <span class="text-lg font-black text-slate-900">29°C</span>
                <CloudRain class="w-5 h-5 text-blue-500" />
              </div>
              <p class="text-[10px] text-slate-400">ភ្លៀងរលឹមស្រិចៗ</p>
            </div>

            <div class="p-2.5 bg-white rounded-xl border border-sky-100 space-y-1">
              <span class="text-[11px] font-bold text-slate-600">បាត់ដំបង</span>
              <div class="flex items-center justify-between">
                <span class="text-lg font-black text-slate-900">32°C</span>
                <CloudSun class="w-5 h-5 text-amber-400" />
              </div>
              <p class="text-[10px] text-slate-400">មានពន្លឺថ្ងៃល្អ</p>
            </div>
          </div>
        </div>

        <!-- ========================================
             SIDEBAR WIDGET 4: TELEGRAM CHANNEL COMMUNITY
             ======================================== -->
        <div class="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-3xl p-5 shadow-sm space-y-3">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Send class="w-4 h-4 text-white" />
            </div>
            <div>
              <h4 class="text-xs font-black uppercase tracking-wider">CamLife News Telegram</h4>
              <p class="text-[10px] text-blue-100">+45,000 សមាជិកតាមដាន</p>
            </div>
          </div>

          <p class="text-xs text-blue-100 leading-relaxed">
            {{ currentLanguage === 'kh' ? 'ទទួលបានព័ត៌មានទាន់ហេតុការណ៍ និងសេចក្តីប្រកាសរដ្ឋបាលផ្លូវការមុនគេ ២៤/៧' : 'Get instant alerts and official breaking news 24/7 directly to your mobile.' }}
          </p>

          <a
            href="https://t.me"
            target="_blank"
            rel="noopener noreferrer"
            class="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#0D47A1] font-black text-xs transition-colors shadow-xs cursor-pointer"
          >
            <span>{{ currentLanguage === 'kh' ? 'ចូលរួម Telegram ឥឡូវនេះ' : 'Join Telegram Channel' }}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>

      </aside>
    </div>

  </div>
</template>
