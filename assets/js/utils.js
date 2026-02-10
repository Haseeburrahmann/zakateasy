/**
 * ZakatEasy - Utility Functions
 */

const Utils = {
  /**
   * Format a number as currency using Intl (auto-detects locale)
   */
  formatCurrency(amount, currency) {
    const cur = currency || (typeof CurrencyAPI !== 'undefined' ? CurrencyAPI.activeCurrency : 'USD');
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: cur,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    } catch {
      // Fallback if currency code is invalid
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(amount);
    }
  },

  /**
   * Format a number with commas
   */
  formatNumber(num, decimals = 2) {
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  },

  /**
   * Parse a currency/number input string to a float
   */
  parseNumber(value) {
    if (typeof value === 'number') return value;
    if (!value) return 0;
    // Remove currency symbols, commas, spaces
    const cleaned = String(value).replace(/[^0-9.\-]/g, '');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? 0 : parsed;
  },

  /**
   * Convert troy ounces to grams
   * 1 troy oz = 31.1035 grams
   */
  troyOzToGrams(oz) {
    return oz * 31.1035;
  },

  /**
   * Convert grams to troy ounces
   */
  gramsToTroyOz(grams) {
    return grams / 31.1035;
  },

  /**
   * Get a formatted date string
   */
  formatDate(date) {
    if (!date) date = new Date();
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    }).format(date);
  },

  /**
   * Get/set localStorage with JSON support
   */
  storage: {
    get(key) {
      try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
      } catch {
        return null;
      }
    },

    set(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    },

    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        // ignore
      }
    }
  },

  /**
   * Check if cached data is still valid
   */
  isCacheValid(timestamp, maxAgeMs = 24 * 60 * 60 * 1000) {
    if (!timestamp) return false;
    return (Date.now() - timestamp) < maxAgeMs;
  },

  /**
   * Debounce function for input handlers
   */
  debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Smoothly scroll to an element
   */
  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  /**
   * Show/hide an element with animation class
   */
  show(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el) el.classList.remove('hidden');
  },

  hide(el) {
    if (typeof el === 'string') el = document.querySelector(el);
    if (el) el.classList.add('hidden');
  },

  /**
   * Simple element creation helper
   */
  createElement(tag, attrs = {}, children = []) {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'className') el.className = val;
      else if (key === 'textContent') el.textContent = val;
      else if (key === 'innerHTML') el.innerHTML = val;
      else el.setAttribute(key, val);
    });
    children.forEach(child => {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else {
        el.appendChild(child);
      }
    });
    return el;
  }
};
