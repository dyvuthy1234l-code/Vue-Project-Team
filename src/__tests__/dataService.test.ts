import { describe, it, expect } from 'vitest'
import {
  getHospitals,
  getHospitalById,
  getGovernmentServices,
  getGovernmentServiceById,
  getJobs,
  getJobById,
  getHomeServices,
  getTransport,
  getNews,
  getNewsById,
  getLocations,
  getEmergencyContacts,
  globalSearch
} from '../services/dataService'

describe('dataService', () => {
  describe('getHospitals', () => {
    it('should return an array of hospitals', () => {
      const hospitals = getHospitals()
      expect(Array.isArray(hospitals)).toBe(true)
      expect(hospitals.length).toBeGreaterThan(0)
    })

    it('each hospital should have required fields', () => {
      const hospitals = getHospitals()
      const hospital = hospitals[0]
      expect(hospital).toHaveProperty('id')
      expect(hospital).toHaveProperty('name')
      expect(hospital).toHaveProperty('category')
      expect(hospital).toHaveProperty('phone')
    })
  })

  describe('getHospitalById', () => {
    it('should find a hospital by ID', () => {
      const hospitals = getHospitals()
      const first = hospitals[0]
      const found = getHospitalById(first.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(first.id)
    })

    it('should return undefined for non-existent ID', () => {
      const found = getHospitalById('non-existent-id')
      expect(found).toBeUndefined()
    })
  })

  describe('getGovernmentServices', () => {
    it('should return an array', () => {
      const services = getGovernmentServices()
      expect(Array.isArray(services)).toBe(true)
      expect(services.length).toBeGreaterThan(0)
    })

    it('should find a service by ID', () => {
      const services = getGovernmentServices()
      const first = services[0]
      const found = getGovernmentServiceById(first.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(first.id)
    })
  })

  describe('getJobs', () => {
    it('should return an array of jobs', () => {
      const jobs = getJobs()
      expect(Array.isArray(jobs)).toBe(true)
      expect(jobs.length).toBeGreaterThan(0)
    })

    it('each job should have required fields', () => {
      const jobs = getJobs()
      const job = jobs[0]
      expect(job).toHaveProperty('id')
      expect(job).toHaveProperty('title')
      expect(job).toHaveProperty('company')
      expect(job).toHaveProperty('salary')
    })
  })

  describe('getJobById', () => {
    it('should find a job by ID', () => {
      const jobs = getJobs()
      const first = jobs[0]
      const found = getJobById(first.id)
      expect(found).toBeDefined()
      expect(found?.title).toBe(first.title)
    })
  })

  describe('getHomeServices', () => {
    it('should return an array', () => {
      expect(Array.isArray(getHomeServices())).toBe(true)
    })
  })

  describe('getTransport', () => {
    it('should return an array', () => {
      expect(Array.isArray(getTransport())).toBe(true)
    })
  })

  describe('getNews', () => {
    it('should return an array', () => {
      const news = getNews()
      expect(Array.isArray(news)).toBe(true)
      expect(news.length).toBeGreaterThan(0)
    })

    it('should find news by ID', () => {
      const news = getNews()
      const first = news[0]
      const found = getNewsById(first.id)
      expect(found).toBeDefined()
      expect(found?.id).toBe(first.id)
    })
  })

  describe('getLocations', () => {
    it('should return an array', () => {
      expect(Array.isArray(getLocations())).toBe(true)
    })
  })

  describe('getEmergencyContacts', () => {
    it('should return sorted by priority', () => {
      const contacts = getEmergencyContacts()
      expect(Array.isArray(contacts)).toBe(true)
      for (let i = 1; i < contacts.length; i++) {
        expect(contacts[i].priority).toBeGreaterThanOrEqual(contacts[i - 1].priority)
      }
    })
  })

  describe('globalSearch', () => {
    it('should return empty array for empty query', () => {
      const results = globalSearch('')
      expect(results).toEqual([])
    })

    it('should return empty array for whitespace query', () => {
      const results = globalSearch('   ')
      expect(results).toEqual([])
    })

    it('should find hospitals by name', () => {
      const hospitals = getHospitals()
      const name = hospitals[0].name.split(' ')[0]
      const results = globalSearch(name)
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(r => r.type === 'hospital')).toBe(true)
    })

    it('should find jobs by title', () => {
      const jobs = getJobs()
      const title = jobs[0].title.split(' ')[0]
      const results = globalSearch(title)
      expect(results.length).toBeGreaterThan(0)
    })

    it('should find items by Khmer keywords', () => {
      // Test Khmer hospital name
      const hospitalResults = globalSearch('កាល់ម៉ែត')
      expect(hospitalResults.length).toBeGreaterThan(0)
      expect(hospitalResults.some(r => r.id === 'calmette-hospital')).toBe(true)

      // Test Khmer government service
      const govResults = globalSearch('លិខិតឆ្លងដែន')
      expect(govResults.length).toBeGreaterThan(0)
      expect(govResults.some(r => r.type === 'government')).toBe(true)

      // Test Khmer home service
      const serviceResults = globalSearch('ជាងភ្លើង')
      expect(serviceResults.length).toBeGreaterThan(0)
      expect(serviceResults.some(r => r.type === 'home-service')).toBe(true)
    })

    it('should return results with required fields', () => {
      const results = globalSearch('hospital')
      if (results.length > 0) {
        const result = results[0]
        expect(result).toHaveProperty('id')
        expect(result).toHaveProperty('title')
        expect(result).toHaveProperty('description')
        expect(result).toHaveProperty('category')
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('route')
      }
    })
  })
})
