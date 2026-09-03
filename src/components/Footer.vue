<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Send
} from 'lucide-vue-next'

const { t, currentLanguage } = useLanguage()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-[#0A2540] text-slate-300 pt-16 pb-10 border-t border-slate-800 transition-colors">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Top Section: Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800/80">

        <!-- Column 1: Brand & Mission -->
        <div class="lg:col-span-2 space-y-4">
          <router-link to="/" class="inline-flex items-center gap-3 group focus:outline-none">
            <img
              src="/logo.png"
              alt="CamLife Cambodia"
              class="h-12 w-auto object-contain rounded-xl bg-white/95 p-1 transition-transform duration-200 group-hover:scale-105"
            />
          </router-link>

          <p class="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
            {{ currentLanguage === 'kh'
              ? 'វេទិកាផ្ដល់ព័ត៌មាន និងសេវាកម្មប្រចាំថ្ងៃសម្រាប់ប្រជាជនកម្ពុជា រួមមានសុខាភិបាល រដ្ឋបាល ការងារ និងការសង្គ្រោះបន្ទាន់។'
              : 'The modern Cambodian life-service platform providing verified public information, emergency helplines, healthcare directories, civic guides, and career opportunities.'
            }}
          </p>

          <div class="pt-2 flex items-center gap-3 text-slate-400 text-xs">
            <span class="inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck class="w-4 h-4" />
              <span>Verified Public Information</span>
            </span>
          </div>
        </div>

        <!-- Column 2: Quick Links -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white">
            {{ currentLanguage === 'kh' ? 'តំណភ្ជាប់រហ័ស' : 'Quick Links' }}
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li>
              <router-link to="/" class="hover:text-white transition-colors">
                {{ t('nav.home') }}
              </router-link>
            </li>
            <li>
              <router-link to="/health" class="hover:text-white transition-colors">
                {{ t('nav.health') }}
              </router-link>
            </li>
            <li>
              <router-link to="/government" class="hover:text-white transition-colors">
                {{ t('nav.government') }}
              </router-link>
            </li>
            <li>
              <router-link to="/jobs" class="hover:text-white transition-colors">
                {{ t('nav.jobs') }}
              </router-link>
            </li>
            <li>
              <router-link to="/news" class="hover:text-white transition-colors">
                {{ t('nav.news') }}
              </router-link>
            </li>
            <li>
              <router-link to="/saved-jobs" class="hover:text-white transition-colors">
                {{ t('nav.savedJobs') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 3: Popular Services -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white">
            {{ currentLanguage === 'kh' ? 'សេវាកម្មពេញនិយម' : 'Popular Services' }}
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li>
              <router-link to="/emergency" class="text-red-400 hover:text-red-300 font-semibold transition-colors flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                <span>{{ t('nav.emergency') }} (117 / 119)</span>
              </router-link>
            </li>
            <li>
              <router-link to="/government" class="hover:text-white transition-colors">
                Driving License
              </router-link>
            </li>
            <li>
              <router-link to="/government" class="hover:text-white transition-colors">
                Cambodian Passport
              </router-link>
            </li>
            <li>
              <router-link to="/transport" class="hover:text-white transition-colors">
                Public Bus & Transit
              </router-link>
            </li>
            <li>
              <router-link to="/home-services" class="hover:text-white transition-colors">
                Home Repair & Utilities
              </router-link>
            </li>
            <li>
              <router-link to="/locations" class="hover:text-white transition-colors">
                {{ t('nav.locations') }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 4: Contact & Support -->
        <div class="space-y-3">
          <h3 class="text-xs font-bold uppercase tracking-wider text-white">
            {{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង' : 'Contact & Support' }}
          </h3>
          <ul class="space-y-2.5 text-xs text-slate-400">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Phnom Penh, Cambodia</span>
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-blue-400 shrink-0" />
              <a href="mailto:support@camlife.kh" class="hover:text-white transition-colors">support@camlife.kh</a>
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="tel:+85523888999" class="hover:text-white transition-colors">+855 23 888 999</a>
            </li>
            <li class="pt-2">
              <router-link to="/contact" class="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold">
                <span>{{ t('nav.contact') }}</span>
                <span>→</span>
              </router-link>
            </li>
          </ul>

          <!-- Social Links -->
          <div class="pt-2 flex items-center gap-2.5">
            <!-- Telegram -->
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
              aria-label="Telegram"
            >
              <Send class="w-3.5 h-3.5" />
            </a>
            <!-- Facebook -->
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-lg bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-colors font-bold text-xs"
              aria-label="Facebook"
            >
              f
            </a>
          </div>
        </div>

      </div>

      <!-- Bottom Bar: Copyright & Attribution -->
      <div class="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <p>
          © {{ currentYear }} CamLife. All rights reserved. Built for Cambodia.
        </p>

        <div class="flex items-center gap-4">
          <router-link to="/about" class="hover:text-slate-300 transition-colors">About Us</router-link>
          <span>·</span>
          <router-link to="/contact" class="hover:text-slate-300 transition-colors">Privacy & Terms</router-link>
          <span>·</span>
          <a href="#app" class="hover:text-slate-300 transition-colors">Back to Top ↑</a>
        </div>
      </div>

    </div>
  </footer>
</template>
