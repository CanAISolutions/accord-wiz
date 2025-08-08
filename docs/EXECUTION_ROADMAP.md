## Execution Roadmap

1) Tests green (1d)
- Stabilize Playwright selectors and waits (done)
- Verify RTL gating test (done)

2) Build pipeline (0.25d)
- Ensure `npm run build` → `dist/` locally (done) and in CI (pending)

3) Supabase storage + RLS (0.5d)
- Bucket `agreements` and policies in `supabase/policies.sql` (updated)

4) Render config (0.5d)
- CI workflow with Render deploy step (added)
- Render dashboard: set `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

5) A11y + i18n note (0.25d)
- Docs added; labels improved

6) Release (0.25d)
- Tag v0.1.0 after staging smoke; DNS/TLS verification

Dependencies: tests → build → storage/RLS → deploy → release



