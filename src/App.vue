<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BackToTop from '@/components/BackToTop.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1727] text-[#0F172A] dark:text-[#F8FAFC] antialiased selection:bg-blue-100 selection:text-[#0D47A1] transition-colors duration-200">
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
