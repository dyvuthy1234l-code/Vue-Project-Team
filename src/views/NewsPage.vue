<script setup lang="ts">
import { ref, computed } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import SearchBar from '@/components/SearchBar.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import NewsCard from '@/components/NewsCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getNews } from '@/services/dataService'

const { t } = useLanguage()

const allNews = getNews()
const searchQuery = ref('')
const activeCategory = ref('All')

const categories = computed(() => [
  { value: 'All', label: t('news.categories.all') },
  { value: 'Government', label: t('news.categories.government') },
  { value: 'Weather', label: t('news.categories.weather') },
  { value: 'Traffic', label: t('news.categories.traffic') },
  { value: 'Events', label: t('news.categories.events') },
])

const filteredNews = computed(() => {
  let result = allNews

  if (activeCategory.value !== 'All') {
    result = result.filter(n => n.category === activeCategory.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(n =>
      n.title.toLowerCase().includes(query) ||
      n.description.toLowerCase().includes(query)
    )
  }

  return result
})

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <SectionHeader
      :title="t('news.title')"
      :subtitle="t('news.subtitle')"
      badge="Editorial & Bulletins"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle space-y-4">
      <SearchBar v-model="searchQuery" :placeholder="t('news.searchPlaceholder')" large />

      <div class="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
        <CategoryFilter
          :categories="categories"
          :active-category="activeCategory"
          @select="activeCategory = $event"
        />

        <button
          v-if="searchQuery || activeCategory !== 'All'"
          @click="resetFilters"
          class="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
          type="button"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>Reset Filters</span>
        </button>
      </div>
    </div>

    <!-- Editorial Layout -->
    <div v-if="filteredNews.length > 0" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <NewsCard
        v-if="filteredNews[0]"
        :news="filteredNews[0]"
        featured
      />

      <NewsCard
        v-for="item in filteredNews.slice(1)"
        :key="item.id"
        :news="item"
      />
    </div>

    <EmptyState v-else :message="t('news.noResults')" @reset="resetFilters" />
  </div>
</template>
