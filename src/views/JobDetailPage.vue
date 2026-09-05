<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  MapPin,
  Clock,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Share2,
  Printer,
  Send,
  Building2,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Mail,
  Globe,
  FileText,
  UploadCloud,
  X,
  LayoutGrid,
  List
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { useSavedJobs } from '@/composables/useSavedJobs'
import { getJobById, getJobs } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'
import type { Job } from '@/types'

const route = useRoute()
const { currentLanguage } = useLanguage()
const { isJobSaved, toggleSaveJob } = useSavedJobs()

const allJobsList = getJobs()

const job = computed(() => {
  const id = route.params.id as string
  try {
    const userJobsStr = localStorage.getItem('camlife_user_jobs')
    if (userJobsStr) {
      const userJobs: Job[] = JSON.parse(userJobsStr)
      const found = userJobs.find(j => j.id === id)
      if (found) return found
    }
  } catch (e) {
    console.error(e)
  }
  return getJobById(id)
})

usePageMeta({
  title: computed(() => job.value ? `${job.value.title} — BongThom Job Detail` : 'Job Detail'),
  description: computed(() => job.value?.description || '')
})

// Generate BongThom Job ID (e.g. 41445 or 67602)
function getJobIdNumber(j: Job): string {
  let hash = 0
  for (let i = 0; i < j.id.length; i++) {
    hash = (hash << 5) - hash + j.id.charCodeAt(i)
    hash |= 0
  }
  const idNum = 40000 + (Math.abs(hash) % 2000)
  return `${idNum}`
}

// Generate closing date
function getClosingDate(j: Job): string {
  const dateObj = new Date(j.postedDate)
  dateObj.setDate(dateObj.getDate() + 20)
  const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const monthsKh = ['មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ']
  const m = dateObj.getMonth()
  const d = dateObj.getDate()
  const y = dateObj.getFullYear() + 1
  return currentLanguage.value === 'kh' ? `${d}-${monthsKh[m]}-${y}` : `${d}-${monthsEn[m]}-${y}`
}

// Generate duration left
function getDurationLeft(j: Job): string {
  let hash = 0
  for (let i = 0; i < j.id.length; i++) {
    hash = (hash << 3) + j.id.charCodeAt(i)
  }
  const days = 2 + (Math.abs(hash) % 15)
  return `${days} days`
}

// Similar Jobs (8 jobs matching 2-column grid in screenshot)
const similarJobs = computed(() => {
  if (!job.value) return []
  return allJobsList.filter(j => j.id !== job.value?.id).slice(0, 8)
})

// Section Accordions State
const isExpectedOutputsOpen = ref(true)
const isJobCardExpanded = ref(true)
const similarViewMode = ref<'grid' | 'list'>('grid')

// Print Job Details
function printJob() {
  window.print()
}

// Share Job
const isShareCopied = ref(false)
function shareJob() {
  if (navigator.share) {
    navigator.share({
      title: job.value?.title || 'Job Opening',
      url: window.location.href
    }).catch(() => {})
  } else {
    navigator.clipboard.writeText(window.location.href)
    isShareCopied.value = true
    setTimeout(() => { isShareCopied.value = false }, 2000)
  }
}

// Quick Apply Modal
const isApplyModalOpen = ref(false)
const applyForm = ref({
  fullName: '',
  phone: '',
  email: '',
  cvFileName: ''
})
const isApplySubmitted = ref(false)

function openApplyModal() {
  isApplySubmitted.value = false
  isApplyModalOpen.value = true
}

function handleCvFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    applyForm.value.cvFileName = target.files[0].name
  }
}

function submitApplication() {
  if (!applyForm.value.fullName || !applyForm.value.phone || !job.value) return
  
  try {
    const existingApps = JSON.parse(localStorage.getItem('camlife_job_applications') || '[]')
    existingApps.unshift({
      id: 'app-' + Date.now(),
      jobId: job.value.id,
      jobTitle: job.value.title,
      company: job.value.company,
      fullName: applyForm.value.fullName,
      phone: applyForm.value.phone,
      email: applyForm.value.email,
      cvFileName: applyForm.value.cvFileName || 'CV_Resume.pdf',
      appliedAt: new Date().toISOString()
    })
    localStorage.setItem('camlife_job_applications', JSON.stringify(existingApps))
  } catch (e) {
    console.error(e)
  }

  isApplySubmitted.value = true
}
</script>

<template>
  <div class="bongthom-job-detail min-h-screen bg-[#F4F6F9] dark:bg-slate-950 font-khmer pb-20 text-slate-800 dark:text-white">
    
    <div v-if="job" class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-6">
      
      <!-- Back Button Row -->
      <div class="flex items-center justify-between gap-3 pb-1">
        <router-link
          to="/jobs"
          class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-[#0D47A1] dark:hover:text-blue-400 hover:border-blue-200 shadow-2xs transition-all group w-fit shrink-0"
        >
          <ArrowLeft class="w-4 h-4 transition-transform group-hover:-translate-x-1 text-[#0D47A1] dark:text-blue-400" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅបញ្ជីការងារ' : 'Back to Jobs' }}</span>
        </router-link>
      </div>

      <!-- ============================================================ -->
      <!-- 2-COLUMN BONGTHOM JOB DETAIL LAYOUT (EXACT SCREENSHOT MATCH)  -->
      <!-- ============================================================ -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-5 items-start">
        
        <!-- ========================================================== -->
        <!-- LEFT COLUMN: SIDEBAR (ID, ACTIONS, TOC, CONTACT DETAILS)    -->
        <!-- ========================================================== -->
        <aside class="lg:col-span-1 space-y-4">
          
          <!-- Card 1: Header ID & Action Bar -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <!-- BTDC-ID Header with Bookmark Ribbon -->
            <div class="bg-[#003366] text-white p-2.5 flex items-center justify-between">
              <span class="font-black text-xs sm:text-sm tracking-wide">
                BTDC-ID: {{ getJobIdNumber(job) }}
              </span>
              <button
                @click="toggleSaveJob(job.id)"
                type="button"
                :title="isJobSaved(job.id) ? 'Saved' : 'Save Job'"
                class="text-amber-300 hover:text-white cursor-pointer p-0.5"
              >
                <BookmarkCheck v-if="isJobSaved(job.id)" class="w-4 h-4 fill-current" />
                <Bookmark v-else class="w-4 h-4 text-white" />
              </button>
            </div>

            <!-- Closing Date Cyan Bar -->
            <div class="bg-[#0099CC] text-white text-[11px] font-bold px-3 py-1.5 flex items-center justify-between">
              <span>CLOSING DATE: {{ getClosingDate(job) }}</span>
              <Clock class="w-3.5 h-3.5" />
            </div>

            <!-- Action Buttons: Share, Apply, Print -->
            <div class="grid grid-cols-3 divide-x divide-slate-100 dark:divide-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300">
              <button
                @click="shareJob"
                type="button"
                class="py-2.5 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-[10px] font-bold"
                title="Share Job"
              >
                <Share2 class="w-4 h-4 text-[#003366] dark:text-blue-400" />
                <span>{{ isShareCopied ? 'Copied!' : 'Share' }}</span>
              </button>

              <button
                @click="openApplyModal"
                type="button"
                class="py-2.5 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-[10px] font-bold"
                title="Apply Now"
              >
                <Send class="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Apply</span>
              </button>

              <button
                @click="printJob"
                type="button"
                class="py-2.5 flex flex-col items-center justify-center gap-1 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors cursor-pointer text-[10px] font-bold"
                title="Print Job"
              >
                <Printer class="w-4 h-4 text-slate-600 dark:text-slate-300" />
                <span>Print</span>
              </button>
            </div>
          </div>

          <!-- Card 2: Expected Outputs Accordion Navigation -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <div class="bg-[#003366] text-white p-2.5 font-bold text-xs flex items-center justify-between">
              <span>Expected Outputs</span>
              <ChevronDown class="w-3.5 h-3.5" />
            </div>
            <div class="p-3 text-[11px] text-[#003366] dark:text-blue-400 font-semibold space-y-1.5">
              <a href="#job-description-section" class="flex items-start gap-1.5 hover:underline">
                <span class="text-blue-500 font-bold">•</span>
                <span>{{ job.title }}</span>
              </a>
            </div>
          </div>

          <!-- Card 3: Contact Details Card -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <div class="bg-[#003366] text-white p-2.5 font-bold text-xs">
              <span>Contact Details</span>
            </div>
            <div class="p-3.5 space-y-3 text-[11px]">
              
              <!-- Office Address -->
              <div class="space-y-0.5">
                <p class="font-extrabold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Building2 class="w-3 h-3 text-[#003366] dark:text-blue-400" />
                  <span>OFFICE ADDRESS</span>
                </p>
                <p class="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  # 4, Street 422, Sangkat Boeung Trabaek, Khan Chamkar Mon, {{ job.location }}, Cambodia
                </p>
              </div>

              <!-- Contact Name -->
              <div class="space-y-0.5">
                <p class="font-extrabold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <span class="inline-flex items-center gap-1"><User class="w-3.5 h-3.5 text-blue-600" /> <span>CONTACT NAME</span></span>
                </p>
                <p class="text-slate-800 dark:text-white font-bold">
                  {{ job.company }}
                </p>
              </div>

              <!-- Email -->
              <div class="space-y-0.5">
                <p class="font-extrabold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Mail class="w-3 h-3 text-emerald-600" />
                  <span>EMAIL</span>
                </p>
                <a
                  :href="'mailto:careers@' + job.company.toLowerCase().replace(/[^a-z]/g, '') + '.com'"
                  class="text-[#003366] dark:text-blue-400 font-semibold hover:underline break-all"
                >
                  recruitment.cambodia@{{ job.company.toLowerCase().replace(/[^a-z]/g, '') }}.net
                </a>
              </div>

              <!-- Website -->
              <div class="space-y-0.5">
                <p class="font-extrabold text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Globe class="w-3 h-3 text-blue-500" />
                  <span>WEBSITE</span>
                </p>
                <a
                  :href="job.applyUrl"
                  target="_blank"
                  class="text-[#003366] dark:text-blue-400 font-semibold hover:underline truncate block"
                >
                  {{ job.applyUrl }}
                </a>
              </div>

            </div>
          </div>

        </aside>

        <!-- ========================================================== -->
        <!-- RIGHT COLUMN: MAIN JOB ANNOUNCEMENT & DESCRIPTION CONTENT  -->
        <!-- ========================================================== -->
        <main class="lg:col-span-3 space-y-4">
          
          <!-- Section 1: Announcement Description Strip -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <div class="bg-[#003366] text-white px-3 py-2 font-bold text-xs sm:text-sm">
              Announcement Description
            </div>
            <div class="p-3.5 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              We would like to invite qualified service providers / bidders / applicants to participate in applying for {{ job.title }} at {{ job.company }}.
            </div>
          </div>

          <!-- Section 2: Expected Outputs & Role Description -->
          <div id="job-description-section" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <!-- Blue Header Bar -->
            <button
              @click="isExpectedOutputsOpen = !isExpectedOutputsOpen"
              type="button"
              class="w-full bg-[#003366] text-white px-3 py-2 font-bold text-xs sm:text-sm flex items-center justify-between cursor-pointer select-none"
            >
              <span>Expected Outputs</span>
              <ChevronDown class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': !isExpectedOutputsOpen }" />
            </button>

            <!-- Boxed Job Detail Content -->
            <div v-if="isExpectedOutputsOpen" class="p-4 sm:p-5 space-y-5">
              
              <!-- Job Title & Meta Strip -->
              <div class="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div class="flex items-start justify-between gap-3">
                  <h1 class="text-base sm:text-lg font-black text-[#8B0000] dark:text-rose-400 leading-snug">
                    {{ job.title }}
                  </h1>
                  <button
                    @click="isJobCardExpanded = !isJobCardExpanded"
                    type="button"
                    class="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <ChevronUp v-if="isJobCardExpanded" class="w-4 h-4" />
                    <ChevronDown v-else class="w-4 h-4" />
                  </button>
                </div>

                <div class="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400 pt-2">
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-800 dark:text-slate-200">CAREER CATEGORY:</span>
                    <span class="text-[#003366] dark:text-blue-400">{{ job.category }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <MapPin class="w-3.5 h-3.5 text-rose-500" />
                    <span class="font-bold text-slate-800 dark:text-slate-200">LOCATION:</span>
                    <span>{{ job.location }}</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-bold text-slate-800 dark:text-slate-200">SALARY:</span>
                    <span class="text-emerald-700 dark:text-emerald-400 font-black">{{ job.salary }}</span>
                  </div>
                </div>
              </div>

              <!-- Main Description Text -->
              <div v-if="isJobCardExpanded" class="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                
                <!-- SUMMARY & SCOPE -->
                <div class="space-y-1">
                  <h2 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    SUMMARY & SCOPE OF WORK
                  </h2>
                  <p class="leading-relaxed">
                    {{ job.description }}
                  </p>
                </div>

                <!-- OUTCOME OF SELECTION PROCESS -->
                <div class="space-y-1">
                  <h2 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    OUTCOME OF SELECTION PROCESS
                  </h2>
                  <p class="leading-relaxed">
                    The contract awarded to the successful candidate or entity is a formal agreement committing {{ job.company }} to retain the specified services and qualifications under the agreed compensation terms and benefits.
                  </p>
                </div>

                <!-- QUALIFICATION AND EVALUATION CRITERIA -->
                <div class="space-y-2">
                  <h2 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    QUALIFICATION AND EVALUATION CRITERIA
                  </h2>
                  <p class="leading-relaxed">
                    To accept or short-list candidates is the responsibility of the Hiring Evaluation Committee, the decision of which shall be considered based on merit:
                  </p>
                  <ul class="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-300">
                    <li v-for="(req, idx) in job.requirements" :key="idx">
                      {{ req }}
                    </li>
                  </ul>
                </div>

                <!-- BENEFITS & OFFER -->
                <div v-if="job.benefits && job.benefits.length > 0" class="space-y-2">
                  <h2 class="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                    BENEFITS & WORKING CONDITIONS
                  </h2>
                  <ul class="list-disc list-inside space-y-1 pl-1 text-slate-600 dark:text-slate-300">
                    <li v-for="(ben, idx) in job.benefits" :key="idx">
                      {{ ben }}
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </div>

          <!-- Section 3: Submission Requirements -->
          <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden shadow-2xs">
            <div class="bg-[#003366] text-white px-3 py-2 font-bold text-xs sm:text-sm">
              Submission Requirements
            </div>
            
            <div class="p-4 sm:p-5 space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              
              <div class="space-y-1.5">
                <h3 class="font-black text-slate-900 dark:text-white uppercase text-[11px]">
                  INSTRUCTIONS FOR PROCESSING THE APPLICATION / PROPOSAL
                </h3>
                <p>
                  Applications and proposals must remain valid for the period of recruitment review from the date of submission.
                </p>
                <div class="space-y-1 pl-1">
                  <p class="font-bold text-slate-800 dark:text-slate-200">• Electronic proposal has to be submitted via email or direct portal:</p>
                  <ul class="list-disc list-inside pl-3 space-y-0.5 text-slate-600 dark:text-slate-300">
                    <li>Email should be addressed to the HR contact details provided in the sidebar.</li>
                    <li>The subject of the email should clearly state: <strong>"[{{ getJobIdNumber(job) }}] / Candidate Name / {{ job.title }}"</strong>.</li>
                    <li>Attached documents (CV, Cover Letter, Certificates) should be clearly formatted in .pdf or .docx.</li>
                  </ul>
                </div>
              </div>

              <!-- Deadlines -->
              <div class="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1 text-[11px]">
                <p><span class="font-bold text-slate-900 dark:text-white">Submission deadline:</span> {{ getClosingDate(job) }} at/before 5:00pm</p>
                <p><span class="font-bold text-slate-900 dark:text-white">Questions / Clarifications:</span> Prior to closing date</p>
              </div>

              <!-- Attachments / Downloads -->
              <div class="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 class="font-black text-slate-900 dark:text-white uppercase text-[11px]">
                  ATTACHMENTS
                </h3>
                <div class="flex flex-wrap gap-2 text-[11px]">
                  <a
                    href="#"
                    @click.prevent="openApplyModal"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#003366] dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                  >
                    <FileText class="w-3.5 h-3.5 text-[#003366]" />
                    <span>Annex 1_Terms_of_Reference.pdf</span>
                  </a>
                  <a
                    href="#"
                    @click.prevent="openApplyModal"
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-blue-50 dark:bg-blue-950/60 text-[#003366] dark:text-blue-400 font-semibold border border-blue-200 dark:border-blue-800 hover:bg-blue-100"
                  >
                    <FileText class="w-3.5 h-3.5 text-[#003366]" />
                    <span>Application_Form_{{ job.company.replace(/[^a-zA-Z]/g, '') }}.pdf</span>
                  </a>
                </div>
              </div>

              <!-- Bottom Quick Apply Action Button -->
              <div class="pt-3 flex items-center justify-end">
                <button
                  @click="openApplyModal"
                  type="button"
                  class="px-6 py-2.5 bg-[#003366] hover:bg-[#0A2E6E] text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs transition-colors flex items-center gap-2"
                >
                  <Send class="w-3.5 h-3.5" />
                  <span>{{ currentLanguage === 'kh' ? 'ដាក់ពាក្យស្នើសុំការងារឥឡូវនេះ' : 'Submit Application Now' }}</span>
                </button>
              </div>

            </div>
          </div>

        </main>

      </div>

      <!-- ============================================================ -->
      <!-- 3. SIMILAR JOBS SECTION (EXACT 2-COLUMN BONGTHOM GRID MATCH)  -->
      <!-- ============================================================ -->
      <section class="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        
        <!-- Header -->
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-lg flex items-center justify-between shadow-2xs">
          <h2 class="text-sm sm:text-base font-black text-slate-900 dark:text-white">
            Similar Jobs
          </h2>

          <div class="flex items-center gap-1">
            <button
              @click="similarViewMode = 'grid'"
              :class="['p-1 rounded cursor-pointer', similarViewMode === 'grid' ? 'bg-slate-100 dark:bg-slate-800 text-[#003366]' : 'text-slate-400']"
              type="button"
            >
              <LayoutGrid class="w-4 h-4" />
            </button>
            <button
              @click="similarViewMode = 'list'"
              :class="['p-1 rounded cursor-pointer', similarViewMode === 'list' ? 'bg-slate-100 dark:bg-slate-800 text-[#003366]' : 'text-slate-400']"
              type="button"
            >
              <List class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- 2-Column Grid matching screenshot bottom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            v-for="simJob in similarJobs"
            :key="simJob.id"
            class="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3 hover:bg-blue-50/40 dark:hover:bg-slate-800/60 transition-colors shadow-2xs flex items-start justify-between gap-3"
          >
            <!-- Bookmark icon in top-right corner -->
            <button
              @click.stop="toggleSaveJob(simJob.id)"
              class="absolute top-2.5 right-3 text-slate-400 hover:text-[#003366] cursor-pointer"
              type="button"
            >
              <BookmarkCheck v-if="isJobSaved(simJob.id)" class="w-4 h-4 fill-current text-[#003366]" />
              <Bookmark v-else class="w-4 h-4" />
            </button>

            <!-- Card Content -->
            <div class="flex items-start gap-2.5 min-w-0 flex-1 pr-6">
              <!-- Square Logo -->
              <div class="w-10 h-10 rounded border border-slate-200 dark:border-slate-700 bg-white p-0.5 flex items-center justify-center shrink-0 overflow-hidden mt-0.5">
                <img v-if="simJob.logo" :src="simJob.logo" :alt="simJob.company" class="w-full h-full object-cover" />
                <span v-else class="font-black text-xs text-[#003366]">{{ simJob.company.charAt(0) }}</span>
              </div>

              <!-- Details -->
              <div class="space-y-0.5 min-w-0 flex-1">
                <router-link :to="'/jobs/' + simJob.id" class="block">
                  <h3 class="text-xs font-bold text-[#003366] dark:text-blue-400 hover:underline truncate leading-snug">
                    {{ simJob.title }}
                  </h3>
                </router-link>
                <p class="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {{ simJob.company }}
                </p>
                <div class="flex items-center gap-3 text-[10px] text-slate-500 pt-0.5">
                  <span># {{ getJobIdNumber(simJob) }}</span>
                  <span class="inline-flex items-center gap-1"><Clock class="w-3 h-3 text-slate-400" /> {{ getDurationLeft(simJob) }}</span>
                  <span class="inline-flex items-center gap-1"><Calendar class="w-3 h-3 text-slate-400" /> {{ getClosingDate(simJob) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>

    </div>

    <!-- Fallback if Job Not Found -->
    <div v-else class="max-w-md mx-auto py-20 px-4 text-center">
      <NotFoundState
        title="Job Not Found"
        subtitle="The requested career listing may have expired or been removed."
        action-label="Return to Jobs Portal"
        action-route="/jobs"
      />
    </div>

    <!-- QUICK APPLY MODAL -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isApplyModalOpen && job"
        class="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 font-khmer"
        @click.self="isApplyModalOpen = false"
      >
        <div class="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <button @click="isApplyModalOpen = false" class="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 cursor-pointer" type="button">
            <X class="w-5 h-5" />
          </button>

          <div class="space-y-1 pr-6">
            <div class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black">
              <span>BongThom Easy Application</span>
            </div>
            <h3 class="text-base font-black text-slate-900 dark:text-white leading-snug">
              {{ job.title }}
            </h3>
            <p class="text-xs font-bold text-slate-500">
              {{ job.company }} • <span class="text-emerald-600">{{ job.salary }}</span>
            </p>
          </div>

          <div v-if="isApplySubmitted" class="py-6 text-center space-y-3">
            <CheckCircle2 class="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 class="text-base font-black text-slate-900 dark:text-white">
              Application Submitted Successfully!
            </h4>
            <p class="text-xs text-slate-500">
              Your CV and application have been recorded for {{ job.company }}. The recruiter will contact you shortly.
            </p>
            <button @click="isApplyModalOpen = false" type="button" class="px-5 py-2 rounded-lg bg-[#003366] text-white font-bold text-xs cursor-pointer">
              Done
            </button>
          </div>

          <form v-else @submit.prevent="submitApplication" class="space-y-3 text-xs">
            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">Full Name *</label>
              <input v-model="applyForm.fullName" required type="text" placeholder="e.g. Sok Chanthon" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" />
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">Phone / Telegram *</label>
                <input v-model="applyForm.phone" required type="tel" placeholder="012 345 678" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" />
              </div>
              <div class="space-y-1">
                <label class="font-bold text-slate-700 dark:text-slate-200">Email</label>
                <input v-model="applyForm.email" type="email" placeholder="name@example.com" class="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold" />
              </div>
            </div>

            <div class="space-y-1">
              <label class="font-bold text-slate-700 dark:text-slate-200">Attach CV (.pdf, .docx) *</label>
              <div class="relative border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-3 text-center hover:bg-slate-50 transition-colors">
                <input type="file" accept=".pdf,.doc,.docx" @change="handleCvFileChange" class="absolute inset-0 opacity-0 cursor-pointer" />
                <div class="flex items-center justify-center gap-2 text-slate-500">
                  <UploadCloud class="w-4 h-4 text-[#003366]" />
                  <span v-if="applyForm.cvFileName" class="text-xs font-bold text-emerald-600">✓ {{ applyForm.cvFileName }}</span>
                  <span v-else class="text-xs">Click or drag CV file here</span>
                </div>
              </div>
            </div>

            <div class="pt-2 flex justify-end gap-2">
              <button @click="isApplyModalOpen = false" type="button" class="px-4 py-2 text-slate-500 font-bold cursor-pointer">Cancel</button>
              <button type="submit" class="px-5 py-2 rounded-lg bg-[#003366] text-white font-bold text-xs cursor-pointer flex items-center gap-1.5">
                <Send class="w-3 h-3" />
                <span>Submit Application</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>

  </div>
</template>
