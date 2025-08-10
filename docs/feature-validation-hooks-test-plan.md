# Feature Test Plan: Animated Compliance, Achievements, Theme Toggle, Photon Address Autocomplete

- Objective: Validate integrations from `src/integrations/Instructions.md` into the wizard UI.
- Scope: Compliance chip animation (framer-motion), achievements badges, theme toggle, and Photon-based `AddressAutocomplete`.
- Cases:
  - Jurisdiction: province-first selection unlocks `jurisdiction` achievement; heading visible; Next enabled after selection.
  - Terms: entering compliant values results in zero validation errors and unlocks `termsValid` achievement.
  - Preview/PDF: generate PDF sets `finished` achievement.
  - Theme toggle: toggling updates `documentElement.classList` (adds/removes `dark`) and persists in localStorage; ARIA label updates between modes.
  - Address autocomplete: label properly associated; suggestions appear after ≥3 chars; list hides on blur or selection; resilient to network failures.
- A11y checks:
  - `AddressAutocomplete` input has `id` and `aria-labelledby` linked to its `<Label>`.
  - `ComplianceChip` has `role="status"` and does not trap focus; animations respect reduced motion by default browser behavior.
- Automated:
  - Unit: `npm run test` (existing suites); add future RTL cases for achievements and theme.
  - E2E: `npm run test:e2e` validates ON flow (security deposit hidden; late fee disabled). Flakiness mitigated by preloading wizard route and suppressing onboarding modal in `navigator.webdriver` env.
- Logging: JUnit outputs in `test-results/`.
