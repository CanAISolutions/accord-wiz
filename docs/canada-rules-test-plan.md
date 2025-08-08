Canada Rental Rules – Test Plan (MVP)

Scope
- Validate province/territory-specific deposit and late fee rules applied via `src/lib/canadaRentalRules.ts` and surfaced in UI steps.
- Ontario-specific UI: Security Deposit hidden; Late Fee disabled; Rent Deposit visible with interest note.
- Mandatory clauses present and editable: “Act Prevails” and “Human Rights/Service Animals”.
- Verify preview disclaimer and Ontario Standard Lease deep link.

Test Matrix (Happy paths)
- BC: rent 2000 → security deposit max 1000, late fee ≤ $25 OK.
- AB: rent 2000 → security deposit up to 2000; trust/interest note shown; late fee any reasonable amount doesn’t error.
- SK: rent 1800 → deposit up to 1800; warning about half-now, remainder later.
- MB: rent 1600 → deposit ≤ 800; RTB notes shown.
- ON: security deposit set > 0 → error; rent deposit note shown and UI controls aligned.
- QC: any security deposit > 0 → error; key deposit prohibited note; late fee warning.
- NS: rent 1500 → deposit ≤ 750; info note; late payment compliance note.
- NB: weekly vs monthly validation; monthly: ≤ 1 month allowed; fund note.
- PE: ≤ 1 month; trust/interest note.
- NL: ≤ 0.75 month; late fee schedule note.
- YT: ≤ 1 month; can apply to last month note.
- NT: ≤ 1 month (conservative); reasonableness note.
- NU: ≤ 1 month (or 1 week); return within 10 days note.

Edge Cases
- No province selected: no validation fired.
- Non-numeric amounts: validation errors surfaced inline.
- Late fee over cap in BC: error displayed.
- Deposit exceeding cap: error displayed.
- ON: Late fee input disabled; security deposit control hidden.

PDF Checks
- Compliance banner present (“Act prevails” + `lastUpdated`).
- Signature audit shows role, timestamp, and SHA-256 hash prefix.
- ON: Security Deposit omitted; Rent Deposit shown.

Preview
- Disclaimer visible; ON Standard Lease deep link present when `provinceCode === 'ON'`.

Logging/Observability
- CI stores JUnit for unit and e2e under `test-results/`.
- Artifacts: `dist/` retained on CI.

Out of Scope
- Server-side persistence, Supabase writes, interest calculators.

