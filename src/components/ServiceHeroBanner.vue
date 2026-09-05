<script setup lang="ts">
import { ChevronRight, Home, ShieldCheck, MapPin } from 'lucide-vue-next'
import LocationSelector from '@/components/LocationSelector.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useLocation } from '@/composables/useLocation'

withDefaults(
  defineProps<{
    title: string
    subtitle?: string
    badge?: string
    badgeKh?: string
    bannerImage?: string
    breadcrumbCurrent?: string
    showLocationSelector?: boolean
    statsText?: string
  }>(),
  {
    showLocationSelector: true,
    bannerImage: '/images/pillars/government.jpg'
  }
)

const { t, currentLanguage } = useLanguage()
const { selectedProvince } = useLocation()
</script>

<template>
  <div class="service-hero-banner-wrapper space-y-6 font-khmer">
    <!-- Main Hero Banner Card -->
    <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061838] via-[#0A2E6E] to-[#083c66] text-white shadow-xl shadow-blue-950/20 ring-1 ring-white/10 p-6 sm:p-8 md:p-10">
      
      <!-- Background Representative Image Layer with Overlay -->
      <div v-if="bannerImage" class="absolute inset-0 pointer-events-none overflow-hidden">
        <img
          :src="bannerImage"
          alt="Banner Illustration"
          class="w-full h-full object-cover opacity-20 filter contrast-125 scale-105"
        />
        <!-- Deep Royal Gradient Mask -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#061838]/95 via-[#0A2E6E]/85 to-[#061838]/90" />
      </div>

      <!-- Ambient Glow Orbs -->
      <div class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-400/15 blur-3xl" />
      <div class="pointer-events-none absolute right-1/3 -bottom-24 h-64 w-64 rounded-full bg-emerald-400/15 blur-3xl" />

      <!-- Top Row: Breadcrumb & 25 Provinces Selector -->
      <div class="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <!-- Breadcrumb -->
        <nav class="flex items-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
          <router-link to="/" class="inline-flex items-center gap-1.5 hover:text-white transition-colors">
            <Home class="w-3.5 h-3.5" />
            <span>{{ t('nav.home') }}</span>
          </router-link>
          <ChevronRight class="w-3.5 h-3.5 text-white/40" />
          <span class="text-white font-bold tracking-wide">
            {{ breadcrumbCurrent || title }}
          </span>
        </nav>

        <!-- 25 Provinces / Municipalities Selector -->
        <div v-if="showLocationSelector" class="flex items-center gap-2">
          <span class="hidden sm:inline text-xs text-blue-200/80 font-medium">
            {{ currentLanguage === 'kh' ? 'ទីតាំងរាជធានី-ខេត្ត:' : 'Active Location:' }}
          </span>
          <LocationSelector variant="banner" />
        </div>
      </div>

      <!-- Banner Body Content -->
      <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="max-w-3xl space-y-3.5">
          <!-- Official Civic Badge -->
          <div class="flex flex-wrap items-center gap-2">
            <div class="inline-flex items-center gap-2 rounded-full bg-blue-500/25 px-3.5 py-1.5 text-xs font-black text-blue-200 ring-1 ring-blue-400/30 backdrop-blur-md">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span class="inline-flex items-center gap-1.5"><Landmark class="w-3.5 h-3.5 text-[#D4AF37]" /> <span>ព្រះរាជាណាចក្រកម្ពុជា • {{ currentLanguage === 'kh' && badgeKh ? badgeKh : (badge || 'សេវាសាធារណៈផ្លូវការ') }}</span></span>
            </div>

            <div class="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold text-white/90 backdrop-blur-xs border border-white/10">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
              <span>{{ currentLanguage === 'kh' ? 'ទិន្នន័យផ្លូវការ និងផ្ទៀងផ្ទាត់' : '100% Verified Civic Data' }}</span>
            </div>
          </div>

          <!-- Main Title -->
          <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white font-khmer">
            {{ title }}
          </h1>

          <!-- Subtitle / Description -->
          <p v-if="subtitle" class="text-xs sm:text-sm text-slate-200 leading-relaxed font-khmer max-w-2xl">
            {{ subtitle }}
          </p>

          <!-- Active Location Helper Tag -->
          <div class="pt-1 flex items-center gap-2 text-xs text-blue-200">
            <MapPin class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>
              {{ currentLanguage === 'kh' ? 'កំពុងបង្ហាញសេវាកម្ម និងការិយាល័យក្នុង:' : 'Viewing services & offices in:' }}
              <strong class="text-white font-black underline decoration-emerald-400 decoration-2 underline-offset-4">
                {{ currentLanguage === 'kh' ? selectedProvince.nameKh : selectedProvince.name }} (២៥ រាជធានី-ខេត្ត)
              </strong>
            </span>
          </div>
        </div>

        <!-- Right Side Actions Slot (e.g. Compare button, emergency CTA, etc.) -->
        <div class="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
          <slot name="actions" />
        </div>
      </div>
    </section>

    <!-- Filter & Control Panel Slot -->
    <div v-if="$slots.controls">
      <slot name="controls" />
    </div>
  </div>
</template>
