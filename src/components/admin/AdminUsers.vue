<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import {
  Search,
  Mail,
  Phone,
  Trash2,
  Edit2,
  Eye,
  UserPlus,
  ShieldCheck,
  Crown,
  BadgeCheck,
  Briefcase,
  User,
  X,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  ArrowLeft
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

// -------------------------------------------------------------
// LOCAL STORAGE PERSISTENCE
// -------------------------------------------------------------
function loadUsers(): UserRecord[] {
  const defaultUsers: UserRecord[] = [
    { id: 'usr-01', name: 'Admin Officer', nameKh: 'មន្ត្រីរដ្ឋបាលជាន់ខ្ពស់', email: 'admin@gmail.com', phone: '012 999 888', role: 'Administrator', status: 'Active', department: 'Office of the Prime Minister', registeredDate: '2026-01-15' },
    { id: 'usr-02', name: 'Sok Dara', nameKh: 'សុខ តារា', email: 'dara.sok@gmail.com', phone: '098 123 456', role: 'Specialist', status: 'Active', department: 'Electric & AC Repairs', registeredDate: '2026-02-10' },
    { id: 'usr-03', name: 'Chan Bopha', nameKh: 'ចាន់ បុប្ផា', email: 'bopha.chan@outlook.com', phone: '077 555 333', role: 'Citizen', status: 'Active', department: 'Phnom Penh Resident', registeredDate: '2026-02-18' },
    { id: 'usr-04', name: 'Khem Sreypov', nameKh: 'ខែម ស្រីពៅ', email: 'sreypov.khem@gov.kh', phone: '010 444 222', role: 'Officer', status: 'Active', department: 'Ministry of Interior / OWSO', registeredDate: '2026-03-01' },
    { id: 'usr-05', name: 'Vicheka Nget', nameKh: 'វិច្ឆិកា ង៉ែត', email: 'vicheka@gmail.com', phone: '085 777 999', role: 'Citizen', status: 'Active', department: 'Kandal Resident', registeredDate: '2026-03-05' },
    { id: 'usr-06', name: 'Dr. Mengly Sarun', nameKh: 'វេជ្ជបណ្ឌិត ម៉េងលី សារុន', email: 'dr.mengly@calmette.gov.kh', phone: '012 334 556', role: 'Specialist', status: 'Active', department: 'Calmette Hospital Cardiology', registeredDate: '2026-03-08' },
    { id: 'usr-07', name: 'Pich Samnang', nameKh: 'ពេជ្រ សំណាង', email: 'samnang.pich@gov.kh', phone: '011 223 344', role: 'Officer', status: 'Active', department: 'Phnom Penh City Hall', registeredDate: '2026-03-10' },
    { id: 'usr-08', name: 'Keo Sovann', nameKh: 'កែវ សុវណ្ណ', email: 'sovann.keo@gmail.com', phone: '015 889 977', role: 'Citizen', status: 'Pending', department: 'Siem Reap Resident', registeredDate: '2026-03-12' }
  ]

  try {
    const saved = localStorage.getItem('camlife_admin_users')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch {}
  return defaultUsers
}

const users = ref<UserRecord[]>(loadUsers())

function persistUsers() {
  try {
    localStorage.setItem('camlife_admin_users', JSON.stringify(users.value))
  } catch {}
}

// -------------------------------------------------------------
// TOP 4 EXECUTIVE KPIS
// -------------------------------------------------------------
const totalAdmins = computed(() => users.value.filter(u => u.role === 'Administrator').length)
const totalOfficers = computed(() => users.value.filter(u => u.role === 'Officer').length)
const totalSpecialists = computed(() => users.value.filter(u => u.role === 'Specialist').length)
const totalCitizens = computed(() => users.value.filter(u => u.role === 'Citizen').length)

// -------------------------------------------------------------
// FILTERS & SEARCH
// -------------------------------------------------------------
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
      (u.name || '').toLowerCase().includes(q) ||
      (u.nameKh && u.nameKh.toLowerCase().includes(q)) ||
      (u.email || '').toLowerCase().includes(q) ||
      (u.phone || '').includes(q) ||
      (u.department && u.department.toLowerCase().includes(q))
    return matchRole && matchStatus && matchSearch
  })
})

// -------------------------------------------------------------
// PAGINATION STATE (FULL SCREEN VIEWPORT FIT)
// -------------------------------------------------------------
const currentPage = ref(1)
const itemsPerPage = ref(8)

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / itemsPerPage.value) || 1)

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredUsers.value.slice(start, start + itemsPerPage.value)
})

watch([searchQuery, selectedRole, selectedStatus, itemsPerPage], () => {
  currentPage.value = 1
})

function goToPage(p: number) {
  if (p >= 1 && p <= totalPages.value) {
    currentPage.value = p
  }
}

// -------------------------------------------------------------
// ROLE HELPERS & LABELS
// -------------------------------------------------------------
function getRoleLabel(role: UserRole): string {
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

function getRoleBadgeColor(role: UserRole) {
  switch (role) {
    case 'Administrator':
      return { bg: 'bg-purple-50 text-purple-700 border-purple-200/90', iconBg: 'bg-purple-100 text-purple-700' }
    case 'Officer':
      return { bg: 'bg-blue-50 text-blue-700 border-blue-200/90', iconBg: 'bg-blue-100 text-blue-700' }
    case 'Specialist':
      return { bg: 'bg-teal-50 text-teal-700 border-teal-200/90', iconBg: 'bg-teal-100 text-teal-700' }
    case 'Citizen':
      return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/90', iconBg: 'bg-emerald-100 text-emerald-700' }
  }
}

// -------------------------------------------------------------
// NAVIGATION VIEW STATE (In-Admin Sub-page Navigation)
// -------------------------------------------------------------
const currentView = ref<'list' | 'detail' | 'form'>('list')
const selectedDetailUser = ref<UserRecord | null>(null)
const isPermissionsModalOpen = ref(false)
const isEditing = ref(false)
const activeUserId = ref('')

function backToList() {
  currentView.value = 'list'
  selectedDetailUser.value = null
  activeUserId.value = ''
  isEditing.value = false
}

function openDetailModal(u: UserRecord) {
  selectedDetailUser.value = u
  currentView.value = 'detail'
}

// -------------------------------------------------------------
// ADD / EDIT FORM STATE
// -------------------------------------------------------------
const userForm = reactive({
  name: '',
  nameKh: '',
  email: '',
  phone: '',
  role: 'Citizen' as UserRole,
  status: 'Active' as UserStatus,
  department: ''
})

function openAddModal() {
  isEditing.value = false
  activeUserId.value = ''
  userForm.name = ''
  userForm.nameKh = ''
  userForm.email = ''
  userForm.phone = ''
  userForm.role = 'Citizen'
  userForm.status = 'Active'
  userForm.department = ''
  currentView.value = 'form'
}

function openEditModal(u: UserRecord) {
  isEditing.value = true
  activeUserId.value = u.id
  userForm.name = u.name
  userForm.nameKh = u.nameKh || u.name
  userForm.email = u.email
  userForm.phone = u.phone
  userForm.role = u.role
  userForm.status = u.status
  userForm.department = u.department || ''
  currentView.value = 'form'
}

function saveUser() {
  if (!userForm.name.trim() || !userForm.email.trim()) {
    alert(currentLanguage.value === 'kh' ? 'សូមបំពេញឈ្មោះ និងអ៊ីមែល!' : 'Please enter name and email!')
    return
  }

  if (isEditing.value && activeUserId.value) {
    const idx = users.value.findIndex(u => u.id === activeUserId.value)
    if (idx !== -1) {
      users.value[idx] = {
        ...users.value[idx],
        name: userForm.name.trim(),
        nameKh: userForm.nameKh.trim() || userForm.name.trim(),
        email: userForm.email.trim(),
        phone: userForm.phone.trim(),
        role: userForm.role,
        status: userForm.status,
        department: userForm.department.trim()
      }
      persistUsers()
      emit('show-toast', currentLanguage.value === 'kh' ? 'បានកែប្រែព័ត៌មានអ្នកប្រើប្រាស់ជោគជ័យ!' : 'User updated successfully!')
    }
  } else {
    const newUser: UserRecord = {
      id: 'usr-' + String(users.value.length + 1).padStart(2, '0'),
      name: userForm.name.trim(),
      nameKh: userForm.nameKh.trim() || userForm.name.trim(),
      email: userForm.email.trim(),
      phone: userForm.phone.trim(),
      role: userForm.role,
      status: userForm.status,
      department: userForm.department.trim() || 'General Citizen',
      registeredDate: new Date().toISOString().split('T')[0]
    }
    users.value.unshift(newUser)
    persistUsers()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានបន្ថែមអ្នកប្រើប្រាស់ថ្មីជោគជ័យ!' : 'New user created successfully!')
  }

  backToList()
}

// 3. Delete Modal
const isDeleteModalOpen = ref(false)
const deletingUser = ref<UserRecord | null>(null)

function promptDelete(u: UserRecord) {
  if (u.id === 'usr-01') {
    alert(currentLanguage.value === 'kh' ? 'មិនអាចលុបគណនីអភិបាលចម្បងបានទេ!' : 'Cannot delete the primary administrator!')
    return
  }
  deletingUser.value = u
  isDeleteModalOpen.value = true
}

function confirmDelete() {
  if (deletingUser.value) {
    const id = deletingUser.value.id
    users.value = users.value.filter(u => u.id !== id)
    persistUsers()
    emit('show-toast', currentLanguage.value === 'kh' ? 'បានលុបអ្នកប្រើប្រាស់ជោគជ័យ!' : 'User deleted successfully!')
  }
  isDeleteModalOpen.value = false
  deletingUser.value = null
}
</script>

<template>
  <div class="h-full flex flex-col justify-between gap-2 sm:gap-2.5 select-none">
    <!-- VIEW 1: TABLE & KPI STATS LIST VIEW -->
    <div v-if="currentView === 'list'" class="h-full flex flex-col justify-between gap-2 sm:gap-2.5">
    
      <!-- 1. TOP METRIC STAT CARDS (4 EXECUTIVE KPIS) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5 shrink-0">
      
      <!-- Card 1: Administrators -->
      <div
        @click="selectedRole = 'Administrator'; selectedStatus = 'All'; searchQuery = ''"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedRole === 'Administrator'
            ? 'border-purple-300 ring-2 ring-purple-400/20 bg-purple-50/20'
            : 'border-slate-200/90 hover:border-purple-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Crown class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សិទ្ធិពេញ' : 'Full Access' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalAdmins }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រងប្រព័ន្ធ' : 'Administrators' }}
          </span>
        </div>
      </div>

      <!-- Card 2: Officers -->
      <div
        @click="selectedRole = 'Officer'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedRole === 'Officer'
            ? 'border-blue-300 ring-2 ring-blue-400/20 bg-blue-50/20'
            : 'border-slate-200/90 hover:border-blue-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <BadgeCheck class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋ' : 'Gov Staff' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalOfficers }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋបាល & OWSO' : 'Officers' }}
          </span>
        </div>
      </div>

      <!-- Card 3: Specialists -->
      <div
        @click="selectedRole = 'Specialist'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedRole === 'Specialist'
            ? 'border-teal-300 ring-2 ring-teal-400/20 bg-teal-50/20'
            : 'border-slate-200/90 hover:border-teal-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Briefcase class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-teal-700 bg-teal-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'ជំនាញ' : 'Technicians' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalSpecialists }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'អ្នកឯកទេស / សេវាកម្ម' : 'Specialists' }}
          </span>
        </div>
      </div>

      <!-- Card 4: Citizen Members -->
      <div
        @click="selectedRole = 'Citizen'"
        :class="[
          'bg-white rounded-xl py-2 px-3 border transition-all cursor-pointer shadow-2xs group flex flex-col justify-between',
          selectedRole === 'Citizen'
            ? 'border-emerald-300 ring-2 ring-emerald-400/20 bg-emerald-50/20'
            : 'border-slate-200/90 hover:border-emerald-300'
        ]"
      >
        <div class="flex items-center justify-between">
          <div class="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <User class="w-3.5 h-3.5" />
          </div>
          <span class="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-full font-khmer">
            {{ currentLanguage === 'kh' ? 'សាធារណៈ' : 'Public' }}
          </span>
        </div>
        <div class="mt-1">
          <span class="text-lg sm:text-xl font-black text-slate-900 block leading-tight">{{ totalCitizens }}</span>
          <span class="text-[10px] sm:text-[11px] font-bold text-slate-600 font-khmer block mt-0.5 truncate">
            {{ currentLanguage === 'kh' ? 'ប្រជាពលរដ្ឋទូទៅ' : 'Citizen Members' }}
          </span>
        </div>
      </div>

    </div>

    <!-- 2. ACTION & FILTER TOOLBAR -->
    <div class="bg-white rounded-xl p-2 sm:p-2.5 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 shrink-0">
      
      <!-- Left: Search & Filter Dropdowns -->
      <div class="flex flex-wrap items-center gap-2 flex-1">
        
        <!-- Search Input with Clear Button -->
        <div class="relative flex-1 min-w-[200px] max-w-sm">
          <Search class="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកឈ្មោះ, អ៊ីមែល, ផ្នែក...' : 'Search name, email, department...'"
            class="w-full pl-9 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/90 focus:border-blue-500 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-khmer shadow-2xs"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
          >
            <X class="w-3 h-3" />
          </button>
        </div>

        <!-- Role Select -->
        <div class="relative">
          <select
            v-model="selectedRole"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'តួនាទីទាំងអស់' : 'All Roles' }}</option>
            <option value="Administrator">{{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Administrator' }}</option>
            <option value="Officer">{{ currentLanguage === 'kh' ? 'មន្ត្រីរដ្ឋ' : 'Officer' }}</option>
            <option value="Specialist">{{ currentLanguage === 'kh' ? 'អ្នកឯកទេស' : 'Specialist' }}</option>
            <option value="Citizen">{{ currentLanguage === 'kh' ? 'ប្រជាពលរដ្ឋ' : 'Citizen' }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

        <!-- Status Select -->
        <div class="relative">
          <select
            v-model="selectedStatus"
            class="pl-2.5 pr-7 py-1.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-200/90 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 transition-all font-khmer appearance-none shadow-2xs"
          >
            <option value="All">{{ currentLanguage === 'kh' ? 'ស្ថានភាពទាំងអស់' : 'All Status' }}</option>
            <option value="Active">{{ currentLanguage === 'kh' ? 'សកម្ម' : 'Active' }}</option>
            <option value="Pending">{{ currentLanguage === 'kh' ? 'រង់ចាំ' : 'Pending' }}</option>
            <option value="Suspended">{{ currentLanguage === 'kh' ? 'ផ្អាក' : 'Suspended' }}</option>
          </select>
          <div class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">
            <svg class="w-3 h-3 fill-current" viewBox="0 0 20 20">
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
            </svg>
          </div>
        </div>

      </div>

      <!-- Right: Role Matrix & Add User Buttons -->
      <div class="flex items-center gap-2 shrink-0 justify-end">
        <button
          type="button"
          @click="isPermissionsModalOpen = true"
          class="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-[11px] font-bold font-khmer flex items-center gap-1 transition-all shadow-2xs cursor-pointer"
        >
          <ShieldCheck class="w-3.5 h-3.5 text-blue-600" />
          <span>{{ currentLanguage === 'kh' ? 'សិទ្ធិតាមតួនាទី' : 'Role Matrix' }}</span>
        </button>

        <button
          type="button"
          @click="openAddModal"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-bold font-khmer shadow-xs transition-all cursor-pointer"
        >
          <UserPlus class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' : 'Add User' }}</span>
        </button>
      </div>

    </div>

    <!-- 3. USERS DATA TABLE (SINGLE SCREEN & PAGINATED) -->
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden flex-1 min-h-0 flex flex-col justify-between">
      
      <div class="overflow-x-auto overflow-y-auto flex-1 min-h-0">
        <table class="w-full table-fixed text-left text-xs border-collapse min-w-[680px] lg:min-w-full">
          
          <!-- Table Header -->
          <thead class="bg-slate-50/95 border-b border-slate-200/90 text-slate-600 font-bold text-[11px] sticky top-0 z-10 backdrop-blur-xs">
            <tr>
              <th class="py-2 px-3.5 font-khmer w-[27%]">{{ currentLanguage === 'kh' ? 'អ្នកប្រើប្រាស់ & ស្ថាប័ន' : 'User & Department' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[22%]">{{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contact' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[15%]">{{ currentLanguage === 'kh' ? 'តួនាទីប្រព័ន្ធ' : 'Assigned Role' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[11%]">{{ currentLanguage === 'kh' ? 'ស្ថានភាព' : 'Status' }}</th>
              <th class="py-2 px-2.5 font-khmer w-[11%]">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Registered' }}</th>
              <th class="py-2 px-3 text-right font-khmer w-[14%]">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Actions' }}</th>
            </tr>
          </thead>

          <!-- Table Body (Paginated: 8 items per page) -->
          <tbody class="divide-y divide-slate-100">
            <tr
              v-for="u in paginatedUsers"
              :key="u.id"
              class="hover:bg-blue-50/30 transition-all duration-150 group h-11 sm:h-12"
            >
              
              <!-- 1. Name & Department -->
              <td class="py-1.5 px-3.5 align-middle">
                <div class="flex items-center gap-2 min-w-0">
                  <div
                    :class="[
                      'w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs group-hover:scale-105 transition-transform',
                      getRoleBadgeColor(u.role).iconBg
                    ]"
                  >
                    <Crown v-if="u.role === 'Administrator'" class="w-3.5 h-3.5" />
                    <BadgeCheck v-else-if="u.role === 'Officer'" class="w-3.5 h-3.5" />
                    <Briefcase v-else-if="u.role === 'Specialist'" class="w-3.5 h-3.5" />
                    <User v-else class="w-3.5 h-3.5" />
                  </div>
                  <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span
                        class="font-bold text-slate-900 font-khmer block text-xs group-hover:text-blue-600 transition-colors truncate"
                        :title="currentLanguage === 'kh' && u.nameKh ? u.nameKh : u.name"
                      >
                        {{ currentLanguage === 'kh' && u.nameKh ? u.nameKh : u.name }}
                      </span>
                      <span v-if="u.id === 'usr-01'" class="px-1.5 py-0.2 rounded text-[8.5px] font-black bg-purple-100 text-purple-700 border border-purple-200 font-khmer shrink-0">
                        {{ currentLanguage === 'kh' ? 'អភិបាល' : 'Admin' }}
                      </span>
                    </div>
                    <span class="text-[9.5px] text-slate-400 block mt-0.5 font-khmer truncate">
                      {{ u.department || 'General' }} · ID: {{ u.id }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- 2. Contact -->
              <td class="py-1.5 px-2.5 align-middle">
                <div class="min-w-0">
                  <div class="inline-flex items-center gap-1 font-medium text-[11px] text-slate-700 truncate max-w-full" :title="u.email">
                    <Mail class="w-3 h-3 text-slate-400 shrink-0" />
                    <span class="truncate">{{ u.email }}</span>
                  </div>
                  <div class="inline-flex items-center gap-1 text-[9.5px] text-slate-400 font-mono mt-0.5 truncate max-w-full">
                    <Phone class="w-2.5 h-2.5 text-slate-400 shrink-0" />
                    <span class="truncate">{{ u.phone }}</span>
                  </div>
                </div>
              </td>

              <!-- 3. Assigned Role -->
              <td class="py-1.5 px-2.5 align-middle">
                <span :class="['inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize shadow-2xs truncate max-w-full', getRoleBadgeColor(u.role).bg]">
                  {{ getRoleLabel(u.role) }}
                </span>
              </td>

              <!-- 4. Status -->
              <td class="py-1.5 px-2.5 align-middle">
                <span
                  :class="[
                    'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs font-khmer',
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
                  {{ u.status === 'Active' ? (currentLanguage === 'kh' ? 'សកម្ម' : 'Active') : u.status }}
                </span>
              </td>

              <!-- 5. Registered Date -->
              <td class="py-1.5 px-2.5 align-middle">
                <span class="text-[11px] text-slate-600 font-mono">
                  {{ u.registeredDate }}
                </span>
              </td>

              <!-- 6. Actions (View Details, Edit, Delete) -->
              <td class="py-1.5 px-3 align-middle text-right">
                <div class="flex items-center justify-end gap-1">
                  
                  <!-- View Details -->
                  <button
                    type="button"
                    @click="openDetailModal(u)"
                    class="w-7 h-7 rounded-lg bg-sky-50 hover:bg-sky-600 text-sky-600 hover:text-white border border-sky-200/60 hover:border-sky-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'មើលលម្អិត' : 'View Details'"
                  >
                    <Eye class="w-3.5 h-3.5" />
                  </button>

                  <!-- Edit -->
                  <button
                    type="button"
                    @click="openEditModal(u)"
                    class="w-7 h-7 rounded-lg bg-amber-50 hover:bg-amber-600 text-amber-600 hover:text-white border border-amber-200/60 hover:border-amber-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
                    :title="currentLanguage === 'kh' ? 'កែប្រែ' : 'Edit User'"
                  >
                    <Edit2 class="w-3.5 h-3.5" />
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    @click="promptDelete(u)"
                    :disabled="u.id === 'usr-01'"
                    :class="[
                      'w-7 h-7 rounded-lg border flex items-center justify-center transition-all shadow-2xs shrink-0',
                      u.id === 'usr-01'
                        ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200'
                        : 'bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border-rose-200/60 hover:border-rose-600 cursor-pointer hover:scale-105 active:scale-95'
                    ]"
                    :title="currentLanguage === 'kh' ? 'លុប' : 'Delete User'"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </td>

            </tr>

            <!-- Empty State -->
            <tr v-if="filteredUsers.length === 0">
              <td colspan="6" class="py-8 text-center">
                <div class="flex flex-col items-center justify-center max-w-sm mx-auto">
                  <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 mb-2">
                    <AlertCircle class="w-5 h-5" />
                  </div>
                  <h4 class="text-xs font-bold text-slate-800 font-khmer">
                    {{ currentLanguage === 'kh' ? 'រកមិនឃើញអ្នកប្រើប្រាស់ទេ' : 'No users found' }}
                  </h4>
                  <p class="text-[11px] text-slate-400 mt-0.5 font-khmer">
                    {{ currentLanguage === 'kh' ? 'សូមសាកល្បងផ្លាស់ប្តូរតម្រង ឬសម្អាតការស្វែងរក' : 'Try adjusting your search query or filters.' }}
                  </p>
                  <button
                    type="button"
                    @click="searchQuery = ''; selectedRole = 'All'; selectedStatus = 'All'"
                    class="mt-2 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold font-khmer cursor-pointer transition-colors"
                  >
                    {{ currentLanguage === 'kh' ? 'សម្អាតការស្វែងរក' : 'Clear filters' }}
                  </button>
                </div>
              </td>
            </tr>

          </tbody>

        </table>
      </div>

      <!-- Table Footer with Interactive Pagination Controls -->
      <div class="p-2 sm:p-2.5 bg-slate-50/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 shrink-0">
        <!-- Showing entries count info -->
        <div class="text-[11px] text-slate-600 font-medium font-khmer">
          {{ currentLanguage === 'kh' 
            ? `បង្ហាញ ${(currentPage - 1) * itemsPerPage + 1} ដល់ ${Math.min(currentPage * itemsPerPage, filteredUsers.length)} នៃ ${filteredUsers.length} នាក់សរុប` 
            : `Showing ${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredUsers.length)} of ${filteredUsers.length} users` 
          }}
        </div>

        <div class="flex items-center gap-3">
          <!-- Page size selector -->
          <div class="flex items-center gap-1.5 text-[11px] font-khmer">
            <span class="text-slate-500">{{ currentLanguage === 'kh' ? 'ក្នុងមួយទំព័រ:' : 'Show:' }}</span>
            <select
              v-model="itemsPerPage"
              class="bg-white border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 shadow-2xs"
            >
              <option :value="8">8</option>
              <option :value="10">10</option>
              <option :value="15">15 ({{ currentLanguage === 'kh' ? 'ទាំងអស់' : 'All' }})</option>
            </select>
          </div>

          <!-- Pagination Buttons -->
          <div class="flex items-center gap-1">
            <!-- Previous Button -->
            <button
              type="button"
              :disabled="currentPage === 1"
              @click="goToPage(currentPage - 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <ChevronLeft class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'មុន' : 'Prev' }}</span>
            </button>

            <!-- Page Numbers -->
            <div class="flex items-center gap-1">
              <button
                v-for="p in totalPages"
                :key="p"
                type="button"
                @click="goToPage(p)"
                :class="[
                  'w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center',
                  currentPage === p
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 border border-slate-200 text-slate-700'
                ]"
              >
                {{ p }}
              </button>
            </div>

            <!-- Next Button -->
            <button
              type="button"
              :disabled="currentPage === totalPages"
              @click="goToPage(currentPage + 1)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-bold font-khmer transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer bg-white border-slate-200 hover:bg-slate-100 text-slate-700 shadow-2xs"
            >
              <span>{{ currentLanguage === 'kh' ? 'បន្ទាប់' : 'Next' }}</span>
              <ChevronRight class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW 2: VIEW USER DETAIL (SUB-PAGE)                      -->
    <!-- ======================================================== -->
    <div
      v-else-if="currentView === 'detail' && selectedDetailUser"
      class="h-full flex flex-col gap-3 overflow-hidden select-text animate-in fade-in duration-200"
    >
      <!-- Top Action Bar -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="backToList"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs font-khmer transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft class="w-4 h-4 text-slate-600" />
            <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Back' }}</span>
          </button>
          <div class="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <div class="hidden sm:flex items-center gap-2 text-xs text-slate-500 font-khmer">
            <span>Admin CMS</span>
            <span>/</span>
            <span>{{ currentLanguage === 'kh' ? 'គណនី & តួនាទី' : 'Users & Roles' }}</span>
            <span>/</span>
            <span class="text-slate-800 font-bold font-mono">#{{ selectedDetailUser.id }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="openEditModal(selectedDetailUser)"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs font-bold font-khmer transition-colors cursor-pointer shadow-2xs"
          >
            <Edit2 class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'កែប្រែគណនី' : 'Edit User' }}</span>
          </button>
        </div>
      </div>

      <!-- Detail Card Content Area -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 overflow-y-auto space-y-6">
        <!-- User Profile Hero Header -->
        <div class="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xs">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div :class="['w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg shrink-0', getRoleBadgeColor(selectedDetailUser.role).iconBg]">
                <Crown v-if="selectedDetailUser.role === 'Administrator'" class="w-8 h-8" />
                <BadgeCheck v-else-if="selectedDetailUser.role === 'Officer'" class="w-8 h-8" />
                <Briefcase v-else-if="selectedDetailUser.role === 'Specialist'" class="w-8 h-8" />
                <User v-else class="w-8 h-8" />
              </div>
              <div>
                <div class="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span :class="['inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize shadow-xs', getRoleBadgeColor(selectedDetailUser.role).bg]">
                    {{ getRoleLabel(selectedDetailUser.role) }}
                  </span>
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {{ selectedDetailUser.status }}
                  </span>
                  <span class="text-xs text-slate-400 font-mono">
                    ID: {{ selectedDetailUser.id }}
                  </span>
                </div>
                <h2 class="text-xl sm:text-2xl font-black font-khmer leading-snug">
                  {{ currentLanguage === 'kh' && selectedDetailUser.nameKh ? selectedDetailUser.nameKh : selectedDetailUser.name }}
                </h2>
                <p class="text-xs text-slate-300 font-medium">
                  {{ selectedDetailUser.name }}
                </p>
              </div>
            </div>
            <div class="text-left sm:text-right shrink-0">
              <span class="text-xs text-slate-400 block font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទចុះឈ្មោះ' : 'Registered Date' }}</span>
              <span class="text-sm font-bold text-white font-mono">
                {{ selectedDetailUser.registeredDate }}
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Information Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div class="flex items-center gap-2 text-slate-500 text-xs mb-1.5 font-khmer font-bold">
              <Mail class="w-4 h-4 text-blue-600" />
              <span>{{ currentLanguage === 'kh' ? 'អាសយដ្ឋានអ៊ីមែល' : 'Email Address' }}</span>
            </div>
            <a :href="'mailto:' + selectedDetailUser.email" class="text-sm font-bold text-blue-600 hover:underline font-mono">
              {{ selectedDetailUser.email }}
            </a>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div class="flex items-center gap-2 text-slate-500 text-xs mb-1.5 font-khmer font-bold">
              <Phone class="w-4 h-4 text-emerald-600" />
              <span>{{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទផ្ទាល់' : 'Phone Number' }}</span>
            </div>
            <a :href="'tel:' + selectedDetailUser.phone" class="text-sm font-bold text-slate-800 hover:underline font-mono">
              {{ selectedDetailUser.phone }}
            </a>
          </div>

          <div class="p-4 rounded-xl bg-slate-50 border border-slate-200/80 sm:col-span-2">
            <div class="flex items-center gap-2 text-slate-500 text-xs mb-1.5 font-khmer font-bold">
              <ShieldCheck class="w-4 h-4 text-indigo-600" />
              <span>{{ currentLanguage === 'kh' ? 'ស្ថាប័ន / អង្គភាព / តំបន់រស់នៅ' : 'Department / Affiliation' }}</span>
            </div>
            <p class="text-sm font-bold text-slate-800 font-khmer">
              {{ selectedDetailUser.department || 'General Citizen' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- VIEW 3: ADD / EDIT USER (SUB-PAGE)                       -->
    <!-- ======================================================== -->
    <div
      v-else-if="currentView === 'form'"
      class="h-full flex flex-col gap-3 overflow-hidden select-text animate-in fade-in duration-200"
    >
      <!-- Top Action Bar -->
      <div class="bg-white rounded-xl p-3 border border-slate-200/90 shadow-2xs flex items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <button
            type="button"
            @click="backToList"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs font-khmer transition-colors cursor-pointer shadow-2xs"
          >
            <ArrowLeft class="w-4 h-4 text-slate-600" />
            <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ក្រោយ' : 'Back' }}</span>
          </button>
          <div class="h-4 w-px bg-slate-200 hidden sm:block"></div>
          <div class="flex items-center gap-2 text-xs font-khmer font-bold text-slate-800">
            <UserPlus class="w-4 h-4 text-blue-600" />
            <span>
              {{ isEditing 
                ? (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មានអ្នកប្រើប្រាស់' : 'Edit User Details') 
                : (currentLanguage === 'kh' ? 'បន្ថែមអ្នកប្រើប្រាស់ថ្មី' : 'Add New User') 
              }}
            </span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            @click="backToList"
            class="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="saveUser"
            class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-khmer shadow-sm transition-all cursor-pointer"
          >
            {{ isEditing 
              ? (currentLanguage === 'kh' ? 'កែប្រែព័ត៌មាន' : 'Update User') 
              : (currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save User') 
            }}
          </button>
        </div>
      </div>

      <!-- Form Body Area -->
      <div class="flex-1 min-h-0 bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 overflow-y-auto">
        <form @submit.prevent="saveUser" class="max-w-2xl space-y-4 text-xs">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Name (English) *</label>
              <input
                v-model="userForm.name"
                type="text"
                required
                placeholder="e.g. Sok Dara"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 shadow-2xs"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5 font-khmer">ឈ្មោះជាភាសាខ្មែរ</label>
              <input
                v-model="userForm.nameKh"
                type="text"
                placeholder="ឧ. សុខ តារា"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5">Email *</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                placeholder="user@example.com"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono shadow-2xs"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5 font-khmer">លេខទូរស័ព្ទ</label>
              <input
                v-model="userForm.phone"
                type="text"
                placeholder="012 345 678"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-mono shadow-2xs"
              />
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5 font-khmer">តួនាទីប្រព័ន្ធ (Role) *</label>
              <select
                v-model="userForm.role"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="Administrator">Administrator (អ្នកគ្រប់គ្រង)</option>
                <option value="Officer">Officer (មន្ត្រីរដ្ឋ)</option>
                <option value="Specialist">Specialist (អ្នកឯកទេស)</option>
                <option value="Citizen">Citizen (ប្រជាពលរដ្ឋ)</option>
              </select>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1.5 font-khmer">ស្ថានភាព (Status)</label>
              <select
                v-model="userForm.status"
                class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-blue-500 shadow-2xs"
              >
                <option value="Active">Active (សកម្ម)</option>
                <option value="Pending">Pending (រង់ចាំ)</option>
                <option value="Suspended">Suspended (ផ្អាក)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-slate-700 mb-1.5 font-khmer">ស្ថាប័ន / ផ្នែក (Department / Sector)</label>
            <input
              v-model="userForm.department"
              type="text"
              placeholder="e.g. Ministry of Interior / OWSO"
              class="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 font-khmer shadow-2xs"
            />
          </div>
        </form>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 3: DELETE CONFIRMATION DIALOG                     -->
    <!-- ======================================================== -->
    <div
      v-if="isDeleteModalOpen && deletingUser"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isDeleteModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-4 shadow-2xl border border-slate-200 text-center">
        <div class="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
          <Trash2 class="w-5 h-5" />
        </div>

        <h3 class="text-sm font-bold text-slate-900 font-khmer mb-1">
          {{ currentLanguage === 'kh' ? 'តើអ្នកពិតជាចង់លុបគណនីនេះមែនទេ?' : 'Confirm User Deletion' }}
        </h3>

        <p class="text-xs text-slate-500 font-khmer mb-4">
          <strong class="text-slate-800">
            {{ currentLanguage === 'kh' && deletingUser.nameKh ? deletingUser.nameKh : deletingUser.name }}
          </strong>
          <br />
          {{ currentLanguage === 'kh' ? 'គណនីនេះនឹងមិនអាចចូលប្រើប្រាស់បានទៀតឡើយ។' : 'This user account will be permanently removed.' }}
        </p>

        <div class="flex items-center justify-center gap-2">
          <button
            type="button"
            @click="isDeleteModalOpen = false"
            class="px-3.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="confirmDelete"
            class="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold font-khmer shadow-sm cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'យល់ព្រមលុប' : 'Yes, Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL 4: ROLE PERMISSIONS MATRIX MODAL                   -->
    <!-- ======================================================== -->
    <div
      v-if="isPermissionsModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-200"
      @click.self="isPermissionsModalOpen = false"
    >
      <div class="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl border border-slate-200 overflow-hidden text-xs">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div class="flex items-center gap-2">
            <ShieldCheck class="w-5 h-5 text-blue-600" />
            <h3 class="text-sm font-bold text-slate-900 font-khmer">
              {{ currentLanguage === 'kh' ? 'តារាងសិទ្ធិតាមតួនាទី (Role Matrix)' : 'Role Permissions Matrix' }}
            </h3>
          </div>
          <button
            type="button"
            @click="isPermissionsModalOpen = false"
            class="w-7 h-7 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 flex items-center justify-center cursor-pointer"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <div class="py-3 space-y-2">
          <div class="p-3 bg-purple-50/70 border border-purple-200 rounded-xl">
            <span class="font-bold text-purple-900 block font-khmer text-xs">👑 Administrator (អ្នកគ្រប់គ្រងជាន់ខ្ពស់)</span>
            <p class="text-[11px] text-purple-700 font-khmer mt-0.5">មានសិទ្ធិពេញលេញគ្រប់គ្រងមាតិកា ការងារ មន្ទីរពេទ្យ សេវាកម្ម កំណត់ហេតុ និងអ្នកប្រើប្រាស់។</p>
          </div>
          <div class="p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <span class="font-bold text-blue-900 block font-khmer text-xs">🛡️ Officer (មន្ត្រីរដ្ឋបាល & OWSO)</span>
            <p class="text-[11px] text-blue-700 font-khmer mt-0.5">មានសិទ្ធិអនុម័តសេវាសាធារណៈ ពិនិត្យសំណើសុំ និងឆ្លើយតបមតិយោបល់ពលរដ្ឋ។</p>
          </div>
          <div class="p-3 bg-teal-50/70 border border-teal-200 rounded-xl">
            <span class="font-bold text-teal-900 block font-khmer text-xs">💼 Specialist (អ្នកឯកទេស / ជាង)</span>
            <p class="text-[11px] text-teal-700 font-khmer mt-0.5">មានសិទ្ធិគ្រប់គ្រងកម្រងព័ត៌មានសេវាកម្ម និងកាលវិភាគណាត់ជួបរបស់ខ្លួន។</p>
          </div>
          <div class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl">
            <span class="font-bold text-emerald-900 block font-khmer text-xs">👤 Citizen (ប្រជាពលរដ្ឋ)</span>
            <p class="text-[11px] text-emerald-700 font-khmer mt-0.5">ស្វែងរកព័ត៌មាន រក្សាទុកទិន្នន័យ ដាក់ពាក្យការងារ និងផ្ញើមតិស្ថាបនា។</p>
          </div>
        </div>

        <div class="pt-3 border-t border-slate-100 text-right">
          <button
            type="button"
            @click="isPermissionsModalOpen = false"
            class="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold font-khmer cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'យល់ព្រម' : 'Got it' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>
