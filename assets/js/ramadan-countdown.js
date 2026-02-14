/**
 * ZakatEasy - Ramadan 2026 Countdown Timer
 * Ramadan 1447 AH expected to begin around February 28, 2026
 */

const RamadanCountdown = {
  // Expected Ramadan 2026 dates (Gregorian approximation of Ramadan 1447 AH)
  // These may shift by 1-2 days based on moon sighting
  RAMADAN_START: new Date('2026-02-28T00:00:00'),
  RAMADAN_END: new Date('2026-03-30T00:00:00'),
  EID_DATE: new Date('2026-03-30T00:00:00'),

  container: null,
  timerEl: null,
  interval: null,

  /**
   * Initialize the countdown
   */
  init() {
    this.container = document.getElementById('ramadan-countdown');
    if (!this.container) return;

    this.timerEl = document.getElementById('countdown-timer');
    this.render();

    // Update every second
    this.interval = setInterval(() => this.render(), 1000);
  },

  /**
   * Render the appropriate state
   */
  render() {
    const now = new Date();

    if (now < this.RAMADAN_START) {
      // Before Ramadan — show countdown
      this.showCountdown(now);
    } else if (now < this.RAMADAN_END) {
      // During Ramadan — show Mubarak message
      this.showRamadanActive(now);
    } else {
      // After Ramadan — hide section
      this.container.classList.add('hidden');
      if (this.interval) clearInterval(this.interval);
    }
  },

  /**
   * Show countdown to Ramadan start
   */
  showCountdown(now) {
    const diff = this.RAMADAN_START - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');
    const minutesEl = document.getElementById('countdown-minutes');
    const secondsEl = document.getElementById('countdown-seconds');

    if (daysEl) daysEl.textContent = this.pad(days);
    if (hoursEl) hoursEl.textContent = this.pad(hours);
    if (minutesEl) minutesEl.textContent = this.pad(minutes);
    if (secondsEl) secondsEl.textContent = this.pad(seconds);
  },

  /**
   * Show "Ramadan Mubarak" message during Ramadan
   */
  showRamadanActive(now) {
    if (this.interval) clearInterval(this.interval);

    const daysLeft = Math.ceil((this.RAMADAN_END - now) / (1000 * 60 * 60 * 24));

    if (this.timerEl) {
      this.timerEl.innerHTML = `
        <div class="ramadan-active-msg">
          <p>Ramadan Mubarak!</p>
          <p class="arabic-text">\u0631\u064E\u0645\u064E\u0636\u064E\u0627\u0646 \u0645\u064F\u0628\u064E\u0627\u0631\u064E\u0643</p>
          <p style="font-size:1rem;color:rgba(255,255,255,0.8);margin-top:12px;font-family:var(--font-body);">
            ${daysLeft} days remaining \u2014 Pay your Zakat before Eid al-Fitr
          </p>
        </div>
      `;
    }
  },

  /**
   * Pad number with leading zero
   */
  pad(num) {
    return num < 10 ? '0' + num : String(num);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  RamadanCountdown.init();
});
