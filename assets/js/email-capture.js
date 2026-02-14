/**
 * ZakatEasy - Email Capture System
 * Exit intent popup, sticky bar, form handling
 * Uses Netlify Forms for backend
 */

const EmailCapture = {
  STORAGE_KEY: 'zakateasy_email_dismissed',
  DISMISS_DAYS: 7,
  popupShown: false,

  /**
   * Initialize all email capture features
   */
  init() {
    this.initStickyBar();
    this.initExitIntent();
    this.initPopupClose();
    this.initFormSubmissions();
  },

  /**
   * Sticky newsletter bar (homepage only)
   */
  initStickyBar() {
    const bar = document.getElementById('newsletter-sticky-bar');
    if (!bar) return;

    // Check if dismissed
    if (this.isDismissed('sticky')) {
      bar.classList.add('hidden');
      return;
    }

    // Close button
    const closeBtn = bar.querySelector('.newsletter-sticky-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        bar.classList.add('hidden');
        this.dismiss('sticky');
      });
    }
  },

  /**
   * Exit intent popup
   */
  initExitIntent() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return;

    // Check if dismissed
    if (this.isDismissed('popup')) return;

    // Detect mouse leaving viewport (desktop only)
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 0 && !this.popupShown) {
        this.showPopup();
      }
    });

    // Close on overlay click
    const overlay = popup.querySelector('.newsletter-popup-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => this.closePopup());
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closePopup();
    });
  },

  /**
   * Popup close button
   */
  initPopupClose() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return;

    const closeBtn = popup.querySelector('.newsletter-popup-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closePopup());
    }
  },

  /**
   * Show the exit intent popup
   */
  showPopup() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup || this.popupShown) return;

    popup.classList.remove('hidden');
    this.popupShown = true;

    // Track event
    if (typeof gtag === 'function') {
      gtag('event', 'popup_shown', { event_category: 'email_capture' });
    }
  },

  /**
   * Close the popup
   */
  closePopup() {
    const popup = document.getElementById('newsletter-popup');
    if (!popup) return;

    popup.classList.add('hidden');
    this.dismiss('popup');
  },

  /**
   * Handle form submissions with UX feedback
   */
  initFormSubmissions() {
    const forms = document.querySelectorAll('form[data-netlify="true"]');

    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.textContent;
          submitBtn.textContent = 'Sending...';
          submitBtn.disabled = true;

          // Track signup event
          if (typeof gtag === 'function') {
            gtag('event', 'email_signup', {
              event_category: 'email_capture',
              event_label: form.name || 'unknown'
            });
          }
        }
      });
    });
  },

  /**
   * Check if a specific capture method has been dismissed
   */
  isDismissed(type) {
    const data = Utils.storage.get(this.STORAGE_KEY);
    if (!data || !data[type]) return false;

    const dismissedAt = data[type];
    const daysAgo = (Date.now() - dismissedAt) / (1000 * 60 * 60 * 24);

    return daysAgo < this.DISMISS_DAYS;
  },

  /**
   * Mark a capture method as dismissed
   */
  dismiss(type) {
    const data = Utils.storage.get(this.STORAGE_KEY) || {};
    data[type] = Date.now();
    Utils.storage.set(this.STORAGE_KEY, data);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  EmailCapture.init();
});
