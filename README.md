# ZakatEasy

**Calculate Your Zakat with Confidence**

A free, accurate, and Islamically-compliant Zakat calculator built for Muslims worldwide.

## Features

- **Zakat Calculator** - Calculate your annual Zakat based on current gold prices
- **Live Nisab Threshold** - Real-time Nisab display based on 87.48g gold standard
- **Gold/Silver Price Integration** - Live price updates via gold-api.com (free, no key needed)
- **Educational Content** - Learn about Zakat with Quranic references and scholarly sources
- **FAQ Section** - Answers to 13+ common Zakat questions
- **Mobile-First Design** - Responsive layout optimized for all devices
- **Privacy-Focused** - All calculations happen in your browser; no data stored on servers

## Tech Stack

- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Hosting:** Netlify (free tier)
- **APIs:** gold-api.com (free gold/silver prices, no key required)
- **Fonts:** Google Fonts (Playfair Display, Inter, Amiri)

## Getting Started

### Local Development

1. Clone or download this repository
2. Open `index.html` in your browser
3. No build process or dependencies required

### Gold/Silver Prices

Live gold and silver prices are fetched automatically from [gold-api.com](https://gold-api.com) — **no API key or signup required**. Prices are cached locally for 24 hours. If the API is temporarily unavailable, the calculator falls back to estimated prices.

### Deploy to Netlify

1. Push this repository to GitHub
2. Connect the repo to [Netlify](https://netlify.com)
3. Set publish directory to `.` (root)
4. Deploy automatically

## File Structure

```
zakateasy/
├── index.html                 # Homepage with Zakat calculator
├── about.html                 # About ZakatEasy
├── what-is-zakat.html         # Educational page
├── faq.html                   # Frequently Asked Questions
├── 404.html                   # Custom 404 page
├── sitemap.xml                # SEO sitemap
├── robots.txt                 # Search engine directives
├── netlify.toml               # Netlify configuration
├── assets/
│   ├── css/
│   │   ├── main.css           # Main stylesheet
│   │   └── responsive.css     # Mobile responsiveness
│   ├── js/
│   │   ├── calculator.js      # Zakat calculation logic
│   │   ├── api.js             # Gold-API.com integration
│   │   └── utils.js           # Helper functions
│   └── images/
│       ├── logo.svg           # ZakatEasy logo
│       ├── islamic-pattern.svg # Decorative pattern
│       └── favicon.svg        # Browser icon
├── legal/
│   ├── disclaimer.html        # Islamic/financial disclaimer
│   ├── privacy-policy.html    # Privacy policy
│   └── terms.html             # Terms of service
└── README.md                  # This file
```

## Calculation Method

1. **Total Assets** = Cash + Gold + Silver + Investments + Business Assets + Other
2. **Net Wealth** = Total Assets - Immediate Liabilities
3. **Nisab Check**: If Net Wealth >= 87.48g gold value → Zakat is due
4. **Zakat** = Net Wealth x 2.5%

Based on the Hanafi method with 87.48 grams (7.5 tola) gold Nisab threshold.

## Islamic References

- Quran: 2:43, 2:110, 9:60, 9:103
- Hadith: Sahih Bukhari (Book of Zakat), Sahih Muslim
- Scholarly consensus on Nisab value and 2.5% rate

## Disclaimer

This calculator is for informational purposes only. Please consult a qualified Islamic scholar for specific circumstances. See the full [disclaimer](legal/disclaimer.html).

## License

All rights reserved. Islamic educational content references public domain sources.

---

*May Allah accept your Zakat and purify your wealth. Ameen.*
