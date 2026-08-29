<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  HeartPulse,
  Building2,
  BriefcaseBusiness,
  Wrench,
  BusFront,
  Siren,
  Newspaper,
  MapPin,
  ArrowRight,
  ShieldCheck,
  Users,
  Sparkles,
  Clock3,
  Search,
  ChevronRight,
  CheckCircle2,
} from 'lucide-vue-next'

import GlobalSearch from '@/components/GlobalSearch.vue'
import ServiceCard from '@/components/ServiceCard.vue'
import NewsCard from '@/components/NewsCard.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getHospitals, getNews } from '@/services/dataService'

const router = useRouter()
const { t, localized } = useLanguage()

const popularTags = [
  'Hospital',
  'Passport',
  'Jobs',
  'Transport',
  'Electrician',
  'Emergency',
]

const quickHelpCategories = computed(() => [
  {
    icon: HeartPulse,
    label: t('nav.health'),
    description: 'Hospitals & clinics',
    path: '/health',
    iconClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
  },
  {
    icon: Building2,
    label: t('nav.government'),
    description: 'Government services',
    path: '/government',
    iconClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
  },
  {
    icon: BriefcaseBusiness,
    label: t('nav.jobs'),
    description: 'Jobs & opportunities',
    path: '/jobs',
    iconClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
  },
  {
    icon: Wrench,
    label: t('nav.homeServices'),
    description: 'Trusted local services',
    path: '/home-services',
    iconClass: 'text-amber-600',
    bgClass: 'bg-amber-50',
  },
  {
    icon: BusFront,
    label: t('nav.transport'),
    description: 'Travel around Cambodia',
    path: '/transport',
    iconClass: 'text-violet-600',
    bgClass: 'bg-violet-50',
  },
  {
    icon: Siren,
    label: t('nav.emergency'),
    description: 'Get urgent help',
    path: '/emergency',
    iconClass: 'text-red-600',
    bgClass: 'bg-red-50',
  },
  {
    icon: Newspaper,
    label: t('nav.news'),
    description: 'Latest information',
    path: '/news',
    iconClass: 'text-sky-600',
    bgClass: 'bg-sky-50',
  },
  {
    icon: MapPin,
    label: t('nav.locations'),
    description: 'Find places near you',
    path: '/locations',
    iconClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50',
  },
])

const popularServices = computed(() => {
  return getHospitals().slice(0, 3)
})

const newsItems = computed(() => {
  return getNews().slice(0, 3)
})

const valueBenefits = computed(() => [
  {
    icon: Users,
    title: t('home.whyCamlife.peopleFirst.title'),
    desc: t('home.whyCamlife.peopleFirst.desc'),
  },
  {
    icon: ShieldCheck,
    title: t('home.whyCamlife.trustedInfo.title'),
    desc: t('home.whyCamlife.trustedInfo.desc'),
  },
  {
    icon: Sparkles,
    title: t('home.whyCamlife.easierLife.title'),
    desc: t('home.whyCamlife.easierLife.desc'),
  },
  {
    icon: HeartPulse,
    title: t('home.whyCamlife.strongerCommunity.title'),
    desc: t('home.whyCamlife.strongerCommunity.desc'),
  },
])

function searchTag(tag: string) {
  const routeMap: Record<string, string> = {
    Hospital: '/health',
    Passport: '/government',
    Jobs: '/jobs',
    Transport: '/transport',
    Electrician: '/home-services',
    Emergency: '/emergency',
  }

  router.push(routeMap[tag] || '/health')
}
</script>

<template>
  <main class="bg-white text-slate-900 overflow-hidden">

    <!-- =========================================================
         HERO
    ========================================================== -->
    <section class="relative min-h-[680px] lg:min-h-[720px] flex items-center overflow-hidden">

      <!-- Background image -->
      <div class="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=2200&q=85"
          alt="Cambodia"
          class="w-full h-full object-cover"
        />

        <div
          class="absolute inset-0 bg-gradient-to-r
          from-[#061a33]/95
          via-[#0b3159]/85
          to-[#0b3159]/35"
        />

        <div
          class="absolute inset-0 bg-gradient-to-t
          from-[#061a33]/70
          via-transparent
          to-transparent"
        />
      </div>

      <!-- Decorative blur -->
      <div
        class="absolute -top-40 -right-40
        w-[500px] h-[500px]
        rounded-full
        bg-blue-400/20
        blur-[120px]"
      />

      <div
        class="absolute -bottom-40 -left-40
        w-[450px] h-[450px]
        rounded-full
        bg-cyan-400/10
        blur-[120px]"
      />

      <div
        class="relative z-10
        max-w-7xl mx-auto
        w-full
        px-5 sm:px-6 lg:px-8
        py-24 lg:py-32"
      >

        <div class="max-w-3xl">

          <!-- Badge -->
          <div
            class="inline-flex items-center gap-2
            rounded-full
            border border-white/20
            bg-white/10
            backdrop-blur-md
            px-4 py-2
            text-sm font-medium
            text-white
            mb-7"
          >
            <span class="text-base">🇰🇭</span>
            <span>Built for Cambodia</span>
          </div>

          <!-- Heading -->
          <h1
            class="
              text-4xl
              sm:text-5xl
              lg:text-7xl
              font-black
              leading-[1.05]
              tracking-[-0.03em]
              text-white
            "
          >
            Everything You Need
            <span class="block text-blue-200">
              for Everyday Life.
            </span>
          </h1>

          <!-- Khmer -->
          <p
            class="
              mt-6
              text-lg
              sm:text-xl
              lg:text-2xl
              font-khmer
              text-blue-100
              leading-relaxed
            "
          >
            ជួយឱ្យជីវិតប្រចាំថ្ងៃរបស់ប្រជាជនកម្ពុជាកាន់តែងាយស្រួល
          </p>

          <!-- Description -->
          <p
            class="
              mt-4
              max-w-2xl
              text-sm
              sm:text-base
              leading-7
              text-slate-200
            "
          >
            Find essential services, useful information, and opportunities
            in one simple place.
          </p>

          <!-- Search -->
          <div class="mt-9 max-w-2xl">
            <GlobalSearch
              :placeholder="t('home.hero.searchPlaceholder')"
              large
            />
          </div>

          <!-- Popular -->
          <div class="mt-5 flex flex-wrap items-center gap-2">
            <span class="text-xs font-medium text-slate-300 mr-1">
              Popular:
            </span>

            <button
              v-for="tag in popularTags"
              :key="tag"
              type="button"
              @click="searchTag(tag)"
              class="
                rounded-full
                border border-white/15
                bg-white/10
                px-3.5 py-1.5
                text-xs
                font-medium
                text-white
                backdrop-blur-md
                transition
                hover:bg-white/20
                hover:border-white/30
              "
            >
              {{ tag }}
            </button>
          </div>

          <!-- Hero actions -->
          <div class="mt-8 flex flex-wrap gap-3">

            <router-link
              to="/health"
              class="
                inline-flex items-center gap-2
                rounded-xl
                bg-[#1677C8]
                px-6 py-3.5
                text-sm font-bold text-white
                shadow-lg shadow-blue-950/20
                transition
                hover:-translate-y-0.5
                hover:bg-[#0f68b4]
              "
            >
              <span>{{ t('home.hero.exploreServices') }}</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>

            <router-link
              to="/about"
              class="
                inline-flex items-center gap-2
                rounded-xl
                border border-white/20
                bg-white/10
                backdrop-blur-md
                px-6 py-3.5
                text-sm font-bold text-white
                transition
                hover:bg-white/20
              "
            >
              {{ t('home.hero.learnMore') }}
            </router-link>

          </div>

        </div>
      </div>

      <!-- Bottom fade -->
      <div
        class="absolute bottom-0 left-0 right-0 h-24
        bg-gradient-to-t from-white to-transparent"
      />
    </section>


    <!-- =========================================================
         QUICK SERVICES
    ========================================================== -->
    <section class="relative z-20 -mt-12">
      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div
          class="
            rounded-3xl
            border border-slate-200
            bg-white
            p-4 sm:p-6
            shadow-[0_20px_60px_rgba(15,23,42,0.10)]
          "
        >

          <div
            class="
              grid
              grid-cols-2
              sm:grid-cols-4
              lg:grid-cols-8
              gap-2
              sm:gap-3
            "
          >

            <router-link
              v-for="category in quickHelpCategories"
              :key="category.path"
              :to="category.path"
              class="
                group
                rounded-2xl
                p-3 sm:p-4
                text-center
                transition
                hover:bg-slate-50
              "
            >

              <div
                :class="[
                  'mx-auto w-12 h-12 sm:w-14 sm:h-14',
                  'rounded-2xl',
                  'flex items-center justify-center',
                  'transition duration-300',
                  'group-hover:-translate-y-1 group-hover:scale-105',
                  category.bgClass,
                  category.iconClass,
                ]"
              >
                <component
                  :is="category.icon"
                  class="w-6 h-6 sm:w-7 sm:h-7"
                  :stroke-width="1.8"
                />
              </div>

              <p
                class="
                  mt-3
                  text-xs sm:text-sm
                  font-bold
                  text-slate-800
                  group-hover:text-[#1677C8]
                "
              >
                {{ category.label }}
              </p>

              <p
                class="
                  hidden
                  lg:block
                  mt-1
                  text-[10px]
                  leading-4
                  text-slate-400
                "
              >
                {{ category.description }}
              </p>

            </router-link>

          </div>
        </div>
      </div>
    </section>


    <!-- =========================================================
         POPULAR SERVICES
    ========================================================== -->
    <section class="py-24 sm:py-28">
      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div
          class="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-5
            mb-10
          "
        >

          <div>
            <div
              class="
                inline-flex items-center gap-2
                text-xs font-bold
                uppercase tracking-[0.18em]
                text-[#1677C8]
                mb-3
              "
            >
              <Sparkles class="w-4 h-4" />
              Recommended
            </div>

            <h2
              class="
                text-3xl
                sm:text-4xl
                font-black
                tracking-tight
                text-[#0F2747]
              "
            >
              {{ t('home.popularServices') }}
            </h2>

            <p class="mt-3 max-w-xl text-sm sm:text-base text-slate-500">
              {{ t('home.popularServicesSubtitle') }}
            </p>
          </div>

          <router-link
            to="/health"
            class="
              group
              inline-flex items-center gap-2
              text-sm font-bold
              text-[#1677C8]
              hover:text-[#0f68b4]
            "
          >
            {{ t('home.viewAll') }}
            <ArrowRight
              class="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </router-link>

        </div>


        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

          <ServiceCard
            v-for="hospital in popularServices"
            :key="hospital.id"
            :title="localized(hospital.name, hospital.nameKh)"
            :category="hospital.category"
            :rating="hospital.rating"
            :reviews="hospital.reviews"
            :location="hospital.location"
            :phone="hospital.phone"
            :description="localized(
              hospital.description,
              hospital.descriptionKh
            )"
            :opening-hours="hospital.openingHours"
            :image="hospital.image"
            :link-to="'/health/' + hospital.id"
          />

        </div>
      </div>
    </section>


    <!-- =========================================================
         WHY CAMLIFE
    ========================================================== -->
    <section class="bg-[#F5F8FC] py-24 sm:py-28">

      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div class="max-w-2xl mb-12">
          <div
            class="
              inline-flex items-center gap-2
              text-xs font-bold
              uppercase tracking-[0.18em]
              text-[#1677C8]
              mb-3
            "
          >
            <ShieldCheck class="w-4 h-4" />
            Why CamLife
          </div>

          <h2
            class="
              text-3xl
              sm:text-4xl
              font-black
              tracking-tight
              text-[#0F2747]
            "
          >
            {{ t('home.whyCamlifeTitle') }}
          </h2>

          <p class="mt-3 text-sm sm:text-base text-slate-500 leading-7">
            {{ t('home.whyCamlifeSubtitle') }}
          </p>
        </div>


        <div
          class="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
          "
        >

          <div
            v-for="(benefit, index) in valueBenefits"
            :key="benefit.title"
            class="
              group
              rounded-3xl
              border border-slate-200/80
              bg-white
              p-6
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
              hover:shadow-slate-900/5
            "
          >

            <div
              class="
                w-12 h-12
                rounded-2xl
                bg-blue-50
                text-[#1677C8]
                flex items-center justify-center
                transition
                group-hover:bg-[#1677C8]
                group-hover:text-white
              "
            >
              <component
                :is="benefit.icon"
                class="w-6 h-6"
                :stroke-width="1.8"
              />
            </div>

            <h3
              class="
                mt-6
                text-lg
                font-extrabold
                text-[#0F2747]
              "
            >
              {{ benefit.title }}
            </h3>

            <p
              class="
                mt-3
                text-sm
                leading-6
                text-slate-500
              "
            >
              {{ benefit.desc }}
            </p>

            <div
              class="
                mt-6
                flex items-center gap-2
                text-xs font-semibold
                text-emerald-600
              "
            >
              <CheckCircle2 class="w-4 h-4" />
              Simple & useful
            </div>

          </div>

        </div>
      </div>
    </section>


    <!-- =========================================================
         NEWS
    ========================================================== -->
    <section class="py-24 sm:py-28">

      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div
          class="
            flex
            flex-col
            sm:flex-row
            sm:items-end
            sm:justify-between
            gap-5
            mb-10
          "
        >

          <div>

            <div
              class="
                inline-flex items-center gap-2
                text-xs font-bold
                uppercase tracking-[0.18em]
                text-[#1677C8]
                mb-3
              "
            >
              <Newspaper class="w-4 h-4" />
              Stay informed
            </div>

            <h2
              class="
                text-3xl
                sm:text-4xl
                font-black
                tracking-tight
                text-[#0F2747]
              "
            >
              {{ t('home.latestNews') }}
            </h2>

            <p class="mt-3 text-sm sm:text-base text-slate-500">
              {{ t('home.latestNewsSubtitle') }}
            </p>

          </div>

          <router-link
            to="/news"
            class="
              group
              inline-flex items-center gap-2
              text-sm font-bold
              text-[#1677C8]
            "
          >
            {{ t('home.viewAll') }}

            <ArrowRight
              class="w-4 h-4 transition-transform group-hover:translate-x-1"
            />
          </router-link>

        </div>


        <div
          v-if="newsItems.length"
          class="grid grid-cols-1 md:grid-cols-3 gap-6"
        >

          <NewsCard
            v-if="newsItems[0]"
            :news="newsItems[0]"
            featured
          />

          <NewsCard
            v-if="newsItems[1]"
            :news="newsItems[1]"
          />

          <NewsCard
            v-if="newsItems[2]"
            :news="newsItems[2]"
          />

        </div>

        <div
          v-else
          class="
            rounded-3xl
            border border-dashed border-slate-300
            p-12
            text-center
            text-slate-500
          "
        >
          <Newspaper class="mx-auto w-10 h-10 mb-3 text-slate-300" />
          <p class="font-semibold">
            No news available right now.
          </p>
        </div>

      </div>
    </section>


    <!-- =========================================================
         EMERGENCY STRIP
    ========================================================== -->
    <section class="pb-24">

      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div
          class="
            relative
            overflow-hidden
            rounded-3xl
            bg-[#0F2747]
            px-6 py-8
            sm:px-10 sm:py-10
          "
        >

          <div
            class="
              absolute
              -right-20
              -top-20
              w-64 h-64
              rounded-full
              bg-red-500/10
              blur-3xl
            "
          />

          <div
            class="
              relative z-10
              flex
              flex-col
              lg:flex-row
              lg:items-center
              lg:justify-between
              gap-6
            "
          >

            <div class="flex items-start gap-4">

              <div
                class="
                  shrink-0
                  w-12 h-12
                  rounded-2xl
                  bg-red-500/15
                  text-red-400
                  flex items-center justify-center
                "
              >
                <Siren class="w-6 h-6" />
              </div>

              <div>
                <p
                  class="
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.18em]
                    text-red-300
                  "
                >
                  Emergency
                </p>

                <h3
                  class="
                    mt-1
                    text-xl
                    sm:text-2xl
                    font-black
                    text-white
                  "
                >
                  Need urgent help?
                </h3>

                <p
                  class="
                    mt-1
                    text-sm
                    text-slate-300
                  "
                >
                  Quickly access important emergency contacts.
                </p>
              </div>

            </div>


            <router-link
              to="/emergency"
              class="
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-red-500
                px-6 py-3.5
                text-sm
                font-bold
                text-white
                transition
                hover:bg-red-600
                hover:-translate-y-0.5
              "
            >
              Emergency Contacts
              <ArrowRight class="w-4 h-4" />
            </router-link>

          </div>

        </div>

      </div>

    </section>


    <!-- =========================================================
         FINAL CTA
    ========================================================== -->
    <section class="pb-24">

      <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        <div
          class="
            relative
            overflow-hidden
            rounded-[2rem]
            bg-gradient-to-br
            from-[#0D315B]
            via-[#123F72]
            to-[#0A2747]
            px-7 py-12
            sm:px-12 sm:py-16
          "
        >

          <!-- Decorative shapes -->
          <div
            class="
              absolute
              -right-24
              -bottom-32
              w-96 h-96
              rounded-full
              border-[50px]
              border-white/5
            "
          />

          <div
            class="
              absolute
              right-20
              top-10
              w-20 h-20
              rounded-full
              bg-blue-300/10
              blur-2xl
            "
          />

          <div class="relative z-10 max-w-3xl">

            <div
              class="
                inline-flex items-center gap-2
                rounded-full
                border border-white/15
                bg-white/10
                px-4 py-2
                text-xs
                font-bold
                text-blue-100
              "
            >
              🇰🇭 For a Better Cambodia
            </div>

            <h2
              class="
                mt-6
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-black
                tracking-tight
                leading-tight
                text-white
              "
            >
              {{ t('home.ctaTitle') }}
            </h2>

            <p
              class="
                mt-5
                max-w-2xl
                text-sm
                sm:text-base
                leading-7
                text-blue-100/80
              "
            >
              {{ t('home.ctaDesc') }}
            </p>

            <div class="mt-8 flex flex-wrap gap-3">

              <router-link
                to="/health"
                class="
                  inline-flex items-center gap-2
                  rounded-xl
                  bg-white
                  px-6 py-3.5
                  text-sm
                  font-bold
                  text-[#0F2747]
                  transition
                  hover:bg-blue-50
                  hover:-translate-y-0.5
                "
              >
                {{ t('home.hero.exploreServices') }}
                <ArrowRight class="w-4 h-4 text-[#1677C8]" />
              </router-link>

              <router-link
                to="/about"
                class="
                  inline-flex items-center gap-2
                  rounded-xl
                  border border-white/20
                  bg-white/10
                  px-6 py-3.5
                  text-sm
                  font-bold
                  text-white
                  backdrop-blur-md
                  transition
                  hover:bg-white/20
                "
              >
                Learn More
              </router-link>

            </div>

          </div>

        </div>

      </div>

    </section>

  </main>
</template>
