# Rental Agreement Builder (Canada)

Modern, province‑compliant rental agreement generator for Canada. Focused on trust, accessibility, and a delightful UX.

- Compliance: Province rules enforced at input time
- PDF with signatures: In‑browser signing, auditable logs
- Address autocomplete: Photon (OpenStreetMap), keyboard‑friendly
- i18n: EN/FR ready
- Offline‑ready: Basic service worker
- Charts and 3D: Visuals to explain rules (Recharts + optional three/fiber demo)

## Tech Stack
- Vite + React + TypeScript + Tailwind + shadcn/ui
- Supabase (auth, storage, RLS, tables)
- pdf-lib
- Vitest/RTL + Playwright

## Quick Start
1. Prereqs: Node 20+, npm
2. Install: `npm i`
3. Env: create `.env` with:
   - VITE_SUPABASE_URL=…
   - VITE_SUPABASE_ANON_KEY=…
   - Optional Stripe (disabled in production for assessment):
     - VITE_STRIPE_PUBLISHABLE_KEY=…
     - VITE_STRIPE_PRICING_TABLE_ID=…
     - VITE_STRIPE_PAYMENT_LINK_URL=…
4. Dev: `npm run dev`
5. Unit tests: `npm run test`
6. E2E tests: `npm run test:e2e`
7. Build: `npm run build`

## Supabase
- Client: `src/integrations/supabase/client.ts`
- Types: `src/integrations/supabase/types.ts`
- Required tables:
  - `payment_logs` (gates PDF when `status='succeeded'`)
  - `audit_logs` (signature audit entries)
- Recommended storage bucket: `agreements` (private) for PDFs
- Example SQL (idempotent) in `docs/supabase.sql.md`

## Stripe (temporarily disabled in production)
- For public assessment, the Pay page routes forward without charging in production.
- Re‑enable by restoring the Pricing Table/Payment Link branches in `src/pages/Pay.tsx` and removing the production guard.

## Accessibility & i18n
- A11y checks tracked in `docs/A11Y_VERIFICATION.md`
- Language selector in wizard header; extend EN/FR via `src/i18n/I18nProvider.tsx`

## Testing
- Unit: Vitest/RTL (CI‑friendly, JUnit exported to `test-results/`)
- E2E: Playwright (`npm run test:e2e`)
- Address autocomplete includes keyboard interactions

## Troubleshooting
- Supabase “permission denied”: verify RLS policies and authentication
- Photon suggestions require 3+ chars; check network/CORS
- Service worker: hard refresh or unregister via DevTools > Application > Service Workers