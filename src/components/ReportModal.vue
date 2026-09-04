<script setup lang="ts">
import { ref } from 'vue'
import {
  AlertTriangle,
  X,
  CheckCircle2,
  Send
} from 'lucide-vue-next'
import { useFeedback, type ServiceReport } from '@/composables/useFeedback'
import { useLanguage } from '@/composables/useLanguage'

interface Props {
  isOpen: boolean
  serviceId: string
  serviceTitle: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { submitReport } = useFeedback()
const { currentLanguage } = useLanguage()

const selectedReason = ref<ServiceReport['reason']>('outdated-info')
const details = ref('')
const contactEmail = ref('')
const isSubmitted = ref(false)

const reasons: Array<{ value: ServiceReport['reason']; label: string; labelKh: string }> = [
  { value: 'incorrect-fee', label: 'Incorrect Fee or Pricing', labelKh: 'ថ្លៃសេវាផ្លូវការមិនត្រឹមត្រូវ' },
  { value: 'wrong-phone', label: 'Wrong Phone Number or Contact', labelKh: 'លេខទូរស័ព្ទ ឬទំនាក់ទំនងខុស' },
  { value: 'outdated-info', label: 'Outdated Procedure or Requirement', labelKh: 'ព័ត៌មាន ឬលក្ខខណ្ឌផុតសម័យ' },
  { value: 'wrong-location', label: 'Wrong Office Location or Hours', labelKh: 'ទីតាំងការិយាល័យ ឬម៉ោងធ្វើការខុស' },
  { value: 'other', label: 'Other Issue / Suggestion', labelKh: 'បញ្ហា ឬមតិយោបល់ផ្សេងទៀត' }
]

function handleSubmit() {
  if (!details.value.trim()) return
  const found = reasons.find(r => r.value === selectedReason.value)
  const reasonLabel = found ? (currentLanguage.value === 'kh' ? found.labelKh : found.label) : 'Other'

  submitReport(
    props.serviceId,
    props.serviceTitle,
    selectedReason.value,
    reasonLabel,
    details.value,
    contactEmail.value
  )
  isSubmitted.value = true
}

function handleClose() {
  isSubmitted.value = false
  details.value = ''
  contactEmail.value = ''
  emit('close')
}
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-150"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs"
      @click.self="handleClose"
    >
      <div
        class="w-full max-w-lg bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scaleUp"
      >
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600">
              <AlertTriangle class="w-5 h-5" />
            </span>
            <div>
              <h3 class="text-sm sm:text-base font-black text-[#0A2540] dark:text-white font-khmer">
                {{ currentLanguage === 'kh' ? 'រាយការណ៍ព័ត៌មានមិនត្រឹមត្រូវ' : 'Report Incorrect Information' }}
              </h3>
              <p class="text-[10px] text-slate-400 truncate max-w-xs sm:max-w-sm">
                {{ serviceTitle }}
              </p>
            </div>
          </div>

          <button
            @click="handleClose"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            type="button"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Success State -->
        <div v-if="isSubmitted" class="p-8 text-center space-y-4">
          <div class="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 class="w-7 h-7" />
          </div>
          <h4 class="text-base font-black text-[#0A2540] dark:text-white font-khmer">
            {{ currentLanguage === 'kh' ? 'របាយការណ៍ត្រូវបានបញ្ជូនជោគជ័យ!' : 'Report Submitted Successfully!' }}
          </h4>
          <p class="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto font-khmer">
            {{ currentLanguage === 'kh'
              ? 'ក្រុមការងាររបស់យើងនឹងពិនិត្យផ្ទៀងផ្ទាត់ឡើងវិញជាមួយស្ថាប័នមានសមត្ថកិច្ច ដើម្បីធ្វើបច្ចុប្បន្នភាពទិន្នន័យឱ្យបានត្រឹមត្រូវ។'
              : 'Our verification team will review this report against official ministerial sources and update the information.'
            }}
          </p>
          <div class="pt-2">
            <button
              @click="handleClose"
              class="px-6 py-2.5 rounded-xl bg-[#0D47A1] text-white text-xs font-bold shadow-sm"
              type="button"
            >
              {{ currentLanguage === 'kh' ? 'បិទផ្ទាំង' : 'Close' }}
            </button>
          </div>
        </div>

        <!-- Form Body -->
        <div v-else class="p-6 space-y-4">
          <div>
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2 font-khmer">
              {{ currentLanguage === 'kh' ? 'សូមជ្រើសរើសប្រភេទនៃបញ្ហា:' : 'What kind of issue did you find?' }}
            </label>
            <div class="space-y-1.5">
              <label
                v-for="r in reasons"
                :key="r.value"
                :class="[
                  'flex items-center gap-3 p-2.5 rounded-xl border text-xs font-semibold cursor-pointer transition-colors',
                  selectedReason === r.value
                    ? 'border-[#0D47A1] bg-blue-50/70 dark:bg-blue-950/40 text-[#0D47A1] dark:text-blue-300 font-bold'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                ]"
              >
                <input
                  v-model="selectedReason"
                  type="radio"
                  :value="r.value"
                  class="text-[#0D47A1] focus:ring-[#0D47A1]"
                >
                <span class="font-khmer">{{ currentLanguage === 'kh' ? r.labelKh : r.label }}</span>
              </label>
            </div>
          </div>

          <!-- Description -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block font-khmer">
              {{ currentLanguage === 'kh' ? 'ព័ត៌មានលម្អិតនៃបញ្ហា ឬចំណុចដែលត្រូវកែតម្រូវ:' : 'Details of the issue or correction needed:' }}
            </label>
            <textarea
              v-model="details"
              rows="3"
              required
              class="w-full p-3 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#0D47A1] resize-none font-khmer"
              :placeholder="currentLanguage === 'kh' ? 'សូមបញ្ជាក់ចំណុចខុស និងព័ត៌មានដែលត្រឹមត្រូវ...' : 'Please specify what is incorrect and the correct information...'"
            />
          </div>

          <!-- Email (Optional) -->
          <div class="space-y-1.5">
            <label class="text-xs font-bold text-slate-700 dark:text-slate-300 block font-khmer">
              {{ currentLanguage === 'kh' ? 'អ៊ីមែលរបស់អ្នក (ស្រេចចិត្ត - សម្រាប់ជូនដំណឹងពេលកែរួច):' : 'Your Email (Optional - to notify when fixed):' }}
            </label>
            <input
              v-model="contactEmail"
              type="email"
              class="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#0D47A1]"
              placeholder="example@gmail.com"
            >
          </div>

          <!-- Modal Footer -->
          <div class="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-2.5">
            <button
              @click="handleClose"
              class="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              type="button"
            >
              {{ currentLanguage === 'kh' ? 'បោះបង់' : 'Cancel' }}
            </button>
            <button
              @click="handleSubmit"
              :disabled="!details.trim()"
              class="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0D47A1] hover:bg-[#1565C0] disabled:opacity-50 text-white text-xs font-bold shadow-sm transition-all active:scale-95"
              type="button"
            >
              <Send class="w-3.5 h-3.5" />
              <span>{{ currentLanguage === 'kh' ? 'ផ្ញើរបាយការណ៍' : 'Submit Report' }}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>
