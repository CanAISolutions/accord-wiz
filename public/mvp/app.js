// Optional analytics (no-ops if env not provided)
const PH_KEY = window.PH_KEY || undefined;
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
  body.rent = Number(String(body.rent).replace(/[^\d]/g,''));

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


