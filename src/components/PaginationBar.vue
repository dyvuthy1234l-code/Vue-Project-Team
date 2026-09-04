<script setup lang="ts">
import { computed } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps<{
  currentPage: number
  totalPages: number
  showingFrom: number
  showingTo: number
  totalItems: number
}>()

const emit = defineEmits<{
  (e: 'pageChange', page: number): void
  (e: 'goToPage', page: number): void
  (e: 'prev'): void
  (e: 'prevPage'): void
  (e: 'next'): void
  (e: 'nextPage'): void
}>()

function onPageClick(page: number) {
  emit('pageChange', page)
  emit('goToPage', page)
}

function onPrev() {
  emit('prev')
  emit('prevPage')
}

function onNext() {
  emit('next')
  emit('nextPage')
}

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = props.totalPages
  const current = props.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    pages.push(1)
    if (current > 3) pages.push(-1) // ellipsis
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (current < total - 2) pages.push(-1) // ellipsis
    pages.push(total)
  }

  return pages
})
</script>

<template>
  <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
    <!-- Info count -->
    <p class="text-xs font-semibold text-slate-500 dark:text-slate-400">
      Showing <span class="font-bold text-[#0A2540] dark:text-white">{{ showingFrom }}–{{ showingTo }}</span>
      of <span class="font-bold text-[#0A2540] dark:text-white">{{ totalItems }}</span> results
    </p>

    <!-- Controls -->
    <div class="flex items-center gap-1.5">
      <!-- Previous Page -->
      <button
        @click="onPrev"
        :disabled="currentPage <= 1"
        class="p-2 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
        type="button"
        aria-label="Previous page"
      >
        <ChevronLeft class="w-4 h-4" />
      </button>

      <!-- Page Numbers -->
      <template v-for="(page, idx) in visiblePages" :key="idx">
        <span v-if="page === -1" class="px-1.5 text-slate-400 text-xs select-none">…</span>
        <button
          v-else
          @click="onPageClick(page)"
          :class="[
            'min-w-[36px] h-9 px-2 rounded-xl text-xs font-bold transition-all shadow-xs',
            page === currentPage
              ? 'bg-[#0D47A1] text-white border border-[#0D47A1]'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200/90 dark:border-slate-700'
          ]"
          type="button"
        >
          {{ page }}
        </button>
      </template>

      <!-- Next Page -->
      <button
        @click="onNext"
        :disabled="currentPage >= totalPages"
        class="p-2 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-xs"
        type="button"
        aria-label="Next page"
      >
        <ChevronRight class="w-4 h-4" />
      </button>
    </div>
  </div>
</template>
