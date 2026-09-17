<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  FileText,
  Briefcase,
  Newspaper,
  UserPlus,
  User as UserIcon,
  Crown,
  Settings,
  LogOut,
  ExternalLink
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useAuth } from '@/composables/useAuth'
import {
  getAdminNotifications,
  saveAdminNotifications,
  type AdminNotification
} from '@/composables/usePartnerSubmissions'

const props = defineProps<{
  activeTab?: string
  sidebarCollapsed?: boolean
  searchQuery?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'update:searchQuery', val: string): void
  (e: 'navigate', tab: string): void
  (e: 'open-profile'): void
}>()

const router = useRouter()
const { currentLanguage, setLanguage } = useLanguage()
const { currentUser, logout } = useAuth()

const isNotifOpen = ref(false)
const isQuickActionsOpen = ref(false)
const isProfileOpen = ref(false)

function handleOpenProfile() {
  isProfileOpen.value = false
  emit('open-profile')
}

function handleLogout() {
  isProfileOpen.value = false
  logout()
  router.push('/')
}

const tabLabels: Record<string, { kh: string; en: string }> = {
  dashboard: { kh: 'ផ្ទាំងគ្រប់គ្រងទូទៅ', en: 'Overview Dashboard' },
  government: { kh: 'សេវារដ្ឋបាលសាធារណៈ', en: 'Government Services' },
  health: { kh: 'សុខាភិបាល & មន្ទីរពេទ្យ', en: 'Healthcare & Hospitals' },
  jobs: { kh: 'ឱកាសការងារជាតិ', en: 'Jobs & Careers' },
  transport: { kh: 'ដឹកជញ្ជូន & ផ្លូវរថភ្លើង', en: 'Transport & Transit' },
  homeservices: { kh: 'សេវាកម្មជួសជុលគេហដ្ឋាន', en: 'Home Services' },
  offices: { kh: 'ការិយាល័យច្រកចេញចូលតែមួយ', en: 'Offices & OWSO' },
  news: { kh: 'ព័ត៌មាន & សេចក្តីជូនដំណឹង', en: 'News & Bulletins' },
  submissions: { kh: 'សំណើសុំចុះបញ្ជីដៃគូ', en: 'Partner Submissions' },
  users: { kh: 'អ្នកប្រើប្រាស់ & តួនាទី', en: 'Users & Roles' },
  feedback: { kh: 'មតិយោបល់ & របាយការណ៍', en: 'Feedback & Reports' },
  settings: { kh: 'ការកំណត់ប្រព័ន្ធ', en: 'System Settings' },
  logs: { kh: 'កំណត់ហេតុសវនកម្ម', en: 'Audit Logs' }
}

const currentTabTitle = computed(() => {
  const key = props.activeTab || 'dashboard'
  return tabLabels[key] || { kh: 'ផ្ទាំងគ្រប់គ្រង', en: 'Dashboard' }
})

const notifications = ref<AdminNotification[]>(getAdminNotifications())

function loadNotifs() {
  notifications.value = getAdminNotifications()
}

onMounted(() => {
  loadNotifs()
  window.addEventListener('camlife-admin-notifs-updated', loadNotifs)
  window.addEventListener('camlife-new-submission', loadNotifs)
  window.addEventListener('storage', loadNotifs)
})

onUnmounted(() => {
  window.removeEventListener('camlife-admin-notifs-updated', loadNotifs)
  window.removeEventListener('camlife-new-submission', loadNotifs)
  window.removeEventListener('storage', loadNotifs)
})

const unreadCount = computed(() => notifications.value.filter(n => n.unread).length)

function markAllAsRead() {
  notifications.value.forEach(n => { n.unread = false })
  saveAdminNotifications(notifications.value)
}

function handleNotificationClick(item: AdminNotification) {
  item.unread = false
  saveAdminNotifications(notifications.value)
  isNotifOpen.value = false
  emit('navigate', item.tab || 'submissions')
}

function handleQuickAction(tab: string) {
  isQuickActionsOpen.value = false
  emit('navigate', tab)
}
</script>

<template>
  <header class="h-14 bg-white border-b border-slate-200/90 px-3 sm:px-5 flex items-center justify-between shrink-0 z-30 shadow-xs select-none">
    
    <!-- 1. LEFT: Breadcrumb Navigation + Mobile Sidebar Toggle -->
    <div class="flex items-center gap-2.5 sm:gap-3 shrink-0">
      <button
        type="button"
        @click="emit('toggle-sidebar')"
        class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/90 transition-colors cursor-pointer shrink-0 shadow-2xs"
        title="Toggle Sidebar"
      >
        <Menu class="w-4 h-4" />
      </button>

      <!-- Breadcrumbs -->
      <div class="flex items-center gap-1.5 text-xs">
        <span class="font-extrabold text-slate-400 font-khmer tracking-tight">
          {{ currentLanguage === 'kh' ? 'ប្រព័ន្ធគ្រប់គ្រង' : 'Admin CMS' }}
        </span>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300" />
        <span class="font-bold text-slate-900 font-khmer flex items-center gap-1.5">
          {{ currentLanguage === 'kh' ? currentTabTitle.kh : currentTabTitle.en }}
        </span>
      </div>
    </div>

    <!-- 2. CENTER: Search Input -->
    <div class="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-6">
      <div class="relative w-full">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវា, ការងារ, មាតិកា, អ្នកប្រើ...' : 'Search services, jobs, content, users...'"
          class="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-khmer shadow-2xs"
        />
      </div>
    </div>

    <!-- 3. RIGHT: Quick Action, Admin Role Badge, Language, Notifications, Profile -->
    <div class="flex items-center gap-2 sm:gap-2.5 shrink-0">
      
      <!-- Quick Actions Dropdown ("+ បង្កើតថ្មី") -->
      <div class="relative hidden sm:block">
        <button
          type="button"
          @click="isQuickActionsOpen = !isQuickActionsOpen"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold font-khmer shadow-xs transition-all cursor-pointer"
        >
          <Plus class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'បង្កើតថ្មី' : 'New Action' }}</span>
        </button>

        <!-- BACKDROP FOR QUICK ACTIONS -->
        <div
          v-if="isQuickActionsOpen"
          @click="isQuickActionsOpen = false"
          class="fixed inset-0 z-40"
        ></div>

        <div
          v-if="isQuickActionsOpen"
          class="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div class="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-khmer">
            {{ currentLanguage === 'kh' ? 'សកម្មភាពរហ័ស' : 'Quick Actions' }}
          </div>
          <button
            type="button"
            @click="handleQuickAction('government')"
            class="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-khmer"
          >
            <FileText class="w-4 h-4 text-blue-600" />
            <span>{{ currentLanguage === 'kh' ? 'បន្ថែមសេវារដ្ឋបាល' : 'Add Government Service' }}</span>
          </button>
          <button
            type="button"
            @click="handleQuickAction('jobs')"
            class="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-khmer"
          >
            <Briefcase class="w-4 h-4 text-emerald-600" />
            <span>{{ currentLanguage === 'kh' ? 'ផ្សាយការងារថ្មី' : 'Post Job Listing' }}</span>
          </button>
          <button
            type="button"
            @click="handleQuickAction('news')"
            class="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-khmer"
          >
            <Newspaper class="w-4 h-4 text-rose-600" />
            <span>{{ currentLanguage === 'kh' ? 'ចុះផ្សាយព័ត៌មាន' : 'Publish News' }}</span>
          </button>
          <button
            type="button"
            @click="handleQuickAction('users')"
            class="w-full px-3 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors cursor-pointer font-khmer border-t border-slate-100 mt-1 pt-2"
          >
            <UserPlus class="w-4 h-4 text-purple-600" />
            <span>{{ currentLanguage === 'kh' ? 'គ្រប់គ្រងអ្នកប្រើ & តួនាទី' : 'Manage Users & Roles' }}</span>
          </button>
        </div>
      </div>

      <!-- Bilingual Toggle Button: ខ្មែរ ~ English -->
      <div class="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          @click="setLanguage('kh')"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 font-khmer cursor-pointer',
            currentLanguage === 'kh'
              ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          title="ភាសាខ្មែរ"
        >
          <span>🇰🇭 ខ្មែរ</span>
        </button>
        <button
          type="button"
          @click="setLanguage('en')"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer',
            currentLanguage === 'en'
              ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          title="English"
        >
          <span>🇬🇧 EN</span>
        </button>
      </div>

      <!-- Enhanced Notification Bell Icon -->
      <div class="relative">
        <button
          type="button"
          @click="isNotifOpen = !isNotifOpen"
          class="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          title="Notifications"
        >
          <Bell class="w-4 h-4" />
          <span v-if="unreadCount > 0" class="absolute -top-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-black items-center justify-center ring-2 ring-white shadow-2xs">
              {{ unreadCount }}
            </span>
          </span>
        </button>

        <!-- BACKDROP FOR NOTIFICATIONS -->
        <div
          v-if="isNotifOpen"
          @click="isNotifOpen = false"
          class="fixed inset-0 z-40"
        ></div>

        <!-- Notification Popover -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div class="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 font-khmer">
              {{ currentLanguage === 'kh' ? 'ការជូនដំណឹង' : 'Notifications' }} ({{ unreadCount }})
            </span>
            <button
              type="button"
              @click="markAllAsRead"
              class="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline font-khmer"
            >
              {{ currentLanguage === 'kh' ? 'សម្គាល់ថាបានអានទាំងអស់' : 'Mark all read' }}
            </button>
          </div>
          <div class="max-h-64 overflow-y-auto divide-y divide-slate-50">
            <div
              v-for="item in notifications"
              :key="item.id"
              @click="handleNotificationClick(item)"
              class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 transition-colors group"
            >
              <div
                class="w-2 h-2 rounded-full mt-1.5 shrink-0 transition-colors"
                :class="item.unread ? 'bg-blue-600 ring-2 ring-blue-100' : 'bg-slate-300'"
              ></div>
              <div class="flex-1 min-w-0">
                <p
                  :class="[
                    'text-xs truncate font-khmer',
                    item.unread ? 'font-bold text-slate-900 group-hover:text-blue-600' : 'text-slate-600 font-normal'
                  ]"
                >
                  {{ currentLanguage === 'kh' ? (item.titleKh || item.title) : (item.titleEn || item.title) }}
                </p>
                <div class="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 font-mono">
                  <span>{{ item.time }}</span>
                  <span>•</span>
                  <span class="text-blue-600 font-sans uppercase text-[9px] font-bold">{{ item.tab }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PROMINENT ROLE ADMIN PROFILE BADGE & DROPDOWN -->
      <div class="relative pl-2 border-l border-slate-200">
        <button
          type="button"
          @click="isProfileOpen = !isProfileOpen; isNotifOpen = false; isQuickActionsOpen = false"
          class="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
          :title="currentLanguage === 'kh' ? 'គណនីអភិបាល' : 'Admin Profile'"
          aria-haspopup="true"
          :aria-expanded="isProfileOpen"
        >
          <div class="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-700 to-blue-900 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100 shrink-0 group-hover:scale-105 transition-transform">
            <Crown class="w-4 h-4 text-amber-300" />
            <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white" title="Active"></span>
          </div>
          <div class="hidden lg:flex flex-col text-left leading-tight">
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-slate-900 font-khmer group-hover:text-blue-600 transition-colors">
                {{ currentUser?.name || (currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋបាល' : 'Admin Officer') }}
              </span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200 font-khmer">
                {{ currentLanguage === 'kh' ? 'អភិបាល' : 'Admin' }}
              </span>
            </div>
            <span class="text-[10px] text-slate-400 font-medium font-khmer mt-0.5 truncate max-w-[130px]">
              {{ currentUser?.email || 'admin@camlife.gov.kh' }}
            </span>
          </div>
          <ChevronDown
            class="w-3.5 h-3.5 text-slate-400 transition-transform duration-200 hidden lg:block"
            :class="isProfileOpen ? 'rotate-180 text-blue-600' : ''"
          />
        </button>

        <!-- BACKDROP FOR CLOSING DROPDOWN -->
        <div
          v-if="isProfileOpen"
          @click="isProfileOpen = false"
          class="fixed inset-0 z-40"
        ></div>

        <!-- PROFILE DROPDOWN POPOVER -->
        <div
          v-if="isProfileOpen"
          class="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150 font-khmer"
        >
          <!-- User Summary Card -->
          <div class="p-3 bg-gradient-to-br from-slate-50 to-blue-50/60 rounded-xl border border-slate-150 mb-1.5">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 font-black text-sm flex items-center justify-center shadow-xs shrink-0">
                {{ (currentUser?.name || 'A').charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0 flex-1">
                <div class="text-xs font-bold text-slate-900 truncate">
                  {{ currentUser?.name || 'Admin Officer' }}
                </div>
                <div class="text-[10.5px] text-slate-500 truncate font-mono">
                  {{ currentUser?.email || 'admin@camlife.gov.kh' }}
                </div>
                <div class="inline-flex items-center gap-1 mt-1 text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.2 rounded border border-purple-200">
                  <ShieldCheck class="w-2.5 h-2.5" />
                  <span>{{ currentLanguage === 'kh' ? 'សិទ្ធិគ្រប់គ្រងកំពូល' : 'Super Administrator' }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="space-y-0.5">
            <button
              type="button"
              @click="handleOpenProfile"
              class="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <UserIcon class="w-4 h-4 text-blue-600" />
              <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានគណនី (Profile)' : 'Admin Profile' }}</span>
            </button>

            <button
              type="button"
              @click="emit('navigate', 'settings'); isProfileOpen = false"
              class="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <Settings class="w-4 h-4 text-slate-500" />
              <span>{{ currentLanguage === 'kh' ? 'ការកំណត់ប្រព័ន្ធ' : 'System Settings' }}</span>
            </button>

            <button
              type="button"
              @click="emit('navigate', 'logs'); isProfileOpen = false"
              class="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <ShieldCheck class="w-4 h-4 text-emerald-600" />
              <span>{{ currentLanguage === 'kh' ? 'កំណត់ហេតុសវនកម្ម' : 'Audit Logs' }}</span>
            </button>

            <router-link
              to="/"
              @click="isProfileOpen = false"
              class="w-full px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
            >
              <ExternalLink class="w-4 h-4 text-slate-500" />
              <span>{{ currentLanguage === 'kh' ? 'គេហទំព័រពលរដ្ឋ' : 'Citizen Site' }}</span>
            </router-link>
          </div>

          <div class="my-1.5 border-t border-slate-100"></div>

          <button
            type="button"
            @click="handleLogout"
            class="w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors cursor-pointer text-left"
          >
            <LogOut class="w-4 h-4 text-rose-500" />
            <span>{{ currentLanguage === 'kh' ? 'ចាកចេញពីប្រព័ន្ធ' : 'Sign Out' }}</span>
          </button>
        </div>
      </div>

    </div>
  </header>
</template>
