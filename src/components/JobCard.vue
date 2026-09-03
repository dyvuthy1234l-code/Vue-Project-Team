<script setup lang="ts">
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck, ArrowRight, Building2, Briefcase } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import type { Job } from '@/types'

const { t } = useLanguage()
const { isJobSaved, toggleSaveJob } = useSavedJobs()

defineProps<{
  job: Job
}>()

const typeColors: Record<string, string> = {
  'Full-time': 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'Part-time': 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'Internship': 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'Freelance': 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
}
</script>

<template>
  <div class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 sm:p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between">
    <div>
      <!-- Header row: Company Initial Avatar + Job Title & Badges + Bookmark Button -->
      <div class="flex items-start justify-between gap-4 mb-3">
        <div class="flex items-start gap-3.5 min-w-0">
          <!-- Company Avatar -->
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 dark:from-slate-700 dark:to-slate-600 border border-blue-200/80 dark:border-slate-600 flex items-center justify-center text-[#0D47A1] dark:text-blue-400 font-black text-lg shrink-0 group-hover:scale-105 transition-transform duration-200 shadow-xs">
            {{ job.company.charAt(0) }}
          </div>

          <div class="min-w-0">
            <!-- Badges -->
            <div class="flex flex-wrap items-center gap-1.5 mb-1.5">
              <span :class="['text-[11px] px-2.5 py-0.5 rounded-full border font-bold', typeColors[job.type] || 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600']">
                {{ job.type }}
              </span>
              <span class="text-[11px] px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-medium">
                {{ job.category }}
              </span>
            </div>

            <!-- Job Title -->
            <h3 class="font-bold text-[#0A2540] dark:text-white text-base group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors leading-snug line-clamp-1">
              <router-link :to="'/jobs/' + job.id">
                {{ job.title }}
              </router-link>
            </h3>

            <!-- Company Name -->
            <p class="text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
              <Building2 class="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
              <span class="truncate">{{ job.company }}</span>
            </p>
          </div>
        </div>

        <!-- Bookmark Save Button (Obvious saved state) -->
        <button
          @click="toggleSaveJob(job.id)"
          :class="[
            'p-2.5 rounded-xl transition-all shrink-0',
            isJobSaved(job.id)
              ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 border border-blue-200 dark:border-blue-800'
              : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 border border-transparent'
          ]"
          :aria-label="isJobSaved(job.id) ? 'Unsave job' : 'Save job'"
          type="button"
        >
          <BookmarkCheck v-if="isJobSaved(job.id)" class="w-5 h-5 fill-current" />
          <Bookmark v-else class="w-5 h-5" />
        </button>
      </div>

      <!-- Description preview -->
      <p class="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed my-3">
        {{ job.description }}
      </p>

      <!-- Key Metadata Chips -->
      <div class="flex flex-wrap gap-2 text-xs font-semibold pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <!-- Salary Pill -->
        <div class="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 rounded-lg">
          <DollarSign class="w-3.5 h-3.5" />
          <span class="font-bold">{{ job.salary }}</span>
        </div>

        <!-- Location Pill -->
        <div class="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700 rounded-lg">
          <MapPin class="w-3.5 h-3.5 text-[#0D47A1] dark:text-blue-400" />
          <span>{{ job.location }}</span>
        </div>

        <!-- Posted Date -->
        <div class="flex items-center gap-1 px-2.5 py-1 bg-slate-50 dark:bg-slate-700/60 text-slate-500 dark:text-slate-400 border border-slate-200/80 dark:border-slate-700 rounded-lg">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ job.postedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between gap-3">
      <span class="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
        <Briefcase class="w-3 h-3 text-slate-400" />
        <span>Verified Employer</span>
      </span>

      <router-link
        :to="'/jobs/' + job.id"
        class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-[#0D47A1] text-[#0D47A1] dark:text-blue-300 hover:text-white dark:hover:text-white text-xs font-bold rounded-xl transition-colors duration-150"
      >
        <span>{{ t('common.viewDetails') }}</span>
        <ArrowRight class="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
      </router-link>
    </div>
  </div>
</template>
