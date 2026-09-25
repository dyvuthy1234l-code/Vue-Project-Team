<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  MapPin,
  Phone,
  PhoneCall,
  Navigation,
  ArrowLeft,
  Clock,
  Building,
  Hospital,
  ShieldAlert,
  Bus,
  Share2,
  Copy,
  Check,
  CheckCircle2,
  ShieldCheck,
  ExternalLink,
  Map as MapIcon
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import LazyImage from '@/components/LazyImage.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import type { LocationItem } from '@/types'
import { useLanguage } from '@/composables/useLanguage'
import { getLocationById, getLocations } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const router = useRouter()
const { localized, currentLanguage } = useLanguage()

const copiedPhone = ref(false)

const location = computed(() => {
  const id = route.params.id as string
  return getLocationById(id)
})

const defaultCategoryImages: Record<string, string> = {
  'Hospital': '/images/locations/calmette-hospital.jpg',
  'Police Station': 'https://upload.wikimedia.org/wikipedia/commons/1/10/Tourist_police_Cambodia.jpg',
  'Government/OWSO': 'https://upload.wikimedia.org/wikipedia/commons/b/b2/Phnom_Penh_City_hall.JPG',
  'Bus Station': 'https://upload.wikimedia.org/wikipedia/commons/d/da/Buses_lined_up_near_Phnom_Penh_BRT_Night_Market_terminus_station_on_Sisowath_Quay.jpg',
  'Tourist Attraction': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Royal_Palace%2C_Phnom_Penh_Cambodia_1.jpg'
}

function getLocationImage(loc: LocationItem): string {
  return loc.image || defaultCategoryImages[loc.category] || defaultCategoryImages['Government/OWSO']
}

usePageMeta({
  title: computed(() =>
    location.value
      ? localized(location.value.name, location.value.nameKh) + ' — CamLife Civic Offices'
      : 'Location Detail'
  ),
  description: computed(() =>
    location.value ? localized(location.value.description, location.value.descriptionKh) : ''
  )
})

// Related locations — same category, excluding current
const relatedLocations = computed(() => {
  if (!location.value) return []
  return getLocations()
    .filter(l => l.category === location.value!.category && l.id !== location.value!.id)
    .slice(0, 3)
})

function getDirectionsUrl(loc: LocationItem) {
  return `https://www.google.com/maps/dir/?api=1&destination=${loc.coordinates.lat},${loc.coordinates.lng}`
}

function getGoogleMapsUrl(loc: LocationItem) {
  return `https://www.google.com/maps/search/?api=1&query=${loc.coordinates.lat},${loc.coordinates.lng}`
}

function getMapsEmbedUrl(loc: LocationItem) {
  return `https://maps.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&z=16&output=embed`
}

function copyPhone() {
  if (!location.value) return
  navigator.clipboard?.writeText(location.value.phone).then(() => {
    copiedPhone.value = true
    setTimeout(() => { copiedPhone.value = false }, 2000)
  })
}

// Category icon component
function getCategoryIcon(cat: string) {
  if (cat === 'Hospital') return Hospital
  if (cat === 'Police Station') return ShieldAlert
  if (cat === 'Bus Station') return Bus
  return Building
}

// Opening hours based on category
function getOpeningHours(cat: string) {
  if (cat === 'Hospital') return currentLanguage.value === 'kh' ? 'ម៉ោង ២៤/៧ — បើកជានិច្ច' : '24/7 — Always Open'
  if (cat === 'Police Station') return currentLanguage.value === 'kh' ? 'ម៉ោង ២៤/៧ — បើកជានិច្ច' : '24/7 — Always Open'
  if (cat === 'Bus Station') return currentLanguage.value === 'kh' ? '5:00 ព្រឹក – 10:00 យប់' : '5:00 AM – 10:00 PM'
  return currentLanguage.value === 'kh'
    ? 'ច័ន្ទ – សុក្រ: 8:00 ព្រឹក – 5:00 ល្ងាច'
    : 'Mon – Fri: 8:00 AM – 5:00 PM'
}

// Services available by category
function getCategoryServices(cat: string): string[] {
  if (currentLanguage.value === 'kh') {
    if (cat === 'Government/OWSO') return [
      'ការចុះបញ្ជីអត្រានុកូលដ្ឋាន (សំបុត្រកំណើត/អាពាហ៍ពិពាហ៍)',
      'សៀវភៅស្នាក់នៅ & គ្រួសារ',
      'លិខិតអនុញ្ញាតអាជីវកម្មខ្នាតតូច',
      'លិខិតអនុញ្ញាតសាងសង់',
      'ការបញ្ជាក់ឯកសារតាមផ្លូវច្បាប់',
      'ការចុះឈ្មោះបោះឆ្នោត'
    ]
    if (cat === 'Hospital') return [
      'ការព្យាបាលជំងឺទូទៅ ២៤/៧',
      'ការព្យាបាលបន្ទាន់ & ដែល ICU',
      'ការឆ្លងកាត់ & ណែនាំ',
      'ការប្រើប​ណ្ណ ប.ស.ស (NSSF)',
      'ការពិគ្រោះជំងឺឯកទេស',
      'ការ X-Ray & Lab'
    ]
    if (cat === 'Police Station') return [
      'ការស៊ើបអង្កេតអំពើឧក្រិដ្ឋ',
      'ការប្តឹងផ្ដល់រឿងក្ដី',
      'ការបញ្ចេញប្រព័ន្ធពត្ត​មានយានដ្ឋាន',
      'ឯកសារបញ្ជាក់ប្រវត្តិ',
      'ការដោះស្រាយជម្លោះសង្គម',
      'ការសង្គ្រោះបន្ទាន់ ២៤/៧'
    ]
    if (cat === 'Bus Station') return [
      'ការលក់សំបុត្ររថយន្តក្រុង',
      'ឃ្លាំងទុកចំណីអំណោយ',
      'ព​ត​៌​មានស្ថានីយ & ផ្លូវវិញ',
      'សេវារថយន្តខ្ចី',
      'ការបញ្ជូនអ្នកដំណើរ',
      'ចត:ចូលចេញ ​​​​​​ & ​​​​​ Package'
    ]
  } else {
    if (cat === 'Government/OWSO') return [
      'Civil Registration (Birth / Marriage Certificates)',
      'Family Books & Residence Certificates',
      'Small Business License Registration',
      'Building Construction Permits',
      'Document Legalization & Notary',
      'Voter Registration Services'
    ]
    if (cat === 'Hospital') return [
      '24/7 General & Emergency Medicine',
      'ICU & Trauma Care',
      'Specialist Referral System',
      'NSSF Health Card Coverage',
      'Specialist Consultations',
      'Laboratory & Radiology (X-Ray)'
    ]
    if (cat === 'Police Station') return [
      'Criminal Investigation Services',
      'Filing Police Reports',
      'Vehicle & Traffic Records',
      'Criminal Background Certificates',
      'Community Dispute Resolution',
      '24/7 Emergency Response'
    ]
    if (cat === 'Bus Station') return [
      'Bus Ticket Sales & Booking',
      'Luggage Storage',
      'Route & Schedule Information',
      'Car Rental Desk',
      'Passenger Transit Services',
      'Parcel & Package Delivery'
    ]
  }
  return []
}
</script>

<template>
  <div class="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-10 font-khmer">

    <!-- Not Found -->
    <div v-if="!location" class="py-24 flex justify-center">
      <NotFoundState
        message="Location Not Found"
        subtitle="The requested location may have been removed or the ID is incorrect."
        back-text="Back to Locations"
        back-link="/locations"
      />
    </div>

    <template v-else>
      <!-- Back Button -->
      <div class="mb-4 sm:mb-6">
        <button
          @click="router.back()"
          type="button"
          class="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅបញ្ជីទីតាំង' : 'Back to Locations' }}</span>
        </button>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">

        <!-- ===== LEFT: MAIN CONTENT ===== -->
        <div class="lg:col-span-8 space-y-5 sm:space-y-6">

          <!-- Hero Image + Category Badge -->
          <div class="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg h-52 sm:h-80">
            <LazyImage
              :src="getLocationImage(location)"
              :alt="localized(location.name, location.nameKh)"
              img-class="w-full h-52 sm:h-80 object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

            <!-- Category + Open Badge overlay -->
            <div class="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 flex items-center justify-between">
              <span class="px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black uppercase bg-white/95 dark:bg-slate-900/90 text-[#0A2540] dark:text-white shadow border border-white/20 backdrop-blur-md flex items-center gap-1.5">
                <component :is="getCategoryIcon(location.category)" class="w-3.5 h-3.5 text-blue-600" />
                {{ location.category }}
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow">
                <CheckCircle2 class="w-3 h-3" />
                {{ currentLanguage === 'kh' ? 'បើក' : 'Open Today' }}
              </span>
            </div>

            <!-- Title at bottom of image -->
            <div class="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <h1 class="text-lg sm:text-2xl font-black text-white leading-tight drop-shadow-lg">
                {{ localized(location.name, location.nameKh) }}
              </h1>
            </div>
          </div>

          <!-- Description Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-7 shadow-sm space-y-3">
            <div class="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              <ShieldCheck class="w-4 h-4 text-emerald-500" />
              <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានទូទៅ' : 'About This Location' }}</span>
              <VerificationBadge compact class="ml-auto" />
            </div>
            <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {{ localized(location.description, location.descriptionKh) }}
            </p>
          </div>

          <!-- Services Available -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-7 shadow-sm">
            <div class="flex items-center gap-2 mb-4">
              <CheckCircle2 class="w-5 h-5 text-emerald-500 shrink-0" />
              <h2 class="text-sm sm:text-base font-black text-[#0A2540] dark:text-white">
                {{ currentLanguage === 'kh' ? 'សេវាកម្មផ្តល់ជូន' : 'Available Services' }}
              </h2>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div
                v-for="(svc, idx) in getCategoryServices(location.category)"
                :key="idx"
                class="flex items-start gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-800/40"
              >
                <CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">{{ svc }}</span>
              </div>
            </div>
          </div>

          <!-- Google Map Embed -->
          <div class="bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-700 overflow-hidden shadow-sm">
            <div class="flex items-center gap-2 px-4 py-3 bg-slate-800 border-b border-slate-700">
              <MapIcon class="w-4 h-4 text-blue-400 shrink-0" />
              <span class="text-xs font-bold text-slate-200">
                {{ currentLanguage === 'kh' ? 'ផែនទីទីតាំង Google Maps' : 'Google Maps Location' }}
              </span>
              <a
                :href="getGoogleMapsUrl(location)"
                target="_blank"
                rel="noopener noreferrer"
                class="ml-auto text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
              >
                <ExternalLink class="w-3 h-3" />
                {{ currentLanguage === 'kh' ? 'បើក Google Maps' : 'Open in Maps' }}
              </a>
            </div>
            <div class="h-72 sm:h-96">
              <iframe
                :src="getMapsEmbedUrl(location)"
                class="w-full h-full border-0"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <!-- Share Buttons -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-6 shadow-sm">
            <div class="flex items-center gap-2 mb-3">
              <Share2 class="w-4 h-4 text-slate-400" />
              <span class="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {{ currentLanguage === 'kh' ? 'ចែករំលែកទីតាំងនេះ' : 'Share This Location' }}
              </span>
            </div>
            <ShareButtons :title="localized(location.name, location.nameKh)" />
          </div>
        </div>

        <!-- ===== RIGHT: SIDEBAR ===== -->
        <div class="lg:col-span-4 space-y-4 sm:space-y-5 sticky top-6">

          <!-- Contact Info Card -->
          <div class="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-4">
            <h3 class="text-sm font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានទំនាក់ទំនង' : 'Contact Information' }}
            </h3>

            <!-- Phone -->
            <div class="space-y-1.5">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Phone class="w-3 h-3" />
                {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number' }}
              </div>
              <div class="flex items-center gap-2">
                <span class="text-sm font-black text-[#0D47A1] dark:text-blue-400">{{ location.phone }}</span>
                <button
                  @click="copyPhone"
                  type="button"
                  class="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-slate-600 text-slate-500 hover:text-[#0D47A1] transition-all cursor-pointer"
                  :title="currentLanguage === 'kh' ? 'ចម្លង' : 'Copy'"
                >
                  <Check v-if="copiedPhone" class="w-3.5 h-3.5 text-emerald-500" />
                  <Copy v-else class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Address -->
            <div class="space-y-1.5">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <MapPin class="w-3 h-3 text-red-500" />
                {{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន' : 'Address' }}
              </div>
              <p class="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                {{ localized(location.address, location.addressKh) }}
              </p>
            </div>

            <!-- Hours -->
            <div class="space-y-1.5">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock class="w-3 h-3 text-blue-600" />
                {{ currentLanguage === 'kh' ? 'ម៉ោងបំពេញការ' : 'Operating Hours' }}
              </div>
              <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                {{ getOpeningHours(location.category) }}
              </p>
            </div>

            <!-- Action Buttons -->
            <div class="pt-2 space-y-2">
              <a
                :href="'tel:' + location.phone"
                class="w-full py-2.5 px-4 rounded-xl bg-[#0D47A1] hover:bg-blue-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md"
              >
                <PhoneCall class="w-4 h-4" />
                {{ currentLanguage === 'kh' ? 'ហៅទូរស័ព្ទ' : 'Call Now' }}
              </a>
              <a
                :href="getDirectionsUrl(location)"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-2.5 px-4 rounded-xl border border-[#0D47A1] text-[#0D47A1] dark:text-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-xs font-black flex items-center justify-center gap-2 transition-all"
              >
                <Navigation class="w-4 h-4" />
                {{ currentLanguage === 'kh' ? 'ផ្លូវទៅទីតាំង' : 'Get Directions' }}
              </a>
            </div>
          </div>

          <!-- Coordinates Card -->
          <div class="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-4 space-y-2">
            <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {{ currentLanguage === 'kh' ? '좌표 GPS' : 'GPS Coordinates' }}
            </div>
            <div class="font-mono text-xs text-slate-600 dark:text-slate-400 space-y-0.5">
              <div>Lat: <span class="font-bold text-slate-800 dark:text-slate-200">{{ location.coordinates.lat }}</span></div>
              <div>Lng: <span class="font-bold text-slate-800 dark:text-slate-200">{{ location.coordinates.lng }}</span></div>
            </div>
          </div>

          <!-- Related Locations -->
          <div v-if="relatedLocations.length > 0" class="bg-white dark:bg-slate-800 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-700 p-4 sm:p-5 shadow-sm">
            <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">
              {{ currentLanguage === 'kh' ? 'ទីតាំងផ្សេងទៀត' : 'Other Similar Locations' }}
            </h3>
            <div class="space-y-3">
              <router-link
                v-for="rel in relatedLocations"
                :key="rel.id"
                :to="'/locations/' + rel.id"
                class="flex items-start gap-3 group hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl p-2 -mx-2 transition-colors"
              >
                <div class="w-14 h-12 rounded-xl overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-700">
                  <LazyImage
                    :src="getLocationImage(rel)"
                    :alt="localized(rel.name, rel.nameKh)"
                    img-class="w-14 h-12 object-cover"
                  />
                </div>
                <div class="min-w-0">
                  <p class="text-xs font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 line-clamp-2 leading-tight transition-colors">
                    {{ localized(rel.name, rel.nameKh) }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin class="w-2.5 h-2.5 text-red-400 shrink-0" />
                    <span class="truncate">{{ rel.address.split(',').slice(-2).join(',').trim() }}</span>
                  </p>
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
