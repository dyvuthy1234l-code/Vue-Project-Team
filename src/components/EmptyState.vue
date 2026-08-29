<script setup lang="ts">
import { SearchX } from 'lucide-vue-next'
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
  <div class="bg-white rounded-3xl border border-slate-200/90 p-10 text-center shadow-subtle my-6 max-w-lg mx-auto flex flex-col items-center">
    <div class="w-16 h-16 bg-camlife-light rounded-2xl flex items-center justify-center text-camlife-action mb-4 shadow-sm">
      <SearchX class="w-8 h-8" />
    </div>
    <h3 class="font-extrabold text-camlife-navy text-lg mb-1">
      {{ message || t('common.noResults') }}
    </h3>
    <p class="text-xs text-camlife-muted leading-relaxed max-w-sm mb-6">
      {{ subtitle || 'We couldn\'t find any records matching your active search or filters. Try adjusting your search query or clearing your filter selections.' }}
    </p>

    <button
      @click="emit('reset')"
      class="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors"
      type="button"
    >
      {{ t('common.clear') }}
    </button>
  </div>
</template>
