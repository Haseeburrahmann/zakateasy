# /new-feature — Feature Implementation Agent

You are implementing a new feature for ZakatEasy (zakateasy.org).
Feature requested: $ARGUMENTS

## Your Workflow

### 1. Understand the request
- What type of feature is this? (new page, calculator enhancement, JS module, CSS change, blog post, netlify function)
- What pages/files will be affected?
- Does it need a new HTML page, or modify an existing one?

### 2. Plan (write it out before coding)
List:
- Files to create
- Files to modify
- Relative path prefix needed (root / blog/posts / legal / downloads)
- New Netlify form names needed (if any)
- New sitemap entries (if any)

### 3. Check architecture rules before writing ANY code
Read CLAUDE.md fully. Verify your plan follows:
- Correct relative path conventions for each file's location
- CSS uses `--color-primary`, `--color-primary-dark`, `--color-secondary`, `--color-text`, `--color-surface`, `--color-border` custom properties — no hardcoded hex colors
- JavaScript uses `const`/`let`, object pattern (`const MyModule = { ... }`)
- No direct calls to gold-api.com — always use `/.netlify/functions/metals`
- Google Fonts uses the non-blocking preload pattern (NOT `<link rel="stylesheet">` directly)
- Netlify forms: `data-netlify="true"`, hidden `form-name` input, unique form name per page

### 4. Implement
Build the feature. For new HTML pages:
- Copy nav and footer structure from the closest existing page
- Include ALL SEO tags: title, meta description, canonical, OG tags, Twitter Card, JSON-LD schema
- Add BreadcrumbList schema for non-homepage pages
- Use semantic HTML: `<main>`, `<article>`, `<section>`, `<nav>`, `<header>`, `<footer>`
- Add ARIA labels to interactive elements

### 5. Update supporting files
- **sitemap.xml** — add new page URL with lastmod and priority
- **netlify.toml** — add clean URL redirect if it's a root page (e.g., `/page.html` → `/page`)
- **CLAUDE.md** — update the Blog Posts table or Completed Work section

### 6. Self-review checklist
Before declaring done, verify:
- [ ] Correct relative paths (`../../assets/` for blog/posts, `../assets/` for legal/downloads, `assets/` for root)
- [ ] Footer has all 6 links: Zakat Calculator, What is Zakat?, Ramadan, Duas, FAQ, About
- [ ] SEO: unique title (50-60 chars), meta description (150-160 chars), canonical URL
- [ ] Open Graph + Twitter Card tags present
- [ ] JSON-LD schema present and valid
- [ ] No hardcoded colors — uses CSS custom properties
- [ ] No `var` — only `const`/`let`
- [ ] Islamic content is accurate and cites source (Quran, Hadith, or scholarly consensus)
- [ ] Sitemap.xml updated
- [ ] Accessibility: images have alt, inputs have aria-label, sufficient contrast
