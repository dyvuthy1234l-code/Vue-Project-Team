<script setup lang="ts">
import { Heart, Shield, Users, Zap, CheckCircle2, ArrowRight } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t, tArray } = useLanguage()

const valueIcons = [
  { key: 'accessibility', icon: Heart, bg: 'bg-red-50 text-red-600' },
  { key: 'reliability', icon: Shield, bg: 'bg-blue-50 text-camlife-action' },
  { key: 'community', icon: Users, bg: 'bg-emerald-50 text-emerald-600' },
  { key: 'simplicity', icon: Zap, bg: 'bg-amber-50 text-amber-600' },
]

const exploreLinks = [
  { label: 'Healthcare Directory', path: '/health' },
  { label: 'Government Services', path: '/government' },
  { label: 'Job Opportunities', path: '/jobs' },
  { label: 'Home Repair Services', path: '/home-services' },
  { label: 'Transport & Transit', path: '/transport' },
  { label: 'Emergency Hotlines', path: '/emergency' },
  { label: 'News & Bulletins', path: '/news' },
  { label: 'Important Locations', path: '/locations' },
]
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
    <!-- Brand Story Hero -->
    <div class="bg-gradient-to-br from-camlife-deep via-slate-800 to-camlife-navy text-white rounded-3xl p-8 sm:p-12 shadow-card-hover relative overflow-hidden text-center sm:text-left">
      <div class="absolute -right-20 -top-20 w-80 h-80 bg-camlife-action/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="relative z-10 space-y-4 max-w-2xl">
        <div class="inline-flex items-center space-x-2 px-3.5 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-camlife-gold-light border border-white/10">
          <span>🇰🇭 {{ t('app.slogan') }}</span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-black tracking-tight">
          {{ t('about.title') }}
        </h1>

        <p class="text-sm sm:text-base text-slate-200 leading-relaxed font-khmer">
          {{ t('about.subtitle') }}
        </p>
      </div>
    </div>

    <!-- Mission -->
    <div class="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-subtle space-y-4">
      <h2 class="text-xl font-extrabold text-camlife-navy">{{ t('about.mission.title') }}</h2>
      <p class="text-sm text-slate-600 leading-relaxed max-w-3xl">
        {{ t('about.mission.description') }}
      </p>
    </div>

    <!-- Values Grid -->
    <div class="space-y-6">
      <h2 class="text-xl font-extrabold text-camlife-navy">{{ t('about.values.title') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div
          v-for="val in valueIcons"
          :key="val.key"
          class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle flex items-start space-x-4 hover:shadow-card-hover transition-all"
        >
          <div :class="['w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', val.bg]">
            <component :is="val.icon" class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h3 class="font-extrabold text-camlife-navy text-base">{{ t('about.values.' + val.key + '.title') }}</h3>
            <p class="text-xs text-slate-600 leading-relaxed">{{ t('about.values.' + val.key + '.description') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- What We Offer -->
    <div class="bg-slate-100/70 rounded-3xl border border-slate-200/80 p-8 space-y-6">
      <h2 class="text-xl font-extrabold text-camlife-navy">{{ t('about.features.title') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="(item, index) in tArray('about.features.items')"
          :key="index"
          class="flex items-center space-x-3 p-3.5 bg-white rounded-2xl border border-slate-200/60 shadow-subtle"
        >
          <CheckCircle2 class="w-4 h-4 text-camlife-action flex-shrink-0" />
          <span class="text-xs font-bold text-slate-700">{{ item }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Explore Portal -->
    <div class="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-subtle space-y-6">
      <h2 class="text-xl font-extrabold text-camlife-navy">Explore CamLife Platform</h2>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <router-link
          v-for="link in exploreLinks"
          :key="link.path"
          :to="link.path"
          class="group p-4 bg-slate-50 hover:bg-camlife-light rounded-2xl text-center transition-all border border-slate-200/60 flex flex-col items-center justify-center gap-2"
        >
          <span class="text-xs font-bold text-camlife-navy group-hover:text-camlife-action transition-colors">
            {{ link.label }}
          </span>
          <ArrowRight class="w-3.5 h-3.5 text-slate-400 group-hover:text-camlife-action group-hover:translate-x-1 transition-all" />
        </router-link>
      </div>
    </div>
  </div>
</template>
