<script setup lang="ts">
import { Calendar, Newspaper, ArrowRight } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import type { NewsItem } from '@/types'

const { t, localized } = useLanguage()

defineProps<{
  news: NewsItem
  featured?: boolean
}>()
</script>

<template>
  <div :class="[
    'group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between',
    featured ? 'md:col-span-2 md:flex-row' : ''
  ]">
    <!-- Header Banner / Image Cover -->
    <div :class="[
      'relative bg-gradient-to-br from-camlife-deep via-slate-800 to-camlife-navy p-5 flex flex-col justify-between overflow-hidden',
      featured ? 'md:w-1/2 h-56 md:h-auto' : 'h-44'
    ]">
      <div class="flex justify-between items-start z-10">
        <span class="px-3 py-1 bg-white/90 backdrop-blur-md text-camlife-deep text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm">
          {{ news.category }}
        </span>
        <span class="text-[11px] px-2.5 py-1 bg-slate-900/60 backdrop-blur-md text-slate-200 rounded-full font-medium">
          {{ news.source }}
        </span>
      </div>

      <div class="z-10 mt-auto">
        <div class="flex items-center space-x-1.5 text-xs text-slate-300 font-medium">
          <Calendar class="w-3.5 h-3.5" />
          <span>{{ news.date }}</span>
        </div>
      </div>

      <div class="absolute -right-6 -bottom-6 text-white/5 font-black text-8xl pointer-events-none select-none">
        NEWS
      </div>
    </div>

    <!-- Content -->
    <div :class="['p-5 flex-1 flex flex-col justify-between', featured ? 'md:w-1/2' : '']">
      <div>
        <h3 class="font-extrabold text-camlife-navy text-base group-hover:text-camlife-action transition-colors leading-snug mb-2 line-clamp-2">
          {{ localized(news.title, news.titleKh) }}
        </h3>
        <p class="text-xs text-slate-600 leading-relaxed line-clamp-3 mb-4">
          {{ localized(news.description, news.descriptionKh) }}
        </p>
      </div>

      <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span class="text-[11px] text-slate-400 font-medium flex items-center gap-1">
          <Newspaper class="w-3.5 h-3.5 text-camlife-action" />
          <span>{{ news.source }}</span>
        </span>
        <span class="inline-flex items-center space-x-1 text-xs font-bold text-camlife-action group-hover:translate-x-1 transition-transform">
          <span>{{ t('news.readMore') }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </span>
      </div>
    </div>
  </div>
</template>
