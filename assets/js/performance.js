/**
 * Performance Monitoring and Optimization Module
 * Handles performance measurement, resource loading optimization, and error handling
 */

class Performance {
  constructor() {
    this.metrics = {
      loadStart: performance.now(),
      domContentLoaded: null,
      windowLoaded: null,
      firstPaint: null,
      firstContentfulPaint: null,
      largestContentfulPaint: null,
      cumulativeLayoutShift: 0,
      firstInputDelay: null
    };
    
    this.resourceErrors = [];
    this.jsErrors = [];
    this.initialized = false;
  }

  /**
   * Initialize performance monitoring
   */
  init() {
    if (this.initialized) return;

    try {
      this.setupErrorHandling();
      this.setupResourceErrorHandling();
      this.measureCoreWebVitals();
      this.setupFontFallbacks();
      this.optimizeImageLoading();
      this.monitorNetworkConditions();
      
      this.initialized = true;
      console.log('Performance monitoring initialized');
    } catch (error) {
      console.error('Failed to initialize performance monitoring:', error);
    }
  }

  /**
   * Setup global error handling
   */
  setupErrorHandling() {
    // Handle JavaScript errors
    window.addEventListener('error', (event) => {
      const error = {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      };
      
      this.jsErrors.push(error);
      console.error('JavaScript error:', error);
      
      // Graceful degradation for critical errors
      this.handleCriticalError(error);
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const error = {
        reason: event.reason,
        promise: event.promise,
        timestamp: Date.now(),
        type: 'unhandledrejection'
      };
      
      this.jsErrors.push(error);
      console.error('Unhandled promise rejection:', error);
      
      // Prevent the default browser behavior for non-critical errors
      if (!this.isCriticalError(error.reason)) {
        event.preventDefault();
      }
    });
  }

  /**
   * Setup resource error handling
   */
  setupResourceErrorHandling() {
    // Monitor resource loading errors
    window.addEventListener('error', (event) => {
      if (event.target !== window) {
        const resource = {
          type: event.target.tagName,
          source: event.target.src || event.target.href,
          timestamp: Date.now()
        };
        
        this.resourceErrors.push(resource);
        console.warn('Resource failed to load:', resource);
        
        // Handle specific resource failures
        this.handleResourceError(event.target);
      }
    }, true);
  }

  /**
   * Handle critical JavaScript errors
   */
  handleCriticalError(error) {
    // Check if error is related to GSAP
    if (error.message && error.message.includes('gsap')) {
      document.body.classList.add('no-gsap');
      console.warn('GSAP error detected, enabling CSS fallbacks');
    }
    
    // Check if error is related to i18n
    if (error.message && error.message.includes('i18n')) {
      console.warn('i18n error detected, using fallback text');
      this.enableI18nFallback();
    }
  }

  /**
   * Check if an error is critical
   */
  isCriticalError(error) {
    const criticalPatterns = [
      'ChunkLoadError',
      'Loading chunk',
      'Loading CSS chunk'
    ];
    
    const errorString = error.toString();
    return criticalPatterns.some(pattern => errorString.includes(pattern));
  }

  /**
   * Handle resource loading errors
   */
  handleResourceError(element) {
    const tagName = element.tagName.toLowerCase();
    
    switch (tagName) {
      case 'img':
        this.handleImageError(element);
        break;
      case 'link':
        this.handleStylesheetError(element);
        break;
      case 'script':
        this.handleScriptError(element);
        break;
    }
  }

  /**
   * Handle image loading errors
   */
  handleImageError(img) {
    // Simply hide the image instead of trying fallbacks
    console.warn('Image failed to load:', img.dataset.originalSrc || img.src);
    img.style.display = 'none';
    img.classList.add('image-failed');

    // Show fallback content if available
    const fallbackElement = img.nextElementSibling;
    if (fallbackElement && (fallbackElement.classList.contains('team-initials') || fallbackElement.classList.contains('team-avatar'))) {
      fallbackElement.style.display = 'flex';
    }
  }

  /**
   * Handle stylesheet loading errors
   */
  handleStylesheetError(link) {
    console.warn('Stylesheet failed to load:', link.href);
    
    // Try to load from alternative CDN or local fallback
    if (link.href.includes('fonts.googleapis.com')) {
      this.enableFontFallback();
    }
  }

  /**
   * Handle script loading errors
   */
  handleScriptError(script) {
    console.warn('Script failed to load:', script.src);
    
    // Handle GSAP loading failure
    if (script.src.includes('gsap')) {
      document.body.classList.add('no-gsap');
      console.warn('GSAP failed to load, using CSS fallbacks');
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
        this.enableFontFallback();
      });
      
      // Set a timeout for font loading
      setTimeout(() => {
        if (document.fonts.status !== 'loaded') {
          console.warn('Font loading timeout, using fallbacks');
          this.enableFontFallback();
        }
      }, 3000);
    }
  }

  /**
   * Enable font fallbacks
   */
  enableFontFallback() {
    document.body.classList.add('font-fallback');
    
    // Add fallback font styles
    const fallbackCSS = `
      .font-fallback {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif !important;
      }
      .font-fallback :lang(lo) {
        font-family: 'Phetsarath OT', 'Saysettha OT', sans-serif !important;
      }
    `;
    
    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
  }

  /**
   * Enable i18n fallback
   */
  enableI18nFallback() {
    // Replace missing translation keys with readable text
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      if (element.textContent.includes('[MISSING]') || element.textContent.trim() === '') {
        const key = element.getAttribute('data-i18n');
        element.textContent = this.generateFallbackText(key);
      }
    });
  }

  /**
   * Generate fallback text from i18n keys
   */
  generateFallbackText(key) {
    // Convert key to readable text
    const parts = key.split('.');
    const lastPart = parts[parts.length - 1];
    
    // Convert snake_case or camelCase to Title Case
    return lastPart
      .replace(/[_-]/g, ' ')
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Optimize image loading
   */
  optimizeImageLoading() {
    // Add intersection observer for lazy loading fallback
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            this.loadImageWithFallback(img);
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px'
      });

      // Observe images that don't have native lazy loading
      const images = document.querySelectorAll('img:not([loading="lazy"])');
      images.forEach(img => {
        if (img.dataset.src) {
          imageObserver.observe(img);
        }
      });
    }

    // Setup WebP/AVIF support detection
    this.detectImageFormatSupport();
  }

  /**
   * Load image with format fallback
   */
  loadImageWithFallback(img) {
    const originalSrc = img.dataset.src || img.src;
    
    // Try WebP first if supported
    if (this.supportsWebP && originalSrc.includes('.jpg')) {
      const webpSrc = originalSrc.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      
      const testImg = new Image();
      testImg.onload = () => {
        img.src = webpSrc;
      };
      testImg.onerror = () => {
        img.src = originalSrc;
      };
      testImg.src = webpSrc;
    } else {
      img.src = originalSrc;
    }
  }

  /**
   * Detect image format support
   */
  detectImageFormatSupport() {
    // Test WebP support
    const webpTest = new Image();
    webpTest.onload = webpTest.onerror = () => {
      this.supportsWebP = webpTest.height === 2;
    };
    webpTest.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

    // Test AVIF support
    const avifTest = new Image();
    avifTest.onload = avifTest.onerror = () => {
      this.supportsAVIF = avifTest.height === 2;
    };
    avifTest.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  }

  /**
   * Monitor network conditions
   */
  monitorNetworkConditions() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      
      // Adjust loading strategy based on connection
      if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
        this.enableLowBandwidthMode();
      }
      
      // Listen for connection changes
      connection.addEventListener('change', () => {
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          this.enableLowBandwidthMode();
        } else {
          this.disableLowBandwidthMode();
        }
      });
    }
  }

  /**
   * Enable low bandwidth optimizations
   */
  enableLowBandwidthMode() {
    document.body.classList.add('low-bandwidth');
    
    // Disable non-essential animations
    document.body.classList.add('reduced-motion');
    
    // Reduce image quality
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      if (img.dataset.lowQuality) {
        img.dataset.src = img.dataset.lowQuality;
      }
    });
    
    console.log('Low bandwidth mode enabled');
  }

  /**
   * Disable low bandwidth mode
   */
  disableLowBandwidthMode() {
    document.body.classList.remove('low-bandwidth');
    
    // Re-enable animations if not explicitly disabled
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.remove('reduced-motion');
    }
    
    console.log('Low bandwidth mode disabled');
  }

  /**
   * Measure Core Web Vitals
   */
  measureCoreWebVitals() {
    // Measure FCP and LCP
    if ('PerformanceObserver' in window) {
      // First Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
            console.log('FCP:', entry.startTime);
          }
        });
      }).observe({ entryTypes: ['paint'] });

      // Largest Contentful Paint
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
        console.log('LCP:', lastEntry.startTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // Cumulative Layout Shift
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            this.metrics.cumulativeLayoutShift += entry.value;
          }
        });
        console.log('CLS:', this.metrics.cumulativeLayoutShift);
      }).observe({ entryTypes: ['layout-shift'] });

      // First Input Delay
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          this.metrics.firstInputDelay = entry.processingStart - entry.startTime;
          console.log('FID:', this.metrics.firstInputDelay);
        });
      }).observe({ entryTypes: ['first-input'] });
    }

    // Measure load times
    document.addEventListener('DOMContentLoaded', () => {
      this.metrics.domContentLoaded = performance.now();
    });

    window.addEventListener('load', () => {
      this.metrics.windowLoaded = performance.now();
      this.reportMetrics();
    });
  }

  /**
   * Report performance metrics
   */
  reportMetrics() {
    const loadTime = this.metrics.windowLoaded - this.metrics.loadStart;
    
    console.group('Performance Metrics');
    console.log('Page Load Time:', loadTime.toFixed(2) + 'ms');
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded?.toFixed(2) + 'ms');
    console.log('First Contentful Paint:', this.metrics.firstContentfulPaint?.toFixed(2) + 'ms');
    console.log('Largest Contentful Paint:', this.metrics.largestContentfulPaint?.toFixed(2) + 'ms');
    console.log('Cumulative Layout Shift:', this.metrics.cumulativeLayoutShift?.toFixed(4));
    console.log('First Input Delay:', this.metrics.firstInputDelay?.toFixed(2) + 'ms');
    console.log('Resource Errors:', this.resourceErrors.length);
    console.log('JavaScript Errors:', this.jsErrors.length);
    console.groupEnd();

    // Warn about performance issues
    if (loadTime > 3000) {
      console.warn('Page load time is slow (>3s)');
    }
    if (this.metrics.largestContentfulPaint > 2500) {
      console.warn('LCP is slow (>2.5s)');
    }
    if (this.metrics.cumulativeLayoutShift > 0.1) {
      console.warn('CLS is high (>0.1)');
    }
    if (this.metrics.firstInputDelay > 100) {
      console.warn('FID is high (>100ms)');
    }
  }

  /**
   * Get performance report
   */
  getReport() {
    return {
      metrics: this.metrics,
      errors: {
        resources: this.resourceErrors,
        javascript: this.jsErrors
      },
      timestamp: Date.now()
    };
  }
}

// Create global instance
window.Performance = new Performance();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.Performance.init();
  });
} else {
  window.Performance.init();
}