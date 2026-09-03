<script setup lang="ts">
import { Calendar, Newspaper, ArrowRight } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import LazyImage from '@/components/LazyImage.vue'
import type { NewsItem } from '@/types'

const { t, localized } = useLanguage()

defineProps<{
  news: NewsItem
  featured?: boolean
}>()
</script>

<template>
  <article
    :class="[
      'group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between',
      featured ? 'md:col-span-2 md:flex-row' : ''
    ]"
  >
    <!-- Cover Image -->
    <div
      :class="[
        'relative overflow-hidden bg-slate-100 dark:bg-slate-700',
        featured ? 'md:w-1/2 aspect-[16/10] md:aspect-auto min-h-[14rem]' : 'aspect-[16/10]'
      ]"
    >
      <LazyImage
        v-if="news.image"
        :src="news.image"
        :alt="localized(news.title, news.titleKh)"
        img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        class="w-full h-full"
      />
      <div v-else class="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800">
        <Newspaper class="w-10 h-10 opacity-40" />
      </div>

      <!-- Category Pill Overlay -->
      <span class="absolute top-3 left-3 px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#0D47A1] dark:text-blue-400 text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-xs">
        {{ news.category }}
      </span>
    </div>

    <!-- Content -->
    <div :class="['p-5 flex-1 flex flex-col justify-between', featured ? 'md:w-1/2' : '']">
      <div class="space-y-2">
        <div class="flex items-center gap-3 text-xs text-slate-400">
          <span class="flex items-center gap-1">
            <Calendar class="w-3.5 h-3.5 text-slate-400" />
            <span>{{ news.date }}</span>
          </span>
          <span>·</span>
          <span>{{ news.source }}</span>
        </div>

        <h3 class="font-bold text-base text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-2">
          <router-link :to="'/news/' + news.id">
            {{ localized(news.title, news.titleKh) }}
          </router-link>
        </h3>

        <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
          {{ localized(news.description, news.descriptionKh) }}
        </p>
      </div>

      <!-- Action Row -->
      <div class="pt-4 mt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <span class="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
          <Newspaper class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ news.source }}</span>
        </span>

        <router-link
          :to="'/news/' + news.id"
          class="inline-flex items-center gap-1 text-xs font-bold text-[#0D47A1] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{{ t('news.readMore') }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>
    </div>
  </article>
</template>
