<script setup lang="ts">
import { ref, computed } from 'vue'
import { RotateCcw, ChevronRight } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import NewsCard from '@/components/NewsCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getNews } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t } = useLanguage()

usePageMeta({
  title: 'Public News & Advisories — CamLife',
  description: 'Official announcements, government notices, and community news across Cambodia.'
})

const allNews = getNews()
const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => {
  const cats = [...new Set(allNews.map(n => n.category))]
  return [
    { value: 'All', label: t('common.all') },
    ...cats.map(c => ({ value: c, label: c }))
  ]
})

const filteredNews = computed(() => {
  let result = allNews

  if (activeCategory.value !== 'All') {
    result = result.filter(n => n.category === activeCategory.value)
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
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        {{ t('nav.home') }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.news') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('news.title')"
      :subtitle="t('news.subtitle')"
      badge="Public Bulletins"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('news.searchPlaceholder')" large />

      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          @select="activeCategory = $event"
        />

        <button
          v-if="searchQuery || activeCategory !== 'All'"
          @click="resetFilters"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Result Count -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        Found <span class="text-[#0A2540] dark:text-white font-black">{{ filteredNews.length }}</span> news & bulletin updates
      </p>
    </div>

    <!-- News Grid -->
    <div v-if="paginatedNews.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <NewsCard
        v-for="(item, idx) in paginatedNews"
        :key="item.id"
        :news="item"
        :featured="idx === 0 && currentPage === 1"
      />
    </div>

    <!-- Empty State -->
    <EmptyState
      v-else
      :message="t('common.noResults')"
      @reset="resetFilters"
    />

    <!-- Pagination -->
    <PaginationBar
      :current-page="currentPage"
      :total-pages="totalPages"
      :showing-from="showingFrom"
      :showing-to="showingTo"
      :total-items="totalItems"
      @go-to-page="goToPage"
      @next-page="nextPage"
      @prev-page="prevPage"
    />
  </div>
</template>
