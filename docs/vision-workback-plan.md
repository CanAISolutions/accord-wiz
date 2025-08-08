# Vision → Workback Plan

- Vision: Full Canadian lease generation with province-specific templates, clause libraries, and e-sign workflows.
- Phase 1 (MVP): Wizard, ON UI rules, PDF generation with compliance and signature audit, ON SFL deep link, Supabase RLS.
  - Status: UI gating complete; ON toggles implemented; selector stability and a11y label improvements added; PDF compliance block + signature audit implemented; CI workflow in repo (lint, unit, e2e, build with JUnit + artifacts); legal/privacy/security docs added; i18n plan and a11y log stubs added; Supabase schema context captured; DB rules SQL added (`supabase/db_rules.sql`).
  - Remaining: Run green unit/e2e locally and in CI; build `dist/`; Render config (envs, build/publish, DNS/TLS); create `agreements` bucket and apply RLS; optional file upload to Supabase Storage per RLS path convention.
- Phase 2: ON SFL prefill via pdf-lib form fields; jest-axe a11y tests; FR i18n; saved drafts; Supabase tables (leases, lease_documents) and storage upload wiring.
- Phase 3: Province-specific clause libraries; payment schedules; landlord portal.
