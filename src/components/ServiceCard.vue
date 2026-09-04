<script setup lang="ts">
import { computed } from 'vue'
import {
  MapPin,
  Phone,
  Star,
  ArrowRight,
  Navigation,
  ShieldCheck,
  Hospital,
  Stethoscope,
  Pill
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import LazyImage from '@/components/LazyImage.vue'

const { t, currentLanguage, localized } = useLanguage()

const props = defineProps<{
  title: string
  titleKh?: string
  category?: string
  rating?: number
  reviews?: number
  location?: string
  locationKh?: string
  phone?: string
  description?: string
  descriptionKh?: string
  openingHours?: string
  image?: string
  linkTo?: string
  isEmergency?: boolean
  verified?: boolean
  address?: string
  addressKh?: string
  services?: string[]
  coordinates?: { lat: number; lng: number }
}>()

const directionsUrl = computed(() => {
  if (props.coordinates?.lat && props.coordinates?.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${props.coordinates.lat},${props.coordinates.lng}`
  }
  if (props.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.address)}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(props.title + ' ' + (props.location || 'Cambodia'))}`
})

const categoryTheme = computed(() => {
  const cat = props.category?.toLowerCase() || ''
  if (cat === 'hospital') {
    return {
      name: currentLanguage.value === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital',
      badgeBg: 'bg-blue-500/15 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300 ring-1 ring-blue-500/30',
      bannerGradient: 'from-[#0A2458] via-[#1456E5] to-[#1E3A8A]',
      icon: Hospital,
      iconColor: 'text-blue-400',
      accent: 'border-blue-200 dark:border-blue-900/60 hover:border-blue-400'
    }
  }
  if (cat === 'clinic') {
    return {
      name: currentLanguage.value === 'kh' ? 'គ្លីនិកឯកទេស' : 'Clinic',
      badgeBg: 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 ring-1 ring-emerald-500/30',
      bannerGradient: 'from-[#064E3B] via-[#059669] to-[#0D9488]',
      icon: Stethoscope,
      iconColor: 'text-emerald-300',
      accent: 'border-emerald-200 dark:border-emerald-900/60 hover:border-emerald-400'
    }
  }
  if (cat === 'pharmacy') {
    return {
      name: currentLanguage.value === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacy',
      badgeBg: 'bg-violet-500/15 text-violet-700 dark:bg-violet-950/70 dark:text-violet-300 ring-1 ring-violet-500/30',
      bannerGradient: 'from-[#4C1D95] via-[#7C3AED] to-[#9333EA]',
      icon: Pill,
      iconColor: 'text-violet-300',
      accent: 'border-violet-200 dark:border-violet-900/60 hover:border-violet-400'
    }
  }
  return {
    name: currentLanguage.value === 'kh' ? 'សេវាសុខភាព' : 'Healthcare',
    badgeBg: 'bg-blue-500/15 text-blue-700 dark:bg-blue-950/70 dark:text-blue-300',
    bannerGradient: 'from-[#0F172A] via-[#1E293B] to-[#334155]',
    icon: Hospital,
    iconColor: 'text-blue-400',
    accent: 'border-slate-200 dark:border-slate-700 hover:border-blue-400'
  }
})
</script>

<template>
  <div class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:border-slate-700/80 dark:bg-slate-800 dark:hover:border-blue-500/50">
    <div>
      <!-- Card Banner / Cover Image -->
      <div class="relative aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-700">
        <!-- Actual Image if exists -->
        <LazyImage
          v-if="image"
          :src="image"
          :alt="localized(title, titleKh || title)"
          img-class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          class="h-full w-full"
        />

        <!-- Custom Medical Banner if no image -->
        <div
          v-else
          :class="['relative flex h-full w-full flex-col justify-between bg-gradient-to-br p-4 text-white', categoryTheme.bannerGradient]"
        >
          <!-- Background decorative circles -->
          <div class="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full bg-white/10 blur-xl" />
          <div class="pointer-events-none absolute -bottom-6 left-1/3 h-24 w-24 rounded-full bg-black/10 blur-lg" />

          <!-- Center Icon & Logo Stamp -->
          <div class="relative z-10 flex h-full flex-col items-center justify-center text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md shadow-sm ring-1 ring-white/25 transition-transform duration-300 group-hover:scale-110">
              <component :is="categoryTheme.icon" :class="['h-6 w-6', categoryTheme.iconColor]" />
            </div>
            <p class="mt-2 text-xs font-black tracking-wider uppercase text-white/90">
              {{ categoryTheme.name }}
            </p>
          </div>
        </div>

        <!-- Floating Top Badges -->
        <div class="absolute inset-x-3 top-3 flex items-center justify-between gap-2 pointer-events-none">
          <!-- Category Pill -->
          <span :class="['rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-wider backdrop-blur-md shadow-xs', categoryTheme.badgeBg]">
            {{ categoryTheme.name }}
          </span>

          <!-- Rating Pill -->
          <div
            v-if="rating"
            class="flex items-center gap-1 rounded-full bg-slate-900/85 px-2.5 py-1 text-xs font-black text-white shadow-xs backdrop-blur-md"
          >
            <Star class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span>{{ rating.toFixed(1) }}</span>
          </div>
        </div>

        <!-- Floating Bottom Status Pill -->
        <div class="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            v-if="openingHours"
            class="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold text-slate-800 shadow-xs backdrop-blur-md dark:bg-slate-900/90 dark:text-slate-200"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{{ openingHours }}</span>
          </span>

          <span class="inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[9px] font-bold text-white shadow-xs backdrop-blur-md">
            <ShieldCheck class="h-3 w-3" />
            <span>{{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
          </span>
        </div>
      </div>

      <!-- Card Content Area -->
      <div class="p-4 sm:p-5 space-y-3">
        <!-- Title & Khmer Title -->
        <div>
          <h3 class="text-base sm:text-lg font-black text-[#0A2458] transition-colors group-hover:text-[#1456E5] dark:text-white dark:group-hover:text-blue-400 line-clamp-1 font-khmer">
            <router-link v-if="linkTo" :to="linkTo">
              {{ localized(title, titleKh || title) }}
            </router-link>
            <span v-else>
              {{ localized(title, titleKh || title) }}
            </span>
          </h3>

          <p
            v-if="titleKh && currentLanguage !== 'kh'"
            class="text-xs font-semibold text-slate-400 dark:text-slate-500 truncate mt-0.5 font-khmer"
          >
            {{ titleKh }}
          </p>
        </div>

        <!-- Location & Reviews Row -->
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div v-if="location" class="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <MapPin class="h-3.5 w-3.5 text-[#1456E5] dark:text-blue-400 shrink-0" />
            <span class="truncate">{{ location }}</span>
          </div>
          <span v-if="location && reviews" class="text-slate-300 dark:text-slate-600">·</span>
          <span v-if="reviews" class="text-[11px] text-slate-400">
            {{ reviews }} {{ t('health.reviews') }}
          </span>
        </div>

        <!-- Description -->
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 font-khmer min-h-[2.5rem]">
          {{ localized(description || '', descriptionKh || description || '') }}
        </p>

        <!-- Services Tags Preview -->
        <div v-if="services && services.length > 0" class="flex flex-wrap items-center gap-1.5 pt-1">
          <span
            v-for="srv in services.slice(0, 3)"
            :key="srv"
            class="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-700/70 dark:text-slate-300"
          >
            {{ srv }}
          </span>
          <span v-if="services.length > 3" class="text-[10px] font-bold text-slate-400">
            +{{ services.length - 3 }}
          </span>
        </div>
      </div>
    </div>

    <!-- Actions Row: Call, Direction, View Details -->
    <div class="p-4 sm:p-5 pt-0 space-y-3">
      <div class="grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 dark:border-slate-700/60">
        <!-- Call Button with Green Accent -->
        <a
          v-if="phone"
          :href="'tel:' + phone"
          class="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-extrabold text-slate-700 shadow-2xs transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:border-emerald-500 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-300 active:scale-95"
        >
          <div class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white shadow-2xs">
            <Phone class="h-2.5 w-2.5" />
          </div>
          <span>{{ t('health.callNow') }}</span>
        </a>
        <div v-else />

        <!-- Direction Button -->
        <a
          :href="directionsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/80 px-3 py-2 text-xs font-extrabold text-slate-700 shadow-2xs transition hover:border-blue-300 hover:bg-blue-50 hover:text-[#1456E5] dark:border-slate-700 dark:bg-slate-700/60 dark:text-slate-200 dark:hover:border-blue-500 dark:hover:bg-blue-950/40 dark:hover:text-blue-300 active:scale-95"
        >
          <Navigation class="h-3.5 w-3.5 text-[#1456E5] dark:text-blue-400" />
          <span>{{ t('health.getDirections') }}</span>
        </a>
      </div>

      <!-- View Details Link -->
      <div v-if="linkTo" class="flex items-center justify-between pt-0.5">
        <span class="text-[11px] font-semibold text-slate-400">
          {{ address ? (currentLanguage === 'kh' ? (addressKh || address) : address).slice(0, 32) + '...' : '' }}
        </span>
        <router-link
          :to="linkTo"
          class="inline-flex items-center gap-1 text-xs font-black text-[#1456E5] transition hover:text-[#0D47A1] dark:text-blue-400 dark:hover:text-blue-300 group-hover:translate-x-1"
        >
          <span>{{ t('common.viewDetails') }}</span>
          <ArrowRight class="h-3.5 w-3.5" />
        </router-link>
      </div>
    </div>
  </div>
</template>
