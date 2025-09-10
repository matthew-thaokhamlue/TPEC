/**
 * Internationalization Module
 * Handles bilingual content management for English and Lao languages
 */
class I18n {
  constructor() {
    this.currentLang = 'en';
    this.translations = {};
    this.fallbackLang = 'en';
    this.storageKey = 'preferred-language';
  }

  /**
   * Initialize the i18n system
   * @param {string} defaultLang - Default language code
   */
  async init(defaultLang = 'en') {
    try {
      // Load stored language preference or use default
      const storedLang = localStorage.getItem(this.storageKey);
      this.currentLang = storedLang || defaultLang;

      // Load translation files
      await this.loadTranslations();

      // Apply translations to the page
      this.applyTranslations();

      // Update HTML lang attribute
      this.updateHtmlLang();

      // Initialize language switcher
      this.initLanguageSwitcher();

      console.log(`i18n initialized with language: ${this.currentLang}`);
    } catch (error) {
      console.error('Failed to initialize i18n:', error);
      // Fallback to English if initialization fails
      this.currentLang = 'en';
    }
  }

  /**
   * Load translation files for all supported languages
   */
  async loadTranslations() {
    const languages = ['en', 'lo'];
    
    for (const lang of languages) {
      try {
        const response = await fetch(`assets/i18n/${lang}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load ${lang}.json: ${response.status}`);
        }
        this.translations[lang] = await response.json();
      } catch (error) {
        console.error(`Error loading translations for ${lang}:`, error);
        
        // Initialize with fallback translations
        this.translations[lang] = this.getFallbackTranslations(lang);
        
        // Try to load from cache if available
        const cachedTranslations = this.loadFromCache(lang);
        if (cachedTranslations) {
          this.translations[lang] = { ...this.translations[lang], ...cachedTranslations };
        }
      }
    }
  }

  /**
   * Set the current language and update the page
   * @param {string} language - Language code to set
   */
  async set(language) {
    if (language === this.currentLang) return;

    this.currentLang = language;
    
    // Persist language preference
    localStorage.setItem(this.storageKey, language);

    // Update page content
    this.applyTranslations();
    
    // Update HTML lang attribute and meta tags
    this.updateHtmlLang();
    this.updateMetaTags();

    // Update language switcher state
    this.updateLanguageSwitcher();

    // Update SEO hreflang tags
    if (window.seoManager) {
      window.seoManager.updateHreflangTags(language);
    }

    // Trigger custom event for other modules to listen to
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: language } 
    }));

    // Also call app method directly if available
    if (window.app && window.app.handleLanguageChange) {
      window.app.handleLanguageChange(language);
    }

    console.log(`Language changed to: ${language}`);
  }

  /**
   * Get translation for a key
   * @param {string} key - Translation key (dot notation supported)
   * @param {string} fallback - Fallback text if key not found
   * @returns {string} Translated text or fallback
   */
  t(key, fallback = '[MISSING]') {
    try {
      const translation = this.getNestedValue(this.translations[this.currentLang], key);
      
      if (translation !== undefined && translation !== null && translation !== '') {
        return translation;
      }

      // Try fallback language
      if (this.currentLang !== this.fallbackLang) {
        const fallbackTranslation = this.getNestedValue(this.translations[this.fallbackLang], key);
        if (fallbackTranslation !== undefined && fallbackTranslation !== null && fallbackTranslation !== '') {
          return fallbackTranslation;
        }
      }

      // Return handled missing key
      return this.handleMissingKey(key, fallback);
    } catch (error) {
      console.warn('Translation error for key:', key, error);
      return this.handleMissingKey(key, fallback);
    }
  }

  /**
   * Get current language
   * @returns {string} Current language code
   */
  getCurrentLang() {
    return this.currentLang;
  }

  /**
   * Apply translations to all elements with data-i18n attribute
   */
  applyTranslations() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      // Update text content or specific attributes
      if (element.hasAttribute('data-i18n-attr')) {
        const attr = element.getAttribute('data-i18n-attr');
        element.setAttribute(attr, translation);
      } else {
        element.textContent = translation;
      }
    });
  }

  /**
   * Update HTML lang attribute
   */
  updateHtmlLang() {
    document.documentElement.lang = this.currentLang;
  }

  /**
   * Update meta tags for SEO and social sharing
   */
  updateMetaTags() {
    // Update page title
    const titleElement = document.querySelector('title[data-i18n]');
    if (titleElement) {
      const key = titleElement.getAttribute('data-i18n');
      document.title = this.t(key);
    }

    // Update meta description
    const descElement = document.querySelector('meta[name="description"][data-i18n]');
    if (descElement) {
      const key = descElement.getAttribute('data-i18n');
      descElement.setAttribute('content', this.t(key));
    }

    // Update Open Graph tags
    const ogTitleElement = document.querySelector('meta[property="og:title"][data-i18n]');
    if (ogTitleElement) {
      const key = ogTitleElement.getAttribute('data-i18n');
      ogTitleElement.setAttribute('content', this.t(key));
    }

    const ogDescElement = document.querySelector('meta[property="og:description"][data-i18n]');
    if (ogDescElement) {
      const key = ogDescElement.getAttribute('data-i18n');
      ogDescElement.setAttribute('content', this.t(key));
    }

    // Update og:locale
    const ogLocaleElement = document.querySelector('meta[property="og:locale"]');
    if (ogLocaleElement) {
      const locale = this.currentLang === 'lo' ? 'lo_LA' : 'en_US';
      ogLocaleElement.setAttribute('content', locale);
    }
  }

  /**
   * Initialize language switcher component
   */
  initLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;

    // Create language options if they don't exist
    if (!switcher.querySelector('.lang-option')) {
      this.createLanguageSwitcher(switcher);
    }

    // Add click handlers
    const langOptions = switcher.querySelectorAll('.lang-option');
    langOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = option.getAttribute('data-lang');
        this.set(lang);
      });
    });

    // Set initial active state
    this.updateLanguageSwitcher();
  }

  /**
   * Create language switcher HTML structure
   */
  createLanguageSwitcher(container) {
    container.innerHTML = `
      <button class="lang-option" data-lang="en" aria-label="Switch to English">
        <span class="lang-code">EN</span>
        <span class="lang-name">English</span>
      </button>
      <button class="lang-option" data-lang="lo" aria-label="Switch to Lao">
        <span class="lang-code">ລາວ</span>
        <span class="lang-name">ລາວ</span>
      </button>
    `;
  }

  /**
   * Update language switcher active state
   */
  updateLanguageSwitcher() {
    const switcher = document.querySelector('.language-switcher');
    if (!switcher) return;

    const options = switcher.querySelectorAll('.lang-option');
    options.forEach(option => {
      const lang = option.getAttribute('data-lang');
      option.classList.toggle('active', lang === this.currentLang);
      option.setAttribute('aria-pressed', lang === this.currentLang);
    });
  }

  /**
   * Get fallback translations for a language
   */
  getFallbackTranslations(lang) {
    const fallbacks = {
      en: {
        nav: {
          home: 'Home',
          about: 'About Us',
          projects: 'Projects',
          contact: 'Contact',
          logo: 'ConstructCo'
        },
        hero: {
          title: 'Professional Construction Consulting',
          subtitle: 'Expert guidance for your construction projects',
          cta: 'View Our Projects'
        },
        loading: {
          default: 'Loading...',
          error: 'Failed to load content. Please try again.'
        }
      },
      lo: {
        nav: {
          home: 'ໜ້າຫຼັກ',
          about: 'ກ່ຽວກັບພວກເຮົາ',
          projects: 'ໂຄງການ',
          contact: 'ຕິດຕໍ່',
          logo: 'ConstructCo'
        },
        hero: {
          title: 'ບໍລິການປຶກສາກໍ່ສ້າງແບບມືອາຊີບ',
          subtitle: 'ຄໍາແນະນໍາຈາກຜູ້ຊ່ຽວຊານສໍາລັບໂຄງການກໍ່ສ້າງຂອງທ່ານ',
          cta: 'ເບິ່ງໂຄງການຂອງພວກເຮົາ'
        },
        loading: {
          default: 'ກໍາລັງໂຫລດ...',
          error: 'ບໍ່ສາມາດໂຫລດເນື້ອຫາໄດ້. ກະລຸນາລອງໃໝ່.'
        }
      }
    };
    
    return fallbacks[lang] || fallbacks.en;
  }

  /**
   * Load translations from localStorage cache
   */
  loadFromCache(lang) {
    try {
      const cached = localStorage.getItem(`i18n-cache-${lang}`);
      if (cached) {
        const data = JSON.parse(cached);
        // Check if cache is not too old (24 hours)
        if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
          return data.translations;
        }
      }
    } catch (error) {
      console.warn('Failed to load translations from cache:', error);
    }
    return null;
  }

  /**
   * Save translations to localStorage cache
   */
  saveToCache(lang, translations) {
    try {
      const data = {
        translations,
        timestamp: Date.now()
      };
      localStorage.setItem(`i18n-cache-${lang}`, JSON.stringify(data));
    } catch (error) {
      console.warn('Failed to save translations to cache:', error);
    }
  }

  /**
   * Handle missing translation keys
   */
  handleMissingKey(key, fallback) {
    console.warn(`Missing translation key: ${key}`);
    
    // Generate readable fallback from key
    if (fallback === '[MISSING]') {
      const parts = key.split('.');
      const lastPart = parts[parts.length - 1];
      return `[MISSING: ${lastPart.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}]`;
    }
    
    return fallback;
  }

  /**
   * Get nested object value using dot notation
   * @param {Object} obj - Object to search in
   * @param {string} path - Dot notation path
   * @returns {*} Value or undefined
   */
  getNestedValue(obj, path) {
    if (!obj || !path) return undefined;
    
    try {
      return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
      }, obj);
    } catch (error) {
      console.warn('Error getting nested value:', error);
      return undefined;
    }
  }
}

// Create global instance
const i18n = new I18n();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = I18n;
}