<script setup lang="ts">
import { Search, Home, Briefcase, HeartPulse, Newspaper, ArrowLeft } from 'lucide-vue-next'
import GlobalSearch from '@/components/GlobalSearch.vue'
import { usePageMeta } from '@/composables/usePageMeta'

usePageMeta({
  title: '404 — Page Not Found · CamLife',
  description: 'The page you are looking for could not be found.'
})

const quickLinks = [
  { icon: Home, label: 'Home', path: '/', color: 'text-[#0D47A1] dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/60' },
  { icon: HeartPulse, label: 'Health', path: '/health', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/60' },
  { icon: Briefcase, label: 'Jobs', path: '/jobs', color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/60' },
  { icon: Newspaper, label: 'News', path: '/news', color: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950/60' },
]
</script>

<template>
  <div class="min-h-[70vh] flex items-center justify-center px-4 py-16">
    <div class="max-w-xl w-full text-center space-y-8">
      <!-- Animated 404 Display -->
      <div class="relative">
        <h1 class="text-[120px] sm:text-[160px] font-black text-slate-100 dark:text-slate-800 leading-none select-none">
          404
        </h1>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-20 bg-blue-50 dark:bg-blue-950/80 text-[#0D47A1] dark:text-blue-400 rounded-3xl flex items-center justify-center shadow-lg border border-blue-200/80 dark:border-blue-900">
            <Search class="w-10 h-10" />
          </div>
        </div>
      </div>

      <!-- Text -->
      <div class="space-y-2">
        <h2 class="text-2xl sm:text-3xl font-extrabold text-[#0A2540] dark:text-white">
          Page Not Found
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          The page or civic service you are looking for has moved or does not exist. Use the search bar below or explore quick links.
        </p>
      </div>

      <!-- Search -->
      <div class="max-w-md mx-auto">
        <GlobalSearch placeholder="Search CamLife services..." />
      </div>

      <!-- Quick Links -->
      <div class="flex flex-wrap justify-center gap-3 pt-2">
        <router-link
          v-for="link in quickLinks"
          :key="link.path"
          :to="link.path"
          class="group flex items-center gap-2.5 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl shadow-xs hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
        >
          <div :class="[link.bg, link.color, 'w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110']">
            <component :is="link.icon" class="w-4 h-4" />
          </div>
          <span class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors">
            {{ link.label }}
          </span>
        </router-link>
      </div>

      <!-- Back to home -->
      <div>
        <router-link
          to="/"
          class="inline-flex items-center gap-2 text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>Back to Home</span>
        </router-link>
      </div>
    </div>
  </div>
</template>
