# Website Testing Guide

## 🚀 Quick Start Testing

### 1. Local Development Server
The fastest way to test your website:

```bash
# Method 1: Python (recommended)
python3 -m http.server 8080
# Then visit: http://localhost:8080

# Method 2: Python 2 (if you have it)
python -m SimpleHTTPServer 8080

# Method 3: Node.js
npx serve . -p 8080

# Method 4: PHP
php -S localhost:8080
```

### 2. Basic Functionality Test
Once your server is running, test these core features:

- ✅ **Navigation**: Click all menu items (Home, About, Projects, Contact)
- ✅ **Language Switcher**: Toggle between English and Lao
- ✅ **Mobile Menu**: Resize browser to mobile, test hamburger menu
- ✅ **Contact Links**: Test phone and email links
- ✅ **Project Links**: Test "View Projects" buttons
- ✅ **Animations**: Scroll to see GSAP animations

---

## 🔍 Comprehensive Testing Levels

### Level 1: Visual Testing (5 minutes)
**What to check:**
- All pages load without errors
- Text is readable and properly formatted
- Images display correctly
- Layout looks good on desktop and mobile
- Animations work smoothly

**How to test:**
```bash
# Start local server
python3 -m http.server 8080

# Test these URLs:
# http://localhost:8080/
# http://localhost:8080/about.html
# http://localhost:8080/projects.html
# http://localhost:8080/contact.html
# http://localhost:8080/404.html
```

### Level 2: Functional Testing (15 minutes)
**What to check:**
- All interactive elements work
- Forms submit correctly (if any)
- Language switching works
- Mobile navigation works
- Links go to correct destinations

**Testing checklist:**
- [ ] Click every navigation link
- [ ] Test language switcher (EN ↔ Lao)
- [ ] Resize browser to mobile (375px width)
- [ ] Test hamburger menu on mobile
- [ ] Click all CTA buttons
- [ ] Test contact links (tel:, mailto:)
- [ ] Test project filtering/expansion
- [ ] Test 404 page (visit /nonexistent-page)

### Level 3: Performance Testing (10 minutes)
**What to check:**
- Page load speed
- Image optimization
- JavaScript performance
- Mobile performance

**Tools to use:**
1. **Chrome DevTools**:
   - Press F12 → Network tab
   - Reload page, check load times
   - Throttle to "Slow 3G" for mobile testing

2. **Lighthouse Audit**:
   - Press F12 → Lighthouse tab
   - Run audit for Performance, Accessibility, SEO
   - Target scores: Performance ≥90, Accessibility ≥95, SEO ≥90

### Level 4: Accessibility Testing (10 minutes)
**What to check:**
- Keyboard navigation
- Screen reader compatibility
- Color contrast
- ARIA labels

**How to test:**
1. **Keyboard Navigation**:
   ```
   - Press Tab to navigate through all interactive elements
   - Press Enter/Space to activate buttons/links
   - Press Escape to close modals/menus
   - Ensure focus indicators are visible
   ```

2. **Screen Reader Simulation**:
   - Install browser extension like "Screen Reader" or "ChromeVox"
   - Navigate with screen reader active
   - Check that all content is announced properly

### Level 5: Cross-Browser Testing (20 minutes)
**Browsers to test:**
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

**What to check in each browser:**
- Layout consistency
- Animation performance
- Font rendering
- JavaScript functionality

---

## 🛠️ Automated Testing Tools

### 1. HTML Validation
```bash
# Install html5validator
pip install html5validator

# Validate all HTML files
html5validator --root . --also-check-css
```

### 2. Lighthouse CI (Command Line)
```bash
# Install Lighthouse CI
npm install -g @lhci/cli

# Run Lighthouse audit
lhci autorun --upload.target=temporary-public-storage
```

### 3. Pa11y (Accessibility Testing)
```bash
# Install Pa11y
npm install -g pa11y

# Test accessibility
pa11y http://localhost:8080
pa11y http://localhost:8080/about.html
pa11y http://localhost:8080/projects.html
pa11y http://localhost:8080/contact.html
```

---

## 📱 Mobile Testing

### 1. Browser DevTools
- Press F12 → Toggle device toolbar
- Test these device sizes:
  - iPhone SE (375×667)
  - iPhone 12 Pro (390×844)
  - iPad (768×1024)
  - Desktop (1920×1080)

### 2. Real Device Testing
**iOS Testing:**
- Connect iPhone to Mac
- Safari → Develop → [Your iPhone] → localhost:8080

**Android Testing:**
- Enable USB Debugging
- Chrome → chrome://inspect → localhost:8080

### 3. Responsive Design Checklist
- [ ] Navigation collapses to hamburger menu
- [ ] Text remains readable (not too small)
- [ ] Buttons are large enough for touch (44px minimum)
- [ ] Images scale properly
- [ ] No horizontal scrolling
- [ ] Content stacks vertically on mobile

---

## 🔧 Performance Testing Tools

### 1. Chrome DevTools Performance
```
1. Press F12 → Performance tab
2. Click Record
3. Navigate through your site
4. Stop recording
5. Analyze timeline for bottlenecks
```

### 2. Network Analysis
```
1. Press F12 → Network tab
2. Reload page
3. Check:
   - Total load time
   - Largest files
   - Failed requests
   - Waterfall chart
```

### 3. Core Web Vitals
Monitor these metrics:
- **LCP (Largest Contentful Paint)**: <2.5s
- **FID (First Input Delay)**: <100ms
- **CLS (Cumulative Layout Shift)**: <0.1

---

## 🐛 Common Issues to Test For

### 1. JavaScript Errors
**Check browser console:**
- Press F12 → Console tab
- Look for red error messages
- Test with JavaScript disabled

### 2. Missing Resources
**Check for 404 errors:**
- Images not loading
- CSS files missing
- JavaScript files missing
- Font loading failures

### 3. Layout Issues
**Common problems:**
- Text overflow
- Images not responsive
- Broken grid layouts
- Overlapping elements

### 4. Performance Issues
**Watch for:**
- Slow page load (>3 seconds)
- Janky animations
- Large image files (>200KB)
- Too many HTTP requests

---

## 📊 Testing Checklist

### Pre-Deployment Testing
- [ ] All pages load without errors
- [ ] Navigation works correctly
- [ ] Language switcher functions
- [ ] Mobile responsive design works
- [ ] Images load and display properly
- [ ] Animations work smoothly
- [ ] Contact links work (tel:, mailto:)
- [ ] No console errors
- [ ] HTML validates
- [ ] Lighthouse scores meet targets

### Post-Deployment Testing
- [ ] Live site loads correctly
- [ ] All pages accessible via direct URLs
- [ ] 404 page works for invalid URLs
- [ ] HTTPS enabled and working
- [ ] Custom domain works (if configured)
- [ ] Search engines can crawl site
- [ ] Social media previews work

---

## 🎯 Quick Testing Commands

### Start Testing Environment
```bash
# 1. Start local server
python3 -m http.server 8080

# 2. Open in browser
open http://localhost:8080

# 3. Test mobile view
# Resize browser to 375px width or use DevTools device mode
```

### Run Automated Tests
```bash
# HTML validation
html5validator --root .

# Accessibility testing
pa11y http://localhost:8080

# Performance testing
lighthouse http://localhost:8080 --view
```

### Test Different Scenarios
```bash
# Test with slow connection
# Chrome DevTools → Network → Throttling → Slow 3G

# Test with JavaScript disabled
# Chrome DevTools → Settings → Debugger → Disable JavaScript

# Test with reduced motion
# Chrome DevTools → Rendering → Emulate CSS prefers-reduced-motion
```

---

## 🚀 Production Testing

### After Deploying to GitHub Pages
1. **Test live URL**: https://yourusername.github.io/repo-name
2. **Test all pages** on the live site
3. **Run Lighthouse** on the live site
4. **Test from different locations** (use VPN or ask friends)
5. **Test on real mobile devices**

### Monitoring Tools
- **Google PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/
- **Google Search Console**: Monitor SEO performance

---

## 🎉 Testing Success Criteria

Your website passes testing if:
- ✅ **Performance**: Lighthouse Performance ≥90
- ✅ **Accessibility**: Lighthouse Accessibility ≥95
- ✅ **SEO**: Lighthouse SEO ≥90
- ✅ **Functionality**: All features work as expected
- ✅ **Responsive**: Works on all device sizes
- ✅ **Cross-browser**: Works in all major browsers
- ✅ **No Errors**: Clean console, no 404s
- ✅ **Fast Loading**: <3 seconds on 3G connection