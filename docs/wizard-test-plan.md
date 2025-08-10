---
title: Wizard Test Plan
---

- Scope
  - Verify end-to-end flow: province selection → landlord → tenant → property (autocomplete) → terms (date picker) → clauses (one-time defaults) → finalize (payment gating + PDF).

- Edge cases
  - Ontario: security deposit hidden; LMR visible; late fee disabled; PDF still builds; ON deep link present.
  - Québec: TAL banner; Generate PDF disabled.
  - BC/NL: deposit caps hints; errors shown when exceeding caps.
  - Address autocomplete: keyboard navigation; no results state; outside click dismiss.
  - Date picker: keyboard open/close, selection writes ISO YYYY-MM-DD; end ≥ start.
  - Phone/email XOR: dynamic required stars; inline errors; aria-invalid and aria-live summary.

- Logging
  - Signature audit entries persist via Supabase.
  - Payment gating banner shows until success flag.

- E2E notes
  - Use Playwright: select province, fill minimal valid fields, pick dates, visit finalize → see payment banner, click to pay page, simulate success (?success=true), return and generate PDF (mock pdf-lib with small byte array if needed).


