# Design Document

## Overview

The Construction Consulting Website is a professional, bilingual (English/Lao) static website designed to showcase a construction consulting company's expertise, services, and project portfolio. The design follows a minimalist, corporate aesthetic inspired by Palantir.com, emphasizing high contrast, generous whitespace, and restrained motion.

The website will be built using vanilla HTML5, CSS3, and JavaScript with GSAP for animations, optimized for GitHub Pages hosting. The architecture prioritizes performance, accessibility, and maintainability while providing a smooth, engaging user experience across all devices.

## Architecture

### Technology Stack
- **Frontend**: Pure HTML5, CSS3, Vanilla JavaScript
- **Animation Library**: GSAP (Core + ScrollTrigger + optional ScrollSmoother)
- **Fonts**: Google Fonts (Inter for Latin, Noto Sans Lao for Lao script)
- **Hosting**: GitHub Pages with automated deployment
- **Build Process**: No build tools - direct file serving for simplicity

### File Structure
```
/
├── index.html
├── about.html
├── projects.html
├── contact.html
├── 404.html
├── robots.txt
├── sitemap.xml
├── .nojekyll
├── assets/
│   ├── css/
│   │   ├── tokens.css
│   │   └── main.css
│   ├── js/
│   │   ├── shell.js
│   │   ├── i18n.js
│   │   ├── motion.js
│   │   └── main.js
│   ├── img/
│   ├── icons/
│   └── data/
│       └── projects.json
├── assets/i18n/
│   ├── en.json
│   └── lo.json
└── .github/
    └── workflows/
        └── deploy.yml
```

### Performance Architecture
- **JavaScript Budget**: <150KB gzipped total
- **CSS Budget**: <120KB gzipped total
- **Image Optimization**: WebP/AVIF with lazy loading
- **Font Loading**: Preload critical fonts with font-display: swap
- **Critical Path**: Inline critical CSS, defer non-critical JavaScript

## Components and Interfaces

### Core JavaScript Modules

#### 1. Shell Module (`shell.js`)
Manages shared page elements and navigation:
```javascript
// API Interface
Shell.init()
Shell.setActivePage(path)
Shell.injectHeader()
Shell.injectFooter()
Shell.handleNavigation()
```

**Responsibilities:**
- Inject consistent header/footer across pages
- Manage active navigation states
- Handle mobile menu toggle
- Provide skip-to-content functionality
- Smooth anchor scrolling

#### 2. Internationalization Module (`i18n.js`)
Handles bilingual content management:
```javascript
// API Interface
i18n.init(defaultLang = 'en')
i18n.set(language)
i18n.t(key, fallback = '[MISSING]')
i18n.getCurrentLang()
```

**Responsibilities:**
- Load and cache translation dictionaries
- Persist language preference in localStorage
- Update DOM elements with `data-i18n` attributes
- Update HTML lang attribute and meta tags
- Handle missing translation keys gracefully

#### 3. Motion Module (`motion.js`)
Manages GSAP animations and scroll effects:
```javascript
// API Interface
Motion.init()
Motion.createScrollTrigger(element, options)
Motion.enableSmoothScroll()
Motion.respectReducedMotion()
Motion.registerEffects()
```

**Responsibilities:**
- Initialize GSAP plugins (ScrollTrigger, optional ScrollSmoother)
- Provide reusable animation effects (.reveal-up, .parallax-y, .counter)
- Handle prefers-reduced-motion preferences
- Manage ScrollSmoother fallback for non-Club members

#### 4. Main Application Module (`main.js`)
Coordinates all modules and page-specific functionality:
```javascript
// API Interface
App.init()
App.loadPageContent()
App.handleContactActions()
App.manageProjectFiltering()
```

### CSS Architecture

#### Design Tokens (`tokens.css`)
Centralized design system using CSS custom properties:
```css
:root {
  /* Colors */
  --bg: #0E1116;
  --bg-alt: #11161d;
  --text: #E6EAF2;
  --muted: #9AA3B2;
  --accent: #4DA3FF;
  --line: #1C2430;
  --card: #0F141B;
  
  /* Spacing Scale */
  --space-xs: 0.25rem;  /* 4px */
  --space-sm: 0.5rem;   /* 8px */
  --space-md: 0.75rem;  /* 12px */
  --space-lg: 1rem;     /* 16px */
  --space-xl: 1.5rem;   /* 24px */
  --space-2xl: 2rem;    /* 32px */
  --space-3xl: 3rem;    /* 48px */
  --space-4xl: 4rem;    /* 64px */
  
  /* Typography */
  --font-latin: 'Inter', sans-serif;
  --font-lao: 'Noto Sans Lao', sans-serif;
  --font-size-base: 1rem;
  --line-height-base: 1.6;
  
  /* Layout */
  --container-xl: 1200px;
  --container-lg: 960px;
  --radius: 8px;
  --radius-pill: 999px;
}
```

#### Component System
- **Section Pattern**: Consistent spacing and container structure
- **Card Component**: Reusable project and service cards
- **Button System**: Primary, secondary, and icon button variants
- **Navigation**: Responsive header with mobile hamburger menu
- **Form Elements**: Accessible, styled form controls

### Data Interfaces

#### Projects Data Structure (`projects.json`)
```json
{
  "projects": [
    {
      "slug": "project-identifier",
      "title": "Project Title",
      "status": "ongoing|completed",
      "location": "City, Country",
      "scope": "Brief project scope",
      "year": "2024",
      "cover": "/assets/img/projects/cover.jpg",
      "gallery": [
        "/assets/img/projects/img1.jpg",
        "/assets/img/projects/img2.jpg"
      ],
      "summary_i18n_key": "projects.project_slug.summary"
    }
  ]
}
```

#### Translation Structure (`en.json`, `lo.json`)
```json
{
  "nav": {
    "home": "Home",
    "about": "About Us",
    "projects": "Projects",
    "contact": "Contact"
  },
  "hero": {
    "title": "Professional Construction Consulting",
    "subtitle": "Expert guidance for your construction projects",
    "cta": "View Our Projects"
  },
  "services": {
    "heading": "Our Services",
    "items": [
      {
        "title": "Feasibility Studies",
        "description": "Comprehensive project analysis"
      }
    ]
  }
}
```

## Data Models

### Page State Model
```javascript
class PageState {
  constructor() {
    this.currentLanguage = 'en';
    this.currentPage = '';
    this.isMenuOpen = false;
    this.scrollPosition = 0;
    this.reducedMotion = false;
  }
}
```

### Project Model
```javascript
class Project {
  constructor(data) {
    this.slug = data.slug;
    this.title = data.title;
    this.status = data.status; // 'ongoing' | 'completed'
    this.location = data.location;
    this.scope = data.scope;
    this.year = data.year;
    this.cover = data.cover;
    this.gallery = data.gallery || [];
    this.summaryKey = data.summary_i18n_key;
  }
  
  getTranslatedSummary(i18n) {
    return i18n.t(this.summaryKey);
  }
}
```

### Animation Configuration Model
```javascript
class AnimationConfig {
  constructor() {
    this.scrollSmoother = {
      enabled: false, // Feature flag for Club GreenSock
      smooth: 1,
      effects: true,
      smoothTouch: 0.1
    };
    
    this.scrollTrigger = {
      defaults: {
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    };
    
    this.effects = {
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
    };
  }
}
```

## Error Handling

### JavaScript Error Management
```javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // Graceful degradation - continue without animations if GSAP fails
  if (event.error.message.includes('gsap')) {
    document.body.classList.add('no-animations');
  }
});

// Promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  // Continue execution for non-critical failures
  event.preventDefault();
});
```

### Fallback Strategies
1. **GSAP Loading Failure**: Disable animations, use CSS transitions
2. **Font Loading Failure**: Fallback to system fonts
3. **Image Loading Failure**: Show placeholder with retry option
4. **Translation Loading Failure**: Display keys with [MISSING] prefix
5. **ScrollSmoother Unavailable**: Use native smooth scrolling + ScrollTrigger

### Network Error Handling
```javascript
// Fetch with retry logic
async function fetchWithRetry(url, options = {}, retries = 3) {
  try {
    const response = await fetch(url, options);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response;
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw error;
  }
}
```

## Testing Strategy

### Performance Testing
1. **Lighthouse Audits**: Target scores ≥90 Performance, ≥90 SEO, ≥95 Accessibility
2. **Bundle Analysis**: Monitor JavaScript and CSS bundle sizes
3. **Core Web Vitals**: LCP <2.5s, FID <100ms, CLS <0.1
4. **Network Throttling**: Test on 3G connections

### Accessibility Testing
1. **Automated Testing**: axe-core integration for CI/CD
2. **Keyboard Navigation**: Tab order, focus management, skip links
3. **Screen Reader Testing**: NVDA, JAWS, VoiceOver compatibility
4. **Color Contrast**: Automated and manual verification (≥4.5:1 ratio)
5. **Reduced Motion**: Test animation disable functionality

### Cross-Browser Testing
- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile Browsers**: iOS Safari, Chrome Mobile, Samsung Internet
- **Feature Detection**: Graceful degradation for older browsers

### Internationalization Testing
1. **Character Encoding**: UTF-8 support for Lao script
2. **Text Expansion**: Layout stability with longer translations
3. **RTL Support**: Future-proofing for potential RTL languages
4. **Font Rendering**: Lao script display across different devices

### Animation Testing
```javascript
// Test suite for motion system
describe('Motion System', () => {
  test('respects prefers-reduced-motion', () => {
    // Mock reduced motion preference
    // Verify animations are disabled
  });
  
  test('falls back gracefully without GSAP', () => {
    // Mock GSAP loading failure
    // Verify CSS transitions are used
  });
  
  test('ScrollSmoother feature flag works', () => {
    // Test with and without ScrollSmoother
    // Verify fallback behavior
  });
});
```

### Deployment Testing
1. **GitHub Pages Compatibility**: Test with Jekyll processing disabled
2. **Custom Domain**: CNAME configuration and HTTPS
3. **404 Handling**: Custom 404 page functionality
4. **Deep Linking**: Project hash URLs work correctly

## Security Considerations

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self';
">
```

### External Dependencies
- **GSAP CDN**: Use integrity hashes for script tags
- **Google Fonts**: Preconnect to reduce DNS lookup time
- **Social Links**: Use `rel="noopener"` for external links

### Data Privacy
- **No Analytics**: No tracking scripts to maintain privacy
- **Local Storage**: Only store language preference (non-sensitive)
- **No Cookies**: Avoid cookie consent requirements

## Responsive Design Strategy

### Breakpoint System
```css
/* Mobile First Approach */
@media (min-width: 480px) { /* Small tablets */ }
@media (min-width: 768px) { /* Tablets */ }
@media (min-width: 1024px) { /* Desktop */ }
@media (min-width: 1200px) { /* Large desktop */ }
```

### Navigation Adaptation
- **Desktop**: Horizontal navigation with language switcher
- **Tablet**: Condensed navigation, maintained horizontal layout
- **Mobile**: Hamburger menu with full-screen overlay

### Typography Scaling
```css
/* Fluid typography using clamp() */
h1 { font-size: clamp(2rem, 4vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); }
body { font-size: clamp(1rem, 2vw, 1.125rem); }
```

### Image Strategy
- **Responsive Images**: `srcset` and `sizes` attributes
- **Art Direction**: Different crops for mobile vs desktop
- **Lazy Loading**: Native `loading="lazy"` attribute
- **Format Selection**: WebP with JPEG fallback

## SEO and Meta Strategy

### Structured Data
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Construction Consulting Company",
  "url": "https://example.com",
  "logo": "https://example.com/assets/img/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+856-XX-XXX-XXX",
    "contactType": "customer service"
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "LA"
  }
}
```

### Meta Tag Strategy
```html
<!-- Per-page meta tags -->
<title data-i18n="meta.title">Construction Consulting</title>
<meta name="description" data-i18n="meta.description" content="">
<meta property="og:title" data-i18n="meta.og_title" content="">
<meta property="og:description" data-i18n="meta.og_description" content="">
<meta property="og:locale" content="en_US">
<link rel="alternate" hreflang="en" href="https://example.com/page">
<link rel="alternate" hreflang="lo" href="https://example.com/page">
```

### Sitemap Generation
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <url>
    <loc>https://example.com/</loc>
    <xhtml:link rel="alternate" hreflang="en" href="https://example.com/"/>
    <xhtml:link rel="alternate" hreflang="lo" href="https://example.com/"/>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```