<script setup lang="ts">
import { ShieldCheck } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

interface Props {
  lastUpdated?: string
  compact?: boolean
}

withDefaults(defineProps<Props>(), {
  lastUpdated: '04 Sep 2026',
  compact: false
})

const { currentLanguage } = useLanguage()
</script>

<template>
  <div
    :class="[
      'inline-flex items-center gap-1.5 rounded-full font-bold border transition-colors',
      compact
        ? 'px-2 py-0.5 text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800'
        : 'px-3 py-1 text-xs bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
    ]"
  >
    <ShieldCheck class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
    <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានផ្ទៀងផ្ទាត់ផ្លូវការ' : 'Verified Information' }}</span>
    <span v-if="!compact" class="text-slate-300 dark:text-slate-600">·</span>
    <span v-if="!compact" class="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
      {{ currentLanguage === 'kh' ? `បច្ចុប្បន្នភាព: ${lastUpdated}` : `Verified: ${lastUpdated}` }}
    </span>
  </div>
</template>
