<script setup lang="ts">
import { ref } from 'vue'
import { Save } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const emit = defineEmits<{
  (e: 'show-toast', msg: string): void
}>()

const { currentLanguage } = useLanguage()

const settings = ref({
  siteName: 'CamLife Cambodia Civic Portal',
  siteNameKh: 'ខេមឡាយហ្វ៍ (CamLife) — ផតថលសេវាពលរដ្ឋកម្ពុជា',
  defaultLanguage: 'kh',
  maintenanceMode: false,
  emailNotifications: true,
  citizenRegistration: true,
  supportEmail: 'contact@camlife.gov.kh'
})

function handleSave() {
  emit('show-toast', currentLanguage.value === 'kh' ? 'បានរក្សាទុកការកំណត់ជោគជ័យ!' : 'Settings saved successfully!')
}
</script>

<template>
  <div class="max-w-3xl space-y-4">
    <div class="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs space-y-6">
      <div class="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 class="text-base font-black text-slate-900 font-khmer">
            {{ currentLanguage === 'kh' ? 'ការកំណត់ប្រព័ន្ធ' : 'System Settings' }}
          </h3>
          <p class="text-xs text-slate-400">
            {{ currentLanguage === 'kh' ? 'គ្រប់គ្រងការកំណត់ទូទៅនៃគេហទំព័រ CamLife' : 'Manage general site configurations and parameters' }}
          </p>
        </div>
        <button
          type="button"
          @click="handleSave"
          class="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs cursor-pointer"
        >
          <Save class="w-4 h-4" />
          <span class="font-khmer">{{ currentLanguage === 'kh' ? 'រក្សាទុក' : 'Save Changes' }}</span>
        </button>
      </div>

      <div class="space-y-4 text-xs">
        <div>
          <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះគេហទំព័រ (Website Title)</label>
          <input v-model="settings.siteName" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1 font-khmer">ឈ្មោះគេហទំព័រជាភាសាខ្មែរ</label>
          <input v-model="settings.siteNameKh" type="text" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-khmer" />
        </div>

        <div>
          <label class="block font-bold text-slate-700 mb-1 font-khmer">អ៊ីមែលជំនួយបច្ចេកទេស (Support Email)</label>
          <input v-model="settings.supportEmail" type="email" class="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl" />
        </div>

        <div class="pt-2 border-t border-slate-100 space-y-3">
          <div class="flex items-center justify-between py-2">
            <div>
              <span class="font-bold text-slate-800 block font-khmer">របៀបថែទាំប្រព័ន្ធ (Maintenance Mode)</span>
              <span class="text-slate-400 text-[11px]">បិទគេហទំព័របណ្តោះអាសន្នសម្រាប់ការជួសជុល</span>
            </div>
            <input v-model="settings.maintenanceMode" type="checkbox" class="w-4 h-4 rounded text-blue-600 cursor-pointer" />
          </div>

          <div class="flex items-center justify-between py-2">
            <div>
              <span class="font-bold text-slate-800 block font-khmer">ការជូនដំណឹងតាមអ៊ីមែល (Email Alerts)</span>
              <span class="text-slate-400 text-[11px]">ផ្ញើការជូនដំណឹងនៅពេលមានការស្នើសុំថ្មី</span>
            </div>
            <input v-model="settings.emailNotifications" type="checkbox" class="w-4 h-4 rounded text-blue-600 cursor-pointer" />
          </div>

          <div class="flex items-center justify-between py-2">
            <div>
              <span class="font-bold text-slate-800 block font-khmer">បើកឱ្យប្រជាពលរដ្ឋចុះឈ្មោះ (Citizen Sign Up)</span>
              <span class="text-slate-400 text-[11px]">អនុញ្ញាតឱ្យប្រជាពលរដ្ឋបង្កើតគណនីថ្មី</span>
            </div>
            <input v-model="settings.citizenRegistration" type="checkbox" class="w-4 h-4 rounded text-blue-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
