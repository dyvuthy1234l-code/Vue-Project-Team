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
  FileText,
  Building2,
  Download,
  HelpCircle,
  MapPin,
  BadgeCheck,
  ChevronDown,
  Car,
  Briefcase,
  Home,
  Check
} from 'lucide-vue-next'
import EmptyState from '@/components/EmptyState.vue'
import ServiceCompareModal from '@/components/ServiceCompareModal.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useLocation } from '@/composables/useLocation'
import { getGovernmentServices } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized, currentLanguage } = useLanguage()
const { selectedProvince } = useLocation()

usePageMeta({
  title: 'មគ្គុទ្ទេសក៍សេវារដ្ឋបាលសាធារណៈជាតិ — Official Cambodia Citizen Services Portal',
  description: 'នីតិវិធីសាធារណៈផ្លូវការ ឯកសារតម្រូវ តម្លៃសេវាកំណត់ដោយរដ្ឋ និងទីតាំងច្រកចេញចូលតែមួយ (OWSO) សម្រាប់ប្រជាពលរដ្ឋកម្ពុជា'
})

const allServices = getGovernmentServices()
const searchQuery = ref('')
const activeCategory = ref('All')
const activePillarId = ref<string | null>(null)
const isCompareOpen = ref(false)
const expandedFaq = ref<number | null>(null)
const downloadedFormId = ref<string | null>(null)

// 4 Civic Life-Event Pillars (សសរស្ដម្ភសេវាពលរដ្ឋ ៤ វិស័យ)
const lifeEventPillars = [
  {
    id: 'civil-id',
    name: 'Civil Status & ID',
    nameKh: 'អត្តសញ្ញាណ និងអត្រានុកូលដ្ឋាន',
    badgeKh: '៤ សេវាស្នូល',
    descKh: 'អត្តសញ្ញាណប័ណ្ណ, សំបុត្រកំណើត, សៀវភៅគ្រួសារ, សំបុត្រអាពាហ៍ពិពាហ៍',
    items: ['អត្តសញ្ញាណប័ណ្ណ', 'សំបុត្រកំណើត', 'សៀវភៅគ្រួសារ', 'អាពាហ៍ពិពាហ៍'],
    icon: BadgeCheck,
    categories: ['ID Card', 'Birth Certificate', 'Family Book', 'Marriage Certificate'],
    gradient: 'from-blue-600 to-[#0D47A1]',
    tagBg: 'bg-blue-50 text-[#0D47A1]'
  },
  {
    id: 'transport',
    name: 'Transport & Driver',
    nameKh: 'យានយន្ត និងប័ណ្ណបើកបរ',
    badgeKh: 'សេវាពេញនិយម',
    descKh: 'ប័ណ្ណបើកបរជាតិ, ផ្ទេរកម្មសិទ្ធិយានយន្ត, ត្រួតពិនិត្យបច្ចេកទេស (ឆៀក)',
    items: ['ប័ណ្ណបើកបរជាតិ', 'ផ្ទេរកម្មសិទ្ធិយានយន្ត', 'ឆៀកបច្ចេកទេស'],
    icon: Car,
    categories: ["Driver's License"],
    gradient: 'from-emerald-500 to-teal-700',
    tagBg: 'bg-emerald-50 text-emerald-700'
  },
  {
    id: 'business',
    name: 'Business & Trade',
    nameKh: 'ពាណិជ្ជកម្ម និងចុះបញ្ជីអាជីវកម្ម',
    badgeKh: 'តាម CamDX',
    descKh: 'ចុះបញ្ជីក្រុមហ៊ុនតាម CamDX, ប័ណ្ណប៉ាតង់, ពន្ធដារ និងអាជ្ញាប័ណ្ណអាជីវកម្ម',
    items: ['ចុះបញ្ជីក្រុមហ៊ុន', 'ប័ណ្ណប៉ាតង់ពន្ធដារ', 'អាជ្ញាប័ណ្ណអាជីវកម្ម'],
    icon: Briefcase,
    categories: ['Business Registration'],
    gradient: 'from-indigo-500 to-indigo-800',
    tagBg: 'bg-indigo-50 text-indigo-700'
  },
  {
    id: 'land',
    name: 'Land & Property',
    nameKh: 'ដីធ្លី និងអចលនទ្រព្យ',
    badgeKh: 'កម្មសិទ្ធិស្របច្បាប់',
    descKh: 'ផ្ទេរកម្មសិទ្ធិប្លង់រឹង, លិខិតអនុញ្ញាតសាងសង់, បំបែកក្បាលដីធ្លី',
    items: ['ផ្ទេរប្លង់រឹង', 'លិខិតអនុញ្ញាតសាងសង់', 'បំបែកក្បាលដី'],
    icon: Home,
    categories: ['Land Title'],
    gradient: 'from-amber-500 to-amber-700',
    tagBg: 'bg-amber-50 text-amber-800'
  }
]

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
const popularItemsMeta: Record<string, {
  ministry: string
  ministryKh: string
  badge: string
  badgeKh: string
  badgeColor: string
  price: string
  priceKh: string
  days: string
  daysKh: string
  docsCount: number
}> = {
  'national-id-card': {
    ministry: 'Ministry of Interior (GDI)',
    ministryKh: 'ក្រសួងមហាផ្ទៃ • អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម',
    badge: 'Most Essential',
    badgeKh: 'សេវាចាំបាច់បំផុត',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    price: 'Free',
    priceKh: 'ឥតគិតថ្លៃ',
    days: '15-30 days',
    daysKh: '១៥-៣០ ថ្ងៃធ្វើការ',
    docsCount: 4
  },
  'passport': {
    ministry: 'General Department of Identification',
    ministryKh: 'ក្រសួងមហាផ្ទៃ • អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម',
    badge: 'Official',
    badgeKh: 'លិខិតអន្តរជាតិ',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    price: '$50 (Standard)',
    priceKh: '$៥០ (ស្តង់ដារ)',
    days: '7-21 days',
    daysKh: '៧-២១ ថ្ងៃធ្វើការ',
    docsCount: 5
  },
  'drivers-license': {
    ministry: 'Ministry of Public Works and Transport',
    ministryKh: 'ក្រសួងសាធារណការ និងដឹកជញ្ជូន',
    badge: 'Popular',
    badgeKh: 'ពេញនិយម',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    price: '$20 / 80,000 Riel',
    priceKh: '$២០ (៨០,០០០ រៀល)',
    days: '7-14 days',
    daysKh: '៧-១៤ ថ្ងៃធ្វើការ',
    docsCount: 4
  },
  'birth-certificate': {
    ministry: 'Sangkat / Khan Civil Status Office',
    ministryKh: 'រដ្ឋបាលសង្កាត់/ឃុំ • ការិយាល័យអត្រានុកូលដ្ឋាន',
    badge: 'Free of Charge',
    badgeKh: 'ឥតគិតថ្លៃ ៣០ថ្ងៃដំបូង',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    price: 'Free',
    priceKh: 'ឥតគិតថ្លៃ',
    days: '3-14 days',
    daysKh: '៣-១៤ ថ្ងៃធ្វើការ',
    docsCount: 3
  },
  'family-book': {
    ministry: 'National Police Commissariat',
    ministryKh: 'ប៉ុស្តិ៍នគរបាលរដ្ឋបាលឃុំ/សង្កាត់',
    badge: 'Civic Record',
    badgeKh: 'កម្រងគ្រួសារ',
    badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    price: '$5',
    priceKh: '$៥ (២០,០០០ រៀល)',
    days: '3-7 days',
    daysKh: '៣-៧ ថ្ងៃធ្វើការ',
    docsCount: 3
  },
  'marriage-certificate': {
    ministry: 'Sangkat / Commune Hall',
    ministryKh: 'សាលាសង្កាត់/ឃុំ នៃទីលំនៅអចិន្ត្រៃយ៍',
    badge: 'Civil Status',
    badgeKh: 'អត្រានុកូលដ្ឋាន',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
    price: '$5',
    priceKh: '$៥ (២០,០០០ រៀល)',
    days: '3-7 days',
    daysKh: '៣-៧ ថ្ងៃធ្វើការ',
    docsCount: 4
  },
  'business-registration': {
    ministry: 'Ministry of Commerce & CamDX Portal',
    ministryKh: 'ក្រសួងពាណិជ្ជកម្ម • ប្រព័ន្ធ CamDX',
    badge: 'Single Portal',
    badgeKh: 'តាមប្រព័ន្ធ CamDX',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
    price: '$80',
    priceKh: '$៨០ (ផ្លូវការ)',
    days: '7-15 days',
    daysKh: '៧-១៥ ថ្ងៃធ្វើការ',
    docsCount: 5
  },
  'land-title': {
    ministry: 'Ministry of Land Management (MLMUPC)',
    ministryKh: 'ក្រសួងរៀបចំដែនដី នគរូបនីយកម្ម និងសំណង់',
    badge: 'Property',
    badgeKh: 'កម្មសិទ្ធិអចលនទ្រព្យ',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
    price: '$100 (Official fee)',
    priceKh: '$១០០ (កម្រៃរដ្ឋ)',
    days: '15-30 days',
    daysKh: '១៥-៣០ ថ្ងៃធ្វើការ',
    docsCount: 6
  }
}

// 4 Standard Citizen Steps
const standardSteps = [
  {
    step: '01',
    titleKh: 'ពិនិត្យឯកសារតម្រូវ',
    titleEn: 'Check Requirements',
    descKh: 'អានបញ្ជីឯកសារច្បាប់ដើម និងថតចម្លងដែលតម្រូវឱ្យបានត្រឹមត្រូវមុននឹងចេញដំណើរ។'
  },
  {
    step: '02',
    titleKh: 'ដាក់ពាក្យស្នើសុំ',
    titleEn: 'Submit Application',
    descKh: 'ទៅកាន់ការិយាល័យច្រកចេញចូលតែមួយ (OWSO) ឬដាក់ពាក្យតាមប្រព័ន្ធ CamDX។'
  },
  {
    step: '03',
    titleKh: 'បង់កម្រៃសេវាមានវិក្កយបត្រ',
    titleEn: 'Pay Official Fee',
    descKh: 'បង់ប្រាក់តាមតារាងតម្លៃផ្លូវការកំណត់ដោយរដ្ឋ និងទទួលវិក្កយបត្រក្រសួងសេដ្ឋកិច្ច។'
  },
  {
    step: '04',
    titleKh: 'ទទួលឯកសារផ្លូវការ',
    titleEn: 'Collect Official Document',
    descKh: 'បង្ហាញប័ណ្ណទទួល និងផ្ទៀងផ្ទាត់ទិន្នន័យលើប័ណ្ណ ឬលិខិតផ្លូវការរបស់អ្នក។'
  }
]

// Downloadable Forms
const officialForms = [
  {
    id: 'form-id-card',
    titleKh: 'ទម្រង់ពាក្យសុំធ្វើអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (គំរូ ក.ប.១)',
    titleEn: 'Khmer National ID Card Application Form (KB1)',
    size: '1.2 MB',
    format: 'PDF',
    departmentKh: 'អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម'
  },
  {
    id: 'form-passport',
    titleKh: 'ទម្រង់ពាក្យស្នើសុំលិខិតឆ្លងដែនធម្មតា នៃព្រះរាជាណាចក្រកម្ពុជា',
    titleEn: 'Cambodia Ordinary Passport Application Form',
    size: '1.8 MB',
    format: 'PDF',
    departmentKh: 'នាយកដ្ឋានលិខិតឆ្លងដែន'
  },
  {
    id: 'form-driver-license',
    titleKh: 'ពាក្យសុំប្រឡងយក ឬប្តូរទុតិយតាប័ណ្ណបើកបរយានយន្ត',
    titleEn: "Driver's License Issuance & Renewal Form",
    size: '950 KB',
    format: 'PDF',
    departmentKh: 'ក្រសួងសាធារណការ និងដឹកជញ្ជូន'
  },
  {
    id: 'form-business-reg',
    titleKh: 'ពាក្យសុំចុះឈ្មោះពាណិជ្ជកម្មតាមថ្នាលបច្ចេកវិទ្យា CamDX',
    titleEn: 'Single Portal Business Registration Application Form',
    size: '2.1 MB',
    format: 'PDF',
    departmentKh: 'ក្រសួងពាណិជ្ជកម្ម'
  }
]

// Frequently Asked Questions
const governmentFaqs = [
  {
    questionKh: 'តើការធ្វើអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរត្រូវបង់ប្រាក់ដែរឬទេ?',
    answerKh: 'ការធ្វើអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរលើកដំបូង និងការប្តូរធម្មតាពេលផុតកំណត់ គឺត្រូវបានផ្តល់ជូនដោយ «ឥតគិតថ្លៃ» ស្របតាមគោលនយោបាយរបស់រាជរដ្ឋាភិបាលកម្ពុជា។ ប្រជាពលរដ្ឋមិនចាំបាច់បង់ប្រាក់ក្រៅផ្លូវការឡើយ។'
  },
  {
    questionKh: 'តើការិយាល័យច្រកចេញចូលតែមួយ (OWSO) បើកបម្រើសេវាម៉ោងប៉ុន្មាន?',
    answerKh: 'ការិយាល័យច្រកចេញចូលតែមួយទូទាំង ២៥ រាជធានី-ខេត្ត បើកបម្រើសេវាពីថ្ងៃចន្ទ ដល់ ថ្ងៃសុក្រ ចាប់ពីម៉ោង ៧:៣០ ព្រឹក ដល់ ១១:៣០ ថ្ងៃត្រង់ និង ម៉ោង ២:០០ រសៀល ដល់ ៥:០០ ល្ងាច (លើកលែងថ្ងៃបុណ្យជាតិផ្លូវការ)។'
  },
  {
    questionKh: 'តើត្រូវចំណាយពេលប៉ុន្មានទើបទទួលបានលិខិតឆ្លងដែនធម្មតា?',
    answerKh: 'សេវាធម្មតាចំណាយពេល ២០ ថ្ងៃធ្វើការ (តម្លៃ $៥០)។ ប្រសិនបើពលរដ្ឋត្រូវការបន្ទាន់ មានសេវាឆាប់រហ័ស ៧ ថ្ងៃធ្វើការ ($១០០) ឬ ១ ថ្ងៃធ្វើការ ($២០០) នៅអគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម (ច្បារអំពៅ ឬផ្សារទំនើបអ៊ីអន)។'
  },
  {
    questionKh: 'បើជួបបញ្ហាទារប្រាក់លើសតម្លៃសេវាផ្លូវការ តើអាចប្តឹងតវ៉ាតាមណា?',
    answerKh: 'លោកអ្នកអាចទាក់ទងមកកាន់ខ្សែទូរស័ព្ទទាន់ហេតុការណ៍ និងឆ្លើយតបចម្ងល់ពលរដ្ឋតាមរយៈលេខ ១២២២ (Free Call) ឬប្រអប់សំបុត្រទទួលពាក្យបណ្តឹងនៅសាលារាជធានី-ខេត្ត និងការិយាល័យច្រកចេញចូលតែមួយ។'
  }
]

const filteredServices = computed(() => {
  let result = allServices

  if (activePillarId.value) {
    const p = lifeEventPillars.find(item => item.id === activePillarId.value)
    if (p) {
      result = result.filter(s => p.categories.includes(s.category))
    }
  } else if (activeCategory.value !== 'All') {
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
  activePillarId.value = null
  activeCategory.value = cat
  scrollToServices()
}

function selectPillar(pillar: typeof lifeEventPillars[0]) {
  if (activePillarId.value === pillar.id) {
    activePillarId.value = null
    activeCategory.value = 'All'
  } else {
    activePillarId.value = pillar.id
    activeCategory.value = 'All'
  }
  scrollToServices()
}

function handleSearch() {
  scrollToServices()
}

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = 'All'
  activePillarId.value = null
}

function scrollToServices() {
  if (typeof document !== 'undefined') {
    const el = document.getElementById('services-grid-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

function triggerDownload(formId: string) {
  downloadedFormId.value = formId
  setTimeout(() => {
    downloadedFormId.value = null
  }, 2500)
}
</script>

<template>
  <div class="gov-portal bg-[#F8FAFC] min-h-screen pb-16 font-khmer text-slate-800 space-y-6 sm:space-y-10">

    <!-- ============================================================
         1. OFFICIAL STATE MASTHEAD & VERIFICATION HEADER
         ============================================================ -->
    <div class="bg-white border-b border-slate-200 shadow-xs">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 text-xs">
        <div class="flex items-center justify-between sm:justify-start gap-2 font-bold">
          <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-[#0D47A1] border border-blue-200/80 font-black text-[11px] sm:text-xs shrink-0">
            <Landmark class="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
            <span>ព្រះរាជាណាចក្រកម្ពុជា</span>
            <span class="text-slate-300">|</span>
            <span class="font-normal text-slate-600">ជាតិ សាសនា ព្រះមហាក្សត្រ</span>
          </span>
          <span class="hidden md:inline text-slate-500 font-medium text-xs">
            ច្រកសេវារដ្ឋបាលសាធារណៈផ្លូវការ (OWSO Civic Portal)
          </span>
        </div>

        <div class="flex items-center justify-between sm:justify-end gap-2 font-bold text-slate-600">
          <div class="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[10px] sm:text-[11px] truncate">
            <span class="h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ច្រកចេញចូលតែមួយ បើកបម្រើសេវា (ចន្ទ - សុក្រ)' : 'OWSO Open Mon - Fri' }}</span>
          </div>

          <div class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1 rounded-full bg-blue-50 text-[#0D47A1] border border-blue-200 font-bold text-[11px] sm:text-xs shrink-0">
            <MapPin class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? selectedProvince.nameKh : selectedProvince.name }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 sm:space-y-10">

      <!-- ============================================================
           2. ROYAL CIVIC HERO BANNER & CITIZEN SEARCH CONSOLE
           ============================================================ -->
      <section class="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0D3B66] to-[#0D47A1] text-white p-4 sm:p-8 lg:p-10 shadow-xl border border-blue-900/40">
        <!-- Subtle Palace Silhouette Overlay -->
        <div class="absolute inset-0 z-0 opacity-15 mix-blend-luminosity pointer-events-none">
          <img
            src="/images/pillars/government-hero.jpg"
            alt="Royal Palace Cambodia"
            class="w-full h-full object-cover object-right"
          />
        </div>
        <div class="absolute inset-0 bg-gradient-to-r from-[#0A2540] via-[#0A2540]/90 to-transparent pointer-events-none z-0" />

        <div class="relative z-10 space-y-4 sm:space-y-6 max-w-4xl">
          <!-- Official Portal Pill -->
          <div class="inline-flex items-center gap-1.5 sm:gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] sm:text-xs font-black text-white border border-white/20 backdrop-blur-md max-w-full">
            <ShieldCheck class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400 shrink-0" />
            <span class="truncate">{{ currentLanguage === 'kh' ? 'ច្រកសេវារដ្ឋបាលសាធារណៈផ្លូវការ • ធានាតម្លៃរដ្ឋ ១០០%' : 'Official Citizen Portal • 100% Regulated Fees' }}</span>
          </div>

          <!-- Main Title -->
          <div class="space-y-1.5 sm:space-y-2">
            <h1 class="text-xl sm:text-3xl lg:text-5xl font-black text-white tracking-tight leading-snug">
              {{ currentLanguage === 'kh' ? 'មគ្គុទ្ទេសក៍សេវារដ្ឋបាលសាធារណៈ' : 'National Public Civic Services Guide' }}
            </h1>
            <p class="text-xs sm:text-sm text-blue-100/90 font-normal leading-relaxed max-w-2xl">
              {{ currentLanguage === 'kh'
                ? 'ស្វែងយល់ពីនីតិវិធីច្បាប់ ឯកសារតម្រូវ តម្លៃសេវាផ្លូវការ និងការិយាល័យច្រកចេញចូលតែមួយ (OWSO) សម្រាប់ប្រជាពលរដ្ឋកម្ពុជាទូទាំង ២៥ រាជធានី-ខេត្ត។'
                : 'Complete official legal procedures, required documentation checklists, regulated fees, and One Window Service Offices (OWSO) across Cambodia.'
              }}
            </p>
          </div>

          <!-- Citizen Search Console -->
          <form @submit.prevent="handleSearch" class="relative max-w-2xl">
            <div class="relative flex items-center bg-white rounded-2xl shadow-xl p-1 sm:p-1.5 focus-within:ring-4 focus-within:ring-blue-400/30 transition-all">
              <Search class="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-2.5 sm:ml-3 shrink-0" />
              <input
                v-model="searchQuery"
                type="text"
                @keyup.enter="handleSearch"
                :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវា ឬឯកសារ (លិខិតឆ្លងដែន, ប័ណ្ណបើកបរ...)' : 'Search services (e.g. Passport, License...)'"
                class="w-full px-2 sm:px-3 py-2 sm:py-2.5 text-xs sm:text-sm font-bold bg-transparent text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
              <button
                v-if="searchQuery"
                @click="searchQuery = ''; scrollToServices()"
                type="button"
                class="px-2 py-1 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
              <button
                type="submit"
                class="px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] active:scale-95 text-white font-black text-xs transition-all shadow-md cursor-pointer shrink-0"
              >
                {{ currentLanguage === 'kh' ? 'ស្វែងរក' : 'Search' }}
              </button>
            </div>
          </form>

          <!-- Quick Service Filter Pills (Smooth Horizontal Swipe on Mobile, Wrap on Desktop) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-[11px] font-bold text-blue-200">
              <span>{{ currentLanguage === 'kh' ? 'សេវាដែលប្រជាពលរដ្ឋស្វែងរកញឹកញាប់បំផុត៖' : 'Most Popular Citizen Services:' }}</span>
              <span class="sm:hidden text-[10px] text-blue-300 font-normal">👉 អូសឆ្វេង-ស្តាំ</span>
            </div>
            <div class="flex items-center gap-1.5 overflow-x-auto pb-1.5 sm:pb-0 scrollbar-none sm:flex-wrap -mx-1 px-1">
              <button
                v-for="pill in quickPills"
                :key="pill.id"
                @click="selectPill(pill.category)"
                type="button"
                :class="[
                  'px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs shrink-0 whitespace-nowrap active:scale-95',
                  activeCategory === pill.category
                    ? 'bg-white text-[#0D47A1] border-white font-black shadow-md scale-102'
                    : 'bg-white/10 hover:bg-white/20 text-white border-white/15 backdrop-blur-xs'
                ]"
              >
                <span>{{ currentLanguage === 'kh' ? pill.labelKh : pill.label }}</span>
              </button>
            </div>
          </div>

          <!-- Trust Checkmarks Grid -->
          <div class="grid grid-cols-3 gap-1.5 py-2 px-2.5 rounded-xl bg-white/10 backdrop-blur-xs border border-white/10 text-center font-bold text-[10px] sm:text-xs text-blue-100">
            <div class="flex items-center justify-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span class="truncate">៨ សេវាស្នូល</span>
            </div>
            <div class="flex items-center justify-center gap-1 border-x border-white/15 px-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span class="truncate">២៥ រាជធានី-ខេត្ត</span>
            </div>
            <div class="flex items-center justify-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span class="truncate">តម្លៃរដ្ឋ ១០០%</span>
            </div>
          </div>

          <!-- Hotline 1222 Strip -->
          <div class="pt-2 border-t border-white/15 flex items-center justify-between gap-2 text-xs text-blue-100">
            <span class="text-blue-200 text-[11px] font-medium truncate">{{ currentLanguage === 'kh' ? 'ខ្សែទូរស័ព្ទជំនួយពលរដ្ឋ៖' : 'Citizen Helpdesk:' }}</span>
            <a
              href="tel:1222"
              class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-black text-xs transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Headphones class="w-3.5 h-3.5" />
              <span>1222 (Free Call)</span>
            </a>
          </div>
        </div>
      </section>

      <!-- ============================================================
           3. CITIZEN LIFE-EVENT PILLARS (៤ សសរស្ដម្ភសេវាពលរដ្ឋ)
           ============================================================ -->
      <section class="space-y-3 sm:space-y-4 font-khmer">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-[11px] sm:text-xs font-black text-[#0D47A1] uppercase tracking-wider">
              {{ currentLanguage === 'kh' ? 'វិស័យសេវាសាធារណៈស្នូល' : 'Core Public Service Pillars' }}
            </span>
            <h2 class="text-base sm:text-xl font-black text-slate-900 tracking-tight mt-0.5">
              {{ currentLanguage === 'kh' ? 'សសរស្ដម្ភសេវារដ្ឋបាលសាធារណៈទាំង ៤ វិស័យ' : '4 Core Pillars of Public Civic Administration' }}
            </h2>
          </div>
          <span class="text-xs text-slate-500 font-semibold hidden sm:inline">
            {{ currentLanguage === 'kh' ? 'ចុចលើវិស័យដើម្បីត្រងបញ្ជីសេវា' : 'Click pillar to filter services' }}
          </span>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          <div
            v-for="pillar in lifeEventPillars"
            :key="pillar.id"
            @click="selectPillar(pillar)"
            :class="[
              'p-3 sm:p-5 rounded-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between relative active:scale-[0.98]',
              activePillarId === pillar.id
                ? 'bg-white border-2 border-[#0D47A1] ring-2 ring-[#0D47A1]/15 shadow-md'
                : 'bg-white border border-slate-200/90 hover:border-blue-300 shadow-xs hover:shadow-md'
            ]"
          >
            <div>
              <!-- Top Row: Icon + Badge -->
              <div class="flex items-center justify-between gap-1.5 mb-2 sm:mb-2.5">
                <div :class="['w-8 h-8 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center font-bold text-white shadow-sm bg-gradient-to-br', pillar.gradient]">
                  <component :is="pillar.icon" class="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span
                  v-if="activePillarId === pillar.id"
                  class="px-1.5 py-0.5 rounded-md bg-[#0D47A1] text-white text-[9px] font-black shrink-0"
                >
                  {{ currentLanguage === 'kh' ? 'សកម្ម' : 'Active' }}
                </span>
                <span
                  v-else
                  :class="['px-1.5 py-0.5 rounded-md text-[9px] font-bold shrink-0 truncate max-w-[85px] sm:max-w-none', pillar.tagBg]"
                >
                  {{ currentLanguage === 'kh' ? pillar.badgeKh : pillar.name }}
                </span>
              </div>

              <!-- Title -->
              <h3 :class="['font-black text-xs sm:text-sm leading-snug', activePillarId === pillar.id ? 'text-[#0D47A1]' : 'text-slate-900']">
                {{ currentLanguage === 'kh' ? pillar.nameKh : pillar.name }}
              </h3>

              <!-- Clean items tags (no broken compound words across lines!) -->
              <div class="mt-2 flex flex-wrap gap-1">
                <span
                  v-for="(item, i) in pillar.items"
                  :key="i"
                  class="inline-block px-1.5 py-0.5 rounded bg-slate-100/90 text-slate-600 text-[9px] sm:text-[10px] font-medium leading-tight shrink-0"
                >
                  {{ item }}
                </span>
              </div>
            </div>

            <!-- Bottom Action -->
            <div class="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-black text-[#0D47A1]">
              <span>{{ activePillarId === pillar.id ? (currentLanguage === 'kh' ? 'កំពុងមើល' : 'Viewing') : (currentLanguage === 'kh' ? 'មើលសេវា' : 'View Services') }}</span>
              <ArrowRight class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           4. STANDARD 4-STEP CITIZEN PROCEDURE (នីតិវិធី ៤ ជំហាន)
           ============================================================ -->
      <section class="rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
        <div class="space-y-1">
          <span class="text-xs font-black text-[#0D47A1] uppercase tracking-wider">នីតិវិធីស្តង់ដារជាតិ</span>
          <h2 class="text-lg sm:text-xl font-black text-slate-900">៤ ជំហានងាយៗក្នុងការស្នើសុំសេវារដ្ឋបាលសាធារណៈ</h2>
          <p class="text-xs text-slate-500">ការណែនាំពីរបៀបរៀបចំ និងដាក់ពាក្យស្នើសុំប្រកបដោយទំនុកចិត្ត និងតម្លាភាព</p>
        </div>

        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div
            v-for="st in standardSteps"
            :key="st.step"
            class="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 sm:space-y-2 relative"
          >
            <div class="flex items-center justify-between">
              <span class="text-xl sm:text-2xl font-mono font-black text-[#0D47A1]/80">{{ st.step }}</span>
              <span class="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-blue-100 text-[#0D47A1] flex items-center justify-center font-bold text-[10px] sm:text-xs">✓</span>
            </div>
            <h4 class="font-black text-xs sm:text-sm text-slate-900">{{ st.titleKh }}</h4>
            <p class="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 sm:line-clamp-none">{{ st.descKh }}</p>
          </div>
        </div>
      </section>

      <!-- ============================================================
           5. OFFICIAL SERVICES DIRECTORY (GRID OF CIVIC SERVICES)
           ============================================================ -->
      <div id="services-grid-section" class="space-y-6 scroll-mt-24">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200">
          <div>
            <div class="flex items-center gap-2">
              <h2 class="text-xl sm:text-2xl font-black text-slate-900">
                {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈផ្លូវការ' : 'Official Public Services' }}
              </h2>
              <span class="px-3 py-0.5 rounded-full bg-blue-50 text-[#0D47A1] font-black text-xs border border-blue-200">
                {{ filteredServices.length }} សេវា
              </span>
            </div>
            <p class="text-xs text-slate-500 mt-0.5">
              ជ្រើសរើសសេវាដើម្បីពិនិត្យមើលលក្ខខណ្ឌតម្រូវ នីតិវិធីមួយជំហានម្តងៗ និងទាញយកទម្រង់ពាក្យ
            </p>
          </div>

          <div class="flex items-center gap-2">
            <button
              v-if="searchQuery || activeCategory !== 'All'"
              @click="resetFilters"
              class="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              type="button"
            >
              <RotateCcw class="w-3.5 h-3.5" />
              <span>កំណត់ឡើងវិញ</span>
            </button>

            <button
              @click="isCompareOpen = true"
              class="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
              type="button"
            >
              <GitCompare class="w-3.5 h-3.5 text-[#0D47A1]" />
              <span>ប្រៀបធៀបសេវា</span>
            </button>

            <button
              @click="resetFilters"
              class="px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-black transition-all cursor-pointer flex items-center gap-1 shadow-xs"
              type="button"
            >
              <span>មើលទាំងអស់</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- 4-Column Professional Clean Grid -->
        <div v-if="filteredServices.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          <router-link
            v-for="service in filteredServices"
            :key="service.id"
            :to="'/government/' + service.id"
            class="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <!-- Document Photo Banner -->
              <div class="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-100">
                <img
                  :src="service.image"
                  :alt="localized(service.title, service.titleKh)"
                  @error="($event.target as HTMLImageElement).src = '/images/pillars/government.jpg'"
                  class="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

                <!-- Badge -->
                <span
                  v-if="popularItemsMeta[service.id]"
                  :class="['absolute top-2 right-2 sm:top-3 sm:right-3 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-[9px] sm:text-[10px] font-black border uppercase shadow-xs backdrop-blur-md', popularItemsMeta[service.id].badgeColor]"
                >
                  {{ currentLanguage === 'kh' ? popularItemsMeta[service.id].badgeKh : popularItemsMeta[service.id].badge }}
                </span>

                <!-- Category -->
                <span class="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold bg-slate-900/85 text-white backdrop-blur-md">
                  {{ service.category }}
                </span>
              </div>

              <!-- Content -->
              <div class="p-3 sm:p-5 space-y-1.5 sm:space-y-2.5">
                <span class="text-[9px] sm:text-[10px] font-bold text-blue-700 block truncate">
                  {{ popularItemsMeta[service.id]?.ministryKh || 'រាជរដ្ឋាភិបាលកម្ពុជា' }}
                </span>

                <h3 class="text-xs sm:text-base font-black text-slate-900 group-hover:text-[#0D47A1] transition-colors leading-snug line-clamp-2 min-h-[2rem]">
                  {{ service.titleKh }}
                </h3>

                <p class="text-[11px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2 hidden sm:block">
                  {{ localized(service.description, service.descriptionKh) }}
                </p>

                <!-- Micro Checklist Tag -->
                <div class="pt-1.5 sm:pt-2 flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-600 font-bold">
                  <FileText class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0D47A1] shrink-0" />
                  <span class="truncate">តម្រូវ {{ popularItemsMeta[service.id]?.docsCount || 4 }} ឯកសារ</span>
                </div>
              </div>
            </div>

            <!-- Footer Details -->
            <div class="px-3 pb-3 sm:px-5 sm:pb-5 pt-0">
              <div class="pt-2 sm:pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs font-bold gap-1">
                <span class="flex items-center gap-1 text-slate-500 truncate">
                  <Clock class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#0D47A1] shrink-0" />
                  <span class="truncate">{{ currentLanguage === 'kh' ? (popularItemsMeta[service.id]?.daysKh || localized(service.processingTime, service.processingTimeKh)) : (popularItemsMeta[service.id]?.days || service.processingTime) }}</span>
                </span>

                <span class="w-fit px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-emerald-50 text-emerald-700 font-black border border-emerald-200 text-[10px] sm:text-xs">
                  {{ currentLanguage === 'kh' ? (popularItemsMeta[service.id]?.priceKh || localized(service.fee, service.feeKh)) : (popularItemsMeta[service.id]?.price || service.fee) }}
                </span>
              </div>

              <div class="mt-2 sm:mt-3 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#0D47A1] group-hover:translate-x-1 transition-transform">
                <span>{{ currentLanguage === 'kh' ? 'មើលមគ្គុទ្ទេសក៍' : 'View Guide' }}</span>
                <ArrowRight class="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </div>
            </div>
          </router-link>
        </div>

        <!-- Empty State -->
        <div v-else class="bg-white rounded-3xl border border-slate-200 p-8 text-center">
          <EmptyState
            :title="t('government.emptyTitle')"
            :subtitle="t('government.emptySubtitle')"
            :action-label="t('government.resetSearch')"
            @action="resetFilters"
          />
        </div>
      </div>

      <!-- ============================================================
           6. PROVINCIAL OWSO DIRECTORY (ច្រកចេញចូលតែមួយតាមខេត្ត)
           ============================================================ -->
      <section class="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div class="space-y-1">
            <div class="inline-flex items-center gap-1.5 text-xs font-black text-[#0D47A1] uppercase">
              <Building2 class="w-4 h-4 text-[#0D47A1]" />
              <span>ការិយាល័យច្រកចេញចូលតែមួយ (OWSO)</span>
            </div>
            <h2 class="text-base sm:text-lg font-black text-slate-900">
              ទីតាំងផ្តល់សេវារដ្ឋបាលសាធារណៈប្រចាំ {{ selectedProvince.nameKh }}
            </h2>
          </div>

          <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] border border-blue-200 font-bold text-xs">
            <MapPin class="w-3.5 h-3.5 text-emerald-600" />
            <span>{{ currentLanguage === 'kh' ? selectedProvince.nameKh : selectedProvince.name }}</span>
          </div>
        </div>

        <div class="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div class="space-y-1.5">
            <div class="flex items-center gap-2">
              <h4 class="font-black text-sm text-slate-900">
                ការិយាល័យច្រកចេញចូលតែមួយ រដ្ឋបាល{{ selectedProvince.nameKh }}
              </h4>
              <span class="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-black">
                បើកបម្រើសេវា
              </span>
            </div>
            <p class="text-xs text-slate-600 flex items-center gap-1.5">
              <MapPin class="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>សាលារាជធានី-ខេត្ត {{ selectedProvince.nameKh }} (ច័ន្ទ ដល់ សុក្រ ៧:៣០-១១:៣០ / ១៤:០០-១៧:០០)</span>
            </p>
            <p class="text-xs text-slate-500">
              ទូរស័ព្ទទាន់ហេតុការណ៍ និងព័ត៌មានសេវា៖ <strong class="text-[#0D47A1] font-mono">1222</strong> (ឥតគិតថ្លៃ)
            </p>
          </div>

          <a
            :href="'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('One Window Service Office ' + selectedProvince.name)"
            target="_blank"
            rel="noopener noreferrer"
            class="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <MapPin class="w-3.5 h-3.5" />
            <span>មើលទីតាំងលើ Google Maps</span>
          </a>
        </div>
      </section>

      <!-- ============================================================
           7. OFFICIAL DOWNLOADABLE FORMS (ទម្រង់ពាក្យស្នើសុំផ្លូវការ)
           ============================================================ -->
      <section class="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div class="space-y-1 pb-3 border-b border-slate-100">
          <span class="text-xs font-black text-[#0D47A1] uppercase tracking-wider">ឯកសារ & ទម្រង់បែបបទ</span>
          <h2 class="text-base sm:text-lg font-black text-slate-900">ទាញយកទម្រង់ពាក្យស្នើសុំផ្លូវការ (PDF Forms)</h2>
          <p class="text-xs text-slate-500">ទាញយកឯកសារគំរូផ្លូវការ ដើម្បីបំពេញព័ត៌មានមុនពេលទៅកាន់ការិយាល័យច្រកចេញចូលតែមួយ</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div
            v-for="form in officialForms"
            :key="form.id"
            class="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex items-center justify-between gap-3 hover:border-blue-300 transition-colors"
          >
            <div class="space-y-1 min-w-0">
              <span class="text-[10px] font-black uppercase text-blue-700">{{ form.departmentKh }}</span>
              <h4 class="font-black text-xs text-slate-900 truncate" :title="form.titleKh">{{ form.titleKh }}</h4>
              <p class="text-[11px] text-slate-400 font-mono">{{ form.format }} • {{ form.size }}</p>
            </div>

            <button
              @click="triggerDownload(form.id)"
              class="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-blue-600 hover:text-blue-600 text-slate-700 text-xs font-black transition-all shadow-2xs flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Check v-if="downloadedFormId === form.id" class="w-3.5 h-3.5 text-emerald-600" />
              <Download v-else class="w-3.5 h-3.5" />
              <span>{{ downloadedFormId === form.id ? 'បានទាញយក' : 'ទាញយក' }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- ============================================================
           8. FREQUENTLY ASKED QUESTIONS (FAQ ACCORDION)
           ============================================================ -->
      <section class="rounded-3xl bg-white border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
        <div class="space-y-1 pb-3 border-b border-slate-100">
          <div class="inline-flex items-center gap-1.5 text-xs font-black text-[#0D47A1] uppercase">
            <HelpCircle class="w-4 h-4 text-[#0D47A1]" />
            <span>សំណួរ និងចម្លើយញឹកញាប់</span>
          </div>
          <h2 class="text-base sm:text-lg font-black text-slate-900">
            ចម្ងល់ទូទៅអំពីសេវារដ្ឋបាលសាធារណៈ
          </h2>
        </div>

        <div class="space-y-3">
          <div
            v-for="(faq, fIdx) in governmentFaqs"
            :key="fIdx"
            class="rounded-2xl border border-slate-200 overflow-hidden"
          >
            <button
              @click="toggleFaq(fIdx)"
              class="w-full p-4 text-left flex items-center justify-between gap-3 bg-white hover:bg-slate-50 transition-colors font-black text-xs sm:text-sm text-slate-900 cursor-pointer"
            >
              <span>{{ faq.questionKh }}</span>
              <ChevronDown :class="['w-4 h-4 text-slate-400 transition-transform shrink-0', expandedFaq === fIdx ? 'rotate-180 text-blue-600' : '']" />
            </button>
            <div v-if="expandedFaq === fIdx" class="px-4 pb-4 pt-1 bg-slate-50/50 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
              {{ faq.answerKh }}
            </div>
          </div>
        </div>
      </section>

    </div>

    <!-- Service Compare Modal -->
    <ServiceCompareModal
      :is-open="isCompareOpen"
      :available-services="allServices"
      @close="isCompareOpen = false"
    />
  </div>
</template>
