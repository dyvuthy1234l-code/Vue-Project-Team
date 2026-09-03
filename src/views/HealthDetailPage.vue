<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Phone,
  MapPin,
  Clock,
  Navigation,
  CheckCircle,
  ArrowLeft,
  ShieldCheck,
  ChevronRight,
  Star,
  Building2,
  Stethoscope,
  Activity,
  HeartPulse
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitalById, getHospitals } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, localized } = useLanguage()

const hospital = computed(() => {
  const id = route.params.id as string
  return getHospitalById(id)
})

usePageMeta({
  title: computed(() => hospital.value ? localized(hospital.value.name, hospital.value.nameKh) + ' — Healthcare CamLife' : 'Health Detail'),
  description: computed(() => hospital.value ? localized(hospital.value.description, hospital.value.descriptionKh) : '')
})

const relatedHospitals = computed(() => {
  if (!hospital.value) return []
  return getHospitals()
    .filter(h => h.id !== hospital.value?.id)
    .slice(0, 3)
})

function getDirectionsUrl(coords: { lat: number; lng: number } | undefined, address: string) {
  if (coords?.lat && coords?.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
}

const standardFacilities = [
  '24/7 Emergency Dispatch',
  'Intensive Care Unit (ICU)',
  'On-site Pharmacy',
  'Diagnostic Imaging & CT',
  'Laboratory & Blood Bank',
  'Patient Ambulance Fleet'
]
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    <div v-if="hospital" class="space-y-10">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
        <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.home') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <router-link to="/health" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.health') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <span class="text-slate-700 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
          {{ localized(hospital.name, hospital.nameKh) }}
        </span>
      </nav>

      <!-- Back Link -->
      <div>
        <router-link
          to="/health"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Healthcare Directory</span>
        </router-link>
      </div>

      <!-- Hero Section with Hospital Cover Image & Profile Overlay -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-card overflow-hidden">
        <!-- Large Hospital Cover Image -->
        <div class="relative aspect-[21/9] min-h-[260px] bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <LazyImage
            v-if="hospital.image"
            :src="hospital.image"
            :alt="localized(hospital.name, hospital.nameKh)"
            img-class="w-full h-full object-cover"
            class="w-full h-full"
          />
          <div v-else class="w-full h-full flex items-center justify-center bg-slate-900 text-white">
            <HeartPulse class="w-16 h-16 opacity-30" />
          </div>

          <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent pointer-events-none" />

          <!-- Overlaid Top Badges -->
          <div class="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/95 dark:bg-slate-900/95 text-[#0D47A1] dark:text-blue-300 uppercase tracking-wider shadow-sm">
              {{ hospital.category }}
            </span>

            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs font-bold shadow-sm backdrop-blur-xs">
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>Verified Facility</span>
            </span>
          </div>

          <!-- Overlaid Bottom Title on Image -->
          <div class="absolute bottom-5 left-5 right-5 text-white pointer-events-none">
            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {{ localized(hospital.name, hospital.nameKh) }}
            </h1>
            <p v-if="hospital.nameKh" class="text-base sm:text-lg font-khmer text-slate-200 mt-0.5">
              {{ hospital.nameKh }}
            </p>
          </div>
        </div>

        <!-- Information & Actions Bar -->
        <div class="p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700">
          <!-- Metadata: Rating, Location, Status -->
          <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-xs">
              <Star class="w-4 h-4 text-amber-400 fill-amber-400" />
              <span class="font-bold text-slate-900 dark:text-white">{{ hospital.rating.toFixed(1) }}</span>
              <span class="text-slate-400">({{ hospital.reviews }} reviews)</span>
            </div>

            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 shadow-xs">
              <MapPin class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span>{{ hospital.location }}</span>
            </div>

            <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <Clock class="w-4 h-4" />
              <span>{{ hospital.openingHours }}</span>
            </div>
          </div>

          <!-- Action Buttons: Call, Direction, Share -->
          <div class="flex flex-wrap items-center gap-3">
            <a
              :href="'tel:' + hospital.phone"
              class="px-5 py-2.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
            >
              <Phone class="w-4 h-4" />
              <span>Call: {{ hospital.phone }}</span>
            </a>

            <a
              :href="getDirectionsUrl(hospital.coordinates, hospital.address)"
              target="_blank"
              rel="noopener noreferrer"
              class="px-5 py-2.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-800 dark:text-white border border-slate-200 dark:border-slate-600 text-xs font-bold rounded-xl transition-colors flex items-center gap-2 shadow-xs"
            >
              <Navigation class="w-4 h-4 text-blue-600" />
              <span>Get Directions</span>
            </a>

            <ShareButtons :title="localized(hospital.name, hospital.nameKh)" />
          </div>
        </div>
      </div>

      <!-- Main Layout: 2 Columns (Details & Sidebar Info) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Overview, Services, Facilities -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Overview Description -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-sm space-y-3">
            <h2 class="text-lg font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
              <Building2 class="w-5 h-5 text-[#0D47A1] dark:text-blue-400" />
              <span>About Medical Facility</span>
            </h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {{ localized(hospital.description, hospital.descriptionKh) }}
            </p>
          </section>

          <!-- Services & Specialties -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
              <Stethoscope class="w-5 h-5 text-[#16A34A]" />
              <span>Services & Specialties</span>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="service in hospital.services"
                :key="service"
                class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50 text-xs font-bold text-slate-800 dark:text-white"
              >
                <CheckCircle class="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>{{ service }}</span>
              </div>
            </div>
          </section>

          <!-- Standard Hospital Facilities -->
          <section class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-[#0A2540] dark:text-white flex items-center gap-2">
              <Activity class="w-5 h-5 text-[#0D47A1] dark:text-blue-400" />
              <span>Facilities & Equipment</span>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="fac in standardFacilities"
                :key="fac"
                class="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/60 dark:border-slate-600/50 text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                <CheckCircle class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
                <span>{{ fac }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Right Col: Contact, Address, Map -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm space-y-5">
            <h3 class="text-base font-bold text-[#0A2540] dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              Location & Contact
            </h3>

            <div class="space-y-4 text-xs">
              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Address</span>
                <p class="font-bold text-slate-800 dark:text-white mt-1 leading-snug">
                  {{ localized(hospital.address, hospital.addressKh) }}
                </p>
                <p class="text-slate-400 mt-0.5">{{ hospital.location }}, Cambodia</p>
              </div>

              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Direct Phone</span>
                <a :href="'tel:' + hospital.phone" class="font-bold text-[#0D47A1] dark:text-blue-400 text-sm mt-1 inline-block hover:underline">
                  {{ hospital.phone }}
                </a>
              </div>

              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">Hours of Operation</span>
                <p class="font-bold text-emerald-600 mt-1">
                  {{ hospital.openingHours }}
                </p>
              </div>

              <div class="pt-2">
                <a
                  :href="getDirectionsUrl(hospital.coordinates, hospital.address)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Navigation class="w-4 h-4 text-blue-600" />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Healthcare Centers Section -->
      <section class="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
            Related Healthcare Facilities
          </h2>
          <router-link to="/health" class="text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline">
            View All →
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ServiceCard
            v-for="item in relatedHospitals"
            :key="item.id"
            :title="item.name"
            :title-kh="item.nameKh"
            :category="item.category"
            :rating="item.rating"
            :reviews="item.reviews"
            :location="item.location"
            :phone="item.phone"
            :description="item.description"
            :description-kh="item.descriptionKh"
            :opening-hours="item.openingHours"
            :image="item.image"
            :address="item.address"
            :coordinates="item.coordinates"
            :link-to="'/health/' + item.id"
          />
        </div>
      </section>
    </div>

    <!-- 404 Fallback -->
    <NotFoundState
      v-else
      message="Healthcare Facility Not Found"
      subtitle="The hospital or clinic you are looking for is not in our verified registry."
      back-link="/health"
      back-text="Back to Healthcare"
    />
  </div>
</template>
