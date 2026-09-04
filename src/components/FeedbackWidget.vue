<script setup lang="ts">
import { ref } from 'vue'
import {
  ThumbsUp,
  ThumbsDown,
  CheckCircle2,
  Send
} from 'lucide-vue-next'
import { useFeedback } from '@/composables/useFeedback'
import { useLanguage } from '@/composables/useLanguage'

interface Props {
  serviceId: string
  serviceTitle: string
}

const props = defineProps<Props>()
const { submitFeedback } = useFeedback()
const { currentLanguage } = useLanguage()

const selectedSentiment = ref<boolean | null>(null)
const comment = ref('')
const isSubmitted = ref(false)

function handleSelect(helpful: boolean) {
  selectedSentiment.value = helpful
}

function handleSubmit() {
  if (selectedSentiment.value === null) return
  submitFeedback(props.serviceId, props.serviceTitle, selectedSentiment.value, comment.value)
  isSubmitted.value = true
}
</script>

<template>
  <div class="rounded-3xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8 shadow-sm">
    <!-- Success state -->
    <div v-if="isSubmitted" class="text-center py-4 space-y-2 animate-fadeIn">
      <div class="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
        <CheckCircle2 class="w-6 h-6" />
      </div>
      <h4 class="text-sm sm:text-base font-black text-[#0A2540] dark:text-white font-khmer">
        {{ currentLanguage === 'kh' ? 'សូមអរគុណចំពោះមតិកែលម្អរបស់អ្នក!' : 'Thank you for your valuable feedback!' }}
      </h4>
      <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-khmer">
        {{ currentLanguage === 'kh'
          ? 'មតិយោបល់របស់អ្នកជួយយើងក្នុងការកែលម្អគុណភាព និងភាពត្រឹមត្រូវនៃព័ត៌មានសម្រាប់ប្រជាពលរដ្ឋទាំងអស់។'
          : 'Your input directly helps us improve the quality and accuracy of citizen guides.'
        }}
      </p>
    </div>

    <!-- Active feedback form -->
    <div v-else class="space-y-4">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h4 class="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'តើព័ត៌មាននេះមានប្រយោជន៍សម្រាប់អ្នកទេ?' : 'Was this guide helpful to you?' }}
          </h4>
          <p class="text-[11px] text-slate-400 font-khmer">
            {{ currentLanguage === 'kh' ? 'ជួយផ្តល់មតិ ដើម្បីឱ្យយើងបម្រើពលរដ្ឋកាន់តែប្រសើរ' : 'Help us make citizen services clearer and more accessible.' }}
          </p>
        </div>

        <!-- Yes / No Buttons -->
        <div class="flex items-center gap-2 shrink-0">
          <button
            @click="handleSelect(true)"
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
              selectedSentiment === true
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
            ]"
            type="button"
          >
            <ThumbsUp class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'មានប្រយោជន៍ (Yes)' : 'Yes' }}</span>
          </button>

          <button
            @click="handleSelect(false)"
            :class="[
              'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border',
              selectedSentiment === false
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600 hover:bg-slate-100'
            ]"
            type="button"
          >
            <ThumbsDown class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'មិនសូវច្បាស់ (No)' : 'No' }}</span>
          </button>
        </div>
      </div>

      <!-- Expandable improvement box when user selects an option -->
      <div v-if="selectedSentiment !== null" class="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-3 animate-fadeIn">
        <label class="text-[11px] font-bold text-slate-600 dark:text-slate-300 block font-khmer">
          {{ currentLanguage === 'kh' ? 'តើយើងគួរកែលម្អ ឬបន្ថែមចំណុចណាខ្លះ? (ស្រេចចិត្ត)' : 'What can we improve or make clearer? (Optional)' }}
        </label>
        <textarea
          v-model="comment"
          rows="2"
          class="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#0D47A1] resize-none font-khmer"
          :placeholder="currentLanguage === 'kh' ? 'សរសេរមតិយោបល់របស់អ្នកនៅទីនេះ...' : 'Type your suggestions or comments here...'"
        />
        <div class="flex justify-end">
          <button
            @click="handleSubmit"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold transition-all active:scale-95"
            type="button"
          >
            <Send class="w-3.5 h-3.5" />
            <span>{{ currentLanguage === 'kh' ? 'ផ្ញើមតិកែលម្អ' : 'Submit Feedback' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
