/**
 * ZakatEasy — Mid-Article Email Capture
 *
 * Inserts a "get free Ramadan checklist" email capture box
 * after the midpoint of a blog article's content body.
 *
 * - Triggers at 50% scroll depth through <article class="content-body">
 * - Uses IntersectionObserver for performance (no scroll event listeners)
 * - Respects localStorage: hidden once submitted or dismissed
 * - Netlify form name: mid-article-checklist
 */

const MidArticleCapture = {

  STORAGE_KEY: 'zakateasy_mid_article_submitted',
  DISMISS_KEY: 'zakateasy_mid_article_dismissed',

  init() {
    // Don't show if already submitted or dismissed
    if (localStorage.getItem(this.STORAGE_KEY) || localStorage.getItem(this.DISMISS_KEY)) {
      return;
    }

    const article = document.querySelector('article.content-body');
    if (!article) return;

    this._injectCaptureBox(article);
    this._bindEvents();
  },

  /**
   * Find the midpoint child element and insert the capture box after it.
   * We target direct block-level children (p, h2, h3, ul, ol, table).
   */
  _injectCaptureBox(article) {
    const children = Array.from(article.children).filter(el =>
      ['P', 'H2', 'H3', 'H4', 'UL', 'OL', 'TABLE', 'BLOCKQUOTE', 'DIV'].includes(el.tagName)
    );

    if (children.length < 4) return; // Article too short — skip

    const midIndex = Math.floor(children.length / 2);
    const midElement = children[midIndex];

    const box = document.createElement('div');
    box.className = 'mid-article-capture';
    box.id = 'mid-article-capture';
    box.setAttribute('aria-label', 'Free Ramadan Zakat Checklist');
    box.innerHTML = `
      <div class="mac-inner">
        <button class="mac-dismiss" aria-label="Dismiss" title="Dismiss">×</button>
        <div class="mac-emoji">📋</div>
        <h4 class="mac-heading">Free Ramadan Zakat Checklist</h4>
        <p class="mac-subtext">Get our step-by-step PDF checklist — covering assets, Nisab, Fitrana deadlines, and where to donate. Used by 10,000+ Muslims.</p>
        <form class="mac-form" name="mid-article-checklist" method="POST" data-netlify="true" action="/thank-you.html">
          <input type="hidden" name="form-name" value="mid-article-checklist">
          <input type="hidden" name="source" value="mid-article">
          <div class="mac-form-row">
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              class="mac-email-input"
              required
              autocomplete="email"
              aria-label="Email address"
            >
            <button type="submit" class="mac-submit-btn">Send Free Checklist</button>
          </div>
          <p class="mac-privacy">No spam. Unsubscribe anytime. We respect your privacy.</p>
        </form>
      </div>
    `;

    // Insert after the midpoint element
    midElement.insertAdjacentElement('afterend', box);

    // Animate in using IntersectionObserver (reveal on scroll into view)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('mac-visible');
            observer.disconnect(); // Only animate once
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(box);
  },

  _bindEvents() {
    document.addEventListener('click', (e) => {
      // Dismiss button
      if (e.target.classList.contains('mac-dismiss')) {
        this._dismiss();
        return;
      }
    });

    document.addEventListener('submit', (e) => {
      if (e.target.closest('#mid-article-capture')) {
        // Track the signup
        if (typeof gtag === 'function') {
          gtag('event', 'email_signup', {
            event_category: 'email_capture',
            event_label: 'mid-article-checklist'
          });
        }
        // Mark as submitted so we don't show again
        localStorage.setItem(this.STORAGE_KEY, '1');
      }
    });
  },

  _dismiss() {
    const box = document.getElementById('mid-article-capture');
    if (box) {
      box.classList.add('mac-hidden');
      setTimeout(() => box.remove(), 300);
    }
    localStorage.setItem(this.DISMISS_KEY, '1');
  }

};

document.addEventListener('DOMContentLoaded', () => {
  MidArticleCapture.init();
});
