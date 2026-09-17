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
    id: 'sub-174203',
    facilityType: 'employer',
    nameKh: 'ក្រុមហ៊ុន ហ្វ័រវើត បច្ចេកវិទ្យា (ខេមបូឌា)',
    nameEn: 'Forward Tech Solutions (Cambodia) Co., Ltd.',
    category: 'Technology & Software',
    industrySector: 'Information Technology',
    location: 'Phnom Penh',
    address: 'Canadia Tower 18th Floor, Monivong Blvd, Phnom Penh',
    addressKh: 'អគារកាណាឌីយ៉ា ជាន់ទី ១៨ មហាវិថីព្រះមុនីវង្ស រាជធានីភ្នំពេញ',
    phone: '023 999 123',
    email: 'careers@forwardtech.kh',
    openingHours: '08:00 - 17:30 (Mon-Fri)',
    licenseNumber: 'MOC-REG-2025-99881',
    representativeName: 'Sok Visal',
    representativeRole: 'HR Director',
    website: 'https://forwardtech.kh',
    descriptionKh: 'ក្រុមហ៊ុនបច្ចេកវិទ្យាឈានមុខគេ ជំនាញផ្នែក Cloud, AI, និង Mobile Application Development។',
    descriptionEn: 'Leading enterprise software company building cloud native and digital banking solutions.',
    services: ['Senior Vue.js Developer', 'Node.js Backend Engineer', 'UI/UX Product Designer'],
    status: 'pending',
    submittedAt: '2026-09-16 11:20'
  },
  {
    id: 'sub-174204',
    facilityType: 'transport',
    nameKh: 'ក្រុមហ៊ុន រថយន្តក្រុង អាស៊ាន អេចប្រេស',
    nameEn: 'Asean Express Transit & Coaches',
    category: 'Intercity Bus',
    location: 'Phnom Penh',
    address: 'Central Bus Terminal, Russian Blvd, Phnom Penh',
    addressKh: 'ស្ថានីយចំណតរថយន្តក្រុងកណ្តាល មហាវិថីសហព័ន្ធរុស្ស៊ី រាជធានីភ្នំពេញ',
    phone: '023 888 999',
    email: 'booking@aseanexpress.kh',
    openingHours: '05:30 - 23:00 (Daily)',
    licenseNumber: 'MPWT-TRANS-2024-5511',
    representativeName: 'Ouk Chamroeun',
    representativeRole: 'Operations Manager',
    fleetSize: '45 VIP Coaches & Vans',
    routes: ['Phnom Penh - Siem Reap', 'Phnom Penh - Battambang', 'Phnom Penh - Sihanoukville'],
    descriptionKh: 'សេវារថយន្តក្រុង VIP ទំនើប មាន WiFi ម៉ាស៊ីនត្រជាក់ និងកៅអីគេងសុវត្ថិភាពខ្ពស់។',
    descriptionEn: 'Premium intercity express coaches connecting Phnom Penh to major provinces with onboard amenities.',
    services: ['VIP Sleeper Bus', 'Express Van', 'Online Ticketing', 'Parcel Delivery'],
    status: 'pending',
    submittedAt: '2026-09-16 16:45'
  },
  {
    id: 'sub-174205',
    facilityType: 'emergency-ambulance',
    nameKh: 'សេវារថយន្តសង្គ្រោះបន្ទាន់ ជីវិតថ្មី ២៤/៧',
    nameEn: 'LifeCare 24/7 Private Ambulance Service',
    category: 'Medical Rescue',
    location: 'Phnom Penh',
    address: 'Street 598, Tuol Sangke, Russey Keo, Phnom Penh',
    addressKh: 'ផ្លូវ ៥៩៨ សង្កាត់ទួលសង្កែ ខណ្ឌឫស្សីកែវ រាជធានីភ្នំពេញ',
    phone: '012 999 119',
    email: 'dispatch@lifecare-ambulance.kh',
    openingHours: '24/7 Hotline',
    licenseNumber: 'MoH-EMR-2025-0019',
    representativeName: 'Dr. Meng Sophat',
    representativeRole: 'Emergency Dispatch Chief',
    fleetSize: '8 ICU Mobile Units',
    descriptionKh: 'សេវារថយន្តសង្គ្រោះបន្ទាន់បំពាក់បរិក្ខារ ICU ទំនើប គ្រូពេទ្យសង្គ្រោះបន្ទាន់ និងម៉ាស៊ីនជំនួយដង្ហើម ២៤ម៉ោង។',
    descriptionEn: 'Rapid mobile intensive care unit (ICU) ambulance response with certified paramedics 24/7.',
    services: ['24/7 Emergency Dispatch', 'ICU Patient Transfer', 'First Aid Trauma Support', 'Event Standby'],
    acceptsNssf: true,
    status: 'pending',
    submittedAt: '2026-09-17 08:30'
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

    // 3. If it's an employer, push a starter job opening to live custom jobs
    if (sub.facilityType === 'employer') {
      try {
        const rawJobs = localStorage.getItem('camlife_user_jobs')
        const customJobs = rawJobs ? JSON.parse(rawJobs) : []
        const primaryService = sub.services && sub.services.length > 0 ? sub.services[0] : 'Career Opportunity'
        const newJob = {
          id: `job-partner-${Date.now()}`,
          title: primaryService.startsWith('Open') ? primaryService : `Position: ${primaryService}`,
          company: sub.nameEn,
          location: sub.location,
          salary: '$600 - $1,500/month',
          salaryMin: 600,
          salaryMax: 1500,
          type: 'Full-time',
          category: sub.industrySector || 'Enterprise',
          postedDate: new Date().toISOString().split('T')[0],
          description: sub.descriptionKh || sub.descriptionEn || `Official vacancy posted by verified partner ${sub.nameKh}.`,
          requirements: ['Relevant experience or university degree in field', 'Good interpersonal and communication skills'],
          benefits: ['Competitive salary & performance bonus', 'NSSF healthcare & staff insurance'],
          applyUrl: sub.website || `tel:${sub.phone}`
        }

        if (!customJobs.some((j: any) => j.company === newJob.company && j.title === newJob.title)) {
          customJobs.unshift(newJob)
          localStorage.setItem('camlife_user_jobs', JSON.stringify(customJobs))
        }
      } catch (err) {
        console.error('Failed to append custom employer job:', err)
      }
    }

    // 4. If it's an emergency ambulance service, push to healthcare & emergency network
    if (sub.facilityType === 'emergency-ambulance') {
      try {
        const rawHosp = localStorage.getItem(CUSTOM_HOSPITALS_KEY)
        const customHospitals: Hospital[] = rawHosp ? JSON.parse(rawHosp) : []
        const newAmbulance: Hospital = {
          id: `amb-${Date.now()}`,
          name: sub.nameEn,
          nameKh: sub.nameKh,
          category: 'hospital',
          image: 'https://images.unsplash.com/photo-1587745416684-47953f16f02f?auto=format&fit=crop&w=800&q=80',
          rating: 5.0,
          reviews: 1,
          location: sub.location,
          phone: sub.phone,
          openingHours: '24/7',
          description: sub.descriptionEn || sub.descriptionKh,
          descriptionKh: sub.descriptionKh,
          services: sub.services && sub.services.length > 0 ? sub.services : ['24/7 ICU Ambulance', 'Emergency Dispatch'],
          address: sub.address,
          addressKh: sub.addressKh,
          coordinates: { lat: 11.5564, lng: 104.9282 },
          ownership: 'private',
          acceptsNssf: sub.acceptsNssf || false,
          emergencyHotline: sub.phone
        }

        if (!customHospitals.some(h => h.name === newAmbulance.name)) {
          customHospitals.unshift(newAmbulance)
          localStorage.setItem(CUSTOM_HOSPITALS_KEY, JSON.stringify(customHospitals))
        }
      } catch (err) {
        console.error('Failed to append emergency ambulance to directory:', err)
      }
    }

    // 5. If it's a transport operator, push to live custom transport operators
    if (sub.facilityType === 'transport') {
      try {
        const rawTrans = localStorage.getItem('camlife_custom_transports')
        const customTransports = rawTrans ? JSON.parse(rawTrans) : []
        const newTransport = {
          id: `trans-${Date.now()}`,
          name: sub.nameEn,
          nameKh: sub.nameKh,
          category: 'Bus & VIP Transit',
          location: sub.location,
          address: sub.address,
          addressKh: sub.addressKh,
          phone: sub.phone,
          email: sub.email,
          openingHours: sub.openingHours,
          licenseNumber: sub.licenseNumber,
          representativeName: sub.representativeName,
          fleetSize: sub.fleetSize || '20+ Modern Fleet',
          routes: sub.routes && sub.routes.length > 0 ? sub.routes : ['Phnom Penh - Provinces'],
          website: sub.website,
          description: sub.descriptionEn || sub.descriptionKh,
          descriptionKh: sub.descriptionKh,
          services: sub.services && sub.services.length > 0 ? sub.services : ['VIP Express', 'Online Booking'],
          rating: 4.9,
          reviews: 1,
          image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80'
        }

        if (!customTransports.some((t: any) => t.name === newTransport.name)) {
          customTransports.unshift(newTransport)
          localStorage.setItem('camlife_custom_transports', JSON.stringify(customTransports))
        }
      } catch (err) {
        console.error('Failed to append custom transport:', err)
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

  function getUserSubmissions(userIdentifier?: string): PartnerSubmission[] {
    if (!userIdentifier) return submissions.value
    const idLower = userIdentifier.toLowerCase().trim()
    const matches = submissions.value.filter(s =>
      (s.userId && s.userId === userIdentifier) ||
      (s.applicantEmail && s.applicantEmail.toLowerCase() === idLower) ||
      (s.email && s.email.toLowerCase() === idLower) ||
      (s.representativeName && s.representativeName.toLowerCase().includes(idLower))
    )
    return matches.length > 0 ? matches : submissions.value
  }

  return {
    submissions,
    pendingCount,
    approvedCount,
    rejectedCount,
    submitApplication,
    approveSubmission,
    rejectSubmission,
    deleteSubmission,
    getUserSubmissions
  }
}
