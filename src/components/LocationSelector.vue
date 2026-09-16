<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ChevronDown, Check, Search, Globe, X } from 'lucide-vue-next'
import { useLocation } from '@/composables/useLocation'
import { useLanguage } from '@/composables/useLanguage'

withDefaults(
  defineProps<{
    variant?: 'default' | 'banner' | 'pill'
    showAllOption?: boolean
  }>(),
  {
    variant: 'default',
    showAllOption: false
  }
)

const { provinces, currentProvinceId, selectedProvince, setProvince } = useLocation()
const { currentLanguage } = useLanguage()

const isOpen = ref(false)
const searchFilter = ref('')

const filteredProvinces = computed(() => {
  const query = searchFilter.value.toLowerCase().trim()
  if (!query) return provinces
  return provinces.filter(p =>
    p.name.toLowerCase().includes(query) ||
    p.nameKh.toLowerCase().includes(query) ||
    p.code.toLowerCase().includes(query)
  )
})

function handleSelect(id: string) {
  setProvince(id)
  isOpen.value = false
  searchFilter.value = ''
}

function onWindowClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.location-selector-container') && !target.closest('.location-bottom-sheet')) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', onWindowClick)
})

onUnmounted(() => {
  window.removeEventListener('click', onWindowClick)
})
</script>

<template>
  <div class="relative location-selector-container font-khmer">
    <!-- Trigger Button -->
    <button
      @click="isOpen = !isOpen"
      :class="[
        'w-full flex items-center justify-between gap-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none',
        variant === 'banner'
          ? 'px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-xs'
          : variant === 'pill'
            ? 'px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900'
            : 'px-2.5 sm:px-3 py-2 sm:py-1.5 border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs'
      ]"
      type="button"
      :aria-label="currentLanguage === 'kh' ? 'ជ្រើសរើសរាជធានី-ខេត្ត' : 'Select Location'"
    >
      <div class="flex items-center gap-2 min-w-0">
        <div
          :class="[
            'flex items-center justify-center rounded-lg p-1 shrink-0',
            variant === 'banner' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
          ]"
        >
          <MapPin class="w-3.5 h-3.5 shrink-0" />
        </div>

        <div class="flex items-center gap-1.5 text-left truncate">
          <span class="truncate font-extrabold text-xs">
            {{ currentProvinceId === 'all' ? (currentLanguage === 'kh' ? 'ទូទាំងប្រទេស' : 'All Cambodia') : (currentLanguage === 'kh' ? selectedProvince.nameKh : selectedProvince.name) }}
          </span>
          <span
            :class="[
              'text-[10px] px-1.5 py-0.5 rounded-md font-black shrink-0 hidden xs:inline-block',
              variant === 'banner' ? 'bg-white/20 text-white/90' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
            ]"
          >
            {{ currentLanguage === 'kh' ? '២៥ ខេត្ត' : '25 Prov.' }}
          </span>
        </div>
      </div>

      <ChevronDown
        :class="[
          'w-3.5 h-3.5 transition-transform duration-200 shrink-0',
          isOpen ? 'rotate-180' : '',
          variant === 'banner' ? 'text-white/70' : 'text-slate-400'
        ]"
      />
    </button>

    <!-- 1. DESKTOP POPOVER (SM & ABOVE) -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="hidden sm:block absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-3 z-50 animate-fadeIn"
      >
        <!-- Header -->
        <div class="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <div class="flex items-center gap-1.5">
            <Globe class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
            <span class="text-xs font-black text-slate-800 dark:text-white">
              {{ currentLanguage === 'kh' ? 'ជ្រើសរើសរាជធានី-ខេត្ត (២៥)' : 'Select Province (25)' }}
            </span>
          </div>
          <span class="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
            {{ currentLanguage === 'kh' ? 'ទូទាំងកម្ពុជា' : 'Nationwide' }}
          </span>
        </div>

        <!-- Search input within dropdown -->
        <div class="relative mt-2 mb-2">
          <Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            v-model="searchFilter"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'វាយស្វែងរកខេត្តក្រុង...' : 'Search province...'"
            class="w-full pl-8 pr-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1]"
          />
        </div>

        <!-- Option: All Cambodia (ទូទាំងប្រទេស) -->
        <div class="mb-1.5 pb-1.5 border-b border-slate-100 dark:border-slate-800">
          <button
            @click="handleSelect('all')"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all text-left cursor-pointer',
              currentProvinceId === 'all'
                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-black shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <Globe class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span class="truncate font-black">{{ currentLanguage === 'kh' ? 'ទូទាំងប្រទេស (គ្រប់រាជធានី-ខេត្ត)' : 'All Cambodia (Nationwide)' }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] text-emerald-600 font-bold uppercase font-mono">ALL</span>
              <Check v-if="currentProvinceId === 'all'" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
            </div>
          </button>
        </div>

        <!-- 25 Provinces Scrollable List -->
        <div class="max-h-64 overflow-y-auto space-y-0.5 pr-1 custom-scrollbar">
          <button
            v-for="prov in filteredProvinces"
            :key="prov.id"
            @click="handleSelect(prov.id)"
            :class="[
              'w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer',
              currentProvinceId === prov.id
                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-black shadow-xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/80 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <div class="flex items-center gap-2.5 min-w-0">
              <span
                :class="[
                  'w-2 h-2 rounded-full shrink-0',
                  currentProvinceId === prov.id ? 'bg-[#0D47A1] dark:bg-blue-400 ring-2 ring-blue-400/30' : 'bg-slate-300 dark:bg-slate-600'
                ]"
              />
              <span class="truncate">{{ currentLanguage === 'kh' ? prov.nameKh : prov.name }}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-[10px] text-slate-400 uppercase font-mono">{{ prov.code }}</span>
              <Check v-if="currentProvinceId === prov.id" class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
            </div>
          </button>

          <div v-if="filteredProvinces.length === 0" class="py-4 text-center text-xs text-slate-400">
            {{ currentLanguage === 'kh' ? 'រកមិនឃើញខេត្តក្រុងនេះទេ' : 'No province found' }}
          </div>
        </div>
      </div>
    </Transition>

    <!-- 2. MOBILE BOTTOM SHEET DIALOG (TELEPORTED TO BODY FOR FLAWLESS MOBILE UX) -->
    <Teleport to="body">
      <div v-if="isOpen" class="sm:hidden location-bottom-sheet">
        <!-- Backdrop -->
        <div
          class="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[100] transition-opacity animate-in fade-in duration-200"
          @click="isOpen = false"
        />

        <!-- Bottom Sheet Card -->
        <div
          class="fixed bottom-0 inset-x-0 z-[101] max-h-[85vh] bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl flex flex-col p-4 pb-7 font-khmer border-t border-slate-200/90 dark:border-slate-800 animate-in slide-in-from-bottom duration-200"
        >
          <!-- Drag Indicator -->
          <div class="w-12 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-3 shrink-0" />

          <!-- Header -->
          <div class="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center shrink-0">
                <MapPin class="w-4 h-4" />
              </div>
              <div>
                <h4 class="text-sm font-black text-slate-900 dark:text-white leading-tight">
                  {{ currentLanguage === 'kh' ? 'ជ្រើសរើសរាជធានី-ខេត្ត (២៥)' : 'Select Province (25)' }}
                </h4>
                <p class="text-[10px] text-slate-400">
                  {{ currentLanguage === 'kh' ? 'ជ្រើសរើសដើម្បីមើលសេវាក្បែរអ្នក' : 'Choose a province for local public services' }}
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="isOpen = false"
              class="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X class="w-4 h-4" />
            </button>
          </div>

          <!-- Search Input -->
          <div class="relative mt-3 mb-2.5 shrink-0">
            <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              v-model="searchFilter"
              type="text"
              :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកឈ្មោះខេត្ត-ក្រុង ឬកូដ...' : 'Search province name or code...'"
              class="w-full pl-9 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] font-khmer"
            />
          </div>

          <!-- Option: Nationwide -->
          <div class="mb-2 pb-2 border-b border-slate-100 dark:border-slate-800 shrink-0">
            <button
              @click="handleSelect('all')"
              :class="[
                'w-full flex items-center justify-between p-3 rounded-2xl text-xs font-bold transition-all text-left cursor-pointer',
                currentProvinceId === 'all'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-black ring-1 ring-blue-500/20'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              ]"
              type="button"
            >
              <div class="flex items-center gap-2.5">
                <Globe class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span class="font-black">{{ currentLanguage === 'kh' ? 'ទូទាំងប្រទេស (គ្រប់រាជធានី-ខេត្ត)' : 'All Cambodia (Nationwide)' }}</span>
              </div>
              <span class="text-[10px] text-emerald-600 font-bold uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60">ALL</span>
            </button>
          </div>

          <!-- Scrollable Province Items -->
          <div class="flex-1 min-h-0 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            <button
              v-for="prov in filteredProvinces"
              :key="prov.id"
              @click="handleSelect(prov.id)"
              :class="[
                'w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-left cursor-pointer',
                currentProvinceId === prov.id
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-black ring-1 ring-blue-500/20'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              ]"
              type="button"
            >
              <div class="flex items-center gap-3">
                <span
                  :class="[
                    'w-2.5 h-2.5 rounded-full shrink-0',
                    currentProvinceId === prov.id ? 'bg-[#0D47A1] dark:bg-blue-400 ring-4 ring-blue-400/20' : 'bg-slate-300 dark:bg-slate-600'
                  ]"
                />
                <span>{{ currentLanguage === 'kh' ? prov.nameKh : prov.name }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="text-[11px] text-slate-400 font-mono">{{ prov.code }}</span>
                <Check v-if="currentProvinceId === prov.id" class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
              </div>
            </button>

            <div v-if="filteredProvinces.length === 0" class="py-8 text-center text-xs text-slate-400">
              {{ currentLanguage === 'kh' ? 'រកមិនឃើញខេត្តក្រុងដែលបានស្វែងរកទេ' : 'No matching province found' }}
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
