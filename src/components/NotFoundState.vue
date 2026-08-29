<script setup lang="ts">
import { FileQuestion, ArrowLeft } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()

defineProps<{
  message?: string
}>()
</script>

<template>
  <div class="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-subtle my-12 max-w-lg mx-auto flex flex-col items-center">
    <div class="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm">
      <FileQuestion class="w-10 h-10" />
    </div>
    <h2 class="text-2xl font-extrabold text-camlife-navy mb-2">{{ t('common.notFound') }}</h2>
    <p class="text-sm text-camlife-muted leading-relaxed max-w-sm mb-8">
      {{ message || t('common.notFoundMessage') }}
    </p>
    <router-link
      to="/"
      class="inline-flex items-center space-x-2 px-6 py-3 bg-camlife-action hover:bg-camlife-action-hover text-white text-sm font-bold rounded-xl shadow-md transition-all hover:shadow-lg"
    >
      <ArrowLeft class="w-4 h-4" />
      <span>{{ t('common.backToHome') }}</span>
    </router-link>
  </div>
</template>
