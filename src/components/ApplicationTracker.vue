<script setup lang="ts">
import { ref } from 'vue'
import {
  Search,
  CheckCircle2,
  Clock,
  QrCode,
  Printer,
  X,
  ShieldCheck,
  Building2,
  AlertCircle
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { currentLanguage } = useLanguage()

export interface TrackingRecord {
  trackingId: string
  applicantName: string
  applicantNameKh: string
  serviceTitleKh: string
  serviceTitleEn: string
  departmentKh: string
  departmentEn: string
  submittedDate: string
  estimatedDate: string
  currentStep: number // 1 to 4
  status: 'pending' | 'review' | 'approved' | 'ready' | 'resolved'
  officerNoteKh: string
  officerNoteEn: string
  qrCodeUrl?: string
}

const mockDatabase: Record<string, TrackingRecord> = {
  'OWSO-2026-8891': {
    trackingId: 'OWSO-2026-8891',
    applicantName: 'Sok Dara',
    applicantNameKh: 'សុខ តារា',
    serviceTitleKh: 'ពាក្យស្នើសុំបន្តប័ណ្ណបើកបរយានយន្ត (ប្រភេទ ខ)',
    serviceTitleEn: 'Driver License Renewal (Type B)',
    departmentKh: 'ការិយាល័យច្រកចេញចូលតែមួយ ខណ្ឌទួលគោក',
    departmentEn: 'Toul Kork OWSO Citizen Hall',
    submittedDate: '2026-03-08',
    estimatedDate: '2026-03-12',
    currentStep: 4,
    status: 'ready',
    officerNoteKh: 'ឯកសារ និងលទ្ធផលពិនិត្យសុខភាពត្រឹមត្រូវ។ ប័ណ្ណថ្មីត្រូវបានបោះពុម្ពរួចរាល់ លោកអ្នកអាចអញ្ជើញមកទទួលនៅច្រកលេខ ៤។',
    officerNoteEn: 'Documents verified and license card printed. Ready for pickup at Counter 4.'
  },
  'BUS-2026-4402': {
    trackingId: 'BUS-2026-4402',
    applicantName: 'Chea Vanna',
    applicantNameKh: 'ជា វណ្ណា',
    serviceTitleKh: 'ពាក្យស្នើសុំចុះបញ្ជីអាជីវកម្មថ្មី (សហគ្រាសឯកបុគ្គល)',
    serviceTitleEn: 'Sole Proprietorship Business Registration',
    departmentKh: 'ច្រកចេញចូលតែមួយ រាជធានីភ្នំពេញ / ក្រសួងពាណិជ្ជកម្ម',
    departmentEn: 'Phnom Penh OWSO / Ministry of Commerce',
    submittedDate: '2026-03-11',
    estimatedDate: '2026-03-16',
    currentStep: 2,
    status: 'review',
    officerNoteKh: 'មន្ត្រីជំនាញកំពុងត្រួតពិនិត្យទីតាំងអាជីវកម្ម និងវិញ្ញាបនបត្របង់ពន្ធប្រចាំឆ្នាំ។',
    officerNoteEn: 'Specialist officer currently reviewing physical business address and tax records.'
  },
  'ID-2026-7731': {
    trackingId: 'ID-2026-7731',
    applicantName: 'Keo Bopha',
    applicantNameKh: 'កែវ បុប្ផា',
    serviceTitleKh: 'ពាក្យស្នើសុំផ្តល់អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរទុតិយតា',
    serviceTitleEn: 'National Cambodian ID Replacement',
    departmentKh: 'អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម (GDI) / ប៉ុស្តិ៍នគរបាលរដ្ឋបាល',
    departmentEn: 'General Department of Identification (GDI)',
    submittedDate: '2026-03-09',
    estimatedDate: '2026-03-15',
    currentStep: 3,
    status: 'approved',
    officerNoteKh: 'បានអនុម័តទិន្នន័យជីវមាត្រ (Biometrics Approved)។ កំពុងបញ្ជូនទៅរោងពុម្ពកណ្តាល។',
    officerNoteEn: 'Biometric verification approved. Sent to central printing facility.'
  },
  'REP-2026-0019': {
    trackingId: 'REP-2026-0019',
    applicantName: 'Meng Sreypov',
    applicantNameKh: 'ម៉េង ស្រីពៅ',
    serviceTitleKh: 'របាយការណ៍ជួសជុលអំពូលភ្លើងបំភ្លឺផ្លូវសាធារណៈ',
    serviceTitleEn: 'Public Streetlight Repair Request #19',
    departmentKh: 'សាលារាជធានីភ្នំពេញ / អគ្គិសនីកម្ពុជា (EDC)',
    departmentEn: 'Phnom Penh City Hall / EDC Division',
    submittedDate: '2026-03-12',
    estimatedDate: '2026-03-13',
    currentStep: 4,
    status: 'resolved',
    officerNoteKh: 'ក្រុមជាងអគ្គិសនីបានចុះជួសជុល និងប្តូរអំពូល LED ថ្មីរួចរាល់នៅទីតាំងដែលបានរាយការណ៍។',
    officerNoteEn: 'EDC technicians repaired wiring and installed new LED fixture.'
  }
}

const inputCode = ref('')
const searchResult = ref<TrackingRecord | null>(null)
const hasSearched = ref(false)
const isReceiptModalOpen = ref(false)

function handleTrack(codeToUse?: string) {
  const code = (codeToUse || inputCode.value).trim().toUpperCase()
  if (!code) return

  inputCode.value = code
  hasSearched.value = true
  searchResult.value = mockDatabase[code] || null
}

function selectSample(code: string) {
  handleTrack(code)
}

function printReceipt() {
  window.print()
}
</script>

<template>
  <div class="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden select-none">
    
    <!-- 1. HEADER SECTION -->
    <div class="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white relative overflow-hidden">
      
      <!-- Background pattern -->
      <div class="absolute -right-10 -bottom-10 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute right-10 top-0 w-32 h-32 bg-blue-400/10 rounded-full blur-xl pointer-events-none"></div>

      <div class="relative z-10 max-w-3xl">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-blue-200 text-xs font-bold mb-3 font-khmer">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-400" />
          <span>{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធតាមដានសេវាសាធារណៈផ្លូវការ' : 'Official Citizen Service Tracker' }}</span>
        </div>

        <h3 class="text-xl sm:text-2xl lg:text-3xl font-black font-khmer tracking-tight text-white leading-snug">
          {{ currentLanguage === 'kh' ? 'តាមដានស្ថានភាពពាក្យស្នើសុំសេវាពលរដ្ឋ' : 'Track Your Civic Service Application' }}
        </h3>
        
        <p class="mt-2 text-xs sm:text-sm text-blue-100 font-khmer leading-relaxed">
          {{ currentLanguage === 'kh'
            ? 'វាយបញ្ចូលលេខកូដសម្គាល់លើបង្កាន់ដៃរបស់លោកអ្នក (Tracking ID) ដើម្បីពិនិត្យមើលដំណាក់កាលអនុម័ត ពេលវេលាកំណត់ និងបង្កាន់ដៃឌីជីថល QR Code'
            : 'Enter your tracking reference number to inspect real-time approval stages, completion date, and digital QR certificate.'
          }}
        </p>

        <!-- Search Bar -->
        <form @submit.prevent="handleTrack()" class="mt-5 flex flex-col sm:flex-row gap-2">
          <div class="relative flex-1">
            <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              v-model="inputCode"
              type="text"
              placeholder="ឧទាហរណ៍៖ OWSO-2026-8891, BUS-2026-4402..."
              class="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder-slate-400 rounded-2xl text-xs sm:text-sm font-mono uppercase tracking-wider focus:outline-none focus:ring-4 focus:ring-blue-400/30 transition-all font-sans font-bold shadow-lg"
            />
          </div>
          <button
            type="submit"
            class="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-khmer shrink-0"
          >
            <Search class="w-4 h-4" />
            <span>{{ currentLanguage === 'kh' ? 'ស្វែងរកឥឡូវនេះ' : 'Track Now' }}</span>
          </button>
        </form>

        <!-- Quick Demo Badges -->
        <div class="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
          <span class="text-blue-200 text-[11px] font-khmer shrink-0">
            {{ currentLanguage === 'kh' ? 'កូដសាកល្បងរហ័ស:' : 'Sample Codes:' }}
          </span>
          <button
            type="button"
            @click="selectSample('OWSO-2026-8891')"
            class="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono border border-white/20 transition-colors cursor-pointer"
          >
            OWSO-2026-8891 (ប័ណ្ណបើកបរ)
          </button>
          <button
            type="button"
            @click="selectSample('BUS-2026-4402')"
            class="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono border border-white/20 transition-colors cursor-pointer"
          >
            BUS-2026-4402 (អាជីវកម្ម)
          </button>
          <button
            type="button"
            @click="selectSample('ID-2026-7731')"
            class="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono border border-white/20 transition-colors cursor-pointer"
          >
            ID-2026-7731 (អត្តសញ្ញាណប័ណ្ណ)
          </button>
          <button
            type="button"
            @click="selectSample('REP-2026-0019')"
            class="px-2 py-0.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-mono border border-white/20 transition-colors cursor-pointer"
          >
            REP-2026-0019 (អំពូលភ្លើង)
          </button>
        </div>

      </div>
    </div>

    <!-- 2. TRACKING RESULT CARD -->
    <div v-if="hasSearched" class="p-4 sm:p-6 lg:p-8 bg-slate-50/50">
      
      <!-- When Found -->
      <div v-if="searchResult" class="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-6 space-y-6">
        
        <!-- Top Info Header -->
        <div class="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold">
                {{ searchResult.trackingId }}
              </span>
              <span
                :class="[
                  'px-2.5 py-0.5 rounded-full text-xs font-bold font-khmer inline-flex items-center gap-1',
                  searchResult.status === 'ready' || searchResult.status === 'resolved'
                    ? 'bg-emerald-100 text-emerald-800'
                    : searchResult.status === 'approved'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-amber-100 text-amber-800'
                ]"
              >
                <CheckCircle2 v-if="searchResult.status === 'ready' || searchResult.status === 'resolved'" class="w-3.5 h-3.5" />
                <Clock v-else class="w-3.5 h-3.5" />
                <span>
                  {{
                    searchResult.status === 'ready'
                      ? (currentLanguage === 'kh' ? 'រួចរាល់សម្រាប់ទទួល' : 'Ready for Pickup')
                      : searchResult.status === 'resolved'
                        ? (currentLanguage === 'kh' ? 'បានដោះស្រាយជោគជ័យ' : 'Resolved')
                        : searchResult.status === 'approved'
                          ? (currentLanguage === 'kh' ? 'បានអនុម័តផ្លូវការ' : 'Officially Approved')
                          : (currentLanguage === 'kh' ? 'កំពុងត្រួតពិនិត្យឯកសារ' : 'Under Review')
                  }}
                </span>
              </span>
            </div>

            <h4 class="text-base sm:text-lg font-black text-slate-900 mt-2 font-khmer">
              {{ currentLanguage === 'kh' ? searchResult.serviceTitleKh : searchResult.serviceTitleEn }}
            </h4>
            
            <p class="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-khmer">
              <Building2 class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ currentLanguage === 'kh' ? searchResult.departmentKh : searchResult.departmentEn }}</span>
            </p>
          </div>

          <!-- Digital Receipt Trigger Button -->
          <button
            type="button"
            @click="isReceiptModalOpen = true"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer font-khmer shrink-0"
          >
            <QrCode class="w-4 h-4 text-emerald-400" />
            <span>{{ currentLanguage === 'kh' ? 'មើលបង្កាន់ដៃឌីជីថល (QR Code)' : 'View Digital Receipt' }}</span>
          </button>
        </div>

        <!-- Meta Details Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10.5px] block font-khmer">{{ currentLanguage === 'kh' ? 'អ្នកស្នើសុំ' : 'Applicant' }}</span>
            <span class="font-bold text-slate-800 font-khmer mt-0.5 block">
              {{ currentLanguage === 'kh' ? searchResult.applicantNameKh : searchResult.applicantName }}
            </span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10.5px] block font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទដាក់ពាក្យ' : 'Date Submitted' }}</span>
            <span class="font-bold text-slate-800 font-mono mt-0.5 block">{{ searchResult.submittedDate }}</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10.5px] block font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទប៉ាន់ស្មាន' : 'Estimated Completion' }}</span>
            <span class="font-bold text-blue-600 font-mono mt-0.5 block">{{ searchResult.estimatedDate }}</span>
          </div>
          <div class="p-3 bg-slate-50 rounded-xl border border-slate-100">
            <span class="text-slate-400 text-[10.5px] block font-khmer">{{ currentLanguage === 'kh' ? 'សុពលភាពប្រព័ន្ធ' : 'Verification' }}</span>
            <span class="font-bold text-emerald-600 font-khmer mt-0.5 block">✓ 256-Bit Signed</span>
          </div>
        </div>

        <!-- 3. INTERACTIVE PROGRESS STEPPER (4 STAGES) -->
        <div class="pt-2">
          <h5 class="text-xs font-bold text-slate-700 uppercase tracking-wider font-khmer mb-4">
            {{ currentLanguage === 'kh' ? 'ដំណើរការនៃដំណាក់កាលអនុម័ត (Application Timeline)' : 'Application Timeline & Stages' }}
          </h5>

          <div class="relative">
            <!-- Background progress bar line -->
            <div class="hidden sm:block absolute top-5 left-8 right-8 h-1 bg-slate-200 -z-0">
              <div
                class="h-full bg-emerald-500 transition-all duration-500"
                :style="{ width: ((searchResult.currentStep - 1) / 3) * 100 + '%' }"
              ></div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative z-10">
              
              <!-- Step 1: Received -->
              <div class="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 shadow-xs',
                    searchResult.currentStep >= 1
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-200 text-slate-500'
                  ]"
                >
                  <CheckCircle2 v-if="searchResult.currentStep > 1" class="w-5 h-5" />
                  <span v-else>1</span>
                </div>
                <div>
                  <span class="font-bold text-xs text-slate-900 block font-khmer">
                    {{ currentLanguage === 'kh' ? 'បានទទួលពាក្យ' : 'Submitted' }}
                  </span>
                  <span class="text-[10.5px] text-slate-400 font-mono">
                    {{ searchResult.submittedDate }}
                  </span>
                </div>
              </div>

              <!-- Step 2: Verification -->
              <div class="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 shadow-xs',
                    searchResult.currentStep >= 2
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-200 text-slate-500'
                  ]"
                >
                  <CheckCircle2 v-if="searchResult.currentStep > 2" class="w-5 h-5" />
                  <span v-else>2</span>
                </div>
                <div>
                  <span class="font-bold text-xs text-slate-900 block font-khmer">
                    {{ currentLanguage === 'kh' ? 'ត្រួតពិនិត្យឯកសារ' : 'Under Review' }}
                  </span>
                  <span class="text-[10.5px] text-slate-400 font-khmer">
                    {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់ដោយមន្ត្រី' : 'Verified by Officer' }}
                  </span>
                </div>
              </div>

              <!-- Step 3: Processing -->
              <div class="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 shadow-xs',
                    searchResult.currentStep >= 3
                      ? 'bg-emerald-500 text-white ring-4 ring-emerald-100'
                      : 'bg-slate-200 text-slate-500'
                  ]"
                >
                  <CheckCircle2 v-if="searchResult.currentStep > 3" class="w-5 h-5" />
                  <span v-else>3</span>
                </div>
                <div>
                  <span class="font-bold text-xs text-slate-900 block font-khmer">
                    {{ currentLanguage === 'kh' ? 'អនុម័តជាផ្លូវការ' : 'Approved' }}
                  </span>
                  <span class="text-[10.5px] text-slate-400 font-khmer">
                    {{ currentLanguage === 'kh' ? 'កំពុងបោះពុម្ពឯកសារ' : 'Printed & Sealed' }}
                  </span>
                </div>
              </div>

              <!-- Step 4: Ready -->
              <div class="flex sm:flex-col items-center sm:text-center gap-3 sm:gap-2">
                <div
                  :class="[
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-colors shrink-0 shadow-xs',
                    searchResult.currentStep >= 4
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-200'
                      : 'bg-slate-200 text-slate-500'
                  ]"
                >
                  <CheckCircle2 v-if="searchResult.currentStep >= 4" class="w-5 h-5" />
                  <span v-else>4</span>
                </div>
                <div>
                  <span class="font-bold text-xs text-emerald-800 block font-khmer">
                    {{ currentLanguage === 'kh' ? 'រួចរាល់សម្រាប់ទទួល' : 'Ready / Issued' }}
                  </span>
                  <span class="text-[10.5px] text-emerald-600 font-khmer">
                    {{ currentLanguage === 'kh' ? 'អញ្ជើញមកទទួល' : 'Pick up at Counter' }}
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <!-- Officer Note Box -->
        <div class="p-3.5 bg-blue-50/70 rounded-xl border border-blue-100 flex items-start gap-2.5">
          <AlertCircle class="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div class="text-xs text-blue-950 font-khmer leading-relaxed">
            <strong class="font-black block mb-0.5">
              {{ currentLanguage === 'kh' ? 'កំណត់ចំណាំរបស់មន្ត្រីទទួលបន្ទុក៖' : 'Officer Remarks:' }}
            </strong>
            <span>{{ currentLanguage === 'kh' ? searchResult.officerNoteKh : searchResult.officerNoteEn }}</span>
          </div>
        </div>

      </div>

      <!-- When Not Found -->
      <div v-else class="bg-white rounded-2xl border border-slate-200/90 p-8 text-center space-y-2">
        <AlertCircle class="w-8 h-8 text-amber-500 mx-auto" />
        <h4 class="text-sm font-black text-slate-900 font-khmer">
          {{ currentLanguage === 'kh' ? 'រកមិនឃើញលេខកូដពាក្យស្នើសុំនេះឡើយ' : 'No Application Found' }}
        </h4>
        <p class="text-xs text-slate-500 font-khmer max-w-md mx-auto">
          {{ currentLanguage === 'kh'
            ? 'សូមពិនិត្យមើលលេខកូដសម្គាល់លើបង្កាន់ដៃរបស់លោកអ្នកម្តងទៀត ឬចុចជ្រើសរើសលេខកូដសាកល្បង (Sample Codes) ខាងលើ។'
            : 'Please verify the reference code on your receipt or click one of the sample codes above.'
          }}
        </p>
      </div>

    </div>

    <!-- 4. OFFICIAL DIGITAL RECEIPT MODAL -->
    <div
      v-if="isReceiptModalOpen && searchResult"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs select-text"
    >
      <div class="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        
        <!-- Modal Header -->
        <div class="p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white flex items-center justify-between shrink-0">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-emerald-300" />
            <div>
              <h4 class="text-xs font-black font-khmer leading-none">
                {{ currentLanguage === 'kh' ? 'បង្កាន់ដៃឌីជីថលផ្លូវការ' : 'Official Electronic Receipt' }}
              </h4>
              <span class="text-[10px] text-blue-200 font-mono">{{ searchResult.trackingId }}</span>
            </div>
          </div>
          <button
            type="button"
            @click="isReceiptModalOpen = false"
            class="w-7 h-7 rounded-lg hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Receipt Content -->
        <div class="p-6 space-y-4 overflow-y-auto text-xs flex-1">
          
          <!-- Emblem Header -->
          <div class="text-center pb-3 border-b border-slate-100">
            <span class="text-[13px] font-black font-khmer text-slate-900 block">ព្រះរាជាណាចក្រកម្ពុជា</span>
            <span class="text-[11px] font-bold font-khmer text-slate-700 block">ជាតិ សាសនា ព្រះមហាក្សត្រ</span>
            <div class="w-12 h-0.5 bg-blue-600 mx-auto my-1.5 rounded-full"></div>
            <span class="text-[10px] font-bold text-slate-500 font-khmer uppercase tracking-wider block">
              {{ currentLanguage === 'kh' ? 'ផតថលសេវាពលរដ្ឋកម្ពុជា CAMLIFE' : 'CAMLIFE CITIZEN CIVIC PORTAL' }}
            </span>
          </div>

          <!-- QR Code Center -->
          <div class="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-center space-y-2">
            <!-- Simulated High-res QR code -->
            <div class="w-32 h-32 mx-auto bg-white p-2 rounded-xl border border-slate-300 flex items-center justify-center shadow-inner">
              <QrCode class="w-28 h-28 text-slate-900" />
            </div>
            <div>
              <span class="text-[11px] font-bold font-mono text-slate-800 block">{{ searchResult.trackingId }}</span>
              <span class="text-[9.5px] text-slate-400 font-khmer">ស្កេនដើម្បីផ្ទៀងផ្ទាត់សុពលភាពតាមទូរស័ព្ទដៃ</span>
            </div>
          </div>

          <!-- Metadata List -->
          <div class="space-y-2 text-xs">
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'សេវាស្នើសុំ' : 'Service' }}</span>
              <span class="font-bold text-slate-800 text-right font-khmer max-w-[60%]">
                {{ currentLanguage === 'kh' ? searchResult.serviceTitleKh : searchResult.serviceTitleEn }}
              </span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'ឈ្មោះពលរដ្ឋ' : 'Applicant' }}</span>
              <span class="font-bold text-slate-800 font-khmer">
                {{ currentLanguage === 'kh' ? searchResult.applicantNameKh : searchResult.applicantName }}
              </span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'ការិយាល័យ' : 'OWSO Office' }}</span>
              <span class="font-bold text-slate-800 text-right font-khmer max-w-[60%]">
                {{ currentLanguage === 'kh' ? searchResult.departmentKh : searchResult.departmentEn }}
              </span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទដាក់ពាក្យ' : 'Issue Date' }}</span>
              <span class="font-mono text-slate-800">{{ searchResult.submittedDate }}</span>
            </div>
            <div class="flex justify-between py-1 border-b border-slate-100">
              <span class="text-slate-500 font-khmer">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</span>
              <span class="font-bold text-emerald-700 uppercase font-mono">{{ searchResult.status }}</span>
            </div>
          </div>

          <!-- Security watermark -->
          <div class="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
            <span class="text-[10px] font-bold text-emerald-800 font-khmer block">
              ✓ វិញ្ញាបនបត្រអេឡិចត្រូនិចនេះមានសុពលភាពស្របច្បាប់ទូទាំងប្រទេស
            </span>
          </div>

        </div>

        <!-- Modal Footer Actions -->
        <div class="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            type="button"
            @click="isReceiptModalOpen = false"
            class="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-bold font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
          </button>
          
          <button
            type="button"
            @click="printReceipt"
            class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer font-khmer"
          >
            <Printer class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'បោះពុម្ពបង្កាន់ដៃ' : 'Print Receipt' }}</span>
          </button>
        </div>

      </div>
    </div>

  </div>
</template>
