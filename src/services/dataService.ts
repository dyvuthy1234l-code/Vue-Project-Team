import type { Hospital, GovernmentService, Job, HomeService, Transport, NewsItem, LocationItem, EmergencyContact, SearchResult } from '@/types'
import hospitalsData from '@/data/hospitals.json'
import governmentData from '@/data/government.json'
import jobsData from '@/data/jobs.json'
import homeServicesData from '@/data/home-services.json'
import transportData from '@/data/transport.json'
import newsData from '@/data/news.json'
import locationsData from '@/data/locations.json'
import emergencyData from '@/data/emergency.json'

const baseHospitals = hospitalsData as Hospital[]
const governmentServices = governmentData as GovernmentService[]
const jobs = jobsData as Job[]
const homeServices = homeServicesData as HomeService[]
const transport = transportData as Transport[]
const news = newsData as NewsItem[]
const locations = locationsData as LocationItem[]
const emergencyContacts = emergencyData as EmergencyContact[]

// 25 Cambodian Provincial Referral Hospitals coverage
const provincialHospitals: Hospital[] = [
  {
    id: 'takeo-provincial-hospital',
    name: 'Takeo Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តតាកែវ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 84,
    location: 'Takeo',
    phone: '032 931 210',
    openingHours: '24/7',
    description: 'Main provincial referral hospital providing emergency, maternity, surgery, and NSSF healthcare in Takeo.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកកម្រិតខេត្ត ផ្តល់សេវាសង្គ្រោះបន្ទាន់ សម្ភព វះកាត់ និងទទួលប័ណ្ណ ប.ស.ស ក្នុងខេត្តតាកែវ។',
    services: ['Emergency Care', 'Maternity', 'Surgery', 'General Medicine', 'NSSF Care'],
    address: 'National Road 2, Doun Kaev Town, Takeo Province',
    addressKh: 'ផ្លូវជាតិលេខ ២ ក្រុងដូនកែវ ខេត្តតាកែវ',
    coordinates: { lat: 10.9908, lng: 104.7850 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '032 931 210'
  },
  {
    id: 'kampong-speu-provincial-hospital',
    name: 'Kampong Speu Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ស្ពឺ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 72,
    location: 'Kampong Speu',
    phone: '025 987 210',
    openingHours: '24/7',
    description: 'Chief public hospital with comprehensive trauma care on National Road 4, Kampong Speu.',
    descriptionKh: 'មន្ទីរពេទ្យសាធារណៈកម្រិតខេត្ត មានសេវាសង្គ្រោះគ្រោះថ្នាក់ចរាចរណ៍ ២៤/៧ លើផ្លូវជាតិលេខ ៤។',
    services: ['Trauma Center', 'General Medicine', 'ICU', 'Pediatrics'],
    address: 'National Road 4, Chbar Mon City, Kampong Speu',
    addressKh: 'ផ្លូវជាតិលេខ ៤ ក្រុងច្បារមន ខេត្តកំពង់ស្ពឺ',
    coordinates: { lat: 11.4533, lng: 104.5209 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '025 987 210'
  },
  {
    id: 'kampong-chhnang-provincial-hospital',
    name: 'Kampong Chhnang Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ឆ្នាំង',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 65,
    location: 'Kampong Chhnang',
    phone: '026 988 210',
    openingHours: '24/7',
    description: 'Central public healthcare facility for Kampong Chhnang province with NSSF integration.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកកណ្តាលប្រចាំខេត្តកំពង់ឆ្នាំង ទទួលពិនិត្យ និងព្យាបាល ២៤ ម៉ោង។',
    services: ['Emergency Care', 'Maternity', 'Pediatrics', 'Radiology'],
    address: 'National Road 5, Kampong Chhnang Town',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ក្រុងកំពង់ឆ្នាំង ខេត្តកំពង់ឆ្នាំង',
    coordinates: { lat: 12.2500, lng: 104.6667 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '026 988 210'
  },
  {
    id: 'kampong-thom-provincial-hospital',
    name: 'Kampong Thom Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ធំ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 90,
    location: 'Kampong Thom',
    phone: '062 961 210',
    openingHours: '24/7',
    description: 'Main provincial healthcare provider serving central Cambodia along National Road 6.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកំពង់ធំ តាមបណ្តោយផ្លូវជាតិលេខ ៦ ផ្តល់សេវាសុខាភិបាលពេញលេញ។',
    services: ['Emergency Care', 'General Surgery', 'Internal Medicine', 'NSSF'],
    address: 'National Road 6, Steung Saen City, Kampong Thom',
    addressKh: 'ផ្លូវជាតិលេខ ៦ ក្រុងស្ទឹងសែន ខេត្តកំពង់ធំ',
    coordinates: { lat: 12.7111, lng: 104.8887 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '062 961 210'
  },
  {
    id: 'pursat-provincial-hospital',
    name: 'Pursat Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តពោធិ៍សាត់',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 58,
    location: 'Pursat',
    phone: '052 951 210',
    openingHours: '24/7',
    description: 'Premier public provincial hospital in Pursat offering surgery and emergency medicine.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកធំជាងគេក្នុងខេត្តពោធិ៍សាត់ ផ្តល់សេវាវះកាត់ និងសង្គ្រោះបន្ទាន់ ២៤/៧។',
    services: ['Emergency Care', 'Surgery', 'Maternity', 'Laboratory'],
    address: 'National Road 5, Pursat City',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ក្រុងពោធិ៍សាត់ ខេត្តពោធិ៍សាត់',
    coordinates: { lat: 12.5388, lng: 103.9192 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '052 951 210'
  },
  {
    id: 'koh-kong-provincial-hospital',
    name: 'Koh Kong Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកោះកុង',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 49,
    location: 'Koh Kong',
    phone: '035 936 210',
    openingHours: '24/7',
    description: 'Chief coastal hospital in Khemarak Phoumin serving southwestern Cambodia.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកតំបន់ឆ្នេរខេត្តកោះកុង បម្រើសេវាព្យាបាលសុខភាពទូទៅ និងសង្គ្រោះបន្ទាន់។',
    services: ['Emergency Unit', 'General Medicine', 'Pediatrics'],
    address: 'National Road 48, Khemarak Phoumin, Koh Kong',
    addressKh: 'ផ្លូវជាតិលេខ ៤៨ ក្រុងខេមរភូមិន្ទ ខេត្តកោះកុង',
    coordinates: { lat: 11.6153, lng: 102.9838 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '035 936 210'
  },
  {
    id: 'kratie-provincial-hospital',
    name: 'Kratie Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តក្រចេះ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 51,
    location: 'Kratie',
    phone: '072 971 210',
    openingHours: '24/7',
    description: 'Primary public medical hospital in Kratie along the Mekong River corridor.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកធំប្រចាំខេត្តក្រចេះ ផ្តល់ការសង្គ្រោះបន្ទាន់ និងព្យាបាលជំងឺទូទៅ។',
    services: ['Emergency Care', 'Maternity', 'Infectious Diseases'],
    address: 'National Road 7, Kratie City',
    addressKh: 'ផ្លូវជាតិលេខ ៧ ក្រុងក្រចេះ ខេត្តក្រចេះ',
    coordinates: { lat: 12.4881, lng: 106.0188 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '072 971 210'
  },
  {
    id: 'prey-veng-provincial-hospital',
    name: 'Prey Veng Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តព្រៃវែង',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 63,
    location: 'Prey Veng',
    phone: '043 944 210',
    openingHours: '24/7',
    description: 'Major provincial hospital with updated surgical facilities and emergency department in Prey Veng.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកកម្រិតខេត្តព្រៃវែង មានបន្ទប់វះកាត់ទំនើប និងសង្គ្រោះបន្ទាន់ ២៤ ម៉ោង។',
    services: ['Emergency Care', 'Surgical Ward', 'Maternity', 'NSSF'],
    address: 'National Road 11, Prey Veng City',
    addressKh: 'ផ្លូវជាតិលេខ ១១ ក្រុងព្រៃវែង ខេត្តព្រៃវែង',
    coordinates: { lat: 11.4868, lng: 105.3253 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '043 944 210'
  },
  {
    id: 'svay-rieng-provincial-hospital',
    name: 'Svay Rieng Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តស្វាយរៀង',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.5,
    reviews: 77,
    location: 'Svay Rieng',
    phone: '044 945 210',
    openingHours: '24/7',
    description: 'Key referral hospital along National Road 1 serving Svay Rieng and Bavet economic corridor.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកខេត្តស្វាយរៀង តាមផ្លូវជាតិលេខ ១ បម្រើសេវាវេជ្ជសាស្ត្រ និងសង្គ្រោះបន្ទាន់ ២៤/៧។',
    services: ['Emergency Care', 'Trauma', 'Maternity', 'ICU'],
    address: 'National Road 1, Svay Rieng City',
    addressKh: 'ផ្លូវជាតិលេខ ១ ក្រុងស្វាយរៀង ខេត្តស្វាយរៀង',
    coordinates: { lat: 11.0879, lng: 105.7994 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '044 945 210'
  },
  {
    id: 'banteay-meanchey-provincial-hospital',
    name: 'Cambodia-Japan Friendship Hospital Mongkol Borei',
    nameKh: 'មន្ទីរពេទ្យមិត្តភាពកម្ពុជា-ជប៉ុន មង្គលបូរី (បន្ទាយមានជ័យ)',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviews: 142,
    location: 'Banteay Meanchey',
    phone: '054 958 210',
    openingHours: '24/7',
    description: 'Renowned referral hospital equipped with Japanese medical grant equipment serving the northwestern region.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកធំឈានមុខគេក្នុងខេត្តបន្ទាយមានជ័យ បំពាក់ឧបករណ៍ទំនើបជំនួយពីជប៉ុន។',
    services: ['Emergency Care', 'Specialized Surgery', 'Cardiology', 'Pediatrics'],
    address: 'National Road 5, Mongkol Borei, Banteay Meanchey',
    addressKh: 'ផ្លូវជាតិលេខ ៥ ស្រុកមង្គលបូរី ខេត្តបន្ទាយមានជ័យ',
    coordinates: { lat: 13.6672, lng: 102.8975 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '054 958 210'
  },
  {
    id: 'preah-vihear-provincial-hospital',
    name: '16 Makara Preah Vihear Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែក ១៦ មករា ព្រះវិហារ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 45,
    location: 'Preah Vihear',
    phone: '064 956 210',
    openingHours: '24/7',
    description: 'Central provincial hospital providing health care and trauma treatment in Preah Vihear.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកកណ្តាលប្រចាំខេត្តព្រះវិហារ ផ្តល់សេវាសង្គ្រោះបន្ទាន់ និងព្យាបាលទូទៅ។',
    services: ['Emergency Care', 'Maternity', 'Surgery', 'Pediatrics'],
    address: 'National Road 62, Tbeng Meanchey, Preah Vihear',
    addressKh: 'ផ្លូវជាតិលេខ ៦២ ក្រុងត្បែងមានជ័យ ខេត្តព្រះវិហារ',
    coordinates: { lat: 13.8073, lng: 104.9805 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '064 956 210'
  },
  {
    id: 'mondulkiri-provincial-hospital',
    name: 'Mondulkiri Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តមណ្ឌលគិរី',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 38,
    location: 'Mondulkiri',
    phone: '073 973 210',
    openingHours: '24/7',
    description: 'Highland public hospital providing essential and emergency health services in Sen Monorom.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកតំបន់ខ្ពង់រាបខេត្តមណ្ឌលគិរី បម្រើសេវាសង្គ្រោះបន្ទាន់ ២៤/៧។',
    services: ['Emergency Care', 'Maternity', 'Tropical Diseases'],
    address: 'National Road 76, Sen Monorom, Mondulkiri',
    addressKh: 'ផ្លូវជាតិលេខ ៧៦ ក្រុងសែនមនោរម្យ ខេត្តមណ្ឌលគិរី',
    coordinates: { lat: 12.4558, lng: 107.1881 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '073 973 210'
  },
  {
    id: 'ratanakiri-provincial-hospital',
    name: 'Ratanakiri Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តរតនគិរី',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 41,
    location: 'Ratanakiri',
    phone: '075 974 210',
    openingHours: '24/7',
    description: 'Chief public hospital in Banlung providing 24/7 medical response for the northeastern province.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកកម្រិតខេត្តរតនគិរី ផ្តល់សេវាវេជ្ជសាស្ត្រ ២៤ ម៉ោងក្នុងក្រុងបានលុង។',
    services: ['Emergency Care', 'Internal Medicine', 'Maternity'],
    address: 'National Road 78, Banlung City, Ratanakiri',
    addressKh: 'ផ្លូវជាតិលេខ ៧៨ ក្រុងបានលុង ខេត្តរតនគិរី',
    coordinates: { lat: 13.7394, lng: 106.9873 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '075 974 210'
  },
  {
    id: 'stung-treng-provincial-hospital',
    name: 'Stung Treng Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តស្ទឹងត្រែង',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 39,
    location: 'Stung Treng',
    phone: '074 972 210',
    openingHours: '24/7',
    description: 'Northern junction referral hospital serving Stung Treng and border commuters.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកខេត្តស្ទឹងត្រែង ផ្តល់សេវាពិនិត្យ ព្យាបាល និងសង្គ្រោះបន្ទាន់ ២៤/៧។',
    services: ['Emergency Care', 'Maternity', 'General Surgery'],
    address: 'National Road 7, Stung Treng Town',
    addressKh: 'ផ្លូវជាតិលេខ ៧ ក្រុងស្ទឹងត្រែង ខេត្តស្ទឹងត្រែង',
    coordinates: { lat: 13.5259, lng: 105.9683 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '074 972 210'
  },
  {
    id: 'kep-provincial-hospital',
    name: 'Kep Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកែប',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 32,
    location: 'Kep',
    phone: '036 937 210',
    openingHours: '24/7',
    description: 'Coastal provincial hospital offering immediate medical care and emergency services in Kep.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកខេត្តកែប ផ្តល់សេវាសង្គ្រោះបន្ទាន់ និងព្យាបាលអ្នកជំងឺតំបន់ឆ្នេរ។',
    services: ['Emergency Care', 'Maternity', 'General Medicine'],
    address: 'Coastal Road 33A, Kep City',
    addressKh: 'ផ្លូវជាតិលេខ ៣៣A ក្រុងកែប ខេត្តកែប',
    coordinates: { lat: 10.4829, lng: 104.3167 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '036 937 210'
  },
  {
    id: 'pailin-provincial-hospital',
    name: 'Pailin Provincial Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកខេត្តប៉ៃលិន',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.3,
    reviews: 35,
    location: 'Pailin',
    phone: '055 959 210',
    openingHours: '24/7',
    description: 'Western border hospital providing quality public medical services and emergency care in Pailin.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកខេត្តប៉ៃលិន បម្រើសេវាសង្គ្រោះបន្ទាន់ និងពិនិត្យជំងឺទូទៅ។',
    services: ['Emergency Care', 'General Medicine', 'Maternity'],
    address: 'National Road 57, Pailin City',
    addressKh: 'ផ្លូវជាតិលេខ ៥៧ ក្រុងប៉ៃលិន ខេត្តប៉ៃលិន',
    coordinates: { lat: 12.8489, lng: 102.6093 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '055 959 210'
  },
  {
    id: 'oddar-meanchey-provincial-hospital',
    name: 'Samraong Oddar Meanchey Referral Hospital',
    nameKh: 'មន្ទីរពេទ្យបង្អែកសំរោង ឧត្តរមានជ័យ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=800&q=80',
    rating: 4.4,
    reviews: 43,
    location: 'Oddar Meanchey',
    phone: '065 957 210',
    openingHours: '24/7',
    description: 'Primary public medical institution for Oddar Meanchey in Samraong.',
    descriptionKh: 'មន្ទីរពេទ្យបង្អែកសំរោង ផ្តល់សេវាសង្គ្រោះបន្ទាន់ និងព្យាបាលជំងឺជូនប្រជាពលរដ្ឋក្នុងខេត្តឧត្តរមានជ័យ។',
    services: ['Emergency Care', 'Surgery', 'Maternity'],
    address: 'National Road 68, Samraong City, Oddar Meanchey',
    addressKh: 'ផ្លូវជាតិលេខ ៦៨ ក្រុងសំរោង ខេត្តឧត្តរមានជ័យ',
    coordinates: { lat: 14.1818, lng: 103.5176 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '065 957 210'
  },
  {
    id: 'tboung-khmum-provincial-hospital',
    name: 'Cambodia-China Friendship Hospital Tboung Khmum',
    nameKh: 'មន្ទីរពេទ្យមិត្តភាពកម្ពុជា-ចិន ត្បូងឃ្មុំ',
    category: 'hospital',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviews: 110,
    location: 'Tboung Khmum',
    phone: '042 942 210',
    openingHours: '24/7',
    description: 'Ultra-modern state-of-the-art public hospital complex opened with China grant in Suong City.',
    descriptionKh: 'មន្ទីរពេទ្យរដ្ឋដ៏ទំនើបកម្រិតស្តង់ដារខ្ពស់ក្នុងក្រុងសួង ខេត្តត្បូងឃ្មុំ បំពាក់សម្ភារៈវេជ្ជសាស្ត្រទំនើបបំផុត។',
    services: ['Emergency Care', 'ICU', 'Modern Surgery', 'Cardiology', 'NSSF Care'],
    address: 'National Road 7, Suong City, Tboung Khmum',
    addressKh: 'ផ្លូវជាតិលេខ ៧ ក្រុងសួង ខេត្តត្បូងឃ្មុំ',
    coordinates: { lat: 11.9056, lng: 105.6568 },
    ownership: 'public',
    acceptsNssf: true,
    emergencyHotline: '042 942 210'
  }
]

const hospitals: Hospital[] = [...baseHospitals, ...provincialHospitals]

export function getHospitals(): Hospital[] {
  try {
    const customHosp = localStorage.getItem('camlife_custom_hospitals')
    if (customHosp) {
      const parsed: Hospital[] = JSON.parse(customHosp)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customIds = new Set(parsed.map(p => p.id))
        return [...parsed, ...hospitals.filter(h => !customIds.has(h.id))]
      }
    }
  } catch {
    // fallback
  }
  return hospitals
}

export function getHospitalById(id: string): Hospital | undefined {
  return getHospitals().find(h => h.id === id)
}

export function getGovernmentServices(): GovernmentService[] {
  try {
    const customGov = localStorage.getItem('camlife_custom_gov_services')
    if (customGov) {
      const parsed: GovernmentService[] = JSON.parse(customGov)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customIds = new Set(parsed.map(p => p.id))
        return [...parsed, ...governmentServices.filter(s => !customIds.has(s.id))]
      }
    }
  } catch {}
  return governmentServices
}

export function getGovernmentServiceById(id: string): GovernmentService | undefined {
  return getGovernmentServices().find(s => s.id === id)
}

export function getJobs(): Job[] {
  try {
    const customJobs = localStorage.getItem('camlife_user_jobs')
    if (customJobs) {
      const parsed: Job[] = JSON.parse(customJobs)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customIds = new Set(parsed.map(p => p.id))
        return [...parsed, ...jobs.filter(j => !customIds.has(j.id))]
      }
    }
  } catch {}
  return jobs
}

export function getJobById(id: string): Job | undefined {
  return getJobs().find(j => j.id === id)
}

export function getHomeServices(): HomeService[] {
  try {
    const customHS = localStorage.getItem('camlife_custom_home_services')
    if (customHS) {
      const parsed: HomeService[] = JSON.parse(customHS)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customIds = new Set(parsed.map(p => p.id))
        return [...parsed, ...homeServices.filter(s => !customIds.has(s.id))]
      }
    }
  } catch {}
  return homeServices
}

export function getHomeServiceById(id: string): HomeService | undefined {
  return getHomeServices().find(s => s.id === id)
}

export function getTransport(): Transport[] {
  try {
    const customTrans = localStorage.getItem('camlife_custom_transports')
    if (customTrans) {
      const parsed: any[] = JSON.parse(customTrans)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const cleaned: Transport[] = parsed.map(t => ({
          ...t,
          id: t.id || `trans-${Date.now()}`,
          name: t.name || 'Unnamed Transport',
          nameKh: t.nameKh || t.name || '',
          type: (['bus', 'taxi', 'train', 'plane', 'ferry'].includes(t.type) ? t.type : 'bus') as Transport['type'],
          route: t.route || (Array.isArray(t.routes) ? t.routes.join(', ') : 'Phnom Penh - Provinces'),
          schedule: t.schedule || t.openingHours || '06:00 AM - 08:00 PM',
          price: t.price || '$10 - $15',
          location: t.location || 'Phnom Penh',
          description: t.description || '',
          descriptionKh: t.descriptionKh || t.description || '',
          usefulInformation: t.usefulInformation || '',
          usefulInformationKh: t.usefulInformationKh || ''
        }))
        const customIds = new Set(cleaned.map(c => c.id))
        return [...cleaned, ...transport.filter(t => !customIds.has(t.id))]
      }
    }
  } catch {}
  return transport
}

export function getNews(): NewsItem[] {
  try {
    const customNews = localStorage.getItem('camlife_custom_news')
    if (customNews) {
      const parsed: NewsItem[] = JSON.parse(customNews)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const customIds = new Set(parsed.map(p => p.id))
        return [...parsed, ...news.filter(n => !customIds.has(n.id))]
      }
    }
  } catch {}
  return news
}

export function getNewsById(id: string): NewsItem | undefined {
  return getNews().find(n => n.id === id)
}

export function getLocations(): LocationItem[] {
  let list = locations
  try {
    const customLoc = localStorage.getItem('camlife_custom_locations')
    if (customLoc) {
      const parsed: LocationItem[] = JSON.parse(customLoc)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const baseMap = new Map(locations.map(l => [l.id, l]))
        const sanitized = parsed.map(p => {
          const base = baseMap.get(p.id)
          if (base && (!p.image || p.image.includes('images.unsplash.com'))) {
            return {
              ...p,
              name: base.name,
              nameKh: base.nameKh,
              image: base.image,
              address: base.address,
              addressKh: base.addressKh,
              description: base.description,
              descriptionKh: base.descriptionKh,
              coordinates: base.coordinates,
              phone: base.phone
            }
          }
          return p
        })
        const customIds = new Set(sanitized.map(p => p.id))
        list = [...sanitized, ...locations.filter(l => !customIds.has(l.id))]
      }
    }
  } catch {}
  return list.map(l => ({
    ...l,
    category: l.category || 'Government/OWSO',
    name: l.name || '',
    nameKh: l.nameKh || l.name || '',
    address: l.address || '',
    addressKh: l.addressKh || l.address || '',
    phone: l.phone || '+855 23 720 001',
    description: l.description || '',
    descriptionKh: l.descriptionKh || l.description || '',
    coordinates: l.coordinates || { lat: 11.5564, lng: 104.9282 }
  }))
}

export function getLocationById(id: string): LocationItem | undefined {
  return getLocations().find(l => l.id === id)
}

export function getEmergencyContacts(): EmergencyContact[] {
  return [...emergencyContacts].sort((a, b) => a.priority - b.priority)
}

function notifyDataUpdated() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('camlife-data-updated'))
  }
}

export function saveCustomGovernmentServices(services: GovernmentService[]) {
  try {
    localStorage.setItem('camlife_custom_gov_services', JSON.stringify(services))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom government services', e)
  }
}

export function saveCustomHospitals(hospList: Hospital[]) {
  try {
    localStorage.setItem('camlife_custom_hospitals', JSON.stringify(hospList))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom hospitals', e)
  }
}

export function saveCustomJobs(jobsList: Job[]) {
  try {
    localStorage.setItem('camlife_user_jobs', JSON.stringify(jobsList))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom jobs', e)
  }
}

export function saveCustomTransport(transList: Transport[]) {
  try {
    localStorage.setItem('camlife_custom_transports', JSON.stringify(transList))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom transport', e)
  }
}

export function saveCustomHomeServices(hsList: HomeService[]) {
  try {
    localStorage.setItem('camlife_custom_home_services', JSON.stringify(hsList))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom home services', e)
  }
}

export function saveCustomLocations(locList: LocationItem[]) {
  try {
    localStorage.setItem('camlife_custom_locations', JSON.stringify(locList))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom locations', e)
  }
}

export function saveCustomNews(newsList: NewsItem[]) {
  try {
    localStorage.setItem('camlife_custom_news', JSON.stringify(newsList))
    notifyDataUpdated()
  } catch (e) {
    console.error('Failed to save custom news', e)
  }
}

export function globalSearch(query: string): SearchResult[] {
  if (!query || typeof query !== 'string' || !query.trim()) return []
  const q = query.toLowerCase().trim()
  const results: SearchResult[] = []

  // Search emergency contacts
  emergencyContacts.forEach(e => {
    if (
      e.name.toLowerCase().includes(q) ||
      (e.nameKh && e.nameKh.toLowerCase().includes(q)) ||
      e.number.includes(q) ||
      (e.description && e.description.toLowerCase().includes(q)) ||
      (e.descriptionKh && e.descriptionKh.toLowerCase().includes(q)) ||
      q.includes('អាសន្ន') ||
      q.includes('សង្គ្រោះ') ||
      q.includes('emergency')
    ) {
      if (!results.some(r => r.id === e.id && r.type === 'emergency')) {
        results.push({
          id: e.id,
          title: `${e.number} - ${e.name}`,
          description: e.description || '',
          category: 'Emergency 24/7',
          type: 'emergency',
          route: '/emergency'
        })
      }
    }
  })

  // Search hospitals
  getHospitals().forEach(h => {
    if (
      h.name.toLowerCase().includes(q) ||
      (h.nameKh && h.nameKh.toLowerCase().includes(q)) ||
      (h.description && h.description.toLowerCase().includes(q)) ||
      (h.descriptionKh && h.descriptionKh.toLowerCase().includes(q)) ||
      h.category.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      (h.address && h.address.toLowerCase().includes(q)) ||
      (h.addressKh && h.addressKh.toLowerCase().includes(q)) ||
      (h.services && h.services.some(s => s.toLowerCase().includes(q)))
    ) {
      if (!results.some(r => r.id === h.id && r.type === 'hospital')) {
        results.push({
          id: h.id,
          title: h.name,
          description: h.description,
          category: h.category,
          type: 'hospital',
          route: `/health/${h.id}`
        })
      }
    }
  })

  // Search government services
  getGovernmentServices().forEach(s => {
    if (
      s.title.toLowerCase().includes(q) ||
      (s.titleKh && s.titleKh.toLowerCase().includes(q)) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
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
  getJobs().forEach(j => {
    if (
      j.title.toLowerCase().includes(q) ||
      (j.titleKh && j.titleKh.toLowerCase().includes(q)) ||
      j.company.toLowerCase().includes(q) ||
      (j.description && j.description.toLowerCase().includes(q)) ||
      (j.descriptionKh && j.descriptionKh.toLowerCase().includes(q)) ||
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
  getHomeServices().forEach(s => {
    if (
      s.serviceName.toLowerCase().includes(q) ||
      (s.serviceNameKh && s.serviceNameKh.toLowerCase().includes(q)) ||
      s.provider.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q)) ||
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
  getTransport().forEach(t => {
    if (
      t.name.toLowerCase().includes(q) ||
      (t.nameKh && t.nameKh.toLowerCase().includes(q)) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      (t.descriptionKh && t.descriptionKh.toLowerCase().includes(q)) ||
      t.type.toLowerCase().includes(q) ||
      (t.route && t.route.toLowerCase().includes(q)) ||
      (t.location && t.location.toLowerCase().includes(q))
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
  getNews().forEach(n => {
    if (
      n.title.toLowerCase().includes(q) ||
      (n.titleKh && n.titleKh.toLowerCase().includes(q)) ||
      (n.description && n.description.toLowerCase().includes(q)) ||
      (n.descriptionKh && n.descriptionKh.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q)
    ) {
      results.push({
        id: n.id,
        title: n.title,
        description: n.description,
        category: n.category,
        type: 'news',
        route: `/news/${n.id}`
      })
    }
  })

  // Search locations
  getLocations().forEach(l => {
    if (
      l.name.toLowerCase().includes(q) ||
      (l.nameKh && l.nameKh.toLowerCase().includes(q)) ||
      (l.description && l.description.toLowerCase().includes(q)) ||
      (l.descriptionKh && l.descriptionKh.toLowerCase().includes(q)) ||
      l.category.toLowerCase().includes(q) ||
      (l.address && l.address.toLowerCase().includes(q)) ||
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
