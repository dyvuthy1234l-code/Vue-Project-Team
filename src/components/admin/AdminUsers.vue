<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Mail,
  Phone,
  Trash2
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

interface UserRecord {
  id: string
  name: string
  nameKh?: string
  email: string
  phone: string
  role: 'Administrator' | 'Officer' | 'Citizen' | 'Specialist'
  status: 'Active' | 'Pending' | 'Suspended'
  registeredDate: string
}

const users = ref<UserRecord[]>([
  { id: 'usr-01', name: 'Admin Officer', nameKh: 'មន្ត្រីរដ្ឋបាលជាន់ខ្ពស់', email: 'admin@camlife.gov.kh', phone: '012 999 888', role: 'Administrator', status: 'Active', registeredDate: '2026-01-15' },
  { id: 'usr-02', name: 'Sok Dara', nameKh: 'សុខ តារា', email: 'dara.sok@gmail.com', phone: '098 123 456', role: 'Specialist', status: 'Active', registeredDate: '2026-02-10' },
  { id: 'usr-03', name: 'Chan Bopha', nameKh: 'ចាន់ បុប្ផា', email: 'bopha.chan@outlook.com', phone: '077 555 333', role: 'Citizen', status: 'Active', registeredDate: '2026-02-18' },
  { id: 'usr-04', name: 'Khem Sreypov', nameKh: 'ខែម ស្រីពៅ', email: 'sreypov.khem@gov.kh', phone: '010 444 222', role: 'Officer', status: 'Active', registeredDate: '2026-03-01' },
  { id: 'usr-05', name: 'Vicheka Nget', nameKh: 'វិច្ឆិកា ង៉ែត', email: 'vicheka@gmail.com', phone: '085 777 999', role: 'Citizen', status: 'Active', registeredDate: '2026-03-05' }
])

const searchQuery = ref('')
const selectedRole = ref('All')

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchRole = selectedRole.value === 'All' || u.role === selectedRole.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchRole
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      (u.nameKh && u.nameKh.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q)
    return matchRole && matchSearch
  })
})

function handleDelete(id: string) {
  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបគណនីនេះ?' : 'Delete this user?')) {
    users.value = users.value.filter(u => u.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបគណនី!' : 'User removed!')
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
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកអ្នកប្រើប្រាស់, អ៊ីមែល...' : 'Search users, email...'"
            class="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer"
          />
        </div>
        <select
          v-model="selectedRole"
          class="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer capitalize"
        >
          <option value="All">{{ currentLanguage === 'kh' ? 'តួនាទីទាំងអស់' : 'All Roles' }}</option>
          <option value="Administrator">Administrator</option>
          <option value="Officer">Officer</option>
          <option value="Specialist">Specialist</option>
          <option value="Citizen">Citizen</option>
        </select>
      </div>

      <div class="text-xs font-bold text-slate-500 font-khmer">
        {{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់សរុប' : 'Total Users' }}: {{ filteredUsers.length }}
      </div>
    </div>

    <!-- Users Table -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ឈ្មោះអ្នកប្រើប្រាស់' : 'User' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អ៊ីមែល & ទូរស័ព្ទ' : 'Contact' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'តួនាទី' : 'Role' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ថ្ងៃចុះឈ្មោះ' : 'Registered' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="u in filteredUsers" :key="u.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                    {{ u.name.charAt(0) }}
                  </div>
                  <div>
                    <span class="font-bold text-slate-900 block font-khmer">
                      {{ currentLanguage === 'kh' && u.nameKh ? u.nameKh : u.name }}
                    </span>
                    <span class="text-[10px] text-slate-400">ID: {{ u.id }}</span>
                  </div>
                </div>
              </td>
              <td class="py-3 px-4 text-slate-600">
                <div class="flex flex-col">
                  <span class="inline-flex items-center gap-1 font-medium">
                    <Mail class="w-3 h-3 text-slate-400" />
                    {{ u.email }}
                  </span>
                  <span class="inline-flex items-center gap-1 text-[11px] text-slate-400">
                    <Phone class="w-3 h-3" />
                    {{ u.phone }}
                  </span>
                </div>
              </td>
              <td class="py-3 px-4">
                <span
                  :class="[
                    'px-2.5 py-0.5 rounded-full text-[10px] font-bold border',
                    u.role === 'Administrator' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                    u.role === 'Officer' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    u.role === 'Specialist' ? 'bg-teal-50 text-teal-700 border-teal-200' :
                    'bg-slate-50 text-slate-700 border-slate-200'
                  ]"
                >
                  {{ u.role }}
                </span>
              </td>
              <td class="py-3 px-4">
                <span class="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                  <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  {{ u.status }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-400 text-[11px]">
                {{ u.registeredDate }}
              </td>
              <td class="py-3 px-4 text-right">
                <button
                  type="button"
                  @click="handleDelete(u.id)"
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
