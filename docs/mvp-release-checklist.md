# Pre-Launch MVP Checklist for Render (app.canai.so)

Use this checklist to track readiness for production. Check off each item when complete.

## 1) Testing and Stability
- [x] Unit tests green
  - [x] Run `npm run test:unit` (Vitest globals enabled; e2e excluded)
- [x] E2E tests stable (Playwright)
  - [x] Server bound to `127.0.0.1:8080`; Playwright baseURL/port match
  - [x] Install browsers: `npx playwright install`
  - [ ] Selector sanity:
    - [ ] Landlord: `Full Name`, `Phone Number`, `Email Address`, `Mailing Address`
    - [ ] Tenant: `Full Name`, `Emergency Contact Name`, `Emergency Contact Phone`
    - [ ] Property: `Property Address`, `Property Type`, `Number of Bedrooms`, `Number of Bathrooms`, `Furnished Status`
  - [ ] Use exact getByLabel strings as above; add waits between steps (selector hooks added):
    - [ ] `await expect(locator).toBeVisible()` after clicking Next before interacting
  - [x] Local dry-run: `npx playwright test --project=chromium`
  - [x] Optional: increase per-test timeout to 60s if needed
  - [x] Run `npm run test:e2e` → Chromium baseline passes
  - [x] CI reporter: enable Playwright JUnit reporter and save artifacts
- [ ] Axe checks (post-launch)
  - [x] Keep CI axe placeholder; add jest-axe tests next iteration

## 2) Dependencies and Build
- [x] `pdf-lib` installed and used (no dead imports)
- [x] Build success: `npm run build` → `dist/` generated
- [x] Env vars via Vite: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` (no hard-coded keys)


## 3) App Behavior (MVP Scope)
- [x] Step gating via `useStepValidity` (Next disabled until valid)
- [x] Ontario-specific UI
  - [x] Security Deposit hidden
  - [x] Late Fee disabled and note shown
  - [x] Rent Deposit visible with guideline interest note
- [x] Validation surface
  - [x] Inline errors from `validateTerms()` show correctly
  - [x] Province notes render in Terms
- [x] Clause library (ON)
  - [x] “Act Prevails” and “Human Rights/Service Animals” mandatory clauses present and editable
- [x] PDF generation
  - [x] Generate PDF creates file with compliance block
  - [x] Signature canvases present; signature visible in PDF block/metadata
  - [x] Signature audit: SHA-256 hash and timestamp captured (metadata and/or visible block)
- [x] Ontario Standard Lease
  - [x] Deep link shows in Preview when `ON`
  - [x] Prefill builder stub present (future work)
 - [x] Preview disclaimer: “The Act prevails” visible in Preview step

## 4) Supabase Configuration
- [x] Client
  - [x] Env-based URL/Anon key; no source-embedded keys
- [ ] Storage
  - [x] Bucket `agreements` exists
  - [x] RLS policies applied (`supabase/policies.sql`)
  - [ ] Path convention: `agreements/{userId}/{agreementId}.pdf`
  - [ ] Path naming matches Storage RLS expression (first folder = `auth.uid()`)
- [ ] Database rules
  - [x] Currency defaults `CAD` on `leases` (see `supabase/db_rules.sql`) _(lease_payments pending if added later)_
  - [x] Province fields `varchar(2)` with length checks
  - [x] Deposits: split fields + constraints
    - [x] ON: `security_deposit_amount = 0`
    - [x] Non-ON: `rent_deposit_amount = 0` (if enforced)
    - [x] `deposit_amount` consistent with split (or dropped)
  - [x] `lease_documents.hash` SHA-256 check
  - [x] Indexes on FKs and key fields
  - [x] RLS enabled on app tables; policies scoped by `landlord_id` (child tables via `EXISTS` joins)
  - [x] `updated_at` triggers installed

## 5) CI/CD
- [x] CI job runs lint, unit, e2e, build
  - [x] Playwright browsers install step in CI
  - [x] Artifact retention for `dist/`
  - [x] JUnit outputs saved for unit (Vitest) and E2E (Playwright)
- [x] Render deploy hooks wired in CI
  - [x] Staging on push to main via `RENDER_DEPLOY_HOOK_STAGING`
  - [x] Production on tags `v*` via `RENDER_DEPLOY_HOOK_PROD`
  - [ ] Repo connected in Render dashboard
  - [ ] Build command: `npm ci && npm run build`
  - [ ] Publish dir: `dist`
  - [ ] Env vars set in Render dashboard
- [ ] Domain
  - [ ] `app.canai.so` CNAME → Render static hostname
  - [ ] TLS certificate active
 - [ ] Monitoring
   - [ ] Sentry DSN set for production (optional to enable at launch)
   - [ ] Basic web-vitals logging enabled (or planned next)

## 6) Docs and Governance
- [x] `docs/LEGAL_CHANGELOG.md` updated (sources + dates; “Act prevails”)
- [x] `docs/PRIVACY.md` (PIPEDA-aware), `docs/TERMS.md`, `docs/SECURITY.md` present
- [x] `docs/canada-rules-test-plan.md` updated (ON UI, PDF smoke, compliance banner)
- [x] `src/lib/canadaRentalRules.ts` has `lastUpdated`
  - [x] Feature test plan for this release added (per project rule)
  - [x] Taskmaster subtask created: “Create Vitest skeleton for validation hooks and terms step”
  - [x] `docs/vision-workback-plan.md` created (dream state → workback)
  - [x] `docs/test-failures-audit.md` created from JUnit reports
  - [x] Supabase schema context captured (`supabase/schema_context.sql`)

## 7) i18n and A11y (Baseline)
- [x] i18n scaffold plan noted (EN now, FR post-launch)
- [x] A11y labels verified for key fields; focus/contrast acceptable (baseline)
- [ ] Add jest-axe tests post-launch

## 8) Release Management
- [ ] Tag release `v0.1.0` (MVP)
- [ ] Changelog / Release notes include known limitations:
  - [ ] ON SFL prefill pending
  - [ ] Province clause libraries beyond ON
  - [ ] Saved drafts/auth optional
- [ ] Staging smoke test on Render preview URL
- [ ] Promote to `app.canai.so` once verified
 - [ ] DNS/TLS verified in browser (lock icon); ON flow generates PDF; ON SFL link opens

---

### Commands Reference
- Install deps: `npm install`
- Install Playwright browsers: `npx playwright install`
- Unit tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`
- Build: `npm run build`

### Notes
- The Act prevails. This app provides general legal information and not legal advice.
- Ensure Render environment secrets are set before the first deploy.