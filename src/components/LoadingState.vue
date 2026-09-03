<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center space-y-4">
    <div class="relative w-12 h-12">
      <div class="w-12 h-12 rounded-full border-3 border-blue-100 dark:border-blue-950 border-t-[#0D47A1] dark:border-t-blue-400 animate-spin" />
    </div>
    <p class="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">
      {{ message || t('common.loading') }}
    </p>
  </div>
</template>
