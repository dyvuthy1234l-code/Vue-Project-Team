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
      'bg-[#0B1728] text-slate-300 border-r border-slate-800/80 shadow-2xl flex flex-col justify-between shrink-0 transition-all duration-200 z-30 select-none h-screen overflow-hidden',
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
            class="h-8 w-8 rounded-xl object-contain bg-white/95 p-0.5 shadow-sm shrink-0 transition-transform group-hover:scale-105"
          />
          <div v-if="!collapsed" class="flex flex-col min-w-0 leading-none">
            <span class="text-white font-black text-base tracking-tight leading-none">CamLife</span>
            <span class="text-blue-400 font-bold text-[10.5px] uppercase tracking-wider leading-none mt-1">Admin CMS</span>
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
              ? 'bg-[#1677FF] text-white shadow-lg shadow-blue-600/30 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
          ]"
          :title="currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង (Dashboard)' : 'Dashboard'"
        >
          <Home :class="['w-4 h-4 shrink-0', activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-white']" />
          <div v-if="!collapsed" class="flex flex-col min-w-0 leading-none">
            <span class="font-khmer text-xs font-bold text-white leading-none">
              {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រង' : 'Dashboard' }}
            </span>
            <span class="text-[9.5px] text-blue-100/90 font-normal leading-none mt-1">
              {{ currentLanguage === 'kh' ? 'Dashboard' : 'ផ្ទាំងគ្រប់គ្រង' }}
            </span>
          </div>
        </button>
      </div>

      <!-- 3. SECTION: CONTENT MANAGEMENT -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-1.5 pb-0.5 text-[9.5px] font-black uppercase tracking-wider text-slate-400/90"
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
                ? 'bg-[#1677FF] text-white shadow-md shadow-blue-600/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component
              :is="item.icon"
              :class="[
                'w-4 h-4 shrink-0 transition-colors',
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1 leading-none">
              <span class="font-khmer text-xs leading-none truncate font-semibold">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span
                :class="[
                  'text-[9px] leading-none mt-0.5 truncate',
                  activeTab === item.id ? 'text-blue-100/80' : 'text-slate-400 group-hover:text-slate-300'
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
          class="px-3 pt-1.5 pb-0.5 text-[9.5px] font-black uppercase tracking-wider text-slate-400/90"
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
                ? 'bg-[#1677FF] text-white shadow-md shadow-blue-600/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component
              :is="item.icon"
              :class="[
                'w-4 h-4 shrink-0 transition-colors',
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1 leading-none">
              <span class="font-khmer text-xs leading-none truncate font-semibold">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span
                :class="[
                  'text-[9px] leading-none mt-0.5 truncate',
                  activeTab === item.id ? 'text-blue-100/80' : 'text-slate-400 group-hover:text-slate-300'
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
          class="px-3 pt-1.5 pb-0.5 text-[9.5px] font-black uppercase tracking-wider text-slate-400/90"
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
                ? 'bg-[#1677FF] text-white shadow-md shadow-blue-600/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-white/5 font-medium'
            ]"
            :title="currentLanguage === 'kh' ? item.labelKh : item.labelEn"
          >
            <component
              :is="item.icon"
              :class="[
                'w-4 h-4 shrink-0 transition-colors',
                activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              ]"
            />
            <div v-if="!collapsed" class="flex flex-col min-w-0 flex-1 leading-none">
              <span class="font-khmer text-xs leading-none truncate font-semibold">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
              <span
                :class="[
                  'text-[9px] leading-none mt-0.5 truncate',
                  activeTab === item.id ? 'text-blue-100/80' : 'text-slate-400 group-hover:text-slate-300'
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
    <div class="mt-2 pt-2 border-t border-slate-800/80 shrink-0">
      <div
        :class="[
          'bg-[#0D1D34] border border-blue-900/40 rounded-2xl transition-all',
          collapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-2.5 flex items-center gap-2.5 shadow-sm'
        ]"
      >
        <!-- Purple Avatar Badge with 'A' -->
        <div class="w-8 h-8 rounded-full bg-purple-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
          A
        </div>

        <div v-if="!collapsed" class="flex-1 min-w-0">
          <div class="text-xs font-bold text-white truncate leading-none">Admin</div>
          <div class="text-[9.5px] text-slate-400 truncate leading-none mt-0.5">Super Admin</div>
          <button
            type="button"
            @click="emit('logout')"
            class="text-[9.5px] text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold leading-none mt-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut class="w-3 h-3 text-rose-400" />
            <span>{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
          </button>
        </div>

        <!-- Collapsed signout button -->
        <button
          v-else
          type="button"
          @click="emit('logout')"
          class="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-white/10 cursor-pointer"
          title="Sign Out"
        >
          <LogOut class="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  </aside>
</template>
