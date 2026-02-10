/**
 * ZakatEasy - Zakat Calculator Logic
 */

const ZakatCalculator = {
  ZAKAT_RATE: 0.025, // 2.5%

  /**
   * Initialize the calculator on the page
   */
  async init() {
    this.form = document.getElementById('zakat-form');
    this.resultsSection = document.getElementById('results-section');
    this.nisabDisplay = document.getElementById('nisab-display');
    this.calculateBtn = document.getElementById('calculate-btn');
    this.resetBtn = document.getElementById('reset-btn');

    if (!this.form) return;

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

    // Gold/Silver unit toggle handling
    this.setupUnitToggles();

    // Format inputs on blur
    this.setupInputFormatting();
  },

  /**
   * Load and display Nisab threshold
   */
  async loadNisabInfo() {
    try {
      this.nisabInfo = await MetalsAPI.getNisabInfo();
      this.updateNisabDisplay();
    } catch (error) {
      console.error('Failed to load Nisab info:', error);
      this.showNisabError();
    }
  },

  /**
   * Update the Nisab display on the page
   */
  updateNisabDisplay() {
    if (!this.nisabDisplay || !this.nisabInfo) return;

    const info = this.nisabInfo;
    const nisabFormatted = Utils.formatCurrency(info.nisabGold);
    const goldPrice = Utils.formatCurrency(info.goldPricePerGram);
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
        <h3>Current Nisab Threshold (Gold)</h3>
        <div class="nisab-amount">${nisabFormatted} USD</div>
        <div class="nisab-detail">${info.nisabGrams} grams @ ${goldPrice}/gram</div>
        <div class="nisab-updated">Last Updated: ${updatedText}</div>
        ${statusNote}
      </div>
    `;
  },

  /**
   * Show error state for Nisab display
   */
  showNisabError() {
    if (!this.nisabDisplay) return;
    this.nisabDisplay.innerHTML = `
      <div class="nisab-card nisab-error">
        <h3>Nisab Threshold</h3>
        <p>Unable to load current gold prices. Using estimated Nisab of $7,245 USD.</p>
      </div>
    `;
  },

  /**
   * Setup gold/silver unit toggle (grams vs dollar value)
   */
  setupUnitToggles() {
    const goldUnit = document.getElementById('gold-unit');
    const silverUnit = document.getElementById('silver-unit');
    const goldLabel = document.getElementById('gold-input-label');
    const silverLabel = document.getElementById('silver-input-label');

    if (goldUnit) {
      goldUnit.addEventListener('change', () => {
        if (goldLabel) {
          goldLabel.textContent = goldUnit.value === 'grams'
            ? 'Gold (in grams)'
            : 'Gold (market value in $)';
        }
      });
    }

    if (silverUnit) {
      silverUnit.addEventListener('change', () => {
        if (silverLabel) {
          silverLabel.textContent = silverUnit.value === 'grams'
            ? 'Silver (in grams)'
            : 'Silver (market value in $)';
        }
      });
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
    Utils.scrollTo('#results-section');
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
   */
  computeBreakdown(values) {
    const info = this.nisabInfo;
    const goldPricePerGram = info ? info.goldPricePerGram : 82.80;
    const silverPricePerGram = info ? info.silverPricePerGram : 1.05;
    const nisabThreshold = info ? info.nisabGold : 7245;

    // Convert gold/silver to dollar values if entered in grams
    const goldValue = values.goldUnit === 'grams'
      ? values.goldAmount * goldPricePerGram
      : values.goldAmount;

    const silverValue = values.silverUnit === 'grams'
      ? values.silverAmount * silverPricePerGram
      : values.silverAmount;

    // Calculate totals
    const totalAssets = values.cash + goldValue + silverValue
      + values.investments + values.businessAssets + values.otherAssets;

    const totalLiabilities = values.debts + values.unpaidBills;

    const netWealth = totalAssets - totalLiabilities;

    const meetsNisab = netWealth >= nisabThreshold;

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
      nisabThreshold,
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
    return `
      <div class="results-card">
        <div class="results-header">
          <h2>Your Zakat Calculation</h2>
        </div>

        <div class="zakat-amount-display">
          <span class="zakat-label">Your Zakat Owed</span>
          <span class="zakat-amount">${Utils.formatCurrency(b.zakatOwed)}</span>
          <span class="zakat-rate">(2.5% of Net Zakatable Wealth)</span>
        </div>

        <div class="results-breakdown">
          <h3>Breakdown</h3>

          <div class="breakdown-section">
            <h4>Assets</h4>
            <div class="breakdown-row">
              <span>Cash & Bank Balances</span>
              <span>${Utils.formatCurrency(b.assets.cash)}</span>
            </div>
            <div class="breakdown-row">
              <span>Gold</span>
              <span>${Utils.formatCurrency(b.assets.gold)}</span>
            </div>
            <div class="breakdown-row">
              <span>Silver</span>
              <span>${Utils.formatCurrency(b.assets.silver)}</span>
            </div>
            <div class="breakdown-row">
              <span>Investments & Stocks</span>
              <span>${Utils.formatCurrency(b.assets.investments)}</span>
            </div>
            <div class="breakdown-row">
              <span>Business Assets</span>
              <span>${Utils.formatCurrency(b.assets.businessAssets)}</span>
            </div>
            <div class="breakdown-row">
              <span>Other Assets</span>
              <span>${Utils.formatCurrency(b.assets.otherAssets)}</span>
            </div>
            <div class="breakdown-row breakdown-total">
              <span>Total Assets</span>
              <span>${Utils.formatCurrency(b.totalAssets)}</span>
            </div>
          </div>

          <div class="breakdown-section">
            <h4>Deductible Liabilities</h4>
            <div class="breakdown-row">
              <span>Immediate Debts</span>
              <span>- ${Utils.formatCurrency(b.liabilities.debts)}</span>
            </div>
            <div class="breakdown-row">
              <span>Unpaid Bills</span>
              <span>- ${Utils.formatCurrency(b.liabilities.unpaidBills)}</span>
            </div>
            <div class="breakdown-row breakdown-total">
              <span>Total Liabilities</span>
              <span>- ${Utils.formatCurrency(b.totalLiabilities)}</span>
            </div>
          </div>

          <div class="breakdown-section">
            <div class="breakdown-row breakdown-total">
              <span>Net Zakatable Wealth</span>
              <span>${Utils.formatCurrency(b.netWealth)}</span>
            </div>
            <div class="breakdown-row">
              <span>Nisab Threshold</span>
              <span>${Utils.formatCurrency(b.nisabThreshold)}</span>
            </div>
          </div>
        </div>

        <div class="results-dua">
          <p>May Allah accept your Zakat and purify your wealth.</p>
          <p class="arabic-text">تَقَبَّلَ اللهُ مِنَّا وَمِنْكُم</p>
        </div>

        <div class="results-disclaimer">
          <p><strong>Disclaimer:</strong> This calculation is based on the Hanafi method using
          87.48 grams of gold as the Nisab threshold. Please consult a qualified Islamic scholar
          for specific circumstances. <a href="legal/disclaimer.html">Read full disclaimer</a>.</p>
          <p class="reference">Based on Quran 9:60 and scholarly consensus.
          Reference: 87.48 grams of gold (7.5 tola).</p>
        </div>
      </div>
    `;
  },

  /**
   * Render results when wealth is below Nisab
   */
  renderBelowNisab(b) {
    return `
      <div class="results-card below-nisab">
        <div class="results-header">
          <h2>Your Zakat Calculation</h2>
        </div>

        <div class="zakat-amount-display below-nisab-display">
          <span class="zakat-label">No Zakat Owed</span>
          <span class="zakat-detail">Your net wealth of ${Utils.formatCurrency(b.netWealth)}
          is below the current Nisab threshold of ${Utils.formatCurrency(b.nisabThreshold)}.</span>
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
            <span>${Utils.formatCurrency(b.totalAssets)}</span>
          </div>
          <div class="breakdown-row">
            <span>Total Liabilities</span>
            <span>- ${Utils.formatCurrency(b.totalLiabilities)}</span>
          </div>
          <div class="breakdown-row breakdown-total">
            <span>Net Wealth</span>
            <span>${Utils.formatCurrency(b.netWealth)}</span>
          </div>
          <div class="breakdown-row">
            <span>Nisab Threshold</span>
            <span>${Utils.formatCurrency(b.nisabThreshold)}</span>
          </div>
          <div class="breakdown-row">
            <span>Shortfall</span>
            <span>${Utils.formatCurrency(b.nisabThreshold - b.netWealth)}</span>
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
    Utils.scrollTo('#zakat-form');
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ZakatCalculator.init();
});
