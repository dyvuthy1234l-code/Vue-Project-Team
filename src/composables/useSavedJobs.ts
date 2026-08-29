import { ref, watch } from 'vue'

const STORAGE_KEY = 'camlife-saved-jobs'

function loadSavedJobs(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

const savedJobIds = ref<string[]>(loadSavedJobs())

watch(savedJobIds, (newVal) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newVal))
}, { deep: true })

export function useSavedJobs() {
  function isJobSaved(jobId: string): boolean {
    return savedJobIds.value.includes(jobId)
  }

  function toggleSaveJob(jobId: string) {
    const index = savedJobIds.value.indexOf(jobId)
    if (index > -1) {
      savedJobIds.value.splice(index, 1)
    } else {
      savedJobIds.value.push(jobId)
    }
  }

  function saveJob(jobId: string) {
    if (!isJobSaved(jobId)) {
      savedJobIds.value.push(jobId)
    }
  }

  function unsaveJob(jobId: string) {
    const index = savedJobIds.value.indexOf(jobId)
    if (index > -1) {
      savedJobIds.value.splice(index, 1)
    }
  }

  return {
    savedJobIds,
    isJobSaved,
    toggleSaveJob,
    saveJob,
    unsaveJob
  }
}
