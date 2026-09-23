import { ref, computed } from 'vue'
import type { PartnerSubmission, Hospital, HomeService, Transport } from '@/types'

const STORAGE_KEY = 'camlife_partner_submissions'
const CUSTOM_HOSPITALS_KEY = 'camlife_custom_hospitals'
const CUSTOM_HOME_SERVICES_KEY = 'camlife_custom_home_services'
const ADMIN_NOTIFICATIONS_KEY = 'camlife_admin_notifications'

export interface AdminNotification {
  id: string
  title: string
  titleKh: string
  titleEn?: string
  time: string
  tab: string
  unread: boolean
  submissionId?: string
  entityName?: string
  facilityType?: string
  type: 'submission' | 'service' | 'system'
}

export function getAdminNotifications(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(ADMIN_NOTIFICATIONS_KEY)
    if (raw) {
      const parsed: AdminNotification[] = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {}
  return [
    {
      id: 'notif-demo-1',
      title: 'New partner application from Angkor International Hospital',
      titleKh: 'ពាក្យស្នើសុំថ្មីពី៖ មន្ទីរពេទ្យអន្តរជាតិអង្គរ-សៀមរាប',
      time: '15m ago',
      tab: 'submissions',
      unread: true,
      submissionId: 'sub-174201',
      entityName: 'មន្ទីរពេទ្យអន្តរជាតិអង្គរ-សៀមរាប',
      facilityType: 'hospital',
      type: 'submission'
    },
    {
      id: 'notif-demo-2',
      title: 'New partner application from Vattanak AC Repair',
      titleKh: 'ពាក្យស្នើសុំថ្មីពី៖ សេវាជាងម៉ាស៊ីនត្រជាក់ វឌ្ឍនៈ',
      time: '1h ago',
      tab: 'submissions',
      unread: true,
      submissionId: 'sub-174202',
      entityName: 'សេវាជាងម៉ាស៊ីនត្រជាក់ វឌ្ឍនៈ',
      facilityType: 'home-service',
      type: 'submission'
    },
    {
      id: 'notif-demo-3',
      title: 'Citizen inquiry report submitted',
      titleKh: 'របាយការណ៍មតិពលរដ្ឋថ្មីត្រូវបានបញ្ជូនមក',
      time: '2h ago',
      tab: 'feedback',
      unread: false,
      type: 'system'
    }
  ]
}

export function saveAdminNotifications(list: AdminNotification[]) {
  try {
    localStorage.setItem(ADMIN_NOTIFICATIONS_KEY, JSON.stringify(list))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('camlife-admin-notifs-updated'))
    }
  } catch {}
}

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

export const freshPendingSubmissions: PartnerSubmission[] = [
  {
    id: 'sub-new-001',
    facilityType: 'hospital',
    nameKh: 'មន្ទីរពេទ្យកុមារអង្គរ (ខេត្តសៀមរាប)',
    nameEn: 'Angkor Hospital for Children',
    category: 'hospital',
    location: 'Siem Reap',
    address: 'Tep Vong Street, Svay Dangkum, Siem Reap',
    addressKh: 'ផ្លូវទេពវង្ស សង្កាត់ស្វាយដង្គំ ក្រុងសៀមរាប',
    phone: '063 963 409',
    email: 'info@angkorhospital.org',
    openingHours: '24/7',
    licenseNumber: 'MoH-SR-2026-9921',
    representativeName: 'Dr. Ngoun Chanpheaktra',
    representativeRole: 'Hospital Director',
    descriptionKh: 'មន្ទីរពេទ្យកុមារឯកទេស ផ្តល់សេវាថែទាំសុខភាពកម្រិតខ្ពស់ សង្គ្រោះបន្ទាន់ និងពិនិត្យព្យាបាលជំងឺកុមារគ្រប់ប្រភេទដោយឥតគិតថ្លៃ និងសមរម្យ។',
    descriptionEn: 'Leading pediatric healthcare institution providing specialized medical care, emergency response, and intensive treatments for children in Cambodia.',
    services: ['Pediatric ICU 24/7', 'Neonatal Care', 'Eye Clinic', 'Emergency Surgery'],
    acceptsNssf: true,
    website: 'https://angkorhospital.org',
    status: 'pending',
    submittedAt: '2026-09-20 14:15'
  },
  {
    id: 'sub-new-002',
    facilityType: 'transport',
    nameKh: 'ក្រុមហ៊ុន វីរៈ ប៊ុនថាំ អេចប្រេស (VIP Transit)',
    nameEn: 'Vireak Buntham Express VIP Transit Co., Ltd.',
    category: 'VIP Sleeper & Speed Ferry',
    location: 'Phnom Penh',
    address: 'Corner of St. 106 & Night Market, Phnom Penh',
    addressKh: 'កែងផ្លូវ ១០៦ មាត់ទន្លេផ្សាររាត្រី រាជធានីភ្នំពេញ',
    phone: '023 999 988',
    email: 'booking@vireakbuntham.com',
    openingHours: '05:00 - 23:30 (Daily)',
    licenseNumber: 'MPWT-TRANS-2026-7819',
    representativeName: 'Suo Vireak',
    representativeRole: 'CEO & Managing Director',
    fleetSize: '120+ VIP Sleeper Coaches & Speed Ferries',
    routes: ['Phnom Penh - Siem Reap', 'Phnom Penh - Sihanoukville', 'Phnom Penh - Koh Rong Ferry', 'Phnom Penh - Bangkok'],
    descriptionKh: 'ក្រុមហ៊ុនដឹកជញ្ជូនឈានមុខគេក្នុងប្រទេសកម្ពុជា មានរថយន្តគេង VIP សេវាទូកល្បឿនលឿនកោះរ៉ុង និងសេវាដឹកជញ្ជូនបញ្ញើឆាប់រហ័ស។',
    descriptionEn: 'Cambodia premier passenger transportation company with luxury sleeping coaches, island speed ferries, and express parcel logistics nationwide.',
    services: ['Luxury Hotel Bus', 'Speed Ferry to Koh Rong', 'Online GPS Tracking', 'Parcel Delivery'],
    website: 'https://vireakbuntham.com',
    status: 'pending',
    submittedAt: '2026-09-20 15:30'
  },
  {
    id: 'sub-new-003',
    facilityType: 'employer',
    nameKh: 'ធនាគារ អេស៊ីលីដា ភីអិលស៊ី (ផ្នែកបច្ចេកវិទ្យា & IT)',
    nameEn: 'ACLEDA Bank Plc. — Digital Banking Division',
    category: 'Banking & Financial Technology',
    industrySector: 'Banking & Finance',
    location: 'Phnom Penh',
    address: '#61, Preah Monivong Blvd, Sangkat Srah Chork, Phnom Penh',
    addressKh: 'អគារលេខ ៦១ មហាវិថីព្រះមុនីវង្ស សង្កាត់ស្រះចក ខណ្ឌដូនពេញ រាជធានីភ្នំពេញ',
    phone: '023 999 999',
    email: 'hr.careers@acledabank.com.kh',
    openingHours: '08:00 - 17:00 (Mon - Fri)',
    licenseNumber: 'NBC-BANK-REG-001',
    representativeName: 'Dr. In Channy',
    representativeRole: 'President & Group Managing Director',
    website: 'https://acledabank.com.kh',
    descriptionKh: 'គ្រឹះស្ថានធនាគារពាណិជ្ជឈានមុខគេនៅកម្ពុជា ប្រកាសជ្រើសរើសបុគ្គលិកជំនាញផ្នែក FinTech, Mobile App Developer, និង Cyber Security ជាច្រើនកន្លែង។',
    descriptionEn: 'The leading commercial bank in Cambodia actively recruiting talented FinTech software engineers, mobile banking developers, and data specialists.',
    services: ['Senior Mobile App Developer', 'Cyber Security Analyst', 'DevOps Cloud Engineer', 'Core Banking Specialist'],
    status: 'pending',
    submittedAt: '2026-09-20 16:40'
  },
  {
    id: 'sub-new-004',
    facilityType: 'home-service',
    nameKh: 'សេវាជាងអគ្គិសនី និងទឹកស្អាត ភ្នំពេញ ២៤/៧',
    nameEn: 'Phnom Penh 24/7 Smart Electric & Plumbing',
    category: 'Electrician & Plumbing',
    location: 'Phnom Penh',
    address: 'Street 2004, Teuk Thla, Sen Sok, Phnom Penh',
    addressKh: 'ផ្លូវ ២០០៤ សង្កាត់ទឹកថ្លា ខណ្ឌសែនសុខ រាជធានីភ្នំពេញ',
    phone: '012 555 666',
    email: 'service@smartplumb-kh.com',
    openingHours: '24/7 On-Call Emergency',
    licenseNumber: 'MOC-SVC-2026-3391',
    representativeName: 'Kong Chamroeun',
    representativeRole: 'Master Technician & Team Lead',
    descriptionKh: 'ក្រុមជាងជំនាញមានបទពិសោធន៍ ១០ ឆ្នាំឡើង ទទួលដោះស្រាយបញ្ហាឆ្លងចរន្តភ្លើង ខូចទុយោទឹក លេចធ្លាយ និងតម្លើងបរិក្ខារអគ្គិសនីគ្រប់ប្រភេទ ឆ្លើយតបរហ័ស ២៤ ម៉ោង។',
    descriptionEn: 'Certified master technicians providing on-demand rapid emergency electrical fixes, pipe burst repairs, and modern appliance installations across Phnom Penh.',
    services: ['24/7 Emergency Power Outage', 'Water Leak Detection', 'Home Rewiring', 'Pump & Solar Setup'],
    status: 'pending',
    submittedAt: '2026-09-20 17:10'
  },
  {
    id: 'sub-new-005',
    facilityType: 'emergency-ambulance',
    nameKh: 'សេវារថយន្តសង្គ្រោះបន្ទាន់ រ៉ូយ៉ាល់ភ្នំពេញ (ICU Mobile)',
    nameEn: 'Royal Phnom Penh Mobile ICU Emergency Dispatch',
    category: 'Mobile Intensive Care',
    location: 'Phnom Penh',
    address: 'Russian Blvd, Tuol Kork, Phnom Penh',
    addressKh: 'មហាវិថីសហព័ន្ធរុស្ស៊ី សង្កាត់ទឹកល្អក់១ ខណ្ឌទួលគោក រាជធានីភ្នំពេញ',
    phone: '023 991 119',
    email: 'emergency@royalphnompenhhospital.com',
    openingHours: '24/7 Trauma Emergency',
    licenseNumber: 'MoH-EMR-2026-0044',
    representativeName: 'Dr. Som Sophat',
    representativeRole: 'Head of Emergency & Trauma',
    fleetSize: '12 Advanced Life Support (ALS) Ambulances',
    descriptionKh: 'រថយន្តសង្គ្រោះបន្ទាន់ស្តង់ដារមន្ទីរពេទ្យបាងកក បំពាក់ម៉ាស៊ីនជំនួយដង្ហើម Defibrillator និងក្រុមគ្រូពេទ្យសង្គ្រោះជីវិតបន្ទាន់ ត្រៀមចេញជួយក្នុងរយៈពេល ៥ នាទី។',
    descriptionEn: 'High-acuity mobile intensive care ambulance fleet equipped with cardiac monitors, advanced ventilators, and trauma paramedic teams on 24/7 standby.',
    services: ['24/7 Advanced Cardiac Life Support', 'Inter-Provincial Patient Transfer', 'Air Ambulance Coordination'],
    acceptsNssf: true,
    website: 'https://royalphnompenhhospital.com',
    status: 'pending',
    submittedAt: '2026-09-20 18:25'
  }
]

const submissions = ref<PartnerSubmission[]>(loadSubmissions())

function loadSubmissions(): PartnerSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        // If there are no pending submissions, prepend the fresh pending submissions
        const hasPending = parsed.some((s: any) => s.status === 'pending')
        if (!hasPending) {
          const newIds = new Set(freshPendingSubmissions.map(f => f.id))
          const existing = parsed.filter((p: any) => !newIds.has(p.id))
          const combined = [...freshPendingSubmissions, ...existing]
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(combined))
          } catch {}
          return combined
        }
        return parsed
      }
    }
  } catch (err) {
    console.error('Failed to load partner submissions from storage:', err)
  }
  const allInitial = [...freshPendingSubmissions, ...initialSubmissions]
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allInitial))
    localStorage.setItem(STORAGE_KEY + '_initialized', 'true')
  } catch {}
  return allInitial
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

    // Add to Admin Notifications
    const notifs = getAdminNotifications()
    const facilityKhMap: Record<string, string> = {
      hospital: 'មន្ទីរពេទ្យ',
      clinic: 'គ្លីនិកឯកទេស',
      pharmacy: 'ឱសថស្ថាន',
      'home-service': 'សេវាជាង/គេហដ្ឋាន',
      employer: 'ក្រុមហ៊ុនជ្រើសរើសបុគ្គលិក',
      transport: 'សេវាដឹកជញ្ជូន',
      'emergency-ambulance': 'រថយន្តសង្គ្រោះបន្ទាន់'
    }
    const facLabelKh = facilityKhMap[newSubmission.facilityType] || 'ដៃគូថ្មី'
    const newNotif: AdminNotification = {
      id: `notif-${Date.now()}`,
      title: `New partner submission: ${newSubmission.nameEn || newSubmission.nameKh}`,
      titleKh: `មានពាក្យស្នើសុំថ្មីពី៖ ${newSubmission.nameKh || newSubmission.nameEn} (${facLabelKh})`,
      time: 'Just now',
      tab: 'submissions',
      unread: true,
      submissionId: newSubmission.id,
      entityName: newSubmission.nameKh || newSubmission.nameEn,
      facilityType: newSubmission.facilityType,
      type: 'submission'
    }
    notifs.unshift(newNotif)
    saveAdminNotifications(notifs)

    // Broadcast Real-time event for Admin alert
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('camlife-new-submission', {
          detail: {
            submission: newSubmission,
            notification: newNotif,
            messageKh: `មានពាក្យស្នើសុំថ្មីពី៖ ${newSubmission.nameKh || newSubmission.nameEn}`,
            messageEn: `New submission from: ${newSubmission.nameEn || newSubmission.nameKh}`
          }
        }))
        window.dispatchEvent(new CustomEvent('camlife-data-updated'))
        localStorage.setItem('camlife_last_submission_ping', JSON.stringify({ id: newSubmission.id, timestamp: Date.now() }))
      }
    } catch {}

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
        const newTransport: Transport = {
          id: `trans-${Date.now()}`,
          name: sub.nameEn || sub.nameKh,
          nameKh: sub.nameKh || sub.nameEn,
          type: 'bus',
          route: sub.routes && sub.routes.length > 0 ? sub.routes.join(', ') : 'Phnom Penh - Provinces',
          schedule: sub.openingHours || '05:30 AM - 09:00 PM',
          price: '$10 - $18',
          location: sub.location || 'Phnom Penh',
          description: sub.descriptionEn || sub.descriptionKh || '',
          descriptionKh: sub.descriptionKh || sub.descriptionEn || '',
          usefulInformation: `Fleet: ${sub.fleetSize || '20+ Modern Fleet'} | License: ${sub.licenseNumber || ''} | Contact: ${sub.phone || ''}`,
          usefulInformationKh: `មធ្យោបាយធ្វើដំណើរ៖ ${sub.fleetSize || 'រថយន្តទំនើប ២០+ គ្រឿង'} | អាជ្ញាបណ្ណ៖ ${sub.licenseNumber || ''} | ទំនាក់ទំនង៖ ${sub.phone || ''}`,
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

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('camlife-data-updated'))
      }
    } catch {}

    return true
  }

  function rejectSubmission(id: string, reason?: string): boolean {
    const sub = submissions.value.find(s => s.id === id)
    if (!sub) return false

    sub.status = 'rejected'
    sub.rejectReason = reason || 'ព័ត៌មាន ឬឯកសារមិនទាន់គ្រប់គ្រាន់តាមការកំណត់'
    sub.reviewedAt = new Date().toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
    saveSubmissions()

    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('camlife-data-updated'))
      }
    } catch {}

    return true
  }

  function deleteSubmission(id: string): boolean {
    const idx = submissions.value.findIndex(s => s.id === id)
    if (idx !== -1) {
      submissions.value.splice(idx, 1)
      saveSubmissions()
      try {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('camlife-data-updated'))
        }
      } catch {}
      return true
    }
    return false
  }

  function getUserSubmissions(userIdentifier?: string): PartnerSubmission[] {
    if (!userIdentifier) return []
    const idLower = userIdentifier.toLowerCase().trim()
    return submissions.value.filter(s =>
      (s.userId && s.userId === userIdentifier) ||
      (s.applicantEmail && s.applicantEmail.toLowerCase() === idLower) ||
      (s.email && s.email.toLowerCase() === idLower) ||
      (s.representativeName && s.representativeName.toLowerCase().includes(idLower))
    )
  }

  function addDemoPendingSubmissions(): number {
    freshPendingSubmissions.forEach(item => {
      const idx = submissions.value.findIndex(s => s.id === item.id)
      if (idx !== -1) {
        submissions.value[idx].status = 'pending'
        delete submissions.value[idx].reviewedAt
        delete submissions.value[idx].rejectReason
      } else {
        submissions.value.unshift({ ...item })
      }
    })
    saveSubmissions()
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('camlife-data-updated'))
      }
    } catch {}
    return freshPendingSubmissions.length
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
    getUserSubmissions,
    getAdminNotifications,
    saveAdminNotifications,
    addDemoPendingSubmissions
  }
}
