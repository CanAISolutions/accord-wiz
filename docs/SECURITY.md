# Security Overview

Last updated: 2025-01-01

- Authentication: Supabase Auth (optionally) for document storage; anonymous use supported for local downloads.
- Authorization: RLS on `storage.objects` ensures only owners access their files.
- Data Paths: `agreements/{userId}/{agreementId}.pdf` with first segment matching `auth.uid()`.
- Encryption: TLS in transit. Supabase handles encryption at rest per their platform.
- Secrets: Vite env variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` configured in Render.
- Reporting: security@canai.so
