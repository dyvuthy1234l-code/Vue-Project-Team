<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  Save,
  RotateCcw,
  ShieldCheck,
  Lock,
  Database,
  Sparkles,
  Globe,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

// -------------------------------------------------------------
// LOCAL STORAGE PERSISTENCE
// -------------------------------------------------------------
interface SiteSettings {
  siteName: string
  siteNameKh: string
  supportEmail: string
  hotline: string
  timezone: string
  maintenanceMode: boolean
  emailNotifications: boolean
  citizenRegistration: boolean
  twoFactorAuth: boolean
  sessionTimeout: string
  autoBackup: string
}

const defaultSettings: SiteSettings = {
  siteName: 'CamLife Cambodia Civic Portal',
  siteNameKh: 'ខេមឡាយហ្វ៍ (CamLife) — ផតថលសេវាពលរដ្ឋកម្ពុជា',
  supportEmail: 'contact@camlife.gov.kh',
  hotline: '1280 (OWSO Helpline)',
  timezone: 'Asia/Phnom_Penh (ICT UTC+07:00)',
  maintenanceMode: false,
  emailNotifications: true,
  citizenRegistration: true,
  twoFactorAuth: true,
  sessionTimeout: '30m',
  autoBackup: 'daily'
}

function loadSettings(): SiteSettings {
  try {
    const saved = localStorage.getItem('camlife_admin_settings')
    if (saved) {
      return { ...defaultSettings, ...JSON.parse(saved) }
    }
  } catch {}
  return { ...defaultSettings }
}

const settings = reactive<SiteSettings>(loadSettings())
const lastSavedTime = ref<string>('ទើបតែធ្វើបច្ចុប្បន្នភាព (Just now)')
const isSaving = ref(false)

function handleSave() {
  isSaving.value = true
  setTimeout(() => {
    try {
      localStorage.setItem('camlife_admin_settings', JSON.stringify(settings))
    } catch {}
    isSaving.value = false
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    lastSavedTime.value = currentLanguage.value === 'kh' ? `ថ្ងៃនេះ ម៉ោង ${timeStr}` : `Today at ${timeStr}`
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានរក្សាទុកការកំណត់ប្រព័ន្ធជោគជ័យ!' : 'System settings saved successfully!')
  }, 350)
}

function handleReset() {
  if (confirm(currentLanguage.value === 'kh' ? 'តើលោកអ្នកពិតជាចង់កំណត់ឡើងវិញនូវការកំណត់ទាំងអស់មែនទេ?' : 'Are you sure you want to reset all settings to default?')) {
    Object.assign(settings, defaultSettings)
    try {
      localStorage.removeItem('camlife_admin_settings')
    } catch {}
    lastSavedTime.value = currentLanguage.value === 'kh' ? 'បានកំណត់ឡើងវិញជាលំនាំដើម' : 'Reset to defaults'
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានកំណត់ឡើងវិញជាលំនាំដើមរួចរាល់!' : 'Settings restored to defaults!')
  }
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    
    <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- KPI 1: System Status -->
      <div class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between group hover:border-emerald-300 transition-all">
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck class="w-3.5 h-3.5" />
          </div>
          <span class="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded-full font-khmer">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            {{ currentLanguage === 'kh' ? 'អនឡាញ' : 'Online' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg font-black text-slate-900 block leading-tight">100% Operational</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ស្ថានភាពប្រព័ន្ធដំណើរការ' : 'System Availability' }}
          </span>
        </div>
      </div>

      <!-- KPI 2: SSL & Encryption -->
      <div class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between group hover:border-blue-300 transition-all">
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Lock class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full font-khmer">
            TLS 1.3 / 256-bit
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg font-black text-slate-900 block leading-tight">HTTPS Enforced</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ពិធីការសុវត្ថិភាពអ៊ិនគ្រីប' : 'Security & Encryption' }}
          </span>
        </div>
      </div>

      <!-- KPI 3: Storage & Database Sync -->
      <div class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between group hover:border-purple-300 transition-all">
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Database class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded-full font-khmer">
            Sync Active
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg font-black text-slate-900 block leading-tight">Cloud Database</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'មូលដ្ឋានទិន្នន័យ & ឃ្លាំង' : 'Database Storage' }}
          </span>
        </div>
      </div>

      <!-- KPI 4: Release Version -->
      <div class="bg-white rounded-xl py-2 px-3 border border-slate-200/90 shadow-2xs flex flex-col justify-between group hover:border-amber-300 transition-all">
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Sparkles class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full font-khmer">
            Stable Release
          </span>
        </div>
        <div class="mt-1">
          <span class="text-base sm:text-lg font-black text-slate-900 block leading-tight">CamLife v2.4.0</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'កំណែប្រែប្រព័ន្ធរដ្ឋបាល' : 'Administrative Build' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. MAIN CONFIGURATION CARD (SINGLE SCREEN SPLIT) -->
    <div class="bg-white rounded-xl border border-slate-200/90 shadow-2xs flex-1 min-h-0 flex flex-col justify-between overflow-hidden">
      
      <!-- TOOLBAR / HEADER -->
      <div class="p-2 sm:p-2.5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-slate-50/50">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-black text-xs">
            ⚙️
          </div>
          <div>
            <h3 class="text-xs font-black text-slate-900 font-khmer leading-tight">
              {{ currentLanguage === 'kh' ? 'ការកំណត់ទូទៅ និងសុវត្ថិភាពប្រព័ន្ធ' : 'General & Security Configurations' }}
            </h3>
            <p class="text-[10px] text-slate-400">
              {{ currentLanguage === 'kh' ? 'កំណត់ប៉ារ៉ាម៉ែត្រប្រតិបត្តិការគេហទំព័រ និងការគ្រប់គ្រងសិទ្ធិ' : 'Configure platform operating parameters, contacts, and security' }}
            </p>
          </div>
        </div>

        <!-- Quick Actions in Header -->
        <div class="flex items-center gap-1.5">
          <button
            type="button"
            @click="handleReset"
            class="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-bold rounded-lg transition-colors cursor-pointer font-khmer"
            title="Reset default values"
          >
            <RotateCcw class="w-3.5 h-3.5 text-slate-500" />
            <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset Defaults' }}</span>
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="isSaving"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer font-khmer"
          >
            <Save class="w-3.5 h-3.5" />
            <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុកការកំណត់' : 'Save Changes') }}</span>
          </button>
        </div>
      </div>

      <!-- SETTINGS BODY (2-COLUMN GRID FIT) -->
      <div class="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 max-w-6xl mx-auto h-full items-start">
          
          <!-- COLUMN 1: PORTAL IDENTITY & CONTACTS -->
          <div class="bg-slate-50/50 rounded-xl border border-slate-200/80 p-3 sm:p-3.5 space-y-3">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-200/60">
              <Globe class="w-4 h-4 text-blue-600" />
              <h4 class="text-xs font-black text-slate-800 font-khmer">
                {{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណ & ព័ត៌មានទាក់ទង' : 'Portal Identity & Contacts' }}
              </h4>
            </div>

            <!-- Field 1: English Portal Name -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ឈ្មោះគេហទំព័រ (Portal Name - EN)' : 'Portal Name (EN)' }}
              </label>
              <input
                v-model="settings.siteName"
                type="text"
                class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <!-- Field 2: Khmer Portal Name -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                {{ currentLanguage === 'kh' ? 'ឈ្មោះគេហទំព័រជាភាសាខ្មែរ (Portal Name - KH)' : 'Portal Name (KH)' }}
              </label>
              <input
                v-model="settings.siteNameKh"
                type="text"
                class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-khmer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <!-- Field 3: Support Email -->
            <div>
              <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer flex items-center gap-1">
                <Mail class="w-3 h-3 text-slate-400" />
                {{ currentLanguage === 'kh' ? 'អ៊ីមែលជំនួយបច្ចេកទេសផ្លូវការ' : 'Official Support Email' }}
              </label>
              <input
                v-model="settings.supportEmail"
                type="email"
                class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <!-- Field 4: Helpline Phone & Timezone -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer flex items-center gap-1">
                  <Phone class="w-3 h-3 text-slate-400" />
                  {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទទាន់ហេតុការណ៍' : 'Helpline Hotline' }}
                </label>
                <input
                  v-model="settings.hotline"
                  type="text"
                  class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  {{ currentLanguage === 'kh' ? 'តំបន់ម៉ោងប្រព័ន្ធ' : 'System Timezone' }}
                </label>
                <input
                  v-model="settings.timezone"
                  type="text"
                  readonly
                  class="w-full px-2.5 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

          </div>

          <!-- COLUMN 2: SECURITY & FEATURE TOGGLES -->
          <div class="bg-slate-50/50 rounded-xl border border-slate-200/80 p-3 sm:p-3.5 space-y-3">
            <div class="flex items-center gap-2 pb-2 border-b border-slate-200/60">
              <Lock class="w-4 h-4 text-purple-600" />
              <h4 class="text-xs font-black text-slate-800 font-khmer">
                {{ currentLanguage === 'kh' ? 'សុវត្ថិភាព & ប្រតិបត្តិការប្រព័ន្ធ' : 'Security & Access Controls' }}
              </h4>
            </div>

            <!-- Toggle 1: Maintenance Mode -->
            <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/90">
              <div class="pr-2">
                <span class="font-bold text-slate-800 text-xs block font-khmer flex items-center gap-1.5">
                  <AlertTriangle v-if="settings.maintenanceMode" class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  {{ currentLanguage === 'kh' ? 'របៀបថែទាំប្រព័ន្ធ (Maintenance Mode)' : 'Maintenance Mode' }}
                </span>
                <span class="text-slate-400 text-[10.5px]">
                  {{ currentLanguage === 'kh' ? 'បិទគេហទំព័របណ្តោះអាសន្នសម្រាប់ការជួសជុល និងធ្វើបច្ចុប្បន្នភាព' : 'Temporarily disable public access for system upgrades' }}
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" v-model="settings.maintenanceMode" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <!-- Toggle 2: Citizen Registration -->
            <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/90">
              <div class="pr-2">
                <span class="font-bold text-slate-800 text-xs block font-khmer">
                  {{ currentLanguage === 'kh' ? 'បើកឱ្យប្រជាពលរដ្ឋចុះឈ្មោះ (Citizen Sign Up)' : 'Citizen Self Registration' }}
                </span>
                <span class="text-slate-400 text-[10.5px]">
                  {{ currentLanguage === 'kh' ? 'អនុញ្ញាតឱ្យសាធារណជនបង្កើតគណនីថ្មីដោយខ្លួនឯង' : 'Allow public users to sign up and register online accounts' }}
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" v-model="settings.citizenRegistration" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- Toggle 3: Email Alerts -->
            <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/90">
              <div class="pr-2">
                <span class="font-bold text-slate-800 text-xs block font-khmer">
                  {{ currentLanguage === 'kh' ? 'ការជូនដំណឹងតាមអ៊ីមែល (Email Notifications)' : 'Email & Incident Alerts' }}
                </span>
                <span class="text-slate-400 text-[10.5px]">
                  {{ currentLanguage === 'kh' ? 'ផ្ញើសេចក្តីរាយការណ៍បន្ទាន់ទៅកាន់គណៈគ្រប់គ្រង' : 'Send critical alert notifications to designated admin staff' }}
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" v-model="settings.emailNotifications" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <!-- Toggle 4: Two-Factor Authentication -->
            <div class="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-200/90">
              <div class="pr-2">
                <span class="font-bold text-slate-800 text-xs block font-khmer">
                  {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់ ២ ជាន់ (Enforce 2FA for Admins)' : 'Two-Factor Authentication (2FA)' }}
                </span>
                <span class="text-slate-400 text-[10.5px]">
                  {{ currentLanguage === 'kh' ? 'តម្រូវឱ្យមន្ត្រី និងរដ្ឋបាលប្រើលេខកូដ OTP សុវត្ថិភាព' : 'Require OTP verification for all administrative logins' }}
                </span>
              </div>
              <label class="relative inline-flex items-center cursor-pointer shrink-0">
                <input type="checkbox" v-model="settings.twoFactorAuth" class="sr-only peer" />
                <div class="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>

            <!-- Selectors: Session Timeout & Backup -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                  {{ currentLanguage === 'kh' ? 'ផុតកំណត់សម័យប្រជុំ (Session Timeout)' : 'Session Timeout' }}
                </label>
                <select
                  v-model="settings.sessionTimeout"
                  class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="15m">15 {{ currentLanguage === 'kh' ? 'នាទី' : 'Minutes' }}</option>
                  <option value="30m">30 {{ currentLanguage === 'kh' ? 'នាទី' : 'Minutes (Default)' }}</option>
                  <option value="1h">1 {{ currentLanguage === 'kh' ? 'ម៉ោង' : 'Hour' }}</option>
                  <option value="4h">4 {{ currentLanguage === 'kh' ? 'ម៉ោង' : 'Hours' }}</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] font-bold text-slate-700 mb-1 font-khmer">
                  {{ currentLanguage === 'kh' ? 'បម្រុងទុកទិន្នន័យ (Auto Backup)' : 'Auto Backup Schedule' }}
                </label>
                <select
                  v-model="settings.autoBackup"
                  class="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  <option value="daily">{{ currentLanguage === 'kh' ? 'រៀងរាល់ថ្ងៃ (02:00 AM)' : 'Daily at 02:00 AM' }}</option>
                  <option value="weekly">{{ currentLanguage === 'kh' ? 'រៀងរាល់សប្តាហ៍' : 'Weekly on Sunday' }}</option>
                  <option value="monthly">{{ currentLanguage === 'kh' ? 'រៀងរាល់ខែ' : 'Monthly' }}</option>
                </select>
              </div>
            </div>

          </div>

        </div>
      </div>

      <!-- FOOTER STATUS BAR -->
      <div class="p-2 sm:p-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 shrink-0 bg-slate-50/60">
        <div class="flex items-center gap-1.5 text-slate-500 text-xs">
          <CheckCircle2 class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span class="font-khmer text-[11px]">
            {{ currentLanguage === 'kh' ? 'ស្ថានភាពរក្សាទុក:' : 'Status:' }}
            <strong class="text-slate-700 font-sans ml-1">{{ lastSavedTime }}</strong>
          </span>
        </div>

        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="handleReset"
            class="px-3 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset' }}
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="isSaving"
            class="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors cursor-pointer font-khmer"
          >
            <Save class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'រក្សាទុកការកំណត់' : 'Save Changes' }}</span>
          </button>
        </div>
      </div>

    </div>

  </div>
</template>
