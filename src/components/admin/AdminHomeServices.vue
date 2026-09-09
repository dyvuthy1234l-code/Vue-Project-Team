<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Home,
  Search,
  Phone,
  Star,
  Trash2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getHomeServices } from '@/services/dataService'
import type { HomeService } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

function loadHomeServices(): HomeService[] {
  const base = getHomeServices()
  try {
    const saved = localStorage.getItem('camlife_custom_home_services')
    if (saved) {
      const parsed: HomeService[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {}
  return [...base]
}

const services = ref<HomeService[]>(loadHomeServices())
const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(services.value.map(s => s.category))
  return ['All', ...Array.from(cats)]
})

const filteredServices = computed(() => {
  return services.value.filter(s => {
    const matchCat = selectedCategory.value === 'All' || s.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat
    const matchSearch =
      s.serviceName.toLowerCase().includes(q) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(q)) ||
      s.provider.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
})

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបសេវានេះ?' : 'Delete this technician service?')) {
    services.value = services.value.filter(s => s.id !== id)
    try {
      const savedStr = localStorage.getItem('camlife_custom_home_services')
      if (savedStr) {
        const saved: HomeService[] = JSON.parse(savedStr)
        localStorage.setItem('camlife_custom_home_services', JSON.stringify(saved.filter(s => s.id !== id)))
      }
    } catch {}
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបសេវាជួសជុល!' : 'Service removed!')
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកជាង, សេវាជួសជុល...' : 'Search technicians, repair services...'"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer"
          />
        </div>
        <select
          v-model="selectedCategory"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer"
        >
          <option v-for="c in categories" :key="c" :value="c">{{ c }}</option>
        </select>
      </div>

      <div class="text-xs font-bold text-slate-500 font-khmer">
        {{ currentLanguage === 'kh' ? 'ជាងសរុប' : 'Total Specialists' }}: {{ filteredServices.length }}
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ឈ្មោះសេវា/ជាង' : 'Service / Specialist' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អ្នកផ្តល់សេវា' : 'Provider' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'តម្លៃចាប់ផ្តើម' : 'Price' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទូរស័ព្ទកក់' : 'Booking Phone' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ការវាយតម្លៃ' : 'Rating' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in filteredServices" :key="s.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
                    <Home class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' && s.serviceNameKh ? s.serviceNameKh : s.serviceName }}
                    </span>
                    <span class="text-[10px] text-slate-400 capitalize">{{ s.category }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-700 font-medium">
                {{ s.provider }}
              </td>
              <td class="py-3 px-4 text-emerald-700 font-bold">
                {{ s.priceEstimate || '$10 - $25' }}
              </td>
              <td class="py-3 px-4 text-blue-600 font-bold">
                <span class="inline-flex items-center gap-1">
                  <Phone class="w-3 h-3" />
                  {{ s.phone }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 font-bold text-amber-600">
                  <Star class="w-3 h-3 fill-amber-400 text-amber-400" />
                  {{ s.rating }} ({{ s.reviews || 12 }})
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(s.id)"
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
