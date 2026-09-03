<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Clock,
  DollarSign,
  Calendar,
  UserCheck,
  MapPin,
  ShieldCheck,
  ArrowLeft,
  ChevronRight,
  CheckCircle2,
  ChevronDown
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getGovernmentServiceById } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, localized, currentLanguage } = useLanguage()

const service = computed(() => {
  const id = route.params.id as string
  return getGovernmentServiceById(id)
})

usePageMeta({
  title: computed(() => service.value ? localized(service.value.title, service.value.titleKh) + ' — Government CamLife' : 'Government Service'),
  description: computed(() => service.value ? localized(service.value.description, service.value.descriptionKh) : '')
})


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
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
    <div v-if="service" class="space-y-10">
      <!-- Breadcrumb -->
      <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
        <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.home') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <router-link to="/government" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
          {{ t('nav.government') }}
        </router-link>
        <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        <span class="text-slate-700 dark:text-slate-200 truncate max-w-[200px] sm:max-w-xs">
          {{ localized(service.title, service.titleKh) }}
        </span>
      </nav>

      <!-- Back Link -->
      <div>
        <router-link
          to="/government"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Government Services</span>
        </router-link>
      </div>

      <!-- Hero Header Card -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-card space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200/80 dark:border-blue-900">
              {{ service.category }}
            </span>
            <span class="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold rounded-full border border-emerald-200/80 dark:border-emerald-800">
              <ShieldCheck class="w-3.5 h-3.5" />
              <span>Official Procedure</span>
            </span>
          </div>

          <ShareButtons :title="localized(service.title, service.titleKh)" />
        </div>

        <div>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-[#0A2540] dark:text-white tracking-tight leading-tight">
            {{ localized(service.title, service.titleKh) }}
          </h1>
          <p v-if="service.titleKh" class="text-base sm:text-lg font-khmer text-slate-500 dark:text-slate-400 mt-1">
            {{ service.titleKh }}
          </p>
        </div>

        <p class="text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
          {{ localized(service.description, service.descriptionKh) }}
        </p>

        <!-- Quick Facts Pill Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('government.processingTime') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
              <Clock class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span class="truncate">{{ localized(service.processingTime, service.processingTimeKh) }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('government.fee') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
              <DollarSign class="w-4 h-4 text-emerald-600 shrink-0" />
              <span class="truncate">{{ localized(service.fee, service.feeKh) }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('government.validity') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
              <Calendar class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span class="truncate">{{ localized(service.validity, service.validityKh) }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{{ t('government.ageRequirements') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm">
              <UserCheck class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span class="truncate">{{ localized(service.ageRequirements, service.ageRequirementsKh) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Application Steps Timeline -->
      <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
            {{ t('government.tabs.process') }}
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Follow this chronological procedure to complete your application smoothly.
          </p>
        </div>

        <div class="space-y-4">
          <div
            v-for="step in service.process"
            :key="step.step"
            class="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60"
          >
            <!-- Step Badge -->
            <div class="w-10 h-10 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
              0{{ step.step }}
            </div>

            <div class="space-y-1">
              <h3 class="font-bold text-base text-[#0A2540] dark:text-white">
                {{ localized(step.title, step.titleKh) }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ localized(step.description, step.descriptionKh) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- Requirements Checklist -->
      <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
            {{ t('government.tabs.requirements') }}
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Documents and items required to bring to the application desk.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div
            v-for="(req, idx) in requirementsList"
            :key="idx"
            class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60"
          >
            <CheckCircle2 class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <span class="text-xs font-semibold text-slate-700 dark:text-slate-200 leading-snug">
              {{ req }}
            </span>
          </div>
        </div>
      </section>

      <!-- Location of Application -->
      <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-4">
        <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
          {{ t('government.tabs.locations') }}
        </h2>
        <div class="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60">
          <MapPin class="w-5 h-5 text-[#0D47A1] dark:text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p class="text-xs sm:text-sm font-bold text-[#0A2540] dark:text-white">
              {{ localized(service.location, service.locationKh) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Ministry / Department Headquarters, Phnom Penh & Provincial One Window Service Offices.
            </p>
          </div>
        </div>
      </section>

      <!-- FAQ Section -->
      <section v-if="service.faq.length > 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 class="text-xl font-bold text-[#0A2540] dark:text-white">
            Frequently Asked Questions (FAQ)
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Common questions regarding eligibility, timelines, and lost documents.
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in service.faq"
            :key="idx"
            class="rounded-xl border border-slate-200/80 dark:border-slate-700 overflow-hidden"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-700/30 text-left font-bold text-xs sm:text-sm text-[#0A2540] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors"
              type="button"
            >
              <span>{{ localized(item.question, item.questionKh) }}</span>
              <ChevronDown
                class="w-4 h-4 text-slate-400 transition-transform"
                :class="expandedFaq === idx ? 'rotate-180 text-[#0D47A1]' : ''"
              />
            </button>

            <div v-if="expandedFaq === idx" class="p-4 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700">
              {{ localized(item.answer, item.answerKh) }}
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- 404 Fallback -->
    <NotFoundState
      v-else
      message="Government Guide Not Found"
      subtitle="The official service guide you requested is not available in our registry."
      back-link="/government"
      back-text="Back to Government Guides"
    />
  </div>
</template>
