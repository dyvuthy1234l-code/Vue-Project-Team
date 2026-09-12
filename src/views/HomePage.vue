<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Ambulance,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Bell,
  Briefcase,
  Building2,
  Bus,
  CarFront,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ExternalLink,
  FileText,
  Flame,
  HeartPulse,
  Hospital,
  IdCard,
  Landmark,
  LocateFixed,
  MapPin,
  Newspaper,
  Phone,
  PhoneCall,
  Search,
  ShieldCheck,
  ShieldAlert,
  Siren,
  Sparkles,
  Wrench,
  AlertTriangle,
  CheckSquare
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'
import { useLocation } from '@/composables/useLocation'
import {
  getEmergencyContacts,
  getGovernmentServices,
  getHomeServices,
  getHospitals,
  getJobs,
  getLocations,
  getNews,
  globalSearch
} from '@/services/dataService'
import VerificationBadge from '@/components/VerificationBadge.vue'
import LazyImage from '@/components/LazyImage.vue'
import heroIllustration from '@/assets/cambodia-hero.png'

type NearbyTab = 'hospitals' | 'police' | 'owso' | 'transport' | 'services'

interface MapPoint {
  name: string
  nameKh: string
  address: string
  addressKh: string
  coordinates: { lat: number; lng: number }
}

interface NearbyEntry extends Omit<MapPoint, 'coordinates'> {
  id: string
  meta: string
  categoryName: string
  categoryNameKh: string
  phone?: string
  coordinates?: { lat: number; lng: number }
  route: string
}

usePageMeta({
  title: 'CamLife — ថ្នាលសេវាសាធារណៈ និងជីវិតប្រចាំថ្ងៃសម្រាប់ពលរដ្ឋកម្ពុជា',
  description: 'ស្វែងរកសេវាសាធារណៈ សុខាភិបាល ឱកាសការងារ ការដឹកជញ្ជូន និងជំនួយបន្ទាន់ ២៤/៧ នៅកម្ពុជា'
})

const router = useRouter()
const { currentLanguage, localized } = useLanguage()
const { selectedProvince } = useLocation()

const hospitals = getHospitals()
const jobs = getJobs()
const governmentServices = getGovernmentServices()
const homeServices = getHomeServices()
const locations = getLocations()
const news = getNews()
const emergencyContacts = getEmergencyContacts()

const searchQuery = ref('')
const newsletterEmail = ref('')
const newsletterSubscribed = ref(false)
const activeNearbyTab = ref<NearbyTab>('hospitals')
const selectedEntryId = ref<string>('')
const activeMapPoint = ref<MapPoint>({
  name: locations[0].name,
  nameKh: locations[0].nameKh,
  address: locations[0].address,
  addressKh: locations[0].addressKh,
  coordinates: locations[0].coordinates
})

// 5 Essential Civic Service Categories for Nearby Services
const nearbyTabs = [
  { id: 'hospitals' as const, labelEn: 'Hospitals', labelKh: 'មន្ទីរពេទ្យ', icon: Hospital, badgeEn: '24/7', badgeKh: '២៤/៧' },
  { id: 'police' as const, labelEn: 'Police & Security', labelKh: 'ប៉ុស្តិ៍នគរបាល', icon: ShieldAlert, badgeEn: '117', badgeKh: '១១៧' },
  { id: 'owso' as const, labelEn: 'OWSO & Sangkat', labelKh: 'ច្រកចេញចូលតែមួយ', icon: Landmark, badgeEn: 'Civic', badgeKh: 'រដ្ឋបាល' },
  { id: 'transport' as const, labelEn: 'Bus & Transit', labelKh: 'ចំណតឡានក្រុង', icon: Bus, badgeEn: '1,500 KHR', badgeKh: '១,៥០០៛' },
  { id: 'services' as const, labelEn: 'Home Repairs', labelKh: 'សេវាជាងបន្ទាន់', icon: Wrench, badgeEn: 'Repairs', badgeKh: 'ជាងជួសជុល' }
]

// 7 Citizen Essential Service Pillars
const quickAccess = [
  {
    label: 'Emergency 24/7',
    labelKh: 'សង្គ្រោះបន្ទាន់',
    description: 'Hotlines & Crisis',
    descriptionKh: 'ទូរស័ព្ទ ១១៧/១១៨/១១៩',
    route: '/emergency',
    icon: Siren,
    image: '/images/pillars/emergency.jpg',
    color: 'text-red-500',
    bg: 'bg-red-50 dark:bg-red-950/40',
    accent: 'bg-red-500',
    hover: 'hover:border-red-300 dark:hover:border-red-700'
  },
  {
    label: 'Civic Guides',
    labelKh: 'សេវារដ្ឋបាល',
    description: 'ID, Passport, License',
    descriptionKh: 'អត្តសញ្ញាណប័ណ្ណ លិខិតឆ្លងដែន',
    route: '/government',
    icon: Landmark,
    image: '/images/pillars/government.jpg',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    accent: 'bg-blue-500',
    hover: 'hover:border-blue-300 dark:hover:border-blue-700'
  },
  {
    label: 'Healthcare',
    labelKh: 'សុខាភិបាល',
    description: 'Hospitals & Clinics',
    descriptionKh: 'មន្ទីរពេទ្យ និងគ្លីនិក',
    route: '/health',
    icon: HeartPulse,
    image: '/images/pillars/health.jpg',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    accent: 'bg-emerald-500',
    hover: 'hover:border-emerald-300 dark:hover:border-emerald-700'
  },
  {
    label: 'Public Jobs',
    labelKh: 'ឱកាសការងារ',
    description: 'Verified Vacancies',
    descriptionKh: 'ការងាររដ្ឋ និងឯកជន',
    route: '/jobs',
    icon: Briefcase,
    image: '/images/pillars/jobs.jpg',
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
    accent: 'bg-violet-500',
    hover: 'hover:border-violet-300 dark:hover:border-violet-700'
  },
  {
    label: 'City Transit',
    labelKh: 'រថយន្តក្រុង',
    description: 'Bus Lines & Fares',
    descriptionKh: 'ខ្សែរត់ ១៣ ខ្សែ & សំបុត្រ',
    route: '/transport',
    icon: Bus,
    image: '/images/pillars/transport.jpg',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    accent: 'bg-amber-500',
    hover: 'hover:border-amber-300 dark:hover:border-amber-700'
  },
  {
    label: 'Home Services',
    labelKh: 'សេវាគេហដ្ឋាន',
    description: 'Electricians & Plumbers',
    descriptionKh: 'ជាងភ្លើង ទឹក ម៉ាស៊ីនត្រជាក់',
    route: '/home-services',
    icon: Wrench,
    image: '/images/pillars/home-services.jpg',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    accent: 'bg-cyan-500',
    hover: 'hover:border-cyan-300 dark:hover:border-cyan-700'
  },
  {
    label: 'Public Offices',
    labelKh: 'ការិយាល័យរដ្ឋ',
    description: 'OWSO & One-Window',
    descriptionKh: 'ច្រកចេញចូលតែមួយ',
    route: '/locations',
    icon: MapPin,
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=400&q=80',
    color: 'text-pink-600',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    accent: 'bg-pink-500',
    hover: 'hover:border-pink-300 dark:hover:border-pink-700'
  },
  {
    label: 'Public News',
    labelKh: 'សេចក្តីជូនដំណឹង',
    description: 'Official Bulletins',
    descriptionKh: 'ព្រឹត្តិបត្រព័ត៌មានជាតិ',
    route: '/news',
    icon: Newspaper,
    image: '/images/pillars/news.jpg',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950/40',
    accent: 'bg-rose-500',
    hover: 'hover:border-rose-300 dark:hover:border-rose-700'
  }
]

const popularSearches = computed(() => [
  { label: currentLanguage.value === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណ' : 'National ID', query: 'National ID Card' },
  { label: currentLanguage.value === 'kh' ? 'ប័ណ្ណបើកបរ' : 'Driving License', query: 'Driving License' },
  { label: currentLanguage.value === 'kh' ? 'លិខិតឆ្លងដែន' : 'Passport', query: 'Passport' },
  { label: currentLanguage.value === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospitals', query: 'Hospitals' },
  { label: currentLanguage.value === 'kh' ? 'ការងារ' : 'Jobs', query: 'Jobs' },
  { label: currentLanguage.value === 'kh' ? 'សង្គ្រោះបន្ទាន់ ១១៩' : 'Emergency 119', query: '119' }
])

const serviceThemes = [
  { icon: IdCard, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-950/50', border: 'hover:border-blue-300 dark:hover:border-blue-600', ring: 'ring-blue-500/20' },
  { icon: FileText, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-950/50', border: 'hover:border-indigo-300 dark:hover:border-indigo-600', ring: 'ring-indigo-500/20' },
  { icon: CarFront, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-950/50', border: 'hover:border-amber-300 dark:hover:border-amber-600', ring: 'ring-amber-500/20' },
  { icon: Landmark, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-950/50', border: 'hover:border-emerald-300 dark:hover:border-emerald-600', ring: 'ring-emerald-500/20' },
  { icon: Banknote, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-950/50', border: 'hover:border-violet-300 dark:hover:border-violet-600', ring: 'ring-violet-500/20' },
  { icon: Building2, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-950/50', border: 'hover:border-rose-300 dark:hover:border-rose-600', ring: 'ring-rose-500/20' }
]

const formatShortDuration = (time: string, timeKh: string, lang: string) => {
  if (lang === 'kh') {
    if (timeKh && timeKh.includes('១៥')) return '១៥-៣០ ថ្ងៃ'
    if (timeKh && timeKh.includes('២០')) return '២០ ថ្ងៃធ្វើការ'
    if ((timeKh && timeKh.includes('ក្នុងថ្ងៃ')) || (time && time.toLowerCase().includes('same day'))) return 'ក្នុងថ្ងៃតែមួយ'
    if (timeKh && (timeKh.includes('៣ ដល់ ៥') || timeKh.includes('៣-៥'))) return '៣-៥ ថ្ងៃ'
    return (timeKh || '').split('(')[0].trim()
  }
  if (time && time.includes('15 to 30')) return '15-30 Days'
  if (time && time.includes('20 business')) return '20 Days'
  if (time && time.toLowerCase().includes('same day')) return 'Same Day'
  if (time && time.includes('3 to 5')) return '3-5 Days'
  return (time || '').split('(')[0].trim()
}

const popularServices = computed(() => governmentServices.slice(0, 6).map((service, index) => {
  const theme = serviceThemes[index % serviceThemes.length]
  return {
    ...service,
    theme,
    shortTitle: service.title
      .replace('Cambodian ', '')
      .replace(' (Khmer Identity Card)', '')
      .replace('Official ', '')
      .replace(' Registration', '')
  }
}))

const latestJobs = computed(() => jobs.slice(0, 3))
const latestNews = computed(() => news.slice(0, 3))
const emergencyHighlights = computed(() => emergencyContacts.slice(0, 4))

const nearbyEntries = computed<NearbyEntry[]>(() => {
  const provName = (selectedProvince.value?.name || '').toLowerCase()
  const provNameKh = selectedProvince.value?.nameKh
    ? selectedProvince.value.nameKh.replace('ខេត្ត', '').replace('រាជធានី', '').trim().toLowerCase()
    : ''
  const isProvMatch = (text: string) => {
    if (!text) return false
    if (!selectedProvince.value || selectedProvince.value.id === 'all') return true
    const t = text.toLowerCase()
    return t.includes(provName) || (provNameKh && t.includes(provNameKh))
  }

  if (activeNearbyTab.value === 'hospitals') {
    const list = hospitals.filter(h => isProvMatch(h.address) || isProvMatch(h.location || ''))
    const source = list.length > 0 ? list : hospitals
    return source.slice(0, 5).map(hospital => ({
      id: hospital.id,
      name: hospital.name,
      nameKh: hospital.nameKh,
      address: hospital.address,
      addressKh: hospital.addressKh,
      categoryName: 'Hospital',
      categoryNameKh: 'មន្ទីរពេទ្យ',
      meta: (hospital.openingHours?.includes('24') || hospital.openingHours === '24/7') ? (currentLanguage.value === 'kh' ? 'សង្គ្រោះបន្ទាន់ ២៤/៧' : '24/7 Emergency Care') : hospital.openingHours,
      phone: hospital.phone,
      coordinates: hospital.coordinates,
      route: `/health/${hospital.id}`
    }))
  }

  if (activeNearbyTab.value === 'police') {
    const list = locations.filter(l => l.category === 'Police Station' && (isProvMatch(l.address) || isProvMatch(l.name)))
    const source = list.length > 0 ? list : locations.filter(l => l.category === 'Police Station')
    return source.slice(0, 5).map(loc => ({
      id: loc.id,
      name: loc.name,
      nameKh: loc.nameKh,
      address: loc.address,
      addressKh: loc.addressKh,
      categoryName: 'Police Station',
      categoryNameKh: 'ប៉ុស្តិ៍នគរបាល',
      meta: currentLanguage.value === 'kh' ? 'អន្តរាគមន៍បន្ទាន់ ២៤ ម៉ោង' : '24/7 Police Dispatch',
      phone: loc.phone,
      coordinates: loc.coordinates,
      route: '/locations'
    }))
  }

  if (activeNearbyTab.value === 'owso') {
    const list = locations.filter(l => l.category === 'Government/OWSO' && (isProvMatch(l.address) || isProvMatch(l.name)))
    const source = list.length > 0 ? list : locations.filter(l => l.category === 'Government/OWSO')
    return source.slice(0, 5).map(loc => ({
      id: loc.id,
      name: loc.name,
      nameKh: loc.nameKh,
      address: loc.address,
      addressKh: loc.addressKh,
      categoryName: 'Government/OWSO',
      categoryNameKh: 'ច្រកចេញចូលតែមួយ',
      meta: currentLanguage.value === 'kh' ? 'ការិយាល័យច្រកចេញចូលតែមួយ' : 'One Window Service (OWSO)',
      phone: loc.phone,
      coordinates: loc.coordinates,
      route: '/locations'
    }))
  }

  if (activeNearbyTab.value === 'transport') {
    const list = locations.filter(l => l.category === 'Bus Station' && (isProvMatch(l.address) || isProvMatch(l.name)))
    const source = list.length > 0 ? list : locations.filter(l => l.category === 'Bus Station')
    return source.slice(0, 5).map(loc => ({
      id: loc.id,
      name: loc.name,
      nameKh: loc.nameKh,
      address: loc.address,
      addressKh: loc.addressKh,
      categoryName: 'Bus Station',
      categoryNameKh: 'ចំណតរថយន្តក្រុង',
      meta: currentLanguage.value === 'kh' ? 'ខ្សែរថយន្តក្រុងសាធារណៈ · ១,៥០០៛' : 'City Bus Terminal · 1,500 KHR',
      phone: loc.phone,
      coordinates: loc.coordinates,
      route: '/transport'
    }))
  }

  const list = homeServices.filter(s => isProvMatch(s.location) || isProvMatch(s.provider))
  const source = list.length > 0 ? list : homeServices
  return source.slice(0, 5).map(service => ({
    id: service.id,
    name: service.serviceName,
    nameKh: service.serviceNameKh,
    address: `${service.provider} · ${service.location}`,
    addressKh: `${service.provider} · ${service.location}`,
    categoryName: service.category,
    categoryNameKh: 'សេវាជាង',
    meta: `${service.category} · ${service.rating.toFixed(1)}/5 (${service.priceEstimate || '$10-$30'})`,
    phone: service.phone,
    coordinates: service.coordinates,
    route: '/home-services'
  }))
})

const mapEmbedUrl = computed(() => {
  const { lat, lng } = activeMapPoint.value.coordinates
  return `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`
})

const mapDirectionsUrl = computed(() => {
  const { lat, lng } = activeMapPoint.value.coordinates
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
})

function submitSearch() {
  const query = searchQuery.value.trim()
  if (!query) return router.push('/government')
  const results = globalSearch(query)
  router.push(results[0]?.route || '/government')
}

function usePopularSearch(term: string) {
  searchQuery.value = term
  submitSearch()
}

function selectMapEntry(entry: NearbyEntry) {
  selectedEntryId.value = entry.id
  if (entry.coordinates) {
    activeMapPoint.value = {
      name: entry.name,
      nameKh: entry.nameKh,
      address: entry.address,
      addressKh: entry.addressKh,
      coordinates: entry.coordinates
    }
  }
}

function setNearbyTab(tab: NearbyTab) {
  activeNearbyTab.value = tab
  nextTick(() => {
    const firstPoint = nearbyEntries.value[0]
    if (firstPoint) {
      selectMapEntry(firstPoint)
    }
  })
}

function getNearbyIcon(tab: NearbyTab) {
  if (tab === 'hospitals') return Hospital
  if (tab === 'police') return ShieldAlert
  if (tab === 'owso') return Landmark
  if (tab === 'transport') return Bus
  return Wrench
}

function getNearbyIconBg(tab: NearbyTab) {
  if (tab === 'hospitals') return 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 ring-emerald-500/20'
  if (tab === 'police') return 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 ring-rose-500/20'
  if (tab === 'owso') return 'bg-blue-50 text-[#0D47A1] dark:bg-blue-950/60 dark:text-blue-300 ring-blue-500/20'
  if (tab === 'transport') return 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 ring-amber-500/20'
  return 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400 ring-cyan-500/20'
}

watch(selectedProvince, (newProv) => {
  if (newProv?.coordinates) {
    activeMapPoint.value = {
      name: newProv.name,
      nameKh: newProv.nameKh,
      address: `រាជធានី-ខេត្ត ${newProv.nameKh}`,
      addressKh: `រាជធានី-ខេត្ត ${newProv.nameKh}`,
      coordinates: newProv.coordinates
    }
  }
  nextTick(() => {
    const firstPoint = nearbyEntries.value[0]
    if (firstPoint) {
      selectMapEntry(firstPoint)
    }
  })
})

function submitNewsletter() {
  if (newsletterEmail.value.trim()) newsletterSubscribed.value = true
}

function emergencyIcon(id: string) {
  if (id === 'police') return ShieldCheck
  if (id === 'ambulance') return Ambulance
  if (id === 'fire') return Flame
  return Phone
}

function emergencyTone(id: string) {
  if (id === 'police') return 'border-blue-400/20 bg-blue-400/[.09] hover:bg-blue-400/[.16]'
  if (id === 'ambulance') return 'border-cyan-400/20 bg-cyan-400/[.09] hover:bg-cyan-400/[.16]'
  if (id === 'fire') return 'border-orange-400/20 bg-orange-400/[.09] hover:bg-orange-400/[.16]'
  return 'border-rose-400/20 bg-rose-400/[.09] hover:bg-rose-400/[.16]'
}

function emergencyNumberTone(id: string) {
  if (id === 'police') return 'text-blue-300'
  if (id === 'ambulance') return 'text-cyan-300'
  if (id === 'fire') return 'text-orange-300'
  return 'text-rose-300'
}

let scrollObserver: IntersectionObserver | null = null

onMounted(async () => {
  await nextTick()
  if (nearbyEntries.value[0]) {
    selectMapEntry(nearbyEntries.value[0])
  }
  scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-in')
          entry.target.classList.remove('reveal-out')
        } else {
          entry.target.classList.remove('reveal-in')
          entry.target.classList.add('reveal-out')
        }
      })
    },
    {
      threshold: 0.08,
      rootMargin: '0px 0px -40px 0px'
    }
  )

  const elements = document.querySelectorAll('.scroll-reveal')
  elements.forEach((el) => scrollObserver?.observe(el))
})

onUnmounted(() => {
  if (scrollObserver) {
    scrollObserver.disconnect()
    scrollObserver = null
  }
})
</script>

<template>
  <div class="reference-home pb-10 text-[#0A2540] dark:text-white">
    <div class="max-w-[1600px] mx-auto px-3 sm:px-5 lg:px-6">

      <!-- ============================================================
           1. CIVIC HERO SECTION: BRANDING, SEARCH & TRUST SIGNALS
      ============================================================= -->
      <section class="hero-card scroll-reveal relative min-h-[440px] overflow-hidden rounded-b-3xl bg-white dark:bg-slate-900 sm:min-h-[520px] lg:min-h-[550px]">
        <img
          :src="heroIllustration"
          alt="Phnom Penh skyline and Cambodian monument"
          class="hero-illustration-mask pointer-events-none absolute right-0 top-0 block h-full w-[88%] sm:w-[74%] md:w-[70%] lg:w-[72%] xl:w-[68%] 2xl:w-[64%] object-cover object-right-top opacity-20 sm:opacity-50 md:opacity-85 dark:opacity-40"
        />
        <div class="pointer-events-none absolute inset-0 bg-gradient-to-r from-white via-white/85 sm:via-white/70 to-transparent dark:from-slate-900 dark:via-slate-900/85 sm:dark:via-slate-900/70 dark:to-transparent z-[5]" />

        <div class="relative z-10 flex min-h-[440px] sm:min-h-[520px] lg:min-h-[550px] flex-col justify-center max-w-2xl px-4 py-6 sm:px-7 sm:py-10 lg:px-8">
          <!-- Citizen Badge -->
          <div class="inline-flex w-fit items-center gap-1.5 sm:gap-2 rounded-full bg-blue-50/90 dark:bg-blue-950/60 px-3 py-1 sm:px-3.5 sm:py-1.5 text-[11px] sm:text-xs font-bold text-[#0D47A1] dark:text-blue-300 ring-1 ring-blue-500/20 font-khmer shadow-2xs backdrop-blur-xs">
            <Landmark class="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ថ្នាលសេវាសាធារណៈសម្រាប់ពលរដ្ឋកម្ពុជា' : 'Cambodia Public Citizen & Life Services Platform' }}</span>
          </div>

          <!-- Main Hero Title -->
          <h1 class="mt-3 sm:mt-4 text-2xl sm:text-5xl lg:text-[3.25rem] font-black tracking-tight text-[#0A2458] dark:text-white leading-[1.25] sm:leading-[1.18] font-khmer">
            {{ currentLanguage === 'kh' ? 'អ្វីៗដែលអ្នកត្រូវការ សម្រាប់ជីវិតនៅកម្ពុជា' : 'Everything You Need For Life in' }}
            <span class="text-[#1456E5]">{{ currentLanguage === 'kh' ? '' : ' Cambodia' }}</span>
          </h1>

          <!-- Subtitle -->
          <p class="mt-2 sm:mt-3.5 text-xs sm:text-base text-slate-500 dark:text-slate-300 font-khmer leading-relaxed max-w-xl">
            {{ currentLanguage === 'kh'
              ? 'ស្វែងរក យល់ដឹង រៀបចំឯកសារ និងទៅប្រើប្រាស់សេវាសាធារណៈ សុខាភិបាល ការងារ និងការសង្គ្រោះបន្ទាន់យ៉ាងងាយស្រួល។'
              : 'Search, understand procedures, prepare documents, and access civic, healthcare, transit, and emergency services with ease.'
            }}
          </p>

          <!-- Main Search Box -->
          <form class="mt-4 sm:mt-6 flex items-center rounded-2xl bg-white p-1.5 sm:p-2 shadow-[0_12px_36px_rgba(15,54,120,.12)] ring-1 ring-slate-200/90 dark:bg-slate-800 dark:ring-slate-700" @submit.prevent="submitSearch">
            <div class="relative min-w-0 flex-1">
              <Search class="absolute left-3.5 sm:left-4 top-1/2 h-4 w-4 sm:h-5 sm:w-5 -translate-y-1/2 text-[#0D47A1] dark:text-blue-400" />
              <input
                v-model="searchQuery"
                class="w-full rounded-xl border-0 bg-transparent py-2.5 sm:py-3.5 pl-10 sm:pl-12 pr-2 text-xs sm:text-sm font-bold text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 dark:text-white font-khmer"
                :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវារដ្ឋ, មន្ទីរពេទ្យ, ការងារ...' : 'Search services, hospitals, jobs...'"
                aria-label="Search CamLife Services"
              />
            </div>
            <button
              type="submit"
              class="rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] px-4 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-blue-600/20 transition active:scale-98 font-khmer shrink-0 flex items-center gap-1.5"
            >
              <Search class="w-3.5 h-3.5 sm:hidden" />
              <span>{{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}</span>
            </button>
          </form>

          <!-- Popular Searches Pills (Clean Horizontal Scroll on Mobile) -->
          <div class="mt-3.5 sm:mt-5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-khmer">
            <span class="text-xs font-bold text-slate-400 dark:text-slate-400 shrink-0">{{ currentLanguage === 'kh' ? 'ពេញនិយម:' : 'Popular:' }}</span>
            <div class="flex items-center gap-1.5 flex-nowrap shrink-0">
              <button
                v-for="term in popularSearches"
                :key="term.label"
                type="button"
                class="whitespace-nowrap rounded-xl border border-slate-200/90 bg-white/90 px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs transition hover:border-[#1456E5] hover:bg-blue-50 hover:text-[#1456E5] dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-300 dark:hover:border-blue-500 dark:hover:bg-slate-700 cursor-pointer shrink-0"
                @click="usePopularSearch(term.query)"
              >
                {{ term.label }}
              </button>
            </div>
          </div>

          <!-- Trust Signals Row (Clean Mini-Card Grid on Mobile) -->
          <div class="mt-4 sm:mt-6 grid grid-cols-3 gap-1.5 sm:flex sm:flex-wrap sm:items-center sm:gap-6 border-t border-slate-100 pt-3.5 sm:pt-4 dark:border-slate-800/80 font-khmer">
            <div class="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent dark:bg-slate-800/40 sm:dark:bg-transparent">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shrink-0">
                <CheckCircle2 class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span class="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{{ currentLanguage === 'kh' ? 'ព័ត៌មានផ្លូវការ' : 'Verified Info' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent dark:bg-slate-800/40 sm:dark:bg-transparent">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-[#0D47A1] dark:bg-blue-950/60 dark:text-blue-400 shrink-0">
                <ShieldCheck class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span class="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ ១០០%' : '100% Free' }}</span>
            </div>
            <div class="flex flex-col sm:flex-row items-center sm:items-center text-center sm:text-left gap-1 sm:gap-2 p-1.5 sm:p-0 rounded-xl bg-slate-50/60 sm:bg-transparent dark:bg-slate-800/40 sm:dark:bg-transparent">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400 shrink-0">
                <Siren class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              </span>
              <span class="text-[10px] sm:text-xs font-bold text-slate-700 dark:text-slate-300 leading-tight">{{ currentLanguage === 'kh' ? 'សង្គ្រោះ ២៤/៧' : '24/7 Emergency' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           2. 8 CITIZEN SERVICE ESSENTIAL PILLARS
      ============================================================= -->
      <section class="section-card scroll-reveal mt-5 overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(31,64,122,.06)] ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <div class="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-50/75 via-white to-transparent px-4 sm:px-5 py-3.5 sm:py-4 dark:border-slate-700 dark:from-blue-950/20 dark:via-slate-800">
          <div class="flex items-center gap-2.5 sm:gap-3">
            <div class="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-[#0D47A1] text-white shadow-sm shrink-0">
              <Sparkles class="h-4 w-4" />
            </div>
            <div>
              <h2 class="text-sm sm:text-base font-black tracking-tight text-[#0A2458] dark:text-white font-khmer">
                {{ currentLanguage === 'kh' ? 'សេវាសាធារណៈ និងជីវិតប្រចាំថ្ងៃ (8 Core Pillars)' : '8 Essential Citizen Pillars' }}
              </h2>
              <p class="text-[10px] sm:text-[11px] font-medium text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'សេវាកម្មសំខាន់ៗដែលបម្រើដល់ពលរដ្ឋដោយផ្ទាល់' : 'Direct access to verified civic, healthcare, and daily services' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-2.5 sm:gap-3.5 p-3 sm:p-4 sm:grid-cols-4 lg:grid-cols-8">
          <router-link
            v-for="item in quickAccess"
            :key="item.label"
            :to="item.route"
            :class="[
              'stagger-card group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover dark:border-slate-700 dark:bg-slate-800',
              item.hover
            ]"
          >
            <span :class="['absolute inset-x-0 top-0 h-1 z-10 opacity-0 transition-opacity group-hover:opacity-100', item.accent]" />
            
            <!-- Clear Representative Image Banner with Icon Badge Overlay -->
            <div class="relative h-24 sm:h-28 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <LazyImage
                :src="item.image"
                :alt="currentLanguage === 'kh' ? item.labelKh : item.label"
                img-class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent pointer-events-none" />
              
              <!-- Floating Icon Badge -->
              <div :class="['absolute bottom-2 left-2 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl shadow-md backdrop-blur-xs transition duration-300 group-hover:scale-110 border border-white/60 dark:border-slate-600', item.bg]">
                <component :is="item.icon" :class="['h-3.5 w-3.5 sm:h-4 sm:w-4', item.color]" />
              </div>

              <!-- Action Arrow Badge -->
              <div class="absolute top-2 right-2 rounded-full bg-black/40 backdrop-blur-xs p-1 text-white opacity-70 group-hover:opacity-100 group-hover:bg-[#0D47A1] transition-all">
                <ChevronRight class="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </div>
            </div>

            <!-- Content Area -->
            <div class="p-2.5 sm:p-3 text-center flex-1 flex flex-col justify-center">
              <div>
                <p class="text-xs font-black tracking-tight text-[#0A2458] dark:text-white font-khmer line-clamp-1 group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors">
                  {{ currentLanguage === 'kh' ? item.labelKh : item.label }}
                </p>
                <p class="mt-0.5 sm:mt-1 text-[10px] sm:text-[10.5px] font-medium text-slate-500 dark:text-slate-400 font-khmer line-clamp-1">
                  {{ currentLanguage === 'kh' ? item.descriptionKh : item.description }}
                </p>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <!-- ============================================================
           3. INTERACTIVE CITIZEN LIVE MAP & NEARBY SERVICES
      ============================================================= -->
      <section class="section-card scroll-reveal mt-5 overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(31,64,122,.07)] ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <!-- Section Header & Filter Tabs -->
        <div class="flex flex-col justify-between gap-3.5 sm:gap-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/80 via-white to-transparent p-3.5 sm:px-5 sm:py-4.5 dark:border-slate-700 dark:from-blue-950/25 dark:via-slate-800 xl:flex-row xl:items-center">
          <div class="flex items-center gap-3 sm:gap-3.5">
            <div class="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-[#0D47A1] text-white shadow-md shadow-blue-950/20">
              <LocateFixed class="h-4 w-4 sm:h-5 sm:w-5 animate-pulse" />
            </div>
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h2 class="text-sm sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white font-khmer">
                  {{ currentLanguage === 'kh' ? 'ស្វែងរកសេវាកម្មជិតអ្នក (Nearby Services)' : 'Find Essential Services Near You' }}
                </h2>
                <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 px-2 sm:px-2.5 py-0.5 text-[9px] sm:text-[10px] font-black text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/20 shrink-0">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE MAP
                </span>
              </div>
              <div class="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2 font-khmer text-[11px] sm:text-xs">
                <span class="text-slate-500 dark:text-slate-400">
                  {{ currentLanguage === 'kh' ? 'ទីតាំងបច្ចុប្បន្ន:' : 'Active Location:' }}
                  <strong class="text-[#0D47A1] dark:text-blue-400 font-black ml-1">{{ currentLanguage === 'kh' ? selectedProvince.nameKh : selectedProvince.name }}</strong>
                </span>
                <span class="text-slate-300 dark:text-slate-600 hidden sm:inline">·</span>
                <span class="text-[11px] text-slate-400 hidden sm:inline">
                  {{ currentLanguage === 'kh' ? 'ចុចលើទីតាំងដើម្បីមើលលើផែនទីភ្លាមៗ' : 'Click any facility to preview on map' }}
                </span>
              </div>
            </div>
          </div>

          <!-- 5 Essential Civic Filter Tabs with Horizontal Scroll -->
          <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto rounded-2xl bg-slate-100/90 p-1 sm:p-1.5 dark:bg-slate-700/60 font-khmer scrollbar-none">
            <button
              v-for="tab in nearbyTabs"
              :key="tab.id"
              type="button"
              :class="[
                'inline-flex items-center gap-1.5 sm:gap-2 whitespace-nowrap rounded-xl px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold transition-all duration-200 cursor-pointer',
                activeNearbyTab === tab.id
                  ? 'bg-white text-[#0D47A1] shadow-md dark:bg-slate-800 dark:text-blue-300 font-black ring-1 ring-blue-500/20 scale-[1.02]'
                  : 'text-slate-600 hover:text-[#0D47A1] dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800/60'
              ]"
              @click="setNearbyTab(tab.id)"
            >
              <component :is="tab.icon" class="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? tab.labelKh : tab.labelEn }}</span>
              <span
                :class="[
                  'text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md transition-colors',
                  activeNearbyTab === tab.id
                    ? 'bg-blue-100 text-[#0D47A1] dark:bg-blue-950 dark:text-blue-300'
                    : 'bg-slate-200/80 text-slate-600 dark:bg-slate-600 dark:text-slate-300'
                ]"
              >
                {{ currentLanguage === 'kh' ? tab.badgeKh : tab.badgeEn }}
              </span>
            </button>
          </div>
        </div>

        <div class="grid gap-3 sm:gap-4 p-3 sm:p-5 lg:grid-cols-[1.15fr_0.85fr] xl:grid-cols-[1.2fr_1fr]">
          <!-- Left Column: Map Frame + Mobile Swipe Carousel -->
          <div class="flex flex-col min-w-0">
            <!-- Map Embed Frame -->
            <div class="relative h-[250px] sm:h-[340px] lg:h-[470px] overflow-hidden rounded-2xl bg-slate-100 shadow-inner dark:bg-slate-900 border border-slate-200/80 dark:border-slate-700">
              <iframe
                :key="mapEmbedUrl"
                :src="mapEmbedUrl"
                title="CamLife nearby services interactive map"
                class="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              />

              <!-- Top Floating Active Facility Card (Only on sm+ screen so mobile map remains 100% visible and uncluttered) -->
              <div class="hidden sm:block absolute left-3 top-3 max-w-md rounded-2xl border border-white/90 bg-white/95 p-3.5 shadow-xl shadow-slate-950/10 backdrop-blur-md dark:border-slate-700/90 dark:bg-slate-900/95 font-khmer">
                <div class="flex items-center gap-3">
                  <span :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 shadow-xs', getNearbyIconBg(activeNearbyTab)]">
                    <component :is="getNearbyIcon(activeNearbyTab)" class="h-5 w-5" />
                  </span>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-2">
                      <p class="truncate text-xs sm:text-sm font-black text-[#0A2540] dark:text-white">
                        {{ localized(activeMapPoint.name, activeMapPoint.nameKh) }}
                      </p>
                      <span class="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/80 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-300 shrink-0">
                        <span class="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
                        {{ currentLanguage === 'kh' ? 'ទីតាំងជ្រើសរើស' : 'Selected' }}
                      </span>
                    </div>
                    <p class="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400">
                      {{ localized(activeMapPoint.address, activeMapPoint.addressKh) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Bottom Floating Action Bar -->
              <div class="absolute bottom-2.5 sm:bottom-3 left-2.5 sm:left-3 right-2.5 sm:right-3 flex items-center justify-between gap-2 font-khmer">
                <a
                  :href="mapDirectionsUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] px-3 sm:px-4 py-1.5 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white shadow-lg shadow-blue-950/25 transition duration-150 active:scale-95"
                >
                  <MapPin class="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-amber-300" />
                  <span>{{ currentLanguage === 'kh' ? 'មើលលើ Google Maps' : 'Open in Google Maps' }}</span>
                  <ExternalLink class="h-3 w-3 sm:h-3.5 sm:w-3.5 opacity-80" />
                </a>

                <span class="hidden sm:inline-block rounded-xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-2 text-[11px] font-mono font-bold text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 shadow-sm">
                  GPS: {{ activeMapPoint.coordinates.lat.toFixed(4) }}, {{ activeMapPoint.coordinates.lng.toFixed(4) }}
                </span>
              </div>
            </div>

            <!-- Mobile-Only App Style Horizontal Swipe Carousel (< lg) -->
            <div class="lg:hidden mt-3 min-w-0">
              <div class="flex items-center justify-between mb-2 font-khmer px-0.5">
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                  <span>{{ currentLanguage === 'kh' ? 'ទីតាំងផ្ទៀងផ្ទាត់ជិតអ្នក' : 'Verified Facilities' }}</span>
                  <span class="text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-1.5 py-0.5 rounded border border-blue-200/50 dark:border-blue-800/50">
                    {{ nearbyEntries.length }}
                  </span>
                </span>
                <span class="text-[11px] text-slate-400">
                  👉 {{ currentLanguage === 'kh' ? 'អូសឆ្វេង-ស្តាំ' : 'Swipe cards' }}
                </span>
              </div>

              <!-- Horizontal Snap Track -->
              <div class="flex gap-2.5 overflow-x-auto snap-x snap-mandatory pb-1.5 scrollbar-none -mx-1 px-1">
                <div
                  v-for="entry in nearbyEntries"
                  :key="entry.id"
                  role="button"
                  tabindex="0"
                  :class="[
                    'w-[82vw] max-w-[310px] shrink-0 snap-center rounded-2xl border p-3 text-left transition-all duration-150 cursor-pointer shadow-sm relative flex flex-col justify-between bg-white dark:bg-slate-800 outline-hidden',
                    selectedEntryId === entry.id
                      ? 'border-2 border-[#0D47A1] ring-2 ring-[#0D47A1]/15 dark:border-blue-400'
                      : 'border-slate-200/90 hover:border-blue-200 dark:border-slate-700/80'
                  ]"
                  @click="selectMapEntry(entry)"
                  @keydown.enter="selectMapEntry(entry)"
                >
                  <!-- Card Header: Icon, Title, Active Badge -->
                  <div class="flex items-start gap-2.5">
                    <div :class="['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-xs ring-1 mt-0.5', getNearbyIconBg(activeNearbyTab)]">
                      <component :is="getNearbyIcon(activeNearbyTab)" class="h-4.5 w-4.5" />
                    </div>
                    <div class="min-w-0 flex-1 font-khmer">
                      <div class="flex items-center justify-between gap-1.5">
                        <p class="truncate text-xs font-black text-[#0A2458] dark:text-white">
                          {{ localized(entry.name, entry.nameKh) }}
                        </p>
                        <span
                          v-if="selectedEntryId === entry.id"
                          class="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 text-[8.5px] font-black text-emerald-700 dark:text-emerald-300 shrink-0"
                        >
                          <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                          {{ currentLanguage === 'kh' ? 'កំពុងមើល' : 'Active' }}
                        </span>
                      </div>
                      <p class="mt-0.5 truncate text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin class="h-3 w-3 shrink-0 text-slate-400" />
                        <span class="truncate">{{ localized(entry.address, entry.addressKh) }}</span>
                      </p>
                    </div>
                  </div>

                  <!-- Card Footer: Meta tag + 1-Tap Call & Route Buttons -->
                  <div class="mt-2.5 flex items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-700/60 pt-2 font-khmer">
                    <span class="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[9.5px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-100/80 dark:border-blue-900/50 truncate max-w-[130px]">
                      {{ entry.meta }}
                    </span>

                    <div class="flex items-center gap-1.5 shrink-0">
                      <a
                        v-if="entry.phone"
                        :href="`tel:${entry.phone}`"
                        class="inline-flex items-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 hover:bg-emerald-600 hover:text-white transition shadow-2xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                        :title="currentLanguage === 'kh' ? `ហៅទូរស័ព្ទ ${entry.phone}` : `Call ${entry.phone}`"
                        @click.stop
                      >
                        <PhoneCall class="h-3 w-3" />
                        <span>{{ currentLanguage === 'kh' ? 'ហៅ' : 'Call' }}</span>
                      </a>

                      <router-link
                        :to="entry.route"
                        class="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-bold text-[#0D47A1] hover:bg-blue-50 transition dark:border-slate-700 dark:bg-slate-800 dark:text-blue-300"
                        :title="currentLanguage === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View details'"
                        @click.stop
                      >
                        <span>{{ currentLanguage === 'kh' ? 'លម្អិត' : 'Details' }}</span>
                        <ChevronRight class="h-3 w-3" />
                      </router-link>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Mobile Explore All Category Link -->
              <div class="mt-2 flex items-center justify-between text-xs font-khmer px-1 pt-1 border-t border-slate-100 dark:border-slate-800">
                <router-link
                  :to="activeNearbyTab === 'hospitals' ? '/health' : activeNearbyTab === 'transport' ? '/transport' : activeNearbyTab === 'services' ? '/home-services' : '/locations'"
                  class="inline-flex items-center gap-1 font-bold text-[#0D47A1] dark:text-blue-400 hover:underline"
                >
                  <span>{{ currentLanguage === 'kh' ? 'មើលសេវាកម្មទាំងអស់ក្នុងប្រភេទនេះ' : 'Explore All in this category' }}</span>
                  <ArrowRight class="h-3 w-3" />
                </router-link>
                <span class="text-[11px] font-semibold text-slate-400 font-mono">{{ nearbyEntries.length }} ទីតាំង</span>
              </div>
            </div>
          </div>

          <!-- Desktop-Only Facilities List Column (hidden on mobile, visible on lg+) -->
          <div class="hidden lg:flex bg-slate-50/80 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex-col justify-between h-[470px]">
            <div class="min-h-0 flex-1 flex flex-col">
              <div class="flex items-center justify-between pb-2.5 border-b border-slate-200/70 dark:border-slate-700/60 font-khmer">
                <span class="text-xs font-bold text-slate-600 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ទីតាំងផ្ទៀងផ្ទាត់ក្នុងរាជធានី-ខេត្ត' : 'Verified Facilities Near You' }}
                </span>
                <span class="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/50 dark:border-blue-800/50">
                  {{ nearbyEntries.length }} ទីតាំង
                </span>
              </div>

              <!-- List Cards with Comfortable Spacing and Scroll -->
              <div class="mt-2.5 space-y-2.5 overflow-y-auto pr-1 flex-1 min-h-0">
                <div
                  v-for="entry in nearbyEntries"
                  :key="entry.id"
                  role="button"
                  tabindex="0"
                  :class="[
                    'group relative flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200 cursor-pointer outline-hidden',
                    selectedEntryId === entry.id
                      ? 'border-2 border-[#0D47A1] bg-white shadow-md ring-2 ring-[#0D47A1]/15 dark:bg-slate-800 dark:border-blue-400'
                      : 'border-slate-200/80 bg-white/85 hover:border-blue-200 hover:bg-white hover:shadow-xs dark:border-slate-700/70 dark:bg-slate-800/70 dark:hover:bg-slate-800'
                  ]"
                  @click="selectMapEntry(entry)"
                  @keydown.enter="selectMapEntry(entry)"
                >
                  <!-- Active Indicator Ribbon -->
                  <span
                    v-if="selectedEntryId === entry.id"
                    class="absolute left-0 top-3 bottom-3 w-1 rounded-r-md bg-[#0D47A1] dark:bg-blue-400"
                  />

                  <!-- Icon Badge -->
                  <div :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs ring-1 transition-transform group-hover:scale-105', getNearbyIconBg(activeNearbyTab)]">
                    <component :is="getNearbyIcon(activeNearbyTab)" class="h-5 w-5" />
                  </div>

                  <!-- Details -->
                  <div class="min-w-0 flex-1 font-khmer">
                    <div class="flex items-center gap-2">
                      <p class="truncate text-xs sm:text-sm font-black text-[#0A2458] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-300 transition-colors">
                        {{ localized(entry.name, entry.nameKh) }}
                      </p>
                      <span
                        v-if="selectedEntryId === entry.id"
                        class="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 px-2 py-0.5 text-[9px] font-black text-emerald-700 dark:text-emerald-300 shrink-0"
                      >
                        <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                        {{ currentLanguage === 'kh' ? 'កំពុងមើល' : 'Active' }}
                      </span>
                    </div>

                    <p class="mt-1 truncate text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <MapPin class="h-3 w-3 shrink-0 text-slate-400" />
                      <span class="truncate">{{ localized(entry.address, entry.addressKh) }}</span>
                    </p>

                    <div class="mt-1.5 flex flex-wrap items-center gap-1.5">
                      <span class="inline-block rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-100/80 dark:border-blue-900/50">
                        {{ entry.meta }}
                      </span>
                    </div>
                  </div>

                  <!-- Actions (1-Tap Call & Route) -->
                  <div class="flex items-center gap-1.5 shrink-0 pl-1">
                    <a
                      v-if="entry.phone"
                      :href="`tel:${entry.phone}`"
                      class="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition shadow-xs dark:border-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                      :title="currentLanguage === 'kh' ? `ហៅទូរស័ព្ទ ${entry.phone}` : `Call ${entry.phone}`"
                      @click.stop
                    >
                      <PhoneCall class="h-4 w-4" />
                    </a>

                    <router-link
                      :to="entry.route"
                      class="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-400 hover:text-[#0D47A1] hover:bg-white hover:border-blue-300 transition dark:border-slate-700 dark:bg-slate-800"
                      :title="currentLanguage === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View details'"
                      @click.stop
                    >
                      <ChevronRight class="h-4 w-4" />
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer of List Area -->
            <div class="mt-3 flex items-center justify-between border-t border-slate-200/70 pt-3 dark:border-slate-700/60 font-khmer">
              <router-link
                :to="activeNearbyTab === 'hospitals' ? '/health' : activeNearbyTab === 'transport' ? '/transport' : activeNearbyTab === 'services' ? '/home-services' : '/locations'"
                class="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#0D47A1] transition hover:bg-blue-100 hover:text-blue-900 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-950/70"
              >
                <span>{{ currentLanguage === 'kh' ? 'មើលសេវាកម្មទាំងអស់ក្នុងប្រភេទនេះ' : 'Explore All in this category' }}</span>
                <ArrowRight class="h-3.5 w-3.5" />
              </router-link>
              <span class="text-xs font-semibold text-slate-400 font-mono">{{ nearbyEntries.length }} ទីតាំង</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           4. EMERGENCY 24/7 CENTER & CRISIS PROTOCOL
      ============================================================= -->
      <section class="emergency-card scroll-reveal relative mt-5 overflow-hidden rounded-3xl p-6 text-white shadow-[0_16px_34px_rgba(12,16,34,.22)] sm:p-8">
        <!-- Background Image & Atmospheric Emergency Overlay -->
        <div class="absolute inset-0 z-0 overflow-hidden">
          <img
            src="/images/pillars/emergency-bg.jpg"
            alt="Cambodian Emergency Response: Ambulance & Police"
            class="h-full w-full object-cover object-center filter brightness-[0.75] contrast-[1.08] scale-100 transition-transform duration-700"
          />
          <!-- Subtle vignette that preserves ambulance and police vehicle clarity -->
          <div class="absolute inset-0 bg-gradient-to-t from-[#070B18]/95 via-[#070B18]/55 to-[#070B18]/40" />
          <div class="absolute inset-0 bg-gradient-to-r from-[#070B18]/85 via-transparent to-[#070B18]/60" />
          <div class="absolute inset-0 bg-[radial-gradient(circle_at_25%_60%,rgba(225,36,42,.22),transparent_40%),radial-gradient(circle_at_75%_60%,rgba(13,71,161,.22),transparent_40%)]" />
        </div>

        <div class="relative z-10">
          <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div class="flex items-center gap-3">
              <div class="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/20 text-red-300 ring-1 ring-red-400/30">
                <Siren class="h-6 w-6" />
              </div>
              <div class="font-khmer">
                <div class="flex items-center gap-2">
                  <h2 class="text-xl sm:text-2xl font-black tracking-tight">
                    {{ currentLanguage === 'kh' ? 'មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់ ២៤/៧ (Emergency Center)' : '24/7 Emergency Response Center' }}
                  </h2>
                  <span class="flex h-2.5 w-2.5 rounded-full bg-red-400 animate-pulse" />
                </div>
                <p class="mt-1 text-xs sm:text-sm text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ហៅទូរស័ព្ទផ្ទាល់ឥតគិតថ្លៃពេលមានអាសន្ន គ្រោះថ្នាក់ ឬជំងឺធ្ងន់ធ្ងរ' : 'Direct 1-tap call for police, fire, ambulance, and disaster helplines' }}
                </p>
              </div>
            </div>

            <router-link
              to="/emergency"
              class="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-red-950/40 transition hover:from-red-500 hover:to-rose-500 font-khmer shrink-0"
            >
              <span>{{ currentLanguage === 'kh' ? 'សេវាសង្គ្រោះទាំងអស់' : 'All Emergency Helplines' }}</span>
              <ArrowRight class="h-4 w-4" />
            </router-link>
          </div>

          <!-- Emergency Hotlines Grid -->
          <div class="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <a
              v-for="contact in emergencyHighlights"
              :key="contact.id"
              :href="`tel:${contact.number}`"
              :title="currentLanguage === 'kh' ? `ចុចដើម្បីហៅ ${contact.number}` : `Call ${contact.number}`"
              :class="['stagger-card group relative overflow-hidden rounded-2xl border p-3 sm:p-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl backdrop-blur-md bg-slate-950/75 shadow-md border-white/15', emergencyTone(contact.id)]"
            >
              <!-- Phone layout: stacked, Laptop: horizontal -->
              <div class="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
                <div class="flex items-center gap-2 sm:gap-3 min-w-0">
                  <div class="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-white/[.12] text-amber-300 ring-1 ring-white/10 group-hover:scale-105 transition-transform">
                    <component :is="emergencyIcon(contact.id)" class="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <div class="min-w-0">
                    <p :class="['text-xl sm:text-3xl font-black leading-none tracking-tight font-mono', emergencyNumberTone(contact.id)]">
                      {{ contact.number }}
                    </p>
                    <p class="mt-1 truncate text-[10px] sm:text-xs font-bold text-slate-200 font-khmer">
                      {{ localized(contact.name, contact.nameKh) }}
                    </p>
                  </div>
                </div>

                <!-- Green Glowing Call Trigger Button -->
                <div class="relative flex shrink-0 items-center justify-center sm:ml-auto">
                  <span class="absolute -inset-1 rounded-full bg-emerald-500/40 opacity-0 blur-sm transition-opacity duration-300 group-hover:opacity-100" />
                  <div class="relative flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md shadow-emerald-950/40 ring-2 ring-emerald-400/40 transition-all duration-300 group-hover:scale-110 group-hover:bg-emerald-400 group-hover:shadow-[0_0_18px_rgba(52,211,153,0.7)]">
                    <PhoneCall class="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:rotate-12" />
                  </div>
                </div>
              </div>
            </a>
          </div>

          <!-- Emergency Protocol Guidance Checklist -->
          <div class="mt-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/15 p-4 font-khmer shadow-md">
            <p class="text-xs font-bold text-amber-300 flex items-center gap-1.5 mb-2">
              <AlertTriangle class="w-4 h-4" />
              <span>{{ currentLanguage === 'kh' ? 'គោលការណ៍ណែនាំពេលមានអាសន្ន (Emergency Protocol):' : 'What to do in an emergency:' }}</span>
            </p>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-slate-300">
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">1</span>
                <span>{{ currentLanguage === 'kh' ? 'រក្សាភាពស្ងប់ស្ងៀម' : '1. Stay calm' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">2</span>
                <span>{{ currentLanguage === 'kh' ? 'ហៅទៅលេខត្រឹមត្រូវ' : '2. Call correct service' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">3</span>
                <span>{{ currentLanguage === 'kh' ? 'ប្រាប់ទីតាំងឱ្យច្បាស់' : '3. Give exact location' }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">4</span>
                <span>{{ currentLanguage === 'kh' ? 'ធ្វើតាមការណែនាំ' : '4. Follow instructions' }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           5. POPULAR CIVIC & ADMINISTRATIVE PROCEDURES
      ============================================================= -->
      <section class="section-card scroll-reveal mt-5 rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700">
        <!-- Section Header -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4 dark:border-slate-700">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#0D47A1] ring-1 ring-blue-500/20 dark:bg-blue-950/60 dark:text-blue-300">
              <Landmark class="h-5 w-5" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white font-khmer">
                  {{ currentLanguage === 'kh' ? 'មគ្គុទ្ទេសក៍សេវារដ្ឋបាលសាធារណៈ' : 'Official Government Procedures' }}
                </h2>
                <VerificationBadge compact />
              </div>
              <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'នីតិវិធីផ្លូវការ ឯកសារតម្រូវ ថ្លៃសេវា និងទីតាំងផ្តល់សេវាច្រកចេញចូលតែមួយ' : 'Step-by-step guides, required documents, official fees, and OWSO office locations' }}
              </p>
            </div>
          </div>
          <router-link
            to="/government"
            class="inline-flex w-fit items-center gap-1.5 rounded-xl bg-blue-50 px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-bold text-[#0D47A1] transition hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-300 font-khmer shrink-0"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលសេវាទាំងអស់' : 'View all civic guides' }}</span>
            <ArrowRight class="h-3.5 w-3.5" />
          </router-link>
        </div>

        <!-- 6 Cards Grid (Clean 2-Column on Mobile, 3 on Tablet, 6 on Desktop) -->
        <div class="mt-4 sm:mt-6 grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-3 xl:grid-cols-6">
          <router-link
            v-for="service in popularServices"
            :key="service.id"
            :to="`/government/${service.id}`"
            class="group relative flex flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-3 sm:p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-400 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-800 dark:hover:border-blue-500 shadow-2xs cursor-pointer"
          >
            <div>
              <!-- Top Row: Icon + Subtle Action Arrow Button -->
              <div class="flex items-center justify-between">
                <div :class="['flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-105 ring-1', service.theme.bg, service.theme.color, service.theme.ring]">
                  <component :is="service.theme.icon" class="h-5 w-5" />
                </div>
                <div class="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-slate-100 text-slate-400 group-hover:bg-[#0D47A1] group-hover:text-white dark:bg-slate-700 dark:text-slate-300 transition-colors">
                  <ArrowUpRight class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                </div>
              </div>

              <!-- Title -->
              <h3 class="mt-2.5 sm:mt-3 text-xs sm:text-sm font-extrabold text-[#0A2458] group-hover:text-[#0D47A1] dark:text-white dark:group-hover:text-blue-300 line-clamp-2 leading-snug font-khmer min-h-[2.4rem] flex items-center">
                {{ localized(service.shortTitle, service.titleKh) }}
              </h3>

              <!-- Duration Pill -->
              <div class="mt-1.5 flex items-center gap-1 font-khmer">
                <span class="inline-flex items-center gap-1 rounded-md bg-slate-100/90 dark:bg-slate-700/60 px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-[10.5px] font-semibold text-slate-600 dark:text-slate-300">
                  <Clock3 class="h-3 w-3 shrink-0 text-slate-400" />
                  <span class="truncate">{{ formatShortDuration(service.processingTime, service.processingTimeKh, currentLanguage) }}</span>
                </span>
              </div>
            </div>

            <!-- Card Footer: View Guide & Subtle Arrow -->
            <div class="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2 text-[10.5px] sm:text-xs font-bold text-[#0D47A1] dark:text-blue-400 font-khmer">
              <span>{{ currentLanguage === 'kh' ? 'ពិនិត្យនីតិវិធី' : 'View Guide' }}</span>
              <ArrowRight class="h-3 w-3 group-hover:translate-x-1 transition-transform" />
            </div>
          </router-link>
        </div>
      </section>

      <!-- ============================================================
           6. PUBLIC JOBS & NEWS BULLETINS SPLIT SECTION
      ============================================================= -->
      <section class="scroll-reveal mt-5 grid gap-4 sm:gap-5 lg:grid-cols-2">
        <!-- Verified Job Opportunities -->
        <div class="section-card rounded-3xl bg-white p-4 sm:p-6 lg:p-7 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-4 dark:border-slate-700 min-w-0">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div class="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 ring-1 ring-violet-500/20 dark:bg-violet-950/60 dark:text-violet-300">
                  <Briefcase class="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div class="min-w-0">
                  <h2 class="text-sm sm:text-base font-black tracking-tight text-[#0A2458] dark:text-white font-khmer truncate">
                    {{ currentLanguage === 'kh' ? 'ឱកាសការងារសាធារណៈ & ឯកជន' : 'Public & Career Opportunities' }}
                  </h2>
                  <p class="text-[10.5px] sm:text-[11px] text-slate-400 font-medium font-khmer truncate">
                    {{ currentLanguage === 'kh' ? 'ការងារពីក្រុមហ៊ុន និងស្ថាប័នផ្ទៀងផ្ទាត់' : 'Verified vacancies with clear salary details' }}
                  </p>
                </div>
              </div>
              <router-link
                to="/jobs"
                class="inline-flex items-center gap-1 text-xs font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400 font-khmer shrink-0"
              >
                <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
                <ArrowRight class="h-3.5 w-3.5" />
              </router-link>
            </div>

            <div class="mt-3.5 sm:mt-4 space-y-2.5 sm:space-y-3">
              <router-link
                v-for="job in latestJobs"
                :key="job.id"
                :to="`/jobs/${job.id}`"
                class="stagger-card group flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-3 sm:p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/40 dark:hover:bg-slate-800 min-w-0"
              >
                <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div class="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100/70 text-violet-700 font-bold text-sm shadow-xs dark:bg-violet-950/60 dark:text-violet-300 group-hover:scale-105 transition-transform">
                    <Building2 class="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                  </div>
                  <div class="min-w-0 flex-1 font-khmer">
                    <p class="truncate text-xs sm:text-sm font-black text-[#0A2458] group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300 transition-colors">
                      {{ job.title }}
                    </p>
                    <p class="mt-0.5 flex items-center gap-1 text-[10.5px] sm:text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      <span class="font-bold text-slate-700 dark:text-slate-300 truncate">{{ job.company }}</span>
                      <span class="text-slate-300 dark:text-slate-600">·</span>
                      <MapPin class="h-3 w-3 shrink-0 text-slate-400" />
                      <span class="truncate">{{ job.location }}</span>
                    </p>
                  </div>
                </div>

                <div class="flex items-center sm:flex-col sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-1.5 sm:pt-0 border-t border-slate-200/50 sm:border-t-0">
                  <span class="inline-flex items-center rounded-lg bg-emerald-50 px-2 py-0.5 text-[11px] sm:text-xs font-black text-emerald-700 ring-1 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300">
                    {{ job.salary }}
                  </span>
                  <span class="rounded-md bg-slate-200/70 px-1.5 py-0.5 text-[8.5px] sm:text-[9px] font-bold text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                    {{ job.type }}
                  </span>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- Official Bulletins & News -->
        <div class="section-card rounded-3xl bg-white p-4 sm:p-6 lg:p-7 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 flex flex-col justify-between overflow-hidden min-w-0">
          <div>
            <div class="flex items-center justify-between gap-2 border-b border-slate-100 pb-3 sm:pb-4 dark:border-slate-700 min-w-0">
              <div class="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div class="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-950/60 dark:text-rose-300">
                  <Newspaper class="h-4.5 w-4.5 sm:h-5 sm:w-5" />
                </div>
                <div class="min-w-0">
                  <h2 class="text-sm sm:text-base font-black tracking-tight text-[#0A2458] dark:text-white font-khmer truncate">
                    {{ currentLanguage === 'kh' ? 'សេចក្តីជូនដំណឹង និងព័ត៌មានជាតិ' : 'Official Bulletins & Advisories' }}
                  </h2>
                  <p class="text-[10.5px] sm:text-[11px] text-slate-400 font-medium font-khmer truncate">
                    {{ currentLanguage === 'kh' ? 'ព័ត៌មានសុខភាព សង្គម និងការអភិវឌ្ឍ' : 'Verified public interest notices' }}
                  </p>
                </div>
              </div>
              <router-link
                to="/news"
                class="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 font-khmer shrink-0"
              >
                <span>{{ currentLanguage === 'kh' ? 'មើលទាំងអស់' : 'View all' }}</span>
                <ArrowRight class="h-3.5 w-3.5" />
              </router-link>
            </div>

            <div class="mt-3.5 sm:mt-4 space-y-2.5 sm:space-y-3">
              <router-link
                v-for="item in latestNews"
                :key="item.id"
                :to="`/news/${item.id}`"
                class="stagger-card group flex items-center gap-2.5 sm:gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-2.5 sm:p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-rose-200 hover:bg-white hover:shadow-md dark:border-slate-700/60 dark:bg-slate-800/40 dark:hover:bg-slate-800 min-w-0"
              >
                <div class="flex h-14 w-18 sm:h-16 sm:w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-slate-100 shadow-xs dark:bg-slate-700">
                  <img v-if="item.image" :src="item.image" :alt="item.title" class="h-full w-full object-cover transition duration-300 group-hover:scale-110">
                  <Newspaper v-else class="h-5 w-5 text-rose-400" />
                </div>
                <div class="min-w-0 flex-1 font-khmer">
                  <p class="line-clamp-2 text-xs sm:text-sm font-black text-[#0A2458] group-hover:text-rose-600 dark:text-white dark:group-hover:text-rose-400 transition-colors leading-snug">
                    {{ localized(item.title, item.titleKh) }}
                  </p>
                  <p class="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                    <span class="rounded-full bg-rose-50 px-2 py-0.5 font-bold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
                      {{ item.category }}
                    </span>
                    <span class="flex items-center gap-1">
                      <Clock3 class="h-3 w-3" />
                      {{ item.date }}
                    </span>
                  </p>
                </div>
                <div class="hidden sm:flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-slate-300 shadow-2xs transition-all group-hover:translate-x-1 group-hover:bg-rose-50 group-hover:text-rose-600 dark:bg-slate-700">
                  <ChevronRight class="h-4 w-4" />
                </div>
              </router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           7. 3-STEP CITIZEN GUIDE & SERVICE CHARTER
      ============================================================= -->
      <section class="section-card scroll-reveal mt-5 rounded-3xl bg-white p-4 sm:p-6 lg:p-8 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800 dark:ring-slate-700 overflow-hidden">
        <div class="text-center max-w-xl mx-auto">
          <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3.5 py-1 text-xs font-bold text-[#0D47A1] ring-1 ring-blue-500/20 dark:bg-blue-950/60 dark:text-blue-300 font-khmer">
            <Sparkles class="h-3.5 w-3.5 text-amber-500" />
            <span>{{ currentLanguage === 'kh' ? 'ងាយស្រួល ៣ ជំហានសម្រាប់ប្រជាពលរដ្ឋ' : '3-Step Citizen Action Guide' }}</span>
          </div>
          <h2 class="mt-2.5 sm:mt-3 text-base sm:text-2xl font-black tracking-tight text-[#0A2458] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'របៀបប្រើប្រាស់ CamLife ឱ្យមានប្រសិទ្ធភាព' : 'How CamLife Serves Every Citizen' }}
          </h2>
          <p class="mt-1 sm:mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-khmer">
            {{ currentLanguage === 'kh' ? 'ស្វែងរក ផ្ទៀងផ្ទាត់ និងសម្រេចកិច្ចការប្រចាំថ្ងៃរបស់អ្នកយ៉ាងរលូន' : 'Search, prepare required documents, and complete tasks with confidence' }}
          </p>
        </div>

        <div class="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4 font-khmer">
          <!-- Step 1 -->
          <router-link
            to="/government"
            class="stagger-card group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-100 bg-gradient-to-b from-blue-50/40 via-white to-white p-4 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-slate-700 dark:from-slate-800/80 dark:to-slate-800"
          >
            <div>
              <div class="flex items-center justify-between">
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-blue-100 text-[#0D47A1] ring-2 ring-blue-500/20 shadow-xs transition-transform duration-200 group-hover:scale-110 dark:bg-blue-950 dark:text-blue-300">
                  <Search class="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span class="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-blue-50 text-xs font-black text-[#0D47A1] dark:bg-blue-950/60 dark:text-blue-300 font-mono">
                  01
                </span>
              </div>
              <h3 class="mt-3 sm:mt-4 text-xs sm:text-sm font-extrabold text-[#0A2458] group-hover:text-[#0D47A1] dark:text-white dark:group-hover:text-blue-300 transition-colors font-khmer">
                {{ currentLanguage === 'kh' ? '១. ស្វែងរកសេវា ឬបញ្ហាដែលចង់ដោះស្រាយ' : '1. Search Service or Need' }}
              </h3>
              <p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'វាយបញ្ចូលពាក្យគន្លឹះដើម្បីស្វែងរកមន្ទីរពេទ្យ សេវាសាធារណៈ ការងារ ឬលេខសង្គ្រោះបន្ទាន់ដែលអ្នកត្រូវការ។' : 'Use Smart Search to quickly find verified procedures, clinics, or crisis helplines.' }}
              </p>
            </div>
            <div class="mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-[#0D47A1] dark:text-blue-400">
              <span>{{ currentLanguage === 'kh' ? 'ស្វែងរកសេវាឥឡូវនេះ' : 'Search Services Now' }}</span>
              <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </router-link>

          <!-- Step 2 -->
          <router-link
            to="/government/national-id-card"
            class="stagger-card group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-100 bg-gradient-to-b from-emerald-50/40 via-white to-white p-4 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-slate-700 dark:from-slate-800/80 dark:to-slate-800"
          >
            <div>
              <div class="flex items-center justify-between">
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 ring-2 ring-emerald-500/20 shadow-xs transition-transform duration-200 group-hover:scale-110 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckSquare class="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span class="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-50 text-xs font-black text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300 font-mono">
                  02
                </span>
              </div>
              <h3 class="mt-3 sm:mt-4 text-xs sm:text-sm font-extrabold text-[#0A2458] group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300 transition-colors font-khmer">
                {{ currentLanguage === 'kh' ? '២. ពិនិត្យបញ្ជីឯកសារ & ថ្លៃសេវា' : '2. Check Document Checklist' }}
              </h3>
              <p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រើប្រាស់ Interactive Checklist ដើម្បីផ្ទៀងផ្ទាត់ឯកសារដែលអ្នកមាន និងដឹងពីថ្លៃសេវាផ្លូវការច្បាស់លាស់។' : 'Use interactive checklists to prepare all papers before visiting administrative offices.' }}
              </p>
            </div>
            <div class="mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>{{ currentLanguage === 'kh' ? 'សាកល្បងពិនិត្យឯកសារ' : 'Try Document Checklist' }}</span>
              <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </router-link>

          <!-- Step 3 -->
          <router-link
            to="/locations"
            class="stagger-card group relative flex flex-col justify-between rounded-2xl sm:rounded-3xl border border-slate-100 bg-gradient-to-b from-violet-50/40 via-white to-white p-4 sm:p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-slate-700 dark:from-slate-800/80 dark:to-slate-800"
          >
            <div>
              <div class="flex items-center justify-between">
                <div class="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 ring-2 ring-violet-500/20 shadow-xs transition-transform duration-200 group-hover:scale-110 dark:bg-violet-950 dark:text-violet-300">
                  <BadgeCheck class="h-5 w-5 sm:h-6 sm:w-6" />
                </div>
                <span class="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-violet-50 text-xs font-black text-violet-600 dark:bg-violet-950/60 dark:text-violet-300 font-mono">
                  03
                </span>
              </div>
              <h3 class="mt-3 sm:mt-4 text-xs sm:text-sm font-extrabold text-[#0A2458] group-hover:text-violet-600 dark:text-white dark:group-hover:text-violet-300 transition-colors font-khmer">
                {{ currentLanguage === 'kh' ? '៣. ទៅកាន់ការិយាល័យ & បំពេញកិច្ចការ' : '3. Complete with Confidence' }}
              </h3>
              <p class="mt-1.5 sm:mt-2 text-[11px] sm:text-xs leading-relaxed text-slate-500 dark:text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'ទៅកាន់ការិយាល័យច្រកចេញចូលតែមួយ ឬទាក់ទងលេខផ្ទាល់ ដើម្បីសម្រេចកិច្ចការរបស់អ្នកដោយរលូន។' : 'Follow office maps, submit required papers, and complete your tasks smoothly.' }}
              </p>
            </div>
            <div class="mt-4 sm:mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs font-bold text-violet-600 dark:text-violet-400">
              <span>{{ currentLanguage === 'kh' ? 'រុករកទីតាំងការិយាល័យ' : 'Explore Public Offices' }}</span>
              <ArrowRight class="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </router-link>
        </div>
      </section>

      <!-- ============================================================
           8. CITIZEN NEWSLETTER & ADVISORY SUBSCRIPTION
      ============================================================= -->
      <section class="scroll-reveal relative mt-5 overflow-hidden rounded-3xl bg-gradient-to-r from-[#0A2540] via-[#0D47A1] to-[#1565C0] p-6 text-white sm:p-8">
        <div class="absolute bottom-[-2rem] right-5 opacity-15 pointer-events-none">
          <Bell class="h-36 w-36" />
        </div>
        <div class="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between font-khmer">
          <div>
            <h2 class="text-lg sm:text-xl font-black">
              {{ currentLanguage === 'kh' ? 'ទទួលសេចក្តីជូនដំណឹង និងព័ត៌មានជាតិថ្មីៗពី CamLife' : 'Stay Informed with Public Citizen Advisories' }}
            </h2>
            <p class="mt-1 text-xs text-blue-100 max-w-xl">
              {{ currentLanguage === 'kh' ? 'ទទួលបានការជូនដំណឹងពីការប្រកាសសេវាសាធារណៈ ថ្ងៃឈប់សម្រាកជាតិ និងឱកាសការងារសំខាន់ៗ។' : 'Receive updates on new civic services, official public notices, and career alerts.' }}
            </p>
          </div>
          <form class="flex max-w-md flex-1 rounded-2xl bg-white p-1.5 shadow-lg" @submit.prevent="submitNewsletter">
            <input
              v-model="newsletterEmail"
              type="email"
              required
              class="min-w-0 flex-1 rounded-xl border-0 bg-transparent px-3.5 text-xs text-slate-800 outline-none placeholder:text-slate-400 focus:ring-0 font-khmer"
              :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលអ៊ីមែលរបស់អ្នក...' : 'Enter your email address...'"
            />
            <button
              type="submit"
              class="rounded-xl bg-[#0D47A1] hover:bg-[#0A2540] px-5 py-2.5 text-xs font-bold text-white transition font-khmer"
            >
              {{ newsletterSubscribed ? (currentLanguage === 'kh' ? 'បានជាវរួចរាល់!' : 'Subscribed!') : (currentLanguage === 'kh' ? 'ជាវដំណឹង' : 'Subscribe') }}
            </button>
          </form>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.reference-home {
  background:
    radial-gradient(70rem 30rem at 50% 0%, rgba(196, 222, 255, .7), transparent 70%),
    linear-gradient(180deg, #f5f9ff 0%, #f9fbff 46%, #edf4ff 100%);
}

:global(.dark) .reference-home {
  background-color: #0b1727;
  background-image: none;
}

.hero-card { box-shadow: 0 8px 28px rgba(22, 55, 107, .06); }

.hero-illustration-mask {
  -webkit-mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 6%, rgba(0, 0, 0, 0.8) 18%, black 28%);
  mask-image: linear-gradient(to right, transparent 0%, rgba(0, 0, 0, 0.2) 6%, rgba(0, 0, 0, 0.8) 18%, black 28%);
}

/* Scroll reveal bidirectional animations */
.scroll-reveal {
  opacity: 0;
  transform: translateY(30px) scale(0.985);
  transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.scroll-reveal.reveal-in {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.scroll-reveal.reveal-out {
  opacity: 0;
  transform: translateY(24px) scale(0.985);
  transition: opacity 0.45s ease-out, transform 0.45s ease-out;
}

/* Stagger cards within revealed sections */
.scroll-reveal .stagger-card {
  opacity: 0;
  transform: translateY(18px);
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s, border-color 0.2s, background-color 0.2s;
}

.scroll-reveal.reveal-in .stagger-card {
  opacity: 1;
  transform: translateY(0);
}

.scroll-reveal.reveal-in .stagger-card:nth-child(1) { transition-delay: 40ms; }
.scroll-reveal.reveal-in .stagger-card:nth-child(2) { transition-delay: 80ms; }
.scroll-reveal.reveal-in .stagger-card:nth-child(3) { transition-delay: 120ms; }
.scroll-reveal.reveal-in .stagger-card:nth-child(4) { transition-delay: 160ms; }
.scroll-reveal.reveal-in .stagger-card:nth-child(5) { transition-delay: 200ms; }
.scroll-reveal.reveal-in .stagger-card:nth-child(6) { transition-delay: 240ms; }
.scroll-reveal.reveal-in .stagger-card:nth-child(7) { transition-delay: 280ms; }

@media (prefers-reduced-motion: reduce) {
  .scroll-reveal,
  .scroll-reveal .stagger-card {
    opacity: 1 !important;
    transform: none !important;
    transition: none !important;
  }
}
</style>
