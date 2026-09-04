<script setup lang="ts">
import { Search, X, CornerDownLeft } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    large?: boolean
    showShortcut?: boolean
  }>(),
  {
    placeholder: 'Search...',
    large: false,
    showShortcut: true
  }
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear': []
  'submit': []
}>()

function clear() {
  emit('update:modelValue', '')
  emit('clear')
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) {
    clear()
  }
}
</script>

<template>
  <div class="relative w-full group">
    <!-- Icon Container with sleek elevation & active tint -->
    <div
      :class="[
        'absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 flex items-center justify-center rounded-xl pointer-events-none transition-all duration-200 z-10',
        large ? 'w-10 h-10' : 'w-8 h-8',
        modelValue
          ? 'bg-[#0D47A1] text-white shadow-xs'
          : 'bg-blue-50/90 dark:bg-slate-700/80 text-[#0D47A1] dark:text-blue-300 group-focus-within:bg-[#0D47A1] group-focus-within:text-white group-focus-within:shadow-xs'
      ]"
    >
      <Search :class="large ? 'w-4.5 h-4.5' : 'w-4 h-4'" />
    </div>

    <!-- Text Input with generous padding guaranteeing no overlap -->
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="emit('submit')"
      @keydown="handleKeyDown"
      :placeholder="placeholder"
      :class="[
        'w-full bg-slate-50/70 dark:bg-slate-900/50 hover:bg-white focus:bg-white dark:hover:bg-slate-900 dark:focus:bg-slate-900 border border-slate-200/90 dark:border-slate-700 rounded-2xl text-[#0F172A] dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15 focus:border-[#0D47A1] dark:focus:border-blue-400 shadow-xs hover:shadow-sm focus:shadow-md transition-all duration-200 font-khmer',
        large
          ? 'py-3.5 pl-14 sm:pl-16 pr-12 text-sm sm:text-base'
          : 'py-2.5 pl-12 pr-10 text-xs sm:text-sm'
      ]"
    />

    <!-- Right Controls: Clear Button or Search Prompt -->
    <div class="absolute right-2.5 sm:right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 z-10">
      <!-- Clear button (X) when query exists -->
      <button
        v-if="modelValue"
        @click="clear"
        class="inline-flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
        aria-label="Clear search"
        type="button"
        title="Clear search (Esc)"
      >
        <X class="w-4 h-4" />
      </button>

      <!-- Enter badge hint -->
      <div
        v-else-if="large && showShortcut"
        class="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-semibold text-slate-400 bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-2xs pointer-events-none"
      >
        <CornerDownLeft class="w-2.5 h-2.5" />
        <span>Enter</span>
      </div>
    </div>
  </div>
</template>
