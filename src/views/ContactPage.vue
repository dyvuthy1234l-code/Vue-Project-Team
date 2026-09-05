<script setup lang="ts">
import { Mail, MapPin, Phone, Clock, Headphones } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import ContactForm from '@/components/ContactForm.vue'
import { usePageMeta } from '@/composables/usePageMeta'

usePageMeta({
  title: 'Contact Us — CamLife',
  description: 'Reach out to the CamLife portal administration for inquiries, corrections, or public partnerships.'
})
</script>

<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">


    <!-- Header -->
    <SectionHeader
      title="Contact & Support"
      subtitle="Have questions, suggestions, or official service corrections? Send us a message."
      badge="Citizen Help Desk"
    />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Form (2 cols) -->
      <div class="lg:col-span-2">
        <ContactForm />
      </div>

      <!-- Sidebar: Office Information -->
      <div class="space-y-6">
        <div class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-7 shadow-sm space-y-5">
          <h3 class="font-bold text-base text-[#0A2540] dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3 flex items-center gap-2">
            <Headphones class="w-4 h-4 text-[#0D47A1] dark:text-blue-400" />
            <span>Support Desk</span>
          </h3>

          <div class="space-y-4 text-xs">
            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/50">
              <MapPin class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p class="text-slate-400 font-bold uppercase text-[10px]">Headquarters</p>
                <p class="font-bold text-slate-800 dark:text-white mt-0.5">Phnom Penh, Kingdom of Cambodia</p>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/50">
              <Mail class="w-4 h-4 text-[#0D47A1] dark:text-blue-400 mt-0.5 shrink-0" />
              <div>
                <p class="text-slate-400 font-bold uppercase text-[10px]">Official Email</p>
                <a href="mailto:support@camlife.kh" class="font-bold text-[#0D47A1] dark:text-blue-400 mt-0.5 block hover:underline">
                  support@camlife.kh
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/50">
              <Phone class="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <p class="text-slate-400 font-bold uppercase text-[10px]">Helpline</p>
                <a href="tel:+85523888999" class="font-bold text-slate-800 dark:text-white mt-0.5 block hover:underline">
                  +855 23 888 999
                </a>
              </div>
            </div>

            <div class="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl border border-slate-200/60 dark:border-slate-600/50">
              <Clock class="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p class="text-slate-400 font-bold uppercase text-[10px]">Working Hours</p>
                <p class="font-bold text-slate-800 dark:text-white mt-0.5">Monday – Friday: 8:00 AM – 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
