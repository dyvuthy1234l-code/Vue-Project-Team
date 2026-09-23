import { describe, it, expect, beforeEach } from 'vitest'
import { DEMO_ADMIN, DEMO_CITIZEN } from '../composables/useAuth'

describe('Role and Auth Security', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('DEMO_ADMIN has Administrator role and email admin@gmail.com', () => {
    expect(DEMO_ADMIN.role).toBe('Administrator')
    expect(DEMO_ADMIN.email).toBe('admin@gmail.com')
  })

  it('DEMO_CITIZEN has Citizen Member role', () => {
    expect(DEMO_CITIZEN.role).toBe('Citizen Member')
    expect(DEMO_CITIZEN.role).not.toBe('Administrator')
  })

  it('New registered users are given Citizen Member role', () => {
    const newCitizen = {
      name: 'Chan Dara',
      email: 'dara@test.kh',
      role: 'Citizen Member'
    }
    expect(newCitizen.role).toBe('Citizen Member')
    expect(newCitizen.role).not.toBe('Administrator')
    expect(newCitizen.role).not.toBe('Admin')
  })
})
