<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  X,
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
  ChevronRight
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedServices } from '@/composables/useSavedServices'
import { useSavedJobs } from '@/composables/useSavedJobs'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', msg: string): void
}>()

const router = useRouter()
const { currentUser, updateProfile } = useAuth()
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

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      errorMessage.value = ''
      successMessage.value = ''
      form.name = currentUser.value?.name || 'Citizen User'
      form.email = currentUser.value?.email || 'citizen@camlife.kh'
      form.phone = currentUser.value?.phone || '012 345 678'
      form.nationalId = currentUser.value?.nationalId || '010198765'
      form.province = currentUser.value?.province || 'រាជធានីភ្នំពេញ'
      form.occupation = currentUser.value?.occupation || 'បុគ្គលិកក្រុមហ៊ុនឯកជន'
      form.gender = currentUser.value?.gender || 'ប្រុស'
      form.bio = currentUser.value?.bio || (currentLanguage.value === 'kh' ? 'ប្រជាពលរដ្ឋសកម្មប្រើប្រាស់សេវាឌីជីថលជាតិ CamLife' : 'Active citizen utilizing CamLife civic platform services')
      form.currentPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
      activeTab.value = 'general'
    }
  },
  { immediate: true }
)

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
    const msg = currentLanguage.value === 'kh' ? 'ព័ត៌មានគណនីផ្ទាល់ខ្លួនត្រូវបានកែប្រែជោគជ័យ!' : 'Citizen profile updated successfully!'
    successMessage.value = msg
    emit('saved', msg)

    setTimeout(() => {
      emit('close')
    }, 800)
  }, 400)
}

function goToSaved() {
  emit('close')
  router.push('/saved-services')
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto font-khmer select-none"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        <!-- Modal Top Header Banner -->
        <div class="relative h-28 bg-gradient-to-r from-[#0D47A1] via-[#1565C0] to-[#0D3B66] p-4 flex items-start justify-between text-white shrink-0">
          <div class="flex items-center gap-2.5">
            <div class="p-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <ShieldCheck class="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-black text-white leading-tight">
                  {{ currentLanguage === 'kh' ? 'គណនីប្រជាពលរដ្ឋឌីជីថល' : 'Citizen Digital Profile' }}
                </h3>
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30">
                  <Sparkles class="w-2.5 h-2.5" />
                  <span>{{ currentLanguage === 'kh' ? 'បានផ្ទៀងផ្ទាត់' : 'Verified' }}</span>
                </span>
              </div>
              <p class="text-[10.5px] text-blue-100 mt-0.5">
                {{ currentLanguage === 'kh' ? 'ការគ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងសុវត្ថិភាពសេវា' : 'Personal identity credentials & civic service security' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="emit('close')"
            class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Profile Avatar Overlap Header -->
        <div class="px-5 -mt-10 flex items-end gap-3.5 shrink-0">
          <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#0D47A1] via-blue-500 to-indigo-400 p-0.5 shadow-xl ring-4 ring-white dark:ring-[#1E293B] shrink-0">
            <div class="w-full h-full rounded-2xl bg-[#0A2540] text-blue-200 flex items-center justify-center text-2xl font-black shadow-inner">
              {{ form.name.charAt(0).toUpperCase() }}
            </div>
            <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white dark:ring-[#1E293B]" title="Active"></span>
          </div>

          <div class="pb-1 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h4 class="text-base font-extrabold text-slate-900 dark:text-white truncate">
                {{ form.name }}
              </h4>
              <span class="px-2 py-0.5 rounded-full text-[9.5px] font-black bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shrink-0">
                {{ currentUser?.role || (currentLanguage === 'kh' ? 'សមាជិកពលរដ្ឋ' : 'Citizen Member') }}
              </span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 font-mono truncate">
              {{ form.email }}
            </p>
          </div>
        </div>

        <!-- Tab Switcher Navigation -->
        <div class="px-5 pt-3 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="activeTab = 'general'"
            :class="[
              'px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'general'
                ? 'border-[#0D47A1] text-[#0D47A1] dark:border-blue-400 dark:text-blue-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            ]"
          >
            <UserIcon class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានទូទៅ' : 'General Info' }}</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'security'"
            :class="[
              'px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'security'
                ? 'border-[#0D47A1] text-[#0D47A1] dark:border-blue-400 dark:text-blue-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            ]"
          >
            <Lock class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'សុវត្ថិភាព & ពាក្យសម្ងាត់' : 'Security' }}</span>
          </button>

          <button
            type="button"
            @click="activeTab = 'activity'"
            :class="[
              'px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'activity'
                ? 'border-[#0D47A1] text-[#0D47A1] dark:border-blue-400 dark:text-blue-400 font-black'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
            ]"
          >
            <Bookmark class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'សកម្មភាពរបស់ខ្ញុំ' : 'My Activity' }}</span>
            <span
              v-if="totalSavedCount > 0"
              class="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300 font-mono"
            >
              {{ totalSavedCount }}
            </span>
          </button>
        </div>

        <!-- Modal Body Content -->
        <div class="p-5 overflow-y-auto space-y-4 flex-1">
          <!-- Alert Feedback Messages -->
          <div
            v-if="errorMessage"
            class="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in"
          >
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <div
            v-if="successMessage"
            class="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs rounded-xl flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>{{ successMessage }}</span>
          </div>

          <!-- TAB 1: GENERAL INFO -->
          <div v-if="activeTab === 'general'" class="space-y-3.5">
            <!-- Full Name -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {{ currentLanguage === 'kh' ? 'ឈ្មោះពេញ (Full Name) *' : 'Full Name *' }}
              </label>
              <div class="relative">
                <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                  :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលឈ្មោះរបស់អ្នក...' : 'Enter full name...'"
                />
              </div>
            </div>

            <!-- Email & Phone Dual Column -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {{ currentLanguage === 'kh' ? 'អ៊ីមែល (Email) *' : 'Email *' }}
                </label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ (Phone)' : 'Phone Number' }}
                </label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.phone"
                    type="tel"
                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                    placeholder="012 345 678"
                  />
                </div>
              </div>
            </div>

            <!-- National ID & Gender Dual Column -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ (National ID)' : 'Khmer National ID' }}
                </label>
                <div class="relative">
                  <CreditCard class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.nationalId"
                    type="text"
                    maxlength="9"
                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                    placeholder="010198765"
                  />
                </div>
                <span class="text-[10px] text-slate-400 mt-0.5 block">
                  {{ currentLanguage === 'kh' ? 'លេខកូដសម្គាល់ពលរដ្ឋ ៩ ខ្ទង់' : 'Official 9-digit Khmer ID number' }}
                </span>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {{ currentLanguage === 'kh' ? 'ភេទ (Gender)' : 'Gender' }}
                </label>
                <div class="flex items-center gap-4 pt-2">
                  <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      v-model="form.gender"
                      value="ប្រុស"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{{ currentLanguage === 'kh' ? 'ប្រុស' : 'Male' }}</span>
                  </label>
                  <label class="flex items-center gap-1.5 text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="radio"
                      v-model="form.gender"
                      value="ស្រី"
                      class="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{{ currentLanguage === 'kh' ? 'ស្រី' : 'Female' }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Province & Occupation Dual Column -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {{ currentLanguage === 'kh' ? 'រាជធានី / ខេត្ត (Province)' : 'Province / City' }}
                </label>
                <div class="relative">
                  <MapPin class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    v-model="form.province"
                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                  >
                    <option v-for="prov in provinces" :key="prov.en" :value="prov.km">
                      {{ currentLanguage === 'kh' ? prov.km : prov.en }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {{ currentLanguage === 'kh' ? 'មុខរបរ / វិជ្ជាជីវៈ (Occupation)' : 'Occupation' }}
                </label>
                <div class="relative">
                  <Briefcase class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                  <select
                    v-model="form.occupation"
                    class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all appearance-none cursor-pointer"
                  >
                    <option v-for="occ in occupations" :key="occ.en" :value="occ.km">
                      {{ currentLanguage === 'kh' ? occ.km : occ.en }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Bio / Notes -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {{ currentLanguage === 'kh' ? 'កំណត់សម្គាល់ផ្ទាល់ខ្លួន (Bio / Note)' : 'Personal Bio / Note' }}
              </label>
              <textarea
                v-model="form.bio"
                rows="2"
                class="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all resize-none"
                :placeholder="currentLanguage === 'kh' ? 'សរសេរព័ត៌មានសង្ខេបអំពីអ្នក...' : 'Brief note about yourself...'"
              ></textarea>
            </div>
          </div>

          <!-- TAB 2: SECURITY & PASSWORD -->
          <div v-if="activeTab === 'security'" class="space-y-4">
            <div class="p-3.5 bg-blue-50/80 dark:bg-blue-950/40 rounded-2xl border border-blue-100 dark:border-blue-900/60 flex items-start gap-3">
              <ShieldCheck class="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h5 class="text-xs font-extrabold text-blue-900 dark:text-blue-200">
                  {{ currentLanguage === 'kh' ? 'កម្រិតសុវត្ថិភាពគណនីខ្ពស់ (Citizen Security)' : 'High Security Protection' }}
                </h5>
                <p class="text-[11px] text-blue-700 dark:text-blue-300 mt-0.5 leading-relaxed">
                  {{ currentLanguage === 'kh'
                    ? 'គណនីរបស់អ្នកត្រូវបានការពារដោយប្រព័ន្ធសុវត្ថិភាពឌីជីថលជាតិ។ អ្នកអាចផ្លាស់ប្តូរលេខសម្ងាត់ដើម្បីសុវត្ថិភាពបន្ថែម។'
                    : 'Your citizen credentials are encrypted. You can update your password below at any time.'
                  }}
                </p>
              </div>
            </div>

            <!-- Current Password -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន (Current Password)' : 'Current Password' }}
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.currentPassword"
                  :type="showPassword ? 'text' : 'password'"
                  class="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- New Password -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់ថ្មី (New Password)' : 'New Password' }}
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                  :placeholder="currentLanguage === 'kh' ? 'យ៉ាងតិច ៦ តួអក្សរ' : 'Min 6 characters'"
                />
                <button
                  type="button"
                  @click="showNewPassword = !showNewPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <Eye v-if="!showNewPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <!-- Confirm Password -->
            <div>
              <label class="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {{ currentLanguage === 'kh' ? 'បញ្ជាក់ពាក្យសម្ងាត់ថ្មី (Confirm Password)' : 'Confirm Password' }}
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.confirmPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-white text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all font-mono"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <!-- TAB 3: ACTIVITY & SAVED STATS -->
          <div v-if="activeTab === 'activity'" class="space-y-4">
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-center">
                <div class="w-8 h-8 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center mx-auto mb-1.5">
                  <Bookmark class="w-4 h-4" />
                </div>
                <p class="text-xl font-black text-[#0D47A1] dark:text-blue-300 font-mono">{{ savedServicesCount }}</p>
                <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                  {{ currentLanguage === 'kh' ? 'សេវាសាធារណៈបាន Save' : 'Saved Services' }}
                </p>
              </div>

              <div class="p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-center">
                <div class="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mx-auto mb-1.5">
                  <Briefcase class="w-4 h-4" />
                </div>
                <p class="text-xl font-black text-indigo-600 dark:text-indigo-300 font-mono">{{ savedJobIds.length }}</p>
                <p class="text-[11px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">
                  {{ currentLanguage === 'kh' ? 'ឱកាសការងារបាន Save' : 'Saved Jobs' }}
                </p>
              </div>
            </div>

            <!-- Quick Action Card to Saved Items -->
            <button
              type="button"
              @click="goToSaved"
              class="w-full p-3.5 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-blue-500/10 hover:from-blue-500/20 hover:via-indigo-500/20 hover:to-blue-500/20 border border-blue-200/80 dark:border-blue-800 flex items-center justify-between text-left transition-all cursor-pointer group"
            >
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Bookmark class="w-4.5 h-4.5" />
                </div>
                <div>
                  <h6 class="text-xs font-black text-slate-900 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-300 transition-colors">
                    {{ currentLanguage === 'kh' ? 'ចូលទៅកាន់ទំព័រទិន្នន័យដែលបានរក្សាទុក' : 'Go to Saved Items Page' }}
                  </h6>
                  <p class="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                    {{ currentLanguage === 'kh' ? 'មើល និងគ្រប់គ្រងសេវា និងមុខតំណែងការងារដែលអ្នកបានកត់ចំណាំ' : 'Review and manage your bookmarked items' }}
                  </p>
                </div>
              </div>
              <ChevronRight class="w-4 h-4 text-slate-400 group-hover:text-[#0D47A1] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            <!-- Verification & Member Information -->
            <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ស្ថានភាពគណនី' : 'Account Status' }}</span>
                <span class="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 class="w-3.5 h-3.5" />
                  <span>{{ currentLanguage === 'kh' ? 'សកម្ម / ផ្ទៀងផ្ទាត់រួច' : 'Active & Verified' }}</span>
                </span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-slate-500 dark:text-slate-400">{{ currentLanguage === 'kh' ? 'ចូលប្រើចុងក្រោយ' : 'Last Session' }}</span>
                <span class="font-mono text-slate-700 dark:text-slate-300 flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  <span>{{ currentUser?.lastLogin || 'Today' }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-700/80 bg-slate-50/70 dark:bg-slate-900/50 flex items-center justify-between shrink-0">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>

          <button
            type="button"
            @click="handleSave"
            :disabled="isSaving"
            class="px-5 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-extrabold shadow-sm transition-all duration-150 active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
          >
            <span v-if="isSaving" class="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុកព័ត៌មាន' : 'Save Changes') }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
