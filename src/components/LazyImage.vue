<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  src: string
  alt: string
  imgClass?: string
}>()

const isLoaded = ref(false)
const hasError = ref(false)

function onLoad() {
  isLoaded.value = true
}

function onError() {
  hasError.value = true
  isLoaded.value = true
}
</script>

<template>
  <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-700">
    <!-- Placeholder -->
    <div
      v-if="!isLoaded"
      class="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse"
    />

    <!-- Error state -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
    >
      <span class="text-xs font-medium">Image unavailable</span>
    </div>

    <!-- Image -->
    <img
      :src="src"
      :alt="alt"
      loading="lazy"
      :class="[
        'transition-opacity duration-500',
        isLoaded && !hasError ? 'opacity-100' : 'opacity-0',
        imgClass
      ]"
      @load="onLoad"
      @error="onError"
    />
  </div>
</template>
