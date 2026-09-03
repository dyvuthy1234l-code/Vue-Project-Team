<script setup lang="ts">
import { AlertCircle, RotateCcw } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  message?: string
}>()

const emit = defineEmits<{
  retry: []
}>()
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center max-w-sm mx-auto p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-4">
    <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#E53935] flex items-center justify-center">
      <AlertCircle class="w-7 h-7" />
    </div>

    <div class="space-y-1">
      <h3 class="font-bold text-base text-[#0A2540] dark:text-white">Something went wrong</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
        {{ message || t('common.error') }}
      </p>
    </div>

    <button
      @click="emit('retry')"
      class="px-5 py-2.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
      type="button"
    >
      <RotateCcw class="w-3.5 h-3.5" />
      <span>{{ t('common.retry') }}</span>
    </button>
  </div>
</template>
