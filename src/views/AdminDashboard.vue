<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle2, Bell, ArrowRight, X } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'
import type { PartnerSubmission } from '@/types'

// Import modular admin components
import AdminHeader from '@/components/admin/AdminHeader.vue'
import AdminSidebar, { type AdminTab } from '@/components/admin/AdminSidebar.vue'
import AdminOverview from '@/components/admin/AdminOverview.vue'
import AdminGovernment from '@/components/admin/AdminGovernment.vue'
import AdminHealthcare from '@/components/admin/AdminHealthcare.vue'
import AdminJobs from '@/components/admin/AdminJobs.vue'
import AdminTransport from '@/components/admin/AdminTransport.vue'
import AdminHomeServices from '@/components/admin/AdminHomeServices.vue'
import AdminOffices from '@/components/admin/AdminOffices.vue'
import AdminNews from '@/components/admin/AdminNews.vue'
import AdminUsers from '@/components/admin/AdminUsers.vue'
import AdminFeedback from '@/components/admin/AdminFeedback.vue'
import AdminSubmissions from '@/components/admin/AdminSubmissions.vue'
import AdminSettings from '@/components/admin/AdminSettings.vue'
import AdminLogs from '@/components/admin/AdminLogs.vue'
import AdminProfileModal from '@/components/admin/AdminProfileModal.vue'

const router = useRouter()
const { currentUser, login, logout } = useAuth()
const { currentLanguage } = useLanguage()

usePageMeta({
  title: 'CamLife Admin CMS — Central Management Portal',
  description: 'Enterprise administration dashboard for CamLife civic services and content.'
})

// Ensure Admin access on mount
onMounted(() => {
  if (!currentUser.value || (currentUser.value.role !== 'Administrator' && currentUser.value.role !== 'Admin')) {
    login({
      name: 'Admin Officer',
      email: 'admin@camlife.gov.kh',
      phone: '012 999 888',
      role: 'Administrator'
    })
  }

  window.addEventListener('camlife-new-submission', handleNewSubmissionEvent)
  window.addEventListener('storage', handleStoragePing)
})

onUnmounted(() => {
  window.removeEventListener('camlife-new-submission', handleNewSubmissionEvent)
  window.removeEventListener('storage', handleStoragePing)
  if (alertTimeout) clearTimeout(alertTimeout)
})

// Layout State
const activeTab = ref<AdminTab>('dashboard')
const isSidebarCollapsed = ref(false)
const isProfileModalOpen = ref(false)
const globalSearchQuery = ref('')

function toggleSidebar() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

function handleSelectTab(tab: string) {
  activeTab.value = tab as AdminTab
}

function handleLogout() {
  logout()
  router.push('/')
}

// Toast Notifications
const toastMessage = ref('')
function triggerToast(msg: string) {
  toastMessage.value = msg
  setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

// Real-Time Partner Submission Alert Banner
interface SubmissionAlert {
  id: string
  titleKh: string
  titleEn: string
  applicant: string
  time: string
  submissionId: string
}
const activeSubmissionAlert = ref<SubmissionAlert | null>(null)
let alertTimeout: any = null

function playNotificationChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioContextClass) return
    const ctx = new AudioContextClass()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15) // A5
    gain.gain.setValueAtTime(0.2, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.35)
  } catch {}
}

function handleNewSubmissionEvent(e: Event) {
  const customEv = e as CustomEvent
  const detail = customEv.detail
  if (detail && detail.submission) {
    const sub = detail.submission as PartnerSubmission
    activeSubmissionAlert.value = {
      id: sub.id,
      titleKh: sub.nameKh,
      titleEn: sub.nameEn,
      applicant: sub.representativeName || sub.location,
      time: 'មុននេះបន្តិច',
      submissionId: sub.id
    }
    playNotificationChime()
    if (alertTimeout) clearTimeout(alertTimeout)
    alertTimeout = setTimeout(() => {
      activeSubmissionAlert.value = null
    }, 9000)
  }
}

function handleStoragePing(e: StorageEvent) {
  if (e.key === 'camlife_last_submission_ping' && e.newValue) {
    try {
      const ping = JSON.parse(e.newValue)
      const raw = localStorage.getItem('camlife_partner_submissions')
      if (raw) {
        const subs = JSON.parse(raw)
        const latest = subs.find((s: any) => s.id === ping.id) || subs[0]
        if (latest) {
          activeSubmissionAlert.value = {
            id: latest.id,
            titleKh: latest.nameKh,
            titleEn: latest.nameEn,
            applicant: latest.representativeName || latest.location,
            time: 'មុននេះបន្តិច',
            submissionId: latest.id
          }
          playNotificationChime()
          if (alertTimeout) clearTimeout(alertTimeout)
          alertTimeout = setTimeout(() => {
            activeSubmissionAlert.value = null
          }, 9000)
        }
      }
    } catch {}
  }
}

function reviewSubmission() {
  activeTab.value = 'submissions'
  activeSubmissionAlert.value = null
}
</script>

<template>
  <div class="h-screen w-screen flex bg-[#F8FAFC] text-slate-800 antialiased overflow-hidden select-none">
    
    <!-- LEFT NAVIGATION SIDEBAR (Full height h-screen matching mockup) -->
    <AdminSidebar
      :active-tab="activeTab"
      :collapsed="isSidebarCollapsed"
      @select-tab="handleSelectTab"
      @toggle-sidebar="toggleSidebar"
      @logout="handleLogout"
      @open-profile="isProfileModalOpen = true"
    />

    <!-- RIGHT CONTENT AREA -->
    <div class="flex-1 flex flex-col h-screen min-w-0 overflow-hidden">
      <!-- TOP HEADER (Always shown for unified navigation, Admin Role badge, and search) -->
      <AdminHeader
        :active-tab="activeTab"
        :sidebar-collapsed="isSidebarCollapsed"
        v-model:search-query="globalSearchQuery"
        @toggle-sidebar="toggleSidebar"
        @navigate="handleSelectTab"
        @open-profile="isProfileModalOpen = true"
      />

      <!-- MAIN VIEWPORT (Clean, responsive single-screen layout across all admin tabs) -->
      <main class="flex-1 min-h-0 p-2.5 sm:p-3 lg:p-3.5 xl:p-4 overflow-y-auto lg:overflow-hidden flex flex-col">
        
        <!-- Tab 1: Overview Dashboard (Single Screen View) -->
        <AdminOverview
          v-if="activeTab === 'dashboard'"
          class="flex-1 min-h-0"
          @navigate="handleSelectTab"
          @show-toast="triggerToast"
        />

        <!-- Tab 2: Government Services (Single Screen View with Pagination) -->
        <AdminGovernment
          v-else-if="activeTab === 'government'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 3: Healthcare & Hospitals (Single Screen View with Pagination) -->
        <AdminHealthcare
          v-else-if="activeTab === 'health'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 4: Jobs & Careers (Single Screen View with Pagination) -->
        <AdminJobs
          v-else-if="activeTab === 'jobs'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 5: Transport & Transit (Single Screen View with Pagination) -->
        <AdminTransport
          v-else-if="activeTab === 'transport'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 6: Home Services & Specialists (Single Screen View with Pagination) -->
        <AdminHomeServices
          v-else-if="activeTab === 'homeservices'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 7: Public Offices & OWSO (Single Screen View with Pagination) -->
        <AdminOffices
          v-else-if="activeTab === 'offices'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 8: News & Bulletins (Single Screen View with Pagination) -->
        <AdminNews
          v-else-if="activeTab === 'news'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 9: Users & Roles (Single Screen View with Pagination) -->
        <AdminUsers
          v-else-if="activeTab === 'users'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 10: Feedback & Reports (Single Screen View with Pagination) -->
        <AdminFeedback
          v-else-if="activeTab === 'feedback'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 11: Partner Submissions (Approval Portal) -->
        <AdminSubmissions
          v-else-if="activeTab === 'submissions'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 11: Settings (Single Screen Executive Layout) -->
        <AdminSettings
          v-else-if="activeTab === 'settings'"
          class="flex-1 min-h-0"
          @show-toast="triggerToast"
        />

        <!-- Tab 12: Admin Audit Logs (Single Screen View with Pagination) -->
        <AdminLogs
          v-else-if="activeTab === 'logs'"
          class="flex-1 min-h-0"
        />

      </main>

    </div>

    <!-- REAL-TIME SUBMISSION ALERT BANNER (លោតសារប្រាប់ Admin ពេលមានគេស្នើសុំ) -->
    <transition name="toast">
      <div
        v-if="activeSubmissionAlert"
        class="fixed top-16 right-4 sm:right-6 z-50 max-w-sm sm:max-w-md bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-3.5 sm:p-4 rounded-2xl shadow-2xl border border-blue-500/50 flex items-start gap-3 backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300 ring-4 ring-blue-500/20"
      >
        <div class="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-md">
          <Bell class="w-4 h-4 text-slate-950 animate-bounce" />
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full ring-2 ring-white animate-ping"></span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-1.5 leading-none mb-1">
            <span class="text-[10px] font-black uppercase tracking-wider text-amber-300 font-khmer flex items-center gap-1">
              <span>🔔</span>
              <span>{{ currentLanguage === 'kh' ? 'មានពាក្យស្នើសុំដៃគូថ្មី!' : 'New Partner Application!' }}</span>
            </span>
          </div>
          <h4 class="text-xs sm:text-sm font-bold text-white font-khmer truncate">
            {{ currentLanguage === 'kh' ? activeSubmissionAlert.titleKh : activeSubmissionAlert.titleEn }}
          </h4>
          <p class="text-[10px] text-slate-300 mt-0.5 truncate font-khmer">
            {{ currentLanguage === 'kh' ? 'អ្នកតំណាង៖' : 'Applicant:' }} {{ activeSubmissionAlert.applicant }}
          </p>
          <div class="mt-2.5 flex items-center gap-2">
            <button
              type="button"
              @click="reviewSubmission"
              class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold font-khmer shadow-sm flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>{{ currentLanguage === 'kh' ? 'ពិនិត្យមើលឥឡូវនេះ' : 'Review Now' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              @click="activeSubmissionAlert = null"
              class="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-[11px] font-bold font-khmer transition-colors cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បិទ' : 'Dismiss' }}
            </button>
          </div>
        </div>
        <button
          type="button"
          @click="activeSubmissionAlert = null"
          class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors shrink-0"
          title="Close"
        >
          <X class="w-4 h-4" />
        </button>
      </div>
    </transition>

    <!-- FLOATING TOAST NOTIFICATION -->
    <transition name="toast">
      <div
        v-if="toastMessage"
        class="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold font-khmer animate-in fade-in slide-in-from-bottom-3 duration-200"
      >
        <CheckCircle2 class="w-4 h-4 text-emerald-400 shrink-0" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

    <!-- ADMIN PROFILE MODAL -->
    <AdminProfileModal
      :is-open="isProfileModalOpen"
      @close="isProfileModalOpen = false"
      @saved="triggerToast"
    />

  </div>
</template>

<style scoped>
.scrollbar-thin {
  -ms-overflow-style: none !important;
  scrollbar-width: none !important;
}
.scrollbar-thin::-webkit-scrollbar {
  display: none !important;
  width: 0 !important;
  height: 0 !important;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
