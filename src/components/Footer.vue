<script setup lang="ts">
import { useLanguage } from '@/composables/useLanguage'
import {
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Send
} from 'lucide-vue-next'

const { currentLanguage } = useLanguage()
const currentYear = new Date().getFullYear()

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <footer class="bg-[#0A2540] text-slate-300 pt-12 pb-8 border-t border-slate-800 transition-colors font-khmer">
    <div class="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

      <!-- ============================================================
           TOP ROW: EMERGENCY HOTLINE STRIP FOR CITIZENS
      ============================================================= -->
      <div class="p-4 sm:p-6 rounded-3xl bg-white/[.04] border border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <span class="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <div>
            <h4 class="text-sm sm:text-base font-black text-white">
              {{ currentLanguage === 'kh' ? 'លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់ជាតិកម្ពុជា (24/7 National Hotlines)' : 'National Emergency Helplines 24/7' }}
            </h4>
            <p class="text-xs text-slate-400">
              {{ currentLanguage === 'kh' ? 'ចុចលើលេខខាងក្រោមដើម្បីហៅទូរស័ព្ទបន្ទាន់ភ្លាមៗ' : '1-touch direct calling for police, fire, ambulance, and citizen support' }}
            </p>
          </div>
        </div>

        <div class="flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs font-mono font-bold">
          <a
            href="tel:117"
            class="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>👮 117</span>
            <span class="text-[10px] font-sans font-normal opacity-90">{{ currentLanguage === 'kh' ? 'នគរបាល' : 'Police' }}</span>
          </a>

          <a
            href="tel:118"
            class="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>🚒 118</span>
            <span class="text-[10px] font-sans font-normal opacity-90">{{ currentLanguage === 'kh' ? 'អគ្គិភ័យ' : 'Fire' }}</span>
          </a>

          <a
            href="tel:119"
            class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>🚑 119</span>
            <span class="text-[10px] font-sans font-normal opacity-90">{{ currentLanguage === 'kh' ? 'សង្គ្រោះ' : 'Ambulance' }}</span>
          </a>

          <a
            href="tel:1222"
            class="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <span>📞 1222</span>
            <span class="text-[10px] font-sans font-normal opacity-90">{{ currentLanguage === 'kh' ? 'សេវាពលរដ្ឋ' : 'Helpdesk' }}</span>
          </a>
        </div>
      </div>

      <!-- ============================================================
           MIDDLE GRID: 5 COLUMNS
      ============================================================= -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-7 pb-8 border-b border-slate-800/80">

        <!-- Column 1: Brand, Civic Mission & Independence Badge -->
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
              ? 'វិបផតថលសេវាសាធារណៈ និងជីវិតប្រចាំថ្ងៃសម្រាប់ប្រជាពលរដ្ឋកម្ពុជា។ ជួយឱ្យប្រជាពលរដ្ឋស្វែងរក យល់ដឹង រៀបចំឯកសារ និងប្រើប្រាស់សេវារដ្ឋ សុខាភិបាល ការងារ និងការសង្គ្រោះបន្ទាន់យ៉ាងងាយស្រួល។'
              : 'Independent Cambodian citizen life-services platform providing verified public procedures, emergency helplines, healthcare directory, civic guides, and career opportunities.'
            }}
          </p>

          <div class="pt-2 flex flex-col gap-2 text-slate-400 text-xs">
            <span class="inline-flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck class="w-4 h-4" />
              <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានផ្ទៀងផ្ទាត់ផ្លូវការ (Verified Public Data)' : 'Verified Public Information Platform' }}</span>
            </span>
            <span class="text-[11px] text-slate-500">
              {{ currentLanguage === 'kh'
                ? 'CamLife ជាវេទិកាឯករាជ្យបម្រើផលប្រយោជន៍ប្រជាពលរដ្ឋទូទៅ។'
                : 'CamLife is an independent public utility platform built for Cambodian citizens.'
              }}
            </span>
          </div>
        </div>

        <!-- Column 2: Public Civic Services -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-white">
            {{ currentLanguage === 'kh' ? 'សេវារដ្ឋបាលសាធារណៈ' : 'Civic Procedures' }}
          </h3>
          <ul class="space-y-2 text-xs text-slate-400">
            <li>
              <router-link to="/government/national-id-card" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ' : 'National ID Card' }}
              </router-link>
            </li>
            <li>
              <router-link to="/government/driving-license" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'ប័ណ្ណបើកបរយានយន្ត' : 'Driving License' }}
              </router-link>
            </li>
            <li>
              <router-link to="/government/passport-application" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'លិខិតឆ្លងដែនកម្ពុជា' : 'Cambodian Passport' }}
              </router-link>
            </li>
            <li>
              <router-link to="/government/birth-certificate" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'សំបុត្រកំណើត / សំបុត្រអាពាហ៍ពិពាហ៍' : 'Birth Certificate' }}
              </router-link>
            </li>
            <li>
              <router-link to="/government/vehicle-registration" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'ចុះបញ្ជីផ្ទេរកម្មសិទ្ធិយានយន្ត' : 'Vehicle Registration' }}
              </router-link>
            </li>
            <li>
              <router-link to="/government" class="text-blue-400 hover:text-blue-300 font-bold transition-colors">
                {{ currentLanguage === 'kh' ? '→ មើលសេវាទាំងអស់' : '→ View All Civic Guides' }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 3: Health & Life Services -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-white">
            {{ currentLanguage === 'kh' ? 'សុខាភិបាល & ការរស់នៅ' : 'Health & Living' }}
          </h3>
          <ul class="space-y-2 text-xs text-slate-400">
            <li>
              <router-link to="/health" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'មន្ទីរពេទ្យ & គ្លីនិក ២៤/៧' : 'Hospitals & Clinics' }}
              </router-link>
            </li>
            <li>
              <router-link to="/jobs" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'ឱកាសការងារសាធារណៈ' : 'Public & Private Jobs' }}
              </router-link>
            </li>
            <li>
              <router-link to="/transport" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'ខ្សែរថយន្តក្រុងរាជធានី (City Bus)' : 'City Bus & Transport' }}
              </router-link>
            </li>
            <li>
              <router-link to="/home-services" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'ជាងភ្លើង ទឹក និងម៉ាស៊ីនត្រជាក់' : 'Home Repair Technicians' }}
              </router-link>
            </li>
            <li>
              <router-link to="/saved-services" class="hover:text-white transition-colors">
                {{ currentLanguage === 'kh' ? 'សេវាដែលបានរក្សាទុក (Saved)' : 'My Saved Services' }}
              </router-link>
            </li>
            <li>
              <router-link to="/admin" class="text-purple-400 hover:text-purple-300 font-bold transition-colors">
                {{ currentLanguage === 'kh' ? '⚙ ផ្ទាំងគ្រប់គ្រងទិន្នន័យ (Admin)' : '⚙ Content CMS & Reports' }}
              </router-link>
            </li>
          </ul>
        </div>

        <!-- Column 4: Contact, Support & Citizen Charter -->
        <div class="space-y-3">
          <h3 class="text-xs font-black uppercase tracking-wider text-white">
            {{ currentLanguage === 'kh' ? 'ទំនាក់ទំនង & មតិពលរដ្ឋ' : 'Contact & Feedback' }}
          </h3>
          <ul class="space-y-2 text-xs text-slate-400">
            <li class="flex items-start gap-2">
              <MapPin class="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span>Phnom Penh, Cambodia</span>
            </li>
            <li class="flex items-center gap-2">
              <Mail class="w-4 h-4 text-blue-400 shrink-0" />
              <a href="mailto:citizen@camlife.kh" class="hover:text-white transition-colors">citizen@camlife.kh</a>
            </li>
            <li class="flex items-center gap-2">
              <Phone class="w-4 h-4 text-emerald-400 shrink-0" />
              <a href="tel:+85523888999" class="hover:text-white transition-colors">+855 23 888 999</a>
            </li>
            <li class="pt-2">
              <router-link to="/contact" class="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-bold">
                <span>{{ currentLanguage === 'kh' ? 'ប្រអប់ផ្ញើមតិ និងសំណើជំនួយ' : 'Submit Feedback or Report' }}</span>
                <span>→</span>
              </router-link>
            </li>
          </ul>

          <!-- Telegram / Social Channels -->
          <div class="pt-2 flex items-center gap-2.5">
            <a
              href="https://t.me"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
              aria-label="Telegram"
            >
              <Send class="w-3.5 h-3.5" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              class="w-8 h-8 rounded-xl bg-white/10 hover:bg-blue-600 text-white flex items-center justify-center transition-colors font-bold text-xs"
              aria-label="Facebook"
            >
              f
            </a>
          </div>
        </div>

      </div>

      <!-- ============================================================
           BOTTOM ROW: COPYRIGHT, CITIZEN RIGHTS & ACCESSIBILITY
      ============================================================= -->
      <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>
          © {{ currentYear }} <strong>CamLife</strong> — Independent Citizen Information & Public Services Platform. Built for the People of Cambodia.
        </p>

        <div class="flex flex-wrap items-center gap-4">
          <router-link to="/about" class="hover:text-slate-200 transition-colors">
            {{ currentLanguage === 'kh' ? 'អំពី CamLife' : 'About Platform' }}
          </router-link>
          <span>·</span>
          <router-link to="/contact" class="hover:text-slate-200 transition-colors">
            {{ currentLanguage === 'kh' ? 'សិទ្ធិ និងភាពឯកជន' : 'Privacy & Terms' }}
          </router-link>
          <span>·</span>
          <router-link to="/admin" class="hover:text-purple-300 transition-colors">
            {{ currentLanguage === 'kh' ? 'ការផ្ទៀងផ្ទាត់ទិន្នន័យ' : 'Verification Registry' }}
          </router-link>
          <span>·</span>
          <button @click="scrollToTop" class="hover:text-white transition-colors font-bold cursor-pointer" type="button">
            {{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅលើ ↑' : 'Back to Top ↑' }}
          </button>
        </div>
      </div>

    </div>
  </footer>
</template>
