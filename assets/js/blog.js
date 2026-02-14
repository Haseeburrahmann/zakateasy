/**
 * ZakatEasy - Blog Utilities
 * TOC generation, reading time, category filter, social sharing
 */

const BlogUtils = {
  /**
   * Initialize all blog features
   */
  init() {
    this.generateTOC();
    this.calculateReadingTime();
    this.initFilters();
    this.initShareButtons();
    this.initTOCScroll();
  },

  /**
   * Generate Table of Contents from H2/H3 headings
   */
  generateTOC() {
    const toc = document.getElementById('post-toc');
    const content = document.querySelector('.post-content');
    if (!toc || !content) return;

    const headings = content.querySelectorAll('h2, h3');
    if (headings.length < 2) {
      toc.style.display = 'none';
      return;
    }

    const list = document.createElement('ol');
    headings.forEach((heading, index) => {
      // Add ID to heading if missing
      if (!heading.id) {
        heading.id = 'section-' + this.slugify(heading.textContent) + '-' + index;
      }

      const li = document.createElement('li');
      const a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      if (heading.tagName === 'H3') {
        a.classList.add('toc-h3');
      }
      li.appendChild(a);
      list.appendChild(li);
    });

    // Keep existing h4 title, append list
    const existingTitle = toc.querySelector('h4');
    toc.innerHTML = '';
    if (existingTitle) toc.appendChild(existingTitle);
    toc.appendChild(list);
  },

  /**
   * Create a URL-friendly slug from text
   */
  slugify(text) {
    return text.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 40);
  },

  /**
   * Calculate and display reading time
   */
  calculateReadingTime() {
    const content = document.querySelector('.post-content');
    const readingTimeEl = document.querySelector('.post-reading-time');
    if (!content) return;

    const text = content.textContent || '';
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const minutes = Math.max(1, Math.ceil(words / 200));

    if (readingTimeEl) {
      readingTimeEl.textContent = minutes + ' min read';
    }
  },

  /**
   * Blog listing category filter
   */
  initFilters() {
    const filterBtns = document.querySelectorAll('.blog-filter-btn');
    const cards = document.querySelectorAll('.blog-card[data-category]');
    const featured = document.querySelector('.blog-featured');

    if (filterBtns.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.category;

        // Update active button
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Filter cards
        cards.forEach(card => {
          if (category === 'all' || card.dataset.category === category) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });

        // Show/hide featured
        if (featured) {
          if (category === 'all' || category === 'guide') {
            featured.style.display = '';
          } else {
            featured.style.display = 'none';
          }
        }
      });
    });
  },

  /**
   * Social share buttons
   */
  initShareButtons() {
    const buttons = document.querySelectorAll('.share-btn');
    if (buttons.length === 0) return;

    const shareSection = document.querySelector('.share-section');
    const title = shareSection ? shareSection.dataset.title : document.title;
    const url = shareSection ? shareSection.dataset.url : window.location.href;

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const platform = btn.dataset.platform;
        this.share(platform, title, url, btn);
      });
    });
  },

  /**
   * Open share dialog for a platform
   */
  share(platform, title, url, btn) {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    let shareUrl = '';

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
        break;
      case 'copy':
        this.copyLink(url, btn);
        return;
      default:
        return;
    }

    // Track share event
    if (typeof gtag === 'function') {
      gtag('event', 'share', { method: platform, content_type: 'article' });
    }

    window.open(shareUrl, '_blank', 'width=600,height=400,scrollbars=yes');
  },

  /**
   * Copy link to clipboard
   */
  copyLink(url, btn) {
    navigator.clipboard.writeText(url).then(() => {
      const originalText = btn.textContent;
      btn.textContent = '✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // Fallback
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
    });
  },

  /**
   * Smooth scroll for TOC links + highlight active
   */
  initTOCScroll() {
    const toc = document.getElementById('post-toc');
    if (!toc) return;

    // Smooth scroll on TOC link click
    toc.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    // Highlight active section on scroll
    const headings = document.querySelectorAll('.post-content h2, .post-content h3');
    if (headings.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          toc.querySelectorAll('a').forEach(a => a.classList.remove('active'));
          const activeLink = toc.querySelector(`a[href="#${id}"]`);
          if (activeLink) activeLink.classList.add('active');
        }
      });
    }, { rootMargin: '-80px 0px -60% 0px' });

    headings.forEach(h => observer.observe(h));
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  BlogUtils.init();
});
