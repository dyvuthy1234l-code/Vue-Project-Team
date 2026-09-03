<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Calendar,
  ArrowLeft,
  ChevronRight,
  Clock
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import NewsCard from '@/components/NewsCard.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getNewsById, getNews } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, localized } = useLanguage()

const article = computed(() => {
  const id = route.params.id as string
  return getNewsById(id)
})

usePageMeta({
  title: computed(() => article.value ? localized(article.value.title, article.value.titleKh) : 'News Article'),
  description: computed(() => article.value ? localized(article.value.description, article.value.descriptionKh) : '')
})

const relatedNews = computed(() => {
  if (!article.value) return []
  return getNews()
    .filter(n => n.id !== article.value?.id)
    .slice(0, 3)
})
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    <div v-if="article" class="space-y-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
        <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.home') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <router-link to="/news" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.news') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <span class="text-slate-700 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
          {{ localized(article.title, article.titleKh) }}
        </span>
      </nav>

      <!-- Back Link -->
      <div>
        <router-link
          to="/news"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to All News</span>
        </router-link>
      </div>

      <!-- Article Header -->
      <header class="space-y-4">
        <div class="flex items-center gap-2">
          <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200/80 dark:border-blue-900 uppercase tracking-wider">
            {{ article.category }}
          </span>
          <span class="text-xs text-slate-400">·</span>
          <span class="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {{ article.source }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#0A2540] dark:text-white leading-[1.25]">
          {{ localized(article.title, article.titleKh) }}
        </h1>

        <p v-if="article.titleKh" class="text-base sm:text-lg font-khmer text-slate-500 dark:text-slate-400">
          {{ article.titleKh }}
        </p>

        <!-- Meta Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-3 pb-4 border-y border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <Calendar class="w-4 h-4 text-slate-400" />
              <span>{{ article.date }}</span>
            </span>
            <span>·</span>
            <span class="flex items-center gap-1.5">
              <Clock class="w-4 h-4 text-slate-400" />
              <span>3 min read</span>
            </span>
          </div>

          <ShareButtons :title="localized(article.title, article.titleKh)" />
        </div>
      </header>

      <!-- Large Cover Image -->
      <div class="relative rounded-3xl overflow-hidden shadow-lg aspect-[16/9] bg-slate-100 dark:bg-slate-800">
        <LazyImage
          v-if="article.image"
          :src="article.image"
          :alt="localized(article.title, article.titleKh)"
          img-class="w-full h-full object-cover"
          class="w-full h-full"
        />
      </div>

      <!-- Article Body with comfortable reading width -->
      <div class="prose prose-slate dark:prose-invert max-w-none space-y-5 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
        <!-- Excerpt lead paragraph -->
        <p class="text-base sm:text-lg font-medium text-slate-900 dark:text-white leading-relaxed border-l-4 border-[#0D47A1] pl-4 py-1">
          {{ localized(article.description, article.descriptionKh) }}
        </p>

        <!-- Body content -->
        <div class="space-y-4 pt-2">
          <p v-for="(para, pIdx) in localized(article.content, article.contentKh).split('\n\n')" :key="pIdx">
            {{ para }}
          </p>
        </div>
      </div>

      <!-- Share footer -->
      <div class="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span class="text-xs font-bold text-slate-400">Share this bulletin:</span>
        <ShareButtons :title="localized(article.title, article.titleKh)" />
      </div>

      <!-- Related News Section -->
      <section class="pt-10 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
            Related News & Updates
          </h2>
          <router-link to="/news" class="text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline">
            View all →
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewsCard v-for="item in relatedNews" :key="item.id" :news="item" />
        </div>
      </section>
    </div>

    <!-- 404 If Not Found -->
    <NotFoundState
      v-else
      message="News Article Not Found"
      subtitle="The bulletin you are looking for does not exist or has been archived."
      back-link="/news"
      back-text="Back to News"
    />
  </div>
</template>
