import { describe, it, expect, beforeEach } from 'vitest'
import { createApp, h } from 'vue'
import { createRouter, createMemoryHistory } from 'vue-router'
import AdminOverview from '../components/admin/AdminOverview.vue'
import AdminGovernment from '../components/admin/AdminGovernment.vue'
import AdminHealthcare from '../components/admin/AdminHealthcare.vue'
import AdminJobs from '../components/admin/AdminJobs.vue'
import AdminTransport from '../components/admin/AdminTransport.vue'
import AdminHomeServices from '../components/admin/AdminHomeServices.vue'
import AdminOffices from '../components/admin/AdminOffices.vue'
import AdminNews from '../components/admin/AdminNews.vue'
import AdminUsers from '../components/admin/AdminUsers.vue'
import AdminFeedback from '../components/admin/AdminFeedback.vue'
import AdminSubmissions from '../components/admin/AdminSubmissions.vue'
import AdminSettings from '../components/admin/AdminSettings.vue'
import AdminLogs from '../components/admin/AdminLogs.vue'

describe('Admin Components Render Test', () => {
  let router: any

  beforeEach(() => {
    router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: '/', component: { template: '<div>Home</div>' } },
        { path: '/admin/:tab?', component: { template: '<div>Admin</div>' } }
      ]
    })
    localStorage.setItem('camlife-user', JSON.stringify({
      name: 'Admin Officer',
      email: 'admin@gmail.com',
      role: 'Administrator'
    }))
  })

  function testMount(component: any) {
    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render: () => h(component)
    })
    app.use(router)
    app.mount(container)
    expect(container.innerHTML.length).toBeGreaterThan(50)
    app.unmount()
    container.remove()
  }

  it('renders AdminOverview', () => testMount(AdminOverview))
  it('renders AdminGovernment', () => testMount(AdminGovernment))
  it('renders AdminHealthcare', () => testMount(AdminHealthcare))
  it('renders AdminJobs', () => testMount(AdminJobs))
  it('renders AdminTransport', () => testMount(AdminTransport))
  it('renders AdminHomeServices', () => testMount(AdminHomeServices))
  it('renders AdminOffices', () => testMount(AdminOffices))
  it('renders AdminNews', () => testMount(AdminNews))
  it('renders AdminUsers', () => testMount(AdminUsers))
  it('renders AdminFeedback', () => testMount(AdminFeedback))
  it('renders AdminSubmissions', () => testMount(AdminSubmissions))
  it('renders AdminSettings', () => testMount(AdminSettings))
  it('renders AdminLogs', () => testMount(AdminLogs))

  it('renders AdminTransport with malformed custom transport in localStorage', () => {
    // Malformed transport missing type, route, schedule, price
    localStorage.setItem('camlife_custom_transports', JSON.stringify([
      {
        id: 'trans-malformed-1',
        name: 'Bad Bus Operator',
        nameKh: 'រថយន្តខូច'
      }
    ]))

    const container = document.createElement('div')
    document.body.appendChild(container)
    const app = createApp({
      render: () => h(AdminTransport)
    })
    app.use(router)
    
    // Expect this either to mount or we catch the exact error
    let error: any = null
    app.config.errorHandler = (err) => {
      error = err
    }
    app.mount(container)
    if (error) {
      console.error('MOUNT ERROR CAUGHT:', error)
    }
    expect(error).toBeNull()
    app.unmount()
    container.remove()
  })
})
