<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { MapPin, ChevronDown, Check, Search } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

export interface StationOption {
  provinceId: string
  name: string
  nameKh: string
  code: string
  terminalName: string
  terminalNameKh: string
  address?: string
  addressKh?: string
  distanceKm?: number
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    terminals: StationOption[]
    type?: 'origin' | 'destination'
    label?: string
    isClosest?: boolean
  }>(),
  {
    type: 'origin',
    label: '',
    isClosest: false
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', val: string): void
  (e: 'change', terminal: StationOption): void
}>()

const { currentLanguage } = useLanguage()

const isOpen = ref(false)
const searchQuery = ref('')
const containerRef = ref<HTMLElement | null>(null)

const selectedTerminal = computed(() => {
  return props.terminals.find(t => t.provinceId === props.modelValue) || props.terminals[0]
})

const filteredTerminals = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return props.terminals

  return props.terminals.filter(t => {
    const nameMatch = t.name.toLowerCase().includes(query)
    const nameKhMatch = t.nameKh.toLowerCase().includes(query)
    const codeMatch = t.code.toLowerCase().includes(query)
    const termMatch = t.terminalName.toLowerCase().includes(query)
    const termKhMatch = t.terminalNameKh.toLowerCase().includes(query)
    return nameMatch || nameKhMatch || codeMatch || termMatch || termKhMatch
  })
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

function selectTerminal(terminal: StationOption) {
  emit('update:modelValue', terminal.provinceId)
  emit('change', terminal)
  isOpen.value = false
  searchQuery.value = ''
}

function handleClickOutside(e: MouseEvent) {
  if (containerRef.value && !containerRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="containerRef" class="relative font-khmer w-full">
    <!-- Header Label & Badges -->
    <div v-if="label" class="flex items-center justify-between mb-1.5">
      <label class="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
        <span
          class="w-2 h-2 rounded-full"
          :class="type === 'origin' ? 'bg-emerald-500 ring-2 ring-emerald-400/20' : 'bg-rose-500 ring-2 ring-rose-400/20'"
        />
        <span>{{ label }}</span>
      </label>

      <!-- Closest / 25 Provinces Tag -->
      <span
        v-if="type === 'origin' && isClosest"
        class="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20"
      >
        <Check class="w-3 h-3" />
        <span>{{ currentLanguage === 'kh' ? 'ស្ថានីយជិតអ្នកបំផុត' : 'Closest Station' }}</span>
      </span>
      <span
        v-else
        class="text-[10px] font-bold text-slate-400 dark:text-slate-500"
      >
        {{ currentLanguage === 'kh' ? '២៥ រាជធានី-ខេត្ត' : '25 Provinces' }}
      </span>
    </div>

    <!-- Custom Select Trigger Button -->
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'w-full p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-between gap-3 select-none',
        isOpen
          ? type === 'origin'
            ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-white dark:bg-slate-800'
            : 'border-rose-500 ring-2 ring-rose-500/20 bg-white dark:bg-slate-800'
          : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 hover:bg-white dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-600'
      ]"
      :aria-expanded="isOpen"
    >
      <div class="flex items-center gap-3 min-w-0 flex-1">
        <!-- Station Icon with Distinct Color -->
        <div
          :class="[
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200',
            type === 'origin'
              ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60'
              : 'bg-rose-100/80 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60'
          ]"
        >
          <MapPin class="w-5 h-5" />
        </div>

        <!-- Province & Station Details -->
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2 flex-wrap">
            <!-- Province Name -->
            <span class="text-sm font-black text-[#0A2540] dark:text-white truncate">
              {{ currentLanguage === 'kh' ? selectedTerminal?.nameKh : selectedTerminal?.name }}
            </span>

            <!-- Proximity Distance Badge -->
            <span
              v-if="selectedTerminal?.distanceKm !== undefined"
              class="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200/80 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              {{ selectedTerminal.distanceKm === 0 ? (currentLanguage === 'kh' ? 'ទីតាំងអ្នក' : 'Your Location') : `~${selectedTerminal.distanceKm} km` }}
            </span>
          </div>

          <!-- Station Subtitle -->
          <p class="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5 font-medium">
            {{ currentLanguage === 'kh' ? selectedTerminal?.terminalNameKh : selectedTerminal?.terminalName }}
          </p>
        </div>
      </div>

      <!-- Arrow Indicator -->
      <div class="flex items-center pl-2 shrink-0 text-slate-400">
        <ChevronDown
          class="w-4 h-4 transition-transform duration-200"
          :class="isOpen ? 'rotate-180 text-[#0D47A1] dark:text-blue-400' : ''"
        />
      </div>
    </button>

    <!-- Custom Dropdown Popover List -->
    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-98"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-98"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 z-50 p-2.5 overflow-hidden animate-fadeIn"
      >
        <!-- Search Input Bar -->
        <div class="relative mb-2">
          <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកខេត្ត ឬស្ថានីយ...' : 'Search province or station...'"
            class="w-full pl-9 pr-8 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            autofocus
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1 cursor-pointer"
            type="button"
          >
            ✕
          </button>
        </div>

        <!-- Terminal Options Scrollable List -->
        <div class="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
          <button
            v-for="terminal in filteredTerminals"
            :key="type + '-' + terminal.provinceId"
            type="button"
            @click="selectTerminal(terminal)"
            :class="[
              'w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer',
              terminal.provinceId === modelValue
                ? type === 'origin'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-100 font-bold shadow-2xs'
                  : 'bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-950 dark:text-rose-100 font-bold shadow-2xs'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100/90 dark:hover:bg-slate-800/80 border border-transparent'
            ]"
          >
            <div class="flex items-center gap-2.5 min-w-0 flex-1">
              <span
                :class="[
                  'w-2 h-2 rounded-full shrink-0',
                  terminal.provinceId === modelValue
                    ? type === 'origin'
                      ? 'bg-emerald-500 ring-2 ring-emerald-400/30'
                      : 'bg-rose-500 ring-2 ring-rose-400/30'
                    : 'bg-slate-300 dark:bg-slate-600'
                ]"
              />

              <!-- Province & Terminal Labels -->
              <div class="min-w-0 flex-1">
                <div class="text-xs font-black truncate">
                  {{ currentLanguage === 'kh' ? terminal.nameKh : terminal.name }}
                </div>
                <div class="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {{ currentLanguage === 'kh' ? terminal.terminalNameKh : terminal.terminalName }}
                </div>
              </div>
            </div>

            <!-- Right info: Distance & Selected Indicator -->
            <div class="flex items-center gap-2 shrink-0 pl-2">
              <span
                v-if="terminal.distanceKm !== undefined"
                class="text-[10px] font-medium text-slate-400 dark:text-slate-500"
              >
                {{ terminal.distanceKm === 0 ? (currentLanguage === 'kh' ? 'ទីតាំងអ្នក' : 'You') : `~${terminal.distanceKm} km` }}
              </span>
              <div
                v-if="terminal.provinceId === modelValue"
                :class="[
                  'w-5 h-5 rounded-full flex items-center justify-center',
                  type === 'origin' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                ]"
              >
                <Check class="w-3.5 h-3.5" />
              </div>
            </div>
          </button>

          <!-- Empty Search State -->
          <div
            v-if="filteredTerminals.length === 0"
            class="py-6 text-center text-xs text-slate-400 dark:text-slate-500"
          >
            {{ currentLanguage === 'kh' ? 'រកមិនឃើញស្ថានីយ ឬខេត្តនេះទេ' : 'No station found' }}
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
