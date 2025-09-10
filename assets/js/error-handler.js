/**
 * Global Error Handler and Fallback System
 * Provides graceful degradation and error recovery for the construction consulting website
 */

class ErrorHandler {
  constructor() {
    this.errors = [];
    this.retryAttempts = new Map();
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second base delay
    this.init();
  }

  init() {
    this.setupGlobalErrorHandlers();
    this.setupNetworkErrorHandling();
    this.setupFontFallbacks();
    this.setupImageErrorHandling();
    this.logSystemInfo();
  }

  /**
   * Setup global JavaScript error handlers
   */
  setupGlobalErrorHandlers() {
    // Global error handler for uncaught exceptions
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        stack: event.error?.stack
      });
    });

    // Global handler for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason,
        stack: event.reason?.stack
      });
      
      // Prevent the default browser behavior (console error)
      event.preventDefault();
    });

    // Resource loading error handler
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        this.handleResourceError(event);
      }
    }, true); // Use capture phase to catch resource errors
  }

  /**
   * Handle JavaScript and promise errors
   */
  handleError(errorInfo) {
    this.errors.push({
      ...errorInfo,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    });

    console.error('Error caught by global handler:', errorInfo);

    // Handle specific error types
    switch (errorInfo.type) {
      case 'javascript':
        this.handleJavaScriptError(errorInfo);
        break;
      case 'promise':
        this.handlePromiseError(errorInfo);
        break;
    }

    // Show user-friendly error message for critical errors
    if (this.isCriticalError(errorInfo)) {
      this.showUserErrorMessage();
    }
  }

  /**
   * Handle resource loading errors (scripts, stylesheets, images)
   */
  handleResourceError(event) {
    const element = event.target;
    const resourceType = element.tagName.toLowerCase();
    const src = element.src || element.href;

    console.warn(`Failed to load ${resourceType}:`, src);

    switch (resourceType) {
      case 'script':
        this.handleScriptError(element, src);
        break;
      case 'link':
        this.handleStylesheetError(element, src);
        break;
      case 'img':
        this.handleImageError(element, src);
        break;
    }
  }

  /**
   * Handle JavaScript errors with graceful degradation
   */
  handleJavaScriptError(errorInfo) {
    // Check if it's a GSAP-related error
    if (errorInfo.message?.includes('gsap') || errorInfo.message?.includes('ScrollTrigger')) {
      console.warn('GSAP error detected, enabling CSS fallbacks');
      document.body.classList.add('no-gsap', 'no-animations');
      this.enableCSSAnimationFallbacks();
    }

    // Check if it's an i18n-related error
    if (errorInfo.message?.includes('i18n') || errorInfo.message?.includes('translation')) {
      console.warn('i18n error detected, using fallback text');
      this.enableTranslationFallbacks();
    }
  }

  /**
   * Handle promise rejection errors
   */
  handlePromiseError(errorInfo) {
    // Check if it's a network-related promise rejection
    if (errorInfo.message?.includes('fetch') || errorInfo.message?.includes('network')) {
      console.warn('Network error in promise, implementing retry logic');
      // Network errors are handled by the retry mechanism
    }
  }

  /**
   * Handle script loading failures
   */
  handleScriptError(element, src) {
    // Handle GSAP loading failure
    if (src.includes('gsap')) {
      console.warn('GSAP failed to load, enabling CSS fallbacks');
      document.body.classList.add('no-gsap', 'no-animations');
      this.enableCSSAnimationFallbacks();
      return;
    }

    // Handle ScrollTrigger loading failure
    if (src.includes('ScrollTrigger')) {
      console.warn('ScrollTrigger failed to load');
      document.body.classList.add('no-scroll-trigger');
      return;
    }

    // For other scripts, try to continue without them
    console.warn(`Script failed to load: ${src}, continuing without it`);
  }

  /**
   * Handle stylesheet loading failures
   */
  handleStylesheetError(element, href) {
    // Handle Google Fonts failure
    if (href.includes('fonts.googleapis.com')) {
      console.warn('Google Fonts failed to load, using fallback fonts');
      this.enableFontFallbacks();
      return;
    }

    console.warn(`Stylesheet failed to load: ${href}`);
  }

  /**
   * Handle image loading failures
   */
  handleImageError(element, src) {
    // Simply hide the image and show initials/placeholder instead
    console.warn(`Image failed to load: ${src}, hiding image`);
    element.style.display = 'none';
    element.classList.add('image-failed');

    // Show fallback content if available
    const fallbackElement = element.nextElementSibling;
    if (fallbackElement && fallbackElement.classList.contains('team-initials')) {
      fallbackElement.style.display = 'flex';
    }
  }

  /**
   * Setup network error handling with retry logic
   */
  setupNetworkErrorHandling() {
    // Override fetch to add retry logic
    const originalFetch = window.fetch;
    
    window.fetch = async (url, options = {}) => {
      return this.fetchWithRetry(url, options, originalFetch);
    };
  }

  /**
   * Fetch with automatic retry logic
   */
  async fetchWithRetry(url, options, originalFetch) {
    const retryKey = `${url}-${JSON.stringify(options)}`;
    const attempts = this.retryAttempts.get(retryKey) || 0;

    try {
      const response = await originalFetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      // Reset retry count on success
      this.retryAttempts.delete(retryKey);
      return response;
      
    } catch (error) {
      console.warn(`Fetch failed for ${url}:`, error.message);
      
      if (attempts < this.maxRetries) {
        const delay = this.retryDelay * Math.pow(2, attempts); // Exponential backoff
        console.log(`Retrying fetch for ${url} in ${delay}ms (attempt ${attempts + 1}/${this.maxRetries})`);
        
        this.retryAttempts.set(retryKey, attempts + 1);
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.fetchWithRetry(url, options, originalFetch);
      }
      
      // Max retries exceeded
      this.retryAttempts.delete(retryKey);
      console.error(`Failed to fetch ${url} after ${this.maxRetries} attempts`);
      throw error;
    }
  }

  /**
   * Setup font fallbacks
   */
  setupFontFallbacks() {
    // Check if fonts are loading
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        console.log('Fonts loaded successfully');
      }).catch(() => {
        console.warn('Font loading failed, using system fonts');
        this.enableFontFallbacks();
      });

      // Set a timeout for font loading
      setTimeout(() => {
        if (document.fonts.status !== 'loaded') {
          console.warn('Font loading timeout, using system fonts');
          this.enableFontFallbacks();
        }
      }, 5000); // 5 second timeout
    }
  }

  /**
   * Enable font fallbacks
   */
  enableFontFallbacks() {
    const fallbackCSS = `
      .font-fallback {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
                     'Helvetica Neue', Arial, sans-serif !important;
      }
      
      .font-fallback[lang="lo"] {
        font-family: 'Phetsarath OT', 'Saysettha OT', 'Lao UI', 
                     sans-serif !important;
      }
    `;
    
    this.injectCSS(fallbackCSS, 'font-fallbacks');
    document.body.classList.add('font-fallback');
  }

  /**
   * Setup image error handling (lightweight version)
   */
  setupImageErrorHandling() {
    // Only handle critical images, not all images automatically
    // This reduces performance overhead significantly
    console.log('Image error handling initialized (lightweight mode)');
  }

  /**
   * Enable CSS animation fallbacks
   */
  enableCSSAnimationFallbacks() {
    const fallbackCSS = `
      .no-gsap .reveal-up {
        opacity: 1 !important;
        transform: none !important;
        animation: revealUpFallback 0.6s ease-out;
      }
      
      .no-gsap .parallax-y {
        will-change: auto !important;
        transform: none !important;
      }
      
      .no-gsap .counter {
        /* Show final values immediately */
      }
      
      @keyframes revealUpFallback {
        from {
          opacity: 0;
          transform: translateY(24px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      /* Respect reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        .no-gsap .reveal-up {
          animation: none !important;
        }
      }
    `;
    
    this.injectCSS(fallbackCSS, 'animation-fallbacks');
  }

  /**
   * Enable translation fallbacks
   */
  enableTranslationFallbacks() {
    // Find elements with missing translations
    document.querySelectorAll('[data-i18n]').forEach(element => {
      if (element.textContent.includes('[MISSING]') || element.textContent.trim() === '') {
        const key = element.getAttribute('data-i18n');
        const fallbackText = this.generateFallbackText(key);
        element.textContent = fallbackText;
        element.classList.add('translation-fallback');
      }
    });
  }

  /**
   * Generate fallback text from i18n keys
   */
  generateFallbackText(key) {
    // Convert dot notation keys to readable text
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Convert snake_case or camelCase to Title Case
    return lastPart
      .replace(/[_-]/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  /**
   * Inject CSS into the document
   */
  injectCSS(css, id) {
    if (document.getElementById(id)) return; // Already injected
    
    const style = document.createElement('style');
    style.id = id;
    style.textContent = css;
    document.head.appendChild(style);
  }

  /**
   * Check if an error is critical
   */
  isCriticalError(errorInfo) {
    const criticalPatterns = [
      'Cannot read property',
      'Cannot read properties',
      'is not a function',
      'is not defined'
    ];
    
    return criticalPatterns.some(pattern => 
      errorInfo.message?.includes(pattern)
    );
  }

  /**
   * Show user-friendly error message
   */
  showUserErrorMessage() {
    // Only show once per session
    if (sessionStorage.getItem('error-message-shown')) return;
    
    const errorBanner = document.createElement('div');
    errorBanner.className = 'error-banner';
    errorBanner.innerHTML = `
      <div class="error-banner-content">
        <p>Some features may not be working properly. Please refresh the page or try again later.</p>
        <button class="error-banner-close" aria-label="Close error message">×</button>
      </div>
    `;
    
    // Add styles
    const errorCSS = `
      .error-banner {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: #ff6b6b;
        color: white;
        padding: 12px;
        text-align: center;
        z-index: 10000;
        font-size: 14px;
      }
      
      .error-banner-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
      }
      
      .error-banner-close {
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .error-banner-close:hover {
        opacity: 0.8;
      }
    `;
    
    this.injectCSS(errorCSS, 'error-banner-styles');
    
    document.body.insertBefore(errorBanner, document.body.firstChild);
    
    // Auto-hide after 10 seconds
    setTimeout(() => {
      if (errorBanner.parentNode) {
        errorBanner.remove();
      }
    }, 10000);
    
    // Close button handler
    errorBanner.querySelector('.error-banner-close').addEventListener('click', () => {
      errorBanner.remove();
    });
    
    sessionStorage.setItem('error-message-shown', 'true');
  }

  /**
   * Log system information for debugging
   */
  logSystemInfo() {
    console.log('Error Handler initialized');
    console.log('User Agent:', navigator.userAgent);
    console.log('Screen Resolution:', `${screen.width}x${screen.height}`);
    console.log('Viewport Size:', `${window.innerWidth}x${window.innerHeight}`);
    console.log('Connection:', navigator.connection?.effectiveType || 'unknown');
    console.log('Reduced Motion:', window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * Get error report for debugging
   */
  getErrorReport() {
    return {
      errors: this.errors,
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      retryAttempts: Object.fromEntries(this.retryAttempts)
    };
  }

  /**
   * Clear error history
   */
  clearErrors() {
    this.errors = [];
    this.retryAttempts.clear();
  }
}

// Initialize global error handler
window.errorHandler = new ErrorHandler();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ErrorHandler;
}