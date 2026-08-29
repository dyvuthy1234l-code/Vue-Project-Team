<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'
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
  <div class="flex flex-col items-center justify-center py-12 text-center">
    <AlertCircle class="w-12 h-12 text-red-400 mb-4" />
    <p class="text-gray-700 text-lg mb-4">{{ message || t('common.error') }}</p>
    <button
      @click="emit('retry')"
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      {{ t('common.retry') }}
    </button>
  </div>
</template>
