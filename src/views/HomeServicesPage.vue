<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  PhoneCall,
  Star,
  MapPin,
  ShieldCheck,
  RotateCcw,
  Wrench,
  Sparkles,
  Droplets,
  Zap,
  Wind,
  Paintbrush,
  Car,
  Clock,
  DollarSign,
  CheckCircle2,
  Search,
  Award,
  X,
  Eye,
  Info,
  ExternalLink
} from 'lucide-vue-next'
import type { HomeService } from '@/types'
import ServiceHeroBanner from '@/components/ServiceHeroBanner.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import LazyImage from '@/components/LazyImage.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHomeServices } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized, currentLanguage } = useLanguage()

usePageMeta({
  title: 'សេវាជាង និងជួសជុលគេហដ្ឋាន — CamLife Verified Home Services',
  description: 'ស្វែងរកជាងភ្លើង ជាងទឹក ជាងម៉ាស៊ីនត្រជាក់ និងសេវាសម្អាតដែលបានផ្ទៀងផ្ទាត់ និងមានការធានាគុណភាព'
})

function loadAllServices(): HomeService[] {
  const base = getHomeServices()
  try {
    const saved = localStorage.getItem('camlife_custom_home_services')
    if (saved) {
      const custom: HomeService[] = JSON.parse(saved)
      return [...custom, ...base]
    }
  } catch {
    // fallback
  }
  return [...base]
}

const allServices = loadAllServices()
const searchQuery = ref('')
const activeCategory = ref('All')
const activeLocation = ref('All')
const sortBy = ref<'rating' | 'reviews' | 'default'>('default')

// Category definitions with Khmer labels & icons
const categoryList = computed(() => [
  { value: 'All', labelKh: 'គ្រប់សេវាកម្ម', labelEn: 'All Services', icon: Wrench },
  { value: 'Electrician', labelKh: 'ជាងភ្លើង & ខ្សែកាប', labelEn: 'Electrician', icon: Zap },
  { value: 'AC Repair', labelKh: 'ជាងម៉ាស៊ីនត្រជាក់', labelEn: 'AC Repair & Clean', icon: Wind },
  { value: 'Plumber', labelKh: 'ជាងទុយោទឹក & បូមលូ', labelEn: 'Plumbing & Drainage', icon: Droplets },
  { value: 'Cleaning', labelKh: 'សេវាសម្អាតគេហដ្ឋាន', labelEn: 'Deep Cleaning', icon: Sparkles },
  { value: 'Painting', labelKh: 'ជាងលាបថ្នាំផ្ទះ', labelEn: 'Painting & Decor', icon: Paintbrush },
  { value: 'Car Repair', labelKh: 'ជួសជុលរថយន្តចល័ត', labelEn: 'Mobile Auto Repair', icon: Car },
  { value: 'Handyman', labelKh: 'ជាងជួសជុលទូទៅ', labelEn: 'General Handyman', icon: Wrench },
])

// Problem solver quick filters
const urgentProblems = [
  { id: 'ac-clean', labelKh: 'ម៉ាស៊ីនត្រជាក់មិនត្រជាក់', labelEn: 'AC Not Cooling', query: 'AC' },
  { id: 'water-clog', labelKh: 'លេចទឹក / ស្ទះលូ', labelEn: 'Clogged Pipe / Leak', query: 'Plumber' },
  { id: 'blackout', labelKh: 'ដាច់ភ្លើង / ឆ្លងភ្លើង', labelEn: 'Power Cut / Short Circuit', query: 'Electrician' },
  { id: 'deep-clean', labelKh: 'សម្អាតផ្ទះជ្រៅ', labelEn: 'Home Deep Cleaning', query: 'Cleaning' },
  { id: 'car-battery', labelKh: 'ប្តូរអាគុយរថយន្តបន្ទាន់', labelEn: 'Car Battery Jumpstart', query: 'Auto' },
]

const locations = computed(() => {
  return ['All', ...new Set(allServices.map(s => s.location))]
})

const filteredServices = computed(() => {
  let result = [...allServices]

  if (activeCategory.value !== 'All') {
    result = result.filter(s => s.category.toLowerCase() === activeCategory.value.toLowerCase())
  }

  if (activeLocation.value !== 'All') {
    result = result.filter(s => s.location === activeLocation.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(s =>
      s.serviceName.toLowerCase().includes(query) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(query)) ||
      s.provider.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      (s.descriptionKh && s.descriptionKh.toLowerCase().includes(query)) ||
      s.location.toLowerCase().includes(query) ||
      s.category.toLowerCase().includes(query)
    )
  }

  // Sorting
  if (sortBy.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortBy.value === 'reviews') {
    result.sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
  }

  return result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedServices,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredServices, 6)

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
  activeLocation.value = 'All'
  sortBy.value = 'default'
}

function applyProblem(queryText: string) {
  searchQuery.value = queryText
}

// Service Detail Modal
const selectedService = ref<HomeService | null>(null)
const isDetailModalOpen = ref(false)

function openServiceDetail(service: HomeService) {
  selectedService.value = service
  isDetailModalOpen.value = true
}

function closeServiceDetail() {
  isDetailModalOpen.value = false
  setTimeout(() => {
    selectedService.value = null
  }, 200)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Service Hero Banner with 25 Provinces Selector -->
    <ServiceHeroBanner
      :title="t('homeServicesPage.title')"
      :subtitle="t('homeServicesPage.subtitle')"
      badge="Verified Home Services"
      badge-kh="សេវាជាងជំនាញ & ជួសជុលគេហដ្ឋាន"
      banner-image="/images/pillars/home-services.jpg"
      :breadcrumb-current="t('nav.homeServices')"
    />

    <!-- CamLife Citizen Trust & Safety Assurance Bar -->
    <div class="rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
      <div class="relative z-10 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shrink-0">
              <ShieldCheck class="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base sm:text-lg font-black tracking-tight">
                  {{ currentLanguage === 'kh' ? 'ស្តង់ដារសុវត្ថិភាព និងការធានាគុណភាពជាង CamLife' : 'CamLife Verified Service Guarantee' }}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/30 text-emerald-300 border border-emerald-400/40">
                  VERIFIED PROS
                </span>
              </div>
              <p class="text-xs text-blue-100 mt-0.5">
                {{ currentLanguage === 'kh' ? 'រាល់ជាងជំនាញ និងសេវាកម្មទាំងអស់ ត្រូវបានផ្ទៀងផ្ទាត់អត្តសញ្ញាណ និងប្រវត្តិការងារច្បាស់លាស់ ធានាតម្លៃសមរម្យ និងទំនួលខុសត្រូវខ្ពស់' : 'All home service providers undergo identity verification, skill assessments, and customer satisfaction audits.' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-xs font-bold text-white">
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <Award class="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <p class="text-xs font-black">{{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ' : '100% Verified ID' }}</p>
              <p class="text-[10px] text-blue-200 font-normal">{{ currentLanguage === 'kh' ? 'មានប្រវត្តិរូបត្រឹមត្រូវ' : 'Background checked' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <Clock class="w-5 h-5 text-teal-300 shrink-0" />
            <div>
              <p class="text-xs font-black">{{ currentLanguage === 'kh' ? 'មកដល់ក្នុង 30 នាទី' : 'Fast Response' }}</p>
              <p class="text-[10px] text-blue-200 font-normal">{{ currentLanguage === 'kh' ? 'សេវាបន្ទាន់រហ័ស' : 'Same-day available' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <DollarSign class="w-5 h-5 text-emerald-300 shrink-0" />
            <div>
              <p class="text-xs font-black">{{ currentLanguage === 'kh' ? 'តម្លៃប៉ាន់ស្មានថេរ' : 'Clear Pricing' }}</p>
              <p class="text-[10px] text-blue-200 font-normal">{{ currentLanguage === 'kh' ? 'គ្មានការទារលើស' : 'No hidden fees' }}</p>
            </div>
          </div>
          <div class="flex items-center gap-2.5 p-3 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-5 h-5 text-sky-300 shrink-0" />
            <div>
              <p class="text-xs font-black">{{ currentLanguage === 'kh' ? 'ធានាគុណភាព 30 ថ្ងៃ' : '30-Day Guarantee' }}</p>
              <p class="text-[10px] text-blue-200 font-normal">{{ currentLanguage === 'kh' ? 'ជួសជុលឡើងវិញបើខូច' : 'Workmanship covered' }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Smart Problem Solver Filter Console -->
    <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-5">
      <!-- Search Input + Location + Sorting -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3">
        <!-- Search -->
        <div class="md:col-span-6 relative">
          <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search class="w-4 h-4" />
          </div>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកបញ្ហាផ្ទះ ជាងភ្លើង ជាងម៉ាស៊ីនត្រជាក់ ជាងទឹក ឈ្មោះក្រុមហ៊ុន...' : 'Search by issue, service name, technician or company...'"
            class="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
          />
        </div>

        <!-- Location Dropdown -->
        <div class="md:col-span-3">
          <select
            v-model="activeLocation"
            class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ទីតាំង / រាជធានី-ខេត្ត' : 'All Provinces' }}</option>
            <option v-for="loc in locations.filter(l => l !== 'All')" :key="loc" :value="loc">
              {{ loc }}
            </option>
          </select>
        </div>

        <!-- Sort By -->
        <div class="md:col-span-3">
          <select
            v-model="sortBy"
            class="w-full px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm font-bold text-[#0A2540] dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
          >
            <option value="default">{{ currentLanguage === 'kh' ? 'លំដាប់លំនាំដើម (Default)' : 'Default Order' }}</option>
            <option value="rating">{{ currentLanguage === 'kh' ? 'ពិន្ទុវាយតម្លៃខ្ពស់បំផុត (Highest Rated)' : 'Highest Rated' }}</option>
            <option value="reviews">{{ currentLanguage === 'kh' ? 'ចំនួនការងារច្រើនបំផុត (Most Reviews)' : 'Most Reviews' }}</option>
          </select>
        </div>
      </div>

      <!-- Quick Issue Chips -->
      <div class="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
        <span class="text-slate-400 font-bold mr-1">{{ currentLanguage === 'kh' ? 'បញ្ហាជួបញឹកញាប់៖' : 'Common Issues:' }}</span>
        <button
          v-for="prob in urgentProblems"
          :key="prob.id"
          @click="applyProblem(prob.query)"
          type="button"
          class="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-300 font-bold border border-slate-200 dark:border-slate-600 transition-all cursor-pointer"
        >
          {{ currentLanguage === 'kh' ? prob.labelKh : prob.labelEn }}
        </button>
      </div>

      <!-- Category Filter Pills -->
      <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="cat in categoryList"
            :key="cat.value"
            @click="activeCategory = cat.value"
            type="button"
            class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border"
            :class="activeCategory === cat.value
              ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
              : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
          >
            <component :is="cat.icon" class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? cat.labelKh : cat.labelEn }}</span>
          </button>
        </div>
      </div>

      <!-- Active Filters & Reset -->
      <div
        v-if="searchQuery || activeCategory !== 'All' || activeLocation !== 'All' || sortBy !== 'default'"
        class="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700/60 text-xs"
      >
        <span class="text-slate-400 font-medium">
          {{ currentLanguage === 'kh' ? 'កំពុងច្រោះតាមលក្ខខណ្ឌ' : 'Active Filters Applied' }}
        </span>
        <button
          @click="resetFilters"
          class="text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 inline-flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'កំណត់តម្រងឡើងវិញ' : 'Reset All Filters' }}</span>
        </button>
      </div>
    </div>

    <!-- Result Count Header -->
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
        {{ currentLanguage === 'kh' ? 'រកឃើញជាង និងសេវាកម្មចំនួន' : 'Found' }}
        <span class="text-[#0A2540] dark:text-white font-black">{{ filteredServices.length }}</span>
        {{ currentLanguage === 'kh' ? 'សេវាកម្មបានផ្ទៀងផ្ទាត់' : 'verified home specialists' }}
      </p>
      <VerificationBadge compact />
    </div>

    <!-- Verified Providers Marketplace Cards -->
    <div v-if="paginatedServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="service in paginatedServices"
        :key="service.id"
        class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
      >
        <div>
          <!-- Service Thumbnail Header -->
          <div
            @click="openServiceDetail(service)"
            class="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700 cursor-pointer"
          >
            <LazyImage
              v-if="service.image"
              :src="service.image"
              :alt="localized(service.serviceName, service.serviceNameKh)"
              img-class="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 text-blue-600"
            >
              <Wrench class="w-12 h-12 opacity-50" />
            </div>

            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

            <!-- Top Overlaid Badges -->
            <div class="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
              <span class="px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-xl bg-white/95 dark:bg-slate-900/90 text-blue-800 dark:text-blue-300 border border-blue-200/60 shadow-sm backdrop-blur-md flex items-center gap-1.5">
                <Wrench class="w-3 h-3 text-blue-600" />
                <span>{{ service.category }}</span>
              </span>

              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white shadow-sm">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>Available Today</span>
              </span>
            </div>

            <!-- Price Estimate Floating Badge -->
            <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
              <span class="inline-flex items-center gap-1 text-xs font-black bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-400/40">
                <DollarSign class="w-3.5 h-3.5" />
                <span>{{ service.priceEstimate || '$15 - $35' }}</span>
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl">
                <MapPin class="w-3 h-3 text-red-400" />
                <span>{{ service.location }}</span>
              </span>
            </div>
          </div>

          <div class="p-5 space-y-3.5">
            <!-- Service Title & Provider -->
            <div>
              <div class="flex items-center gap-1.5 text-xs text-slate-400 font-bold mb-1">
                <span class="truncate">{{ service.provider }}</span>
                <ShieldCheck class="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
              </div>
              <h3
                @click="openServiceDetail(service)"
                class="text-base font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1 cursor-pointer"
              >
                {{ localized(service.serviceName, service.serviceNameKh) }}
              </h3>
            </div>

            <!-- Rating & Reviews Pill -->
            <div class="flex items-center gap-3 text-xs">
              <div class="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-900/40 text-amber-700 dark:text-amber-300 font-black">
                <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{{ service.rating.toFixed(1) }}</span>
              </div>
              <span class="text-slate-400 font-semibold">
                {{ service.reviews || 25 }} {{ currentLanguage === 'kh' ? 'ការងារជោគជ័យ' : 'completed jobs' }}
              </span>
            </div>

            <!-- Description -->
            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
              {{ localized(service.description, service.descriptionKh) }}
            </p>

            <!-- Trust Highlights -->
            <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
              <span class="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ធានា 30 ថ្ងៃ' : '30-Day Guarantee' }}</span>
              </span>
              <span class="flex items-center gap-1 text-[#0D47A1] dark:text-blue-400">
                <Clock class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ឆ្លើយតបរហ័ស' : 'Fast Response' }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Direct Contact Call & View Actions -->
        <div class="p-5 pt-0">
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <!-- View Detail Button -->
            <button
              type="button"
              @click="openServiceDetail(service)"
              class="flex-1 py-2.5 px-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
            >
              <Eye class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
              <span>{{ currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Detail' }}</span>
            </button>

            <!-- Call Button -->
            <a
              :href="'tel:' + service.phone"
              class="flex-1 py-2.5 px-2.5 rounded-2xl bg-[#0D47A1] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:shadow-md cursor-pointer"
            >
              <PhoneCall class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទហៅ' : 'Call' }}</span>
            </a>

            <!-- Telegram Button -->
            <a
              :href="'https://t.me/share/url?url=' + encodeURIComponent('CamLife Service Request: ' + service.serviceName) + '&text=' + encodeURIComponent('សូមទាក់ទងមកខ្ញុំអំពីសេវាកម្ម៖ ' + service.serviceName + ' (' + service.provider + ')')"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-2xl bg-sky-50 dark:bg-sky-950/40 hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 dark:hover:text-white text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-800/60 flex items-center justify-center transition-all cursor-pointer shadow-2xs group shrink-0"
              title="Telegram"
              aria-label="Telegram"
            >
              <svg class="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.672c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.413Z"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
      <EmptyState
        :title="t('homeServicesPage.emptyTitle')"
        :subtitle="t('homeServicesPage.emptySubtitle')"
        :action-label="t('homeServicesPage.resetSearch')"
        @action="resetFilters"
      />
    </div>

    <!-- Pagination -->
    <PaginationBar
      v-if="totalPages > 1"
      :current-page="currentPage"
      :total-pages="totalPages"
      :showing-from="showingFrom"
      :showing-to="showingTo"
      :total-items="totalItems"
      @page-change="goToPage"
      @prev="prevPage"
      @next="nextPage"
    />

    <!-- Technician / Service Detail Modal -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="isDetailModalOpen && selectedService"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto"
        @click.self="closeServiceDetail"
        role="dialog"
        aria-modal="true"
      >
        <div class="relative w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden my-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
          <!-- Modal Hero Image Header -->
          <div class="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden bg-slate-100 dark:bg-slate-700">
            <LazyImage
              v-if="selectedService.image"
              :src="selectedService.image"
              :alt="localized(selectedService.serviceName, selectedService.serviceNameKh)"
              img-class="w-full h-full object-cover"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 text-blue-600"
            >
              <Wrench class="w-16 h-16 opacity-50" />
            </div>

            <!-- Gradient overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent" />

            <!-- Close Button -->
            <button
              type="button"
              @click="closeServiceDetail"
              class="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/80 hover:bg-slate-900 text-white flex items-center justify-center transition-all cursor-pointer backdrop-blur-md shadow-md hover:scale-105"
              aria-label="Close"
            >
              <X class="w-5 h-5" />
            </button>

            <!-- Top Badges -->
            <div class="absolute top-4 left-4 flex items-center gap-2">
              <span class="px-3 py-1 rounded-xl bg-blue-600/90 text-white text-xs font-black backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <Wrench class="w-3.5 h-3.5" />
                <span>{{ selectedService.category }}</span>
              </span>
              <span class="px-3 py-1 rounded-xl bg-emerald-600/90 text-white text-xs font-black backdrop-blur-md flex items-center gap-1.5 shadow-sm">
                <CheckCircle2 class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'សេវាមានការធានា' : 'Verified Specialist' }}</span>
              </span>
            </div>

            <!-- Bottom Overlaid Info on Header -->
            <div class="absolute bottom-4 left-4 right-4 text-white">
              <div class="flex items-center gap-1.5 text-xs text-blue-200 font-bold mb-1">
                <span>{{ selectedService.provider }}</span>
                <ShieldCheck class="w-4 h-4 text-emerald-400 shrink-0" />
                <span class="text-white/60">•</span>
                <span class="flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-red-400 shrink-0" />
                  {{ selectedService.location }}
                </span>
              </div>
              <h2 class="text-xl sm:text-2xl font-black leading-snug drop-shadow-sm text-white">
                {{ localized(selectedService.serviceName, selectedService.serviceNameKh) }}
              </h2>
            </div>
          </div>

          <!-- Modal Body (Scrollable) -->
          <div class="p-6 space-y-6 overflow-y-auto flex-1">
            <!-- Key Stats Highlight Grid -->
            <div class="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-700">
              <!-- Rating -->
              <div class="text-center">
                <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {{ currentLanguage === 'kh' ? 'ពិន្ទុវាយតម្លៃ' : 'Rating' }}
                </p>
                <div class="flex items-center justify-center gap-1 mt-1 text-amber-500 font-black text-base">
                  <Star class="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{{ selectedService.rating.toFixed(1) }}</span>
                </div>
                <span class="text-[10px] text-slate-400">({{ selectedService.reviews || 25 }} {{ currentLanguage === 'kh' ? 'ការងារជោគជ័យ' : 'jobs done' }})</span>
              </div>

              <!-- Price Estimate -->
              <div class="text-center border-x border-slate-200 dark:border-slate-700 px-2">
                <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {{ currentLanguage === 'kh' ? 'តម្លៃប៉ាន់ស្មាន' : 'Est. Price' }}
                </p>
                <p class="text-emerald-600 dark:text-emerald-400 font-black text-base mt-1">
                  {{ selectedService.priceEstimate || '$15 - $35' }}
                </p>
                <span class="text-[10px] text-slate-400">{{ currentLanguage === 'kh' ? 'តម្លៃសមរម្យ' : 'Standard Rate' }}</span>
              </div>

              <!-- Response Time -->
              <div class="text-center">
                <p class="text-[11px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">
                  {{ currentLanguage === 'kh' ? 'ការឆ្លើយតប' : 'Arrival' }}
                </p>
                <p class="text-[#0D47A1] dark:text-blue-400 font-black text-base mt-1">
                  &lt; 30 {{ currentLanguage === 'kh' ? 'នាទី' : 'min' }}
                </p>
                <span class="text-[10px] text-slate-400">{{ currentLanguage === 'kh' ? 'រហ័សទាន់ចិត្ត' : 'Fast Response' }}</span>
              </div>
            </div>

            <!-- Detailed Description -->
            <div class="space-y-2">
              <h3 class="text-sm font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                <Info class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
                <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតអំពីសេវាកម្ម' : 'Service Description & Scope' }}</span>
              </h3>
              <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/30 p-4 rounded-2xl border border-slate-200/70 dark:border-slate-700/70">
                {{ localized(selectedService.description, selectedService.descriptionKh) }}
              </p>
            </div>

            <!-- CamLife Trust & Guarantees -->
            <div class="space-y-2.5">
              <h3 class="text-sm font-black text-[#0A2540] dark:text-white flex items-center gap-2">
                <Award class="w-4 h-4 text-amber-500" />
                <span>{{ currentLanguage === 'kh' ? 'ការធានា និងលក្ខខណ្ឌសុវត្ថិភាព' : 'CamLife Guarantees & Benefits' }}</span>
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-800/30 text-xs">
                  <CheckCircle2 class="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-emerald-800 dark:text-emerald-300 font-bold block">{{ currentLanguage === 'kh' ? 'ធានាការងារ ៣០ ថ្ងៃ' : '30-Day Work Warranty' }}</strong>
                    <span class="text-emerald-700/80 dark:text-emerald-400/80">{{ currentLanguage === 'kh' ? 'ជួសជុលឡើងវិញឥតគិតថ្លៃបើមានបញ្ហា' : 'Free re-service if any issue recurs' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/70 dark:bg-blue-950/20 border border-blue-200/50 dark:border-blue-800/30 text-xs">
                  <ShieldCheck class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-blue-800 dark:text-blue-300 font-bold block">{{ currentLanguage === 'kh' ? 'ជាងជំនាញបានផ្ទៀងផ្ទាត់' : 'Verified Specialist' }}</strong>
                    <span class="text-blue-700/80 dark:text-blue-400/80">{{ currentLanguage === 'kh' ? 'មានបទពិសោធន៍ និងប្រវត្តិស្អាតស្អំ' : 'Background-checked professional' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/70 dark:bg-purple-950/20 border border-purple-200/50 dark:border-purple-800/30 text-xs">
                  <Clock class="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-purple-800 dark:text-purple-300 font-bold block">{{ currentLanguage === 'kh' ? 'ម៉ោងបម្រើសេវា' : 'Service Hours' }}</strong>
                    <span class="text-purple-700/80 dark:text-purple-400/80">{{ currentLanguage === 'kh' ? '7:00 ព្រឹក - 8:00 យប់ (៧ ថ្ងៃក្នុងមួយសប្តាហ៍)' : '7:00 AM - 8:00 PM (Every day)' }}</span>
                  </div>
                </div>

                <div class="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 text-xs">
                  <DollarSign class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong class="text-amber-800 dark:text-amber-300 font-bold block">{{ currentLanguage === 'kh' ? 'តម្លៃច្បាស់លាស់' : 'Transparent Pricing' }}</strong>
                    <span class="text-amber-700/80 dark:text-amber-400/80">{{ currentLanguage === 'kh' ? 'ពិនិត្យ និងជូនដំណឹងតម្លៃមុនចាប់ផ្តើម' : 'Clear quote before work begins' }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Location & Map Link -->
            <div class="space-y-2">
              <h3 class="text-sm font-black text-[#0A2540] dark:text-white flex items-center justify-between">
                <span class="flex items-center gap-2">
                  <MapPin class="w-4 h-4 text-red-500" />
                  <span>{{ currentLanguage === 'kh' ? 'តំបន់បម្រើសេវាកម្ម' : 'Location & Coverage' }}</span>
                </span>
                <a
                  :href="selectedService.coordinates
                    ? `https://www.google.com/maps/search/?api=1&query=${selectedService.coordinates.lat},${selectedService.coordinates.lng}`
                    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedService.serviceName + ' ' + selectedService.location)}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>{{ currentLanguage === 'kh' ? 'មើលលើផែនទី Maps' : 'Open in Maps' }}</span>
                  <ExternalLink class="w-3.5 h-3.5" />
                </a>
              </h3>
              <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/30 border border-slate-200/70 dark:border-slate-700 flex items-center justify-between text-xs">
                <div class="flex items-center gap-2">
                  <MapPin class="w-4 h-4 text-red-500 shrink-0" />
                  <span class="font-bold text-slate-700 dark:text-slate-200">{{ selectedService.location }}</span>
                </div>
                <span class="text-slate-400 font-semibold">{{ currentLanguage === 'kh' ? 'សេវាចល័តដល់ទីតាំងលោកអ្នក' : 'Mobile Door-to-Door Service' }}</span>
              </div>
            </div>
          </div>

          <!-- Modal Action Footer -->
          <div class="p-4 sm:p-5 bg-slate-50 dark:bg-slate-700/40 border-t border-slate-200/80 dark:border-slate-700 flex flex-wrap items-center gap-2.5">
            <a
              :href="'tel:' + selectedService.phone"
              class="flex-1 py-3 px-4 rounded-2xl bg-[#0D47A1] hover:bg-blue-700 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              <PhoneCall class="w-4 h-4" />
              <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទហៅជាង (' + selectedService.phone + ')' : 'Call Technician (' + selectedService.phone + ')' }}</span>
            </a>

            <a
              :href="'https://t.me/share/url?url=' + encodeURIComponent('CamLife Service Request: ' + selectedService.serviceName) + '&text=' + encodeURIComponent('សូមទាក់ទងមកខ្ញុំអំពីសេវាកម្ម៖ ' + selectedService.serviceName + ' (' + selectedService.provider + ')')"
              target="_blank"
              rel="noopener noreferrer"
              class="py-3 px-4 sm:px-5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
              title="Telegram"
            >
              <svg class="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="m20.665 3.717-17.73 6.837c-1.21.486-1.203 1.161-.222 1.462l4.552 1.42 10.532-6.645c.498-.303.953-.14.579.192l-8.533 7.701h-.002l-.313 4.672c.46 0 .663-.211.921-.46l2.211-2.15 4.599 3.397c.848.467 1.457.227 1.668-.785l3.019-14.228c.309-1.239-.473-1.8-1.282-1.413Z"/>
              </svg>
              <span>Telegram</span>
            </a>

            <button
              type="button"
              @click="closeServiceDetail"
              class="py-3 px-4 rounded-2xl border border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
