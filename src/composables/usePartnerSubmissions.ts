import { ref, computed } from 'vue'
import type { PartnerSubmission, Hospital, HomeService } from '@/types'

const STORAGE_KEY = 'camlife_partner_submissions'
const CUSTOM_HOSPITALS_KEY = 'camlife_custom_hospitals'
const CUSTOM_HOME_SERVICES_KEY = 'camlife_custom_home_services'

const initialSubmissions: PartnerSubmission[] = [
  {
    id: 'sub-174201',
    facilityType: 'hospital',
    nameKh: 'មន្ទីរពេទ្យអន្តរជាតិអង្គរ-សៀមរាប',
    nameEn: 'Angkor-Siem Reap International Hospital',
    category: 'hospital',
    location: 'Siem Reap',
    address: 'National Road 6, Svay Dangkum, Siem Reap',
    addressKh: 'ផ្លូវជាតិលេខ ៦ សង្កាត់ស្វាយដង្គំ ក្រុងសៀមរាប',
    phone: '063 963 888',
    email: 'contact@angkor-hospital.kh',
    openingHours: '24/7',
    licenseNumber: 'MoH-SR-2026-0891',
    representativeName: 'Dr. Chan Vichea',
    representativeRole: 'Medical Director',
    descriptionKh: 'មន្ទីរពេទ្យឯកជនស្តង់ដារអន្តរជាតិ ផ្តល់សេវាសង្គ្រោះបន្ទាន់ វះកាត់ទូទៅ និងពិនិត្យព្យាបាលជំងឺកុមារ។',
    descriptionEn: 'International private hospital offering 24/7 emergency care, general surgery, and specialized pediatric care in Siem Reap.',
    services: ['Emergency 24/7', 'Pediatrics', 'Surgery', 'NSSF Accepted'],
    acceptsNssf: true,
    status: 'pending',
    submittedAt: '2026-09-15 14:30'
  },
  {
    id: 'sub-174202',
    facilityType: 'home-service',
    nameKh: 'សេវាជាងម៉ាស៊ីនត្រជាក់ វឌ្ឍនៈ អេចប្រេស',
    nameEn: 'Vattanak AC Express Repair',
    category: 'AC Repair',
    location: 'Phnom Penh',
    address: 'Street 271, Boeng Tumpun, Phnom Penh',
    addressKh: 'ផ្លូវ ២៧១ សង្កាត់បឹងទំពន់ ខណ្ឌមានជ័យ រាជធានីភ្នំពេញ',
    phone: '012 888 777',
    email: 'vattanak.repair@gmail.com',
    openingHours: '08:00 - 18:00',
    licenseNumber: 'MOC-PP-2026-4412',
    representativeName: 'Vattanak Heng',
    representativeRole: 'Business Owner',
    descriptionKh: 'សេវាជួសជុល លាងសម្អាត និងបញ្ចូលហ្គាសម៉ាស៊ីនត្រជាក់គ្រប់ប្រភេទតាមគេហដ្ឋាន និងការិយាល័យ។',
    descriptionEn: 'Professional on-demand AC cleaning, gas refill, and rapid repairs across Phnom Penh.',
    services: ['AC Cleaning', 'Gas Refill', 'Installation', 'Emergency Callout'],
    status: 'pending',
    submittedAt: '2026-09-16 09:15'
  },
  {
    id: 'sub-174200',
    facilityType: 'clinic',
    nameKh: 'គ្លីនិកទន្តសាស្ត្រ សុភមង្គល',
    nameEn: 'Sopheakmongkol Dental Clinic',
    category: 'clinic',
    location: 'Battambang',
    address: 'Street 1, Romchek 4, Battambang',
    addressKh: 'ផ្លូវលេខ ១ រំចេក ៤ ក្រុងបាត់ដំបង',
    phone: '053 952 111',
    email: 'info@sopheakdental.kh',
    openingHours: '07:30 - 19:30',
    licenseNumber: 'MoH-BTB-2025-1102',
    representativeName: 'Dr. Keo Sothea',
    representativeRole: 'Lead Dentist',
    descriptionKh: 'គ្លីនិកព្យាបាល និងថែទាំធ្មេញកម្រិតស្តង់ដារ ជាមួយឧបករណ៍វេជ្ជសាស្ត្រទំនើប។',
    descriptionEn: 'Modern dental clinic providing orthodontics, implants, and oral surgery in Battambang.',
    services: ['Dentistry', 'Orthodontics', 'Implants'],
    acceptsNssf: false,
    status: 'approved',
    submittedAt: '2026-09-10 11:00',
    reviewedAt: '2026-09-11 16:20'
  }
]

const submissions = ref<PartnerSubmission[]>(loadSubmissions())

function loadSubmissions(): PartnerSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to load partner submissions from storage:', err)
  }
  // Initialize default
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialSubmissions))
  } catch {
    // ignore
  }
  return [...initialSubmissions]
}

function saveSubmissions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions.value))
  } catch (err) {
    console.error('Failed to save partner submissions:', err)
  }
}

export function usePartnerSubmissions() {
  const pendingCount = computed(() => submissions.value.filter(s => s.status === 'pending').length)
  const approvedCount = computed(() => submissions.value.filter(s => s.status === 'approved').length)
  const rejectedCount = computed(() => submissions.value.filter(s => s.status === 'rejected').length)

  function submitApplication(data: Omit<PartnerSubmission, 'id' | 'status' | 'submittedAt'>): PartnerSubmission {
    const newSubmission: PartnerSubmission = {
      ...data,
      id: `sub-${Date.now()}`,
      status: 'pending',
      submittedAt: new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    }

    submissions.value.unshift(newSubmission)
    saveSubmissions()
    return newSubmission
  }

  function approveSubmission(id: string): boolean {
    const sub = submissions.value.find(s => s.id === id)
    if (!sub) return false

    sub.status = 'approved'
    sub.reviewedAt = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    saveSubmissions()

    // 1. If it's a healthcare facility, push to live custom hospitals
    if (sub.facilityType === 'hospital' || sub.facilityType === 'clinic' || sub.facilityType === 'pharmacy') {
      try {
        const rawHosp = localStorage.getItem(CUSTOM_HOSPITALS_KEY)
        const customHospitals: Hospital[] = rawHosp ? JSON.parse(rawHosp) : []
        
        const newHospital: Hospital = {
          id: `hosp-${Date.now()}`,
          name: sub.nameEn,
          nameKh: sub.nameKh,
          category: sub.facilityType,
          image: sub.facilityType === 'clinic'
            ? 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80'
            : 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
          rating: 4.8,
          reviews: 1,
          location: sub.location,
          phone: sub.phone,
          openingHours: sub.openingHours || '24/7',
          description: sub.descriptionEn || sub.descriptionKh,
          descriptionKh: sub.descriptionKh,
          services: sub.services && sub.services.length > 0 ? sub.services : ['General Medicine'],
          address: sub.address,
          addressKh: sub.addressKh,
          coordinates: { lat: 11.5564, lng: 104.9282 },
          ownership: 'private',
          acceptsNssf: sub.acceptsNssf || false,
          emergencyHotline: sub.phone
        }

        // Avoid duplicate by name
        if (!customHospitals.some(h => h.name === newHospital.name)) {
          customHospitals.unshift(newHospital)
          localStorage.setItem(CUSTOM_HOSPITALS_KEY, JSON.stringify(customHospitals))
        }
      } catch (err) {
        console.error('Failed to append custom hospital:', err)
      }
    }

    // 2. If it's a home service, push to live custom home services
    if (sub.facilityType === 'home-service') {
      try {
        const rawServ = localStorage.getItem(CUSTOM_HOME_SERVICES_KEY)
        const customServices: HomeService[] = rawServ ? JSON.parse(rawServ) : []

        const newService: HomeService = {
          id: `hs-${Date.now()}`,
          serviceName: sub.nameEn,
          serviceNameKh: sub.nameKh,
          provider: sub.representativeName || sub.nameEn,
          category: sub.category || 'Handyman',
          image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
          location: sub.location,
          rating: 4.9,
          reviews: 1,
          phone: sub.phone,
          description: sub.descriptionEn || sub.descriptionKh,
          descriptionKh: sub.descriptionKh
        }

        if (!customServices.some(s => s.serviceName === newService.serviceName)) {
          customServices.unshift(newService)
          localStorage.setItem(CUSTOM_HOME_SERVICES_KEY, JSON.stringify(customServices))
        }
      } catch (err) {
        console.error('Failed to append custom home service:', err)
      }
    }

    return true
  }

  function rejectSubmission(id: string, reason?: string): boolean {
    const sub = submissions.value.find(s => s.id === id)
    if (!sub) return false

    sub.status = 'rejected'
    sub.rejectReason = reason || 'ព័ត៌មាន ឬឯកសារមិនទាន់គ្រប់គ្រាន់តាមការកំណត់'
    sub.reviewedAt = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    saveSubmissions()
    return true
  }

  function deleteSubmission(id: string): boolean {
    const idx = submissions.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      submissions.value.splice(idx, 1)
      saveSubmissions()
      return true
    }
    return false
  }

  return {
    submissions,
    pendingCount,
    approvedCount,
    rejectedCount,
    submitApplication,
    approveSubmission,
    rejectSubmission,
    deleteSubmission
  }
}
