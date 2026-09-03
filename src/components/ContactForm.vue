<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Send, CheckCircle2, AlertCircle } from 'lucide-vue-next'

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const errors = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitted = ref(false)
const isSubmitting = ref(false)

function validate(): boolean {
  let valid = true
  errors.name = ''
  errors.email = ''
  errors.subject = ''
  errors.message = ''

  if (!form.name.trim()) {
    errors.name = 'Full name is required'
    valid = false
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    valid = false
  }

  if (!form.subject.trim()) {
    errors.subject = 'Subject is required'
    valid = false
  }

  if (!form.message.trim()) {
    errors.message = 'Message content is required'
    valid = false
  } else if (form.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters'
    valid = false
  }

  return valid
}

function submitForm() {
  if (!validate()) return

  isSubmitting.value = true

  setTimeout(() => {
    try {
      const submissions = JSON.parse(localStorage.getItem('camlife-feedback') || '[]')
      submissions.push({
        ...form,
        date: new Date().toISOString()
      })
      localStorage.setItem('camlife-feedback', JSON.stringify(submissions))
    } catch {
      // ignore storage error
    }

    isSubmitting.value = false
    isSubmitted.value = true

    form.name = ''
    form.email = ''
    form.subject = ''
    form.message = ''
  }, 700)
}

function resetForm() {
  isSubmitted.value = false
}
</script>

<template>
  <!-- Success State -->
  <div v-if="isSubmitted" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-8 sm:p-12 text-center shadow-sm space-y-4">
    <div class="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
      <CheckCircle2 class="w-8 h-8" />
    </div>
    <div class="space-y-1">
      <h3 class="text-xl font-bold text-[#0A2540] dark:text-white">Message Dispatched</h3>
      <p class="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Your inquiry or citizen feedback has been recorded. Our support team will review and reply to your email.
      </p>
    </div>
    <div class="pt-2">
      <button
        @click="resetForm"
        class="px-5 py-2.5 bg-[#0D47A1] hover:bg-[#1565C0] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
        type="button"
      >
        Send Another Message
      </button>
    </div>
  </div>

  <!-- Form -->
  <form v-else @submit.prevent="submitForm" class="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-4">
    <h3 class="text-lg font-bold text-[#0A2540] dark:text-white">Send CamLife a Message</h3>

    <!-- Name -->
    <div class="space-y-1.5">
      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
      <input
        v-model="form.name"
        type="text"
        placeholder="Your name"
        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
      />
      <p v-if="errors.name" class="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle class="w-3.5 h-3.5" />{{ errors.name }}</p>
    </div>

    <!-- Email -->
    <div class="space-y-1.5">
      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Email Address *</label>
      <input
        v-model="form.email"
        type="email"
        placeholder="your.email@example.com"
        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
      />
      <p v-if="errors.email" class="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle class="w-3.5 h-3.5" />{{ errors.email }}</p>
    </div>

    <!-- Subject -->
    <div class="space-y-1.5">
      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Subject *</label>
      <input
        v-model="form.subject"
        type="text"
        placeholder="Inquiry subject (e.g. Hospital listing, Job post, Feedback)"
        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all"
      />
      <p v-if="errors.subject" class="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle class="w-3.5 h-3.5" />{{ errors.subject }}</p>
    </div>

    <!-- Message -->
    <div class="space-y-1.5">
      <label class="block text-xs font-bold text-slate-700 dark:text-slate-300">Message *</label>
      <textarea
        v-model="form.message"
        rows="4"
        placeholder="Describe your inquiry or suggestion..."
        class="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#0D47A1] transition-all resize-none"
      ></textarea>
      <p v-if="errors.message" class="mt-1 text-xs text-red-500 flex items-center gap-1"><AlertCircle class="w-3.5 h-3.5" />{{ errors.message }}</p>
    </div>

    <!-- Submit -->
    <button
      type="submit"
      :disabled="isSubmitting"
      class="w-full flex items-center justify-center gap-2 py-3 bg-[#0D47A1] hover:bg-[#1565C0] text-white font-bold rounded-xl shadow-xs transition-colors text-xs disabled:opacity-60"
    >
      <div v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <Send v-else class="w-4 h-4" />
      <span>{{ isSubmitting ? 'Sending Message...' : 'Send Message' }}</span>
    </button>
  </form>
</template>
