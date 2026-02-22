# /architecture-check — Architecture Guardian Agent

Perform a full architecture audit of ZakatEasy. Scan ALL files, not just recent changes.

---

## 1. Relative Path Audit

For every HTML file, verify correct path prefix for its location:

| Location | Correct asset prefix | Correct root link |
|----------|---------------------|-------------------|
| Root (index.html, faq.html, etc.) | `assets/` | `index.html` |
| `blog/index.html` | `../assets/` | `../index.html` |
| `blog/posts/*.html` | `../../assets/` | `../../index.html` |
| `legal/*.html` | `../assets/` | `../index.html` |
| `downloads/*.html` | `../assets/` | `../index.html` |

Flag any file using the wrong prefix.

---

## 2. JavaScript Module Pattern

Check every `.js` file in `assets/js/`:
- [ ] Uses `const ModuleName = { ... }` object pattern (not classes, not loose functions)
- [ ] No `var` declarations anywhere — only `const` / `let`
- [ ] No code outside of module objects except `document.addEventListener('DOMContentLoaded', ...)`
- [ ] Each module has a clear single responsibility:
  - `utils.js` — pure utility functions only (no API calls, no DOM manipulation beyond helpers)
  - `api.js` — MetalsAPI + CurrencyAPI only
  - `calculator.js` — ZakatCalculator only
  - `email-capture.js` — email forms only
  - `ramadan-countdown.js` — countdown widget only
  - `blog.js` — blog UI only
  - `affiliates.js` — affiliate links only

---

## 3. API Security Check

Scan ALL JS files for:
- Any direct `fetch('https://api.gold-api.com/...')` from client code → ❌ CRITICAL (must use Netlify proxy)
- Any hardcoded API keys or tokens → ❌ CRITICAL
- Verify `netlify/functions/metals.js` is the only place that calls gold-api.com

---

## 4. Google Fonts Pattern

Check ALL 24+ HTML files. Every font load must use preload+onload pattern:
```html
<link rel="preload" as="style" href="https://fonts.googleapis.com/..." onload="this.onload=null;this.rel='stylesheet'">
<noscript><link rel="stylesheet" href="..."></noscript>
```
Flag any page using direct `<link rel="stylesheet" href="https://fonts.googleapis.com/...">`.

---

## 5. Footer Consistency

Check ALL HTML pages. Every footer must have these 6 links (in Pages column):
1. Zakat Calculator → root `index.html` (relative)
2. What is Zakat? → root `what-is-zakat.html` (relative)
3. Ramadan → root `ramadan.html` (relative)
4. Duas → root `duas.html` (relative)
5. FAQ → root `faq.html` (relative)
6. About → root `about.html` (relative)

Also verify: Legal column links (Disclaimer, Privacy Policy, Terms) present.

---

## 6. SEO Completeness

For every HTML page, check:
- [ ] `<title>` tag exists and is unique
- [ ] `<meta name="description">` exists and is unique
- [ ] `<link rel="canonical">` exists with correct URL
- [ ] `og:title`, `og:description`, `og:url`, `og:image` present
- [ ] Twitter Card tags present
- [ ] JSON-LD schema present
- [ ] Blog posts in `blog/posts/`: Article schema + BreadcrumbList schema
- [ ] FAQ-type blog posts: FAQPage schema (see CLAUDE.md for which 6 posts have it)
- [ ] Google Analytics tag (G-R8S4MBWFTK) present on all pages
- [ ] AdSense tag (ca-pub-6867328086411956) present on all pages

---

## 7. Sitemap Coverage

Read `sitemap.xml`. Compare against all HTML files.
Flag any HTML page missing from sitemap.
Flag any URL in sitemap that doesn't correspond to a real file.

---

## 8. Netlify Forms Audit

Check all forms across all pages:
- [ ] Each form has `data-netlify="true"`
- [ ] Each form has `<input type="hidden" name="form-name" value="...">`
- [ ] Every form `name` attribute is globally unique across the entire site
- [ ] No two pages share the same form name

---

## 9. CSS Custom Properties

Scan all CSS files and inline styles:
- [ ] No hardcoded hex colors — always use CSS custom properties:
  - `#0F5132` → `var(--color-primary)`
  - `#0a3821` → `var(--color-primary-dark)`
  - `#1a7a4c` → `var(--color-primary-light)`
  - `#D4AF37` → `var(--color-secondary)`
  - `#e6c84d` → `var(--color-secondary-light)`
  - `#2C3E50` → `var(--color-text)`
  - `#5D6D7E` → `var(--color-text-light)`
  - `#95A5A6` → `var(--color-text-muted)`
  - `#F8F9FA` → `var(--color-surface)`
  - `#F0F4F1` → `var(--color-surface-alt)`
  - `#DEE2E6` → `var(--color-border)`
- [ ] All breakpoints defined in `responsive.css`, not scattered in `main.css`

---

## Output Format

Generate a report:

```
ARCHITECTURE AUDIT REPORT — ZakatEasy
Date: [today]

CRITICAL ISSUES (block deployment)
❌ [file:line] — [issue]

WARNINGS (fix before next release)
⚠️  [file:line] — [issue]

PASSING CHECKS
✅ [category] — [description]

SUMMARY
- X critical issues
- Y warnings
- Z categories fully passing
```
