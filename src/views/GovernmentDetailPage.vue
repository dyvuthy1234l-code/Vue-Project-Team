<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Clock, DollarSign, Calendar, UserCheck, MapPin, HelpCircle,
  ShieldCheck, ArrowLeft, Download
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServiceById } from '@/services/dataService'

const route = useRoute()
const { t, localized, currentLanguage } = useLanguage()

const service = computed(() => {
  const id = route.params.id as string
  return getGovernmentServiceById(id)
})

const activeTab = ref('overview')

const tabs = computed(() => [
  { key: 'overview', label: t('government.tabs.overview') },
  { key: 'requirements', label: t('government.tabs.requirements') },
  { key: 'process', label: t('government.tabs.process') },
  { key: 'locations', label: t('government.tabs.locations') },
  { key: 'faq', label: t('government.tabs.faq') },
])

const requirementsList = computed(() => {
  if (!service.value) return []
  return currentLanguage.value === 'en' ? service.value.requirements : service.value.requirementsKh
})

const expandedFaq = ref<number | null>(null)

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div v-if="service" class="space-y-8">
      <!-- Breadcrumb -->
      <router-link
        to="/government"
        class="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-camlife-action transition-colors group"
      >
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>Back to {{ t('nav.government') }}</span>
      </router-link>

      <!-- Hero Header -->
      <div class="bg-gradient-to-br from-camlife-deep via-slate-800 to-camlife-navy text-white rounded-3xl p-6 sm:p-10 shadow-card-hover relative overflow-hidden">
        <div class="absolute -right-20 -top-20 w-80 h-80 bg-camlife-action/20 rounded-full blur-3xl pointer-events-none"></div>

        <div class="relative z-10 space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-white/15 backdrop-blur-md text-white text-xs font-bold rounded-full">
              {{ service.category }}
            </span>
            <span class="px-3 py-1 bg-emerald-500/20 backdrop-blur-md text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1 border border-emerald-500/30">
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>Official Kingdom Procedure</span>
            </span>
          </div>

          <h1 class="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {{ localized(service.title, service.titleKh) }}
          </h1>

          <p class="text-sm text-slate-200 leading-relaxed max-w-2xl">
            {{ localized(service.description, service.descriptionKh) }}
          </p>
        </div>
      </div>

      <!-- PROCESS STEPPER INDICATOR -->
      <div v-if="service.process.length > 0" class="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-subtle space-y-4">
        <h2 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Application Journey</h2>
        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div
            v-for="step in service.process"
            :key="step.step"
            class="flex items-center space-x-2.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/60"
          >
            <div class="w-8 h-8 rounded-xl bg-camlife-action text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-sm">
              0{{ step.step }}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-camlife-navy truncate">{{ localized(step.title, step.titleKh) }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- TABS CONTROL & CONTENT -->
      <div class="bg-white rounded-3xl border border-slate-200/90 shadow-subtle overflow-hidden">
        <!-- Tabs Header -->
        <div class="border-b border-slate-200 bg-slate-50/70 px-4 pt-3">
          <div class="flex space-x-2 overflow-x-auto scrollbar-none">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              @click="activeTab = tab.key"
              :class="[
                'px-5 py-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap rounded-t-xl focus:outline-none',
                activeTab === tab.key
                  ? 'border-camlife-action text-camlife-action bg-white shadow-subtle'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              ]"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>

        <!-- Tab Panels -->
        <div class="p-6 sm:p-8">
          <!-- Overview Tab -->
          <div v-if="activeTab === 'overview'" class="space-y-6">
            <h2 class="text-lg font-extrabold text-camlife-navy">Service Overview</h2>
            <p class="text-sm text-slate-600 leading-relaxed">
              {{ localized(service.description, service.descriptionKh) }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <Clock class="w-5 h-5 text-camlife-action mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('government.processingTime') }}</p>
                  <p class="text-sm font-bold text-camlife-navy mt-0.5">{{ localized(service.processingTime, service.processingTimeKh) }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <DollarSign class="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('government.fee') }}</p>
                  <p class="text-sm font-bold text-camlife-navy mt-0.5">{{ localized(service.fee, service.feeKh) }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <Calendar class="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('government.validity') }}</p>
                  <p class="text-sm font-bold text-camlife-navy mt-0.5">{{ localized(service.validity, service.validityKh) }}</p>
                </div>
              </div>

              <div class="flex items-start space-x-3.5 p-4 bg-slate-50 rounded-2xl border border-slate-200/60">
                <UserCheck class="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">{{ t('government.ageRequirements') }}</p>
                  <p class="text-sm font-bold text-camlife-navy mt-0.5">{{ localized(service.ageRequirements, service.ageRequirementsKh) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Requirements Tab -->
          <div v-if="activeTab === 'requirements'" class="space-y-6">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-extrabold text-camlife-navy">{{ t('government.requiredDocuments') }}</h2>
              <span class="text-xs text-camlife-muted font-semibold">{{ requirementsList.length }} items required</span>
            </div>

            <ul class="space-y-3">
              <li
                v-for="(req, index) in requirementsList"
                :key="index"
                class="flex items-start space-x-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/60"
              >
                <div class="w-6 h-6 rounded-full bg-camlife-light text-camlife-action font-extrabold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {{ index + 1 }}
                </div>
                <span class="text-sm font-semibold text-slate-700 leading-snug">{{ req }}</span>
              </li>
            </ul>
          </div>

          <!-- Process Tab -->
          <div v-if="activeTab === 'process'" class="space-y-6">
            <h2 class="text-lg font-extrabold text-camlife-navy">{{ t('government.applicationSteps') }}</h2>
            <div class="space-y-4">
              <div
                v-for="step in service.process"
                :key="step.step"
                class="flex items-start space-x-4 p-5 bg-slate-50 rounded-2xl border border-slate-200/60"
              >
                <div class="w-10 h-10 rounded-2xl bg-camlife-action text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-sm">
                  0{{ step.step }}
                </div>
                <div class="space-y-1">
                  <h3 class="font-extrabold text-camlife-navy text-base">{{ localized(step.title, step.titleKh) }}</h3>
                  <p class="text-xs text-slate-600 leading-relaxed">{{ localized(step.description, step.descriptionKh) }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Locations Tab -->
          <div v-if="activeTab === 'locations'" class="space-y-6">
            <div class="p-6 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-3">
              <div class="flex items-start space-x-3">
                <MapPin class="w-5 h-5 text-camlife-action mt-0.5 flex-shrink-0" />
                <div>
                  <h3 class="font-bold text-camlife-navy text-base">{{ t('government.viewLocations') }}</h3>
                  <p class="text-xs text-slate-600 mt-1 leading-relaxed">{{ localized(service.location, service.locationKh) }}</p>
                </div>
              </div>
            </div>

            <div class="flex flex-wrap gap-3">
              <router-link
                to="/locations"
                class="inline-flex items-center space-x-2 px-5 py-3 bg-camlife-action hover:bg-camlife-action-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all"
              >
                <MapPin class="w-4 h-4" />
                <span>Explore Nearby Locations</span>
              </router-link>

              <button
                class="inline-flex items-center space-x-2 px-5 py-3 bg-slate-100 text-slate-400 rounded-xl text-xs font-bold cursor-not-allowed border border-slate-200"
                disabled
              >
                <Download class="w-4 h-4" />
                <span>{{ t('government.downloadGuide') }} (PDF)</span>
              </button>
            </div>
          </div>

          <!-- FAQ Tab -->
          <div v-if="activeTab === 'faq'" class="space-y-4">
            <h2 class="text-lg font-extrabold text-camlife-navy mb-4">Frequently Asked Questions</h2>
            <div
              v-for="(faq, index) in service.faq"
              :key="index"
              class="bg-slate-50 rounded-2xl border border-slate-200/60 overflow-hidden transition-all"
            >
              <button
                @click="toggleFaq(index)"
                class="w-full flex items-center justify-between p-5 text-left focus:outline-none"
              >
                <span class="font-extrabold text-camlife-navy text-sm">{{ localized(faq.question, faq.questionKh) }}</span>
                <HelpCircle class="w-5 h-5 text-slate-400 flex-shrink-0" />
              </button>
              <div v-if="expandedFaq === index" class="px-5 pb-5 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-200/40">
                {{ localized(faq.answer, faq.answerKh) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <NotFoundState v-else />
  </div>
</template>
