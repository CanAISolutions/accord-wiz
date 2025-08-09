## CANai UX Redesign Implementation Plan

### 1) Objectives
- Elevate trust, clarity, and delight without new paid tools.
- Make compliance visibly “on” and province-aware at all times.
- Keep flows fast; reduce friction via micro-animations and better affordances.
- Preserve legal precision: rules are accurate and surfaced contextually.
- Maintain green tests and smooth CI/CD to Render.

---

### 2) Success Criteria (Acceptance)
- Landing evokes trust; clear value proposition with Canadian focus.
- Province is selected up-front; a persistent “Compliance: <PROV>” chip is visible on every step.
- Step UIs display “Required by law” vs “Recommended” labels where relevant.
- ON flow: Security Deposit hidden, Late Fee disabled, Rent Deposit shown with note; visible compliance summary.
- Dual-view preview (Legal PDF / Readable Summary) with ON Standard Lease link prominent.
- Inline “info” popovers explain deposits, late fees, service animals, with citations to `docs/LEGAL_CHANGELOG.md`.
- All unit/E2E tests pass; build produces `dist/`; deploy to Render succeeds.
- A11y baseline verified; warm, cohesive visual identity.

---

### 3) Scope & Non‑Goals
- In-scope: UI/UX redesign, province compliance telegraphy, preview improvements, a11y/SEO/vitals.
- Out of scope: Server-side storage uploads, account systems, paid assets, database schema changes (already configured).

No-schema-change MVP: we will not modify the existing Supabase schema. All additions ship client-first with graceful fallbacks, avoiding DB migrations.

---

### 4) Phased Work Breakdown

#### Phase 0 — Baseline checks (Done/Confirm)
- Ensure green tests/build locally; CI passing.
- Confirm SEO/meta are set (title/OG/tags updated).
- Web-vitals collection initialized with optional endpoint.

#### Phase 1 — Brand, SEO, Header, Navigation
- Add consistent header with:
  - Logo/name (left), `ComplianceChip` + Docs menu + Theme toggle (right).
  - “Docs” links: Privacy, Security, Legal Changelog.
- Update hero copy to emphasize Canadian compliance and simplicity.
- Warm, professional palette: leverage Tailwind tokens; add Google Fonts (Inter for UI; Source Serif Pro for titles).
- Add trust microcopy in hero: “We validate compliance as you go.”

Deliverables:
- `src/pages/Index.tsx` (hero copy, call-to-action, placeholder compliance state in header).
- `index.html` (Google Fonts: Inter + Source Serif Pro; SEO tags confirmed).
- `src/components/ui` minor style token tweaks if needed.
 - Landing trust row: three `Card`s linking to official sources (ON Standard Lease, QC TAL, BC RTB) and a “Why this is safe” popover with plain-language assurances and links.

Tests:
- RTL: Accessibility roles and labels remain discoverable.
- E2E: Home → Wizard CTA flows to `/wizard`; trust row links are visible and open; “Why this is safe” popover toggles.

Git:
- Commit: “feat(ui): brand header, hero copy, SEO polish”

#### Phase 2 — Compliance primitives
- `ComplianceChip`:
  - Right header chip showing province code and compliance state.
  - Popover: 2–3 province rules + source links.
- Right-side rule panel (per step):
  - Short “What this step means legally in <PROV>” summary.
  - Inline “Required by law”/“Recommended” badges tied to validation rules.
- Clause explainers:
  - Small info icons with Radix Popover; content summarized from `docs/LEGAL_CHANGELOG.md`.

Deliverables:
- New: `src/components/compliance/ComplianceChip.tsx` (persistent province + status)
- New: `src/components/compliance/RightRulePanel.tsx` (per-step legal summary + dynamic caps)
- New: `src/components/compliance/ClauseExplainer.tsx` (inline popovers linking to `docs/LEGAL_CHANGELOG.md`)
- Integrations:
  - Header: add `ComplianceChip` in `src/components/RentalWizard.tsx`
  - `RentalTermsStep.tsx`: embed `RightRulePanel`, late fee/security deposit explainers
  - `LegalClausesStep.tsx`: confirm mandatory editable clauses and add contextual helper text
 - QC/TAL hard-stop: In Québec, display blocking guidance that the official TAL lease is required, with link and helper instructions (no continue until acknowledged).

Tests:
- E2E: Verify chip visible on all steps; ON rules appear; tooltips render.
 - E2E: QC shows TAL blocker with link and cannot proceed until acknowledged.

Git:
- Commit: “feat(compliance): province chip, rule panel, clause explainers”

#### Phase 3 — Flow polish and gating
- Province-first modal (if province empty on entry).
- Improve progress indicators: animated bar + step state checkmarks.
- Maintain hard gating (already added): cannot advance if invalid.
- Improve labels and helper text for “either phone or email” rule.

Deliverables:
- `src/components/wizard/*` edits (labels, helper text, progress checkmarks).
- Optional: “coach marks” (Radix Popover sequence) guiding first-time users.
 - Autosave + recommended defaults: throttle-save wizard state to localStorage with toast “Saved” and offer province-safe defaults per clause via inline buttons.

Tests:
- RTL: Gating test remains green; timeouts adjusted.
- E2E: Fill steps; ensure Next stays disabled until valid.
 - E2E: Autosave persists after refresh; toast appears; “Use recommended” populates fields.

Git:
- Commit: “feat(wizard): province-first modal, progress polish, gating UX”

#### Phase 4 — Preview & dual-view
 - Dual-view tabs: Legal PDF view (existing) + Readable Summary (enhanced plain text). Advanced option: split-pane with synchronized scroll and clause hover highlighting (post-MVP if needed).
- ON Standard Lease link remains prominent.
- Add success micro-animation (Lottie) on PDF download.
 - Provide quick actions: Compose Email (mailto), Download Word (RTF), and Add-to-Calendar (.ics) — all client-only.

Deliverables:
- Convert `src/components/wizard/PreviewStep.tsx` to use shadcn `Tabs` (summary|legal)
- Keep `getOntarioLeaseDeepLink()` prominent when province is ON
 - (Optional advanced) Add split-pane layout with synchronized scroll and `[data-clause]` hover mapping across panels.
 - Quick actions: mailto compose, RTF, ICS (client-only, no backend).

Tests:
- E2E: Toggle tabs; PDF download; ON SFL link opens.
 - E2E (advanced): split-pane scroll stays synchronized; clause hover highlights both panels.

#### Phase 4.5 — Multi-format export (DOCX)
- Add DOCX export using `docx` npm with numbered headings and matching content to PDF builder. Embed fonts via system or defaults.

Deliverables:
- `src/lib/docx/buildAgreementDocx.ts` new module; button in Preview to export DOCX.

Tests:
- Unit: builder returns non-empty binary; basic content smoke-check.
- E2E: DOCX download triggers and file has expected filename.

Git:
- Commit: “feat(preview): dual-view tabs + success animation”

#### Phase 5 — A11y & i18n baseline
- WCAG AA contrast pass on all tokens.
- ARIA for popovers/comboboxes; aria-live for validation summaries.
- i18n scaffolding note (en-CA only for now).

Deliverables:
- `docs/A11Y_VERIFICATION.md` updated with date/pages.
- `docs/I18N_PLAN.md` confirm plan.

Tests:
- RTL: role-based queries still pass.

Git:
- Commit: “chore(a11y): baseline verification and fixes”

#### Phase 6 — Testing & Playwright hardening
- Update E2E to include:
  - Compliance chip visible
  - ON flow constraints (hidden field, disabled late fee)
  - Clause explainers presence
  - Dual-view preview toggling
- Keep Chromium baseline green for CI speed.

Deliverables:
- `tests/e2e/*` expanded
- `tests/rtl/*` small updates for labels

Git:
- Commit: “test(e2e/rtl): compliance chip, ON constraints, preview dual view”

#### Phase 7 — Docs & release
- Update:
  - `docs/status-dashboard.md` (completed items)
  - `docs/mvp-release-checklist.md` (check CI/CD & UX acceptance)
  - `docs/CHECKLIST_CROSSWALK.md` (map features → files)
- Tag and deploy via CI hooks.

Git:
- Commit: “docs: finalize MVP redesign docs”
- Tag: `v0.1.0`

#### Phase 8 — MVP Vault (no DB changes)
- Client-only “My Drafts” backed by `localStorage` with export/import JSON.

Deliverables:
- `src/pages/Vault.tsx` (local drafts table)
- `src/lib/drafts.ts` (CRUD helpers; single namespaced key)

Tests:
- RTL: save draft, appears in Vault; duplicate/rename works; import merges.

---

### 5) File-by-File Checklist

- `index.html`: Title/OG/meta; Google Fonts (Inter, Source Serif Pro).
- `src/index.css`: Tailwind tokens (ensure AA contrast).
- `src/pages/Index.tsx`: Hero, CTAs; brand header; route to `/wizard`.
- `src/pages/Wizard.tsx`: Lazy-load wizard.
- `src/pages/Vault.tsx`: Local drafts table (no DB).
- `src/components/RentalWizard.tsx`: Hard gating (already added), progress checkmarks.
- `src/components/wizard/*`: Labels, helper text, rule panel slots.
- New components:
  - `src/components/compliance/ComplianceChip.tsx`
  - `src/components/compliance/RightRulePanel.tsx`
  - `src/components/compliance/ClauseExplainer.tsx`
  - (Reused Tabs) `src/components/wizard/PreviewStep.tsx` converted to dual-view
- `src/lib/vitals.ts`: Web-vitals (already added); optional endpoint env.
- `src/lib/drafts.ts` (new) — localStorage helpers
- `tests/e2e/on-flow.spec.ts`: Extend to verify chip, dual preview, explainers.
- `docs/*`: Status, checklist, a11y log, release notes.

---

### 6) Free Assets & Patterns

- Fonts: Google Fonts (Inter, Source Serif Pro).
- Icons: lucide-react (already installed).
- Animations: LottieFiles (success/checkmark JSON).
- Illustrations: undraw.co (light legal-themed SVGs).
- UI: Tailwind, Radix UI/shadcn (already in code).
- Legal references: `docs/LEGAL_CHANGELOG.md` (keep lastUpdated).

---

### 7) Testing Plan (Incremental)

Unit/RTL
- Wizard gating test: Next disabled on invalid; enabled when valid.
- Compliance components render with correct province context.
- Clause explainers open/close; contain CTA link to changelog.

Playwright E2E (Chromium baseline)
- Home → Start → Province modal → ON selected → chip appears.
- Landlord/Tenant/Property: fill minimal; ensure Next gating holds.
- Terms (ON): Security Deposit hidden, Late Fee disabled; Rent Deposit visible + note.
- Clauses: mandatory fields required to proceed.
- Preview: switch to Readable; PDF download triggers success; ON SFL link opens.
- QC: TAL blocker appears with official link; cannot proceed until acknowledged.
- Autosave: refresh preserves inputs; toast confirms save.
- DOCX: export triggers download.
- Vault: create draft appears in local Vault; export/import round-trips.

---

### 8) Deployment & Ops
- CI (GitHub Actions) already triggers:
  - Staging on push to `main` via `RENDER_DEPLOY_HOOK_STAGING`.
  - Production on tags `v*` via `RENDER_DEPLOY_HOOK_PROD`.
- Render: ensure env variables set for both services.
- DNS/TLS: `app.canai.so` CNAME → Render production hostname.

---

### 9) Risks & Mitigations
- Selector fragility: keep tests role-based; use `getByRole` where possible; add stable `data-testid` only when necessary.
- A11y regressions: run a manual pass; consider adding jest-axe post-MVP.
- Legal drift: pin `lastUpdated` in changelog; show date in UI; link to sources.
- Local-only drafts: message clearly that drafts are stored on this device only until account sync ships; encourage export for backup.

---

### Concrete Implementation Notes
- Province logic: use `getProvinceRules` and `validateTerms` to drive caps, disabled fields, warnings, and header chip status.
- RightRulePanel: compute from current step values (`rentAmount`, `securityDeposit`, `lateFeeAmount`) and surface errors/warnings inline.
- Preview dual-view: shadcn `Tabs` in `PreviewStep`; add caption “Act prevails” and show `rules.lastUpdated` when present; ON SFL link stays prominent.
- PDF: ensure compliance banner and signature audit hash are present (already in `buildAgreement.ts`).
- A11y: labels paired, aria-live for error summaries, keyboard navigation across Tabs/Popover/Select.
- No-schema-change: keep storage client-side; provide JSON export/import; mark any server-dependent features as “coming soon” with non-blocking UI stubs.

---

### 10) Timeline (Aggressive)
- Day 1: Brand/header, ComplianceChip, RightRulePanel, clause explainers.
- Day 2: Dual-view preview, a11y polish, tests, docs, deploy staging.
- Day 3: Stabilize, tag v0.1.0, promote to production.

---

### 11) Git Plan (suggested)
- After each phase:
  ```
  git add -A
  git commit -m "feat: <phase summary>\n\n- Details\n- Tests\n- Docs"
  git push
  ```
- Release:
  ```
  git tag -a v0.1.0 -m "MVP UX redesign"
  git push origin v0.1.0
  ```

---

Short summary
- Deliver a warm, legally precise UX with visible compliance (province chip, rule panel, explainers).
- Clarify obligations at each step; enforce gating with empathetic copy.
- Add a delightful preview experience with dual views and micro-animations.
- Keep it free: Tailwind/shadcn/Radix, Google Fonts, Lottie, unDraw.