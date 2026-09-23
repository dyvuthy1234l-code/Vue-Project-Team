<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
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
  LogIn,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Bookmark,
  Sparkles,
  Clock,
  ChevronRight,
  LogOut,
  ArrowRight,
  Save,
  KeyRound,
  Shield,
  Layers,
  Home,
  Building2,
  ExternalLink,
  FileText,
  X,
  Ban,
  Globe
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'
import { useSavedServices } from '@/composables/useSavedServices'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { usePartnerSubmissions } from '@/composables/usePartnerSubmissions'
import type { PartnerSubmission } from '@/types'

usePageMeta({
  title: 'គណនីប្រជាពលរដ្ឋ — CamLife Citizen Profile',
  description: 'Manage your citizen digital profile, personal information, security credentials, and activity on the CamLife platform.'
})

const router = useRouter()
const { currentUser, updateProfile, openLogin, logout, loginAsDemoCitizen } = useAuth()
const { currentLanguage } = useLanguage()
const { savedCount: savedServicesCount } = useSavedServices()
const { savedJobIds } = useSavedJobs()
const { submissions } = usePartnerSubmissions()

const totalSavedCount = computed(() => savedServicesCount.value + savedJobIds.value.length)

const activeTab = ref<'general' | 'security' | 'activity' | 'submissions'>('general')

const selectedSubmissionDetail = ref<PartnerSubmission | null>(null)
const isSubmissionDetailOpen = ref(false)

const userSubmissions = computed(() => {
  if (!currentUser.value) return []
  const currentId = currentUser.value?.nationalId || currentUser.value?.email
  return submissions.value.filter(s =>
    (s.userId && currentId && s.userId === currentId) ||
    (s.applicantEmail && currentUser.value?.email && s.applicantEmail.toLowerCase() === currentUser.value.email.toLowerCase()) ||
    (s.email && currentUser.value?.email && s.email.toLowerCase() === currentUser.value.email.toLowerCase()) ||
    (s.representativeName && currentUser.value?.name && s.representativeName.toLowerCase().includes(currentUser.value.name.toLowerCase()))
  )
})

function openSubmissionDetail(sub: PartnerSubmission) {
  selectedSubmissionDetail.value = sub
  isSubmissionDetailOpen.value = true
}

function closeSubmissionDetail() {
  isSubmissionDetailOpen.value = false
}

function getLiveLink(sub: PartnerSubmission): string {
  if (sub.facilityType === 'hospital' || sub.facilityType === 'clinic' || sub.facilityType === 'pharmacy') {
    return '/health'
  }
  if (sub.facilityType === 'home-service') {
    return '/home-services'
  }
  if (sub.facilityType === 'employer') {
    return '/jobs'
  }
  if (sub.facilityType === 'transport') {
    return '/transport'
  }
  if (sub.facilityType === 'emergency-ambulance') {
    return '/emergency'
  }
  return '/'
}
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

watch(
  () => currentUser.value,
  (user) => {
    if (user) {
      loadForm()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (currentUser.value) {
    loadForm()
  }
})

function handleDemoLogin() {
  loginAsDemoCitizen()
}

function loadForm() {
  errorMessage.value = ''
  successMessage.value = ''
  form.name = currentUser.value?.name || ''
  form.email = currentUser.value?.email || ''
  form.phone = currentUser.value?.phone || '012 345 678'
  form.nationalId = currentUser.value?.nationalId || '010198765'
  form.province = currentUser.value?.province || 'រាជធានីភ្នំពេញ'
  form.occupation = currentUser.value?.occupation || 'បុគ្គលិកក្រុមហ៊ុនឯកជន'
  form.gender = currentUser.value?.gender || 'ប្រុស'
  form.bio = currentUser.value?.bio || (currentLanguage.value === 'kh' ? 'ប្រជាពលរដ្ឋសកម្មប្រើប្រាស់សេវាឌីជីថលជាតិ CamLife' : 'Active citizen utilizing CamLife civic platform services')
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
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })

    isSaving.value = false
    successMessage.value = currentLanguage.value === 'kh' ? 'ព័ត៌មានគណនីផ្ទាល់ខ្លួនត្រូវបានកែប្រែជោគជ័យ!' : 'Citizen profile updated successfully!'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 4000)
  }, 400)
}

function handleLogout() {
  logout()
  router.push('/')
}
</script>

<template>
  <div class="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-20 py-4 sm:py-8 space-y-4 sm:space-y-6 font-khmer">

    <!-- ============================================================
         1. COMPACT BREADCRUMBS & SECTION TITLE (OPTIMIZED FOR MOBILE)
    ============================================================= -->
    <div class="flex items-center justify-between gap-2">
      <div class="min-w-0 flex-1">
        <!-- Breadcrumb Navigation -->
        <div class="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1">
          <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 flex items-center gap-1 transition-colors shrink-0">
            <Home class="w-3.5 h-3.5" />
            <span class="hidden xs:inline">{{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}</span>
          </router-link>
          <span class="text-slate-300 dark:text-slate-600">/</span>
          <span class="text-[#0D47A1] dark:text-blue-400 font-bold truncate">
            {{ currentLanguage === 'kh' ? 'គណនីផ្ទាល់ខ្លួន' : 'My Profile' }}
          </span>
        </div>

        <h1 class="text-lg sm:text-2xl md:text-3xl font-black text-[#0A2540] dark:text-white tracking-tight truncate">
          {{ currentLanguage === 'kh' ? 'ព័ត៌មានគណនីប្រជាពលរដ្ឋ' : 'Citizen Digital Identity' }}
        </h1>
        <p class="hidden sm:block mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងទិន្នន័យអត្តសញ្ញាណ លេខទូរស័ព្ទ អត្តសញ្ញាណប័ណ្ណ និងសុវត្ថិភាពគណនីរបស់អ្នក' : 'Manage your personal identity credentials, contact info, National ID, and account security' }}
        </p>
      </div>

      <!-- Quick Action Buttons -->
      <div class="flex items-center gap-1.5 shrink-0">
        <router-link
          to="/saved-services"
          class="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-[#0D47A1] dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-slate-700 text-xs font-bold border border-blue-200/80 dark:border-slate-700 transition-colors"
          :title="currentLanguage === 'kh' ? 'ទិន្នន័យបាន Save' : 'Saved Items'"
        >
          <Bookmark class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'ទិន្នន័យបាន Save' : 'Saved' }}</span>
          <span v-if="totalSavedCount > 0" class="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#0D47A1] text-white font-mono">
            {{ totalSavedCount }}
          </span>
        </router-link>

        <button
          v-if="currentUser"
          @click="handleLogout"
          class="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-red-200/80 dark:border-red-900/60 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
          type="button"
          :title="currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out'"
        >
          <LogOut class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
        </button>

        <button
          v-else
          @click="openLogin"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          type="button"
        >
          <LogIn class="w-3.5 h-3.5" />
          <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'ចូលគណនី' : 'Sign In' }}</span>
        </button>
      </div>
    </div>

    <!-- ============================================================
         AUTH GATE: WHEN CITIZEN IS NOT SIGNED IN
    ============================================================= -->
    <div v-if="!currentUser" class="max-w-xl mx-auto my-8 bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200/90 dark:border-slate-800 shadow-xl text-center space-y-6">
      <div class="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 mx-auto flex items-center justify-center ring-8 ring-blue-500/10 shadow-lg">
        <Lock class="w-10 h-10" />
      </div>

      <div class="space-y-2">
        <h2 class="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
          {{ currentLanguage === 'kh' ? 'សូមចូលគណនីដើម្បីគ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន' : 'Please Sign In to Access Your Profile' }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          {{ currentLanguage === 'kh'
            ? 'ចូលគណនីដើម្បីពិនិត្យទិន្នន័យអត្តសញ្ញាណប័ណ្ណ លេខទូរស័ព្ទ សេវារដ្ឋបាលដែលបាន Save និងស្ថានភាពពាក្យស្នើសុំនានា។'
            : 'Sign in to inspect your digital identity, National ID, saved services, job applications, and partner submissions.'
          }}
        </p>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <button
          @click="openLogin"
          class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-black shadow-lg shadow-blue-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          type="button"
        >
          <LogIn class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ចូលគណនីឥឡូវនេះ (Sign In)' : 'Sign In Now' }}</span>
        </button>

        <button
          @click="handleDemoLogin"
          class="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-900/20 transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95"
          type="button"
        >
          <Sparkles class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'ចូលគណនីពលរដ្ឋសាកល្បង (Demo)' : 'Quick Demo Citizen Login' }}</span>
        </button>
      </div>
    </div>

    <!-- ============================================================
         AUTHENTICATED CITIZEN PROFILE CONTENT
    ============================================================= -->
    <div v-else class="space-y-4 sm:space-y-6">

      <!-- ============================================================
           2. CITIZEN IDENTITY HERO CARD (RESPONSIVE FOR MOBILE & DESKTOP)
      ============================================================= -->
      <div class="relative rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0A2540] via-[#0D3B66] to-[#0D47A1] p-4 sm:p-7 text-white shadow-xl border border-blue-900/40 overflow-hidden">
      <!-- Decorative Backdrop Circles -->
      <div class="absolute -right-10 -bottom-10 w-60 h-60 bg-blue-400/10 rounded-full blur-2xl pointer-events-none"></div>
      <div class="absolute right-1/3 -top-12 w-48 h-48 bg-white/5 rounded-full blur-xl pointer-events-none"></div>

      <div class="relative z-10 space-y-3.5 sm:space-y-5">
        <!-- Top Section: Avatar + Identity Info -->
        <div class="flex items-start sm:items-center gap-3.5 sm:gap-5">
          <!-- Avatar Box -->
          <div class="relative shrink-0">
            <div class="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-400 via-blue-400 to-indigo-300 p-0.5 shadow-lg ring-2 sm:ring-4 ring-white/20">
              <div class="w-full h-full rounded-2xl bg-[#0A2540] text-blue-100 flex items-center justify-center text-2xl sm:text-3xl font-black">
                {{ (currentUser?.name || form.name || 'U').charAt(0).toUpperCase() }}
              </div>
            </div>
            <span class="absolute -bottom-0.5 -right-0.5 w-4 h-4 sm:w-4.5 sm:h-4.5 bg-emerald-500 rounded-full ring-2 ring-[#0A2540]" title="Verified"></span>
          </div>

          <!-- Name & Details -->
          <div class="min-w-0 flex-1">
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
              <h2 class="text-base sm:text-xl font-black tracking-tight truncate text-white leading-tight">
                {{ currentUser?.name || form.name || (currentLanguage === 'kh' ? 'សមាជិកពលរដ្ឋ' : 'Citizen Member') }}
              </h2>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-emerald-500/25 text-emerald-200 border border-emerald-400/30 shrink-0">
                <Sparkles class="w-2.5 h-2.5" />
                <span>{{ currentLanguage === 'kh' ? 'បានផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
              </span>
              <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-extrabold bg-blue-400/20 text-blue-200 border border-blue-300/30 shrink-0">
                <ShieldCheck class="w-2.5 h-2.5" />
                <span>{{ currentUser?.role || (currentLanguage === 'kh' ? 'សមាជិកពលរដ្ឋ' : 'Citizen') }}</span>
              </span>
            </div>

            <!-- Detail Pills -->
            <div class="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-x-4 gap-y-0.5 sm:gap-y-1 text-[11px] sm:text-xs text-blue-100/90 font-medium">
              <span class="flex items-center gap-1.5 truncate">
                <Mail class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300 shrink-0" />
                <span class="font-mono truncate">{{ currentUser?.email || form.email || 'citizen@camlife.kh' }}</span>
              </span>
              <span v-if="currentUser?.phone || form.phone" class="flex items-center gap-1.5 truncate">
                <Phone class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300 shrink-0" />
                <span class="font-mono">{{ currentUser?.phone || form.phone }}</span>
              </span>
              <span v-if="currentUser?.nationalId || form.nationalId" class="flex items-center gap-1.5 truncate">
                <CreditCard class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-300 shrink-0" />
                <span class="font-mono font-bold">{{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណ' : 'ID' }}: {{ currentUser?.nationalId || form.nationalId }}</span>
              </span>
              <span v-if="currentUser?.province || form.province" class="flex items-center gap-1.5 truncate">
                <MapPin class="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-300 shrink-0" />
                <span>{{ currentUser?.province || form.province }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Bottom Stats Row -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3 pt-3 border-t border-white/10">
          <div class="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <p class="text-base sm:text-xl font-black text-white font-mono">{{ savedServicesCount }}</p>
            <p class="text-[10px] sm:text-[11px] font-medium text-blue-200 mt-0.5 truncate">{{ currentLanguage === 'kh' ? 'សេវាបាន Save' : 'Services' }}</p>
          </div>

          <div class="p-2 sm:p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-center">
            <p class="text-base sm:text-xl font-black text-white font-mono">{{ savedJobIds.length }}</p>
            <p class="text-[10px] sm:text-[11px] font-medium text-blue-200 mt-0.5 truncate">{{ currentLanguage === 'kh' ? 'ការងារបាន Save' : 'Jobs' }}</p>
          </div>

          <div class="p-2 sm:p-3 rounded-xl bg-emerald-500/15 backdrop-blur-md border border-emerald-400/25 text-center flex flex-col items-center justify-center">
            <CheckCircle2 class="w-4 h-4 sm:w-5 sm:h-5 text-emerald-300" />
            <p class="text-[10px] sm:text-[11px] font-extrabold text-emerald-200 mt-0.5 truncate">{{ currentLanguage === 'kh' ? 'គណនីសកម្ម' : 'Active' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ============================================================
         3. SEGMENTED TABS (FITS ALL SCREEN SIZES - NO OVERFLOW BUG)
    ============================================================= -->
    <div class="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl sm:rounded-3xl p-1.5 sm:p-2.5 shadow-sm flex items-center justify-between gap-3">
      <!-- 3 Equal Tabs on Mobile, Flex on Desktop -->
      <div class="grid grid-cols-3 sm:flex sm:items-center gap-1 sm:gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl sm:rounded-2xl w-full sm:w-auto">
        <!-- Tab 1: General -->
        <button
          type="button"
          @click="activeTab = 'general'"
          :class="[
            'px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center',
            activeTab === 'general'
              ? 'bg-[#0D47A1] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <UserIcon class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">{{ currentLanguage === 'kh' ? 'ព័ត៌មានទូទៅ' : 'General Info' }}</span>
        </button>

        <!-- Tab 2: Security -->
        <button
          type="button"
          @click="activeTab = 'security'"
          :class="[
            'px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 text-center',
            activeTab === 'security'
              ? 'bg-[#0D47A1] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <Lock class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">{{ currentLanguage === 'kh' ? 'សុវត្ថិភាព' : 'Security' }}</span>
        </button>

        <!-- Tab 3: Activity -->
        <button
          type="button"
          @click="activeTab = 'activity'"
          :class="[
            'px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-center',
            activeTab === 'activity'
              ? 'bg-[#0D47A1] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <Bookmark class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Activity' }}</span>
          <span
            v-if="totalSavedCount > 0"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono shrink-0',
              activeTab === 'activity' ? 'bg-white/20 text-white' : 'bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300'
            ]"
          >
            {{ totalSavedCount }}
          </span>
        </button>

        <!-- Tab 4: Submissions -->
        <button
          type="button"
          @click="activeTab = 'submissions'"
          :class="[
            'px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 sm:gap-1.5 text-center',
            activeTab === 'submissions'
              ? 'bg-[#0D47A1] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          ]"
        >
          <Building2 class="w-3.5 h-3.5 shrink-0" />
          <span class="truncate">{{ currentLanguage === 'kh' ? 'ពាក្យស្នើសុំដៃគូ' : 'Submissions' }}</span>
          <span
            v-if="userSubmissions.length > 0"
            :class="[
              'px-1.5 py-0.2 rounded-full text-[9px] font-black font-mono shrink-0',
              activeTab === 'submissions' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
            ]"
          >
            {{ userSubmissions.length }}
          </span>
        </button>
      </div>

      <!-- Desktop Save Button on Tab Bar -->
      <button
        v-if="activeTab === 'general' || activeTab === 'security'"
        @click="handleSave"
        :disabled="isSaving"
        class="hidden sm:flex px-6 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-extrabold shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 items-center justify-center gap-2 cursor-pointer shrink-0"
        type="button"
      >
        <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
        <Save v-else class="w-4 h-4" />
        <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save Changes') }}</span>
      </button>
    </div>

    <!-- Feedback Alerts -->
    <div v-if="errorMessage" class="p-3 sm:p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl flex items-center gap-2.5 animate-in fade-in">
      <AlertCircle class="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <span>{{ errorMessage }}</span>
    </div>

    <div v-if="successMessage" class="p-3 sm:p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-semibold rounded-xl sm:rounded-2xl flex items-center gap-2.5 animate-in fade-in">
      <CheckCircle2 class="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
      <span>{{ successMessage }}</span>
    </div>

    <!-- ============================================================
         4. MAIN FORM TABS CONTENT
    ============================================================= -->

    <!-- TAB 1: GENERAL INFORMATION -->
    <div v-if="activeTab === 'general'" class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
      <div class="border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
        <h3 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <UserIcon class="w-4 h-4 sm:w-5 sm:h-5 text-[#0D47A1] dark:text-blue-400" />
          <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានអត្តសញ្ញាណប្រជាពលរដ្ឋ' : 'Personal Identity Information' }}</span>
        </h3>
        <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {{ currentLanguage === 'kh' ? 'ទិន្នន័យសម្រាប់សម្រួលការបំពេញបែបបទសេវារដ្ឋបាល និងការដាក់ពាក្យការងារ' : 'This information is used to auto-fill civic administrative applications and job submissions.' }}
        </p>
      </div>

      <!-- Field Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
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
              class="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all"
              :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលឈ្មោះរបស់អ្នក...' : 'Enter your full name...'"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល (Email) *' : 'Email Address *' }}
          </label>
          <div class="relative">
            <Mail class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.email"
              type="email"
              class="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all font-mono"
              placeholder="citizen@camlife.kh"
            />
          </div>
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ (Phone Number)' : 'Phone Number' }}
          </label>
          <div class="relative">
            <Phone class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.phone"
              type="tel"
              class="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all font-mono"
              placeholder="012 345 678"
            />
          </div>
        </div>

        <!-- Khmer National ID Card -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'លេខអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID)' : 'Khmer National ID (9 Digits)' }}
          </label>
          <div class="relative">
            <CreditCard class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.nationalId"
              type="text"
              maxlength="9"
              class="w-full pl-10 pr-3 sm:pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all font-mono tracking-wider"
              placeholder="010198765"
            />
          </div>
          <span class="text-[10px] sm:text-[11px] text-slate-400 dark:text-slate-500 mt-1 block">
            {{ currentLanguage === 'kh' ? 'លេខកូដសម្គាល់ប្រជាពលរដ្ឋ ៩ ខ្ទង់ផ្លូវការ' : 'Official 9-digit Cambodian identity number' }}
          </span>
        </div>

        <!-- Province / City -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'រាជធានី / ខេត្ត (Province / City)' : 'Province / City' }}
          </label>
          <div class="relative">
            <MapPin class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              v-model="form.province"
              class="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all appearance-none cursor-pointer"
            >
              <option v-for="prov in provinces" :key="prov.en" :value="prov.km">
                {{ currentLanguage === 'kh' ? prov.km : prov.en }}
              </option>
            </select>
            <ChevronRight class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>
        </div>

        <!-- Occupation -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'មុខរបរ / វិជ្ជាជីវៈ (Occupation)' : 'Occupation / Profession' }}
          </label>
          <div class="relative">
            <Briefcase class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              v-model="form.occupation"
              class="w-full pl-10 pr-9 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all appearance-none cursor-pointer"
            >
              <option v-for="occ in occupations" :key="occ.en" :value="occ.km">
                {{ currentLanguage === 'kh' ? occ.km : occ.en }}
              </option>
            </select>
            <ChevronRight class="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90 pointer-events-none" />
          </div>
        </div>

        <!-- Gender Selection -->
        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'ភេទ (Gender)' : 'Gender' }}
          </label>
          <div class="grid grid-cols-2 gap-3 max-w-lg">
            <label
              :class="[
                'flex items-center justify-center gap-2.5 p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs',
                form.gender === 'ប្រុស'
                  ? 'bg-blue-50 dark:bg-blue-950/60 border-[#0D47A1] text-[#0D47A1] dark:text-blue-300 ring-2 ring-[#0D47A1]/20 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-white dark:hover:bg-slate-800'
              ]"
            >
              <input type="radio" v-model="form.gender" value="ប្រុស" class="sr-only" />
              <!-- Male Icon (Mars SVG) -->
              <svg class="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="10" cy="14" r="5"/>
                <path d="M19 5l-5.4 5.4"/>
                <path d="M19 5h-5"/>
                <path d="M19 5v5"/>
              </svg>
              <span>{{ currentLanguage === 'kh' ? 'ភេទប្រុស' : 'Male' }}</span>
            </label>

            <label
              :class="[
                'flex items-center justify-center gap-2.5 p-3 rounded-xl sm:rounded-2xl border text-xs sm:text-sm font-bold cursor-pointer transition-all shadow-xs',
                form.gender === 'ស្រី'
                  ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/20 shadow-sm'
                  : 'bg-slate-50/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-rose-300 hover:bg-white dark:hover:bg-slate-800'
              ]"
            >
              <input type="radio" v-model="form.gender" value="ស្រី" class="sr-only" />
              <!-- Female Icon (Venus SVG) -->
              <svg class="w-4 h-4 text-rose-500 dark:text-rose-400 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="10" r="5"/>
                <path d="M12 15v7"/>
                <path d="M9 19h6"/>
              </svg>
              <span>{{ currentLanguage === 'kh' ? 'ភេទស្រី' : 'Female' }}</span>
            </label>
          </div>
        </div>

        <!-- Personal Bio / Notes -->
        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'កំណត់សម្គាល់ផ្ទាល់ខ្លួន (Personal Bio / Note)' : 'Personal Bio / Note' }}
          </label>
          <textarea
            v-model="form.bio"
            rows="3"
            class="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all resize-none"
            :placeholder="currentLanguage === 'kh' ? 'សរសេរព័ត៌មានសង្ខេបអំពីអ្នក...' : 'Write a brief note about yourself...'"
          ></textarea>
        </div>
      </div>

      <!-- Form Action Button (Full Width on Mobile) -->
      <div class="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="w-full sm:w-auto px-8 py-3 rounded-xl sm:rounded-2xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុកព័ត៌មាន' : 'Save Changes') }}</span>
        </button>
      </div>
    </div>

    <!-- TAB 2: SECURITY & PASSWORD -->
    <div v-if="activeTab === 'security'" class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-8 shadow-sm space-y-4 sm:space-y-6">
      <div class="border-b border-slate-100 dark:border-slate-800 pb-3 sm:pb-4">
        <h3 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <KeyRound class="w-4 h-4 sm:w-5 sm:h-5 text-[#0D47A1] dark:text-blue-400" />
          <span>{{ currentLanguage === 'kh' ? 'សុវត្ថិភាព និងលេខសម្ងាត់' : 'Security & Password Settings' }}</span>
        </h3>
        <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {{ currentLanguage === 'kh' ? 'ផ្លាស់ប្តូរលេខសម្ងាត់ និងពិនិត្យកម្រិតសុវត្ថិភាពគណនីរបស់អ្នក' : 'Update your password and verify your civic digital credentials.' }}
        </p>
      </div>

      <!-- Security Status Card -->
      <div class="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-blue-50/80 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 flex items-start gap-3 sm:gap-4">
        <div class="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
          <Shield class="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        <div>
          <h4 class="text-xs sm:text-sm font-extrabold text-[#0A2540] dark:text-blue-200">
            {{ currentLanguage === 'kh' ? 'ប្រព័ន្ធការពារសុវត្ថិភាពគណនីជាតិ (Civic Encryption)' : 'National Civic Security Protection' }}
          </h4>
          <p class="text-[11px] sm:text-xs text-slate-600 dark:text-blue-300 mt-0.5 sm:mt-1 leading-relaxed">
            {{ currentLanguage === 'kh'
              ? 'គណនីរបស់អ្នកត្រូវបានភ្ជាប់ជាមួយលេខសម្គាល់ឌីជីថលជាតិ។ សូមកុំចែករំលែកពាក្យសម្ងាត់របស់អ្នកទៅកាន់អ្នកដទៃ។'
              : 'Your account credentials are encrypted and mapped to national identity standards. Never share your password with anyone.'
            }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-6">
        <!-- Current Password -->
        <div class="md:col-span-2">
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន (Current Password)' : 'Current Password' }}
          </label>
          <div class="relative max-w-lg">
            <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.currentPassword"
              :type="showPassword ? 'text' : 'password'"
              class="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all font-mono"
              placeholder="••••••••"
            />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <Eye v-if="!showPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- New Password -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់ថ្មី (New Password)' : 'New Password' }}
          </label>
          <div class="relative">
            <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.newPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="w-full pl-10 pr-10 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all font-mono"
              :placeholder="currentLanguage === 'kh' ? 'យ៉ាងតិច ៦ តួអក្សរ' : 'Minimum 6 characters'"
            />
            <button type="button" @click="showNewPassword = !showNewPassword" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer">
              <Eye v-if="!showNewPassword" class="w-4 h-4" />
              <EyeOff v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Confirm Password -->
        <div>
          <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            {{ currentLanguage === 'kh' ? 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី (Confirm Password)' : 'Confirm New Password' }}
          </label>
          <div class="relative">
            <Lock class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="form.confirmPassword"
              :type="showNewPassword ? 'text' : 'password'"
              class="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs sm:text-sm font-semibold focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-[#0D47A1] transition-all font-mono"
              placeholder="••••••••"
            />
          </div>
        </div>
      </div>

      <!-- Action Button (Full Width on Mobile) -->
      <div class="pt-3 sm:pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
        <button
          @click="handleSave"
          :disabled="isSaving"
          class="w-full sm:w-auto px-8 py-3 rounded-xl sm:rounded-2xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          type="button"
        >
          <span v-if="isSaving" class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          <Save v-else class="w-4 h-4" />
          <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Updating...') : (currentLanguage === 'kh' ? 'ប្តូរពាក្យសម្ងាត់' : 'Update Password') }}</span>
        </button>
      </div>
    </div>

    <!-- TAB 3: ACTIVITY & SAVED STATS -->
    <div v-if="activeTab === 'activity'" class="space-y-4 sm:space-y-6">
      <!-- Activity Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-5">
        <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex items-center gap-3.5 sm:gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Bookmark class="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-black text-[#0D47A1] dark:text-blue-400 font-mono">{{ savedServicesCount }}</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{{ currentLanguage === 'kh' ? 'សេវាសាធារណៈបានរក្សាទុក' : 'Saved Civic Services' }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex items-center gap-3.5 sm:gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Briefcase class="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-black text-indigo-600 dark:text-indigo-400 font-mono">{{ savedJobIds.length }}</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{{ currentLanguage === 'kh' ? 'ឱកាសការងារបានរក្សាទុក' : 'Saved Career Jobs' }}</p>
          </div>
        </div>

        <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex items-center gap-3.5 sm:gap-4">
          <div class="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 class="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <p class="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{{ totalSavedCount }}</p>
            <p class="text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5">{{ currentLanguage === 'kh' ? 'ទិន្នន័យសរុបទាំងអស់' : 'Total Bookmarked Items' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick Action Card -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
        <div class="flex items-center gap-3 sm:gap-4">
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0">
            <Layers class="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <h4 class="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ទំព័រទិន្នន័យដែលបានរក្សាទុក (Citizen Pocket)' : 'My Saved Bookmarks Hub' }}
            </h4>
            <p class="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {{ currentLanguage === 'kh' ? 'ចូលទៅកាន់ទំព័ររួមដើម្បីស្វែងរក មើលការណែនាំសេវា ឬដាក់ពាក្យការងារដែលបានកត់ចំណាំ' : 'Access your unified saved pocket to filter and apply for bookmarked services and jobs.' }}
            </p>
          </div>
        </div>

        <router-link
          to="/saved-services"
          class="inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-extrabold transition-all shadow-md active:scale-95 shrink-0"
        >
          <span>{{ currentLanguage === 'kh' ? 'ចូលមើលទិន្នន័យបាន Save' : 'Open Saved Hub' }}</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>

      <!-- Account Metadata Card -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm space-y-2.5 sm:space-y-3">
        <h4 class="text-xs font-extrabold text-slate-800 dark:text-white uppercase tracking-wider">
          {{ currentLanguage === 'kh' ? 'ព័ត៌មានប្រព័ន្ធគណនី' : 'Account System Information' }}
        </h4>
        <div class="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
          <div class="py-2 flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ស្ថានភាពគណនី' : 'Account Status' }}</span>
            <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <CheckCircle2 class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'សកម្ម និងផ្ទៀងផ្ទាត់រួច' : 'Active & Verified' }}</span>
            </span>
          </div>
          <div class="py-2 flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'តួនាទី' : 'Role' }}</span>
            <span class="font-bold text-slate-700 dark:text-slate-300">{{ currentUser?.role || 'Citizen Member' }}</span>
          </div>
          <div class="py-2 flex items-center justify-between">
            <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'សម័យប្រជុំចុងក្រោយ' : 'Last Session' }}</span>
            <span class="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <Clock class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ currentUser?.lastLogin || 'Today' }}</span>
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- TAB 4: PARTNER SUBMISSIONS -->
    <div v-if="activeTab === 'submissions'" class="space-y-4 sm:space-y-6">
      <!-- Top header banner -->
      <div class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 class="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Building2 class="w-5 h-5 text-[#0D47A1] dark:text-blue-400" />
            <span>{{ currentLanguage === 'kh' ? 'ពាក្យស្នើសុំចុះបញ្ជីដៃគូសេវារបស់ខ្ញុំ' : 'My Partner Onboarding Submissions' }}</span>
          </h3>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {{ currentLanguage === 'kh' ? 'តាមដានស្ថានភាពការត្រួតពិនិត្យ និងមើលព័ត៌មានលម្អិតនៃពាក្យស្នើសុំទាំងអស់' : 'Track verification progress and review full details of your applications.' }}
          </p>
        </div>

        <router-link
          to="/partner-register"
          class="px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-black transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
        >
          <span>{{ currentLanguage === 'kh' ? '+ ដាក់ពាក្យថ្មី' : '+ New Submission' }}</span>
        </router-link>
      </div>

      <!-- If no submissions -->
      <div v-if="userSubmissions.length === 0" class="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 p-10 text-center space-y-4">
        <FileText class="w-12 h-12 text-slate-300 mx-auto" />
        <h4 class="text-base font-bold text-slate-800 dark:text-white">
          {{ currentLanguage === 'kh' ? 'មិនទាន់មានពាក្យស្នើសុំនៅឡើយទេ' : 'No partner submissions found.' }}
        </h4>
        <p class="text-xs text-slate-400 max-w-sm mx-auto">
          {{ currentLanguage === 'kh' ? 'លោកអ្នកអាចដាក់ពាក្យស្នើសុំចុះបញ្ជីមន្ទីរពេទ្យ គ្លីនិក ឱសថស្ថាន សេវាជាង ក្រុមហ៊ុន ឬដឹកជញ្ជូន។' : 'You can register your hospital, clinic, pharmacy, home service, enterprise, or transit.' }}
        </p>
        <router-link
          to="/partner-register"
          class="inline-block px-5 py-2.5 rounded-xl bg-[#0D47A1] text-white font-bold text-xs shadow-sm"
        >
          {{ currentLanguage === 'kh' ? '+ ចុះបញ្ជីស្ថាប័នឥឡូវនេះ' : '+ Register Now' }}
        </router-link>
      </div>

      <!-- Submissions List -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="sub in userSubmissions"
          :key="sub.id"
          class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 p-5 shadow-xs flex flex-col justify-between space-y-4"
        >
          <div class="space-y-3">
            <div class="flex items-start justify-between gap-3">
              <div>
                <h4 class="font-extrabold text-sm text-slate-900 dark:text-white">{{ sub.nameKh }}</h4>
                <p class="text-xs text-slate-400 font-mono">{{ sub.nameEn }}</p>
              </div>
              <span
                v-if="sub.status === 'pending'"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
              >
                <Clock class="w-3 h-3" />
                <span>{{ currentLanguage === 'kh' ? 'រង់ចាំពិនិត្យ' : 'Pending' }}</span>
              </span>
              <span
                v-else-if="sub.status === 'approved'"
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
              >
                <CheckCircle2 class="w-3 h-3" />
                <span>{{ currentLanguage === 'kh' ? 'បានអនុម័ត' : 'Approved' }}</span>
              </span>
              <span
                v-else
                class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
              >
                <Ban class="w-3 h-3" />
                <span>{{ currentLanguage === 'kh' ? 'បានបដិសេធ' : 'Rejected' }}</span>
              </span>
            </div>

            <div class="flex flex-wrap gap-2 text-xs">
              <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px]">
                📍 {{ sub.location }}
              </span>
              <span class="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-mono">
                🆔 {{ sub.licenseNumber }}
              </span>
              <span v-if="sub.category" class="px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-[11px] font-bold">
                {{ sub.category }}
              </span>
            </div>

            <p v-if="sub.rejectReason" class="text-[11px] text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-2 rounded-lg">
              <span class="font-bold">មូលហេតុ៖</span> {{ sub.rejectReason }}
            </p>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
            <span class="text-[11px] text-slate-400 font-mono">{{ sub.submittedAt }}</span>
            <div class="flex items-center gap-2">
              <router-link
                v-if="sub.status === 'approved'"
                :to="getLiveLink(sub)"
                target="_blank"
                class="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold flex items-center gap-1"
              >
                <ExternalLink class="w-3 h-3" />
                <span>Live</span>
              </router-link>
              <button
                @click="openSubmissionDetail(sub)"
                class="px-3 py-1.5 rounded-lg bg-[#0D47A1] text-white text-[11px] font-bold shadow-xs hover:bg-[#1565C0] flex items-center gap-1 cursor-pointer"
              >
                <Eye class="w-3 h-3" />
                <span>{{ currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Detail' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

    <!-- PROFILE SUBMISSION DETAIL MODAL -->
    <div v-if="isSubmissionDetailOpen && selectedSubmissionDetail" class="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div class="bg-white dark:bg-[#131F37] w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden" @click.stop>
        <div class="p-5 bg-gradient-to-r from-[#0A2540] to-[#0D47A1] text-white flex items-center justify-between">
          <div>
            <h4 class="text-base font-black truncate max-w-md">{{ selectedSubmissionDetail.nameKh }}</h4>
            <p class="text-xs text-blue-200 font-mono">{{ selectedSubmissionDetail.nameEn }}</p>
          </div>
          <button @click="closeSubmissionDetail" class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer">
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="p-5 space-y-3.5 max-h-[70vh] overflow-y-auto text-xs">
          <!-- Status Banner -->
          <div :class="['p-3 rounded-2xl border flex items-center justify-between', selectedSubmissionDetail.status === 'approved' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : selectedSubmissionDetail.status === 'rejected' ? 'bg-rose-50 text-rose-800 border-rose-200' : 'bg-amber-50 text-amber-800 border-amber-200']">
            <div>
              <span class="font-bold flex items-center gap-1.5">
                <Clock class="w-4 h-4" />
                <span>ស្ថានភាព៖ {{ selectedSubmissionDetail.status === 'approved' ? 'បានអនុម័តជាផ្លូវការ (Approved)' : selectedSubmissionDetail.status === 'rejected' ? 'បានបដិសេធ (Rejected)' : 'រង់ចាំពិនិត្យ (Pending)' }}</span>
              </span>
              <p class="text-[10px] text-slate-500 mt-0.5 font-mono">លេខកូដសំណើ៖ #{{ selectedSubmissionDetail.id }}</p>
            </div>
            <div class="text-right text-[11px] font-mono shrink-0">
              <p>{{ selectedSubmissionDetail.submittedAt }}</p>
              <p v-if="selectedSubmissionDetail.reviewedAt" class="text-emerald-700 font-bold">អនុម័ត៖ {{ selectedSubmissionDetail.reviewedAt }}</p>
            </div>
          </div>

          <div v-if="selectedSubmissionDetail.rejectReason" class="p-3 bg-rose-50 text-rose-700 rounded-xl border border-rose-200">
            <span class="font-bold">មូលហេតុបដិសេធ៖</span> {{ selectedSubmissionDetail.rejectReason }}
          </div>

          <!-- Tags -->
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-[#0D47A1] dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800 text-[11px]">
              {{ selectedSubmissionDetail.facilityType.toUpperCase() }}
            </span>
            <span v-if="selectedSubmissionDetail.category" class="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px]">
              🏷️ {{ selectedSubmissionDetail.category }}
            </span>
            <span v-if="selectedSubmissionDetail.acceptsNssf" class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800 text-[11px] flex items-center gap-1">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
              <span>ទទួលប័ណ្ណ ប.ស.ស (NSSF)</span>
            </span>
          </div>

          <!-- Metadata -->
          <div class="grid grid-cols-2 gap-2.5">
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">លេខអាជ្ញាបណ្ណ</span>
              <span class="font-bold font-mono text-slate-800 dark:text-white">{{ selectedSubmissionDetail.licenseNumber }}</span>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">រាជធានី / ខេត្ត</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ selectedSubmissionDetail.location }}</span>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">ទូរស័ព្ទ</span>
              <span class="font-bold font-mono text-slate-800 dark:text-white">{{ selectedSubmissionDetail.phone }}</span>
            </div>
            <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">ម៉ោងបំពេញការងារ</span>
              <span class="font-bold font-mono text-slate-800 dark:text-white">{{ selectedSubmissionDetail.openingHours }}</span>
            </div>
            <div v-if="selectedSubmissionDetail.industrySector" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">វិស័យឧស្សាហកម្ម</span>
              <span class="font-bold text-indigo-600 dark:text-indigo-400">{{ selectedSubmissionDetail.industrySector }}</span>
            </div>
            <div v-if="selectedSubmissionDetail.fleetSize" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">ទំហំកងរថយន្ត</span>
              <span class="font-bold text-emerald-600 dark:text-emerald-400">{{ selectedSubmissionDetail.fleetSize }}</span>
            </div>
            <div v-if="selectedSubmissionDetail.website" class="col-span-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-400 block mb-0.5">គេហទំព័រ</span>
              <a :href="selectedSubmissionDetail.website" target="_blank" class="font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-mono">
                <Globe class="w-3.5 h-3.5" />
                <span>{{ selectedSubmissionDetail.website }}</span>
              </a>
            </div>
          </div>

          <!-- Descriptions -->
          <div class="space-y-2">
            <div v-if="selectedSubmissionDetail.descriptionKh" class="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl">
              <span class="text-blue-600 dark:text-blue-400 font-bold block mb-1">ការពិពណ៌នា (ភាសាខ្មែរ)៖</span>
              <p class="text-slate-700 dark:text-slate-300 leading-relaxed">{{ selectedSubmissionDetail.descriptionKh }}</p>
            </div>
            <div v-if="selectedSubmissionDetail.descriptionEn" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <span class="text-slate-500 font-bold block mb-1">Description (English):</span>
              <p class="text-slate-600 dark:text-slate-300 font-mono text-[11px] leading-relaxed">{{ selectedSubmissionDetail.descriptionEn }}</p>
            </div>
          </div>

          <!-- Routes Covered -->
          <div v-if="selectedSubmissionDetail.routes && selectedSubmissionDetail.routes.length > 0" class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span class="text-slate-400 block mb-1.5">ខ្សែរត់ / Routes Covered</span>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="r in selectedSubmissionDetail.routes" :key="r" class="px-2 py-0.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-semibold">
                🚌 {{ r }}
              </span>
            </div>
          </div>

          <!-- Address -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span class="text-slate-400 block mb-0.5">អាសយដ្ឋាន</span>
            <p class="font-semibold text-slate-800 dark:text-white">{{ selectedSubmissionDetail.addressKh }}</p>
            <p v-if="selectedSubmissionDetail.address && selectedSubmissionDetail.address !== selectedSubmissionDetail.addressKh" class="text-slate-400 font-mono text-[11px] mt-0.5">
              {{ selectedSubmissionDetail.address }}
            </p>
          </div>

          <!-- Representative -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span class="text-slate-400 block mb-0.5">អ្នកតំណាង ឬអ្នកដាក់ពាក្យ</span>
            <p class="font-bold text-slate-800 dark:text-white">{{ selectedSubmissionDetail.representativeName }} ({{ selectedSubmissionDetail.representativeRole }})</p>
            <p v-if="selectedSubmissionDetail.email" class="text-slate-500 font-mono text-[11px]">{{ selectedSubmissionDetail.email }}</p>
          </div>

          <!-- Services -->
          <div class="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span class="text-slate-400 block mb-1.5">សេវាកម្មផ្តល់ជូន</span>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="s in selectedSubmissionDetail.services" :key="s" class="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                {{ s }}
              </span>
            </div>
          </div>
        </div>

        <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <button @click="closeSubmissionDetail" class="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-100 cursor-pointer">
            បិទ
          </button>
          <router-link
            v-if="selectedSubmissionDetail.status === 'approved'"
            :to="getLiveLink(selectedSubmissionDetail)"
            target="_blank"
            class="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-sm"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>មើលនៅលើ Live</span>
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>
