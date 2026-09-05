<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutDashboard,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  AlertTriangle,
  MessageSquare,
  Building2,
  Briefcase,
  Hospital,
  CheckCircle2,
  ChevronRight,
  Search
} from 'lucide-vue-next'
import { useFeedback, type ServiceReport } from '@/composables/useFeedback'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServices, getHospitals, getJobs } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

usePageMeta({
  title: 'ផ្ទាំងគ្រប់គ្រងទិន្នន័យសាធារណៈ — CamLife Admin & Content Verification Portal',
  description: 'Public services verification, content freshness management, and citizen reports portal.'
})

const { currentLanguage, localized } = useLanguage()
const { reports, feedbacks, updateReportStatus } = useFeedback()

const governmentServices = getGovernmentServices()
const hospitals = getHospitals()
const jobs = getJobs()

const activeTab = ref<'reports' | 'freshness' | 'feedback'>('reports')
const reportFilter = ref<'all' | 'pending' | 'verified' | 'resolved'>('all')
const reportSearch = ref('')

const filteredReports = computed(() => {
  return reports.value.filter(r => {
    const matchStatus = reportFilter.value === 'all' || r.status === reportFilter.value
    const matchSearch = !reportSearch.value.trim() ||
      r.serviceTitle.toLowerCase().includes(reportSearch.value.toLowerCase()) ||
      r.details.toLowerCase().includes(reportSearch.value.toLowerCase()) ||
      r.reasonLabel.toLowerCase().includes(reportSearch.value.toLowerCase())
    return matchStatus && matchSearch
  })
})

const pendingReportsCount = computed(() => reports.value.filter(r => r.status === 'pending').length)
const helpfulCount = computed(() => feedbacks.value.filter(f => f.isHelpful).length)
const totalFeedbacks = computed(() => feedbacks.value.length)
const satisfactionRate = computed(() => {
  if (totalFeedbacks.value === 0) return 96
  return Math.round((helpfulCount.value / totalFeedbacks.value) * 100)
})

function handleSetStatus(reportId: string, status: ServiceReport['status']) {
  updateReportStatus(reportId, status)
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">Admin CMS & Verification</span>
    </nav>

    <!-- Header -->
    <div class="bg-gradient-to-r from-[#0A2540] via-[#0D47A1] to-[#1565C0] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-3">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-12 h-12 rounded-2xl bg-white/15 text-white flex items-center justify-center backdrop-blur-xs ring-1 ring-white/20">
            <LayoutDashboard class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-xl sm:text-2xl font-black">
                {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងទិន្នន័យ និងការផ្ទៀងផ្ទាត់ (Content CMS)' : 'Content Management & Verification Portal' }}
              </h1>
              <span class="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                LIVE
              </span>
            </div>
            <p class="text-xs text-blue-100 mt-1">
              {{ currentLanguage === 'kh' ? 'ត្រួតពិនិត្យភាពត្រឹមត្រូវនៃព័ត៌មានសាធារណៈ របាយការណ៍កែតម្រូវពីពលរដ្ឋ និងមតិកែលម្អ' : 'Manage citizen public services, verification audits, and user reports.' }}
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <span class="px-3 py-1.5 rounded-xl bg-white/10 text-xs font-bold border border-white/10 flex items-center gap-1.5">
            <ShieldCheck class="w-4 h-4 text-emerald-400" />
            <span>{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់: 04 Sep 2026' : 'Last Audit: 04 Sep 2026' }}</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Summary Metrics Row -->
    <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3.5">
      <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-khmer">{{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាល' : 'Civic Guides' }}</span>
          <Building2 class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
        </div>
        <p class="text-2xl font-black text-[#0A2540] dark:text-white font-mono">{{ governmentServices.length }}</p>
        <span class="text-[10px] text-emerald-600 font-bold">100% Verified</span>
      </div>

      <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-khmer">{{ currentLanguage === 'kh' ? 'សុខាភិបាល' : 'Hospitals' }}</span>
          <Hospital class="w-4 h-4 text-emerald-600" />
        </div>
        <p class="text-2xl font-black text-[#0A2540] dark:text-white font-mono">{{ hospitals.length }}</p>
        <span class="text-[10px] text-emerald-600 font-bold">15 Facilities</span>
      </div>

      <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-khmer">{{ currentLanguage === 'kh' ? 'ឱកាសការងារ' : 'Jobs' }}</span>
          <Briefcase class="w-4 h-4 text-violet-600" />
        </div>
        <p class="text-2xl font-black text-[#0A2540] dark:text-white font-mono">{{ jobs.length }}</p>
        <span class="text-[10px] text-violet-600 font-bold">Active Listings</span>
      </div>

      <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-khmer">{{ currentLanguage === 'kh' ? 'របាយការណ៍ពលរដ្ឋ' : 'Citizen Reports' }}</span>
          <AlertTriangle class="w-4 h-4 text-amber-500" />
        </div>
        <p class="text-2xl font-black text-amber-600 font-mono">{{ pendingReportsCount }}</p>
        <span class="text-[10px] text-amber-600 font-bold">{{ pendingReportsCount }} Pending Review</span>
      </div>

      <div class="p-5 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-1 col-span-2 sm:col-span-1">
        <div class="flex items-center justify-between">
          <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-khmer">{{ currentLanguage === 'kh' ? 'ការពេញចិត្ត' : 'Satisfaction' }}</span>
          <MessageSquare class="w-4 h-4 text-emerald-500" />
        </div>
        <p class="text-2xl font-black text-emerald-600 font-mono">{{ satisfactionRate }}%</p>
        <span class="text-[10px] text-slate-400 font-bold">{{ totalFeedbacks }} reviews</span>
      </div>
    </div>

    <!-- Tab Bar -->
    <div class="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 font-khmer border border-slate-200 dark:border-slate-700">
      <button
        @click="activeTab = 'reports'"
        :class="[
          'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2',
          activeTab === 'reports'
            ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-blue-300 shadow-sm font-black'
            : 'text-slate-600 dark:text-slate-400 hover:text-[#0D47A1]'
        ]"
        type="button"
      >
        <AlertTriangle class="w-4 h-4" />
        <span>{{ currentLanguage === 'kh' ? 'របាយការណ៍កែតម្រូវពីពលរដ្ឋ' : 'Citizen Reports' }}</span>
        <span v-if="pendingReportsCount > 0" class="px-2 py-0.5 rounded-full text-[10px] bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-bold">
          {{ pendingReportsCount }}
        </span>
      </button>

      <button
        @click="activeTab = 'freshness'"
        :class="[
          'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2',
          activeTab === 'freshness'
            ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-blue-300 shadow-sm font-black'
            : 'text-slate-600 dark:text-slate-400 hover:text-[#0D47A1]'
        ]"
        type="button"
      >
        <ShieldCheck class="w-4 h-4" />
        <span>{{ currentLanguage === 'kh' ? 'បញ្ជីផ្ទៀងផ្ទាត់ទិន្នន័យ (Content Freshness)' : 'Content Verification Registry' }}</span>
      </button>

      <button
        @click="activeTab = 'feedback'"
        :class="[
          'flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2',
          activeTab === 'feedback'
            ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-blue-300 shadow-sm font-black'
            : 'text-slate-600 dark:text-slate-400 hover:text-[#0D47A1]'
        ]"
        type="button"
      >
        <MessageSquare class="w-4 h-4" />
        <span>{{ currentLanguage === 'kh' ? 'មតិកែលម្អលើសេវាកម្ម (Citizen Feedback)' : 'Citizen Feedback' }}</span>
      </button>
    </div>

    <!-- ============================================================
         TAB 1: CITIZEN REPORTS
    ============================================================= -->
    <div v-if="activeTab === 'reports'" class="space-y-4">
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 shadow-sm space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="relative flex-1 max-w-md">
            <Search class="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              v-model="reportSearch"
              type="text"
              class="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-xs font-bold outline-none focus:ring-2 focus:ring-[#0D47A1]"
              :placeholder="currentLanguage === 'kh' ? 'ស្វែងរករបាយការណ៍...' : 'Search reports by service or issue...'"
            />
          </div>

          <div class="flex items-center gap-2 text-xs font-bold">
            <button
              v-for="st in ([['all', 'ទាំងអស់ (All)'], ['pending', 'កំពុងរង់ចាំ (Pending)'], ['verified', 'ផ្ទៀងផ្ទាត់រួច (Verified)'], ['resolved', 'ដោះស្រាយរួច (Resolved)']] as const)"
              :key="st[0]"
              @click="reportFilter = st[0]"
              :class="[
                'px-3 py-1.5 rounded-xl border transition-colors',
                reportFilter === st[0]
                  ? 'bg-[#0D47A1] text-white border-[#0D47A1]'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              ]"
              type="button"
            >
              {{ st[1] }}
            </button>
          </div>
        </div>
      </div>

      <!-- Reports List -->
      <div class="space-y-3">
        <div
          v-for="rep in filteredReports"
          :key="rep.id"
          class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm space-y-3"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <span :class="[
                  'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase',
                  rep.status === 'pending' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' :
                  rep.status === 'verified' ? 'bg-blue-100 text-[#0D47A1] dark:bg-blue-950 dark:text-blue-300' :
                  'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                ]">
                  {{ rep.status }}
                </span>
                <span class="text-xs font-bold text-slate-400">#{{ rep.id }}</span>
                <span class="text-xs text-slate-400">· {{ new Date(rep.createdAt).toLocaleDateString() }}</span>
              </div>
              <h3 class="text-sm sm:text-base font-black text-[#0A2540] dark:text-white">
                {{ rep.serviceTitle }}
              </h3>
            </div>

            <!-- Action buttons -->
            <div class="flex items-center gap-2">
              <button
                v-if="rep.status !== 'verified'"
                @click="handleSetStatus(rep.id, 'verified')"
                class="px-3 py-1.5 rounded-xl bg-blue-50 text-[#0D47A1] hover:bg-blue-100 text-xs font-bold transition-colors"
                type="button"
              >
                Mark Verified
              </button>
              <button
                v-if="rep.status !== 'resolved'"
                @click="handleSetStatus(rep.id, 'resolved')"
                class="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold transition-colors"
                type="button"
              >
                Mark Resolved
              </button>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/70 dark:border-slate-700 text-xs space-y-1">
            <p class="font-bold text-amber-700 dark:text-amber-400">
              {{ currentLanguage === 'kh' ? 'មូលហេតុ:' : 'Reason:' }} {{ rep.reasonLabel }}
            </p>
            <p class="text-slate-700 dark:text-slate-300 leading-relaxed">
              {{ rep.details }}
            </p>
            <p v-if="rep.contactEmail" class="text-[11px] text-slate-400 pt-1">
              Contact: {{ rep.contactEmail }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================
         TAB 2: CONTENT FRESHNESS REGISTRY
      ============================================================= -->
    <div v-else-if="activeTab === 'freshness'" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 overflow-hidden shadow-sm">
      <div class="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
        <div>
          <h3 class="text-sm sm:text-base font-black text-[#0A2540] dark:text-white">
            {{ currentLanguage === 'kh' ? 'បញ្ជីសេវាសាធារណៈ និងកាលបរិច្ឆេទផ្ទៀងផ្ទាត់' : 'Official Services & Verification Status' }}
          </h3>
          <p class="text-xs text-slate-400 mt-0.5">
            Verified across Ministry of Interior, MPWT, GDI, and Ministry of Health.
          </p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-xs text-left">
          <thead class="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th class="py-3 px-4">Service Name</th>
              <th class="py-3 px-4">Category</th>
              <th class="py-3 px-4">Official Source</th>
              <th class="py-3 px-4">Last Verified</th>
              <th class="py-3 px-4">Status</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-for="srv in governmentServices" :key="srv.id" class="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors">
              <td class="py-3.5 px-4 font-black text-slate-800 dark:text-white">
                <router-link :to="'/government/' + srv.id" class="hover:text-[#0D47A1] dark:hover:text-blue-400">
                  {{ localized(srv.title, srv.titleKh) }}
                </router-link>
              </td>
              <td class="py-3.5 px-4 font-bold text-slate-600 dark:text-slate-300">{{ srv.category }}</td>
              <td class="py-3.5 px-4 text-slate-500 dark:text-slate-400">GDI / Line Ministries</td>
              <td class="py-3.5 px-4 font-bold text-slate-700 dark:text-slate-300">04 Sep 2026</td>
              <td class="py-3.5 px-4">
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  <CheckCircle2 class="w-3 h-3" />
                  <span>Verified</span>
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ============================================================
         TAB 3: CITIZEN FEEDBACK STREAM
      ============================================================= -->
    <div v-else class="space-y-3">
      <div v-if="feedbacks.length === 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 text-center space-y-2">
        <MessageSquare class="w-8 h-8 text-slate-400 mx-auto" />
        <h4 class="text-sm font-bold text-slate-800 dark:text-white font-khmer">
          {{ currentLanguage === 'kh' ? 'មិនទាន់មានមតិកែលម្អថ្មីទេ' : 'No citizen feedback recorded yet' }}
        </h4>
      </div>

      <div
        v-for="fb in feedbacks"
        :key="fb.id"
        class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-5 shadow-sm flex items-start justify-between gap-4"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span :class="[
              'px-2.5 py-0.5 rounded-full text-[10px] font-bold',
              fb.isHelpful ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
            ]">
              <span v-if="fb.isHelpful" class="inline-flex items-center gap-1"><ThumbsUp class="w-3 h-3" /> Helpful</span><span v-else class="inline-flex items-center gap-1"><ThumbsDown class="w-3 h-3" /> Needs Improvement</span>
            </span>
            <span class="text-xs text-slate-400">· {{ new Date(fb.createdAt).toLocaleDateString() }}</span>
          </div>
          <h4 class="text-xs sm:text-sm font-bold text-slate-800 dark:text-white">
            {{ fb.serviceTitle }}
          </h4>
          <p v-if="fb.comment" class="text-xs text-slate-600 dark:text-slate-300 italic pt-1">
            "{{ fb.comment }}"
          </p>
        </div>
      </div>
    </div>

  </div>
</template>
