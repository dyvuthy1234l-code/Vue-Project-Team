<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Calendar,
  ArrowLeft,
  Clock,
  Printer,
  ShieldCheck,
  Share2,
  Eye,
  Bookmark,
  BookmarkCheck,
  Volume2,
  VolumeX,
  Check,
  Tag,
  Flame,
  UserCheck
} from 'lucide-vue-next'
import NotFoundState from '@/components/NotFoundState.vue'
import ShareButtons from '@/components/ShareButtons.vue'
import NewsCard from '@/components/NewsCard.vue'
import LazyImage from '@/components/LazyImage.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getNewsById, getNews } from '@/services/dataService'
import { usePageMeta } from '@/composables/usePageMeta'

const route = useRoute()
const { localized, currentLanguage } = useLanguage()

const defaultCategoryImages: Record<string, string> = {
  National: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
  Government: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
  Health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  Infrastructure: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80',
  Traffic: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=1200&q=80',
  Events: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80',
  Economy: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80'
}

const article = computed(() => {
  const id = route.params.id as string
  return getNewsById(id)
})

const coverImage = computed(() => {
  if (!article.value) return ''
  return article.value.image && article.value.image.trim() !== ''
    ? article.value.image
    : (defaultCategoryImages[article.value.category] || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80')
})

usePageMeta({
  title: computed(() => article.value ? localized(article.value.title, article.value.titleKh) : 'News Article'),
  description: computed(() => article.value ? localized(article.value.description, article.value.descriptionKh) : '')
})

const relatedNews = computed(() => {
  if (!article.value) return []
  return getNews()
    .filter(n => n.id !== article.value?.id)
    .slice(0, 3)
})

// Reading controls
const articleFontSize = ref<'normal' | 'large' | 'xlarge'>('normal')
const isAudioPlaying = ref(false)
const isBookmarked = ref(false)

function toggleBookmark() {
  isBookmarked.value = !isBookmarked.value
}

function toggleAudioReader() {
  isAudioPlaying.value = !isAudioPlaying.value
}

function printBulletin() {
  window.print()
}

// Copy link notification
const isLinkCopied = ref(false)
function copyLink() {
  navigator.clipboard.writeText(window.location.href)
  isLinkCopied.value = true
  setTimeout(() => {
    isLinkCopied.value = false
  }, 2000)
}
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 font-khmer">
    <div v-if="article" class="space-y-6">



      <!-- Back Link and Article Quick Actions -->
      <div class="flex items-center justify-between gap-2 border-b border-slate-200 pb-4">
        <router-link
          to="/news"
          class="inline-flex items-center gap-1.5 text-xs font-black text-slate-600 hover:text-[#0D47A1] transition-colors group"
        >
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{{ currentLanguage === 'kh' ? 'ត្រឡប់ទៅទំព័រព័ត៌មានវិញ' : 'Back to News Feed' }}</span>
        </router-link>

        <div class="flex items-center gap-2">
          <!-- Text Size Adjuster -->
          <div class="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              @click="articleFontSize = 'normal'"
              :class="['px-2 py-0.5 rounded', articleFontSize === 'normal' ? 'bg-white text-[#0D47A1] shadow-2xs' : 'text-slate-500']"
              title="Normal font size"
            >
              A
            </button>
            <button
              @click="articleFontSize = 'large'"
              :class="['px-2 py-0.5 rounded', articleFontSize === 'large' ? 'bg-white text-[#0D47A1] shadow-2xs font-bold' : 'text-slate-500']"
              title="Large font size"
            >
              A+
            </button>
          </div>

          <!-- Bookmark Article -->
          <button
            @click="toggleBookmark"
            type="button"
            :class="['p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1', isBookmarked ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50']"
            :title="isBookmarked ? 'Saved to bookmarks' : 'Bookmark this article'"
          >
            <BookmarkCheck v-if="isBookmarked" class="w-4 h-4 text-amber-600" />
            <Bookmark v-else class="w-4 h-4" />
          </button>

          <!-- Print Article -->
          <button
            @click="printBulletin"
            type="button"
            class="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            title="Print Article"
          >
            <Printer class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Real Newspaper Article Header -->
      <header class="space-y-4">
        <!-- Category & Verification Badges -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex items-center gap-2 flex-wrap">
            <span class="px-3 py-1 bg-[#0D47A1] text-white text-xs font-black rounded-xl uppercase tracking-wider shadow-2xs">
              {{ article.category }}
            </span>

            <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" />
              <span>សេចក្តីប្រកាសផ្លូវការ</span>
            </span>

            <span v-if="article.breaking" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-black bg-rose-600 text-white uppercase animate-pulse">
              ● ទាន់ហេតុការណ៍
            </span>
          </div>

          <span class="text-xs font-mono font-bold text-slate-400">
            ID: CL-{{ article.id.toUpperCase().slice(0, 10) }}
          </span>
        </div>

        <!-- Main Headline -->
        <h1 class="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-[1.3]">
          {{ localized(article.title, article.titleKh) }}
        </h1>

        <!-- Secondary Title (English or Khmer subtitle) -->
        <p v-if="article.titleKh && currentLanguage === 'en'" class="text-base font-khmer text-slate-500">
          {{ article.titleKh }}
        </p>

        <!-- Reporter Byline & Metadata Bar -->
        <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <!-- Author Info -->
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 text-[#0D47A1] font-black text-sm flex items-center justify-center shadow-xs">
              {{ (article.author || 'ក').slice(0, 1) }}
            </div>
            <div>
              <p class="font-black text-xs text-slate-900">
                {{ article.author || 'ការិយាល័យនិពន្ធ CamLife News' }}
              </p>
              <p class="text-[11px] text-slate-500">
                {{ article.authorRole || article.source }}
              </p>
            </div>
          </div>

          <!-- Date & Views Stats -->
          <div class="flex items-center gap-3 text-xs font-bold text-slate-500 flex-wrap">
            <span class="flex items-center gap-1">
              <Calendar class="w-3.5 h-3.5 text-[#0D47A1]" />
              <span>{{ article.date }}</span>
            </span>
            <span>·</span>
            <span class="flex items-center gap-1">
              <Clock class="w-3.5 h-3.5 text-amber-500" />
              <span>{{ article.readTime || '3 នាទី' }}</span>
            </span>
            <span>·</span>
            <span class="flex items-center gap-1 text-slate-700">
              <Eye class="w-3.5 h-3.5 text-blue-500" />
              <span>{{ Number(article.views || 18450).toLocaleString() }} មើល</span>
            </span>
          </div>
        </div>

        <!-- Audio Reader Bar (Simulation) -->
        <div class="flex items-center justify-between p-3 rounded-2xl bg-blue-50/70 border border-blue-100 text-xs">
          <div class="flex items-center gap-2.5">
            <button
              @click="toggleAudioReader"
              type="button"
              class="w-8 h-8 rounded-full bg-[#0D47A1] hover:bg-[#1565C0] text-white flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            >
              <VolumeX v-if="isAudioPlaying" class="w-4 h-4" />
              <Volume2 v-else class="w-4 h-4" />
            </button>
            <div>
              <p class="font-black text-slate-900 text-xs">
                {{ isAudioPlaying ? 'កំពុងអានអត្ថបទជាសំឡេង (AI Reader)' : 'ស្តាប់ការអានព័ត៌មានជាសំឡេង' }}
              </p>
              <p class="text-[10px] text-slate-500">សំឡេងភាសាខ្មែរស្តង់ដារ · រយៈពេល ៣ នាទី</p>
            </div>
          </div>

          <span v-if="isAudioPlaying" class="px-2 py-0.5 rounded bg-blue-600 text-white font-mono text-[10px] font-bold animate-pulse">
            01:24 / 03:15
          </span>
        </div>
      </header>

      <!-- Large Main Feature Image with Caption -->
      <figure class="space-y-2">
        <div class="relative rounded-3xl overflow-hidden shadow-md aspect-[16/9] bg-slate-900">
          <LazyImage
            :src="coverImage"
            :alt="localized(article.title, article.titleKh)"
            img-class="w-full h-full object-cover"
            class="w-full h-full"
          />
        </div>
        <figcaption class="text-center text-xs text-slate-400 italic">
          រូបភាព៖ សារព័ត៌មានរដ្ឋបាលជាតិ CamLife Media / ប្រភពដើម៖ {{ article.source }}
        </figcaption>
      </figure>

      <!-- Article Reading Body -->
      <article class="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
        <!-- Lead summary callout -->
        <div class="text-base sm:text-lg font-bold text-slate-800 leading-relaxed border-l-4 border-[#0D47A1] pl-4 py-2 bg-blue-50/50 rounded-r-2xl">
          {{ localized(article.description, article.descriptionKh) }}
        </div>

        <!-- Body paragraphs with dynamic font size -->
        <div
          :class="[
            'space-y-4 pt-2 leading-relaxed text-slate-700',
            articleFontSize === 'large' ? 'text-base sm:text-lg leading-loose' :
            articleFontSize === 'xlarge' ? 'text-lg sm:text-xl leading-loose' :
            'text-sm sm:text-base leading-relaxed'
          ]"
        >
          <p v-for="(para, pIdx) in localized(article.content, article.contentKh).split('\n\n')" :key="pIdx" class="indent-4">
            {{ para }}
          </p>
        </div>

        <!-- Tags List -->
        <div v-if="article.tags && article.tags.length > 0" class="pt-6 border-t border-slate-100 space-y-2">
          <div class="flex items-center gap-1.5 text-xs font-bold text-slate-500">
            <Tag class="w-3.5 h-3.5 text-[#0D47A1]" />
            <span>{{ currentLanguage === 'kh' ? 'ប្រធានបទពាក់ព័ន្ធ' : 'Article Tags' }}:</span>
          </div>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in article.tags"
              :key="tag"
              class="px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              #{{ tag }}
            </span>
          </div>
        </div>

        <!-- Social Share & Verification Footer -->
        <div class="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-2.5">
            <span class="text-xs font-bold text-slate-600">
              {{ currentLanguage === 'kh' ? 'ចែករំលែកព័ត៌មាននេះ៖' : 'Share this bulletin:' }}
            </span>
            <button
              @click="copyLink"
              class="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Check v-if="isLinkCopied" class="w-3.5 h-3.5 text-emerald-600" />
              <Share2 v-else class="w-3.5 h-3.5 text-[#0D47A1]" />
              <span>{{ isLinkCopied ? 'បានចម្លង Link!' : 'Copy Link' }}</span>
            </button>
          </div>

          <ShareButtons :title="localized(article.title, article.titleKh)" />
        </div>
      </article>

      <!-- Author Reporter Bio Card -->
      <div v-if="article.author" class="bg-white rounded-3xl border border-slate-200/90 p-6 flex items-center gap-4 shadow-xs">
        <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0D47A1] to-blue-500 text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm">
          {{ article.author.slice(0, 1) }}
        </div>
        <div class="space-y-1">
          <div class="flex items-center gap-1.5">
            <h4 class="font-black text-sm text-slate-900">{{ article.author }}</h4>
            <UserCheck class="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <p class="text-xs text-[#0D47A1] font-bold">{{ article.authorRole || article.source }}</p>
          <p class="text-xs text-slate-500">អ្នកកាសែត និងអ្នករាយការណ៍ព័ត៌មានផ្លូវការប្រចាំ CamLife News Portal ផ្តោតលើការអភិវឌ្ឍសេដ្ឋកិច្ចសង្គមជាតិ។</p>
        </div>
      </div>

      <!-- Related News Section -->
      <section class="pt-6 space-y-4">
        <div class="flex items-center justify-between pb-2 border-b-2 border-[#0D47A1]">
          <h2 class="text-lg font-black text-slate-900 flex items-center gap-2">
            <Flame class="w-5 h-5 text-[#0D47A1]" />
            <span>{{ currentLanguage === 'kh' ? 'ព័ត៌មានជាតិពាក់ព័ន្ធផ្សេងទៀត' : 'Related Civic Bulletins' }}</span>
          </h2>
          <router-link to="/news" class="text-xs font-black text-[#0D47A1] hover:underline">
            {{ currentLanguage === 'kh' ? 'មើលទាំងអស់ →' : 'View all →' }}
          </router-link>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NewsCard v-for="item in relatedNews" :key="item.id" :news="item" />
        </div>
      </section>

    </div>

    <!-- 404 If Not Found -->
    <NotFoundState
      v-else
      message="News Article Not Found"
      subtitle="The bulletin you are looking for does not exist or has been archived."
      back-link="/news"
      back-text="Back to News"
    />
  </div>
</template>
