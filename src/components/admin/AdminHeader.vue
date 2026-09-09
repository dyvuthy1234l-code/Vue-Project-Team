<script setup lang="ts">
import { ref } from 'vue'
import {
  Menu,
  Search,
  Bell
} from 'lucide-vue-next'
import { useLanguage } from '@/composables/useLanguage'

defineProps<{
  sidebarCollapsed?: boolean
  searchQuery?: string
}>()

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
  (e: 'update:searchQuery', val: string): void
  (e: 'navigate', tab: string): void
}>()

const { currentLanguage, setLanguage } = useLanguage()

const isNotifOpen = ref(false)

const notifications = ref([
  { id: 1, title: 'សំណើសុំបើកអាជីវកម្មថ្មី', titleEn: 'New Business Registration Request', time: '10m ago', unread: true },
  { id: 2, title: 'ការងារថ្មីរង់ចាំការអនុម័ត', titleEn: 'New Job Listing Pending Approval', time: '35m ago', unread: true },
  { id: 3, title: 'របាយការណ៍មតិយោបល់ពីប្រជាពលរដ្ឋ', titleEn: 'Citizen Feedback Submitted', time: '1h ago', unread: true },
  { id: 4, title: 'ការធ្វើបច្ចុប្បន្នភាពមន្ទីរពេទ្យ', titleEn: 'Hospital Profile Updated', time: '2h ago', unread: false },
  { id: 5, title: 'ប្រព័ន្ធដំណើរការធម្មតា', titleEn: 'Daily System Backup Completed', time: '4h ago', unread: false }
])
</script>

<template>
  <header class="h-14 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30 shadow-xs select-none">
    
    <!-- 1. LEFT: Pure Brand Logo & Title (Menu icon moved to search) -->
    <router-link to="/" class="flex items-center gap-2.5 group focus:outline-none shrink-0">
      <img
        src="/logo.png"
        alt="CamLife"
        class="h-9 sm:h-10 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
      />
      <div class="flex flex-col">
        <h1 class="text-base font-black text-slate-900 tracking-tight leading-none">CamLife</h1>
        <p class="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider mt-0.5">
          Admin CMS
        </p>
      </div>
    </router-link>

    <!-- 2. CENTER: Menu Toggle Icon + Search Bar (Ctrl+K Removed) -->
    <div class="flex items-center flex-1 max-w-lg mx-4 sm:mx-6 gap-2 sm:gap-2.5">
      <!-- Menu toggle icon placed right beside search box -->
      <button
        type="button"
        @click="emit('toggle-sidebar')"
        class="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80 transition-colors cursor-pointer shrink-0 shadow-2xs"
        title="Toggle Sidebar"
      >
        <Menu class="w-4 h-4" />
      </button>

      <!-- Search Input without Ctrl K -->
      <div class="relative w-full">
        <Search class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          :value="searchQuery"
          @input="emit('update:searchQuery', ($event.target as HTMLInputElement).value)"
          :placeholder="currentLanguage === 'kh' ? 'ស្វែងរកសេវា, មាតិកា, អ្នកប្រើប្រាស់...' : 'Search services, content, users...'"
          class="w-full pl-10 pr-4 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none transition-all font-khmer shadow-2xs"
        />
      </div>
    </div>

    <!-- 3. RIGHT: Language Switcher (ខ្មែរ ~ English), Notification, Profile -->
    <div class="flex items-center gap-2 sm:gap-3 shrink-0">
      
      <!-- Bilingual Toggle Button: ខ្មែរ ~ English -->
      <div class="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <button
          type="button"
          @click="setLanguage('kh')"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 font-khmer cursor-pointer',
            currentLanguage === 'kh'
              ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          title="ភាសាខ្មែរ"
        >
          <span>🇰🇭 ខ្មែរ</span>
        </button>
        <button
          type="button"
          @click="setLanguage('en')"
          :class="[
            'px-2.5 py-1 rounded-lg text-xs font-bold transition-all duration-150 flex items-center gap-1 cursor-pointer',
            currentLanguage === 'en'
              ? 'bg-white text-blue-600 shadow-2xs font-extrabold'
              : 'text-slate-600 hover:text-slate-900'
          ]"
          title="English"
        >
          <span>🇬🇧 English</span>
        </button>
      </div>

      <!-- Enhanced Notification Bell Icon -->
      <div class="relative">
        <button
          type="button"
          @click="isNotifOpen = !isNotifOpen"
          class="relative p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50/80 border border-slate-200/80 hover:border-blue-200 transition-all cursor-pointer flex items-center justify-center shadow-2xs"
          title="Notifications"
        >
          <Bell class="w-4 h-4" />
          <span class="absolute -top-1 -right-1 flex h-4 w-4">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-60"></span>
            <span class="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-white text-[9px] font-black items-center justify-center ring-2 ring-white shadow-2xs">
              5
            </span>
          </span>
        </button>

        <!-- Notification Popover -->
        <div
          v-if="isNotifOpen"
          class="absolute right-0 mt-2 w-72 sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
        >
          <div class="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
            <span class="text-xs font-bold text-slate-800 font-khmer">
              {{ currentLanguage === 'kh' ? 'ការជូនដំណឹង' : 'Notifications' }} (5)
            </span>
            <button
              type="button"
              @click="isNotifOpen = false"
              class="text-[10px] text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              {{ currentLanguage === 'kh' ? 'សម្គាល់ថាបានអាន' : 'Mark all read' }}
            </button>
          </div>
          <div class="max-h-64 overflow-y-auto divide-y divide-slate-50">
            <div
              v-for="item in notifications"
              :key="item.id"
              class="px-4 py-2.5 hover:bg-slate-50 cursor-pointer flex items-start gap-2.5 transition-colors"
            >
              <div class="w-2 h-2 rounded-full mt-1.5 shrink-0" :class="item.unread ? 'bg-blue-600' : 'bg-slate-300'"></div>
              <div class="flex-1 min-w-0">
                <p class="text-xs font-medium text-slate-800 truncate font-khmer">
                  {{ currentLanguage === 'kh' ? item.title : item.titleEn }}
                </p>
                <span class="text-[10px] text-slate-400">{{ item.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- User Profile (A / Admin / Super Admin) -->
      <div class="flex items-center gap-2.5 pl-2 border-l border-slate-200">
        <div class="w-8 h-8 rounded-full bg-[#1E40AF] text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-blue-100">
          A
        </div>
        <div class="hidden sm:flex flex-col text-left">
          <span class="text-xs font-bold text-slate-800 leading-tight">Admin</span>
          <span class="text-[10px] text-slate-400 font-medium leading-none mt-0.5">Super Admin</span>
        </div>
      </div>

    </div>
  </header>
</template>
