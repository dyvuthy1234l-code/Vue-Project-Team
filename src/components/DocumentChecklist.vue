<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  CheckSquare,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Printer,
  BookmarkCheck
} from 'lucide-vue-next'
import { useChecklist } from '@/composables/useChecklist'
import { useLanguage } from '@/composables/useLanguage'

interface Props {
  serviceId: string
  serviceTitle: string
  requirements: string[]
  requirementsKh?: string[]
}

const props = defineProps<Props>()
const { currentLanguage } = useLanguage()

const activeRequirements = computed(() => {
  if (currentLanguage.value === 'kh' && props.requirementsKh && props.requirementsKh.length > 0) {
    return props.requirementsKh
  }
  return props.requirements
})

const {
  isItemChecked,
  toggleItem,
  resetChecklist,
  getCheckedCount,
  getProgressPercentage
} = useChecklist(props.serviceId, activeRequirements.value.length)

const saveToastVisible = ref(false)

function handleSaveProgress() {
  saveToastVisible.value = true
  setTimeout(() => {
    saveToastVisible.value = false
  }, 2500)
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
    <!-- Header with Progress -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-700">
      <div>
        <div class="flex items-center gap-2">
          <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-[#0D47A1] dark:bg-blue-900/60 dark:text-blue-300">
            <CheckSquare class="w-4 h-4" />
          </span>
          <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'តារាងត្រួតពិនិត្យឯកសារចាំបាច់ (Checklist)' : 'Required Document Checklist' }}
          </h3>
        </div>
        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-khmer">
          {{ currentLanguage === 'kh'
            ? 'ចុច Check លើឯកសារដែលអ្នកបានរៀបចំរួចរាល់ ដើម្បីតាមដានវឌ្ឍនភាពរបស់អ្នក'
            : 'Click on documents you have prepared to track your readiness percentage.'
          }}
        </p>
      </div>

      <!-- Readiness Badge & Actions -->
      <div class="flex items-center gap-2 shrink-0">
        <button
          @click="handlePrint"
          class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          type="button"
          :title="currentLanguage === 'kh' ? 'បោះពុម្ពបញ្ជីឯកសារ' : 'Print Document Checklist'"
        >
          <Printer class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'បោះពុម្ព' : 'Print' }}</span>
        </button>

        <button
          v-if="getCheckedCount() > 0"
          @click="resetChecklist"
          class="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-red-500 transition-colors"
          type="button"
          :title="currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset Checklist'"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'កំណត់ឡើងវិញ' : 'Reset' }}</span>
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-700/80 space-y-2">
      <div class="flex items-center justify-between text-xs font-bold">
        <span class="text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
          <Sparkles class="w-4 h-4 text-amber-500" />
          <span>{{ currentLanguage === 'kh' ? 'កម្រិតត្រៀមរួចរាល់' : 'Readiness Progress' }}:</span>
          <span class="text-[#0D47A1] dark:text-blue-400">{{ getCheckedCount() }} / {{ activeRequirements.length }} {{ currentLanguage === 'kh' ? 'ឯកសារ' : 'documents' }}</span>
        </span>
        <span class="text-sm font-black text-[#0D47A1] dark:text-blue-400 font-mono">
          {{ getProgressPercentage() }}%
        </span>
      </div>

      <!-- Track -->
      <div class="h-2.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-300 rounded-full"
          :style="{ width: `${getProgressPercentage()}%` }"
        />
      </div>

      <p v-if="getProgressPercentage() === 100" class="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 pt-1">
        <CheckCircle2 class="w-3.5 h-3.5" />
        <span>{{ currentLanguage === 'kh' ? 'ឯកសាររបស់អ្នកបានរៀបចំគ្រប់គ្រាន់ ១០០%! អ្នកអាចទៅកាន់ការិយាល័យបាន។' : 'All documents prepared! You are ready to visit the office.' }}</span>
      </p>
    </div>

    <!-- Checklist Items -->
    <div class="space-y-2.5">
      <div
        v-for="(req, index) in activeRequirements"
        :key="index"
        @click="toggleItem(index)"
        :class="[
          'flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer select-none',
          isItemChecked(index)
            ? 'border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/30 dark:border-emerald-900/60'
            : 'border-slate-200/80 dark:border-slate-700 hover:border-blue-200 hover:bg-slate-50/60 dark:hover:bg-slate-700/40'
        ]"
      >
        <div class="shrink-0 mt-0.5">
          <div
            :class="[
              'w-5 h-5 rounded-lg flex items-center justify-center transition-all',
              isItemChecked(index)
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border-2 border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
            ]"
          >
            <CheckCircle2 v-if="isItemChecked(index)" class="w-3.5 h-3.5" />
          </div>
        </div>

        <div class="min-w-0 flex-1">
          <p
            :class="[
              'text-xs sm:text-sm font-semibold font-khmer leading-relaxed',
              isItemChecked(index)
                ? 'text-emerald-900 dark:text-emerald-200 line-through opacity-85'
                : 'text-slate-800 dark:text-slate-200'
            ]"
          >
            {{ req }}
          </p>
        </div>
      </div>
    </div>

    <!-- Save Progress Action Bar -->
    <div class="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 dark:border-slate-700">
      <button
        @click="handleSaveProgress"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold shadow-sm transition-all active:scale-95"
        type="button"
      >
        <BookmarkCheck class="w-4 h-4" />
        <span>{{ currentLanguage === 'kh' ? 'រក្សាទុកវឌ្ឍនភាព (Save Progress)' : 'Save Progress' }}</span>
      </button>

      <span v-if="saveToastVisible" class="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fadeIn">
        <CheckCircle2 class="w-4 h-4" />
        <span>{{ currentLanguage === 'kh' ? 'បានរក្សាទុកក្នុងឧបករណ៍របស់អ្នកជោគជ័យ!' : 'Progress saved successfully on this device!' }}</span>
      </span>
    </div>
  </div>
</template>
