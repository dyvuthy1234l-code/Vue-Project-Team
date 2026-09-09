<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  FileText,
  Search,
  Plus,
  Clock,
  Trash2,
  CheckCircle2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServices } from '@/services/dataService'
import type { GovernmentService } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

const services = ref<GovernmentService[]>(getGovernmentServices())
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
      s.title.toLowerCase().includes(q) ||
      (s.titleKh && s.titleKh.toLowerCase().includes(q)) ||
      s.description.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
})

const isAddModalOpen = ref(false)
const newService = ref({
  title: '',
  titleKh: '',
  category: 'Civil Status',
  processingTime: '3-5 Working Days',
  fee: 'Free (ឥតគិតថ្លៃ)',
  description: ''
})

function handleAddService() {
  if (!newService.value.title) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះសេវា!' : 'Please enter service title!')
    return
  }
  const created: GovernmentService = {
    id: 'gov-' + Date.now(),
    title: newService.value.title,
    titleKh: newService.value.titleKh || newService.value.title,
    category: newService.value.category,
    description: newService.value.description || 'Public government service provided by RGC.',
    descriptionKh: 'សេវាសាធារណៈរបស់រាជរដ្ឋាភិបាលកម្ពុជា។',
    processingTime: newService.value.processingTime,
    processingTimeKh: newService.value.processingTime,
    fee: newService.value.fee,
    feeKh: newService.value.fee,
    requirements: ['National ID Card', 'Family Book'],
    requirementsKh: ['អត្តសញ្ញាណប័ណ្ណ', 'សៀវភៅគ្រួសារ'],
    process: [
      { step: 1, title: 'Submit documents', titleKh: 'ដាក់ឯកសារ', description: 'At OWSO desk', descriptionKh: 'នៅតុច្រកចេញចូលតែមួយ' }
    ],
    location: 'Phnom Penh',
    locationKh: 'រាជធានីភ្នំពេញ',
    validity: '10 Years',
    validityKh: '១០ ឆ្នាំ',
    ageRequirements: '18+',
    ageRequirementsKh: '១៨ ឆ្នាំឡើង',
    faq: []
  }
  services.value.unshift(created)
  isAddModalOpen.value = false
  newService.value.title = ''
  emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមសេវារដ្ឋបាលថ្មី!' : 'New government service added!')
}

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបសេវានេះមែនទេ?' : 'Delete this service?')) {
    services.value = services.value.filter(s => s.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបសេវា!' : 'Service removed!')
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវារដ្ឋបាល...' : 'Search government services...'"
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

      <div class="flex items-center gap-2 w-full sm:w-auto justify-end">
        <span class="text-xs font-bold text-slate-500 font-khmer">
          {{ currentLanguage === 'kh' ? 'សរុប' : 'Total' }}: {{ filteredServices.length }}
        </span>
        <button
          type="button"
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span class="font-khmer">{{ currentLanguage === 'kh' ? 'បន្ថែមសេវា' : 'Add Service' }}</span>
        </button>
      </div>
    </div>

    <!-- Services Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ឈ្មោះសេវា' : 'Service Title' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'រយៈពេល' : 'Processing Time' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'តម្លៃសេវា' : 'Fee' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'សុពលភាព' : 'Validity' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="s in filteredServices" :key="s.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <FileText class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' ? s.titleKh : s.title }}
                    </span>
                    <span class="text-[10px] text-slate-400">ID: {{ s.id }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                {{ s.category }}
              </td>
              <td class="py-3 px-4 text-slate-600">
                <span class="inline-flex items-center gap-1 font-medium">
                  <Clock class="w-3 h-3 text-slate-400" />
                  {{ s.processingTime }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-700 font-semibold">
                {{ s.fee }}
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 class="w-3 h-3" />
                  <span>{{ s.validity || 'Official' }}</span>
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

    <!-- Add Service Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-black text-slate-900 font-khmer">
          {{ currentLanguage === 'kh' ? 'បន្ថែមសេវារដ្ឋបាលថ្មី' : 'Add Government Service' }}
        </h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះសេវា (English) *</label>
            <input v-model="newService.title" type="text" placeholder="e.g. Birth Certificate" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះសេវាជាភាសាខ្មែរ</label>
            <input v-model="newService.titleKh" type="text" placeholder="ឧទាហរណ៍៖ សំបុត្រកំណើត" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-khmer" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">រយៈពេលដំណើរការ</label>
              <input v-model="newService.processingTime" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">តម្លៃសេវា</label>
              <input v-model="newService.fee" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="isAddModalOpen = false" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer">
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button @click="handleAddService" class="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl cursor-pointer shadow-xs">
            {{ currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
