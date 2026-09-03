import type { Hospital, GovernmentService, Job, HomeService, Transport, NewsItem, LocationItem, EmergencyContact, SearchResult } from '@/types'
import hospitalsData from '@/data/hospitals.json'
import governmentData from '@/data/government.json'
import jobsData from '@/data/jobs.json'
import homeServicesData from '@/data/home-services.json'
import transportData from '@/data/transport.json'
import newsData from '@/data/news.json'
import locationsData from '@/data/locations.json'
import emergencyData from '@/data/emergency.json'

const hospitals = hospitalsData as Hospital[]
const governmentServices = governmentData as GovernmentService[]
const jobs = jobsData as Job[]
const homeServices = homeServicesData as HomeService[]
const transport = transportData as Transport[]
const news = newsData as NewsItem[]
const locations = locationsData as LocationItem[]
const emergencyContacts = emergencyData as EmergencyContact[]

export function getHospitals(): Hospital[] {
  return hospitals
}

export function getHospitalById(id: string): Hospital | undefined {
  return hospitals.find(h => h.id === id)
}

export function getGovernmentServices(): GovernmentService[] {
  return governmentServices
}

export function getGovernmentServiceById(id: string): GovernmentService | undefined {
  return governmentServices.find(s => s.id === id)
}

export function getJobs(): Job[] {
  return jobs
}

export function getJobById(id: string): Job | undefined {
  return jobs.find(j => j.id === id)
}

export function getHomeServices(): HomeService[] {
  return homeServices
}

export function getHomeServiceById(id: string): HomeService | undefined {
  return homeServices.find(s => s.id === id)
}

export function getTransport(): Transport[] {
  return transport
}

export function getNews(): NewsItem[] {
  return news
}

export function getNewsById(id: string): NewsItem | undefined {
  return news.find(n => n.id === id)
}

export function getLocations(): LocationItem[] {
  return locations
}

export function getEmergencyContacts(): EmergencyContact[] {
  return emergencyContacts.sort((a, b) => a.priority - b.priority)
}

export function globalSearch(query: string): SearchResult[] {
  if (!query.trim()) return []
  const q = query.toLowerCase().trim()
  const results: SearchResult[] = []

  // Search hospitals
  hospitals.forEach(h => {
    if (
      h.name.toLowerCase().includes(q) ||
      (h.nameKh && h.nameKh.toLowerCase().includes(q)) ||
      h.description.toLowerCase().includes(q) ||
      (h.descriptionKh && h.descriptionKh.toLowerCase().includes(q)) ||
      h.category.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      (h.address && h.address.toLowerCase().includes(q)) ||
      (h.addressKh && h.addressKh.toLowerCase().includes(q)) ||
      h.services.some(s => s.toLowerCase().includes(q))
    ) {
      results.push({
        id: h.id,
        title: h.name,
        description: h.description,
        category: h.category,
        type: 'hospital',
        route: `/health/${h.id}`
      })
    }
  })

  // Search government services
  governmentServices.forEach(s => {
    if (
      s.title.toLowerCase().includes(q) ||
      (s.titleKh && s.titleKh.toLowerCase().includes(q)) ||
      s.description.toLowerCase().includes(q) ||
      (s.descriptionKh && s.descriptionKh.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        type: 'government',
        route: `/government/${s.id}`
      })
    }
  })

  // Search jobs
  jobs.forEach(j => {
    if (
      j.title.toLowerCase().includes(q) ||
      j.company.toLowerCase().includes(q) ||
      j.description.toLowerCase().includes(q) ||
      j.category.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q)
    ) {
      results.push({
        id: j.id,
        title: j.title,
        description: `${j.company} - ${j.location}`,
        category: j.category,
        type: 'job',
        route: `/jobs/${j.id}`
      })
    }
  })

  // Search home services
  homeServices.forEach(s => {
    if (
      s.serviceName.toLowerCase().includes(q) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(q)) ||
      s.provider.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      (s.descriptionKh && s.descriptionKh.toLowerCase().includes(q)) ||
      s.category.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q)
    ) {
      results.push({
        id: s.id,
        title: s.serviceName,
        description: s.description,
        category: s.category,
        type: 'home-service',
        route: '/home-services'
      })
    }
  })

  // Search transport
  transport.forEach(t => {
    if (
      t.name.toLowerCase().includes(q) ||
      (t.nameKh && t.nameKh.toLowerCase().includes(q)) ||
      t.description.toLowerCase().includes(q) ||
      (t.descriptionKh && t.descriptionKh.toLowerCase().includes(q)) ||
      t.type.toLowerCase().includes(q) ||
      t.route.toLowerCase().includes(q)
    ) {
      results.push({
        id: t.id,
        title: t.name,
        description: t.description,
        category: t.type,
        type: 'transport',
        route: '/transport'
      })
    }
  })

  // Search news
  news.forEach(n => {
    if (
      n.title.toLowerCase().includes(q) ||
      (n.titleKh && n.titleKh.toLowerCase().includes(q)) ||
      n.description.toLowerCase().includes(q) ||
      (n.descriptionKh && n.descriptionKh.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: n.id,
        title: n.title,
        description: n.description,
        category: n.category,
        type: 'news',
        route: '/news'
      })
    }
  })

  // Search locations
  locations.forEach(l => {
    if (
      l.name.toLowerCase().includes(q) ||
      (l.nameKh && l.nameKh.toLowerCase().includes(q)) ||
      l.description.toLowerCase().includes(q) ||
      (l.descriptionKh && l.descriptionKh.toLowerCase().includes(q)) ||
      l.category.toLowerCase().includes(q) ||
      l.address.toLowerCase().includes(q) ||
      (l.addressKh && l.addressKh.toLowerCase().includes(q))
    ) {
      results.push({
        id: l.id,
        title: l.name,
        description: l.address,
        category: l.category,
        type: 'location',
        route: '/locations'
      })
    }
  })

  return results
}
