<script setup lang="ts">
import { type Component } from 'vue'

export interface CategoryItem {
  value: string
  label: string
  labelKh?: string
  icon?: Component
  activeClass?: string
  badge?: number | string
}

defineProps<{
  categories: CategoryItem[]
  activeCategory: string
}>()

const emit = defineEmits<{
  select: [category: string]
}>()
</script>

<template>
  <div class="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none scroll-smooth">
    <button
      v-for="cat in categories"
      :key="cat.value"
      @click="emit('select', cat.value)"
      :class="[
        'inline-flex items-center gap-2 px-4 py-2 rounded-xl sm:rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap focus:outline-none shrink-0 cursor-pointer select-none font-khmer',
        activeCategory === cat.value
          ? 'bg-gradient-to-r from-[#0D47A1] to-[#1976D2] text-white shadow-md shadow-blue-900/25 ring-2 ring-blue-500/20 scale-[1.02]'
          : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/90 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500/50 hover:text-[#0D47A1] dark:hover:text-blue-300 hover:bg-blue-50/50 dark:hover:bg-slate-700/50 shadow-2xs hover:shadow-xs'
      ]"
      type="button"
    >
      <component
        :is="cat.icon"
        v-if="cat.icon"
        class="w-3.5 h-3.5 shrink-0 transition-transform group-hover:scale-110"
        :class="activeCategory === cat.value ? 'text-white' : 'text-slate-400 group-hover:text-[#0D47A1]'"
      />
      <span>{{ cat.label }}</span>
      <span
        v-if="cat.badge !== undefined"
        :class="[
          'px-2 py-0.5 rounded-full text-[10px] font-black',
          activeCategory === cat.value
            ? 'bg-white/25 text-white backdrop-blur-xs'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        ]"
      >
        {{ cat.badge }}
      </span>
    </button>
  </div>
</template>
