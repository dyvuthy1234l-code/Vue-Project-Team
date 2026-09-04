<script setup lang="ts">
import {
  Bookmark,
  Building2,
  HeartPulse,
  Briefcase,
  Bus,
  Siren,
  Trash2,
  ArrowRight,
  ChevronRight,
  FileText
} from 'lucide-vue-next'
import { useSavedServices } from '@/composables/useSavedServices'
import { useLanguage } from '@/composables/useLanguage'
import { usePageMeta } from '@/composables/usePageMeta'
import SectionHeader from '@/components/SectionHeader.vue'

usePageMeta({
  title: 'សេវាដែលបានរក្សាទុក — CamLife Saved Services',
  description: 'Your saved public guides, health facilities, and citizen checklists.'
})

const { savedServices, removeSaved, clearAllSaved } = useSavedServices()
const { currentLanguage, localized } = useLanguage()

function getIconForType(type: string) {
  if (type === 'government') return Building2
  if (type === 'health') return HeartPulse
  if (type === 'job') return Briefcase
  if (type === 'transport') return Bus
  if (type === 'emergency') return Siren
  return FileText
}
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        {{ currentLanguage === 'kh' ? 'ទំព័រដើម' : 'Home' }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">{{ currentLanguage === 'kh' ? 'សេវាដែលបានរក្សាទុក' : 'Saved Services' }}</span>
    </nav>

    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <SectionHeader
        :title="currentLanguage === 'kh' ? 'សេវាដែលបានរក្សាទុក (Saved Services)' : 'My Saved Services & Guides'"
        :subtitle="currentLanguage === 'kh' ? 'បញ្ជីសេវាសាធារណៈ មន្ទីរពេទ្យ និងការងារដែលអ្នកបានចំណាំទុកសម្រាប់ប្រើប្រាស់' : 'Quick access to your bookmarked civic guides, health facilities, and jobs.'"
        badge="Citizen Pocket"
      />

      <button
        v-if="savedServices.length > 0"
        @click="clearAllSaved"
        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl border border-red-200 dark:border-red-800/60 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors shrink-0 self-start sm:self-center"
        type="button"
      >
        <Trash2 class="w-3.5 h-3.5" />
        <span>{{ currentLanguage === 'kh' ? 'លុបទាំងអស់' : 'Clear All' }}</span>
      </button>
    </div>

    <!-- Saved List -->
    <div v-if="savedServices.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="item in savedServices"
        :key="item.id"
        class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between gap-2">
            <div class="w-11 h-11 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center">
              <component :is="getIconForType(item.type)" class="w-5 h-5" />
            </div>

            <button
              @click="removeSaved(item.id)"
              class="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              :title="currentLanguage === 'kh' ? 'លុបចេញពីបញ្ជី' : 'Remove from saved'"
              type="button"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>

          <div>
            <span class="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              {{ item.category }}
            </span>
            <h3 class="text-base font-black text-[#0A2540] dark:text-white leading-snug">
              {{ localized(item.title, item.titleKh || item.title) }}
            </h3>
          </div>
        </div>

        <div class="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <span class="text-[11px] text-slate-400">
            {{ new Date(item.savedAt).toLocaleDateString() }}
          </span>

          <router-link
            :to="item.route"
            class="inline-flex items-center gap-1 text-xs font-bold text-[#0D47A1] dark:text-blue-400 hover:text-[#1565C0]"
          >
            <span>{{ currentLanguage === 'kh' ? 'បើកមើល' : 'Open Guide' }}</span>
            <ArrowRight class="w-3.5 h-3.5" />
          </router-link>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-10 sm:p-16 text-center space-y-4">
      <div class="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center mx-auto">
        <Bookmark class="w-8 h-8" />
      </div>
      <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white">
        {{ currentLanguage === 'kh' ? 'មិនទាន់មានសេវាដែលបានរក្សាទុកទេ' : 'No Saved Services Yet' }}
      </h3>
      <p class="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
        {{ currentLanguage === 'kh'
          ? 'នៅពេលអ្នកមើលមគ្គុទ្ទេសក៍សេវាសាធារណៈ ឬមន្ទីរពេទ្យ សូមចុច "រក្សាទុកសេវា" ដើម្បីចំណាំទុកមើលនៅទីនេះ។'
          : 'When browsing public procedures or hospitals, click "Save Service" to bookmark them here.'
        }}
      </p>
      <div class="pt-2">
        <router-link
          to="/government"
          class="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-[#0D47A1] text-white text-xs font-bold shadow-sm"
        >
          <span>{{ currentLanguage === 'kh' ? 'រុករកសេវារដ្ឋបាលសាធារណៈ' : 'Explore Government Guides' }}</span>
          <ArrowRight class="w-4 h-4" />
        </router-link>
      </div>
    </div>
  </div>
</template>
