/**
 * ZakatEasy — Blog Posts Data
 * Single source of truth for all blog post metadata.
 *
 * ╔══════════════════════════════════════════════════════════╗
 * ║  HOW TO ADD A NEW BLOG POST (4 mandatory steps)         ║
 * ║                                                          ║
 * ║  1. Create the HTML file in blog/posts/                  ║
 * ║  2. Add an entry to this BLOG_POSTS array (newest first) ║
 * ║  3. Update sitemap.xml with the new URL                  ║
 * ║  4. If Ramadan-related, add to ramadan.html articles     ║
 * ╚══════════════════════════════════════════════════════════╝
 *
 * The blog listing page (blog/index.html) renders all cards
 * automatically from this array — no manual HTML editing needed.
 *
 * Fields:
 *   slug        {string}  Filename without .html (e.g. 'my-post-2026')
 *   title       {string}  Full post title (plain text — no HTML entities)
 *   date        {string}  Display date (e.g. 'February 26, 2026')
 *   category    {string}  One of: 'guide' | 'faq' | 'charity'
 *   emoji       {string}  Single emoji for the card image area
 *   readTime    {number}  Estimated read time in minutes
 *   excerpt     {string}  One-sentence teaser (plain text)
 *   badgeLabel  {string}  [optional] Override badge text (default: capitalised category)
 *   readMoreText{string}  [optional] Override "Read More →" text (featured post only)
 *   featured    {boolean} [optional] true = displayed as the large hero card
 */

const BLOG_POSTS = [

  // ── Featured Post ──────────────────────────────────────────────────────────
  // The entry with featured:true is shown as the large hero card at the top.
  // Only one post should have featured:true.
  {
    slug:         'complete-guide-zakat-ramadan-2026',
    title:        'Complete Guide to Zakat During Ramadan 2026',
    date:         'February 12, 2026',
    category:     'guide',
    emoji:        '📖',
    readTime:     10,
    excerpt:      'Everything you need to know about calculating and paying your Zakat this Ramadan. Step-by-step instructions, current Nisab threshold, eligible assets, and where to donate.',
    featured:     true,
    readMoreText: 'Read Full Guide →'
  },

  // ── Grid Posts (newest first) ──────────────────────────────────────────────
  {
    slug:     'zakat-calculator-uk-2026',
    title:    'Zakat Calculator UK 2026 — Calculate Zakat in British Pounds',
    date:     'March 1, 2026',
    category: 'guide',
    emoji:    '🇬🇧',
    readTime: 8,
    excerpt:  'Calculate your Zakat in GBP with live gold prices. UK-specific guidance on ISAs, workplace pensions, SIPPs, and where to pay Zakat in Britain.'
  },
  {
    slug:     'zakat-on-401k-ira-pension-2026',
    title:    'Zakat on 401(k), IRA & Pension — Complete 2026 Guide',
    date:     'March 1, 2026',
    category: 'faq',
    emoji:    '🏦',
    readTime: 8,
    excerpt:  'Do you pay Zakat on your 401(k), IRA, or pension plan? Learn the scholarly ruling, how to calculate, and what portion of your retirement account is zakatable.'
  },
  {
    slug:     'zakat-on-cryptocurrency-2026',
    title:    'Zakat on Cryptocurrency 2026 — Bitcoin, Ethereum & Digital Assets',
    date:     'March 1, 2026',
    category: 'faq',
    emoji:    '₿',
    readTime: 7,
    excerpt:  'Is Zakat due on Bitcoin, Ethereum, or stablecoins? Learn the scholarly consensus, how to calculate crypto Zakat, and how to use ZakatEasy\'s crypto field.'
  },
  {
    slug:     'zakat-al-fitr-amount-by-country-2026',
    title:    'Zakat al-Fitr Amount by Country 2026 — USA, UK, Canada & More',
    date:     'March 1, 2026',
    category: 'guide',
    emoji:    '🌙',
    readTime: 8,
    excerpt:  'How much is Fitrana in 2026? Country-by-country amounts in USD, GBP, CAD, AUD, SAR. Who must pay, the Eid deadline, and how Fitrana differs from Zakat al-Mal.'
  },
  {
    slug:     'laylat-al-qadr-2026',
    title:    'Laylat al-Qadr 2026: When Is It & How to Worship the Night of Power',
    date:     'February 26, 2026',
    category: 'guide',
    emoji:    '🌙',
    readTime: 7,
    excerpt:  'Dates for the last 10 nights of Ramadan 2026, the special dua, acts of worship, and why paying Zakat on Laylat al-Qadr multiplies its reward.'
  },
  {
    slug:     'zakat-al-fitr-2026',
    title:    'Zakat al-Fitr 2026: Amount, Deadline & How to Pay Fitrana',
    date:     'February 26, 2026',
    category: 'guide',
    emoji:    '🌵',
    readTime: 7,
    excerpt:  'How much is Zakat al-Fitr in 2026? Amounts by country (USA, UK, Canada), who must pay, the deadline, and who can receive it.'
  },
  {
    slug:     'common-zakat-mistakes-ramadan',
    title:    '7 Common Zakat Mistakes Muslims Make During Ramadan',
    date:     'February 26, 2026',
    category: 'faq',
    emoji:    '⚠️',
    readTime: 5,
    excerpt:  'Avoid these frequent errors when calculating and paying your Zakat. From forgetting gold jewelry to confusing Zakat with Fitrana.'
  },
  {
    slug:     'zakat-on-gold-during-ramadan',
    title:    'Zakat on Gold During Ramadan — Complete Guide',
    date:     'February 24, 2026',
    category: 'faq',
    emoji:    '🥇',
    readTime: 5,
    excerpt:  'How to calculate Zakat on gold jewelry, coins, and bars. Understand the Hanafi ruling on personal jewelry and current gold Nisab values.'
  },
  {
    slug:     'last-day-pay-zakat-ramadan-2026',
    title:    'When Is the Last Day to Pay Zakat for Ramadan 2026?',
    date:     'February 22, 2026',
    category: 'faq',
    emoji:    '📅',
    readTime: 4,
    excerpt:  'Key dates for Zakat al-Mal and Zakat al-Fitr during Ramadan 2026. Understand the deadlines and differences between these two obligations.'
  },
  {
    slug:     'can-i-pay-zakat-in-ramadan',
    title:    'Can I Pay Zakat in Ramadan?',
    date:     'February 20, 2026',
    category: 'faq',
    emoji:    '❓',
    readTime: 4,
    excerpt:  'Is Ramadan the right time to pay Zakat? Learn what scholars say about the timing of Zakat payments and why many Muslims choose Ramadan.'
  },
  {
    slug:     'ramadan-2026-complete-guide',
    title:    'Ramadan 2026 — History, Miracles, Importance & Complete Guide',
    date:     'February 19, 2026',
    category: 'guide',
    emoji:    '☀️',
    readTime: 15,
    excerpt:  'Discover the full history of Ramadan, the miracles of Laylat al-Qadr, why it is the holiest month in Islam, and how to make the most of every blessed day.'
  },
  {
    slug:     'best-islamic-charities-2026',
    title:    'Best Islamic Charities for Zakat 2026',
    date:     'February 18, 2026',
    category: 'charity',
    emoji:    '🤝',
    readTime: 8,
    excerpt:  'A trusted guide to the most reputable Islamic charities accepting Zakat donations. Compare organizations by focus area, transparency, and global reach.'
  },
  {
    slug:       'best-islamic-products-ramadan-2026',
    title:      'Best Islamic Products for Ramadan 2026 — Our Top Picks',
    date:       'February 18, 2026',
    category:   'charity',
    emoji:      '🌿',
    readTime:   5,
    excerpt:    'Our top picks for prayer mats, halal dates, and more — hand-selected for Muslims preparing for Ramadan 2026.',
    badgeLabel: 'Resources'
  },
  {
    slug:     'zakat-vs-sadaqah-vs-fitrana',
    title:    'Zakat vs Sadaqah vs Fitrana — What\'s the Difference?',
    date:     'February 18, 2026',
    category: 'faq',
    emoji:    '⚖️',
    readTime: 5,
    excerpt:  'Clear comparison of the three main types of Islamic charity. Understand the obligations, amounts, timing, and recipients for each.'
  },
  {
    slug:     'zakat-nisab-2026',
    title:    'Zakat Nisab 2026 — Current Gold & Silver Threshold Values',
    date:     'February 17, 2026',
    category: 'guide',
    emoji:    '🥇',
    readTime: 8,
    excerpt:  'What is the Nisab for Zakat in 2026? Current gold and silver thresholds, how to check if you qualify, and live calculation.'
  },
  {
    slug:     'zakat-calculator-usa-2026',
    title:    'Zakat Calculator USA 2026 — Calculate Zakat in US Dollars',
    date:     'February 17, 2026',
    category: 'guide',
    emoji:    '🇺🇸',
    readTime: 8,
    excerpt:  'Free online Zakat calculator for American Muslims. Live gold prices, Nisab in USD, retirement account guidance, and more.'
  },
  {
    slug:     'zakat-on-savings-2026',
    title:    'Zakat on Savings Account — How to Calculate in 2026',
    date:     'February 17, 2026',
    category: 'faq',
    emoji:    '💳',
    readTime: 7,
    excerpt:  'Do you pay Zakat on savings accounts? Learn how to calculate Zakat on bank savings, fixed deposits, and checking accounts.'
  },
  {
    slug:     'ramadan-zakat-calculator-tutorial',
    title:    'How to Use the ZakatEasy Calculator: Step-by-Step Tutorial',
    date:     'February 14, 2026',
    category: 'guide',
    emoji:    '💻',
    readTime: 7,
    excerpt:  'A detailed walkthrough of our free Zakat calculator. Learn how to enter your assets, understand the results, and calculate your exact Zakat amount.'
  }

];
