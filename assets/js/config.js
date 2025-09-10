/**
 * Configuration for Production/Development Environment
 * Controls which assets to load and performance optimizations
 */

window.CONFIG = {
  // Environment settings
  ENVIRONMENT: 'development', // 'development' or 'production'
  
  // Performance settings
  PERFORMANCE: {
    USE_MINIFIED_ASSETS: false, // Set to true in production
    ENABLE_PERFORMANCE_MONITORING: true,
    PRELOAD_CRITICAL_FONTS: true,
    LAZY_LOAD_IMAGES: true,
    USE_WEBP_AVIF: true,
    ENABLE_SERVICE_WORKER: false // Future enhancement
  },
  
  // Asset paths
  ASSETS: {
    CSS: {
      TOKENS: '/assets/css/tokens.css',
      MAIN: '/assets/css/main.css'
    },
    JS: {
      PERFORMANCE: '/assets/js/performance.js',
      IMAGE_OPTIMIZER: '/assets/js/image-optimizer.js',
      I18N: '/assets/js/i18n.js',
      MOTION: '/assets/js/motion.js',
      SEO: '/assets/js/seo.js',
      SHELL: '/assets/js/shell.js',
      MAIN: '/assets/js/main.js'
    }
  },
  
  // CDN settings
  CDN: {
    GSAP: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js',
    SCROLL_TRIGGER: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js',
    FONTS: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+Lao:wght@400;600&display=swap'
  },
  
  // Performance budgets
  BUDGETS: {
    JAVASCRIPT_MAX_SIZE: 150 * 1024, // 150KB
    CSS_MAX_SIZE: 120 * 1024, // 120KB
    IMAGE_MAX_SIZE: 500 * 1024, // 500KB per image
    TOTAL_PAGE_SIZE: 2 * 1024 * 1024 // 2MB total
  },
  
  // Feature flags
  FEATURES: {
    // GSAP ScrollSmoother - REQUIRES CLUB GREENSOCK LICENSE
    // Set to true only if you have purchased Club GreenSock membership
    // License info: https://greensock.com/club/
    GSAP_SCROLL_SMOOTHER: false, // Default: false (uses free plugins only)
    
    ADVANCED_ANIMATIONS: true,
    IMAGE_OPTIMIZATION: true,
    PERFORMANCE_MONITORING: true,
    ERROR_REPORTING: true
  }
};

// Auto-detect production environment
if (window.location.hostname !== 'localhost' && 
    window.location.hostname !== '127.0.0.1' && 
    !window.location.hostname.includes('github.io')) {
  window.CONFIG.ENVIRONMENT = 'production';
  window.CONFIG.PERFORMANCE.USE_MINIFIED_ASSETS = true;
}

// Update asset paths for production
if (window.CONFIG.PERFORMANCE.USE_MINIFIED_ASSETS) {
  window.CONFIG.ASSETS.CSS.TOKENS = '/assets/css/tokens.min.css';
  window.CONFIG.ASSETS.CSS.MAIN = '/assets/css/main.min.css';
  window.CONFIG.ASSETS.JS.PERFORMANCE = '/assets/js/performance.min.js';
  window.CONFIG.ASSETS.JS.MOTION = '/assets/js/motion.min.js';
  window.CONFIG.ASSETS.JS.MAIN = '/assets/js/main.min.js';
}

// Log configuration in development
if (window.CONFIG.ENVIRONMENT === 'development') {
  console.log('Site Configuration:', window.CONFIG);
}