# Engineering Status Dashboard

## Dream State (North Star)
- Canadian rental agreement SaaS with province/territory-compliant flows
- ON Standard Form of Lease fully prefilled via pdf-lib; templates for other jurisdictions
- Robust clause libraries per jurisdiction; e-sign & audit trail; secure storage (RLS)
- Production CI/CD with observability (Sentry, web-vitals) and FR i18n

## Completed (MVP Scope)
- Wizard with gating via `useStepValidity`
- Ontario-specific UI: security deposit hidden, late fee disabled, rent deposit + note
- Inline validation surfaces from `validateTerms()`; province notes shown
- Mandatory ON clauses: “Act Prevails”, “Human Rights/Service Animals” (editable)
- PDF generation with compliance banner + rules `lastUpdated`
- Signature capture + audit (SHA-256 prefix + timestamp in PDF)
- ON Standard Lease deep link in Preview; disclaimer rendered
- CI workflow: lint → unit (Vitest/JUnit) → e2e (Playwright/JUnit) → build + artifacts
- Docs: Legal Changelog (sources, dates), Privacy, Terms, Security, Test Plans, Workback, Failures Audit
- Supabase: client via env; storage RLS policies file; schema context captured for future DB work

## In Progress / Remaining for MVP
- Ensure green local + CI runs and build `dist/`
- Render: connect repo, set env vars, build/publish to `dist/`, DNS/TLS verification for `app.canai.so`
- Supabase storage: confirm path convention `agreements/{auth.uid()}/{agreementId}.pdf` aligns with RLS
- (Optional now, Phase 2) Upload PDF to Supabase Storage with metadata hash
- A11y baseline verification; i18n plan note (EN now, FR post-launch)

## Build & Test Steps (Current)
- Unit tests: `npm run test:unit` (JUnit at `test-results/vitest/results.xml`)
- E2E tests: `npm run test:e2e` (JUnit at `test-results/playwright/results.xml`)
- Build: `npm run build` → produces `dist/`
- CI: `.github/workflows/ci.yml` (artifacts: `test-results/`, `coverage/`, `dist/`)

## References
- Checklist: `docs/mvp-release-checklist.md`
- Workback Plan: `docs/vision-workback-plan.md`
- Legal Sources: `docs/LEGAL_CHANGELOG.md`
- Supabase Policies: `supabase/policies.sql`; Schema Context: `supabase/schema_context.sql`

## Next Actions
- Run tests/build locally → fix any red
- Configure Render (env, build, publish dir, domain)
- Verify staging → promote to `app.canai.so`
