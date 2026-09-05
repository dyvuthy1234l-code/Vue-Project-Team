<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BackToTop from '@/components/BackToTop.vue'

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
  <div class="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-100 selection:text-[#0D47A1] transition-colors duration-200">
    <Navbar />
    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer />
    <BackToTop />
  </div>
</template>
