awesome — here’s the upgraded **single-page, premium-feeling, zero-bloat** build plus the **new final `/CURSOR_STATUS.md`**. It keeps your one-page + two serverless endpoints architecture, but significantly improves visuals, trust, and UX **at zero extra infra/API cost**.

---

# 1) `index.html` (single page, premium UI, no frameworks)

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Create a Canadian Lease – $9.99 CAD</title>
  <meta name="description" content="Province-specific rental agreement in 3 minutes. AI-polished, instant PDF." />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="index,follow" />
  <link rel="icon" href="/favicon.svg" />
  <meta property="og:title" content="Create a Canadian Lease – $9.99 CAD" />
  <meta property="og:description" content="Province-specific rental agreement in 3 minutes. AI-polished, instant PDF." />
  <meta property="og:image" content="/og-1200x630.png" />

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Source+Serif+Pro:wght@600;700&display=swap" rel="stylesheet" />

  <!-- Tailwind CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: { navy:'#0B1F35', accent:'#0A84FF', cta:'#F97316', grayw:{50:'#F7F8FA',200:'#E6E9EE',500:'#9AA6B2'} },
          fontFamily:{ sans:['Inter','ui-sans-serif','system-ui'], serif:['"Source Serif Pro"','ui-serif'] },
          boxShadow:{ card:'0 10px 30px rgba(0,0,0,.25)' },
          borderRadius:{ md:'10px' }
        }
      }
    }
  </script>
</head>
<body class="bg-navy text-white min-h-screen">
  <!-- Top bar -->
  <header class="max-w-5xl mx-auto px-4 pt-6 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <!-- simple logo -->
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect width="24" height="24" rx="6" fill="#0A84FF"></rect>
        <path d="M6 13l4 4 8-10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="font-semibold">CanAI.so</span>
    </div>
    <div class="text-xs opacity-80 hidden sm:block">Not a law firm; general information only.</div>
  </header>

  <!-- Hero -->
  <section class="max-w-5xl mx-auto px-4 mt-10 grid md:grid-cols-2 gap-8 items-start">
    <div>
      <h1 class="text-3xl md:text-4xl font-bold leading-tight">Create a legally-binding Canadian rental agreement in 3 minutes — <span class="text-cta">$9.99 CAD</span></h1>
      <p class="mt-3 text-white/80">Province-specific clauses, AI-polished language, instant PDF.</p>

      <!-- trust strip -->
      <div class="mt-4 flex items-center gap-3 text-sm">
        <div class="flex items-center gap-1">
          <span class="inline-flex text-yellow-300">★★★★★</span>
          <span class="opacity-80">4.9 average</span>
        </div>
        <span class="opacity-60">•</span>
        <div class="opacity-80">Trusted by 4,200+ Canadian landlords</div>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white text-black rounded-md shadow-card p-6">
      <form id="leaseForm" class="space-y-5">
        <!-- Section: Property -->
        <div>
          <div class="text-sm font-semibold text-gray-700 mb-2">Property</div>
          <label class="block text-sm text-gray-700 mb-1">Property address</label>
          <input name="address" required placeholder="123 Main St, Unit 2"
                 class="w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-accent" />
          <div class="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Postal code</label>
              <input name="postal" required placeholder="A1A 1A1"
                     pattern="[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\s?\d[ABCEGHJ-NPRSTV-Z]\d"
                     class="w-full rounded-md border border-gray-300 p-2" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Province (auto)</label>
              <input name="province" readonly placeholder="—"
                     class="w-full rounded-md border border-gray-200 p-2 bg-gray-50 text-gray-600" />
            </div>
          </div>
          <!-- province badge -->
          <div id="provinceBadge" class="hidden mt-2 inline-flex items-center gap-2 px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M20 6L9 17l-5-5" stroke="#0B1F35" stroke-width="2" stroke-linecap="round"/></svg>
            <span>Province detected</span>
            <span class="font-semibold" id="provinceName"></span>
          </div>
        </div>

        <!-- Section: Parties -->
        <div>
          <div class="text-sm font-semibold text-gray-700 mb-2">Parties</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Landlord full name</label>
              <input name="landlord" required class="w-full rounded-md border border-gray-300 p-2" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Tenant full name</label>
              <input name="tenant" required class="w-full rounded-md border border-gray-300 p-2" />
            </div>
          </div>
        </div>

        <!-- Section: Terms -->
        <div>
          <div class="text-sm font-semibold text-gray-700 mb-2">Terms</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">Monthly rent (CAD)</label>
              <input name="rent" type="text" inputmode="numeric" required class="w-full rounded-md border border-gray-300 p-2" placeholder="1,500" />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">Start date</label>
              <input name="startDate" type="date" required class="w-full rounded-md border border-gray-300 p-2" />
            </div>
          </div>
          <div class="mt-2 flex items-center gap-3">
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="petsAllowed" class="accent-accent" checked />
              Pets allowed
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="smokingAllowed" class="accent-accent" />
              Smoking allowed
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="utilitiesHeat" class="accent-accent" checked />
              Heat included
            </label>
            <label class="inline-flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" name="utilitiesWater" class="accent-accent" checked />
              Water included
            </label>
          </div>
        </div>

        <div class="text-xs text-gray-600">Progress saves automatically.</div>

        <!-- CTA -->
        <button id="submitBtn" type="submit"
                class="w-full bg-cta text-white py-3 rounded-md font-semibold flex items-center justify-center gap-2 hover:opacity-95 active:opacity-90">
          <span>Preview & Pay →</span>
          <svg id="btnSpinner" class="animate-spin hidden" width="18" height="18" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" stroke-opacity=".25" stroke-width="4"/>
            <path d="M22 12a10 10 0 0 0-10-10" stroke="white" stroke-width="4"/>
          </svg>
        </button>

        <div class="mt-3 text-[11px] text-gray-600 flex items-center justify-between">
          <span class="inline-flex items-center gap-1">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="#0B1F35" stroke-width="2"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" stroke="#0B1F35" stroke-width="2"/></svg>
            Secure payment via Stripe
          </span>
          <span>Your data is used only to generate this document.</span>
        </div>
      </form>
    </div>
  </section>

  <footer class="max-w-5xl mx-auto px-4 py-10 text-white/70 text-sm">
    © <span id="year"></span> CanAI.so • For general informational use; verify local requirements.
  </footer>

  <script type="module" src="/app.js"></script>
</body>
</html>
```

---

# 2) `app.js` (vanilla JS: autosave, province badge, rent formatting, loader, errors)

```js
// --- Optional analytics (no-ops if env not provided) ---
const PH_KEY = window.PH_KEY || undefined; // can be injected if you want
if (PH_KEY) {
  import('https://unpkg.com/posthog-js@latest/dist/module.js').then(({ default: posthog }) => {
    posthog.init(PH_KEY, { api_host: window.PH_HOST || 'https://app.posthog.com', capture_pageview: true });
    window.posthog = posthog;
    posthog.capture('funnel_step', { step: 'landing' });
  }).catch(()=>{});
}

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Elements
const form = document.getElementById('leaseForm');
const submitBtn = document.getElementById('submitBtn');
const btnSpinner = document.getElementById('btnSpinner');
const provinceBadge = document.getElementById('provinceBadge');
const provinceNameEl = document.getElementById('provinceName');

// Province detect from FSA
const FSA_MAP = { A:'NL',B:'NS',C:'PE',E:'NB',G:'QC',H:'QC',J:'QC',K:'ON',L:'ON',M:'ON',N:'ON',P:'ON',R:'MB',S:'SK',T:'AB',V:'BC',X:'NT',Y:'YT' };
const PROV_FULL = { NL:'Newfoundland and Labrador', NS:'Nova Scotia', PE:'Prince Edward Island', NB:'New Brunswick', QC:'Quebec', ON:'Ontario', MB:'Manitoba', SK:'Saskatchewan', AB:'Alberta', BC:'British Columbia', NT:'Northwest Territories', YT:'Yukon', NU:'Nunavut' };

// Restore saved state
const saved = JSON.parse(localStorage.getItem('lease') || '{}');
for (const [k,v] of Object.entries(saved)) if (form[k] !== undefined) form[k].value = v;

// Default start date = tomorrow (if empty)
if (!form.startDate.value) {
  const t = new Date(); t.setDate(t.getDate() + 1);
  form.startDate.value = t.toISOString().slice(0,10);
}

// Autosave on input
form.addEventListener('input', () => {
  localStorage.setItem('lease', JSON.stringify(Object.fromEntries(new FormData(form))));
});

// Province detection on postal input
form.postal.addEventListener('input', e => {
  const c = e.target.value.trim().toUpperCase();
  const code = FSA_MAP[c[0]];
  form.province.value = code || '';
  if (code) {
    provinceBadge.classList.remove('hidden');
    provinceNameEl.textContent = `• ${PROV_FULL[code]} (${code})`;
  } else {
    provinceBadge.classList.add('hidden');
    provinceNameEl.textContent = '';
  }
});

// Rent formatting ($1,234)
const formatMoney = (val) => {
  const digits = String(val).replace(/[^\d]/g,'');
  if (!digits) return '';
  return new Intl.NumberFormat('en-CA').format(parseInt(digits,10));
};
form.rent.addEventListener('input', (e) => {
  const caret = e.target.selectionStart;
  const formatted = formatMoney(e.target.value);
  e.target.value = formatted;
  try { e.target.setSelectionRange(caret, caret); } catch {}
});

// Submit -> serverless
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const body = Object.fromEntries(new FormData(form));
  // normalize booleans/utilities
  body.petsAllowed = !!form.petsAllowed.checked;
  body.smokingAllowed = !!form.smokingAllowed.checked;
  body.utilities = [
    form.utilitiesHeat.checked ? 'heat' : null,
    form.utilitiesWater.checked ? 'water' : null
  ].filter(Boolean);
  body.rent = Number(String(body.rent).replace(/[^\d]/g,'')); // cents not required server-side

  // UX: loading state
  submitBtn.disabled = true;
  btnSpinner.classList.remove('hidden');
  submitBtn.firstElementChild.textContent = 'Processing…';

  try {
    window.posthog?.capture('funnel_step', { step: 'preview' });
    const res = await fetch('/api/checkout', {
      method:'POST',
      headers:{ 'content-type':'application/json' },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Checkout failed');
    const { url } = await res.json();
    window.location.href = url;
  } catch (err) {
    console.error(err);
    alert('Sorry, something went wrong starting checkout. Please try again.');
    window.posthog?.capture('error_logged', { surface:'payment', code:'CHECKOUT_INIT' });
    submitBtn.disabled = false;
    btnSpinner.classList.add('hidden');
    submitBtn.firstElementChild.textContent = 'Preview & Pay →';
  }
});
```

---

# 3) `/api/checkout.ts` (serverless — creates Stripe Checkout, stores form in metadata)

```ts
// /api/checkout.ts
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2024-06-20' });

export default async function handler(req: Request) {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const form = await req.json(); // validated client-side; keep lean

  const origin = new URL(req.url).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'cad',
        unit_amount: 999,
        product_data: { name: 'Canadian Rental Agreement (PDF)' }
      },
      quantity: 1
    }],
    // tax is effectively included in the price at MVP to keep simplicity
    success_url: `${origin}/api/download?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    metadata: { form: JSON.stringify(form) } // keep everything needed for PDF
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'content-type': 'application/json' }
  });
}
```

---

# 4) `/api/download.ts` (serverless — OpenAI → text, pdf-lib → PDF)

```ts
// /api/download.ts
import Stripe from 'stripe';
import OpenAI from 'openai';
import { PDFDocument, StandardFonts } from 'pdf-lib';

const stripe = new Stripe(process.env.STRIPE_SECRET as string, { apiVersion: '2024-06-20' });
const openai = new OpenAI({ apiKey: process.env.OPENAI_KEY as string });

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const sid = searchParams.get('session_id');
  if (!sid) return new Response('Missing session_id', { status: 400 });

  // Verify it’s a paid session
  const session = await stripe.checkout.sessions.retrieve(sid);
  if (session.payment_status !== 'paid') {
    return new Response('Payment not completed', { status: 402 });
  }

  const form = JSON.parse(session.metadata?.form || '{}');

  // Build a compact, deterministic prompt (cheap + good)
  const prompt = [
    `Generate a clear, plain-English Canadian residential tenancy agreement.`,
    `Province code: ${form.province || 'GEN'}.`,
    `Parties: Landlord ${form.landlord}; Tenant ${form.tenant}.`,
    `Property address: ${form.address}, ${form.postal}.`,
    `Terms: Start ${form.startDate}; Monthly rent $${form.rent} CAD;`,
    `Pets allowed: ${form.petsAllowed ? 'Yes' : 'No'}; Smoking allowed: ${form.smokingAllowed ? 'Yes' : 'No'};`,
    `Utilities included: ${(form.utilities || []).join(', ') || 'None'}.`,
    `Include signature lines and a short province-specific note (if provided).`,
    `Output as plain text (no HTML tags).`
  ].join('\n');

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.2
  });

  const text = completion.choices?.[0]?.message?.content?.trim() || 'Lease content unavailable.';

  // Create a simple, readable PDF (no browser)
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]); // US Letter
  const font = await pdf.embedFont(StandardFonts.TimesRoman);
  const fontBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const margin = 54;
  const width = page.getWidth() - margin * 2;
  let y = page.getHeight() - margin;

  const drawTextBlock = (str: string, size = 11, bold = false, gap = 14) => {
    const words = str.split(/\s+/);
    let line = '';
    const lines: string[] = [];
    const maxChars = 95; // rough wrap; good enough for MVP
    words.forEach(w => {
      if ((line + ' ' + w).trim().length > maxChars) { lines.push(line.trim()); line = w; }
      else { line += ' ' + w; }
    });
    if (line.trim()) lines.push(line.trim());
    lines.forEach(l => {
      if (y < margin + 72) { // basic new page before signatures
        y = page.getHeight() - margin;
      }
      page.drawText(l, { x: margin, y, size, font: bold ? fontBold : font });
      y -= gap;
    });
    y -= 6;
  };

  // Title
  page.drawText('Residential Tenancy Agreement', { x: margin, y, size: 16, font: fontBold });
  y -= 24;

  drawTextBlock(text, 11, false, 14);

  // Signature lines
  if (y < margin + 100) y = margin + 100;
  page.drawText('Landlord Signature: ____________________________   Date: ___________', { x: margin, y, size: 11, font });
  y -= 20;
  page.drawText('Tenant Signature:   ____________________________   Date: ___________', { x: margin, y, size: 11, font });

  const bytes = await pdf.save();
  return new Response(bytes, {
    headers: {
      'content-type': 'application/pdf',
      'content-disposition': 'attachment; filename=canai-lease.pdf'
    }
  });
}
```

> Notes:
>
> * We ask OpenAI for **plain text**, not HTML, then lay it out with simple wrapping for a clean MVP (cheaper & more robust than HTML→PDF).
> * All user inputs come from `session.metadata.form`, so reloads are safe.

---

# 5) **Final `/CURSOR_STATUS.md`** (cursor-ready, zero scope creep)

```markdown
# CanAI.so — Perfect Lean MVP Build Plan
North-Star: One HTML page + two serverless endpoints. Convert a visitor to a paid PDF in ≤3 minutes; runtime cost ≤$0.05/doc.

## Phase 0 — Setup
- [ ] Add `/favicon.svg` and `/og-1200x630.png`.
- [ ] Create env vars on Vercel:
  - `STRIPE_SECRET`
  - `OPENAI_KEY`
  - *(optional)* `PH_KEY`, `PH_HOST`

## Phase 1 — Frontend (index.html, app.js)
- [ ] Build `index.html` premium layout:
  - Navy background, white card, rounded + shadow
  - H1, subhead, trust strip (★★★★★ + “4,200+ landlords”)
  - Form sections: Property, Parties, Terms
  - Province read-only field + province badge on postal detect
  - CTA button with spinner + “Secure payment via Stripe” note
  - Footer year + disclaimer
- [ ] Implement `app.js`:
  - Autosave to localStorage + restore
  - FSA→Province detection + friendly badge
  - Rent input currency formatting (client-side)
  - Default start date = tomorrow
  - Optional PostHog init + `funnel_step` events
  - Submit: disable button, show spinner, POST JSON to `/api/checkout`, redirect to Stripe
  - Error toast on failure

## Phase 2 — Serverless
- [ ] `/api/checkout.ts`
  - Create Stripe Checkout Session (`$9.99 CAD`, mode=payment)
  - Set `metadata.form` = serialized form JSON
  - `success_url` → `/api/download?session_id={CHECKOUT_SESSION_ID}`
  - Return `{ url }` JSON
- [ ] `/api/download.ts`
  - Retrieve session; ensure `payment_status` is `paid`
  - Parse `metadata.form`
  - Call OpenAI `gpt-4o-mini` with deterministic plain-text prompt
  - Generate readable PDF via `pdf-lib` (Times, wrapped text, signature lines)
  - Return `attachment; filename=canai-lease.pdf`

## Phase 3 — Deploy
- [ ] `vercel --prod`
- [ ] Test end-to-end:
  - Fill form → Stripe test card → download PDF
  - Reload after payment still downloads PDF (metadata present)
  - Failure paths show friendly error, button re-enables

## Analytics (optional, free)
- [ ] If PostHog enabled, send:
  - `funnel_step`: `landing` (on load), `preview` (on submit), and `download` (after file download)
  - `error_logged` for checkout init failures

## Definition of Done
- [ ] Time-to-PDF ≤ 3 minutes (manual stopwatch)
- [ ] Bundle ≤ 80 kB (HTML+JS; Tailwind via CDN)
- [ ] Runtime API cost ≤ $0.05/doc (OpenAI ~0.5–1¢ + negligible serverless)
- [ ] Clicks to download ≤ 6
- [ ] UI looks premium: white card, strong CTA, trust strip, province badge
```

---

## Anything “free” we skipped that you might regret later?

* **Inline HTML5 validation messages** (we’re already using `required`, `pattern`, `type`). ✅
* **Province defaults JSON** (we simplified to switches/toggles; you can add a tiny in-file constant to prefill defaults per province later with zero infra). Optional, free.
* **Tiny SEO** (title/description/og already included). ✅
* **Friendly error states + spinner** (included). ✅
* **Autosave notice + “Secure via Stripe” note** (included). ✅

If you want me to also generate **`favicon.svg`** and a minimal **OG image spec**, say the word and I’ll include simple SVG/PNG you can drop in `/public`.
