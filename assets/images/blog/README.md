# ZakatEasy Blog Featured Images

This directory contains 15 branded OG (Open Graph) images for the ZakatEasy blog posts.

## File Specifications

All SVG files:
- **Dimensions:** 1200x630px (standard OG image size)
- **Format:** Valid SVG 1.1 with self-contained defs
- **Brand Colors:**
  - Primary Green (gradient): #0F5132 → #0a3821
  - Accent Green: #1a7a4c
  - Gold: #D4AF37
  - White: #ffffff

## Design Elements

Each image includes:
1. **Gradient Background:** Diagonal gradient from primary green to dark green
2. **Geometric Pattern:** Subtle overlay with diagonal lines, rectangles, and circles (opacity 0.3)
3. **Left Card:** Semi-transparent green rounded rectangle (40% width)
4. **Emoji/Icon:** Large unicode emoji (120px) centered in left card
5. **Title Text:** Bold white text (42px) on right side, word-wrapped to 3 lines max
6. **Footer:** Gold horizontal line separator and "ZakatEasy.org" text (28px)
7. **Badge:** Top-right corner with "2026" in white on green background

## Files Created (15 total)

1. og-complete-guide-zakat-ramadan-2026.svg (2106 bytes) — 📖
2. og-laylat-al-qadr-2026.svg (1906 bytes) — 🌙
3. og-zakat-al-fitr-2026.svg (1907 bytes) — 🌵
4. og-common-zakat-mistakes-ramadan.svg (1898 bytes) — ⚠️
5. og-zakat-on-gold-during-ramadan.svg (1905 bytes) — 🥇
6. og-last-day-pay-zakat-ramadan-2026.svg (1909 bytes) — 📅
7. og-can-i-pay-zakat-in-ramadan.svg (1849 bytes) — ❓
8. og-ramadan-2026-complete-guide.svg (1911 bytes) — ☀️
9. og-best-islamic-charities-2026.svg (1860 bytes) — 🤝
10. og-best-islamic-products-ramadan-2026.svg (1865 bytes) — 🌿
11. og-zakat-vs-sadaqah-vs-fitrana.svg (1918 bytes) — ⚖️
12. og-zakat-nisab-2026.svg (1915 bytes) — 🥇
13. og-zakat-calculator-usa-2026.svg (1919 bytes) — 🇺🇸
14. og-zakat-on-savings-2026.svg (1915 bytes) — 💳
15. og-ramadan-zakat-calculator-tutorial.svg (1911 bytes) — 💻

**Total Size:** ~28.5 KB

## Usage

Link these images in your blog post HTML as OG meta tags:

```html
<meta property="og:image" content="https://zakateasy.org/assets/images/blog/og-complete-guide-zakat-ramadan-2026.svg">
<meta property="og:image:type" content="image/svg+xml">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
```

Or in your posts-data.js entries:

```javascript
{
  slug: "complete-guide-zakat-ramadan-2026",
  title: "Complete Guide to Zakat During Ramadan 2026",
  image: "/assets/images/blog/og-complete-guide-zakat-ramadan-2026.svg",
  // ... other properties
}
```

## Technical Notes

- All SVGs use CSS gradient definitions in `<defs>` section
- Text uses SVG `<text>` elements with `<tspan>` for line breaks (no foreignObject)
- Geometric pattern uses SVG `<pattern>` element for efficient rendering
- Files are minifiable if needed but contain helpful comments
- All color values use brand hex codes with no hardcoded values
