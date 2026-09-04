<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  MapPin,
  DollarSign,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  ArrowLeft,
  Building2,
  ChevronRight,
  ShieldCheck,
  Gift
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import JobCard from '@/components/JobCard.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { getJobById, getJobs } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, currentLanguage } = useLanguage()
const { isJobSaved, toggleSaveJob } = useSavedJobs()

const job = computed(() => {
  const id = route.params.id as string
  return getJobById(id)
})

usePageMeta({
  title: computed(() => job.value ? `${job.value.title} at ${job.value.company} — CamLife Careers` : 'Job Detail'),
  description: computed(() => job.value?.description || '')
})

const relatedJobs = computed(() => {
  if (!job.value) return []
  return getJobs()
    .filter(j => j.id !== job.value?.id)
    .slice(0, 2)
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 font-khmer">
    <div v-if="job" class="space-y-10">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
        <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          🏠 {{ t('nav.home') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <router-link to="/jobs" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.jobs') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <span class="text-slate-700 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
          {{ job.title }}
        </span>
      </nav>

      <!-- Back Link -->
      <div>
        <router-link
          to="/jobs"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅឱកាសការងារទាំងអស់' : 'Back to All Jobs' }}</span>
        </router-link>
      </div>

      <!-- Hero Header Card -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-card space-y-6">
        <div class="flex flex-col sm:flex-row justify-between items-start gap-6">
          <div class="space-y-3">
            <div class="flex flex-wrap items-center gap-2">
              <span class="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200 dark:border-emerald-800">
                {{ job.type }}
              </span>
              <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200/80 dark:border-blue-900">
                {{ job.category }}
              </span>
              <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
                <span>{{ currentLanguage === 'kh' ? 'និយោជកស្របច្បាប់ ១០០%' : 'Verified Employer' }}</span>
              </span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-black text-[#0A2540] dark:text-white tracking-tight leading-tight">
              {{ job.title }}
            </h1>

            <p class="text-base font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
              <Building2 class="w-5 h-5 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span>{{ job.company }}</span>
            </p>
          </div>

          <!-- Top Actions -->
          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <!-- Apply Button -->
            <a
              :href="job.applyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="flex-1 sm:flex-none px-6 py-3 bg-[#003366] hover:bg-[#0A2E6E] text-white text-xs font-black rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <span>{{ currentLanguage === 'kh' ? 'ដាក់ពាក្យឥឡូវនេះ' : 'Apply Now' }}</span>
              <ExternalLink class="w-4 h-4" />
            </a>

            <!-- Bookmark Button -->
            <button
              @click="toggleSaveJob(job.id)"
              :class="[
                'px-4 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2 border cursor-pointer',
                isJobSaved(job.id)
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 border-blue-200 dark:border-blue-800'
                  : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 border-slate-200 dark:border-slate-600'
              ]"
              type="button"
            >
              <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current text-[#0D47A1] dark:text-blue-400" />
              <Bookmark v-else class="w-4 h-4" />
              <span>{{ isJobSaved(job.id) ? (currentLanguage === 'kh' ? 'បានរក្សាទុក' : 'Saved') : (currentLanguage === 'kh' ? 'រក្សាទុកការងារ' : 'Save Job') }}</span>
            </button>

            <ShareButtons :title="job.title" />
          </div>
        </div>

        <!-- Key Details Pill Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs font-semibold">
          <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60">
            <DollarSign class="w-4 h-4 text-emerald-600 shrink-0" />
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">{{ currentLanguage === 'kh' ? 'ប្រាក់បៀវត្សរ៍' : 'Salary' }}</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ job.salary }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60">
            <MapPin class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">{{ currentLanguage === 'kh' ? 'ទីតាំងបំពេញការងារ' : 'Location' }}</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ job.location }}, {{ currentLanguage === 'kh' ? 'កម្ពុជា' : 'Cambodia' }}</span>
            </div>
          </div>

          <div class="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60">
            <Clock class="w-4 h-4 text-slate-400 shrink-0" />
            <div>
              <span class="text-[10px] uppercase font-bold text-slate-400 block">{{ currentLanguage === 'kh' ? 'កាលបរិច្ឆេទចុះផ្សាយ' : 'Posted Date' }}</span>
              <span class="font-bold text-slate-800 dark:text-white">{{ job.postedDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Layout: 2 Cols -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-8">
          <!-- Description -->
          <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-3">
            <h2 class="text-lg font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? 'ការពិពណ៌នាពីតួនាទី & ការងារ' : 'Role Overview' }}
            </h2>
            <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {{ job.description }}
            </p>
          </section>

          <!-- Requirements -->
          <section v-if="job.requirements.length > 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 class="text-lg font-black text-[#0A2540] dark:text-white">
              {{ currentLanguage === 'kh' ? 'លក្ខខណ្ឌតម្រូវសម្រាប់បេក្ខជន' : 'Candidate Requirements' }}
            </h2>
            <div class="space-y-3">
              <div
                v-for="(req, idx) in job.requirements"
                :key="idx"
                class="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60"
              >
                <CheckCircle2 class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 mt-0.5 shrink-0" />
                <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-relaxed">{{ req }}</span>
              </div>
            </div>
          </section>

          <!-- Benefits -->
          <section v-if="job.benefits.length > 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 class="text-lg font-black text-[#0A2540] dark:text-white flex items-center gap-2">
              <Gift class="w-5 h-5 text-emerald-600" />
              <span>{{ currentLanguage === 'kh' ? 'អត្ថប្រយោជន៍ & ការលើកទឹកចិត្ត' : 'Benefits & Perks' }}</span>
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="(ben, idx) in job.benefits"
                :key="idx"
                class="flex items-center gap-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60"
              >
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span class="text-xs font-bold text-slate-700 dark:text-slate-200">{{ ben }}</span>
              </div>
            </div>
          </section>
        </div>

        <!-- Sidebar: Company Card & Application CTA -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 shadow-sm space-y-4">
            <div class="flex items-center gap-3.5">
              <div class="w-13 h-13 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center font-black text-xl shrink-0 overflow-hidden shadow-xs">
                <img v-if="job.logo" :src="job.logo" :alt="job.company" class="w-full h-full object-cover" />
                <span v-else>{{ job.company.charAt(0) }}</span>
              </div>
              <div class="min-w-0">
                <h3 class="font-extrabold text-sm text-[#0A2540] dark:text-white truncate">{{ job.company }}</h3>
                <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 class="w-3 h-3 text-emerald-500 shrink-0" />
                  <span>{{ currentLanguage === 'kh' ? 'និយោជកផ្ទៀងផ្ទាត់' : 'Verified Employer' }}</span>
                </span>
              </div>
            </div>

            <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {{ currentLanguage === 'kh'
                ? `កំពុងប្រតិបត្តិការ និងជ្រើសរើសបុគ្គលិកនៅ ${job.location}, ប្រទេសកម្ពុជា។`
                : `Operating and recruiting talent in ${job.location}, Cambodia.`
              }}
            </p>

            <a
              :href="job.applyUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full py-3 bg-[#003366] hover:bg-[#0A2E6E] text-white text-xs font-black rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{{ currentLanguage === 'kh' ? 'ដាក់ពាក្យតាមរយៈគេហទំព័រក្រុមហ៊ុន' : 'Submit Application' }}</span>
              <ExternalLink class="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      <!-- Related Jobs Section -->
      <section v-if="relatedJobs.length > 0" class="pt-8 border-t border-slate-100 dark:border-slate-800 space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-black text-[#0A2540] dark:text-white">
            {{ currentLanguage === 'kh' ? 'ឱកាសការងារស្រដៀងគ្នា' : 'Related Opportunities' }}
          </h2>
          <router-link to="/jobs" class="text-xs font-black text-[#0D47A1] dark:text-blue-400 hover:underline">
            {{ currentLanguage === 'kh' ? 'មើលការងារទាំងអស់ →' : 'View All Jobs →' }}
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <JobCard v-for="j in relatedJobs" :key="j.id" :job="j" />
        </div>
      </section>
    </div>

    <!-- 404 Fallback -->
    <NotFoundState
      v-else
      message="Job Opening Not Found"
      subtitle="The position you are looking for has closed or is no longer listed."
      back-link="/jobs"
      back-text="Back to Jobs"
    />
  </div>
</template>
