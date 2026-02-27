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

## Blog Posts (15 total)

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
| `laylat-al-qadr-2026.html` | Guide | No |
| `zakat-al-fitr-2026.html` | Guide | No |

## Adding a New Blog Post — MANDATORY 4-Step Checklist

Every time a new blog post is created, ALL four steps are required. Skipping any step causes bugs.

1. **Create the HTML file** in `blog/posts/your-slug.html`
2. **Add to `assets/js/posts-data.js`** — add a new entry to `BLOG_POSTS` array (newest posts near top of the grid section). This is what makes the post appear in the blog listing automatically.
3. **Update `sitemap.xml`** — add the new `<url>` entry
4. **If Ramadan-related: update `ramadan.html`** — add a resource card to the "Ramadan 2026 Guides & Articles" section

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

## JavaScript Module Pattern

Every JS file uses the top-level object pattern. **Never use classes or loose global functions.**

```js
// ✅ Correct pattern
const ModuleName = {
  someProperty: 'value',

  init() { ... },

  helperMethod() { ... }
};

document.addEventListener('DOMContentLoaded', () => {
  ModuleName.init();
});

// ❌ Wrong — do not use
class ModuleName { ... }
function someFunction() { ... }  // loose global
var x = ...;                     // no var
```

**Module responsibilities (never mix concerns):**
- `utils.js` → Utils: pure utility functions, no API calls, no DOM side-effects
- `api.js` → MetalsAPI (gold/silver prices) + CurrencyAPI (exchange rates)
- `calculator.js` → ZakatCalculator: depends on MetalsAPI, CurrencyAPI, Utils
- `email-capture.js` → email forms only
- `ramadan-countdown.js` → countdown widget only
- `blog.js` → blog filtering/search UI only
- `affiliates.js` → affiliate link handling only

## CSS Design System

Always use CSS custom properties — **never hardcode hex colors**:

```css
/* Brand Colors */
--color-primary: #0F5132         /* Islamic green */
--color-primary-light: #1a7a4c  /* Hover green */
--color-primary-dark: #0a3821   /* Dark green (header, footer) */
--color-secondary: #D4AF37      /* Gold accent */
--color-secondary-light: #e6c84d /* Light gold (hover) */

/* Backgrounds & Surfaces */
--color-background: #FFFFFF      /* Page background */
--color-surface: #F8F9FA        /* Light surface (cards, inputs) */
--color-surface-alt: #F0F4F1    /* Alt surface (section backgrounds) */

/* Text */
--color-text: #2C3E50           /* Primary body text */
--color-text-light: #5D6D7E     /* Secondary/label text */
--color-text-muted: #95A5A6     /* Hints, captions, placeholders */

/* UI */
--color-trust: #2874A6          /* Trust/link blue */
--color-border: #DEE2E6         /* Input and card borders */
--color-success: #28A745
--color-warning: #FFC107
--color-error: #DC3545

/* Shadows */
--shadow-sm: 0 1px 3px rgba(0,0,0,0.08)
--shadow-md: 0 4px 12px rgba(0,0,0,0.1)
--shadow-lg: 0 8px 30px rgba(0,0,0,0.12)

/* Border Radius */
--radius-sm: 6px
--radius-md: 10px
--radius-lg: 16px
```

All responsive media queries go in `responsive.css` only, not scattered in `main.css`.

## Architecture Rules (DO NOT VIOLATE)

1. **No direct gold-api.com calls from browser** — always use `/.netlify/functions/metals`
2. **No absolute paths in HTML** — all links must be relative (see Path Conventions above)
3. **No npm/build step** — zero-dependency project, works by opening index.html in a browser
4. **No hardcoded brand colors** — always use CSS custom properties
5. **Google Fonts: preload pattern only** — never `<link rel="stylesheet">` directly for Google Fonts
6. **Netlify form names must be globally unique** across the entire site
7. **JS modules follow object pattern** — no classes, no loose globals, no `var`
8. **Blog listing is data-driven** — `blog/index.html` renders cards from `assets/js/posts-data.js`. NEVER add hardcoded blog cards directly to `blog/index.html`; always add to `posts-data.js` instead.

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

### Phase 4 (Architecture — Feb 2026)
- **New blog posts** added: `laylat-al-qadr-2026.html`, `zakat-al-fitr-2026.html` (total: 15 posts)
- **Data-driven blog listing** — created `assets/js/posts-data.js` as single source of truth; `blog/index.html` now renders all cards dynamically via JS (no more hardcoded HTML cards)
- **Blog schema auto-generated** — `blog/index.html` JSON-LD schema injected by `blog.js` from posts-data, stays in sync automatically
- **ramadan.html articles section** updated with Laylat al-Qadr and Zakat al-Fitr posts
- **Cache-busting** — added `?v=2` to all CSS `<link>` tags across all 28 HTML pages (fixes currency warning bug for returning visitors)

## Slash Commands (Claude Multi-Agent System)

These commands are in `.claude/commands/` and act as specialized agents:

| Command | Purpose |
|---------|---------|
| `/new-feature` | Implement any new feature (page, JS module, CSS, widget) |
| `/new-blog-post` | Write a new blog post with correct structure, schema, and SEO |
| `/review` | Review current git diff against all architecture rules |
| `/architecture-check` | Full codebase audit: paths, modules, SEO, sitemap, forms |
| `/seo-audit` | Comprehensive SEO audit of all pages |
| `/create-pr` | Generate a PR description and create the GitHub PR |

**How to use:** Type `/new-blog-post Laylat al-Qadr 2026` and Claude will follow the full workflow from keyword planning to sitemap update.

## Docs

Additional documentation in `/docs/`:
- `docs/ARCHITECTURE.md` — Full architecture decisions, dependency map, CSS system, Netlify config details
- `docs/SEO-STRATEGY.md` — Keyword map, content calendar, link building, on-page formulas, tracking

## Active Priorities

- Submit sitemap to Google Search Console for `zakateasy.org` property
- Request indexing for all blog posts via URL Inspection tool
- Next blog posts (for Ramadan 2026 ~Mar 1):
  - Use `/new-blog-post` command; then add to `posts-data.js`, update `sitemap.xml`, and (if Ramadan-related) `ramadan.html`
