export interface Hospital {
  id: string
  name: string
  nameKh: string
  category: 'hospital' | 'clinic' | 'pharmacy'
  image: string
  rating: number
  reviews: number
  location: string
  phone: string
  openingHours: string
  description: string
  descriptionKh: string
  services: string[]
  address: string
  addressKh: string
  coordinates: { lat: number; lng: number }
  ownership?: 'public' | 'private'
  acceptsNssf?: boolean
  emergencyHotline?: string
}

export interface GovernmentService {
  id: string
  title: string
  titleKh: string
  category: string
  image?: string
  description: string
  descriptionKh: string
  requirements: string[]
  requirementsKh: string[]
  process: { step: number; title: string; titleKh: string; description: string; descriptionKh: string }[]
  location: string
  locationKh: string
  processingTime: string
  processingTimeKh: string
  fee: string
  feeKh: string
  validity: string
  validityKh: string
  ageRequirements: string
  ageRequirementsKh: string
  faq: { question: string; questionKh: string; answer: string; answerKh: string }[]
}

export interface Job {
  id: string
  title: string
  titleKh?: string
  company: string
  location: string
  salary: string
  salaryMin: number
  salaryMax: number
  type: 'Full-time' | 'Part-time' | 'Internship' | 'Freelance'
  category: string
  postedDate: string
  image?: string
  logo?: string
  description: string
  descriptionKh?: string
  requirements: string[]
  benefits: string[]
  applyUrl: string
}

export interface HomeService {
  id: string
  serviceName: string
  serviceNameKh: string
  provider: string
  category: string
  image: string
  location: string
  rating: number
  reviews?: number
  priceEstimate?: string
  phone: string
  coordinates?: { lat: number; lng: number }
  description: string
  descriptionKh: string
}

export interface Transport {
  id: string
  type: 'bus' | 'taxi' | 'train' | 'plane' | 'ferry'
  name: string
  nameKh: string
  image?: string
  description: string
  descriptionKh: string
  route: string
  schedule: string
  price: string
  location: string
  usefulInformation: string
  usefulInformationKh: string
}

export interface NewsItem {
  id: string
  title: string
  titleKh: string
  category: string
  description: string
  descriptionKh: string
  content: string
  contentKh: string
  date: string
  image: string
  source: string
  author?: string
  authorRole?: string
  views?: number
  readTime?: string
  breaking?: boolean
  tags?: string[]
}

export interface LocationItem {
  id: string
  name: string
  nameKh: string
  category: string
  image?: string
  address: string
  addressKh: string
  phone: string
  coordinates: { lat: number; lng: number }
  description: string
  descriptionKh: string
}

export interface EmergencyContact {
  id: string
  name: string
  nameKh: string
  number: string
  image?: string
  description: string
  descriptionKh: string
  icon: string
  priority: number
}

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  type: 'hospital' | 'government' | 'job' | 'home-service' | 'transport' | 'news' | 'location'
  route: string
}

export type Language = 'en' | 'kh'
