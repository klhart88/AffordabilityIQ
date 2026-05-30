// ─── CREDENTIALS ─────────────────────────────────────────────────────────────
const EMAILJS_SERVICE  = 'service_m3nxglc';
const EMAILJS_TEMPLATE = 'template_qzj7bt5';
const EMAILJS_KEY      = 'cwY7cLvTSDnRlXoso';
const AIRTABLE_BASE    = 'appFFld4ImANnTKz3';
const AIRTABLE_TABLE   = 'Leads';
const AIRTABLE_TOKEN   = 'patfcAEDgZ2m2qSdz.684dc221b5c6845fdd7dc0770d50bb290a88a38441b5f8a90b454503221ee5d5';
const RENTCAST_KEY     = '244e09bec88c47fa85fac1f3cb9696b4';
const FATHOM_BASE      = 'https://kelvinhart.fathomrealty.com';
const HOME_SEARCH_URL  = 'https://kelvinhart.fathomrealty.com/property-search/any/status=active,viewport=40.098659:-85.779579_39.576687:-86.452491';

// ─── STATE ────────────────────────────────────────────────────────────────────
let S = {
  type: null,
  budget: 2000,
  rate: 7.0,
  dp: 10,
  hv: 300000,
  mb: 200000,
  results: null,
  contact: null,
  listings: [],
  emailSent: false,
  searchZip: null,
  searchBeds: null,
  searchBaths: null,
  airtableRecordId: null
};

// ─── SVG ICON HELPER ─────────────────────────────────────────────────────────
const iconSvg = name => {
  const icons = {
    bank:      '<path d="M3 21h18"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M12 3 4 8h16z"/>',
    dollar:    '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7H14a3.5 3.5 0 0 1 0 7H6"/>',
    chart:     '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/>',
    calendar:  '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
    bed:       '<path d="M3 10V5"/><path d="M21 13v8"/><path d="M3 21v-8h18"/><path d="M7 13V9h8a4 4 0 0 1 4 4"/><path d="M3 13h4"/>',
    bath:      '<path d="M7 10V5a3 3 0 0 1 6 0"/><path d="M4 11h17v3a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M8 21v-2"/><path d="M17 21v-2"/>',
    area:      '<path d="M4 4h16v16H4z"/><path d="M8 4v16"/><path d="M4 8h16"/>',
    copy:      '<rect x="9" y="9" width="13" height="13" rx="2"/><rect x="2" y="2" width="13" height="13" rx="2"/>',
    link:      '<path d="M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20.1l1.1-1.1"/>',
    check:     '<path d="M20 6 9 17l-5-5"/>',
    alert:     '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
    mail:      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'
  };
  return `<span class="ui-ico ui-ico-${name}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">${icons[name] || ''}</svg></span>`;
};

// ─── FORMAT ──────────────────────────────────────────────────────────────────
const $$ = n => new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:0}).format(n);

// Force phone numbers into (xxx) xxx-xxxx as the user types.
function formatPhoneNumber(value) {
  const digits = String(value || '').replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits ? `(${digits}` : '';
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function initPhoneFormatting() {
  document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.setAttribute('inputmode', 'numeric');
    input.setAttribute('maxlength', '14');
    input.addEventListener('input', () => {
      input.value = formatPhoneNumber(input.value);
    });
    input.addEventListener('blur', () => {
      input.value = formatPhoneNumber(input.value);
    });
  });
}

// ─── FATHOM PROPERTY URL ─────────────────────────────────────────────────────
function fathomUrl(listing) {
  const parts = [listing.addressLine1||'', listing.city||'', listing.state||'', listing.zipCode||''].filter(Boolean).join(' ');
  const slug = (listing.formattedAddress || parts).replace(/,/g,'').replace(/\s+/g,' ').trim().replace(/\s/g,'-');
  return `${FATHOM_BASE}/property/${encodeURI(slug)}/`;
}
// ─── RELAY URL (for emailed listings — copies address on click) ──────────────
function relayUrl(listing) {
  const addr = listing.formattedAddress
    || `${listing.addressLine1||''} ${listing.city||''} ${listing.state||''} ${listing.zipCode||''}`.trim();
  const dest = HOME_SEARCH_URL;          // ← always lands on the Indianapolis search map
  const base = window.location.origin;   // ← auto-detects: localhost, custom domain, anywhere
  return `${base}/relay.html`
    + `?addr=${encodeURIComponent(addr)}`
    + `&dest=${encodeURIComponent(dest)}`;
}
// ─── EMAIL BUTTON LABEL ───────────────────────────────────────────────────────
function updateEmailButton() {
  const sent = S.emailSent;
  const hasListings = S.listings && S.listings.length > 0;
  let label;
  if (sent && hasListings)   label = 'Resend with Listings';
  else if (sent)             label = 'Resend Results';
  else if (hasListings)      label = 'Send Results + Listings';
  else                       label = 'Send Results';
  ['email-btn','email-btn-2'].forEach(id => {
    const b = document.getElementById(id);
    if (b) b.textContent = label;
  });
}

// ─── PITI MATH ───────────────────────────────────────────────────────────────
function loanFactor(annRate, yrs) {
  const r = annRate / 100 / 12, n = yrs * 12;
  if (r === 0) return n;
  return (Math.pow(1+r,n)-1) / (r*Math.pow(1+r,n));
}
function piFromPITI(piti, annRate, dp) {
  const k = loanFactor(annRate, 30), dpFrac = dp / 100;
  return piti / (1 + k * (0.011/12) / (1 - dpFrac));
}
function calcEquity(hv, mb) { return (hv - mb) - 0.07 * hv; }

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
function showStep(id) {
  ['s1','s2','s3','s4','s5','sres'].forEach(i => document.getElementById(i).classList.add('hidden'));
  const el = document.getElementById(id);
  el.classList.remove('hidden');
  el.classList.remove('sc');
  void el.offsetWidth;
  el.classList.add('sc');
  buildInd(id);
}
function next(n) { showStep('s'+n); }
function fromS2() { showStep(S.type === 'homeowner' ? 's3' : 's4'); }
function backS4() { showStep(S.type === 'homeowner' ? 's3' : 's2'); }

function buildInd(active) {
  const ind = document.getElementById('step-ind');
  if (active === 'sres') { ind.innerHTML = ''; return; }
  const isHO = S.type === 'homeowner';
  const total = isHO ? 5 : 4;
  const map = isHO ? {s1:1,s2:2,s3:3,s4:4,s5:5} : {s1:1,s2:2,s4:3,s5:4};
  const cur = map[active] || 1;
  let h = '';
  for (let i = 1; i <= total; i++) {
    const done = i < cur, act = i === cur;
    h += `<div class="si-dot ${done?'done':act?'active':'soon'}">${done?'✓':i}</div>`;
    if (i < total) h += `<div class="si-line ${done?'done':'soon'}"></div>`;
  }
  ind.innerHTML = h;
}

// ─── STEP 1 ──────────────────────────────────────────────────────────────────
function pickType(t) {
  S.type = t;
  document.getElementById('opt-ho').classList.toggle('sel', t === 'homeowner');
  document.getElementById('opt-rn').classList.toggle('sel', t === 'renter');
  document.getElementById('s1-next').disabled = false;
  buildInd('s1');
}

// ─── STEP 2 ──────────────────────────────────────────────────────────────────
function setBudget(v) {
  S.budget = v;
  document.getElementById('bdisp').textContent = $$(v);
  document.getElementById('binput').value = v;
}
function setBudgetI(v) {
  S.budget = v;
  document.getElementById('bdisp').textContent = $$(v);
  document.getElementById('brange').value = Math.min(8000, Math.max(500, v));
}

// ─── STEP 3 ──────────────────────────────────────────────────────────────────
function syncHV() { const v=+document.getElementById('hvr').value; document.getElementById('hval').value=v; S.hv=v; refreshEq(); }
function syncMB() { const v=+document.getElementById('mbr').value; document.getElementById('mbal').value=v; S.mb=v; refreshEq(); }
function onHV() { S.hv=+document.getElementById('hval').value; document.getElementById('hvr').value=Math.min(1000000,S.hv); refreshEq(); }
function onMB() { S.mb=+document.getElementById('mbal').value; document.getElementById('mbr').value=Math.min(1000000,S.mb); refreshEq(); }
function refreshEq() {
  const eq = calcEquity(S.hv, S.mb), el = document.getElementById('eq-disp');
  el.textContent = $$(eq);
  el.className = 'is-v ' + (eq >= 0 ? 'ok' : 'er');
}

// ─── STEP 4 ──────────────────────────────────────────────────────────────────
function setDP(v) { S.dp=v; document.getElementById('dp-disp').textContent=v+'%'; }
function setRate(v) { S.rate=v; document.getElementById('rt-disp').textContent=parseFloat(v).toFixed(1)+'%'; }

// ─── STEP 5: CONTACT + SAVE TO AIRTABLE ──────────────────────────────────────
function submitContact() {
  const fname = document.getElementById('c-fname').value.trim();
  const lname = document.getElementById('c-lname').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const phone = formatPhoneNumber(document.getElementById('c-phone').value).trim();
  let valid = true;
  ['c-fname','c-lname','c-email'].forEach(id => document.getElementById(id).classList.remove('inp-err'));
  ['e-fname','e-lname','e-email'].forEach(id => document.getElementById(id).classList.add('hidden'));
  if (!fname) { document.getElementById('c-fname').classList.add('inp-err'); document.getElementById('e-fname').classList.remove('hidden'); valid=false; }
  if (!lname) { document.getElementById('c-lname').classList.add('inp-err'); document.getElementById('e-lname').classList.remove('hidden'); valid=false; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { document.getElementById('c-email').classList.add('inp-err'); document.getElementById('e-email').classList.remove('hidden'); valid=false; }
  if (!valid) return;
  S.contact = {fname, lname, email, phone};
  calculate();
}

async function saveToAirtable() {
  if (!S.results || !S.contact) return;
  const {price, loan, dp, ti, equity} = S.results;
  const c = S.contact;
  const fields = {
    'Name': `${c.fname} ${c.lname}`,
    'Email': c.email,
    'Purchase Price': Math.round(price),
    'Loan Amount': Math.round(loan),
    'Down Payment': Math.round(dp),
    'PITI Budget': S.budget,
    'Interest Rate': S.rate,
    'Down Pct': S.dp,
    'Client Type': S.type === 'homeowner' ? 'Homeowner' : 'Renter',
    'Submitted At': new Date().toISOString().split('T')[0]
  };
  if (c.phone)         fields['Phone']    = c.phone;
  if (equity !== null) fields['Equity']   = Math.round(equity);
  if (S.searchZip)     fields['Zip Code'] = S.searchZip;
  if (S.searchBeds)    fields['Beds']     = S.searchBeds;
  if (S.searchBaths)   fields['Baths']    = S.searchBaths;

  const baseUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(AIRTABLE_TABLE)}`;
  const isUpdate = !!S.airtableRecordId;
  const url = isUpdate ? `${baseUrl}/${S.airtableRecordId}` : baseUrl;
  const method = isUpdate ? 'PATCH' : 'POST';
  console.log(`Airtable: ${isUpdate?'updating':'creating'} record`, isUpdate ? S.airtableRecordId : '', fields);

  try {
    const res = await fetch(url, {
      method,
      headers: {'Authorization': `Bearer ${AIRTABLE_TOKEN}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({fields})
    });
    const body = await res.text();
    if (res.ok) {
      const data = JSON.parse(body);
      if (!isUpdate) S.airtableRecordId = data.id;
      console.log(`Airtable ${isUpdate?'updated':'saved'}:`, data.id);
    } else {
      console.error('Airtable save failed — Status:', res.status, '\nResponse:', body,
        '\nLikely causes: (1) Token missing data.records:write scope, (2) Token not granted access to this base, (3) Field name mismatch in Airtable, (4) Field type mismatch.');
    }
  } catch(e) {
    console.error('Airtable network error:', e.message, '— If running in a sandbox this is expected; on a live site this means CORS or network failure.');
  }
}

// ─── CALCULATE ────────────────────────────────────────────────────────────────
function calculate() {
  const pi    = piFromPITI(S.budget, S.rate, S.dp);
  const k     = loanFactor(S.rate, 30);
  const loan  = pi * k;
  const price = loan / (1 - S.dp / 100);
  const dp    = price * S.dp / 100;
  const ti    = price * 0.011 / 12;
  const equity = S.type === 'homeowner' ? calcEquity(S.hv, S.mb) : null;
  S.results = {pi, loan, price, dp, ti, equity};

  saveToAirtable();

  // Greeting
  if (S.contact) {
    document.getElementById('res-greeting').innerHTML =
      `<span style="font-family:var(--fb);font-size:22px;font-weight:700;color:var(--black)">Here are your results, <em style="color:var(--red);font-style:normal">${S.contact.fname}</em></span>`;
  }

  document.getElementById('res-price').textContent = $$(price);
  document.getElementById('res-sub').textContent = `${S.rate.toFixed(1)}% interest · ${S.dp}% down · 30-year fixed`;

  // PITI breakdown
  document.getElementById('piti-breakdown').innerHTML = `
    <div class="piti-tt">Monthly Payment Breakdown (PITI)</div>
    <div class="piti-row"><span>Principal &amp; Interest (P&amp;I)</span><span>${$$(pi)}</span></div>
    <div class="piti-row"><span>Taxes &amp; Insurance (est. 1.1%/yr)</span><span>${$$(ti)}</span></div>
    <div class="piti-row"><span>Total Monthly PITI Budget</span><span>${$$(S.budget)}</span></div>`;

  // Search range note
  const _lo = Math.max(0, Math.round(price - 75000)), _hi = Math.round(price + 75000);
  const rnEl = document.getElementById('range-note');
  if (rnEl) rnEl.innerHTML = `Listings filtered between <strong>${$$(_lo)}</strong> and <strong>${$$(_hi)}</strong> (±$75K of your estimated price)`;

  // Metric cards
  const ms = [
    {ic:'bank',     lbl:'Loan Amount',           val:$$(loan)},
    {ic:'dollar',   lbl:'Down Payment',           val:$$(dp)},
    ...(equity !== null ? [{ic:'chart', lbl:'Net Equity (after costs)', val:$$(equity)}] : []),
    {ic:'calendar', lbl:'Your PITI Budget',       val:$$(S.budget)},
  ];
  document.getElementById('res-metrics').innerHTML = ms.map(m =>
    `<div class="mc"><div class="mi">${iconSvg(m.ic)}</div><div class="mv">${m.val}</div><div class="ml">${m.lbl}</div></div>`
  ).join('');

  // Equity math block
  const edEl = document.getElementById('equity-disc');
  if (equity !== null) {
    const gross = S.hv - S.mb, costAmt = Math.round(S.hv * 0.07), netEq = Math.round(equity);
    edEl.classList.remove('hidden');
    document.getElementById('eq-math-rows').innerHTML = `
      <span><b>Home Value</b><i>${$$(S.hv)}</i></span>
      <span><b>− Mortgage Balance</b><i>− ${$$(S.mb)}</i></span>
      <span><b>= Gross Equity</b><i>${$$(gross)}</i></span>
      <span><b>− Selling Costs (7%)</b><i>− ${$$(costAmt)}</i></span>
      <span><b>= Net Equity</b><i style="color:var(--black);font-weight:700">${$$(netEq)}</i></span>`;
  } else {
    edEl.classList.add('hidden');
  }

  // Equity alert
  const al = document.getElementById('res-alert');
  if (equity !== null) {
    if (equity >= dp) {
      al.className = 'al al-ok mb16';
      al.innerHTML = `<div class="al-t">${iconSvg('check')} You're positioned to upgrade!</div>
        <div class="al-b">Your net equity of ${$$(equity)} covers the ${$$(dp)} down payment — with ${$$(equity - dp)} remaining.</div>`;
    } else if (equity > 0) {
      al.className = 'al al-er mb16';
      al.innerHTML = `<div class="al-t">${iconSvg('alert')} Equity gap detected</div>
        <div class="al-b">Your net equity of ${$$(equity)} is ${$$(dp - equity)} short of the ${$$(dp)} required.</div>`;
    } else {
      al.className = 'al al-er mb16';
      al.innerHTML = `<div class="al-t">${iconSvg('alert')} Negative net equity</div>
        <div class="al-b">After 7% selling costs you'd be upside-down. Kelvin can help you evaluate your options.</div>`;
    }
  } else {
    al.innerHTML = '';
    al.className = 'hidden';
  }

  showStep('sres');
  showChatNudge();
}

// ─── CHAT NUDGE ── (defined in index.html to avoid duplication) ──────────────

// ─── SEND RESULTS VIA EMAILJS ─────────────────────────────────────────────────
async function sendResults() {
  if (!S.results || !S.contact) return;
  const {pi, loan, price, dp, ti, equity} = S.results;
  const c = S.contact;

  const btns = ['email-btn','email-btn-2'].map(id => document.getElementById(id)).filter(Boolean);
  const statusEls = ['email-status','email-status-2'].map(id => document.getElementById(id)).filter(Boolean);

  const setStatus    = (text, cls) => statusEls.forEach(el => { el.textContent=text; el.className=`email-status ${cls}`; });
  const hideStatus   = () => statusEls.forEach(el => el.className='email-status hidden');
  const setBtnsLabel = text => btns.forEach(b => b.textContent = text);
  const setBtnsDisabled = d => btns.forEach(b => b.disabled = d);

  if (typeof emailjs === 'undefined') {
    setStatus('Email service is not loaded. Please refresh the page and try again.', 'email-er');
    return;
  }
  try { emailjs.init(EMAILJS_KEY); } catch(e){}

  setBtnsDisabled(true);
  setBtnsLabel('Sending…');
  hideStatus();

  const equitySection = equity !== null
    ? `NET EQUITY ANALYSIS\n` +
      `Gross equity: ${$$(S.hv - S.mb)}\n` +
      `Selling costs (7%): - ${$$(Math.round(S.hv * 0.07))}\n` +
      `Net equity: ${$$(Math.round(equity))}\n` +
      `vs. Down Payment: ${equity >= dp ? 'COVERED (+'+$$(equity-dp)+' surplus)' : 'SHORT by '+$$(dp-equity)}`
    : '';

  let listingsSection = '';
  if (S.listings && S.listings.length > 0) {
    listingsSection = '\n========================================\n';
    listingsSection += `MATCHING LISTINGS (${S.listings.length} found)\n`;
    listingsSection += '========================================\n';
    S.listings.forEach((l, i) => {
      const addr = l.formattedAddress || `${l.addressLine1||''}, ${l.city||''}, ${l.state||''} ${l.zipCode||''}`.trim().replace(/^,\s*/,'');
      const lp = l.price || l.listPrice || 0;
      listingsSection += `\n${i+1}. ${addr}\n`;
      listingsSection += `   ${$$(lp)}`;
      if (l.bedrooms)     listingsSection += ` · ${l.bedrooms} bd`;
      if (l.bathrooms)    listingsSection += ` · ${l.bathrooms} ba`;
      if (l.squareFootage) listingsSection += ` · ${Number(l.squareFootage).toLocaleString()} sqft`;
      listingsSection += `\n   View Listing → ${relayUrl(l)}\n`;
listingsSection += `   The address will be copied to your clipboard automatically.\n`;
listingsSection += `      Paste it in the search bar on the next page.\n`;
    });
    listingsSection += '\nAll links open on KelvinHart.fathomrealty.com — your dedicated portal.\n';
  }

  const params = {
    client_name:   `${c.fname} ${c.lname}`,
    client_email:  c.email,
    client_phone:  c.phone || 'Not provided',
    purchase_price: $$(price),
    loan_amount:   $$(loan),
    down_payment:  $$(dp),
    dp_pct:        S.dp,
    interest_rate: S.rate.toFixed(1),
    monthly_pi:    $$(pi),
    monthly_ti:    $$(ti),
    piti_budget:   $$(S.budget),
    equity_section:   equitySection,
    listings_section: listingsSection,
    to_email:  c.email,
    reply_to:  c.email
  };

  try {
    await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params);
    const sentMsg = S.listings.length > 0
      ? `Results + ${S.listings.length} listings sent. Check your inbox, and spam folder just in case.`
      : 'Results sent. Check your inbox, and spam folder just in case.';
    setStatus(sentMsg, 'email-ok');
    S.emailSent = true;
  } catch(err) {
    console.error('EmailJS error:', err);
    setStatus('Send failed. Please try again or call Kelvin directly at (317) 833-8419.', 'email-er');
  }
  setBtnsDisabled(false);
  updateEmailButton();
}

// ─── RESET ────────────────────────────────────────────────────────────────────
function reset() {
  S = {type:null,budget:2000,rate:7.0,dp:10,hv:300000,mb:200000,results:null,contact:null,listings:[],emailSent:false,searchZip:null,searchBeds:null,searchBaths:null,airtableRecordId:null};
  document.getElementById('opt-ho').classList.remove('sel');
  document.getElementById('opt-rn').classList.remove('sel');
  document.getElementById('s1-next').disabled = true;
  document.getElementById('list-wrap').classList.add('hidden');
  document.getElementById('srch-err').classList.add('hidden');
  document.getElementById('res-greeting').innerHTML = '';
  document.getElementById('email-status').className = 'email-status hidden';
  const es2 = document.getElementById('email-status-2'); if (es2) es2.className = 'email-status hidden';
  document.getElementById('email-btn').textContent = 'Send Results';
  const eb2 = document.getElementById('email-btn-2'); if (eb2) eb2.textContent = 'Send Results';
  ['c-fname','c-lname','c-email','c-phone'].forEach(id => {
    document.getElementById(id).value = '';
    document.getElementById(id).classList.remove('inp-err');
  });
  ['e-fname','e-lname','e-email'].forEach(id => document.getElementById(id).classList.add('hidden'));
  showStep('s1');
}

// ─── PROPERTY SEARCH — RentCast API ──────────────────────────────────────────
async function searchListings() {
  const zip   = document.getElementById('zip').value.trim();
  const beds  = parseInt(document.getElementById('beds').value);
  const baths = parseFloat(document.getElementById('baths').value);
  const price = S.results?.price || 400000;
  const lo    = Math.max(0, Math.round(price - 75000));
  const hi    = Math.round(price + 75000);  // ±$75K range
  const errEl = document.getElementById('srch-err');

  errEl.classList.add('hidden');
  document.getElementById('list-wrap').classList.add('hidden');

  if (!/^\d{5}$/.test(zip)) {
    errEl.textContent = 'Please enter a valid 5-digit zip code.';
    errEl.classList.remove('hidden');
    return;
  }

  const btn = document.getElementById('srch-btn');
  const ld  = document.getElementById('srch-ld');
  btn.disabled = true;
  ld.classList.remove('hidden');

  const bedsToFetch = [beds, beds+1, beds+2].slice(0, 3);
  let allListings = [];

  async function rentcastFetch(targetUrl) {
    try {
      const r = await fetch(targetUrl, {headers: {'X-Api-Key': RENTCAST_KEY, 'Accept': 'application/json'}});
      if (r.ok || r.status === 429 || r.status === 403) return r;
      throw new Error('http_' + r.status);
    } catch(directErr) {
      const proxied = `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`;
      const r = await fetch(proxied, {headers: {'X-Api-Key': RENTCAST_KEY, 'Accept': 'application/json'}});
      return r;
    }
  }

  try {
    for (const b of bedsToFetch) {
      const url = new URL('https://api.rentcast.io/v1/listings/sale');
      url.searchParams.set('zipCode', zip);
      url.searchParams.set('bedrooms', b);
      url.searchParams.set('status', 'Active');
      url.searchParams.set('minPrice', lo);   // correct RentCast param name
      url.searchParams.set('maxPrice', hi);   // correct RentCast param name
      url.searchParams.set('limit', '10');

      const res = await rentcastFetch(url.toString());
      if (!res.ok) {
        if (res.status === 429) throw new Error('rate_limit');
        if (res.status === 403) throw new Error('auth');
        continue;
      }
      const data = await res.json();
      const listings = Array.isArray(data) ? data : (data.data || data.listings || []);
      allListings.push(...listings.filter(l => {
  const lPrice = l.price || l.listPrice || 0;
  return (l.bathrooms || 0) >= baths && lPrice >= lo && lPrice <= hi;
}));
    }

    const seen = new Set();
    const unique = allListings.filter(l => {
      const key = l.id || l.formattedAddress || l.addressLine1;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 6);

    if (unique.length > 0) {
      renderListings(unique, zip, beds, baths, lo, hi);
    } else {
      errEl.textContent = `No active listings found in ${zip} for ${beds}+ bed · ${baths}+ bath · ${$$(lo)}–${$$(hi)}. Try adjusting your filters or a nearby zip.`;
      errEl.classList.remove('hidden');
    }
  } catch(e) {
    if (e.message === 'rate_limit') {
      errEl.textContent = 'Search limit reached for this month (free tier: 50 searches). Contact Kelvin directly to explore available listings.';
    } else if (e.message === 'auth') {
      errEl.textContent = 'Property search API key issue. Please contact Kelvin at (317) 833-8419.';
    } else {
      errEl.innerHTML = `Property search couldn't connect right now. <a href="${HOME_SEARCH_URL}" target="_blank" rel="noopener" style="color:var(--red);font-weight:600">Search directly on KelvinHart.com →</a>`;
    }
    errEl.classList.remove('hidden');
  }

  btn.disabled = false;
  ld.classList.add('hidden');
}

function renderListings(listings, zip, beds, baths, lo, hi) {
  S.listings    = listings;
  S.searchZip   = zip;
  S.searchBeds  = beds;
  S.searchBaths = baths;

  saveToAirtable();

  document.getElementById('list-ct').textContent = listings.length;
  document.getElementById('list-range-lbl').textContent = `${zip} · ${beds}+ bd · ${baths}+ ba · ${$$(lo)}–${$$(hi)}`;

  document.getElementById('listing-grid').innerHTML = listings.map((l, idx) => {
    const addr  = l.formattedAddress || `${l.addressLine1||''}, ${l.city||''}, ${l.state||''}`.trim().replace(/^,\s*/,'');
    const price = l.price || l.listPrice || 0;
    const dom   = l.daysOnMarket != null ? `${l.daysOnMarket} days on market` : '';
    const type  = (l.propertyType || '').replace(/_/g,' ');
    return `<div class="lc lc-link" onclick="openListing(${idx})" role="button" tabindex="0" onkeydown="if(event.key==='Enter')openListing(${idx})">
      <div class="lch">
        <div class="lcp">${$$(price)}</div>
        <div class="lca">${addr}</div>
      </div>
      <div class="lcb">
        <div class="lcs">
          <span>${iconSvg('bed')} ${l.bedrooms||'—'} bd</span>
          <span>${iconSvg('bath')} ${l.bathrooms||'—'} ba</span>
          ${l.squareFootage ? `<span>${iconSvg('area')} ${Number(l.squareFootage).toLocaleString()} ft²</span>` : ''}
        </div>
        <div class="lcf">
          ${dom  ? `<span class="lc-dom">${dom}</span>`  : '<span></span>'}
          ${type ? `<span class="lc-type">${type}</span>` : ''}
        </div>
        <div class="lc-cta">${iconSvg('copy')} Copy Address &amp; Search →</div>
      </div>
    </div>`;
  }).join('');

  document.getElementById('list-wrap').classList.remove('hidden');
  document.getElementById('list-wrap').scrollIntoView({behavior:'smooth', block:'start'});
  updateEmailButton();
}

// ─── COPY ADDRESS → TOAST → REDIRECT TO FATHOM ────────────────────────────────
async function openListing(idx) {
  const l = S.listings[idx];
  if (!l) return;
  const addr = l.formattedAddress
    || `${l.addressLine1||''}, ${l.city||''}, ${l.state||''} ${l.zipCode||''}`.trim().replace(/^,\s*/,'');

  let copied = false;
  try {
    await navigator.clipboard.writeText(addr);
    copied = true;
  } catch(e) {
    try {
      const ta = document.createElement('textarea');
      ta.value = addr;
      ta.style.position = 'fixed'; ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      copied = true;
    } catch(err) { copied = false; }
  }

  const toast = document.getElementById('toast');
  toast.innerHTML = copied
    ? `<div class=\"toast-ic\">${iconSvg('copy')}</div>\n       <div class=\"toast-tt\">Address Copied</div>
       <div class="toast-addr">${addr}</div>
       <div class="toast-msg">Paste it in the search bar on the next page</div>
       <div class="toast-bar"><div class="toast-bar-fill"></div></div>`
    : `<div class=\"toast-ic\">${iconSvg('link')}</div>\n       <div class=\"toast-tt\">Address: ${addr}</div>
       <div class="toast-msg">Opening KelvinHart.com — search this address there</div>
       <div class="toast-bar"><div class="toast-bar-fill"></div></div>`;
  toast.classList.add('show');

  setTimeout(() => {
    window.open(HOME_SEARCH_URL, '_blank', 'noopener');
    setTimeout(() => toast.classList.remove('show'), 600);
  }, 2500);
}


// ─── PREVENT CHATBOT AUTO-OPEN ── (defined in index.html to avoid duplication)
// ─── INIT ─────────────────────────────────────────────────────────────────────
refreshEq();
initPhoneFormatting();
showStep('s1');
