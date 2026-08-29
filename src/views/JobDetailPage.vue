<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { MapPin, DollarSign, Clock, Briefcase, ExternalLink, Bookmark, BookmarkCheck, CheckCircle2, ArrowLeft, Building2 } from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { getJobById } from '@/services/dataService'

const route = useRoute()
const { t } = useLanguage()
const { isJobSaved, toggleSaveJob } = useSavedJobs()

const job = computed(() => {
  const id = route.params.id as string
  return getJobById(id)
})
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div v-if="job" class="space-y-8">
      <!-- Breadcrumb -->
      <router-link
        to="/jobs"
        class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to {{ t('nav.jobs') }}</span>
      </router-link>

      <!-- Hero Banner -->
      <div class="bg-gradient-to-br from-camlife-deep via-slate-800 to-camlife-navy text-white rounded-3xl p-6 sm:p-10 shadow-card-hover relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-camlife-action/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
          <div class="space-y-3">
            <div class="flex items-center space-x-2">
              <span class="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-bold rounded-full">
                {{ job.type }}
              </span>
              <span class="px-3 py-1 bg-camlife-action/30 backdrop-blur-md text-slate-200 text-xs font-semibold rounded-full">
                {{ job.category }}
              </span>
            </div>

            <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {{ job.title }}
            </h1>

            <p class="text-base text-slate-300 font-semibold flex items-center gap-1.5">
              <Building2 class="w-4 h-4 text-camlife-action" />
              <span>{{ job.company }}</span>
            </p>
          </div>

          <!-- Save Job -->
          <button
            @click="toggleSaveJob(job.id)"
            :class="[
              'inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex-shrink-0',
              isJobSaved(job.id)
                ? 'bg-camlife-light text-camlife-action border border-camlife-action/30'
                : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'
            ]"
            type="button"
          >
            <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 text-camlife-action" />
            <Bookmark v-else class="w-4 h-4" />
            <span>{{ isJobSaved(job.id) ? t('jobs.savedJob') : t('jobs.saveJob') }}</span>
          </button>
        </div>
      </div>

      <!-- Main Layout: Details & Sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left 2 Cols: Description, Requirements, Benefits -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Job Description -->
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy">Job Overview & Role</h2>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ job.description }}
            </p>
          </div>

          <!-- Requirements -->
          <div v-if="job.requirements.length > 0" class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy">{{ t('jobs.requirements') }}</h2>
            <ul class="space-y-3">
              <li
                v-for="(req, i) in job.requirements"
                :key="i"
                class="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60"
              >
                <CheckCircle2 class="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <span class="text-xs font-semibold text-slate-700 leading-relaxed">{{ req }}</span>
              </li>
            </ul>
          </div>

          <!-- Benefits -->
          <div v-if="job.benefits.length > 0" class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-subtle space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy">{{ t('jobs.benefits') }}</h2>
            <ul class="space-y-3">
              <li
                v-for="(benefit, i) in job.benefits"
                :key="i"
                class="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60"
              >
                <CheckCircle2 class="w-4 h-4 text-camlife-action mt-0.5 flex-shrink-0" />
                <span class="text-xs font-semibold text-slate-700 leading-relaxed">{{ benefit }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Right 1 Col: Job Summary Sidebar -->
        <div class="space-y-6">
          <div class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle sticky top-24 space-y-6">
            <h3 class="font-extrabold text-camlife-navy text-base border-b border-slate-100 pb-3">Job Summary</h3>

            <div class="space-y-4 text-xs">
              <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <DollarSign class="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <div>
                  <p class="text-slate-400 font-medium">Monthly Salary</p>
                  <p class="font-extrabold text-slate-800 text-sm mt-0.5">{{ job.salary }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <MapPin class="w-4 h-4 text-camlife-action flex-shrink-0" />
                <div>
                  <p class="text-slate-400 font-medium">Location</p>
                  <p class="font-bold text-slate-800 text-xs mt-0.5">{{ job.location }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <Briefcase class="w-4 h-4 text-purple-600 flex-shrink-0" />
                <div>
                  <p class="text-slate-400 font-medium">Job Type</p>
                  <p class="font-bold text-slate-800 text-xs mt-0.5">{{ job.type }}</p>
                </div>
              </div>

              <div class="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200/60">
                <Clock class="w-4 h-4 text-slate-400 flex-shrink-0" />
                <div>
                  <p class="text-slate-400 font-medium">Date Posted</p>
                  <p class="font-bold text-slate-800 text-xs mt-0.5">{{ job.postedDate }}</p>
                </div>
              </div>
            </div>

            <!-- Primary Apply Action -->
            <div class="pt-2">
              <a
                v-if="job.applyUrl"
                :href="job.applyUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-center space-x-2 w-full py-4 bg-camlife-action hover:bg-camlife-action-hover text-white font-extrabold rounded-2xl shadow-md transition-all hover:shadow-lg text-sm"
              >
                <span>{{ t('jobs.applyNow') }}</span>
                <ExternalLink class="w-4 h-4" />
              </a>
              <span v-else class="block text-center py-3 bg-slate-100 text-slate-400 text-xs font-bold rounded-2xl">
                Application link unavailable
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NotFoundState v-else />
  </div>
</template>
