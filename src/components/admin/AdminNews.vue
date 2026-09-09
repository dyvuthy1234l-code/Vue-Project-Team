<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Calendar,
  User,
  Trash2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getNews } from '@/services/dataService'
import type { NewsItem } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

const newsList = ref<NewsItem[]>(getNews())
const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = computed(() => {
  const set = new Set(newsList.value.map(n => n.category))
  return ['All', ...Array.from(set)]
})

const filteredNews = computed(() => {
  return newsList.value.filter(n => {
    const matchCat = selectedCategory.value === 'All' || n.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat
    const matchSearch =
      n.title.toLowerCase().includes(q) ||
      (n.titleKh && n.titleKh.toLowerCase().includes(q)) ||
      n.description.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
})

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបព័ត៌មាននេះ?' : 'Delete this news bulletin?')) {
    newsList.value = newsList.value.filter(n => n.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបព័ត៌មាន!' : 'News article removed!')
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកព័ត៌មាន, សេចក្តីជូនដំណឹង...' : 'Search news, bulletins...'"
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
        {{ currentLanguage === 'kh' ? 'ព័ត៌មានសរុប' : 'Total Articles' }}: {{ filteredNews.length }}
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ចំណងជើងព័ត៌មាន' : 'Title' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Date' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អ្នកសរសេរ' : 'Author' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="n in filteredNews" :key="n.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <img :src="n.image" :alt="n.title" class="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0" />
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer max-w-[280px] truncate">
                      {{ currentLanguage === 'kh' && n.titleKh ? n.titleKh : n.title }}
                    </span>
                    <span class="text-[10px] text-slate-400">ID: {{ n.id }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 capitalize">
                  {{ n.category }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600">
                <span class="inline-flex items-center gap-1">
                  <Calendar class="w-3 h-3 text-slate-400" />
                  {{ n.date }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                <span class="inline-flex items-center gap-1">
                  <User class="w-3 h-3 text-slate-400" />
                  {{ n.author || 'CamLife Editorial' }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(n.id)"
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
