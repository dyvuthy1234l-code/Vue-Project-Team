import { ref } from 'vue'

export interface User {
  name: string
  email: string
  phone?: string
  role?: string
  avatar?: string
  department?: string
  bio?: string
  nationalId?: string
  province?: string
  occupation?: string
  gender?: string
  lastLogin?: string
}

export const DEMO_CITIZEN: User = {
  name: 'សុខ វុទ្ធី (Sok Vuthy)',
  email: 'sok.vuthy@camlife.kh',
  phone: '012 345 678',
  nationalId: '010198765',
  province: 'រាជធានីភ្នំពេញ',
  occupation: 'បុគ្គលិកក្រុមហ៊ុនឯកជន',
  gender: 'ប្រុស',
  role: 'Citizen Member',
  bio: 'ប្រជាពលរដ្ឋសកម្មប្រើប្រាស់សេវាឌីជីថលជាតិ CamLife'
}

export const DEMO_ADMIN: User = {
  name: 'Admin Officer',
  email: 'admin@gmail.com',
  phone: '023 888 999',
  nationalId: '010000001',
  province: 'រាជធានីភ្នំពេញ',
  occupation: 'មន្ត្រីរាជការសាធារណៈ',
  gender: 'ប្រុស',
  role: 'Administrator',
  bio: 'អ្នកគ្រប់គ្រងប្រព័ន្ធថ្នាលសេវាសាធារណៈជាតិ CamLife'
}

const STORAGE_KEY = 'camlife-user'

function getInitialUser(): User | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

const currentUser = ref<User | null>(getInitialUser())
const isAuthModalOpen = ref(false)
const authModalTab = ref<'login' | 'register'>('login')

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      currentUser.value = getInitialUser()
    }
  })
}

export function useAuth() {
  const isLoggedIn = () => currentUser.value !== null

  function openLogin() {
    authModalTab.value = 'login'
    isAuthModalOpen.value = true
  }

  function openRegister() {
    authModalTab.value = 'register'
    isAuthModalOpen.value = true
  }

  function closeAuthModal() {
    isAuthModalOpen.value = false
  }

  function login(user: User) {
    currentUser.value = user
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } catch {
      // ignore storage errors
    }
    closeAuthModal()
  }

  function loginAsDemoCitizen() {
    login(DEMO_CITIZEN)
  }

  function loginAsDemoAdmin() {
    login(DEMO_ADMIN)
  }

  function updateProfile(updatedFields: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updatedFields }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser.value))
      } catch {
        // ignore storage errors
      }
    }
  }

  function logout() {
    currentUser.value = null
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore storage errors
    }
  }

  return {
    currentUser,
    isLoggedIn,
    isAuthModalOpen,
    authModalTab,
    DEMO_CITIZEN,
    DEMO_ADMIN,
    openLogin,
    openRegister,
    closeAuthModal,
    login,
    loginAsDemoCitizen,
    loginAsDemoAdmin,
    updateProfile,
    logout
  }
}
