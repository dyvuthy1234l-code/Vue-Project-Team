<script setup lang="ts">
import {
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
  (e: 'toggle-sidebar'): void
}>()

const { currentLanguage } = useLanguage()

interface NavItem {
  id: AdminTab
  labelKh: string
  labelEn: string
  icon: any
}

const contentItems: NavItem[] = [
  { id: 'government', labelKh: 'សេវារដ្ឋបាល', labelEn: 'Government Services', icon: FileText },
  { id: 'health', labelKh: 'សុខាភិបាល & មន្ទីរពេទ្យ', labelEn: 'Healthcare & Hospitals', icon: HospitalIcon },
  { id: 'jobs', labelKh: 'ការងារ', labelEn: 'Jobs', icon: Briefcase },
  { id: 'transport', labelKh: 'ដឹកជញ្ជូន & ផ្លូវរថភ្លើង', labelEn: 'Transport', icon: Bus },
  { id: 'homeservices', labelKh: 'សេវាកម្មជួសជុល', labelEn: 'Home Services', icon: Home },
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
      'bg-white text-slate-700 border-r border-slate-200/90 shadow-xs flex flex-col justify-between shrink-0 transition-all duration-200 z-30 select-none h-screen overflow-hidden',
      collapsed ? 'w-16 p-2' : 'w-[245px] sm:w-[255px] p-3'
    ]"
  >
    <!-- TOP SECTION: LOGO + MENU ITEMS -->
    <div class="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
      
      <!-- 1. BRAND LOGO HEADER -->
      <div class="flex items-center pb-2 pt-0.5 px-1 shrink-0">
        <router-link to="/" class="flex items-center gap-2.5 group focus:outline-none min-w-0" title="CamLife Home">
          <img
            src="/logo.png"
            alt="CamLife"
            class="h-8 w-8 rounded-xl object-contain bg-white p-0.5 shadow-2xs shrink-0 transition-transform group-hover:scale-105 border border-slate-100"
          />
          <div v-if="!collapsed" class="flex flex-col min-w-0 leading-none">
            <span class="text-slate-900 font-black text-base tracking-tight leading-none">CamLife</span>
            <span class="text-blue-600 font-extrabold text-[10.5px] uppercase tracking-wider leading-none mt-1">Admin CMS</span>
          </div>
        </router-link>
      </div>

      <!-- 2. PRIMARY TAB: DASHBOARD (Vibrant Blue Pill matching mockup) -->
      <div class="shrink-0 pt-1 pb-1">
        <button
          type="button"
          @click="emit('select-tab', 'dashboard')"
          :class="[
            'w-full flex items-center gap-3 rounded-2xl text-left transition-all duration-150 cursor-pointer text-xs relative group',
            collapsed ? 'justify-center p-2.5' : 'px-3.5 py-2.5',
            activeTab === 'dashboard'
              ? 'bg-[#1677FF] text-white shadow-md shadow-blue-500/25 font-bold'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
          ]"
          :title="currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង (Dashboard)' : 'Dashboard'"
        >
          <Home :class="['w-4 h-4 shrink-0', activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-slate-600']" />
          <div v-if="!collapsed" class="flex flex-col min-w-0 leading-none">
            <span :class="['font-khmer text-xs leading-none', activeTab === 'dashboard' ? 'font-bold text-white' : 'font-semibold text-slate-800 group-hover:text-slate-900']">
              {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard' }}
            </span>
            <span :class="['text-[9.5px] font-normal leading-none mt-1', activeTab === 'dashboard' ? 'text-blue-100' : 'text-slate-400 group-hover:text-slate-500']">
              {{ currentLanguage === 'kh' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង' }}
            </span>
          </div>
        </button>
      </div>

      <!-- 3. SECTION: CONTENT MANAGEMENT -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-1.5 pb-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400"
        >
          CONTENT MANAGEMENT
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in contentItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs group',
              collapsed ? 'justify-center p-2' : 'px-3 py-1.5',
              activeTab === item.id
                ? 'bg-[#1677FF] text-white shadow-md shadow-blue-500/25 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component
              :is="item.icon"
              :class="[
                'w-4 h-4 shrink-0 transition-colors',
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1 leading-none">
              <span :class="['font-khmer text-xs leading-none truncate', activeTab === item.id ? 'font-bold text-white' : 'font-semibold text-slate-800 group-hover:text-slate-900']">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span
                :class="[
                  'text-[9px] leading-none mt-0.5 truncate',
                  activeTab === item.id ? 'text-blue-100 font-normal' : 'text-slate-400 group-hover:text-slate-500'
                ]"
              >
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

      <!-- 4. SECTION: USER & SUPPORT -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-1.5 pb-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400"
        >
          USER & SUPPORT
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in userSupportItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs group',
              collapsed ? 'justify-center p-2' : 'px-3 py-1.5',
              activeTab === item.id
                ? 'bg-[#1677FF] text-white shadow-md shadow-blue-500/25 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component
              :is="item.icon"
              :class="[
                'w-4 h-4 shrink-0 transition-colors',
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1 leading-none">
              <span :class="['font-khmer text-xs leading-none truncate', activeTab === item.id ? 'font-bold text-white' : 'font-semibold text-slate-800 group-hover:text-slate-900']">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span
                :class="[
                  'text-[9px] leading-none mt-0.5 truncate',
                  activeTab === item.id ? 'text-blue-100 font-normal' : 'text-slate-400 group-hover:text-slate-500'
                ]"
              >
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
            <!-- Red Badge 3 for Feedback & Reports (Exact match with Mockup) -->
            <span
              v-if="item.id === 'feedback' && !collapsed"
              class="w-4 h-4 rounded-full bg-red-500 text-white text-[9.5px] font-black flex items-center justify-center shrink-0 ml-auto shadow-xs"
            >
              3
            </span>
          </button>
        </div>
      </div>

      <!-- 5. SECTION: SYSTEM -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-1.5 pb-0.5 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400"
        >
          SYSTEM
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in systemItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs group',
              collapsed ? 'justify-center p-2' : 'px-3 py-1.5',
              activeTab === item.id
                ? 'bg-[#1677FF] text-white shadow-md shadow-blue-500/25 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 font-medium'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component
              :is="item.icon"
              :class="[
                'w-4 h-4 shrink-0 transition-colors',
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1 leading-none">
              <span :class="['font-khmer text-xs leading-none truncate', activeTab === item.id ? 'font-bold text-white' : 'font-semibold text-slate-800 group-hover:text-slate-900']">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span
                :class="[
                  'text-[9px] leading-none mt-0.5 truncate',
                  activeTab === item.id ? 'text-blue-100 font-normal' : 'text-slate-400 group-hover:text-slate-500'
                ]"
              >
                {{ currentLanguage === 'kh' ? item.labelEn : item.labelKh }}
              </span>
            </div>
          </button>
        </div>
      </div>

    </div>

    <!-- 6. BOTTOM PROFILE CARD (Matching Mockup with Purple 'A' Avatar) -->
    <div class="mt-2 pt-2 border-t border-slate-100 shrink-0">
      <div
        :class="[
          'bg-slate-50 border border-slate-200/90 rounded-2xl transition-all',
          collapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-2.5 flex items-center gap-2.5 shadow-2xs'
        ]"
      >
        <!-- Purple Avatar Badge with 'A' -->
        <div class="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
          A
        </div>

        <div v-if="!collapsed" class="flex-1 min-w-0">
          <div class="text-xs font-bold text-slate-900 truncate leading-none">Admin</div>
          <div class="text-[9.5px] text-slate-500 truncate leading-none mt-0.5">Super Admin</div>
          <button
            type="button"
            @click="emit('logout')"
            class="text-[9.5px] text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold leading-none mt-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut class="w-3 h-3 text-rose-500" />
            <span>{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
          </button>
        </div>

        <!-- Collapsed signout button -->
        <button
          v-else
          type="button"
          @click="emit('logout')"
          class="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
          title="Sign Out"
        >
          <LogOut class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </aside>
</template>
