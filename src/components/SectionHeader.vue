<script setup lang="ts">
defineProps<{
  title: string
  subtitle?: string
  badge?: string
}>()
</script>

<template>
  <div class="mb-8">
    <div v-if="badge" class="inline-flex items-center space-x-1.5 px-3 py-1 bg-camlife-light text-camlife-action rounded-full text-xs font-bold mb-3 border border-camlife-action/20">
      <span>{{ badge }}</span>
    </div>
    <h1 class="text-2xl sm:text-3xl md:text-4xl font-extrabold text-camlife-navy tracking-tight leading-tight">
      {{ title }}
    </h1>
    <p v-if="subtitle" class="mt-2 text-base text-camlife-muted leading-relaxed max-w-3xl">
      {{ subtitle }}
    </p>
  </div>
</template>
