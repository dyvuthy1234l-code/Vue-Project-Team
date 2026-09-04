<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    src: string
    alt: string
    imgClass?: string
    fallbackSrc?: string
  }>(),
  {
    fallbackSrc: '/images/pillars/government.jpg'
  }
)

const imgRef = ref<HTMLImageElement | null>(null)
const isLoaded = ref(false)
const hasError = ref(false)
const currentSrc = ref(props.src)

watch(() => props.src, (newSrc) => {
  currentSrc.value = newSrc
  hasError.value = false
  isLoaded.value = false
})

onMounted(() => {
  if (imgRef.value?.complete) {
    if (imgRef.value.naturalWidth > 0) {
      isLoaded.value = true
    }
  }
})

function onLoad() {
  isLoaded.value = true
  hasError.value = false
}

function onError() {
  if (props.fallbackSrc && currentSrc.value !== props.fallbackSrc) {
    currentSrc.value = props.fallbackSrc
    hasError.value = false
  } else {
    hasError.value = true
    isLoaded.value = true
  }
}
</script>

<template>
  <div class="relative overflow-hidden bg-slate-100 dark:bg-slate-700">
    <!-- Image -->
    <img
      ref="imgRef"
      :src="currentSrc"
      :alt="alt"
      loading="lazy"
      :class="[
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0',
        imgClass
      ]"
      @load="onLoad"
      @error="onError"
    />

    <!-- Placeholder skeleton while loading -->
    <div
      v-if="!isLoaded && !hasError"
      class="absolute inset-0 bg-slate-200 dark:bg-slate-700 animate-pulse pointer-events-none"
    />

    <!-- Error state -->
    <div
      v-if="hasError"
      class="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
    >
      <span class="text-xs font-medium">Image unavailable</span>
    </div>
  </div>
</template>
