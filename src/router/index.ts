import { createRouter, createWebHistory } from 'vue-router'

const STORAGE_KEY = 'camlife-user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomePage.vue')
    },
    {
      path: '/health',
      name: 'health',
      component: () => import('@/views/HealthPage.vue')
    },
    {
      path: '/health/:id',
      name: 'health-detail',
      component: () => import('@/views/HealthDetailPage.vue')
    },
    {
      path: '/government',
      name: 'government',
      component: () => import('@/views/GovernmentPage.vue')
    },
    {
      path: '/government/:id',
      name: 'government-detail',
      component: () => import('@/views/GovernmentDetailPage.vue')
    },
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/views/JobsPage.vue')
    },
    {
      path: '/jobs/:id',
      name: 'job-detail',
      component: () => import('@/views/JobDetailPage.vue')
    },
    {
      path: '/saved-jobs',
      redirect: '/saved-services?tab=jobs'
    },
    {
      path: '/saved-services',
      name: 'saved-services',
      component: () => import('@/views/SavedServicesPage.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfilePage.vue')
    },
    {
      path: '/partner-register',
      name: 'partner-register',
      component: () => import('@/views/PartnerRegisterPage.vue')
    },
    {
      path: '/admin/:tab?',
      name: 'admin',
      component: () => import('@/views/AdminDashboard.vue'),
      meta: { requiresAdmin: true }
    },
    {
      path: '/home-services',
      name: 'home-services',
      component: () => import('@/views/HomeServicesPage.vue')
    },
    {
      path: '/transport',
      name: 'transport',
      component: () => import('@/views/TransportPage.vue')
    },
    {
      path: '/emergency',
      name: 'emergency',
      component: () => import('@/views/EmergencyPage.vue')
    },
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/NewsPage.vue')
    },
    {
      path: '/news/:id',
      name: 'news-detail',
      component: () => import('@/views/NewsDetailPage.vue')
    },
    {
      path: '/locations',
      name: 'locations',
      component: () => import('@/views/LocationsPage.vue')
    },
    {
      path: '/locations/:id',
      name: 'location-detail',
      component: () => import('@/views/LocationDetailPage.vue')
    },
    {
      path: '/contact',
      name: 'contact',
      component: () => import('@/views/ContactPage.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('@/views/AboutPage.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundPage.vue')
    }
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  }
})

// Navigation Guard: strictly protect admin routes
router.beforeEach((to, _from, next) => {
  if (to.meta.requiresAdmin) {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) {
        const user = JSON.parse(data)
        if (user.role === 'Administrator' || user.role === 'Admin') {
          return next()
        }
      }
    } catch {
      // ignore parse errors
    }
    // Block non-admin users and unregistered visitors from entering Admin CMS
    return next({ path: '/' })
  }
  next()
})

export default router
