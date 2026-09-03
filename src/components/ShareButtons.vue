<script setup lang="ts">
import { ref, computed } from 'vue'
import { Share2, Facebook, MessageCircle, Link2, Check } from 'lucide-vue-next'

const props = defineProps<{
  title: string
  url?: string
}>()

const copied = ref(false)

const shareUrl = computed(() => props.url || window.location.href)

const facebookUrl = computed(() =>
  `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl.value)}`
)

const telegramUrl = computed(() =>
  `https://t.me/share/url?url=${encodeURIComponent(shareUrl.value)}&text=${encodeURIComponent(props.title)}`
)

async function copyLink() {
  try {
    await navigator.clipboard.writeText(shareUrl.value)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  } catch {
    // fallback
    const input = document.createElement('input')
    input.value = shareUrl.value
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2000)
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <span class="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
      <Share2 class="w-3.5 h-3.5" />
      Share
    </span>

    <a
      :href="facebookUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
      aria-label="Share on Facebook"
    >
      <Facebook class="w-4 h-4" />
    </a>

    <a
      :href="telegramUrl"
      target="_blank"
      rel="noopener noreferrer"
      class="p-2 rounded-xl bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors"
      aria-label="Share on Telegram"
    >
      <MessageCircle class="w-4 h-4" />
    </a>

    <button
      @click="copyLink"
      class="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
      :aria-label="copied ? 'Link copied' : 'Copy link'"
      type="button"
    >
      <Check v-if="copied" class="w-4 h-4 text-emerald-500" />
      <Link2 v-else class="w-4 h-4" />
    </button>
  </div>
</template>
