<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  X,
  Search,
  Sparkles,
  Clock,
  ArrowRight,
  HeartPulse,
  Building2,
  Briefcase,
  Wrench,
  Bus,
  Newspaper,
  Siren,
  MapPin,
  CornerDownLeft,
  Trash2,
  ShieldCheck
} from 'lucide-vue-next'
import { globalSearch } from '@/services/dataService'
import { useLanguage } from '@/composables/useLanguage'
import type { SearchResult } from '@/types'

const props = defineProps<{
  isOpen: boolean
}>()

const emit = defineEmits<{
  close: []
}>()

const router = useRouter()
const { currentLanguage } = useLanguage()

const query = ref('')
const searchInput = ref<HTMLInputElement | null>(null)
const selectedCategory = ref<'all' | 'government' | 'hospital' | 'job' | 'emergency' | 'transport'>('all')

const recentSearches = ref<string[]>(
  JSON.parse(localStorage.getItem('camlife-recent-searches') || '["ប័ណ្ណបើកបរ", "អត្តសញ្ញាណប័ណ្ណ", "សង្គ្រោះបន្ទាន់ 119", "Calmette Hospital"]')
)

const problemIntents = [
  { intentKh: 'ខ្ញុំចង់ធ្វើ ឬបន្តប័ណ្ណបើកបរ', intentEn: 'I want to apply or renew driving license', query: 'driving license', target: '/government/driving-license', icon: Building2 },
  { intentKh: 'ខ្ញុំបាត់ ឬចង់ធ្វើអត្តសញ្ញាណប័ណ្ណ', intentEn: 'I lost or want to make National ID', query: 'national id', target: '/government/national-id-card', icon: Building2 },
  { intentKh: 'ខ្ញុំចង់ធ្វើលិខិតឆ្លងដែន (Passport)', intentEn: 'I want to apply for Cambodian Passport', query: 'passport', target: '/government/passport-application', icon: Building2 },
  { intentKh: 'ខ្ញុំត្រូវការឡានសង្គ្រោះបន្ទាន់ភ្លាមៗ (119)', intentEn: 'I need an emergency ambulance right now', query: '119 ambulance', target: '/emergency', icon: Siren },
  { intentKh: 'ស្វែងរកមន្ទីរពេទ្យ និងគ្លីនិកព្យាបាល', intentEn: 'Find certified hospitals and clinics', query: 'hospital', target: '/health', icon: HeartPulse },
  { intentKh: 'ស្វែងរកឱកាសការងារ និងប្រាក់បៀវត្សរ៍ល្អ', intentEn: 'Find job vacancies with good salary', query: 'developer', target: '/jobs', icon: Briefcase }
]

const popularSearches = [
  { label: 'អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ', labelEn: 'National ID Card', query: 'National ID Card', route: '/government/national-id-card' },
  { label: 'ប័ណ្ណបើកបរយានយន្ត', labelEn: 'Driving License', query: 'Driving License', route: '/government/driving-license' },
  { label: 'លិខិតឆ្លងដែនកម្ពុជា', labelEn: 'Cambodian Passport', query: 'Passport', route: '/government/passport-application' },
  { label: 'សង្គ្រោះបន្ទាន់ ១១៩ (SAMU)', labelEn: 'Emergency SAMU 119', query: '119', route: '/emergency' },
  { label: 'មន្ទីរពេទ្យកាល់ម៉ែត', labelEn: 'Calmette Hospital', query: 'Calmette', route: '/health/calmette-hospital' },
  { label: 'ខ្សែរថយន្តក្រុងរាជធានី', labelEn: 'City Bus Routes', query: 'City Bus', route: '/transport' }
]

const searchResults = computed<SearchResult[]>(() => {
  if (!query.value.trim() || query.value.trim().length < 1) return []
  const all = globalSearch(query.value)
  if (selectedCategory.value === 'all') return all
  return all.filter(item => (item.type as string) === selectedCategory.value)
})

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    setTimeout(() => {
      searchInput.value?.focus()
    }, 100)
  } else {
    query.value = ''
  }
})

function saveRecentSearch(term: string) {
  if (!term.trim()) return
  const filtered = recentSearches.value.filter(s => s.toLowerCase() !== term.toLowerCase())
  filtered.unshift(term)
  recentSearches.value = filtered.slice(0, 8)
  localStorage.setItem('camlife-recent-searches', JSON.stringify(recentSearches.value))
}

function clearRecentSearches() {
  recentSearches.value = []
  localStorage.removeItem('camlife-recent-searches')
}

function navigateTo(route: string, searchTerm?: string) {
  if (searchTerm) saveRecentSearch(searchTerm)
  router.push(route)
  emit('close')
}

function selectIntent(intent: typeof problemIntents[0]) {
  saveRecentSearch(intent.query)
  router.push(intent.target)
  emit('close')
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))

function getIconForType(type: string) {
  if (type === 'hospital') return HeartPulse
  if (type === 'government') return Building2
  if (type === 'job') return Briefcase
  if (type === 'home-service') return Wrench
  if (type === 'transport') return Bus
  if (type === 'news') return Newspaper
  if (type === 'emergency') return Siren
  return MapPin
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-150 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-100 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-3 sm:px-4 bg-slate-950/65 backdrop-blur-xs overflow-y-auto"
      @click.self="emit('close')"
    >
      <div
        class="w-full max-w-3xl bg-white dark:bg-[#1E293B] rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-700 overflow-hidden animate-fadeIn my-4"
      >
        <!-- Search Input Bar -->
        <div class="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-400 flex items-center justify-center shrink-0">
            <Search class="w-5 h-5" />
          </div>

          <div class="flex-1 relative">
            <input
              ref="searchInput"
              v-model="query"
              type="text"
              class="w-full bg-transparent text-slate-900 dark:text-white placeholder:text-slate-400 text-sm sm:text-base font-bold outline-none font-khmer"
              :placeholder="currentLanguage === 'kh' ? 'តើអ្នកកំពុងស្វែងរកអ្វី? (ឧ. ធ្វើប័ណ្ណបើកបរ, បាត់អត្តសញ្ញាណប័ណ្ណ, ពេទ្យ...)' : 'What do you need? (e.g. driving license, passport, 119 emergency, jobs...)'"
            />
          </div>

          <button
            v-if="query"
            @click="query = ''"
            class="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
            type="button"
          >
            <X class="w-4 h-4" />
          </button>

          <kbd class="hidden sm:inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-mono bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        <!-- Filter Category Tabs (When Searching) -->
        <div v-if="query.trim().length > 0" class="px-4 sm:px-6 py-2.5 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700 flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            v-for="cat in ([
              { id: 'all', label: 'ទាំងអស់ (All)' },
              { id: 'government', label: 'សេវារដ្ឋ (Government)' },
              { id: 'hospital', label: 'សុខាភិបាល (Healthcare)' },
              { id: 'emergency', label: 'សង្គ្រោះបន្ទាន់ (Emergency)' },
              { id: 'job', label: 'ការងារ (Jobs)' },
              { id: 'transport', label: 'ដឹកជញ្ជូន (Transport)' }
            ] as const)"
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="[
              'px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap',
              selectedCategory === cat.id
                ? 'bg-[#0D47A1] text-white shadow-xs'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
            ]"
            type="button"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- Search Results List -->
        <div v-if="query.trim().length > 0" class="max-h-[60vh] overflow-y-auto p-3 sm:p-4 divide-y divide-slate-100 dark:divide-slate-800">
          <div v-if="searchResults.length === 0" class="p-8 text-center space-y-3">
            <div class="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
              <Search class="w-6 h-6" />
            </div>
            <h4 class="text-sm font-black text-slate-800 dark:text-white font-khmer">
              {{ currentLanguage === 'kh' ? `រកមិនឃើញលទ្ធផលសម្រាប់ "${query}" ទេ` : `No direct matches for "${query}"` }}
            </h4>
            <p class="text-xs text-slate-400 max-w-sm mx-auto font-khmer">
              {{ currentLanguage === 'kh'
                ? 'សូមសាកល្បងពាក្យគន្លឹះទូទៅ ដូចជា "ប័ណ្ណបើកបរ", "លិខិតឆ្លងដែន", "មន្ទីរពេទ្យ", ឬ "119"។'
                : 'Try keywords like "Passport", "Driving License", "Hospital", or "Emergency".'
              }}
            </p>
          </div>

          <div v-else class="space-y-1.5">
            <button
              v-for="res in searchResults"
              :key="res.id"
              @click="navigateTo(res.route, res.title)"
              class="w-full p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-start justify-between gap-3 text-left group"
              type="button"
            >
              <div class="flex items-start gap-3 min-w-0">
                <div class="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform mt-0.5">
                  <component :is="getIconForType(res.type)" class="w-4 h-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <h4 class="text-xs sm:text-sm font-black text-[#0A2540] dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors font-khmer truncate">
                    {{ res.title }}
                  </h4>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-khmer">
                    {{ res.description }}
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0">
                <span class="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                  {{ res.category }}
                </span>
                <CornerDownLeft class="w-4 h-4 text-slate-300 group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors hidden sm:inline-block" />
              </div>
            </button>
          </div>
        </div>

        <!-- Initial Screen (No Query entered yet) -->
        <div v-else class="max-h-[65vh] overflow-y-auto p-5 sm:p-6 space-y-6">
          <!-- Search by Problem / Citizen Need (Intent Solving) -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-khmer">
                <Sparkles class="w-3.5 h-3.5 text-amber-500" />
                <span>{{ currentLanguage === 'kh' ? 'តម្រូវការទូទៅរបស់ប្រជាពលរដ្ឋ (Suggested Intents)' : 'Common Citizen Needs' }}</span>
              </span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                v-for="intent in problemIntents"
                :key="intent.intentKh"
                @click="selectIntent(intent)"
                class="flex items-center gap-3 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 bg-slate-50/50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 transition-all text-left group"
                type="button"
              >
                <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-[#0D47A1] dark:text-blue-300 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <component :is="intent.icon" class="w-4 h-4" />
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-slate-800 dark:text-white group-hover:text-[#0D47A1] dark:group-hover:text-blue-400 transition-colors font-khmer truncate">
                    {{ currentLanguage === 'kh' ? intent.intentKh : intent.intentEn }}
                  </p>
                </div>
                <ArrowRight class="w-3.5 h-3.5 text-slate-300 group-hover:text-[#0D47A1] group-hover:translate-x-0.5 transition-all shrink-0" />
              </button>
            </div>
          </div>

          <!-- Popular Searches Pills -->
          <div class="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-khmer">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-500" />
              <span>{{ currentLanguage === 'kh' ? 'សេវាដែលពលរដ្ឋស្វែងរកញឹកញាប់' : 'Popular Public Services' }}</span>
            </span>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in popularSearches"
                :key="item.label"
                @click="navigateTo(item.route, item.query)"
                class="px-3.5 py-2 bg-slate-50 dark:bg-slate-700/60 hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-[#0D47A1] dark:hover:text-blue-300 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-600 transition-all font-khmer"
                type="button"
              >
                {{ currentLanguage === 'kh' ? item.label : item.labelEn }}
              </button>
            </div>
          </div>

          <!-- Recent Searches (If Any) -->
          <div v-if="recentSearches.length > 0" class="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-700">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-khmer">
                <Clock class="w-3.5 h-3.5 text-slate-400" />
                <span>{{ currentLanguage === 'kh' ? 'ការស្វែងរកថ្មីៗរបស់អ្នក' : 'Recent Searches' }}</span>
              </span>
              <button
                @click="clearRecentSearches"
                class="text-[11px] text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1"
                type="button"
              >
                <Trash2 class="w-3 h-3" />
                <span>{{ currentLanguage === 'kh' ? 'លុបប្រវត្តិ' : 'Clear' }}</span>
              </button>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                v-for="term in recentSearches"
                :key="term"
                @click="query = term"
                class="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors font-khmer"
                type="button"
              >
                {{ term }}
              </button>
            </div>
          </div>
        </div>

        <!-- Footer Tip -->
        <div class="px-6 py-3 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-[11px] text-slate-400 font-khmer">
          <span class="inline-flex items-center gap-1.5"><Lightbulb class="w-3.5 h-3.5 text-amber-500 shrink-0" /> <span>{{ currentLanguage === 'kh' ? 'វាយបញ្ចូលពាក្យគន្លឹះ ឬបញ្ហាដែលអ្នកចង់ដោះស្រាយ' : 'Type keywords or the problem you wish to solve' }}</span></span>
          <span class="hidden sm:inline">CamLife Citizen Search</span>
        </div>

      </div>
    </div>
  </Transition>
</template>
