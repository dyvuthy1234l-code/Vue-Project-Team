<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Clock,
  DollarSign,
  Calendar,
  UserCheck,
  MapPin,
  ArrowLeft,
  Printer,
  Bookmark,
  BookmarkCheck,
  AlertTriangle,
  ChevronDown
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import OfficialSource from '@/components/OfficialSource.vue'
import DocumentChecklist from '@/components/DocumentChecklist.vue'
import FeedbackWidget from '@/components/FeedbackWidget.vue'
import ReportModal from '@/components/ReportModal.vue'
import VerificationBadge from '@/components/VerificationBadge.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedServices } from '@/composables/useSavedServices'
import { getGovernmentServiceById } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { t, localized, currentLanguage } = useLanguage()
const { isSaved, toggleSave } = useSavedServices()

const isReportModalOpen = ref(false)
const expandedFaq = ref<number | null>(null)

const service = computed(() => {
  const id = route.params.id as string
  return getGovernmentServiceById(id)
})

usePageMeta({
  title: computed(() => service.value ? localized(service.value.title, service.value.titleKh) + ' — CamLife Civic Guide' : 'Government Service Guide'),
  description: computed(() => service.value ? localized(service.value.description, service.value.descriptionKh) : '')
})

function toggleFaq(index: number) {
  expandedFaq.value = expandedFaq.value === index ? null : index
}

function handleSaveService() {
  if (!service.value) return
  toggleSave({
    id: service.value.id,
    title: service.value.title,
    titleKh: service.value.titleKh,
    category: service.value.category,
    type: 'government',
    route: `/government/${service.value.id}`,
    savedAt: new Date().toISOString()
  })
}

function handlePrint() {
  window.print()
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 font-khmer">
    <div v-if="service" class="space-y-8">


      <!-- Back & Action Bar -->
      <div class="flex flex-wrap items-center justify-between gap-3">
        <router-link
          to="/government"
          class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅសេវាសាធារណៈទាំងអស់' : 'Back to Government Services' }}</span>
        </router-link>

        <div class="flex items-center gap-2">
          <!-- Save / Favorite Button -->
          <button
            @click="handleSaveService"
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all',
              isSaved(service.id)
                ? 'bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 border-[#0D47A1]'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
            ]"
            type="button"
          >
            <BookmarkCheck v-if="isSaved(service.id)" class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
            <Bookmark v-else class="w-4 h-4 text-slate-400" />
            <span>{{ isSaved(service.id) ? (currentLanguage === 'kh' ? 'បានរក្សាទុក' : 'Saved') : (currentLanguage === 'kh' ? 'រក្សាទុកសេវា' : 'Save Service') }}</span>
          </button>

          <!-- Print Button -->
          <button
            @click="handlePrint"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            type="button"
            :title="currentLanguage === 'kh' ? 'បោះពុម្ពមគ្គុទ្ទេសក៍' : 'Print Guide'"
          >
            <Printer class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'បោះពុម្ព' : 'Print' }}</span>
          </button>

          <!-- Report Incorrect Info Trigger -->
          <button
            @click="isReportModalOpen = true"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 hover:bg-amber-100 transition-colors"
            type="button"
          >
            <AlertTriangle class="w-3.5 h-3.5" />
            <span class="hidden sm:inline">{{ currentLanguage === 'kh' ? 'រាយការណ៍ព័ត៌មានខុស' : 'Report Issue' }}</span>
          </button>
        </div>
      </div>

      <!-- Representative Hero Image Banner -->
      <div v-if="service.image" class="relative h-56 sm:h-72 w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200/90 dark:border-slate-700 bg-slate-100 dark:bg-slate-700">
        <LazyImage
          :src="service.image"
          :alt="localized(service.title, service.titleKh)"
          img-class="w-full h-56 sm:h-72 object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />
        <div class="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 flex items-center justify-between text-white pointer-events-none">
          <div class="flex items-center gap-2">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-900/90 text-[#0D47A1] dark:text-blue-300 shadow-sm backdrop-blur-xs">
              {{ service.category }}
            </span>
          </div>
          <span class="text-xs font-semibold bg-black/50 px-3 py-1 rounded-full backdrop-blur-xs">
            Official Civic Document
          </span>
        </div>
      </div>

      <!-- ============================================================
           1. HERO HEADER CARD: TITLE, BADGES, DESCRIPTION, QUICK METRICS
      ============================================================= -->
      <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-card space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-3 py-1 bg-blue-50 dark:bg-blue-950/50 text-[#0D47A1] dark:text-blue-300 text-xs font-bold rounded-full border border-blue-200/80 dark:border-blue-900">
              {{ service.category }}
            </span>
            <VerificationBadge compact />
          </div>

          <ShareButtons :title="localized(service.title, service.titleKh)" />
        </div>

        <div>
          <h1 class="text-2xl sm:text-4xl font-extrabold text-[#0A2540] dark:text-white tracking-tight leading-tight font-khmer">
            {{ localized(service.title, service.titleKh) }}
          </h1>
          <p v-if="service.titleKh && currentLanguage === 'en'" class="text-base sm:text-lg font-khmer text-slate-500 dark:text-slate-400 mt-1">
            {{ service.titleKh }}
          </p>
        </div>

        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl font-khmer">
          {{ localized(service.description, service.descriptionKh) }}
        </p>

        <!-- Quick Facts Matrix Grid -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60">
          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-khmer">{{ t('government.processingTime') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm font-khmer">
              <Clock class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span class="truncate">{{ localized(service.processingTime, service.processingTimeKh) }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-khmer">{{ t('government.fee') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm font-khmer">
              <DollarSign class="w-4 h-4 text-emerald-600 shrink-0" />
              <span class="truncate">{{ localized(service.fee, service.feeKh) }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-khmer">{{ t('government.validity') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm font-khmer">
              <Calendar class="w-4 h-4 text-purple-600 shrink-0" />
              <span class="truncate">{{ localized(service.validity, service.validityKh) }}</span>
            </div>
          </div>

          <div class="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/70 dark:border-slate-600/60">
            <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-khmer">{{ t('government.ageRequirements') }}</span>
            <div class="flex items-center gap-1.5 mt-1 font-bold text-slate-800 dark:text-white text-xs sm:text-sm font-khmer">
              <UserCheck class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 shrink-0" />
              <span class="truncate">{{ localized(service.ageRequirements, service.ageRequirementsKh) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ============================================================
           2. OFFICIAL SOURCE & VERIFICATION BOX
      ============================================================= -->
      <OfficialSource
        :source-name="service.category === 'Identity' ? 'General Department of Identification, Ministry of Interior' : 'Ministry of Public Works and Transport / Royal Government of Cambodia'"
        :source-name-kh="service.category === 'Identity' ? 'អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្ម ក្រសួងមហាផ្ទៃ' : 'ក្រសួងសាធារណការ និងដឹកជញ្ជូន / រាជរដ្ឋាភិបាលកម្ពុជា'"
        official-url="https://gdi.gov.kh"
        last-verified-date="04 September 2026"
      />

      <!-- ============================================================
           3. INTERACTIVE DOCUMENT CHECKLIST & PROGRESS TRACKING
      ============================================================= -->
      <DocumentChecklist
        :service-id="service.id"
        :service-title="localized(service.title, service.titleKh)"
        :requirements="service.requirements"
        :requirements-kh="service.requirementsKh"
      />

      <!-- ============================================================
           4. STEP-BY-STEP APPLICATION TIMELINE
      ============================================================= -->
      <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'ដំណើរការអនុវត្តជាជំហានៗ' : 'Step-by-Step Procedure' }}
          </h2>
          <p class="text-xs text-slate-400 mt-1 font-khmer">
            {{ currentLanguage === 'kh' ? 'សូមធ្វើតាមលំដាប់លំដោយ ដើម្បីទទួលបានលទ្ធផលឆាប់រហ័ស និងជៀសវាងការខាតពេល' : 'Follow this chronological workflow to finish your application smoothly.' }}
          </p>
        </div>

        <div class="space-y-3.5">
          <div
            v-for="step in service.process"
            :key="step.step"
            class="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60"
          >
            <!-- Step Badge -->
            <div class="w-10 h-10 rounded-xl bg-[#0D47A1] text-white flex items-center justify-center font-black text-sm shrink-0 shadow-xs font-mono">
              0{{ step.step }}
            </div>

            <div class="space-y-1 font-khmer">
              <h3 class="font-black text-sm sm:text-base text-[#0A2540] dark:text-white">
                {{ localized(step.title, step.titleKh) }}
              </h3>
              <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {{ localized(step.description, step.descriptionKh) }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           5. WHERE TO APPLY (OFFICE LOCATIONS & OWSO)
      ============================================================= -->
      <section class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-4">
        <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white font-khmer">
          {{ currentLanguage === 'kh' ? 'ទីតាំងផ្តល់សេវា និងច្រកចេញចូលតែមួយ (OWSO)' : 'Where to Apply' }}
        </h2>
        <div class="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-600/60 font-khmer">
          <MapPin class="w-5 h-5 text-[#0D47A1] dark:text-blue-400 mt-0.5 shrink-0" />
          <div>
            <p class="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white">
              {{ localized(service.location, service.locationKh) }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {{ currentLanguage === 'kh' ? 'ម៉ោងធ្វើការ៖ ច័ន្ទ ដល់ សុក្រ ៨:០០ ព្រឹក – ៥:០០ ល្ងាច (សម្រាកថ្ងៃបុណ្យជាតិ)' : 'Opening Hours: Monday to Friday 8:00 AM – 5:00 PM' }}
            </p>
          </div>
        </div>
      </section>

      <!-- ============================================================
           6. FAQ SECTION
      ============================================================= -->
      <section v-if="service.faq.length > 0" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-sm space-y-6">
        <div>
          <h2 class="text-lg sm:text-xl font-black text-[#0A2540] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'សំណួរដែលសួរញឹកញាប់ (FAQ)' : 'Frequently Asked Questions (FAQ)' }}
          </h2>
          <p class="text-xs text-slate-400 mt-1 font-khmer">
            {{ currentLanguage === 'kh' ? 'ចម្លើយចំពោះសំណួរទូទៅអំពីលក្ខខណ្ឌ ឯកសារបាត់បង់ និងករណីពិសេស' : 'Common questions regarding eligibility, timelines, and lost documents.' }}
          </p>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, idx) in service.faq"
            :key="idx"
            class="rounded-2xl border border-slate-200/80 dark:border-slate-700 overflow-hidden"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full flex items-center justify-between p-4 bg-slate-50/70 dark:bg-slate-700/30 text-left font-black text-xs sm:text-sm text-[#0A2540] dark:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors font-khmer"
              type="button"
            >
              <span>{{ localized(item.question, item.questionKh) }}</span>
              <ChevronDown
                class="w-4 h-4 text-slate-400 transition-transform"
                :class="expandedFaq === idx ? 'rotate-180 text-[#0D47A1]' : ''"
              />
            </button>

            <div v-if="expandedFaq === idx" class="p-4 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700 font-khmer">
              {{ localized(item.answer, item.answerKh) }}
            </div>
          </div>
        </div>
      </section>

      <!-- ============================================================
           7. CITIZEN MICRO-FEEDBACK WIDGET
      ============================================================= -->
      <FeedbackWidget
        :service-id="service.id"
        :service-title="localized(service.title, service.titleKh)"
      />
    </div>

    <!-- 404 Fallback -->
    <NotFoundState
      v-else
      message="Government Guide Not Found"
      subtitle="The official service guide you requested is not available in our registry."
      back-link="/government"
      back-text="Back to Government Guides"
    />

    <!-- Report Modal -->
    <ReportModal
      v-if="service"
      :is-open="isReportModalOpen"
      :service-id="service.id"
      :service-title="localized(service.title, service.titleKh)"
      @close="isReportModalOpen = false"
    />
  </div>
</template>
