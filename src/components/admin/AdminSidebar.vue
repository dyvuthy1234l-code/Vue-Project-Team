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
  LogOut,
  ExternalLink,
  Crown,
  ClipboardCheck
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useAuth } from '@/composables/useAuth'
import { usePartnerSubmissions } from '@/composables/usePartnerSubmissions'

export type AdminTab =
  | 'dashboard'
  | 'government'
  | 'health'
  | 'jobs'
  | 'transport'
  | 'homeservices'
  | 'offices'
  | 'news'
  | 'submissions'
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
  (e: 'open-profile'): void
}>()

const { currentLanguage } = useLanguage()
const { currentUser } = useAuth()
const { pendingCount } = usePartnerSubmissions()

interface NavItem {
  id: AdminTab
  labelKh: string
  labelEn: string
  icon: any
  publicPath?: string
}

const contentItems: NavItem[] = [
  { id: 'government', labelKh: 'សេវារដ្ឋបាល', labelEn: 'Government Services', icon: FileText, publicPath: '/government' },
  { id: 'health', labelKh: 'សុខាភិបាល & មន្ទីរពេទ្យ', labelEn: 'Healthcare & Hospitals', icon: HospitalIcon, publicPath: '/health' },
  { id: 'jobs', labelKh: 'ការងារ', labelEn: 'Jobs', icon: Briefcase, publicPath: '/jobs' },
  { id: 'transport', labelKh: 'ដឹកជញ្ជូន & ផ្លូវរថភ្លើង', labelEn: 'Transport', icon: Bus, publicPath: '/transport' },
  { id: 'homeservices', labelKh: 'សេវាកម្មជួសជុល', labelEn: 'Home Services', icon: Home, publicPath: '/home-services' },
  { id: 'offices', labelKh: 'ការិយាល័យ & OWSO', labelEn: 'Public Offices & OWSO', icon: Building2, publicPath: '/locations' },
  { id: 'news', labelKh: 'ព័ត៌មាន & សេចក្តីជូនដំណឹង', labelEn: 'News & Bulletins', icon: Newspaper, publicPath: '/news' }
]

const userSupportItems: NavItem[] = [
  { id: 'submissions', labelKh: 'សំណើសុំចុះបញ្ជី', labelEn: 'Partner Submissions', icon: ClipboardCheck },
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
      'bg-[#0B1528] text-slate-200 border-r border-slate-800/80 shadow-2xl flex flex-col justify-between shrink-0 transition-all duration-200 z-30 select-none h-screen overflow-hidden',
      collapsed ? 'w-16 p-2' : 'w-[255px] sm:w-[265px] p-3'
    ]"
  >
    <!-- TOP SECTION: BRAND + MENU ITEMS -->
    <div class="flex-1 flex flex-col justify-between min-h-0 overflow-hidden">
      
      <!-- 1. BRAND LOGO HEADER -->
      <div class="flex items-center pb-2.5 pt-1 px-1 shrink-0 border-b border-slate-800/60">
        <router-link to="/" class="flex items-center gap-2.5 group focus:outline-none min-w-0" :title="currentLanguage === 'kh' ? 'គេហទំព័រពលរដ្ឋ' : 'CamLife Citizen Portal'">
          <img
            src="/logo.png"
            alt="CamLife"
            class="h-8 w-8 rounded-xl object-contain bg-white p-0.5 shadow-sm shrink-0 transition-transform group-hover:scale-105"
          />
          <div v-if="!collapsed" class="flex flex-col min-w-0 leading-none">
            <div class="flex items-center gap-1.5">
              <span class="text-white font-black text-base tracking-tight leading-none">CamLife</span>
              <span class="px-1.5 py-0.2 rounded text-[9px] font-black bg-blue-500/20 text-blue-300 border border-blue-500/30 font-khmer">
                {{ currentLanguage === 'kh' ? 'រដ្ឋបាល' : 'CMS' }}
              </span>
            </div>
            <span class="text-slate-400 font-semibold text-[10px] tracking-wider leading-none mt-1 font-khmer">
              {{ currentLanguage === 'kh' ? 'ផតថលរដ្ឋបាលជាតិ' : 'National Admin Portal' }}
            </span>
          </div>
        </router-link>
      </div>

      <!-- 2. PRIMARY TAB: DASHBOARD -->
      <div class="shrink-0 pt-2 pb-1">
        <button
          type="button"
          @click="emit('select-tab', 'dashboard')"
          :class="[
            'w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs relative group',
            collapsed ? 'justify-center p-2.5' : 'px-3 py-2',
            activeTab === 'dashboard'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
              : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
          ]"
          :title="currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងទូទៅ' : 'Overview Dashboard'"
        >
          <Home :class="['w-4 h-4 shrink-0', activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-white']" />
          <div v-if="!collapsed" class="flex items-center min-w-0 flex-1">
            <span :class="['font-khmer text-xs truncate', activeTab === 'dashboard' ? 'font-bold text-white' : 'font-medium text-slate-200']">
              {{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងទូទៅ' : 'Overview Dashboard' }}
            </span>
          </div>
        </button>
      </div>

      <!-- 3. SECTION: CONTENT MANAGEMENT -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-2 pb-1 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between font-khmer"
        >
          <span>{{ currentLanguage === 'kh' ? 'ការគ្រប់គ្រងមាតិកា' : 'Content Management' }}</span>
        </div>
        <div class="space-y-0.5">
          <div
            v-for="item in contentItems"
            :key="item.id"
            :class="[
              'w-full flex items-center rounded-xl transition-all duration-150 group relative',
              collapsed ? 'justify-center p-0.5' : 'p-0.5'
            ]"
          >
            <button
              type="button"
              @click="emit('select-tab', item.id)"
              :class="[
                'flex-1 flex items-center gap-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs min-w-0',
                collapsed ? 'justify-center p-2' : 'px-3 py-2',
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
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
              <div v-if="!collapsed" class="flex items-center min-w-0 flex-1">
                <span :class="['font-khmer text-xs truncate', activeTab === item.id ? 'font-bold text-white' : 'font-medium text-slate-200']">
                  {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
                </span>
              </div>
            </button>
            <!-- Quick Link to Live Public Page (outside button to prevent click conflicts) -->
            <router-link
              v-if="item.publicPath && !collapsed"
              :to="item.publicPath"
              target="_blank"
              class="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/80 transition-opacity shrink-0 ml-0.5"
              :title="currentLanguage === 'kh' ? 'មើលទំព័រផ្ទាល់នៅលើគេហទំព័រ (បើកផ្ទាំងថ្មី)' : 'View Live Page (Open in new tab)'"
            >
              <ExternalLink class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- 4. SECTION: USER & SUPPORT -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-2 pb-1 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center justify-between font-khmer"
        >
          <span>{{ currentLanguage === 'kh' ? 'អ្នកប្រើ & តួនាទី' : 'Users & Support' }}</span>
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in userSupportItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs group',
              collapsed ? 'justify-center p-2' : 'px-3 py-2',
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
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
            <div v-if="!collapsed" class="flex items-center min-w-0 flex-1">
              <span :class="['font-khmer text-xs truncate', activeTab === item.id ? 'font-bold text-white' : 'font-medium text-slate-200']">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
            </div>
            <!-- Amber Badge for Pending Partner Submissions -->
            <span
              v-if="item.id === 'submissions' && pendingCount > 0 && !collapsed"
              class="px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9.5px] font-black font-mono flex items-center justify-center shrink-0 ml-auto shadow-xs"
            >
              {{ pendingCount }}
            </span>

            <!-- Red Badge 3 for Feedback & Reports -->
            <span
              v-if="item.id === 'feedback' && !collapsed"
              class="w-4 h-4 rounded-full bg-rose-500 text-white text-[9.5px] font-black flex items-center justify-center shrink-0 ml-auto shadow-xs"
            >
              3
            </span>
          </button>
        </div>
      </div>

      <!-- 5. SECTION: SYSTEM & AUDIT -->
      <div class="shrink-0 space-y-0.5">
        <div
          v-if="!collapsed"
          class="px-3 pt-2 pb-1 text-[9.5px] font-extrabold uppercase tracking-wider text-slate-400 font-khmer"
        >
          {{ currentLanguage === 'kh' ? 'ប្រព័ន្ធ & សវនកម្ម' : 'System & Security' }}
        </div>
        <div class="space-y-0.5">
          <button
            v-for="item in systemItems"
            :key="item.id"
            type="button"
            @click="emit('select-tab', item.id)"
            :class="[
              'w-full flex items-center gap-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer text-xs group',
              collapsed ? 'justify-center p-2' : 'px-3 py-2',
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60 font-medium'
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
            <div v-if="!collapsed" class="flex items-center min-w-0 flex-1">
              <span :class="['font-khmer text-xs truncate', activeTab === item.id ? 'font-bold text-white' : 'font-medium text-slate-200']">
                {{ currentLanguage === 'kh' ? item.labelKh : item.labelEn }}
              </span>
            </div>
          </button>
        </div>
      </div>

    </div>

    <!-- 6. BOTTOM PROFILE & ROLE ADMIN BADGE CARD -->
    <div class="mt-2 pt-2 border-t border-slate-800/80 shrink-0">
      <div
        :class="[
          'bg-slate-800/70 border border-slate-700/60 rounded-2xl transition-all',
          collapsed ? 'p-2 flex flex-col items-center gap-2' : 'p-2.5 flex items-center gap-2.5 shadow-sm'
        ]"
      >
        <!-- Golden Shield/Crown Avatar (Clickable to open profile) -->
        <button
          type="button"
          @click="emit('open-profile')"
          class="relative w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          :title="currentLanguage === 'kh' ? 'ចុចដើម្បីកែប្រែព័ត៌មានគណនី' : 'Click to edit profile'"
        >
          <Crown class="w-4 h-4 text-slate-900" />
          <span class="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-[#0B1528]" title="Online"></span>
        </button>

        <div v-if="!collapsed" class="flex-1 min-w-0">
          <button
            type="button"
            @click="emit('open-profile')"
            class="w-full text-left group cursor-pointer"
            :title="currentLanguage === 'kh' ? 'ចុចដើម្បីកែប្រែព័ត៌មានគណនី' : 'Click to edit profile'"
          >
            <div class="flex items-center gap-1.5 leading-none">
              <span class="text-xs font-bold text-white truncate font-khmer group-hover:text-blue-300 transition-colors">
                {{ currentUser?.name || (currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋបាល' : 'Admin Officer') }}
              </span>
            </div>
            <div class="flex items-center gap-1 mt-0.5">
              <span class="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 font-khmer">
                {{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រងកំពូល' : 'Super Admin' }}
              </span>
            </div>
          </button>
          <div class="flex items-center gap-2 mt-1.5 pt-1 border-t border-slate-700/50">
            <router-link
              to="/"
              class="text-[10px] text-blue-300 hover:text-white flex items-center gap-1 font-medium font-khmer transition-colors"
              :title="currentLanguage === 'kh' ? 'គេហទំព័រពលរដ្ឋ' : 'Return to Citizen Site'"
            >
              <ExternalLink class="w-3 h-3" />
              <span>{{ currentLanguage === 'kh' ? 'ទំព័រពលរដ្ឋ' : 'Citizen Site' }}</span>
            </router-link>
            <span class="text-slate-600">·</span>
            <button
              type="button"
              @click="emit('logout')"
              class="text-[10px] text-rose-300 hover:text-rose-100 flex items-center gap-1 font-medium font-khmer transition-colors cursor-pointer"
              :title="currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out'"
            >
              <LogOut class="w-3 h-3 text-rose-400" />
              <span>{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Logout' }}</span>
            </button>
          </div>
        </div>

        <!-- Collapsed buttons -->
        <div v-else class="flex flex-col items-center gap-1">
          <router-link
            to="/"
            class="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
            title="Public Site"
          >
            <ExternalLink class="w-3.5 h-3.5" />
          </router-link>
          <button
            type="button"
            @click="emit('logout')"
            class="p-1 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 cursor-pointer"
            title="Sign Out"
          >
            <LogOut class="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  </aside>
</template>
