<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Phone,
  MapPin,
  Star,
  Trash2,
  ShieldCheck
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals } from '@/services/dataService'
import type { Hospital } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

const hospitals = ref<Hospital[]>(getHospitals())
const searchQuery = ref('')
const selectedLocation = ref('All')

const locations = computed(() => {
  const locs = new Set(hospitals.value.map(h => h.location))
  return ['All', ...Array.from(locs)]
})

const filteredHospitals = computed(() => {
  return hospitals.value.filter(h => {
    const matchLoc = selectedLocation.value === 'All' || h.location === selectedLocation.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchLoc
    const matchSearch =
      h.name.toLowerCase().includes(q) ||
      (h.nameKh && h.nameKh.toLowerCase().includes(q)) ||
      h.location.toLowerCase().includes(q)
    return matchLoc && matchSearch
  })
})

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបមន្ទីរពេទ្យនេះ?' : 'Delete this hospital?')) {
    hospitals.value = hospitals.value.filter(h => h.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបមន្ទីរពេទ្យ!' : 'Hospital removed!')
  }
}
</script>

<template>
  <div class="space-y-4">
    <!-- Filter Bar -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <div class="relative flex-1 sm:w-64">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកមន្ទីរពេទ្យ/គ្លីនិក...' : 'Search hospitals, clinics...'"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer"
          />
        </div>
        <select
          v-model="selectedLocation"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <option v-for="l in locations" :key="l" :value="l">{{ l }}</option>
        </select>
      </div>

      <div class="text-xs font-bold text-slate-500 font-khmer">
        {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យសរុប' : 'Total Hospitals' }}: {{ filteredHospitals.length }}
      </div>
    </div>

    <!-- Hospitals Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ' : 'Hospital' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ខេត្ត/ក្រុង' : 'Location' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទសង្គ្រោះ' : 'Hotline' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប.ស.ស (NSSF)' : 'NSSF' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ការវាយតម្លៃ' : 'Rating' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="h in filteredHospitals" :key="h.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <img :src="h.image" :alt="h.name" class="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' ? h.nameKh : h.name }}
                    </span>
                    <span class="text-[10px] text-slate-400 capitalize">{{ h.ownership }} · {{ h.openingHours }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                <span class="inline-flex items-center gap-1">
                  <MapPin class="w-3.5 h-3.5 text-slate-400" />
                  {{ h.location }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-700 font-bold">
                <span class="inline-flex items-center gap-1 text-rose-600">
                  <Phone class="w-3 h-3" />
                  {{ h.emergencyHotline || h.phone }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span
                  v-if="h.acceptsNssf"
                  class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <ShieldCheck class="w-3 h-3" />
                  <span>ប.ស.ស</span>
                </span>
                <span v-else class="text-slate-400 text-[11px]">—</span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 font-bold text-amber-600">
                  <Star class="w-3 h-3 fill-amber-400 text-amber-400" />
                  {{ h.rating }} ({{ h.reviews }})
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(h.id)"
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
