<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import {
  Clock,
  Compass,
  Bus,
  Car,
  Train,
  Plane,
  Ship,
  RotateCcw,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowRightLeft,
  Smartphone,
  ExternalLink,
  CreditCard,
  Ticket,
  Navigation,
  LocateFixed,
  Sparkles,
  X
} from 'lucide-vue-next'
import ServiceHeroBanner from '@/components/ServiceHeroBanner.vue'
import StationPicker from '@/components/StationPicker.vue'
import EmptyState from '@/components/EmptyState.vue'
import PaginationBar from '@/components/PaginationBar.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getTransport } from '@/services/dataService'
import { usePagination } from '@/composables/usePagination'
import { usePageMeta } from '@/composables/usePageMeta'
import { useLocation } from '@/composables/useLocation'

const { t, localized, currentLanguage } = useLanguage()
const { selectedProvince, setProvince } = useLocation()

usePageMeta({
  title: 'ការធ្វើដំណើរ និងរថយន្តក្រុងសាធារណៈ — CamLife Public Transit & Routes',
  description: 'មគ្គុទ្ទេសក៍ខ្សែរថយន្តក្រុងរាជធានីភ្នំពេញ តម្លៃសំបុត្រ និងគោលការណ៍ជិះឥតគិតថ្លៃសម្រាប់ពលរដ្ឋ'
})

const allTransport = getTransport()

// Active View: 'all-routes' vs 'city-bus-lines'
const activeViewTab = ref<'all-routes' | 'city-bus-lines'>('all-routes')

// Provincial Terminal Interface & Data for all 25 Cambodian Provinces
export interface ProvincialTerminal {
  provinceId: string
  name: string
  nameKh: string
  code: string
  terminalName: string
  terminalNameKh: string
  address: string
  addressKh: string
  lat: number
  lng: number
  highway: string
  highwayKh: string
  majorModes: string[]
  speedKmh: number
}

const PROVINCIAL_TERMINALS: ProvincialTerminal[] = [
  {
    provinceId: 'phnom-penh',
    name: 'Phnom Penh',
    nameKh: 'រាជធានីភ្នំពេញ',
    code: 'PP',
    terminalName: 'Phnom Penh Central Transit Terminal',
    terminalNameKh: 'ស្ថានីយចំណតរថយន្តក្រុងកណ្តាលភ្នំពេញ (វត្តភ្នំ / ច្បារអំពៅ)',
    address: 'Monivong Blvd & Russian Blvd Hub, Phnom Penh',
    addressKh: 'មហាវិថីព្រះមុនីវង្ស និងមហាវិថីសហព័ន្ធរុស្ស៊ី',
    lat: 11.5564,
    lng: 104.9282,
    highway: 'Monivong Blvd & Russian Blvd Hub / Ring Road 3',
    highwayKh: 'មហាវិថីព្រះមុនីវង្ស, សហព័ន្ធរុស្ស៊ី និងផ្លូវក្រវាត់ក្រុងទី៣',
    majorModes: ['bus', 'taxi', 'train', 'plane'],
    speedKmh: 65
  },
  {
    provinceId: 'kandal',
    name: 'Kandal',
    nameKh: 'ខេត្តកណ្តាល',
    code: 'KD',
    terminalName: 'Ta Khmao City Terminal',
    terminalNameKh: 'ស្ថានីយចំណតរថយន្តក្រុងក្រុងតាខ្មៅ',
    address: 'National Road 2, Ta Khmao',
    addressKh: 'ផ្លូវជាតិលេខ ២ ក្រុងតាខ្មៅ',
    lat: 11.4554,
    lng: 104.9454,
    highway: 'NR 2 & Ring Road 3',
    highwayKh: 'ផ្លូវជាតិលេខ ២ និងផ្លូវក្រវាត់ក្រុងទី ៣',
    majorModes: ['bus', 'taxi'],
    speedKmh: 50
  },
  {
    provinceId: 'siem-reap',
    name: 'Siem Reap',
    nameKh: 'ខេត្តសៀមរាប',
    code: 'SR',
    terminalName: 'Chong Kov Sou Siem Reap Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងទេសចរណ៍ចុងកៅស៊ូ សៀមរាប',
    address: 'National Road 6, Siem Reap',
    addressKh: 'ផ្លូវជាតិលេខ ៦ ក្រុងសៀមរាប',
    lat: 13.3671,
    lng: 103.8448,
    highway: 'National Road 6 (NR6)',
    highwayKh: 'ផ្លូវជាតិលេខ ៦ (NR6)',
    majorModes: ['bus', 'taxi', 'plane'],
    speedKmh: 70
  },
  {
    provinceId: 'battambang',
    name: 'Battambang',
    nameKh: 'ខេត្តបាត់ដំបង',
    code: 'BB',
    terminalName: 'Battambang Central Bus Station',
    terminalNameKh: 'ស្ថានីយចំណតរថយន្តក្រុងកណ្តាលបាត់ដំបង',
    address: 'National Road 5, Battambang',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ក្រុងបាត់ដំបង',
    lat: 13.0957,
    lng: 103.2022,
    highway: 'National Road 5 (NR5)',
    highwayKh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    majorModes: ['bus', 'taxi', 'train'],
    speedKmh: 70
  },
  {
    provinceId: 'preah-sihanouk',
    name: 'Preah Sihanouk',
    nameKh: 'ខេត្តព្រះសីហនុ',
    code: 'SHV',
    terminalName: 'Sihanoukville Express & Port Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុង និងកំពង់ផែស្វយ័តក្រុងព្រះសីហនុ',
    address: 'Port Area & Expressway Entry, Sihanoukville',
    addressKh: 'តំបន់កំពង់ផែ និងផ្លូវល្បឿនលឿនភ្នំពេញ-ព្រះសីហនុ',
    lat: 10.6275,
    lng: 103.5221,
    highway: 'Expressway E1 / National Road 4',
    highwayKh: 'ផ្លូវល្បឿនលឿន E1 / ផ្លូវជាតិលេខ ៤',
    majorModes: ['bus', 'taxi', 'train', 'ferry', 'plane'],
    speedKmh: 95
  },
  {
    provinceId: 'kampong-cham',
    name: 'Kampong Cham',
    nameKh: 'ខេត្តកំពង់ចាម',
    code: 'KC',
    terminalName: 'Kizuna Bridge Terminal Kampong Cham',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងស្ពានគីហ្សូណា កំពង់ចាម',
    address: 'National Road 7 Riverside, Kampong Cham',
    addressKh: 'ផ្លូវជាតិលេខ ៧ មាត់ទន្លេមេគង្គ ក្រុងកំពង់ចាម',
    lat: 11.9924,
    lng: 105.4645,
    highway: 'National Road 7 (NR7)',
    highwayKh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 65
  },
  {
    provinceId: 'kampot',
    name: 'Kampot',
    nameKh: 'ខេត្តកំពត',
    code: 'KP',
    terminalName: 'Kampot Durian Roundabout Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងក្រុងកំពត (រង្វង់មូលធុរេន)',
    address: 'National Road 3, Kampot City',
    addressKh: 'ផ្លូវជាតិលេខ ៣ ក្រុងកំពត',
    lat: 10.6104,
    lng: 104.1815,
    highway: 'National Road 3 (NR3)',
    highwayKh: 'ផ្លូវជាតិលេខ ៣ (NR3)',
    majorModes: ['bus', 'taxi', 'train'],
    speedKmh: 65
  },
  {
    provinceId: 'takeo',
    name: 'Takeo',
    nameKh: 'ខេត្តតាកែវ',
    code: 'TK',
    terminalName: 'Doun Kaev Transit Station Takeo',
    terminalNameKh: 'ស្ថានីយចំណតរថយន្តក្រុងដូនកែវ តាកែវ',
    address: 'National Road 2, Doun Kaev',
    addressKh: 'ផ្លូវជាតិលេខ ២ ក្រុងដូនកែវ',
    lat: 10.9908,
    lng: 104.7850,
    highway: 'National Road 2 (NR2)',
    highwayKh: 'ផ្លូវជាតិលេខ ២ (NR2)',
    majorModes: ['bus', 'taxi', 'train'],
    speedKmh: 60
  },
  {
    provinceId: 'kampong-chhnang',
    name: 'Kampong Chhnang',
    nameKh: 'ខេត្តកំពង់ឆ្នាំង',
    code: 'KCH',
    terminalName: 'Kampong Chhnang Provincial Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងកំពង់ឆ្នាំង',
    address: 'National Road 5, Kampong Chhnang',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ក្រុងកំពង់ឆ្នាំង',
    lat: 12.2500,
    lng: 104.6667,
    highway: 'National Road 5 (NR5)',
    highwayKh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 70
  },
  {
    provinceId: 'kampong-speu',
    name: 'Kampong Speu',
    nameKh: 'ខេត្តកំពង់ស្ពឺ',
    code: 'KS',
    terminalName: 'Chbar Mon Terminal Kampong Speu',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងច្បារមន កំពង់ស្ពឺ',
    address: 'National Road 4, Chbar Mon',
    addressKh: 'ផ្លូវជាតិលេខ ៤ ក្រុងច្បារមន',
    lat: 11.4533,
    lng: 104.5209,
    highway: 'National Road 4 (NR4)',
    highwayKh: 'ផ្លូវជាតិលេខ ៤ (NR4)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 65
  },
  {
    provinceId: 'kampong-thom',
    name: 'Kampong Thom',
    nameKh: 'ខេត្តកំពង់ធំ',
    code: 'KT',
    terminalName: 'Steung Saen Terminal Kampong Thom',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងស្ទឹងសែន កំពង់ធំ',
    address: 'National Road 6, Steung Saen',
    addressKh: 'ផ្លូវជាតិលេខ ៦ ក្រុងស្ទឹងសែន',
    lat: 12.7111,
    lng: 104.8887,
    highway: 'National Road 6 (NR6)',
    highwayKh: 'ផ្លូវជាតិលេខ ៦ (NR6)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 70
  },
  {
    provinceId: 'koh-kong',
    name: 'Koh Kong',
    nameKh: 'ខេត្តកោះកុង',
    code: 'KK',
    terminalName: 'Khemarak Phoumin Terminal Koh Kong',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងខេមរភូមិន្ទ កោះកុង',
    address: 'National Road 48, Khemarak Phoumin',
    addressKh: 'ផ្លូវជាតិលេខ ៤៨ ក្រុងខេមរភូមិន្ទ',
    lat: 11.6153,
    lng: 102.9838,
    highway: 'National Road 48 (NR48)',
    highwayKh: 'ផ្លូវជាតិលេខ ៤៨ (NR48)',
    majorModes: ['bus', 'taxi', 'ferry'],
    speedKmh: 55
  },
  {
    provinceId: 'kratie',
    name: 'Kratie',
    nameKh: 'ខេត្តក្រចេះ',
    code: 'KR',
    terminalName: 'Kratie Riverside Transit Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងមាត់ទន្លេក្រចេះ',
    address: 'National Road 7 Riverside, Kratie',
    addressKh: 'ផ្លូវជាតិលេខ ៧ មាត់ទន្លេ ក្រុងក្រចេះ',
    lat: 12.4881,
    lng: 106.0188,
    highway: 'National Road 7 (NR7)',
    highwayKh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 65
  },
  {
    provinceId: 'mondulkiri',
    name: 'Mondulkiri',
    nameKh: 'ខេត្តមណ្ឌលគិរី',
    code: 'MK',
    terminalName: 'Sen Monorom Highland Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងសែនមនោរម្យ មណ្ឌលគិរី',
    address: 'National Road 76, Sen Monorom',
    addressKh: 'ផ្លូវជាតិលេខ ៧៦ ក្រុងសែនមនោរម្យ',
    lat: 12.4558,
    lng: 107.1881,
    highway: 'National Road 76 (NR76)',
    highwayKh: 'ផ្លូវជាតិលេខ ៧៦ (NR76)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 50
  },
  {
    provinceId: 'preah-vihear',
    name: 'Preah Vihear',
    nameKh: 'ខេត្តព្រះវិហារ',
    code: 'PV',
    terminalName: 'Tbeng Meanchey Station Preah Vihear',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងត្បែងមានជ័យ ព្រះវិហារ',
    address: 'National Road 62, Tbeng Meanchey',
    addressKh: 'ផ្លូវជាតិលេខ ៦២ ក្រុងត្បែងមានជ័យ',
    lat: 13.8073,
    lng: 104.9805,
    highway: 'National Road 62 (NR62)',
    highwayKh: 'ផ្លូវជាតិលេខ ៦២ (NR62)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 60
  },
  {
    provinceId: 'prey-veng',
    name: 'Prey Veng',
    nameKh: 'ខេត្តព្រៃវែង',
    code: 'PVG',
    terminalName: 'Prey Veng Provincial Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងកំពង់ត្របែក / ព្រៃវែង',
    address: 'National Road 11, Prey Veng City',
    addressKh: 'ផ្លូវជាតិលេខ ១១ ក្រុងព្រៃវែង',
    lat: 11.4868,
    lng: 105.3253,
    highway: 'National Road 11 (NR11)',
    highwayKh: 'ផ្លូវជាតិលេខ ១១ (NR11)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 60
  },
  {
    provinceId: 'pursat',
    name: 'Pursat',
    nameKh: 'ខេត្តពោធិ៍សាត់',
    code: 'PS',
    terminalName: 'Pursat Provincial Transit Hub',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងពោធិ៍សាត់',
    address: 'National Road 5, Pursat City',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ក្រុងពោធិ៍សាត់',
    lat: 12.5388,
    lng: 103.9192,
    highway: 'National Road 5 (NR5)',
    highwayKh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    majorModes: ['bus', 'taxi', 'train'],
    speedKmh: 70
  },
  {
    provinceId: 'ratanakiri',
    name: 'Ratanakiri',
    nameKh: 'ខេត្តរតនគិរី',
    code: 'RK',
    terminalName: 'Banlung Station Ratanakiri',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងបានលុង រតនគិរី',
    address: 'National Road 78, Banlung City',
    addressKh: 'ផ្លូវជាតិលេខ ៧៨ ក្រុងបានលុង',
    lat: 13.7394,
    lng: 106.9873,
    highway: 'National Road 78 (NR78)',
    highwayKh: 'ផ្លូវជាតិលេខ ៧៨ (NR78)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 55
  },
  {
    provinceId: 'stung-treng',
    name: 'Stung Treng',
    nameKh: 'ខេត្តស្ទឹងត្រែង',
    code: 'ST',
    terminalName: 'Stung Treng Junction Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងស្ទឹងត្រែង',
    address: 'National Road 7, Stung Treng',
    addressKh: 'ផ្លូវជាតិលេខ ៧ ក្រុងស្ទឹងត្រែង',
    lat: 13.5259,
    lng: 105.9683,
    highway: 'National Road 7 (NR7)',
    highwayKh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 65
  },
  {
    provinceId: 'svay-rieng',
    name: 'Svay Rieng',
    nameKh: 'ខេត្តស្វាយរៀង',
    code: 'SVR',
    terminalName: 'Svay Rieng & Bavet Border Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងស្វាយរៀង / ច្រកបាវិត',
    address: 'National Road 1, Svay Rieng',
    addressKh: 'ផ្លូវជាតិលេខ ១ ក្រុងស្វាយរៀង',
    lat: 11.0879,
    lng: 105.7994,
    highway: 'National Road 1 (NR1)',
    highwayKh: 'ផ្លូវជាតិលេខ ១ (NR1)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 65
  },
  {
    provinceId: 'banteay-meanchey',
    name: 'Banteay Meanchey',
    nameKh: 'ខេត្តបន្ទាយមានជ័យ',
    code: 'BMC',
    terminalName: 'Poipet / Serei Saophoan International Station',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងអន្តរជាតិប៉ោយប៉ែត / សិរីសោភ័ណ',
    address: 'National Road 5, Serei Saophoan & Poipet',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ក្រុងប៉ោយប៉ែត / សិរីសោភ័ណ',
    lat: 13.6672,
    lng: 102.8975,
    highway: 'National Road 5 (NR5)',
    highwayKh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
    majorModes: ['bus', 'taxi', 'train'],
    speedKmh: 70
  },
  {
    provinceId: 'kep',
    name: 'Kep',
    nameKh: 'ខេត្តកែប',
    code: 'KEP',
    terminalName: 'Kep Coastal Pier & Bus Hub',
    terminalNameKh: 'ចំណតរថយន្តទេសចរណ៍ និងផែកែប',
    address: 'Coastal Road 33A, Kep Beach',
    addressKh: 'ផ្លូវជាតិលេខ ៣៣A ឆ្នេរកែប',
    lat: 10.4829,
    lng: 104.3167,
    highway: 'National Road 33A (NR33A)',
    highwayKh: 'ផ្លូវជាតិលេខ ៣៣A (NR33A)',
    majorModes: ['bus', 'taxi', 'ferry'],
    speedKmh: 60
  },
  {
    provinceId: 'pailin',
    name: 'Pailin',
    nameKh: 'ខេត្តប៉ៃលិន',
    code: 'PL',
    terminalName: 'Pailin City & Phrom Border Terminal',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងប៉ៃលិន / ច្រកព្រំ',
    address: 'National Road 57, Pailin',
    addressKh: 'ផ្លូវជាតិលេខ ៥៧ ក្រុងប៉ៃលិន',
    lat: 12.8489,
    lng: 102.6093,
    highway: 'National Road 57 (NR57)',
    highwayKh: 'ផ្លូវជាតិលេខ ៥៧ (NR57)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 55
  },
  {
    provinceId: 'oddar-meanchey',
    name: 'Oddar Meanchey',
    nameKh: 'ខេត្តឧត្តរមានជ័យ',
    code: 'OMC',
    terminalName: 'Samraong Bus Terminal Oddar Meanchey',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងសំរោង ឧត្តរមានជ័យ',
    address: 'National Road 68, Samraong City',
    addressKh: 'ផ្លូវជាតិលេខ ៦៨ ក្រុងសំរោង',
    lat: 14.1818,
    lng: 103.5176,
    highway: 'National Road 68 (NR68)',
    highwayKh: 'ផ្លូវជាតិលេខ ៦៨ (NR68)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 60
  },
  {
    provinceId: 'tboung-khmum',
    name: 'Tboung Khmum',
    nameKh: 'ខេត្តត្បូងឃ្មុំ',
    code: 'TBK',
    terminalName: 'Suong City Bus Terminal Tboung Khmum',
    terminalNameKh: 'ស្ថានីយរថយន្តក្រុងសួង ត្បូងឃ្មុំ',
    address: 'National Road 7, Suong City',
    addressKh: 'ផ្លូវជាតិលេខ ៧ ក្រុងសួង',
    lat: 11.9056,
    lng: 105.6568,
    highway: 'National Road 7 (NR7)',
    highwayKh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
    majorModes: ['bus', 'taxi'],
    speedKmh: 65
  }
]

// Journey Planner State with 25 Provinces & GPS
const originProvinceId = ref<string>('phnom-penh')
const destinationProvinceId = ref<string>('siem-reap')
const selectedType = ref('All')
const userGpsCoords = ref<{ lat: number; lng: number } | null>(null)
const isLocating = ref(false)
const gpsStatusMessage = ref<string | null>(null)
const showTerminalMap = ref(false)

// Haversine direct distance calculation
function getHaversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return Math.round(R * c)
}

// User location detection via GPS
function detectUserLocation(notifyIfDenied = true) {
  if (typeof navigator === 'undefined' || !navigator.geolocation) {
    if (notifyIfDenied) {
      gpsStatusMessage.value = currentLanguage.value === 'kh'
        ? 'ឧបករណ៍របស់អ្នកមិនគាំទ្រប្រព័ន្ធ GPS ទេ។'
        : 'GPS is not supported on this device.'
    }
    return
  }

  isLocating.value = true
  gpsStatusMessage.value = currentLanguage.value === 'kh'
    ? 'កំពុងចាប់ទីតាំង GPS និងស្វែងរកស្ថានីយដែលនៅជិតអ្នកបំផុត...'
    : 'Detecting GPS coordinates and finding nearest transit hub...'

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      isLocating.value = false
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      userGpsCoords.value = { lat, lng }

      // Find closest province terminal
      let closestTerminal = PROVINCIAL_TERMINALS[0]
      let minDistance = Infinity

      for (const term of PROVINCIAL_TERMINALS) {
        const d = getHaversineDistanceKm(lat, lng, term.lat, term.lng)
        if (d < minDistance) {
          minDistance = d
          closestTerminal = term
        }
      }

      originProvinceId.value = closestTerminal.provinceId
      setProvince(closestTerminal.provinceId)
      gpsStatusMessage.value = currentLanguage.value === 'kh'
        ? `បានចាប់ទីតាំងជោគជ័យ! អ្នកស្ថិតនៅជិត "${closestTerminal.nameKh}" (ចម្ងាយត្រឹមតែ ~${minDistance} គ.ម)`
        : `GPS location detected! You are nearest to "${closestTerminal.name}" (~${minDistance} km)`
    },
    () => {
      isLocating.value = false
      if (notifyIfDenied) {
        gpsStatusMessage.value = currentLanguage.value === 'kh'
          ? 'មិនអាចចាប់ទីតាំងបានទេ៖ សូមបើកការអនុញ្ញាត Location (GPS) ក្នុងកម្មវិធីរុករករបស់អ្នក។'
          : 'Unable to retrieve GPS. Please allow Location permission in your browser.'
      }
    },
    { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
  )
}

onMounted(() => {
  if (selectedProvince.value?.id) {
    originProvinceId.value = selectedProvince.value.id
  }
  // Gentle background auto-detection if browser allows
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    detectUserLocation(false)
  }
})

// Strictly follow selectedProvince from the Navbar
watch(() => selectedProvince.value?.id, (newId) => {
  if (newId) {
    originProvinceId.value = newId
    if (destinationProvinceId.value === newId) {
      destinationProvinceId.value = newId === 'phnom-penh' ? 'siem-reap' : 'phnom-penh'
    }
  }
}, { immediate: true })

// Sync origin selection in TransportPage back to the Navbar globally
watch(originProvinceId, (newId) => {
  if (newId && selectedProvince.value?.id !== newId) {
    setProvince(newId)
  }
})

const originTerminal = computed(() => {
  return PROVINCIAL_TERMINALS.find(t => t.provinceId === originProvinceId.value) || PROVINCIAL_TERMINALS[0]
})

const destinationTerminal = computed(() => {
  return PROVINCIAL_TERMINALS.find(t => t.provinceId === destinationProvinceId.value) || PROVINCIAL_TERMINALS[2]
})

// Sorted list of all 25 provinces by proximity to user's GPS (or origin)
const proximitySortedProvinces = computed(() => {
  const refLat = userGpsCoords.value?.lat ?? originTerminal.value.lat
  const refLng = userGpsCoords.value?.lng ?? originTerminal.value.lng

  return PROVINCIAL_TERMINALS.map(term => {
    const dist = getHaversineDistanceKm(refLat, refLng, term.lat, term.lng)
    return {
      ...term,
      distanceKm: dist
    }
  }).sort((a, b) => a.distanceKm - b.distanceKm)
})

// Resolves exact Cambodian National Road or Expressway corridor for any province pair
function resolveRouteHighway(orig: ProvincialTerminal, dest: ProvincialTerminal): { kh: string; en: string } {
  if (orig.provinceId === dest.provinceId) {
    if (orig.provinceId === 'phnom-penh') {
      return {
        kh: 'មហាវិថីព្រះមុនីវង្ស, សហព័ន្ធរុស្ស៊ី និងផ្លូវក្រវាត់ក្រុងទី៣',
        en: 'Monivong Blvd, Russian Blvd & Ring Road 3'
      }
    }
    return {
      kh: `បណ្តាញផ្លូវក្រុង${orig.nameKh} និងផ្លូវខេត្ត`,
      en: `${orig.name} Urban & Provincial Network`
    }
  }

  const pairKey = [orig.provinceId, dest.provinceId].sort().join('<->')

  const CORRIDORS: Record<string, { kh: string; en: string }> = {
    // Coast & South Corridor
    'phnom-penh<->preah-sihanouk': {
      kh: 'ផ្លូវល្បឿនលឿន E1 (ភ្នំពេញ-ព្រះសីហនុ) / ផ្លូវជាតិលេខ ៤',
      en: 'Phnom Penh-Sihanoukville Expressway (E1) / NR4'
    },
    'kampong-speu<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៤ (NR4) ឬ ផ្លូវល្បឿនលឿន E1',
      en: 'National Road 4 (NR4) / Expressway E1'
    },
    'kampot<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៣ (NR3)',
      en: 'National Road 3 (NR3)'
    },
    'kep<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៣ ភ្ជាប់ផ្លូវជាតិលេខ ៣៣A (NR33A)',
      en: 'National Road 3 to NR33A'
    },
    'koh-kong<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៤ ភ្ជាប់ផ្លូវជាតិលេខ ៤៨ (NR48)',
      en: 'National Road 4 to NR48'
    },
    'phnom-penh<->takeo': {
      kh: 'ផ្លូវជាតិលេខ ២ (NR2)',
      en: 'National Road 2 (NR2)'
    },
    'kandal<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ២ / ផ្លូវក្រវាត់ក្រុងទី៣',
      en: 'National Road 2 / Ring Road 3'
    },

    // North-West Corridor (Tonle Sap West)
    'kampong-chhnang<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
      en: 'National Road 5 (NR5)'
    },
    'phnom-penh<->pursat': {
      kh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
      en: 'National Road 5 (NR5)'
    },
    'battambang<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៥ (NR5 - អាស៊ាន AH1)',
      en: 'National Road 5 (NR5 - ASEAN AH1)'
    },
    'banteay-meanchey<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៥ (NR5)',
      en: 'National Road 5 (NR5)'
    },
    'pailin<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៥ ភ្ជាប់ផ្លូវជាតិលេខ ៥៧ (NR57)',
      en: 'National Road 5 to NR57'
    },

    // North & North-Central Corridor (Tonle Sap East)
    'kampong-thom<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៦ (NR6)',
      en: 'National Road 6 (NR6)'
    },
    'phnom-penh<->siem-reap': {
      kh: 'ផ្លូវជាតិលេខ ៦ (NR6)',
      en: 'National Road 6 (NR6)'
    },
    'oddar-meanchey<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៦ ភ្ជាប់ផ្លូវជាតិលេខ ៦៨ (NR68)',
      en: 'National Road 6 to NR68'
    },
    'phnom-penh<->preah-vihear': {
      kh: 'ផ្លូវជាតិលេខ ៦ ភ្ជាប់ផ្លូវជាតិលេខ ៦២ (NR62)',
      en: 'National Road 6 to NR62'
    },

    // East & North-East Corridor (Mekong & Plateau)
    'kampong-cham<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៦A ភ្ជាប់ផ្លូវជាតិលេខ ៧ (NR7)',
      en: 'National Road 6A to NR7'
    },
    'phnom-penh<->tboung-khmum': {
      kh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
      en: 'National Road 7 (NR7)'
    },
    'kratie<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
      en: 'National Road 7 (NR7)'
    },
    'phnom-penh<->stung-treng': {
      kh: 'ផ្លូវជាតិលេខ ៧ (NR7 - អាស៊ាន AH11)',
      en: 'National Road 7 (NR7 - ASEAN AH11)'
    },
    'phnom-penh<->ratanakiri': {
      kh: 'ផ្លូវជាតិលេខ ៧ ភ្ជាប់ផ្លូវជាតិលេខ ៧៨ (NR78)',
      en: 'National Road 7 to NR78'
    },
    'mondulkiri<->phnom-penh': {
      kh: 'ផ្លូវជាតិលេខ ៧ ភ្ជាប់ផ្លូវជាតិលេខ ៧៦ (NR76)',
      en: 'National Road 7 to NR76'
    },
    'phnom-penh<->prey-veng': {
      kh: 'ផ្លូវជាតិលេខ ៨ (NR8) ឬ ផ្លូវជាតិលេខ ១១',
      en: 'National Road 8 / NR11'
    },
    'phnom-penh<->svay-rieng': {
      kh: 'ផ្លូវជាតិលេខ ១ (NR1 - អាស៊ាន AH1)',
      en: 'National Road 1 (NR1 - ASEAN AH1)'
    },

    // Regional Inter-Provincial Corridors
    'battambang<->siem-reap': {
      kh: 'ផ្លូវជាតិលេខ ៥ ភ្ជាប់ផ្លូវជាតិលេខ ៦ (NR5 & NR6)',
      en: 'National Road 5 to NR6'
    },
    'banteay-meanchey<->siem-reap': {
      kh: 'ផ្លូវជាតិលេខ ៦ (NR6)',
      en: 'National Road 6 (NR6)'
    },
    'kampot<->kep': {
      kh: 'ផ្លូវជាតិលេខ ៣៣ (NR33 / NR33A)',
      en: 'National Road 33 / NR33A'
    },
    'kampot<->preah-sihanouk': {
      kh: 'ផ្លូវជាតិលេខ ៣ ភ្ជាប់ផ្លូវជាតិលេខ ៤ (NR3 & NR4)',
      en: 'National Road 3 to NR4'
    },
    'battambang<->pailin': {
      kh: 'ផ្លូវជាតិលេខ ៥៧ (NR57)',
      en: 'National Road 57 (NR57)'
    },
    'prey-veng<->svay-rieng': {
      kh: 'ផ្លូវជាតិលេខ ១១ ភ្ជាប់ផ្លូវជាតិលេខ ១ (NR11 & NR1)',
      en: 'National Road 11 to NR1'
    },
    'kampong-cham<->kratie': {
      kh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
      en: 'National Road 7 (NR7)'
    },
    'kratie<->stung-treng': {
      kh: 'ផ្លូវជាតិលេខ ៧ (NR7)',
      en: 'National Road 7 (NR7)'
    },
    'ratanakiri<->stung-treng': {
      kh: 'ផ្លូវជាតិលេខ ៧៨ (NR78)',
      en: 'National Road 78 (NR78)'
    },
    'mondulkiri<->ratanakiri': {
      kh: 'ផ្លូវជាតិលេខ ៧៦ ភ្ជាប់ផ្លូវជាតិលេខ ៧៨ (NR76 & NR78)',
      en: 'National Road 76 to NR78'
    },
    'kampong-thom<->siem-reap': {
      kh: 'ផ្លូវជាតិលេខ ៦ (NR6)',
      en: 'National Road 6 (NR6)'
    },
    'preah-vihear<->siem-reap': {
      kh: 'ផ្លូវជាតិលេខ ៦៤ / ផ្លូវជាតិលេខ ៦',
      en: 'National Road 64 / NR6'
    },
    'oddar-meanchey<->siem-reap': {
      kh: 'ផ្លូវជាតិលេខ ៦៨ ភ្ជាប់ផ្លូវជាតិលេខ ៦ (NR68 & NR6)',
      en: 'National Road 68 to NR6'
    }
  }

  if (CORRIDORS[pairKey]) {
    return CORRIDORS[pairKey]
  }

  // Smart fallback when one end has a recognized national road
  if (orig.provinceId === 'phnom-penh') {
    return {
      kh: dest.highwayKh,
      en: dest.highway
    }
  }
  if (dest.provinceId === 'phnom-penh') {
    return {
      kh: orig.highwayKh,
      en: orig.highway
    }
  }

  return {
    kh: `${orig.highwayKh} ភ្ជាប់ទៅ ${dest.highwayKh}`,
    en: `${orig.highway} to ${dest.highway}`
  }
}

// Realistic Route Analysis Computation
const routeDetails = computed(() => {
  const orig = originTerminal.value
  const dest = destinationTerminal.value
  const resolvedHighway = resolveRouteHighway(orig, dest)

  if (orig.provinceId === dest.provinceId) {
    return {
      isSame: true,
      distanceKm: 0,
      durationTextKh: 'ចំណតក្នុងខេត្ត-ក្រុងតែមួយ (ក្នុងតំបន់)',
      durationTextEn: 'Same Province / Intra-city',
      highwayKh: resolvedHighway.kh,
      highwayEn: resolvedHighway.en,
      estimatedFareBus: '1,500 - 3,000 KHR',
      estimatedFareTaxi: '$2 - $5 (កង់បី / ម៉ូតូឌុប)',
      googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=${orig.lat},${orig.lng}`
    }
  }

  const directKm = getHaversineDistanceKm(orig.lat, orig.lng, dest.lat, dest.lng)
  let roadKm = Math.round(directKm * 1.24)

  // Expressway Corridor check
  const isExpresswayRoute =
    (orig.provinceId === 'phnom-penh' && dest.provinceId === 'preah-sihanouk') ||
    (orig.provinceId === 'preah-sihanouk' && dest.provinceId === 'phnom-penh')

  if (isExpresswayRoute) {
    roadKm = 187
  }

  const avgSpeed = isExpresswayRoute ? 95 : Math.min(orig.speedKmh, dest.speedKmh)
  const totalHours = roadKm / avgSpeed
  const hours = Math.floor(totalHours)
  const mins = Math.round((totalHours - hours) * 60)

  const durationKh = hours > 0
    ? `${hours} ម៉ោង ${mins > 0 ? mins + ' នាទី' : ''}`
    : `${mins} នាទី`
  const durationEn = hours > 0
    ? `${hours} hr ${mins > 0 ? mins + ' mins' : ''}`
    : `${mins} mins`

  const busPriceMin = Math.max(4, Math.round(roadKm * 0.035))
  const busPriceMax = Math.max(6, Math.round(roadKm * 0.055))
  const taxiPriceMin = Math.max(16, Math.round(roadKm * 0.18))
  const taxiPriceMax = Math.max(26, Math.round(roadKm * 0.28))

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${orig.lat},${orig.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`

  return {
    isSame: false,
    distanceKm: roadKm,
    durationTextKh: durationKh,
    durationTextEn: durationEn,
    highwayKh: resolvedHighway.kh,
    highwayEn: resolvedHighway.en,
    estimatedFareBus: `$${busPriceMin} - $${busPriceMax} (${(busPriceMin * 4100).toLocaleString()} ៛)`,
    estimatedFareTaxi: `$${taxiPriceMin} - $${taxiPriceMax}`,
    googleMapsUrl
  }
})

// Multi-Leg Navigation Map Logic (User to Terminal, Terminal to Destination, Full Journey)
type MapRouteMode = 'terminal-to-dest' | 'user-to-terminal' | 'full-journey'
const activeMapMode = ref<MapRouteMode>('terminal-to-dest')

// Leg 1: From user's current location (or local area) to origin terminal
const userToTerminalInfo = computed(() => {
  const orig = originTerminal.value
  const hasGps = Boolean(userGpsCoords.value)
  const userLat = userGpsCoords.value?.lat ?? (orig.lat - 0.025)
  const userLng = userGpsCoords.value?.lng ?? (orig.lng - 0.018)

  const distKm = Math.max(1, getHaversineDistanceKm(userLat, userLng, orig.lat, orig.lng))
  const mins = Math.max(5, Math.round((distKm / 28) * 60))

  const embedUrl = `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${orig.lat},${orig.lng}&hl=km&output=embed`
  const externalUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${orig.lat},${orig.lng}&travelmode=driving`

  return {
    hasGps,
    userLat,
    userLng,
    distKm,
    durationTextKh: `${mins} នាទី (តាមកង់បី / ម៉ូតូឌុប)`,
    durationTextEn: `${mins} mins (TukTuk / Ride)`,
    embedUrl,
    externalUrl
  }
})

// Leg 2: From origin terminal to destination terminal
const terminalToDestInfo = computed(() => {
  const orig = originTerminal.value
  const dest = destinationTerminal.value

  const isSame = orig.provinceId === dest.provinceId
  const embedUrl = isSame
    ? `https://maps.google.com/maps?q=${orig.lat},${orig.lng}&hl=km&z=14&output=embed`
    : `https://maps.google.com/maps?saddr=${orig.lat},${orig.lng}&daddr=${dest.lat},${dest.lng}&hl=km&output=embed`

  const externalUrl = isSame
    ? `https://www.google.com/maps/search/?api=1&query=${orig.lat},${orig.lng}`
    : `https://www.google.com/maps/dir/?api=1&origin=${orig.lat},${orig.lng}&destination=${dest.lat},${dest.lng}&travelmode=driving`

  return {
    isSame,
    distKm: routeDetails.value.distanceKm,
    durationTextKh: routeDetails.value.durationTextKh,
    durationTextEn: routeDetails.value.durationTextEn,
    highwayKh: routeDetails.value.highwayKh,
    highwayEn: routeDetails.value.highwayEn,
    embedUrl,
    externalUrl
  }
})

// Leg 3: Full complete journey
const fullJourneyInfo = computed(() => {
  const orig = originTerminal.value
  const dest = destinationTerminal.value
  const userLat = userToTerminalInfo.value.userLat
  const userLng = userToTerminalInfo.value.userLng

  const isSame = orig.provinceId === dest.provinceId
  const totalKm = userToTerminalInfo.value.distKm + (isSame ? 0 : routeDetails.value.distanceKm)

  const embedUrl = isSame
    ? `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${orig.lat},${orig.lng}&hl=km&output=embed`
    : `https://maps.google.com/maps?saddr=${userLat},${userLng}&daddr=${dest.lat},${dest.lng}&hl=km&output=embed`

  const externalUrl = isSame
    ? `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${orig.lat},${orig.lng}&travelmode=driving`
    : `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${dest.lat},${dest.lng}&waypoints=${orig.lat},${orig.lng}&travelmode=driving`

  return {
    isSame,
    totalKm,
    embedUrl,
    externalUrl
  }
})

// Active Embed Map URL based on selected segment
const currentMapEmbedUrl = computed(() => {
  if (activeMapMode.value === 'user-to-terminal') {
    return userToTerminalInfo.value.embedUrl
  }
  if (activeMapMode.value === 'full-journey') {
    return fullJourneyInfo.value.embedUrl
  }
  return terminalToDestInfo.value.embedUrl
})

// Active External Link for Google Maps
const currentMapExternalUrl = computed(() => {
  if (activeMapMode.value === 'user-to-terminal') {
    return userToTerminalInfo.value.externalUrl
  }
  if (activeMapMode.value === 'full-journey') {
    return fullJourneyInfo.value.externalUrl
  }
  return terminalToDestInfo.value.externalUrl
})

function swapStations() {
  const temp = originProvinceId.value
  originProvinceId.value = destinationProvinceId.value
  destinationProvinceId.value = temp
}

function setDestination(provinceId: string) {
  if (provinceId === originProvinceId.value) {
    return
  }
  destinationProvinceId.value = provinceId
}

function resetPlanner() {
  originProvinceId.value = 'phnom-penh'
  destinationProvinceId.value = 'siem-reap'
  selectedType.value = 'All'
}

// Official Phnom Penh City Bus Lines data (All 13 Authentic Municipal Lines)
interface CityBusLine {
  id: string
  number: string
  color: string
  name: string
  nameKh: string
  startTerminal: string
  startTerminalKh: string
  endTerminal: string
  endTerminalKh: string
  keyCorridorKh: string
  stops: string[]
  stopsKh: string[]
  operatingHours: string
  firstBus: string
  lastBus: string
  frequency: string
  fare: string
  fareKh: string
  startLat: number
  startLng: number
  endLat: number
  endLng: number
}

const cityBusLines: CityBusLine[] = [
  {
    id: 'line-1a',
    number: 'Line 01A',
    color: 'bg-rose-600 text-white border-rose-700',
    name: 'Prek Pnov Bus Station ⇄ Chbar Ampov Terminal',
    nameKh: 'ចំណតព្រែកព្នៅ ⇄ ចំណតច្បារអំពៅ (តាមមហាវិថីព្រះមុនីវង្ស)',
    startTerminal: 'Prek Pnov Bus Station',
    startTerminalKh: 'ស្ថានីយចំណតរថយន្តក្រុងព្រែកព្នៅ',
    endTerminal: 'Chbar Ampov Terminal',
    endTerminalKh: 'ស្ថានីយចំណតរថយន្តក្រុងច្បារអំពៅ',
    keyCorridorKh: 'ផ្លូវជាតិលេខ ៥, មហាវិថីព្រះមុនីវង្ស, ស្ពានព្រះមុនីវង្ស',
    stops: ['Prek Pnov Terminal', 'Kilometer 9', 'Russey Keo Market', 'Kouch Kanong', 'Calmette Hospital', 'Wat Phnom', 'Central Market', 'Boeung Keng Kang', 'Monivong Bridge', 'Chbar Ampov Terminal'],
    stopsKh: ['ចំណតព្រែកព្នៅ (ដើមខ្សែ)', 'គីឡូម៉ែត្រលេខ ៩', 'ផ្សារតូចឬស្សីកែវ', 'រង្វង់មូលគួចកាណុង', 'មន្ទីរពេទ្យកាល់ម៉ែត', 'វត្តភ្នំ', 'ផ្សារធំថ្មី', 'ផ្សារបឹងកេងកង', 'ស្ពានព្រះមុនីវង្ស', 'ចំណតច្បារអំពៅ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM (រៀងរាល់ថ្ងៃ)',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '10 - 15 នាទី',
    fare: '1,500 KHR / trip (Free for Priority Citizens)',
    fareKh: '១,៥០០ រៀល / ជើង (ឥតគិតថ្លៃសម្រាប់សិស្ស, មនុស្សចាស់, ព្រះសង្ឃ, ជនពិការ)',
    startLat: 11.6545,
    startLng: 104.8562,
    endLat: 11.5305,
    endLng: 104.9458
  },
  {
    id: 'line-1b',
    number: 'Line 01B',
    color: 'bg-pink-600 text-white border-pink-700',
    name: 'Prek Pnov Station ⇄ Kouch Kanong Roundabout',
    nameKh: 'ចំណតព្រែកព្នៅ ⇄ រង្វង់មូលគួចកាណុង (តាមផ្លូវជាតិលេខ ៥)',
    startTerminal: 'Prek Pnov Station',
    startTerminalKh: 'ចំណតព្រែកព្នៅ',
    endTerminal: 'Kouch Kanong Roundabout',
    endTerminalKh: 'រង្វង់មូលគួចកាណុង',
    keyCorridorKh: 'ផ្លូវជាតិលេខ ៥ (NR5) និងសាលាស្រុកឬស្សីកែវ',
    stops: ['Prek Pnov', 'Prek Pnov Market', 'KM 9', 'KM 6', 'Russey Keo District Hall', 'Kouch Kanong'],
    stopsKh: ['ចំណតព្រែកព្នៅ (ដើមខ្សែ)', 'ផ្សារព្រែកព្នៅ', 'គីឡូម៉ែត្រលេខ ៩', 'គីឡូម៉ែត្រលេខ ៦', 'សាលាស្រុកឬស្សីកែវ', 'គួចកាណុង (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.6545,
    startLng: 104.8562,
    endLat: 11.5880,
    endLng: 104.9195
  },
  {
    id: 'line-02',
    number: 'Line 02',
    color: 'bg-emerald-600 text-white border-emerald-700',
    name: 'Kouch Kanong Roundabout ⇄ Ta Khmao City',
    nameKh: 'រង្វង់មូលគួចកាណុង ⇄ ក្រុងតាខ្មៅ (តាមផ្លូវជាតិលេខ ២)',
    startTerminal: 'Kouch Kanong Roundabout',
    startTerminalKh: 'រង្វង់មូលគួចកាណុង',
    endTerminal: 'Ta Khmao Bus Terminal',
    endTerminalKh: 'ស្ថានីយរថយន្តក្រុងក្រុងតាខ្មៅ',
    keyCorridorKh: 'មហាវិថីព្រះនរោត្តម, ស្ពានអាកាសក្បាលថ្នល់, ផ្លូវជាតិលេខ ២',
    stops: ['Kouch Kanong', 'Wat Phnom', 'Independence Monument', 'Kbal Thnal Flyover', 'Chak Angre Leu', 'Chak Angre Krom', 'Ta Khmao Border', 'Ta Khmao City Terminal'],
    stopsKh: ['គួចកាណុង (ដើមខ្សែ)', 'វត្តភ្នំ', 'វិមានឯករាជ្យ', 'ស្ពានអាកាសក្បាលថ្នល់', 'ចាក់អង្រែលើ', 'ចាក់អង្រែក្រោម', 'ព្រំប្រទល់តាខ្មៅ', 'ក្រុងតាខ្មៅ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '10 - 15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5880,
    startLng: 104.9195,
    endLat: 11.4554,
    endLng: 104.9454
  },
  {
    id: 'line-03',
    number: 'Line 03',
    color: 'bg-blue-600 text-white border-blue-700',
    name: 'Russey Keo Park ⇄ Borey Santepheap 2 (Russian Blvd)',
    nameKh: 'សួនឬស្សីកែវ ⇄ បុរីសន្តិភាព ២ (តាមមហាវិថីសហព័ន្ធរុស្ស៊ី)',
    startTerminal: 'Russey Keo Park',
    startTerminalKh: 'សួនឬស្សីកែវ (ផ្លូវជាតិលេខ ៥)',
    endTerminal: 'Borey Santepheap 2 (Chom Chao)',
    endTerminalKh: 'បុរីសន្តិភាព ២ (ចោមចៅ)',
    keyCorridorKh: 'មហាវិថីសហព័ន្ធរុស្ស៊ី, ព្រលានយន្តហោះពោធិ៍ចិនតុង, រង្វង់មូលចោមចៅ',
    stops: ['Russey Keo Park', 'Toul Kork Antenna', 'ITC Institute (Techno)', '7 Makara Flyover', 'Phnom Penh Airport (PNH)', 'Chom Chao', 'Borey Santepheap 2'],
    stopsKh: ['សួនឬស្សីកែវ (ដើមខ្សែ)', 'អង់តែនទួលគោក', 'វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា (តិចណូ)', 'ស្ពានអាកាស ៧មករា', 'ព្រលានយន្តហោះភ្នំពេញ (PNH)', 'រង្វង់មូលចោមចៅ', 'បុរីសន្តិភាព ២ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '12 - 15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5950,
    startLng: 104.9080,
    endLat: 11.5020,
    endLng: 104.8100
  },
  {
    id: 'line-04a',
    number: 'Line 04A',
    color: 'bg-purple-600 text-white border-purple-700',
    name: 'Russey Keo Park ⇄ Borey Santepheap 2 (via Veng Sreng)',
    nameKh: 'សួនឬស្សីកែវ ⇄ បុរីសន្តិភាព ២ (តាមផ្លូវវេងស្រេង)',
    startTerminal: 'Russey Keo Park',
    startTerminalKh: 'សួនឬស្សីកែវ',
    endTerminal: 'Borey Santepheap 2',
    endTerminalKh: 'បុរីសន្តិភាព ២',
    keyCorridorKh: 'មហាវិថីកម្ពុជាក្រោម, ផ្សារដេប៉ូ, ស្ទឹងមានជ័យ, ផ្លូវវេងស្រេង',
    stops: ['Russey Keo', 'Depo Market', 'Stung Meanchey', 'Canadia Industrial Park', 'Veng Sreng St', 'Borey Santepheap 2'],
    stopsKh: ['សួនឬស្សីកែវ (ដើមខ្សែ)', 'ផ្សារដេប៉ូ', 'ស្ទឹងមានជ័យ', 'ផ្សារកាណាឌីយ៉ា', 'ផ្លូវវេងស្រេង', 'បុរីសន្តិភាព ២ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5950,
    startLng: 104.9080,
    endLat: 11.5020,
    endLng: 104.8100
  },
  {
    id: 'line-04b',
    number: 'Line 04B',
    color: 'bg-indigo-600 text-white border-indigo-700',
    name: 'Russey Keo Park ⇄ Chom Chao (via National Road 3)',
    nameKh: 'សួនឬស្សីកែវ ⇄ រង្វង់មូលចោមចៅ (តាមផ្លូវជាតិលេខ ៣)',
    startTerminal: 'Russey Keo Park',
    startTerminalKh: 'សួនឬស្សីកែវ',
    endTerminal: 'Chom Chao Terminal',
    endTerminalKh: 'រង្វង់មូលចោមចៅ / ផ្លូវជាតិលេខ ៣',
    keyCorridorKh: 'ផ្លូវ ២៧១, ស្ទឹងមានជ័យ, ផ្សារត្រពាំងថ្លឹង, ផ្លូវជាតិលេខ ៣',
    stops: ['Russey Keo', 'St 271', 'Stung Meanchey', 'Trapeang Thleung', 'Chom Chao Roundabout'],
    stopsKh: ['សួនឬស្សីកែវ (ដើមខ្សែ)', 'ផ្លូវ ២៧១', 'ស្ទឹងមានជ័យ', 'ផ្សារត្រពាំងថ្លឹង', 'ចោមចៅ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5950,
    startLng: 104.9080,
    endLat: 11.5240,
    endLng: 104.8390
  },
  {
    id: 'line-05',
    number: 'Line 05',
    color: 'bg-amber-600 text-white border-amber-700',
    name: 'Aeon Mall Sen Sok (Aeon 2) ⇄ Koh Pich / Aeon Mall 1',
    nameKh: 'ផ្សារទំនើបអ៊ីអន ២ សែនសុខ ⇄ កោះពេជ្រ / អ៊ីអន ១',
    startTerminal: 'Aeon Mall Sen Sok',
    startTerminalKh: 'ផ្សារទំនើបអ៊ីអន ២ សែនសុខ',
    endTerminal: 'Koh Pich / Aeon 1',
    endTerminalKh: 'កោះពេជ្រ / អ៊ីអន ១',
    keyCorridorKh: 'មហាវិថីម៉ុងឫទ្ធី, ភ្នំពេញថ្មី, ផ្សារធំថ្មី, វិមានឯករាជ្យ, អ៊ីអន ១, ណាហ្គាវើលដ៍',
    stops: ['Aeon 2 Sen Sok', 'Phnom Penh Thmey', 'Moan Ang Market', 'Central Market', 'Independence Monument', 'Aeon 1', 'Koh Pich'],
    stopsKh: ['អ៊ីអន ២ សែនសុខ (ដើមខ្សែ)', 'ភ្នំពេញថ្មី', 'ផ្សារមាន់អាំង', 'ផ្សារធំថ្មី', 'វិមានឯករាជ្យ', 'ផ្សារអ៊ីអន ១', 'កោះពេជ្រ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 - 20 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5910,
    startLng: 104.8780,
    endLat: 11.5510,
    endLng: 104.9390
  },
  {
    id: 'line-06',
    number: 'Line 06',
    color: 'bg-teal-600 text-white border-teal-700',
    name: 'Kouch Kanong Roundabout ⇄ Century Plaza Market (via St 271)',
    nameKh: 'រង្វង់មូលគួចកាណុង ⇄ ផ្សារស៊ិនជូរីផ្លាហ្សា (តាមផ្លូវលេខ ២៧១)',
    startTerminal: 'Kouch Kanong Roundabout',
    startTerminalKh: 'រង្វង់មូលគួចកាណុង',
    endTerminal: 'Century Plaza Market',
    endTerminalKh: 'ផ្សារស៊ិនជូរីផ្លាហ្សា (ពោធិ៍ចិនតុង)',
    keyCorridorKh: 'ផ្លូវលេខ ២៧១, ផ្សារដេប៉ូ, មន្ទីរពេទ្យខ្មែរ-សូវៀត, ផ្សារហេងលី',
    stops: ['Kouch Kanong', 'French Embassy', 'Depo Market', 'Soviet Hospital', 'Heng Ly Market', 'St 271', 'Century Plaza'],
    stopsKh: ['គួចកាណុង (ដើមខ្សែ)', 'ស្ថានទូតបារាំង', 'ផ្សារដេប៉ូ', 'មន្ទីរពេទ្យខ្មែរ-សូវៀត', 'ផ្សារហេងលី', 'ផ្លូវ ២៧១', 'ស៊ិនជូរីផ្លាហ្សា (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5880,
    startLng: 104.9195,
    endLat: 11.5450,
    endLng: 104.8620
  },
  {
    id: 'line-07',
    number: 'Line 07',
    color: 'bg-cyan-600 text-white border-cyan-700',
    name: 'Kilometer 9 (Russey Keo) ⇄ Win-Win Blvd ⇄ Prek Pnov',
    nameKh: 'គីឡូម៉ែត្រលេខ ៩ (ឬស្សីកែវ) ⇄ វិថីឈ្នះ-ឈ្នះ ⇄ ព្រែកព្នៅ',
    startTerminal: 'Kilometer 9 Station',
    startTerminalKh: 'ចំណតគីឡូម៉ែត្រលេខ ៩ (ឬស្សីកែវ)',
    endTerminal: 'Prek Pnov Bridge',
    endTerminalKh: 'ស្ពានព្រែកព្នៅ',
    keyCorridorKh: 'វិថីឈ្នះ-ឈ្នះ, ពហុកីឡដ្ឋានជាតិមរតកតេជោ, ស្ពានព្រែកព្នៅ',
    stops: ['Kilometer 9', 'Win-Win Blvd', 'Win-Win Memorial', 'Morodok Techo Stadium', 'Prek Pnov Bridge'],
    stopsKh: ['គីឡូម៉ែត្រលេខ ៩ (ដើមខ្សែ)', 'វិថីឈ្នះ-ឈ្នះ', 'វិមានឈ្នះ-ឈ្នះ', 'ពហុកីឡដ្ឋានមរតកតេជោ', 'ស្ពានព្រែកព្នៅ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '20 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.6240,
    startLng: 104.8870,
    endLat: 11.6545,
    endLng: 104.8562
  },
  {
    id: 'line-08',
    number: 'Line 08',
    color: 'bg-orange-600 text-white border-orange-700',
    name: 'Kilometer 9 ⇄ Royal Railway Station ⇄ Central Market',
    nameKh: 'គីឡូម៉ែត្រលេខ ៩ ⇄ ស្ថានីយរថភ្លើង ⇄ ផ្សារធំថ្មី',
    startTerminal: 'Kilometer 9',
    startTerminalKh: 'ចំណតគីឡូម៉ែត្រលេខ ៩',
    endTerminal: 'Central Market',
    endTerminalKh: 'ផ្សារធំថ្មី',
    keyCorridorKh: 'មហាវិថីគីមអុីលស៊ុង, អង់តែនទួលគោក, ស្ថានីយរថភ្លើងភ្នំពេញ',
    stops: ['Kilometer 9', 'Toul Kork Antenna', 'Moan Ang Market', 'Railway Station', 'Central Market'],
    stopsKh: ['គីឡូម៉ែត្រលេខ ៩ (ដើមខ្សែ)', 'អង់តែនទួលគោក', 'ផ្សារមាន់អាំង', 'ស្ថានីយរថភ្លើងភ្នំពេញ', 'ផ្សារធំថ្មី (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.6240,
    startLng: 104.8870,
    endLat: 11.5695,
    endLng: 104.9228
  },
  {
    id: 'line-09',
    number: 'Line 09',
    color: 'bg-lime-600 text-white border-lime-700',
    name: 'Borey Santepheap 2 ⇄ PPSEZ Special Economic Zone',
    nameKh: 'បុរីសន្តិភាព ២ ⇄ តំបន់សេដ្ឋកិច្ចពិសេសភ្នំពេញ (PPSEZ)',
    startTerminal: 'Borey Santepheap 2',
    startTerminalKh: 'បុរីសន្តិភាព ២',
    endTerminal: 'PPSEZ Terminal',
    endTerminalKh: 'តំបន់សេដ្ឋកិច្ចពិសេសភ្នំពេញ (កំបូល)',
    keyCorridorKh: 'ផ្លូវជាតិលេខ ៤, តំបន់សេដ្ឋកិច្ចពិសេស, ស្រុកកំបូល',
    stops: ['Borey Santepheap 2', 'Prey Tea Market', 'Chom Chao', 'National Road 4', 'PPSEZ Zone'],
    stopsKh: ['បុរីសន្តិភាព ២ (ដើមខ្សែ)', 'ផ្សារព្រៃទា', 'រង្វង់មូលចោមចៅ', 'ផ្លូវជាតិលេខ ៤', 'តំបន់សេដ្ឋកិច្ចពិសេស PPSEZ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 - 20 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5020,
    startLng: 104.8100,
    endLat: 11.5160,
    endLng: 104.7550
  },
  {
    id: 'line-10',
    number: 'Line 10',
    color: 'bg-violet-600 text-white border-violet-700',
    name: 'Century Plaza Market ⇄ Prek Pnov Bridge (via Kop Srov)',
    nameKh: 'ផ្សារស៊ិនជូរីផ្លាហ្សា ⇄ ស្ពានព្រែកព្នៅ (តាមទំនប់កប់ស្រូវ)',
    startTerminal: 'Century Plaza Market',
    startTerminalKh: 'ផ្សារស៊ិនជូរីផ្លាហ្សា',
    endTerminal: 'Prek Pnov Bridge',
    endTerminalKh: 'ស្ពានព្រែកព្នៅ',
    keyCorridorKh: 'ទំនប់កប់ស្រូវ, ផ្លូវក្រវាត់ក្រុង, ស្ពានព្រែកព្នៅ',
    stops: ['Century Plaza', 'Russian Blvd', 'Kop Srov Dyke', 'Chhouk Meas Market', 'Prek Pnov Bridge'],
    stopsKh: ['ផ្សារស៊ិនជូរីផ្លាហ្សា (ដើមខ្សែ)', 'មហាវិថីសហព័ន្ធរុស្ស៊ី', 'ទំនប់កប់ស្រូវ', 'ផ្សារឈូកមាស', 'ស្ពានព្រែកព្នៅ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '20 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5450,
    startLng: 104.8620,
    endLat: 11.6545,
    endLng: 104.8562
  },
  {
    id: 'line-11',
    number: 'Line 11',
    color: 'bg-yellow-600 text-white border-yellow-700',
    name: 'Chbar Ampov Terminal ⇄ Prek Eng ⇄ Kien Svay',
    nameKh: 'ចំណតច្បារអំពៅ ⇄ ផ្សារព្រែកឯង ⇄ ស្រុកកៀនស្វាយ (ផ្លូវជាតិលេខ ១)',
    startTerminal: 'Chbar Ampov Terminal',
    startTerminalKh: 'ចំណតច្បារអំពៅ',
    endTerminal: 'Kien Svay Resort / Terminal',
    endTerminalKh: 'ស្រុកកៀនស្វាយ (ផ្លូវជាតិលេខ ១)',
    keyCorridorKh: 'ផ្លូវជាតិលេខ ១, ផ្សារព្រែកឯង, គគីរ, ស្រុកកៀនស្វាយ',
    stops: ['Chbar Ampov Terminal', 'Wat Kbal Koh', 'Prek Eng Market', 'Kokir Market', 'Kien Svay Terminal'],
    stopsKh: ['ចំណតច្បារអំពៅ (ដើមខ្សែ)', 'វត្តក្បាលកោះ', 'ផ្សារព្រែកឯង', 'ផ្សារគគីរ', 'ស្រុកកៀនស្វាយ (ចុងខ្សែ)'],
    operatingHours: '5:30 AM - 8:30 PM',
    firstBus: '5:30 AM',
    lastBus: '8:30 PM',
    frequency: '15 - 20 នាទី',
    fare: '1,500 KHR',
    fareKh: '១,៥០០ រៀល / ជើង',
    startLat: 11.5305,
    startLng: 104.9458,
    endLat: 11.4980,
    endLng: 105.0450
  }
]

const selectedBusLine = ref<CityBusLine>(cityBusLines[0])
const showCityBusModal = ref(false)

function openCityBusModal(lineId?: string) {
  if (lineId) {
    const found = cityBusLines.find(l => l.id === lineId)
    if (found) selectedBusLine.value = found
  }
  showCityBusModal.value = true
}

const currentBusLineMapEmbed = computed(() => {
  if (!selectedBusLine.value) return ''
  const l = selectedBusLine.value
  return `https://maps.google.com/maps?saddr=${l.startLat},${l.startLng}&daddr=${l.endLat},${l.endLng}&hl=km&output=embed`
})

const currentBusLineMapExternal = computed(() => {
  if (!selectedBusLine.value) return ''
  const l = selectedBusLine.value
  return `https://www.google.com/maps/dir/?api=1&origin=${l.startLat},${l.startLng}&destination=${l.endLat},${l.endLng}&travelmode=driving`
})

// Transit types for filter
const transitTypes = computed(() => [
  { value: 'All', label: currentLanguage.value === 'kh' ? 'គ្រប់ប្រភេទ' : 'All Modes', icon: Compass },
  { value: 'bus', label: currentLanguage.value === 'kh' ? 'រថយន្តក្រុង (Bus)' : 'City & Intercity Bus', icon: Bus },
  { value: 'taxi', label: currentLanguage.value === 'kh' ? 'កង់បី/តាក់ស៊ី (Ride-Hail)' : 'Tuk-Tuk & Taxis', icon: Car },
  { value: 'train', label: currentLanguage.value === 'kh' ? 'រថភ្លើង (Train)' : 'Royal Railway', icon: Train },
  { value: 'plane', label: currentLanguage.value === 'kh' ? 'យន្តហោះ (Air)' : 'Domestic Flights', icon: Plane },
  { value: 'ferry', label: currentLanguage.value === 'kh' ? 'ទូកល្បឿនលឿន (Ferry)' : 'Speed Ferry', icon: Ship },
])

const filteredTransport = computed(() => {
  let result = allTransport

  if (selectedType.value !== 'All') {
    result = result.filter(tItem => tItem.type === selectedType.value)
  }

  const origTerm = originTerminal.value
  const destTerm = destinationTerminal.value

  const origNames = [origTerm.name.toLowerCase(), origTerm.nameKh.toLowerCase()]
  const destNames = [destTerm.name.toLowerCase(), destTerm.nameKh.toLowerCase()]

  const provinceFiltered = result.filter(tItem => {
    const text = (tItem.route + ' ' + tItem.location + ' ' + tItem.name + ' ' + (tItem.nameKh || '')).toLowerCase()
    return origNames.some(n => text.includes(n)) || destNames.some(n => text.includes(n))
  })

  return provinceFiltered.length > 0 ? provinceFiltered : result
})

const {
  currentPage,
  totalPages,
  paginatedItems: paginatedTransport,
  showingFrom,
  showingTo,
  totalItems,
  goToPage,
  nextPage,
  prevPage
} = usePagination(filteredTransport, 6)

const typeStyles: Record<string, { icon: any; badge: string; color: string }> = {
  bus: { icon: Bus, badge: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200', color: 'text-emerald-600' },
  taxi: { icon: Car, badge: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200', color: 'text-amber-600' },
  train: { icon: Train, badge: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200', color: 'text-blue-600' },
  plane: { icon: Plane, badge: 'bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200', color: 'text-purple-600' },
  ferry: { icon: Ship, badge: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/40 dark:text-cyan-300 border-cyan-200', color: 'text-cyan-600' }
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Service Hero Banner with 25 Provinces Selector -->
    <ServiceHeroBanner
      :title="t('transport.title')"
      :subtitle="t('transport.subtitle')"
      badge="Public Transit & Route Network"
      badge-kh="បណ្តាញដឹកជញ្ជូន & រថយន្តក្រុងសាធារណៈ"
      banner-image="/images/pillars/transport.jpg"
      banner-image-class="object-right sm:object-[78%_center]"
      image-opacity="opacity-70 sm:opacity-90"
      :breadcrumb-current="t('nav.transport')"
    />

    <!-- Free Public Bus Policy Callout Banner for Cambodian Citizens -->
    <div class="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white p-6 sm:p-7 shadow-lg relative overflow-hidden">
      <div class="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
        <Bus class="w-64 h-64 text-white" />
      </div>

      <div class="relative z-10 space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white ring-1 ring-white/30 shrink-0">
              <Bus class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="text-base sm:text-lg font-black tracking-tight">
                  {{ currentLanguage === 'kh' ? 'គោលការណ៍ជិះរថយន្តក្រុងសាធារណៈដោយឥតគិតថ្លៃ (Free Bus Policy)' : 'Phnom Penh Municipal Free Bus Policy' }}
                </h3>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/20 border border-white/30 uppercase">
                  100% Free / ឥតគិតថ្លៃ
                </span>
              </div>
              <p class="text-xs text-emerald-100 mt-1">
                {{ currentLanguage === 'kh' ? 'រដ្ឋបាលរាជធានីភ្នំពេញ ផ្តល់សេវាជិះរថយន្តក្រុងសាធារណៈដោយឥតគិតថ្លៃ ជូនចំពោះប្រជាពលរដ្ឋអាទិភាពដូចខាងក្រោម៖' : 'Phnom Penh Capital Administration grants free public transit passes to priority citizens:' }}
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2.5 pt-1 text-xs font-bold text-white">
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'សិស្ស-និស្សិត' : 'Students' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ព្រះសង្ឃ' : 'Monks' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'មនុស្សចាស់ (៧០+)' : 'Elderly (70+)' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'អ្នកកាន់ប័ណ្ណ ប.ស.ស' : 'NSSF Cardholders' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'កម្មកររោងចក្រ' : 'Factory Workers' }}</span>
          </div>
          <div class="flex items-center gap-2 p-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10">
            <CheckCircle2 class="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'ជនមានពិការភាព' : 'Persons with Disability' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Main View Switcher: Journey Route Planner vs Phnom Penh City Bus Lines -->
    <div class="flex items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-700 pb-4">
      <div class="flex items-center gap-2">
        <button
          @click="activeViewTab = 'all-routes'"
          class="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
          :class="activeViewTab === 'all-routes'
            ? 'bg-[#0D47A1] text-white shadow-md'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
        >
          <Compass class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ស្វែងរកជើងធ្វើដំណើរ & បណ្តាញផ្លូវរត់' : 'Journey Planner & All Transit' }}</span>
        </button>

        <button
          @click="activeViewTab = 'city-bus-lines'"
          class="px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all cursor-pointer flex items-center gap-2 shadow-2xs"
          :class="activeViewTab === 'city-bus-lines'
            ? 'bg-emerald-600 text-white shadow-md'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
        >
          <Bus class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ខ្សែរត់រថយន្តក្រុងភ្នំពេញ (City Bus Lines)' : 'Phnom Penh City Bus Lines (PPA)' }}</span>
        </button>
      </div>

      <div class="hidden md:block">
        <VerificationBadge compact />
      </div>
    </div>

    <!-- VIEW 1: JOURNEY PLANNER & ALL TRANSIT ROUTES -->
    <div v-if="activeViewTab === 'all-routes'" class="space-y-8">
      <!-- Realistic 25-Province Transit & Terminal Console with Live GPS -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-7 shadow-sm space-y-6">
        <!-- Console Header with Live Radar & GPS Trigger -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-700/60">
          <div class="flex items-center gap-2.5">
            <span class="relative flex h-3 w-3">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <div>
              <h3 class="text-xs sm:text-sm font-black uppercase tracking-wider text-[#0A2540] dark:text-white flex items-center gap-2">
                <span>{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធស្វែងរកផ្លូវ និងស្ថានីយដឹកជញ្ជូនជាតិ ២៥ ខេត្ត-ក្រុង' : 'Cambodia 25 Provinces Transit & Route Finder' }}</span>
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0D47A1] dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200/50">Live GPS</span>
              </h3>
              <p class="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? 'គណនាចម្ងាយ រយៈពេលផ្លូវជាតិ តម្លៃសំបុត្រ និងស្ថានីយដែលនៅជិតអ្នកបំផុត' : 'Calculates road distance, travel duration, highways, fares, and nearest stations' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- GPS Auto-Detect Button -->
            <button
              @click="detectUserLocation(true)"
              :disabled="isLocating"
              type="button"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs border"
              :class="userGpsCoords
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200 hover:bg-emerald-100'
                : 'bg-[#0D47A1] text-white hover:bg-blue-700 border-[#0D47A1]'"
              title="Detect my current GPS location"
            >
              <LocateFixed class="w-3.5 h-3.5" :class="{ 'animate-spin': isLocating }" />
              <span>
                {{ isLocating
                  ? (currentLanguage === 'kh' ? 'កំពុងចាប់ GPS...' : 'Locating...')
                  : (userGpsCoords
                      ? (currentLanguage === 'kh' ? 'GPS បានភ្ជាប់' : 'GPS Connected')
                      : (currentLanguage === 'kh' ? 'ចាប់ទីតាំង GPS ខ្ញុំ' : 'Auto-Detect GPS'))
                }}
              </span>
            </button>

            <!-- Reset Button -->
            <button
              @click="resetPlanner"
              class="text-xs font-bold text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
              type="button"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset' }}</span>
            </button>
          </div>
        </div>

        <!-- GPS Status Banner -->
        <div
          v-if="gpsStatusMessage"
          class="p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200/80 dark:border-blue-800/50 text-xs text-[#0D47A1] dark:text-blue-300 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-2.5">
            <MapPin class="w-4 h-4 text-emerald-600 shrink-0" />
            <span class="font-bold leading-relaxed">{{ gpsStatusMessage }}</span>
          </div>
          <button
            @click="gpsStatusMessage = null"
            class="text-[11px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <!-- Origin & Destination Selector Matrix -->
        <div class="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <!-- Origin Station Dropdown (All 25 Provinces) -->
          <div class="md:col-span-5 space-y-1.5">
            <StationPicker
              v-model="originProvinceId"
              :terminals="proximitySortedProvinces"
              type="origin"
              :label="currentLanguage === 'kh' ? 'ចេញដំណើរពី (Origin Station)' : 'Departing Origin'"
              :is-closest="Boolean(userGpsCoords && proximitySortedProvinces[0]?.provinceId === originProvinceId)"
            />

            <!-- Origin Terminal Address Details -->
            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pl-1">
              <span class="font-bold text-[#0D47A1] dark:text-blue-300">
                {{ currentLanguage === 'kh' ? originTerminal.terminalNameKh : originTerminal.terminalName }}
              </span>
              <span>•</span>
              <span class="truncate">{{ currentLanguage === 'kh' ? originTerminal.addressKh : originTerminal.address }}</span>
            </div>
          </div>

          <!-- Swap Button with 360-spin -->
          <div class="md:col-span-1 flex justify-center pt-2 md:pt-4">
            <button
              @click="swapStations"
              class="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-600 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-110 active:rotate-180"
              type="button"
              title="Swap Origin and Destination"
            >
              <ArrowRightLeft class="w-4 h-4" />
            </button>
          </div>

          <!-- Destination Station Dropdown (All 25 Provinces) -->
          <div class="md:col-span-5 space-y-1.5">
            <StationPicker
              v-model="destinationProvinceId"
              :terminals="PROVINCIAL_TERMINALS"
              type="destination"
              :label="currentLanguage === 'kh' ? 'ទៅកាន់ (Destination Station)' : 'Arrival Destination'"
            />

            <!-- Destination Terminal Address Details -->
            <div class="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pl-1">
              <span class="font-bold text-rose-600 dark:text-rose-400">
                {{ currentLanguage === 'kh' ? destinationTerminal.terminalNameKh : destinationTerminal.terminalName }}
              </span>
              <span>•</span>
              <span class="truncate">{{ currentLanguage === 'kh' ? destinationTerminal.addressKh : destinationTerminal.address }}</span>
            </div>
          </div>
        </div>

        <!-- Nearest Stations Quick-Picker Bar (Sorted by Distance from User GPS) -->
        <div class="space-y-2 pt-1">
          <div class="flex items-center justify-between text-xs">
            <span class="font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Sparkles class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ currentLanguage === 'kh' ? 'ស្ថានីយ និងខេត្ត-ក្រុងនៅជិតអ្នក (ចុចដើម្បីជ្រើសរើសគោលដៅ)៖' : 'Stations Nearest to You (Click to pick destination):' }}</span>
            </span>
          </div>

          <div class="flex flex-wrap items-center gap-1.5">
            <button
              v-for="hub in proximitySortedProvinces.slice(0, 8)"
              :key="'near-' + hub.provinceId"
              @click="setDestination(hub.provinceId)"
              type="button"
              class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5"
              :class="destinationProvinceId === hub.provinceId
                ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
                : 'bg-slate-100/90 dark:bg-slate-700/80 hover:bg-blue-50 dark:hover:bg-blue-900/40 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:border-blue-300'"
            >
              <span>{{ currentLanguage === 'kh' ? hub.nameKh : hub.name }}</span>
              <span class="text-[10px] px-1.5 py-0.2 rounded-md" :class="destinationProvinceId === hub.provinceId ? 'bg-white/20 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300'">
                {{ hub.distanceKm === 0 ? 'ទីតាំងអ្នក' : `~${hub.distanceKm} km` }}
              </span>
            </button>
          </div>
        </div>

        <!-- Realistic Route Analysis & Highway Console -->
        <div class="p-5 rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 dark:from-slate-900 dark:via-blue-950/20 dark:to-slate-900 border border-blue-100 dark:border-blue-900/50 space-y-4">
          <!-- Route Header Line -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-blue-200/60 dark:border-blue-800/40">
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-1 rounded-xl bg-[#0D47A1] text-white font-black text-xs flex items-center gap-1.5">
                <Navigation class="w-3 h-3 text-emerald-300" />
                <span>{{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវដំណើរ' : 'Transit Route' }}</span>
              </span>
              <span class="text-sm font-black text-[#0A2540] dark:text-white">
                {{ currentLanguage === 'kh' ? originTerminal.nameKh : originTerminal.name }}
                <span class="text-slate-400 font-normal">➔</span>
                {{ currentLanguage === 'kh' ? destinationTerminal.nameKh : destinationTerminal.name }}
              </span>
            </div>

            <div class="flex items-center gap-2">
              <!-- Toggle Navigation Map Preview -->
              <button
                @click="showTerminalMap = !showTerminalMap"
                type="button"
                class="px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5"
                :class="showTerminalMap
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'"
              >
                <MapPin class="w-3.5 h-3.5" />
                <span>{{ showTerminalMap ? (currentLanguage === 'kh' ? 'បិទផែនទី' : 'Hide Map') : (currentLanguage === 'kh' ? 'មើលផែនទីនាំផ្លូវ' : 'View Route Map') }}</span>
              </button>

              <!-- Real Google Maps Navigation Button -->
              <a
                :href="currentMapExternalUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-colors shadow-2xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>{{ currentLanguage === 'kh' ? 'បើក Google Maps ពិតៗ' : 'Real Google Maps Navigation' }}</span>
                <ExternalLink class="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <!-- 4 Route Characteristic Metrics -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
            <!-- Metric 1: Distance -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Navigation class="w-3 h-3 text-[#0D47A1] dark:text-blue-400" />
                <span>{{ currentLanguage === 'kh' ? 'ចម្ងាយផ្លូវជាតិ' : 'Road Distance' }}</span>
              </div>
              <div class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white mt-1">
                {{ routeDetails.distanceKm === 0 ? '0 km' : `~ ${routeDetails.distanceKm} គ.ម` }}
              </div>
              <p class="text-[10px] text-slate-400 mt-0.5">
                {{ routeDetails.isSame ? (currentLanguage === 'kh' ? 'ក្នុងរាជធានី-ខេត្ត' : 'Intra-province') : (currentLanguage === 'kh' ? 'ផ្លូវជាតិ និងល្បឿនលឿន' : 'National road network') }}
              </p>
            </div>

            <!-- Metric 2: Duration -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Clock class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span>{{ currentLanguage === 'kh' ? 'រយៈពេលធ្វើដំណើរ' : 'Travel Time' }}</span>
              </div>
              <div class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white mt-1">
                {{ currentLanguage === 'kh' ? routeDetails.durationTextKh : routeDetails.durationTextEn }}
              </div>
              <p class="text-[10px] text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? 'ល្បឿនមធ្យម ៦៥-៩៥ គ.ម/ម៉' : 'Avg speed 65-95 km/h' }}
              </p>
            </div>

            <!-- Metric 3: Highways Corridors -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Compass class="w-3 h-3 text-amber-500" />
                <span>{{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវធំៗ' : 'Corridor Route' }}</span>
              </div>
              <div class="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white mt-1 line-clamp-2 leading-snug min-h-[2.25rem] flex items-center" :title="currentLanguage === 'kh' ? routeDetails.highwayKh : routeDetails.highwayEn">
                {{ currentLanguage === 'kh' ? routeDetails.highwayKh : routeDetails.highwayEn }}
              </div>
              <p class="text-[10px] text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? 'ច្រករបៀងដឹកជញ្ជូនផ្លូវការ' : 'Official highway corridor' }}
              </p>
            </div>

            <!-- Metric 4: Estimated Fare -->
            <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs">
              <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Ticket class="w-3 h-3 text-purple-600 dark:text-purple-400" />
                <span>{{ currentLanguage === 'kh' ? 'តម្លៃសំបុត្រប្រហាក់ប្រហែល' : 'Estimated Fares' }}</span>
              </div>
              <div class="text-xs sm:text-sm font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {{ routeDetails.estimatedFareBus }}
              </div>
              <p class="text-[10px] text-slate-400 mt-0.5">
                {{ currentLanguage === 'kh' ? 'តាក់ស៊ី/ឡានឈ្នួល៖ ' : 'Taxi/Private: ' }} {{ routeDetails.estimatedFareTaxi }}
              </p>
            </div>
          </div>

          <!-- Embedded Real Google Maps View for Multi-Leg Route Navigation -->
          <div v-if="showTerminalMap" class="mt-4 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md transition-all duration-300 bg-white dark:bg-slate-900">
            <!-- Map Control Header & Navigation Segments -->
            <div class="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/90 border-b border-slate-200 dark:border-slate-700 space-y-3">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div class="flex items-center gap-2">
                  <div class="w-8 h-8 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                    <Navigation class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white">
                      {{ currentLanguage === 'kh' ? 'ផែនទី Google Maps នាំផ្លូវតាមជើងដំណើរ (Live Route)' : 'Multi-Leg Interactive Route Map' }}
                    </h4>
                    <p class="text-[11px] text-slate-500 dark:text-slate-400">
                      {{ currentLanguage === 'kh' ? 'ចុចរើសជើងដំណើរដើម្បីបង្ហាញផ្លូវពីកន្លែងអ្នកទៅចំណត ឬពីចំណតទៅគោលដៅ' : 'Click a travel leg to view turn-by-turn directions' }}
                    </p>
                  </div>
                </div>

                <a
                  :href="currentMapExternalUrl"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs inline-flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
                >
                  <ExternalLink class="w-3.5 h-3.5" />
                  <span>{{ currentLanguage === 'kh' ? 'បើកនាំផ្លូវក្នុង Google Maps' : 'Open in Google Maps' }}</span>
                </a>
              </div>

              <!-- Interactive Leg Switcher Buttons -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
                <!-- Leg 1: User Location to Origin Terminal -->
                <button
                  type="button"
                  @click="activeMapMode = 'user-to-terminal'"
                  :class="[
                    'px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer text-left border flex items-center gap-2.5',
                    activeMapMode === 'user-to-terminal'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  ]"
                >
                  <div
                    :class="[
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0',
                      activeMapMode === 'user-to-terminal' ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60'
                    ]"
                  >
                    <MapPin class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[10px] uppercase tracking-wider opacity-80">
                      {{ currentLanguage === 'kh' ? 'ជើងទី១: កន្លែងយើង ➔ ចំណត' : 'Leg 1: Place ➔ Terminal' }}
                    </div>
                    <div class="text-xs truncate font-black">
                      {{ currentLanguage === 'kh' ? 'កន្លែងអ្នក ➔ ' + originTerminal.nameKh : 'Your Place ➔ ' + originTerminal.name }}
                    </div>
                  </div>
                </button>

                <!-- Leg 2: Origin Terminal to Destination Terminal -->
                <button
                  type="button"
                  @click="activeMapMode = 'terminal-to-dest'"
                  :class="[
                    'px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer text-left border flex items-center gap-2.5',
                    activeMapMode === 'terminal-to-dest'
                      ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-xs ring-2 ring-blue-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  ]"
                >
                  <div
                    :class="[
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0',
                      activeMapMode === 'terminal-to-dest' ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60'
                    ]"
                  >
                    <Bus class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[10px] uppercase tracking-wider opacity-80">
                      {{ currentLanguage === 'kh' ? 'ជើងទី២: ចំណត ➔ គោលដៅ' : 'Leg 2: Terminal ➔ Dest' }}
                    </div>
                    <div class="text-xs truncate font-black">
                      {{ currentLanguage === 'kh' ? originTerminal.nameKh + ' ➔ ' + destinationTerminal.nameKh : originTerminal.name + ' ➔ ' + destinationTerminal.name }}
                    </div>
                  </div>
                </button>

                <!-- Leg 3: Full Complete Journey -->
                <button
                  type="button"
                  @click="activeMapMode = 'full-journey'"
                  :class="[
                    'px-3 py-2.5 rounded-2xl text-xs font-black transition-all cursor-pointer text-left border flex items-center gap-2.5',
                    activeMapMode === 'full-journey'
                      ? 'bg-purple-600 text-white border-purple-600 shadow-xs ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                  ]"
                >
                  <div
                    :class="[
                      'w-7 h-7 rounded-xl flex items-center justify-center shrink-0',
                      activeMapMode === 'full-journey' ? 'bg-white/20 text-white' : 'bg-purple-50 text-purple-600 dark:bg-purple-950/60'
                    ]"
                  >
                    <Compass class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="text-[10px] uppercase tracking-wider opacity-80">
                      {{ currentLanguage === 'kh' ? 'ដំណើរទាំងមូល (Full Trip)' : 'Full Complete Trip' }}
                    </div>
                    <div class="text-xs truncate font-black">
                      {{ currentLanguage === 'kh' ? 'កន្លែងយើង ➔ ចំណត ➔ គោលដៅ' : 'Home ➔ Terminal ➔ Dest' }}
                    </div>
                  </div>
                </button>
              </div>

              <!-- Active Leg Summary Pill -->
              <div class="flex items-center justify-between text-xs px-3.5 py-2 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border border-blue-200/60 dark:border-blue-800/40">
                <div class="flex items-center gap-2 min-w-0 flex-1">
                  <span class="w-2 h-2 rounded-full shrink-0 bg-emerald-500" />
                  <span class="font-bold truncate">
                    {{
                      activeMapMode === 'user-to-terminal'
                        ? (currentLanguage === 'kh' ? 'ចេញពីកន្លែងអ្នក ➔ ស្ថានីយចេញដំណើរ (' + originTerminal.terminalNameKh + ')' : 'From your location ➔ Departure Terminal (' + originTerminal.terminalName + ')')
                        : activeMapMode === 'terminal-to-dest'
                          ? (currentLanguage === 'kh' ? 'ចេញពី ' + originTerminal.terminalNameKh + ' ➔ ' + destinationTerminal.terminalNameKh : 'From ' + originTerminal.terminalName + ' ➔ ' + destinationTerminal.terminalName)
                          : (currentLanguage === 'kh' ? 'ខ្សែផ្លូវសរុប (កន្លែងអ្នក ➔ ' + originTerminal.nameKh + ' ➔ ' + destinationTerminal.nameKh + ')' : 'Full Route (Your Place ➔ ' + originTerminal.name + ' ➔ ' + destinationTerminal.name + ')')
                    }}
                  </span>
                </div>
                <div class="shrink-0 pl-2 font-black text-emerald-600 dark:text-emerald-400">
                  {{
                    activeMapMode === 'user-to-terminal'
                      ? `~${userToTerminalInfo.distKm} km (${userToTerminalInfo.durationTextKh})`
                      : activeMapMode === 'terminal-to-dest'
                        ? `~${terminalToDestInfo.distKm} km (${terminalToDestInfo.durationTextKh})`
                        : `~${fullJourneyInfo.totalKm} km`
                  }}
                </div>
              </div>
            </div>

            <!-- Embedded Live Google Map -->
            <iframe
              :src="currentMapEmbedUrl"
              class="w-full h-80 sm:h-96 border-0"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <!-- Mode Pills Filter -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="mode in transitTypes"
              :key="mode.value"
              @click="selectedType = mode.value"
              type="button"
              class="px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border"
              :class="selectedType === mode.value
                ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-2xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'"
            >
              <component :is="mode.icon" class="w-3.5 h-3.5" />
              <span>{{ mode.label }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Result Count Banner -->
      <div class="flex items-center justify-between">
        <p class="text-xs font-bold text-slate-500 dark:text-slate-400">
          {{ currentLanguage === 'kh' ? 'រកឃើញជម្រើសធ្វើដំណើរចំនួន' : 'Found' }}
          <span class="text-[#0A2540] dark:text-white font-black">{{ filteredTransport.length }}</span>
          {{ currentLanguage === 'kh' ? 'ខ្សែរត់ និងប្រតិបត្តិករ' : 'transit lines & operators' }}
        </p>
      </div>

      <!-- Transport Route Cards with Visual Route Timeline -->
      <div v-if="paginatedTransport.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="item in paginatedTransport"
          :key="item.id"
          class="group bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
        >
          <div>
            <!-- Representative Transit Image Banner -->
            <div class="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-700">
              <LazyImage
                v-if="item.image"
                :src="item.image"
                :alt="localized(item.name, item.nameKh)"
                img-class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 dark:from-slate-700 dark:to-slate-800 text-amber-600"
              >
                <Bus class="w-12 h-12 opacity-50" />
              </div>

              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />

              <!-- Top Row: Type Badge + Location Overlaid on Image -->
              <div class="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span :class="['px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-xl border flex items-center gap-1.5 shadow-sm backdrop-blur-md', typeStyles[item.type]?.badge || 'bg-slate-100 text-slate-700 border-slate-200']">
                  <component :is="typeStyles[item.type]?.icon || Bus" class="w-3.5 h-3.5" />
                  <span>{{ item.type }}</span>
                </span>

                <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/95 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 border border-slate-200/60 shadow-sm backdrop-blur-md">
                  <MapPin class="w-3 h-3 text-red-500" />
                  <span>{{ item.location }}</span>
                </span>
              </div>

              <!-- Price Floating Tag -->
              <div class="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between text-white">
                <span class="inline-flex items-center gap-1.5 text-xs font-black bg-emerald-600/90 backdrop-blur-md px-3 py-1 rounded-xl border border-emerald-400/40">
                  <Ticket class="w-3.5 h-3.5" />
                  <span>{{ item.price }}</span>
                </span>
                <span class="inline-flex items-center gap-1 text-[11px] font-bold bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl">
                  <Clock class="w-3 h-3 text-blue-300" />
                  <span>{{ item.schedule }}</span>
                </span>
              </div>
            </div>

            <div class="p-6 space-y-4">
              <!-- Name & Route Details -->
              <div>
                <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {{ localized(item.name, item.nameKh) }}
                </h3>
                <p class="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {{ localized(item.description, item.descriptionKh) }}
                </p>
              </div>

              <!-- Route Path Visual Timeline -->
              <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200/80 dark:border-slate-700/80 space-y-2">
                <div class="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{{ currentLanguage === 'kh' ? 'ទិសដៅខ្សែរត់ (Route Coverage)' : 'Route Coverage' }}</span>
                  <span class="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck class="w-3 h-3" />
                    <span>Official Service</span>
                  </span>
                </div>
                <div class="text-xs font-black text-[#0D47A1] dark:text-blue-300 flex items-start gap-2">
                  <MapPin class="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <span class="leading-relaxed">{{ item.route }}</span>
                </div>
              </div>

              <!-- Useful Information Tip Box -->
              <div v-if="item.usefulInformation || item.usefulInformationKh" class="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
                <Smartphone class="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <p class="text-[11px] leading-relaxed">
                  {{ localized(item.usefulInformation, item.usefulInformationKh) }}
                </p>
              </div>

              <!-- Highlight for Phnom Penh City Bus Authority Card -->
              <div v-if="item.id === 'pp-city-bus'" class="p-3 rounded-2xl bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center justify-between gap-3">
                <div class="flex items-center gap-2">
                  <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span class="text-xs font-black text-emerald-800 dark:text-emerald-200">
                    {{ currentLanguage === 'kh' ? 'បណ្តាញរថយន្តក្រុងផ្លូវការទាំង ១៣ ខ្សែ & ចំណត' : 'All 13 Official Lines & Station Stops' }}
                  </span>
                </div>
                <button
                  @click="openCityBusModal()"
                  type="button"
                  class="px-2.5 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-colors shrink-0 cursor-pointer shadow-2xs"
                >
                  {{ currentLanguage === 'kh' ? 'ពិនិត្យលម្អិត' : 'Inspect' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Card Actions Footer -->
          <div class="px-6 pb-6 pt-0">
            <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
              <span class="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                <CreditCard class="w-3.5 h-3.5 text-slate-400" />
                <span>Cash & KHQR</span>
              </span>

              <!-- If pp-city-bus, open comprehensive modal -->
              <button
                v-if="item.id === 'pp-city-bus'"
                @click="openCityBusModal()"
                type="button"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-2xs transition-all cursor-pointer"
              >
                <span>{{ currentLanguage === 'kh' ? 'មើលផែនទី & ស្ថានីយ' : 'View Route & Stations' }}</span>
                <ExternalLink class="w-3 h-3" />
              </button>

              <a
                v-else
                :href="'https://www.google.com/maps/search/' + encodeURIComponent(item.route + ' ' + item.location + ' Cambodia')"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0D47A1] dark:text-blue-300 hover:bg-[#0D47A1] hover:text-white dark:hover:bg-blue-600 text-xs font-bold border border-blue-200/70 dark:border-blue-700/60 transition-all cursor-pointer"
              >
                <span>{{ currentLanguage === 'kh' ? 'មើលផែនទី & ស្ថានីយ' : 'View Route on Maps' }}</span>
                <ExternalLink class="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center">
        <EmptyState
          :title="t('transport.emptyTitle')"
          :subtitle="t('transport.emptySubtitle')"
          :action-label="t('transport.resetSearch')"
          @action="resetPlanner"
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

    <!-- VIEW 2: PHNOM PENH CITY BUS LINES (PPA) VISUAL EXPLORER -->
    <div v-else-if="activeViewTab === 'city-bus-lines'" class="space-y-6">
      <!-- Intro Card for City Bus -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-sm">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white">
                {{ currentLanguage === 'kh' ? 'បណ្តាញរថយន្តក្រុងសាធារណៈរាជធានីភ្នំពេញ (PPA Municipal Bus Lines)' : 'Phnom Penh City Bus Authority Municipal Network' }}
              </h2>
            </div>
            <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1.5 max-w-3xl">
              {{ currentLanguage === 'kh' ? 'រថយន្តក្រុងសាធារណៈម៉ាស៊ីនត្រជាក់ ដំណើរការជារៀងរាល់ថ្ងៃ ចាប់ពីម៉ោង 5:30 ព្រឹក ដល់ 8:30 យប់។ សំបុត្រតម្លៃ ១,៥០០ រៀល ឬឥតគិតថ្លៃសម្រាប់សិស្ស-និស្សិត និងមនុស្សចាស់។' : 'Clean air-conditioned municipal buses operating daily from 5:30 AM to 8:30 PM with departures every 10-15 minutes.' }}
            </p>
          </div>

          <!-- Live App Tip -->
          <div class="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 p-4 rounded-2xl flex items-center gap-3 shrink-0">
            <Smartphone class="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div>
              <p class="text-xs font-black text-emerald-900 dark:text-emerald-200">
                {{ currentLanguage === 'kh' ? 'កម្មវិធីទូរស័ព្ទ "City Bus"' : 'Official "City Bus" App' }}
              </p>
              <p class="text-[11px] text-emerald-700 dark:text-emerald-300">
                {{ currentLanguage === 'kh' ? 'តាមដានទីតាំងឡានក្រុងតាម GPS ជាក់ស្តែង' : 'Live GPS tracking for all lines' }}
              </p>
            </div>
          </div>
        </div>

        <!-- City Bus Line Selectors -->
        <div class="pt-6 border-t border-slate-100 dark:border-slate-700/60 mt-6">
          <label class="block text-xs font-bold text-slate-400 mb-2">
            {{ currentLanguage === 'kh' ? 'ជ្រើសរើសខ្សែរត់រថយន្តក្រុង ដើម្បីមើលចំណតលម្អិត៖' : 'Select a City Bus Line to view route stations & timetable:' }}
          </label>
          <div class="flex flex-wrap gap-2.5">
            <button
              v-for="line in cityBusLines"
              :key="line.id"
              @click="selectedBusLine = line"
              type="button"
              class="px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border shadow-2xs"
              :class="selectedBusLine?.id === line.id
                ? `${line.color} ring-2 ring-offset-2 ring-emerald-500`
                : 'bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'"
            >
              <Bus class="w-3.5 h-3.5" />
              <span>{{ line.number }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Active City Bus Line Details & Visual Station Stop Sequence -->
      <div v-if="selectedBusLine" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <span :class="['px-3 py-1 rounded-xl text-xs font-black inline-block mb-2', selectedBusLine.color]">
              {{ selectedBusLine.number }}
            </span>
            <h3 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white">
              {{ localized(selectedBusLine.name, selectedBusLine.nameKh) }}
            </h3>
          </div>

          <div class="flex flex-wrap items-center gap-3 text-xs">
            <div class="px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200/60 flex items-center gap-1.5">
              <Clock class="w-3.5 h-3.5" />
              <span>{{ selectedBusLine.operatingHours }} ({{ selectedBusLine.frequency }})</span>
            </div>
            <div class="px-3.5 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-black border border-emerald-200/60 flex items-center gap-1.5">
              <Ticket class="w-3.5 h-3.5" />
              <span>{{ localized(selectedBusLine.fare, selectedBusLine.fareKh) }}</span>
            </div>
          </div>
        </div>

        <!-- Visual Station Stop Timeline -->
        <div class="space-y-4">
          <h4 class="text-xs font-black uppercase tracking-wider text-slate-400">
            {{ currentLanguage === 'kh' ? 'លំដាប់ស្ថានីយចំណតសំខាន់ៗ (Key Bus Stations Sequence)' : 'Key Bus Stations Sequence' }}
          </h4>

          <div class="relative overflow-x-auto py-4">
            <div class="flex items-center min-w-max gap-3 sm:gap-4 px-2">
              <template v-for="(stop, index) in (currentLanguage === 'kh' ? selectedBusLine.stopsKh : selectedBusLine.stops)" :key="index">
                <!-- Station Stop Node -->
                <div class="flex flex-col items-center text-center max-w-[120px]">
                  <div
                    class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-4 ring-white dark:ring-slate-800"
                    :class="index === 0 || index === (selectedBusLine.stops.length - 1)
                      ? 'bg-rose-600 text-white'
                      : 'bg-emerald-600 text-white'"
                  >
                    {{ index + 1 }}
                  </div>
                  <span class="text-xs font-black text-slate-800 dark:text-slate-200 mt-2 line-clamp-2">
                    {{ stop }}
                  </span>
                  <span class="text-[10px] text-slate-400 mt-0.5">
                    {{ index === 0 ? (currentLanguage === 'kh' ? 'ដើមខ្សែ' : 'Terminal') : (index === selectedBusLine.stops.length - 1 ? (currentLanguage === 'kh' ? 'ចុងខ្សែ' : 'Terminal') : (currentLanguage === 'kh' ? 'ចំណត' : 'Stop')) }}
                  </span>
                </div>

                <!-- Connector Arrow (if not last) -->
                <div v-if="index < selectedBusLine.stops.length - 1" class="flex items-center text-slate-300 dark:text-slate-600 px-1">
                  <div class="w-8 sm:w-12 h-0.5 bg-slate-300 dark:bg-slate-600 relative">
                    <ArrowRight class="w-3 h-3 absolute -right-1.5 -top-1 text-slate-400" />
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- Embedded Live Route Map for VIEW 2 -->
        <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <div class="flex items-center justify-between">
            <h4 class="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Navigation class="w-3.5 h-3.5 text-blue-600" />
              <span>{{ currentLanguage === 'kh' ? 'ផែនទីទិសដៅខ្សែរត់ផ្ទាល់ (Interactive Live Route Map)' : 'Interactive Route Map' }}</span>
            </h4>
            <a
              :href="currentBusLineMapExternal"
              target="_blank"
              rel="noopener noreferrer"
              class="text-xs font-bold text-[#0D47A1] dark:text-blue-300 hover:underline flex items-center gap-1"
            >
              <span>{{ currentLanguage === 'kh' ? 'បើកមើលលើ Google Maps ពេញលេញ' : 'Open in Google Maps' }}</span>
              <ExternalLink class="w-3 h-3" />
            </a>
          </div>

          <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
            <iframe
              :src="currentBusLineMapEmbed"
              class="w-full h-72 sm:h-80 border-0"
              loading="lazy"
              allowfullscreen
              referrerpolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <!-- Google Maps Direct Link & Note -->
        <div class="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p class="text-slate-500 dark:text-slate-400 text-center sm:text-left">
            {{ currentLanguage === 'kh' ? 'ចំណាំ៖ រថយន្តក្រុងឈប់នៅតាមផ្លាកសញ្ញាចំណតរថយន្តក្រុង (Bus Stop Signs) តាមបណ្តោយខ្សែរត់នីមួយៗ។' : 'Note: Buses only board and alight passengers at designated municipal bus stops along the corridor.' }}
          </p>
          <a
            :href="currentBusLineMapExternal"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] text-white font-bold hover:bg-blue-700 transition-colors shadow-2xs shrink-0 cursor-pointer"
          >
            <span>{{ currentLanguage === 'kh' ? 'មើលទីតាំងចំណតលើ Google Maps' : 'View Stops on Google Maps' }}</span>
            <ExternalLink class="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>

    <!-- PHNOM PENH CITY BUS COMPREHENSIVE MODAL -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div
        v-if="showCityBusModal"
        class="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto"
        @click.self="showCityBusModal = false"
      >
        <div class="relative w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
          <!-- Modal Header -->
          <div class="p-5 sm:p-6 bg-gradient-to-r from-emerald-600 to-teal-700 text-white flex items-center justify-between gap-4 shrink-0 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 shrink-0">
                <Bus class="w-6 h-6 text-white" />
              </div>
              <div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-white/20 border border-white/30 text-white">
                    PPA Municipal Lines
                  </span>
                  <span class="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
                </div>
                <h2 class="text-base sm:text-lg font-black text-white leading-snug mt-0.5">
                  {{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតខ្សែរថយន្តក្រុងសាធារណៈរាជធានីភ្នំពេញ' : 'Phnom Penh City Bus Authority — Network & Station Details' }}
                </h2>
                <p class="text-xs text-emerald-100 mt-0.5 hidden sm:block">
                  {{ currentLanguage === 'kh' ? 'បណ្តាញរថយន្តក្រុងទាំង ១៣ ខ្សែ ម៉ោងចេញដំណើរ ចំណតនីមួយៗ និងទិសដៅខ្សែរត់' : 'Complete 13 bus corridors, terminal stations, schedules, and intermediate stops' }}
                </p>
              </div>
            </div>

            <button
              @click="showCityBusModal = false"
              type="button"
              class="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="Close"
            >
              <X class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Scrollable Content -->
          <div class="overflow-y-auto p-5 sm:p-6 space-y-6">
            <!-- Policy & Timing Highlight Cards -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <!-- Operating Hours -->
              <div class="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200/70 dark:border-blue-800/50">
                <div class="flex items-center gap-1.5 text-blue-700 dark:text-blue-300 mb-1">
                  <Clock class="w-3.5 h-3.5 shrink-0" />
                  <span class="text-[11px] font-black uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ម៉ោងដំណើរការ' : 'Hours' }}</span>
                </div>
                <p class="text-xs font-black text-slate-800 dark:text-white">5:30 ព្រឹក - 8:30 យប់</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">ចេញរៀងរាល់ 10 - 15 នាទី</p>
              </div>

              <!-- Fare -->
              <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/50">
                <div class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 mb-1">
                  <Ticket class="w-3.5 h-3.5 shrink-0" />
                  <span class="text-[11px] font-black uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'តម្លៃសំបុត្រ' : 'Standard Fare' }}</span>
                </div>
                <p class="text-xs font-black text-emerald-700 dark:text-emerald-300">១,៥០០ រៀល / ជើង</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">បង់ប្រាក់សុទ្ធ ឬ Wing/KHQR</p>
              </div>

              <!-- Free Pass -->
              <div class="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/50">
                <div class="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 mb-1">
                  <ShieldCheck class="w-3.5 h-3.5 shrink-0" />
                  <span class="text-[11px] font-black uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'ជិះឥតគិតថ្លៃ (Free)' : 'Free Pass' }}</span>
                </div>
                <p class="text-xs font-black text-amber-800 dark:text-amber-200">សិស្ស, មនុស្សចាស់, ព្រះសង្ឃ</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">រួមទាំងជនពិការ និងកម្មករ</p>
              </div>

              <!-- Live Mobile App -->
              <div class="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/50">
                <div class="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 mb-1">
                  <Smartphone class="w-3.5 h-3.5 shrink-0" />
                  <span class="text-[11px] font-black uppercase tracking-wider">{{ currentLanguage === 'kh' ? 'កម្មវិធីទូរស័ព្ទ' : 'Mobile App' }}</span>
                </div>
                <p class="text-xs font-black text-purple-800 dark:text-purple-200">App "City Bus"</p>
                <p class="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">តាមដាន GPS ឡានក្រុងពិតៗ</p>
              </div>
            </div>

            <!-- Bus Line Selector Tabs (All 13 Lines) -->
            <div>
              <div class="flex items-center justify-between mb-2.5">
                <label class="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                  <Bus class="w-3.5 h-3.5 text-emerald-600" />
                  <span>{{ currentLanguage === 'kh' ? 'ជ្រើសរើសខ្សែរថយន្តក្រុង (ចុចលើលេខខ្សែដើម្បីពិនិត្យទិសដៅ)៖' : 'Select Bus Line (Click to view stations & route):' }}</span>
                </label>
                <span class="text-[11px] font-bold text-slate-400">
                  {{ cityBusLines.length }} {{ currentLanguage === 'kh' ? 'ខ្សែរត់សរុប' : 'Total Lines' }}
                </span>
              </div>

              <div class="flex flex-wrap gap-2">
                <button
                  v-for="line in cityBusLines"
                  :key="line.id"
                  @click="selectedBusLine = line"
                  type="button"
                  class="px-3.5 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 border"
                  :class="selectedBusLine?.id === line.id
                    ? `${line.color} ring-2 ring-offset-2 ring-emerald-500 shadow-md scale-105`
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'"
                >
                  <Bus class="w-3.5 h-3.5 shrink-0" />
                  <span>{{ line.number }}</span>
                </button>
              </div>
            </div>

            <!-- Active Selected Line Detailed Dossier -->
            <div v-if="selectedBusLine" class="bg-slate-50 dark:bg-slate-800/70 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 space-y-6">
              <!-- Route Title & Corridors -->
              <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-700">
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2">
                    <span :class="['px-3 py-1 rounded-xl text-xs font-black inline-block', selectedBusLine.color]">
                      {{ selectedBusLine.number }}
                    </span>
                    <span class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <ShieldCheck class="w-3.5 h-3.5" />
                      <span>{{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវការរដ្ឋបាលរាជធានីភ្នំពេញ' : 'Official PPA Municipal Line' }}</span>
                    </span>
                  </div>
                  <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
                    {{ localized(selectedBusLine.name, selectedBusLine.nameKh) }}
                  </h3>
                  <p class="text-xs text-slate-500 dark:text-slate-400">
                    <strong class="text-slate-700 dark:text-slate-300">{{ currentLanguage === 'kh' ? 'កាត់តាមផ្លូវសំខាន់ៗ៖' : 'Key Corridors:' }}</strong>
                    {{ selectedBusLine.keyCorridorKh }}
                  </p>
                </div>

                <!-- Timing & Price Pills -->
                <div class="flex flex-wrap items-center gap-2 text-xs shrink-0">
                  <div class="px-3 py-1.5 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-900 dark:text-blue-200 font-bold flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5 text-blue-600" />
                    <span>{{ selectedBusLine.operatingHours }}</span>
                  </div>
                  <div class="px-3 py-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-900 dark:text-emerald-200 font-black flex items-center gap-1.5">
                    <Ticket class="w-3.5 h-3.5 text-emerald-600" />
                    <span>{{ localized(selectedBusLine.fare, selectedBusLine.fareKh) }}</span>
                  </div>
                </div>
              </div>

              <!-- Terminals Highlights -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    A
                  </div>
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-rose-500">{{ currentLanguage === 'kh' ? 'ដើមខ្សែ (Start Terminal)' : 'Start Terminal' }}</span>
                    <p class="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                      {{ localized(selectedBusLine.startTerminal, selectedBusLine.startTerminalKh) }}
                    </p>
                  </div>
                </div>

                <div class="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex items-start gap-3">
                  <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    B
                  </div>
                  <div>
                    <span class="text-[10px] font-black uppercase tracking-wider text-blue-500">{{ currentLanguage === 'kh' ? 'ចុងខ្សែ (End Terminal)' : 'End Terminal' }}</span>
                    <p class="text-xs sm:text-sm font-black text-slate-800 dark:text-white">
                      {{ localized(selectedBusLine.endTerminal, selectedBusLine.endTerminalKh) }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Station Sequence / Intermediate Stops -->
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-red-500" />
                    <span>{{ currentLanguage === 'kh' ? 'លំដាប់ចំណតសំខាន់ៗដែលឡានក្រុងឈប់ (Key Station Stops)' : 'Key Station Stops Sequence' }}</span>
                  </h4>
                  <span class="text-[11px] text-slate-400">
                    {{ selectedBusLine.stopsKh.length }} {{ currentLanguage === 'kh' ? 'ចំណតសំខាន់ៗ' : 'stops' }}
                  </span>
                </div>

                <!-- Visual Sequence Flow -->
                <div class="relative overflow-x-auto py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-4">
                  <div class="flex items-center min-w-max gap-3 sm:gap-4 px-1">
                    <template v-for="(stop, index) in (currentLanguage === 'kh' ? selectedBusLine.stopsKh : selectedBusLine.stops)" :key="index">
                      <div class="flex flex-col items-center text-center max-w-[130px]">
                        <div
                          class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm ring-4 ring-white dark:ring-slate-900"
                          :class="index === 0
                            ? 'bg-rose-600 text-white'
                            : (index === (selectedBusLine.stops.length - 1) ? 'bg-blue-600 text-white' : 'bg-emerald-600 text-white')"
                        >
                          {{ index + 1 }}
                        </div>
                        <span class="text-xs font-black text-slate-800 dark:text-slate-200 mt-2 line-clamp-2">
                          {{ stop }}
                        </span>
                        <span class="text-[10px] text-slate-400 mt-0.5">
                          {{ index === 0 ? (currentLanguage === 'kh' ? 'ដើមខ្សែ' : 'Terminal A') : (index === selectedBusLine.stops.length - 1 ? (currentLanguage === 'kh' ? 'ចុងខ្សែ' : 'Terminal B') : (currentLanguage === 'kh' ? 'ចំណតទី ' + (index + 1) : 'Stop ' + (index + 1))) }}
                        </span>
                      </div>

                      <!-- Arrow Connector -->
                      <div v-if="index < selectedBusLine.stops.length - 1" class="flex items-center text-slate-300 dark:text-slate-600 px-1">
                        <div class="w-8 sm:w-12 h-0.5 bg-slate-300 dark:bg-slate-600 relative">
                          <ArrowRight class="w-3 h-3 absolute -right-1.5 -top-1 text-slate-400" />
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Embedded Interactive Google Map Route for the Bus Line -->
              <div class="space-y-2">
                <div class="flex items-center justify-between">
                  <h4 class="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                    <Navigation class="w-3.5 h-3.5 text-blue-600" />
                    <span>{{ currentLanguage === 'kh' ? 'ផែនទីទិសដៅខ្សែរត់ផ្ទាល់ (Interactive Live Route Map)' : 'Interactive Route Map' }}</span>
                  </h4>
                  <a
                    :href="currentBusLineMapExternal"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="text-xs font-bold text-[#0D47A1] dark:text-blue-300 hover:underline flex items-center gap-1"
                  >
                    <span>{{ currentLanguage === 'kh' ? 'បើកមើលលើ Google Maps ពេញលេញ' : 'Open in Google Maps' }}</span>
                    <ExternalLink class="w-3 h-3" />
                  </a>
                </div>

                <div class="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  <iframe
                    :src="currentBusLineMapEmbed"
                    class="w-full h-72 sm:h-80 border-0"
                    loading="lazy"
                    allowfullscreen
                    referrerpolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

          </div>

          <!-- Modal Footer -->
          <div class="p-4 sm:p-5 bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
            <p class="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
              {{ currentLanguage === 'kh' ? 'រថយន្តក្រុងសាធារណៈរាជធានីភ្នំពេញ ផ្តល់ផាសុកភាព សុវត្ថិភាព និងកាត់បន្ថយការកកស្ទះចរាចរណ៍' : 'Phnom Penh Municipal Bus Authority provides safe, comfortable, and affordable public transit' }}
            </p>
            <div class="flex items-center gap-2">
              <button
                @click="activeViewTab = 'city-bus-lines'; showCityBusModal = false"
                type="button"
                class="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0D47A1] dark:text-blue-300 text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {{ currentLanguage === 'kh' ? 'មើលលើទំព័រពេញ' : 'View Full Page Tab' }}
              </button>
              <button
                @click="showCityBusModal = false"
                type="button"
                class="px-5 py-2 rounded-xl bg-slate-900 dark:bg-slate-700 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
              </button>
            </div>
          </div>

        </div>
      </div>
    </Transition>
  </div>
</template>
