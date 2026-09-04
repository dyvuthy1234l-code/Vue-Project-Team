<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import {
  SlidersHorizontal,
  Eye,
  ZapOff,
  Check,
  ChevronDown
} from 'lucide-vue-next'
import { useAccessibility } from '@/composables/useAccessibility'
import { useLanguage } from '@/composables/useLanguage'

const { fontSize, isHighContrast, isReducedMotion, setFontSize, toggleHighContrast, toggleReducedMotion } = useAccessibility()
const { currentLanguage, setLanguage } = useLanguage()

const isOpen = ref(false)

function onWindowClick(e: MouseEvent) {
  const target = e.target as HTMLElement
  if (!target.closest('.accessibility-container')) {
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
  <div class="relative accessibility-container">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
      type="button"
      :aria-label="currentLanguage === 'kh' ? 'ការកំណត់ភាពងាយស្រួល' : 'Accessibility Settings'"
      :title="currentLanguage === 'kh' ? 'ការកំណត់ភាពងាយស្រួល (ទំហំអក្សរ & កម្រិតពណ៌)' : 'Accessibility Settings (Font size & Contrast)'"
    >
      <SlidersHorizontal class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
      <span class="hidden md:inline">{{ currentLanguage === 'kh' ? 'ភាពងាយស្រួល' : 'Accessibility' }}</span>
      <span class="md:hidden text-[11px] font-bold">A±</span>
      <ChevronDown class="w-3 h-3 text-slate-400" />
    </button>

    <!-- Dropdown Modal -->
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
        class="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1E293B] rounded-2xl shadow-dropdown border border-slate-200/90 dark:border-slate-700 p-4 z-50 animate-fadeIn space-y-4"
      >
        <!-- Header -->
        <div class="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-700">
          <div class="flex items-center gap-2">
            <SlidersHorizontal class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
            <span class="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">
              {{ currentLanguage === 'kh' ? 'ការកំណត់ភាពងាយស្រួល' : 'Accessibility Menu' }}
            </span>
          </div>
          <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#0D47A1] dark:bg-blue-950/60 dark:text-blue-300">
            A11y
          </span>
        </div>

        <!-- Font Size Scaling -->
        <div class="space-y-2">
          <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{{ currentLanguage === 'kh' ? 'ទំហំអក្សរ (Font Size)' : 'Text Size' }}</span>
            <span class="text-[10px] font-mono text-[#0D47A1] dark:text-blue-400 font-bold uppercase">{{ fontSize }}</span>
          </label>
          <div class="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700">
            <button
              @click="setFontSize('sm')"
              :class="[
                'py-1.5 rounded-lg text-xs font-bold transition-all',
                fontSize === 'sm'
                  ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-blue-300 shadow-xs ring-1 ring-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              ]"
              type="button"
            >
              A- <span class="text-[10px] font-normal">តូច</span>
            </button>
            <button
              @click="setFontSize('md')"
              :class="[
                'py-1.5 rounded-lg text-xs font-bold transition-all',
                fontSize === 'md'
                  ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-blue-300 shadow-xs ring-1 ring-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              ]"
              type="button"
            >
              A <span class="text-[10px] font-normal">ស្តង់ដារ</span>
            </button>
            <button
              @click="setFontSize('lg')"
              :class="[
                'py-1.5 rounded-lg text-xs font-bold transition-all',
                fontSize === 'lg'
                  ? 'bg-white dark:bg-slate-700 text-[#0D47A1] dark:text-blue-300 shadow-xs ring-1 ring-blue-500/20'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              ]"
              type="button"
            >
              A+ <span class="text-[10px] font-normal">ធំ</span>
            </button>
          </div>
        </div>

        <!-- High Contrast Mode Toggle -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-700 space-y-2">
          <button
            @click="toggleHighContrast"
            :class="[
              'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all',
              isHighContrast
                ? 'border-[#0D47A1] bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <div class="flex items-center gap-2.5">
              <Eye class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
              <span>{{ currentLanguage === 'kh' ? 'កម្រិតពណ៌ច្បាស់ (High Contrast)' : 'High Contrast' }}</span>
            </div>
            <div :class="['w-4 h-4 rounded border flex items-center justify-center', isHighContrast ? 'bg-[#0D47A1] border-[#0D47A1] text-white' : 'border-slate-300 dark:border-slate-600']">
              <Check v-if="isHighContrast" class="w-3 h-3" />
            </div>
          </button>
        </div>

        <!-- Reduced Motion Toggle -->
        <div>
          <button
            @click="toggleReducedMotion"
            :class="[
              'w-full flex items-center justify-between p-2.5 rounded-xl border text-xs font-bold transition-all',
              isReducedMotion
                ? 'border-[#0D47A1] bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-300'
                : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
            ]"
            type="button"
          >
            <div class="flex items-center gap-2.5">
              <ZapOff class="w-4 h-4 text-slate-500 dark:text-slate-400" />
              <span>{{ currentLanguage === 'kh' ? 'កាត់បន្ថយចលនា (Reduce Motion)' : 'Reduce Motion' }}</span>
            </div>
            <div :class="['w-4 h-4 rounded border flex items-center justify-center', isReducedMotion ? 'bg-[#0D47A1] border-[#0D47A1] text-white' : 'border-slate-300 dark:border-slate-600']">
              <Check v-if="isReducedMotion" class="w-3 h-3" />
            </div>
          </button>
        </div>

        <!-- Language Quick Switcher -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-700">
          <label class="text-[11px] font-bold text-slate-500 dark:text-slate-400 block mb-1.5">
            {{ currentLanguage === 'kh' ? 'ភាសា (Language)' : 'Language' }}
          </label>
          <div class="grid grid-cols-2 gap-2">
            <button
              @click="setLanguage('kh')"
              :class="[
                'py-2 px-3 rounded-xl text-xs font-bold font-khmer flex items-center justify-center gap-1.5 border transition-all',
                currentLanguage === 'kh'
                  ? 'border-[#0D47A1] bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              ]"
              type="button"
            >
              <span>🇰🇭</span>
              <span>ភាសាខ្មែរ</span>
            </button>
            <button
              @click="setLanguage('en')"
              :class="[
                'py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all',
                currentLanguage === 'en'
                  ? 'border-[#0D47A1] bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              ]"
              type="button"
            >
              <span>🇬🇧</span>
              <span>English</span>
            </button>
          </div>
        </div>

      </div>
    </Transition>
  </div>
</template>
