<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  PhoneCall,
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
  HeartPulse,
  Hospital as HospitalIcon,
  Copy,
  Check,
  Ambulance,
  Sparkles,
  FileText,
  BadgeCheck,
  Zap
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitalById, getHospitals } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, currentLanguage, localized } = useLanguage()

const copiedPhone = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

const hospital = computed(() => {
  const id = route.params.id as string
  return getHospitalById(id)
})

usePageMeta({
  title: computed(() => hospital.value ? localized(hospital.value.name, hospital.value.nameKh) + ' — CamLife Healthcare' : 'Health Detail'),
  description: computed(() => hospital.value ? localized(hospital.value.description, hospital.value.descriptionKh) : '')
})

const relatedHospitals = computed(() => {
  if (!hospital.value) return []
  return getHospitals()
    .filter(h => h.id !== hospital.value?.id && (h.category === hospital.value?.category || h.location === hospital.value?.location))
    .slice(0, 3)
})

const mapEmbedUrl = computed(() => {
  if (hospital.value?.coordinates?.lat && hospital.value?.coordinates?.lng) {
    return `https://www.google.com/maps?q=${hospital.value.coordinates.lat},${hospital.value.coordinates.lng}&z=15&output=embed`
  }
  return `https://www.google.com/maps?q=Phnom+Penh+Cambodia&z=13&output=embed`
})

const directionsUrl = computed(() => {
  if (hospital.value?.coordinates?.lat && hospital.value?.coordinates?.lng) {
    return `https://www.google.com/maps/dir/?api=1&destination=${hospital.value.coordinates.lat},${hospital.value.coordinates.lng}`
  }
  if (hospital.value?.address) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.value.address)}`
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.value?.name || 'Hospital')}`
})

function copyPhone(phone: string) {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(phone).then(() => {
      copiedPhone.value = true
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copiedPhone.value = false
      }, 2500)
    })
  } else {
    copiedPhone.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedPhone.value = false
    }, 2500)
  }
}

const standardFacilities = computed(() => [
  { name: currentLanguage.value === 'kh' ? 'សេវាសង្គ្រោះបន្ទាន់ ២៤ ម៉ោង' : '24/7 Emergency Dispatch', icon: Ambulance },
  { name: currentLanguage.value === 'kh' ? 'បន្ទប់ថែទាំកម្រិតធ្ងន់ (ICU)' : 'Intensive Care Unit (ICU)', icon: Activity },
  { name: currentLanguage.value === 'kh' ? 'ឱសថស្ថានក្នុងមន្ទីរពេទ្យ' : 'On-site Licensed Pharmacy', icon: HeartPulse },
  { name: currentLanguage.value === 'kh' ? 'រូបភាពវេជ្ជសាស្ត្រ & CT / X-Ray' : 'Diagnostic CT & Digital X-Ray', icon: Stethoscope },
  { name: currentLanguage.value === 'kh' ? 'មន្ទីរពិសោធន៍ & ធនាគារឈាម' : 'Laboratory & Blood Bank', icon: Zap },
  { name: currentLanguage.value === 'kh' ? 'កងរថយន្តសង្គ្រោះបន្ទាន់' : 'Patient Ambulance Fleet', icon: HospitalIcon }
])

// Interactive patient preparation checklist
const patientChecklist = ref([
  {
    id: 'id-doc',
    title: 'ប័ណ្ណសម្គាល់ខ្លួន ឬលិខិតឆ្លងដែន',
    titleEn: 'National ID Card or Passport',
    desc: 'សម្រាប់ចុះឈ្មោះអ្នកជំងឺ និងបើកសំណុំឯកសារវេជ្ជសាស្ត្រផ្លូវការ។',
    descEn: 'Required for official patient admission and medical folder registration.',
    checked: false
  },
  {
    id: 'nssf-doc',
    title: 'ប័ណ្ណរបបសន្តិសុខសង្គម (ប.ស.ស / NSSF)',
    titleEn: 'NSSF Health Card (if member)',
    desc: 'សម្រាប់ពលរដ្ឋដែលមានសមាជិកភាព ប.ស.ស ដើម្បីទទួលបានអត្ថប្រយោជន៍ព្យាបាលឥតគិតថ្លៃ។',
    descEn: 'Present your active NSSF card to claim covered medical benefits.',
    checked: false
  },
  {
    id: 'history-doc',
    title: 'ប្រវត្តិវេជ្ជសាស្ត្រ & វេជ្ជបញ្ជាចាស់ៗ',
    titleEn: 'Previous Medical Records & Prescriptions',
    desc: 'ជួយឱ្យវេជ្ជបណ្ឌិតដឹងពីប្រវត្តិជំងឺ អាលែកហ្ស៊ី និងថ្នាំដែលកំពុងប្រើប្រាស់។',
    descEn: 'Helps physicians review past diagnoses, allergies, and ongoing medications.',
    checked: false
  },
  {
    id: 'referral-doc',
    title: 'លិខិតបញ្ជូនអ្នកជំងឺ (បើមាន)',
    titleEn: 'Hospital Referral Letter (if applicable)',
    desc: 'ពីមណ្ឌលសុខភាពមូលដ្ឋាន ដើម្បីទទួលបានការគាំទ្រតាមប្រព័ន្ធ ប.ស.ស កាន់តែលឿន។',
    descEn: 'From local health center for expedited referral and insurance subsidy.',
    checked: false
  }
])

const checkedCount = computed(() => patientChecklist.value.filter(item => item.checked).length)
</script>

<template>
  <div class="health-detail-container min-h-screen pb-16 text-[#0A2540] dark:text-white font-khmer">
    <!-- Ambient Background Glow -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-blue-100/50 via-teal-50/25 to-transparent dark:from-blue-950/25 dark:via-slate-900/15 dark:to-transparent" />

    <div v-if="hospital" class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-7">
      <!-- Breadcrumb & Back Link Navigation Row -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <nav class="flex items-center gap-2 text-xs font-bold text-slate-400" aria-label="Breadcrumb">
          <router-link to="/" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}
          </router-link>
          <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <router-link to="/health" class="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {{ currentLanguage === 'kh' ? 'សុខាភិបាល' : 'Healthcare' }}
          </router-link>
          <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span class="text-[#0A2458] dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
            {{ localized(hospital.name, hospital.nameKh) }}
          </span>
        </nav>

        <router-link
          to="/health"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group w-fit"
        >
          <ArrowLeft class="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅបញ្ជីសុខាភិបាល' : 'Back to Healthcare Directory' }}</span>
        </router-link>
      </div>

      <!-- Master Hero Cover Banner & Profile Card -->
      <section class="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-700/80 dark:bg-slate-800">
        <!-- High-Res Cover Image Banner -->
        <div class="relative aspect-[21/9] min-h-[280px] sm:min-h-[340px] lg:min-h-[380px] bg-slate-900 overflow-hidden">
          <img
            :src="hospital.image"
            :alt="localized(hospital.name, hospital.nameKh)"
            @error="($event.target as HTMLImageElement).src = '/images/pillars/health.jpg'"
            class="h-full w-full object-cover"
          />

          <!-- Deep Ambient Shadow Gradient -->
          <div class="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/45 to-black/20" />

          <!-- Overlaid Top Badges -->
          <div class="absolute inset-x-4 top-4 sm:inset-x-6 sm:top-6 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
            <div class="flex items-center gap-2">
              <!-- Category Badge -->
              <span class="rounded-full bg-white/95 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-blue-700 shadow-md backdrop-blur-md dark:bg-slate-900/95 dark:text-blue-300">
                {{ hospital.category }}
              </span>

              <!-- Ownership Badge -->
              <span
                class="rounded-full px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white shadow-md backdrop-blur-md"
                :class="hospital.ownership === 'public' ? 'bg-blue-600/90' : 'bg-violet-600/90'"
              >
                {{ hospital.ownership === 'public' ? (currentLanguage === 'kh' ? '🏛️ មន្ទីរពេទ្យរដ្ឋ' : 'Public') : (currentLanguage === 'kh' ? '🏥 ឯកជន' : 'Private') }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <!-- NSSF Badge -->
              <span
                v-if="hospital.acceptsNssf"
                class="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-black text-white shadow-md backdrop-blur-md border border-emerald-300/40"
              >
                <ShieldCheck class="w-4 h-4" />
                <span>{{ currentLanguage === 'kh' ? 'ទទួលប័ណ្ណ ប.ស.ស (NSSF)' : 'NSSF Accepted' }}</span>
              </span>

              <!-- Verified Badge -->
              <span class="inline-flex items-center gap-1.5 rounded-full bg-slate-900/80 px-3.5 py-1 text-xs font-bold text-white shadow-md backdrop-blur-md border border-white/20">
                <BadgeCheck class="w-4 h-4 text-emerald-400" />
                <span>{{ currentLanguage === 'kh' ? 'បញ្ជីផ្លូវការ' : 'Verified' }}</span>
              </span>
            </div>
          </div>

          <!-- Overlaid Bottom Title & Subtitle on Image -->
          <div class="absolute inset-x-4 bottom-5 sm:inset-x-6 sm:bottom-6 text-white pointer-events-none space-y-1">
            <div class="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md mb-2">
              <Sparkles class="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              <span>{{ hospital.location }}, Cambodia</span>
            </div>
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {{ localized(hospital.name, hospital.nameKh) }}
            </h1>
            <p v-if="hospital.nameKh && currentLanguage !== 'kh'" class="text-base sm:text-xl text-slate-200 mt-1 font-khmer">
              {{ hospital.nameKh }}
            </p>
          </div>
        </div>

        <!-- Master Interactive Action & Metadata Bar -->
        <div class="p-5 sm:p-6 lg:p-7 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 bg-slate-50/70 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-700/80">
          <!-- Metadata Chips: Rating, Location, Opening Hours -->
          <div class="flex flex-wrap items-center gap-3 text-xs font-bold">
            <div class="flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2 shadow-xs border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700">
              <Star class="h-4 w-4 fill-amber-400 text-amber-400" />
              <span class="text-slate-900 dark:text-white font-black">{{ hospital.rating.toFixed(1) }}</span>
              <span class="text-slate-400">({{ hospital.reviews }} {{ t('health.reviews') }})</span>
            </div>

            <div class="flex items-center gap-1.5 rounded-2xl bg-white px-3.5 py-2 shadow-xs border border-slate-200/80 dark:bg-slate-800 dark:border-slate-700 text-blue-600 dark:text-blue-400">
              <MapPin class="h-4 w-4 shrink-0" />
              <span class="text-slate-700 dark:text-slate-200">{{ hospital.location }}</span>
            </div>

            <div class="flex items-center gap-2 rounded-2xl bg-emerald-50 px-3.5 py-2 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/80">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <Clock class="h-3.5 w-3.5" />
              <span>{{ hospital.openingHours }}</span>
            </div>
          </div>

          <!-- Main Actions: Call Button, Directions, Share -->
          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Direct Call with Green Trigger -->
            <a
              :href="'tel:' + hospital.phone"
              class="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3 text-xs sm:text-sm font-black text-white shadow-md shadow-emerald-600/25 transition hover:from-emerald-700 hover:to-teal-700 active:scale-95"
            >
              <div class="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-white shadow-2xs">
                <PhoneCall class="h-3.5 w-3.5" />
              </div>
              <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ៖ ' : 'Call: ' }}{{ hospital.phone }}</span>
            </a>

            <!-- Get Directions Button -->
            <a
              :href="directionsUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm font-extrabold text-slate-800 shadow-xs transition hover:border-blue-600 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-blue-500 active:scale-95"
            >
              <Navigation class="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span>{{ currentLanguage === 'kh' ? 'ទទួលទិសដៅ' : 'Get Directions' }}</span>
            </a>

            <!-- Share Buttons -->
            <ShareButtons :title="localized(hospital.name, hospital.nameKh)" />
          </div>
        </div>
      </section>

      <!-- Main Layout Grid: 2 Columns (Details & Sidebar Info) -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-7">
        <!-- Left 2 Columns: Overview, Specialties, Facilities, Patient Checklist -->
        <div class="lg:col-span-2 space-y-7">
          <!-- Overview Description -->
          <section class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300">
                <Building2 class="h-5 w-5" />
              </div>
              <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white">
                {{ currentLanguage === 'kh' ? 'អំពីមណ្ឌលសុខាភិបាល' : 'About This Medical Facility' }}
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              {{ localized(hospital.description, hospital.descriptionKh) }}
            </p>

            <!-- NSSF Citizen Notice Box if accepted -->
            <div
              v-if="hospital.acceptsNssf"
              class="mt-3 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-start gap-3 text-xs"
            >
              <ShieldCheck class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div class="space-y-0.5">
                <h4 class="font-black text-emerald-900 dark:text-emerald-200">
                  {{ currentLanguage === 'kh' ? 'ទទួលការពិនិត្យព្យាបាលតាមរបបសន្តិសុខសង្គម (ប.ស.ស)' : 'NSSF Health Insurance Accepted Here' }}
                </h4>
                <p class="text-emerald-800 dark:text-emerald-300/90 leading-relaxed">
                  {{ currentLanguage === 'kh'
                    ? 'ប្រជាពលរដ្ឋ និងកម្មករ-និយោជិតដែលមានប័ណ្ណ ប.ស.ស សុពលភាព អាចមកទទួលការពិនិត្យ និងព្យាបាលជំងឺស្របតាមគោលការណ៍ជាតិ ដោយមិនចាំបាច់បង់ប្រាក់ថ្លៃសេវាដែលបានកំណត់ក្នុងកញ្ចប់អត្ថប្រយោជន៍ឡើយ។'
                    : 'Valid NSSF members can access covered outpatient, inpatient, and trauma treatments subsidized under the national healthcare program.'
                  }}
                </p>
              </div>
            </div>
          </section>

          <!-- Medical Services & Specialties Grid -->
          <section class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300">
                  <Stethoscope class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white">
                    {{ currentLanguage === 'kh' ? 'សេវាកម្ម & ផ្នែកឯកទេស' : 'Medical Services & Specialties' }}
                  </h2>
                  <p class="text-[11px] text-slate-400">
                    {{ currentLanguage === 'kh' ? 'ផ្តល់ជូនការព្យាបាលដោយក្រុមគ្រូពេទ្យជំនាញ' : 'Comprehensive clinical departments & patient care' }}
                  </p>
                </div>
              </div>
              <span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                {{ hospital.services.length }} {{ currentLanguage === 'kh' ? 'សេវាកម្ម' : 'Services' }}
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                v-for="service in hospital.services"
                :key="service"
                class="group flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-200 hover:bg-white hover:shadow-sm dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:bg-slate-800"
              >
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-100/70 text-emerald-700 shadow-2xs dark:bg-emerald-950/60 dark:text-emerald-300 group-hover:scale-105 transition-transform">
                  <CheckCircle class="h-4 w-4" />
                </div>
                <span class="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{{ service }}</span>
              </div>
            </div>
          </section>

          <!-- Standard Hospital Facilities & Equipment -->
          <section class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-4">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-300">
                <Activity class="h-5 w-5" />
              </div>
              <div>
                <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white">
                  {{ currentLanguage === 'kh' ? 'ហេដ្ឋារចនាសម្ព័ន្ធ & សម្ភារៈបរិក្ខារ' : 'Facilities & Medical Equipment' }}
                </h2>
                <p class="text-[11px] text-slate-400">
                  {{ currentLanguage === 'kh' ? 'បំពាក់បច្ចេកវិទ្យាវេជ្ជសាស្ត្រទំនើបសម្រាប់សង្គ្រោះអ្នកជំងឺ' : 'Modern clinical infrastructure and patient diagnostic tools' }}
                </p>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div
                v-for="fac in standardFacilities"
                :key="fac.name"
                class="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 dark:border-slate-700/60 dark:bg-slate-800/60"
              >
                <div class="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-100/70 text-blue-600 shadow-2xs dark:bg-blue-950/60 dark:text-blue-300">
                  <component :is="fac.icon" class="h-4 w-4" />
                </div>
                <span class="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">{{ fac.name }}</span>
              </div>
            </div>
          </section>

          <!-- Interactive Patient Checklist: What to Prepare / Bring -->
          <section class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div class="flex items-center gap-2.5">
                <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300">
                  <FileText class="h-5 w-5" />
                </div>
                <div>
                  <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white">
                    {{ currentLanguage === 'kh' ? 'បញ្ជីឯកសារត្រូវត្រៀមពេលមកពេទ្យ (Interactive Checklist)' : 'Interactive Patient Preparation Checklist' }}
                  </h2>
                  <p class="text-[11px] text-slate-400">
                    {{ currentLanguage === 'kh' ? 'ចុចធីកលើឯកសារដែលលោកអ្នកបានត្រៀមរួចរាល់' : 'Check off documents as you prepare them for your visit' }}
                  </p>
                </div>
              </div>

              <!-- Completion Counter -->
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 w-fit">
                <span>{{ checkedCount }} / {{ patientChecklist.length }} {{ currentLanguage === 'kh' ? 'បានត្រៀម' : 'Prepared' }}</span>
              </span>
            </div>

            <!-- Checklist Cards -->
            <div class="space-y-2.5 pt-1">
              <label
                v-for="item in patientChecklist"
                :key="item.id"
                class="flex items-start gap-3 p-4 rounded-2xl border transition-all duration-200 cursor-pointer select-none"
                :class="item.checked
                  ? 'bg-blue-50/60 dark:bg-blue-950/30 border-blue-300 dark:border-blue-800'
                  : 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'"
              >
                <input
                  v-model="item.checked"
                  type="checkbox"
                  class="mt-1 h-4 w-4 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <div class="flex-1">
                  <h3
                    class="text-xs sm:text-sm font-extrabold transition-colors"
                    :class="item.checked ? 'text-blue-700 dark:text-blue-300 line-through' : 'text-[#0A2458] dark:text-white'"
                  >
                    {{ currentLanguage === 'kh' ? item.title : item.titleEn }}
                  </h3>
                  <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    {{ currentLanguage === 'kh' ? item.desc : item.descEn }}
                  </p>
                </div>
              </label>
            </div>
          </section>
        </div>

        <!-- Right Sidebar Column: Contact, Operating Hours, Map & Emergency SOS -->
        <div class="space-y-6">
          <!-- Location & Contact Card -->
          <div class="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-5">
            <h3 class="text-base font-black text-[#0A2458] dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានទំនាក់ទំនង & ទីតាំង' : 'Location & Contact Details' }}
            </h3>

            <div class="space-y-4 text-xs">
              <!-- Address -->
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន' : 'Address' }}</span>
                <p class="font-bold text-slate-800 dark:text-white mt-1 leading-snug">
                  {{ localized(hospital.address, hospital.addressKh) }}
                </p>
                <p class="text-[11px] text-slate-400 mt-0.5">{{ hospital.location }}, Cambodia</p>
              </div>

              <!-- Direct Phone with Copy -->
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទផ្ទាល់' : 'Direct Phone' }}</span>
                <div class="mt-1 flex items-center justify-between gap-2 rounded-xl bg-slate-50 p-2.5 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-700">
                  <a :href="'tel:' + hospital.phone" class="font-black text-blue-600 text-sm hover:underline dark:text-blue-400">
                    {{ hospital.phone }}
                  </a>
                  <button
                    type="button"
                    class="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600 shadow-2xs transition hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 cursor-pointer"
                    @click="copyPhone(hospital.phone)"
                  >
                    <component :is="copiedPhone ? Check : Copy" class="h-3 w-3" />
                    <span>{{ copiedPhone ? (currentLanguage === 'kh' ? 'ចម្លងរួច' : 'Copied') : (currentLanguage === 'kh' ? 'ចម្លង' : 'Copy') }}</span>
                  </button>
                </div>
              </div>

              <!-- Hours of Operation -->
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{{ currentLanguage === 'kh' ? 'ម៉ោងបម្រើការងារ' : 'Operating Hours' }}</span>
                <p class="font-extrabold text-emerald-600 mt-1 flex items-center gap-1.5 text-sm dark:text-emerald-400">
                  <Clock class="h-4 w-4" />
                  <span>{{ hospital.openingHours }}</span>
                </p>
              </div>

              <!-- Open Google Maps Button -->
              <div class="pt-2">
                <a
                  :href="directionsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-95"
                >
                  <Navigation class="h-4 w-4" />
                  <span>{{ currentLanguage === 'kh' ? 'បើកមើលលើ Google Maps' : 'Open in Google Maps' }}</span>
                </a>
              </div>
            </div>
          </div>

          <!-- Embedded Interactive Google Map Preview Card -->
          <div class="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <div class="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 px-4 py-3">
              <div class="flex items-center gap-2 text-xs font-black text-[#0A2458] dark:text-white">
                <MapPin class="h-4 w-4 text-blue-600" />
                <span>{{ currentLanguage === 'kh' ? 'ផែនទីទីតាំង' : 'Interactive Map' }}</span>
              </div>
              <span class="rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                LIVE
              </span>
            </div>
            <div class="relative aspect-[4/3] w-full bg-slate-100 dark:bg-slate-900">
              <iframe
                :src="mapEmbedUrl"
                title="Hospital Map Location"
                class="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <!-- 24/7 Medical Emergency SOS Callout Box -->
          <div class="rounded-3xl border border-rose-200/90 bg-gradient-to-br from-rose-500 to-red-600 p-6 text-white shadow-lg shadow-rose-950/15 space-y-3">
            <div class="flex items-center gap-2.5">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white shadow-xs">
                <Ambulance class="h-5 w-5" />
              </div>
              <div>
                <h4 class="text-sm font-black">{{ currentLanguage === 'kh' ? 'ត្រូវការរថយន្តសង្គ្រោះបន្ទាន់?' : 'Critical Emergency?' }}</h4>
                <p class="text-[10px] text-rose-100">{{ currentLanguage === 'kh' ? 'សេវាសង្គ្រោះវេជ្ជសាស្ត្រ ២៤/៧' : 'National 24/7 Hotline' }}</p>
              </div>
            </div>
            <p class="text-xs text-rose-100 leading-relaxed font-khmer">
              {{ currentLanguage === 'kh' ? 'ក្នុងករណីសង្គ្រោះបន្ទាន់បំផុត សូមហៅទូរស័ព្ទទៅកាន់រថយន្តសង្គ្រោះជាតិ SAMU 119 ដោយឥតគិតថ្លៃ។' : 'For life-threatening emergencies or critical trauma, dial national SAMU 119 free of charge.' }}
            </p>
            <a
              href="tel:119"
              class="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-2.5 text-xs font-black text-rose-600 shadow-md transition hover:bg-rose-50 active:scale-95 cursor-pointer"
            >
              <PhoneCall class="h-4 w-4" />
              <span>{{ currentLanguage === 'kh' ? 'ហៅ SAMU 119 ឥឡូវ' : 'Call SAMU 119' }}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Related Healthcare Centers Section -->
      <section class="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-lg sm:text-xl font-black text-[#0A2458] dark:text-white">
              {{ currentLanguage === 'kh' ? 'មណ្ឌលសុខភាពដែលទាក់ទង' : 'Related Healthcare Facilities' }}
            </h2>
            <p class="text-xs text-slate-400 mt-0.5">
              {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ និងគ្លីនិកដែលនៅក្បែរ ឬមានឯកទេសស្រដៀងគ្នា' : 'Hospitals and medical centers in similar categories or locations' }}
            </p>
          </div>
          <router-link to="/health" class="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">
            {{ currentLanguage === 'kh' ? 'មើលទាំងអស់ →' : 'View All →' }}
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
            :address-kh="item.addressKh"
            :services="item.services"
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

<style scoped>
.health-detail-container {
  background:
    radial-gradient(55rem 25rem at 50% 0%, rgba(224, 242, 254, .55), transparent 70%),
    linear-gradient(180deg, #f8fbff 0%, #f4f8fe 40%, #edf4fc 100%);
}

:global(.dark) .health-detail-container {
  background-color: #0b1727;
  background-image: none;
}
</style>
