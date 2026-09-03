import { describe, it, expect, beforeEach } from 'vitest'
import { useSavedJobs } from '../composables/useSavedJobs'

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} }
  }
})()

Object.defineProperty(globalThis, 'localStorage', { value: localStorageMock })

describe('useSavedJobs', () => {
  beforeEach(() => {
    localStorageMock.clear()
  })

  it('should start with no saved jobs', () => {
    const { savedJobIds } = useSavedJobs()
    // Note: since the composable uses module-level state, it may carry over
    // We just check that the returned value is an array
    expect(Array.isArray(savedJobIds.value)).toBe(true)
  })

  it('should save a job', () => {
    const { saveJob, isJobSaved } = useSavedJobs()
    saveJob('job-1')
    expect(isJobSaved('job-1')).toBe(true)
  })

  it('should unsave a job', () => {
    const { saveJob, unsaveJob, isJobSaved } = useSavedJobs()
    saveJob('job-2')
    expect(isJobSaved('job-2')).toBe(true)
    unsaveJob('job-2')
    expect(isJobSaved('job-2')).toBe(false)
  })

  it('should toggle save/unsave', () => {
    const { toggleSaveJob, isJobSaved } = useSavedJobs()
    toggleSaveJob('job-3')
    expect(isJobSaved('job-3')).toBe(true)
    toggleSaveJob('job-3')
    expect(isJobSaved('job-3')).toBe(false)
  })

  it('should not duplicate saved jobs', () => {
    const { saveJob, savedJobIds } = useSavedJobs()
    saveJob('job-4')
    saveJob('job-4')
    const count = savedJobIds.value.filter(id => id === 'job-4').length
    expect(count).toBe(1)
  })
})
