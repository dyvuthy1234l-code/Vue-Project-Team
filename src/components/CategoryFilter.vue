<script setup lang="ts">
defineProps<{
  categories: { value: string; label: string }[]
  activeCategory: string
}>()

const emit = defineEmits<{
  select: [category: string]
}>()
</script>

<template>
  <div class="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
    <button
      v-for="cat in categories"
      :key="cat.value"
      @click="emit('select', cat.value)"
      :class="[
        'px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 whitespace-nowrap focus:outline-none',
        activeCategory === cat.value
          ? 'bg-camlife-action text-white shadow-sm scale-[1.02]'
          : 'bg-white text-slate-600 border border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
      ]"
    >
      {{ cat.label }}
    </button>
  </div>
</template>
