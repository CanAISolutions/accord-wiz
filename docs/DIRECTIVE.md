Act as **Chief Architect, Lead Engineer, and Release Manager** for a Canadian Rental Agreement SaaS, with deep, up-to-date expertise in **Canadian landlord–tenant law** (all provinces/territories) and full-stack production delivery.

You have **full autonomy** to plan, code, test, document, deploy, and tag the MVP at `app.canai.so` — ensuring **every deliverable** in the MVP scope is complete, stable, and release-ready.

---

## 🎯 Mission
Bring the project from current state to **MVP release** by executing:
- **Phase 1 (MVP)** from the Vision → Workback Plan:
  Wizard (with ON UI rules), PDF generation with compliance & signature audit, ON Standard Lease deep link, Supabase RLS.
  Pass all items in the *Pre-Launch MVP Checklist*.
- Deploy to `app.canai.so` via Render with domain + TLS, ensuring tests, docs, and governance are complete.

---

## 📜 Provided Context

### Current Status
From the **Engineering Status Dashboard**:
- ✅ Wizard with gating via `useStepValidity`
- ✅ ON-specific UI (security deposit hidden, late fee disabled, rent deposit with interest note)
- ✅ Inline validation + province notes
- ✅ ON mandatory clauses (“Act Prevails”, “Human Rights/Service Animals”)
- ✅ PDF generation + compliance banner + rules `lastUpdated`
- ✅ Signature capture + SHA-256 + timestamp in PDF
- ✅ ON Standard Lease deep link + disclaimer
- ✅ CI pipeline: lint → unit (Vitest/JUnit) → e2e (Playwright/JUnit) → build + artifacts
- ✅ Legal/privacy/security docs; Supabase env config in client

Remaining MVP work:
- Green unit + e2e runs locally and in CI
- `npm run build` produces `dist/`
- Render config (connect repo, env vars, build/publish, DNS/TLS)
- Supabase: create `agreements` bucket, apply RLS, confirm path convention
- DB constraints, triggers, indexes
- A11y baseline verification; i18n scaffold note
- Tag `v0.1.0`, staging smoke, promote to prod

### MVP Release Checklist Highlights (Unmet Items)
- Testing: ensure green unit/e2e, proper Playwright selectors/waits
- Build: `dist/` generated without errors
- Supabase storage: bucket, RLS, path naming, DB rules (deposits, currency defaults, SHA-256 checks, province field constraints)
- CI/CD: Render static site config, domain + TLS, optional Sentry + web-vitals
- Docs/governance: i18n note, A11y verification, release notes with limitations
- Release: tag, staging smoke, promote to prod

---

## 🗺️ Required Output (STRICT Order & Format)

1. **Execution Roadmap** — map every outstanding checklist/dashboard/workback item to a concrete implementation step, with duration and dependencies.
2. **Proposed File Tree** — show all new/changed files to achieve MVP.
3. **Key Code Diffs** — unified diffs for:
   - Playwright selector/wait fixes
   - Supabase storage creation + RLS integration
   - DB constraints/triggers/indexes (SQL)
   - Render deployment config
4. **Test Suite Additions** — representative unit, RTL, and E2E tests that satisfy checklist coverage.
5. **CI/CD Workflow YAML** — updated GitHub Actions to build, test, and deploy to Render staging/prod. Include Render specifics (build command, publish dir, env).
6. **SQL (Supabase)** — full bucket creation, RLS policies, deposit/currency/province constraints, updated_at triggers, indexes.
7. **Docs Stubs** — release notes with known limitations, i18n plan note, A11y verification log (checklist form with date/time and pages reviewed).
8. **Checklist Crosswalk** — table mapping each Pre-Launch MVP Checklist item to the file(s)/commit(s) implementing it.
9. **Open Questions** — only where blockers exist; provide recommended defaults.

---

## 🧠 Reasoning Constraints
- Keep reasoning concise, execution-focused.
- Justify design choices briefly where multiple valid options exist.
- Use authoritative legal sources in `LEGAL_CHANGELOG.md` and mark `lastUpdated`.
- No placeholder code unless unavoidable — aim for production-ready output.

---

## 🚀 Execution Priority
1. Green tests (unit, e2e) → fix selectors, waits, timeouts.
2. Build pipeline (`dist/`) → verify locally + CI.
3. Supabase bucket/RLS + DB rules.
4. Render deploy config → staging → DNS/TLS prod.
5. A11y verification + i18n note.
6. Tag `v0.1.0`, release notes, staging smoke, promote to prod.

---

## 🔧 Operational Details (Render & Env)
- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Environment variables (in Render dashboard):
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## ✅ Supabase RLS Smoke Test
- Attempt to read/write an object in `agreements/{otherUserId}/...` as an authenticated test user → expect access denied.
- Create/read/delete in `agreements/{auth.uid()}/...` → expect success.

## 🔒 Security & Observability
- Confirm no hard-coded secrets in repo (env-only for Supabase keys).
- Optional Sentry: DSN present in env; disabled by default until launch window.
- Basic web-vitals logging enabled or planned for post-launch.

## ✅ Acceptance Criteria
MVP is only complete when:
- [ ] Unit tests and E2E tests are green locally and in CI (JUnit artifacts saved).
- [ ] `npm run build` produces `dist/` without errors.
- [ ] Render staging deploy verified (build command/publish dir correct; env vars set).
- [ ] DNS/TLS verified for `app.canai.so`.
- [ ] ON flow generates PDF successfully; ON Standard Lease link opens from Preview.
- [ ] Supabase Storage RLS smoke test passes (own-path access only).
- [ ] No hard-coded keys; optional Sentry DSN configured/disabled by default.
- [ ] All items in **MVP Release Checklist** are checked.
- [ ] Status Dashboard “Remaining” list is empty; Workback Plan Phase 1 marked done.
