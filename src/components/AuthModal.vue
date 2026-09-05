<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  LogIn,
  UserPlus,
  Phone
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'

const { isAuthModalOpen, authModalTab, closeAuthModal, login } = useAuth()
const { currentLanguage } = useLanguage()

const showPassword = ref(false)
const showConfirmPassword = ref(false)
const rememberMe = ref(true)
const agreeTerms = ref(true)
const errorMessage = ref('')
const successMessage = ref('')
const isLoading = ref(false)

const loginForm = reactive({
  emailOrPhone: '',
  password: ''
})

const registerForm = reactive({
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: ''
})

// Password Strength Meter for Register Form
const passwordStrength = computed(() => {
  const p = registerForm.password
  if (!p) return { score: 0, textKh: '', textEn: '', color: 'bg-slate-200 dark:bg-slate-700' }
  if (p.length < 6) return { score: 1, textKh: 'ខ្សោយពេក', textEn: 'Too weak', color: 'bg-rose-500' }
  if (p.length >= 8 && /[0-9]/.test(p) && /[a-zA-Z]/.test(p)) {
    return { score: 3, textKh: 'រឹងមាំខ្លាំង', textEn: 'Strong', color: 'bg-emerald-500' }
  }
  return { score: 2, textKh: 'កម្រិតមធ្យម', textEn: 'Medium', color: 'bg-amber-500' }
})

function switchTab(tab: 'login' | 'register') {
  authModalTab.value = tab
  errorMessage.value = ''
  successMessage.value = ''
}

function handleForgotPassword() {
  errorMessage.value = ''
  alert(
    currentLanguage.value === 'kh'
      ? 'ព័ត៌មានណែនាំសម្រាប់កំណត់ពាក្យសម្ងាត់ឡើងវិញត្រូវបានផ្ញើទៅកាន់អ៊ីមែលរបស់អ្នក (Demo Simulation)'
      : 'Password reset instructions have been simulated for demo purposes.'
  )
}

function handleLogin() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!loginForm.emailOrPhone.trim()) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'សូមបញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទរបស់អ្នក'
      : 'Please enter your email or phone number.'
    return
  }
  if (!loginForm.password) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'សូមបញ្ចូលពាក្យសម្ងាត់របស់អ្នក'
      : 'Please enter your password.'
    return
  }

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    const input = loginForm.emailOrPhone.trim().toLowerCase()
    const isAdmin = input.includes('admin') || loginForm.password === 'admin2026'

    const displayName = input.includes('admin')
      ? 'Admin Officer'
      : (input.includes('@') ? input.split('@')[0] : 'Sok Vuthy')

    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

    successMessage.value = currentLanguage.value === 'kh'
      ? `សូមស្វាគមន៍, ${formattedName}! ចូលគណនីជោគជ័យ...`
      : `Welcome back, ${formattedName}! Signed in successfully...`

    setTimeout(() => {
      login({
        name: formattedName,
        email: input.includes('@') ? input : (isAdmin ? 'admin@camlife.gov.kh' : 'citizen@camlife.kh'),
        phone: !input.includes('@') ? input : '012 345 678',
        role: isAdmin ? 'Administrator' : 'Citizen Member'
      })
      successMessage.value = ''
    }, 600)
  }, 400)
}

function handleRegister() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!registerForm.fullName.trim()) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'សូមបញ្ចូលឈ្មោះពេញរបស់អ្នក'
      : 'Please enter your full name.'
    return
  }
  if (!registerForm.email.trim()) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែល'
      : 'Please enter your email address.'
    return
  }
  if (registerForm.password.length < 6) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'ពាក្យសម្ងាត់ត្រូវមានយ៉ាងតិច ៦ តួអក្សរ'
      : 'Password must be at least 6 characters long.'
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ'
      : 'Passwords do not match.'
    return
  }
  if (!agreeTerms.value) {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'សូមយល់ព្រមតាមលក្ខខណ្ឌប្រើប្រាស់'
      : 'Please agree to the Terms of Service & Privacy Policy.'
    return
  }

  isLoading.value = true

  setTimeout(() => {
    isLoading.value = false
    successMessage.value = currentLanguage.value === 'kh'
      ? `គណនីត្រូវបានបង្កើតជោគជ័យ! សូមស្វាគមន៍មកកាន់ CamLife...`
      : `Account created successfully! Welcome to CamLife...`

    setTimeout(() => {
      login({
        name: registerForm.fullName.trim(),
        email: registerForm.email.trim(),
        phone: registerForm.phone.trim() || '012 345 678',
        role: 'Citizen Member'
      })
      successMessage.value = ''
    }, 600)
  }, 400)
}

// Quick Demo Login as Citizen
function loginDemoCitizen() {
  loginForm.emailOrPhone = 'demo.citizen@camlife.kh'
  loginForm.password = 'camlife2026'
  errorMessage.value = ''
  successMessage.value = currentLanguage.value === 'kh'
    ? 'ចូលជាពលរដ្ឋទូទៅ (Citizen Demo) ជោគជ័យ!'
    : 'Signed in as Citizen Demo User!'

  setTimeout(() => {
    login({
      name: 'Sok Vuthy',
      email: 'demo.citizen@camlife.kh',
      phone: '012 345 678',
      role: 'Citizen Member'
    })
    successMessage.value = ''
  }, 500)
}

// Quick Demo Login as Admin
function loginDemoAdmin() {
  loginForm.emailOrPhone = 'admin@camlife.gov.kh'
  loginForm.password = 'admin2026'
  errorMessage.value = ''
  successMessage.value = currentLanguage.value === 'kh'
    ? 'ចូលជាអ្នកគ្រប់គ្រង (Admin Officer) ជោគជ័យ! សិទ្ធិ Admin បើកដំណើរការ។'
    : 'Signed in as Admin Officer! Administrator privileges unlocked.'

  setTimeout(() => {
    login({
      name: 'Admin Officer',
      email: 'admin@camlife.gov.kh',
      phone: '023 888 999',
      role: 'Administrator'
    })
    successMessage.value = ''
  }, 500)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0 scale-95"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-95"
  >
    <div
      v-if="isAuthModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-khmer"
      @click.self="closeAuthModal"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Modal Brand Header -->
        <div class="p-6 pb-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-[#0D47A1] text-white flex items-center justify-center shadow-md shadow-blue-900/20 ring-2 ring-blue-500/20">
              <svg viewBox="0 0 100 70" fill="currentColor" class="w-6 h-6">
                <path d="M50 4 L53 14 L57 14 L55 20 L60 20 L62 14 L66 14 L66 22 L70 22 L73 17 L76 17 L76 25 L81 26 L81 60 L19 60 L19 26 L24 25 L24 17 L27 17 L30 22 L34 22 L34 14 L38 14 L40 20 L45 20 L43 14 L47 14 Z M50 10 L48 16 L44 16 L46 22 L41 22 L39 16 L36 16 L36 24 L32 24 L30 19 L28 19 L28 27 L22 28 L22 56 L78 56 L78 28 L72 27 L72 19 L70 19 L68 24 L64 24 L64 16 L61 16 L59 22 L54 22 L56 16 L52 16 Z M26 48 H32 V52 H26 Z M36 48 H42 V52 H36 Z M47 48 H53 V52 H47 Z M58 48 H64 V52 H58 Z M68 48 H74 V52 H68 Z" />
              </svg>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-black text-[#0A2540] dark:text-white">CamLife</h2>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300">
                  Citizen Portal
                </span>
              </div>
              <p class="text-[11px] text-slate-400">
                {{ currentLanguage === 'kh' ? 'គណនីសមាជិក និងសេវាសាធារណៈ' : 'Citizen Account & Public Services' }}
              </p>
            </div>
          </div>

          <button
            @click="closeAuthModal"
            class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
            type="button"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Tab Switcher (Sign In vs Register) -->
        <div class="px-6 pt-4">
          <div class="flex rounded-2xl bg-slate-100 dark:bg-slate-700/60 p-1 border border-slate-200/60 dark:border-slate-700">
            <button
              @click="switchTab('login')"
              :class="[
                'flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                authModalTab === 'login'
                  ? 'bg-white dark:bg-slate-800 text-[#0D47A1] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
              type="button"
            >
              <LogIn class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ចូលគណនី' : 'Sign In' }}</span>
            </button>
            <button
              @click="switchTab('register')"
              :class="[
                'flex-1 py-2 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer',
                authModalTab === 'register'
                  ? 'bg-white dark:bg-slate-800 text-[#0D47A1] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              ]"
              type="button"
            >
              <UserPlus class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ចុះឈ្មោះថ្មី' : 'Register' }}</span>
            </button>
          </div>
        </div>

        <!-- Success Message Alert -->
        <div
          v-if="successMessage"
          class="mx-6 mt-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-in fade-in"
        >
          <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{{ successMessage }}</span>
        </div>

        <!-- Error Message Alert -->
        <div
          v-if="errorMessage"
          class="mx-6 mt-4 p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center gap-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-in fade-in"
        >
          <AlertCircle class="w-4 h-4 text-rose-500 shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- ======================= LOGIN FORM ======================= -->
        <form v-if="authModalTab === 'login'" @submit.prevent="handleLogin" class="p-6 space-y-4">
          <!-- Email / Phone Field -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{{ currentLanguage === 'kh' ? 'អ៊ីមែល ឬលេខទូរស័ព្ទ' : 'Email or Phone' }}</span>
              <span class="text-[10px] text-slate-400 font-normal">012 345 678 / user@camlife.kh</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="loginForm.emailOrPhone"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទ...' : 'you@example.com or 012 345 678'"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់' : 'Password' }}
              </label>
              <button
                type="button"
                @click="handleForgotPassword"
                class="text-[11px] font-bold text-[#0D47A1] dark:text-blue-400 hover:underline cursor-pointer"
              >
                {{ currentLanguage === 'kh' ? 'ភ្លេចពាក្យសម្ងាត់?' : 'Forgot password?' }}
              </button>
            </div>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលពាក្យសម្ងាត់...' : 'Enter your password'"
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Remember Me Checkbox -->
          <div class="flex items-center justify-between pt-0.5">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400 select-none">
              <input
                v-model="rememberMe"
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-blue-500 cursor-pointer"
              />
              <span>{{ currentLanguage === 'kh' ? 'ចងចាំឧបករណ៍នេះ' : 'Remember this device' }}</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#0D47A1] hover:bg-blue-700 disabled:opacity-70 text-white text-xs font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <LogIn v-if="!isLoading" class="w-4 h-4" />
            <span v-if="isLoading">{{ currentLanguage === 'kh' ? 'កំពុងដំណើរការ...' : 'Signing In...' }}</span>
            <span v-else>{{ currentLanguage === 'kh' ? 'ចូលគណនី CamLife' : 'Sign In to CamLife' }}</span>
          </button>

          <!-- Fast Demo Presentation Logins -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-400 text-center">
              {{ currentLanguage === 'kh' ? '— ឬចូលសាកល្បងភ្លាមៗ (Quick Demo) —' : '— Or One-Click Demo Presentation —' }}
            </p>

            <div class="grid grid-cols-2 gap-2">
              <!-- Demo Citizen Button -->
              <button
                @click="loginDemoCitizen"
                type="button"
                class="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/40 text-left transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300 font-black text-xs">
                  <Sparkles class="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{{ currentLanguage === 'kh' ? 'ពលរដ្ឋទូទៅ' : 'Citizen' }}</span>
                </div>
                <p class="text-[10px] text-emerald-600/80 dark:text-emerald-400/70 mt-0.5 truncate">
                  Sok Vuthy
                </p>
              </button>

              <!-- Demo Admin Button -->
              <button
                @click="loginDemoAdmin"
                type="button"
                class="p-2.5 rounded-2xl bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 border border-purple-200/80 dark:border-purple-800/40 text-left transition-all cursor-pointer group"
              >
                <div class="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-black text-xs">
                  <ShieldCheck class="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  <span>{{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Admin' }}</span>
                </div>
                <p class="text-[10px] text-purple-600/80 dark:text-purple-400/70 mt-0.5 truncate">
                  Admin Officer
                </p>
              </button>
            </div>
          </div>
        </form>

        <!-- ======================= REGISTER FORM ======================= -->
        <form v-else @submit.prevent="handleRegister" class="p-6 space-y-3.5">
          <!-- Full Name -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
              {{ currentLanguage === 'kh' ? 'ឈ្មោះពេញ' : 'Full Name' }}
            </label>
            <div class="relative">
              <UserIcon class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.fullName"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'ឧ. សុខ វុទ្ធី ឬ Sok Vuthy' : 'e.g. Sok Vuthy'"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
            </div>
          </div>

          <!-- Email Address -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
              {{ currentLanguage === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address' }}
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.email"
                type="email"
                placeholder="you@example.com"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
            </div>
          </div>

          <!-- Phone Number (Optional) -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
              <span>{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ' : 'Phone Number' }}</span>
              <span class="text-[10px] text-slate-400 font-normal">{{ currentLanguage === 'kh' ? 'ជាជម្រើស' : 'Optional' }}</span>
            </label>
            <div class="relative">
              <Phone class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.phone"
                type="tel"
                placeholder="012 345 678"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
            </div>
          </div>

          <!-- Password & Strength Meter -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
                {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់' : 'Password' }}
              </label>
              <span v-if="registerForm.password" :class="['text-[10px] font-extrabold', passwordStrength.score === 3 ? 'text-emerald-600' : (passwordStrength.score === 2 ? 'text-amber-600' : 'text-rose-500')]">
                {{ currentLanguage === 'kh' ? passwordStrength.textKh : passwordStrength.textEn }}
              </span>
            </div>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                :placeholder="currentLanguage === 'kh' ? 'យ៉ាងតិច ៦ តួអក្សរ...' : 'At least 6 characters'"
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
            <!-- Strength Bar -->
            <div class="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex gap-1 mt-1">
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="[passwordStrength.color, passwordStrength.score >= 1 ? 'w-1/3' : 'w-0']"
              />
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="[passwordStrength.color, passwordStrength.score >= 2 ? 'w-1/3' : 'w-0']"
              />
              <div
                class="h-full rounded-full transition-all duration-300"
                :class="[passwordStrength.color, passwordStrength.score >= 3 ? 'w-1/3' : 'w-0']"
              />
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">
              {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់' : 'Confirm Password' }}
            </label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                :placeholder="currentLanguage === 'kh' ? 'វាយពាក្យសម្ងាត់ម្តងទៀត...' : 'Re-enter your password'"
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
              />
              <button
                type="button"
                @click="showConfirmPassword = !showConfirmPassword"
                class="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <EyeOff v-if="showConfirmPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Terms Agreement -->
          <div class="pt-1">
            <label class="flex items-start gap-2 cursor-pointer text-xs font-medium text-slate-600 dark:text-slate-400 select-none leading-relaxed">
              <input
                v-model="agreeTerms"
                type="checkbox"
                class="w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-blue-500 mt-0.5 cursor-pointer shrink-0"
              />
              <span>
                {{ currentLanguage === 'kh' ? 'ខ្ញុំយល់ព្រមតាម' : 'I agree to the' }}
                <span class="text-[#0D47A1] dark:text-blue-400 font-bold underline">{{ currentLanguage === 'kh' ? 'លក្ខខណ្ឌប្រើប្រាស់' : 'Terms of Service' }}</span>
                {{ currentLanguage === 'kh' ? 'និងគោលការណ៍ឯកជនភាព' : 'and Privacy Policy' }}
              </span>
            </label>
          </div>

          <!-- Register Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-[#0D47A1] hover:bg-blue-700 disabled:opacity-70 text-white text-xs font-black rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] mt-2"
          >
            <UserPlus v-if="!isLoading" class="w-4 h-4" />
            <span v-if="isLoading">{{ currentLanguage === 'kh' ? 'កំពុងបង្កើតគណនី...' : 'Creating Account...' }}</span>
            <span v-else>{{ currentLanguage === 'kh' ? 'បង្កើតគណនីឥតគិតថ្លៃ' : 'Create Free Account' }}</span>
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>
