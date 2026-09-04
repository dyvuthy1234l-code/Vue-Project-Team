<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ChevronDown, Check, Search, Globe } from 'lucide-vue-next'
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
  if (!target.closest('.location-selector-container')) {
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
        'flex items-center gap-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer select-none',
        variant === 'banner'
          ? 'px-3.5 py-2 bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-xs'
          : variant === 'pill'
            ? 'px-3 py-1.5 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900'
            : 'px-2.5 sm:px-3 py-1.5 border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
      ]"
      type="button"
      :aria-label="currentLanguage === 'kh' ? 'ជ្រើសរើសរាជធានី-ខេត្ត' : 'Select Location'"
    >
      <div
        :class="[
          'flex items-center justify-center rounded-lg p-1',
          variant === 'banner' ? 'bg-emerald-400/20 text-emerald-300' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'
        ]"
      >
        <MapPin class="w-3.5 h-3.5 shrink-0" />
      </div>

      <div class="flex items-center gap-1.5 text-left">
        <span class="max-w-[120px] sm:max-w-[150px] truncate font-extrabold">
          {{ currentLanguage === 'kh' ? selectedProvince.nameKh : selectedProvince.name }}
        </span>
        <span
          :class="[
            'text-[10px] px-1.5 py-0.5 rounded-md font-black',
            variant === 'banner' ? 'bg-white/20 text-white/90' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
          ]"
        >
          {{ currentLanguage === 'kh' ? '២៥ ខេត្ត-ក្រុង' : '25 Prov.' }}
        </span>
      </div>

      <ChevronDown
        :class="[
          'w-3.5 h-3.5 transition-transform duration-200',
          isOpen ? 'rotate-180' : '',
          variant === 'banner' ? 'text-white/70' : 'text-slate-400'
        ]"
      />
    </button>

    <!-- Dropdown Modal / Popover -->
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
        class="absolute right-0 mt-2 w-72 sm:w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-3 z-50 animate-fadeIn"
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
  </div>
</template>
