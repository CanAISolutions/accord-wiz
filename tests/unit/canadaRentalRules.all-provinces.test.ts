import { describe, it, expect } from 'vitest'
import { PROVINCES, validateTerms, RULES } from '@/lib/canadaRentalRules'

describe('validateTerms across provinces', () => {
  it('ON prohibits security deposit and late fee', () => {
    const r = validateTerms('ON' as any, 2000, 1, 10)
    expect(r.errors.some(e => /not permitted/i.test(e))).toBe(true)
    const r2 = validateTerms('ON' as any, 2000, 0, 1)
    expect(r2.errors.some(e => /late fees are restricted/i.test(e))).toBe(true)
  })

  it('BC caps late fee and security to 0.5 months', () => {
    const r = validateTerms('BC' as any, 2000, 1200, 30)
    expect(r.errors.some(e => e.includes('exceeds'))).toBe(true)
    expect(r.errors.some(e => e.includes('cap of $25'))).toBe(true)
  })

  it('AB allows up to 1 month security without error', () => {
    const r = validateTerms('AB' as any, 1500, 1500, 0)
    expect(r.errors.length).toBe(0)
  })

  it('All provinces defined with names', () => {
    for (const p of PROVINCES) {
      expect(RULES[p.code as keyof typeof RULES].name).toBeTruthy()
    }
  })
})

