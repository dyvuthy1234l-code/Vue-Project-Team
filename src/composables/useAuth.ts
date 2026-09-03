import { ref } from 'vue'

export interface User {
  name: string
  email: string
  phone?: string
  role?: string
  avatar?: string
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    closeAuthModal()
  }

  function logout() {
    currentUser.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    currentUser,
    isLoggedIn,
    isAuthModalOpen,
    authModalTab,
    openLogin,
    openRegister,
    closeAuthModal,
    login,
    logout
  }
}
