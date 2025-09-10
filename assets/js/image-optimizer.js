/**
 * Image Optimization Utility
 * Handles WebP/AVIF support detection, lazy loading, and fallbacks
 */

class ImageOptimizer {
  constructor() {
    this.supportsWebP = false;
    this.supportsAVIF = false;
    this.initialized = false;
    this.lazyImages = [];
    this.imageObserver = null;
  }

  /**
   * Initialize image optimization
   */
  async init() {
    if (this.initialized) return;

    try {
      await this.detectFormatSupport();
      this.setupLazyLoading();
      this.optimizeExistingImages();
      this.setupErrorHandling();

      this.initialized = true;
      console.log("Image optimizer initialized", {
        webp: this.supportsWebP,
        avif: this.supportsAVIF,
      });
    } catch (error) {
      console.error("Failed to initialize image optimizer:", error);
    }
  }

  /**
   * Detect WebP and AVIF support
   */
  async detectFormatSupport() {
    // Test WebP support
    this.supportsWebP = await this.testImageFormat(
      "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA"
    );

    // Test AVIF support
    this.supportsAVIF = await this.testImageFormat(
      "data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A="
    );

    // Add format support classes to body
    if (this.supportsWebP) {
      document.body.classList.add("webp-support");
    }
    if (this.supportsAVIF) {
      document.body.classList.add("avif-support");
    }
  }

  /**
   * Test image format support
   */
  testImageFormat(dataUri) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img.height === 2);
      img.onerror = () => resolve(false);
      img.src = dataUri;
    });
  }

  /**
   * Setup lazy loading for images
   */
  setupLazyLoading() {
    if ("IntersectionObserver" in window) {
      this.imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.loadImage(entry.target);
              this.imageObserver.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "50px 0px",
          threshold: 0.01,
        }
      );

      // Find images to lazy load
      this.findLazyImages();
    } else {
      // Fallback for browsers without IntersectionObserver
      this.loadAllImages();
    }
  }

  /**
   * Find images that should be lazy loaded
   */
  findLazyImages() {
    // Images with data-src attribute
    const dataSrcImages = document.querySelectorAll("img[data-src]");
    dataSrcImages.forEach((img) => {
      this.lazyImages.push(img);
      this.imageObserver.observe(img);
    });

    // Images without loading="lazy" that should be lazy loaded
    const autoLazyImages = document.querySelectorAll(
      'img:not([loading="lazy"]):not([data-src])'
    );
    autoLazyImages.forEach((img) => {
      // Skip images that are above the fold
      if (img.getBoundingClientRect().top > window.innerHeight) {
        img.dataset.src = img.src;
        img.src = this.generatePlaceholder(img.width, img.height);
        this.lazyImages.push(img);
        this.imageObserver.observe(img);
      }
    });
  }

  /**
   * Load a single image with format optimization
   */
  loadImage(img) {
    const originalSrc = img.dataset.src || img.src;

    // Try to load optimized format
    const optimizedSrc = this.getOptimizedSrc(originalSrc);

    if (optimizedSrc !== originalSrc) {
      // Test optimized format first
      const testImg = new Image();
      testImg.onload = () => {
        this.setImageSrc(img, optimizedSrc);
      };
      testImg.onerror = () => {
        this.setImageSrc(img, originalSrc);
      };
      testImg.src = optimizedSrc;
    } else {
      this.setImageSrc(img, originalSrc);
    }
  }

  /**
   * Set image source with fade-in effect
   */
  setImageSrc(img, src) {
    img.style.opacity = "0";
    img.style.transition = "opacity 0.3s ease-in-out";

    img.onload = () => {
      img.style.opacity = "1";
      img.classList.add("loaded");
    };

    img.onerror = () => {
      this.handleImageError(img);
    };

    img.src = src;

    // Remove data-src to prevent reloading
    if (img.dataset.src) {
      delete img.dataset.src;
    }
  }

  /**
   * Get optimized image source based on format support
   */
  getOptimizedSrc(originalSrc) {
    // Skip if already optimized or is SVG
    if (
      originalSrc.includes(".webp") ||
      originalSrc.includes(".avif") ||
      originalSrc.includes(".svg") ||
      originalSrc.startsWith("data:")
    ) {
      return originalSrc;
    }

    // Try AVIF first (better compression)
    if (this.supportsAVIF && this.hasFormat(originalSrc, "avif")) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".avif");
    }

    // Try WebP
    if (this.supportsWebP && this.hasFormat(originalSrc, "webp")) {
      return originalSrc.replace(/\.(jpg|jpeg|png)$/i, ".webp");
    }

    return originalSrc;
  }

  /**
   * Check if optimized format exists (simplified check)
   */
  hasFormat(src, format) {
    // In a real implementation, you might check if the file exists
    // For now, assume optimized formats exist for common image types
    return /\.(jpg|jpeg|png)$/i.test(src);
  }

  /**
   * Generate placeholder image
   */
  generatePlaceholder(width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = width || 400;
    canvas.height = height || 300;

    // Create gradient placeholder
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#1C2430");
    gradient.addColorStop(1, "#0F141B");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add loading text
    ctx.fillStyle = "#9AA3B2";
    ctx.font = "16px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL("image/png");
  }

  /**
   * Handle image loading errors
   */
  handleImageError(img) {
    console.warn("Image failed to load:", img.src);

    // Simply hide the image instead of trying fallbacks
    img.style.display = "none";
    img.classList.add("image-failed");

    // Show fallback content if available (like initials)
    const fallbackElement = img.nextElementSibling;
    if (fallbackElement && (fallbackElement.classList.contains('team-initials') || fallbackElement.classList.contains('team-avatar'))) {
      fallbackElement.style.display = 'flex';
    }
  }

  /**
   * Optimize existing images on the page
   */
  optimizeExistingImages() {
    const images = document.querySelectorAll("img");

    images.forEach((img) => {
      // Add error handling
      if (!img.onerror) {
        img.onerror = () => this.handleImageError(img);
      }

      // Add loading class for styling
      img.classList.add("optimized-image");

      // Set proper aspect ratio if dimensions are known
      if (img.width && img.height) {
        img.style.aspectRatio = `${img.width} / ${img.height}`;
      }
    });
  }

  /**
   * Setup global image error handling
   */
  setupErrorHandling() {
    // Handle images that fail to load
    document.addEventListener(
      "error",
      (e) => {
        if (e.target.tagName === "IMG") {
          this.handleImageError(e.target);
        }
      },
      true
    );
  }

  /**
   * Load all images immediately (fallback)
   */
  loadAllImages() {
    const lazyImages = document.querySelectorAll("img[data-src]");
    lazyImages.forEach((img) => {
      this.loadImage(img);
    });
  }

  /**
   * Preload critical images
   */
  preloadCriticalImages(urls) {
    urls.forEach((url) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = this.getOptimizedSrc(url);
      document.head.appendChild(link);
    });
  }

  /**
   * Get performance metrics
   */
  getMetrics() {
    return {
      totalImages: document.querySelectorAll("img").length,
      lazyImages: this.lazyImages.length,
      loadedImages: document.querySelectorAll("img.loaded").length,
      formatSupport: {
        webp: this.supportsWebP,
        avif: this.supportsAVIF,
      },
    };
  }
}

// Create global instance
window.ImageOptimizer = new ImageOptimizer();

// Auto-initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    window.ImageOptimizer.init();
  });
} else {
  window.ImageOptimizer.init();
}
