<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import {
  Briefcase,
  Search,
  Plus,
  MapPin,
  Trash2,
  Building2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { getJobs } from '@/services/dataService'
import type { Job } from '@/types'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

function loadJobs(): Job[] {
  const base = getJobs()
  try {
    const saved = localStorage.getItem('camlife_user_jobs')
    if (saved) {
      const parsed: Job[] = JSON.parse(saved)
      return [...parsed, ...base]
    }
  } catch {}
  return [...base]
}

const jobs = ref<Job[]>(loadJobs())
const searchQuery = ref('')
const selectedCategory = ref('All')

const categories = computed(() => {
  const cats = new Set(jobs.value.map(j => j.category))
  return ['All', ...Array.from(cats)]
})

const filteredJobs = computed(() => {
  return jobs.value.filter(j => {
    const matchCat = selectedCategory.value === 'All' || j.category === selectedCategory.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchCat
    const matchSearch =
      j.title.toLowerCase().includes(q) ||
      (j.titleKh && j.titleKh.toLowerCase().includes(q)) ||
      j.company.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    return matchCat && matchSearch
  })
})

const isAddModalOpen = ref(false)
const newJob = reactive({
  title: '',
  titleKh: '',
  company: '',
  category: 'IT',
  type: 'Full-time' as const,
  salaryMin: 500,
  salaryMax: 1500,
  location: 'Phnom Penh',
  description: ''
})

function handleAddJob() {
  if (!newJob.title || !newJob.company) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញចំណងជើងការងារ និងឈ្មោះក្រុមហ៊ុន!' : 'Please enter job title and company!')
    return
  }
  const created: Job = {
    id: 'job-custom-' + Date.now(),
    title: newJob.title,
    titleKh: newJob.titleKh || newJob.title,
    company: newJob.company,
    category: newJob.category,
    type: newJob.type,
    salary: `$${newJob.salaryMin} - $${newJob.salaryMax}`,
    salaryMin: Number(newJob.salaryMin),
    salaryMax: Number(newJob.salaryMax),
    location: newJob.location,
    postedDate: 'Today',
    description: newJob.description || `Employment opening at ${newJob.company}.`,
    descriptionKh: `ឱកាសការងារនៅ ${newJob.company}។`,
    requirements: ['Experience in relevant domain', 'Good communication skills'],
    benefits: ['Salary & bonus', 'NSSF & insurance'],
    applyUrl: '#'
  }
  jobs.value.unshift(created)
  try {
    const savedStr = localStorage.getItem('camlife_user_jobs')
    const saved: Job[] = savedStr ? JSON.parse(savedStr) : []
    saved.unshift(created)
    localStorage.setItem('camlife_user_jobs', JSON.stringify(saved))
  } catch {}
  isAddModalOpen.value = false
  newJob.title = ''
  newJob.company = ''
  emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមការងារថ្មីជោគជ័យ!' : 'Job posted successfully!')
}

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបការងារនេះមែនទេ?' : 'Delete this job listing?')) {
    jobs.value = jobs.value.filter(j => j.id !== id)
    try {
      const savedStr = localStorage.getItem('camlife_user_jobs')
      if (savedStr) {
        const saved: Job[] = JSON.parse(savedStr)
        localStorage.setItem('camlife_user_jobs', JSON.stringify(saved.filter(j => j.id !== id)))
      }
    } catch {}
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបការងារ!' : 'Job removed!')
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកការងារ, ក្រុមហ៊ុន...' : 'Search jobs, company...'"
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
          {{ currentLanguage === 'kh' ? 'ការងារសកម្ម' : 'Active Jobs' }}: {{ filteredJobs.length }}
        </span>
        <button
          type="button"
          @click="isAddModalOpen = true"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer"
        >
          <Plus class="w-4 h-4" />
          <span class="font-khmer">{{ currentLanguage === 'kh' ? 'បង្កើតការងារ' : 'Post Job' }}</span>
        </button>
      </div>
    </div>

    <!-- Jobs Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'មុខតំណែង' : 'Job Title' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ក្រុមហ៊ុន' : 'Company' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រាក់បៀវត្ស' : 'Salary' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទីតាំង' : 'Location' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Type' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="j in filteredJobs" :key="j.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Briefcase class="w-4 h-4" />
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' && j.titleKh ? j.titleKh : j.title }}
                    </span>
                    <span class="text-[10px] text-slate-400">{{ j.category }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-700 font-semibold">
                <span class="inline-flex items-center gap-1">
                  <Building2 class="w-3.5 h-3.5 text-slate-400" />
                  {{ j.company }}
                </span>
              </td>
              <td class="py-3 px-4 text-emerald-700 font-bold">
                {{ j.salary }}
              </td>
              <td class="py-3 px-4 text-slate-600 font-medium">
                <span class="inline-flex items-center gap-1">
                  <MapPin class="w-3 h-3 text-slate-400" />
                  {{ j.location }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  {{ j.type }}
                </span>
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(j.id)"
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

    <!-- Add Job Modal -->
    <div v-if="isAddModalOpen" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <h3 class="text-base font-black text-slate-900 font-khmer">
          {{ currentLanguage === 'kh' ? 'បង្កើតការងារថ្មី' : 'Post New Job' }}
        </h3>
        <div class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">មុខតំណែង (Job Title) *</label>
            <input v-model="newJob.title" type="text" placeholder="e.g. Senior Frontend Engineer" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះក្រុមហ៊ុន (Company) *</label>
            <input v-model="newJob.company" type="text" placeholder="e.g. ABA Bank" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">ប្រាក់ខែអប្បបរមា ($)</label>
              <input v-model.number="newJob.salaryMin" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">ប្រាក់ខែអតិបរមា ($)</label>
              <input v-model.number="newJob.salaryMax" type="number" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
            </div>
          </div>
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ទីតាំង (Location)</label>
            <input v-model="newJob.location" type="text" placeholder="Phnom Penh" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
          </div>
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button @click="isAddModalOpen = false" class="px-4 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl cursor-pointer">
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button @click="handleAddJob" class="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl cursor-pointer shadow-xs">
            {{ currentLanguage === 'kh' ? 'ផ្សព្វផ្សាយ' : 'Publish' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
