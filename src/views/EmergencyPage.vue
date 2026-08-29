<script setup lang="ts">
import { computed } from 'vue'
import { Phone, Shield, Flame, Ambulance, UserCheck, Heart, Car, AlertTriangle, PhoneCall } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getEmergencyContacts } from '@/services/dataService'

const { t, localized } = useLanguage()

const contacts = getEmergencyContacts()

const mainContacts = computed(() => contacts.filter(c => c.priority <= 3))
const otherContacts = computed(() => contacts.filter(c => c.priority > 3))

const iconMap: Record<string, typeof Shield> = {
  shield: Shield,
  flame: Flame,
  ambulance: Ambulance,
  'user-check': UserCheck,
  heart: Heart,
  car: Car
}

const colorStyleMap: Record<string, { bg: string; text: string; border: string; buttonBg: string }> = {
  shield: { bg: 'bg-blue-50/90', text: 'text-blue-700', border: 'border-blue-300', buttonBg: 'bg-blue-600 hover:bg-blue-700 text-white' },
  flame: { bg: 'bg-red-50/90', text: 'text-red-700', border: 'border-red-300', buttonBg: 'bg-red-600 hover:bg-red-700 text-white' },
  ambulance: { bg: 'bg-emerald-50/90', text: 'text-emerald-700', border: 'border-emerald-300', buttonBg: 'bg-emerald-600 hover:bg-emerald-700 text-white' },
  'user-check': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', buttonBg: 'bg-purple-600 hover:bg-purple-700 text-white' },
  heart: { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200', buttonBg: 'bg-pink-600 hover:bg-pink-700 text-white' },
  car: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', buttonBg: 'bg-amber-600 hover:bg-amber-700 text-white' }
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Speed Header -->
    <SectionHeader
      :title="t('emergency.title')"
      :subtitle="t('emergency.subtitle')"
      badge="1-Touch Speed Dial"
    />

    <!-- Disclaimer Alert Box -->
    <div class="bg-red-500/10 border border-red-500/30 rounded-2xl p-4 flex items-start space-x-3 text-red-700 shadow-subtle">
      <AlertTriangle class="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0 animate-pulse" />
      <p class="text-xs font-bold leading-relaxed">{{ t('emergency.disclaimer') }}</p>
    </div>

    <!-- MAIN HIGH PRIORITY SPEED DIALS -->
    <div>
      <h2 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">{{ t('emergency.mainEmergency') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <a
          v-for="contact in mainContacts"
          :key="contact.id"
          :href="'tel:' + contact.number"
          :class="[
            'group flex flex-col items-center p-6 rounded-3xl border-2 transition-all duration-200 hover:shadow-card-hover text-center justify-between hover:scale-[1.02]',
            colorStyleMap[contact.icon]?.bg || 'bg-slate-50',
            colorStyleMap[contact.icon]?.border || 'border-slate-200'
          ]"
        >
          <div class="flex flex-col items-center space-y-2">
            <div class="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-1">
              <component
                :is="iconMap[contact.icon] || Phone"
                :class="['w-8 h-8', colorStyleMap[contact.icon]?.text || 'text-slate-600']"
              />
            </div>
            <h3 class="font-black text-camlife-navy text-xl">{{ localized(contact.name, contact.nameKh) }}</h3>
            <p :class="['text-4xl font-black tracking-tight', colorStyleMap[contact.icon]?.text || 'text-slate-800']">
              {{ contact.number }}
            </p>
            <p class="text-xs text-slate-600 font-medium max-w-[200px] leading-snug">
              {{ localized(contact.description, contact.descriptionKh) }}
            </p>
          </div>

          <div :class="['mt-6 w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center space-x-2 shadow-md transition-transform group-hover:scale-105', colorStyleMap[contact.icon]?.buttonBg]">
            <PhoneCall class="w-4 h-4 animate-bounce" />
            <span>{{ t('emergency.callNow') }} ({{ contact.number }})</span>
          </div>
        </a>
      </div>
    </div>

    <!-- OTHER IMPORTANT HOTLINES -->
    <div class="pt-4">
      <h2 class="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-4">{{ t('emergency.otherContacts') }}</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a
          v-for="contact in otherContacts"
          :key="contact.id"
          :href="'tel:' + contact.number"
          class="group flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-200/90 shadow-subtle hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5"
        >
          <div class="flex items-center space-x-4 min-w-0 pr-2">
            <div class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-camlife-light transition-colors">
              <component
                :is="iconMap[contact.icon] || Phone"
                :class="['w-6 h-6', colorStyleMap[contact.icon]?.text || 'text-slate-600']"
              />
            </div>
            <div class="min-w-0">
              <h3 class="font-extrabold text-camlife-navy text-base group-hover:text-camlife-action transition-colors truncate">
                {{ localized(contact.name, contact.nameKh) }}
              </h3>
              <p class="text-xs text-slate-500 truncate">{{ localized(contact.description, contact.descriptionKh) }}</p>
            </div>
          </div>

          <div class="flex items-center space-x-2 flex-shrink-0 px-3.5 py-2 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-black text-sm">
            <Phone class="w-4 h-4" />
            <span>{{ contact.number }}</span>
          </div>
        </a>
      </div>
    </div>
  </div>
</template>
