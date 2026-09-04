<script setup lang="ts">
import { ref } from 'vue'
import {
  GitCompare,
  X,
  Clock,
  DollarSign,
  Calendar,
  MapPin,
  FileText,
  ArrowRight
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'
import type { GovernmentService } from '@/types'

interface Props {
  isOpen: boolean
  availableServices: GovernmentService[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'close'): void
}>()

const { localized, currentLanguage } = useLanguage()

// Pre-select 2 services by default
const serviceAId = ref(props.availableServices[0]?.id || '')
const serviceBId = ref(props.availableServices[1]?.id || '')

function getService(id: string) {
  return props.availableServices.find(s => s.id === id) || props.availableServices[0]
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
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-4xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-scaleUp my-8"
      >
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300">
              <GitCompare class="w-5 h-5" />
            </span>
            <div>
              <h3 class="text-base sm:text-lg font-black text-[#0A2540] dark:text-white font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រៀបធៀបសេវាសាធារណៈ (Service Comparison)' : 'Compare Public Services' }}
              </h3>
              <p class="text-xs text-slate-400 font-khmer">
                {{ currentLanguage === 'kh' ? 'ប្រៀបធៀបលក្ខខណ្ឌ ថ្លៃសេវា និងរយៈពេលដំណើរការ' : 'Compare documents, fees, processing duration and locations' }}
              </p>
            </div>
          </div>

          <button
            @click="emit('close')"
            class="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            type="button"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Selection Controls -->
        <div class="p-6 bg-slate-50/70 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5 font-khmer">
              {{ currentLanguage === 'kh' ? 'សេវាទី ១ (Service A):' : 'Service A:' }}
            </label>
            <select
              v-model="serviceAId"
              class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#0D47A1]"
            >
              <option v-for="s in availableServices" :key="s.id" :value="s.id">
                {{ localized(s.title, s.titleKh) }}
              </option>
            </select>
          </div>

          <div>
            <label class="text-xs font-bold text-slate-600 dark:text-slate-300 block mb-1.5 font-khmer">
              {{ currentLanguage === 'kh' ? 'សេវាទី ២ (Service B):' : 'Service B:' }}
            </label>
            <select
              v-model="serviceBId"
              class="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold text-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-[#0D47A1]"
            >
              <option v-for="s in availableServices" :key="s.id" :value="s.id">
                {{ localized(s.title, s.titleKh) }}
              </option>
            </select>
          </div>
        </div>

        <!-- Comparison Table -->
        <div class="p-6 overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-slate-200 dark:border-slate-700">
                <th class="py-3 px-4 font-bold text-slate-400 uppercase tracking-wider w-1/4">
                  {{ currentLanguage === 'kh' ? 'លក្ខណៈវិនិច្ឆ័យ' : 'Feature / Criteria' }}
                </th>
                <th class="py-3 px-4 font-black text-[#0D47A1] dark:text-blue-400 text-sm w-3/8 font-khmer">
                  {{ localized(getService(serviceAId).title, getService(serviceAId).titleKh) }}
                </th>
                <th class="py-3 px-4 font-black text-indigo-600 dark:text-indigo-400 text-sm w-3/8 font-khmer">
                  {{ localized(getService(serviceBId).title, getService(serviceBId).titleKh) }}
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
              <!-- Category -->
              <tr>
                <td class="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400">
                  {{ currentLanguage === 'kh' ? 'ប្រភេទ' : 'Category' }}
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">
                  <span class="px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 font-bold">
                    {{ getService(serviceAId).category }}
                  </span>
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">
                  <span class="px-2.5 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold">
                    {{ getService(serviceBId).category }}
                  </span>
                </td>
              </tr>

              <!-- Official Fee -->
              <tr>
                <td class="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <DollarSign class="w-3.5 h-3.5 text-emerald-600" />
                  <span>{{ currentLanguage === 'kh' ? 'ថ្លៃសេវាផ្លូវការ' : 'Official Fee' }}</span>
                </td>
                <td class="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 font-khmer">
                  {{ localized(getService(serviceAId).fee, getService(serviceAId).feeKh) }}
                </td>
                <td class="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-300 font-khmer">
                  {{ localized(getService(serviceBId).fee, getService(serviceBId).feeKh) }}
                </td>
              </tr>

              <!-- Processing Time -->
              <tr>
                <td class="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Clock class="w-3.5 h-3.5 text-blue-500" />
                  <span>{{ currentLanguage === 'kh' ? 'រយៈពេលដំណើរការ' : 'Processing Time' }}</span>
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white font-khmer">
                  {{ localized(getService(serviceAId).processingTime, getService(serviceAId).processingTimeKh) }}
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white font-khmer">
                  {{ localized(getService(serviceBId).processingTime, getService(serviceBId).processingTimeKh) }}
                </td>
              </tr>

              <!-- Required Docs Count -->
              <tr>
                <td class="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <FileText class="w-3.5 h-3.5 text-amber-500" />
                  <span>{{ currentLanguage === 'kh' ? 'ឯកសារតម្រូវ' : 'Required Docs' }}</span>
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">
                  <span class="font-bold">{{ getService(serviceAId).requirements.length }} items</span>
                  <p class="text-[11px] text-slate-400 mt-0.5 line-clamp-2 font-khmer">
                    {{ (currentLanguage === 'kh' ? getService(serviceAId).requirementsKh : getService(serviceAId).requirements).join(', ') }}
                  </p>
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white">
                  <span class="font-bold">{{ getService(serviceBId).requirements.length }} items</span>
                  <p class="text-[11px] text-slate-400 mt-0.5 line-clamp-2 font-khmer">
                    {{ (currentLanguage === 'kh' ? getService(serviceBId).requirementsKh : getService(serviceBId).requirements).join(', ') }}
                  </p>
                </td>
              </tr>

              <!-- Validity -->
              <tr>
                <td class="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <Calendar class="w-3.5 h-3.5 text-purple-500" />
                  <span>{{ currentLanguage === 'kh' ? 'សុពលភាព' : 'Validity' }}</span>
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white font-khmer">
                  {{ localized(getService(serviceAId).validity, getService(serviceAId).validityKh) }}
                </td>
                <td class="py-3.5 px-4 font-semibold text-slate-800 dark:text-white font-khmer">
                  {{ localized(getService(serviceBId).validity, getService(serviceBId).validityKh) }}
                </td>
              </tr>

              <!-- Office Location -->
              <tr>
                <td class="py-3.5 px-4 font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin class="w-3.5 h-3.5 text-red-500" />
                  <span>{{ currentLanguage === 'kh' ? 'ទីតាំងដាក់ពាក្យ' : 'Where to Apply' }}</span>
                </td>
                <td class="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 font-khmer">
                  {{ localized(getService(serviceAId).location, getService(serviceAId).locationKh) }}
                </td>
                <td class="py-3.5 px-4 text-xs text-slate-700 dark:text-slate-300 font-khmer">
                  {{ localized(getService(serviceBId).location, getService(serviceBId).locationKh) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
          <button
            @click="emit('close')"
            class="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            type="button"
          >
            {{ currentLanguage === 'kh' ? 'បិទ' : 'Close Comparison' }}
          </button>

          <div class="flex items-center gap-3">
            <router-link
              :to="'/government/' + serviceAId"
              @click="emit('close')"
              class="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 text-xs font-bold hover:bg-blue-100"
            >
              <span>{{ currentLanguage === 'kh' ? 'មើលសេវាទី ១' : 'View Service A' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
            <router-link
              :to="'/government/' + serviceBId"
              @click="emit('close')"
              class="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold hover:bg-indigo-100"
            >
              <span>{{ currentLanguage === 'kh' ? 'មើលសេវាទី ២' : 'View Service B' }}</span>
              <ArrowRight class="w-3.5 h-3.5" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>
