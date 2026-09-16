<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  X,
  Building2,
  Hospital as HospitalIcon,
  Stethoscope,
  Pill,
  Wrench,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Send,
  Phone,
  Mail,
  User,
  Sparkles
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { usePartnerSubmissions } from '@/composables/usePartnerSubmissions'
import type { PartnerSubmission } from '@/types'

const props = withDefaults(
  defineProps<{
    isOpen: boolean
    initialType?: 'hospital' | 'clinic' | 'pharmacy' | 'home-service'
  }>(),
  {
    initialType: 'hospital'
  }
)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submitted', sub: PartnerSubmission): void
}>()

const { currentLanguage } = useLanguage()
const { submitApplication } = usePartnerSubmissions()

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

const form = reactive({
  facilityType: 'hospital' as 'hospital' | 'clinic' | 'pharmacy' | 'home-service',
  nameKh: '',
  nameEn: '',
  category: '',
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
  agreement: false
})

const isSubmitting = ref(false)
const errorMessage = ref('')
const isSuccess = ref(false)

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      isSuccess.value = false
      errorMessage.value = ''
      form.facilityType = props.initialType || 'hospital'
      form.nameKh = ''
      form.nameEn = ''
      form.category = props.initialType === 'home-service' ? 'AC Repair' : props.initialType || 'hospital'
      form.location = 'Phnom Penh'
      form.addressKh = ''
      form.address = ''
      form.phone = ''
      form.email = ''
      form.openingHours = props.initialType === 'hospital' ? '24/7' : '08:00 - 18:00'
      form.licenseNumber = ''
      form.representativeName = ''
      form.representativeRole = props.initialType === 'home-service' ? 'ម្ចាស់អាជីវកម្ម' : 'ប្រធានផ្នែករដ្ឋបាល'
      form.descriptionKh = ''
      form.descriptionEn = ''
      form.servicesInput = ''
      form.acceptsNssf = true
      form.agreement = false
    }
  }
)

function handleSubmit() {
  errorMessage.value = ''

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

    const submission = submitApplication({
      facilityType: form.facilityType,
      nameKh: form.nameKh.trim(),
      nameEn: form.nameEn.trim(),
      category: form.facilityType === 'home-service' ? form.category : form.facilityType,
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
      acceptsNssf: form.facilityType !== 'home-service' ? form.acceptsNssf : false
    })

    isSubmitting.value = false
    isSuccess.value = true
    emit('submitted', submission)
  }, 600)
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in">
    <div
      class="relative w-full max-w-2xl bg-white dark:bg-[#131F37] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden font-khmer my-auto"
      @click.stop
    >
      <!-- HEADER -->
      <div class="px-5 sm:px-7 py-4 sm:py-5 bg-gradient-to-r from-[#0A2540] via-[#0D3B66] to-[#0D47A1] text-white flex items-center justify-between relative overflow-hidden">
        <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

        <div class="relative z-10 flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shrink-0">
            <Building2 class="w-5 h-5 text-blue-200" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base sm:text-lg font-black tracking-tight">
                {{ currentLanguage === 'kh' ? 'ពាក្យស្នើសុំចុះបញ្ជីសេវា / មន្ទីរពេទ្យ' : 'Facility & Service Listing Application' }}
              </h3>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                <Sparkles class="w-2.5 h-2.5" />
                <span>Partner</span>
              </span>
            </div>
            <p class="text-[11px] text-blue-200/90 mt-0.5">
              {{ currentLanguage === 'kh' ? 'សម្រាប់មន្ទីរពេទ្យ គ្លីនិក ឬសេវាកម្មដែលចង់បង្ហាញលើថ្នាល CamLife' : 'For licensed healthcare facilities and verified services to join CamLife' }}
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="relative z-10 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0"
          type="button"
        >
          <X class="w-4 h-4" />
        </button>
      </div>

      <!-- SUCCESS VIEW -->
      <div v-if="isSuccess" class="p-6 sm:p-10 text-center space-y-4">
        <div class="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto ring-8 ring-emerald-500/10 animate-bounce">
          <CheckCircle2 class="w-8 h-8" />
        </div>
        <h4 class="text-xl font-black text-slate-900 dark:text-white">
          {{ currentLanguage === 'kh' ? 'ការដាក់ពាក្យទទួលបានជោគជ័យ!' : 'Application Submitted Successfully!' }}
        </h4>
        <p class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
          {{ currentLanguage === 'kh'
            ? 'ពាក្យស្នើសុំរបស់លោកអ្នកត្រូវបានបញ្ជូនទៅកាន់ប្រព័ន្ធរដ្ឋបាល CamLife រួចរាល់ហើយ។ ក្រុមការងារត្រួតពិនិត្យនឹងធ្វើការផ្ទៀងផ្ទាត់អាជ្ញាបណ្ណ និងអនុម័ត (Approve) ក្នុងរយៈពេល ២៤ ទៅ ៤៨ ម៉ោង។'
            : 'Your listing request has been submitted for administrative review. Our verification team will review your credentials and approve within 24-48 hours.'
          }}
        </p>

        <div class="pt-4">
          <button
            @click="emit('close')"
            class="px-8 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold hover:bg-[#1565C0] transition-colors cursor-pointer"
            type="button"
          >
            {{ currentLanguage === 'kh' ? 'បិទផ្ទាំងនេះ' : 'Close' }}
          </button>
        </div>
      </div>

      <!-- FORM VIEW -->
      <form v-else @submit.prevent="handleSubmit" class="p-5 sm:p-7 space-y-4 max-h-[75vh] overflow-y-auto">
        <!-- Error alert -->
        <div v-if="errorMessage" class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- 1. FACILITY TYPE SELECTOR -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
            {{ currentLanguage === 'kh' ? 'ប្រភេទស្ថាប័ន / សេវាកម្ម (Facility Type) *' : 'Facility / Service Type *' }}
          </label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <label
              :class="[
                'p-2.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1.5',
                form.facilityType === 'hospital'
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-[#0D47A1] text-[#0D47A1] dark:text-blue-300 ring-2 ring-[#0D47A1]/20 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
              ]"
            >
              <input type="radio" v-model="form.facilityType" value="hospital" class="sr-only" />
              <HospitalIcon class="w-5 h-5" />
              <span class="text-[11px]">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital' }}</span>
            </label>

            <label
              :class="[
                'p-2.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1.5',
                form.facilityType === 'clinic'
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-[#0D47A1] text-[#0D47A1] dark:text-blue-300 ring-2 ring-[#0D47A1]/20 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
              ]"
            >
              <input type="radio" v-model="form.facilityType" value="clinic" class="sr-only" />
              <Stethoscope class="w-5 h-5" />
              <span class="text-[11px]">{{ currentLanguage === 'kh' ? 'គ្លីនិក' : 'Clinic' }}</span>
            </label>

            <label
              :class="[
                'p-2.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1.5',
                form.facilityType === 'pharmacy'
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-[#0D47A1] text-[#0D47A1] dark:text-blue-300 ring-2 ring-[#0D47A1]/20 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
              ]"
            >
              <input type="radio" v-model="form.facilityType" value="pharmacy" class="sr-only" />
              <Pill class="w-5 h-5" />
              <span class="text-[11px]">{{ currentLanguage === 'kh' ? 'ឱសថស្ថាន' : 'Pharmacy' }}</span>
            </label>

            <label
              :class="[
                'p-2.5 rounded-xl border text-center cursor-pointer transition-all flex flex-col items-center gap-1.5',
                form.facilityType === 'home-service'
                  ? 'bg-blue-50 dark:bg-blue-950/50 border-[#0D47A1] text-[#0D47A1] dark:text-blue-300 ring-2 ring-[#0D47A1]/20 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-blue-300'
              ]"
            >
              <input type="radio" v-model="form.facilityType" value="home-service" class="sr-only" />
              <Wrench class="w-5 h-5" />
              <span class="text-[11px]">{{ currentLanguage === 'kh' ? 'សេវាជួសជុល' : 'Home Service' }}</span>
            </label>
          </div>
        </div>

        <!-- 2. NAME IN KH & EN -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'ឈ្មោះជាភាសាខ្មែរ *' : 'Name in Khmer *' }}
            </label>
            <input
              v-model="form.nameKh"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white"
              :placeholder="form.facilityType === 'home-service' ? 'ឧ. សេវាជួសជុលម៉ាស៊ីនត្រជាក់ ពិសិដ្ឋ' : 'ឧ. មន្ទីរពេទ្យអន្តរជាតិសៀមរាប'"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'ឈ្មោះជាអក្សរឡាតាំង (English) *' : 'Name in English *' }}
            </label>
            <input
              v-model="form.nameEn"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white font-mono"
              :placeholder="form.facilityType === 'home-service' ? 'e.g. Piseth AC Repair Service' : 'e.g. Siem Reap International Hospital'"
            />
          </div>
        </div>

        <!-- Home Service Category if applicable -->
        <div v-if="form.facilityType === 'home-service'">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {{ currentLanguage === 'kh' ? 'ឯកទេសសេវាកម្ម *' : 'Service Specialty *' }}
          </label>
          <select
            v-model="form.category"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white cursor-pointer"
          >
            <option v-for="cat in homeServiceCategories" :key="cat.value" :value="cat.value">
              {{ currentLanguage === 'kh' ? cat.labelKh : cat.value }}
            </option>
          </select>
        </div>

        <!-- 3. LOCATION & HOURS -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'រាជធានី / ខេត្ត *' : 'Province / City *' }}
            </label>
            <select
              v-model="form.location"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white cursor-pointer"
            >
              <option v-for="prov in provinces" :key="prov" :value="prov">
                {{ currentLanguage === 'kh' ? (provinceNamesKh[prov] || prov) : prov }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'ម៉ោងបំពេញការងារ *' : 'Opening Hours *' }}
            </label>
            <input
              v-model="form.openingHours"
              type="text"
              class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white font-mono"
              placeholder="24/7 or 08:00 - 18:00"
            />
          </div>
        </div>

        <!-- 4. ADDRESS -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {{ currentLanguage === 'kh' ? 'អាសយដ្ឋានលម្អិត (ទីតាំងជាក់ស្តែង) *' : 'Full Physical Address *' }}
          </label>
          <input
            v-model="form.addressKh"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white"
            :placeholder="currentLanguage === 'kh' ? 'ឧ. ផ្លូវជាតិលេខ ៦ សង្កាត់ស្វាយដង្គំ ក្រុងសៀមរាប' : 'Street name, Sangkat, Khan/City'"
          />
        </div>

        <!-- 5. CONTACT & LICENSE NUMBER -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ / Hotline *' : 'Contact Phone / Hotline *' }}
            </label>
            <div class="relative">
              <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                v-model="form.phone"
                type="tel"
                class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white font-mono"
                placeholder="023 999 888"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'លេខអាជ្ញាបណ្ណស្របច្បាប់ *' : 'License / Registration No. *' }}
            </label>
            <div class="relative">
              <FileCheck class="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                v-model="form.licenseNumber"
                type="text"
                class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white font-mono"
                :placeholder="form.facilityType === 'home-service' ? 'MOC-PP-2026-4412' : 'MoH-2026-XXXX'"
              />
            </div>
            <span class="text-[10px] text-slate-400 mt-0.5 block">
              {{ currentLanguage === 'kh' ? 'លេខអាជ្ញាបណ្ណពីក្រសួងសុខាភិបាល ឬក្រសួងពាណិជ្ជកម្ម' : 'Ministry of Health or MOC official registration ID' }}
            </span>
          </div>
        </div>

        <!-- 6. REPRESENTATIVE & EMAIL -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'ឈ្មោះអ្នកតំណាងស្ថាប័ន *' : 'Representative Name *' }}
            </label>
            <div class="relative">
              <User class="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                v-model="form.representativeName"
                type="text"
                class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white"
                placeholder="Dr. Keo Sothea"
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {{ currentLanguage === 'kh' ? 'អ៊ីមែលផ្លូវការ' : 'Official Email' }}
            </label>
            <div class="relative">
              <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                v-model="form.email"
                type="email"
                class="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white font-mono"
                placeholder="contact@facility.kh"
              />
            </div>
          </div>
        </div>

        <!-- 7. NSSF & SPECIALTIES -->
        <div v-if="form.facilityType !== 'home-service'" class="p-3 bg-blue-50/60 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/60 flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-800 dark:text-blue-200">
              {{ currentLanguage === 'kh' ? 'ទទួលប័ណ្ណមូលនិធិសមធម៌ / ប.ស.ស (NSSF)' : 'Accepts NSSF Health Insurance' }}
            </p>
            <p class="text-[10px] text-slate-500 dark:text-blue-300">
              {{ currentLanguage === 'kh' ? 'តើមន្ទីរពេទ្យមានកិច្ចសន្យាទទួលព្យាបាលអ្នកមានប័ណ្ណ ប.ស.ស ដែរឬទេ?' : 'Does this facility provide treatment under national NSSF coverage?' }}
            </p>
          </div>
          <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" v-model="form.acceptsNssf" class="sr-only peer" />
            <div class="w-10 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0D47A1]"></div>
          </label>
        </div>

        <!-- 8. SERVICES / SPECIALTIES -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            {{ currentLanguage === 'kh' ? 'សេវាឯកទេស (បំបែកដោយសញ្ញាក្បៀស ,)' : 'Services / Specialties (comma separated)' }}
          </label>
          <input
            v-model="form.servicesInput"
            type="text"
            class="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800 text-xs font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] text-slate-800 dark:text-white"
            placeholder="សង្គ្រោះបន្ទាន់, វះកាត់ទូទៅ, សម្ភព, ជំងឺកុមារ"
          />
        </div>

        <!-- 9. AGREEMENT CHECKBOX -->
        <div class="pt-2">
          <label class="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              v-model="form.agreement"
              class="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500 mt-0.5"
            />
            <span>
              {{ currentLanguage === 'kh'
                ? 'ខ្ញុំសូមបញ្ជាក់ថា ព័ត៌មាន និងឯកសារដែលបានផ្តល់ជូនខាងលើនេះពិតជាត្រឹមត្រូវស្របច្បាប់ និងអនុញ្ញាតឱ្យក្រុមការងារ CamLife ធ្វើការត្រួតពិនិត្យ និងផ្សាយជាសាធារណៈ។'
                : 'I certify that the information provided is accurate and authorized for verification and public listing on the CamLife civic platform.'
              }}
            </span>
          </label>
        </div>

        <!-- FOOTER BUTTONS -->
        <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            type="button"
            @click="emit('close')"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>

          <button
            type="submit"
            :disabled="isSubmitting"
            class="px-6 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <span v-if="isSubmitting" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <Send v-else class="w-3.5 h-3.5" />
            <span>{{ isSubmitting ? (currentLanguage === 'kh' ? 'កំពុងបញ្ជូន...' : 'Submitting...') : (currentLanguage === 'kh' ? 'បញ្ជូនពាក្យស្នើសុំ' : 'Submit Application') }}</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
