<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Newspaper,
  Calendar,
  User,
  Eye,
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  TrendingUp,
  Tag,
  Flame
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getNews } from '@/services/dataService'
import type { NewsItem } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// LOAD AND PERSIST NEWS ARTICLES
// -------------------------------------------------------------
function loadNews(): NewsItem[] {
  const base = getNews()
  try {
    const saved = localStorage.getItem('camlife_custom_news')
    if (saved) {
      const parsed: NewsItem[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {}
  return [...base]
}

const newsList = ref<NewsItem[]>(loadNews())

function persistUserNews() {
  try {
    const custom = newsList.value.filter(n => n.id.startsWith('news-custom-'))
    localStorage.setItem('camlife_custom_news', JSON.stringify(custom))
  } catch {}
}

// -------------------------------------------------------------
// FILTERS & SEARCH STATE
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedCategory = ref('All')
const filterBreaking = ref(false)

const newsCategories = computed(() => {
  const set = new Set(newsList.value.map(n => n.category))
  return ['All', ...Array.from(set)]
})

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalNewsCount = computed(() => newsList.value.length)
const breakingNewsCount = computed(() => newsList.value.filter(n => n.breaking).length)
const nationalEconomyCount = computed(() => newsList.value.filter(n => n.category === 'National' || n.category === 'Economy').length)
const totalViewsCount = computed(() => {
  return newsList.value.reduce((acc, n) => acc + (n.views || 1000), 0)
})

function formatViews(v: number): string {
  if (v >= 1000) return (v / 1000).toFixed(1) + 'k'
  return v.toString()
}

// -------------------------------------------------------------
// FILTERED NEWS
// -------------------------------------------------------------
const filteredNews = computed(() => {
  return newsList.value.filter(n => {
    // 1. Category filter
    const matchCat = selectedCategory.value === 'All' || n.category === selectedCategory.value

    // 2. Breaking filter
    const matchBreaking = !filterBreaking.value || n.breaking === true

    // 3. Search query
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat && matchBreaking

    const matchSearch =
      n.title.toLowerCase().includes(q) ||
      (n.titleKh && n.titleKh.toLowerCase().includes(q)) ||
      n.description.toLowerCase().includes(q) ||
      (n.author && n.author.toLowerCase().includes(q)) ||
      n.source.toLowerCase().includes(q)

    return matchCat && matchBreaking && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredNews.value.length / itemsPerPage.value) || 1)

const paginatedNews = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredNews.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedCategory, filterBreaking, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// CATEGORY HELPERS
// -------------------------------------------------------------
function getCategoryLabel(cat: string): string {
  if (currentLanguage.value === 'kh') {
    switch (cat.toLowerCase()) {
      case 'national': return 'ព័ត៌មានជាតិ (National)'
      case 'economy': return 'សេដ្ឋកិច្ច (Economy)'
      case 'infrastructure': return 'ហេដ្ឋារចនាសម្ព័ន្ធ'
      case 'healthcare': return 'សុខាភិបាល'
      case 'technology': return 'បច្ចេកវិទ្យា'
      case 'culture': return 'វប្បធម៌ និងទេសចរណ៍'
      default: return cat
    }
  }
  return cat
}

function getCategoryColor(cat: string) {
  const c = cat.toLowerCase()
  if (c.includes('national')) {
    return { bg: 'bg-blue-50 text-blue-700 border-blue-200/90', iconBg: 'bg-blue-100 text-blue-600' }
  }
  if (c.includes('economy')) {
    return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90', iconBg: 'bg-emerald-100 text-emerald-600' }
  }
  if (c.includes('infrastructure')) {
    return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-200/90', iconBg: 'bg-indigo-100 text-indigo-600' }
  }
  if (c.includes('healthcare')) {
    return { bg: 'bg-rose-50 text-rose-700 border-rose-200/90', iconBg: 'bg-rose-100 text-rose-600' }
  }
  if (c.includes('tech')) {
    return { bg: 'bg-purple-50 text-purple-700 border-purple-200/90', iconBg: 'bg-purple-100 text-purple-600' }
  }
  return { bg: 'bg-amber-50 text-amber-700 border-amber-200/90', iconBg: 'bg-amber-100 text-amber-600' }
}

// -------------------------------------------------------------
// DETAIL MODAL (View Full Article)
// -------------------------------------------------------------
const selectedDetailNews = ref<NewsItem | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(n: NewsItem) {
  selectedDetailNews.value = n
  isDetailModalOpen.value = true
}

// -------------------------------------------------------------
// ADD / EDIT MODAL STATE
// -------------------------------------------------------------
const isFormModalOpen = ref(false)
const formMode = ref<'add' | 'edit'>('add')
const editingNewsId = ref<string | null>(null)

const formState = reactive({
  title: '',
  titleKh: '',
  category: 'National',
  description: '',
  descriptionKh: '',
  content: '',
  contentKh: '',
  date: new Date().toISOString().split('T')[0],
  image: '',
  source: 'CamLife Editorial',
  author: 'Editorial Staff',
  authorRole: 'Senior Reporter',
  breaking: false,
  readTime: '3 នាទី'
})

function openAddModal() {
  formMode.value = 'add'
  editingNewsId.value = null
  formState.title = ''
  formState.titleKh = ''
  formState.category = 'National'
  formState.description = ''
  formState.descriptionKh = ''
  formState.content = ''
  formState.contentKh = ''
  formState.date = new Date().toISOString().split('T')[0]
  formState.image = 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80'
  formState.source = 'CamLife Official Bulletin'
  formState.author = 'CamLife Reporter'
  formState.authorRole = 'Journalist'
  formState.breaking = false
  formState.readTime = '3 នាទី'
  isFormModalOpen.value = true
}

function openEditModal(n: NewsItem) {
  formMode.value = 'edit'
  editingNewsId.value = n.id
  formState.title = n.title
  formState.titleKh = n.titleKh || n.title
  formState.category = n.category
  formState.description = n.description || ''
  formState.descriptionKh = n.descriptionKh || ''
  formState.content = n.content || ''
  formState.contentKh = n.contentKh || ''
  formState.date = n.date || new Date().toISOString().split('T')[0]
  formState.image = n.image || ''
  formState.source = n.source || 'CamLife'
  formState.author = n.author || 'CamLife Staff'
  formState.authorRole = n.authorRole || 'Author'
  formState.breaking = n.breaking || false
  formState.readTime = n.readTime || '3 នាទី'
  isFormModalOpen.value = true
}

function saveNews() {
  if (!formState.title.trim() || !formState.description.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញចំណងជើង និងការពិពណ៌នាសង្ខេប!' : 'Please enter title and summary!')
    return
  }

  if (formMode.value === 'edit' && editingNewsId.value) {
    const idx = newsList.value.findIndex(n => n.id === editingNewsId.value)
    if (idx !== -1) {
      const existing = newsList.value[idx]
      newsList.value[idx] = {
        ...existing,
        title: formState.title.trim(),
        titleKh: formState.titleKh.trim() || formState.title.trim(),
        category: formState.category,
        description: formState.description.trim(),
        descriptionKh: formState.descriptionKh.trim() || formState.description.trim(),
        content: formState.content.trim() || formState.description.trim(),
        contentKh: formState.contentKh.trim() || formState.descriptionKh.trim(),
        date: formState.date,
        image: formState.image.trim() || existing.image,
        source: formState.source.trim(),
        author: formState.author.trim(),
        authorRole: formState.authorRole.trim(),
        breaking: formState.breaking,
        readTime: formState.readTime
      }
      persistUserNews()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែព័ត៌មានជោគជ័យ!' : 'Article updated successfully!')
    }
  } else {
    const newArticle: NewsItem = {
      id: 'news-custom-' + Date.now(),
      title: formState.title.trim(),
      titleKh: formState.titleKh.trim() || formState.title.trim(),
      category: formState.category,
      description: formState.description.trim(),
      descriptionKh: formState.descriptionKh.trim() || formState.description.trim(),
      content: formState.content.trim() || formState.description.trim(),
      contentKh: formState.contentKh.trim() || formState.descriptionKh.trim(),
      date: formState.date,
      image: formState.image.trim() || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
      source: formState.source.trim(),
      author: formState.author.trim(),
      authorRole: formState.authorRole.trim(),
      breaking: formState.breaking,
      views: 120,
      readTime: formState.readTime,
      tags: ['ព័ត៌មានថ្មី', formState.category]
    }
    newsList.value.unshift(newArticle)
    persistUserNews()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានចុះផ្សាយព័ត៌មានថ្មីដោយជោគជ័យ!' : 'Article published successfully!')
  }

  isFormModalOpen.value = false
}

// -------------------------------------------------------------
// DELETE MODAL (CONFIRMATION)
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingNews = ref<NewsItem | null>(null)

function promptDelete(n: NewsItem) {
  deletingNews.value = n
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingNews.value) {
    const id = deletingNews.value.id
    newsList.value = newsList.value.filter(n => n.id !== id)
    persistUserNews()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបព័ត៌មានជោគជ័យ!' : 'Article deleted!')
  }
  isDeleteModalOpen.value = false
  deletingNews.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total News -->
      <div
        @click="selectedCategory = 'All'; filterBreaking = false; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'All' && !filterBreaking && !searchQuery
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Newspaper class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សរុបទាំងអស់' : 'All Articles' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalNewsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ព័ត៌មាន & សេចក្តីជូនដំណឹង' : 'Total Publications' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: Breaking News -->
      <div
        @click="filterBreaking = !filterBreaking"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          filterBreaking
            ? 'border-rose-300 ring-2 ring-rose-400/20 bg-rose-50/20'
            : 'border-slate-200/90 hover:border-rose-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Flame class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'បន្ទាន់' : 'Breaking' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ breakingNewsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ព័ត៌មានបន្ទាន់ទាន់ហេតុការណ៍' : 'Breaking Headlines' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: National & Economy -->
      <div
        @click="selectedCategory = 'National'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedCategory === 'National' || selectedCategory === 'Economy'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <TrendingUp class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ជាតិ & សេដ្ឋកិច្ច' : 'Macro & Civic' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ nationalEconomyCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ព័ត៌មានជាតិ & សេដ្ឋកិច្ច' : 'National & Economy' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Total Readers / Views -->
      <div
        class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs group flex flex-col justify-between"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Eye class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'អ្នកអាន' : 'Readers' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight font-mono">
            {{ formatViews(totalViewsCount) }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ចំនួនអ្នកចូលអានសរុប' : 'Total Reader Traffic' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION & FILTER TOOLBAR -->
    <div class="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
      
      <!-- Left: Search & Filters -->
      <div class="flex flex-wrap items-center gap-2 flex-1">
        
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកព័ត៌មាន, សេចក្តីប្រកាស, អ្នកនិពន្ធ...' : 'Search articles, source, author...'"
            class="w-full pl-9 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-khmer shadow-2xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Category Dropdown -->
        <div class="relative">
          <select
            v-model="selectedCategory"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ផ្នែកព័ត៌មាន' : 'All Categories' }}</option>
            <option v-for="cat in newsCategories.filter(c => c !== 'All')" :key="cat" :value="cat">
              {{ getCategoryLabel(cat) }}
            </option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Breaking toggle button -->
        <button
          type="button"
          @click="filterBreaking = !filterBreaking"
          :class="[
            'px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer font-khmer shadow-2xs border',
            filterBreaking
              ? 'bg-rose-50 border-rose-300 text-rose-700 ring-1 ring-rose-400/30'
              : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'
          ]"
        >
          <Flame class="w-3.5 h-3.5 text-rose-500" />
          <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានបន្ទាន់' : 'Breaking Only' }}</span>
        </button>

      </div>

      <!-- Right: Action Button -->
      <div class="flex items-center gap-2 shrink-0 justify-end">
        <button
          type="button"
          @click="openAddModal"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold font-khmer shadow-xs transition-all cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'ចុះផ្សាយព័ត៌មានថ្មី' : 'Publish Article' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. NEWS DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[32%]">{{ currentLanguage === 'kh' ? 'ចំណងជើងព័ត៌មាន & រូបភាព' : 'Article & Thumbnail' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'ផ្នែក / ប្រភេទ' : 'Category' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[13%]">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[15%]">{{ currentLanguage === 'kh' ? 'អ្នកនិពន្ធ & ប្រភព' : 'Author & Source' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[12%]">{{ currentLanguage === 'kh' ? 'អ្នកចូលអាន' : 'Views' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[15%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="n in paginatedNews"
              :key="n.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Article Title & Thumbnail -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-8 h-8 rounded-lg overflow-hidden bg-slate-100 border border-slate-200/90 shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <img :src="n.image" :alt="n.title" class="w-full h-full object-cover" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span
                        v-if="n.breaking"
                        class="px-1.5 py-0.2 rounded bg-rose-100 text-rose-700 text-[9px] font-black uppercase tracking-wider shrink-0 font-khmer"
                      >
                        {{ currentLanguage === 'kh' ? 'បន្ទាន់' : 'BREAKING' }}
                      </span>
                      <span
                        class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                        :title="currentLanguage === 'kh' && n.titleKh ? n.titleKh : n.title"
                      >
                        {{ currentLanguage === 'kh' && n.titleKh ? n.titleKh : n.title }}
                      </span>
                    </div>

                    <div class="flex items-center gap-1.5 mt-0.5 min-w-0 truncate">
                      <span class="inline-flex items-center text-[9px] font-mono text-slate-400 truncate">
                        ID: {{ n.id }}
                      </span>
                      <span class="text-slate-300">•</span>
                      <span class="inline-flex items-center text-[9.5px] text-slate-500 truncate">
                        {{ n.source }}
                      </span>
                    </div>
                  </div>
                </div>
              </td>

              <!-- 2. Category Badge -->
              <td class="py-1.5 px-2.5 align-middle">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs truncate max-w-full', getCategoryColor(n.category).bg]">
                  {{ getCategoryLabel(n.category) }}
                </span>
              </td>

              <!-- 3. Date -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium max-w-full truncate font-mono">
                  <Calendar class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate">{{ n.date }}</span>
                </div>
              </td>

              <!-- 4. Author & Source -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 truncate max-w-full">
                    <User class="w-3 h-3 text-slate-400 shrink-0" />
                    <span class="truncate">{{ n.author || 'CamLife Staff' }}</span>
                  </div>
                  <div class="text-[9.5px] text-slate-400 truncate mt-0.5">
                    {{ n.authorRole || n.source }}
                  </div>
                </div>
              </td>

              <!-- 5. Views & Read Time -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="flex items-center gap-1">
                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-md font-mono">
                    <Eye class="w-3 h-3 text-purple-600" />
                    {{ formatViews(n.views || 1000) }}
                  </span>
                  <span v-if="n.readTime" class="text-[9px] text-slate-400 truncate">
                    {{ n.readTime }}
                  </span>
                </div>
              </td>

              <!-- 6. Actions (View Details, Edit, Delete) -->
              <td class="py-1.5 px-3 align-middle text-right">
                <div class="flex items-center justify-end gap-1">
                  
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(n)"
                    class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200/60 hover:border-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(n)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white border border-amber-200/60 hover:border-amber-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit Article'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(n)"
                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 hover:border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete Article'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredNews.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញព័ត៌មានដែលអ្នកស្វែងរកទេ' : 'No articles found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try adjusting your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedCategory = 'All'; filterBreaking = false"
                    class="mt-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold font-khmer cursor-pointer transition-colors"
                  >
                    {{ currentLanguage === 'kh' ? 'សម្អាតការស្វែងរក' : 'Clear filters' }}
                  </button>
                </div>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <!-- Table Footer with Interactive Pagination Controls -->
      <div class="p-2 sm:p-2.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
        <!-- Showing entries count info -->
        <div class="text-[11px] text-slate-600 font-medium font-khmer">
          {{ currentLanguage === 'kh' 
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredNews.length)} នៃ ${filteredNews.length} ព័ត៌មានសរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredNews.length)} of ${filteredNews.length} articles` 
          }}
        </div>

        <div class="flex items-center gap-3">
          <!-- Page size selector -->
          <div class="flex items-center gap-1.5 text-[11px] font-khmer">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'ក្នុងមួយទំព័រ:' : 'Show:' }}</span>
            <select
              v-model="itemsPerPage"
              class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option :value="8">8</option>
              <option :value="10">10</option>
              <option :value="15">15 ({{ currentLanguage === 'kh' ? 'ទាំងអស់' : 'All' }})</option>
            </select>
          </div>

          <!-- Pagination Buttons -->
          <div class="flex items-center gap-1">
            <!-- Previous Button -->
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'មុន' : 'Prev' }}</span>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                @click="goToPage(p)"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center',
                  currentPage === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <span>{{ currentLanguage === 'kh' ? 'បន្ទាប់' : 'Next' }}</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================== -->
    <!-- MODAL 1: VIEW ARTICLE SPECIFICATIONS (DETAIL MODAL)      -->
    <!-- ======================================================== -->
    <div
      v-if="isDetailModalOpen && selectedDetailNews"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs', getCategoryColor(selectedDetailNews.category).iconBg]">
              <Newspaper class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span v-if="selectedDetailNews.breaking" class="px-2 py-0.5 rounded bg-rose-600 text-white text-[9.5px] font-black uppercase tracking-wider">
                  BREAKING
                </span>
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold border capitalize', getCategoryColor(selectedDetailNews.category).bg]">
                  {{ getCategoryLabel(selectedDetailNews.category) }}
                </span>
              </div>
              <p class="text-[11px] text-slate-500 font-mono mt-0.5">
                {{ selectedDetailNews.source }} • {{ selectedDetailNews.date }}
              </p>
            </div>
          </div>
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
          
          <!-- Image Banner -->
          <div v-if="selectedDetailNews.image" class="relative rounded-xl overflow-hidden h-48 bg-slate-100 border border-slate-200">
            <img :src="selectedDetailNews.image" :alt="selectedDetailNews.title" class="w-full h-full object-cover" />
          </div>

          <!-- Title -->
          <div>
            <h2 class="text-base font-black text-slate-900 font-khmer leading-snug">
              {{ currentLanguage === 'kh' && selectedDetailNews.titleKh ? selectedDetailNews.titleKh : selectedDetailNews.title }}
            </h2>
            <div class="flex items-center gap-3 mt-1.5 text-slate-500 text-[11px]">
              <span class="inline-flex items-center gap-1">
                <User class="w-3.5 h-3.5 text-slate-400" />
                {{ selectedDetailNews.author || 'CamLife' }} ({{ selectedDetailNews.authorRole || 'Editorial' }})
              </span>
              <span>•</span>
              <span class="inline-flex items-center gap-1 font-mono">
                <Eye class="w-3.5 h-3.5 text-slate-400" />
                {{ selectedDetailNews.views || 1000 }} views
              </span>
            </div>
          </div>

          <!-- Description Summary -->
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-slate-700 leading-relaxed font-khmer font-medium">
            {{ currentLanguage === 'kh' && selectedDetailNews.descriptionKh ? selectedDetailNews.descriptionKh : selectedDetailNews.description }}
          </div>

          <!-- Full Content -->
          <div class="space-y-1.5">
            <h4 class="text-[11px] font-bold text-slate-700 uppercase tracking-wider font-khmer">
              {{ currentLanguage === 'kh' ? 'ខ្លឹមសារអត្ថបទពេញលេញ' : 'Full Article Content' }}
            </h4>
            <div class="p-3 bg-white rounded-xl border border-slate-200 text-slate-800 leading-relaxed font-khmer whitespace-pre-line">
              {{ currentLanguage === 'kh' && selectedDetailNews.contentKh ? selectedDetailNews.contentKh : selectedDetailNews.content }}
            </div>
          </div>

          <!-- Tags -->
          <div v-if="selectedDetailNews.tags && selectedDetailNews.tags.length" class="flex flex-wrap items-center gap-1.5 pt-1">
            <Tag class="w-3.5 h-3.5 text-slate-400" />
            <span
              v-for="tg in selectedDetailNews.tags"
              :key="tg"
              class="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold font-khmer"
            >
              #{{ tg }}
            </span>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            @click="isDetailModalOpen = false; openEditModal(selectedDetailNews)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាននេះ' : 'Edit Article' }}</span>
          </button>
          
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
          </button>
        </div>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 2: ADD / EDIT NEWS FORM                            -->
    <!-- ======================================================== -->
    <div
      v-if="isFormModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isFormModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        <!-- Header -->
        <div class="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Newspaper class="w-4 h-4" />
            </div>
            <h3 class="text-sm font-bold text-slate-900 font-khmer">
              {{ formMode === 'add' 
                ? (currentLanguage === 'kh' ? 'ចុះផ្សាយព័ត៌មាន ឬសេចក្តីជូនដំណឹងថ្មី' : 'Publish New Article / Bulletin') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានអត្ថបទ' : 'Edit Article') 
              }}
            </h3>
          </div>
          <button
            type="button"
            @click="isFormModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveNews" class="p-4 space-y-3 overflow-y-auto flex-1 text-xs">
          
          <!-- Title (En) & Title (Kh) -->
          <div class="space-y-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ចំណងជើងព័ត៌មាន (ភាសាខ្មែរ) *
              </label>
              <input
                v-model="formState.titleKh"
                type="text"
                placeholder="ឧ. កម្ពុជាដាក់ចេញគម្រោងអភិវឌ្ឍន៍ជាតិថ្មី..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Article Title (English) *
              </label>
              <input
                v-model="formState.title"
                type="text"
                required
                placeholder="e.g. Cambodia Launches New Infrastructure..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Category, Date & Breaking toggle -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ផ្នែក / ប្រភេទ *' : 'Category *' }}
              </label>
              <select
                v-model="formState.category"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500"
              >
                <option value="National">ព័ត៌មានជាតិ (National)</option>
                <option value="Economy">សេដ្ឋកិច្ច (Economy)</option>
                <option value="Infrastructure">ហេដ្ឋារចនាសម្ព័ន្ធ (Infrastructure)</option>
                <option value="Healthcare">សុខាភិបាល (Healthcare)</option>
                <option value="Technology">បច្ចេកវិទ្យា (Technology)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ *' : 'Published Date *' }}
              </label>
              <input
                v-model="formState.date"
                type="date"
                required
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>
            <div class="flex items-center pt-5">
              <label class="flex items-center gap-2 cursor-pointer text-slate-700 font-bold font-khmer text-xs">
                <input
                  v-model="formState.breaking"
                  type="checkbox"
                  class="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                />
                <span class="text-rose-600 font-bold">ព័ត៌មានបន្ទាន់ (Breaking)</span>
              </label>
            </div>
          </div>

          <!-- Author & Source -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'អ្នកនិពន្ធ / អ្នកយកព័ត៌មាន' : 'Author' }}
              </label>
              <input
                v-model="formState.author"
                type="text"
                placeholder="e.g. Sok Vibol"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រភពព័ត៌មាន' : 'News Source' }}
              </label>
              <input
                v-model="formState.source"
                type="text"
                placeholder="e.g. Ministry of Information / CamLife"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <!-- Image URL & Read Time -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'តំណភ្ជាប់រូបភាព (Image URL)' : 'Banner Image URL' }}
              </label>
              <input
                v-model="formState.image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'រយៈពេលអាន' : 'Estimated Read Time' }}
              </label>
              <input
                v-model="formState.readTime"
                type="text"
                placeholder="e.g. 4 នាទី or 3 min"
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              />
            </div>
          </div>

          <!-- Description / Summary (Khmer & English) -->
          <div class="space-y-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                សេចក្តីសង្ខេប (ភាសាខ្មែរ) *
              </label>
              <textarea
                v-model="formState.descriptionKh"
                rows="2"
                placeholder="សង្ខេបខ្លឹមសារព័ត៌មានជាភាសាខ្មែរ..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              ></textarea>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Summary (English) *
              </label>
              <textarea
                v-model="formState.description"
                rows="2"
                required
                placeholder="Executive summary of the news..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Full Content (Khmer & English) -->
          <div class="space-y-2">
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                ខ្លឹមសារអត្ថបទពេញលេញ (ភាសាខ្មែរ)
              </label>
              <textarea
                v-model="formState.contentKh"
                rows="4"
                placeholder="សរសេរអត្ថបទព័ត៌មានលម្អិត..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-khmer"
              ></textarea>
            </div>
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1">
                Full Content (English)
              </label>
              <textarea
                v-model="formState.content"
                rows="3"
                placeholder="Detailed article body..."
                class="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              @click="isFormModalOpen = false"
              class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
            </button>
            <button
              type="submit"
              class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-khmer shadow-sm transition-all cursor-pointer"
            >
              {{ formMode === 'add' 
                ? (currentLanguage === 'kh' ? 'ចុះផ្សាយព័ត៌មាន' : 'Publish Article') 
                : (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាន' : 'Update Article') 
              }}
            </button>
          </div>

        </form>

      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 3: DELETE CONFIRMATION DIALOG                     -->
    <!-- ======================================================== -->
    <div
      v-if="isDeleteModalOpen && deletingNews"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 text-center">
        
        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 class="w-5 h-5" />
        </div>

        <h3 class="text-sm font-bold text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកពិតជាចង់លុបព័ត៌មាននេះមែនទេ?' : 'Confirm Article Deletion' }}
        </h3>

        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">
            {{ currentLanguage === 'kh' && deletingNews.titleKh ? deletingNews.titleKh : deletingNews.title }}
          </strong>
          <br />
          {{ currentLanguage === 'kh' ? 'ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់មកវិញបានទេ។' : 'This article will be permanently removed.' }}
        </p>

        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-khmer shadow-sm transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'យល់ព្រមលុប' : 'Yes, Delete' }}
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
