/**
 * Motion System - GSAP Animation Management
 * Handles scroll animations, smooth scrolling, and motion preferences
 * 
 * GSAP LICENSING INFORMATION:
 * ===========================
 * 
 * This project uses GSAP (GreenSock Animation Platform) with the following licensing:
 * 
 * FREE PLUGINS (No license required):
 * - GSAP Core: Free for commercial use
 * - ScrollTrigger: Free for commercial use
 * 
 * CLUB GREENSOCK PLUGINS (Requires paid membership):
 * - ScrollSmoother: Requires Club GreenSock membership ($99+/year)
 * 
 * IMPORTANT: ScrollSmoother is disabled by default (USE_SMOOTHER: false)
 * To enable ScrollSmoother:
 * 1. Purchase Club GreenSock membership at https://greensock.com/club/
 * 2. Set USE_SMOOTHER: true in config or window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER = true
 * 3. Include ScrollSmoother plugin from your Club GreenSock account
 * 
 * For complete licensing information visit:
 * https://greensock.com/licensing/
 * 
 * The fallback system ensures the site works perfectly without ScrollSmoother.
 */

class Motion {
  constructor() {
    this.gsapLoaded = false;
    this.scrollTriggerLoaded = false;
    this.scrollSmootherLoaded = false;
    this.reducedMotion = false;
    this.config = {
      // Feature flag for ScrollSmoother (requires Club GreenSock license)
      // Can be overridden by window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER
      USE_SMOOTHER: false,
      
      // ScrollSmoother settings
      scrollSmoother: {
        smooth: 1,
        effects: true,
        smoothTouch: 0.1,
        normalizeScroll: true
      },
      
      // Default ScrollTrigger settings
      scrollTrigger: {
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      },
      
      // Animation effects
      effects: {
        revealUp: {
          y: 24,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out"
        },
        parallax: {
          speed: 0.5,
          lag: 0.1
        },
        counter: {
          duration: 2,
          ease: "power2.out"
        }
      }
    };
  }

  /**
   * Initialize the motion system
   * @returns {Promise} Resolves when initialization is complete
   */
  async init() {
    try {
      // Check for reduced motion preference
      this.checkReducedMotion();
      
      // Override config with global feature flags if available
      this.applyFeatureFlags();
      
      // Load GSAP core
      await this.loadGSAP();
      
      if (this.gsapLoaded && !this.reducedMotion) {
        // Load ScrollTrigger
        await this.loadScrollTrigger();
        
        // Optionally load ScrollSmoother (Club GreenSock feature)
        if (this.config.USE_SMOOTHER) {
          await this.loadScrollSmoother();
        }
        
        // Initialize animations
        this.setupAnimations();
        this.setupSmoothScrolling();
        this.registerEffects();
        
        console.log('Motion system initialized successfully', {
          gsap: this.gsapLoaded,
          scrollTrigger: this.scrollTriggerLoaded,
          scrollSmoother: this.scrollSmootherLoaded,
          reducedMotion: this.reducedMotion
        });
      } else {
        // Fallback to CSS-only animations
        this.enableCSSFallbacks();
      }
      
      // Setup anchor link smooth scrolling (works with or without GSAP)
      // Disabled to prevent conflicts with page-specific anchor navigation in main.js
      // this.setupAnchorScrolling();
      
    } catch (error) {
      console.warn('Motion system initialization failed:', error);
      this.enableCSSFallbacks();
    }
    
    return Promise.resolve();
  }

  /**
   * Apply feature flags from global CONFIG if available
   */
  applyFeatureFlags() {
    if (window.CONFIG && window.CONFIG.FEATURES) {
      // Override USE_SMOOTHER with global config
      if (typeof window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER === 'boolean') {
        this.config.USE_SMOOTHER = window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER;
        console.log('ScrollSmoother feature flag set to:', this.config.USE_SMOOTHER);
      }
    }
    
    // Log licensing status
    if (this.config.USE_SMOOTHER) {
      console.log('⚠️  ScrollSmoother enabled - requires Club GreenSock license');
      console.log('📄 License info: https://greensock.com/licensing/');
    } else {
      console.log('✅ Using free GSAP plugins only (Core + ScrollTrigger)');
    }
  }

  /**
   * Check for reduced motion preference
   */
  checkReducedMotion() {
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (this.reducedMotion) {
      document.body.classList.add('reduced-motion');
      console.log('Reduced motion detected - animations disabled');
    }
    
    // Listen for changes to motion preference
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.reducedMotion = e.matches;
      if (this.reducedMotion) {
        document.body.classList.add('reduced-motion');
        this.disableAnimations();
      } else {
        document.body.classList.remove('reduced-motion');
        this.enableAnimations();
      }
    });
  }

  /**
   * Load GSAP core library
   */
  async loadGSAP() {
    return new Promise((resolve) => {
      if (window.gsap) {
        this.gsapLoaded = true;
        console.log('GSAP already loaded');
        resolve();
        return;
      }

      // Wait a bit for GSAP to load from HTML script tags
      setTimeout(() => {
        if (window.gsap) {
          this.gsapLoaded = true;
          console.log('GSAP loaded from HTML');
          resolve();
        } else {
          console.warn('GSAP not available - using fallbacks');
          this.handleGSAPLoadFailure();
          resolve();
        }
      }, 100);
    });
  }

  /**
   * Handle GSAP loading failure
   */
  handleGSAPLoadFailure() {
    document.body.classList.add('no-gsap');
    
    // Add CSS fallback animations
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
      
      .no-gsap .counter {
        /* Show final values immediately */
      }
      
      /* Respect reduced motion preferences */
      @media (prefers-reduced-motion: reduce) {
        .no-gsap .reveal-up {
          animation: none !important;
        }
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'gsap-fallback-styles';
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
    
    // Setup intersection observer for reveal animations
    this.setupFallbackAnimations();
    
    console.log('GSAP fallback styles applied');
  }

  /**
   * Setup fallback animations using Intersection Observer
   */
  setupFallbackAnimations() {
    if (this.reducedMotion) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -20% 0px'
    });

    // Observe reveal elements
    document.querySelectorAll('.reveal-up').forEach(el => {
      observer.observe(el);
    });

    // Add CSS for in-view state
    const inViewCSS = `
      .no-gsap .reveal-up.in-view {
        animation: revealUpFallback 0.6s ease-out;
      }
    `;
    
    const style = document.createElement('style');
    style.id = 'intersection-observer-styles';
    style.textContent = inViewCSS;
    document.head.appendChild(style);
  }

  /**
   * Load ScrollTrigger plugin
   */
  async loadScrollTrigger() {
    return new Promise((resolve) => {
      if (window.ScrollTrigger) {
        gsap.registerPlugin(ScrollTrigger);
        this.scrollTriggerLoaded = true;
        console.log('ScrollTrigger already loaded');
        resolve();
        return;
      }

      // Wait a bit for ScrollTrigger to load from HTML script tags
      setTimeout(() => {
        if (window.ScrollTrigger && window.gsap) {
          gsap.registerPlugin(ScrollTrigger);
          this.scrollTriggerLoaded = true;
          console.log('ScrollTrigger loaded from HTML');
        } else {
          console.warn('ScrollTrigger not available - using fallbacks');
        }
        resolve();
      }, 200);
    });
  }

  /**
   * Load ScrollSmoother plugin (Club GreenSock feature)
   * 
   * IMPORTANT: ScrollSmoother requires a Club GreenSock membership
   * Visit https://greensock.com/club/ to purchase a license
   */
  async loadScrollSmoother() {
    return new Promise((resolve, reject) => {
      if (window.ScrollSmoother) {
        // ScrollSmoother is available - register the plugin
        gsap.registerPlugin(ScrollSmoother);
        this.scrollSmootherLoaded = true;
        console.log('✅ ScrollSmoother loaded successfully (Club GreenSock license active)');
        resolve();
        return;
      }

      // ScrollSmoother not available - check if it should be loaded
      console.warn('⚠️  ScrollSmoother not found');
      console.warn('📋 To use ScrollSmoother:');
      console.warn('   1. Purchase Club GreenSock membership: https://greensock.com/club/');
      console.warn('   2. Download ScrollSmoother from your account');
      console.warn('   3. Include it before this script');
      console.warn('🔄 Falling back to native smooth scrolling + ScrollTrigger');
      
      // Don't reject - just use fallback
      resolve();
    });
  }

  /**
   * Setup scroll animations
   */
  setupAnimations() {
    if (!this.gsapLoaded || !this.scrollTriggerLoaded || this.reducedMotion) {
      return;
    }

    // Reveal up animations
    const revealElements = document.querySelectorAll('.reveal-up');
    revealElements.forEach(element => {
      gsap.fromTo(element, 
        this.config.effects.revealUp,
        {
          y: 0,
          opacity: 1,
          duration: this.config.effects.revealUp.duration,
          ease: this.config.effects.revealUp.ease,
          scrollTrigger: {
            trigger: element,
            start: this.config.scrollTrigger.start,
            end: this.config.scrollTrigger.end,
            toggleActions: this.config.scrollTrigger.toggleActions
          }
        }
      );
    });

    // Parallax animations
    const parallaxElements = document.querySelectorAll('.parallax-y');
    parallaxElements.forEach(element => {
      gsap.to(element, {
        yPercent: -50 * this.config.effects.parallax.speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: this.config.effects.parallax.lag
        }
      });
    });

    // Counter animations
    const counterElements = document.querySelectorAll('.counter');
    counterElements.forEach(element => {
      const target = parseInt(element.textContent) || 0;
      const counter = { value: 0 };
      
      gsap.to(counter, {
        value: target,
        duration: this.config.effects.counter.duration,
        ease: this.config.effects.counter.ease,
        onUpdate: () => {
          element.textContent = Math.round(counter.value);
        },
        scrollTrigger: {
          trigger: element,
          start: this.config.scrollTrigger.start,
          toggleActions: "play none none none"
        }
      });
    });
  }

  /**
   * Setup smooth scrolling
   */
  setupSmoothScrolling() {
    if (this.config.USE_SMOOTHER && this.scrollSmootherLoaded && !this.reducedMotion) {
      // Use ScrollSmoother if available and licensed
      try {
        ScrollSmoother.create(this.config.scrollSmoother);
        console.log('✅ ScrollSmoother active (Club GreenSock license)');
        document.body.classList.add('scroll-smoother-active');
      } catch (error) {
        console.warn('ScrollSmoother creation failed:', error);
        this.enableNativeSmoothScroll();
      }
    } else {
      // Fallback to native smooth scrolling
      this.enableNativeSmoothScroll();
      
      if (this.config.USE_SMOOTHER && !this.scrollSmootherLoaded) {
        console.log('🔄 ScrollSmoother requested but not available - using native smooth scroll');
      }
    }
  }

  /**
   * Enable native smooth scrolling fallback
   */
  enableNativeSmoothScroll() {
    // Add smooth scrolling to html element
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Respect reduced motion
    if (this.reducedMotion) {
      document.documentElement.style.scrollBehavior = 'auto';
    }
  }

  /**
   * Setup anchor link smooth scrolling
   * DISABLED: Conflicts with page-specific anchor navigation
   */
  setupAnchorScrolling() {
    // Disabled to prevent conflicts with main.js anchor navigation
    return;
  }

  /**
   * Register custom GSAP effects
   */
  registerEffects() {
    if (!this.gsapLoaded || this.reducedMotion) return;

    // Register reveal up effect
    gsap.registerEffect({
      name: "revealUp",
      effect: (targets, config) => {
        return gsap.fromTo(targets, 
          { y: config.distance || 24, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: config.duration || 0.6,
            ease: config.ease || "power2.out",
            stagger: config.stagger || 0.1
          }
        );
      },
      defaults: { duration: 0.6, distance: 24, ease: "power2.out" },
      extendTimeline: true
    });

    // Register fade in effect
    gsap.registerEffect({
      name: "fadeIn",
      effect: (targets, config) => {
        return gsap.fromTo(targets,
          { opacity: 0 },
          {
            opacity: 1,
            duration: config.duration || 0.4,
            ease: config.ease || "power2.out",
            stagger: config.stagger || 0.1
          }
        );
      },
      defaults: { duration: 0.4, ease: "power2.out" },
      extendTimeline: true
    });
  }

  /**
   * Create a ScrollTrigger animation
   */
  createScrollTrigger(element, options = {}) {
    if (!this.gsapLoaded || !this.scrollTriggerLoaded || this.reducedMotion) {
      return null;
    }

    const config = {
      ...this.config.scrollTrigger,
      ...options,
      trigger: element
    };

    return ScrollTrigger.create(config);
  }

  /**
   * Disable all animations
   */
  disableAnimations() {
    if (this.gsapLoaded) {
      gsap.globalTimeline.pause();
      ScrollTrigger.getAll().forEach(trigger => trigger.disable());
    }
    document.body.classList.add('reduced-motion');
  }

  /**
   * Enable animations
   */
  enableAnimations() {
    if (this.gsapLoaded && !this.reducedMotion) {
      gsap.globalTimeline.resume();
      ScrollTrigger.getAll().forEach(trigger => trigger.enable());
      document.body.classList.remove('reduced-motion');
    }
  }

  /**
   * Enable CSS fallbacks when GSAP is not available
   */
  enableCSSFallbacks() {
    document.body.classList.add('no-gsap');
    
    // Add CSS-only smooth scrolling
    document.documentElement.style.scrollBehavior = this.reducedMotion ? 'auto' : 'smooth';
    
    console.log('Using CSS fallbacks for animations');
  }

  /**
   * Refresh ScrollTrigger (useful after DOM changes)
   */
  refresh() {
    if (this.scrollTriggerLoaded) {
      ScrollTrigger.refresh();
    }
  }

  /**
   * Test ScrollSmoother functionality (for development/testing)
   */
  testScrollSmootherModes() {
    if (window.CONFIG && window.CONFIG.ENVIRONMENT === 'development') {
      console.group('🧪 GSAP ScrollSmoother Test Functions');
      console.log('Test ScrollSmoother disabled:');
      console.log('  window.Motion.setScrollSmoother(false)');
      console.log('Test ScrollSmoother enabled (requires license):');
      console.log('  window.Motion.setScrollSmoother(true)');
      console.groupEnd();
    }
  }

  /**
   * Dynamically enable/disable ScrollSmoother (for testing)
   */
  setScrollSmoother(enabled) {
    const wasEnabled = this.config.USE_SMOOTHER;
    this.config.USE_SMOOTHER = enabled;
    
    if (window.CONFIG && window.CONFIG.FEATURES) {
      window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER = enabled;
    }
    
    console.log(`ScrollSmoother ${enabled ? 'enabled' : 'disabled'} - reloading page...`);
    
    // Reload page to apply changes
    setTimeout(() => {
      location.reload();
    }, 1000);
  }

  /**
   * Get current motion system status
   */
  getStatus() {
    return {
      gsapLoaded: this.gsapLoaded,
      scrollTriggerLoaded: this.scrollTriggerLoaded,
      scrollSmootherLoaded: this.scrollSmootherLoaded,
      scrollSmootherEnabled: this.config.USE_SMOOTHER,
      reducedMotion: this.reducedMotion,
      fallbackMode: !this.gsapLoaded || this.reducedMotion
    };
  }

  /**
   * Destroy all animations and clean up
   */
  destroy() {
    if (this.scrollTriggerLoaded) {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    }
    if (this.gsapLoaded) {
      gsap.globalTimeline.clear();
    }
  }
}

// Create global instance
window.Motion = new Motion();

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.Motion.init().then(() => {
      window.Motion.testScrollSmootherModes();
    });
  });
} else {
  window.Motion.init().then(() => {
    window.Motion.testScrollSmootherModes();
  });
}