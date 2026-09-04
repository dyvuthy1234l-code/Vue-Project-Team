<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Calendar,
  ArrowLeft,
  ChevronRight,
  Clock,
  Printer,
  ShieldCheck,
  Building2,
  Share2
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import NewsCard from '@/components/NewsCard.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getNewsById, getNews } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, localized, currentLanguage } = useLanguage()

const defaultCategoryImages: Record<string, string> = {
  National: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80',
  Government: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  Health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80',
  Infrastructure: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  Traffic: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=800&q=80',
  Events: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
  Economy: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
}

const article = computed(() => {
  const id = route.params.id as string
  return getNewsById(id)
})

const coverImage = computed(() => {
  if (!article.value) return ''
  return article.value.image && article.value.image.trim() !== ''
    ? article.value.image
    : (defaultCategoryImages[article.value.category] || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=800&q=80')
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

function printBulletin() {
  window.print()
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-khmer">
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

      <!-- Back Link + Print Button -->
      <div class="flex items-center justify-between">
        <router-link
          to="/news"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅសេចក្តីជូនដំណឹងទាំងអស់' : 'Back to All Bulletins' }}</span>
        </router-link>

        <button
          @click="printBulletin"
          type="button"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'បោះពុម្ពសេចក្តីប្រកាស' : 'Print Bulletin' }}</span>
        </button>
      </div>

      <!-- Official Dispatch Header Card -->
      <header class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-5">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 text-xs font-extrabold rounded-xl border border-blue-200/80 dark:border-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <Building2 class="w-3.5 h-3.5" />
              <span>{{ article.category }}</span>
            </span>

            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60">
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>Official Government Dispatch</span>
            </span>
          </div>

          <span class="text-xs font-bold text-slate-400">
            Ref: CL-{{ article.id.toUpperCase().slice(0, 10) }}
          </span>
        </div>

        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0A2540] dark:text-white leading-[1.25]">
          {{ localized(article.title, article.titleKh) }}
        </h1>

        <p v-if="article.titleKh && currentLanguage === 'en'" class="text-base font-khmer text-slate-500 dark:text-slate-400">
          {{ article.titleKh }}
        </p>

        <!-- Meta Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500 dark:text-slate-400">
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5 font-bold text-[#0D47A1] dark:text-blue-300">
              <Building2 class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
              <span>{{ article.source }}</span>
            </span>
            <span>·</span>
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
      <div class="relative rounded-3xl overflow-hidden shadow-md aspect-[16/9] bg-slate-100 dark:bg-slate-800">
        <LazyImage
          :src="coverImage"
          :alt="localized(article.title, article.titleKh)"
          img-class="w-full h-full object-cover"
          class="w-full h-full"
        />
      </div>

      <!-- Article Body with comfortable reading width -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        <!-- Excerpt lead paragraph -->
        <div class="text-base sm:text-lg font-bold text-[#0A2540] dark:text-white leading-relaxed border-l-4 border-[#0D47A1] pl-4 py-1 bg-blue-50/50 dark:bg-blue-950/20 rounded-r-2xl">
          {{ localized(article.description, article.descriptionKh) }}
        </div>

        <!-- Body content -->
        <div class="space-y-4 pt-2 text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200">
          <p v-for="(para, pIdx) in localized(article.content, article.contentKh).split('\n\n')" :key="pIdx">
            {{ para }}
          </p>
        </div>

        <!-- Official verification badge footer -->
        <div class="pt-6 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0D47A1] dark:text-blue-400">
              <ShieldCheck class="w-6 h-6" />
            </div>
            <div>
              <p class="text-xs font-black text-[#0A2540] dark:text-white">
                {{ currentLanguage === 'kh' ? 'សេចក្តីប្រកាសព័ត៌មានផ្លូវការផ្ទៀងផ្ទាត់ដោយ CamLife' : 'Verified Official Civic Bulletin' }}
              </p>
              <p class="text-[11px] text-slate-400">
                {{ currentLanguage === 'kh' ? 'ប្រភពដើម៖ ' : 'Official Authority: ' }}{{ article.source }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <Share2 class="w-4 h-4 text-slate-400" />
            <ShareButtons :title="localized(article.title, article.titleKh)" />
          </div>
        </div>
      </div>

      <!-- Related Bulletins Section -->
      <section class="pt-6 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white">
            {{ currentLanguage === 'kh' ? 'សេចក្តីជូនដំណឹងពាក់ព័ន្ធ' : 'Related Civic Bulletins' }}
          </h2>
          <router-link to="/news" class="text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline">
            {{ currentLanguage === 'kh' ? 'មើលទាំងអស់ →' : 'View all →' }}
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
