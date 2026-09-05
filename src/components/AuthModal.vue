<script setup lang="ts">
import { ref, reactive } from 'vue'
import {
  X,
  Sparkles,
  Mail,
  Lock,
  User as UserIcon,
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'

const { isAuthModalOpen, authModalTab, closeAuthModal, login } = useAuth()

function handleForgotPassword() {
  alert('Password reset instructions simulated for demo.')
}

const showPassword = ref(false)
const rememberMe = ref(true)
const errorMessage = ref('')

const loginForm = reactive({
  emailOrPhone: '',
  password: ''
})

const registerForm = reactive({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: ''
})

function switchTab(tab: 'login' | 'register') {
  authModalTab.value = tab
  errorMessage.value = ''
}

function handleLogin() {
  errorMessage.value = ''
  if (!loginForm.emailOrPhone.trim()) {
    errorMessage.value = 'Please enter your email address or phone number.'
    return
  }
  if (!loginForm.password) {
    errorMessage.value = 'Please enter your password.'
    return
  }

  const displayName = loginForm.emailOrPhone.includes('@')
    ? loginForm.emailOrPhone.split('@')[0]
    : 'Sok Vuthy'

  login({
    name: displayName.charAt(0).toUpperCase() + displayName.slice(1),
    email: loginForm.emailOrPhone.includes('@') ? loginForm.emailOrPhone : 'user@camlife.kh',
    role: 'Member'
  })
}

function handleRegister() {
  errorMessage.value = ''
  if (!registerForm.fullName.trim()) {
    errorMessage.value = 'Please enter your full name.'
    return
  }
  if (!registerForm.email.trim()) {
    errorMessage.value = 'Please enter your email address.'
    return
  }
  if (registerForm.password.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters long.'
    return
  }
  if (registerForm.password !== registerForm.confirmPassword) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  login({
    name: registerForm.fullName,
    email: registerForm.email,
    role: 'Member'
  })
}

function fillDemoUser() {
  loginForm.emailOrPhone = 'demo.citizen@camlife.kh'
  loginForm.password = 'camlife2026'
  handleLogin()
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
      v-if="isAuthModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      @click.self="closeAuthModal"
    >
      <div
        class="w-full max-w-md bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden animate-fadeIn"
      >
        <!-- Modal Top Brand Header -->
        <div class="p-6 pb-4 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center">
              <svg viewBox="0 0 100 70" fill="currentColor" class="w-5 h-5">
                <path d="M50 4 L53 14 L57 14 L55 20 L60 20 L62 14 L66 14 L66 22 L70 22 L73 17 L76 17 L76 25 L81 26 L81 60 L19 60 L19 26 L24 25 L24 17 L27 17 L30 22 L34 22 L34 14 L38 14 L40 20 L45 20 L43 14 L47 14 Z M50 10 L48 16 L44 16 L46 22 L41 22 L39 16 L36 16 L36 24 L32 24 L30 19 L28 19 L28 27 L22 28 L22 56 L78 56 L78 28 L72 27 L72 19 L70 19 L68 24 L64 24 L64 16 L61 16 L59 22 L54 22 L56 16 L52 16 Z M26 48 H32 V52 H26 Z M36 48 H42 V52 H36 Z M47 48 H53 V52 H47 Z M58 48 H64 V52 H58 Z M68 48 H74 V52 H68 Z" />
              </svg>
            </div>
            <div>
              <span class="text-base font-black text-[#0A2540] dark:text-white">CamLife</span>
              <span class="block text-[10px] text-slate-400 font-khmer -mt-0.5">គណនីសមាជិក</span>
            </div>
          </div>

          <button
            @click="closeAuthModal"
            class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close modal"
            type="button"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Tab Switcher (Sign In / Register) -->
        <div class="px-6 pt-4">
          <div class="flex rounded-xl bg-slate-100 dark:bg-slate-700/60 p-1">
            <button
              @click="switchTab('login')"
              :class="[
                'flex-1 py-2 rounded-lg text-xs font-bold transition-colors text-center',
                authModalTab === 'login'
                  ? 'bg-white dark:bg-slate-800 text-[#0D47A1] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              ]"
              type="button"
            >
              Sign In
            </button>
            <button
              @click="switchTab('register')"
              :class="[
                'flex-1 py-2 rounded-lg text-xs font-bold transition-colors text-center',
                authModalTab === 'register'
                  ? 'bg-white dark:bg-slate-800 text-[#0D47A1] dark:text-blue-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              ]"
              type="button"
            >
              Create Account
            </button>
          </div>
        </div>

        <!-- Error Message Alert -->
        <div v-if="errorMessage" class="mx-6 mt-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-center gap-2 text-xs font-bold text-red-600 dark:text-red-400">
          <AlertCircle class="w-4 h-4 shrink-0" />
          <span>{{ errorMessage }}</span>
        </div>

        <!-- LOGIN FORM -->
        <form v-if="authModalTab === 'login'" @submit.prevent="handleLogin" class="p-6 space-y-4">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Email or Phone</label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="loginForm.emailOrPhone"
                type="text"
                placeholder="you@example.com or 012 345 678"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
              <a href="#" @click.prevent="handleForgotPassword" class="text-[11px] font-bold text-[#0D47A1] dark:text-blue-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter your password"
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between pt-1">
            <label class="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600 dark:text-slate-400">
              <input v-model="rememberMe" type="checkbox" class="rounded border-slate-300 text-[#0D47A1] focus:ring-blue-500" />
              <span>Remember this device</span>
            </label>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            Sign In to CamLife
          </button>

          <!-- Fast Demo Auto-fill Helper -->
          <div class="pt-2">
            <button
              @click="fillDemoUser"
              type="button"
              class="w-full py-2 bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-600 transition-colors"
            >
              <span class="inline-flex items-center justify-center gap-1.5"><Sparkles class="w-3.5 h-3.5 text-amber-500" /> <span>Quick Demo Citizen Sign-in</span></span>
            </button>
          </div>
        </form>

        <!-- REGISTER FORM -->
        <form v-else @submit.prevent="handleRegister" class="p-6 space-y-3.5">
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
            <div class="relative">
              <UserIcon class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.fullName"
                type="text"
                placeholder="e.g. Sok Vuthy"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
            <div class="relative">
              <Mail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.email"
                type="email"
                placeholder="you@example.com"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Password</label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="At least 6 characters"
                class="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <EyeOff v-if="showPassword" class="w-4 h-4" />
                <Eye v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300">Confirm Password</label>
            <div class="relative">
              <Lock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                class="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors mt-2"
          >
            Create Free Account
          </button>
        </form>
      </div>
    </div>
  </Transition>
</template>
