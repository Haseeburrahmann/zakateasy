# /review — Code Review Agent

Review the current git changes for ZakatEasy. Run: `git diff HEAD` or `git diff --cached`

---

## ZakatEasy Code Review Checklist

### 🔴 Critical — Must Fix Before Merge

**Relative Paths (most common bug)**
- [ ] Root pages (`index.html`, `faq.html`, etc.) use `assets/`, `blog/`, `legal/`
- [ ] `blog/index.html` uses `../assets/`, `../index.html`
- [ ] `blog/posts/*.html` uses `../../assets/`, `../../index.html`
- [ ] `legal/*.html` and `downloads/*.html` use `../assets/`, `../index.html`
- [ ] NO absolute paths starting with `/` — this is a plain HTML site, not a server app

**API Security**
- [ ] No direct `fetch('https://api.gold-api.com/...')` calls from browser — ALWAYS use `/.netlify/functions/metals`
- [ ] No API keys, tokens, or secrets in any client-side JS or HTML file
- [ ] No sensitive data stored in localStorage beyond cached prices + user currency preference

**JavaScript**
- [ ] No `var` — only `const` and `let`
- [ ] No inline JS in HTML (no `onclick=`, `onload=` attributes in HTML tags, except Google Fonts pattern)
- [ ] New JS modules use the object pattern: `const ModuleName = { ... };`

**Google Fonts**
- [ ] Uses preload+onload pattern ONLY — never direct `<link rel="stylesheet">` for Google Fonts
  ```html
  <!-- CORRECT ✅ -->
  <link rel="preload" as="style" href="https://fonts.googleapis.com/..." onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/..."></noscript>

  <!-- WRONG ❌ -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/...">
  ```

**Islamic Content**
- [ ] All Zakat amounts/thresholds are accurate (Nisab = 87.48g gold / 612.36g silver, rate = 2.5%)
- [ ] Quran verses and Hadith are quoted correctly and cited

---

### 🟡 Warnings — Should Fix

**SEO (for new/modified HTML pages)**
- [ ] Title tag: unique, 50-60 chars, includes primary keyword
- [ ] Meta description: unique, 150-160 chars
- [ ] Canonical URL present and correct
- [ ] Open Graph tags: og:title, og:description, og:image, og:url, og:type
- [ ] Twitter Card tags present
- [ ] JSON-LD schema present (Article for blog posts, appropriate type for other pages)
- [ ] BreadcrumbList schema for non-homepage pages
- [ ] H1 contains primary keyword, only ONE H1 per page
- [ ] Images have meaningful alt attributes

**CSS**
- [ ] Uses CSS custom properties for brand colors, NOT hardcoded hex:
  - `--color-primary: #0F5132` (Islamic green)
  - `--color-primary-dark: #0a3821` (header/footer)
  - `--color-secondary: #D4AF37` (gold accent)
  - `--color-text: #2C3E50` (body text)
  - `--color-text-light: #5D6D7E` (labels)
  - `--color-text-muted: #95A5A6` (hints)
  - `--color-surface: #F8F9FA` (card backgrounds)
  - `--color-border: #DEE2E6` (borders)
- [ ] Mobile-first — check responsive behavior

**Netlify Forms (if forms are added/changed)**
- [ ] Has `data-netlify="true"` on `<form>`
- [ ] Has `<input type="hidden" name="form-name" value="UNIQUE-NAME">`
- [ ] Form `name` attribute is unique across the whole site

**Footer**
- [ ] All 6 footer links present: Zakat Calculator, What is Zakat?, Ramadan, Duas, FAQ, About
- [ ] Footer links use correct relative paths for the file's location

---

### 🟢 Suggestions — Nice to Have

- [ ] New JS functions have JSDoc comments
- [ ] Large HTML sections could be split into logical comment blocks
- [ ] Consistent indentation (2 spaces)
- [ ] Any magic numbers explained with a comment (e.g., `87.48 // gold nisab grams`)
- [ ] New pages added to sitemap.xml

---

## Output Format

For each issue found:

**File:** `path/to/file.html` (line X)
**Severity:** 🔴 Critical / 🟡 Warning / 🟢 Suggestion
**Issue:** What's wrong
**Fix:** What to change

End with a summary: "X critical issues, Y warnings, Z suggestions."
If critical issues exist, list them first and clearly block merge until fixed.
