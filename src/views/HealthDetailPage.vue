<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Phone, MapPin, Clock, Navigation, CheckCircle, ArrowLeft, ShieldCheck } from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import Rating from '@/components/Rating.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitalById } from '@/services/dataService'

const route = useRoute()
const { t, localized } = useLanguage()

const hospital = computed(() => {
  const id = route.params.id as string
  return getHospitalById(id)
})

function getDirectionsUrl(hospital: { coordinates: { lat: number; lng: number }; address: string }) {
  if (hospital.coordinates) {
    return `https://www.google.com/maps/dir/?api=1&destination=${hospital.coordinates.lat},${hospital.coordinates.lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.address)}`
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div v-if="hospital" class="space-y-8">
      <!-- Breadcrumb -->
      <router-link
        to="/health"
        class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to {{ t('nav.health') }}</span>
      </router-link>

      <!-- Hospital Profile Hero Banner -->
      <div class="bg-gradient-to-br from-camlife-deep via-slate-800 to-camlife-navy text-white rounded-3xl p-6 sm:p-10 shadow-card-hover relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-camlife-action/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-bold rounded-full capitalize">
              {{ hospital.category }}
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-500/30">
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>Verified Medical Facility</span>
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {{ localized(hospital.name, hospital.nameKh) }}
          </h1>

          <div class="flex flex-wrap items-center gap-4 text-xs text-slate-200">
            <Rating :rating="hospital.rating" :reviews="hospital.reviews" show-count />
            <span>·</span>
            <div class="flex items-center space-x-1 text-slate-300">
              <MapPin class="w-3.5 h-3.5 text-camlife-action" />
              <span>{{ hospital.location }}</span>
            </div>
            <span>·</span>
            <div class="flex items-center space-x-1 text-emerald-400 font-semibold">
              <Clock class="w-3.5 h-3.5" />
              <span>{{ hospital.openingHours }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout: Info Grid & Action Card -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Info & Details -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Overview Description -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy">About Facility</h2>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ localized(hospital.description, hospital.descriptionKh) }}
            </p>
          </div>

          <!-- Services & Specialties -->
          <div v-if="hospital.services.length > 0" class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy">{{ t('health.services') }}</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="service in hospital.services"
                :key="service"
                class="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/60"
              >
                <CheckCircle class="w-4 h-4 text-camlife-action flex-shrink-0" />
                <span class="text-xs font-bold text-camlife-navy">{{ service }}</span>
              </div>
            </div>
          </div>

          <!-- Address & Location Card -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy">{{ t('common.address') }}</h2>
            <div class="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
              <MapPin class="w-5 h-5 text-camlife-action mt-0.5 flex-shrink-0" />
              <div>
                <p class="text-sm font-bold text-camlife-navy leading-snug">
                  {{ localized(hospital.address, hospital.addressKh) }}
                </p>
                <p class="text-xs text-camlife-muted mt-1">{{ hospital.location }}, Kingdom of Cambodia</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right 1 Col: Quick Actions Card (Sticky) -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle sticky top-24 space-y-6">
            <h3 class="font-extrabold text-camlife-navy text-base border-b border-slate-100 pb-3">Quick Actions</h3>

            <div class="space-y-3">
              <!-- Call Now -->
              <a
                :href="'tel:' + hospital.phone.replace(/\s/g, '')"
                class="flex items-center justify-center space-x-2 w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md transition-all hover:shadow-lg text-sm"
              >
                <Phone class="w-4 h-4" />
                <span>{{ t('health.callNow') }}</span>
              </a>

              <!-- Get Directions -->
              <a
                :href="getDirectionsUrl(hospital)"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center space-x-2 w-full py-3.5 bg-camlife-light hover:bg-camlife-action text-camlife-action hover:text-white font-extrabold rounded-2xl border border-camlife-action/20 transition-all text-xs"
              >
                <Navigation class="w-4 h-4" />
                <span>{{ t('health.getDirections') }}</span>
              </a>
            </div>

            <!-- Details Box -->
            <div class="pt-4 border-t border-slate-100 space-y-3 text-xs">
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400 font-medium">Direct Phone:</span>
                <a :href="'tel:' + hospital.phone.replace(/\s/g, '')" class="font-bold text-camlife-action hover:underline">
                  {{ hospital.phone }}
                </a>
              </div>
              <div class="flex justify-between items-center text-slate-600">
                <span class="text-slate-400 font-medium">Hours:</span>
                <span class="font-bold text-emerald-600">{{ hospital.openingHours }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NotFoundState v-else />
  </div>
</template>
