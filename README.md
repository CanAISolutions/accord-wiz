# Canadian Rental Agreement Builder (MVP)

Quick, simple, legally‑aware rental agreement generator for Canada (province/territory specific), including Ontario Standard Lease support.

## Getting Started

1. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
2. Install deps: `npm ci`
3. Run dev server: `npm run dev`

## Testing

- Unit: `npm run test`
- E2E: `npm run test:e2e`

## Environment

Set the following in `.env` for Supabase:

```
VITE_SUPABASE_URL=your-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

