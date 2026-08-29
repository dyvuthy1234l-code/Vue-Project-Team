<script setup lang="ts">
import { Search, X } from 'lucide-vue-next'

defineProps<{
  modelValue: string
  placeholder?: string
  large?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function clear() {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative w-full">
    <Search
      :class="[
        'absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none transition-colors group-focus-within:text-camlife-action',
        large ? 'w-5 h-5' : 'w-4 h-4'
      ]"
    />
    <input
      type="text"
      :value="modelValue"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      :placeholder="placeholder || 'Search...'"
      :class="[
        'w-full pl-11 pr-10 border border-slate-200 bg-white rounded-xl text-camlife-navy placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-camlife-action/30 focus:border-camlife-action shadow-subtle transition-all duration-200',
        large ? 'py-3.5 text-base' : 'py-2.5 text-sm'
      ]"
    />
    <button
      v-if="modelValue"
      @click="clear"
      class="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
      aria-label="Clear search"
      type="button"
    >
      <X class="w-4 h-4" />
    </button>
  </div>
</template>
