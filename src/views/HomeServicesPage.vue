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
  Phone,
  Search,
  Award
} from 'lucide-vue-next'
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

const allServices = getHomeServices()
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
          <div class="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
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
                <CheckCircle2 class="w-3 h-3" />
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
              <h3 class="text-base font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
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

        <!-- Direct Contact Call Action -->
        <div class="p-5 pt-0">
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
            <a
              :href="'tel:' + service.phone"
              class="flex-1 py-2.5 px-4 rounded-2xl bg-[#0D47A1] hover:bg-blue-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-md cursor-pointer"
            >
              <PhoneCall class="w-4 h-4" />
              <span>{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទហៅជាង' : 'Call Technician' }}</span>
            </a>

            <a
              :href="'https://t.me/share/url?url=' + encodeURIComponent('CamLife Service Request: ' + service.serviceName) + '&text=' + encodeURIComponent('សូមទាក់ទងមកខ្ញុំអំពីសេវាកម្ម៖ ' + service.serviceName)"
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
              title="Message / Inquiry"
            >
              <Phone class="w-4 h-4" />
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
  </div>
</template>
