<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  X,
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

const router = useRouter()
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

  const rawInput = loginForm.emailOrPhone.trim()
  if (!rawInput) {
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
    const inputLower = rawInput.toLowerCase()

    // 1. ADMIN AUTHENTICATION (admin@gmail.com / admin2026)
    const isAdminIdentifier = inputLower === 'admin@gmail.com' || inputLower === 'admin'
    if (isAdminIdentifier) {
      if (loginForm.password !== 'admin2026') {
        errorMessage.value = currentLanguage.value === 'kh'
          ? 'ពាក្យសម្ងាត់ Admin មិនត្រឹមត្រូវទេ! (សូមប្រើ admin2026)'
          : 'Invalid Admin password! (Please use admin2026)'
        return
      }

      const adminUser = {
        name: 'Admin Officer',
        email: 'admin@gmail.com',
        phone: '023 888 999',
        role: 'Administrator',
        province: 'រាជធានីភ្នំពេញ',
        nationalId: '010000001',
        occupation: 'មន្ត្រីរាជការសាធារណៈ',
        gender: 'ប្រុស'
      }

      login(adminUser)
      successMessage.value = currentLanguage.value === 'kh'
        ? 'ចូលគណនី Administrator ជោគជ័យ! កំពុងបើក Admin Dashboard...'
        : 'Signed in as Administrator! Loading dashboard...'

      setTimeout(() => {
        successMessage.value = ''
        router.push('/admin')
      }, 400)
      return
    }

    // 2. REGISTERED USER AUTHENTICATION
    try {
      const rawAccounts = localStorage.getItem('camlife_accounts')
      if (rawAccounts) {
        const accounts = JSON.parse(rawAccounts)
        if (Array.isArray(accounts)) {
          const matched = accounts.find((a: any) =>
            a.email.toLowerCase() === inputLower || (a.phone && a.phone.trim() === rawInput)
          )
          if (matched) {
            if (matched.password !== loginForm.password) {
              errorMessage.value = currentLanguage.value === 'kh'
                ? 'ពាក្យសម្ងាត់មិនត្រឹមត្រូវទេ!'
                : 'Incorrect password.'
              return
            }

            const citizenUser = {
              ...matched.user,
              role: 'Citizen Member' // STRICT USER ROLE
            }
            login(citizenUser)
            successMessage.value = currentLanguage.value === 'kh'
              ? `សូមស្វាគមន៍, ${citizenUser.name}! ចូលគណនីជោគជ័យ...`
              : `Welcome back, ${citizenUser.name}! Signed in successfully...`

            setTimeout(() => {
              successMessage.value = ''
              router.push('/')
            }, 400)
            return
          }
        }
      }
    } catch {}

    // 3. CITIZEN DEMO / GENERAL USER LOGIN (NEVER ADMIN)
    let displayName = 'Sok Vuthy'
    if (rawInput.includes('@')) {
      displayName = rawInput.split('@')[0]
    } else {
      displayName = rawInput
    }
    const formattedName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

    const citizenUser = {
      name: formattedName,
      email: rawInput.includes('@') ? rawInput : 'citizen@camlife.kh',
      phone: !rawInput.includes('@') ? rawInput : '012 345 678',
      role: 'Citizen Member', // STRICT USER ROLE: NO ACCESS TO ADMIN
      province: 'រាជធានីភ្នំពេញ',
      nationalId: '010198765',
      occupation: 'ប្រជាពលរដ្ឋទូទៅ',
      gender: 'ប្រុស'
    }

    login(citizenUser)

    successMessage.value = currentLanguage.value === 'kh'
      ? `សូមស្វាគមន៍, ${formattedName}! ចូលគណនីជោគជ័យ...`
      : `Welcome back, ${formattedName}! Signed in successfully...`

    setTimeout(() => {
      successMessage.value = ''
      router.push('/')
    }, 400)
  }, 250)
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
  const regEmail = registerForm.email.trim().toLowerCase()
  if (regEmail === 'admin@gmail.com') {
    errorMessage.value = currentLanguage.value === 'kh'
      ? 'អ៊ីមែលនេះជាគណនី Admin ផ្លូវការ មិនអនុញ្ញាតឱ្យចុះឈ្មោះជា User ធម្មតាទេ!'
      : 'This email is reserved for Admin.'
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

    const newCitizen = {
      name: registerForm.fullName.trim(),
      email: regEmail,
      phone: registerForm.phone.trim() || '012 345 678',
      role: 'Citizen Member', // STRICT USER ROLE: CANNOT ACCESS ADMIN
      province: 'រាជធានីភ្នំពេញ',
      occupation: 'ប្រជាពលរដ្ឋទូទៅ',
      gender: 'ប្រុស'
    }

    // Save registered user account for subsequent logins
    try {
      const rawAccounts = localStorage.getItem('camlife_accounts')
      const accounts = rawAccounts ? JSON.parse(rawAccounts) : []
      accounts.push({
        email: regEmail,
        phone: registerForm.phone.trim(),
        password: registerForm.password,
        user: newCitizen
      })
      localStorage.setItem('camlife_accounts', JSON.stringify(accounts))
    } catch {}

    successMessage.value = currentLanguage.value === 'kh'
      ? `គណនីពលរដ្ឋត្រូវបានបង្កើតជោគជ័យ! សូមស្វាគមន៍មកកាន់ CamLife...`
      : `Account created successfully! Welcome to CamLife...`

    setTimeout(() => {
      login(newCitizen)
      successMessage.value = ''
      router.push('/')
    }, 600)
  }, 400)
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
      class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm overflow-y-auto font-khmer"
      @click.self="closeAuthModal"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200"
      >
        <!-- Top Security Gradient Accent -->
        <div class="h-1.5 w-full bg-gradient-to-r from-[#0D47A1] via-blue-500 to-indigo-600"></div>

        <!-- Modal Brand Header -->
        <div class="p-6 pb-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-slate-800">
          <div class="flex items-center gap-3">
            <div class="w-11 h-11 rounded-2xl bg-white dark:bg-slate-900 p-1 flex items-center justify-center shadow-md shadow-blue-900/10 ring-2 ring-blue-500/20 border border-slate-200/80 dark:border-slate-700/80 flex-shrink-0">
              <img
                src="/logo.png"
                alt="CamLife Logo"
                class="w-full h-full object-contain rounded-xl"
              />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-lg font-black text-[#0A2540] dark:text-white">CamLife</h2>
                <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300 border border-blue-200/60 dark:border-blue-700/40">
                  Citizen Portal
                </span>
              </div>
              <p class="text-[11px] text-slate-400">
                {{ currentLanguage === 'kh' ? 'គណនីសមាជិក និងសេវាសាធារណៈជាតិ' : 'National Citizen & Public Services' }}
              </p>
            </div>
          </div>

          <button
            @click="closeAuthModal"
            class="w-8 h-8 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-transparent hover:border-slate-200 dark:hover:border-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
            type="button"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Tab Switcher (Sign In vs Register) -->
        <div class="px-6 pt-4">
          <div class="flex rounded-2xl bg-slate-100/90 dark:bg-slate-700/60 p-1 border border-slate-200/60 dark:border-slate-700">
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
              <span class="text-[10px] text-slate-400 font-mono">012 345 678 / user@camlife.kh</span>
            </label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="loginForm.emailOrPhone"
                type="text"
                :placeholder="currentLanguage === 'kh' ? 'បញ្ចូលអ៊ីមែល ឬលេខទូរស័ព្ទ...' : 'you@example.com or 012 345 678'"
                class="w-full pl-10 pr-3.5 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0D47A1] focus:bg-white dark:focus:bg-slate-800 transition-all"
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
                class="w-full pl-10 pr-10 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-2xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0D47A1] focus:bg-white dark:focus:bg-slate-800 transition-all font-mono"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
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
                class="w-4 h-4 rounded-md border-slate-300 text-[#0D47A1] focus:ring-blue-500 cursor-pointer"
              />
              <span>{{ currentLanguage === 'kh' ? 'ចងចាំឧបករណ៍នេះ' : 'Remember this device' }}</span>
            </label>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3.5 bg-gradient-to-r from-[#0D47A1] to-[#1565C0] hover:from-[#0A3880] hover:to-[#0D47A1] disabled:opacity-70 text-white text-xs sm:text-sm font-black rounded-2xl shadow-md hover:shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
          >
            <LogIn v-if="!isLoading" class="w-4 h-4" />
            <span v-if="isLoading" class="flex items-center gap-2">
              <span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>{{ currentLanguage === 'kh' ? 'កំពុងដំណើរការ...' : 'Signing In...' }}</span>
            </span>
            <span v-else>{{ currentLanguage === 'kh' ? 'ចូលគណនី CamLife' : 'Sign In to CamLife' }}</span>
          </button>
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

        <!-- Security Trust Footer -->
        <div class="px-6 py-2.5 bg-slate-50/90 dark:bg-slate-800/90 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span>{{ currentLanguage === 'kh' ? 'ប្រព័ន្ធការពារសុវត្ថិភាព 256-bit SSL • ធានាសុវត្ថិភាពទិន្នន័យជាតិ' : 'Protected by 256-bit SSL • Official Civic Data Security' }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>
