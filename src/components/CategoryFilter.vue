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
  <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 scrollbar-none">
    <button
      v-for="cat in categories"
      :key="cat.value"
      @click="emit('select', cat.value)"
      :class="[
        'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap focus:outline-none border shadow-xs shrink-0',
        activeCategory === cat.value
          ? 'bg-[#0D47A1] text-white border-[#0D47A1] shadow-xs'
          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200/90 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
      ]"
      type="button"
    >
      <component
        :is="cat.icon"
        v-if="cat.icon"
        class="w-3.5 h-3.5 shrink-0"
        :class="activeCategory === cat.value ? 'text-white' : 'text-slate-400'"
      />
      <span>{{ cat.label }}</span>
      <span
        v-if="cat.badge !== undefined"
        :class="[
          'px-1.5 py-0.2 rounded-md text-[10px] font-black',
          activeCategory === cat.value
            ? 'bg-white/20 text-white'
            : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
        ]"
      >
        {{ cat.badge }}
      </span>
    </button>
  </div>
</template>
