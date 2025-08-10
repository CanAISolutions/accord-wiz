---
title: MVP Checkout & PDF Test Plan
scope: Single-page flow under /mvp with Stripe checkout and PDF generation
owner: engineering
---

- Overview: Validate the one-page form at `/mvp/` posts to `/api/checkout`, redirects to Stripe, and after payment `/api/download` returns a valid PDF with plain English content and signature lines.

- Preconditions
  - Env vars set in hosting platform:
    - STRIPE_SECRET
    - OPENAI_KEY
    - (optional) PH_KEY, PH_HOST
  - Stripe test keys and test card `4242 4242 4242 4242`

- Manual Flow
  1. Open `/mvp/` and confirm UI loads with trust strip and form.
  2. Enter address, valid Canadian postal code (province badge appears), landlord/tenant names, rent, and start date (defaults to tomorrow).
  3. Click "Preview & Pay" → button disables and spinner shows; network POST to `/api/checkout` returns `{ url }`.
  4. Redirect to Stripe Checkout. Complete with test card. After success, you should be redirected to `/api/download?session_id=...`.
  5. Confirm the browser downloads `canai-lease.pdf`. Open the PDF and verify readable text and signature lines.

- Edge Cases
  - Invalid postal code pattern blocks submit via HTML5 validation.
  - Failed `/api/checkout` returns alert message and re-enables button.
  - Revisit success URL again: still downloads PDF (metadata attached to session).
  - Large rent input formatting remains stable (caret position preserved).

- Logging
  - If PostHog configured: `funnel_step` events for `landing`, `preview`; `error_logged` on failure.

- Notes
  - Hosting: The `/api/*` routes are serverless endpoints. For production, deploy on a platform that supports `api/` directory (e.g., Vercel). Current Render static config will serve `/mvp` but not `/api`.
  - Cost: Keep temperature low and prompt short to control OpenAI cost.


