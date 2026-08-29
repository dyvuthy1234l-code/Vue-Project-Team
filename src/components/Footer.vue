<script setup lang="ts">
import { MapPin, Mail, Phone, Heart } from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const { t } = useLanguage()
</script>

<template>
  <footer class="bg-camlife-navy text-slate-300 pt-16 pb-12 border-t border-slate-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <!-- Col 1: Brand & Identity -->
        <div class="space-y-4">
          <div class="flex items-center space-x-2.5">
            <div class="w-10 h-10 rounded-xl bg-camlife-action flex items-center justify-center text-white text-xl font-bold">
              🇰🇭
            </div>
            <div>
              <span class="text-2xl font-black tracking-tight text-white">CamLife</span>
              <p class="text-xs text-camlife-gold font-semibold -mt-1">{{ t('nav.tagline') }}</p>
            </div>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            {{ t('footer.description') }}
          </p>
          <div class="pt-2 flex items-center space-x-3 text-xs text-slate-400">
            <span class="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-medium">
              Frontend Civic Tech Platform
            </span>
          </div>
        </div>

        <!-- Col 2: Quick Links -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-camlife-action">
            {{ t('footer.quickLinks') }}
          </h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <router-link to="/" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.home') }}
              </router-link>
            </li>
            <li>
              <router-link to="/health" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.health') }}
              </router-link>
            </li>
            <li>
              <router-link to="/news" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.news') }}
              </router-link>
            </li>
            <li>
              <router-link to="/locations" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.locations') }}
              </router-link>
            </li>
            <li>
              <router-link to="/about" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.about') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 3: Essential Services -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-camlife-action">
            {{ t('footer.serviceLinks') }}
          </h4>
          <ul class="space-y-2.5 text-sm">
            <li>
              <router-link to="/health" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.health') }}
              </router-link>
            </li>
            <li>
              <router-link to="/government" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.government') }}
              </router-link>
            </li>
            <li>
              <router-link to="/jobs" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.jobs') }}
              </router-link>
            </li>
            <li>
              <router-link to="/home-services" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.homeServices') }}
              </router-link>
            </li>
            <li>
              <router-link to="/transport" class="hover:text-white hover:translate-x-1 inline-block transition-all text-slate-400">
                {{ t('nav.transport') }}
              </router-link>
            </li>
            <li>
              <router-link to="/emergency" class="text-red-400 hover:text-red-300 hover:translate-x-1 inline-block transition-all font-semibold">
                {{ t('nav.emergency') }} (117/119)
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Col 4: Contact & Information -->
        <div>
          <h4 class="text-white font-bold text-base mb-4 tracking-wide uppercase text-xs text-camlife-action">
            {{ t('footer.contactTitle') }}
          </h4>
          <ul class="space-y-3 text-sm text-slate-400">
            <li class="flex items-start space-x-2.5">
              <MapPin class="w-4 h-4 text-camlife-action mt-0.5 flex-shrink-0" />
              <span>Phnom Penh, Kingdom of Cambodia</span>
            </li>
            <li class="flex items-center space-x-2.5">
              <Mail class="w-4 h-4 text-camlife-action flex-shrink-0" />
              <a href="mailto:info@camlife.gov.kh" class="hover:text-white transition-colors">contact@camlife.kh</a>
            </li>
            <li class="flex items-center space-x-2.5">
              <Phone class="w-4 h-4 text-camlife-action flex-shrink-0" />
              <a href="tel:117" class="hover:text-white transition-colors">+855 23 999 117</a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p class="text-center sm:text-left flex items-center gap-1">
          <span>{{ t('footer.rightsReserved') }}</span>
          <span class="inline-flex items-center text-red-500">
            <Heart class="w-3 h-3 fill-current mx-1 inline" /> Cambodia
          </span>
        </p>
        <div class="flex space-x-6">
          <router-link to="/about" class="hover:text-slate-300 transition-colors">Privacy Policy</router-link>
          <router-link to="/about" class="hover:text-slate-300 transition-colors">Terms of Service</router-link>
          <router-link to="/emergency" class="hover:text-slate-300 transition-colors">Helpline Support</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>
