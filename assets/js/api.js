/**
 * ZakatEasy - API Integration
 * Fetches gold and silver prices for Nisab calculation
 * Uses gold-api.com (free, no API key required, no rate limits)
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
