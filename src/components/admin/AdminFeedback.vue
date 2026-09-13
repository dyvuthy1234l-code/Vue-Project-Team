<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
  MessageSquare,
  Search,
  Mail,
  CheckCircle2,
  Clock,
  BadgeCheck,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useFeedback } from '@/composables/useFeedback'
import type { FeedbackReport } from '@/composables/useFeedback'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()
const { reports, updateReportStatus } = useFeedback()

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalReportsCount = computed(() => reports.value.length)
const pendingReportsCount = computed(() => reports.value.filter(r => r.status === 'pending').length)
const verifiedReportsCount = computed(() => reports.value.filter(r => r.status === 'verified').length)
const resolvedReportsCount = computed(() => reports.value.filter(r => r.status === 'resolved').length)

// -------------------------------------------------------------
// FILTERS & SEARCH
// -------------------------------------------------------------
const searchQuery = ref('')
const selectedStatus = ref('All')

const filteredReports = computed(() => {
  return reports.value.filter(r => {
    const matchStatus = selectedStatus.value === 'All' || r.status === selectedStatus.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchStatus
    const matchSearch =
      r.serviceTitle.toLowerCase().includes(q) ||
      (r.details && r.details.toLowerCase().includes(q)) ||
      r.reasonLabel.toLowerCase().includes(q) ||
      (r.contactEmail && r.contactEmail.toLowerCase().includes(q))
    return matchStatus && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredReports.value.length / itemsPerPage.value) || 1)

const paginatedReports = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredReports.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedStatus, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// ACTIONS & STATUS TOGGLE
// -------------------------------------------------------------
function handleStatusChange(id: string, newStatus: 'pending' | 'verified' | 'resolved') {
  updateReportStatus(id, newStatus)
  emit('show-toast', currentLanguage.value === 'kh' ? `បានផ្លាស់ប្តូរស្ថានភាពទៅជា ${newStatus}!` : `Report status updated to ${newStatus}!`)
}

// -------------------------------------------------------------
// DETAIL MODAL
// -------------------------------------------------------------
const selectedDetailReport = ref<FeedbackReport | null>(null)
const isDetailModalOpen = ref(false)

function openDetailModal(r: FeedbackReport) {
  selectedDetailReport.value = r
  isDetailModalOpen.value = true
}

// -------------------------------------------------------------
// DELETE MODAL
// -------------------------------------------------------------
const isDeleteModalOpen = ref(false)
const deletingReport = ref<FeedbackReport | null>(null)

function promptDelete(r: FeedbackReport) {
  deletingReport.value = r
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingReport.value) {
    const id = deletingReport.value.id
    reports.value = reports.value.filter(r => r.id !== id)
    try {
      localStorage.setItem('camlife_feedback_reports', JSON.stringify(reports.value))
    } catch {}
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបរបាយការណ៍ជោគជ័យ!' : 'Report deleted!')
  }
  isDeleteModalOpen.value = false
  deletingReport.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: Total Reports -->
      <div
        @click="selectedStatus = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedStatus === 'All' && !searchQuery
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <MessageSquare class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សរុបទាំងអស់' : 'All Reports' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ totalReportsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'មតិយោបល់ & របាយការណ៍' : 'Citizen Submissions' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: Pending -->
      <div
        @click="selectedStatus = 'pending'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedStatus === 'pending'
            ? 'border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/20'
            : 'border-slate-200/90 hover:border-amber-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Clock class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'រង់ចាំ' : 'Pending' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ pendingReportsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'រង់ចាំការពិនិត្យដោះស្រាយ' : 'Pending Review' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Verified -->
      <div
        @click="selectedStatus = 'verified'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedStatus === 'verified'
            ? 'border-sky-300 ring-2 ring-sky-400/20 bg-sky-50/20'
            : 'border-slate-200/90 hover:border-sky-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BadgeCheck class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-sky-700 bg-sky-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់' : 'Verified' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ verifiedReportsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'បានផ្ទៀងផ្ទាត់ព័ត៌មាន' : 'Verified by Team' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Resolved -->
      <div
        @click="selectedStatus = 'resolved'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedStatus === 'resolved'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <CheckCircle2 class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ដោះស្រាយរួច' : 'Resolved' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">
            {{ resolvedReportsCount }}
          </span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'បានដោះស្រាយជោគជ័យ' : 'Resolved & Closed' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION & FILTER TOOLBAR -->
    <div class="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
      
      <!-- Left: Search & Filter Dropdowns -->
      <div class="flex flex-wrap items-center gap-2 flex-1">
        
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមតិយោបល់, របាយការណ៍, អ៊ីមែល...' : 'Search reports, feedback, email...'"
            class="w-full pl-9 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-khmer shadow-2xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Status Filter Dropdown -->
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'ស្ថានភាពទាំងអស់' : 'All Status' }}</option>
            <option value="pending">{{ currentLanguage === 'kh' ? 'រង់ចាំ (Pending)' : 'Pending' }}</option>
            <option value="verified">{{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់ (Verified)' : 'Verified' }}</option>
            <option value="resolved">{{ currentLanguage === 'kh' ? 'ដោះស្រាយរួច (Resolved)' : 'Resolved' }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

      </div>

      <!-- Right: Summary Tag -->
      <div class="text-xs font-bold text-slate-500 font-khmer shrink-0">
        {{ currentLanguage === 'kh' ? 'របាយការណ៍សរុប' : 'Total Reports' }}: {{ filteredReports.length }}
      </div>

    </div>

    <!-- 3. REPORTS DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[26%]">{{ currentLanguage === 'kh' ? 'សេវាកម្ម & ខ្លឹមសារ' : 'Service & Details' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[18%]">{{ currentLanguage === 'kh' ? 'មូលហេតុ' : 'Reason' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[18%]">{{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contact' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[12%]">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[12%]">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="r in paginatedReports"
              :key="r.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Service Title & Details -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                    <MessageSquare class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <span
                      class="font-bold text-slate-900 block font-khmer leading-tight text-xs group-hover:text-blue-600 transition-colors truncate"
                      :title="r.serviceTitle"
                    >
                      {{ r.serviceTitle }}
                    </span>
                    <span class="text-[9.5px] text-slate-400 block mt-0.5 truncate" :title="r.details">
                      {{ r.details || 'No additional note' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 2. Reason -->
              <td class="py-1.5 px-2.5 align-middle">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200/80 truncate max-w-full" :title="r.reasonLabel">
                  {{ r.reasonLabel }}
                </span>
              </td>

              <!-- 3. Contact Email -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="inline-flex items-center gap-1 text-[11px] text-slate-600 font-medium max-w-full truncate font-mono" :title="r.contactEmail">
                  <Mail class="w-3 h-3 text-slate-400 shrink-0" />
                  <span class="truncate">{{ r.contactEmail || 'Anonymous' }}</span>
                </div>
              </td>

              <!-- 4. Date -->
              <td class="py-1.5 px-2.5 align-middle">
                <span class="text-[11px] text-slate-600 font-mono">
                  {{ r.createdAt ? r.createdAt.substring(0, 10) : '2026-03-01' }}
                </span>
              </td>

              <!-- 5. Status -->
              <td class="py-1.5 px-2.5 align-middle">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs font-khmer',
                    r.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    r.status === 'verified' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      r.status === 'resolved' ? 'bg-emerald-500' :
                      r.status === 'verified' ? 'bg-blue-500' : 'bg-amber-500'
                    ]"
                  ></span>
                  {{ r.status }}
                </span>
              </td>

              <!-- 6. Actions -->
              <td class="py-1.5 px-3 align-middle text-right">
                <div class="flex items-center justify-end gap-1">
                  
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(r)"
                    class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200/60 hover:border-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Resolve toggle -->
                  <button
                    v-if="r.status !== 'resolved'"
                    type="button"
                    @click="handleStatusChange(r.id, 'resolved')"
                    class="w-7 h-7 rounded-lg bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white border border-emerald-200/60 hover:border-emerald-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'ដោះស្រាយ' : 'Mark Resolved'"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(r)"
                    class="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200/60 hover:border-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete Report'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredReports.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញរបាយការណ៍ទេ' : 'No feedback reports found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try adjusting your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedStatus = 'All'"
                    class="mt-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold font-khmer cursor-pointer transition-colors"
                  >
                    {{ currentLanguage === 'kh' ? 'សម្អាតការស្វែងរក' : 'Clear filters' }}
                  </button>
                </div>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <!-- Table Footer with Interactive Pagination Controls -->
      <div class="p-2 sm:p-2.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
        <!-- Showing entries count info -->
        <div class="text-[11px] text-slate-600 font-medium font-khmer">
          {{ currentLanguage === 'kh' 
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredReports.length)} នៃ ${filteredReports.length} របាយការណ៍សរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredReports.length)} of ${filteredReports.length} reports` 
          }}
        </div>

        <div class="flex items-center gap-3">
          <!-- Page size selector -->
          <div class="flex items-center gap-1.5 text-[11px] font-khmer">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'ក្នុងមួយទំព័រ:' : 'Show:' }}</span>
            <select
              v-model="itemsPerPage"
              class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option :value="8">8</option>
              <option :value="10">10</option>
              <option :value="15">15 ({{ currentLanguage === 'kh' ? 'ទាំងអស់' : 'All' }})</option>
            </select>
          </div>

          <!-- Pagination Buttons -->
          <div class="flex items-center gap-1">
            <!-- Previous Button -->
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'មុន' : 'Prev' }}</span>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                @click="goToPage(p)"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center',
                  currentPage === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <span>{{ currentLanguage === 'kh' ? 'បន្ទាប់' : 'Next' }}</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>

    <!-- ======================================================== -->
    <!-- MODAL 1: VIEW FEEDBACK REPORT DETAIL                     -->
    <!-- ======================================================== -->
    <div
      v-if="isDetailModalOpen && selectedDetailReport"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDetailModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 overflow-hidden text-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shadow-2xs">
              <MessageSquare class="w-4 h-4" />
            </div>
            <div>
              <h3 class="text-sm font-bold text-slate-900 font-khmer leading-tight">
                {{ selectedDetailReport.serviceTitle }}
              </h3>
              <p class="text-[10px] text-slate-400 font-mono mt-0.5">ID: {{ selectedDetailReport.id }}</p>
            </div>
          </div>
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="py-4 space-y-3">
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span class="text-[10.5px] text-slate-500 font-khmer block mb-0.5">មូលហេតុ</span>
              <span class="font-bold text-slate-800">{{ selectedDetailReport.reasonLabel }}</span>
            </div>
            <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span class="text-[10.5px] text-slate-500 font-khmer block mb-0.5">ស្ថានភាព</span>
              <span class="font-bold text-emerald-700 capitalize">{{ selectedDetailReport.status }}</span>
            </div>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10.5px] text-slate-500 font-khmer block mb-0.5">ទំនាក់ទំនងពលរដ្ឋ</span>
            <span class="font-bold text-slate-800 font-mono">{{ selectedDetailReport.contactEmail || 'Anonymous' }}</span>
          </div>

          <div class="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80">
            <span class="text-[10.5px] text-slate-500 font-khmer block mb-0.5">ខ្លឹមសារមតិយោបល់លម្អិត</span>
            <p class="text-slate-700 font-khmer leading-relaxed">{{ selectedDetailReport.details || 'No detailed note provided.' }}</p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div class="flex items-center gap-1.5">
            <button
              v-if="selectedDetailReport.status !== 'verified'"
              type="button"
              @click="handleStatusChange(selectedDetailReport.id, 'verified'); selectedDetailReport.status = 'verified'"
              class="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold font-khmer cursor-pointer"
            >
              ផ្ទៀងផ្ទាត់
            </button>
            <button
              v-if="selectedDetailReport.status !== 'resolved'"
              type="button"
              @click="handleStatusChange(selectedDetailReport.id, 'resolved'); selectedDetailReport.status = 'resolved'"
              class="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold font-khmer cursor-pointer"
            >
              ដោះស្រាយ
            </button>
          </div>
          <button
            type="button"
            @click="isDetailModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បិទ' : 'Close' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 2: DELETE CONFIRMATION DIALOG                     -->
    <!-- ======================================================== -->
    <div
      v-if="isDeleteModalOpen && deletingReport"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 text-center">
        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 class="w-5 h-5" />
        </div>

        <h3 class="text-sm font-bold text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកពិតជាចង់លុបរបាយការណ៍នេះ?' : 'Confirm Report Deletion' }}
        </h3>

        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">{{ deletingReport.serviceTitle }}</strong>
          <br />
          {{ currentLanguage === 'kh' ? 'ទិន្នន័យដែលបានលុបនឹងមិនអាចត្រឡប់មកវិញបានទេ។' : 'This feedback record will be permanently deleted.' }}
        </p>

        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-khmer shadow-sm cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'យល់ព្រមលុប' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
