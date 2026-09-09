<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Bus,
  Search,
  Clock,
  MapPin,
  Trash2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getTransport } from '@/services/dataService'
import type { Transport } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

const transportList = ref<Transport[]>(getTransport())
const searchQuery = ref('')
const selectedType = ref('All')

const types = computed(() => {
  const set = new Set(transportList.value.map(t => t.type))
  return ['All', ...Array.from(set)]
})

const filteredTransport = computed(() => {
  return transportList.value.filter(t => {
    const matchType = selectedType.value === 'All' || t.type === selectedType.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchType
    const matchSearch =
      t.name.toLowerCase().includes(q) ||
      (t.nameKh && t.nameKh.toLowerCase().includes(q)) ||
      t.route.toLowerCase().includes(q)
    return matchType && matchSearch
  })
})

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបខ្សែរត់នេះ?' : 'Delete this route?')) {
    transportList.value = transportList.value.filter(t => t.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបខ្សែរត់!' : 'Transport route removed!')
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Action Bar -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកខ្សែរត់, រថយន្តក្រុង...' : 'Search bus routes, transit...'"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer"
          />
        </div>
        <select
          v-model="selectedType"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer capitalize"
        >
          <option v-for="tp in types" :key="tp" :value="tp">{{ tp }}</option>
        </select>
      </div>

      <div class="text-xs font-bold text-slate-500 font-khmer">
        {{ currentLanguage === 'kh' ? 'ខ្សែរត់សរុប' : 'Total Routes' }}: {{ filteredTransport.length }}
      </div>
    </div>

    <!-- Transport Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ឈ្មោះខ្សែរត់' : 'Route Name' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Type' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ខ្សែផ្លូវ' : 'Path' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'តម្លៃសំបុត្រ' : 'Fare' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ម៉ោងដំណើរការ' : 'Hours' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="t in filteredTransport" :key="t.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <Bus class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' && t.nameKh ? t.nameKh : t.name }}
                    </span>
                    <span class="text-[10px] text-slate-400">ID: {{ t.id }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                  {{ t.type }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                <span class="inline-flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {{ t.route }}
                </span>
              </td>
              <td class="py-3 px-4 text-emerald-700 font-bold">
                {{ t.price }}
              </td>
              <td class="py-3 px-4 text-slate-600">
                <span class="inline-flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  {{ t.schedule }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(t.id)"
                  class="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
