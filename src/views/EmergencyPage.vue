<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertTriangle,
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
  Radio,
  Building2,
  Navigation,
  Activity,
  LifeBuoy
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getEmergencyContacts } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'
import LocationSelector from '@/components/LocationSelector.vue'

const { currentLanguage, localized } = useLanguage()

usePageMeta({
  title: 'មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់ជាតិកម្ពុជា — 117, 118, 119 Emergency Response Portal',
  description: 'ប្រព័ន្ធទូរស័ព្ទសង្គ្រោះបន្ទាន់ផ្លូវការ ២៤/៧ ទូទាំងប្រទេសកម្ពុជា៖ នគរបាលជាតិ (១១៧) ពន្លត់អគ្គីភ័យ (១១៨) សង្គ្រោះវេជ្ជសាស្ត្រ (១១៩) និងមន្ទីរពេទ្យសង្គ្រោះបន្ទាន់'
})

const contacts = getEmergencyContacts()
const searchQuery = ref('')
const selectedCategory = ref('all')
const copiedNumber = ref<string | null>(null)
let copyTimeout: any = null

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
    copiedNumber.value = num
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      copiedNumber.value = null
    }, 2500)
  }
}

// Quick Emergency Triage Filter
const activeTriage = ref<string | null>(null)
function setTriage(type: string) {
  if (activeTriage.value === type) {
    activeTriage.value = null
    selectedCategory.value = 'all'
  } else {
    activeTriage.value = type
    if (type === 'traffic') selectedCategory.value = 'security'
    else if (type === 'fire') selectedCategory.value = 'core'
    else if (type === 'medical') selectedCategory.value = 'health'
    else if (type === 'police') selectedCategory.value = 'security'
  }
}

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
    let matchesCategory = true
    if (selectedCategory.value === 'core') {
      matchesCategory = c.priority <= 3
    } else if (selectedCategory.value === 'security') {
      matchesCategory = c.id === 'police' || c.id === 'tourist-police-hotline' || c.id === 'road-traffic-assistance'
    } else if (selectedCategory.value === 'health') {
      matchesCategory = c.id === 'ambulance' || c.id === 'cdc-disease-hotline'
    } else if (selectedCategory.value === 'citizen') {
      matchesCategory = c.priority > 3
    }

    if (!matchesCategory) return false

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
  if (id === 'police') return { text: currentLanguage.value === 'kh' ? 'សន្តិសុខជាតិ ២៤/៧' : 'National Security 24/7', bg: 'bg-blue-100 text-blue-900 border border-blue-200' }
  if (id === 'fire') return { text: currentLanguage.value === 'kh' ? 'ពន្លត់អគ្គីភ័យ & សង្គ្រោះ' : 'Fire & Disaster Rescue', bg: 'bg-amber-100 text-amber-900 border border-amber-200' }
  if (id === 'ambulance') return { text: currentLanguage.value === 'kh' ? 'សង្គ្រោះបន្ទាន់ SAMU' : 'SAMU Ambulance Dispatch', bg: 'bg-rose-100 text-rose-900 border border-rose-200' }
  if (id === 'tourist-police-hotline') return { text: currentLanguage.value === 'kh' ? 'ពហុភាសា' : 'Multilingual', bg: 'bg-violet-100 text-violet-900 border border-violet-200' }
  if (id === 'child-protection-hotline') return { text: currentLanguage.value === 'kh' ? 'ការពារកុមារ' : 'Child Protection', bg: 'bg-pink-100 text-pink-900 border border-pink-200' }
  if (id === 'road-traffic-assistance') return { text: currentLanguage.value === 'kh' ? 'ផ្លូវល្បឿនលឿន' : 'Expressway Rescue', bg: 'bg-emerald-100 text-emerald-900 border border-emerald-200' }
  if (id === 'cdc-disease-hotline') return { text: currentLanguage.value === 'kh' ? 'ជំងឺឆ្លង CDC' : 'Infectious Disease CDC', bg: 'bg-teal-100 text-teal-900 border border-teal-200' }
  if (id === 'edc-electricity-emergency') return { text: currentLanguage.value === 'kh' ? 'អគ្គិសនី EDC' : 'EDC Electricity Outage', bg: 'bg-yellow-100 text-yellow-900 border border-yellow-200' }
  return { text: currentLanguage.value === 'kh' ? 'បន្ទាន់' : 'Emergency', bg: 'bg-slate-100 text-slate-700 border border-slate-200' }
}

// 4 Emergency Steps
const emergencySteps = computed(() => [
  {
    step: '01',
    title: currentLanguage.value === 'kh' ? 'រក្សាភាពស្ងប់ស្ងាត់' : 'Stay Calm & Composed',
    desc: currentLanguage.value === 'kh' ? 'ដកដង្ហើមវែងៗ គ្រប់គ្រងអារម្មណ៍ ដើម្បីនិយាយរៀបរាប់ហេតុការណ៍ឱ្យបានច្បាស់លាស់។' : 'Take a deep breath and speak clearly so the dispatcher understands your emergency.',
    icon: ShieldCheck,
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    step: '02',
    title: currentLanguage.value === 'kh' ? 'ប្រាប់ទីតាំងឱ្យចំ' : 'Provide Exact Location',
    desc: currentLanguage.value === 'kh' ? 'ប្រាប់ផ្ទះលេខ ផ្លូវ សង្កាត់ ខណ្ឌ ឬចំណុចសម្គាល់ធំៗជិតបំផុត (ផ្សារ សាលា វត្ត)។' : 'State your exact street, building number, sangkat, khan, or nearby recognizable landmark.',
    icon: MapPin,
    color: 'text-rose-600',
    bg: 'bg-rose-50'
  },
  {
    step: '03',
    title: currentLanguage.value === 'kh' ? 'រៀបរាប់ពីស្ថានភាព' : 'Describe the Situation',
    desc: currentLanguage.value === 'kh' ? 'បញ្ជាក់ពីប្រភេទគ្រោះថ្នាក់ ចំនួនអ្នករងរបួស ឬស្ថានភាពបន្ទាន់ដែលកំពុងកើតឡើង។' : 'Explain what happened, number of injured people, and any immediate hazards present.',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50'
  },
  {
    step: '04',
    title: currentLanguage.value === 'kh' ? 'កុំទម្លាក់ទូរស័ព្ទមុន' : 'Keep Line Connected',
    desc: currentLanguage.value === 'kh' ? 'រង់ចាំការណែនាំពីភ្នាក់ងារជំនាញ រហូតដល់គេប្រាប់ឱ្យបិទទូរស័ព្ទជាស្ថាពរ។' : 'Follow the operator instructions and do not hang up until they tell you to do so.',
    icon: PhoneCall,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50'
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
  distance: string
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
    distance: '1.2 គ.ម',
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
    distance: '3.4 គ.ម',
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
    distance: '2.8 គ.ម',
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
    distance: '2.1 គ.ម',
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
    distance: '1.9 គ.ម',
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
    distance: '1.5 គ.ម',
    coords: { x: 50, y: 58 },
    gmapsQuery: 'Phnom Penh Fire Station Olympic'
  }
])

const activeMapFilter = ref<'all' | 'hospital' | 'police' | 'fire'>('all')
const selectedStation = ref<EmergencyStation>(mapStations.value[0])

const mapFilters = computed(() => [
  { id: 'all', label: currentLanguage.value === 'kh' ? 'ទាំងអស់ (៦)' : 'All Facilities (6)' },
  { id: 'hospital', label: currentLanguage.value === 'kh' ? '🏥 មន្ទីរពេទ្យ (119)' : '🏥 Hospitals' },
  { id: 'police', label: currentLanguage.value === 'kh' ? '👮 ប៉ូលីស (117)' : '👮 Police' },
  { id: 'fire', label: currentLanguage.value === 'kh' ? '🚒 ពន្លត់អគ្គីភ័យ (118)' : '🚒 Fire' }
])

const filteredMapStations = computed(() => {
  if (activeMapFilter.value === 'all') return mapStations.value
  return mapStations.value.filter(s => s.type === activeMapFilter.value)
})

const firstAidProtocols = [
  {
    id: 'cpr',
    titleKh: 'ការធ្វើចលនាបេះដូងសង្គ្រោះបឋម (CPR)',
    titleEn: 'Cardiopulmonary Resuscitation (CPR)',
    descKh: 'សម្រាប់ជនរងគ្រោះសន្លប់ បាត់បង់ស្មារតី និងមិនដកដង្ហើម។ ដាក់បាតដៃទាំងពីរជាន់លើទ្រូងចំកណ្តាល ហើយសង្កត់ចុះជម្រៅ ៥-៦ ស.ម ក្នុងល្បឿន ១០០-១២០ ដងក្នុង ១ នាទី។',
    icon: HeartPulse,
    steps: ['ពិនិត្យការឆ្លើយតប និងដង្ហើម', 'ហៅទូរស័ព្ទទៅកាន់ 119 ភ្លាមៗ', 'សង្កត់ទ្រូងឱ្យរឹងមាំ និងលឿន', 'កុំឈប់រហូតដល់ក្រុមពេទ្យមកដល់']
  },
  {
    id: 'choking',
    titleKh: 'ការសង្គ្រោះអ្នកស្លាក់ចំណីអាហារ (Choking / Heimlich)',
    titleEn: 'Heimlich Maneuver for Choking',
    descKh: 'សម្រាប់អ្នកស្លាក់ឆ្អឹង ឬចំណីអាហារពិបាកដកដង្ហើម។ ឈរពីក្រោយជនរងគ្រោះ ឱបចង្កេះ ហើយក្តាប់ដៃសង្កត់ចូលខាងក្នុង និងឡើងលើត្រង់ចន្លោះផ្ចិត និងចុងដង្ហើម។',
    icon: LifeBuoy,
    steps: ['សួរថា «តើអ្នកស្លាក់មែនទេ?»', 'ឱបពីក្រោយត្រង់ចន្លោះផ្ចិត និងចុងដង្ហើម', 'រុញចូល និងរុញឡើងលើ ៥ ដង', 'បើជនរងគ្រោះសន្លប់ ត្រូវចាប់ផ្តើមធ្វើ CPR']
  },
  {
    id: 'bleeding',
    titleKh: 'វិធីទប់ឈាមពេលមានរបួសធ្ងន់ធ្ងរ',
    titleEn: 'Severe Bleeding Control',
    descKh: 'ប្រើក្រណាត់ស្អាត ឬបង់រុំសង្កត់ផ្ទាល់ពីលើមុខរបួសឱ្យណែន។ លើកអវយវៈដែលរងរបួសឱ្យខ្ពស់ជាងកម្ពស់បេះដូង ដើម្បីកាត់បន្ថយសម្ពាធឈាមហូរចេញ។',
    icon: Activity,
    steps: ['ប្រើក្រណាត់ស្អាតសង្កត់ផ្ទាល់លើមុខរបួស', 'កុំដកក្រណាត់ចេញ បើឈាមជ្រាបត្រូវដាក់ក្រណាត់បន្ថែមពីលើ', 'លើករបួសឱ្យខ្ពស់ជាងបេះដូង', 'រួសរាន់បញ្ជូនទៅមន្ទីរពេទ្យ']
  }
]

// Provincial Quick Contacts
const selectedProvince = ref('phnom-penh')
const provincialContacts: Record<string, { police: string; hospital: string; hospitalName: string }> = {
  'phnom-penh': { police: '023 212 117', hospital: '023 426 948', hospitalName: 'មន្ទីរពេទ្យកាល់ម៉ែត' },
  'siem-reap': { police: '063 760 117', hospital: '063 764 091', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តសៀមរាប' },
  'battambang': { police: '053 952 117', hospital: '053 952 822', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តបាត់ដំបង' },
  'sihanoukville': { police: '034 933 117', hospital: '034 933 411', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តព្រះសីហនុ' },
  'kampot': { police: '033 932 117', hospital: '033 932 805', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពត' }
}
</script>

<template>
  <div class="emergency-portal bg-[#F8FAFC] min-h-screen pb-16 font-khmer text-slate-800 space-y-8">

    <!-- ============================================================
         1. CRITICAL DISPATCH COMMAND HEADER (Active Emergency Masthead)
         ============================================================ -->
    <div class="bg-white border-b border-slate-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <!-- Live Alert Status -->
        <div class="flex items-center gap-2 font-bold">
          <span class="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span class="text-slate-900">{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធបញ្ជាការសង្គ្រោះបន្ទាន់ជាតិកម្ពុជា' : 'Cambodia National Emergency Response Command' }}</span>
          <span class="text-slate-300">|</span>
          <span class="text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
            {{ currentLanguage === 'kh' ? '● បណ្តាញ ១១៧, ១១៨, ១១៩ ដំណើរការធម្មតា ២៤/៧' : 'All Hotlines Active 24/7' }}
          </span>
        </div>

        <div class="flex items-center gap-3 font-bold text-slate-500">
          <span class="hidden sm:inline text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
            {{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ ១០០%' : '100% Toll-Free' }}
          </span>
          <LocationSelector variant="pill" />
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-bold text-slate-400" aria-label="Breadcrumb">
        <router-link to="/" class="hover:text-[#0D47A1] transition-colors">
          {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
        <span class="text-slate-800 font-black">{{ currentLanguage === 'kh' ? 'មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់ជាតិ' : 'Emergency Center' }}</span>
      </nav>

      <!-- ============================================================
           2. NEWSPAPER / COMMAND STYLE HERO BANNER
           ============================================================ -->
      <section class="relative overflow-hidden rounded-3xl bg-white border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <div class="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-black text-rose-700 border border-rose-200">
              <Radio class="w-3.5 h-3.5 text-rose-600 animate-pulse" />
              <span>{{ currentLanguage === 'kh' ? 'ខ្សែទូរស័ព្ទសង្គ្រោះបន្ទាន់ផ្លូវការទូទាំងប្រទេស ២៤/៧' : 'Official National 24/7 Emergency Dispatch' }}</span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
              {{ currentLanguage === 'kh' ? 'ជំនួយ និងលេខទូរស័ព្ទសង្គ្រោះបន្ទាន់ជាតិ' : 'National Emergency Hotlines & Rescue Services' }}
            </h1>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'ចុចហៅទូរស័ព្ទបន្ទាន់ដោយឥតគិតថ្លៃ ១០០% ពីគ្រប់ប្រព័ន្ធទូរស័ព្ទចល័ត (Smart, Cellcard, Metfone) និងទូរស័ព្ទលើតុ ទៅកាន់ នគរបាលជាតិ (១១៧) ពន្លត់អគ្គីភ័យ (១១៨) សង្គ្រោះវេជ្ជសាស្ត្រ (១១៩)។'
                : '100% Toll-free instant dispatch to Cambodia National Police (117), Fire & Rescue (118), and SAMU Medical Ambulance (119) from any mobile or landline network.'
              }}
            </p>
          </div>

          <!-- Quick Stats Indicators -->
          <div class="grid grid-cols-3 gap-3 shrink-0">
            <div class="p-3.5 bg-blue-50/80 rounded-2xl border border-blue-100 text-center space-y-1">
              <PhoneCall class="w-5 h-5 text-[#0D47A1] mx-auto" />
              <p class="text-[10px] font-bold text-slate-500 uppercase">{{ currentLanguage === 'kh' ? 'ការហៅ' : 'Dialing' }}</p>
              <p class="text-xs font-black text-[#0D47A1]">{{ currentLanguage === 'kh' ? 'ឥតគិតថ្លៃ' : 'Free' }}</p>
            </div>

            <div class="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-100 text-center space-y-1">
              <Clock3 class="w-5 h-5 text-amber-600 mx-auto" />
              <p class="text-[10px] font-bold text-slate-500 uppercase">{{ currentLanguage === 'kh' ? 'ម៉ោងបម្រើ' : 'Hours' }}</p>
              <p class="text-xs font-black text-amber-900">២៤ ម៉ោង</p>
            </div>

            <div class="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-100 text-center space-y-1">
              <ShieldCheck class="w-5 h-5 text-emerald-600 mx-auto" />
              <p class="text-[10px] font-bold text-slate-500 uppercase">{{ currentLanguage === 'kh' ? 'ការឆ្លើយតប' : 'Response' }}</p>
              <p class="text-xs font-black text-emerald-900">៣-៥ នាទី</p>
            </div>
          </div>
        </div>

        <!-- ============================================================
             FAST EMERGENCY TRIAGE BUTTONS ("តើអ្នកត្រូវការជំនួយអ្វីឥឡូវនេះ?")
             ============================================================ -->
        <div class="pt-4 border-t border-slate-100 space-y-3">
          <p class="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-[#0D47A1]" />
            <span>{{ currentLanguage === 'kh' ? 'តើអ្នកកំពុងជួបបញ្ហាបន្ទាន់អ្វី? (ចុចដើម្បីជ្រើសរើសជំនួយលឿន)' : 'What is your emergency? (Click for immediate assistance)' }}</span>
          </p>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <button
              @click="setTriage('traffic')"
              type="button"
              :class="['p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5', activeTriage === 'traffic' ? 'bg-blue-600 text-white border-blue-600 shadow-sm' : 'bg-slate-50 hover:bg-blue-50 border-slate-200 text-slate-800']"
            >
              <span class="text-lg">🚨</span>
              <div class="min-w-0">
                <p class="font-black text-xs truncate">{{ currentLanguage === 'kh' ? 'គ្រោះថ្នាក់ចរាចរណ៍' : 'Road Accident' }}</p>
                <p :class="['text-[10px] truncate', activeTriage === 'traffic' ? 'text-blue-100' : 'text-slate-500']">ហៅ 117 ឬ 119</p>
              </div>
            </button>

            <button
              @click="setTriage('fire')"
              type="button"
              :class="['p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5', activeTriage === 'fire' ? 'bg-amber-600 text-white border-amber-600 shadow-sm' : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800']"
            >
              <span class="text-lg">🚒</span>
              <div class="min-w-0">
                <p class="font-black text-xs truncate">{{ currentLanguage === 'kh' ? 'អគ្គីភ័យ / ផ្សែង' : 'Fire Incident' }}</p>
                <p :class="['text-[10px] truncate', activeTriage === 'fire' ? 'text-amber-100' : 'text-slate-500']">ហៅពន្លត់ភ្លើង 118</p>
              </div>
            </button>

            <button
              @click="setTriage('medical')"
              type="button"
              :class="['p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5', activeTriage === 'medical' ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-slate-50 hover:bg-rose-50 border-slate-200 text-slate-800']"
            >
              <span class="text-lg">🚑</span>
              <div class="min-w-0">
                <p class="font-black text-xs truncate">{{ currentLanguage === 'kh' ? 'សន្លប់ / ឈឺធ្ងន់' : 'Medical Trauma' }}</p>
                <p :class="['text-[10px] truncate', activeTriage === 'medical' ? 'text-rose-100' : 'text-slate-500']">ហៅរថយន្តសង្គ្រោះ 119</p>
              </div>
            </button>

            <button
              @click="setTriage('police')"
              type="button"
              :class="['p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5', activeTriage === 'police' ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm' : 'bg-slate-50 hover:bg-indigo-50 border-slate-200 text-slate-800']"
            >
              <span class="text-lg">👮</span>
              <div class="min-w-0">
                <p class="font-black text-xs truncate">{{ currentLanguage === 'kh' ? 'ចោរកម្ម / អំពើហិង្សា' : 'Crime & Assault' }}</p>
                <p :class="['text-[10px] truncate', activeTriage === 'police' ? 'text-indigo-100' : 'text-slate-500']">ហៅនគរបាល 117</p>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- Urgent Important Instruction Notice -->
      <section class="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 sm:p-5 shadow-xs flex items-start gap-3.5">
        <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-600 text-white shadow-sm mt-0.5 animate-pulse">
          <AlertTriangle class="h-5 w-5" />
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <h2 class="text-sm font-black text-rose-950">
              {{ currentLanguage === 'kh' ? 'សេចក្តីណែនាំបន្ទាន់ពេលហៅសុំជំនួយ៖' : 'Emergency Calling Rules:' }}
            </h2>
            <span class="px-2 py-0.5 rounded-full bg-rose-200 text-rose-900 text-[10px] font-bold">
              {{ currentLanguage === 'kh' ? 'សូមអានមុនពេលហៅ' : 'Critical' }}
            </span>
          </div>
          <p class="text-xs text-rose-900 leading-relaxed">
            {{ currentLanguage === 'kh'
              ? 'ក្នុងករណីមានហេតុការណ៍បន្ទាន់ សូមរក្សាភាពស្ងប់ស្ងាត់ ប្រាប់ទីតាំងផ្ទះលេខ ផ្លូវ ឬចំណុចសម្គាល់ធំៗឱ្យបានច្បាស់លាស់ និងកុំទម្លាក់ទូរស័ព្ទមុនពេលភ្នាក់ងារបញ្ជាក់ចប់សព្វគ្រប់។ ហាមហៅលេងសើចជាដាច់ខាត!'
              : 'Stay calm, speak clearly, state your exact street or nearest landmark, and do not hang up until the dispatcher instructs you to do so.'
            }}
          </p>
        </div>
      </section>

      <!-- ============================================================
           3. TOP 3 NATIONAL SPEED DIAL COMMAND TERMINALS (117, 118, 119)
           ============================================================ -->
      <section class="space-y-4">
        <div class="flex items-center justify-between pb-1 border-b-2 border-[#0D47A1]">
          <div class="flex items-center gap-2 text-base font-black text-slate-900">
            <Flame class="w-5 h-5 text-rose-600" />
            <span>{{ currentLanguage === 'kh' ? '៣ ខ្សែទូរស័ព្ទសង្គ្រោះបន្ទាន់ជាតិចម្បង (ហៅឥតគិតថ្លៃ)' : 'Primary 3-Digit National Hotlines (100% Free)' }}</span>
          </div>
          <span class="px-2.5 py-1 rounded-full bg-rose-600 text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-xs">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <span>24/7 SPEED DIAL</span>
          </span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <!-- 117 POLICE -->
          <div class="bg-white rounded-3xl border-2 border-blue-300 p-6 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-xl bg-blue-100 text-[#0D47A1] text-xs font-black uppercase">
                  👮 នគរបាលជាតិ
                </span>
                <span class="text-[10px] font-bold text-slate-400">ឆ្លើយតប: ៣-៥ នាទី</span>
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900">Cambodia National Police</h3>
                <p class="text-xs text-slate-500">បទល្មើស ចោរកម្ម អំពើហិង្សា និងសន្តិសុខសាធារណៈ</p>
              </div>

              <!-- Giant 117 Button -->
              <div class="py-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-center">
                <span class="text-6xl font-black text-[#0D47A1] font-mono tracking-tighter group-hover:scale-105 transition-transform">
                  117
                </span>
              </div>

              <div class="space-y-1 text-xs text-slate-600">
                <p class="flex items-center gap-1.5 font-medium">✓ រាយការណ៍បទល្មើស ចោរកម្ម ឆក់ ប្លន់</p>
                <p class="flex items-center gap-1.5 font-medium">✓ សន្តិសុខសង្គម និងទំនាស់ហិង្សា</p>
              </div>
            </div>

            <div class="space-y-2 pt-3 border-t border-slate-100">
              <a
                href="tel:117"
                class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <PhoneCall class="w-4 h-4" />
                <span>ចុចហៅ 117 ឥឡូវនេះ (ឥតគិតថ្លៃ)</span>
              </a>

              <button
                @click="copyToClipboard('117')"
                type="button"
                class="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check v-if="copiedNumber === '117'" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedNumber === '117' ? 'បានចម្លងលេខ 117!' : 'ចម្លងលេខ 117' }}</span>
              </button>
            </div>
          </div>

          <!-- 118 FIRE -->
          <div class="bg-white rounded-3xl border-2 border-amber-300 p-6 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-xl bg-amber-100 text-amber-900 text-xs font-black uppercase">
                  🚒 ពន្លត់អគ្គីភ័យ & សង្គ្រោះ
                </span>
                <span class="text-[10px] font-bold text-slate-400">ឆ្លើយតប: បន្ទាន់</span>
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900">Fire & Disaster Rescue</h3>
                <p class="text-xs text-slate-500">អគ្គីភ័យ ឆេះផ្ទះ ជាប់គាំង និងគ្រោះមហន្តរាយ</p>
              </div>

              <!-- Giant 118 Button -->
              <div class="py-4 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-center">
                <span class="text-6xl font-black text-amber-600 font-mono tracking-tighter group-hover:scale-105 transition-transform">
                  118
                </span>
              </div>

              <div class="space-y-1 text-xs text-slate-600">
                <p class="flex items-center gap-1.5 font-medium">✓ ពន្លត់ភ្លើងឆេះផ្ទះ រោងចក្រ អគារ</p>
                <p class="flex items-center gap-1.5 font-medium">✓ សង្គ្រោះមនុស្សជាប់គាំងក្នុងគ្រោះថ្នាក់</p>
              </div>
            </div>

            <div class="space-y-2 pt-3 border-t border-slate-100">
              <a
                href="tel:118"
                class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <PhoneCall class="w-4 h-4" />
                <span>ចុចហៅ 118 ឥឡូវនេះ (ឥតគិតថ្លៃ)</span>
              </a>

              <button
                @click="copyToClipboard('118')"
                type="button"
                class="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check v-if="copiedNumber === '118'" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedNumber === '118' ? 'បានចម្លងលេខ 118!' : 'ចម្លងលេខ 118' }}</span>
              </button>
            </div>
          </div>

          <!-- 119 AMBULANCE SAMU -->
          <div class="bg-white rounded-3xl border-2 border-rose-300 p-6 shadow-sm hover:shadow-card-hover transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="px-3 py-1 rounded-xl bg-rose-100 text-rose-900 text-xs font-black uppercase">
                  🚑 សង្គ្រោះវេជ្ជសាស្ត្រ SAMU
                </span>
                <span class="text-[10px] font-bold text-slate-400">២៤ ម៉ោង / ៧ ថ្ងៃ</span>
              </div>

              <div>
                <h3 class="text-xl font-black text-slate-900">SAMU Emergency Ambulance</h3>
                <p class="text-xs text-slate-500">រថយន្តសង្គ្រោះបន្ទាន់ជាតិ និងបញ្ជូនអ្នកជំងឺ</p>
              </div>

              <!-- Giant 119 Button -->
              <div class="py-4 bg-rose-50/60 rounded-2xl border border-rose-100 flex items-center justify-center">
                <span class="text-6xl font-black text-rose-600 font-mono tracking-tighter group-hover:scale-105 transition-transform">
                  119
                </span>
              </div>

              <div class="space-y-1 text-xs text-slate-600">
                <p class="flex items-center gap-1.5 font-medium">✓ សង្គ្រោះអ្នកសន្លប់ គាំងបេះដូង របួសធ្ងន់</p>
                <p class="flex items-center gap-1.5 font-medium">✓ បញ្ជូនទៅកាន់មន្ទីរពេទ្យរដ្ឋ និងឯកជន</p>
              </div>
            </div>

            <div class="space-y-2 pt-3 border-t border-slate-100">
              <a
                href="tel:119"
                class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-sm transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <PhoneCall class="w-4 h-4" />
                <span>ចុចហៅ 119 ឥឡូវនេះ (ឥតគិតថ្លៃ)</span>
              </a>

              <button
                @click="copyToClipboard('119')"
                type="button"
                class="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-600 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Check v-if="copiedNumber === '119'" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
                <span>{{ copiedNumber === '119' ? 'បានចម្លងលេខ 119!' : 'ចម្លងលេខ 119' }}</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      <!-- ============================================================
           4. 4-STEP CITIZEN EMERGENCY PROTOCOL
           ============================================================ -->
      <section class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-2 border-b border-slate-100">
          <div class="space-y-1">
            <span class="text-xs font-black text-[#0D47A1] uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck class="w-4 h-4 text-[#0D47A1]" />
              <span>{{ currentLanguage === 'kh' ? 'ការណែនាំសុវត្ថិភាព' : 'Safety Protocol' }}</span>
            </span>
            <h2 class="text-base sm:text-lg font-black text-slate-900">
              {{ currentLanguage === 'kh' ? '៤ ជំហានសំខាន់ៗពេលទូរស័ព្ទសុំជំនួយបន្ទាន់' : '4 Steps When Calling for Help' }}
            </h2>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="item in emergencySteps"
            :key="item.step"
            class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50 space-y-2.5"
          >
            <div class="flex items-center justify-between">
              <div :class="['w-9 h-9 rounded-xl flex items-center justify-center shadow-xs', item.bg, item.color]">
                <component :is="item.icon" class="w-4.5 h-4.5" />
              </div>
              <span class="text-xs font-black text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {{ item.step }}
              </span>
            </div>
            <h3 class="font-black text-sm text-slate-900">{{ item.title }}</h3>
            <p class="text-xs text-slate-500 leading-relaxed">{{ item.desc }}</p>
          </div>
        </div>
      </section>

      <!-- ============================================================
           5. SEARCH & FILTER PANEL FOR ALL OTHER HELPLINES
           ============================================================ -->
      <section class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3">
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="relative w-full sm:w-80">
            <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកលេខបន្ទាន់ (115, កុមារ, EDC, ទេសចរណ៍...)' : 'Search hotline (115, ChildSafe, EDC...)'"
              class="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#0D47A1]"
            />
          </div>

          <div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 w-full sm:w-auto scrollbar-none">
            <button
              v-for="cat in categories"
              :key="cat.id"
              @click="selectedCategory = cat.id"
              type="button"
              :class="['px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer', selectedCategory === cat.id ? 'bg-[#0D47A1] text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200']"
            >
              {{ cat.label }}
            </button>
          </div>
        </div>
      </section>

      <!-- Specialized Contacts Grid -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
            <Phone class="w-4 h-4 text-[#0D47A1]" />
            <span>{{ currentLanguage === 'kh' ? 'ខ្សែទូរស័ព្ទជំនួយសាធារណៈ និងជំនួយសង្គម' : 'Specialized Citizen Helplines' }}</span>
          </h2>
          <span class="text-xs font-bold text-slate-400">{{ filteredContacts.length }} លេខទូរស័ព្ទ</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            v-for="contact in filteredContacts"
            :key="contact.id"
            class="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-2xs hover:shadow-card-hover transition-all flex flex-col justify-between space-y-3"
          >
            <div class="space-y-2">
              <div class="flex items-center justify-between">
                <span :class="['px-2 py-0.5 rounded-md text-[10px] font-black uppercase', getContactBadge(contact.id).bg]">
                  {{ getContactBadge(contact.id).text }}
                </span>
                <span class="text-lg font-black text-[#0D47A1] font-mono">{{ contact.number }}</span>
              </div>

              <h3 class="font-black text-sm text-slate-900 leading-snug">
                {{ localized(contact.name, contact.nameKh) }}
              </h3>

              <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {{ localized(contact.description, contact.descriptionKh) }}
              </p>
            </div>

            <div class="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
              <a
                :href="'tel:' + contact.number"
                class="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <PhoneCall class="w-3.5 h-3.5" />
                <span>ហៅ {{ contact.number }}</span>
              </a>

              <button
                @click="copyToClipboard(contact.number)"
                class="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-colors cursor-pointer"
                title="ចម្លងលេខ"
              >
                <Check v-if="copiedNumber === contact.number" class="w-3.5 h-3.5 text-emerald-600" />
                <Copy v-else class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           6. PROVINCIAL EMERGENCY HOTLINES (រាជធានី-ខេត្តទាំង ២៥)
           ============================================================ -->
      <section class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="space-y-1">
            <h2 class="text-base font-black text-slate-900 flex items-center gap-2">
              <Building2 class="w-4 h-4 text-[#0D47A1]" />
              <span>{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់ប្រចាំរាជធានី-ខេត្ត' : 'Provincial Direct Hotlines' }}</span>
            </h2>
            <p class="text-xs text-slate-500">លេខទូរស័ព្ទបន្ទាន់ផ្ទាល់របស់ស្នងការដ្ឋាននគរបាល និងមន្ទីរពេទ្យបង្អែកខេត្ត</p>
          </div>

          <div class="flex items-center gap-2">
            <label class="text-xs font-bold text-slate-600">ជ្រើសរើសខេត្ត៖</label>
            <select
              v-model="selectedProvince"
              class="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-[#0D47A1]"
            >
              <option value="phnom-penh">រាជធានីភ្នំពេញ (Phnom Penh)</option>
              <option value="siem-reap">ខេត្តសៀមរាប (Siem Reap)</option>
              <option value="battambang">ខេត្តបាត់ដំបង (Battambang)</option>
              <option value="sihanoukville">ខេត្តព្រះសីហនុ (Sihanoukville)</option>
              <option value="kampot">ខេត្តកំពត (Kampot)</option>
            </select>
          </div>
        </div>

        <div v-if="provincialContacts[selectedProvince]" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-[10px] font-black uppercase text-blue-700">ស្នងការដ្ឋាននគរបាលខេត្ត</span>
              <h4 class="font-black text-sm text-slate-900">បញ្ជាការដ្ឋាននគរបាលប្រចាំខេត្ត</h4>
              <p class="text-base font-mono font-black text-[#0D47A1]">{{ provincialContacts[selectedProvince].police }}</p>
            </div>
            <a :href="'tel:' + provincialContacts[selectedProvince].police" class="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
              <PhoneCall class="w-3.5 h-3.5" />
              <span>ហៅបន្ទាន់</span>
            </a>
          </div>

          <div class="p-4 rounded-2xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
            <div class="space-y-1">
              <span class="text-[10px] font-black uppercase text-rose-700">ផ្នែកសង្គ្រោះបន្ទាន់មន្ទីរពេទ្យ</span>
              <h4 class="font-black text-sm text-slate-900">{{ provincialContacts[selectedProvince].hospitalName }}</h4>
              <p class="text-base font-mono font-black text-rose-600">{{ provincialContacts[selectedProvince].hospital }}</p>
            </div>
            <a :href="'tel:' + provincialContacts[selectedProvince].hospital" class="px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs">
              <PhoneCall class="w-3.5 h-3.5" />
              <span>ហៅបន្ទាន់</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================
           7. FIRST AID & LIFE SAVING ESSENTIAL PROTOCOLS
           ============================================================ -->
      <section class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div class="space-y-1 pb-3 border-b border-slate-100">
          <div class="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 uppercase">
            <HeartPulse class="w-4 h-4 text-emerald-600" />
            <span>{{ currentLanguage === 'kh' ? 'ការណែនាំសង្គ្រោះបឋម' : 'First Aid Survival Protocols' }}</span>
          </div>
          <h2 class="text-base sm:text-lg font-black text-slate-900">
            {{ currentLanguage === 'kh' ? 'វិធីសាស្ត្រសង្គ្រោះជីវិតបឋម មុនពេលក្រុមគ្រូពេទ្យមកដល់' : 'Essential Life-Saving Protocols Before Responders Arrive' }}
          </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            v-for="protocol in firstAidProtocols"
            :key="protocol.id"
            class="p-4 rounded-2xl border border-slate-200/90 bg-slate-50/60 space-y-3"
          >
            <div class="flex items-center gap-2 text-slate-900 font-black text-sm">
              <component :is="protocol.icon" class="w-4 h-4 text-[#0D47A1]" />
              <span>{{ protocol.titleKh }}</span>
            </div>

            <p class="text-xs text-slate-600 leading-relaxed">
              {{ protocol.descKh }}
            </p>

            <div class="space-y-1.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-700 font-semibold">
              <div v-for="(st, sIdx) in protocol.steps" :key="sIdx" class="flex items-center gap-1.5">
                <span class="w-4 h-4 rounded-full bg-blue-100 text-[#0D47A1] text-[9px] font-bold flex items-center justify-center shrink-0">
                  {{ sIdx + 1 }}
                </span>
                <span>{{ st }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           8. INTERACTIVE EMERGENCY RADAR MAP & NEARBY HOSPITALS
           ============================================================ -->
      <section class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="space-y-1">
            <span class="text-xs font-black text-[#0D47A1] uppercase tracking-wider flex items-center gap-1">
              <MapPin class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ទីតាំងសង្គ្រោះបន្ទាន់' : 'Emergency Radar' }}</span>
            </span>
            <h2 class="text-lg sm:text-xl font-black text-slate-900">
              {{ currentLanguage === 'kh' ? 'ផែនទីស្ថានីយសង្គ្រោះបន្ទាន់ & មន្ទីរពេទ្យជិតបំផុត' : 'Nearby Trauma Hospitals & Emergency Stations' }}
            </h2>
          </div>

          <div class="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            <button
              v-for="filter in mapFilters"
              :key="filter.id"
              @click="activeMapFilter = filter.id as any"
              type="button"
              :class="['px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer', activeMapFilter === filter.id ? 'bg-white text-[#0D47A1] shadow-2xs font-black' : 'text-slate-500']"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <!-- Stylized Radar Map Canvas -->
          <div class="lg:col-span-8 relative min-h-[360px] rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-4 flex flex-col justify-between">
            <div class="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-40" />
            <div class="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900/90 to-blue-950/80" />

            <div class="relative z-10 flex items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white border border-white/10">
                <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{{ currentLanguage === 'kh' ? 'តំបន់រាជធានីភ្នំពេញ (Live Radar)' : 'Phnom Penh Command' }}</span>
              </span>
            </div>

            <!-- Map Markers -->
            <div class="absolute inset-0 z-20">
              <button
                v-for="station in filteredMapStations"
                :key="station.id"
                type="button"
                @click="selectedStation = station"
                :style="{ left: `${station.coords.x}%`, top: `${station.coords.y}%` }"
                :class="['absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-125 z-20', selectedStation.id === station.id ? 'scale-125 z-30' : '']"
              >
                <div
                  :class="[
                    'w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg border border-white font-bold text-xs',
                    station.type === 'hospital' ? 'bg-rose-600' : station.type === 'police' ? 'bg-blue-600' : 'bg-amber-600',
                    selectedStation.id === station.id ? 'ring-4 ring-white/50 animate-bounce' : ''
                  ]"
                >
                  <Hospital v-if="station.type === 'hospital'" class="w-4 h-4" />
                  <ShieldAlert v-else-if="station.type === 'police'" class="w-4 h-4" />
                  <Flame v-else class="w-4 h-4" />
                </div>
              </button>
            </div>

            <!-- Legend -->
            <div class="relative z-10 flex items-center gap-3 bg-slate-900/80 backdrop-blur-xs p-2.5 rounded-xl border border-white/10 text-[11px] text-white">
              <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-rose-500" /> មន្ទីរពេទ្យ (119)</span>
              <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-blue-500" /> នគរបាល (117)</span>
              <span class="flex items-center gap-1"><span class="w-2.5 h-2.5 rounded-full bg-amber-500" /> ពន្លត់អគ្គីភ័យ (118)</span>
            </div>
          </div>

          <!-- Station Detail Panel -->
          <div class="lg:col-span-4 p-5 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between space-y-4">
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-white text-[#0D47A1] border border-slate-200">
                  {{ selectedStation.type === 'hospital' ? 'មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់' : selectedStation.type === 'police' ? 'ស្នងការដ្ឋាននគរបាល' : 'ស្ថានីយពន្លត់អគ្គីភ័យ' }}
                </span>
                <span class="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  📍 {{ selectedStation.distance }}
                </span>
              </div>

              <h3 class="font-black text-base text-slate-900 leading-snug">
                {{ selectedStation.nameKh }}
              </h3>

              <p class="text-xs text-slate-500 leading-relaxed">
                {{ selectedStation.addressKh }}
              </p>

              <div class="p-3 bg-white rounded-xl border border-slate-200 space-y-1">
                <span class="text-[10px] font-bold text-slate-400 uppercase">លេខទូរស័ព្ទផ្ទាល់</span>
                <p class="font-mono font-black text-base text-[#0D47A1]">{{ selectedStation.phone }}</p>
              </div>
            </div>

            <div class="space-y-2 pt-2">
              <a
                :href="'tel:' + selectedStation.phone"
                class="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <PhoneCall class="w-3.5 h-3.5" />
                <span>ហៅផ្ទាល់ទៅកាន់ស្ថានីយ</span>
              </a>

              <a
                :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(selectedStation.gmapsQuery)"
                target="_blank"
                rel="noopener noreferrer"
                class="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
              >
                <Navigation class="w-3.5 h-3.5 text-blue-600" />
                <span>បើកមើលផ្លូវលើ Google Maps</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>
