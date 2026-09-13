<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Search,
  Mail,
  Phone,
  Trash2,
  Edit2,
  UserPlus,
  ShieldCheck,
  Crown,
  BadgeCheck,
  Briefcase,
  User,
  X
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

export type UserRole = 'Administrator' | 'Officer' | 'Specialist' | 'Citizen'
export type UserStatus = 'Active' | 'Pending' | 'Suspended'

interface UserRecord {
  id: string
  name: string
  nameKh?: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  department?: string
  registeredDate: string
}

const users = ref<UserRecord[]>([
  { id: 'usr-01', name: 'Admin Officer', nameKh: 'មន្ត្រីរដ្ឋបាលជាន់ខ្ពស់', email: 'admin@camlife.gov.kh', phone: '012 999 888', role: 'Administrator', status: 'Active', department: 'Office of the Prime Minister', registeredDate: '2026-01-15' },
  { id: 'usr-02', name: 'Sok Dara', nameKh: 'សុខ តារា', email: 'dara.sok@gmail.com', phone: '098 123 456', role: 'Specialist', status: 'Active', department: 'Electric & AC Repairs', registeredDate: '2026-02-10' },
  { id: 'usr-03', name: 'Chan Bopha', nameKh: 'ចាន់ បុប្ផា', email: 'bopha.chan@outlook.com', phone: '077 555 333', role: 'Citizen', status: 'Active', department: 'Phnom Penh Resident', registeredDate: '2026-02-18' },
  { id: 'usr-04', name: 'Khem Sreypov', nameKh: 'ខែម ស្រីពៅ', email: 'sreypov.khem@gov.kh', phone: '010 444 222', role: 'Officer', status: 'Active', department: 'Ministry of Interior / OWSO', registeredDate: '2026-03-01' },
  { id: 'usr-05', name: 'Vicheka Nget', nameKh: 'វិច្ឆិកា ង៉ែត', email: 'vicheka@gmail.com', phone: '085 777 999', role: 'Citizen', status: 'Active', department: 'Kandal Resident', registeredDate: '2026-03-05' },
  { id: 'usr-06', name: 'Dr. Mengly Sarun', nameKh: 'វេជ្ជបណ្ឌិត ម៉េងលី សារុន', email: 'dr.mengly@calmette.gov.kh', phone: '012 334 556', role: 'Specialist', status: 'Active', department: 'Calmette Hospital Cardiology', registeredDate: '2026-03-08' }
])

// Role Statistics
const totalAdmins = computed(() => users.value.filter(u => u.role === 'Administrator').length)
const totalOfficers = computed(() => users.value.filter(u => u.role === 'Officer').length)
const totalSpecialists = computed(() => users.value.filter(u => u.role === 'Specialist').length)
const totalCitizens = computed(() => users.value.filter(u => u.role === 'Citizen').length)

// Filters
const searchQuery = ref('')
const selectedRole = ref('All')
const selectedStatus = ref('All')

const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const matchRole = selectedRole.value === 'All' || u.role === selectedRole.value
    const matchStatus = selectedStatus.value === 'All' || u.status === selectedStatus.value
    const q = searchQuery.value.toLowerCase().trim()
    if (!q) return matchRole && matchStatus
    const matchSearch =
      u.name.toLowerCase().includes(q) ||
      (u.nameKh && u.nameKh.toLowerCase().includes(q)) ||
      u.email.toLowerCase().includes(q) ||
      u.phone.includes(q) ||
      (u.department && u.department.toLowerCase().includes(q))
    return matchRole && matchStatus && matchSearch
  })
})

// Permissions Matrix Modal
const isPermissionsModalOpen = ref(false)

// Add / Edit Modal State
const isUserModalOpen = ref(false)
const isEditing = ref(false)
const activeUserId = ref('')
const userForm = ref<{
  name: string
  nameKh: string
  email: string
  phone: string
  role: UserRole
  status: UserStatus
  department: string
}>({
  name: '',
  nameKh: '',
  email: '',
  phone: '',
  role: 'Citizen',
  status: 'Active',
  department: ''
})

function getRoleName(role: UserRole): string {
  if (currentLanguage.value === 'kh') {
    switch (role) {
      case 'Administrator': return 'អ្នកគ្រប់គ្រង'
      case 'Officer': return 'មន្ត្រីរដ្ឋ'
      case 'Specialist': return 'អ្នកឯកទេស'
      case 'Citizen': return 'ប្រជាពលរដ្ឋ'
    }
  }
  return role
}

function getStatusName(status: UserStatus): string {
  if (currentLanguage.value === 'kh') {
    switch (status) {
      case 'Active': return 'សកម្ម'
      case 'Pending': return 'រង់ចាំ'
      case 'Suspended': return 'ផ្អាក'
    }
  }
  return status
}

function openAddModal() {
  isEditing.value = false
  activeUserId.value = ''
  userForm.value = {
    name: '',
    nameKh: '',
    email: '',
    phone: '',
    role: 'Officer',
    status: 'Active',
    department: ''
  }
  isUserModalOpen.value = true
}

function openEditModal(u: UserRecord) {
  isEditing.value = true
  activeUserId.value = u.id
  userForm.value = {
    name: u.name,
    nameKh: u.nameKh || '',
    email: u.email,
    phone: u.phone,
    role: u.role,
    status: u.status,
    department: u.department || ''
  }
  isUserModalOpen.value = true
}

function saveUser() {
  if (!userForm.value.name.trim() || !userForm.value.email.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះ និងអ៊ីមែល!' : 'Please enter name and email!')
    return
  }

  if (isEditing.value) {
    const idx = users.value.findIndex(u => u.id === activeUserId.value)
    if (idx !== -1) {
      users.value[idx] = {
        ...users.value[idx],
        name: userForm.value.name.trim(),
        nameKh: userForm.value.nameKh.trim() || undefined,
        email: userForm.value.email.trim(),
        phone: userForm.value.phone.trim(),
        role: userForm.value.role,
        status: userForm.value.status,
        department: userForm.value.department.trim() || undefined
      }
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែទិន្នន័យជោគជ័យ!' : 'User updated successfully!')
    }
  } else {
    const newId = `usr-0${users.value.length + 1}`
    const today = new Date().toISOString().split('T')[0]
    users.value.unshift({
      id: newId,
      name: userForm.value.name.trim(),
      nameKh: userForm.value.nameKh.trim() || undefined,
      email: userForm.value.email.trim(),
      phone: userForm.value.phone.trim(),
      role: userForm.value.role,
      status: userForm.value.status,
      department: userForm.value.department.trim() || undefined,
      registeredDate: today
    })
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមអ្នកប្រើប្រាស់ថ្មី!' : 'New user created successfully!')
  }

  isUserModalOpen.value = false
}

function handleDelete(id: string) {
  if (id === 'usr-01') {
    alert(currentLanguage.value === 'kh' ? 'មិនអាចលុបគណនី Super Administrator មេបានទេ!' : 'Cannot delete primary Super Administrator account!')
    return
  }

  if (confirm(currentLanguage.value === 'kh' ? 'តើអ្នកប្រាកដជាចង់លុបគណនីនេះ?' : 'Delete this user?')) {
    users.value = users.value.filter(u => u.id !== id)
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបគណនីជោគជ័យ!' : 'User removed!')
  }
}
</script>

<template>
  <div class="space-y-5 select-none">
    
    <!-- 1. ROLE METRIC OVERVIEW CARDS -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      
      <!-- Card 1: Administrators -->
      <div
        @click="selectedRole = 'Administrator'"
        :class="[
          'p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs',
          selectedRole === 'Administrator'
            ? 'bg-purple-50/80 border-purple-400 ring-2 ring-purple-400/20'
            : 'bg-white border-slate-200/90 hover:border-purple-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Crown class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold text-purple-700 bg-purple-100/80 px-2 py-0.5 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សិទ្ធិពេញ' : 'Full Access' }}
          </span>
        </div>
        <div class="mt-3">
          <span class="text-2xl font-black text-slate-900 leading-tight block">{{ totalAdmins }}</span>
          <span class="text-xs font-bold text-slate-600 font-khmer mt-0.5 block truncate">
            {{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Administrators' }}
          </span>
        </div>
      </div>

      <!-- Card 2: Officers -->
      <div
        @click="selectedRole = 'Officer'"
        :class="[
          'p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs',
          selectedRole === 'Officer'
            ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-400/20'
            : 'bg-white border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <BadgeCheck class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold text-blue-700 bg-blue-100/80 px-2 py-0.5 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋ' : 'Government' }}
          </span>
        </div>
        <div class="mt-3">
          <span class="text-2xl font-black text-slate-900 leading-tight block">{{ totalOfficers }}</span>
          <span class="text-xs font-bold text-slate-600 font-khmer mt-0.5 block truncate">
            {{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋបាល' : 'Officers' }}
          </span>
        </div>
      </div>

      <!-- Card 3: Specialists -->
      <div
        @click="selectedRole = 'Specialist'"
        :class="[
          'p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs',
          selectedRole === 'Specialist'
            ? 'bg-teal-50/80 border-teal-400 ring-2 ring-teal-400/20'
            : 'bg-white border-slate-200/90 hover:border-teal-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-9 h-9 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
            <Briefcase class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold text-teal-700 bg-teal-100/80 px-2 py-0.5 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ជំនាញ' : 'Specialist' }}
          </span>
        </div>
        <div class="mt-3">
          <span class="text-2xl font-black text-slate-900 leading-tight block">{{ totalSpecialists }}</span>
          <span class="text-xs font-bold text-slate-600 font-khmer mt-0.5 block truncate">
            {{ currentLanguage === 'kh' ? 'អ្នកឯកទេស / សេវាកម្ម' : 'Specialists' }}
          </span>
        </div>
      </div>

      <!-- Card 4: Citizen Members -->
      <div
        @click="selectedRole = 'Citizen'"
        :class="[
          'p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs',
          selectedRole === 'Citizen'
            ? 'bg-slate-100 border-slate-400 ring-2 ring-slate-400/20'
            : 'bg-white border-slate-200/90 hover:border-slate-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
            <User class="w-4 h-4" />
          </div>
          <span class="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សាធារណៈ' : 'Public' }}
          </span>
        </div>
        <div class="mt-3">
          <span class="text-2xl font-black text-slate-900 leading-tight block">{{ totalCitizens }}</span>
          <span class="text-xs font-bold text-slate-600 font-khmer mt-0.5 block truncate">
            {{ currentLanguage === 'kh' ? 'ប្រជាពលរដ្ឋ' : 'Citizen Members' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION BAR WITH SEARCH, ROLE FILTER & MODAL TRIGGERS -->
    <div class="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      
      <!-- Left: Search & Filter Dropdowns -->
      <div class="flex items-center flex-wrap gap-2.5 flex-1">
        <!-- Search -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកឈ្មោះ, អ៊ីមែល, ផ្នែក...' : 'Search name, email, department...'"
            class="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-blue-500 font-khmer shadow-2xs"
          />
        </div>

        <!-- Role Select -->
        <select
          v-model="selectedRole"
          class="px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-2xs font-khmer"
        >
          <option value="All">{{ currentLanguage === 'kh' ? 'តួនាទីទាំងអស់' : 'All Roles' }}</option>
          <option value="Administrator">{{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Administrator' }}</option>
          <option value="Officer">{{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋ' : 'Officer' }}</option>
          <option value="Specialist">{{ currentLanguage === 'kh' ? 'អ្នកឯកទេស' : 'Specialist' }}</option>
          <option value="Citizen">{{ currentLanguage === 'kh' ? 'ប្រជាពលរដ្ឋ' : 'Citizen' }}</option>
        </select>

        <!-- Status Select -->
        <select
          v-model="selectedStatus"
          class="px-3 py-2 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 cursor-pointer shadow-2xs font-khmer"
        >
          <option value="All">{{ currentLanguage === 'kh' ? 'ស្ថានភាពទាំងអស់' : 'All Status' }}</option>
          <option value="Active">{{ currentLanguage === 'kh' ? 'សកម្ម' : 'Active' }}</option>
          <option value="Pending">{{ currentLanguage === 'kh' ? 'រង់ចាំ' : 'Pending' }}</option>
          <option value="Suspended">{{ currentLanguage === 'kh' ? 'ផ្អាក' : 'Suspended' }}</option>
        </select>
      </div>

      <!-- Right: Action Buttons -->
      <div class="flex items-center gap-2 shrink-0">
        <!-- View Permissions Matrix Button -->
        <button
          type="button"
          @click="isPermissionsModalOpen = true"
          class="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold font-khmer flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
          title="Role Permissions Matrix"
        >
          <ShieldCheck class="w-4 h-4 text-purple-600" />
          <span>{{ currentLanguage === 'kh' ? 'សិទ្ធិតាមតួនាទី' : 'Role Matrix' }}</span>
        </button>

        <!-- Add New User Button -->
        <button
          type="button"
          @click="openAddModal"
          class="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-khmer flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
        >
          <UserPlus class="w-4 h-4" />
          <span>{{ currentLanguage === 'kh' ? 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' : 'Add New User' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. USERS & ROLES TABLE -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3.5 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់ & ស្ថាប័ន' : 'User & Department' }}</th>
              <th class="py-3.5 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contact' }}</th>
              <th class="py-3.5 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'តួនាទីប្រព័ន្ធ' : 'Assigned Role' }}</th>
              <th class="py-3.5 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
              <th class="py-3.5 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Registered' }}</th>
              <th class="py-3.5 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="u in filteredUsers"
              :key="u.id"
              class="hover:bg-slate-50/70 transition-colors"
            >
              <!-- Name & Department -->
              <td class="py-3 px-4">
                <div class="flex items-center gap-3">
                  <!-- Avatar with Role Icon -->
                  <div
                    :class="[
                      'w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs',
                      u.role === 'Administrator' ? 'bg-purple-100 text-purple-700 ring-2 ring-purple-200' :
                      u.role === 'Officer' ? 'bg-blue-100 text-blue-700 ring-2 ring-blue-200' :
                      u.role === 'Specialist' ? 'bg-teal-100 text-teal-700 ring-2 ring-teal-200' :
                      'bg-slate-100 text-slate-700'
                    ]"
                  >
                    <Crown v-if="u.role === 'Administrator'" class="w-4 h-4" />
                    <BadgeCheck v-else-if="u.role === 'Officer'" class="w-4 h-4" />
                    <Briefcase v-else-if="u.role === 'Specialist'" class="w-4 h-4" />
                    <User v-else class="w-4 h-4" />
                  </div>
                  <div>
                    <div class="flex items-center gap-1.5">
                      <span class="font-bold text-slate-900 font-khmer block text-xs">
                        {{ currentLanguage === 'kh' && u.nameKh ? u.nameKh : u.name }}
                      </span>
                      <span v-if="u.id === 'usr-01'" class="px-1.5 py-0.2 rounded text-[9px] font-black bg-purple-100 text-purple-700 border border-purple-200 font-khmer">
                        {{ currentLanguage === 'kh' ? 'អភិបាលចម្បង' : 'Primary Admin' }}
                      </span>
                    </div>
                    <span class="text-[11px] text-slate-400 block mt-0.5 font-khmer">
                      {{ u.department || (currentLanguage === 'kh' ? 'គណនីទូទៅ' : 'General Account') }} · {{ currentLanguage === 'kh' ? 'កូដ' : 'ID' }}: {{ u.id }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Contact -->
              <td class="py-3 px-4 text-slate-600">
                <div class="flex flex-col">
                  <span class="inline-flex items-center gap-1.5 font-medium text-xs text-slate-700">
                    <Mail class="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {{ u.email }}
                  </span>
                  <span class="inline-flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <Phone class="w-3 h-3 shrink-0" />
                    {{ u.phone }}
                  </span>
                </div>
              </td>

              <!-- Role Badge -->
              <td class="py-3 px-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[11px] font-bold border shadow-2xs font-khmer',
                    u.role === 'Administrator' ? 'bg-purple-50 text-purple-800 border-purple-200/90' :
                    u.role === 'Officer' ? 'bg-blue-50 text-blue-800 border-blue-200/90' :
                    u.role === 'Specialist' ? 'bg-teal-50 text-teal-800 border-teal-200/90' :
                    'bg-slate-50 text-slate-700 border-slate-200/90'
                  ]"
                >
                  <Crown v-if="u.role === 'Administrator'" class="w-3 h-3 text-purple-600" />
                  <BadgeCheck v-else-if="u.role === 'Officer'" class="w-3 h-3 text-blue-600" />
                  <Briefcase v-else-if="u.role === 'Specialist'" class="w-3 h-3 text-teal-600" />
                  <User v-else class="w-3 h-3 text-slate-500" />
                  <span>{{ getRoleName(u.role) }}</span>
                </span>
              </td>

              <!-- Status -->
              <td class="py-3 px-4">
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border font-khmer',
                    u.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    u.status === 'Pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-rose-50 text-rose-700 border-rose-200'
                  ]"
                >
                  <span
                    :class="[
                      'w-1.5 h-1.5 rounded-full',
                      u.status === 'Active' ? 'bg-emerald-500' :
                      u.status === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'
                    ]"
                  ></span>
                  <span>{{ getStatusName(u.status) }}</span>
                </span>
              </td>

              <!-- Registered Date -->
              <td class="py-3 px-4 text-slate-400 text-xs">
                {{ u.registeredDate }}
              </td>

              <!-- Actions -->
              <td class="py-3 px-4 text-right">
                <div class="flex items-center justify-end gap-1">
                  <!-- Edit Role / User -->
                  <button
                    type="button"
                    @click="openEditModal(u)"
                    class="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                    title="Edit Role & Details"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="handleDelete(u.id)"
                    :class="[
                      'p-1.5 rounded-lg transition-colors cursor-pointer',
                      u.id === 'usr-01' ? 'text-slate-300 hover:text-slate-400 cursor-not-allowed' : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                    ]"
                    :title="u.id === 'usr-01' ? 'Protected Administrator' : 'Delete user'"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="py-8 text-center text-xs text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'រកមិនឃើញអ្នកប្រើប្រាស់ដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ' : 'No users found matching your criteria.' }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 4. ROLE PERMISSIONS MATRIX MODAL -->
    <div
      v-if="isPermissionsModalOpen"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    >
      <div class="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-xs">
              <ShieldCheck class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900 font-khmer">
                {{ currentLanguage === 'kh' ? 'តារាងកំណត់សិទ្ធិតាមតួនាទី (Role Permissions Matrix)' : 'Role Permissions & Access Matrix' }}
              </h3>
              <p class="text-xs text-slate-400">Security authorization tiers for CamLife Civic CMS</p>
            </div>
          </div>
          <button
            type="button"
            @click="isPermissionsModalOpen = false"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Matrix Content -->
        <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <!-- Administrator Tier -->
          <div class="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Crown class="w-4 h-4 text-purple-700" />
                <h4 class="text-sm font-bold text-purple-900 font-khmer">Tier 1: Administrator (Super Admin)</h4>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-200 text-purple-800">
                Full Authorization
              </span>
            </div>
            <p class="text-xs text-purple-950 font-khmer">
              {{ currentLanguage === 'kh' ? 'សិទ្ធិពេញលេញលើប្រព័ន្ធទាំងមូល៖ បង្កើត កែប្រែ លុបមាតិកាគ្រប់ផ្នែក, កំណត់សិទ្ធិតួនាទីអ្នកប្រើ, កែប្រែការកំណត់ប្រព័ន្ធ, និងពិនិត្យកំណត់ហេតុសវនកម្ម (Audit Logs)។' : 'Full CRUD access across all civic modules, user role management, system settings configuration, and complete security audit log oversight.' }}
            </p>
          </div>

          <!-- Officer Tier -->
          <div class="p-4 rounded-2xl bg-blue-50/50 border border-blue-200 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <BadgeCheck class="w-4 h-4 text-blue-700" />
                <h4 class="text-sm font-bold text-blue-900 font-khmer">Tier 2: Government Officer (មន្ត្រីរដ្ឋបាល)</h4>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-200 text-blue-800">
                Civic Moderator
              </span>
            </div>
            <p class="text-xs text-blue-950 font-khmer">
              {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងសេវាសាធារណៈ, ពិនិត្យនិងអនុម័តការងារ/ព័ត៌មាន, ឆ្លើយតបមតិយោបល់ពលរដ្ឋ, មិនអាចកែប្រែការកំណត់ប្រព័ន្ធឬតួនាទី Admin បានទេ។' : 'Create & edit government service guides, moderate and approve submitted jobs/bulletins, reply to citizen reports. Cannot alter system settings or admin roles.' }}
            </p>
          </div>

          <!-- Specialist Tier -->
          <div class="p-4 rounded-2xl bg-teal-50/50 border border-teal-200 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <Briefcase class="w-4 h-4 text-teal-700" />
                <h4 class="text-sm font-bold text-teal-900 font-khmer">Tier 3: Service Specialist (អ្នកឯកទេស)</h4>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-200 text-teal-800">
                Service Provider
              </span>
            </div>
            <p class="text-xs text-teal-950 font-khmer">
              {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងព័ត៌មានសេវាកម្មជួសជុលគេហដ្ឋាន, ប្រវត្តិរូបមន្ទីរពេទ្យ/គ្លីនិក, ទទួលសំណើសេវាពីប្រជាពលរដ្ឋ។' : 'Manage home repairs listings, hospital profiles, contact details, and respond to direct service requests.' }}
            </p>
          </div>

          <!-- Citizen Tier -->
          <div class="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <User class="w-4 h-4 text-slate-700" />
                <h4 class="text-sm font-bold text-slate-900 font-khmer">Tier 4: Citizen Member (ប្រជាពលរដ្ឋ)</h4>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-700">
                Public Consumer
              </span>
            </div>
            <p class="text-xs text-slate-600 font-khmer">
              {{ currentLanguage === 'kh' ? 'ចូលមើលឯកសារណែនាំសេវាសាធារណៈ, រក្សាទុកការងារ, ដាក់ពាក្យការងារ, ផ្ញើមតិយោបល់ និងរាយការណ៍បញ្ហាសង្គម។' : 'Search & view civic resources, save services and jobs, apply to career listings, and submit citizen feedback & inquiries.' }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div class="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            @click="isPermissionsModalOpen = false"
            class="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បិទផ្ទាំង' : 'Close Matrix' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 5. ADD / EDIT USER & ROLE MODAL -->
    <div
      v-if="isUserModalOpen"
      class="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    >
      <div class="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shadow-xs">
              <UserPlus v-if="!isEditing" class="w-5 h-5" />
              <Edit2 v-else class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base font-black text-slate-900 font-khmer">
                {{ isEditing
                  ? (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាន និងតួនាទី' : 'Edit User & Role Assignment')
                  : (currentLanguage === 'kh' ? 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' : 'Add New User & Assign Role')
                }}
              </h3>
              <p class="text-xs text-slate-400">Role-based Access Control configuration</p>
            </div>
          </div>
          <button
            type="button"
            @click="isUserModalOpen = false"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Form Body -->
        <form @submit.prevent="saveUser" class="p-6 space-y-3.5 text-xs">
          <!-- Full Name -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះជាឡាតាំង (Full Name in English) *</label>
            <input
              v-model="userForm.name"
              type="text"
              placeholder="e.g. Chan Dara"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
              required
            />
          </div>

          <!-- Name in Khmer -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះជាភាសាខ្មែរ (Name in Khmer)</label>
            <input
              v-model="userForm.nameKh"
              type="text"
              placeholder="ឧទាហរណ៍៖ ចាន់ តារា"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-khmer"
            />
          </div>

          <!-- Email & Phone -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">អ៊ីមែល (Email) *</label>
              <input
                v-model="userForm.email"
                type="email"
                placeholder="user@camlife.gov.kh"
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
                required
              />
            </div>
            <div>
              <label class="block font-bold text-slate-700 mb-1 font-khmer">លេខទូរស័ព្ទ (Phone)</label>
              <input
                v-model="userForm.phone"
                type="text"
                placeholder="012 345 678"
                class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
          </div>

          <!-- Role Assignment (Crucial for Role Admin) -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">កំណត់តួនាទី (Assign System Role) *</label>
            <div class="grid grid-cols-2 gap-2">
              <label
                :class="[
                  'flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                  userForm.role === 'Administrator' ? 'border-purple-500 bg-purple-50/80' : 'border-slate-200 bg-slate-50'
                ]"
              >
                <input type="radio" value="Administrator" v-model="userForm.role" class="text-purple-600" />
                <Crown class="w-3.5 h-3.5 text-purple-700 shrink-0" />
                <div class="leading-none">
                  <span class="font-bold text-purple-900 block text-[11px]">Administrator</span>
                  <span class="text-[9px] text-purple-600 font-khmer">អ្នកគ្រប់គ្រង</span>
                </div>
              </label>

              <label
                :class="[
                  'flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                  userForm.role === 'Officer' ? 'border-blue-500 bg-blue-50/80' : 'border-slate-200 bg-slate-50'
                ]"
              >
                <input type="radio" value="Officer" v-model="userForm.role" class="text-blue-600" />
                <BadgeCheck class="w-3.5 h-3.5 text-blue-700 shrink-0" />
                <div class="leading-none">
                  <span class="font-bold text-blue-900 block text-[11px]">Officer</span>
                  <span class="text-[9px] text-blue-600 font-khmer">មន្ត្រីរដ្ឋ</span>
                </div>
              </label>

              <label
                :class="[
                  'flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                  userForm.role === 'Specialist' ? 'border-teal-500 bg-teal-50/80' : 'border-slate-200 bg-slate-50'
                ]"
              >
                <input type="radio" value="Specialist" v-model="userForm.role" class="text-teal-600" />
                <Briefcase class="w-3.5 h-3.5 text-teal-700 shrink-0" />
                <div class="leading-none">
                  <span class="font-bold text-teal-900 block text-[11px]">Specialist</span>
                  <span class="text-[9px] text-teal-600 font-khmer">អ្នកឯកទេស</span>
                </div>
              </label>

              <label
                :class="[
                  'flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all',
                  userForm.role === 'Citizen' ? 'border-slate-500 bg-slate-100' : 'border-slate-200 bg-slate-50'
                ]"
              >
                <input type="radio" value="Citizen" v-model="userForm.role" class="text-slate-600" />
                <User class="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <div class="leading-none">
                  <span class="font-bold text-slate-900 block text-[11px]">Citizen</span>
                  <span class="text-[9px] text-slate-600 font-khmer">ប្រជាពលរដ្ឋ</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Department / Organization -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ស្ថាប័ន / អង្គភាព (Department / Org)</label>
            <input
              v-model="userForm.department"
              type="text"
              placeholder="e.g. Ministry of Interior / OWSO"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-medium"
            />
          </div>

          <!-- Status -->
          <div>
            <label class="block font-bold text-slate-700 mb-1 font-khmer">ស្ថានភាពគណនី (Account Status)</label>
            <select
              v-model="userForm.status"
              class="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500 font-bold"
            >
              <option value="Active">Active (ដំណើរការធម្មតា)</option>
              <option value="Pending">Pending (រង់ចាំការផ្ទៀងផ្ទាត់)</option>
              <option value="Suspended">Suspended (ផ្អាកដំណើរការ)</option>
            </select>
          </div>

          <!-- Modal Footer -->
          <div class="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              @click="isUserModalOpen = false"
              class="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold font-khmer cursor-pointer"
            >
              {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
            </button>
            <button
              type="submit"
              class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold font-khmer cursor-pointer shadow-xs"
            >
              {{ isEditing
                ? (currentLanguage === 'kh' ? 'រក្សាទុកការកែប្រែ' : 'Save Changes')
                : (currentLanguage === 'kh' ? 'បង្កើតអ្នកប្រើប្រាស់' : 'Create User')
              }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>
