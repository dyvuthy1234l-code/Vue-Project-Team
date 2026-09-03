<script setup lang="ts">
import { SearchX, RotateCcw } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  message?: string
  subtitle?: string
}>()

const emit = defineEmits<{
  reset: []
}>()
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 sm:p-12 text-center shadow-sm my-6 max-w-md mx-auto flex flex-col items-center space-y-4">
    <div class="w-16 h-16 bg-blue-50 dark:bg-blue-950/50 rounded-2xl flex items-center justify-center text-[#0D47A1] dark:text-blue-400 shadow-xs">
      <SearchX class="w-8 h-8" />
    </div>

    <div class="space-y-1">
      <h3 class="font-bold text-[#0A2540] dark:text-white text-base sm:text-lg">
        {{ message || t('common.noResults') }}
      </h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
        {{ subtitle || 'We couldn\'t find any matching records. Try searching with different keywords or resetting your active filters.' }}
      </p>
    </div>

    <button
      @click="emit('reset')"
      class="px-5 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
      type="button"
    >
      <RotateCcw class="w-3.5 h-3.5" />
      <span>{{ t('common.clear') }}</span>
    </button>
  </div>
</template>
