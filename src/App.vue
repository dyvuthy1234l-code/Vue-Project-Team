<script setup lang="ts">
import { computed, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BackToTop from '@/components/BackToTop.vue'
import ChatbotWidget from '@/components/ChatbotWidget.vue'
import { useGlobalScrollReveal, refreshScrollReveal } from '@/composables/useScrollReveal'

const route = useRoute()
const isAdminRoute = computed(() => route.name === 'admin')

useGlobalScrollReveal()

watch(() => route.fullPath, async () => {
  await nextTick()
  setTimeout(() => {
    refreshScrollReveal()
  }, 100)
})

onMounted(() => {
  try {
    localStorage.removeItem('camlife-dark-mode')
    document.documentElement.classList.remove('dark')
  } catch {
    // ignore
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-100 selection:text-[#0D47A1] transition-colors duration-200 overflow-x-hidden w-full">
    <Navbar v-if="!isAdminRoute" />
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component, route: viewRoute }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="viewRoute.path.startsWith('/admin') ? '/admin' : viewRoute.fullPath" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isAdminRoute" />
    <BackToTop v-if="!isAdminRoute" />
    <ChatbotWidget v-if="!isAdminRoute" />
  </div>
</template>
