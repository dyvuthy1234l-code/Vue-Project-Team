<script setup lang="ts">
import {
  LayoutDashboard,
  FileText,
  Hospital as HospitalIcon,
  Briefcase,
  Bus,
  Home,
  Building2,
  Newspaper,
  Users,
  MessageSquare,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

export type AdminTab =
  | 'dashboard'
  | 'government'
  | 'health'
  | 'jobs'
  | 'transport'
  | 'homeservices'
  | 'offices'
  | 'news'
  | 'users'
  | 'feedback'
  | 'settings'
  | 'logs'

defineProps<{
  activeTab: AdminTab
  collapsed?: boolean
}>()

const emit = defineEmits<{
  (e: 'select-tab', tab: AdminTab): void
  (e: 'logout'): void
}>()

const { currentLanguage } = useLanguage()

interface NavItem {
  id: AdminTab
  labelKh: string
  labelEn: string
  subKh?: string
  subEn?: string
  icon: any
}

const contentItems: NavItem[] = [
  { id: 'government', labelKh: 'សេវារដ្ឋបាល', labelEn: 'Government Services', icon: FileText },
  { id: 'health', labelKh: 'សុខាភិបាល & មន្ទីរពេទ្យ', labelEn: 'Healthcare & Hospitals', icon: HospitalIcon },
  { id: 'jobs', labelKh: 'ការងារ', labelEn: 'Jobs', icon: Briefcase },
  { id: 'transport', labelKh: 'ដឹកជញ្ជូន & ផ្លូវរថភ្លើង', labelEn: 'Transport', icon: Bus },
  { id: 'homeservices', labelKh: 'សេវាជួសជុលផ្ទះ', labelEn: 'Home Services', icon: Home },
  { id: 'offices', labelKh: 'ការិយាល័យ & OWSO', labelEn: 'Public Offices & OWSO', icon: Building2 },
  { id: 'news', labelKh: 'ព័ត៌មាន & សេចក្តីជូនដំណឹង', labelEn: 'News & Bulletins', icon: Newspaper }
]

const userSupportItems: NavItem[] = [
  { id: 'users', labelKh: 'អ្នកប្រើប្រាស់', labelEn: 'Users', icon: Users },
  { id: 'feedback', labelKh: 'មតិយោបល់', labelEn: 'Feedback & Reports', icon: MessageSquare }
]

const systemItems: NavItem[] = [
  { id: 'settings', labelKh: 'ការកំណត់', labelEn: 'Settings', icon: Settings },
  { id: 'logs', labelKh: 'កំណត់ហេតុអ្នកគ្រប់គ្រង', labelEn: 'Admin Logs', icon: ShieldCheck }
]
</script>

<template>
  <aside
    :class="[
      'bg-white border-r border-slate-300 shadow-[2px_0_6px_0_rgba(0,0,0,0.06)] flex flex-col shrink-0 transition-all duration-200 z-20 select-none',
      collapsed ? 'w-16' : 'w-64'
    ]"
  >
    <!-- Navigation Items Container -->
    <div class="flex-1 overflow-y-auto py-3 px-3 space-y-4 scrollbar-thin">
      
      <!-- Top Primary: Dashboard -->
      <div>
        <button
          type="button"
          @click="emit('select-tab', 'dashboard')"
          :class="[
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer font-bold text-xs',
            activeTab === 'dashboard'
              ? 'bg-blue-50 text-blue-600 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          ]"
        >
          <LayoutDashboard :class="['w-4 h-4 shrink-0', activeTab === 'dashboard' ? 'text-blue-600' : 'text-slate-500']" />
          <div v-if="!collapsed" class="flex flex-col min-w-0">
            <span class="font-khmer leading-tight">{{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard' }}</span>
            <span class="text-[10px] opacity-75 font-normal">{{ currentLanguage === 'kh' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង' }}</span>
          </div>
        </button>
      </div>

      <!-- Section: Content Management -->
      <div>
        <div v-if="!collapsed" class="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          CONTENT MANAGEMENT
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in contentItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs font-semibold',
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component :is="item.icon" :class="['w-4 h-4 shrink-0', activeTab === item.id ? 'text-blue-600' : 'text-slate-500']" />
            <div v-if="!collapsed" class="flex flex-col min-w-0">
              <span class="font-khmer leading-tight truncate">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span class="text-[10px] text-slate-400 font-normal leading-tight truncate">
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Section: User & Support -->
      <div>
        <div v-if="!collapsed" class="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          USER & SUPPORT
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in userSupportItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs font-semibold',
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component :is="item.icon" :class="['w-4 h-4 shrink-0', activeTab === item.id ? 'text-blue-600' : 'text-slate-500']" />
            <div v-if="!collapsed" class="flex flex-col min-w-0">
              <span class="font-khmer leading-tight truncate">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span class="text-[10px] text-slate-400 font-normal leading-tight truncate">
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Section: System -->
      <div>
        <div v-if="!collapsed" class="px-3 pb-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
          SYSTEM
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in systemItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs font-semibold',
              activeTab === item.id
                ? 'bg-blue-50 text-blue-600 font-bold shadow-2xs'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component :is="item.icon" :class="['w-4 h-4 shrink-0', activeTab === item.id ? 'text-blue-600' : 'text-slate-500']" />
            <div v-if="!collapsed" class="flex flex-col min-w-0">
              <span class="font-khmer leading-tight truncate">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span class="text-[10px] text-slate-400 font-normal leading-tight truncate">
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

    </div>

    <!-- Bottom: Sign Out Button -->
    <div class="p-3 border-t border-slate-100 bg-slate-50/50">
      <button
        type="button"
        @click="emit('logout')"
        class="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-all text-xs font-bold text-rose-600 hover:bg-rose-50 cursor-pointer"
        title="Sign Out"
      >
        <LogOut class="w-4 h-4 shrink-0 text-rose-500" />
        <div v-if="!collapsed" class="flex flex-col min-w-0">
          <span class="font-khmer leading-tight">{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
          <span class="text-[10px] text-rose-400 font-normal leading-none">{{ currentLanguage === 'kh' ? 'Sign Out' : 'ចាកចេញ' }}</span>
        </div>
      </button>
    </div>
  </aside>
</template>
