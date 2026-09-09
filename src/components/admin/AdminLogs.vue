<script setup lang="ts">
import { ref } from 'vue'
import { User } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { currentLanguage } = useLanguage()

const logs = ref([
  { id: 'log-1', action: 'Approve Job Listing', actionKh: 'អនុម័តការងារថ្មី', user: 'Admin Officer', target: 'Senior Vue Developer', ip: '103.216.48.12', time: '10 minutes ago', type: 'success' },
  { id: 'log-2', action: 'Update Hospital Profile', actionKh: 'កែប្រែព័ត៌មានមន្ទីរពេទ្យ', user: 'Admin Officer', target: 'Takeo Referral Hospital', ip: '103.216.48.12', time: '1 hour ago', type: 'info' },
  { id: 'log-3', action: 'Publish News Article', actionKh: 'ផ្សព្វផ្សាយព័ត៌មានថ្មី', user: 'Admin Officer', target: 'Public Transport Policy 2026', ip: '103.216.48.12', time: '2 hours ago', type: 'success' },
  { id: 'log-4', action: 'Resolve Citizen Report', actionKh: 'ដោះស្រាយរបាយការណ៍ពលរដ្ឋ', user: 'Admin Officer', target: 'Report #rep-03', ip: '103.216.48.12', time: '3 hours ago', type: 'success' },
  { id: 'log-5', action: 'Admin Login', actionKh: 'ចូលប្រើប្រាស់ប្រព័ន្ធ Admin', user: 'Admin Officer', target: 'CMS Portal Session', ip: '103.216.48.12', time: '5 hours ago', type: 'info' }
])
</script>

<template>
  <div class="space-y-4">
    <div class="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
      <div class="p-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 class="text-sm font-black text-slate-900 font-khmer">
            {{ currentLanguage === 'kh' ? 'កំណត់ហេតុសវនកម្មប្រព័ន្ធ' : 'System Audit Logs' }}
          </h3>
          <p class="text-[11px] text-slate-400">Security audit history of administrative operations</p>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-50/70 border-b border-slate-200 text-slate-500 font-bold text-[11px]">
            <tr>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'សកម្មភាព' : 'Action' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អ្នកគ្រប់គ្រង' : 'Admin User' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'ទិន្នន័យគោលដៅ' : 'Target Item' }}</th>
              <th class="py-3 px-4 font-khmer">{{ currentLanguage === 'kh' ? 'អាសយដ្ឋាន IP' : 'IP Address' }}</th>
              <th class="py-3 px-4 text-right font-khmer">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទ' : 'Timestamp' }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="l in logs" :key="l.id" class="hover:bg-slate-50/70 transition-colors">
              <td class="py-3 px-4">
                <span class="font-bold text-slate-900 font-khmer block">
                  {{ currentLanguage === 'kh' ? l.actionKh : l.action }}
                </span>
                <span class="text-[10px] text-slate-400">{{ l.id }}</span>
              </td>
              <td class="py-3 px-4 text-slate-700 font-medium">
                <span class="inline-flex items-center gap-1">
                  <User class="w-3 h-3 text-slate-400" />
                  {{ l.user }}
                </span>
              </td>
              <td class="py-3 px-4 text-slate-600">
                {{ l.target }}
              </td>
              <td class="py-3 px-4 text-slate-500 font-mono text-[11px]">
                {{ l.ip }}
              </td>
              <td class="py-3 px-4 text-right text-slate-400 text-[11px]">
                {{ l.time }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
