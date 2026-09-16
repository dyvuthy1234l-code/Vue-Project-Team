<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { CheckCircle2 } from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { usePageMeta } from '@/composables/usePageMeta'

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
