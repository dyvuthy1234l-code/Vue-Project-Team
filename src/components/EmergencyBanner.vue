<script setup lang="ts">
import { PhoneCall, ShieldAlert, Flame, Ambulance, Car, ArrowRight } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { currentLanguage } = useLanguage()

const emergencyDials = [
  {
    number: '117',
    labelEn: 'Police Department',
    labelKh: 'នគរបាលជាតិ',
    descEn: 'Crime, theft & security',
    descKh: 'បទល្មើស ចោរកម្ម និងសន្តិសុខ',
    icon: ShieldAlert,
    color: 'from-blue-600 to-indigo-700',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    border: 'border-blue-200 dark:border-blue-900/60'
  },
  {
    number: '118',
    labelEn: 'Fire Department',
    labelKh: 'ពន្លត់អគ្គិភ័យ',
    descEn: 'Fire & rescue operations',
    descKh: 'អគ្គិភ័យ និងការជួយសង្គ្រោះ',
    icon: Flame,
    color: 'from-amber-500 to-orange-600',
    btnColor: 'bg-orange-600 hover:bg-orange-700',
    border: 'border-orange-200 dark:border-orange-900/60'
  },
  {
    number: '119',
    labelEn: 'Ambulance & SAMU',
    labelKh: 'រថយន្តសង្គ្រោះបន្ទាន់',
    descEn: 'Medical emergency & trauma',
    descKh: 'សង្គ្រោះវេជ្ជសាស្ត្របន្ទាន់',
    icon: Ambulance,
    color: 'from-rose-500 to-red-700',
    btnColor: 'bg-red-600 hover:bg-red-700',
    border: 'border-red-200 dark:border-red-900/60'
  },
  {
    number: '1288',
    labelEn: 'Traffic & Highway Police',
    labelKh: 'គ្រោះថ្នាក់ចរាចរណ៍',
    descEn: 'Road accidents & breakdowns',
    descKh: 'គ្រោះថ្នាក់ចរាចរណ៍ផ្លូវគោក',
    icon: Car,
    color: 'from-cyan-600 to-teal-700',
    btnColor: 'bg-cyan-700 hover:bg-cyan-800',
    border: 'border-cyan-200 dark:border-cyan-900/60'
  }
]
</script>

<template>
  <div class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-[#0D233A] to-slate-950 p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-2xl text-white">
    <!-- Ambient Glow effect -->
    <div class="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-red-600/15 blur-3xl pointer-events-none" />
    <div class="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

    <!-- Header -->
    <div class="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-8 border-b border-slate-800/80">
      <div>
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
          <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>{{ currentLanguage === 'kh' ? 'សេវាសង្គ្រោះបន្ទាន់ ២៤/៧ ឥតគិតថ្លៃ' : 'FREE 24/7 NATIONWIDE EMERGENCY HOTLINES' }}</span>
        </div>
        <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-white">
          {{ currentLanguage === 'kh' ? 'ត្រូវការជំនួយបន្ទាន់?' : 'Need Urgent Assistance?' }}
        </h2>
        <p class="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
          {{ currentLanguage === 'kh'
            ? 'ហៅទូរស័ព្ទទៅកាន់លេខសង្គ្រោះបន្ទាន់ជាតិដោយឥតគិតថ្លៃ ពីគ្រប់ប្រព័ន្ធទូរស័ព្ទក្នុងប្រទេសកម្ពុជា។'
            : 'Toll-free quick dials from any mobile or landline across Cambodia. Available day and night.' }}
        </p>
      </div>

      <router-link
        to="/emergency"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-colors w-fit"
      >
        <span>{{ currentLanguage === 'kh' ? 'មើលលេខសង្គ្រោះទាំងអស់' : 'All Emergency Contacts' }}</span>
        <ArrowRight class="w-4 h-4" />
      </router-link>
    </div>

    <!-- 4 Quick Dial Cards (Mockup Item 06) -->
    <div class="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
      <div
        v-for="dial in emergencyDials"
        :key="dial.number"
        class="group relative bg-slate-800/70 hover:bg-slate-800 rounded-2xl p-5 border border-slate-700/80 hover:border-slate-600 transition-all duration-300 flex flex-col justify-between"
      >
        <!-- Top row: Number & Icon -->
        <div>
          <div class="flex items-center justify-between mb-3">
            <span class="text-3xl font-black tracking-tight text-white group-hover:scale-105 transition-transform duration-200">
              {{ dial.number }}
            </span>
            <div :class="['w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-md', dial.color]">
              <component :is="dial.icon" class="w-5 h-5" />
            </div>
          </div>

          <!-- Titles -->
          <h3 class="text-sm font-black text-white leading-tight">
            {{ currentLanguage === 'kh' ? dial.labelKh : dial.labelEn }}
          </h3>
          <p class="text-xs font-khmer text-slate-400 mt-0.5">
            {{ currentLanguage === 'kh' ? dial.labelEn : dial.labelKh }}
          </p>
          <p class="text-[11px] text-slate-400 mt-2 line-clamp-1">
            {{ currentLanguage === 'kh' ? dial.descKh : dial.descEn }}
          </p>
        </div>

        <!-- Action Call Button -->
        <a
          :href="'tel:' + dial.number"
          :class="[
            'mt-5 w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 shadow-md transition-all active:scale-98',
            dial.btnColor
          ]"
        >
          <PhoneCall class="w-3.5 h-3.5" />
          <span>{{ currentLanguage === 'kh' ? 'ហៅ ' + dial.number : 'Call ' + dial.number }}</span>
        </a>
      </div>
    </div>
  </div>
</template>
