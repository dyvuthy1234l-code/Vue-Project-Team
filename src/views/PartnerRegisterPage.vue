<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  Building2,
  Hospital as HospitalIcon,
  Stethoscope,
  Pill,
  Wrench,
  CheckCircle2,
  AlertCircle,
  Send,
  Phone,
  Mail,
  User,
  Sparkles,
  Lock,
  ShieldCheck,
  ArrowRight,
  Clock,
  FileCheck,
  LayoutDashboard,
  Briefcase,
  Bus,
  Ambulance,
  Globe
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useAuth } from '@/composables/useAuth'
import { usePartnerSubmissions } from '@/composables/usePartnerSubmissions'
import { usePageMeta } from '@/composables/usePageMeta'
import type { PartnerSubmission, PartnerFacilityType } from '@/types'

const route = useRoute()
const { currentLanguage } = useLanguage()
const { currentUser, isLoggedIn, openLogin, openRegister, logout } = useAuth()
const { submitApplication } = usePartnerSubmissions()

usePageMeta({
  title: 'ចុះឈ្មោះជាដៃគូសេវា និងស្ថាប័ន — CamLife Partner Registration',
  description: 'ដាក់ពាក្យស្នើសុំចុះបញ្ជីមន្ទីរពេទ្យ គ្លីនិក ឱសថស្ថាន សេវាជាង ក្រុមហ៊ុនការងារ រថយន្តក្រុង ឬរថយន្តសង្គ្រោះបន្ទាន់'
})

const provinces = [
  'Phnom Penh',
  'Kandal',
  'Siem Reap',
  'Battambang',
  'Kampong Cham',
  'Preah Sihanouk',
  'Kampot',
  'Kep',
  'Kampong Thom',
  'Kampong Chhnang',
  'Kampong Speu',
  'Takeo',
  'Prey Veng',
  'Svay Rieng',
  'Pursat',
  'Banteay Meanchey',
  'Oddar Meanchey',
  'Preah Vihear',
  'Stung Treng',
  'Kratie',
  'Ratanakiri',
  'Mondulkiri',
  'Koh Kong',
  'Pailin',
  'Tboung Khmum'
]

const provinceNamesKh: Record<string, string> = {
  'Phnom Penh': 'រាជធានីភ្នំពេញ',
  'Kandal': 'ខេត្តកណ្តាល',
  'Siem Reap': 'ខេត្តសៀមរាប',
  'Battambang': 'ខេត្តបាត់ដំបង',
  'Kampong Cham': 'ខេត្តកំពង់ចាម',
  'Preah Sihanouk': 'ខេត្តព្រះសីហនុ',
  'Kampot': 'ខេត្តកំពត',
  'Kep': 'ខេត្តកែប',
  'Kampong Thom': 'ខេត្តកំពង់ធំ',
  'Kampong Chhnang': 'ខេត្តកំពង់ឆ្នាំង',
  'Kampong Speu': 'ខេត្តកំពង់ស្ពឺ',
  'Takeo': 'ខេត្តតាកែវ',
  'Prey Veng': 'ខេត្តព្រៃវែង',
  'Svay Rieng': 'ខេត្តស្វាយរៀង',
  'Pursat': 'ខេត្តពោធិ៍សាត់',
  'Banteay Meanchey': 'ខេត្តបន្ទាយមានជ័យ',
  'Oddar Meanchey': 'ខេត្តឧត្តរមានជ័យ',
  'Preah Vihear': 'ខេត្តព្រះវិហារ',
  'Stung Treng': 'ខេត្តស្ទឹងត្រែង',
  'Kratie': 'ខេត្តក្រចេះ',
  'Ratanakiri': 'ខេត្តរតនគិរី',
  'Mondulkiri': 'ខេត្តមណ្ឌលគិរី',
  'Koh Kong': 'ខេត្តកោះកុង',
  'Pailin': 'ខេត្តប៉ៃលិន',
  'Tboung Khmum': 'ខេត្តត្បូងឃ្មុំ'
}

const homeServiceCategories = [
  { value: 'Electrician', labelKh: 'ជាងភ្លើង & ខ្សែកាប' },
  { value: 'AC Repair', labelKh: 'ជាងម៉ាស៊ីនត្រជាក់' },
  { value: 'Plumber', labelKh: 'ជាងទុយោទឹក & បូមលូ' },
  { value: 'Cleaning', labelKh: 'សេវាសម្អាតគេហដ្ឋាន' },
  { value: 'Painting', labelKh: 'ជាងលាបថ្នាំផ្ទះ' },
  { value: 'Handyman', labelKh: 'ជាងជួសជុលទូទៅ' }
]

const industrySectors = [
  { value: 'Information Technology', labelKh: 'បច្ចេកវិទ្យា & IT' },
  { value: 'Banking & Finance', labelKh: 'ធនាគារ & ហិរញ្ញវត្ថុ' },
  { value: 'Hospitality & Tourism', labelKh: 'បដិសណ្ឋារកិច្ច & ទេសចរណ៍' },
  { value: 'Manufacturing & Garment', labelKh: 'រោងចក្រ & កាត់ដេរ' },
  { value: 'Construction & Real Estate', labelKh: 'សំណង់ & អចលនទ្រព្យ' },
  { value: 'Education & Training', labelKh: 'អប់រំ & បណ្តុះបណ្តាល' },
  { value: 'Healthcare & Wellness', labelKh: 'សុខាភិបាល & ឱសថ' },
  { value: 'Retail & Wholesale', labelKh: 'លក់រាយ & លក់ដុំ' },
  { value: 'Logistics & Transport', labelKh: 'ភស្តុភារ & ដឹកជញ្ជូន' },
  { value: 'Other', labelKh: 'វិស័យផ្សេងៗ' }
]

const facilityTypes: { value: PartnerFacilityType; labelKh: string; labelEn: string; icon: any; descKh: string; group: number }[] = [
  // Group 1: Service & Business Listing
  {
    value: 'hospital',
    labelKh: 'មន្ទីរពេទ្យ',
    labelEn: 'Hospital',
    icon: HospitalIcon,
    descKh: 'មន្ទីរពេទ្យរដ្ឋ ឬឯកជនទូទៅ',
    group: 1
  },
  {
    value: 'clinic',
    labelKh: 'គ្លីនិកឯកទេស',
    labelEn: 'Specialist Clinic',
    icon: Stethoscope,
    descKh: 'គ្លីនិកពិគ្រោះ និងព្យាបាលជំងឺ',
    group: 1
  },
  {
    value: 'pharmacy',
    labelKh: 'ឱសថស្ថាន',
    labelEn: 'Pharmacy',
    icon: Pill,
    descKh: 'ឱសថស្ថានមានអាជ្ញាបណ្ណត្រឹមត្រូវ',
    group: 1
  },
  {
    value: 'home-service',
    labelKh: 'សេវាជាង & គេហដ្ឋាន',
    labelEn: 'Home Service',
    icon: Wrench,
    descKh: 'ជាងភ្លើង ទឹក ម៉ាស៊ីនត្រជាក់ សម្អាត',
    group: 1
  },
  {
    value: 'employer',
    labelKh: 'ក្រុមហ៊ុន / និយោជក',
    labelEn: 'Company / Employer',
    icon: Briefcase,
    descKh: 'ចុះបញ្ជីក្រុមហ៊ុន និងដាក់ផ្សាយការងារ',
    group: 1
  },
  // Group 2: B2B Operator Partnerships
  {
    value: 'transport',
    labelKh: 'ក្រុមហ៊ុនដឹកជញ្ជូន',
    labelEn: 'Transport & Bus',
    icon: Bus,
    descKh: 'រថយន្តក្រុង VIP តាក់ស៊ី ឬសេវាដឹកជញ្ជូន',
    group: 2
  },
  {
    value: 'emergency-ambulance',
    labelKh: 'រថយន្តសង្គ្រោះបន្ទាន់',
    labelEn: 'Ambulance Service',
    icon: Ambulance,
    descKh: 'សេវារថយន្តសង្គ្រោះ និង ICU ចល័ត',
    group: 2
  }
]

const form = reactive({
  facilityType: 'hospital' as PartnerFacilityType,
  nameKh: '',
  nameEn: '',
  category: 'General Healthcare',
  location: 'Phnom Penh',
  addressKh: '',
  address: '',
  phone: '',
  email: '',
  openingHours: '24/7',
  licenseNumber: '',
  representativeName: '',
  representativeRole: '',
  descriptionKh: '',
  descriptionEn: '',
  servicesInput: '',
  acceptsNssf: true,
  website: '',
  fleetSize: '',
  routesInput: '',
  industrySector: 'Information Technology',
  agreement: false
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)
const lastSubmission = ref<PartnerSubmission | null>(null)

// Initialize query parameter if present
onMounted(() => {
  const queryType = route.query.type as string
  if (
    queryType &&
    ['hospital', 'clinic', 'pharmacy', 'home-service', 'employer', 'transport', 'emergency-ambulance'].includes(queryType)
  ) {
    selectType(queryType as PartnerFacilityType)
  }

  // Pre-fill user data if logged in
  prefillUser()
})

// Reactively prefill when user logs in
watch(currentUser, () => {
  prefillUser()
})

function prefillUser() {
  if (currentUser.value) {
    if (!form.representativeName) {
      form.representativeName = currentUser.value.name || ''
    }
    if (!form.email && currentUser.value.email) {
      form.email = currentUser.value.email
    }
    if (!form.phone && currentUser.value.phone) {
      form.phone = currentUser.value.phone
    }
    if (!form.representativeRole) {
      if (form.facilityType === 'home-service') form.representativeRole = 'ម្ចាស់អាជីវកម្ម'
      else if (form.facilityType === 'employer') form.representativeRole = 'ប្រធានផ្នែកធនធានមនុស្ស (HR)'
      else if (form.facilityType === 'transport') form.representativeRole = 'ប្រធានប្រតិបត្តិការដឹកជញ្ជូន'
      else if (form.facilityType === 'emergency-ambulance') form.representativeRole = 'ប្រធានក្រុមសង្គ្រោះបន្ទាន់'
      else if (form.facilityType === 'pharmacy') form.representativeRole = 'ឱសថការី / ម្ចាស់ឱសថស្ថាន'
      else if (form.facilityType === 'clinic') form.representativeRole = 'ប្រធានគ្លីនិក'
      else form.representativeRole = 'ប្រធានផ្នែករដ្ឋបាល'
    }
  }
}

function selectType(type: PartnerFacilityType) {
  form.facilityType = type
  if (type === 'home-service') {
    form.category = 'AC Repair'
    form.openingHours = '08:00 - 18:00'
    form.representativeRole = 'ម្ចាស់អាជីវកម្ម'
    form.acceptsNssf = false
  } else if (type === 'pharmacy') {
    form.category = 'Pharmacy'
    form.openingHours = '07:00 - 21:00'
    form.representativeRole = 'ឱសថការី / ម្ចាស់ឱសថស្ថាន'
    form.acceptsNssf = false
  } else if (type === 'clinic') {
    form.category = 'Clinic'
    form.openingHours = '08:00 - 20:00'
    form.representativeRole = 'ប្រធានគ្លីនិក'
    form.acceptsNssf = true
  } else if (type === 'employer') {
    form.category = 'Enterprise'
    form.openingHours = '08:00 - 17:00'
    form.representativeRole = 'ប្រធានផ្នែកធនធានមនុស្ស (HR)'
    form.acceptsNssf = true
  } else if (type === 'transport') {
    form.category = 'Transit Operator'
    form.openingHours = '05:30 - 21:00'
    form.representativeRole = 'ប្រធានប្រតិបត្តិការដឹកជញ្ជូន'
    form.acceptsNssf = false
  } else if (type === 'emergency-ambulance') {
    form.category = 'Ambulance Dispatch'
    form.openingHours = '24/7'
    form.representativeRole = 'ប្រធានក្រុមសង្គ្រោះបន្ទាន់'
    form.acceptsNssf = true
  } else {
    form.category = 'Hospital'
    form.openingHours = '24/7'
    form.representativeRole = 'ប្រធានផ្នែករដ្ឋបាល'
    form.acceptsNssf = true
  }
}

function handleSubmit() {
  errorMessage.value = ''

  if (!isLoggedIn()) {
    openLogin()
    return
  }

  if (!form.nameKh.trim() || !form.nameEn.trim()) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលឈ្មោះស្ថាប័នជាភាសាខ្មែរ និងអង់គ្លេស' : 'Please enter facility name in both Khmer and English.'
    return
  }

  if (!form.phone.trim()) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលលេខទូរស័ព្ទទំនាក់ទំនង' : 'Please enter contact phone number.'
    return
  }

  if (!form.licenseNumber.trim()) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលលេខអាជ្ញាបណ្ណ ឬលិខិតអនុញ្ញាតស្របច្បាប់' : 'Please provide operating license or registration number.'
    return
  }

  if (!form.representativeName.trim()) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលឈ្មោះអ្នកតំណាង ឬអ្នកដាក់ពាក្យ' : 'Please provide representative name.'
    return
  }

  if (!form.agreement) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ជាក់ការយល់ព្រមលើភាពត្រឹមត្រូវនៃព័ត៌មាន' : 'Please confirm that the submitted information is accurate.'
    return
  }

  isSubmitting.value = true

  setTimeout(() => {
    const servicesList = form.servicesInput
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)

    const routesList = form.routesInput
      ? form.routesInput.split(',').map(r => r.trim()).filter(r => r.length > 0)
      : undefined

    const submission = submitApplication({
      facilityType: form.facilityType,
      nameKh: form.nameKh.trim(),
      nameEn: form.nameEn.trim(),
      category: form.facilityType === 'home-service'
        ? form.category
        : form.facilityType === 'employer'
          ? (form.industrySector || 'Enterprise')
          : form.facilityType,
      location: form.location,
      addressKh: form.addressKh.trim() || form.address.trim(),
      address: form.address.trim() || form.addressKh.trim(),
      phone: form.phone.trim(),
      email: form.email.trim() || undefined,
      openingHours: form.openingHours.trim() || '24/7',
      licenseNumber: form.licenseNumber.trim(),
      representativeName: form.representativeName.trim(),
      representativeRole: form.representativeRole.trim() || 'Representative',
      descriptionKh: form.descriptionKh.trim() || form.nameKh.trim(),
      descriptionEn: form.descriptionEn.trim() || form.nameEn.trim(),
      services: servicesList.length > 0 ? servicesList : ['General Services'],
      acceptsNssf: ['hospital', 'clinic', 'emergency-ambulance', 'employer'].includes(form.facilityType) ? form.acceptsNssf : false,
      website: form.website.trim() || undefined,
      fleetSize: form.fleetSize.trim() || undefined,
      routes: routesList,
      industrySector: form.facilityType === 'employer' ? form.industrySector : undefined
    })

    isSubmitting.value = false
    lastSubmission.value = submission
    isSuccess.value = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, 600)
}

function resetFormForNew() {
  isSuccess.value = false
  errorMessage.value = ''
  form.nameKh = ''
  form.nameEn = ''
  form.addressKh = ''
  form.address = ''
  form.licenseNumber = ''
  form.descriptionKh = ''
  form.descriptionEn = ''
  form.servicesInput = ''
  form.website = ''
  form.fleetSize = ''
  form.routesInput = ''
  form.industrySector = 'Information Technology'
  form.agreement = false
  prefillUser()
}
</script>

<template>
  <div class="min-h-screen bg-slate-50/60 dark:bg-[#070E1A] py-8 sm:py-12 font-khmer">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

      <!-- ============================================================
           HERO BANNER
      ============================================================= -->
      <section class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#061838] via-[#0A2E6E] to-[#0A3D62] text-white p-6 sm:p-10 shadow-2xl border border-blue-900/30">
        <!-- Ambient Glow Orbs -->
        <div class="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div class="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-blue-500/25 blur-3xl" />

        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="space-y-3 max-w-2xl">
            <!-- Badge -->
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <span class="relative flex h-2 w-2 shrink-0">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <Sparkles class="w-3.5 h-3.5 text-amber-300" />
              <span>{{ currentLanguage === 'kh' ? 'ថ្នាលចុះបញ្ជីដៃគូផ្លូវការ • Official Partner Onboarding' : 'Official CamLife Partner Portal' }}</span>
            </div>

            <!-- Title -->
            <h1 class="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-teal-200">
                {{ currentLanguage === 'kh' ? 'ចុះឈ្មោះជាដៃគូសេវា ឬមន្ទីរពេទ្យ' : 'Register as a Service or Medical Partner' }}
              </span>
            </h1>

            <p class="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? 'រួមគ្នាកសាងបណ្តាញសុខាភិបាល សេវាកម្មរដ្ឋបាល និងជាងជំនាញស្របច្បាប់ជូនប្រជាពលរដ្ឋកម្ពុជា ២៥ រាជធានី-ខេត្ត ដោយតម្លាភាព និងទំនុកចិត្តខ្ពស់។'
                : 'Join Cambodia’s official verified public network for hospitals, clinics, pharmacies, and professional home technicians.'
              }}
            </p>
          </div>

          <!-- Quick Benefits Card -->
          <div class="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2.5 shrink-0 text-xs font-bold text-white">
            <div class="flex items-center gap-2 text-emerald-300">
              <CheckCircle2 class="w-4 h-4 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'ចុះបញ្ជីដោយឥតគិតថ្លៃ ១០០%' : '100% Free Registration' }}</span>
            </div>
            <div class="flex items-center gap-2 text-blue-200">
              <ShieldCheck class="w-4 h-4 text-amber-300 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'ផ្លាកសញ្ញាបញ្ជាក់ភាពស្របច្បាប់' : 'Verified Partner Badge' }}</span>
            </div>
            <div class="flex items-center gap-2 text-teal-200">
              <Building2 class="w-4 h-4 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'បង្ហាញលើ Live Directory ២៥ ខេត្ត-ក្រុង' : 'Listed in 25 Provinces' }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           CASE 1: SUCCESS STATE AFTER SUBMISSION
      ============================================================= -->
      <section v-if="isSuccess && lastSubmission" class="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-700 shadow-xl text-center space-y-6 animate-in fade-in">
        <div class="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-500/30 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 class="w-10 h-10" />
        </div>

        <div class="max-w-md mx-auto space-y-2">
          <h2 class="text-2xl font-black text-slate-900 dark:text-white">
            {{ currentLanguage === 'kh' ? 'ពាក្យស្នើសុំត្រូវបានបញ្ជូនដោយជោគជ័យ!' : 'Application Submitted Successfully!' }}
          </h2>
          <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {{ currentLanguage === 'kh'
              ? 'អរគុណសម្រាប់ការដាក់ពាក្យ។ ក្រុមការងាររដ្ឋបាល CamLife នឹងធ្វើការផ្ទៀងផ្ទាត់ឯកសារអាជ្ញាបណ្ណ និងទាក់ទងមកលោកអ្នកវិញក្នុងរយៈពេល ២៤ ទៅ ៤៨ ម៉ោង។'
              : 'Thank you for your application. The CamLife administrative team will verify your credentials and update you within 24-48 hours.'
            }}
          </p>
        </div>

        <!-- Receipt Card -->
        <div class="max-w-lg mx-auto bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 text-left space-y-3 text-xs">
          <div class="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-700 font-bold">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'លេខកូដសំណើ៖' : 'Application Ref:' }}</span>
            <span class="font-mono text-emerald-600 dark:text-emerald-400 font-black">#{{ lastSubmission.id }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'ឈ្មោះស្ថាប័ន៖' : 'Facility Name:' }}</span>
            <span class="font-bold">{{ lastSubmission.nameKh }} ({{ lastSubmission.nameEn }})</span>
          </div>
          <div class="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'រាជធានី-ខេត្ត៖' : 'Province:' }}</span>
            <span class="font-bold">{{ provinceNamesKh[lastSubmission.location] || lastSubmission.location }}</span>
          </div>
          <div class="flex justify-between items-center text-slate-700 dark:text-slate-300">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'ស្ថានភាព៖' : 'Status:' }}</span>
            <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800">
              {{ currentLanguage === 'kh' ? 'កំពុងរង់ចាំការត្រួតពិនិត្យ (Pending)' : 'Under Review' }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            @click="resetFormForNew"
            type="button"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? '+ ដាក់ពាក្យស្ថាប័នផ្សេងទៀត' : '+ Submit Another Facility' }}
          </button>
          <router-link
            to="/"
            class="px-6 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white font-black text-xs shadow-md transition-colors"
          >
            {{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅទំព័រដើម' : 'Back to Home' }}
          </router-link>
          <router-link
            v-if="currentUser && (currentUser.role === 'Administrator' || currentUser.role === 'Admin')"
            to="/admin"
            class="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs shadow-md transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'ទៅកាន់ផ្ទាំង Admin ដើម្បី Approve' : 'Go to Admin CMS' }}</span>
          </router-link>
        </div>
      </section>

      <!-- ============================================================
           CASE 2: AUTHENTICATION REQUIRED (LOGIN GATE CARD)
      ============================================================= -->
      <section v-else-if="!isLoggedIn()" class="bg-white dark:bg-slate-800 rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-700 shadow-xl text-center space-y-7 animate-in fade-in">
        <!-- Lock Icon with Glow -->
        <div class="relative w-20 h-20 mx-auto">
          <div class="absolute inset-0 rounded-3xl bg-blue-500/20 blur-xl"></div>
          <div class="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/40">
            <Lock class="w-9 h-9" />
          </div>
        </div>

        <div class="max-w-lg mx-auto space-y-3">
          <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
            <AlertCircle class="w-3.5 h-3.5 shrink-0" />
            <span>{{ currentLanguage === 'kh' ? 'តម្រូវឱ្យចូលគណនីជាមុន' : 'Authentication Required' }}</span>
          </div>

          <h2 class="text-xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {{ currentLanguage === 'kh' ? 'សូមចូលប្រើប្រាស់គណនី (Login) ដើម្បីចុះបញ្ជី' : 'Sign In to Apply for Partner Registration' }}
          </h2>

          <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {{ currentLanguage === 'kh'
              ? 'ដើម្បីធានាសុវត្ថិភាពទិន្នន័យ ភាពស្របច្បាប់នៃស្ថាប័ន និងងាយស្រួលក្នុងការតាមដានស្ថានភាពសំណើ សូមចូលប្រើប្រាស់គណនី CamLife របស់អ្នកជាមុនសិន។'
              : 'To verify partner legitimacy, safeguard operational data, and allow real-time status tracking, please sign in to your CamLife citizen account first.'
            }}
          </p>
        </div>

        <!-- Trust Highlights Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-2xl mx-auto text-left">
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div class="flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400">
              <ShieldCheck class="w-4 h-4 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'សុវត្ថិភាពខ្ពស់' : 'Data Integrity' }}</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ currentLanguage === 'kh' ? 'ទិន្នន័យត្រូវបានរក្សាទុកដោយសុវត្ថិភាព' : 'Encrypted & protected application data' }}
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div class="flex items-center gap-2 text-xs font-black text-emerald-600 dark:text-emerald-400">
              <User class="w-4 h-4 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'បំពេញស្វ័យប្រវត្តិ' : 'Auto Prefill' }}</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ currentLanguage === 'kh' ? 'បំពេញឈ្មោះ និងអ៊ីមែលអ្នកតំណាងភ្លាមៗ' : 'Auto fills contact & applicant profile' }}
            </p>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 space-y-1">
            <div class="flex items-center gap-2 text-xs font-black text-purple-600 dark:text-purple-400">
              <Clock class="w-4 h-4 shrink-0" />
              <span>{{ currentLanguage === 'kh' ? 'តាមដានស្ថានភាព' : 'Status Tracking' }}</span>
            </div>
            <p class="text-[11px] text-slate-500 dark:text-slate-400">
              {{ currentLanguage === 'kh' ? 'ដឹងភ្លាមៗនៅពេលសំណើត្រូវបានអនុម័ត' : 'Real-time approval notifications' }}
            </p>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
          <button
            @click="openLogin"
            type="button"
            class="w-full sm:w-auto px-7 py-3 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white font-black text-sm shadow-lg shadow-blue-900/30 transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{{ currentLanguage === 'kh' ? 'ចូលគណនី (Sign In)' : 'Sign In with Account' }}</span>
            <ArrowRight class="w-4 h-4" />
          </button>
          <button
            @click="openRegister"
            type="button"
            class="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-white font-bold text-sm transition-colors cursor-pointer"
          >
            <span>{{ currentLanguage === 'kh' ? 'ចុះឈ្មោះគណនីថ្មី (Register)' : 'Create New Account' }}</span>
          </button>
        </div>
      </section>

      <!-- ============================================================
           CASE 3: FULL REGISTRATION FORM (WHEN LOGGED IN)
      ============================================================= -->
      <section v-else class="space-y-6 animate-in fade-in">
        <!-- Active User Status Bar -->
        <div class="bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center font-bold shrink-0">
              {{ currentUser?.name.charAt(0).toUpperCase() }}
            </div>
            <div>
              <p class="font-bold text-slate-800 dark:text-white">
                {{ currentLanguage === 'kh' ? 'លោកអ្នកកំពុងដាក់ពាក្យក្នុងនាម៖' : 'Applying as:' }}
                <strong class="text-[#0D47A1] dark:text-blue-300 font-black">{{ currentUser?.name }}</strong>
                <span class="text-slate-500 font-normal"> ({{ currentUser?.email }})</span>
              </p>
              <p class="text-[11px] text-slate-500 dark:text-slate-400">
                {{ currentLanguage === 'kh' ? 'ព័ត៌មានទំនាក់ទំនងរបស់អ្នកនឹងត្រូវបានបំពេញដោយស្វ័យប្រវត្តិ។' : 'Your contact info has been automatically linked.' }}
              </p>
            </div>
          </div>
          <button
            @click="logout"
            type="button"
            class="self-start sm:self-auto text-[11px] font-bold text-slate-500 hover:text-rose-600 underline cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'ចាកចេញ / ប្តូរគណនី' : 'Sign Out / Switch' }}
          </button>
        </div>

        <!-- Main Form Container -->
        <form @submit.prevent="handleSubmit" class="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-700 shadow-xl space-y-8">

          <!-- STEP 1: FACILITY TYPE SELECTOR TABS -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {{ currentLanguage === 'kh' ? '១. ជ្រើសរើសប្រភេទស្ថាប័ន / សេវាកម្ម *' : '1. Select Facility Type *' }}
              </label>
              <span class="text-[11px] text-slate-400 font-medium">
                {{ currentLanguage === 'kh' ? 'សរុប ៧ ប្រភេទ (ក្រុមទី ១ & ក្រុមទី ២)' : '7 Registered Categories (Group 1 & 2)' }}
              </span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <button
                v-for="item in facilityTypes"
                :key="item.value"
                @click="selectType(item.value)"
                type="button"
                :class="[
                  'p-3.5 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-2',
                  form.facilityType === item.value
                    ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-xs'
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-white dark:bg-slate-800/60'
                ]"
              >
                <div class="flex items-center justify-between">
                  <div :class="['w-9 h-9 rounded-xl flex items-center justify-center', form.facilityType === item.value ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300']">
                    <component :is="item.icon" class="w-5 h-5" />
                  </div>
                  <span v-if="form.facilityType === item.value" class="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span v-else class="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                    G{{ item.group }}
                  </span>
                </div>
                <div>
                  <p class="text-xs font-black text-slate-900 dark:text-white leading-tight">
                    {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
                  </p>
                  <p class="text-[10px] text-slate-400 mt-0.5 line-clamp-1">
                    {{ item.descKh }}
                  </p>
                </div>
              </button>
            </div>
          </div>

          <!-- STEP 2: BASIC FACILITY DETAILS -->
          <div class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {{ currentLanguage === 'kh' ? '២. ព័ត៌មានស្ថាប័ន / អាជីវកម្ម' : '2. Facility Profile' }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Name Khmer -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ឈ្មោះជាភាសាខ្មែរ *' : 'Facility Name (Khmer) *' }}
                </label>
                <input
                  v-model="form.nameKh"
                  type="text"
                  required
                  :placeholder="
                    form.facilityType === 'home-service'
                      ? 'ឧ. ជាងភ្លើង និងម៉ាស៊ីនត្រជាក់ វណ្ណា'
                      : form.facilityType === 'employer'
                        ? 'ឧ. ក្រុមហ៊ុន តិចណូឡូជី ខេមបូឌា'
                        : form.facilityType === 'transport'
                          ? 'ឧ. ក្រុមហ៊ុនរថយន្តក្រុង អាស៊ាន អេចប្រេស'
                          : form.facilityType === 'emergency-ambulance'
                            ? 'ឧ. សេវារថយន្តសង្គ្រោះបន្ទាន់ ឡាយហ្វ៍ឃែរ'
                            : 'ឧ. មន្ទីរពេទ្យកាល់ម៉ែត'
                  "
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <!-- Name English -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ឈ្មោះជាអក្សរឡាតាំង (English) *' : 'Facility Name (English) *' }}
                </label>
                <input
                  v-model="form.nameEn"
                  type="text"
                  required
                  :placeholder="
                    form.facilityType === 'home-service'
                      ? 'e.g. Vanna AC & Electrical Service'
                      : form.facilityType === 'employer'
                        ? 'e.g. Forward Tech Solutions Co., Ltd.'
                        : form.facilityType === 'transport'
                          ? 'e.g. Asean Express Transit Co.'
                          : form.facilityType === 'emergency-ambulance'
                            ? 'e.g. LifeCare 24/7 Ambulance Service'
                            : 'e.g. Calmette Hospital'
                  "
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- Dynamic Category / Sector Row -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Home Service Specific Category -->
              <div v-if="form.facilityType === 'home-service'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ប្រភេទជំនាញសេវាកម្ម *' : 'Service Specialty *' }}
                </label>
                <select
                  v-model="form.category"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option v-for="cat in homeServiceCategories" :key="cat.value" :value="cat.value">
                    {{ currentLanguage === 'kh' ? cat.labelKh : cat.value }}
                  </option>
                </select>
              </div>

              <!-- Employer Specific Industry Sector -->
              <div v-else-if="form.facilityType === 'employer'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'វិស័យអាជីវកម្ម / ឧស្សាហកម្ម *' : 'Industry / Sector *' }}
                </label>
                <select
                  v-model="form.industrySector"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option v-for="sec in industrySectors" :key="sec.value" :value="sec.value">
                    {{ currentLanguage === 'kh' ? sec.labelKh : sec.value }}
                  </option>
                </select>
              </div>

              <!-- Transport Specific Fleet Size -->
              <div v-else-if="form.facilityType === 'transport'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ទំហំកងរថយន្ត / ចំនួនមធ្យោបាយ *' : 'Fleet Size / Vehicles *' }}
                </label>
                <input
                  v-model="form.fleetSize"
                  type="text"
                  :placeholder="currentLanguage === 'kh' ? 'ឧ. រថយន្តក្រុង VIP ២៥ គ្រឿង, តាក់ស៊ី ១០ គ្រឿង' : 'e.g. 25 VIP Buses, 10 Mini-vans'"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <!-- Emergency Ambulance Fleet & ICU Units -->
              <div v-else-if="form.facilityType === 'emergency-ambulance'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ចំនួនរថយន្តសង្គ្រោះ & សម្ភារៈ ICU *' : 'Ambulance Units & ICU Gear *' }}
                </label>
                <input
                  v-model="form.fleetSize"
                  type="text"
                  :placeholder="currentLanguage === 'kh' ? 'ឧ. រថយន្តសង្គ្រោះចល័ត ៦ គ្រឿង បំពាក់ឧបករណ៍ជំនួយដង្ហើម' : 'e.g. 6 Mobile ICU Ambulances with certified paramedics'"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <!-- Province / City -->
              <div :class="['home-service', 'employer', 'transport', 'emergency-ambulance'].includes(form.facilityType) ? '' : 'md:col-span-2'" class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'រាជធានី-ខេត្ត *' : 'Province / City *' }}
                </label>
                <select
                  v-model="form.location"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                >
                  <option v-for="prov in provinces" :key="prov" :value="prov">
                    {{ provinceNamesKh[prov] || prov }} ({{ prov }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Transport Routes Covered Field -->
            <div v-if="form.facilityType === 'transport'" class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ currentLanguage === 'kh' ? 'ខ្សែរត់ / ខេត្ត-ក្រុងដែលតភ្ជាប់ (ដាក់ក្បៀស [,] ដើម្បីញែក) *' : 'Transit Routes / Destinations Covered (Comma-separated) *' }}
              </label>
              <input
                v-model="form.routesInput"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ឧ. ភ្នំពេញ - សៀមរាប, ភ្នំពេញ - ព្រះសីហនុ, ភ្នំពេញ - បាត់ដំបង' : 'e.g. Phnom Penh - Siem Reap, Phnom Penh - Sihanoukville'"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <!-- Address -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ currentLanguage === 'kh' ? 'អាសយដ្ឋានលម្អិត (ផ្លូវ សង្កាត់/ឃុំ ខណ្ឌ/ស្រុក)' : 'Detailed Address' }}
              </label>
              <input
                v-model="form.addressKh"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ឧ. អគារលេខ ០៣ មហាវិថីព្រះមុនីវង្ស សង្កាត់ស្រះចក ខណ្ឌដូនពេញ' : 'e.g. #03 Monivong Blvd, Srah Chak, Daun Penh'"
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- STEP 3: CONTACT & OPERATIONAL DETAILS -->
          <div class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {{ currentLanguage === 'kh' ? '៣. ទំនាក់ទំនង & ម៉ោងបំពេញការងារ' : '3. Contact & Operations' }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- Phone -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{
                    form.facilityType === 'emergency-ambulance'
                      ? (currentLanguage === 'kh' ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់ ២៤/៧ *' : 'Emergency Hotline (24/7) *')
                      : (currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ / Hotline *' : 'Phone / Hotline *')
                  }}
                </label>
                <div class="relative">
                  <Phone class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="023 123 456 / 012 345 678"
                    class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <!-- Email -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'អ៊ីមែលផ្លូវការ (Email)' : 'Official Email' }}
                </label>
                <div class="relative">
                  <Mail class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="contact@company.com.kh"
                    class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <!-- Opening Hours -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ម៉ោងបំពេញការងារ' : 'Opening Hours' }}
                </label>
                <input
                  v-model="form.openingHours"
                  type="text"
                  placeholder="24/7 ឬ 08:00 - 18:00"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- Website / Online Portal (for Employer & Transport) -->
            <div v-if="['employer', 'transport'].includes(form.facilityType)" class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ currentLanguage === 'kh' ? 'គេហទំព័រផ្លូវការ ឬផេកទំនាក់ទំនង (Website / Link)' : 'Official Website / Portal' }}
              </label>
              <div class="relative">
                <Globe class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  v-model="form.website"
                  type="url"
                  placeholder="https://company.com.kh"
                  class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- NSSF Option (For healthcare, ambulance, and employers) -->
            <div v-if="['hospital', 'clinic', 'emergency-ambulance', 'employer'].includes(form.facilityType)" class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div class="space-y-0.5">
                <span class="text-xs font-bold text-slate-800 dark:text-white">
                  {{
                    form.facilityType === 'employer'
                      ? (currentLanguage === 'kh' ? 'ក្រុមហ៊ុនបានចុះបញ្ជី ប.ស.ស (NSSF) ជូនបុគ្គលិកស្របច្បាប់' : 'Company is accredited with NSSF for employee coverage')
                      : (currentLanguage === 'kh' ? 'ទទួលប័ណ្ណមូលនិធិសមធម៌ / ប.ស.ស (NSSF)' : 'Accepts NSSF Healthcare Coverage')
                  }}
                </span>
                <p class="text-[11px] text-slate-400">
                  {{
                    form.facilityType === 'employer'
                      ? (currentLanguage === 'kh' ? 'បង្ហាញផ្លាកសញ្ញាស្ថាប័នស្របច្បាប់លើការងារដែលបានដាក់ផ្សាយ' : 'Displays NSSF certified badge on posted job vacancies')
                      : (currentLanguage === 'kh' ? 'បើកដំណើរការជម្រើសនេះ ប្រសិនបើស្ថាប័នអ្នកមានកិច្ចព្រមព្រៀងជាមួយ ប.ស.ស' : 'Enable if your facility is accredited with NSSF')
                  }}
                </p>
              </div>
              <input
                v-model="form.acceptsNssf"
                type="checkbox"
                class="w-5 h-5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
            </div>

            <!-- Key Services / Positions / Features (Comma Separated) -->
            <div class="space-y-1.5">
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                {{
                  form.facilityType === 'employer'
                    ? (currentLanguage === 'kh' ? 'មុខតំណែង ឬជំនាញដែលត្រូវការជ្រើសរើស (ដាក់ក្បៀស [,] ដើម្បីញែក)' : 'Key Roles / Positions Hiring (Comma-separated)')
                    : form.facilityType === 'transport'
                      ? (currentLanguage === 'kh' ? 'សេវាកម្មដឹកជញ្ជូនដែលផ្តល់ជូន (ដាក់ក្បៀស [,] ដើម្បីញែក)' : 'Transport Services Offered (Comma-separated)')
                      : form.facilityType === 'emergency-ambulance'
                        ? (currentLanguage === 'kh' ? 'សេវាសង្គ្រោះបន្ទាន់ និងឧបករណ៍ចម្បងៗ (ដាក់ក្បៀស [,] ដើម្បីញែក)' : 'Emergency Services & Capabilities (Comma-separated)')
                        : (currentLanguage === 'kh' ? 'សេវាសំខាន់ៗដែលផ្តល់ជូន (ដាក់ក្បៀស [,] ដើម្បីញែក)' : 'Services Offered (Comma-separated)')
                }}
              </label>
              <input
                v-model="form.servicesInput"
                type="text"
                :placeholder="
                  form.facilityType === 'home-service'
                    ? 'លាងម៉ាស៊ីនត្រជាក់, បញ្ចូលហ្គាស, ជួសជុលបន្ទាន់'
                    : form.facilityType === 'employer'
                      ? 'Software Engineer, Sales Executive, Graphic Designer, Accountant'
                      : form.facilityType === 'transport'
                        ? 'VIP Sleeper Bus, Airport Transfer, Rental Van, Express Parcel'
                        : form.facilityType === 'emergency-ambulance'
                          ? 'រថយន្តសង្គ្រោះ ICU, គ្រូពេទ្យសង្គ្រោះបន្ទាន់, បញ្ជូនអ្នកជំងឺឆ្លងខេត្ត'
                          : 'សង្គ្រោះបន្ទាន់, វះកាត់ទូទៅ, មន្ទីរពិសោធន៍, ថតកាំរស្មីអ៊ិច'
                "
                class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <!-- STEP 4: LEGAL CREDENTIALS & APPLICANT DETAILS -->
          <div class="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-700/60">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {{ currentLanguage === 'kh' ? '៤. ការផ្ទៀងផ្ទាត់ផ្លូវច្បាប់ & អ្នកតំណាង' : '4. Legal Credentials & Representative' }}
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <!-- License Number -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'លេខអាជ្ញាបណ្ណ / ប័ណ្ណប៉ាតង់ *' : 'License / Registration No. *' }}
                </label>
                <div class="relative">
                  <FileCheck class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="form.licenseNumber"
                    type="text"
                    required
                    placeholder="e.g. MOH-2024-8891"
                    class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>

              <!-- Representative Name (Prefilled from currentUser) -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'ឈ្មោះអ្នកតំណាងដាក់ពាក្យ *' : 'Applicant Name *' }}
                </label>
                <div class="relative">
                  <User class="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    v-model="form.representativeName"
                    type="text"
                    required
                    placeholder="ឈ្មោះអ្នកដាក់ពាក្យ"
                    class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <!-- Representative Role -->
              <div class="space-y-1.5">
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {{ currentLanguage === 'kh' ? 'តួនាទីក្នុងស្ថាប័ន' : 'Representative Role' }}
                </label>
                <input
                  v-model="form.representativeRole"
                  type="text"
                  placeholder="e.g. ប្រធានរដ្ឋបាល / ម្ចាស់អាជីវកម្ម"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <!-- Agreement Checkbox -->
            <label class="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 cursor-pointer">
              <input
                v-model="form.agreement"
                type="checkbox"
                required
                class="w-4 h-4 mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer shrink-0"
              />
              <span class="text-xs text-amber-900 dark:text-amber-200 leading-relaxed font-medium">
                {{ currentLanguage === 'kh'
                  ? 'ខ្ញុំសូមបញ្ជាក់ថាព័ត៌មានដែលបានផ្តល់ជូនខាងលើពិតជាត្រឹមត្រូវ និងស្របច្បាប់ស្របតាមច្បាប់នៃព្រះរាជាណាចក្រកម្ពុជា។ ខ្ញុំយល់ព្រមឱ្យក្រុមការងាររដ្ឋបាល CamLife ធ្វើការត្រួតពិនិត្យ និងផ្សាយជាសាធារណៈ។'
                  : 'I declare that the information provided is true, accurate, and licensed in accordance with Cambodian law. I authorize CamLife to verify and publish this listing.'
                }}
              </span>
            </label>

            <!-- Error Banner -->
            <div v-if="errorMessage" class="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-300 text-xs font-bold flex items-center gap-2">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ errorMessage }}</span>
            </div>
          </div>

          <!-- SUBMIT ACTION BUTTON -->
          <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-700/60">
            <p class="text-[11px] text-slate-400">
              {{ currentLanguage === 'kh' ? '* រាល់សំណើនឹងត្រូវត្រួតពិនិត្យដោយ Admin មុននឹងបង្ហាញជាផ្លូវការ។' : '* Submissions undergo administrative review before appearing live.' }}
            </p>

            <button
              type="submit"
              :disabled="isSubmitting"
              class="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-sm shadow-xl shadow-emerald-900/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send class="w-4 h-4" />
              <span>{{ isSubmitting ? (currentLanguage === 'kh' ? 'កំពុងបញ្ជូន...' : 'Submitting...') : (currentLanguage === 'kh' ? 'បញ្ជូនពាក្យស្នើសុំចុះបញ្ជី' : 'Submit Application') }}</span>
            </button>
          </div>
        </form>
      </section>

    </div>
  </div>
</template>
