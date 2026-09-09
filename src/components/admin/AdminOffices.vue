<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Building2,
  Search,
  MapPin,
  Phone,
  Clock,
  Trash2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getLocations } from '@/services/dataService'
import type { LocationItem } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

const locations = ref<LocationItem[]>(getLocations())
const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = computed(() => {
  const set = new Set(locations.value.map(l => l.category))
  return ['All', ...Array.from(set)]
})

const filteredLocations = computed(() => {
  return locations.value.filter(l => {
    const matchCat = selectedCategory.value === 'All' || l.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat
    const matchSearch =
      l.name.toLowerCase().includes(q) ||
      (l.nameKh && l.nameKh.toLowerCase().includes(q)) ||
      l.address.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
})

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបទីតាំងនេះ?' : 'Delete this office?')) {
    locations.value = locations.value.filter(l => l.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបទីតាំង!' : 'Location removed!')
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកការិយាល័យ, ច្រក OWSO...' : 'Search public offices, OWSO...'"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer"
          />
        </div>
        <select
          v-model="selectedCategory"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer capitalize"
        >
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="text-xs font-bold text-slate-500 font-khmer">
        {{ currentLanguage === 'kh' ? 'ទីតាំងសរុប' : 'Total Locations' }}: {{ filteredLocations.length }}
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ឈ្មោះការិយាល័យ' : 'Office Name' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន' : 'Address' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទ' : 'Phone' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ម៉ោងធ្វើការ' : 'Hours' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="loc in filteredLocations" :key="loc.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Building2 class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' && loc.nameKh ? loc.nameKh : loc.name }}
                    </span>
                    <span class="text-[10px] text-slate-400">ID: {{ loc.id }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize">
                  {{ loc.category }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                <span class="inline-flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  {{ currentLanguage === 'kh' && loc.addressKh ? loc.addressKh : loc.address }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-700 font-bold">
                <span class="inline-flex items-center gap-1">
                  <Phone class="w-3 h-3 text-slate-400" />
                  {{ loc.phone }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600">
                <span class="inline-flex items-center gap-1">
                  <Clock class="w-3 h-3 text-slate-400" />
                  <span>8:00 AM - 5:00 PM</span>
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(loc.id)"
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
