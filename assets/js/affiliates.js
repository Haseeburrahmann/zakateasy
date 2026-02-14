/**
 * ZakatEasy - Affiliate Link Management
 * Centralized charity links, click tracking, disclosure enforcement
 */

const AffiliateManager = {
  /**
   * Registry of charity/affiliate links
   * Update URLs here to change them globally
   */
  CHARITIES: [
    {
      id: 'islamic-relief',
      name: 'Islamic Relief USA',
      url: 'https://irusa.org/zakat/',
      description: 'One of the largest Islamic humanitarian organizations. Operating in over 40 countries, they distribute Zakat to eligible recipients across categories including the poor, needy, and those in debt.',
      focus: 'Global humanitarian aid, emergency relief, orphan sponsorship',
      rating: 5
    },
    {
      id: 'zakat-foundation',
      name: 'Zakat Foundation of America',
      url: 'https://www.zakat.org/',
      description: 'Dedicated exclusively to Zakat collection and distribution. They follow strict Islamic guidelines for Zakat eligibility and provide detailed reports on fund allocation.',
      focus: 'Zakat-specific programs, poverty alleviation, education',
      rating: 5
    },
    {
      id: 'icna-relief',
      name: 'ICNA Relief',
      url: 'https://icnarelief.org/zakat/',
      description: 'The humanitarian arm of ICNA, providing disaster relief, hunger prevention, and refugee assistance across North America and internationally.',
      focus: 'Domestic programs, refugee assistance, disaster relief',
      rating: 4
    },
    {
      id: 'helping-hand',
      name: 'Helping Hand for Relief and Development',
      url: 'https://hhrd.org/zakat/',
      description: 'Focuses on sustainable development projects in Asia, Africa, and the Middle East. They operate Zakat-eligible programs for clean water, healthcare, and education.',
      focus: 'Sustainable development, clean water, healthcare',
      rating: 4
    },
    {
      id: 'penny-appeal',
      name: 'Penny Appeal',
      url: 'https://pennyappeal.org/appeal/zakat',
      description: 'A UK-based global charity that transforms pennies into life-changing solutions. Active in over 30 countries with transparent fund allocation.',
      focus: 'Water, hunger, shelter, health, education',
      rating: 4
    },
    {
      id: 'muslim-aid',
      name: 'Muslim Aid',
      url: 'https://www.muslimaid.org/what-we-do/religious-giving/zakat/',
      description: 'International relief and development agency working across Africa, Asia, and Europe. Provides detailed Zakat distribution reports to donors.',
      focus: 'Emergency response, food security, education, livelihood',
      rating: 4
    }
  ],

  /**
   * Initialize affiliate features
   */
  init() {
    this.processLinks();
    this.trackClicks();
  },

  /**
   * Add proper rel attributes to all affiliate links
   */
  processLinks() {
    const affiliateLinks = document.querySelectorAll('a.affiliate-link');
    affiliateLinks.forEach(link => {
      link.setAttribute('rel', 'noopener noreferrer sponsored');
      link.setAttribute('target', '_blank');
    });
  },

  /**
   * Track affiliate link clicks via Google Analytics
   */
  trackClicks() {
    const affiliateLinks = document.querySelectorAll('a.affiliate-link');
    affiliateLinks.forEach(link => {
      link.addEventListener('click', () => {
        const charityName = link.dataset.charity || link.textContent.trim();
        if (typeof gtag === 'function') {
          gtag('event', 'affiliate_click', {
            event_category: 'affiliate',
            event_label: charityName
          });
        }
      });
    });
  },

  /**
   * Render star rating
   */
  renderStars(rating) {
    let stars = '';
    for (let i = 0; i < 5; i++) {
      stars += i < rating ? '\u2605' : '\u2606';
    }
    return stars;
  },

  /**
   * Get charity by ID
   */
  getCharity(id) {
    return this.CHARITIES.find(c => c.id === id);
  }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  AffiliateManager.init();
});
