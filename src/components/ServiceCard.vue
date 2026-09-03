<script setup lang="ts">
import { computed } from 'vue'
import { MapPin, Phone, Star, ArrowRight, Navigation } from 'lucide-vue-next'
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
</script>

<template>
  <div class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
    <div>
      <!-- Card Image Cover -->
      <div class="relative aspect-[16/10] bg-slate-100 dark:bg-slate-700 overflow-hidden">
        <LazyImage
          v-if="image"
          :src="image"
          :alt="localized(title, titleKh || title)"
          img-class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          class="w-full h-full"
        />
        <div
          v-else
          class="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100 dark:bg-slate-800 p-4"
        >
          <span class="text-xl font-black tracking-widest text-[#0D47A1]/30 dark:text-blue-400/30">CAMLIFE</span>
          <span class="text-xs font-semibold text-slate-400 mt-1 capitalize">{{ category || 'Service' }}</span>
        </div>

        <!-- Floating Badges Top Row -->
        <div class="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <!-- Category Badge -->
          <span
            v-if="category"
            class="px-2.5 py-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-[#0D47A1] dark:text-blue-400 text-[11px] font-bold rounded-lg uppercase tracking-wider shadow-xs"
          >
            {{ category }}
          </span>

          <!-- Rating Badge -->
          <div
            v-if="rating"
            class="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold shadow-xs"
          >
            <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{{ rating.toFixed(1) }}</span>
          </div>
        </div>

        <!-- Floating Opening Status Bottom Left -->
        <div class="absolute bottom-3 left-3 flex items-center gap-1.5 pointer-events-none">
          <span
            v-if="openingHours"
            class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 backdrop-blur-md shadow-xs"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{{ openingHours }}</span>
          </span>
        </div>
      </div>

      <!-- Content Area -->
      <div class="p-5 space-y-3">
        <!-- Title & Khmer Title -->
        <div>
          <h3 class="font-bold text-base text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
            <router-link v-if="linkTo" :to="linkTo">
              {{ localized(title, titleKh || title) }}
            </router-link>
            <span v-else>
              {{ localized(title, titleKh || title) }}
            </span>
          </h3>

          <p
            v-if="titleKh && currentLanguage !== 'kh'"
            class="text-xs font-khmer text-slate-400 dark:text-slate-500 truncate mt-0.5"
          >
            {{ titleKh }}
          </p>
        </div>

        <!-- Rating & Location Metadata Row -->
        <div class="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div v-if="location" class="flex items-center gap-1">
            <MapPin class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400 shrink-0" />
            <span class="truncate">{{ location }}</span>
          </div>
          <span v-if="location && reviews">·</span>
          <span v-if="reviews" class="text-slate-400">
            {{ reviews }} {{ t('health.reviews') }}
          </span>
        </div>

        <!-- Short Description -->
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
          {{ localized(description || '', descriptionKh || description || '') }}
        </p>
      </div>
    </div>

    <!-- Actions Row: Call, Direction, View Details -->
    <div class="p-5 pt-0 space-y-3">
      <div class="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <!-- Call Button -->
        <a
          v-if="phone"
          :href="'tel:' + phone"
          class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-600/80 transition-colors"
        >
          <Phone class="w-3.5 h-3.5 text-emerald-600" />
          <span>{{ t('health.callNow') }}</span>
        </a>
        <div v-else />

        <!-- Direction Button -->
        <a
          :href="directionsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 border border-slate-200/80 dark:border-slate-600/80 transition-colors"
        >
          <Navigation class="w-3.5 h-3.5 text-blue-600" />
          <span>{{ t('health.getDirections') }}</span>
        </a>
      </div>

      <!-- View Details Link -->
      <div v-if="linkTo" class="pt-1 flex items-center justify-end">
        <router-link
          :to="linkTo"
          class="inline-flex items-center gap-1 text-xs font-bold text-[#0D47A1] dark:text-blue-400 group-hover:translate-x-0.5 transition-transform"
        >
          <span>{{ t('common.viewDetails') }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>
      </div>
    </div>
  </div>
</template>
