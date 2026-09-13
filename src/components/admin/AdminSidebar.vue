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
      'bg-white dark:bg-slate-900 border-r border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col justify-between shrink-0 transition-all duration-200 z-20 select-none h-full overflow-hidden',
      collapsed ? 'w-16' : 'w-60'
    ]"
  >
    <!-- Navigation Items Container (Fits entirely within one screen, no scrolling) -->
    <div class="flex-1 flex flex-col justify-between py-2 px-2 overflow-hidden">
      
      <!-- Top Primary: Dashboard -->
      <div>
        <button
          type="button"
          @click="emit('select-tab', 'dashboard')"
          :class="[
            'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs relative group',
            activeTab === 'dashboard'
              ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold shadow-2xs ring-1 ring-blue-500/20'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium',
            collapsed ? 'justify-center px-0' : ''
          ]"
          :title="currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង (Dashboard)' : 'Dashboard'"
        >
          <!-- Active Pill Accent Indicator -->
          <span
            v-if="activeTab === 'dashboard'"
            class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0D47A1] dark:bg-blue-400 rounded-r-full"
          />
          <div
            :class="[
              'w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors',
              activeTab === 'dashboard'
                ? 'bg-[#0D47A1] text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-blue-50 group-hover:text-[#0D47A1]'
            ]"
          >
            <LayoutDashboard class="w-3.5 h-3.5" />
          </div>
          <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1">
            <span class="font-khmer text-xs leading-none truncate font-bold">
              {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard' }}
            </span>
            <span class="text-[9.5px] opacity-70 font-normal leading-none mt-0.5 truncate">
              {{ currentLanguage === 'kh' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង' }}
            </span>
          </div>
        </button>
      </div>

      <!-- Section: Content Management -->
      <div class="space-y-0.5">
        <div v-if="!collapsed" class="px-2.5 pt-1 pb-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          CONTENT MANAGEMENT
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in contentItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-2.5 px-2.5 py-1 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs relative group',
              activeTab === item.id
                ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold shadow-2xs ring-1 ring-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium',
              collapsed ? 'justify-center px-0' : ''
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <!-- Active Pill Accent Indicator -->
            <span
              v-if="activeTab === item.id"
              class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0D47A1] dark:bg-blue-400 rounded-r-full"
            />
            <component
              :is="item.icon"
              :class="[
                'w-3.5 h-3.5 shrink-0 transition-colors',
                activeTab === item.id ? 'text-[#0D47A1] dark:text-blue-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1">
              <span class="font-khmer text-xs leading-none truncate font-semibold">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span class="text-[9px] text-slate-400 dark:text-slate-500 font-normal leading-none mt-0.5 truncate">
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Section: User & Support -->
      <div class="space-y-0.5">
        <div v-if="!collapsed" class="px-2.5 pt-1 pb-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          USER & SUPPORT
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in userSupportItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-2.5 px-2.5 py-1 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs relative group',
              activeTab === item.id
                ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold shadow-2xs ring-1 ring-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium',
              collapsed ? 'justify-center px-0' : ''
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <!-- Active Pill Accent Indicator -->
            <span
              v-if="activeTab === item.id"
              class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0D47A1] dark:bg-blue-400 rounded-r-full"
            />
            <component
              :is="item.icon"
              :class="[
                'w-3.5 h-3.5 shrink-0 transition-colors',
                activeTab === item.id ? 'text-[#0D47A1] dark:text-blue-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1">
              <span class="font-khmer text-xs leading-none truncate font-semibold">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span class="text-[9px] text-slate-400 dark:text-slate-500 font-normal leading-none mt-0.5 truncate">
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- Section: System -->
      <div class="space-y-0.5">
        <div v-if="!collapsed" class="px-2.5 pt-1 pb-0.5 text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
          SYSTEM
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in systemItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-2.5 px-2.5 py-1 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs relative group',
              activeTab === item.id
                ? 'bg-blue-50/90 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-extrabold shadow-2xs ring-1 ring-blue-500/20'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium',
              collapsed ? 'justify-center px-0' : ''
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <!-- Active Pill Accent Indicator -->
            <span
              v-if="activeTab === item.id"
              class="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#0D47A1] dark:bg-blue-400 rounded-r-full"
            />
            <component
              :is="item.icon"
              :class="[
                'w-3.5 h-3.5 shrink-0 transition-colors',
                activeTab === item.id ? 'text-[#0D47A1] dark:text-blue-300' : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1">
              <span class="font-khmer text-xs leading-none truncate font-semibold">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span class="text-[9px] text-slate-400 dark:text-slate-500 font-normal leading-none mt-0.5 truncate">
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

    </div>

    <!-- Bottom: Sign Out Button (Compact, fixed at bottom) -->
    <div class="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 shrink-0">
      <button
        type="button"
        @click="emit('logout')"
        :class="[
          'w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl text-left transition-all text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer group',
          collapsed ? 'justify-center px-0' : ''
        ]"
        title="Sign Out"
      >
        <LogOut class="w-4 h-4 shrink-0 text-rose-500 group-hover:-translate-x-0.5 transition-transform" />
        <div v-if="!collapsed" class="flex flex-col min-w-0">
          <span class="font-khmer text-xs leading-none font-bold">{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
          <span class="text-[9.5px] text-rose-400 font-normal leading-none mt-0.5">{{ currentLanguage === 'kh' ? 'Sign Out' : 'ចាកចេញ' }}</span>
        </div>
      </button>
    </div>
  </aside>
</template>
