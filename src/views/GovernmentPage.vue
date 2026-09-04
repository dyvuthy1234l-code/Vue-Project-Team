<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  CheckCircle2,
  ShieldCheck,
  Headphones,
  Clock,
  ArrowRight,
  GitCompare,
  RotateCcw,
  ChevronRight,
  FileText
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import ServiceCompareModal from '@/components/ServiceCompareModal.vue'
import LocationSelector from '@/components/LocationSelector.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServices } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized, currentLanguage } = useLanguage()

usePageMeta({
  title: 'មគ្គុទ្ទេសក៍សេវារដ្ឋបាលសាធារណៈ — CamLife Civic Guides',
  description: 'នីតិវិធីសាធារណៈផ្លូវការ និងការណែនាំជាជំហានៗសម្រាប់ប្រជាពលរដ្ឋកម្ពុជា'
})

const allServices = getGovernmentServices()
const searchQuery = ref('')
const activeCategory = ref('All')
const isCompareOpen = ref(false)

// 8 Popular Services Quick Filter Chips
const quickPills = [
  { id: 'all', label: 'All Services', labelKh: 'សេវាទាំងអស់', category: 'All' },
  { id: 'id-card', label: 'ID Card', labelKh: 'អត្តសញ្ញាណប័ណ្ណ', category: 'ID Card' },
  { id: 'passport', label: 'Passport', labelKh: 'លិខិតឆ្លងដែន', category: 'Passport' },
  { id: 'driver-license', label: "Driver's License", labelKh: 'ប័ណ្ណបើកបរ', category: "Driver's License" },
  { id: 'birth-cert', label: 'Birth Certificate', labelKh: 'សំបុត្រកំណើត', category: 'Birth Certificate' },
  { id: 'family-book', label: 'Family Book', labelKh: 'សៀវភៅគ្រួសារ', category: 'Family Book' },
  { id: 'marriage-cert', label: 'Marriage Certificate', labelKh: 'សំបុត្រអាពាហ៍ពិពាហ៍', category: 'Marriage Certificate' },
  { id: 'business-reg', label: 'Business Registration', labelKh: 'ចុះបញ្ជីអាជីវកម្ម', category: 'Business Registration' },
  { id: 'land-title', label: 'Land Title', labelKh: 'ប្លង់ដីធ្លី', category: 'Land Title' }
]

// Metadata for popular 8 service cards with exact ID matching
const popularItemsMeta: Record<string, { badge: string; badgeKh: string; badgeColor: string; price: string; priceKh: string; days: string; daysKh: string }> = {
  'national-id-card': {
    badge: 'Most Popular',
    badgeKh: 'ពេញនិយមបំផុត',
    badgeColor: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300/80',
    price: 'Free / $5',
    priceKh: 'ឥតគិតថ្លៃ / $5',
    days: '7-14 days',
    daysKh: '៧-១៤ ថ្ងៃ'
  },
  'passport': {
    badge: 'Popular',
    badgeKh: 'ពេញនិយម',
    badgeColor: 'bg-sky-500/20 text-sky-800 dark:text-sky-300 border-sky-300/80',
    price: '$50',
    priceKh: '$៥០',
    days: '7-21 days',
    daysKh: '៧-២១ ថ្ងៃ'
  },
  'drivers-license': {
    badge: 'Popular',
    badgeKh: 'ពេញនិយម',
    badgeColor: 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-300/80',
    price: '$20',
    priceKh: '$២០',
    days: '7-14 days',
    daysKh: '៧-១៤ ថ្ងៃ'
  },
  'birth-certificate': {
    badge: 'Essential',
    badgeKh: 'ចាំបាច់',
    badgeColor: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-300/80',
    price: 'Free',
    priceKh: 'ឥតគិតថ្លៃ',
    days: '3-14 days',
    daysKh: '៣-១៤ ថ្ងៃ'
  },
  'family-book': {
    badge: 'Essential',
    badgeKh: 'ចាំបាច់',
    badgeColor: 'bg-indigo-500/20 text-indigo-800 dark:text-indigo-300 border-indigo-300/80',
    price: '$5',
    priceKh: '$៥',
    days: '3-7 days',
    daysKh: '៣-៧ ថ្ងៃ'
  },
  'marriage-certificate': {
    badge: 'Civil Status',
    badgeKh: 'អត្រានុកូលដ្ឋាន',
    badgeColor: 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300/80',
    price: '$5',
    priceKh: '$៥',
    days: '3-7 days',
    daysKh: '៣-៧ ថ្ងៃ'
  },
  'business-registration': {
    badge: 'Business',
    badgeKh: 'ពាណិជ្ជកម្ម',
    badgeColor: 'bg-teal-500/20 text-teal-800 dark:text-teal-300 border-teal-300/80',
    price: '$80',
    priceKh: '$៨០',
    days: '7-15 days',
    daysKh: '៧-១៥ ថ្ងៃ'
  },
  'land-title': {
    badge: 'Property',
    badgeKh: 'អចលនទ្រព្យ',
    badgeColor: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300/80',
    price: '$100',
    priceKh: '$១០០',
    days: '15-30 days',
    daysKh: '១៥-៣០ ថ្ងៃ'
  }
}

const filteredServices = computed(() => {
  let result = allServices

  if (activeCategory.value !== 'All') {
    result = result.filter(s => s.category === activeCategory.value)
  }

  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    result = result.filter(s =>
      s.title.toLowerCase().includes(query) ||
      (s.titleKh && s.titleKh.toLowerCase().includes(query)) ||
      s.description.toLowerCase().includes(query) ||
      (s.descriptionKh && s.descriptionKh.toLowerCase().includes(query)) ||
      s.category.toLowerCase().includes(query)
    )
  }

  return result
})

function selectPill(cat: string) {
  activeCategory.value = cat
  scrollToServices()
}

function handleSearch() {
  scrollToServices()
}

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
}

function scrollToServices() {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('services-grid-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-10 font-khmer">
    <!-- FLAGSHIP ROYAL CIVIC HERO BANNER -->
    <section class="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-950/20 border border-blue-900/30 bg-[#061838] text-white">
      <!-- Background Panoramic Royal Palace Image -->
      <div class="absolute inset-0 z-0">
        <img
          src="/images/pillars/government-hero.jpg"
          alt="Royal Palace of Cambodia"
          class="w-full h-full object-cover object-center lg:object-right"
        />
        <!-- Deep Royal Civic Seamless Gradient: 100% natural fade from deep navy on left to clear palace on right -->
        <div class="absolute inset-0 bg-gradient-to-r from-[#051532] via-[#051532]/95 via-45% to-[#051532]/25" />
        <div class="absolute inset-0 bg-gradient-to-t from-[#051532] via-transparent to-[#051532]/40 lg:hidden" />
      </div>

      <!-- Ambient Glow Orbs -->
      <div class="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-500/15 blur-3xl" />
      <div class="pointer-events-none absolute left-1/3 -bottom-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />

      <!-- Inner Content Container -->
      <div class="relative z-10 p-6 sm:p-8 lg:p-10 space-y-6">
        <!-- Top Row: Breadcrumb & 25 Provinces Selector -->
        <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <nav class="flex items-center gap-2 text-xs font-semibold text-slate-300" aria-label="Breadcrumb">
            <router-link to="/" class="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <span>🏠 {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}</span>
            </router-link>
            <ChevronRight class="w-3.5 h-3.5 text-white/40" />
            <span class="text-white font-bold tracking-wide">
              {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈ' : 'Government Services' }}
            </span>
          </nav>

          <!-- 25 Provinces Selector -->
          <div class="flex items-center gap-2">
            <span class="hidden sm:inline text-xs text-blue-200/80 font-medium">
              {{ currentLanguage === 'kh' ? 'ជ្រើសរើសរាជធានី-ខេត្ត:' : 'Province / City:' }}
            </span>
            <LocationSelector variant="banner" />
          </div>
        </div>

        <!-- Main Banner Header Content -->
        <div class="max-w-3xl space-y-3.5">
          <!-- Authority Badges -->
          <div class="flex flex-wrap items-center gap-2.5">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-black backdrop-blur-md shadow-xs">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>🇰🇭 ព្រះរាជាណាចក្រកម្ពុជា • {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈផ្លូវការ' : 'Official Citizen Public Portal' }}</span>
            </div>

            <div class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] font-bold text-white/90 backdrop-blur-xs">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
              <span>{{ currentLanguage === 'kh' ? 'ទិន្នន័យផ្លូវការ ១០០%' : '100% Verified Data' }}</span>
            </div>
          </div>

          <!-- Main Title -->
          <div class="space-y-1">
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-amber-200">
                {{ currentLanguage === 'kh' ? 'មគ្គុទ្ទេសក៍សេវារដ្ឋបាលសាធារណៈ' : 'Government Civic Services' }}
              </span>
            </h1>
            <p class="text-sm sm:text-base font-bold text-blue-200/90">
              {{ currentLanguage === 'kh' ? 'នីតិវិធីផ្លូវការ ឯកសារតម្រូវ និងតម្លៃសេវាសម្រាប់ប្រជាពលរដ្ឋកម្ពុជា' : 'Official public procedures, document requirements & fees for Cambodian citizens' }}
            </p>
          </div>
        </div>

        <!-- Modern Ultra-Clean Search Console -->
        <div class="max-w-2xl pt-1">
          <form @submit.prevent="handleSearch" class="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-white/20 p-1.5 focus-within:ring-4 focus-within:ring-blue-400/20 transition-all">
            <div class="pl-3.5 text-slate-400">
              <Search class="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <input
              v-model="searchQuery"
              type="text"
              @keyup.enter="handleSearch"
              :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវា (ឧ. លិខិតឆ្លងដែន, អត្តសញ្ញាណប័ណ្ណ, ប័ណ្ណបើកបរ, សំបុត្រកំណើត...)' : 'Search government services (e.g., Passport, ID Card, Driver License...)'"
              class="w-full px-3 py-2.5 text-xs sm:text-sm font-bold bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
            />
            <button
              v-if="searchQuery"
              @click="searchQuery = ''; scrollToServices()"
              type="button"
              class="px-2.5 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              ✕
            </button>
            <button
              type="submit"
              class="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-black text-xs transition-all shadow-md cursor-pointer shrink-0"
            >
              {{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}
            </button>
          </form>
        </div>

        <!-- Clean Quick Filter Chips (Sleek Horizontal Wrap without clutter) -->
        <div class="flex flex-wrap items-center gap-2 pt-1">
          <button
            v-for="pill in quickPills"
            :key="pill.id"
            @click="selectPill(pill.category)"
            type="button"
            class="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs"
            :class="activeCategory === pill.category
              ? 'bg-blue-600 text-white border-blue-400 shadow-md scale-105 ring-2 ring-blue-400/30'
              : 'bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white border-white/10 backdrop-blur-xs'"
          >
            <span>{{ currentLanguage === 'kh' ? pill.labelKh : pill.label }}</span>
          </button>
        </div>

        <!-- Bottom Civic Stats & 1222 Citizen Helpline Strip -->
        <div class="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-300">
          <div class="flex flex-wrap items-center gap-4 sm:gap-6">
            <span class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? '៨ សេវាសាធារណៈស្នូល' : '8 Core Civic Services' }}</span>
            </span>
            <span class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'ការណែនាំជាជំហានៗ' : 'Step-by-Step Guides' }}</span>
            </span>
            <span class="flex items-center gap-2">
              <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? '២៥ រាជធានី-ខេត្ត' : '25 Provinces Covered' }}</span>
            </span>
          </div>

          <div class="flex items-center gap-2">
            <span class="text-slate-400">{{ currentLanguage === 'kh' ? 'ខ្សែទូរស័ព្ទជំនួយពលរដ្ឋ:' : 'Citizen Hotline:' }}</span>
            <a
              href="tel:1222"
              class="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/30 text-emerald-300 font-black transition-all hover:scale-105"
            >
              <Headphones class="w-3.5 h-3.5" />
              <span>1222 (Free Call)</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- OFFICIAL GOVERNMENT SERVICES (Spacious, High-Res, Ultra-Clean Card Grid) -->
    <div id="services-grid-section" class="space-y-6 pt-4 scroll-mt-24">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 class="text-xl sm:text-2xl font-black text-[#0A2540] dark:text-white flex items-center gap-2">
            <span>{{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈផ្លូវការ' : 'Official Government Services' }}</span>
            <span class="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800">
              {{ filteredServices.length }} {{ currentLanguage === 'kh' ? 'សេវា' : (filteredServices.length === 1 ? 'Service' : 'Services') }}
            </span>
          </h2>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {{ currentLanguage === 'kh' ? 'នីតិវិធីសាធារណៈ ឯកសារតម្រូវ និងតម្លៃសេវាផ្លូវការសម្រាប់ប្រជាពលរដ្ឋ' : 'Official civic procedures, legal requirements, and processing fees' }}
          </p>
        </div>

        <div class="flex items-center gap-2.5">
          <button
            v-if="searchQuery || activeCategory !== 'All'"
            @click="resetFilters"
            class="px-3.5 py-2 rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/60 dark:bg-rose-950/30 text-rose-600 dark:text-rose-300 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            type="button"
          >
            <RotateCcw class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset' }}</span>
          </button>

          <button
            @click="isCompareOpen = true"
            class="px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
            type="button"
          >
            <GitCompare class="w-3.5 h-3.5 text-[#2563EB]" />
            <span>{{ currentLanguage === 'kh' ? 'ប្រៀបធៀបសេវា' : 'Compare' }}</span>
          </button>

          <button
            @click="resetFilters"
            class="px-4 py-2 rounded-2xl border-2 border-[#2563EB]/40 hover:border-[#2563EB] text-[#2563EB] text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-2xs hover:bg-blue-50 dark:hover:bg-blue-950/30"
            type="button"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View All' }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <!-- Spacious 4-Column Clean Grid with Ultra-High Resolution Photos -->
      <div v-if="filteredServices.length > 0" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <router-link
          v-for="service in filteredServices"
          :key="service.id"
          :to="'/government/' + service.id"
          class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <!-- High-Resolution Document Photo Banner (Crystal Clear 1200px+) -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <img
                :src="service.image"
                :alt="localized(service.title, service.titleKh)"
                @error="($event.target as HTMLImageElement).src = '/images/pillars/government.jpg'"
                class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />

              <!-- Top-right Status Tag -->
              <span
                v-if="popularItemsMeta[service.id]"
                :class="['absolute top-3 right-3 px-3 py-1 rounded-xl text-[10px] font-black border uppercase shadow-sm backdrop-blur-md', popularItemsMeta[service.id].badgeColor]"
              >
                {{ currentLanguage === 'kh' ? popularItemsMeta[service.id].badgeKh : popularItemsMeta[service.id].badge }}
              </span>

              <!-- Category Badge on Bottom-left of Image -->
              <span class="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-md shadow-xs">
                {{ service.category }}
              </span>
            </div>

            <!-- Card Titles & Content -->
            <div class="p-5 space-y-2">
              <div>
                <h3 class="text-base font-black text-[#0A2540] dark:text-white group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
                  {{ service.titleKh }}
                </h3>
                <p class="text-xs text-slate-400 font-semibold mt-0.5 line-clamp-1">
                  {{ service.title }}
                </p>
              </div>

              <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2 pt-1">
                {{ localized(service.description, service.descriptionKh) }}
              </p>
            </div>
          </div>

          <!-- Bottom Row: Processing Duration & Official Price -->
          <div class="px-5 pb-5 pt-0">
            <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
              <span class="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 font-semibold">
                <Clock class="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{{ currentLanguage === 'kh' ? (popularItemsMeta[service.id]?.daysKh || localized(service.processingTime, service.processingTimeKh)) : (popularItemsMeta[service.id]?.days || service.processingTime) }}</span>
              </span>

              <span class="font-black px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {{ currentLanguage === 'kh' ? (popularItemsMeta[service.id]?.priceKh || localized(service.fee, service.feeKh)) : (popularItemsMeta[service.id]?.price || service.fee) }}
              </span>
            </div>

            <!-- Call to action guide link -->
            <div class="mt-3 flex items-center justify-between text-xs font-bold text-[#2563EB] dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span class="flex items-center gap-1">
                <FileText class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'មើលមគ្គុទ្ទេសក៍ និងឯកសារ' : 'View Guide & Requirements' }}</span>
              </span>
              <ArrowRight class="w-3.5 h-3.5" />
            </div>
          </div>
        </router-link>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
        <EmptyState
          :title="t('government.emptyTitle')"
          :subtitle="t('government.emptySubtitle')"
          :action-label="t('government.resetSearch')"
          @action="resetFilters"
        />
      </div>
    </div>

    <!-- Service Compare Modal -->
    <ServiceCompareModal
      :is-open="isCompareOpen"
      :available-services="allServices"
      @close="isCompareOpen = false"
    />
  </div>
</template>
