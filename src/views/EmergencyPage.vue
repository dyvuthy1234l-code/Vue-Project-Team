<script setup lang="ts">
import { computed } from 'vue'
import {
  Phone,
  Flame,
  Ambulance,
  UserCheck,
  Heart,
  Car,
  AlertTriangle,
  PhoneCall,
  ChevronRight,
  ShieldAlert
} from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getEmergencyContacts } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const { t, localized } = useLanguage()

usePageMeta({
  title: 'National Emergency Numbers — CamLife',
  description: 'Instant 1-touch emergency numbers for Cambodia: Police (117), Ambulance (119), Fire (666), and 24/7 helplines.'
})

const contacts = getEmergencyContacts()

const mainContacts = computed(() => contacts.filter(c => c.priority <= 3))
const otherContacts = computed(() => contacts.filter(c => c.priority > 3))

const iconMap: Record<string, any> = {
  shield: ShieldAlert,
  flame: Flame,
  ambulance: Ambulance,
  'user-check': UserCheck,
  heart: Heart,
  car: Car
}

const emergencyTheme: Record<string, { iconBg: string; text: string; btnBg: string }> = {
  shield: { iconBg: 'bg-blue-50 dark:bg-blue-950/60 text-blue-600', text: 'text-blue-600', btnBg: 'bg-blue-600 hover:bg-blue-700 text-white' },
  ambulance: { iconBg: 'bg-red-50 dark:bg-red-950/60 text-[#E53935]', text: 'text-[#E53935]', btnBg: 'bg-[#E53935] hover:bg-red-700 text-white' },
  flame: { iconBg: 'bg-amber-50 dark:bg-amber-950/60 text-amber-600', text: 'text-amber-600', btnBg: 'bg-amber-600 hover:bg-amber-700 text-white' },
  'user-check': { iconBg: 'bg-purple-50 dark:bg-purple-950/60 text-purple-600', text: 'text-purple-600', btnBg: 'bg-purple-600 hover:bg-purple-700 text-white' },
  heart: { iconBg: 'bg-pink-50 dark:bg-pink-950/60 text-pink-600', text: 'text-pink-600', btnBg: 'bg-pink-600 hover:bg-pink-700 text-white' },
  car: { iconBg: 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600', text: 'text-emerald-600', btnBg: 'bg-emerald-600 hover:bg-emerald-700 text-white' }
}
</script>

<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
    <!-- Breadcrumb -->
    <nav class="flex items-center gap-2 text-xs font-semibold text-slate-400" aria-label="Breadcrumb">
      <router-link to="/" class="hover:text-[#0D47A1] dark:hover:text-blue-400 transition-colors">
        {{ t('nav.home') }}
      </router-link>
      <ChevronRight class="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
      <span class="text-slate-700 dark:text-slate-200">{{ t('nav.emergency') }}</span>
    </nav>

    <!-- Header -->
    <SectionHeader
      :title="t('emergency.title')"
      :subtitle="t('emergency.subtitle')"
      badge="National Hotlines"
    />

    <!-- Urgent Instruction Banner -->
    <div class="bg-red-50 dark:bg-red-950/30 border border-red-200/90 dark:border-red-900/60 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5 shadow-sm">
      <AlertTriangle class="w-5 h-5 text-[#E53935] shrink-0 mt-0.5 animate-pulse" />
      <div class="space-y-1">
        <p class="text-xs sm:text-sm font-bold text-red-900 dark:text-red-200">
          {{ t('emergency.disclaimer') }}
        </p>
        <p class="text-xs text-red-700 dark:text-red-300/80 font-khmer">
          ពេលមានហេតុការណ៍បន្ទាន់ សូមរក្សាភាពស្ងប់ស្ងាត់ និងប្រាប់ទីតាំង ឬចំណុចសម្គាល់របស់អ្នកឱ្យបានច្បាស់លាស់។
        </p>
      </div>
    </div>

    <!-- MAIN HIGH PRIORITY SPEED DIALS -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {{ t('emergency.mainEmergency') }}
        </h2>
        <span class="text-[11px] font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
          <span class="w-2 h-2 rounded-full bg-red-600 animate-ping" />
          <span>24/7 Available Free of Charge</span>
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div
          v-for="contact in mainContacts"
          :key="contact.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl border-2 border-red-200/80 dark:border-red-900/60 p-6 shadow-sm hover:shadow-card-hover hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between text-center"
        >
          <div class="space-y-3">
            <div class="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/50 text-[#E53935] mx-auto flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
              <component :is="iconMap[contact.icon] || Phone" class="w-7 h-7" />
            </div>

            <div>
              <h3 class="font-bold text-lg text-[#0A2540] dark:text-white">
                {{ localized(contact.name, contact.nameKh) }}
              </h3>
              <p v-if="contact.nameKh" class="text-xs font-khmer text-slate-400 dark:text-slate-500 mt-0.5">
                {{ contact.nameKh }}
              </p>
            </div>

            <!-- Prominent Number -->
            <p class="text-4xl font-black tracking-tight text-[#E53935] my-2">
              {{ contact.number }}
            </p>

            <p class="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {{ localized(contact.description, contact.descriptionKh) }}
            </p>
          </div>

          <a
            :href="'tel:' + contact.number"
            class="mt-6 w-full py-3 rounded-xl bg-[#E53935] hover:bg-red-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors active:scale-95"
          >
            <PhoneCall class="w-4 h-4" />
            <span>{{ t('emergency.callNow') }} {{ contact.number }}</span>
          </a>
        </div>
      </div>
    </div>

    <!-- OTHER IMPORTANT CITIZEN HELPLINES -->
    <div class="space-y-4 pt-4">
      <h2 class="text-xs font-bold text-slate-400 uppercase tracking-wider">
        {{ t('emergency.otherContacts') }}
      </h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          v-for="contact in otherContacts"
          :key="contact.id"
          class="group bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/90 dark:border-slate-700 p-5 shadow-sm hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between gap-4"
        >
          <div class="flex items-center gap-3.5 min-w-0">
            <div :class="['w-11 h-11 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform', emergencyTheme[contact.icon]?.iconBg || 'bg-slate-100 text-slate-600']">
              <component :is="iconMap[contact.icon] || Phone" class="w-5 h-5" />
            </div>

            <div class="min-w-0">
              <h3 class="font-bold text-sm text-[#0A2540] dark:text-white truncate">
                {{ localized(contact.name, contact.nameKh) }}
              </h3>
              <p class="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5 font-khmer">
                {{ localized(contact.description, contact.descriptionKh) }}
              </p>
              <p :class="['text-base font-black mt-1', emergencyTheme[contact.icon]?.text || 'text-slate-800']">
                {{ contact.number }}
              </p>
            </div>
          </div>

          <a
            :href="'tel:' + contact.number"
            :class="['px-4 py-2 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 transition-colors active:scale-95 shadow-xs', emergencyTheme[contact.icon]?.btnBg || 'bg-[#0D47A1] text-white']"
          >
            <Phone class="w-3.5 h-3.5" />
            <span>Call</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
