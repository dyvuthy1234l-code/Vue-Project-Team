<script setup lang="ts">
import { Calendar, Newspaper, ArrowRight, Eye, Clock, ShieldCheck } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import LazyImage from '@/components/LazyImage.vue'
import type { NewsItem } from '@/types'

const { localized, currentLanguage } = useLanguage()

defineProps<{
  news: NewsItem
  featured?: boolean
  compact?: boolean
}>()
</script>

<template>
  <article
    :class="[
      'group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between font-khmer',
      featured ? 'md:col-span-2 md:flex-row' : '',
      compact ? 'p-3 flex-row gap-3 items-center' : ''
    ]"
  >
    <!-- Compact layout mode -->
    <template v-if="compact">
      <div class="relative w-24 h-20 rounded-xl overflow-hidden shrink-0 bg-slate-100">
        <LazyImage
          v-if="news.image"
          :src="news.image"
          :alt="localized(news.title, news.titleKh)"
          img-class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          class="w-full h-full"
        />
        <span class="absolute top-1 left-1 px-1.5 py-0.5 bg-slate-900/80 text-white text-[9px] font-black uppercase rounded">
          {{ news.category }}
        </span>
      </div>
      <div class="flex-1 min-w-0 space-y-1">
        <div class="flex items-center gap-2 text-[10px] text-slate-400">
          <span class="font-bold text-[#0D47A1] truncate">{{ news.source }}</span>
          <span>·</span>
          <span>{{ news.date }}</span>
        </div>
        <h4 class="font-bold text-xs text-[#0A2540] group-hover:text-[#0D47A1] transition-colors leading-snug line-clamp-2">
          <router-link :to="'/news/' + news.id">
            {{ localized(news.title, news.titleKh) }}
          </router-link>
        </h4>
      </div>
    </template>

    <!-- Standard & Featured Card Mode -->
    <template v-else>
      <!-- Cover Image -->
      <div
        :class="[
          'relative overflow-hidden bg-slate-100',
          featured ? 'md:w-1/2 aspect-[16/10] md:aspect-auto min-h-[14rem]' : 'aspect-[16/10]'
        ]"
      >
        <LazyImage
          v-if="news.image"
          :src="news.image"
          :alt="localized(news.title, news.titleKh)"
          img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          class="w-full h-full"
        />
        <div v-else class="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
          <Newspaper class="w-10 h-10 opacity-40" />
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

        <!-- Category & Badges Overlay -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span class="px-2.5 py-1 bg-white/95 backdrop-blur-md text-[#0D47A1] text-[10px] font-black rounded-lg uppercase tracking-wider shadow-xs">
            {{ news.category }}
          </span>

          <span v-if="news.breaking" class="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-black rounded-full uppercase flex items-center gap-1 shadow-xs animate-pulse">
            <span>●</span>
            <span>{{ currentLanguage === 'kh' ? 'ទាន់ហេតុការណ៍' : 'Breaking' }}</span>
          </span>
          <span v-else class="px-2 py-0.5 bg-slate-900/70 text-white text-[10px] font-bold rounded-lg backdrop-blur-xs flex items-center gap-1">
            <ShieldCheck class="w-3 h-3 text-emerald-400" />
            <span>Verified</span>
          </span>
        </div>

        <!-- Floating Footer info on image -->
        <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[10px] font-bold">
          <span class="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
            <Clock class="w-3 h-3 text-amber-400" />
            <span>{{ news.readTime || '3 នាទី' }}</span>
          </span>

          <span v-if="news.views" class="flex items-center gap-1 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
            <Eye class="w-3 h-3 text-blue-300" />
            <span>{{ Number(news.views).toLocaleString() }} មើល</span>
          </span>
        </div>
      </div>

      <!-- Content -->
      <div :class="['p-5 flex-1 flex flex-col justify-between', featured ? 'md:w-1/2' : '']">
        <div class="space-y-2.5">
          <div class="flex items-center justify-between text-[11px] text-slate-400">
            <span class="flex items-center gap-1 font-bold text-[#0D47A1]">
              <Newspaper class="w-3.5 h-3.5" />
              <span>{{ news.source }}</span>
            </span>
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5" />
              <span>{{ news.date }}</span>
            </span>
          </div>

          <h3 class="font-black text-base text-[#0A2540] group-hover:text-[#0D47A1] transition-colors leading-snug line-clamp-2">
            <router-link :to="'/news/' + news.id">
              {{ localized(news.title, news.titleKh) }}
            </router-link>
          </h3>

          <p class="text-xs text-slate-500 leading-relaxed line-clamp-2">
            {{ localized(news.description, news.descriptionKh) }}
          </p>
        </div>

        <!-- Action Row -->
        <div class="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div v-if="news.author" class="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
            <div class="w-5 h-5 rounded-full bg-blue-100 text-[#0D47A1] flex items-center justify-center text-[10px] font-bold">
              {{ news.author.slice(0, 1) }}
            </div>
            <span class="truncate max-w-[110px]">{{ news.author }}</span>
          </div>
          <span v-else class="text-[11px] text-slate-400">{{ news.source }}</span>

          <router-link
            :to="'/news/' + news.id"
            class="inline-flex items-center gap-1 text-xs font-black text-[#0D47A1] group-hover:translate-x-1 transition-transform"
          >
            <span>{{ currentLanguage === 'kh' ? 'អានលម្អិត' : 'Read Article' }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </template>
  </article>
</template>
