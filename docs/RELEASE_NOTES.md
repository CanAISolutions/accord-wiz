## v0.1.0 (MVP)

Known limitations:
- Ontario Standard Lease PDF generation defers to external deep link.
- Supabase storage assumes bucket `agreements/` exists; run SQL in `supabase/policies.sql` to provision and apply RLS.
- Minimal web-vitals; Sentry optional and disabled by default.

Changes:
- Stabilized Playwright selectors and waits for ON flow.
- Added a11y labels to inputs.
- Added RLS policies for Supabase Storage.



