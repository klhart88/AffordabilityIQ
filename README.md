# AffordabilityIQ by Hart

Home affordability calculator and listing search tool — built for Kelvin Hart, Realtor @ Fathom Realty Indiana.

---

## Project Structure

```
affordabilityiq/
├── index.html       — Main HTML (layout, structure, all step markup)
├── styles.css       — All styling (design system, layout, responsive)
├── app.js           — All JavaScript (calculator logic, APIs, interactions)
├── manifest.json    — PWA manifest
├── assets/          — Favicons & share image (add manually)
│   ├── favicon.ico
│   ├── favicon-32x32.png
│   ├── favicon-16x16.png
│   ├── apple-touch-icon.png
│   └── share-image.png   ← 1200×630px OG image
└── README.md
```

---

## Local Development

Open in VS Code and launch with **Live Server** (right-click `index.html` → *Open with Live Server*).

No build tools required — plain HTML, CSS, and vanilla JS.

---

## Credentials (all in `app.js` — top of file)

| Service     | Variable              | Value                                |
|-------------|----------------------|--------------------------------------|
| EmailJS     | `EMAILJS_SERVICE`    | `service_m3nxglc`                    |
| EmailJS     | `EMAILJS_TEMPLATE`   | `template_qzj7bt5`                   |
| EmailJS     | `EMAILJS_KEY`        | `cwY7cLvTSDnRlXoso`                  |
| Airtable    | `AIRTABLE_BASE`      | `appFFld4ImANnTKz3`                  |
| Airtable    | `AIRTABLE_TABLE`     | `Leads`                              |
| Airtable    | `AIRTABLE_TOKEN`     | `patCio08bvxalsax7.a5f...`           |
| RentCast    | `RENTCAST_KEY`       | `244e09bec88c47fa85fac1f3cb9696b4`   |
| Fathom      | `FATHOM_BASE`        | `https://kelvinhart.fathomrealty.com`|
| Home Search | `HOME_SEARCH_URL`    | `https://kelvinhart.fathomrealty.com/property-search/any/status=active,viewport=40.098659:-85.779579_39.576687:-86.452491`|

> ⚠️ Keep these credentials private. Do not commit to a public repository without using environment variable injection.

---

## Third-Party Services

- **EmailJS** — sends results to client + Kelvin. Uses existing account/template.
- **Airtable** — CRM lead capture. Creates/updates a record per session.
- **RentCast API** — property listing search (active MLS listings).
- **JotForm AI Chatbot** — embedded via CDN script at bottom of `index.html`.

### Chatbot embed ID
The JotForm agent ID in `index.html` is:
```
019438e2115c7445a4fb44e560c787d8bc5a
```
This matches the original `dream-home-calculator.html` implementation exactly.

---

## Deployment (GitHub Pages)

1. Push this folder to a GitHub repo (e.g. `klhart88/affordabilityiq`).
2. Go to **Settings → Pages → Source**: deploy from `main` branch, root `/`.
3. Optionally add a custom domain in Pages settings.
4. Once live, disable/unpublish the original `dream-home-calculator.html` version.

---

## Assets Needed

Place these files in the `/assets/` folder before going live:

| File                  | Notes                             |
|-----------------------|-----------------------------------|
| `favicon.ico`         | Multi-size ICO                    |
| `favicon-32x32.png`   | 32×32 PNG                         |
| `favicon-16x16.png`   | 16×16 PNG                         |
| `apple-touch-icon.png`| 180×180 PNG                       |
| `share-image.png`     | 1200×630 OG/Twitter share image   |

---

## Key Functionality

| Feature               | Where                     |
|-----------------------|---------------------------|
| Step wizard (5 steps) | `index.html` + `app.js`   |
| PITI math             | `app.js → piFromPITI()`   |
| Equity calculation    | `app.js → calcEquity()`   |
| Airtable CRM save     | `app.js → saveToAirtable()`|
| EmailJS send          | `app.js → sendResults()`  |
| RentCast search       | `app.js → searchListings()`|
| Copy-address toast    | `app.js → openListing()`  |
| Chat nudge tooltip    | `app.js → showChatNudge()`|
| Chatbot avatar swap   | `app.js` (IIFE at bottom) |
