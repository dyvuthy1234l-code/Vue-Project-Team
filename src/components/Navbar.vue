<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Menu,
  X,
  ArrowRight,
  ShieldAlert,
  ChevronDown
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const route = useRoute()
const router = useRouter()

const { t, currentLanguage, setLanguage } = useLanguage()

const isMobileMenuOpen = ref(false)
const isServicesOpen = ref(false)

const mainNavLinks = computed(() => [
  {
    path: '/',
    label: t('nav.home')
  },
  {
    path: '/health',
    label: t('nav.health')
  },
  {
    path: '/government',
    label: t('nav.government')
  },
  {
    path: '/jobs',
    label: t('nav.jobs')
  },
  {
    path: '/home-services',
    label: t('nav.homeServices')
  },
  {
    path: '/transport',
    label: t('nav.transport')
  },
  {
    path: '/news',
    label: t('nav.news')
  },
  {
    path: '/locations',
    label: t('nav.locations')
  },
  {
    path: '/about',
    label: t('nav.about')
  }
])

const serviceLinks = computed(() => [
  {
    path: '/health',
    label: t('nav.health')
  },
  {
    path: '/government',
    label: t('nav.government')
  },
  {
    path: '/jobs',
    label: t('nav.jobs')
  },
  {
    path: '/home-services',
    label: t('nav.homeServices')
  },
  {
    path: '/transport',
    label: t('nav.transport')
  }
])

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'

  return route.path.startsWith(path)
}

function navigateTo(path: string) {
  router.push(path)

  isMobileMenuOpen.value = false
  isServicesOpen.value = false
}

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

function closeMenus() {
  isMobileMenuOpen.value = false
  isServicesOpen.value = false
}
</script>

<template>
  <header class="sticky top-0 z-50">

    <!-- NAVBAR -->
    <nav
      class="
        border-b border-slate-200/70
        bg-white/90
        backdrop-blur-xl
        supports-[backdrop-filter]:bg-white/75
      "
    >

      <div
        class="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        <div class="h-[76px] flex items-center justify-between gap-6">

          <!-- =========================================
               LOGO
          ========================================== -->

          <router-link
            to="/"
            @click="closeMenus"
            class="
              group
              flex
              items-center
              gap-3
              shrink-0
              focus:outline-none
            "
          >

            <!-- Logo Icon -->
            <div
              class="
                relative
                w-10
                h-10
                rounded-xl
                bg-gradient-to-br
                from-[#123B6D]
                to-[#1677C8]
                flex
                items-center
                justify-center
                shadow-[0_6px_18px_rgba(22,119,200,0.20)]
                transition-all
                duration-300
                group-hover:scale-105
                group-hover:shadow-[0_8px_24px_rgba(22,119,200,0.28)]
              "
            >
              <span class="text-lg leading-none">
                🇰🇭
              </span>
            </div>

            <!-- Brand -->
            <div class="flex flex-col leading-none">

              <span
                class="
                  text-[19px]
                  font-black
                  tracking-[-0.02em]
                  text-[#0F2747]
                  transition-colors
                  group-hover:text-[#1677C8]
                "
              >
                CamLife
              </span>

              <span
                class="
                  mt-1
                  text-[9px]
                  font-semibold
                  uppercase
                  tracking-[0.16em]
                  text-slate-400
                "
              >
                {{ t('nav.tagline') }}
              </span>

            </div>

          </router-link>


          <!-- =========================================
               DESKTOP NAVIGATION
          ========================================== -->

          <div
            class="
              hidden
              xl:flex
              items-center
              gap-1
              flex-1
              justify-center
            "
          >

            <!-- Home -->
            <button
              @click="navigateTo('/')"
              :class="[
                'relative px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 whitespace-nowrap',
                isActive('/')
                  ? 'text-[#1677C8]'
                  : 'text-slate-500 hover:text-[#0F2747] hover:bg-slate-50'
              ]"
            >
              {{ t('nav.home') }}

              <span
                v-if="isActive('/')"
                class="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  bottom-0
                  w-4
                  h-0.5
                  rounded-full
                  bg-[#1677C8]
                "
              />
            </button>


            <!-- Services Dropdown -->
            <div
              class="relative"
              @mouseenter="isServicesOpen = true"
              @mouseleave="isServicesOpen = false"
            >

              <button
                class="
                  flex
                  items-center
                  gap-1
                  px-3
                  py-2
                  rounded-lg
                  text-[13px]
                  font-semibold
                  text-slate-500
                  hover:text-[#0F2747]
                  hover:bg-slate-50
                  transition-all
                "
              >
                Services

                <ChevronDown
                  class="
                    w-3.5
                    h-3.5
                    transition-transform
                  "
                  :class="isServicesOpen ? 'rotate-180' : ''"
                />
              </button>


              <!-- Dropdown -->
              <Transition
                enter-active-class="transition duration-150 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition duration-100 ease-in"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 translate-y-1"
              >

                <div
                  v-if="isServicesOpen"
                  class="
                    absolute
                    top-full
                    left-1/2
                    -translate-x-1/2
                    pt-3
                    w-64
                  "
                >

                  <div
                    class="
                      rounded-2xl
                      border
                      border-slate-200
                      bg-white
                      p-2
                      shadow-[0_20px_50px_rgba(15,23,42,0.12)]
                    "
                  >

                    <button
                      v-for="service in serviceLinks"
                      :key="service.path"
                      @click="navigateTo(service.path)"
                      class="
                        w-full
                        flex
                        items-center
                        justify-between
                        px-3
                        py-2.5
                        rounded-xl
                        text-left
                        text-sm
                        font-medium
                        text-slate-600
                        hover:bg-blue-50
                        hover:text-[#1677C8]
                        transition-colors
                      "
                    >

                      <span>
                        {{ service.label }}
                      </span>

                      <ArrowRight class="w-3.5 h-3.5" />

                    </button>

                  </div>

                </div>

              </Transition>

            </div>


            <!-- Other Navigation -->
            <button
              v-for="link in mainNavLinks.filter(
                link =>
                  link.path !== '/' &&
                  link.path !== '/health' &&
                  link.path !== '/government' &&
                  link.path !== '/jobs' &&
                  link.path !== '/home-services' &&
                  link.path !== '/transport'
              )"
              :key="link.path"
              @click="navigateTo(link.path)"
              :class="[
                'relative px-3 py-2 rounded-lg text-[13px] font-semibold transition-all duration-200 whitespace-nowrap',
                isActive(link.path)
                  ? 'text-[#1677C8]'
                  : 'text-slate-500 hover:text-[#0F2747] hover:bg-slate-50'
              ]"
            >

              {{ link.label }}

              <span
                v-if="isActive(link.path)"
                class="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  bottom-0
                  w-4
                  h-0.5
                  rounded-full
                  bg-[#1677C8]
                "
              />

            </button>

          </div>


          <!-- =========================================
               RIGHT ACTIONS
          ========================================== -->

          <div
            class="
              flex
              items-center
              gap-2
              sm:gap-3
              shrink-0
            "
          >

            <!-- Emergency -->
            <router-link
              to="/emergency"
              class="
                hidden
                lg:flex
                items-center
                gap-2
                rounded-xl
                border
                border-red-200
                bg-red-50
                px-3
                py-2
                text-[11px]
                font-bold
                text-red-600
                transition-all
                hover:border-red-300
                hover:bg-red-100
                hover:-translate-y-0.5
              "
            >

              <div
                class="
                  w-5
                  h-5
                  rounded-md
                  bg-red-100
                  flex
                  items-center
                  justify-center
                "
              >
                <ShieldAlert
                  class="w-3.5 h-3.5 text-red-600"
                />
              </div>

              <span>
                117 / 119
              </span>

            </router-link>


            <!-- Language -->
            <div
              class="
                hidden
                sm:flex
                items-center
                gap-0.5
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-1
              "
            >

              <button
                @click="setLanguage('en')"
                :class="[
                  'px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all',
                  currentLanguage === 'en'
                    ? 'bg-white text-[#123B6D] shadow-sm'
                    : 'text-slate-400 hover:text-slate-700'
                ]"
              >
                EN
              </button>

              <button
                @click="setLanguage('kh')"
                :class="[
                  'px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all',
                  currentLanguage === 'kh'
                    ? 'bg-white text-[#123B6D] shadow-sm font-khmer'
                    : 'text-slate-400 hover:text-slate-700'
                ]"
              >
                KH
              </button>

            </div>


            <!-- Explore -->
            <button
              @click="navigateTo('/health')"
              class="
                hidden
                lg:flex
                items-center
                gap-2
                rounded-xl
                bg-[#1677C8]
                px-4
                py-2.5
                text-[12px]
                font-bold
                text-white
                shadow-[0_5px_15px_rgba(22,119,200,0.18)]
                transition-all
                hover:bg-[#126DB8]
                hover:-translate-y-0.5
                hover:shadow-[0_8px_20px_rgba(22,119,200,0.25)]
              "
            >

              <span>
                {{ t('nav.exploreBtn') }}
              </span>

              <ArrowRight class="w-3.5 h-3.5" />

            </button>


            <!-- Mobile Menu -->
            <button
              @click="toggleMobileMenu"
              class="
                xl:hidden
                w-10
                h-10
                rounded-xl
                border
                border-slate-200
                bg-white
                flex
                items-center
                justify-center
                text-slate-700
                transition-all
                hover:bg-slate-50
                active:scale-95
              "
              :aria-label="
                isMobileMenuOpen
                  ? 'Close navigation'
                  : 'Open navigation'
              "
            >

              <X
                v-if="isMobileMenuOpen"
                class="w-5 h-5 text-[#0F2747]"
              />

              <Menu
                v-else
                class="w-5 h-5 text-[#0F2747]"
              />

            </button>

          </div>

        </div>

      </div>


      <!-- =========================================
           MOBILE MENU
      ========================================== -->

      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >

        <div
          v-if="isMobileMenuOpen"
          class="
            xl:hidden
            border-t
            border-slate-200
            bg-white
            shadow-[0_15px_30px_rgba(15,23,42,0.08)]
          "
        >

          <div
            class="
              max-w-7xl
              mx-auto
              px-4
              sm:px-6
              py-5
            "
          >

            <!-- Mobile navigation -->
            <div class="space-y-1">

              <button
                v-for="link in mainNavLinks"
                :key="link.path"
                @click="navigateTo(link.path)"
                :class="[
                  'w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all',
                  isActive(link.path)
                    ? 'bg-blue-50 text-[#1677C8]'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-[#0F2747]'
                ]"
              >

                <span>
                  {{ link.label }}
                </span>

                <ArrowRight
                  v-if="isActive(link.path)"
                  class="w-4 h-4 text-[#1677C8]"
                />

              </button>

            </div>


            <!-- Mobile actions -->
            <div
              class="
                mt-4
                pt-4
                border-t
                border-slate-100
                space-y-2
              "
            >

              <!-- Emergency -->
              <router-link
                to="/emergency"
                @click="closeMenus"
                class="
                  flex
                  items-center
                  justify-center
                  gap-2
                  w-full
                  rounded-xl
                  border
                  border-red-200
                  bg-red-50
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-red-600
                "
              >

                <ShieldAlert class="w-4 h-4" />

                <span>
                  {{ t('nav.emergency') }}
                  · 117 / 118 / 119
                </span>

              </router-link>


              <!-- Explore -->
              <button
                @click="navigateTo('/health')"
                class="
                  flex
                  items-center
                  justify-center
                  gap-2
                  w-full
                  rounded-xl
                  bg-[#1677C8]
                  px-4
                  py-3
                  text-sm
                  font-bold
                  text-white
                "
              >

                {{ t('nav.exploreBtn') }}

                <ArrowRight class="w-4 h-4" />

              </button>


              <!-- Language -->
              <div
                class="
                  flex
                  items-center
                  justify-center
                  gap-2
                  pt-2
                "
              >

                <button
                  @click="setLanguage('en')"
                  :class="[
                    'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                    currentLanguage === 'en'
                      ? 'bg-[#123B6D] text-white'
                      : 'bg-slate-100 text-slate-500'
                  ]"
                >
                  English
                </button>

                <button
                  @click="setLanguage('kh')"
                  :class="[
                    'px-4 py-2 rounded-lg text-xs font-bold transition-all',
                    currentLanguage === 'kh'
                      ? 'bg-[#123B6D] text-white font-khmer'
                      : 'bg-slate-100 text-slate-500'
                  ]"
                >
                  ខ្មែរ
                </button>

              </div>

            </div>

          </div>

        </div>

      </Transition>

    </nav>

  </header>
</template>
