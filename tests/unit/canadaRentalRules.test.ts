import { describe, it, expect } from 'vitest'
import { validateTerms } from '@/lib/canadaRentalRules'

describe('canadaRentalRules.validateTerms', () => {
  it('BC: caps security at half month and late fee at 25', () => {
    const r = validateTerms('BC' as any, 2000, 1200, 30)
    expect(r.errors.some(e => e.includes('exceeds'))).toBe(true)
    expect(r.errors.some(e => e.includes('cap of $25'))).toBe(true)
  })

  it('ON: blocks security deposit, allows rent deposit warning', () => {
    const r = validateTerms('ON' as any, 1800, 100, 10)
    expect(r.errors.some(e => e.toLowerCase().includes('not permitted'))).toBe(true)
  })

  it('AB: security up to one month; no error within limit', () => {
    const r = validateTerms('AB' as any, 1500, 1500, 50)
    expect(r.errors.length).toBe(0)
  })
})

