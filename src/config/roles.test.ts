import { describe, expect, it } from 'vitest'
import { getRoleExperience } from '@/config/roles'

describe('getRoleExperience', () => {
  it('returns a richer experience profile for admin users', () => {
    const experience = getRoleExperience('admin')

    expect(experience.title).toContain('Admin')
    expect(experience.badge).toContain('Admin')
    expect(experience.actions).toContain('Manage campus operations')
  })

  it('returns a tailored student experience', () => {
    const experience = getRoleExperience('student')

    expect(experience.title).toContain('Student')
    expect(experience.accent).toBe('from-amber-500 to-orange-500')
  })
})
