<script setup lang="ts">
import { MapPin, Phone, Star, Clock, ArrowRight } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  title: string
  category?: string
  rating?: number
  reviews?: number
  location?: string
  phone?: string
  description?: string
  openingHours?: string
  image?: string
  linkTo?: string
}>()
</script>

<template>
  <div class="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
    <div>
      <!-- Header Banner / Image Placeholder -->
      <div class="relative h-44 bg-gradient-to-br from-camlife-deep via-camlife-action to-blue-700 overflow-hidden p-4 flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <span v-if="category" class="px-3 py-1 bg-white/90 backdrop-blur-md text-camlife-deep text-[11px] font-bold rounded-full uppercase tracking-wider shadow-sm capitalize">
            {{ category }}
          </span>
          <div v-if="rating" class="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/60 backdrop-blur-md text-white text-xs font-bold rounded-full">
            <Star class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{{ rating }}</span>
          </div>
        </div>

        <div class="flex items-center justify-center text-white/40 font-bold text-4xl tracking-widest opacity-20">
          CAMLIFE
        </div>
      </div>

      <div class="p-5 space-y-3">
        <!-- Title -->
        <h3 class="font-extrabold text-camlife-navy text-lg group-hover:text-camlife-action transition-colors leading-snug">
          {{ title }}
        </h3>

        <!-- Rating & reviews -->
        <div v-if="rating" class="flex items-center space-x-1 text-xs text-slate-500">
          <span class="font-bold text-slate-700">{{ rating }} / 5.0</span>
          <span v-if="reviews" class="text-slate-400">({{ reviews }} {{ t('health.reviews') }})</span>
        </div>

        <!-- Description -->
        <p v-if="description" class="text-xs text-slate-600 line-clamp-2 leading-relaxed">
          {{ description }}
        </p>

        <!-- Meta info -->
        <div class="space-y-1.5 pt-2 text-xs text-slate-500 border-t border-slate-100">
          <div v-if="location" class="flex items-center space-x-2">
            <MapPin class="w-3.5 h-3.5 text-camlife-action flex-shrink-0" />
            <span class="truncate">{{ location }}</span>
          </div>
          <div v-if="openingHours" class="flex items-center space-x-2">
            <Clock class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
            <span>{{ openingHours }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Actions -->
    <div class="p-5 pt-0 mt-auto">
      <div class="flex space-x-2">
        <router-link
          v-if="linkTo"
          :to="linkTo"
          class="flex-1 inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-camlife-light hover:bg-camlife-action text-camlife-action hover:text-white text-xs font-bold rounded-xl transition-all duration-200"
        >
          <span>{{ t('common.viewDetails') }}</span>
          <ArrowRight class="w-3.5 h-3.5" />
        </router-link>

        <a
          v-if="phone"
          :href="'tel:' + phone.replace(/\s/g, '')"
          class="inline-flex items-center justify-center p-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white border border-emerald-200 rounded-xl transition-all duration-200"
          :title="'Call ' + phone"
        >
          <Phone class="w-4 h-4" />
        </a>
      </div>
    </div>
  </div>
</template>
