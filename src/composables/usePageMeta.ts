import { watch, onMounted, isRef, type Ref } from 'vue'

interface PageMetaOptions {
  title: string | Ref<string>
  description?: string | Ref<string>
  ogImage?: string | Ref<string>
}

function getVal(val: string | Ref<string> | undefined): string | undefined {
  if (val === undefined) return undefined
  return isRef(val) ? val.value : val
}

function setMeta(nameOrProp: string, content: string) {
  const isOg = nameOrProp.startsWith('og:')
  const selector = isOg
    ? `meta[property="${nameOrProp}"]`
    : `meta[name="${nameOrProp}"]`

  let el = document.querySelector(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(isOg ? 'property' : 'name', nameOrProp)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function apply(options: PageMetaOptions) {
  const title = getVal(options.title)
  if (title) {
    document.title = `${title} — CamLife`
    setMeta('og:title', title)
  }

  const desc = getVal(options.description)
  if (desc) {
    setMeta('description', desc)
    setMeta('og:description', desc)
  }

  const img = getVal(options.ogImage)
  if (img) {
    setMeta('og:image', img)
  }

  setMeta('og:type', 'website')
  setMeta('og:url', window.location.href)
}

export function usePageMeta(options: PageMetaOptions) {
  onMounted(() => apply(options))

  // Watch reactive values
  const watchTargets = [options.title, options.description, options.ogImage].filter(isRef) as Ref[]
  if (watchTargets.length > 0) {
    watch(watchTargets, () => apply(options))
  }
}
