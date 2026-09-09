<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  MessageSquare,
  Search,
  Mail
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useFeedback } from '@/composables/useFeedback'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()
const { reports, updateReportStatus } = useFeedback()

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
      r.reasonLabel.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })
})

function handleStatusChange(id: string, newStatus: 'pending' | 'verified' | 'resolved') {
  updateReportStatus(id, newStatus)
  emit('show-toast', currentLanguage.value === 'kh' ? `បានផ្លាស់ប្តូរស្ថានភាពទៅជា ${newStatus}!` : `Report status updated to ${newStatus}!`)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Action Bar -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមតិយោបល់, របាយការណ៍...' : 'Search reports, feedback...'"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer"
          />
        </div>
        <select
          v-model="selectedStatus"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer capitalize"
        >
          <option value="All">{{ currentLanguage === 'kh' ? 'ស្ថានភាពទាំងអស់' : 'All Status' }}</option>
          <option value="pending">Pending</option>
          <option value="verified">Verified</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div class="text-xs font-bold text-slate-500 font-khmer">
        {{ currentLanguage === 'kh' ? 'របាយការណ៍សរុប' : 'Total Reports' }}: {{ filteredReports.length }}
      </div>
    </div>

    <!-- Reports Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'សេវាកម្មពាក់ព័ន្ធ' : 'Service' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'មូលហេតុ' : 'Reason' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contact' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Action' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="r in filteredReports" :key="r.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <MessageSquare class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer max-w-[220px] truncate">
                      {{ r.serviceTitle }}
                    </span>
                    <span class="text-[10px] text-slate-400 block max-w-[220px] truncate">{{ r.details }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                {{ r.reasonLabel }}
              </td>
              <td class="py-3 px-4 text-slate-600">
                <span class="inline-flex items-center gap-1">
                  <Mail class="w-3 h-3 text-slate-400" />
                  {{ r.contactEmail || 'Anonymous' }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-400 text-[11px]">
                {{ r.createdAt.substring(0, 10) }}
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize',
                    r.status === 'resolved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    r.status === 'verified' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  ]"
                >
                  {{ r.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <div class="inline-flex items-center gap-1">
                  <button
                    v-if="r.status !== 'resolved'"
                    type="button"
                    @click="handleStatusChange(r.id, 'resolved')"
                    class="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[11px] font-bold rounded-lg border border-emerald-200 cursor-pointer font-khmer"
                  >
                    ដោះស្រាយ
                  </button>
                  <button
                    v-if="r.status === 'pending'"
                    type="button"
                    @click="handleStatusChange(r.id, 'verified')"
                    class="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg border border-blue-200 cursor-pointer font-khmer"
                  >
                    ផ្ទៀងផ្ទាត់
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
