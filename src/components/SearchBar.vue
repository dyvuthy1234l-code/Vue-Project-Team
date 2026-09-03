<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

defineProps<{
  modelValue: string
  placeholder?: string
  large?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear': []
  'submit': []
}>()

function clear() {
  emit('update:modelValue', '')
  emit('clear')
}
</script>

<template>
  <div class="relative w-full group">
    <!-- Search Icon -->
    <Search
      :class="[
        'absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0D47A1] dark:group-focus-within:text-blue-400 pointer-events-none transition-colors duration-150',
        large ? 'w-5 h-5' : 'w-4 h-4'
      ]"
    />

    <!-- Text Input -->
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      @keydown.enter="emit('submit')"
      :placeholder="placeholder || 'Search...'"
      :class="[
        'w-full pl-10.5 pr-10 bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 rounded-xl text-[#0F172A] dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] dark:focus:border-blue-400 shadow-xs transition-all duration-150',
        large ? 'py-3 text-base' : 'py-2.5 text-xs sm:text-sm'
      ]"
    />

    <!-- Clear Button -->
    <button
      v-if="modelValue"
      @click="clear"
      class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      aria-label="Clear search"
      type="button"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
