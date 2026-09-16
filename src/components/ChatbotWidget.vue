<script setup lang="ts">
import { ref, reactive, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  Bot,
  Send,
  X,
  Sparkles,
  RotateCcw,
  ArrowUpRight
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

const router = useRouter()
const { currentLanguage } = useLanguage()

interface ChatMessage {
  id: string
  sender: 'bot' | 'user'
  textKh: string
  textEn: string
  time: string
  actionLink?: {
    textKh: string
    textEn: string
    route: string
  }
  bullets?: { kh: string; en: string }[]
}

const isOpen = ref(false)
const isTyping = ref(false)
const inputQuery = ref('')
const chatContainer = ref<HTMLElement | null>(null)

const initialGreeting: ChatMessage = {
  id: 'msg-init',
  sender: 'bot',
  textKh: 'ជំរាបសួរ! ខ្ញុំជាជំនួយការឆ្លាតវៃ CamLife AI។ តើខ្ញុំអាចជួយលោកអ្នកស្វែងរកព័ត៌មាន ឬសេវាកម្មរដ្ឋបាលអ្វីខ្លះថ្ងៃនេះ?',
  textEn: 'Hello! I am CamLife AI Civic Assistant. How can I assist you with public services or inquiries today?',
  time: getCurrentTime(),
  bullets: [
    { kh: 'ស្វែងរកព័ត៌មានប័ណ្ណបើកបរ & លិខិតឆ្លងដែន', en: 'Driver license & passport renewal guides' },
    { kh: 'ស្វែងរកមន្ទីរពេទ្យ & លេខទូរស័ព្ទសង្គ្រោះបន្ទាន់', en: 'Hospitals & 24/7 emergency hotlines' },
    { kh: 'តាមដានពាក្យស្នើសុំសេវាច្រកចេញចូលតែមួយ OWSO', en: 'Track OWSO citizen applications' },
    { kh: 'ស្វែងរកជាងជំនាញជួសជុលគេហដ្ឋាន', en: 'Verified home maintenance technicians' }
  ]
}

const messages = reactive<ChatMessage[]>([initialGreeting])

// Quick suggested prompt chips
const quickPrompts = [
  {
    icon: '🚗',
    labelKh: 'បន្តប័ណ្ណបើកបរ',
    labelEn: 'Driver License Renewal',
    query: 'បន្តប័ណ្ណបើកបរ'
  },
  {
    icon: '🏥',
    labelKh: 'មន្ទីរពេទ្យសង្គ្រោះបន្ទាន់',
    labelEn: 'Emergency Hospital',
    query: 'មន្ទីរពេទ្យសង្គ្រោះបន្ទាន់'
  },
  {
    icon: '📄',
    labelKh: 'សេវាច្រក OWSO',
    labelEn: 'OWSO Services',
    query: 'សេវាច្រក OWSO'
  },
  {
    icon: '🔧',
    labelKh: 'ជាងជួសជុលគេហដ្ឋាន',
    labelEn: 'Home Repair',
    query: 'ជាងជួសជុលគេហដ្ឋាន'
  },
  {
    icon: '🚨',
    labelKh: 'លេខទូរស័ព្ទបន្ទាន់',
    labelEn: 'Emergency Hotline',
    query: 'លេខទូរស័ព្ទបន្ទាន់'
  },
  {
    icon: '🔍',
    labelKh: 'តាមដានពាក្យស្នើសុំ',
    labelEn: 'Track Application',
    query: 'តាមដានពាក្យស្នើសុំ'
  }
]

function getCurrentTime() {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function scrollToBottom() {
  nextTick(() => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight
    }
  })
}

watch(isOpen, (val) => {
  if (val) {
    scrollToBottom()
  }
})

// Client-side intelligent knowledge base matcher
function getBotResponse(q: string): ChatMessage {
  const lower = q.toLowerCase()
  const now = getCurrentTime()

  // 1. Driver License
  if (lower.includes('ប័ណ្ណបើកបរ') || lower.includes('license') || lower.includes('បើកបរ') || lower.includes('driving')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'bot',
      textKh: 'សេវាបន្តប័ណ្ណបើកបរយានយន្ត អាចធ្វើឡើងនៅផ្សារទំនើបអ៊ីអន (Aeon Mall 1 & 2) ឬមន្ទីរសាធារណការ និងដឹកជញ្ជូនរាជធានី-ខេត្ត។',
      textEn: 'Driver license renewal can be completed at Aeon Mall 1 & 2 Service Centers or Provincial Public Works Departments.',
      time: now,
      bullets: [
        { kh: 'ឯកសារភ្ជាប់៖ អត្តសញ្ញាណប័ណ្ណខ្មែរ, ប័ណ្ណបើកបរចាស់, លិខិតបញ្ជាក់សុខភាព, រូបថត 4x6', en: 'Documents: National ID, old license, health certificate, 4x6 photos' },
        { kh: 'តម្លៃសេវាផ្លូវការ៖ ២០,០០០ ៛ (ម៉ូតូ) និង ៣០,០០០ ៛ (រថយន្តទេសចរណ៍)', en: 'Official Fee: 20,000 KHR (Motorcycle) / 30,000 KHR (Sedan)' }
      ],
      actionLink: {
        textKh: 'មើលសេវារដ្ឋបាលសាធារណៈ',
        textEn: 'View Government Services',
        route: '/government'
      }
    }
  }

  // 2. Hospitals & Healthcare
  if (lower.includes('ពេទ្យ') || lower.includes('hospital') || lower.includes('សុខភាព') || lower.includes('health') || lower.includes('clinic')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'bot',
      textKh: 'សម្រាប់សេវាសុខាភិបាល លោកអ្នកអាចស្វែងរកមន្ទីរពេទ្យរដ្ឋ និងឯកជន ព្រមទាំងបន្ទប់សង្គ្រោះបន្ទាន់ ២៤ ម៉ោងទូទាំងប្រទេស។',
      textEn: 'For healthcare, you can search public and private hospitals, including 24/7 emergency trauma centers across Cambodia.',
      time: now,
      bullets: [
        { kh: 'មន្ទីរពេទ្យកាល់ម៉ែត (Calmette Hospital): ០២៣ ៤២៦ ៩៤៨', en: 'Calmette Hospital: 023 426 948' },
        { kh: 'មន្ទីរពេទ្យព្រះកុសុមៈ (Kosamak Hospital): ០២៣ ៨៨០ ៧៧៧', en: 'Kosamak Hospital: 023 880 777' },
        { kh: 'រថយន្តសង្គ្រោះបន្ទាន់ជាតិ (SAMU): ១១៩', en: 'National Ambulance Service (SAMU): 119' }
      ],
      actionLink: {
        textKh: 'ស្វែងរកមន្ទីរពេទ្យ & គ្លីនិក',
        textEn: 'Browse Hospitals & Clinics',
        route: '/health'
      }
    }
  }

  // 3. OWSO & Government Services
  if (lower.includes('owso') || lower.includes('ច្រក') || lower.includes('រដ្ឋបាល') || lower.includes('gov') || lower.includes('service')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'bot',
      textKh: 'ការិយាល័យច្រកចេញចូលតែមួយ (OWSO) ផ្តល់សេវារដ្ឋបាលបែបទំនើប និងឆាប់រហ័ស ដូចជាការចុះបញ្ជីអាជីវកម្ម សំណង់ និងឯកសាររដ្ឋបាលទូទៅ។',
      textEn: 'One Window Service Offices (OWSO) offer modern, expedited public administrative services including business registration and permits.',
      time: now,
      bullets: [
        { kh: 'ម៉ោងធ្វើការ៖ ថ្ងៃចន្ទ ដល់ សុក្រ (០៧:៣០ ព្រឹក ដល់ ០៥:០០ ល្ងាច)', en: 'Hours: Monday - Friday (07:30 AM - 05:00 PM)' },
        { kh: 'ទូរស័ព្ទជំនួយការទូទៅ៖ ១២៨០ (ឥតគិតថ្លៃ)', en: 'Toll-free Citizen Helpline: 1280' }
      ],
      actionLink: {
        textKh: 'មើលការិយាល័យ OWSO ទាំងអស់',
        textEn: 'View All OWSO Offices',
        route: '/government'
      }
    }
  }

  // 4. Home Services
  if (lower.includes('ជាង') || lower.includes('repair') || lower.includes('ទឹក') || lower.includes('ភ្លើង') || lower.includes('ម៉ាស៊ីនត្រជាក់') || lower.includes('clean')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'bot',
      textKh: 'យើងមានបញ្ជីអ្នកឯកទេស និងជាងជួសជុលគេហដ្ឋានដែលបានផ្ទៀងផ្ទាត់ (Verified Technicians) សម្រាប់ជួសជុលម៉ាស៊ីនត្រជាក់ ទុយោទឹក អគ្គិសនី និងសេវាបោសសម្អាត។',
      textEn: 'We have verified technicians available for air conditioner maintenance, plumbing, electrical installations, and home cleaning.',
      time: now,
      bullets: [
        { kh: 'ជាងមានការធានាគុណភាព និងតម្លៃសមរម្យ', en: 'All technicians verified with transparent price estimates' },
        { kh: 'មានការវាយតម្លៃផ្កាយ (Rating) ពីអតិថិជនពិតប្រាកដ', en: 'Real citizen reviews and ratings' }
      ],
      actionLink: {
        textKh: 'រកជាងជួសជុលគេហដ្ឋាន',
        textEn: 'Find Home Repair Specialists',
        route: '/home-services'
      }
    }
  }

  // 5. Emergency Numbers
  if (lower.includes('បន្ទាន់') || lower.includes('emergency') || lower.includes('117') || lower.includes('118') || lower.includes('119') || lower.includes('ប៉ូលិស') || lower.includes('police')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'bot',
      textKh: 'លេខទូរស័ព្ទទាន់ហេតុការណ៍ និងសង្គ្រោះបន្ទាន់ទូទាំងប្រទេសកម្ពុជា (ឥតគិតថ្លៃ ២៤/៧)៖',
      textEn: 'Nationwide 24/7 toll-free emergency response numbers:',
      time: now,
      bullets: [
        { kh: '🚓 ១១៧: ប៉ូលិសសង្គ្រោះបន្ទាន់ជាតិ', en: '🚓 117: National Police Emergency' },
        { kh: '🚒 ១១៨: ផ្នែកពន្លត់អគ្គិភ័យ (រថយន្តពន្លត់ភ្លើង)', en: '🚒 118: Fire & Rescue Department' },
        { kh: '🚑 ១១៩: រថយន្តសង្គ្រោះបន្ទាន់ & សុខាភិបាល', en: '🚑 119: Medical Ambulance Hotline' }
      ],
      actionLink: {
        textKh: 'មើលលេខទូរស័ព្ទទាន់ហេតុការណ៍ពេញលេញ',
        textEn: 'View Full Emergency Directory',
        route: '/emergency'
      }
    }
  }

  // 6. Application Tracking
  if (lower.includes('តាមដាន') || lower.includes('track') || lower.includes('ពាក្យ') || lower.includes('លេខកូដ') || lower.includes('status')) {
    return {
      id: 'resp-' + Date.now(),
      sender: 'bot',
      textKh: 'លោកអ្នកអាចតាមដានស្ថានភាពពាក្យស្នើសុំសេវាសាធារណៈបានយ៉ាងងាយស្រួលនៅលើទំព័រដើម CamLife ដោយប្រើលេខកូដសម្គាល់។',
      textEn: 'You can easily track your civic service application directly on the CamLife homepage using your tracking reference code.',
      time: now,
      bullets: [
        { kh: 'ឧទាហរណ៍លេខកូដសាកល្បង៖ OWSO-2026-8891 ឬ BUS-2026-4402', en: 'Sample demo codes: OWSO-2026-8891 or BUS-2026-4402' },
        { kh: 'ទទួលបានបង្កាន់ដៃឌីជីថល QR Code បញ្ជាក់សុពលភាព', en: 'View digital QR code electronic receipt' }
      ],
      actionLink: {
        textKh: 'ទៅកាន់ប្រព័ន្ធតាមដានពាក្យស្នើសុំ',
        textEn: 'Go to Application Tracker',
        route: '/'
      }
    }
  }

  // Default fallback
  return {
    id: 'resp-' + Date.now(),
    sender: 'bot',
    textKh: 'សូមអរគុណសម្រាប់សំណួររបស់លោកអ្នក! លោកអ្នកអាចស្វែងរកព័ត៌មានលម្អិតតាមផ្នែកសេវាកម្មរដ្ឋបាល សុខាភិបាល ឬឱកាសការងារនៅលើគេហទំព័រ ឬជ្រើសរើសប្រធានបទរហ័សខាងក្រោម៖',
    textEn: 'Thank you for your question! You can explore civic services, healthcare, or career opportunities via our main portal, or select a suggested topic below:',
    time: now,
    bullets: [
      { kh: 'ចុចលើសេវាដែលលោកអ្នកចាប់អារម្មណ៍ខាងក្រោម', en: 'Tap any suggested topic chip below' },
      { kh: 'ឬទាក់ទងមកកាន់លេខជំនួយការផ្លូវការ ១២៨០ (ឥតគិតថ្លៃ)', en: 'Or contact citizen helpline at 1280' }
    ]
  }
}

function handleSend(userText?: string) {
  const query = (userText || inputQuery.value).trim()
  if (!query) return

  const now = getCurrentTime()
  messages.push({
    id: 'user-' + Date.now(),
    sender: 'user',
    textKh: query,
    textEn: query,
    time: now
  })

  inputQuery.value = ''
  scrollToBottom()

  isTyping.value = true
  setTimeout(() => {
    isTyping.value = false
    const botResp = getBotResponse(query)
    messages.push(botResp)
    scrollToBottom()
  }, 450)
}

function handlePromptClick(p: typeof quickPrompts[0]) {
  const query = currentLanguage.value === 'kh' ? p.labelKh : p.labelEn
  handleSend(query)
}

function handleNavigate(route: string) {
  isOpen.value = false
  router.push(route)
}

function resetChat() {
  messages.splice(0, messages.length, initialGreeting)
}
</script>

<template>
  <div class="select-none">
    
    <!-- 1. FLOATING CHATBOT BUTTON (BOTTOM RIGHT) -->
    <button
      type="button"
      @click="isOpen = !isOpen"
      :class="[
        'chatbot-floating-btn fixed bottom-5 right-5 z-30 p-3 sm:p-3.5 rounded-2xl shadow-xl transition-all duration-300 flex items-center gap-2.5 cursor-pointer group',
        isOpen
          ? 'bg-slate-900 text-white scale-95'
          : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-blue-500/25 hover:scale-105 active:scale-95'
      ]"
      title="CamLife AI Assistant"
    >
      <div class="relative">
        <Bot v-if="!isOpen" class="w-6 h-6 animate-pulse" />
        <X v-else class="w-6 h-6" />
        <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white"></span>
      </div>
      <div class="hidden sm:flex flex-col text-left">
        <span class="text-xs font-black font-khmer leading-none">
          {{ currentLanguage === 'kh' ? 'ជំនួយការ CamLife AI' : 'CamLife Assistant' }}
        </span>
        <span class="text-[10px] text-blue-100 font-medium leading-tight mt-0.5">
          {{ currentLanguage === 'kh' ? 'សួរនាំព័ត៌មានរដ្ឋបាល ២៤/៧' : '24/7 Civic AI Support' }}
        </span>
      </div>
    </button>

    <!-- 2. CHAT DRAWER / WINDOW -->
    <transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="isOpen"
        class="fixed bottom-20 right-4 sm:right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[82vh] bg-white rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden select-text"
      >
        
        <!-- Chat Header -->
        <div class="p-3.5 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white flex items-center justify-between shrink-0 select-none shadow-xs">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white border border-white/20 shrink-0">
              <Bot class="w-5 h-5" />
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h4 class="text-xs font-black font-khmer leading-tight">
                  {{ currentLanguage === 'kh' ? 'ជំនួយការឆ្លាតវៃ CamLife' : 'CamLife Smart Assistant' }}
                </h4>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              </div>
              <p class="text-[10px] text-blue-100 font-khmer">
                {{ currentLanguage === 'kh' ? 'ផ្តល់ព័ត៌មានសេវាសាធារណៈ & រដ្ឋបាល' : 'Automated Civic Service Guide' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button
              type="button"
              @click="resetChat"
              class="w-7 h-7 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              :title="currentLanguage === 'kh' ? 'ចាប់ផ្តើមឡើងវិញ' : 'Reset chat'"
            >
              <RotateCcw class="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              @click="isOpen = false"
              class="w-7 h-7 rounded-lg hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Close"
            >
              <X class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Chat Stream Body -->
        <div
          ref="chatContainer"
          class="flex-1 min-h-0 overflow-y-auto p-3.5 space-y-3 bg-slate-50/70"
        >
          
          <div
            v-for="msg in messages"
            :key="msg.id"
            :class="[
              'flex flex-col',
              msg.sender === 'user' ? 'items-end' : 'items-start'
            ]"
          >
            <!-- Message Bubble -->
            <div
              :class="[
                'max-w-[88%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs',
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs font-medium'
                  : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
              ]"
            >
              <!-- Bot Avatar Indicator -->
              <div v-if="msg.sender === 'bot'" class="flex items-center gap-1.5 mb-1.5 pb-1 border-b border-slate-100">
                <Sparkles class="w-3.5 h-3.5 text-blue-600" />
                <span class="text-[10px] font-black text-blue-700 uppercase tracking-wider font-sans">CamLife AI</span>
              </div>

              <!-- Content text -->
              <p class="font-khmer">
                {{ currentLanguage === 'kh' ? msg.textKh : msg.textEn }}
              </p>

              <!-- Optional bullets -->
              <ul v-if="msg.bullets && msg.bullets.length > 0" class="mt-2 space-y-1 text-[11px] text-slate-600 font-khmer">
                <li
                  v-for="(b, idx) in msg.bullets"
                  :key="idx"
                  class="flex items-start gap-1.5 bg-slate-50 p-1.5 rounded-lg border border-slate-100"
                >
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 mt-1.5"></span>
                  <span>{{ currentLanguage === 'kh' ? b.kh : b.en }}</span>
                </li>
              </ul>

              <!-- Optional Action button -->
              <div v-if="msg.actionLink" class="mt-2.5 pt-1.5 border-t border-slate-100">
                <button
                  type="button"
                  @click="handleNavigate(msg.actionLink.route)"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold rounded-lg transition-colors font-khmer cursor-pointer group"
                >
                  <span>{{ currentLanguage === 'kh' ? msg.actionLink.textKh : msg.actionLink.textEn }}</span>
                  <ArrowUpRight class="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </button>
              </div>

              <span
                :class="[
                  'block text-[9px] mt-1 text-right',
                  msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                ]"
              >
                {{ msg.time }}
              </span>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="isTyping" class="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200/70 w-fit shadow-2xs">
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce"></span>
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.15s]"></span>
            <span class="w-2 h-2 rounded-full bg-blue-600 animate-bounce [animation-delay:0.3s]"></span>
            <span class="text-[10px] text-slate-400 font-khmer ml-1">{{ currentLanguage === 'kh' ? 'កំពុងឆ្លើយតប...' : 'Thinking...' }}</span>
          </div>

        </div>

        <!-- Quick Prompts Slider / Chips -->
        <div class="px-3 py-2 bg-white border-t border-slate-100 shrink-0 overflow-x-auto select-none no-scrollbar">
          <div class="flex items-center gap-1.5 whitespace-nowrap">
            <button
              v-for="(p, i) in quickPrompts"
              :key="i"
              type="button"
              @click="handlePromptClick(p)"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[10.5px] font-medium transition-colors font-khmer shrink-0 border border-slate-200/60 cursor-pointer"
            >
              <span>{{ p.icon }}</span>
              <span>{{ currentLanguage === 'kh' ? p.labelKh : p.labelEn }}</span>
            </button>
          </div>
        </div>

        <!-- Input Footer -->
        <form
          @submit.prevent="handleSend()"
          class="p-2.5 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0 select-none"
        >
          <input
            v-model="inputQuery"
            type="text"
            :placeholder="currentLanguage === 'kh' ? 'សួរសំណួរអំពីសេវារដ្ឋបាល ឬព័ត៌មាន...' : 'Type a civic question...'"
            class="flex-1 min-w-0 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-khmer transition-all"
          />
          <button
            type="submit"
            :disabled="!inputQuery.trim() || isTyping"
            class="w-8 h-8 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 shadow-xs"
          >
            <Send class="w-4 h-4" />
          </button>
        </form>

      </div>
    </transition>

  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

:global(body.mobile-menu-open) .chatbot-floating-btn {
  opacity: 0 !important;
  pointer-events: none !important;
  transform: scale(0.8) !important;
}
</style>
