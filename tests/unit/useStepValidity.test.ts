import { describe, it, expect } from 'vitest'
import { getStepValidity } from '@/lib/hooks/useStepValidity'

describe('useStepValidity/getStepValidity', () => {
  const base = {
    jurisdiction: { provinceCode: 'ON' as any },
    landlord: { name: 'LL', address: 'A', phone: '1', email: '' },
    tenant: { name: 'TT', phone: '1', email: '', emergencyContact: 'EC', emergencyPhone: '1' },
    property: { address: 'Addr', type: 'apartment', bedrooms: '1', bathrooms: '1', furnished: 'unfurnished', parking: 'none' },
    terms: { rentAmount: '1800', securityDeposit: '', leaseStart: '2025-01-01', leaseEnd: '2026-01-01', rentDueDate: '1st', lateFeesAmount: '', lateFeesGracePeriod: '5' },
    clauses: { petsAllowed: '', smokingAllowed: '', sublettingAllowed: '', maintenanceResponsibility: '', earlyTermination: '', renewalTerms: '' }
  } as any

  it('blocks step 1 without province', () => {
    const d = { ...base, jurisdiction: { provinceCode: '' } }
    const r = getStepValidity(d, 1)
    expect(r.isValid).toBe(false)
  })

  it('requires mandatory clauses on step 6', () => {
    const d = { ...base, clauses: { ...base.clauses, petsAllowed: 'no-pets', smokingAllowed: 'no-smoking', sublettingAllowed: 'not-allowed', maintenanceResponsibility: 'landlord-all', earlyTermination: 'not-allowed' } }
    const r = getStepValidity(d, 6)
    expect(r.isValid).toBe(false)
    expect(r.errors.join(' ')).toMatch(/mandatory clauses/i)
  })
})

import { describe, it, expect } from 'vitest'
import { getStepValidity } from '@/lib/hooks/useStepValidity'

const base = {
  jurisdiction: { provinceCode: '' },
  landlord: { name: '', address: '', phone: '', email: '' },
  tenant: { name: '', phone: '', email: '', emergencyContact: '', emergencyPhone: '' },
  property: { address: '', type: '', bedrooms: '', bathrooms: '', furnished: '', parking: '' },
  terms: { rentAmount: '', securityDeposit: '', leaseStart: '', leaseEnd: '', rentDueDate: '', lateFeesAmount: '', lateFeesGracePeriod: '' },
  clauses: { petsAllowed: '', smokingAllowed: '', sublettingAllowed: '', maintenanceResponsibility: '', earlyTermination: '', renewalTerms: '' },
} as any

describe('useStepValidity', () => {
  it('step 1 invalid without province', () => {
    const r = getStepValidity(base, 1)
    expect(r.isValid).toBe(false)
  })

  it('step 5 enforces ON late fee/security deposit prohibitions', () => {
    const d = { ...base, jurisdiction: { provinceCode: 'ON' }, terms: { ...base.terms, rentAmount: '2000', securityDeposit: '100', leaseStart: '2025-01-01', leaseEnd: '2025-12-31', rentDueDate: '1st', lateFeesAmount: '10' } }
    const r = getStepValidity(d, 5)
    expect(r.isValid).toBe(false)
    expect(r.errors.some(e => /not permitted/i.test(e))).toBe(true)
  })
})

