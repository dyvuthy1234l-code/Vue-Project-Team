<script setup lang="ts">
import {
  Heart,
  Shield,
  Users,
  Zap,
  ArrowRight,
  ChevronRight,
  Sparkles
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'

const { t } = useLanguage()

usePageMeta({
  title: 'About CamLife — For a Better Cambodia',
  description: 'Our mission to simplify access to public services, jobs, and essential daily information for every Cambodian.'
})

const valueIcons = [
  { key: 'accessibility', icon: Heart, bg: 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400' },
  { key: 'reliability', icon: Shield, bg: 'bg-blue-50 text-[#0D47A1] dark:bg-blue-950/50 dark:text-blue-400' },
  { key: 'community', icon: Users, bg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' },
  { key: 'simplicity', icon: Zap, bg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400' }
]

const exploreLinks = [
  { label: 'Healthcare Directory', labelKh: 'មន្ទីរពេទ្យ និងគ្លីនិក', path: '/health' },
  { label: 'Government Services', labelKh: 'សេវារដ្ឋបាលសាធារណៈ', path: '/government' },
  { label: 'Job Opportunities', labelKh: 'ឱកាសការងារ', path: '/jobs' },
  { label: 'Home Repair Services', labelKh: 'សេវាកម្មគេហដ្ឋាន', path: '/home-services' },
  { label: 'Transport & Transit', labelKh: 'ការធ្វើដំណើរ', path: '/transport' },
  { label: 'Emergency Hotlines', labelKh: 'សេវាសង្គ្រោះបន្ទាន់', path: '/emergency' }
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        {{ t('nav.home') }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.about') }}</span>
    </nav>

    <!-- Brand Story Hero Banner -->
    <div class="bg-gradient-to-br from-[#0A2540] via-slate-900 to-[#0D47A1] text-white rounded-3xl p-8 sm:p-12 shadow-card relative overflow-hidden">
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div class="relative z-10 space-y-4 max-w-2xl">
        <div class="inline-flex items-center gap-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-blue-200 border border-white/10">
          <span class="inline-flex items-center gap-1.5"><Landmark class="w-3.5 h-3.5 text-[#D4AF37]" /> <span>{{ t('app.slogan') }}</span></span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-black tracking-tight leading-[1.15]">
          {{ t('about.title') }}
        </h1>

        <p class="text-sm sm:text-base text-slate-300 leading-relaxed font-khmer">
          {{ t('about.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Mission & Vision -->
    <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 sm:p-10 shadow-sm space-y-4">
      <div class="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0D47A1] dark:text-blue-400">
        <Sparkles class="w-4 h-4" />
        <span>Our Mission</span>
      </div>
      <h2 class="text-2xl font-bold text-[#0A2540] dark:text-white">
        {{ t('about.mission.title') }}
      </h2>
      <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
        {{ t('about.mission.description') }}
      </p>
    </section>

    <!-- Values Grid -->
    <section class="space-y-6">
      <div class="text-center sm:text-left">
        <span class="text-xs font-bold uppercase tracking-wider text-[#0D47A1] dark:text-blue-400">
          Guiding Principles
        </span>
        <h2 class="text-2xl font-bold text-[#0A2540] dark:text-white tracking-tight mt-1">
          {{ t('about.values.title') }}
        </h2>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="val in valueIcons"
          :key="val.key"
          class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm flex items-start gap-4 hover:shadow-card-hover transition-all"
        >
          <div :class="['w-12 h-12 rounded-xl flex items-center justify-center shrink-0', val.bg]">
            <component :is="val.icon" class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h3 class="font-bold text-[#0A2540] dark:text-white text-base">
              {{ t('about.values.' + val.key + '.title') }}
            </h3>
            <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ t('about.values.' + val.key + '.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Explore Services Directory -->
    <section class="bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-10 space-y-6">
      <div>
        <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
          Explore CamLife Public Services
        </h2>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Access the full suite of Cambodian public and daily services.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <router-link
          v-for="link in exploreLinks"
          :key="link.path"
          :to="link.path"
          class="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:border-[#0D47A1] dark:hover:border-blue-400 shadow-xs flex items-center justify-between group transition-all"
        >
          <div>
            <span class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 block transition-colors">
              {{ link.label }}
            </span>
            <span class="text-[10px] font-khmer text-slate-400 block mt-0.5">
              {{ link.labelKh }}
            </span>
          </div>
          <ArrowRight class="w-4 h-4 text-slate-400 group-hover:text-[#0D47A1] group-hover:translate-x-1 transition-all" />
        </router-link>
      </div>
    </section>
  </div>
</template>
