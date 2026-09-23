<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  FileText,
  Search,
  CheckCircle2,
  Clock,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hospital as HospitalIcon,
  Stethoscope,
  Pill,
  Wrench,
  Check,
  Ban,
  Briefcase,
  Bus,
  Ambulance,
  Globe,
  ShieldCheck,
  ExternalLink,
  ArrowLeft,
  Plus
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { usePartnerSubmissions } from '@/composables/usePartnerSubmissions'
import type { PartnerSubmission } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()
const {
  submissions,
  pendingCount,
  approvedCount,
  rejectedCount,
  approveSubmission,
  rejectSubmission,
  deleteSubmission,
  addDemoPendingSubmissions
} = usePartnerSubmissions()

// -------------------------------------------------------------
// FILTERS & SEARCH
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedStatus = ref<string>('All')
const selectedType = ref<string>('All')

const filteredSubmissions = computed(() => {
  return submissions.value.filter(s => {
    const matchStatus = selectedStatus.value === 'All' || s.status === selectedStatus.value
    const matchType = selectedType.value === 'All' || s.facilityType === selectedType.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchStatus && matchType

    const matchSearch =
      s.nameKh.toLowerCase().includes(q) ||
      s.nameEn.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.phone.includes(q) ||
      s.licenseNumber.toLowerCase().includes(q) ||
      s.representativeName.toLowerCase().includes(q)
    return matchStatus && matchType && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredSubmissions.value.length / itemsPerPage.value) || 1)

const paginatedSubmissions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredSubmissions.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedStatus, selectedType, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// NAVIGATION VIEW & DETAIL STATE
// -------------------------------------------------------------
const currentView = ref<'list' | 'detail'>('list')
const selectedDetail = ref<PartnerSubmission | null>(null)

function openDetailModal(s: PartnerSubmission) {
  selectedDetail.value = s
  currentView.value = 'detail'
}

function backToList() {
  currentView.value = 'list'
  selectedDetail.value = null
}

// -------------------------------------------------------------
// REJECT REASON MODAL
// -------------------------------------------------------------
const isRejectModalOpen = ref(false)
const rejectingSubmissionId = ref('')
const rejectReasonInput = ref('')

function openRejectModal(id: string) {
  rejectingSubmissionId.value = id
  rejectReasonInput.value = ''
  isRejectModalOpen.value = true
}

function confirmReject() {
  if (!rejectingSubmissionId.value) return
  rejectSubmission(rejectingSubmissionId.value, rejectReasonInput.value.trim() || undefined)
  isRejectModalOpen.value = false
  if (selectedDetail.value && selectedDetail.value.id === rejectingSubmissionId.value) {
    selectedDetail.value.status = 'rejected'
  }
  emit('show-toast', currentLanguage.value === 'kh' ? 'បានបដិសេធពាក្យស្នើសុំចុះបញ្ជី' : 'Submission has been rejected.')
}

// -------------------------------------------------------------
// APPROVE ACTION
// -------------------------------------------------------------
function handleApprove(id: string) {
  const ok = approveSubmission(id)
  if (ok) {
    if (selectedDetail.value && selectedDetail.value.id === id) {
      selectedDetail.value.status = 'approved'
    }
    emit(
      'show-toast',
      currentLanguage.value === 'kh'
        ? 'បានអនុម័ត និងបញ្ចូលទិន្នន័យទៅកាន់ Live Website ដោយជោគជ័យ!'
        : 'Approved and published to live directory successfully!'
    )
  }
}

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកពិតជាចង់លុបពាក្យស្នើសុំនេះមែនទេ?' : 'Delete this submission?')) {
    deleteSubmission(id)
    if (selectedDetail.value?.id === id) {
      backToList()
    }
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបសំណើដោយជោគជ័យ' : 'Submission deleted.')
  }
}

function handleAddDemoSubmissions() {
  addDemoPendingSubmissions()
  selectedStatus.value = 'pending'
  emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមពាក្យស្នើសុំថ្មីចំនួន ៥ សម្រាប់ធ្វើតេស្ត Approve / Reject!' : 'Added 5 pending demo applications!')
}

function getFacilityTypeBadge(type: string) {
  switch (type) {
    case 'hospital':
      return { labelKh: 'មន្ទីរពេទ្យ', labelEn: 'Hospital', icon: HospitalIcon, color: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800' }
    case 'clinic':
      return { labelKh: 'គ្លីនិក', labelEn: 'Clinic', icon: Stethoscope, color: 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-800' }
    case 'pharmacy':
      return { labelKh: 'ឱសថស្ថាន', labelEn: 'Pharmacy', icon: Pill, color: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800' }
    case 'home-service':
      return { labelKh: 'សេវាជួសជុល', labelEn: 'Home Service', icon: Wrench, color: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800' }
    case 'employer':
      return { labelKh: 'ក្រុមហ៊ុន / និយោជក', labelEn: 'Company / Employer', icon: Briefcase, color: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800' }
    case 'transport':
      return { labelKh: 'ក្រុមហ៊ុនដឹកជញ្ជូន', labelEn: 'Transport & Bus', icon: Bus, color: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' }
    case 'emergency-ambulance':
      return { labelKh: 'រថយន្តសង្គ្រោះបន្ទាន់', labelEn: 'Ambulance Service', icon: Ambulance, color: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' }
    default:
      return { labelKh: type, labelEn: type, icon: Building2, color: 'bg-slate-50 text-slate-700 border-slate-200' }
  }
}

function getLiveLink(sub: PartnerSubmission): string {
  if (sub.facilityType === 'hospital' || sub.facilityType === 'clinic' || sub.facilityType === 'pharmacy') {
    return '/health'
  }
  if (sub.facilityType === 'home-service') {
    return '/home-services'
  }
  if (sub.facilityType === 'employer') {
    return '/jobs'
  }
  if (sub.facilityType === 'transport') {
    return '/transport'
  }
  if (sub.facilityType === 'emergency-ambulance') {
    return '/emergency'
  }
  return '/'
}
</script>

<template>
  <div class="h-full flex flex-col font-khmer select-none">

    <!-- ============================================================
         VIEW 1: LIST TABLE VIEW
    ============================================================= -->
    <div v-if="currentView === 'list'" class="h-full flex flex-col space-y-3 sm:space-y-4">

    <!-- ============================================================
         1. TOP EXECUTIVE KPI CARDS
    ============================================================= -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 shrink-0">
      <!-- Total Submissions -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center shrink-0">
          <FileText class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
            {{ currentLanguage === 'kh' ? 'សំណើសរុប' : 'Total Submissions' }}
          </p>
          <p class="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-tight">
            {{ submissions.length }}
          </p>
        </div>
      </div>

      <!-- Pending Review (Action Required) -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-amber-200 dark:border-amber-900/60 p-3 sm:p-4 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
          <Clock class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <div class="flex items-center gap-1.5">
            <p class="text-[10px] sm:text-[11px] font-bold text-amber-600 dark:text-amber-400 truncate">
              {{ currentLanguage === 'kh' ? 'រង់ចាំត្រួតពិនិត្យ' : 'Pending Review' }}
            </p>
            <span v-if="pendingCount > 0" class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          </div>
          <p class="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono leading-tight">
            {{ pendingCount }}
          </p>
        </div>
      </div>

      <!-- Approved & Live -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 p-3 sm:p-4 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] sm:text-[11px] font-bold text-emerald-600 dark:text-emerald-400 truncate">
            {{ currentLanguage === 'kh' ? 'បានអនុម័ត (ផ្សាយផ្ទាល់)' : 'Approved & Live' }}
          </p>
          <p class="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono leading-tight">
            {{ approvedCount }}
          </p>
        </div>
      </div>

      <!-- Rejected -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <Ban class="w-5 h-5" />
        </div>
        <div class="min-w-0">
          <p class="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 truncate">
            {{ currentLanguage === 'kh' ? 'បានបដិសេធ' : 'Rejected' }}
          </p>
          <p class="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-mono leading-tight">
            {{ rejectedCount }}
          </p>
        </div>
      </div>
    </div>

    <!-- ============================================================
         2. CONTROLS BAR (SEARCH + STATUS FILTER + TYPE FILTER)
    ============================================================= -->
    <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-3 sm:p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 shrink-0">
      <!-- Search Input -->
      <div class="relative w-full md:w-80">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកតាមឈ្មោះ លេខអាជ្ញាបណ្ណ ឬទូរស័ព្ទ...' : 'Search by name, license no, phone...'"
          class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
        />
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
        <!-- Status Filter -->
        <select
          v-model="selectedStatus"
          class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="All">{{ currentLanguage === 'kh' ? 'ស្ថានភាពទាំងអស់' : 'All Status' }}</option>
          <option value="pending">{{ currentLanguage === 'kh' ? '⏳ រង់ចាំពិនិត្យ (Pending)' : 'Pending' }}</option>
          <option value="approved">{{ currentLanguage === 'kh' ? '✅ បានអនុម័ត (Approved)' : 'Approved' }}</option>
          <option value="rejected">{{ currentLanguage === 'kh' ? '❌ បានបដិសេធ (Rejected)' : 'Rejected' }}</option>
        </select>

        <!-- Facility Type Filter -->
        <select
          v-model="selectedType"
          class="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
        >
          <option value="All">{{ currentLanguage === 'kh' ? 'គ្រប់ប្រភេទស្ថាប័ន' : 'All Facility Types' }}</option>
          <option value="hospital">{{ currentLanguage === 'kh' ? '🏥 មន្ទីរពេទ្យ' : 'Hospitals' }}</option>
          <option value="clinic">{{ currentLanguage === 'kh' ? '🩺 គ្លីនិក' : 'Clinics' }}</option>
          <option value="pharmacy">{{ currentLanguage === 'kh' ? '💊 ឱសថស្ថាន' : 'Pharmacies' }}</option>
          <option value="home-service">{{ currentLanguage === 'kh' ? '🔧 សេវាជួសជុល' : 'Home Services' }}</option>
          <option value="employer">{{ currentLanguage === 'kh' ? '💼 ក្រុមហ៊ុន / និយោជក' : 'Companies / Employers' }}</option>
          <option value="transport">{{ currentLanguage === 'kh' ? '🚌 ក្រុមហ៊ុនដឹកជញ្ជូន' : 'Transport Operators' }}</option>
          <option value="emergency-ambulance">{{ currentLanguage === 'kh' ? '🚑 រថយន្តសង្គ្រោះបន្ទាន់' : 'Ambulance Services' }}</option>
        </select>

        <!-- Add Demo Submissions Button -->
        <button
          type="button"
          @click="handleAddDemoSubmissions"
          class="px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer shrink-0"
          :title="currentLanguage === 'kh' ? 'បង្កើតពាក្យស្នើសុំតេស្តថ្មី' : 'Add 5 Test Submissions'"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? '+ បង្កើតសំណើតេស្ត (៥)' : '+ Add 5 Test Applications' }}</span>
        </button>
      </div>
    </div>

    <!-- ============================================================
         3. SUBMISSIONS TABLE (FULL SCREEN FIT)
    ============================================================= -->
    <div class="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden flex flex-col">
      <div class="flex-1 overflow-auto">
        <table class="w-full text-left border-collapse text-xs">
          <thead class="sticky top-0 bg-slate-50 dark:bg-slate-800/90 backdrop-blur-xs text-slate-600 dark:text-slate-300 font-extrabold border-b border-slate-200 dark:border-slate-700 z-10">
            <tr>
              <th class="py-3 px-4">{{ currentLanguage === 'kh' ? 'ស្ថាប័ន / សេវាកម្ម' : 'Facility / Service' }}</th>
              <th class="py-3 px-3">{{ currentLanguage === 'kh' ? 'ទីតាំង & អាសយដ្ឋាន' : 'Location' }}</th>
              <th class="py-3 px-3">{{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contact' }}</th>
              <th class="py-3 px-3">{{ currentLanguage === 'kh' ? 'លេខអាជ្ញាបណ្ណ' : 'License ID' }}</th>
              <th class="py-3 px-3">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Submitted' }}</th>
              <th class="py-3 px-3">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
              <th class="py-3 px-4 text-right">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300 font-medium">
            <tr
              v-for="sub in paginatedSubmissions"
              :key="sub.id"
              class="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors"
            >
              <!-- Name & Type -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center shrink-0">
                    <component :is="getFacilityTypeBadge(sub.facilityType).icon" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="font-extrabold text-slate-900 dark:text-white truncate max-w-[200px]">
                      {{ sub.nameKh }}
                    </p>
                    <p class="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                      {{ sub.nameEn }}
                    </p>
                    <span :class="['inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-bold border', getFacilityTypeBadge(sub.facilityType).color]">
                      {{ currentLanguage === 'kh' ? getFacilityTypeBadge(sub.facilityType).labelKh : getFacilityTypeBadge(sub.facilityType).labelEn }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Location -->
              <td class="py-3 px-3">
                <p class="font-bold text-slate-800 dark:text-slate-200">{{ sub.location }}</p>
                <p class="text-[10px] text-slate-400 truncate max-w-[150px]">{{ sub.addressKh || sub.address }}</p>
              </td>

              <!-- Contact -->
              <td class="py-3 px-3 font-mono">
                <p class="font-bold text-slate-800 dark:text-slate-200">{{ sub.phone }}</p>
                <p v-if="sub.representativeName" class="text-[10px] text-slate-400 truncate max-w-[130px] font-sans">
                  {{ sub.representativeName }} ({{ sub.representativeRole }})
                </p>
              </td>

              <!-- License ID -->
              <td class="py-3 px-3">
                <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 font-mono font-bold text-[10px]">
                  {{ sub.licenseNumber }}
                </span>
              </td>

              <!-- Submitted At -->
              <td class="py-3 px-3 text-[11px] text-slate-500 font-mono">
                {{ sub.submittedAt }}
              </td>

              <!-- Status Badge -->
              <td class="py-3 px-3">
                <span
                  v-if="sub.status === 'pending'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                >
                  <Clock class="w-3 h-3" />
                  <span>{{ currentLanguage === 'kh' ? 'រង់ចាំពិនិត្យ' : 'Pending' }}</span>
                </span>
                <span
                  v-else-if="sub.status === 'approved'"
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                >
                  <CheckCircle2 class="w-3 h-3" />
                  <span>{{ currentLanguage === 'kh' ? 'បានអនុម័ត' : 'Approved' }}</span>
                </span>
                <span
                  v-else
                  class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                >
                  <Ban class="w-3 h-3" />
                  <span>{{ currentLanguage === 'kh' ? 'បានបដិសេធ' : 'Rejected' }}</span>
                </span>
              </td>

              <!-- Action Buttons -->
              <td class="py-3 px-4 text-right">
                <div class="inline-flex items-center gap-1.5">
                  <!-- Approve Button -->
                  <button
                    v-if="sub.status !== 'approved'"
                    @click="handleApprove(sub.id)"
                    class="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 dark:text-emerald-300 transition-colors cursor-pointer"
                    :title="currentLanguage === 'kh' ? 'អនុម័តសំណើ' : 'Approve'"
                  >
                    <Check class="w-4 h-4" />
                  </button>

                  <!-- Reject Button -->
                  <button
                    v-if="sub.status === 'pending'"
                    @click="openRejectModal(sub.id)"
                    class="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:hover:bg-rose-900/60 dark:text-rose-300 transition-colors cursor-pointer"
                    :title="currentLanguage === 'kh' ? 'បដិសេធសំណើ' : 'Reject'"
                  >
                    <Ban class="w-4 h-4" />
                  </button>

                  <!-- View Details -->
                  <button
                    @click="openDetailModal(sub)"
                    class="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 dark:text-blue-300 transition-colors cursor-pointer"
                    :title="currentLanguage === 'kh' ? 'មើលព័ត៌មានលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-4 h-4" />
                  </button>

                  <!-- Delete -->
                  <button
                    @click="handleDelete(sub.id)"
                    class="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-rose-600 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete'"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <!-- Empty State -->
            <tr v-if="filteredSubmissions.length === 0">
              <td colspan="7" class="py-12 text-center text-slate-400">
                <FileText class="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p class="font-bold text-xs">
                  {{ currentLanguage === 'kh' ? 'មិនមានពាក្យស្នើសុំត្រូវគ្នានឹងការស្វែងរកទេ' : 'No partner submissions found.' }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION BAR -->
      <div class="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs shrink-0">
        <span class="text-slate-500 dark:text-slate-400">
          {{ currentLanguage === 'kh' ? 'បង្ហាញ' : 'Showing' }} {{ paginatedSubmissions.length }} / {{ filteredSubmissions.length }}
        </span>

        <div class="flex items-center gap-1">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
          >
            <ChevronLeft class="w-3.5 h-3.5" />
          </button>
          <span class="px-2 font-mono font-bold">{{ currentPage }} / {{ totalPages }}</span>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-40 cursor-pointer"
          >
            <ChevronRight class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>

    </div>

    <!-- ============================================================
         VIEW 2: DETAIL FULL SUB-PAGE
    ============================================================= -->
    <div v-else-if="currentView === 'detail' && selectedDetail" class="h-full flex flex-col gap-3 overflow-hidden select-text animate-in fade-in duration-200">
      <!-- Top Action Bar -->
      <div class="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200/90 dark:border-slate-800 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="backToList"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs font-khmer transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft class="w-4 h-4 text-slate-600 dark:text-slate-300" />
            <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Back' }}</span>
          </button>
          <div class="h-5 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>
          <div class="flex items-center gap-2 text-xs font-khmer">
            <span class="text-slate-400">Admin CMS</span>
            <span class="text-slate-300 dark:text-slate-600">/</span>
            <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ពាក្យស្នើសុំដៃគូ' : 'Partner Submissions' }}</span>
            <span class="text-slate-300 dark:text-slate-600">/</span>
            <span class="font-bold text-slate-700 dark:text-slate-200 truncate max-w-xs">{{ selectedDetail.nameKh }}</span>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleDelete(selectedDetail.id)"
            class="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'លុបសំណើ' : 'Delete' }}</span>
          </button>

          <router-link
            v-if="selectedDetail.status === 'approved'"
            :to="getLiveLink(selectedDetail)"
            target="_blank"
            class="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'មើលលើ Live' : 'View Live' }}</span>
          </router-link>

          <button
            v-if="selectedDetail.status === 'pending'"
            type="button"
            @click="openRejectModal(selectedDetail.id)"
            class="px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Ban class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'បដិសេធ' : 'Reject' }}</span>
          </button>

          <button
            v-if="selectedDetail.status !== 'approved'"
            type="button"
            @click="handleApprove(selectedDetail.id)"
            class="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
          >
            <Check class="w-4 h-4" />
            <span>{{ currentLanguage === 'kh' ? 'អនុម័តផ្សាយ Live' : 'Approve & Publish' }}</span>
          </button>
        </div>
      </div>

      <!-- Sub-page Body Card -->
      <div class="flex-1 min-h-0 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-2xs p-5 sm:p-6 overflow-y-auto space-y-6">
        <!-- Header Banner -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-slate-800">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/50">
              <component :is="getFacilityTypeBadge(selectedDetail.facilityType).icon" class="w-6 h-6" />
            </div>
            <div>
              <h3 class="text-lg font-black text-slate-900 dark:text-white">{{ selectedDetail.nameKh }}</h3>
              <p class="text-xs text-slate-500 dark:text-slate-400 font-mono">{{ selectedDetail.nameEn }}</p>
            </div>
          </div>

          <!-- Status Badge & Date -->
          <div class="flex items-center gap-2.5">
            <span :class="['px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5', selectedDetail.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800' : selectedDetail.status === 'rejected' ? 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800' : 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800']">
              <Clock class="w-3.5 h-3.5" />
              <span>{{ selectedDetail.status.toUpperCase() }}</span>
            </span>
            <span class="text-xs text-slate-400 font-mono">
              {{ selectedDetail.submittedAt }}
            </span>
          </div>
        </div>

        <!-- Type & Category Tag Bar -->
        <div class="flex flex-wrap items-center gap-2">
          <span :class="['px-3 py-1 rounded-xl text-xs font-bold border flex items-center gap-1.5', getFacilityTypeBadge(selectedDetail.facilityType).color]">
            <component :is="getFacilityTypeBadge(selectedDetail.facilityType).icon" class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? getFacilityTypeBadge(selectedDetail.facilityType).labelKh : getFacilityTypeBadge(selectedDetail.facilityType).labelEn }}</span>
          </span>

          <span v-if="selectedDetail.category" class="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold border border-slate-200 dark:border-slate-700 text-xs">
            🏷️ {{ selectedDetail.category }}
          </span>

          <span
            v-if="selectedDetail.acceptsNssf"
            class="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 flex items-center gap-1 text-xs"
          >
            <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{{ currentLanguage === 'kh' ? 'ទទួលប័ណ្ណ ប.ស.ស (NSSF)' : 'NSSF Accepted' }}</span>
          </span>
          <span
            v-else-if="['hospital', 'clinic', 'emergency-ambulance', 'employer'].includes(selectedDetail.facilityType)"
            class="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 font-semibold border border-slate-200 dark:border-slate-700 text-xs"
          >
            {{ currentLanguage === 'kh' ? 'មិនទាន់ភ្ជាប់ ប.ស.ស' : 'No NSSF' }}
          </span>
        </div>

        <div v-if="selectedDetail.rejectReason" class="p-4 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 rounded-xl border border-rose-200 dark:border-rose-800/80 text-xs">
          <span class="font-bold">មូលហេតុបដិសេធ៖</span> {{ selectedDetail.rejectReason }}
        </div>

        <!-- Metadata Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-400 block mb-1">លេខអាជ្ញាបណ្ណស្របច្បាប់</span>
            <span class="font-bold font-mono text-slate-800 dark:text-white">{{ selectedDetail.licenseNumber }}</span>
          </div>
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-400 block mb-1">រាជធានី / ខេត្ត</span>
            <span class="font-bold text-slate-800 dark:text-white">{{ selectedDetail.location }}</span>
          </div>
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-400 block mb-1">ទូរស័ព្ទទំនាក់ទំនង</span>
            <span class="font-bold font-mono text-slate-800 dark:text-white">{{ selectedDetail.phone }}</span>
          </div>
          <div class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-400 block mb-1">ម៉ោងបំពេញការងារ</span>
            <span class="font-bold font-mono text-slate-800 dark:text-white">{{ selectedDetail.openingHours }}</span>
          </div>

          <!-- Industry Sector (if Employer) -->
          <div v-if="selectedDetail.industrySector" class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-400 block mb-1">វិស័យឧស្សាហកម្ម</span>
            <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ selectedDetail.industrySector }}</span>
          </div>

          <!-- Fleet Size (if Transport or Ambulance) -->
          <div v-if="selectedDetail.fleetSize" class="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700">
            <span class="text-slate-400 block mb-1">ទំហំកងរថយន្ត / Units</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ selectedDetail.fleetSize }}</span>
          </div>

          <!-- Website Link (if present) -->
          <div v-if="selectedDetail.website" class="sm:col-span-2 p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span class="text-slate-400 block mb-1">គេហទំព័រ / ផេកផ្លូវការ</span>
              <a :href="selectedDetail.website" target="_blank" class="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1.5 font-mono">
                <Globe class="w-3.5 h-3.5" />
                <span>{{ selectedDetail.website }}</span>
              </a>
            </div>
          </div>
        </div>

        <!-- Descriptions (Khmer & English) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div v-if="selectedDetail.descriptionKh" class="p-4 bg-blue-50/50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/60 text-xs">
            <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1.5">📝 ការពិពណ៌នា (ភាសាខ្មែរ)៖</span>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed">{{ selectedDetail.descriptionKh }}</p>
          </div>
          <div v-if="selectedDetail.descriptionEn" class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
            <span class="text-slate-500 font-bold block mb-1.5">📝 Description (English):</span>
            <p class="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed">{{ selectedDetail.descriptionEn }}</p>
          </div>
        </div>

        <!-- Routes Covered (if Transport) -->
        <div v-if="selectedDetail.routes && selectedDetail.routes.length > 0" class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
          <span class="text-slate-400 block mb-2">ខ្សែរត់ និងទិសដៅតភ្ជាប់ (Routes Covered)</span>
          <div class="flex flex-wrap gap-2">
            <span v-for="r in selectedDetail.routes" :key="r" class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
              🚌 {{ r }}
            </span>
          </div>
        </div>

        <!-- Address (Both Khmer & English) -->
        <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 space-y-1.5 text-xs">
          <span class="text-slate-400 block mb-0.5">អាសយដ្ឋានលម្អិត</span>
          <p class="font-semibold text-slate-800 dark:text-white">{{ selectedDetail.addressKh }}</p>
          <p v-if="selectedDetail.address && selectedDetail.address !== selectedDetail.addressKh" class="text-slate-400 font-mono text-[11px]">
            {{ selectedDetail.address }}
          </p>
        </div>

        <!-- Representative -->
        <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
          <span class="text-slate-400 block mb-1">អ្នកតំណាងស្ថាប័ន</span>
          <p class="font-bold text-slate-800 dark:text-white">{{ selectedDetail.representativeName }} ({{ selectedDetail.representativeRole }})</p>
          <p v-if="selectedDetail.email" class="text-slate-500 font-mono text-[11px]">{{ selectedDetail.email }}</p>
        </div>

        <!-- Services List -->
        <div class="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-xs">
          <span class="text-slate-400 block mb-2">សេវា ជំនាញ និងមុខតំណែងផ្តល់ជូន</span>
          <div class="flex flex-wrap gap-1.5">
            <span v-for="serv in selectedDetail.services" :key="serv" class="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-[11px] font-semibold">
              {{ serv }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================
         5. REJECT REASON MODAL
    ============================================================= -->
    <div v-if="isRejectModalOpen" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div class="bg-white dark:bg-[#131F37] w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 p-5 space-y-4" @click.stop>
        <div class="flex items-center justify-between">
          <h4 class="text-sm font-black text-rose-600 flex items-center gap-1.5">
            <Ban class="w-4 h-4" />
            <span>បដិសេធពាក្យស្នើសុំ</span>
          </h4>
          <button @click="isRejectModalOpen = false" class="text-slate-400 hover:text-slate-600">
            <X class="w-4 h-4" />
          </button>
        </div>

        <p class="text-xs text-slate-600 dark:text-slate-300">
          សូមបញ្ជាក់មូលហេតុនៃការបដិសេធ ដើម្បីកត់ត្រាក្នុងប្រព័ន្ធ៖
        </p>

        <textarea
          v-model="rejectReasonInput"
          rows="3"
          class="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/20"
          placeholder="ឧ. មិនមានឯកសារបញ្ជាក់ពីអាជ្ញាបណ្ណក្រសួងសុខាភិបាលត្រឹមត្រូវ..."
        ></textarea>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button
            @click="isRejectModalOpen = false"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            បោះបង់
          </button>
          <button
            @click="confirmReject"
            class="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-sm"
          >
            បញ្ជាក់ការបដិសេធ
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
