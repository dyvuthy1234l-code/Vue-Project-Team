<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertTriangle,
  Ambulance,
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Flame,
  HeartPulse,
  Hospital,
  MapPin,
  Phone,
  PhoneCall,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  UserCheck,
  Zap
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getEmergencyContacts } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'
import LocationSelector from '@/components/LocationSelector.vue'

const { currentLanguage, localized } = useLanguage()

usePageMeta({
  title: 'National Emergency Numbers — CamLife',
  description: 'Instant 1-touch emergency numbers for Cambodia: Police (117), Ambulance (119), Fire (118), and 24/7 helplines.'
})

const contacts = getEmergencyContacts()
const searchQuery = ref('')
const selectedCategory = ref('all')
const copiedNumber = ref<string | null>(null)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

function copyToClipboard(num: string) {
  if (navigator?.clipboard?.writeText) {
    navigator.clipboard.writeText(num).then(() => {
      copiedNumber.value = num
      if (copyTimeout) clearTimeout(copyTimeout)
      copyTimeout = setTimeout(() => {
        copiedNumber.value = null
      }, 2500)
    })
  } else {
    // Fallback
    copiedNumber.value = num
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedNumber.value = null
    }, 2500)
  }
}

const mainContacts = computed(() => contacts.filter(c => c.priority <= 3))

const categories = computed(() => [
  { id: 'all', label: currentLanguage.value === 'kh' ? 'ទាំងអស់' : 'All Hotlines' },
  { id: 'core', label: currentLanguage.value === 'kh' ? '៣ លេខចម្បង (117, 118, 119)' : 'Core 3-Digit (117, 118, 119)' },
  { id: 'security', label: currentLanguage.value === 'kh' ? 'សន្តិសុខ & ប៉ូលីស' : 'Police & Security' },
  { id: 'health', label: currentLanguage.value === 'kh' ? 'សុខាភិបាល & សង្គ្រោះ' : 'Health & Ambulance' },
  { id: 'citizen', label: currentLanguage.value === 'kh' ? 'ជំនួយសង្គម & សាធារណៈ' : 'Citizen Helplines' }
])

const filteredContacts = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  return contacts.filter(c => {
    // Category filter
    let matchesCategory = true
    if (selectedCategory.value === 'core') {
      matchesCategory = c.priority <= 3
    } else if (selectedCategory.value === 'security') {
      matchesCategory = c.id === 'police' || c.id === 'tourist-police-hotline'
    } else if (selectedCategory.value === 'health') {
      matchesCategory = c.id === 'ambulance' || c.id === 'cdc-disease-hotline'
    } else if (selectedCategory.value === 'citizen') {
      matchesCategory = c.priority > 3
    }

    if (!matchesCategory) return false

    // Search query filter
    if (!query) return true
    return (
      c.number.toLowerCase().includes(query) ||
      c.name.toLowerCase().includes(query) ||
      (c.nameKh && c.nameKh.toLowerCase().includes(query)) ||
      c.description.toLowerCase().includes(query) ||
      (c.descriptionKh && c.descriptionKh.toLowerCase().includes(query))
    )
  })
})

function getContactBadge(id: string) {
  if (id === 'police') return { text: currentLanguage.value === 'kh' ? 'សន្តិសុខជាតិ ២៤/៧' : 'National Security 24/7', bg: 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300' }
  if (id === 'fire') return { text: currentLanguage.value === 'kh' ? 'ពន្លត់អគ្គីភ័យ & សង្គ្រោះ' : 'Fire & Disaster Rescue', bg: 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300' }
  if (id === 'ambulance') return { text: currentLanguage.value === 'kh' ? 'សង្គ្រោះបន្ទាន់ SAMU' : 'SAMU Ambulance Dispatch', bg: 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300' }
  if (id === 'tourist-police-hotline') return { text: currentLanguage.value === 'kh' ? 'ពហុភាសា' : 'Multilingual', bg: 'bg-violet-100 text-violet-800 dark:bg-violet-950/70 dark:text-violet-300' }
  if (id === 'child-protection-hotline') return { text: currentLanguage.value === 'kh' ? 'ការពារកុមារ' : 'Child Protection', bg: 'bg-pink-100 text-pink-800 dark:bg-pink-950/70 dark:text-pink-300' }
  if (id === 'road-traffic-assistance') return { text: currentLanguage.value === 'kh' ? 'ផ្លូវល្បឿនលឿន' : 'Expressway Rescue', bg: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300' }
  if (id === 'cdc-disease-hotline') return { text: currentLanguage.value === 'kh' ? 'ជំងឺឆ្លង CDC' : 'Infectious Disease CDC', bg: 'bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300' }
  if (id === 'edc-electricity-emergency') return { text: currentLanguage.value === 'kh' ? 'អគ្គិសនី EDC' : 'EDC Electricity Outage', bg: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/70 dark:text-yellow-300' }
  return { text: currentLanguage.value === 'kh' ? 'បន្ទាន់' : 'Emergency', bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300' }
}

function getCardTheme(id: string) {
  if (id === 'police') {
    return {
      border: 'border-blue-200 dark:border-blue-900/70 hover:border-blue-400 dark:hover:border-blue-600',
      gradient: 'from-blue-50/60 via-white to-white dark:from-blue-950/30 dark:via-slate-800 dark:to-slate-800',
      iconBg: 'bg-blue-600 text-white shadow-blue-500/25',
      numberColor: 'text-[#0D47A1] dark:text-blue-400',
      btnBg: 'bg-[#1456E5] hover:bg-[#0D47A1] text-white shadow-blue-600/25',
      ring: 'ring-blue-500/20'
    }
  }
  if (id === 'fire') {
    return {
      border: 'border-amber-200 dark:border-amber-900/70 hover:border-amber-400 dark:hover:border-amber-600',
      gradient: 'from-amber-50/60 via-white to-white dark:from-amber-950/30 dark:via-slate-800 dark:to-slate-800',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-orange-500/25',
      numberColor: 'text-amber-600 dark:text-amber-400',
      btnBg: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-orange-600/25',
      ring: 'ring-amber-500/20'
    }
  }
  if (id === 'ambulance') {
    return {
      border: 'border-rose-200 dark:border-rose-900/70 hover:border-rose-400 dark:hover:border-rose-600',
      gradient: 'from-rose-50/60 via-white to-white dark:from-rose-950/30 dark:via-slate-800 dark:to-slate-800',
      iconBg: 'bg-gradient-to-br from-rose-600 to-red-600 text-white shadow-rose-500/25',
      numberColor: 'text-[#E53935] dark:text-rose-400',
      btnBg: 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white shadow-red-600/25',
      ring: 'ring-rose-500/20'
    }
  }
  return {
    border: 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600',
    gradient: 'from-slate-50/50 via-white to-white dark:from-slate-800 dark:via-slate-800 dark:to-slate-800',
    iconBg: 'bg-slate-700 text-white shadow-slate-500/25',
    numberColor: 'text-slate-800 dark:text-white',
    btnBg: 'bg-[#1456E5] hover:bg-[#0D47A1] text-white shadow-blue-600/20',
    ring: 'ring-slate-500/20'
  }
}

function getSecondaryIcon(iconName: string) {
  if (iconName === 'shield') return ShieldAlert
  if (iconName === 'flame') return Flame
  if (iconName === 'ambulance') return Ambulance
  if (iconName === 'user-check') return UserCheck
  if (iconName === 'heart') return HeartPulse
  if (iconName === 'car') return Zap
  return Phone
}

const emergencySteps = computed(() => [
  {
    step: '01',
    title: currentLanguage.value === 'kh' ? 'រក្សាភាពស្ងប់ស្ងាត់' : 'Stay Calm & Composed',
    desc: currentLanguage.value === 'kh' ? 'ដកដង្ហើមវែងៗ គ្រប់គ្រងអារម្មណ៍ ដើម្បីនិយាយរៀបរាប់ហេតុការណ៍ឱ្យបានច្បាស់លាស់។' : 'Take a deep breath and speak clearly so the dispatcher understands your emergency.',
    icon: ShieldCheck,
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/50'
  },
  {
    step: '02',
    title: currentLanguage.value === 'kh' ? 'បញ្ជាក់ទីតាំងឱ្យច្បាស់' : 'Provide Exact Location',
    desc: currentLanguage.value === 'kh' ? 'ប្រាប់ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ ឬចំណុចសម្គាល់ធំៗជិតបំផុត (ផ្សារ សាលា វត្ត)។' : 'State your exact street, building number, sangkat, khan, or nearby recognizable landmark.',
    icon: MapPin,
    color: 'text-rose-600 dark:text-rose-400',
    bg: 'bg-rose-50 dark:bg-rose-950/50'
  },
  {
    step: '03',
    title: currentLanguage.value === 'kh' ? 'រៀបរាប់ពីស្ថានភាព' : 'Describe the Situation',
    desc: currentLanguage.value === 'kh' ? 'បញ្ជាក់ពីប្រភេទគ្រោះថ្នាក់ ចំនួនអ្នករងរបួស ឬស្ថានភាពបន្ទាន់ដែលកំពុងកើតឡើង។' : 'Explain what happened, number of injured people, and any immediate hazards present.',
    icon: AlertTriangle,
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/50'
  },
  {
    step: '04',
    title: currentLanguage.value === 'kh' ? 'កុំទម្លាក់ទូរស័ព្ទមុន' : 'Keep the Line Open',
    desc: currentLanguage.value === 'kh' ? 'រង់ចាំការណែនាំពីភ្នាក់ងារជំនាញ រហូតដល់គេប្រាប់ឱ្យបិទទូរស័ព្ទជាស្ថាពរ។' : 'Follow the operator’s instructions and do not hang up until they tell you to do so.',
    icon: PhoneCall,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/50'
  }
])

// Emergency Map Stations (Hospitals, Police, Fire)
interface EmergencyStation {
  id: string
  name: string
  nameKh: string
  type: 'hospital' | 'police' | 'fire'
  address: string
  addressKh: string
  phone: string
  coords: { x: number; y: number }
  gmapsQuery: string
}

const mapStations = ref<EmergencyStation[]>([
  {
    id: 'calmette-hospital',
    name: 'Calmette Hospital — National Trauma & ER Center',
    nameKh: 'មន្ទីរពេទ្យកាល់ម៉ែត — មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់ជាតិ',
    type: 'hospital',
    address: 'No. 3, Preah Monivong Blvd, Sangkat Srah Chak, Khan Doun Penh, Phnom Penh',
    addressKh: 'ផ្ទះលេខ ៣ មហាវិថីព្រះមុនីវង្ស សង្កាត់ស្រះចក ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
    phone: '+855 23 426 948',
    coords: { x: 52, y: 35 },
    gmapsQuery: 'Calmette Hospital Phnom Penh'
  },
  {
    id: 'khmer-soviet-hospital',
    name: 'Khmer-Soviet Friendship Hospital (Russian Hospital)',
    nameKh: 'មន្ទីរពេទ្យមិត្តភាពខ្មែរ-សូវៀត (ពេទ្យរុស្ស៊ី)',
    type: 'hospital',
    address: 'Street 271, Sangkat Tumnub Teuk, Khan Boeung Keng Kang, Phnom Penh',
    addressKh: 'ផ្លូវ ២៧១ សង្កាត់ទំនប់ទឹក ខណ្ឌបឹងកេងកង រាជធានីភ្នំពេញ',
    phone: '+855 23 217 764',
    coords: { x: 44, y: 68 },
    gmapsQuery: 'Khmer-Soviet Friendship Hospital'
  },
  {
    id: 'kossamak-hospital',
    name: 'Preah Kossamak Hospital (Cambodia-China Friendship)',
    nameKh: 'មន្ទីរពេទ្យព្រះកុសុមៈ (មិត្តភាពកម្ពុជា-ចិន)',
    type: 'hospital',
    address: 'St. 271, Sangkat Teuk Thla, Khan Sen Sok, Phnom Penh',
    addressKh: 'ផ្លូវ ២៧១ សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ',
    phone: '+855 23 880 234',
    coords: { x: 30, y: 48 },
    gmapsQuery: 'Preah Kossamak Hospital Phnom Penh'
  },
  {
    id: 'national-police-commissariat',
    name: 'Phnom Penh Municipal Police Commissariat',
    nameKh: 'ស្នងការដ្ឋាននគរបាលរាជធានីភ្នំពេញ (បញ្ជាការដ្ឋាន ១១៧)',
    type: 'police',
    address: 'Street 598, Sangkat Chrang Chamreh 1, Khan Russey Keo, Phnom Penh',
    addressKh: 'ផ្លូវ ៥៩៨ សង្កាត់ច្រាំងចំរេះទី១ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ',
    phone: '117',
    coords: { x: 42, y: 22 },
    gmapsQuery: 'Phnom Penh Municipal Police Commissariat'
  },
  {
    id: 'central-traffic-police',
    name: 'Central Traffic & Order Police Headquarters',
    nameKh: 'ការិយាល័យនគរបាលចរាចរណ៍ផ្លូវគោកភ្នំពេញ',
    type: 'police',
    address: 'Russian Federation Blvd, Khan Tuol Kouk, Phnom Penh',
    addressKh: 'មហាវិថីសហព័ន្ធរុស្ស៊ី ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
    phone: '+855 12 999 117',
    coords: { x: 48, y: 52 },
    gmapsQuery: 'Phnom Penh Traffic Police Office'
  },
  {
    id: 'central-fire-rescue',
    name: 'Phnom Penh Central Fire & Rescue Brigade',
    nameKh: 'កងកម្លាំងនគរបាលបង្ការ និងពន្លត់អគ្គីភ័យរាជធានីភ្នំពេញ',
    type: 'fire',
    address: 'Near Olympic Stadium, Khan 7 Makara, Phnom Penh',
    addressKh: 'ក្បែរស្តាតអូឡាំពិក ខណ្ឌ៧មករា រាជធានីភ្នំពេញ',
    phone: '118',
    coords: { x: 50, y: 58 },
    gmapsQuery: 'Phnom Penh Fire Station Olympic'
  },
  {
    id: 'chroy-changvar-fire',
    name: 'Chroy Changvar Rapid Fire Response Depot',
    nameKh: 'ស្ថានីយពន្លត់អគ្គីភ័យឆ្លើយតបរហ័ស ជ្រោយចង្វារ',
    type: 'fire',
    address: 'National Road 6A, Sangkat Chroy Changvar, Phnom Penh',
    addressKh: 'ផ្លូវជាតិលេខ ៦A សង្កាត់ជ្រោយចង្វារ រាជធានីភ្នំពេញ',
    phone: '+855 23 724 118',
    coords: { x: 68, y: 28 },
    gmapsQuery: 'Chroy Changvar Fire Station'
  }
])

const activeMapFilter = ref<'all' | 'hospital' | 'police' | 'fire'>('all')
const selectedStation = ref<EmergencyStation>(mapStations.value[0])

const mapFilters = computed<{ id: 'all' | 'hospital' | 'police' | 'fire'; label: string }[]>(() => [
  { id: 'all', label: currentLanguage.value === 'kh' ? 'ទាំងអស់ (៧)' : 'All Facilities (7)' },
  { id: 'hospital', label: currentLanguage.value === 'kh' ? '🏥 មន្ទីរពេទ្យ (119)' : '🏥 Hospitals' },
  { id: 'police', label: currentLanguage.value === 'kh' ? '👮 ប៉ូលីស (117)' : '👮 Police' },
  { id: 'fire', label: currentLanguage.value === 'kh' ? '🚒 ពន្លត់អគ្គីភ័យ (118)' : '🚒 Fire' }
])

const filteredMapStations = computed(() => {
  if (activeMapFilter.value === 'all') return mapStations.value
  return mapStations.value.filter(s => s.type === activeMapFilter.value)
})
</script>

<template>
  <div class="emergency-page-container min-h-screen pb-16 text-[#0A2540] dark:text-white">
    <!-- Ambient Background Glow -->
    <div class="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-gradient-to-b from-rose-100/40 via-blue-50/30 to-transparent dark:from-rose-950/20 dark:via-blue-950/10 dark:to-transparent" />

    <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-7">
      <!-- Breadcrumb -->
      <!-- Breadcrumb & 25 Provinces Location Selector -->
      <div class="flex flex-wrap items-center justify-between gap-4">
        <nav class="flex items-center gap-2 text-xs font-bold text-slate-400" aria-label="Breadcrumb">
          <router-link to="/" class="hover:text-[#1456E5] dark:hover:text-blue-400 transition-colors">
            {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}
          </router-link>
          <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
          <span class="text-[#0A2458] dark:text-slate-200">{{ currentLanguage === 'kh' ? 'សេវាសង្គ្រោះបន្ទាន់' : 'Emergency Help' }}</span>
        </nav>

        <LocationSelector variant="pill" />
      </div>

      <!-- Hero Header Banner with Representative Visual -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A1931] via-[#0E2A58] to-[#121B38] p-6 sm:p-8 text-white shadow-xl shadow-blue-950/15 ring-1 ring-white/10">
        <!-- Representative Background Image with Gradient Overlay -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden">
          <img
            src="/images/pillars/emergency.jpg"
            alt="Emergency Ambulance Dispatch"
            class="w-full h-full object-cover opacity-20 filter contrast-125 scale-105"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-[#0A1931]/95 via-[#0E2A58]/85 to-[#121B38]/90" />
        </div>

        <!-- Background decorative ambient circles -->
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rose-500/15 blur-3xl" />
        <div class="pointer-events-none absolute right-1/4 -bottom-16 h-48 w-48 rounded-full bg-blue-500/20 blur-2xl" />
        
        <div class="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div class="max-w-2xl space-y-3">
            <div class="inline-flex items-center gap-2 rounded-full bg-rose-500/20 px-3.5 py-1.5 text-xs font-extrabold text-rose-300 ring-1 ring-rose-400/30 backdrop-blur-md">
              <span class="flex h-2 w-2 rounded-full bg-red-400 animate-ping" />
              <span>{{ currentLanguage === 'kh' ? 'សេវាសង្គ្រោះបន្ទាន់ផ្លូវការ ២៤/៧' : 'Official Cambodian Emergency Hotlines 24/7' }}</span>
            </div>

            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {{ currentLanguage === 'kh' ? 'ជំនួយ និងលេខទូរស័ព្ទសង្គ្រោះបន្ទាន់' : 'Emergency Help & 1-Touch Hotlines' }}
            </h1>

            <p class="text-xs sm:text-sm text-slate-300 leading-relaxed font-khmer max-w-xl">
              {{ currentLanguage === 'kh'
                ? 'ចុចហៅទូរស័ព្ទបន្ទាន់ដោយឥតគិតថ្លៃទៅកាន់នគរបាលជាតិ (១១៧) សង្គ្រោះវេជ្ជសាស្ត្រ (១១៩) ពន្លត់អគ្គីភ័យ (១១៨) និងខ្សែទូរស័ព្ទជំនួយពលរដ្ឋទូទាំងកម្ពុជា។'
                : 'Direct 1-touch connection to National Police (117), Medical Ambulance (119), Fire & Rescue (118), and essential citizen helplines nationwide.'
              }}
            </p>
          </div>

          <!-- Quick SOS Indicator Stats -->
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2.5 shrink-0">
            <div class="flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-4 py-3 backdrop-blur-md border border-white/10">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                <PhoneCall class="h-4 w-4" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ការហៅចូល' : 'Dialing' }}</p>
                <p class="text-xs font-black text-white">{{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ ១០០%' : '100% Free of Charge' }}</p>
              </div>
            </div>

            <div class="flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-4 py-3 backdrop-blur-md border border-white/10">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-400">
                <Clock3 class="h-4 w-4" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ពេលវេលា' : 'Availability' }}</p>
                <p class="text-xs font-black text-white">{{ currentLanguage === 'kh' ? '២៤ ម៉ោង / ៧ ថ្ងៃ' : '24 Hours / 7 Days' }}</p>
              </div>
            </div>

            <div class="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-2xl bg-white/[0.08] px-4 py-3 backdrop-blur-md border border-white/10">
              <div class="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400">
                <ShieldCheck class="h-4 w-4" />
              </div>
              <div>
                <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ការឆ្លើយតប' : 'Dispatch' }}</p>
                <p class="text-xs font-black text-white">{{ currentLanguage === 'kh' ? 'ទូទាំងប្រទេស' : 'Nationwide Coverage' }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Urgent Important Notice Box -->
      <section class="rounded-2xl border border-rose-200/90 bg-rose-50/90 p-4 sm:p-5 dark:border-rose-900/60 dark:bg-rose-950/30 shadow-xs">
        <div class="flex items-start gap-3.5">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm shadow-rose-600/30 animate-pulse mt-0.5">
            <AlertTriangle class="h-5 w-5" />
          </div>
          <div class="space-y-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <h2 class="text-xs sm:text-sm font-black text-rose-950 dark:text-rose-200">
                {{ currentLanguage === 'kh' ? 'សេចក្តីណែនាំបន្ទាន់៖' : 'Important Emergency Instructions:' }}
              </h2>
              <span class="rounded-full bg-rose-200/80 px-2 py-0.5 text-[10px] font-bold text-rose-800 dark:bg-rose-900/60 dark:text-rose-300">
                {{ currentLanguage === 'kh' ? 'សូមអានមុនពេលហៅ' : 'Read Before Calling' }}
              </span>
            </div>
            <p class="text-xs text-rose-900/90 dark:text-rose-300 leading-relaxed font-khmer">
              {{ currentLanguage === 'kh'
                ? 'ក្នុងករណីមានហេតុការណ៍បន្ទាន់ សូមរក្សាភាពស្ងប់ស្ងាត់ ប្រាប់ទីតាំង ឬចំណុចសម្គាល់របស់អ្នកឱ្យបានច្បាស់លាស់ និងកុំទម្លាក់ទូរស័ព្ទមុនពេលភ្នាក់ងារបញ្ជាក់ចប់សព្វគ្រប់។'
                : 'In an emergency, stay calm, speak clearly, state your exact location or nearest landmark, and do not hang up until the operator instructs you to do so.'
              }}
            </p>
          </div>
        </div>
      </section>

      <!-- Search and Filter Bar -->
      <section class="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-xs">
        <!-- Search Input -->
        <div class="relative flex-1">
          <Search class="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកលេខបន្ទាន់ (ឧ. 117, ប៉ូលីស, អគ្គីភ័យ, សង្គ្រោះ, កុមារ...)' : 'Search hotline (e.g. 117, Police, Fire, SAMU, Child...)'"
            class="w-full rounded-xl border border-slate-200/80 bg-slate-50/50 py-2.5 pl-10 pr-3 text-xs sm:text-sm font-medium text-slate-800 outline-none transition focus:border-[#1456E5] focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-blue-500"
          >
        </div>

        <!-- Filter Chips -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <button
            v-for="cat in categories"
            :key="cat.id"
            type="button"
            :class="[
              'whitespace-nowrap rounded-xl px-3 py-2 text-xs font-bold transition-all',
              selectedCategory === cat.id
                ? 'bg-[#1456E5] text-white shadow-sm shadow-blue-600/20'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            ]"
            @click="selectedCategory = cat.id"
          >
            {{ cat.label }}
          </button>
        </div>
      </section>

      <!-- TOP 3 HIGH-PRIORITY SPEED DIAL CARDS -->
      <section v-if="selectedCategory === 'all' || selectedCategory === 'core'" class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 font-bold text-xs">
              <Sparkles class="h-4 w-4" />
            </div>
            <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white">
              {{ currentLanguage === 'kh' ? '៣ ខ្សែទូរស័ព្ទសង្គ្រោះបន្ទាន់ជាតិចម្បង' : 'Primary National Hotlines' }}
            </h2>
          </div>
          <span class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-1 text-[10px] font-black text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-950/50 dark:text-rose-300">
            <span class="h-1.5 w-1.5 rounded-full bg-rose-600 animate-pulse" />
            24/7 FREE SPEED DIAL
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          <div
            v-for="contact in mainContacts"
            :key="contact.id"
            :class="[
              'group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 bg-gradient-to-b p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl dark:shadow-slate-950/40',
              getCardTheme(contact.id).border,
              getCardTheme(contact.id).gradient
            ]"
          >
            <!-- Card Header Badge & Icon -->
            <div>
              <div class="flex items-center justify-between gap-2">
                <span :class="['rounded-full px-2.5 py-1 text-[10px] font-black tracking-wider uppercase shadow-2xs', getContactBadge(contact.id).bg]">
                  {{ getContactBadge(contact.id).text }}
                </span>

                <div class="relative w-14 h-14 rounded-2xl overflow-hidden shadow-md border-2 border-white/80 dark:border-slate-700 shrink-0">
                  <img
                    v-if="contact.image"
                    :src="contact.image"
                    :alt="contact.name"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div v-else :class="['w-full h-full flex items-center justify-center', getCardTheme(contact.id).iconBg]">
                    <component :is="getSecondaryIcon(contact.icon)" class="h-6 w-6" />
                  </div>
                  <div :class="['absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center border border-white dark:border-slate-800 shadow-xs', getCardTheme(contact.id).iconBg]">
                    <component :is="getSecondaryIcon(contact.icon)" class="h-3 w-3" />
                  </div>
                </div>
              </div>

              <!-- Titles -->
              <div class="mt-4">
                <h3 class="text-lg sm:text-xl font-black text-[#0A2458] dark:text-white font-khmer line-clamp-1">
                  {{ contact.nameKh || contact.name }}
                </h3>
                <p class="text-xs font-semibold text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {{ contact.name }}
                </p>
              </div>

              <!-- Giant 3-Digit Hotline Number -->
              <div class="my-4 flex items-baseline justify-center rounded-2xl bg-white/80 py-3 shadow-inner ring-1 ring-slate-100 backdrop-blur-sm dark:bg-slate-900/80 dark:ring-slate-700/80">
                <span :class="['text-5xl sm:text-6xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-105', getCardTheme(contact.id).numberColor]">
                  {{ contact.number }}
                </span>
              </div>

              <!-- Description -->
              <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-khmer min-h-[2.5rem]">
                {{ localized(contact.description, contact.descriptionKh) }}
              </p>
            </div>

            <!-- Action Buttons: Green Call Trigger & Copy Number -->
            <div class="mt-6 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
              <a
                :href="`tel:${contact.number}`"
                :class="[
                  'relative group/btn flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-2xl font-black text-sm text-white shadow-lg transition-all duration-200 active:scale-98 overflow-hidden',
                  contact.id === 'police' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-blue-600/30' :
                  contact.id === 'fire' ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-orange-600/30' :
                  'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-red-600/30'
                ]"
              >
                <!-- Embedded Green Call Pill Accent -->
                <div class="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm ring-1 ring-white/30 transition-transform group-hover/btn:scale-110">
                  <PhoneCall class="h-3.5 w-3.5" />
                </div>
                <span>{{ currentLanguage === 'kh' ? `ចុចទូរស័ព្ទ ${contact.number}` : `Call Now ${contact.number}` }}</span>
              </a>

              <button
                type="button"
                class="flex w-full items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white/90 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-100 hover:text-[#0A2458] dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:bg-slate-700"
                @click="copyToClipboard(contact.number)"
              >
                <component :is="copiedNumber === contact.number ? Check : Copy" class="h-3.5 w-3.5" />
                <span>{{ copiedNumber === contact.number ? (currentLanguage === 'kh' ? 'បានចម្លងលេខ!' : 'Copied!') : (currentLanguage === 'kh' ? `ចម្លងលេខ ${contact.number}` : `Copy ${contact.number}`) }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- 4-STEP CITIZEN EMERGENCY PROTOCOL -->
      <section class="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm ring-1 ring-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:ring-slate-700 sm:p-7">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#1456E5] ring-1 ring-blue-500/20 dark:bg-blue-950/50 dark:text-blue-300">
            <ShieldCheck class="h-3.5 w-3.5" />
            {{ currentLanguage === 'kh' ? 'ការណែនាំសុវត្ថិភាព' : 'Safety Protocols' }}
          </div>
          <h2 class="mt-2 text-lg sm:text-xl font-black tracking-tight text-[#0A2458] dark:text-white">
            {{ currentLanguage === 'kh' ? '៤ ជំហានសំខាន់ៗពេលទូរស័ព្ទសុំជំនួយបន្ទាន់' : '4 Essential Steps When Calling for Help' }}
          </h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 font-khmer">
            {{ currentLanguage === 'kh' ? 'អនុវត្តតាមជំហានទាំងនេះ ដើម្បីឱ្យក្រុមសង្គ្រោះអាចជួយអ្នកបានលឿន និងចំគោលដៅបំផុត។' : 'Follow these steps to help emergency responders reach you quickly and accurately.' }}
          </p>
        </div>

        <div class="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="item in emergencySteps"
            :key="item.step"
            class="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all duration-200 hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-md dark:border-slate-700/70 dark:bg-slate-800/50 dark:hover:bg-slate-800"
          >
            <div>
              <div class="flex items-center justify-between">
                <div :class="['flex h-10 w-10 items-center justify-center rounded-xl shadow-xs transition-transform duration-200 group-hover:scale-110', item.bg, item.color]">
                  <component :is="item.icon" class="h-5 w-5" />
                </div>
                <span class="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-xs font-black text-slate-400 shadow-2xs border border-slate-100 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
                  {{ item.step }}
                </span>
              </div>

              <h3 class="mt-3 text-sm font-extrabold text-[#0A2458] dark:text-white font-khmer">
                {{ item.title }}
              </h3>

              <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-khmer">
                {{ item.desc }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ALL FILTERED OR SPECIALIZED HELPLINES -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-[#1456E5] dark:bg-blue-950/60 dark:text-blue-400 font-bold text-xs">
              <Phone class="h-4 w-4" />
            </div>
            <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458] dark:text-white">
              {{ currentLanguage === 'kh' ? 'ខ្សែទូរស័ព្ទជំនួយ និងសេវាសាធារណៈទាំងអស់' : 'All Emergency & Specialized Helplines' }}
            </h2>
          </div>
          <span class="text-xs font-bold text-slate-400">
            {{ filteredContacts.length }} {{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contacts' }}
          </span>
        </div>

        <div v-if="filteredContacts.length === 0" class="rounded-2xl border border-slate-200 bg-white p-10 text-center dark:border-slate-700 dark:bg-slate-800">
          <p class="text-sm font-bold text-slate-500 dark:text-slate-400">
            {{ currentLanguage === 'kh' ? 'រកមិនឃើញលេខបន្ទាន់ដែលត្រូវនឹងការស្វែងរករបស់អ្នកទេ។' : 'No emergency contacts match your search query.' }}
          </p>
          <button
            type="button"
            class="mt-3 rounded-xl bg-blue-50 px-4 py-2 text-xs font-bold text-[#1456E5] dark:bg-blue-950/50"
            @click="searchQuery = ''; selectedCategory = 'all'"
          >
            {{ currentLanguage === 'kh' ? 'សម្អាតការស្វែងរក' : 'Reset Search' }}
          </button>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-800 dark:hover:border-blue-500/50"
          >
            <div class="flex items-start gap-3.5 min-w-0">
              <div class="relative h-14 w-14 shrink-0 rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 shadow-xs">
                <img
                  v-if="contact.image"
                  :src="contact.image"
                  :alt="contact.name"
                  class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
                <div v-else :class="['w-full h-full flex items-center justify-center', getCardTheme(contact.id).iconBg]">
                  <component :is="getSecondaryIcon(contact.icon)" class="h-6 w-6" />
                </div>
                <div :class="['absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center border border-white dark:border-slate-800 shadow-xs', getCardTheme(contact.id).iconBg]">
                  <component :is="getSecondaryIcon(contact.icon)" class="h-3 w-3" />
                </div>
              </div>

              <div class="min-w-0 space-y-1">
                <div class="flex flex-wrap items-center gap-1.5">
                  <span :class="['rounded-md px-2 py-0.5 text-[9px] font-black uppercase tracking-wider', getContactBadge(contact.id).bg]">
                    {{ getContactBadge(contact.id).text }}
                  </span>
                </div>

                <h3 class="text-sm sm:text-base font-extrabold text-[#0A2458] dark:text-white truncate font-khmer">
                  {{ localized(contact.name, contact.nameKh) }}
                </h3>

                <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-khmer">
                  {{ localized(contact.description, contact.descriptionKh) }}
                </p>

                <p :class="['text-xl font-black tracking-tight pt-1', getCardTheme(contact.id).numberColor]">
                  {{ contact.number }}
                </p>
              </div>
            </div>

            <!-- Dial and Copy Buttons -->
            <div class="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2 shrink-0 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0 dark:border-slate-700/60">
              <a
                :href="`tel:${contact.number}`"
                class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-95"
              >
                <PhoneCall class="h-3.5 w-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ហៅឥឡូវ' : 'Call' }}</span>
              </a>

              <button
                type="button"
                class="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-bold text-slate-600 transition hover:bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300"
                @click="copyToClipboard(contact.number)"
              >
                <component :is="copiedNumber === contact.number ? Check : Copy" class="h-3 w-3" />
                <span>{{ copiedNumber === contact.number ? (currentLanguage === 'kh' ? 'ចម្លងរួច' : 'Copied') : (currentLanguage === 'kh' ? 'ចម្លងលេខ' : 'Copy') }}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- HOSPITALS & LOCATIONS QUICK ACCESS BRIDGE -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        <!-- Nearest Hospitals -->
        <div class="group relative overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-rose-50/70 via-white to-white p-6 shadow-sm ring-1 ring-slate-100 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-slate-700 dark:from-slate-800 dark:to-slate-800">
          <div class="flex items-center justify-between">
            <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs dark:bg-rose-950/60 dark:text-rose-300">
              <Hospital class="h-6 w-6" />
            </div>
            <span class="rounded-full bg-rose-100 px-2.5 py-0.5 text-[10px] font-black text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
              HEALTHCARE
            </span>
          </div>
          <h3 class="mt-4 text-base font-black text-[#0A2458] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'ស្វែងរកមន្ទីរពេទ្យ & បន្ទប់សង្គ្រោះបន្ទាន់' : 'Find Emergency ER & Hospitals' }}
          </h3>
          <p class="mt-1.5 text-xs text-slate-500 dark:text-slate-400 font-khmer leading-relaxed">
            {{ currentLanguage === 'kh' ? 'មើលបញ្ជីមន្ទីរពេទ្យរដ្ឋ និងឯកជន ម៉ោងធ្វើការ លេខទូរស័ព្ទ និងសេវាសង្គ្រោះបន្ទាន់។' : 'Browse verified public & private hospitals, emergency rooms, 24/7 clinics, and direct contacts.' }}
          </p>
          <router-link
            to="/health"
            class="mt-5 inline-flex items-center gap-1.5 text-xs font-black text-rose-600 dark:text-rose-400 group-hover:translate-x-1 transition-transform"
          >
            <span>{{ currentLanguage === 'kh' ? 'ទៅកាន់ទំព័រសុខាភិបាល' : 'Browse Hospitals & ER' }}</span>
            <ArrowRight class="h-4 w-4" />
          </router-link>
        </div>
      </section>

      <!-- INTERACTIVE EMERGENCY MAP: NEARBY HOSPITALS, POLICE & FIRE STATIONS -->
      <section class="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800 space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-3 py-1 text-xs font-bold text-rose-600 ring-1 ring-rose-500/20 dark:bg-rose-950/50 dark:text-rose-300">
              <MapPin class="h-3.5 w-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ផែនទីទីតាំងសង្គ្រោះបន្ទាន់' : 'Emergency Map & Rapid Locator' }}</span>
            </div>
            <h2 class="mt-2 text-lg sm:text-2xl font-black tracking-tight text-[#0A2458] dark:text-white font-khmer">
              {{ currentLanguage === 'kh' ? 'ទីតាំងសង្គ្រោះបន្ទាន់ជិតលោកអ្នកបំផុត' : 'Nearby Emergency Facilities' }}
            </h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400 font-khmer">
              {{ currentLanguage === 'kh' ? 'ស្វែងរកមន្ទីរពេទ្យសង្គ្រោះបន្ទាន់ ប៉ុស្តិ៍នគរបាល និងកងពន្លត់អគ្គីភ័យដែលនៅជិតបំផុត' : 'Locate 24/7 trauma hospitals, police stations, and fire brigades near you' }}
            </p>
          </div>

          <!-- Map Filter Tabs -->
          <div class="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-700/60 rounded-2xl shrink-0">
            <button
              v-for="filter in mapFilters"
              :key="filter.id"
              type="button"
              @click="activeMapFilter = filter.id"
              :class="[
                'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer select-none',
                activeMapFilter === filter.id
                  ? 'bg-white dark:bg-slate-800 text-[#0A2458] dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              ]"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <!-- Interactive Map Layout (Split View: Map Visual + Selected Station Detail) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <!-- Stylized Map Canvas Container -->
          <div class="lg:col-span-8 relative min-h-[360px] sm:min-h-[420px] rounded-3xl overflow-hidden border border-slate-200/90 dark:border-slate-700 bg-slate-900 shadow-inner flex flex-col justify-between p-4">
            <!-- Map Grid & Stylized Radial Background -->
            <div class="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
            <div class="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-950/80" />

            <!-- Geographic Road Lines (SVG Vector Accent) -->
            <svg class="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg">
              <path d="M-50,200 Q250,150 400,280 T800,220" fill="none" stroke="#38bdf8" stroke-width="2" stroke-dasharray="6,6" />
              <path d="M150,-50 Q280,200 350,450" fill="none" stroke="#94a3b8" stroke-width="1.5" />
              <path d="M-20,380 L600,100 L900,300" fill="none" stroke="#38bdf8" stroke-width="3" opacity="0.6" />
              <circle cx="380" cy="220" r="140" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.2" />
              <circle cx="380" cy="220" r="80" fill="none" stroke="#38bdf8" stroke-width="1" opacity="0.3" />
            </svg>

            <!-- Top Left Map Mode Badge -->
            <div class="relative z-10 flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/85 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md border border-white/10">
                <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{{ currentLanguage === 'kh' ? 'តំបន់រាជធានីភ្នំពេញ & បណ្តាញជាតិ' : 'Phnom Penh & National Network' }}</span>
              </span>
            </div>

            <!-- Interactive Map Markers (Pins) -->
            <div class="absolute inset-0 z-20 pointer-events-none">
              <button
                v-for="station in filteredMapStations"
                :key="station.id"
                type="button"
                @click="selectedStation = station"
                :style="{ left: `${station.coords.x}%`, top: `${station.coords.y}%` }"
                :class="[
                  'pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-none z-20',
                  selectedStation.id === station.id ? 'scale-125 z-30' : ''
                ]"
                :title="station.nameKh"
              >
                <!-- Outer Pulse Ring when Selected -->
                <span
                  v-if="selectedStation.id === station.id"
                  class="absolute -inset-2 rounded-full animate-ping opacity-60"
                  :class="station.type === 'hospital' ? 'bg-rose-500' : station.type === 'police' ? 'bg-blue-500' : 'bg-amber-500'"
                />
                
                <!-- Pin Icon Circle -->
                <div
                  :class="[
                    'relative flex h-9 w-9 items-center justify-center rounded-2xl shadow-lg border-2 border-white transition-all',
                    station.type === 'hospital' ? 'bg-rose-600 text-white' :
                    station.type === 'police' ? 'bg-blue-600 text-white' :
                    'bg-amber-600 text-white',
                    selectedStation.id === station.id ? 'ring-4 ring-white/40' : ''
                  ]"
                >
                  <Hospital v-if="station.type === 'hospital'" class="h-4.5 w-4.5" />
                  <ShieldAlert v-else-if="station.type === 'police'" class="h-4.5 w-4.5" />
                  <Flame v-else class="h-4.5 w-4.5" />
                </div>

                <!-- Hover Floating Tooltip -->
                <span class="absolute left-1/2 -translate-x-1/2 -top-8 hidden group-hover:block whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[10px] font-bold text-white shadow-md border border-white/10 z-40">
                  {{ currentLanguage === 'kh' ? station.nameKh : station.name }}
                </span>
              </button>
            </div>

            <!-- Bottom Map Legend -->
            <div class="relative z-10 flex flex-wrap items-center gap-3 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-2xl border border-white/10 text-[11px] text-white">
              <span class="flex items-center gap-1.5 font-bold">
                <span class="h-2.5 w-2.5 rounded-full bg-rose-500" />
                {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ (119)' : 'Hospitals (119)' }}
              </span>
              <span class="flex items-center gap-1.5 font-bold">
                <span class="h-2.5 w-2.5 rounded-full bg-blue-500" />
                {{ currentLanguage === 'kh' ? 'ប៉ុស្តិ៍នគរបាល (117)' : 'Police (117)' }}
              </span>
              <span class="flex items-center gap-1.5 font-bold">
                <span class="h-2.5 w-2.5 rounded-full bg-amber-500" />
                {{ currentLanguage === 'kh' ? 'ស្ថានីយពន្លត់អគ្គីភ័យ (118)' : 'Fire Station (118)' }}
              </span>
            </div>
          </div>

          <!-- Right: Selected Facility Details Drawer Card -->
          <div class="lg:col-span-4 flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-900/50 p-5 sm:p-6 space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span
                  :class="[
                    'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider',
                    selectedStation.type === 'hospital' ? 'bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300' :
                    selectedStation.type === 'police' ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300' :
                    'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                  ]"
                >
                  {{
                    selectedStation.type === 'hospital' ? (currentLanguage === 'kh' ? 'មន្ទីរពេទ្យសង្គ្រោះបន្ទាន់' : 'Emergency Hospital') :
                    selectedStation.type === 'police' ? (currentLanguage === 'kh' ? 'ស្នងការដ្ឋាននគរបាល' : 'Police Station') :
                    (currentLanguage === 'kh' ? 'កងពន្លត់អគ្គីភ័យ' : 'Fire Brigade Station')
                  }}
                </span>

                <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <span class="h-2 w-2 rounded-full bg-emerald-500" />
                  {{ currentLanguage === 'kh' ? 'បើក ២៤/៧' : '24/7 Active' }}
                </span>
              </div>

              <div>
                <h3 class="text-base sm:text-lg font-black text-[#0A2458] dark:text-white font-khmer leading-snug">
                  {{ currentLanguage === 'kh' ? selectedStation.nameKh : selectedStation.name }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {{ selectedStation.name }}
                </p>
              </div>

              <div class="space-y-2 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 text-xs font-khmer">
                <div class="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin class="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
                  <span class="leading-relaxed">{{ currentLanguage === 'kh' ? selectedStation.addressKh : selectedStation.address }}</span>
                </div>
                <div class="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <PhoneCall class="h-4 w-4 text-emerald-500 shrink-0" />
                  <span class="font-bold tracking-wide">{{ selectedStation.phone }}</span>
                </div>
              </div>
            </div>

            <!-- Action Buttons for Selected Facility -->
            <div class="space-y-2 pt-3 border-t border-slate-200/80 dark:border-slate-700/60">
              <a
                :href="`tel:${selectedStation.phone}`"
                class="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              >
                <PhoneCall class="h-4 w-4" />
                <span>{{ currentLanguage === 'kh' ? `ហៅទូរស័ព្ទទៅ ${selectedStation.phone}` : `Call ${selectedStation.phone}` }}</span>
              </a>

              <a
                :href="`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedStation.gmapsQuery)}`"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-bold text-xs transition-all"
              >
                <ArrowRight class="h-3.5 w-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'មើលទិសដៅលើ Google Maps' : 'Get Directions' }}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Copied Floating Toast Notification -->
    <transition name="toast-fade">
      <div
        v-if="copiedNumber"
        class="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-slate-900 px-5 py-3.5 text-white shadow-2xl ring-1 ring-white/20 dark:bg-white dark:text-slate-900"
      >
        <div class="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white">
          <Check class="h-4 w-4" />
        </div>
        <div class="text-xs font-extrabold">
          <p>{{ currentLanguage === 'kh' ? `បានចម្លងលេខ ${copiedNumber} រួចរាល់!` : `Copied ${copiedNumber} to clipboard!` }}</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.emergency-page-container {
  background:
    radial-gradient(55rem 25rem at 50% 0%, rgba(254, 226, 226, .5), transparent 70%),
    linear-gradient(180deg, #fbfcfe 0%, #f7f9fd 40%, #f2f6fc 100%);
}

:global(.dark) .emergency-page-container {
  background-color: #0b1727;
  background-image: none;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.95);
}
</style>
