<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import {
  X,
  ShieldCheck,
  Crown,
  Mail,
  Phone,
  Building2,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  User as UserIcon,
  Sparkles
} from 'lucide-vue-next'
import { useAuth } from '@/composables/useAuth'
import { useLanguage } from '@/composables/useLanguage'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'saved', msg: string): void
}>()

const { currentUser, updateProfile } = useAuth()
const { currentLanguage } = useLanguage()

const activeTab = ref<'general' | 'security'>('general')
const showPassword = ref(false)
const showNewPassword = ref(false)
const isSaving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  email: '',
  phone: '',
  department: '',
  role: '',
  bio: '',
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      errorMessage.value = ''
      successMessage.value = ''
      form.name = currentUser.value?.name || 'Admin Officer'
      form.email = currentUser.value?.email || 'admin@camlife.gov.kh'
      form.phone = currentUser.value?.phone || '012 999 888'
      form.department = currentUser.value?.department || (currentLanguage.value === 'kh' ? 'ក្រសួងមុខងារសាធារណៈ / ច្រកចេញចូលតែមួយ OWSO Central' : 'Ministry of Public Function / OWSO Central')
      form.role = currentUser.value?.role || 'Super Administrator'
      form.bio = currentUser.value?.bio || (currentLanguage.value === 'kh' ? 'ប្រធានគ្រប់គ្រងប្រព័ន្ធទិន្នន័យ និងសេវាសាធារណៈជាតិ CamLife' : 'Lead Administrator for CamLife National Civic Platform')
      form.currentPassword = ''
      form.newPassword = ''
      form.confirmPassword = ''
      activeTab.value = 'general'
    }
  },
  { immediate: true }
)

function handleSave() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.name.trim()) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលឈ្មោះពេញ' : 'Please enter full name.'
    return
  }
  if (!form.email.trim() || !form.email.includes('@')) {
    errorMessage.value = currentLanguage.value === 'kh' ? 'សូមបញ្ចូលអ៊ីមែលឱ្យបានត្រឹមត្រូវ' : 'Please enter a valid email.'
    return
  }

  if (activeTab.value === 'security') {
    if (form.newPassword) {
      if (form.newPassword.length < 6) {
        errorMessage.value = currentLanguage.value === 'kh' ? 'ពាក្យសម្ងាត់ថ្មីត្រូវមានយ៉ាងតិច ៦ តួអក្សរ' : 'New password must be at least 6 characters.'
        return
      }
      if (form.newPassword !== form.confirmPassword) {
        errorMessage.value = currentLanguage.value === 'kh' ? 'ពាក្យសម្ងាត់ផ្ទៀងផ្ទាត់មិនត្រូវគ្នាទេ' : 'Passwords do not match.'
        return
      }
    }
  }

  isSaving.value = true

  setTimeout(() => {
    updateProfile({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      department: form.department.trim(),
      bio: form.bio.trim(),
      lastLogin: new Date().toLocaleTimeString()
    })

    isSaving.value = false
    const msg = currentLanguage.value === 'kh' ? 'ព័ត៌មានគណនីត្រូវបានរក្សាទុកដោយជោគជ័យ!' : 'Admin profile updated successfully!'
    successMessage.value = msg
    emit('saved', msg)

    setTimeout(() => {
      emit('close')
    }, 800)
  }, 400)
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-200 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-150 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto font-khmer select-none"
      @click.self="emit('close')"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        <!-- Modal Top Banner (National / Civic Gradient) -->
        <div class="relative h-28 bg-gradient-to-r from-[#0A2540] via-[#0D3B66] to-[#0D47A1] p-4 flex items-start justify-between text-white shrink-0">
          <div class="flex items-center gap-2">
            <div class="p-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <Crown class="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 class="text-sm font-black text-white leading-tight">
                {{ currentLanguage === 'kh' ? 'ព័ត៌មានគណនីអភិបាល' : 'Admin Officer Profile' }}
              </h3>
              <p class="text-[10.5px] text-blue-200">
                {{ currentLanguage === 'kh' ? 'ការគ្រប់គ្រងគណនី និងសិទ្ធិប្រព័ន្ធ' : 'Account settings & security credentials' }}
              </p>
            </div>
          </div>

          <button
            type="button"
            @click="emit('close')"
            class="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X class="w-4 h-4" />
          </button>
        </div>

        <!-- Profile Avatar & Identity Card Overlap -->
        <div class="px-5 -mt-10 flex items-end gap-3.5 shrink-0">
          <div class="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-300 p-0.5 shadow-xl ring-4 ring-white shrink-0">
            <div class="w-full h-full rounded-2xl bg-[#0A2540] text-amber-300 flex items-center justify-center text-2xl font-black shadow-inner">
              {{ form.name.charAt(0).toUpperCase() }}
            </div>
            <span class="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full ring-2 ring-white" title="Active"></span>
          </div>

          <div class="pb-1 min-w-0 flex-1">
            <div class="flex items-center gap-2">
              <h4 class="text-base font-extrabold text-slate-900 truncate">
                {{ form.name }}
              </h4>
              <span class="px-2 py-0.5 rounded-full text-[9.5px] font-black bg-purple-100 text-purple-700 border border-purple-200 shrink-0">
                {{ currentLanguage === 'kh' ? 'អភិបាលកំពូល' : 'Super Admin' }}
              </span>
            </div>
            <p class="text-xs text-slate-500 font-mono truncate">
              {{ form.email }}
            </p>
          </div>
        </div>

        <!-- Tab Switcher -->
        <div class="px-5 pt-3 border-b border-slate-100 flex items-center gap-2 shrink-0">
          <button
            type="button"
            @click="activeTab = 'general'"
            :class="[
              'px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'general'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            ]"
          >
            <UserIcon class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានទូទៅ' : 'General Info' }}</span>
          </button>
          <button
            type="button"
            @click="activeTab = 'security'"
            :class="[
              'px-3.5 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer flex items-center gap-1.5',
              activeTab === 'security'
                ? 'border-blue-600 text-blue-700 font-black'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            ]"
          >
            <Lock class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'សុវត្ថិភាព & ពាក្យសម្ងាត់' : 'Security & Password' }}</span>
          </button>
        </div>

        <!-- Modal Body (Scrollable) -->
        <div class="p-5 overflow-y-auto space-y-4 flex-1">
          <!-- Alert Feedback Messages -->
          <div
            v-if="errorMessage"
            class="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in"
          >
            <AlertCircle class="w-4 h-4 shrink-0" />
            <span>{{ errorMessage }}</span>
          </div>

          <div
            v-if="successMessage"
            class="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-center gap-2 animate-in fade-in"
          >
            <CheckCircle2 class="w-4 h-4 shrink-0" />
            <span>{{ successMessage }}</span>
          </div>

          <!-- TAB 1: GENERAL INFO -->
          <div v-if="activeTab === 'general'" class="space-y-3.5">
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                {{ currentLanguage === 'kh' ? 'ឈ្មោះពេញ (Full Name) *' : 'Full Name *' }}
              </label>
              <div class="relative">
                <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.name"
                  type="text"
                  class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  :placeholder="currentLanguage === 'kh' ? 'ឧ. មន្ត្រីរដ្ឋបាល' : 'e.g. Admin Officer'"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  {{ currentLanguage === 'kh' ? 'អ៊ីមែលផ្លូវការ (Official Email) *' : 'Official Email *' }}
                </label>
                <div class="relative">
                  <Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.email"
                    type="email"
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    placeholder="admin@camlife.gov.kh"
                  />
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទ (Phone Number)' : 'Phone Number' }}
                </label>
                <div class="relative">
                  <Phone class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.phone"
                    type="text"
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 font-mono"
                    placeholder="012 999 888"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                {{ currentLanguage === 'kh' ? 'ស្ថាប័ន / អង្គភាព (Department)' : 'Department / Ministry' }}
              </label>
              <div class="relative">
                <Building2 class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.department"
                  type="text"
                  class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                {{ currentLanguage === 'kh' ? 'កំណត់សម្គាល់តួនាទី (Role Notes)' : 'Role Bio / Notes' }}
              </label>
              <textarea
                v-model="form.bio"
                rows="2"
                class="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
              ></textarea>
            </div>
          </div>

          <!-- TAB 2: SECURITY & PASSWORD -->
          <div v-else class="space-y-3.5">
            <div class="p-3 bg-blue-50/70 border border-blue-100 rounded-2xl flex items-center justify-between">
              <div class="flex items-center gap-2.5">
                <div class="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                  <ShieldCheck class="w-4 h-4" />
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 leading-tight">
                    {{ currentLanguage === 'kh' ? 'ការផ្ទៀងផ្ទាត់ពីរកត្តា (2FA)' : 'Two-Factor Authentication' }}
                  </p>
                  <p class="text-[10px] text-emerald-600 font-bold">
                    {{ currentLanguage === 'kh' ? '✓ បានបើកដំណើរការ (Active via SMS & App)' : '✓ Active & Secured' }}
                  </p>
                </div>
              </div>
              <span class="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 border border-emerald-200">
                PROTECTED
              </span>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">
                {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់បច្ចុប្បន្ន (Current Password)' : 'Current Password' }}
              </label>
              <div class="relative">
                <Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  v-model="form.currentPassword"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="••••••••"
                  class="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
                <button
                  type="button"
                  @click="showPassword = !showPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <Eye v-if="!showPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  {{ currentLanguage === 'kh' ? 'ពាក្យសម្ងាត់ថ្មី (New Password)' : 'New Password' }}
                </label>
                <div class="relative">
                  <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.newPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full pl-9 pr-10 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                  <button
                    type="button"
                    @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <Eye v-if="!showNewPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">
                  {{ currentLanguage === 'kh' ? 'ផ្ទៀងផ្ទាត់ពាក្យសម្ងាត់ថ្មី' : 'Confirm Password' }}
                </label>
                <div class="relative">
                  <KeyRound class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    v-model="form.confirmPassword"
                    :type="showNewPassword ? 'text' : 'password'"
                    placeholder="••••••••"
                    class="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <!-- Session summary -->
            <div class="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-[11px] text-slate-500 space-y-1 font-mono">
              <div class="flex justify-between">
                <span class="font-khmer font-medium">វគ្គចូលប្រើប្រាស់ (Session):</span>
                <span class="text-blue-600 font-bold">Encrypted SSL/TLS 256-bit</span>
              </div>
              <div class="flex justify-between">
                <span class="font-khmer font-medium">IP ចូលប្រើប្រាស់:</span>
                <span class="text-slate-700">127.0.0.1 (Localhost Secured)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            @click="emit('close')"
            class="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
          </button>
          <button
            type="button"
            @click="handleSave"
            :disabled="isSaving"
            class="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles v-if="!isSaving" class="w-3.5 h-3.5" />
            <span>{{ isSaving ? (currentLanguage === 'kh' ? 'កំពុងរក្សាទុក...' : 'Saving...') : (currentLanguage === 'kh' ? 'រក្សាទុកការផ្លាស់ប្តូរ' : 'Save Changes') }}</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
