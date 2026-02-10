/**
 * ZakatEasy - API Integration
 * Fetches gold and silver prices for Nisab calculation
 * Uses gold-api.com (free, no API key required, no rate limits)
 * Supports multi-currency via fawazahmed0 currency API + ipapi.co geo-detection
 */

const MetalsAPI = {
  CACHE_KEY: 'zakateasy_metals_prices',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours in ms
  TROY_OZ_TO_GRAMS: 31.1035,
  GOLD_NISAB_GRAMS: 87.48,
  SILVER_NISAB_GRAMS: 612.36,

  // API endpoints (gold-api.com - free, no key required)
  GOLD_API_URL: 'https://api.gold-api.com/price/XAU',
  SILVER_API_URL: 'https://api.gold-api.com/price/XAG',

  // Fallback prices (updated Feb 2026 as safety net)
  FALLBACK_PRICES: {
    goldPerGram: 161.33,
    silverPerGram: 2.64,
    goldPerOz: 5017.70,
    silverPerOz: 82.01,
    timestamp: null,
    isFallback: true
  },

  /**
   * Get current metal prices (from cache or API)
   */
  async getPrices() {
    // Check cache first
    const cached = this.getCachedPrices();
    if (cached) {
      return cached;
    }

    // Try fetching from API
    try {
      const prices = await this.fetchFromAPI();
      this.cachePrices(prices);
      return prices;
    } catch (error) {
      console.warn('Gold API fetch failed, using fallback prices:', error.message);
      // Try returning stale cache if available
      const staleCache = this.getCachedPrices(true);
      if (staleCache) {
        staleCache.isStale = true;
        return staleCache;
      }
      // Last resort: use hardcoded fallback
      return this.FALLBACK_PRICES;
    }
  },

  /**
   * Fetch prices from gold-api.com (free, no API key needed)
   * Endpoint: https://api.gold-api.com/price/XAU
   * Response: { "name": "Gold", "price": 5017.70, "symbol": "XAU", "updatedAt": "...", "updatedAtReadable": "..." }
   */
  async fetchFromAPI() {
    // Fetch gold and silver prices in parallel
    const [goldResponse, silverResponse] = await Promise.all([
      fetch(this.GOLD_API_URL),
      fetch(this.SILVER_API_URL)
    ]);

    if (!goldResponse.ok) {
      throw new Error(`Gold API responded with status ${goldResponse.status}`);
    }
    if (!silverResponse.ok) {
      throw new Error(`Silver API responded with status ${silverResponse.status}`);
    }

    const goldData = await goldResponse.json();
    const silverData = await silverResponse.json();

    // Validate response structure
    if (!goldData.price || !silverData.price) {
      throw new Error('API response missing price data');
    }

    // gold-api.com returns price per troy ounce in USD
    const goldPricePerOz = goldData.price;
    const silverPricePerOz = silverData.price;

    return {
      goldPerOz: goldPricePerOz,
      silverPerOz: silverPricePerOz,
      goldPerGram: goldPricePerOz / this.TROY_OZ_TO_GRAMS,
      silverPerGram: silverPricePerOz / this.TROY_OZ_TO_GRAMS,
      timestamp: Date.now(),
      isFallback: false
    };
  },

  /**
   * Get cached prices
   */
  getCachedPrices(ignoreExpiry = false) {
    const cached = Utils.storage.get(this.CACHE_KEY);
    if (!cached) return null;

    if (ignoreExpiry) return cached;

    if (Utils.isCacheValid(cached.timestamp, this.CACHE_DURATION)) {
      return cached;
    }

    return null;
  },

  /**
   * Cache prices to localStorage
   */
  cachePrices(prices) {
    Utils.storage.set(this.CACHE_KEY, prices);
  },

  /**
   * Calculate Nisab threshold in USD
   */
  calculateNisab(prices) {
    const goldNisab = this.GOLD_NISAB_GRAMS * prices.goldPerGram;
    const silverNisab = this.SILVER_NISAB_GRAMS * prices.silverPerGram;

    return {
      gold: goldNisab,
      silver: silverNisab,
      goldPricePerGram: prices.goldPerGram,
      silverPricePerGram: prices.silverPerGram,
      timestamp: prices.timestamp,
      isFallback: prices.isFallback,
      isStale: prices.isStale || false
    };
  },

  /**
   * Get Nisab info formatted for display
   */
  async getNisabInfo() {
    const prices = await this.getPrices();
    const nisab = this.calculateNisab(prices);

    return {
      nisabGold: nisab.gold,
      nisabSilver: nisab.silver,
      goldPricePerGram: nisab.goldPricePerGram,
      silverPricePerGram: nisab.silverPricePerGram,
      goldPricePerOz: prices.goldPerOz,
      silverPricePerOz: prices.silverPerOz,
      lastUpdated: nisab.timestamp ? new Date(nisab.timestamp) : null,
      isFallback: nisab.isFallback,
      isStale: nisab.isStale,
      nisabGrams: this.GOLD_NISAB_GRAMS,
      silverNisabGrams: this.SILVER_NISAB_GRAMS
    };
  },

  /**
   * Force refresh prices from API (ignores cache)
   */
  async refreshPrices() {
    Utils.storage.remove(this.CACHE_KEY);
    return this.getPrices();
  }
};


/**
 * CurrencyAPI - Multi-currency support
 * Auto-detects user's country/currency, fetches exchange rates
 */
const CurrencyAPI = {
  CACHE_KEY: 'zakateasy_currency_rates',
  CURRENCY_PREF_KEY: 'zakateasy_currency',
  CACHE_DURATION: 24 * 60 * 60 * 1000, // 24 hours

  // Exchange rate API (free, no key, 200+ currencies)
  RATES_URL: 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json',
  RATES_FALLBACK_URL: 'https://latest.currency-api.pages.dev/v1/currencies/usd.json',

  // Geo-detection API (free, returns country + currency)
  GEO_URL: 'https://ipapi.co/json/',

  // Default currency
  DEFAULT_CURRENCY: 'USD',

  // Popular currencies for the dropdown
  POPULAR_CURRENCIES: [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '\u20AC' },
    { code: 'GBP', name: 'British Pound', symbol: '\u00A3' },
    { code: 'INR', name: 'Indian Rupee', symbol: '\u20B9' },
    { code: 'PKR', name: 'Pakistani Rupee', symbol: '\u20A8' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '\u09F3' },
    { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM' },
    { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '\uFDFC' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
    { code: 'QAR', name: 'Qatari Riyal', symbol: 'QAR' },
    { code: 'KWD', name: 'Kuwaiti Dinar', symbol: 'KWD' },
    { code: 'BHD', name: 'Bahraini Dinar', symbol: 'BHD' },
    { code: 'OMR', name: 'Omani Rial', symbol: 'OMR' },
    { code: 'EGP', name: 'Egyptian Pound', symbol: 'EGP' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '\u20BA' },
    { code: 'NGN', name: 'Nigerian Naira', symbol: '\u20A6' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '\u00A5' }
  ],

  // Current active currency and rate
  activeCurrency: 'USD',
  exchangeRate: 1,
  rates: null,

  /**
   * Initialize currency support - detect user's currency and load rates
   */
  async init() {
    // Load saved preference first
    const saved = Utils.storage.get(this.CURRENCY_PREF_KEY);
    if (saved) {
      this.activeCurrency = saved;
    }

    // Load exchange rates
    await this.loadRates();

    // If no saved preference, try to auto-detect
    if (!saved) {
      await this.detectCurrency();
    }

    // Set the exchange rate for active currency
    this.updateExchangeRate();
  },

  /**
   * Detect user's currency based on their location
   */
  async detectCurrency() {
    try {
      const response = await fetch(this.GEO_URL);
      if (!response.ok) return;

      const data = await response.json();
      if (data && data.currency) {
        const detectedCode = data.currency.toUpperCase();
        // Verify the detected currency exists in our rates
        if (this.rates && this.rates[detectedCode.toLowerCase()]) {
          this.activeCurrency = detectedCode;
          Utils.storage.set(this.CURRENCY_PREF_KEY, detectedCode);
        }
      }
    } catch (error) {
      console.warn('Currency detection failed, using default:', error.message);
    }
  },

  /**
   * Load exchange rates from API (with caching)
   */
  async loadRates() {
    // Check cache first
    const cached = Utils.storage.get(this.CACHE_KEY);
    if (cached && Utils.isCacheValid(cached.timestamp, this.CACHE_DURATION)) {
      this.rates = cached.rates;
      return;
    }

    try {
      let response = await fetch(this.RATES_URL);

      // Try fallback URL if primary fails
      if (!response.ok) {
        response = await fetch(this.RATES_FALLBACK_URL);
      }

      if (!response.ok) throw new Error('Currency API failed');

      const data = await response.json();
      if (data && data.usd) {
        this.rates = data.usd;
        Utils.storage.set(this.CACHE_KEY, {
          rates: data.usd,
          timestamp: Date.now()
        });
      }
    } catch (error) {
      console.warn('Exchange rate fetch failed:', error.message);
      // Try stale cache
      if (cached && cached.rates) {
        this.rates = cached.rates;
      }
    }
  },

  /**
   * Update the exchange rate for the active currency
   */
  updateExchangeRate() {
    if (this.activeCurrency === 'USD') {
      this.exchangeRate = 1;
      return;
    }

    if (this.rates) {
      const rate = this.rates[this.activeCurrency.toLowerCase()];
      if (rate) {
        this.exchangeRate = rate;
        return;
      }
    }

    // If rate not found, fall back to USD
    console.warn(`Rate not found for ${this.activeCurrency}, falling back to USD`);
    this.activeCurrency = 'USD';
    this.exchangeRate = 1;
  },

  /**
   * Set currency manually (from dropdown)
   */
  setCurrency(currencyCode) {
    this.activeCurrency = currencyCode.toUpperCase();
    this.updateExchangeRate();
    Utils.storage.set(this.CURRENCY_PREF_KEY, this.activeCurrency);
  },

  /**
   * Convert USD amount to active currency
   */
  convert(usdAmount) {
    return usdAmount * this.exchangeRate;
  },

  /**
   * Convert from active currency back to USD
   */
  toUSD(localAmount) {
    if (this.exchangeRate === 0) return localAmount;
    return localAmount / this.exchangeRate;
  },

  /**
   * Get display name for a currency code
   */
  getCurrencyName(code) {
    const found = this.POPULAR_CURRENCIES.find(c => c.code === code);
    return found ? found.name : code;
  }
};
