# ZakatEasy — Claude Project Context

## What this project is

**ZakatEasy** (zakateasy.org) is a free, privacy-focused Islamic Zakat calculator. It calculates Zakat obligations on gold, silver, cash, and investments using live commodity prices. All calculations run in the browser — no user data is sent to a server.

## Tech Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (no framework, no build step)
- **Hosting:** Netlify (free tier), deploy from root directory
- **APIs:** `gold-api.com` (free gold/silver prices, proxied via `/.netlify/functions/metals` due to CORS)
- **Fonts:** Google Fonts (Playfair Display, Inter, Amiri)
- **No npm, no build process** — just open `index.html` in a browser

## Project Structure

```
zakateasy/
├── index.html              # Homepage — main Zakat calculator
├── about.html              # About page
├── faq.html                # 13+ FAQ answers about Zakat
├── what-is-zakat.html      # Educational: Zakat explainer
├── ramadan.html            # Ramadan hub (dates, Laylat al-Qadr, Zakat al-Fitr)
├── duas.html               # Duas (Islamic prayers) reference page
├── thank-you.html          # Post-form submission confirmation
├── 404.html                # Custom 404 page
├── blog/
│   ├── index.html          # Blog listing page
│   └── posts/              # 12 blog post HTML files (see Blog Posts section)
├── downloads/
│   └── ramadan-zakat-checklist.html  # Lead magnet checklist page
├── legal/
│   ├── disclaimer.html
│   ├── privacy-policy.html
│   └── terms.html
├── assets/
│   ├── images/             # SVGs, icons, og-image
│   ├── css/                # main.css, responsive.css
│   └── js/                 # JavaScript modules
├── netlify.toml            # Netlify config (headers, redirects, functions)
├── netlify/functions/      # Serverless function: metals.js (gold/silver proxy)
├── robots.txt
├── sitemap.xml
├── ads.txt                 # AdSense ads.txt
├── googled3d7157e10118723.html  # Google Search Console verification
└── llms.txt                # LLM-friendly site description
```

## Blog Posts (12 total)

| File | Category | FAQPage Schema |
|------|----------|----------------|
| `complete-guide-zakat-ramadan-2026.html` | Guide | No |
| `ramadan-2026-complete-guide.html` | Guide | No |
| `ramadan-zakat-calculator-tutorial.html` | Tutorial | No |
| `best-islamic-charities-2026.html` | Resources | No |
| `best-islamic-products-ramadan-2026.html` | Products | No |
| `zakat-nisab-2026.html` | FAQ | No |
| `zakat-calculator-usa-2026.html` | FAQ | No |
| `can-i-pay-zakat-in-ramadan.html` | FAQ | **Yes** |
| `zakat-on-gold-during-ramadan.html` | FAQ | **Yes** |
| `common-zakat-mistakes-ramadan.html` | FAQ | **Yes** |
| `zakat-vs-sadaqah-vs-fitrana.html` | FAQ | **Yes** |
| `zakat-on-savings-2026.html` | FAQ | **Yes** |
| `last-day-pay-zakat-ramadan-2026.html` | FAQ | **Yes** |

## Core Calculator Logic

1. **Fetch live prices** via `/.netlify/functions/metals` (proxies gold-api.com). Cached in `localStorage` for 24 hours.
2. **Nisab threshold** = 87.48g of gold (gold standard, scholarly consensus).
3. **User inputs:** cash, gold weight, silver weight, investments, business inventory, receivables.
4. **Zakat due** = 2.5% of total net zakatable wealth (if above Nisab).

## Path Conventions (Relative Links)

| Page location | Prefix for root assets |
|---------------|----------------------|
| Root pages (`index.html`, etc.) | `assets/`, `blog/`, `ramadan.html` |
| `blog/index.html` | `../assets/`, `../index.html`, `../ramadan.html` |
| `blog/posts/*.html` | `../../assets/`, `../../index.html`, `../../ramadan.html` |
| `legal/*.html` | `../assets/`, `../index.html`, `../ramadan.html` |
| `downloads/*.html` | `../assets/`, `../index.html`, `../ramadan.html` |

## Coding Conventions

- **No TypeScript, no framework** — pure vanilla JS
- Keep JavaScript modular: separate concerns (price fetching, calculation logic, UI updates)
- Use `const` / `let` — no `var`
- CSS: mobile-first, use CSS custom properties (`--color-primary: #0F5132`, `--color-secondary: #D4AF37`)
- Islamic content must be accurate and cite sources (Quran, Hadith, scholarly consensus)
- Accessibility: ARIA labels on form inputs, sufficient color contrast

## Netlify Forms

- Use `data-netlify="true"` + unique `name` attribute per form
- Each form needs `<input type="hidden" name="form-name" value="FORM_NAME">`
- Form names used: `newsletter-footer-*` (one per page), `exit-intent-*` (one per page)

## SEO Structured Data — What Each Page Has

| Page | Schema types |
|------|-------------|
| `index.html` | WebSite, WebApplication, Organization, FAQPage |
| `faq.html` | FAQPage, BreadcrumbList |
| `about.html` | Organization, BreadcrumbList |
| `what-is-zakat.html` | Article, BreadcrumbList |
| `ramadan.html` | Article, BreadcrumbList, Event |
| `duas.html` | Article, BreadcrumbList |
| `blog/posts/*.html` | Article, BreadcrumbList (+ FAQPage for 6 FAQ posts) |

## SEO Notes

- Homepage title: "Free Zakat Calculator Online 2026 – Gold, Silver & Savings"
- Every page has: canonical URL, Open Graph tags, Twitter Card, JSON-LD schema
- Font loading: use `rel="preload"` + `onload` pattern (non-blocking), not direct `<link rel="stylesheet">` for Google Fonts
- Google AdSense: `ca-pub-6867328086411956`
- Google Analytics: `G-R8S4MBWFTK`
- Sitemap: `sitemap.xml` — update manually when adding new pages
- netlify.toml has domain redirects: `zakateasy.netlify.app/*` → `zakateasy.org`, `www.zakateasy.org/*` → `zakateasy.org`

## Footer Structure (All Pages)

Each page footer has 4 columns: Brand | Pages | Resources | Legal

**Pages column** (added Ramadan + Duas in Phase 2):
- Zakat Calculator → `index.html`
- What is Zakat? → `what-is-zakat.html`
- Ramadan → `ramadan.html`
- Duas → `duas.html`
- FAQ → `faq.html`
- About → `about.html`

## Key Gotchas

- `gold-api.com` blocks browser CORS — always use the Netlify serverless proxy
- `netlify.toml` `/*` catch-all redirect catches function calls — keep explicit `/.netlify/functions/*` rule BEFORE the catch-all
- Background Task agents can fail silently — create files directly as fallback
- Do NOT add npm/node dependencies — zero-build project

## Completed Work

### Phase 1 (Initial Build)
- Full site structure: calculator, blog (8 posts), legal, downloads, thank-you, 404
- CSS design system, responsive layout, nav/footer
- Ramadan countdown widget on homepage
- Email capture: sticky bar + exit intent popup
- Lead magnet: Ramadan Zakat Checklist page
- Sitemap, robots.txt, ads.txt, llms.txt

### Phase 2 (SEO & Performance)
- Added 4 more blog posts (total: 12)
- Ramadan hub page + Duas page
- netlify.toml domain redirect rules (zakateasy.netlify.app → zakateasy.org)
- WebSite schema + WebApplication schema on homepage
- Fixed Google Fonts to use non-blocking preload pattern on all pages
- Fixed org schema (removed empty sameAs array)

### Phase 3 (SEO Improvements — Feb 2026)
- **FAQPage schema** added to 6 FAQ-type blog posts (rich snippet eligible)
- **BreadcrumbList schema** added to `faq.html` and `about.html`
- **Internal links** added in `what-is-zakat.html` → related blog posts
- **Footer Pages column** updated on all 24 pages (added Ramadan + Duas links)
- **Homepage title/OG** updated to include "online" keyword

## Active Priorities

- Submit sitemap to Google Search Console for `zakateasy.org` property
- Request indexing for all blog posts via URL Inspection tool
- Upcoming blog posts needed (before Ramadan 2026 ~Mar 1):
  - Laylat al-Qadr 2026 guide (publish ~Mar 11–15)
  - Zakat al-Fitr 2026 guide (publish by Mar 21)
