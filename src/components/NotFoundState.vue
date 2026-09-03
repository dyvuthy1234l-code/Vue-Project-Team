<script setup lang="ts">
import { FileQuestion, ArrowLeft } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  message?: string
  subtitle?: string
  backLink?: string
  backText?: string
}>()
</script>

<template>
  <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 sm:p-12 text-center shadow-sm my-12 max-w-lg mx-auto flex flex-col items-center space-y-4">
    <div class="w-16 h-16 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shadow-xs">
      <FileQuestion class="w-8 h-8" />
    </div>

    <div class="space-y-1">
      <h2 class="text-xl sm:text-2xl font-bold text-[#0A2540] dark:text-white">
        {{ message || t('common.notFound') }}
      </h2>
      <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
        {{ subtitle || t('common.notFoundMessage') }}
      </p>
    </div>

    <div class="pt-2">
      <router-link
        :to="backLink || '/'"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
      >
        <ArrowLeft class="w-4 h-4" />
        <span>{{ backText || t('common.backToHome') }}</span>
      </router-link>
    </div>
  </div>
</template>
