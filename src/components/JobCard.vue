<script setup lang="ts">
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck, ArrowRight, Building2 } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import type { Job } from '@/types'

const { t } = useLanguage()
const { isJobSaved, toggleSaveJob } = useSavedJobs()

defineProps<{
  job: Job
}>()

const typeColors: Record<string, string> = {
  'Full-time': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Part-time': 'bg-blue-50 text-blue-700 border-blue-200',
  'Internship': 'bg-purple-50 text-purple-700 border-purple-200',
  'Freelance': 'bg-amber-50 text-amber-700 border-amber-200'
}
</script>

<template>
  <div class="group bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between">
    <div>
      <!-- Header row -->
      <div class="flex justify-between items-start gap-3 mb-3">
        <div class="flex items-start space-x-3.5 min-w-0">
          <div class="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-camlife-deep font-extrabold text-lg flex-shrink-0 group-hover:bg-camlife-light group-hover:text-camlife-action transition-colors">
            {{ job.company.charAt(0) }}
          </div>
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-1.5 mb-1">
              <span :class="['text-[11px] px-2.5 py-0.5 rounded-full border font-bold', typeColors[job.type] || 'bg-slate-100 text-slate-700 border-slate-200']">
                {{ job.type }}
              </span>
              <span class="text-[11px] px-2.5 py-0.5 bg-slate-100 text-slate-600 rounded-full font-medium">
                {{ job.category }}
              </span>
            </div>
            <h3 class="font-extrabold text-camlife-navy text-base group-hover:text-camlife-action transition-colors leading-snug">
              <router-link :to="'/jobs/' + job.id">
                {{ job.title }}
              </router-link>
            </h3>
            <p class="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-0.5">
              <Building2 class="w-3.5 h-3.5 text-slate-400" />
              <span>{{ job.company }}</span>
            </p>
          </div>
        </div>

        <button
          @click="toggleSaveJob(job.id)"
          class="p-2.5 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-camlife-action flex-shrink-0"
          :aria-label="isJobSaved(job.id) ? 'Unsave job' : 'Save job'"
          type="button"
        >
          <BookmarkCheck v-if="isJobSaved(job.id)" class="w-5 h-5 text-camlife-action fill-camlife-action/20" />
          <Bookmark v-else class="w-5 h-5 text-slate-400" />
        </button>
      </div>

      <!-- Description preview -->
      <p class="text-xs text-slate-600 line-clamp-2 leading-relaxed my-3">
        {{ job.description }}
      </p>

      <!-- Meta Pill Row -->
      <div class="flex flex-wrap gap-2 text-xs font-medium text-slate-500 pt-2 border-t border-slate-100">
        <div class="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/60">
          <DollarSign class="w-3.5 h-3.5 text-emerald-600" />
          <span class="font-bold text-slate-700">{{ job.salary }}</span>
        </div>
        <div class="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/60">
          <MapPin class="w-3.5 h-3.5 text-camlife-action" />
          <span>{{ job.location }}</span>
        </div>
        <div class="flex items-center space-x-1 px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-200/60">
          <Clock class="w-3.5 h-3.5 text-slate-400" />
          <span>{{ job.postedDate }}</span>
        </div>
      </div>
    </div>

    <!-- Action -->
    <div class="mt-4 pt-3 border-t border-slate-100 flex justify-end">
      <router-link
        :to="'/jobs/' + job.id"
        class="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-camlife-light hover:bg-camlife-action text-camlife-action hover:text-white text-xs font-bold rounded-xl transition-all duration-200"
      >
        <span>{{ t('common.viewDetails') }}</span>
        <ArrowRight class="w-3.5 h-3.5" />
      </router-link>
    </div>
  </div>
</template>
