import { nextTick, onMounted, onUnmounted, watch, type Ref } from 'vue'

let observer: IntersectionObserver | null = null
let mutationObserver: MutationObserver | null = null
let debounceTimer: ReturnType<typeof setTimeout> | null = null

function handleIntersect(entries: IntersectionObserverEntry[]) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('reveal-in')
      entry.target.classList.remove('reveal-out')
    } else {
      // Only apply reveal-out if the element was already revealed and scrolled away
      if (entry.target.classList.contains('reveal-in')) {
        entry.target.classList.remove('reveal-in')
        entry.target.classList.add('reveal-out')
      }
    }
  })
}

export function refreshScrollReveal() {
  if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return

  if (!observer) {
    observer = new IntersectionObserver(handleIntersect, {
      threshold: 0.05,
      rootMargin: '0px 0px -25px 0px'
    })
  }

  const elements = document.querySelectorAll('.scroll-reveal')
  elements.forEach((el) => {
    // If element is already in viewport on load, reveal immediately
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('reveal-in')
      el.classList.remove('reveal-out')
    }
    observer?.observe(el)
  })
}

export function useGlobalScrollReveal() {
  onMounted(async () => {
    await nextTick()
    refreshScrollReveal()

    // Observe dynamic DOM changes (e.g. view switching, tabs, filtering)
    if (typeof MutationObserver !== 'undefined' && !mutationObserver) {
      mutationObserver = new MutationObserver(() => {
        if (debounceTimer) clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
          refreshScrollReveal()
        }, 100)
      })

      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      })
    }
  })

  onUnmounted(() => {
    if (mutationObserver) {
      mutationObserver.disconnect()
      mutationObserver = null
    }
    if (observer) {
      observer.disconnect()
      observer = null
    }
  })
}

/**
 * Page-level helper to trigger refresh on reactive dependency change (e.g. activeTab, searchQuery)
 */
export function useScrollReveal(trigger?: Ref<any>) {
  onMounted(async () => {
    await nextTick()
    refreshScrollReveal()
  })

  if (trigger) {
    watch(trigger, async () => {
      await nextTick()
      refreshScrollReveal()
    }, { deep: true })
  }

  return { refreshScrollReveal }
}
