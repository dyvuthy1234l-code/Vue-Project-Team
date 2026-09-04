<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  RotateCcw,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building2,
  HeartPulse,
  Truck,
  Sparkles,
  Search
} from 'lucide-vue-next'
import ServiceHeroBanner from '@/components/ServiceHeroBanner.vue'
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
  title: 'សេចក្តីជូនដំណឹង និងព័ត៌មានផ្លូវការ — CamLife Public Bulletins',
  description: 'សេចក្តីប្រកាសពីរាជរដ្ឋាភិបាល ក្រសួងសុខាភិបាល ចរាចរណ៍ និងការអភិវឌ្ឍសង្គមជាតិ'
})

const defaultCategoryImages: Record<string, string> = {
  National: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  Government: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  Health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  Infrastructure: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  Traffic: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  Events: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
  Economy: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
}

function getNewsImage(item: NewsItem): string {
  return item.image && item.image.trim() !== ''
    ? item.image
    : (defaultCategoryImages[item.category] || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80')
}

const allNews = getNews()
const searchQuery = ref('')
const activeCategory = ref('All')

// Featured breaking advisory (first item or latest health/government directive)
const featuredArticle = computed(() => {
  return allNews[0] ?? null
})

const categories = computed(() => [
  { value: 'All', labelKh: 'គ្រប់សេចក្តីប្រកាស', labelEn: 'All Bulletins', icon: Building2 },
  { value: 'National', labelKh: 'កិច្ចការជាតិ & គោលនយោបាយ', labelEn: 'National Affairs', icon: Building2 },
  { value: 'Health', labelKh: 'សុខភាពសាធារណៈ & វ៉ាក់សាំង', labelEn: 'Public Health', icon: HeartPulse },
  { value: 'Infrastructure', labelKh: 'ហេដ្ឋារចនាសម្ព័ន្ធ & ស្ពានថ្នល់', labelEn: 'Infrastructure', icon: Truck },
  { value: 'Traffic', labelKh: 'ចរាចរណ៍ & សុវត្ថិភាពផ្លូវគោក', labelEn: 'Traffic & Road Safety', icon: Truck },
  { value: 'Government', labelKh: 'ក្រសួង & ប.ស.ស', labelEn: 'Government & NSSF', icon: Building2 },
  { value: 'Events', labelKh: 'ពិធីបុណ្យ & វប្បធម៌', labelEn: 'Cultural Events', icon: Sparkles }
])

const filteredNews = computed(() => {
  let result = allNews

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
      n.source.toLowerCase().includes(query)
    )
  }

  return result
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
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Service Hero Banner with 25 Provinces Selector -->
    <ServiceHeroBanner
      :title="t('news.title')"
      :subtitle="t('news.subtitle')"
      badge="Official Public Bulletins"
      badge-kh="សេចក្តីជូនដំណឹង & ព័ត៌មានរដ្ឋបាលផ្លូវការ"
      banner-image="/images/pillars/news.jpg"
      :breadcrumb-current="t('nav.news')"
    />

    <!-- Featured Breaking Official Advisory Banner -->
    <div v-if="featuredArticle" class="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-lg relative overflow-hidden">
      <div class="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Text details -->
        <div class="lg:col-span-7 space-y-3.5">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-slate-900 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck class="w-3.5 h-3.5 text-slate-900" />
              <span>{{ currentLanguage === 'kh' ? 'សេចក្តីប្រកាសផ្លូវការជាតិ' : 'Official National Advisory' }}</span>
            </span>
            <span class="text-xs text-blue-200 font-bold flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ featuredArticle.date }}</span>
            </span>
          </div>

          <h2 class="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white leading-snug">
            {{ localized(featuredArticle.title, featuredArticle.titleKh) }}
          </h2>

          <p class="text-xs sm:text-sm text-blue-100 leading-relaxed line-clamp-3">
            {{ localized(featuredArticle.description, featuredArticle.descriptionKh) }}
          </p>

          <div class="pt-2 flex items-center gap-4">
            <router-link
              :to="'/news/' + featuredArticle.id"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer hover:scale-105"
            >
              <span>{{ currentLanguage === 'kh' ? 'អានសេចក្តីប្រកាសលម្អិត' : 'Read Official Dispatch' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>

            <span class="text-xs font-semibold text-blue-200">
              {{ currentLanguage === 'kh' ? 'ប្រភព៖ ' : 'Source: ' }}{{ featuredArticle.source }}
            </span>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="lg:col-span-5 relative h-56 sm:h-64 rounded-2xl overflow-hidden shadow-md bg-slate-800">
          <LazyImage
            :src="getNewsImage(featuredArticle)"
            :alt="localized(featuredArticle.title, featuredArticle.titleKh)"
            img-class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
          <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-md">
            {{ featuredArticle.category }}
          </span>
        </div>
      </div>
    </div>

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-4">
      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search class="w-4 h-4" />
        </div>
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេចក្តីជូនដំណឹង, ក្រសួង, ប.ស.ស, ចរាចរណ៍, សុខភាព...' : 'Search public advisories, ministerial notices, NSSF announcements...'"
          class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
        />
      </div>

      <!-- Category Filter Pills -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categories"
            :key="cat.value"
            @click="activeCategory = cat.value"
            type="button"
            class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border"
            :class="activeCategory === cat.value
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
          >
            <component :is="cat.icon" class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? cat.labelKh : cat.labelEn }}</span>
          </button>
        </div>
      </div>

      <!-- Active Filters Reset -->
      <div
        v-if="searchQuery || activeCategory !== 'All'"
        class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs"
      >
        <span class="text-slate-400 font-medium">
          {{ currentLanguage === 'kh' ? 'តម្រងសកម្ម' : 'Active Filters' }}
        </span>
        <button
          @click="resetFilters"
          class="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset Filters' }}</span>
        </button>
      </div>
    </div>

    <!-- Result Count -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        {{ currentLanguage === 'kh' ? 'រកឃើញសេចក្តីប្រកាសចំនួន' : 'Found' }}
        <span class="text-[#0A2540] dark:text-white font-black">{{ filteredNews.length }}</span>
        {{ currentLanguage === 'kh' ? 'សេចក្តីជូនដំណឹង' : 'official dispatches' }}
      </p>
      <VerificationBadge compact />
    </div>

    <!-- Official Bulletin Cards Grid -->
    <div v-if="paginatedNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <article
        v-for="item in paginatedNews"
        :key="item.id"
        class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <!-- Representative Thumbnail -->
          <div class="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
            <LazyImage
              :src="getNewsImage(item)"
              :alt="localized(item.title, item.titleKh)"
              img-class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            <!-- Category & Source Stamp -->
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-xl bg-white/95 dark:bg-slate-900/90 text-[#0A2540] dark:text-white border border-slate-200/60 shadow-sm backdrop-blur-md">
                {{ item.category }}
              </span>

              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-600/90 text-white backdrop-blur-md">
                <ShieldCheck class="w-3 h-3" />
                <span>Verified</span>
              </span>
            </div>

            <!-- Date Floating Stamp -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-bold">
              <span class="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg">
                <Calendar class="w-3 h-3 text-slate-300" />
                <span>{{ item.date }}</span>
              </span>

              <span class="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-lg text-blue-200">
                <Clock class="w-3 h-3" />
                <span>3 min read</span>
              </span>
            </div>
          </div>

          <div class="p-6 space-y-3">
            <!-- Issuing Source -->
            <div class="flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400">
              <Building2 class="w-3.5 h-3.5 shrink-0" />
              <span>{{ item.source }}</span>
            </div>

            <!-- Title -->
            <h3 class="text-base font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
              {{ localized(item.title, item.titleKh) }}
            </h3>

            <!-- Excerpt -->
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">
              {{ localized(item.description, item.descriptionKh) }}
            </p>
          </div>
        </div>

        <!-- Card Footer -->
        <div class="px-6 pb-6 pt-0">
          <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <span class="text-[11px] text-slate-400 font-semibold">
              {{ currentLanguage === 'kh' ? 'សេចក្តីប្រកាសផ្លូវការ' : 'Official Notice' }}
            </span>

            <router-link
              :to="'/news/' + item.id"
              class="inline-flex items-center gap-1 text-xs font-black text-[#0D47A1] dark:text-blue-400 group-hover:translate-x-1 transition-transform"
            >
              <span>{{ currentLanguage === 'kh' ? 'អានសេចក្តីលម្អិត' : 'Read Bulletin' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </article>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
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
  </div>
</template>
