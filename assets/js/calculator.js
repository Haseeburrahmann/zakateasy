/**
 * ZakatEasy - Zakat Calculator Logic
 * Supports multi-currency via CurrencyAPI
 */

const ZakatCalculator = {
  ZAKAT_RATE: 0.025, // 2.5%

  /**
   * Initialize the calculator on the page
   */
  // Which nisab standard is active: 'gold' or 'silver'
  nisabStandard: 'gold',

  async init() {
    this.form = document.getElementById('zakat-form');
    this.resultsSection = document.getElementById('results-section');
    this.nisabDisplay = document.getElementById('nisab-display');
    this.calculateBtn = document.getElementById('calculate-btn');
    this.resetBtn = document.getElementById('reset-btn');
    this.currencySelect = document.getElementById('currency-select');

    if (!this.form) return;

    // Initialize currency support first
    await CurrencyAPI.init();

    // Populate and set the currency dropdown
    this.populateCurrencyDropdown();

    // Load Nisab info
    await this.loadNisabInfo();

    // Bind events
    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.calculate();
    });

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.reset());
    }

    // Currency selector change
    if (this.currencySelect) {
      this.currencySelect.addEventListener('change', () => {
        CurrencyAPI.setCurrency(this.currencySelect.value);
        this.updateNisabDisplay();
        this.updateLabels();
        // Re-calculate if results are visible
        if (this.resultsSection && !this.resultsSection.classList.contains('hidden')) {
          this.calculate();
        }
      });
    }

    // Nisab standard toggle (gold/silver)
    this.setupNisabToggle();

    // Gold/Silver unit toggle handling
    this.setupUnitToggles();

    // Format inputs on blur
    this.setupInputFormatting();

    // Update labels with currency symbol
    this.updateLabels();
  },

  /**
   * Setup the Gold/Silver nisab standard toggle
   */
  setupNisabToggle() {
    const radios = document.querySelectorAll('input[name="nisab-standard"]');
    radios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.nisabStandard = radio.value;
        this.updateNisabDisplay();
        // Re-calculate if results are visible
        if (this.resultsSection && !this.resultsSection.classList.contains('hidden')) {
          this.calculate();
        }
      });
    });
  },

  /**
   * Populate the currency dropdown with popular currencies
   */
  populateCurrencyDropdown() {
    if (!this.currencySelect) return;

    this.currencySelect.innerHTML = '';
    CurrencyAPI.POPULAR_CURRENCIES.forEach(cur => {
      const option = document.createElement('option');
      option.value = cur.code;
      option.textContent = `${cur.code} - ${cur.name}`;
      this.currencySelect.appendChild(option);
    });

    // Set to active (auto-detected or saved) currency
    this.currencySelect.value = CurrencyAPI.activeCurrency;

    // If active currency isn't in popular list, add it
    if (this.currencySelect.value !== CurrencyAPI.activeCurrency) {
      const option = document.createElement('option');
      option.value = CurrencyAPI.activeCurrency;
      option.textContent = `${CurrencyAPI.activeCurrency} - ${CurrencyAPI.getCurrencyName(CurrencyAPI.activeCurrency)}`;
      this.currencySelect.insertBefore(option, this.currencySelect.firstChild);
      this.currencySelect.value = CurrencyAPI.activeCurrency;
    }
  },

  /**
   * Get the active currency code
   */
  getCurrency() {
    return CurrencyAPI.activeCurrency;
  },

  /**
   * Format amount in active currency
   */
  fmt(amount) {
    return Utils.formatCurrency(amount, this.getCurrency());
  },

  /**
   * Update form labels with current currency symbol
   */
  updateLabels() {
    const code = this.getCurrency();
    const goldUnit = document.getElementById('gold-unit');
    const silverUnit = document.getElementById('silver-unit');
    const goldLabel = document.getElementById('gold-input-label');
    const silverLabel = document.getElementById('silver-input-label');

    const currencyLabel = code === 'USD' ? '$' : code;

    if (goldLabel) {
      goldLabel.textContent = (goldUnit && goldUnit.value === 'grams')
        ? 'Gold (in grams)'
        : `Gold (market value in ${currencyLabel})`;
    }
    if (silverLabel) {
      silverLabel.textContent = (silverUnit && silverUnit.value === 'grams')
        ? 'Silver (in grams)'
        : `Silver (market value in ${currencyLabel})`;
    }
  },

  /**
   * Load and display Nisab threshold
   */
  async loadNisabInfo() {
    try {
      this.nisabInfo = await MetalsAPI.getNisabInfo();
      window._nisabInfo = this.nisabInfo; // expose for SEO section
      this.updateNisabDisplay();
    } catch (error) {
      console.error('Failed to load Nisab info:', error);
      this.showNisabError();
    }
  },

  /**
   * Update the Nisab display on the page (in active currency)
   */
  updateNisabDisplay() {
    if (!this.nisabDisplay || !this.nisabInfo) return;

    const info = this.nisabInfo;
    const currency = this.getCurrency();
    const isGold = this.nisabStandard === 'gold';

    // Convert USD values to local currency
    const nisabLocal = CurrencyAPI.convert(isGold ? info.nisabGold : info.nisabSilver);
    const pricePerGramLocal = CurrencyAPI.convert(isGold ? info.goldPricePerGram : info.silverPricePerGram);
    const grams = isGold ? info.nisabGrams : info.silverNisabGrams;
    const metalName = isGold ? 'Gold' : 'Silver';
    const extraDetail = isGold ? '(7.5 tola)' : '(52.5 tola)';

    const nisabFormatted = Utils.formatCurrency(nisabLocal, currency);
    const priceFormatted = Utils.formatCurrency(pricePerGramLocal, currency);
    const updatedText = info.lastUpdated
      ? Utils.formatDate(info.lastUpdated)
      : 'Using estimated prices';

    let statusNote = '';
    if (info.isFallback) {
      statusNote = '<span class="nisab-warning">Using estimated prices. Live rates will update automatically when available.</span>';
    } else if (info.isStale) {
      statusNote = '<span class="nisab-warning">Prices may be outdated. Will refresh when connection is available.</span>';
    }

    this.nisabDisplay.innerHTML = `
      <div class="nisab-card">
        <div class="nisab-toggle">
          <label class="nisab-toggle-option">
            <input type="radio" name="nisab-standard" value="gold" ${isGold ? 'checked' : ''}>
            <span>Gold Standard</span>
          </label>
          <label class="nisab-toggle-option">
            <input type="radio" name="nisab-standard" value="silver" ${!isGold ? 'checked' : ''}>
            <span>Silver Standard</span>
          </label>
        </div>
        <h3>Current Nisab Threshold (${metalName})</h3>
        <div class="nisab-amount">${nisabFormatted} ${currency}</div>
        <div class="nisab-detail">${grams} grams of ${metalName.toLowerCase()} ${extraDetail} @ ${priceFormatted}/gram</div>
        <div class="nisab-updated">Last Updated: ${updatedText}</div>
        ${statusNote}
      </div>
    `;

    // Re-bind toggle events since innerHTML was replaced
    this.setupNisabToggle();
  },

  /**
   * Show error state for Nisab display
   */
  showNisabError() {
    if (!this.nisabDisplay) return;
    const isGold = this.nisabStandard === 'gold';
    const fallbackNisab = CurrencyAPI.convert(isGold ? 7245 : 1617);
    this.nisabDisplay.innerHTML = `
      <div class="nisab-card nisab-error">
        <div class="nisab-toggle">
          <label class="nisab-toggle-option">
            <input type="radio" name="nisab-standard" value="gold" ${isGold ? 'checked' : ''}>
            <span>Gold Standard</span>
          </label>
          <label class="nisab-toggle-option">
            <input type="radio" name="nisab-standard" value="silver" ${!isGold ? 'checked' : ''}>
            <span>Silver Standard</span>
          </label>
        </div>
        <h3>Nisab Threshold (${isGold ? 'Gold' : 'Silver'})</h3>
        <p>Unable to load current prices. Using estimated Nisab of ${this.fmt(fallbackNisab)}.</p>
      </div>
    `;
    this.setupNisabToggle();
  },

  /**
   * Setup gold/silver unit toggle (grams vs local currency value)
   */
  setupUnitToggles() {
    const goldUnit = document.getElementById('gold-unit');
    const silverUnit = document.getElementById('silver-unit');

    if (goldUnit) {
      goldUnit.addEventListener('change', () => this.updateLabels());
    }
    if (silverUnit) {
      silverUnit.addEventListener('change', () => this.updateLabels());
    }
  },

  /**
   * Setup number formatting on input fields
   */
  setupInputFormatting() {
    const inputs = this.form.querySelectorAll('input[type="number"]');
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        if (input.value === '0') input.value = '';
      });
      input.addEventListener('blur', () => {
        if (input.value === '') input.value = '0';
      });
    });
  },

  /**
   * Perform the Zakat calculation
   */
  calculate() {
    const values = this.getInputValues();
    const breakdown = this.computeBreakdown(values);
    this.displayResults(breakdown);
    // On mobile (single column), scroll to results; on desktop results are inline
    if (window.innerWidth < 900) {
      Utils.scrollTo('#results-section');
    }
  },

  /**
   * Get all input values from the form
   */
  getInputValues() {
    const getValue = (id) => Utils.parseNumber(document.getElementById(id)?.value);

    return {
      cash: getValue('cash'),
      goldAmount: getValue('gold'),
      goldUnit: document.getElementById('gold-unit')?.value || 'value',
      silverAmount: getValue('silver'),
      silverUnit: document.getElementById('silver-unit')?.value || 'value',
      investments: getValue('investments'),
      businessAssets: getValue('business-assets'),
      otherAssets: getValue('other-assets'),
      debts: getValue('debts'),
      unpaidBills: getValue('unpaid-bills')
    };
  },

  /**
   * Compute the full Zakat breakdown
   * All user inputs are in LOCAL currency.
   * Gold/silver prices from API are in USD, converted to local currency for gram-to-value.
   * Nisab is in USD, we compare in local currency.
   */
  computeBreakdown(values) {
    const info = this.nisabInfo;
    // Gold/silver prices are in USD per gram from the API
    const goldPricePerGramUSD = info ? info.goldPricePerGram : 161.33;
    const silverPricePerGramUSD = info ? info.silverPricePerGram : 2.64;

    // Determine which nisab to use based on selected standard
    const nisabUSD = this.nisabStandard === 'silver'
      ? (info ? info.nisabSilver : 1617)
      : (info ? info.nisabGold : 7245);

    // Convert to local currency
    const goldPricePerGramLocal = CurrencyAPI.convert(goldPricePerGramUSD);
    const silverPricePerGramLocal = CurrencyAPI.convert(silverPricePerGramUSD);
    const nisabLocal = CurrencyAPI.convert(nisabUSD);

    // Convert gold/silver to local currency value if entered in grams
    const goldValue = values.goldUnit === 'grams'
      ? values.goldAmount * goldPricePerGramLocal
      : values.goldAmount;

    const silverValue = values.silverUnit === 'grams'
      ? values.silverAmount * silverPricePerGramLocal
      : values.silverAmount;

    // Calculate totals (all in local currency)
    const totalAssets = values.cash + goldValue + silverValue
      + values.investments + values.businessAssets + values.otherAssets;

    const totalLiabilities = values.debts + values.unpaidBills;

    const netWealth = totalAssets - totalLiabilities;

    const meetsNisab = netWealth >= nisabLocal;

    const zakatOwed = meetsNisab ? netWealth * this.ZAKAT_RATE : 0;

    return {
      assets: {
        cash: values.cash,
        gold: goldValue,
        silver: silverValue,
        investments: values.investments,
        businessAssets: values.businessAssets,
        otherAssets: values.otherAssets
      },
      liabilities: {
        debts: values.debts,
        unpaidBills: values.unpaidBills
      },
      totalAssets,
      totalLiabilities,
      netWealth,
      nisabThreshold: nisabLocal,
      nisabStandard: this.nisabStandard,
      meetsNisab,
      zakatOwed,
      zakatRate: this.ZAKAT_RATE
    };
  },

  /**
   * Display calculation results
   */
  displayResults(breakdown) {
    if (!this.resultsSection) return;

    this.resultsSection.classList.remove('hidden');

    const resultsHTML = breakdown.meetsNisab
      ? this.renderZakatOwed(breakdown)
      : this.renderBelowNisab(breakdown);

    this.resultsSection.innerHTML = resultsHTML;
  },

  /**
   * Render results when Zakat is owed
   */
  renderZakatOwed(b) {
    const f = (amount) => this.fmt(amount);

    return `
      <div class="results-card">
        <div class="results-header">
          <h2>Your Zakat Calculation</h2>
        </div>

        <div class="zakat-amount-display">
          <span class="zakat-label">Your Zakat Owed</span>
          <span class="zakat-amount">${f(b.zakatOwed)}</span>
          <span class="zakat-rate">(2.5% of Net Zakatable Wealth)</span>
        </div>

        <div class="results-breakdown">
          <h3>Breakdown</h3>

          <div class="breakdown-section">
            <h4>Assets</h4>
            <div class="breakdown-row">
              <span>Cash & Bank Balances</span>
              <span>${f(b.assets.cash)}</span>
            </div>
            <div class="breakdown-row">
              <span>Gold</span>
              <span>${f(b.assets.gold)}</span>
            </div>
            <div class="breakdown-row">
              <span>Silver</span>
              <span>${f(b.assets.silver)}</span>
            </div>
            <div class="breakdown-row">
              <span>Investments & Stocks</span>
              <span>${f(b.assets.investments)}</span>
            </div>
            <div class="breakdown-row">
              <span>Business Assets</span>
              <span>${f(b.assets.businessAssets)}</span>
            </div>
            <div class="breakdown-row">
              <span>Other Assets</span>
              <span>${f(b.assets.otherAssets)}</span>
            </div>
            <div class="breakdown-row breakdown-total">
              <span>Total Assets</span>
              <span>${f(b.totalAssets)}</span>
            </div>
          </div>

          <div class="breakdown-section">
            <h4>Deductible Liabilities</h4>
            <div class="breakdown-row">
              <span>Immediate Debts</span>
              <span>- ${f(b.liabilities.debts)}</span>
            </div>
            <div class="breakdown-row">
              <span>Unpaid Bills</span>
              <span>- ${f(b.liabilities.unpaidBills)}</span>
            </div>
            <div class="breakdown-row breakdown-total">
              <span>Total Liabilities</span>
              <span>- ${f(b.totalLiabilities)}</span>
            </div>
          </div>

          <div class="breakdown-section">
            <div class="breakdown-row breakdown-total">
              <span>Net Zakatable Wealth</span>
              <span>${f(b.netWealth)}</span>
            </div>
            <div class="breakdown-row">
              <span>Nisab Threshold</span>
              <span>${f(b.nisabThreshold)}</span>
            </div>
          </div>
        </div>

        <div class="results-dua">
          <p>May Allah accept your Zakat and purify your wealth.</p>
          <p class="arabic-text">تَقَبَّلَ اللهُ مِنَّا وَمِنْكُم</p>
        </div>

        <div class="results-disclaimer">
          <p><strong>Disclaimer:</strong> This calculation uses the <strong>${b.nisabStandard === 'silver' ? 'Silver' : 'Gold'} Standard</strong> Nisab threshold
          (${b.nisabStandard === 'silver' ? '612.36g of silver' : '87.48g of gold'}).
          Please consult a qualified Islamic scholar for specific circumstances.
          <a href="legal/disclaimer.html">Read full disclaimer</a>.</p>
          <p class="reference">Based on Quran 9:60 and scholarly consensus.</p>
        </div>
      </div>
    `;
  },

  /**
   * Render results when wealth is below Nisab
   */
  renderBelowNisab(b) {
    const f = (amount) => this.fmt(amount);

    return `
      <div class="results-card below-nisab">
        <div class="results-header">
          <h2>Your Zakat Calculation</h2>
        </div>

        <div class="zakat-amount-display below-nisab-display">
          <span class="zakat-label">No Zakat Owed</span>
          <span class="zakat-detail">Your net wealth of ${f(b.netWealth)}
          is below the current Nisab threshold of ${f(b.nisabThreshold)}.</span>
        </div>

        <div class="below-nisab-message">
          <p>Zakat becomes obligatory only when your net zakatable wealth reaches or exceeds
          the Nisab threshold for one full lunar year.</p>
          <p>Even though Zakat is not obligatory for you at this time, voluntary charity
          (Sadaqah) is always encouraged and rewarded.</p>
          <p class="arabic-text">مَنْ تَصَدَّقَ بِعَدْلِ تَمْرَةٍ</p>
        </div>

        <div class="results-breakdown">
          <h3>Your Wealth Summary</h3>
          <div class="breakdown-row">
            <span>Total Assets</span>
            <span>${f(b.totalAssets)}</span>
          </div>
          <div class="breakdown-row">
            <span>Total Liabilities</span>
            <span>- ${f(b.totalLiabilities)}</span>
          </div>
          <div class="breakdown-row breakdown-total">
            <span>Net Wealth</span>
            <span>${f(b.netWealth)}</span>
          </div>
          <div class="breakdown-row">
            <span>Nisab Threshold</span>
            <span>${f(b.nisabThreshold)}</span>
          </div>
          <div class="breakdown-row">
            <span>Shortfall</span>
            <span>${f(b.nisabThreshold - b.netWealth)}</span>
          </div>
        </div>

        <div class="results-disclaimer">
          <p>Consult a qualified Islamic scholar for personal guidance.
          <a href="legal/disclaimer.html">Read full disclaimer</a>.</p>
        </div>
      </div>
    `;
  },

  /**
   * Reset the calculator form and results
   */
  reset() {
    if (this.form) this.form.reset();
    if (this.resultsSection) {
      this.resultsSection.classList.add('hidden');
      this.resultsSection.innerHTML = '';
    }
    // Reset all number inputs to 0
    const inputs = this.form.querySelectorAll('input[type="number"]');
    inputs.forEach(input => input.value = '0');
    // Restore currency dropdown selection (form.reset may have cleared it)
    if (this.currencySelect) {
      this.currencySelect.value = CurrencyAPI.activeCurrency;
    }
    this.updateLabels();
    Utils.scrollTo('#zakat-form');
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ZakatCalculator.init();
});
