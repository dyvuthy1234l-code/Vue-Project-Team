<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import BackToTop from '@/components/BackToTop.vue'

const route = useRoute()
const isAdminRoute = computed(() => route.name === 'admin')

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
    <Navbar v-if="!isAdminRoute" />
    <main class="flex-1 flex flex-col">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isAdminRoute" />
    <BackToTop v-if="!isAdminRoute" />
  </div>
</template>
