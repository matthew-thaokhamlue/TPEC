/**
 * Shell Module - Navigation and Layout System
 * Handles header/footer injection, navigation management, and mobile menu
 */

class Shell {
  constructor() {
    this.currentPage = '';
    this.mobileMenuOpen = false;
    this.init();
  }

  init() {
    this.setCurrentPage();
    this.injectHeader();
    this.injectFooter();
    this.bindEvents();
    this.handleInitialHash();
  }

  setCurrentPage() {
    const path = window.location.pathname;
    if (path === '/' || path === '/index.html') {
      this.currentPage = 'home';
    } else if (path.includes('about')) {
      this.currentPage = 'about';
    } else if (path.includes('projects')) {
      this.currentPage = 'projects';
    } else if (path.includes('contact')) {
      this.currentPage = 'contact';
    }
  }

  injectHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    header.innerHTML = `
      <div class="container">
        <div class="header-content">
          <a href="/" class="logo" data-i18n="nav.logo">ConstructCo</a>
          
          <!-- Desktop Navigation -->
          <nav class="nav" role="navigation" aria-label="Main navigation">
            <ul class="nav-list">
              <li><a href="/" class="nav-link ${this.currentPage === 'home' ? 'active' : ''}" data-i18n="nav.home" ${this.currentPage === 'home' ? 'aria-current="page"' : ''}>Home</a></li>
              <li><a href="/about.html" class="nav-link ${this.currentPage === 'about' ? 'active' : ''}" data-i18n="nav.about" ${this.currentPage === 'about' ? 'aria-current="page"' : ''}>About Us</a></li>
              <li><a href="/projects.html" class="nav-link ${this.currentPage === 'projects' ? 'active' : ''}" data-i18n="nav.projects" ${this.currentPage === 'projects' ? 'aria-current="page"' : ''}>Projects</a></li>
              <li><a href="/contact.html" class="nav-link ${this.currentPage === 'contact' ? 'active' : ''}" data-i18n="nav.contact" ${this.currentPage === 'contact' ? 'aria-current="page"' : ''}>Contact</a></li>
            </ul>
            
            <!-- Language Switcher -->
            <div class="language-switcher" role="group" aria-label="Language selection">
              <!-- Language options will be created by i18n module -->
            </div>
          </nav>
          
          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" aria-label="Open navigation menu" aria-expanded="false" aria-controls="mobile-menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 6H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M3 18H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Mobile Menu Overlay -->
      <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-labelledby="mobile-menu-title">
        <button class="mobile-menu-close" aria-label="Close navigation menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <h2 id="mobile-menu-title" class="sr-only" data-i18n="nav.menu_title">Navigation Menu</h2>
        
        <nav role="navigation" aria-label="Mobile navigation">
          <ul class="mobile-nav-list">
            <li><a href="/" class="mobile-nav-link ${this.currentPage === 'home' ? 'active' : ''}" data-i18n="nav.home" ${this.currentPage === 'home' ? 'aria-current="page"' : ''}>Home</a></li>
            <li><a href="/about.html" class="mobile-nav-link ${this.currentPage === 'about' ? 'active' : ''}" data-i18n="nav.about" ${this.currentPage === 'about' ? 'aria-current="page"' : ''}>About Us</a></li>
            <li><a href="/projects.html" class="mobile-nav-link ${this.currentPage === 'projects' ? 'active' : ''}" data-i18n="nav.projects" ${this.currentPage === 'projects' ? 'aria-current="page"' : ''}>Projects</a></li>
            <li><a href="/contact.html" class="mobile-nav-link ${this.currentPage === 'contact' ? 'active' : ''}" data-i18n="nav.contact" ${this.currentPage === 'contact' ? 'aria-current="page"' : ''}>Contact</a></li>
          </ul>
        </nav>
        
        <!-- Mobile Language Switcher -->
        <div class="language-switcher" role="group" aria-label="Language selection">
          <!-- Language options will be created by i18n module -->
        </div>
      </div>
    `;
  }

  injectFooter() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    footer.innerHTML = `
      <div class="container">
        <div class="footer-content">
          <div class="footer-section">
            <h4 data-i18n="footer.company.title">ConstructCo</h4>
            <p data-i18n="footer.company.description">Professional construction consulting services for your projects.</p>
          </div>
          
          <div class="footer-section">
            <h4 data-i18n="footer.links.title">Quick Links</h4>
            <ul class="footer-links">
              <li><a href="/" data-i18n="nav.home">Home</a></li>
              <li><a href="/about.html" data-i18n="nav.about">About Us</a></li>
              <li><a href="/projects.html" data-i18n="nav.projects">Projects</a></li>
              <li><a href="/contact.html" data-i18n="nav.contact">Contact</a></li>
            </ul>
          </div>
          
          <div class="footer-section">
            <h4 data-i18n="footer.contact.title">Contact Info</h4>
            <ul class="footer-links">
              <li><a href="tel:+85621732131" data-i18n="contact.info.phone">+856 21 732131</a></li>
              <li><a href="mailto:thephachanhtoto@hotmail.com" data-i18n="contact.info.email">thephachanhtoto@hotmail.com</a></li>
              <li><span data-i18n="contact.info.address">Phokham Village, Xaythany District, Road No.13 South, Vientiane Capital, Lao PDR</span></li>
            </ul>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p data-i18n="footer.copyright">&copy; 2025 TPEC. All rights reserved.</p>
        </div>
      </div>
    `;
  }

  bindEvents() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');

    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
    }

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', () => this.closeMobileMenu());
    }

    // Close mobile menu when clicking on overlay
    if (mobileMenu) {
      mobileMenu.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
          this.closeMobileMenu();
        }
      });
    }

    // Close mobile menu when clicking nav links
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Handle keyboard navigation
    document.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Handle smooth scrolling for anchor links
    document.addEventListener('click', (e) => this.handleAnchorClick(e));

    // Language switcher events (handled by i18n module)
    // Listen for language change events from i18n module
    window.addEventListener('languageChange', (e) => {
      this.updateLanguageButtons(e.detail.language);
    });

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  toggleMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenu || !mobileMenuBtn) return;

    this.mobileMenuOpen = !this.mobileMenuOpen;
    
    if (this.mobileMenuOpen) {
      mobileMenu.classList.add('open');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
      mobileMenuBtn.setAttribute('aria-label', 'Close navigation menu');
      document.body.style.overflow = 'hidden';
      
      // Focus management
      const firstFocusable = mobileMenu.querySelector('.mobile-menu-close');
      if (firstFocusable) firstFocusable.focus();
    } else {
      this.closeMobileMenu();
    }
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    
    if (!mobileMenu || !mobileMenuBtn) return;

    this.mobileMenuOpen = false;
    mobileMenu.classList.remove('open');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    mobileMenuBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.style.overflow = '';
    
    // Return focus to menu button
    mobileMenuBtn.focus();
  }

  handleKeydown(e) {
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }

    // Trap focus in mobile menu
    if (this.mobileMenuOpen) {
      this.trapFocus(e);
    }
  }

  trapFocus(e) {
    if (e.key !== 'Tab') return;

    const mobileMenu = document.querySelector('.mobile-menu');
    if (!mobileMenu) return;

    const focusableElements = mobileMenu.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === firstFocusable) {
        lastFocusable.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastFocusable) {
        firstFocusable.focus();
        e.preventDefault();
      }
    }
  }

  handleAnchorClick(e) {
    const link = e.target.closest('a');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href) return;

    // Handle same-page anchor links
    if (href.startsWith('#')) {
      e.preventDefault();
      this.smoothScrollTo(href);
      return;
    }

    // Handle cross-page anchor links (e.g., /projects.html#project-name)
    if (href.includes('#') && !href.startsWith('http')) {
      const [page, hash] = href.split('#');
      const currentPath = window.location.pathname;
      
      // If we're on the same page, just scroll
      if (page === currentPath || (page === '/' && currentPath === '/index.html')) {
        e.preventDefault();
        this.smoothScrollTo(`#${hash}`);
      }
      // If different page, let the browser navigate and handle hash on load
    }
  }

  smoothScrollTo(target) {
    const element = document.querySelector(target);
    if (!element) return;

    const headerHeight = document.querySelector('header')?.offsetHeight || 0;
    const targetPosition = element.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update focus for accessibility
    element.setAttribute('tabindex', '-1');
    element.focus();
    element.addEventListener('blur', () => {
      element.removeAttribute('tabindex');
    }, { once: true });
  }

  handleInitialHash() {
    // Handle hash on page load (for deep links)
    if (window.location.hash) {
      // Delay to ensure page is fully loaded
      setTimeout(() => {
        this.smoothScrollTo(window.location.hash);
      }, 100);
    }
  }

  // Language switching is now handled by i18n module

  handleResize() {
    // Close mobile menu on resize to desktop
    if (window.innerWidth >= 900 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  // Public API methods
  setActivePage(page) {
    this.currentPage = page;
    
    // Update navigation active states
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      link.classList.remove('active');
      
      const href = link.getAttribute('href');
      if (
        (page === 'home' && (href === '/' || href === '/index.html')) ||
        (page === 'about' && href.includes('about')) ||
        (page === 'projects' && href.includes('projects')) ||
        (page === 'contact' && href.includes('contact'))
      ) {
        link.classList.add('active');
      }
    });
  }

  updateLanguageButtons(currentLang) {
    const allLangButtons = document.querySelectorAll('.lang-option');
    allLangButtons.forEach(btn => {
      const lang = btn.getAttribute('data-lang');
      if (lang === currentLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-pressed', 'true');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('aria-pressed', 'false');
      }
    });
  }
}

// Initialize Shell when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.shell = new Shell();
  });
} else {
  window.shell = new Shell();
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Shell;
}