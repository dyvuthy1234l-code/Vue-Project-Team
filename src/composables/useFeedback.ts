import { ref } from 'vue'

export interface ServiceFeedback {
  id: string
  serviceId: string
  serviceTitle: string
  isHelpful: boolean
  comment?: string
  createdAt: string
}

export interface ServiceReport {
  id: string
  serviceId: string
  serviceTitle: string
  reason: 'incorrect-fee' | 'wrong-phone' | 'outdated-info' | 'wrong-location' | 'other'
  reasonLabel: string
  details: string
  contactEmail?: string
  status: 'pending' | 'verified' | 'resolved'
  createdAt: string
}

const feedbacks = ref<ServiceFeedback[]>(
  JSON.parse(localStorage.getItem('camlife-feedbacks') || '[]')
)

const reports = ref<ServiceReport[]>(
  JSON.parse(localStorage.getItem('camlife-reports') || '[]')
)

// Populate initial sample reports if empty so Admin dashboard looks realistic
if (reports.value.length === 0) {
  reports.value = [
    {
      id: 'rep-01',
      serviceId: 'driving-license',
      serviceTitle: 'Cambodian Driver License Renewal',
      reason: 'outdated-info',
      reasonLabel: 'Outdated office hours',
      details: 'Aeon 2 driver license center now opens at 9:00 AM instead of 8:00 AM on weekends.',
      contactEmail: 'citizen.k@example.com',
      status: 'pending',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: 'rep-02',
      serviceId: 'passport-application',
      serviceTitle: 'Cambodian Passport Application',
      reason: 'incorrect-fee',
      reasonLabel: 'Official fee update',
      details: 'Express 1-day passport fee details verified against GDI announcement.',
      contactEmail: 'sokha@example.com',
      status: 'verified',
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ]
  localStorage.setItem('camlife-reports', JSON.stringify(reports.value))
}

export function useFeedback() {
  function submitFeedback(serviceId: string, serviceTitle: string, isHelpful: boolean, comment?: string) {
    const item: ServiceFeedback = {
      id: `fb-${Date.now()}`,
      serviceId,
      serviceTitle,
      isHelpful,
      comment,
      createdAt: new Date().toISOString()
    }
    feedbacks.value.unshift(item)
    localStorage.setItem('camlife-feedbacks', JSON.stringify(feedbacks.value))
    return item
  }

  function submitReport(
    serviceId: string,
    serviceTitle: string,
    reason: ServiceReport['reason'],
    reasonLabel: string,
    details: string,
    contactEmail?: string
  ) {
    const item: ServiceReport = {
      id: `rep-${Date.now()}`,
      serviceId,
      serviceTitle,
      reason,
      reasonLabel,
      details,
      contactEmail,
      status: 'pending',
      createdAt: new Date().toISOString()
    }
    reports.value.unshift(item)
    localStorage.setItem('camlife-reports', JSON.stringify(reports.value))
    return item
  }

  function updateReportStatus(reportId: string, status: ServiceReport['status']) {
    const r = reports.value.find(item => item.id === reportId)
    if (r) {
      r.status = status
      localStorage.setItem('camlife-reports', JSON.stringify(reports.value))
    }
  }

  return {
    feedbacks,
    reports,
    submitFeedback,
    submitReport,
    updateReportStatus
  }
}
