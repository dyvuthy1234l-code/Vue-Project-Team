<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { X, Search, Sparkles } from 'lucide-vue-next'
import GlobalSearch from '@/components/GlobalSearch.vue'

defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()

const popularSearches = [
  { label: 'Hospitals', path: '/health' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Driving License', path: '/government' },
  { label: 'Passport', path: '/government' },
  { label: 'Emergency', path: '/emergency' }
]

function selectTag(item: typeof popularSearches[0]) {
  router.push(item.path)
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/60 backdrop-blur-xs"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-2xl bg-white dark:bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 space-y-4 animate-fadeIn"
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center">
              <Search class="w-4 h-4" />
            </div>
            <span class="text-sm font-bold text-[#0A2540] dark:text-white">Quick Search</span>
          </div>

          <button
            @click="emit('close')"
            class="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            aria-label="Close search"
            type="button"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Global Search Input Component -->
        <GlobalSearch placeholder="Search services, hospitals, jobs, news..." large />

        <!-- Popular Searches Quick Pills -->
        <div class="pt-2 border-t border-slate-100 dark:border-slate-700/60">
          <p class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Sparkles class="w-3.5 h-3.5 text-amber-500" />
            <span>Popular Searches</span>
          </p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in popularSearches"
              :key="item.label"
              @click="selectTag(item)"
              class="px-3 py-1 bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-[#0D47A1] dark:hover:text-blue-300 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-600 transition-colors"
              type="button"
            >
              {{ item.label }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
