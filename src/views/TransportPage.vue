<script setup lang="ts">
import { ref, computed } from 'vue'
import { Clock, DollarSign, Info, Route, Compass } from 'lucide-vue-next'
import SectionHeader from '@/components/SectionHeader.vue'
import CategoryFilter from '@/components/CategoryFilter.vue'
import EmptyState from '@/components/EmptyState.vue'
import { useLanguage } from '@/composables/useLanguage'
import { getTransport } from '@/services/dataService'

const { t, localized } = useLanguage()

const allTransport = getTransport()
const activeCategory = ref('All')

const categories = computed(() => [
  { value: 'All', label: t('transport.categories.all') },
  { value: 'bus', label: t('transport.categories.bus') },
  { value: 'taxi', label: t('transport.categories.taxi') },
  { value: 'train', label: t('transport.categories.train') },
  { value: 'plane', label: t('transport.categories.plane') },
  { value: 'ferry', label: t('transport.categories.ferry') },
])

const filteredTransport = computed(() => {
  if (activeCategory.value === 'All') return allTransport
  return allTransport.filter(t => t.type === activeCategory.value)
})

const typeColors: Record<string, string> = {
  bus: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  taxi: 'bg-amber-50 text-amber-700 border-amber-200',
  train: 'bg-blue-50 text-blue-700 border-blue-200',
  plane: 'bg-purple-50 text-purple-700 border-purple-200',
  ferry: 'bg-cyan-50 text-cyan-700 border-cyan-200'
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Header -->
    <SectionHeader
      :title="t('transport.title')"
      :subtitle="t('transport.subtitle')"
      badge="Travel & Transit Guide"
    />

    <!-- Filter Control Panel -->
    <div class="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-subtle">
      <CategoryFilter :categories="categories" :active-category="activeCategory" @select="activeCategory = $event" />
    </div>

    <!-- Transport Options Grid -->
    <div v-if="filteredTransport.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="item in filteredTransport"
        :key="item.id"
        class="group bg-white rounded-2xl border border-slate-200/90 p-6 shadow-subtle hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
      >
        <div class="space-y-4">
          <div class="flex items-start justify-between">
            <span :class="['px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider rounded-full border', typeColors[item.type] || 'bg-slate-100 text-slate-700 border-slate-200']">
              {{ item.type }}
            </span>
            <div class="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-camlife-action">
              <Compass class="w-5 h-5" />
            </div>
          </div>

          <div>
            <h3 class="text-xl font-extrabold text-camlife-navy group-hover:text-camlife-action transition-colors">
              {{ localized(item.name, item.nameKh) }}
            </h3>
            <p class="text-xs text-slate-600 leading-relaxed mt-2">
              {{ localized(item.description, item.descriptionKh) }}
            </p>
          </div>

          <!-- Schedule & Route details grid -->
          <div class="space-y-2.5 pt-3 border-t border-slate-100 text-xs">
            <div v-if="item.route" class="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <Route class="w-4 h-4 text-camlife-action mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">{{ t('transport.route') }}</span>
                <span class="font-bold text-slate-800 block leading-snug">{{ item.route }}</span>
              </div>
            </div>

            <div v-if="item.schedule" class="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <Clock class="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">{{ t('transport.schedule') }}</span>
                <span class="font-bold text-slate-800 block leading-snug">{{ item.schedule }}</span>
              </div>
            </div>

            <div v-if="item.price" class="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <DollarSign class="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">{{ t('transport.price') }}</span>
                <span class="font-bold text-slate-800 block leading-snug">{{ item.price }}</span>
              </div>
            </div>

            <div v-if="item.usefulInformation" class="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
              <Info class="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <span class="font-bold text-slate-400 uppercase tracking-wider block text-[10px]">{{ t('transport.usefulInfo') }}</span>
                <span class="font-medium text-slate-700 block leading-relaxed">{{ localized(item.usefulInformation, item.usefulInformationKh) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <EmptyState v-else :message="t('transport.noResults')" />
  </div>
</template>
