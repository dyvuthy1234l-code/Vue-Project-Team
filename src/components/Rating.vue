<script setup lang="ts">
import { Star } from 'lucide-vue-next'

defineProps<{
  rating: number
  reviews?: number
  showCount?: boolean
}>()
</script>

<template>
  <div class="flex items-center space-x-1.5">
    <div class="flex items-center space-x-0.5">
      <Star
        v-for="i in 5"
        :key="i"
        :class="[
          'w-3.5 h-3.5',
          i <= Math.round(rating)
            ? 'text-amber-400 fill-amber-400'
            : 'text-slate-200'
        ]"
      />
    </div>
    <span class="text-xs font-bold text-slate-700">{{ rating.toFixed(1) }}</span>
    <span v-if="showCount && reviews" class="text-xs text-slate-400">({{ reviews }})</span>
  </div>
</template>
