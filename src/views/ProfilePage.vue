<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  User as UserIcon,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  CreditCard,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Sparkles,
  Clock,
  ChevronRight,
  ArrowLeft,
  Camera,
  Shield,
  LogOut
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSavedServices } from '@/composables/useSavedServices'
import { useSavedJobs } from '@/composables/useSavedJobs'

usePageMeta({
  title: 'គណនីប្រជាពលរដ្ឋ — CamLife Citizen Profile',
  description: 'Manage your citizen digital profile, personal information, security credentials, and activity on the CamLife platform.'
})

const router = useRouter()
const { currentUser, updateProfile, openLogin, logout } = useAuth()
const { currentLanguage } = useLanguage()
const { savedCount: savedServicesCount } = useSavedServices()
const { savedJobIds } = useSavedJobs()

const totalSavedCount = computed(() => savedServicesCount.value + savedJobIds.value.length)

const activeTab = ref<'general' | 'security' | 'activity'>('general')
const showPassword = ref(false)
const showNewPassword = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const provinces = [
  { km: 'រាជធានីភ្នំពេញ', en: 'Phnom Penh' },
  { km: 'ខេត្តកណ្តាល', en: 'Kandal' },
  { km: 'ខេត្តសៀមរាប', en: 'Siem Reap' },
  { km: 'ខេត្តបាត់ដំបង', en: 'Battambang' },
  { km: 'ខេត្តកំពង់ចាម', en: 'Kampong Cham' },
  { km: 'ខេត្តព្រះសីហនុ', en: 'Preah Sihanouk' },
  { km: 'ខេត្តកំពត', en: 'Kampot' },
  { km: 'ខេត្តកែប', en: 'Kep' },
  { km: 'ខេត្តកំពង់ធំ', en: 'Kampong Thom' },
  { km: 'ខេត្តកំពង់ឆ្នាំង', en: 'Kampong Chhnang' },
  { km: 'ខេត្តកំពង់ស្ពឺ', en: 'Kampong Speu' },
  { km: 'ខេត្តតាកែវ', en: 'Takeo' },
  { km: 'ខេត្តព្រៃវែង', en: 'Prey Veng' },
  { km: 'ខេត្តស្វាយរៀង', en: 'Svay Rieng' },
  { km: 'ខេត្តពោធិ៍សាត់', en: 'Pursat' },
  { km: 'ខេត្តបន្ទាយមានជ័យ', en: 'Banteay Meanchey' },
  { km: 'ខេត្តឧត្តរមានជ័យ', en: 'Oddar Meanchey' },
  { km: 'ខេត្តព្រះវិហារ', en: 'Preah Vihear' },
  { km: 'ខេត្តស្ទឹងត្រែង', en: 'Stung Treng' },
  { km: 'ខេត្តក្រចេះ', en: 'Kratie' },
  { km: 'ខេត្តរតនគិរី', en: 'Ratanakiri' },
  { km: 'ខេត្តមណ្ឌលគិរី', en: 'Mondulkiri' },
  { km: 'ខេត្តកោះកុង', en: 'Koh Kong' },
  { km: 'ខេត្តប៉ៃលិន', en: 'Pailin' },
  { km: 'ខេត្តត្បូងឃ្មុំ', en: 'Tboung Khmum' }
]

const occupations = [
  { km: 'និស្សិត / សិក្ខាកាម', en: 'Student' },
  { km: 'បុគ្គលិកក្រុមហ៊ុនឯកជន', en: 'Private Sector Employee' },
  { km: 'មន្ត្រីរាជការសាធារណៈ', en: 'Civil Servant' },
  { km: 'អាជីវករ / ម្ចាស់អាជីវកម្ម', en: 'Business Owner / Merchant' },
  { km: 'អ្នកប្រកបវិជ្ជាជីវៈសេរី (Freelancer)', en: 'Freelancer' },
  { km: 'កសិករ / វារីវប្បករ', en: 'Farmer / Agriculturist' },
  { km: 'ផ្សេងៗ', en: 'Other' }
]

const form = reactive({
  name: '',
  email: '',
  phone: '',
  nationalId: '',
  province: '',
  occupation: '',
  gender: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

onMounted(() => {
  if (!currentUser.value) {
    openLogin()
    router.push('/')
    return
  }
  loadForm()
})

function loadForm() {
  errorMessage.value = ''
  successMessage.value = ''
  form.name = currentUser.value?.name || ''
  form.email = currentUser.value?.email || ''
  form.phone = currentUser.value?.phone || '012 345 678'
  form.nationalId = currentUser.value?.nationalId || ''
  form.province = currentUser.value?.province || 'រាជធានីភ្នំពេញ'
  form.occupation = currentUser.value?.occupation || 'បុគ្គលិកក្រុមហ៊ុនឯកជន'
  form.gender = currentUser.value?.gender || 'ប្រុស'
  form.bio = currentUser.value?.bio || ''
  form.currentPassword = ''
  form.newPassword = ''
  form.confirmPassword = ''
}

function handleSave() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលឈ្មោះពេញ' : 'Please enter full name.'
    return
  }
  if (!form.email.trim() || !form.email.includes('@')) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid email.'
    return
  }

  if (activeTab.value === 'security') {
    if (form.newPassword) {
      if (form.newPassword.length < 6) {
        errorMessage.value = currentLanguage.value === 'kh' ? 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' : 'New password must be at least 6 characters.'
        return
      }
      if (form.newPassword !== form.confirmPassword) {
        errorMessage.value = currentLanguage.value === 'kh' ? 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ' : 'Passwords do not match.'
        return
      }
    }
  }

  isSaving.value = true

  setTimeout(() => {
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      nationalId: form.nationalId.trim(),
      province: form.province,
      occupation: form.occupation,
      gender: form.gender,
      bio: form.bio.trim(),
      lastLogin: new Date().toLocaleTimeString()
    })

    isSaving.value = false
    successMessage.value = currentLanguage.value === 'kh' ? 'ព័ត៌មានគណនីផ្ទាល់ខ្លួនត្រូវបានកែប្រែជោគជ័យ!' : 'Citizen profile updated successfully!'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  }, 400)
}

function handleLogout() {
  logout()
  router.push('/')
}

const sidebarItems = computed(() => [
  { id: 'general', icon: UserIcon, label: currentLanguage.value === 'kh' ? 'ព័ត៌មានទូទៅ' : 'General Info', labelSub: currentLanguage.value === 'kh' ? 'ឈ្មោះ អ៊ីមែល ទូរស័ព្ទ អត្តសញ្ញាណប័ណ្ណ' : 'Name, email, phone, ID' },
  { id: 'security', icon: Shield, label: currentLanguage.value === 'kh' ? 'សុវត្ថិភាព & ពាក្យសម្ងាត់' : 'Security & Password', labelSub: currentLanguage.value === 'kh' ? 'ផ្លាស់ប្តូរពាក្យសម្ងាត់ និងការផ្ទៀងផ្ទាត់' : 'Change password & verification' },
  { id: 'activity', icon: Bookmark, label: currentLanguage.value === 'kh' ? 'សកម្មភាពរបស់ខ្ញុំ' : 'My Activity', labelSub: currentLanguage.value === 'kh' ? 'ទិន្នន័យរក្សាទុក និងស្ថិតិប្រើប្រាស់' : 'Saved data & usage stats', badge: totalSavedCount.value }
])
</script>

<template>
  <div class="min-h-screen bg-slate-50 dark:bg-[#0B1727] font-khmer">
    <!-- ============================================================
         PAGE HERO HEADER BANNER
    ============================================================= -->
    <div class="relative bg-gradient-to-r from-[#0A2540] via-[#0D3B66] to-[#0D47A1] overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div class="absolute bottom-0 left-20 w-48 h-48 bg-blue-400/10 rounded-full translate-y-1/2"></div>
      </div>

      <div class="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-20 sm:pb-24">
        <!-- Back Button -->
        <button
          @click="router.back()"
          class="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-blue-100 hover:text-white hover:bg-white/10 transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Go Back' }}</span>
        </button>

        <div class="flex flex-col sm:flex-row items-start sm:items-end gap-4 sm:gap-6">
          <!-- Avatar -->
          <div class="relative group">
            <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#0D47A1] via-blue-500 to-indigo-400 p-0.5 shadow-2xl ring-4 ring-white/20 shrink-0">
              <div class="w-full h-full rounded-2xl bg-[#0A2540] text-blue-200 flex items-center justify-center text-4xl sm:text-5xl font-black shadow-inner">
                {{ currentUser?.name?.charAt(0)?.toUpperCase() || 'C' }}
              </div>
            </div>
            <span class="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full ring-3 ring-white dark:ring-[#0A2540]"></span>
            <button
              class="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/30 flex items-center justify-center transition-all cursor-pointer opacity-0 group-hover:opacity-100"
              title="Change avatar"
            >
              <Camera class="w-6 h-6 text-white drop-shadow-md" />
            </button>
          </div>

          <!-- Identity Info -->
          <div class="flex-1 min-w-0 pb-1">
            <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
              <h1 class="text-xl sm:text-2xl font-black text-white truncate">
                {{ currentUser?.name || 'Citizen User' }}
              </h1>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 shrink-0">
                <Sparkles class="w-2.5 h-2.5" />
                <span>{{ currentLanguage === 'kh' ? 'បានផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
              </span>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-500/20 text-blue-200 border border-blue-400/30 shrink-0">
                <ShieldCheck class="w-2.5 h-2.5" />
                <span>{{ currentUser?.role || (currentLanguage === 'kh' ? 'សមាជិកពលរដ្ឋ' : 'Citizen Member') }}</span>
              </span>
            </div>
            <p class="text-sm text-blue-200 font-mono truncate">{{ currentUser?.email }}</p>
            <p class="text-xs text-blue-300/60 mt-1">
              {{ currentLanguage === 'kh' ? 'ថ្នាលសេវាប្រជាពលរដ្ឋឌីជីថលជាតិកម្ពុជា — CamLife' : 'Cambodia National Civic Digital Services Platform — CamLife' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================
         MAIN CONTENT AREA: SIDEBAR + CONTENT
    ============================================================= -->
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 pb-16">
      <div class="flex flex-col lg:flex-row gap-5 lg:gap-6">

        <!-- LEFT SIDEBAR NAVIGATION -->
        <aside class="w-full lg:w-72 shrink-0 space-y-3">
          <!-- Tab Navigation Cards -->
          <div class="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700 p-2 space-y-1">
            <button
              v-for="item in sidebarItems"
              :key="item.id"
              @click="activeTab = item.id as 'general' | 'security' | 'activity'"
              :class="[
                'w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-150 cursor-pointer group',
                activeTab === item.id
                  ? 'bg-gradient-to-r from-[#0D47A1] to-blue-600 text-white shadow-md'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              ]"
              type="button"
            >
              <div
                :class="[
                  'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                  activeTab === item.id
                    ? 'bg-white/20'
                    : 'bg-blue-50 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-slate-700'
                ]"
              >
                <component
                  :is="item.icon"
                  :class="[
                    'w-4.5 h-4.5',
                    activeTab === item.id ? 'text-white' : 'text-[#0D47A1] dark:text-blue-400'
                  ]"
                />
              </div>
              <div class="flex-1 min-w-0">
                <p :class="['text-xs font-extrabold truncate', activeTab === item.id ? 'text-white' : '']">
                  {{ item.label }}
                </p>
                <p :class="['text-[10px] truncate mt-0.5', activeTab === item.id ? 'text-blue-100' : 'text-slate-400 dark:text-slate-500']">
                  {{ item.labelSub }}
                </p>
              </div>
              <span
                v-if="item.badge"
                :class="[
                  'px-2 py-0.5 rounded-full text-[10px] font-black font-mono shrink-0',
                  activeTab === item.id
                    ? 'bg-white/20 text-white'
                    : 'bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300'
                ]"
              >
                {{ item.badge }}
              </span>
            </button>
          </div>

          <!-- Quick Actions Card -->
          <div class="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700 p-2 space-y-1">
            <router-link
              to="/saved-services"
              class="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors group"
            >
              <div class="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center shrink-0">
                <Bookmark class="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              </div>
              <span class="flex-1 truncate">{{ currentLanguage === 'kh' ? 'ទិន្នន័យដែលបានរក្សាទុក' : 'My Saved Items' }}</span>
              <span v-if="totalSavedCount > 0" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-300 font-mono">{{ totalSavedCount }}</span>
            </router-link>

            <button
              @click="handleLogout"
              class="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              type="button"
            >
              <div class="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0">
                <LogOut class="w-4 h-4" />
              </div>
              <span>{{ currentLanguage === 'kh' ? 'ចាកចេញពីគណនី' : 'Sign Out' }}</span>
            </button>
          </div>
        </aside>

        <!-- RIGHT MAIN CONTENT -->
        <main class="flex-1 min-w-0">
          <div class="bg-white dark:bg-[#1E293B] rounded-2xl shadow-lg border border-slate-200/80 dark:border-slate-700 overflow-hidden">

            <!-- Content Header -->
            <div class="px-5 sm:px-6 py-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
              <div>
                <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  {{ activeTab === 'general' ? (currentLanguage === 'kh' ? 'ព័ត៌មានទូទៅ' : 'General Information') : activeTab === 'security' ? (currentLanguage === 'kh' ? 'សុវត្ថិភាព & ពាក្យសម្ងាត់' : 'Security & Password') : (currentLanguage === 'kh' ? 'សកម្មភាព និងស្ថិតិ' : 'Activity & Stats') }}
                </h2>
                <p class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                  {{ activeTab === 'general' ? (currentLanguage === 'kh' ? 'កែប្រែឈ្មោះ អ៊ីមែល ទូរស័ព្ទ អត្តសញ្ញាណប័ណ្ណ ខេត្ត មុខរបរ និងកំណត់សម្គាល់ផ្ទាល់ខ្លួន' : 'Update your name, email, phone, ID, province, occupation, and personal bio') : activeTab === 'security' ? (currentLanguage === 'kh' ? 'គ្រប់គ្រងពាក្យសម្ងាត់ និងការការពារគណនីរបស់អ្នក' : 'Manage your password and account protection') : (currentLanguage === 'kh' ? 'ស្ថិតិទិន្នន័យបានរក្សាទុក និងព័ត៌មានគណនី' : 'Saved data statistics and account info') }}
                </p>
              </div>
              <button
                v-if="activeTab !== 'activity'"
                @click="handleSave"
                :disabled="isSaving"
                class="hidden sm:flex px-5 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-extrabold shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 items-center gap-2 cursor-pointer shrink-0"
              >
                <span v-if="isSaving" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុកព័ត៌មាន' : 'Save Changes') }}</span>
              </button>
            </div>

            <!-- Alert Feedback Messages -->
            <div class="px-5 sm:px-6">
              <div
                v-if="errorMessage"
                class="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in"
              >
                <AlertCircle class="w-4 h-4 shrink-0" />
                <span>{{ errorMessage }}</span>
              </div>

              <div
                v-if="successMessage"
                class="mt-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in"
              >
                <CheckCircle2 class="w-4 h-4 shrink-0" />
                <span>{{ successMessage }}</span>
              </div>
            </div>

            <!-- CONTENT BODY -->
            <div class="p-5 sm:p-6 space-y-5">

              <!-- ============================
                   TAB 1: GENERAL INFO
              ============================= -->
              <div v-if="activeTab === 'general'" class="space-y-5">
                <!-- Full Name -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ currentLanguage === 'kh' ? 'ឈ្មោះពេញ (Full Name) *' : 'Full Name *' }}
                  </label>
                  <div class="relative">
                    <UserIcon class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      v-model="form.name"
                      type="text"
                      class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                      :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលឈ្មោះរបស់អ្នក...' : 'Enter full name...'"
                    />
                  </div>
                </div>

                <!-- Email & Phone -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'អ៊ីមែល (Email) *' : 'Email *' }}
                    </label>
                    <div class="relative">
                      <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="form.email"
                        type="email"
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                        placeholder="name@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ (Phone)' : 'Phone Number' }}
                    </label>
                    <div class="relative">
                      <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                        placeholder="012 345 678"
                      />
                    </div>
                  </div>
                </div>

                <!-- National ID & Gender -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID)' : 'Khmer National ID' }}
                    </label>
                    <div class="relative">
                      <CreditCard class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="form.nationalId"
                        type="text"
                        maxlength="9"
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                        placeholder="010198765"
                      />
                    </div>
                    <span class="text-[10px] text-slate-400 mt-1 block">
                      {{ currentLanguage === 'kh' ? 'លេខកូដសម្គាល់ពលរដ្ឋ ៩ ខ្ទង់' : 'Official 9-digit Khmer ID number' }}
                    </span>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'ភេទ (Gender)' : 'Gender' }}
                    </label>
                    <div class="flex items-center gap-5 pt-2">
                      <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input type="radio" v-model="form.gender" value="ប្រុស" class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                        <span class="font-semibold">{{ currentLanguage === 'kh' ? 'ប្រុស' : 'Male' }}</span>
                      </label>
                      <label class="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input type="radio" v-model="form.gender" value="ស្រី" class="w-4 h-4 text-blue-600 focus:ring-blue-500 border-slate-300" />
                        <span class="font-semibold">{{ currentLanguage === 'kh' ? 'ស្រី' : 'Female' }}</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Province & Occupation -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'រាជធានី / ខេត្ត (Province)' : 'Province / City' }}
                    </label>
                    <div class="relative">
                      <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        v-model="form.province"
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                      >
                        <option v-for="prov in provinces" :key="prov.en" :value="prov.km">
                          {{ currentLanguage === 'kh' ? prov.km : prov.en }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'មុខរបរ / វិជ្ជាជីវៈ (Occupation)' : 'Occupation' }}
                    </label>
                    <div class="relative">
                      <Briefcase class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      <select
                        v-model="form.occupation"
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                      >
                        <option v-for="occ in occupations" :key="occ.en" :value="occ.km">
                          {{ currentLanguage === 'kh' ? occ.km : occ.en }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <!-- Bio -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ currentLanguage === 'kh' ? 'កំណត់សម្គាល់ផ្ទាល់ខ្លួន (Bio / Note)' : 'Personal Bio / Note' }}
                  </label>
                  <textarea
                    v-model="form.bio"
                    rows="3"
                    class="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                    :placeholder="currentLanguage === 'kh' ? 'សរសេរព័ត៌មានសង្ខេបអំពីអ្នក...' : 'Brief note about yourself...'"
                  ></textarea>
                </div>
              </div>

              <!-- ============================
                   TAB 2: SECURITY
              ============================= -->
              <div v-if="activeTab === 'security'" class="space-y-5">
                <div class="p-4 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60 flex items-start gap-3">
                  <ShieldCheck class="w-6 h-6 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 class="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                      {{ currentLanguage === 'kh' ? 'កម្រិតសុវត្ថិភាពគណនីខ្ពស់' : 'High Security Protection' }}
                    </h5>
                    <p class="text-xs text-blue-700 dark:text-blue-300 mt-1 leading-relaxed">
                      {{ currentLanguage === 'kh'
                        ? 'គណនីរបស់អ្នកត្រូវបានការពារដោយប្រព័ន្ធសុវត្ថិភាពឌីជីថលជាតិ។ អ្នកអាចផ្លាស់ប្តូរពាក្យសម្ងាត់ដើម្បីសុវត្ថិភាពបន្ថែម។'
                        : 'Your citizen credentials are encrypted. You can update your password below at any time.'
                      }}
                    </p>
                  </div>
                </div>

                <!-- Current Password -->
                <div>
                  <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន' : 'Current Password' }}
                  </label>
                  <div class="relative">
                    <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      v-model="form.currentPassword"
                      :type="showPassword ? 'text' : 'password'"
                      class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                      placeholder="••••••••"
                    />
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                      <Eye v-if="!showPassword" class="w-4 h-4" />
                      <EyeOff v-else class="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <!-- New Password & Confirm -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់ថ្មី' : 'New Password' }}
                    </label>
                    <div class="relative">
                      <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="form.newPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        class="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                        :placeholder="currentLanguage === 'kh' ? 'យ៉ាងតិច ៦ តួអក្សរ' : 'Min 6 characters'"
                      />
                      <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
                        <Eye v-if="!showNewPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      {{ currentLanguage === 'kh' ? 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី' : 'Confirm Password' }}
                    </label>
                    <div class="relative">
                      <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        v-model="form.confirmPassword"
                        :type="showNewPassword ? 'text' : 'password'"
                        class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <!-- ============================
                   TAB 3: ACTIVITY
              ============================= -->
              <div v-if="activeTab === 'activity'" class="space-y-5">
                <!-- Stats Cards -->
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div class="p-4 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-center">
                    <div class="w-10 h-10 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center mx-auto mb-2">
                      <Bookmark class="w-5 h-5" />
                    </div>
                    <p class="text-2xl font-black text-[#0D47A1] dark:text-blue-300 font-mono">{{ savedServicesCount }}</p>
                    <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                      {{ currentLanguage === 'kh' ? 'សេវាសាធារណៈបាន Save' : 'Saved Services' }}
                    </p>
                  </div>

                  <div class="p-4 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
                    <div class="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-2">
                      <Briefcase class="w-5 h-5" />
                    </div>
                    <p class="text-2xl font-black text-indigo-600 dark:text-indigo-300 font-mono">{{ savedJobIds.length }}</p>
                    <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                      {{ currentLanguage === 'kh' ? 'ឱកាសការងារបាន Save' : 'Saved Jobs' }}
                    </p>
                  </div>

                  <div class="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 text-center col-span-2 sm:col-span-1">
                    <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 class="w-5 h-5" />
                    </div>
                    <p class="text-2xl font-black text-emerald-600 dark:text-emerald-300 font-mono">{{ totalSavedCount }}</p>
                    <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-1">
                      {{ currentLanguage === 'kh' ? 'ទិន្នន័យសរុប' : 'Total Items' }}
                    </p>
                  </div>
                </div>

                <!-- Quick Links -->
                <router-link
                  to="/saved-services"
                  class="block p-4 rounded-2xl bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-blue-500/5 hover:from-blue-500/10 hover:via-indigo-500/10 hover:to-blue-500/10 border border-blue-200/80 dark:border-blue-800 transition-all group"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                      <div class="w-10 h-10 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Bookmark class="w-5 h-5" />
                      </div>
                      <div>
                        <h6 class="text-sm font-black text-slate-900 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-300 transition-colors">
                          {{ currentLanguage === 'kh' ? 'ចូលទៅកាន់ទំព័រទិន្នន័យដែលបានរក្សាទុក' : 'Go to Saved Items Page' }}
                        </h6>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                          {{ currentLanguage === 'kh' ? 'មើល និងគ្រប់គ្រងសេវា និងមុខតំណែងការងារដែលអ្នកបានកត់ចំណាំ' : 'Review and manage your bookmarked items' }}
                        </p>
                      </div>
                    </div>
                    <ChevronRight class="w-5 h-5 text-slate-400 group-hover:text-[#0D47A1] group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                </router-link>

                <!-- Account Info -->
                <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <h6 class="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
                    {{ currentLanguage === 'kh' ? 'ព័ត៌មានគណនី' : 'Account Information' }}
                  </h6>
                  <div class="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 dark:border-slate-700">
                    <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ស្ថានភាពគណនី' : 'Account Status' }}</span>
                    <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 class="w-3.5 h-3.5" />
                      <span>{{ currentLanguage === 'kh' ? 'សកម្ម / ផ្ទៀងផ្ទាត់រួច' : 'Active & Verified' }}</span>
                    </span>
                  </div>
                  <div class="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 dark:border-slate-700">
                    <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ប្រភេទគណនី' : 'Account Type' }}</span>
                    <span class="font-bold text-slate-700 dark:text-slate-300">{{ currentUser?.role || 'Citizen Member' }}</span>
                  </div>
                  <div class="flex items-center justify-between text-xs py-1.5 border-t border-slate-100 dark:border-slate-700">
                    <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ចូលប្រើចុងក្រោយ' : 'Last Session' }}</span>
                    <span class="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Clock class="w-3 h-3 text-slate-400" />
                      <span>{{ currentUser?.lastLogin || 'Today' }}</span>
                    </span>
                  </div>
                </div>
              </div>

            </div>

            <!-- Mobile Save Button (sticky bottom) -->
            <div v-if="activeTab !== 'activity'" class="sm:hidden p-4 border-t border-slate-100 dark:border-slate-700/80 bg-white dark:bg-[#1E293B] sticky bottom-0">
              <button
                @click="handleSave"
                :disabled="isSaving"
                class="w-full py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-sm font-extrabold shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុកព័ត៌មាន' : 'Save Changes') }}</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
