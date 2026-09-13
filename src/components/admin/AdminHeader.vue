<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Menu,
  Search,
  Bell,
  Plus,
  ShieldCheck,
  ChevronRight,
  FileText,
  Briefcase,
  Newspaper,
  UserPlus
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps<{
  activeTab?: string
  sidebarCollapsed?: boolean
  searchQuery?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'update:searchQuery', val: string): void
  (e: 'navigate', tab: string): void
}>()

const { currentLanguage, setLanguage } = useLanguage()

const isNotifOpen = ref(false)
const isQuickActionsOpen = ref(false)

const tabLabels: Record<string, { kh: string; en: string }> = {
  dashboard: { kh: 'ផ្ទាំងគ្រប់គ្រងទូទៅ', en: 'Overview Dashboard' },
  government: { kh: 'សេវារដ្ឋបាលសាធារណៈ', en: 'Government Services' },
  health: { kh: 'សុខាភិបាល & មន្ទីរពេទ្យ', en: 'Healthcare & Hospitals' },
  jobs: { kh: 'ឱកាសការងារជាតិ', en: 'Jobs & Careers' },
  transport: { kh: 'ដឹកជញ្ជូន & ផ្លូវរថភ្លើង', en: 'Transport & Transit' },
  homeservices: { kh: 'សេវាកម្មជួសជុលគេហដ្ឋាន', en: 'Home Services' },
  offices: { kh: 'ការិយាល័យច្រកចេញចូលតែមួយ', en: 'Offices & OWSO' },
  news: { kh: 'ព័ត៌មាន & សេចក្តីជូនដំណឹង', en: 'News & Bulletins' },
  users: { kh: 'អ្នកប្រើប្រាស់ & តួនាទី', en: 'Users & Roles' },
  feedback: { kh: 'មតិយោបល់ & របាយការណ៍', en: 'Feedback & Reports' },
  settings: { kh: 'ការកំណត់ប្រព័ន្ធ', en: 'System Settings' },
  logs: { kh: 'កំណត់ហេតុសវនកម្ម', en: 'Audit Logs' }
}

const currentTabTitle = computed(() => {
  const key = props.activeTab || 'dashboard'
  return tabLabels[key] || { kh: 'ផ្ទាំងគ្រប់គ្រង', en: 'Dashboard' }
})

const notifications = ref([
  { id: 1, title: 'សំណើសុំបើកអាជីវកម្មថ្មី', titleEn: 'New Business Registration Request', time: '10m ago', unread: true },
  { id: 2, title: 'ការងារថ្មីរង់ចាំការអនុម័ត', titleEn: 'New Job Listing Pending Approval', time: '35m ago', unread: true },
  { id: 3, title: 'របាយការណ៍មតិយោបល់ពីប្រជាពលរដ្ឋ', titleEn: 'Citizen Feedback Submitted', time: '1h ago', unread: true },
  { id: 4, title: 'ការធ្វើបច្ចុប្បន្នភាពមន្ទីរពេទ្យ', titleEn: 'Hospital Profile Updated', time: '2h ago', unread: false },
  { id: 5, title: 'ប្រព័ន្ធដំណើរការធម្មតា', titleEn: 'Daily System Backup Completed', time: '4h ago', unread: false }
])

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
          <span class="absolute -top-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-black items-center justify-center ring-2 ring-white shadow-2xs">
              5
            </span>
          </span>
        </button>

        <!-- Notification Popover -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div class="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 font-khmer">
              {{ currentLanguage === 'kh' ? 'ការជូនដំណឹង' : 'Notifications' }} (5)
            </span>
            <button
              type="button"
              @click="isNotifOpen = false"
              class="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline font-khmer"
            >
              {{ currentLanguage === 'kh' ? 'សម្គាល់ថាបានអាន' : 'Mark all read' }}
            </button>
          </div>
          <div class="max-h-64 overflow-y-auto divide-y divide-slate-50">
            <div
              v-for="item in notifications"
              :key="item.id"
              class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 transition-colors"
            >
              <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" :class="item.unread ? 'bg-blue-600' : 'bg-slate-300'"></div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-slate-800 truncate font-khmer">
                  {{ currentLanguage === 'kh' ? item.title : item.titleEn }}
                </p>
                <span class="text-[10px] text-slate-400">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- PROMINENT ROLE ADMIN PROFILE BADGE -->
      <div class="flex items-center gap-2 pl-2 border-l border-slate-200">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-800 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100 shrink-0">
          <ShieldCheck class="w-4 h-4 text-amber-300" />
        </div>
        <div class="hidden lg:flex flex-col text-left leading-tight">
          <div class="flex items-center gap-1.5">
            <span class="text-xs font-bold text-slate-900 font-khmer">
              {{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋបាល' : 'Admin Officer' }}
            </span>
            <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200 font-khmer">
              {{ currentLanguage === 'kh' ? 'តួនាទី: អភិបាល' : 'Role: Admin' }}
            </span>
          </div>
          <span class="text-[10px] text-slate-400 font-medium font-khmer mt-0.5">
            {{ currentLanguage === 'kh' ? 'សិទ្ធិគ្រប់គ្រងពេញលេញ' : 'Full Access Privilege' }}
          </span>
        </div>
      </div>

    </div>
  </header>
</template>
