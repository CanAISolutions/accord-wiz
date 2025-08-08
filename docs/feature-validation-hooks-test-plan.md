# Feature Test Plan: Validation Hooks and Terms Step

- Objective: Ensure `useStepValidity` enforces step gating and province-aware term validation.
- Scope: Steps 1–6 with focus on step 5 (Terms) and step 6 (Clauses) mandatory fields.
- Cases:
  - Jurisdiction required (step 1), Next disabled initially.
  - Landlord/Tenant schema requires either phone or email; errors surface.
  - ON: security deposit value triggers error; late fee disabled.
  - BC: security deposit > 0.5×rent yields error; late fee > $25 yields error.
  - Clauses: Act Prevails & Human Rights fields required; Next disabled until filled.
- Logging: Test results exported as JUnit.
