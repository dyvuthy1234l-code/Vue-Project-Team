<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  badge?: string
}>()
</script>

<template>
  <div class="mb-8">
    <div
      v-if="badge"
      class="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 rounded-full text-xs font-bold mb-3 border border-blue-200/80 dark:border-blue-900/60"
    >
      <span class="w-1.5 h-1.5 rounded-full bg-[#0D47A1] dark:bg-blue-400" />
      <span>{{ badge }}</span>
    </div>
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0A2540] dark:text-white tracking-tight leading-tight">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mt-2 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-3xl">
      {{ subtitle }}
    </p>
  </div>
</template>
