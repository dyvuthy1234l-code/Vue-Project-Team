<script setup lang="ts">
import { computed } from 'vue'
import {
  Landmark,
  ExternalLink,
  ShieldCheck,
  CalendarCheck2,
  Info
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

interface Props {
  sourceName?: string
  sourceNameKh?: string
  officialUrl?: string
  lastVerifiedDate?: string
  verificationBadgeText?: string
}

const props = withDefaults(defineProps<Props>(), {
  sourceName: 'General Department of Identification / Ministry of Interior',
  sourceNameKh: 'អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម ក្រសួងមហាផ្ទៃ',
  officialUrl: 'https://gdi.gov.kh',
  lastVerifiedDate: '04 September 2026',
  verificationBadgeText: 'Verified Public Information'
})

const { currentLanguage } = useLanguage()

const formattedSource = computed(() => {
  return currentLanguage.value === 'kh' ? props.sourceNameKh : props.sourceName
})
</script>

<template>
  <div class="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/25 p-4 sm:p-5 space-y-3.5">
    <div class="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-blue-100 dark:border-blue-900/40">
      <div class="flex items-center gap-2">
        <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/70 text-[#0D47A1] dark:text-blue-300">
          <Landmark class="w-4 h-4" />
        </span>
        <div>
          <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            {{ currentLanguage === 'kh' ? 'ប្រភពព័ត៌មានផ្លូវការ' : 'Official Information Source' }}
          </span>
          <p class="text-xs sm:text-sm font-extrabold text-[#0A2540] dark:text-white font-khmer">
            {{ formattedSource }}
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800">
          <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
          <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានផ្ទៀងផ្ទាត់' : verificationBadgeText }}</span>
        </span>
      </div>
    </div>

    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <CalendarCheck2 class="w-4 h-4 text-slate-400" />
        <span>{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទផ្ទៀងផ្ទាត់ចុងក្រោយ:' : 'Last verified:' }}</span>
        <strong class="text-slate-700 dark:text-slate-200">{{ lastVerifiedDate }}</strong>
      </div>

      <div class="flex items-center gap-3">
        <a
          v-if="officialUrl"
          :href="officialUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:underline"
        >
          <span>{{ currentLanguage === 'kh' ? 'គេហទំព័រផ្លូវការស្ថាប័ន' : 'Visit Official Portal' }}</span>
          <ExternalLink class="w-3.5 h-3.5" />
        </a>
      </div>
    </div>

    <!-- Independent Citizen Platform Disclaimer Note -->
    <div class="flex items-center gap-2 pt-2 text-[11px] text-slate-400 border-t border-blue-100/70 dark:border-blue-900/30">
      <Info class="w-3.5 h-3.5 text-blue-500 shrink-0" />
      <span>
        {{ currentLanguage === 'kh'
          ? 'CamLife គឺជាវេទិកាផ្ដល់ព័ត៌មានឯករាជ្យបម្រើប្រជាពលរដ្ឋ ដែលស្រង់ និងផ្ទៀងផ្ទាត់តាមនីតិវិធីសាធារណៈផ្លូវការ។'
          : 'CamLife is an independent citizen public information platform verified against official ministerial guidelines.'
        }}
      </span>
    </div>
  </div>
</template>
