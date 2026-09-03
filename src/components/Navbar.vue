<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  LogOut,
  Bookmark,
  HeartPulse,
  Building2,
  Briefcase,
  Wrench,
  Bus,
  Siren,
  Newspaper,
  Check
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuth } from '@/composables/useAuth'
import { useSavedJobs } from '@/composables/useSavedJobs'
import AuthModal from '@/components/AuthModal.vue'
import SearchModal from '@/components/SearchModal.vue'

const route = useRoute()
const router = useRouter()
const { t, currentLanguage, setLanguage } = useLanguage()
const { isDark, toggleDarkMode } = useDarkMode()
const { currentUser, openLogin, logout } = useAuth()
const { savedJobIds } = useSavedJobs()

const isMobileDrawerOpen = ref(false)
const isServicesOpen = ref(false)
const isMobileServicesExpanded = ref(false)
const isProfileOpen = ref(false)
const isLangMenuOpen = ref(false)
const isSearchModalOpen = ref(false)

const serviceLinks = [
  { path: '/emergency', label: 'Emergency Services', labelKh: 'សេវាសង្គ្រោះបន្ទាន់', icon: Siren, color: 'text-[#E53935]', bg: 'bg-red-50 dark:bg-red-950/40' },
  { path: '/health', label: 'Health & Medical', labelKh: 'សុខាភិបាល និងពេទ្យ', icon: HeartPulse, color: 'text-[#16A34A]', bg: 'bg-emerald-50 dark:bg-emerald-950/40' },
  { path: '/government', label: 'Government Guides', labelKh: 'សេវារដ្ឋបាលសាធារណៈ', icon: Building2, color: 'text-[#0D47A1]', bg: 'bg-blue-50 dark:bg-blue-950/40' },
  { path: '/jobs', label: 'Jobs & Careers', labelKh: 'ឱកាសការងារ', icon: Briefcase, color: 'text-[#7E57C2]', bg: 'bg-purple-50 dark:bg-purple-950/40' },
  { path: '/transport', label: 'Transport & Transit', labelKh: 'ការធ្វើដំណើរ និងដឹកជញ្ជូន', icon: Bus, color: 'text-[#F59E0B]', bg: 'bg-amber-50 dark:bg-amber-950/40' },
  { path: '/home-services', label: 'Home & Daily Services', labelKh: 'សេវាកម្មគេហដ្ឋាន', icon: Wrench, color: 'text-[#0891B2]', bg: 'bg-cyan-50 dark:bg-cyan-950/40' },
  { path: '/news', label: 'Public Bulletins & News', labelKh: 'ព័ត៌មាន និងសេចក្តីប្រកាស', icon: Newspaper, color: 'text-[#EC4899]', bg: 'bg-pink-50 dark:bg-pink-950/40' }
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

function isServicesActive(): boolean {
  return [
    '/health',
    '/government',
    '/home-services',
    '/transport',
    '/emergency',
    '/locations'
  ].some(p => route.path.startsWith(p))
}

function navigateTo(path: string) {
  router.push(path)
  closeAll()
}

function closeAll() {
  isMobileDrawerOpen.value = false
  isServicesOpen.value = false
  isProfileOpen.value = false
  isLangMenuOpen.value = false
}

function handleAuthClick() {
  closeAll()
  openLogin()
}

function handleLogout() {
  logout()
  isProfileOpen.value = false
}

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchModalOpen.value = !isSearchModalOpen.value
  }
}

function onWindowClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    isProfileOpen.value = false
  }
  if (!target.closest('.lang-menu-container')) {
    isLangMenuOpen.value = false
  }
  if (!target.closest('.services-menu-container')) {
    isServicesOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
  window.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
  window.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<template>
  <header class="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1727]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-18 flex items-center justify-between gap-3 sm:gap-4">

        <!-- ============================================================
             LEFT: BRAND LOGO (Official CamLife Logo)
        ============================================================= -->
        <router-link
          to="/"
          class="flex items-center gap-2 group focus:outline-none shrink-0"
          aria-label="CamLife Home"
        >
          <img
            src="/logo.png"
            alt="CamLife Cambodia"
            class="h-10 sm:h-12 w-auto object-contain rounded-xl dark:bg-white/95 dark:p-1 transition-transform duration-200 group-hover:scale-105"
          />
        </router-link>

        <!-- ============================================================
             CENTER: DESKTOP NAVIGATION LINKS
             Home, Services ▾, Jobs, News, About Us, Contact
        ============================================================= -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
          <!-- Home -->
          <router-link
            to="/"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive('/')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.home') }}
          </router-link>

          <!-- Services Dropdown -->
          <div class="relative services-menu-container h-full flex items-center">
            <button
              @click="isServicesOpen = !isServicesOpen"
              :class="[
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
                isServicesActive() || isServicesOpen
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                  : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              ]"
              type="button"
              aria-haspopup="true"
              :aria-expanded="isServicesOpen"
            >
              <span>{{ t('nav.services') }}</span>
              <ChevronDown
                class="w-3.5 h-3.5 transition-transform duration-200 text-slate-500"
                :class="isServicesOpen ? 'rotate-180 text-[#0D47A1]' : ''"
              />
            </button>

            <!-- Dropdown Menu -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-2 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-2 scale-95"
            >
              <div
                v-if="isServicesOpen"
                class="absolute top-full left-0 mt-1 w-80 bg-white dark:bg-[#1E293B] rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-2 z-50 animate-fadeIn"
              >
                <div class="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 mb-1">
                  {{ currentLanguage === 'kh' ? 'សេវាកម្មទាំងអស់' : 'All Life Services' }}
                </div>
                <div class="space-y-1">
                  <button
                    v-for="service in serviceLinks"
                    :key="service.path"
                    @click="navigateTo(service.path)"
                    class="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors group"
                    type="button"
                  >
                    <div :class="['w-8 h-8 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform', service.bg]">
                      <component :is="service.icon" :class="['w-4 h-4', service.color]" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors truncate">
                        {{ currentLanguage === 'kh' ? service.labelKh : service.label }}
                      </p>
                      <p class="text-[11px] text-slate-400 dark:text-slate-400 truncate">
                        {{ currentLanguage === 'kh' ? service.label : service.labelKh }}
                      </p>
                    </div>
                    <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-500 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Jobs -->
          <router-link
            to="/jobs"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive('/jobs')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.jobs') }}
          </router-link>

          <!-- News -->
          <router-link
            to="/news"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive('/news')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.news') }}
          </router-link>

          <!-- About Us -->
          <router-link
            to="/about"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive('/about')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.about') }}
          </router-link>

          <!-- Contact -->
          <router-link
            to="/contact"
            :class="[
              'px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive('/contact')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.contact') }}
          </router-link>
        </nav>

        <!-- ============================================================
             RIGHT: SEARCH, LANGUAGE, DARK MODE, AUTH / PROFILE
        ============================================================= -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">

          <!-- Search Trigger (Desktop & Mobile) -->
          <button
            @click="isSearchModalOpen = true"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
            type="button"
            aria-label="Open search dialog"
          >
            <Search class="w-4 h-4 text-slate-500 dark:text-slate-400" />
            <span class="hidden sm:inline">Search...</span>
            <kbd class="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>

          <!-- Language Selector -->
          <div class="relative lang-menu-container">
            <button
              @click="isLangMenuOpen = !isLangMenuOpen"
              class="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold border border-slate-200/80 dark:border-slate-700/80 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
              type="button"
              aria-label="Select language"
            >
              <span class="text-sm leading-none">{{ currentLanguage === 'kh' ? '🇰🇭' : '🇬🇧' }}</span>
              <span class="uppercase tracking-wider font-bold">{{ currentLanguage }}</span>
              <ChevronDown class="w-3 h-3 text-slate-400" />
            </button>

            <!-- Language Dropdown -->
            <Transition
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-2 scale-95"
              enter-to-class="opacity-100 translate-y-0 scale-100"
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100 translate-y-0 scale-100"
              leave-to-class="opacity-0 translate-y-2 scale-95"
            >
              <div
                v-if="isLangMenuOpen"
                class="absolute right-0 mt-1 w-36 bg-white dark:bg-[#1E293B] rounded-xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-1.5 z-50 animate-fadeIn"
              >
                <button
                  @click="setLanguage('en'); isLangMenuOpen = false"
                  :class="[
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold transition-colors',
                    currentLanguage === 'en'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  ]"
                  type="button"
                >
                  <span class="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>English</span>
                  </span>
                  <Check v-if="currentLanguage === 'en'" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
                </button>

                <button
                  @click="setLanguage('kh'); isLangMenuOpen = false"
                  :class="[
                    'w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-semibold font-khmer transition-colors',
                    currentLanguage === 'kh'
                      ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-bold'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700'
                  ]"
                  type="button"
                >
                  <span class="flex items-center gap-2">
                    <span>🇰🇭</span>
                    <span>ភាសាខ្មែរ</span>
                  </span>
                  <Check v-if="currentLanguage === 'kh'" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
                </button>
              </div>
            </Transition>
          </div>

          <!-- Dark Mode Toggle -->
          <button
            @click="toggleDarkMode"
            class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 transition-colors"
            :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
            type="button"
          >
            <Sun v-if="isDark" class="w-4 h-4 text-amber-400" />
            <Moon v-else class="w-4 h-4 text-slate-600" />
          </button>

          <!-- Desktop User Menu or Sign In Button -->
          <div class="hidden sm:flex items-center">
            <!-- If logged in: User Profile Menu -->
            <div v-if="currentUser" class="relative user-menu-container">
              <button
                @click="isProfileOpen = !isProfileOpen"
                class="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                type="button"
              >
                <div class="w-7 h-7 rounded-lg bg-[#0D47A1] text-white flex items-center justify-center text-xs font-bold">
                  {{ currentUser.name.charAt(0).toUpperCase() }}
                </div>
                <span class="text-xs font-bold text-slate-800 dark:text-white max-w-[90px] truncate">
                  {{ currentUser.name }}
                </span>
                <ChevronDown class="w-3 h-3 text-slate-400" />
              </button>

              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-2 scale-95"
                enter-to-class="opacity-100 translate-y-0 scale-100"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0 scale-100"
                leave-to-class="opacity-0 translate-y-2 scale-95"
              >
                <div
                  v-if="isProfileOpen"
                  class="absolute right-0 mt-1 w-56 bg-white dark:bg-[#1E293B] rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-2 z-50 animate-fadeIn"
                >
                  <div class="p-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                    <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ currentUser.name }}</p>
                    <p class="text-[11px] text-slate-400 truncate">{{ currentUser.email }}</p>
                    <span class="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-50 dark:bg-blue-900/40 text-[#0D47A1] dark:text-blue-300">
                      {{ currentUser.role || 'Member' }}
                    </span>
                  </div>

                  <router-link
                    to="/saved-jobs"
                    @click="isProfileOpen = false"
                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    <span class="flex items-center gap-2">
                      <Bookmark class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
                      <span>Saved Jobs</span>
                    </span>
                    <span v-if="savedJobIds.length > 0" class="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300">
                      {{ savedJobIds.length }}
                    </span>
                  </router-link>

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mt-1"
                    type="button"
                  >
                    <LogOut class="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </Transition>
            </div>

            <!-- If guest: Sign In Button -->
            <button
              v-else
              @click="handleAuthClick"
              class="px-4 py-2 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-150 active:scale-95"
              type="button"
            >
              Sign In
            </button>
          </div>

          <!-- Mobile Hamburger Toggle Button -->
          <button
            @click="isMobileDrawerOpen = true"
            class="lg:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            aria-label="Open navigation menu"
            type="button"
          >
            <Menu class="w-5 h-5" />
          </button>
        </div>

      </div>
    </div>

    <!-- ============================================================
         MOBILE SIDE DRAWER OVERLAY
         Structure:
         Logo + Close Button
         Navigation Links (Home, Services, Jobs, News, About, Contact)
         Divider
         Language Selector
         Dark Mode
         Sign In / User Profile Card
    ============================================================= -->
    <Transition
      enter-active-class="transition-opacity duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isMobileDrawerOpen"
        class="fixed inset-0 bg-slate-950/50 backdrop-blur-xs z-50 lg:hidden"
        @click="isMobileDrawerOpen = false"
      />
    </Transition>

    <Transition
      enter-active-class="transition duration-250 ease-out"
      enter-from-class="translate-x-full"
      enter-to-class="translate-x-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="translate-x-0"
      leave-to-class="translate-x-full"
    >
      <aside
        v-if="isMobileDrawerOpen"
        class="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white dark:bg-[#1E293B] shadow-2xl border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col justify-between overflow-y-auto lg:hidden"
      >
        <!-- Drawer Header -->
        <div class="p-5 border-b border-slate-100 dark:border-slate-700/80 flex items-center justify-between">
          <router-link to="/" @click="isMobileDrawerOpen = false" class="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="CamLife Cambodia"
              class="h-9 w-auto object-contain rounded-lg dark:bg-white/95 dark:p-0.5"
            />
          </router-link>

          <button
            @click="isMobileDrawerOpen = false"
            class="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close menu"
            type="button"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Drawer Body Navigation Links -->
        <div class="p-4 flex-1 space-y-1 overflow-y-auto">
          <!-- Home -->
          <button
            @click="navigateTo('/')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span>{{ t('nav.home') }}</span>
          </button>

          <!-- Services Accordion -->
          <div class="space-y-1">
            <button
              @click="isMobileServicesExpanded = !isMobileServicesExpanded"
              :class="[
                'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
                isServicesActive()
                  ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              ]"
              type="button"
            >
              <span>{{ t('nav.services') }}</span>
              <ChevronDown
                class="w-4 h-4 transition-transform text-slate-400"
                :class="isMobileServicesExpanded ? 'rotate-180' : ''"
              />
            </button>

            <!-- Submenu -->
            <div v-if="isMobileServicesExpanded" class="pl-4 pr-1 py-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-700 ml-4 my-1">
              <button
                v-for="service in serviceLinks"
                :key="service.path"
                @click="navigateTo(service.path)"
                class="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#0D47A1] dark:hover:text-blue-400 text-left transition-colors"
                type="button"
              >
                <component :is="service.icon" :class="['w-4 h-4', service.color]" />
                <span>{{ currentLanguage === 'kh' ? service.labelKh : service.label }}</span>
              </button>
            </div>
          </div>

          <!-- Jobs -->
          <button
            @click="navigateTo('/jobs')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/jobs')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span>{{ t('nav.jobs') }}</span>
          </button>

          <!-- News -->
          <button
            @click="navigateTo('/news')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/news')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span>{{ t('nav.news') }}</span>
          </button>

          <!-- About Us -->
          <button
            @click="navigateTo('/about')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/about')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span>{{ t('nav.about') }}</span>
          </button>

          <!-- Contact -->
          <button
            @click="navigateTo('/contact')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/contact')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span>{{ t('nav.contact') }}</span>
          </button>

          <!-- Saved Jobs -->
          <button
            @click="navigateTo('/saved-jobs')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/saved-jobs')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span class="flex items-center gap-2">
              <Bookmark class="w-4 h-4 text-[#0D47A1]" />
              <span>Saved Jobs</span>
            </span>
            <span v-if="savedJobIds.length > 0" class="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300">
              {{ savedJobIds.length }}
            </span>
          </button>
        </div>

        <!-- Drawer Footer: Divider, Settings & Auth -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-700/80 space-y-3 bg-slate-50/50 dark:bg-slate-900/40">
          <!-- Language & Theme Row -->
          <div class="flex items-center justify-between gap-2">
            <!-- Language Pills -->
            <div class="flex items-center bg-white dark:bg-slate-800 rounded-xl p-1 border border-slate-200 dark:border-slate-700 w-full">
              <button
                @click="setLanguage('en')"
                :class="[
                  'flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors text-center',
                  currentLanguage === 'en'
                    ? 'bg-[#0D47A1] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0D47A1]'
                ]"
                type="button"
              >
                🇬🇧 English
              </button>
              <button
                @click="setLanguage('kh')"
                :class="[
                  'flex-1 py-1.5 rounded-lg text-xs font-bold font-khmer transition-colors text-center',
                  currentLanguage === 'kh'
                    ? 'bg-[#0D47A1] text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-[#0D47A1]'
                ]"
                type="button"
              >
                🇰🇭 ខ្មែរ
              </button>
            </div>
          </div>

          <!-- User Card or Sign In Button -->
          <div v-if="currentUser" class="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div class="flex items-center gap-2.5 min-w-0">
              <div class="w-8 h-8 rounded-lg bg-[#0D47A1] text-white flex items-center justify-center font-bold text-xs shrink-0">
                {{ currentUser.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="text-xs font-bold text-slate-800 dark:text-white truncate">{{ currentUser.name }}</p>
                <p class="text-[10px] text-slate-400 truncate">{{ currentUser.email }}</p>
              </div>
            </div>
            <button
              @click="handleLogout"
              class="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
              title="Sign Out"
              type="button"
            >
              <LogOut class="w-4 h-4" />
            </button>
          </div>

          <button
            v-else
            @click="handleAuthClick"
            class="w-full py-2.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-sm text-center transition-colors"
            type="button"
          >
            Sign In / Register
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Global Modals -->
    <AuthModal />
    <SearchModal :is-open="isSearchModalOpen" @close="isSearchModalOpen = false" />
  </header>
</template>
