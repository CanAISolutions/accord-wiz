| Checklist Item | Files/Commits |
|---|---|
| Green unit + e2e runs | `tests/e2e/on-flow.spec.ts`, RTL tests; `playwright.config.ts`, `vitest.config.ts` |
| Build produces dist | `vite.config.ts`, `package.json` scripts; CI artifacts `dist/` |
| Supabase bucket + RLS | `supabase/policies.sql` |
| DB rules | `supabase/db_rules.sql` (constraints/triggers/indexes/RLS) |
| Render config | `render.yaml`, `.github/workflows/ci.yml` |
| Deploy hooks | GitHub Secrets: `RENDER_DEPLOY_HOOK_STAGING`, `RENDER_DEPLOY_HOOK_PROD` |
| Docs stubs | `docs/RELEASE_NOTES.md`, `docs/I18N_PLAN.md`, `docs/A11Y_VERIFICATION.md` |



