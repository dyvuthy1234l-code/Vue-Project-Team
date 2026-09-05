<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  AlertTriangle,
  LocateFixed,
  X,
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

// Emergency Map Stations (Hospitals, Police, Fire) with Real Coordinates
export interface EmergencyStation {
  id: string
  name: string
  nameKh: string
  type: 'hospital' | 'police' | 'fire'
  address: string
  addressKh: string
  phone: string
  distance: string
  coordinates: { lat: number; lng: number }
  openHours: string
  openHoursKh: string
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
    coordinates: { lat: 11.5833, lng: 104.9192 },
    openHours: 'Open 24/7',
    openHoursKh: 'សង្គ្រោះបន្ទាន់ ២៤ម៉ោង'
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
    coordinates: { lat: 11.5369, lng: 104.9083 },
    openHours: 'Open 24/7',
    openHoursKh: 'សង្គ្រោះបន្ទាន់ ២៤ម៉ោង'
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
    coordinates: { lat: 11.5684, lng: 104.8967 },
    openHours: 'Open 24/7',
    openHoursKh: 'សង្គ្រោះបន្ទាន់ ២៤ម៉ោង'
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
    coordinates: { lat: 11.5517, lng: 104.9298 },
    openHours: 'Open 24/7',
    openHoursKh: 'ប្រចាំការ ២៤ម៉ោង'
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
    coordinates: { lat: 11.5714, lng: 104.8950 },
    openHours: 'Open 24/7',
    openHoursKh: 'ប្រចាំការ ២៤ម៉ោង'
  },
  {
    id: 'central-fire-rescue',
    name: 'Phnom Penh Central Fire & Rescue Brigade',
    nameKh: 'កងកម្លាំងនគរបាលបង្ការ និងពន្លត់អគ្គីភ័យរាជធានីភ្នំពេញ (១១៨)',
    type: 'fire',
    address: 'Near Olympic Stadium, Khan 7 Makara, Phnom Penh',
    addressKh: 'ក្បែរស្តាតអូឡាំពិក ខណ្ឌ៧មករា រាជធានីភ្នំពេញ',
    phone: '118',
    distance: '1.5 គ.ម',
    coordinates: { lat: 11.5583, lng: 104.9167 },
    openHours: 'Open 24/7',
    openHoursKh: 'ប្រចាំការ ២៤ម៉ោង'
  }
])

const activeMapFilter = ref<'all' | 'hospital' | 'police' | 'fire'>('all')
const selectedStation = ref<EmergencyStation>(mapStations.value[0])

const mapEmbedUrl = computed(() => {
  const { lat, lng } = selectedStation.value.coordinates
  return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`
})

const mapDirectionsUrl = computed(() => {
  const { lat, lng } = selectedStation.value.coordinates
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
})

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

function selectStation(station: EmergencyStation) {
  selectedStation.value = station
}

function getStationIcon(type: 'hospital' | 'police' | 'fire') {
  if (type === 'hospital') return Hospital
  if (type === 'police') return ShieldAlert
  return Flame
}

function getStationIconBg(type: 'hospital' | 'police' | 'fire') {
  if (type === 'hospital') return 'bg-rose-600 text-white'
  if (type === 'police') return 'bg-blue-600 text-white'
  return 'bg-amber-500 text-white'
}

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

// ==========================================
// 25 PROVINCES & CITIES EMERGENCY DATA & SEARCH
// ==========================================
export interface ProvinceEmergency {
  id: string
  name: string
  nameKh: string
  code: string
  police: string
  hospital: string
  hospitalName: string
  redCross: string
}

const allProvincesData: ProvinceEmergency[] = [
  { id: 'phnom-penh', name: 'Phnom Penh', nameKh: 'រាជធានីភ្នំពេញ', code: 'PP', police: '023 212 117', hospital: '023 426 948', hospitalName: 'មន្ទីរពេទ្យកាល់ម៉ែត (Calmette)', redCross: '023 212 876' },
  { id: 'kandal', name: 'Kandal', nameKh: 'ខេត្តកណ្តាល', code: 'KD', police: '024 985 117', hospital: '024 985 244', hospitalName: 'មន្ទីរពេទ្យបង្អែកជ័យជំនះ', redCross: '024 985 300' },
  { id: 'siem-reap', name: 'Siem Reap', nameKh: 'ខេត្តសៀមរាប', code: 'SR', police: '063 760 117', hospital: '063 764 091', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តសៀមរាប', redCross: '063 760 224' },
  { id: 'battambang', name: 'Battambang', nameKh: 'ខេត្តបាត់ដំបង', code: 'BB', police: '053 952 117', hospital: '053 952 822', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តបាត់ដំបង', redCross: '053 952 411' },
  { id: 'preah-sihanouk', name: 'Preah Sihanouk', nameKh: 'ខេត្តព្រះសីហនុ', code: 'SHV', police: '034 933 117', hospital: '034 933 411', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តព្រះសីហនុ', redCross: '034 933 765' },
  { id: 'kampong-cham', name: 'Kampong Cham', nameKh: 'ខេត្តកំពង់ចាម', code: 'KC', police: '042 941 117', hospital: '042 941 233', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ចាម', redCross: '042 941 405' },
  { id: 'kampot', name: 'Kampot', nameKh: 'ខេត្តកំពត', code: 'KP', police: '033 932 117', hospital: '033 932 805', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពត', redCross: '033 932 543' },
  { id: 'takeo', name: 'Takeo', nameKh: 'ខេត្តតាកែវ', code: 'TK', police: '032 931 117', hospital: '032 931 230', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តតាកែវ', redCross: '032 931 411' },
  { id: 'kampong-chhnang', name: 'Kampong Chhnang', nameKh: 'ខេត្តកំពង់ឆ្នាំង', code: 'KCH', police: '026 988 117', hospital: '026 988 200', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ឆ្នាំង', redCross: '026 988 321' },
  { id: 'kampong-speu', name: 'Kampong Speu', nameKh: 'ខេត្តកំពង់ស្ពឺ', code: 'KS', police: '025 987 117', hospital: '025 987 220', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ស្ពឺ', redCross: '025 987 342' },
  { id: 'kampong-thom', name: 'Kampong Thom', nameKh: 'ខេត្តកំពង់ធំ', code: 'KT', police: '062 961 117', hospital: '062 961 240', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ធំ', redCross: '062 961 355' },
  { id: 'koh-kong', name: 'Koh Kong', nameKh: 'ខេត្តកោះកុង', code: 'KK', police: '035 936 117', hospital: '035 936 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកោះកុង', redCross: '035 936 344' },
  { id: 'kratie', name: 'Kratie', nameKh: 'ខេត្តក្រចេះ', code: 'KR', police: '072 971 117', hospital: '072 971 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តក្រចេះ', redCross: '072 971 311' },
  { id: 'mondulkiri', name: 'Mondulkiri', nameKh: 'ខេត្តមណ្ឌលគិរី', code: 'MK', police: '073 973 117', hospital: '073 973 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តមណ្ឌលគិរី', redCross: '073 973 345' },
  { id: 'preah-vihear', name: 'Preah Vihear', nameKh: 'ខេត្តព្រះវិហារ', code: 'PV', police: '064 954 117', hospital: '064 954 210', hospitalName: 'មន្ទីរពេទ្យបង្អែក ១៦ មករា ព្រះវិហារ', redCross: '064 954 311' },
  { id: 'prey-veng', name: 'Prey Veng', nameKh: 'ខេត្តព្រៃវែង', code: 'PVG', police: '043 944 117', hospital: '043 944 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តព្រៃវែង', redCross: '043 944 322' },
  { id: 'pursat', name: 'Pursat', nameKh: 'ខេត្តពោធិ៍សាត់', code: 'PS', police: '052 951 117', hospital: '052 951 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តពោធិ៍សាត់', redCross: '052 951 333' },
  { id: 'ratanakiri', name: 'Ratanakiri', nameKh: 'ខេត្តរតនគិរី', code: 'RK', police: '075 974 117', hospital: '075 974 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកបានលុង រតនគិរី', redCross: '075 974 344' },
  { id: 'stung-treng', name: 'Stung Treng', nameKh: 'ខេត្តស្ទឹងត្រែង', code: 'ST', police: '074 973 117', hospital: '074 973 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តស្ទឹងត្រែង', redCross: '074 973 355' },
  { id: 'svay-rieng', name: 'Svay Rieng', nameKh: 'ខេត្តស្វាយរៀង', code: 'SVR', police: '044 945 117', hospital: '044 945 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តស្វាយរៀង', redCross: '044 945 321' },
  { id: 'banteay-meanchey', name: 'Banteay Meanchey', nameKh: 'ខេត្តបន្ទាយមានជ័យ', code: 'BMC', police: '054 958 117', hospital: '054 958 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកមង្គលបូរី', redCross: '054 958 344' },
  { id: 'kep', name: 'Kep', nameKh: 'ខេត្តកែប', code: 'KEP', police: '036 936 117', hospital: '036 936 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តកែប', redCross: '036 936 322' },
  { id: 'pailin', name: 'Pailin', nameKh: 'ខេត្តប៉ៃលិន', code: 'PL', police: '053 953 117', hospital: '053 953 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកខេត្តប៉ៃលិន', redCross: '053 953 311' },
  { id: 'oddar-meanchey', name: 'Oddar Meanchey', nameKh: 'ខេត្តឧត្តរមានជ័យ', code: 'OMC', police: '065 957 117', hospital: '065 957 210', hospitalName: 'មន្ទីរពេទ្យបង្អែកសំរោង ឧត្តរមានជ័យ', redCross: '065 957 333' },
  { id: 'tboung-khmum', name: 'Tboung Khmum', nameKh: 'ខេត្តត្បូងឃ្មុំ', code: 'TBK', police: '042 942 117', hospital: '042 942 210', hospitalName: 'មន្ទីរពេទ្យមិត្តភាពកម្ពុជា-ចិន ត្បូងឃ្មុំ', redCross: '042 942 344' }
]

const selectedProvince = ref('phnom-penh')
const provinceSearchQuery = ref('')

const filteredProvinces = computed(() => {
  if (!provinceSearchQuery.value.trim()) return allProvincesData
  const q = provinceSearchQuery.value.trim().toLowerCase()
  return allProvincesData.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.nameKh.toLowerCase().includes(q) ||
    p.code.toLowerCase().includes(q) ||
    p.hospitalName.toLowerCase().includes(q) ||
    p.police.includes(q) ||
    p.hospital.includes(q)
  )
})

const activeProvince = computed(() => {
  return allProvincesData.find(p => p.id === selectedProvince.value) || allProvincesData[0]
})

function selectProvince(id: string) {
  selectedProvince.value = id
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
           6. PROVINCIAL EMERGENCY HOTLINES (រាជធានី-ខេត្តទាំង ២៥ + ប្រព័ន្ធស្វែងរក)
           ============================================================ -->
      <section class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-black border border-blue-200">
              <Building2 class="w-3.5 h-3.5 text-[#0D47A1]" />
              <span>{{ currentLanguage === 'kh' ? 'រាជធានី-ខេត្តទាំង ២៥ នៃព្រះរាជាណាចក្រកម្ពុជា' : 'All 25 Cambodian Provinces & Municipalities' }}</span>
            </div>
            <h2 class="text-lg sm:text-xl font-black text-slate-900">
              {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់ប្រចាំរាជធានី-ខេត្តទាំង ២៥' : '25 Provincial Emergency Command Hotlines' }}
            </h2>
            <p class="text-xs text-slate-500">ស្វែងរក ឬជ្រើសរើសខេត្តក្រុង ដើម្បីមើលលេខទូរស័ព្ទស្នងការដ្ឋាននគរបាល មន្ទីរពេទ្យបង្អែកខេត្ត និងកាកបាទក្រហម</p>
          </div>

          <!-- Quick Actions: Search Input & Province Dropdown -->
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <!-- Search Bar for Provinces -->
            <div class="relative min-w-[240px]">
              <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                v-model="provinceSearchQuery"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកខេត្តក្រុង (ឧ. ភ្នំពេញ, សៀមរាប, Kampot)...' : 'Search province...'"
                class="w-full pl-9 pr-8 py-2 text-xs font-bold rounded-xl border border-slate-200 bg-slate-50/80 focus:bg-white focus:border-[#0D47A1] focus:ring-2 focus:ring-blue-100 outline-none transition-all placeholder:text-slate-400"
              />
              <button
                v-if="provinceSearchQuery"
                @click="provinceSearchQuery = ''"
                class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="សម្អាត"
              >
                <X class="w-3.5 h-3.5" />
              </button>
            </div>

            <!-- Dropdown of all 25 Provinces -->
            <div class="flex items-center gap-2 shrink-0">
              <select
                v-model="selectedProvince"
                class="w-full sm:w-auto px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-black text-[#0D47A1] focus:bg-white focus:border-[#0D47A1] outline-none shadow-2xs cursor-pointer"
              >
                <option
                  v-for="prov in allProvincesData"
                  :key="prov.id"
                  :value="prov.id"
                >
                  {{ prov.nameKh }} ({{ prov.name }})
                </option>
              </select>
            </div>
          </div>
        </div>

        <!-- Province Quick Selection Tags (Filtered by Search Query if entered) -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500 font-bold">
            <span>{{ provinceSearchQuery ? `លទ្ធផលស្វែងរក (${filteredProvinces.length} ខេត្តក្រុង)` : 'ចុចជ្រើសរើសខេត្តក្រុងរហ័ស (Quick Select)：' }}</span>
            <span v-if="provinceSearchQuery" class="text-blue-600 cursor-pointer hover:underline" @click="provinceSearchQuery = ''">
              បង្ហាញទាំងអស់ (២៥)
            </span>
          </div>

          <div class="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto pr-1 pb-1">
            <button
              v-for="p in filteredProvinces"
              :key="p.id"
              @click="selectProvince(p.id)"
              :class="[
                'px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border',
                selectedProvince === p.id
                  ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200 hover:border-slate-300'
              ]"
            >
              <span>{{ p.nameKh }}</span>
              <span :class="selectedProvince === p.id ? 'text-blue-200' : 'text-slate-400'" class="text-[10px] font-mono font-semibold">[{{ p.code }}]</span>
            </button>
            <div v-if="filteredProvinces.length === 0" class="text-xs text-slate-400 py-2 italic">
              មិនមានខេត្តក្រុងដែលត្រូវនឹងពាក្យស្វែងរក "{{ provinceSearchQuery }}" នោះទេ។
            </div>
          </div>
        </div>

        <!-- Active Selected Province Display Banner & Action Hotlines -->
        <div class="rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 p-5 space-y-4">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-blue-100/80">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                {{ activeProvince.code }}
              </div>
              <div>
                <h3 class="font-black text-base text-slate-900 flex items-center gap-2">
                  <span>{{ activeProvince.nameKh }}</span>
                  <span class="text-slate-400 font-normal text-xs">({{ activeProvince.name }})</span>
                </h3>
                <p class="text-xs text-slate-500 font-medium">លេខទំនាក់ទំនងបន្ទាន់ផ្លូវការប្រចាំតំបន់ ២៤ម៉ោង</p>
              </div>
            </div>
            <div class="inline-flex items-center gap-2 text-xs font-bold text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-2xs self-start sm:self-auto">
              <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span>ប្រចាំការ ២៤/៧</span>
            </div>
          </div>

          <!-- 3-Column Hotlines: Police Commissariat, Referral Hospital, Red Cross -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- 1. Police Dispatch -->
            <div class="p-4 rounded-xl bg-white border border-blue-100 shadow-xs flex flex-col justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-blue-700 tracking-wider">ស្នងការដ្ឋាននគរបាលខេត្ត</span>
                  <ShieldAlert class="w-4 h-4 text-blue-600" />
                </div>
                <h4 class="font-black text-xs text-slate-800">បញ្ជាការដ្ឋាននគរបាល {{ activeProvince.nameKh }}</h4>
                <p class="text-lg font-mono font-black text-[#0D47A1]">{{ activeProvince.police }}</p>
              </div>
              <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  :href="'tel:' + activeProvince.police"
                  class="flex-1 py-2 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <PhoneCall class="w-3.5 h-3.5" />
                  <span>ហៅបន្ទាន់</span>
                </a>
                <button
                  @click="copyToClipboard(activeProvince.police)"
                  class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  :title="copiedNumber === activeProvince.police ? 'បានចម្លង!' : 'ចម្លងលេខ'"
                >
                  <Check v-if="copiedNumber === activeProvince.police" class="w-3.5 h-3.5 text-emerald-600" />
                  <Copy v-else class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 2. Provincial Hospital Emergency -->
            <div class="p-4 rounded-xl bg-white border border-rose-100 shadow-xs flex flex-col justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-rose-700 tracking-wider">ផ្នែកសង្គ្រោះបន្ទាន់មន្ទីរពេទ្យ</span>
                  <Hospital class="w-4 h-4 text-rose-600" />
                </div>
                <h4 class="font-black text-xs text-slate-800 truncate" :title="activeProvince.hospitalName">{{ activeProvince.hospitalName }}</h4>
                <p class="text-lg font-mono font-black text-rose-600">{{ activeProvince.hospital }}</p>
              </div>
              <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  :href="'tel:' + activeProvince.hospital"
                  class="flex-1 py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <PhoneCall class="w-3.5 h-3.5" />
                  <span>ហៅបន្ទាន់</span>
                </a>
                <button
                  @click="copyToClipboard(activeProvince.hospital)"
                  class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  :title="copiedNumber === activeProvince.hospital ? 'បានចម្លង!' : 'ចម្លងលេខ'"
                >
                  <Check v-if="copiedNumber === activeProvince.hospital" class="w-3.5 h-3.5 text-emerald-600" />
                  <Copy v-else class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- 3. Red Cross / Humanitarian Aid -->
            <div class="p-4 rounded-xl bg-white border border-emerald-100 shadow-xs flex flex-col justify-between gap-3">
              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <span class="text-[10px] font-black uppercase text-emerald-700 tracking-wider">កាកបាទក្រហម / ជំនួយសង្គ្រោះ</span>
                  <HeartPulse class="w-4 h-4 text-emerald-600" />
                </div>
                <h4 class="font-black text-xs text-slate-800">កាកបាទក្រហមកម្ពុជា សាខា{{ activeProvince.nameKh }}</h4>
                <p class="text-lg font-mono font-black text-emerald-700">{{ activeProvince.redCross }}</p>
              </div>
              <div class="flex items-center gap-2 pt-2 border-t border-slate-100">
                <a
                  :href="'tel:' + activeProvince.redCross"
                  class="flex-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <PhoneCall class="w-3.5 h-3.5" />
                  <span>ហៅបន្ទាន់</span>
                </a>
                <button
                  @click="copyToClipboard(activeProvince.redCross)"
                  class="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                  :title="copiedNumber === activeProvince.redCross ? 'បានចម្លង!' : 'ចម្លងលេខ'"
                >
                  <Check v-if="copiedNumber === activeProvince.redCross" class="w-3.5 h-3.5 text-emerald-600" />
                  <Copy v-else class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
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
           8. INTERACTIVE REAL GOOGLE MAP & NEARBY EMERGENCY STATIONS
           ============================================================ -->
      <section class="overflow-hidden rounded-3xl bg-white shadow-[0_12px_30px_rgba(31,64,122,.07)] ring-1 ring-slate-100 border border-slate-200/90">
        <!-- Header & Category Filter Tabs -->
        <div class="flex flex-col justify-between gap-4 border-b border-slate-100 bg-gradient-to-r from-blue-50/70 via-white to-transparent px-6 py-4 lg:flex-row lg:items-center">
          <div class="flex items-center gap-3">
            <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#0D47A1] text-white shadow-md shadow-blue-950/20">
              <LocateFixed class="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-base sm:text-lg font-black tracking-tight text-[#0A2458]">
                  {{ currentLanguage === 'kh' ? 'ផែនទីស្ថានីយសង្គ្រោះបន្ទាន់ & មន្ទីរពេទ្យជិតបំផុត' : 'Emergency Stations & Nearby Trauma Centers' }}
                </h2>
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-black text-emerald-700 ring-1 ring-emerald-500/20">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                  LIVE REAL MAP
                </span>
              </div>
              <div class="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                <span>{{ currentLanguage === 'kh' ? 'ផែនទីផ្កាយរណបពិតជាក់ស្តែង (Google Maps)' : 'Live Interactive Google Map Navigation' }}</span>
                <span class="text-slate-300">·</span>
                <span class="text-[11px] text-slate-400 font-bold">
                  {{ currentLanguage === 'kh' ? 'ចុចលើស្ថានីយដើម្បីបង្ហាញទីតាំង និងនាំផ្លូវ' : 'Click any station to view live map' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Category Filter Tabs -->
          <div class="flex flex-wrap gap-1.5 rounded-2xl bg-slate-100/90 p-1.5">
            <button
              v-for="filter in mapFilters"
              :key="filter.id"
              type="button"
              :class="[
                'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer',
                activeMapFilter === filter.id
                  ? 'bg-white text-[#0D47A1] shadow-sm font-black ring-1 ring-blue-500/20'
                  : 'text-slate-600 hover:text-[#0D47A1] hover:bg-white/50'
              ]"
              @click="activeMapFilter = filter.id as any"
            >
              <span>{{ filter.label }}</span>
            </button>
          </div>
        </div>

        <!-- Real Map & Stations Grid (Matching HomePage Layout) -->
        <div class="grid gap-0 p-4 lg:grid-cols-[1.2fr_.8fr]">
          <!-- Real Google Map Embed Frame -->
          <div class="relative min-h-[440px] overflow-hidden rounded-2xl bg-blue-50 shadow-inner border border-slate-200/80">
            <iframe
              :key="mapEmbedUrl"
              :src="mapEmbedUrl"
              title="CamLife Emergency Real Map"
              class="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            />

            <!-- Top Active Location Floating Card -->
            <div class="absolute left-3 top-3 max-w-[88%] rounded-2xl border border-white/90 bg-white/95 p-3 shadow-xl backdrop-blur">
              <div class="flex items-start gap-2.5">
                <span :class="['flex h-8 w-8 shrink-0 items-center justify-center rounded-xl shadow-xs', getStationIconBg(selectedStation.type)]">
                  <component :is="getStationIcon(selectedStation.type)" class="h-4 w-4" />
                </span>
                <div class="min-w-0">
                  <div class="flex items-center gap-1.5">
                    <p class="truncate text-xs sm:text-sm font-black text-[#0A2540]">
                      {{ currentLanguage === 'kh' ? selectedStation.nameKh : selectedStation.name }}
                    </p>
                    <span class="rounded bg-blue-100 px-1.5 py-0.5 text-[9px] font-black text-blue-700 shrink-0">
                      {{ currentLanguage === 'kh' ? 'កំពុងជ្រើសរើស' : 'Selected' }}
                    </span>
                  </div>
                  <p class="mt-0.5 truncate text-[11px] text-slate-500">
                    {{ currentLanguage === 'kh' ? selectedStation.addressKh : selectedStation.address }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Bottom Floating Action Bar -->
            <div class="absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2">
              <a
                :href="mapDirectionsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] px-4 py-2.5 text-xs font-black text-white shadow-lg transition duration-150 active:scale-98"
              >
                <MapPin class="h-4 w-4" />
                <span>{{ currentLanguage === 'kh' ? 'ទទួលទិសដៅលើ Google Maps' : 'Get Directions (Google Maps)' }}</span>
              </a>

              <div class="flex items-center gap-2">
                <span class="hidden sm:inline-block rounded-xl bg-white/95 backdrop-blur px-3 py-2 text-[11px] font-bold text-slate-700 border border-slate-200 shadow-sm font-mono">
                  GPS: {{ selectedStation.coordinates.lat.toFixed(4) }}, {{ selectedStation.coordinates.lng.toFixed(4) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Stations List Panel -->
          <div class="bg-slate-50/70 p-3.5 lg:ml-4 lg:rounded-2xl space-y-2 flex flex-col justify-between mt-4 lg:mt-0">
            <div>
              <div class="flex items-center justify-between px-2 py-1 text-[11px] font-black uppercase tracking-wider text-slate-400">
                <span>{{ currentLanguage === 'kh' ? 'ស្ថានីយសង្គ្រោះបន្ទាន់ផ្ទៀងផ្ទាត់' : 'Verified Emergency Stations' }}</span>
                <span class="text-blue-600 font-mono font-bold">{{ filteredMapStations.length }} ទីតាំង</span>
              </div>

              <!-- List of Station Cards -->
              <div class="mt-2 space-y-2 max-h-[380px] overflow-y-auto pr-1">
                <button
                  v-for="station in filteredMapStations"
                  :key="station.id"
                  type="button"
                  :class="[
                    'group relative flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 cursor-pointer',
                    selectedStation.id === station.id
                      ? 'border-[#0D47A1] bg-white shadow-md ring-2 ring-[#0D47A1]/20'
                      : 'border-slate-200/70 bg-white/80 hover:border-blue-200 hover:bg-white hover:shadow-xs'
                  ]"
                  @click="selectStation(station)"
                >
                  <!-- Active Indicator Ribbon -->
                  <span
                    v-if="selectedStation.id === station.id"
                    class="absolute -left-1 top-3 bottom-3 w-1.5 rounded-r bg-[#0D47A1]"
                  />

                  <!-- Icon Badge -->
                  <div :class="['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-xs ring-1 transition-transform group-hover:scale-105', getStationIconBg(station.type)]">
                    <component :is="getStationIcon(station.type)" class="h-5 w-5" />
                  </div>

                  <!-- Details -->
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center justify-between gap-1.5">
                      <h4 class="truncate text-xs font-black text-slate-900">
                        {{ currentLanguage === 'kh' ? station.nameKh : station.name }}
                      </h4>
                      <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-black text-emerald-700 shrink-0">
                        {{ station.distance }}
                      </span>
                    </div>

                    <p class="truncate text-[11px] text-slate-500 mt-0.5">
                      {{ currentLanguage === 'kh' ? station.addressKh : station.address }}
                    </p>

                    <div class="flex items-center gap-2 mt-1.5 text-[10px]">
                      <span class="font-mono font-black text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                        {{ station.phone }}
                      </span>
                      <span class="text-slate-400">·</span>
                      <span class="text-emerald-700 font-bold">{{ currentLanguage === 'kh' ? station.openHoursKh : station.openHours }}</span>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            <!-- Quick Hotline Call Footer for Selected Station -->
            <div class="pt-3 border-t border-slate-200/80 flex items-center gap-2">
              <a
                :href="'tel:' + selectedStation.phone"
                class="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <PhoneCall class="w-3.5 h-3.5" />
                <span>{{ currentLanguage === 'kh' ? 'ហៅទូរស័ព្ទទៅកាន់ស្ថានីយនេះ' : 'Call Station Now' }}</span>
              </a>

              <a
                :href="mapDirectionsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-blue-600 transition-colors shadow-2xs flex items-center justify-center"
                title="Google Maps"
              >
                <Navigation class="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>