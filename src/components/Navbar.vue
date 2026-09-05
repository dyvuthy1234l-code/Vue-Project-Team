<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
  LogOut,
  Bookmark,
  HeartPulse,
  Building2,
  Briefcase,
  Wrench,
  Bus,
  Siren,
  Newspaper,
  MapPin,
  ShieldCheck,
  LayoutDashboard,
  Landmark,
  ShieldAlert,
  Flame,
  Ambulance,
  PhoneCall
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useAuth } from '@/composables/useAuth'
import { useSavedServices } from '@/composables/useSavedServices'
import AuthModal from '@/components/AuthModal.vue'
import SearchModal from '@/components/SearchModal.vue'
import AccessibilityMenu from '@/components/AccessibilityMenu.vue'
import LocationSelector from '@/components/LocationSelector.vue'

const route = useRoute()
const router = useRouter()
const { t, currentLanguage } = useLanguage()
const { currentUser, openLogin, logout } = useAuth()
const { savedCount } = useSavedServices()

const isMobileDrawerOpen = ref(false)
const isServicesOpen = ref(false)
const isMobileServicesExpanded = ref(false)
const isProfileOpen = ref(false)
const isSearchModalOpen = ref(false)

const serviceLinks = [
  {
    path: '/emergency',
    label: 'Emergency Center',
    labelKh: 'មជ្ឈមណ្ឌលសង្គ្រោះបន្ទាន់',
    icon: Siren,
    color: 'text-[#E53935]',
    bg: 'bg-red-50 dark:bg-red-950/40',
    image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=240&q=80'
  },
  {
    path: '/government',
    label: 'Civic & Government Guides',
    labelKh: 'សេវារដ្ឋបាលសាធារណៈ',
    icon: Building2,
    color: 'text-[#0D47A1]',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    image: '/images/documents/national-id.jpg'
  },
  {
    path: '/health',
    label: 'Healthcare & Hospitals',
    labelKh: 'សុខាភិបាល និងមន្ទីរពេទ្យ',
    icon: HeartPulse,
    color: 'text-[#16A34A]',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=240&q=80'
  },
  {
    path: '/jobs',
    label: 'Public & Private Jobs',
    labelKh: 'ឱកាសការងារសាធារណៈ',
    icon: Briefcase,
    color: 'text-[#7E57C2]',
    bg: 'bg-purple-50 dark:bg-purple-950/40',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=240&q=80'
  },
  {
    path: '/transport',
    label: 'City Bus & Transport',
    labelKh: 'ការធ្វើដំណើរ និងរថយន្តក្រុង',
    icon: Bus,
    color: 'text-[#F59E0B]',
    bg: 'bg-amber-50 dark:bg-amber-950/40',
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=240&q=80'
  },
  {
    path: '/home-services',
    label: 'Home Services & Repairs',
    labelKh: 'សេវាជាង និងគេហដ្ឋាន',
    icon: Wrench,
    color: 'text-[#0891B2]',
    bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=240&q=80'
  },
  {
    path: '/locations',
    label: 'Public Offices & OWSO',
    labelKh: 'ទីតាំងរដ្ឋបាល & ច្រកចេញចូលតែមួយ',
    icon: MapPin,
    color: 'text-[#EC4899]',
    bg: 'bg-pink-50 dark:bg-pink-950/40',
    image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=240&q=80'
  },
  {
    path: '/news',
    label: 'Official Bulletins & News',
    labelKh: 'ព័ត៌មាន និងសេចក្តីប្រកាស',
    icon: Newspaper,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950/40',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=240&q=80'
  }
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
  <header class="sticky top-0 z-40 bg-white dark:bg-[#0B1727] border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
    <!-- ============================================================
         TOP UTILITY BAR: NATIONAL CITIZEN HEADER & EMERGENCY DIALS
    ============================================================= -->
    <div class="bg-gradient-to-r from-[#0A2540] via-[#0D3B66] to-[#0A2540] text-white text-[11px] py-1.5 px-3 sm:px-6 lg:px-8 border-b border-blue-900/40">
      <div class="max-w-[1600px] mx-auto flex items-center justify-between gap-3">
        <!-- Left: National Portal Statement -->
        <div class="flex items-center gap-2 truncate font-khmer">
          <Landmark class="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
          <span class="font-bold tracking-tight truncate hidden sm:inline">
            {{ currentLanguage === 'kh' ? 'វិបផតថលសេវាសាធារណៈសម្រាប់ប្រជាពលរដ្ឋកម្ពុជា' : 'Cambodia Public Citizen & Life Services Platform' }}
          </span>
          <span class="inline-flex items-center gap-1 px-2 py-0.2 rounded-full text-[9px] font-extrabold bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <ShieldCheck class="w-3 h-3 text-emerald-400" />
            <span>{{ currentLanguage === 'kh' ? 'វេទិកាឯករាជ្យ' : 'Citizen Platform' }}</span>
          </span>
        </div>

        <!-- Center/Right: National Emergency Quick Dials -->
        <div class="flex items-center gap-3 sm:gap-4 shrink-0 font-bold">
          <!-- Police 117 -->
          <a
            href="tel:117"
            class="flex items-center gap-1 hover:text-red-300 transition-colors"
            title="Police Hotline 117"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
            <span class="inline-flex items-center gap-1 text-red-300"><ShieldAlert class="w-3 h-3" /> 117</span>
          </a>

          <!-- Fire 118 -->
          <a
            href="tel:118"
            class="hidden md:flex items-center gap-1 hover:text-amber-300 transition-colors"
            title="Fire Service 118"
          >
            <span class="inline-flex items-center gap-1 text-amber-300"><Flame class="w-3 h-3" /> 118</span>
          </a>

          <!-- Ambulance 119 -->
          <a
            href="tel:119"
            class="flex items-center gap-1 hover:text-emerald-300 transition-colors"
            title="Medical Ambulance 119"
          >
            <span class="inline-flex items-center gap-1 text-emerald-300"><Ambulance class="w-3 h-3" /> 119</span>
          </a>

          <!-- Citizen Service Desk 1222 -->
          <a
            href="tel:1222"
            class="hidden lg:flex items-center gap-1 text-blue-200 hover:text-white transition-colors"
            title="Citizen Inquiry Hotline 1222"
          >
            <span class="inline-flex items-center gap-1"><PhoneCall class="w-3 h-3" /> 1222 {{ currentLanguage === 'kh' ? 'សេវាពលរដ្ឋ' : 'Helpdesk' }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- ============================================================
         MAIN NAVIGATION BAR
    ============================================================= -->
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="h-[4.5rem] flex items-center justify-between gap-3 sm:gap-4">

        <!-- BRAND LOGO -->
        <router-link
          to="/"
          class="flex items-center gap-2.5 group focus:outline-none shrink-0"
          aria-label="CamLife Home"
        >
          <img
            src="/logo.png"
            alt="CamLife Cambodia"
            class="h-10 sm:h-12 w-auto object-contain rounded-xl dark:bg-white/95 dark:p-1 transition-transform duration-200 group-hover:scale-105"
          />
        </router-link>

        <!-- CENTER NAVIGATION LINKS -->
        <nav class="hidden lg:flex items-center gap-1 xl:gap-2 h-full">
          <!-- Home -->
          <router-link
            to="/"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 font-khmer',
              isActive('/')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-black'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.home') }}
          </router-link>

          <!-- Public Services Dropdown -->
          <div class="relative services-menu-container h-full flex items-center">
            <button
              @click="isServicesOpen = !isServicesOpen"
              :class="[
                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 font-khmer',
                isServicesActive() || isServicesOpen
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-black'
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
                class="absolute top-full left-0 mt-1 w-[380px] bg-white dark:bg-[#1E293B] rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-2 z-50 animate-fadeIn"
              >
                <div class="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 mb-1 flex items-center justify-between">
                  <span>{{ currentLanguage === 'kh' ? 'សេវាសាធារណៈ និងជីវិតប្រចាំថ្ងៃ' : 'Public & Civic Directory' }}</span>
                  <span class="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300">8 Services</span>
                </div>
                <div class="space-y-1">
                  <button
                    v-for="service in serviceLinks"
                    :key="service.path"
                    @click="navigateTo(service.path)"
                    class="w-full flex items-center gap-3 p-2 rounded-xl text-left hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all group border border-transparent hover:border-slate-200/60 dark:hover:border-slate-600"
                    type="button"
                  >
                    <!-- Representative Image Thumbnail with Icon badge -->
                    <div class="relative w-11 h-11 rounded-xl overflow-hidden shrink-0 border border-slate-200/80 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 shadow-xs">
                      <img
                        :src="service.image"
                        :alt="service.label"
                        class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                      <div :class="['absolute -bottom-1 -right-1 w-5 h-5 rounded-md flex items-center justify-center border border-white dark:border-slate-800 shadow-xs', service.bg]">
                        <component :is="service.icon" :class="['w-3 h-3', service.color]" />
                      </div>
                    </div>

                    <!-- Label in Khmer and English -->
                    <div class="flex-1 min-w-0 font-khmer">
                      <p class="text-xs font-black text-slate-800 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors truncate">
                        {{ currentLanguage === 'kh' ? service.labelKh : service.label }}
                      </p>
                      <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                        {{ currentLanguage === 'kh' ? service.label : service.labelKh }}
                      </p>
                    </div>
                    <ChevronRight class="w-4 h-4 text-slate-300 dark:text-slate-500 group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                </div>
              </div>
            </Transition>
          </div>

          <!-- Civic Guides (Government) -->
          <router-link
            to="/government"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 font-khmer',
              isActive('/government')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-black'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.government') }}
          </router-link>

          <!-- Jobs -->
          <router-link
            to="/jobs"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 font-khmer',
              isActive('/jobs')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-black'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.jobs') }}
          </router-link>

          <!-- News -->
          <router-link
            to="/news"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 font-khmer',
              isActive('/news')
                ? 'bg-blue-50/80 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400 font-black'
                : 'text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
            ]"
          >
            {{ t('nav.news') }}
          </router-link>

          <!-- Admin CMS Portal Link -->
          <router-link
            to="/admin"
            :class="[
              'px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 flex items-center gap-1.5 border',
              isActive('/admin')
                ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800'
                : 'text-slate-600 dark:text-slate-300 border-dashed border-slate-300 dark:border-slate-700 hover:border-purple-300 hover:text-purple-600'
            ]"
            title="Content Management & Verification Portal"
          >
            <LayoutDashboard class="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>Admin CMS</span>
          </router-link>
        </nav>

        <!-- RIGHT CONTROLS: SMART SEARCH, LOCATION, ACCESSIBILITY, SAVED SERVICES, AUTH -->
        <div class="flex items-center gap-1.5 sm:gap-2 shrink-0">

          <!-- Smart Search Trigger Button (Desktop & Mobile) -->
          <button
            @click="isSearchModalOpen = true"
            class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors"
            type="button"
            aria-label="Open smart search dialog"
          >
            <Search class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
            <span class="hidden md:inline font-khmer">{{ currentLanguage === 'kh' ? 'ស្វែងរក...' : 'Smart Search...' }}</span>
            <kbd class="hidden lg:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-600">
              ⌘K
            </kbd>
          </button>

          <!-- Citizen Location Selector Component -->
          <LocationSelector class="hidden sm:block" />

          <!-- Accessibility Settings Dropdown Component -->
          <AccessibilityMenu />

          <!-- Saved Services Indicator -->
          <router-link
            to="/saved-services"
            class="relative p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700 transition-colors"
            :title="currentLanguage === 'kh' ? 'សេវាដែលបានរក្សាទុក' : 'Saved Services'"
          >
            <Bookmark class="w-4 h-4" />
            <span
              v-if="savedCount > 0"
              class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#0D47A1] text-white text-[9px] font-extrabold flex items-center justify-center shadow-xs"
            >
              {{ savedCount }}
            </span>
          </router-link>

          <!-- Desktop User Menu or Sign In Button -->
          <div class="hidden sm:flex items-center">
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
                      {{ currentUser.role || 'Citizen Member' }}
                    </span>
                  </div>

                  <router-link
                    to="/saved-services"
                    @click="isProfileOpen = false"
                    class="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-khmer"
                  >
                    <span class="flex items-center gap-2">
                      <Bookmark class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
                      <span>{{ currentLanguage === 'kh' ? 'សេវាដែលបានរក្សាទុក' : 'Saved Services' }}</span>
                    </span>
                    <span v-if="savedCount > 0" class="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300">
                      {{ savedCount }}
                    </span>
                  </router-link>

                  <router-link
                    to="/admin"
                    @click="isProfileOpen = false"
                    class="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors font-khmer"
                  >
                    <LayoutDashboard class="w-4 h-4" />
                    <span>{{ currentLanguage === 'kh' ? 'ផ្ទាំងគ្រប់គ្រងទិន្នន័យ (Admin)' : 'Admin Dashboard' }}</span>
                  </router-link>

                  <button
                    @click="handleLogout"
                    class="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors mt-1 font-khmer"
                    type="button"
                  >
                    <LogOut class="w-4 h-4" />
                    <span>{{ currentLanguage === 'kh' ? 'ចាកចេញ' : 'Sign Out' }}</span>
                  </button>
                </div>
              </Transition>
            </div>

            <button
              v-else
              @click="handleAuthClick"
              class="px-4 py-2 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-sm transition-all duration-150 active:scale-95 font-khmer"
              type="button"
            >
              {{ currentLanguage === 'kh' ? 'ចូលគណនី' : 'Sign In' }}
            </button>
          </div>

          <!-- Mobile Hamburger Menu Button -->
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
        class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 lg:hidden"
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
        class="fixed top-0 right-0 bottom-0 w-84 max-w-[88vw] bg-white dark:bg-[#1E293B] shadow-2xl border-l border-slate-200 dark:border-slate-700 z-50 flex flex-col justify-between overflow-y-auto lg:hidden"
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
        <div class="p-4 flex-1 space-y-1 overflow-y-auto font-khmer">
          <!-- Location selector for mobile -->
          <div class="pb-3 mb-2 border-b border-slate-100 dark:border-slate-700">
            <LocationSelector class="w-full" />
          </div>

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
            <div v-if="isMobileServicesExpanded" class="pl-3 pr-1 py-1 space-y-1 border-l-2 border-slate-100 dark:border-slate-700 ml-3 my-1">
              <button
                v-for="service in serviceLinks"
                :key="service.path"
                @click="navigateTo(service.path)"
                class="w-full flex items-center gap-3 p-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-[#0D47A1] dark:hover:text-blue-400 text-left transition-colors"
                type="button"
              >
                <div class="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                  <img :src="service.image" :alt="service.label" class="w-full h-full object-cover" loading="lazy" />
                  <div :class="['absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded flex items-center justify-center border border-white dark:border-slate-800', service.bg]">
                    <component :is="service.icon" :class="['w-2.5 h-2.5', service.color]" />
                  </div>
                </div>
                <div class="flex-1 min-w-0 font-khmer">
                  <p class="font-bold text-xs truncate">{{ currentLanguage === 'kh' ? service.labelKh : service.label }}</p>
                  <p class="text-[10px] text-slate-400 truncate">{{ currentLanguage === 'kh' ? service.label : service.labelKh }}</p>
                </div>
              </button>
            </div>
          </div>

          <!-- Civic Guides (Government) -->
          <button
            @click="navigateTo('/government')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/government')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span>{{ t('nav.government') }}</span>
          </button>

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

          <!-- Saved Services -->
          <button
            @click="navigateTo('/saved-services')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors',
              isActive('/saved-services')
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-400'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <span class="flex items-center gap-2">
              <Bookmark class="w-4 h-4 text-[#0D47A1]" />
              <span>{{ currentLanguage === 'kh' ? 'សេវាដែលបានរក្សាទុក' : 'Saved Services' }}</span>
            </span>
            <span v-if="savedCount > 0" class="px-2 py-0.5 text-xs font-bold rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#0D47A1] dark:text-blue-300">
              {{ savedCount }}
            </span>
          </button>

          <!-- Admin CMS Dashboard -->
          <button
            @click="navigateTo('/admin')"
            :class="[
              'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-colors text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800'
            ]"
            type="button"
          >
            <span class="flex items-center gap-2">
              <LayoutDashboard class="w-4 h-4 text-purple-600" />
              <span>Admin CMS Portal</span>
            </span>
          </button>
        </div>

        <!-- Drawer Footer: Auth -->
        <div class="p-4 border-t border-slate-100 dark:border-slate-700/80 space-y-3 bg-slate-50/50 dark:bg-slate-900/40 font-khmer">
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
            {{ currentLanguage === 'kh' ? 'ចូលគណនី / ចុះឈ្មោះ' : 'Sign In / Register' }}
          </button>
        </div>
      </aside>
    </Transition>

    <!-- Global Modals -->
    <AuthModal />
    <SearchModal :is-open="isSearchModalOpen" @close="isSearchModalOpen = false" />
  </header>
</template>
