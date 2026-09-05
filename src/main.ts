import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css'

// Ensure dark mode is stripped and project stays in standard light theme
try {
  localStorage.removeItem('camlife-dark-mode')
  document.documentElement.classList.remove('dark')
} catch {
  // ignore
}

const app = createApp(App)
app.use(router)
app.mount('#app')
