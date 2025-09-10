# Construction Consulting Website

A professional bilingual (English/Lao) construction consulting website built with vanilla HTML5, CSS3, and JavaScript with GSAP animations. Optimized for GitHub Pages hosting.

## 🚀 Features

- **Bilingual Support**: Seamless English ↔ Lao language switching with localStorage persistence
- **Responsive Design**: Mobile-first approach with fluid typography and layouts
- **Smooth Animations**: GSAP-powered scroll animations with ScrollTrigger
- **Performance Optimized**: <150KB JS, <120KB CSS budgets with lazy loading
- **Accessibility Compliant**: WCAG 2.2 AA standards with keyboard navigation
- **SEO Optimized**: Structured data, meta tags, and hreflang support
- **GitHub Pages Ready**: Automated deployment with GitHub Actions

## 📁 Project Structure

```
/
├── index.html              # Home page
├── about.html              # About us page
├── projects.html           # Projects showcase
├── contact.html            # Contact information
├── 404.html               # Custom 404 page
├── robots.txt             # Search engine directives
├── sitemap.xml            # Site structure for SEO
├── .nojekyll              # GitHub Pages configuration
├── assets/
│   ├── css/
│   │   ├── tokens.css     # Design system variables
│   │   └── main.css       # Main stylesheet
│   ├── js/
│   │   ├── shell.js       # Navigation & layout
│   │   ├── i18n.js        # Internationalization
│   │   ├── motion.js      # GSAP animations
│   │   └── main.js        # Main application
│   ├── img/               # Images and graphics
│   ├── icons/             # SVG icons
│   ├── data/              # JSON data files
│   └── i18n/              # Translation files
│       ├── en.json        # English translations
│       └── lo.json        # Lao translations
└── .github/
    └── workflows/
        └── deploy.yml     # GitHub Actions deployment
```

## 🛠️ Setup & Development

### Prerequisites

- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
- Text editor or IDE
- Git for version control
- GitHub account for hosting

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/construction-consulting-website.git
   cd construction-consulting-website
   ```

2. **Serve locally**

   Using Python (recommended):

   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000
   ```

   Using Node.js:

   ```bash
   npx serve .
   ```

   Using PHP:

   ```bash
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

### Content Management

#### Adding Translations

1. Edit `assets/i18n/en.json` for English content
2. Edit `assets/i18n/lo.json` for Lao content
3. Use nested keys for organization:
   ```json
   {
     "nav": {
       "home": "Home",
       "about": "About Us"
     }
   }
   ```

#### Adding Projects

1. Edit `assets/data/projects.json`
2. Add project objects with required fields:
   ```json
   {
     "slug": "project-identifier",
     "title": "Project Title",
     "status": "ongoing|completed",
     "location": "City, Country",
     "scope": "Brief description",
     "year": "2024",
     "cover": "/assets/img/projects/cover.jpg",
     "gallery": ["img1.jpg", "img2.jpg"],
     "summary_i18n_key": "projects.project_slug.summary"
   }
   ```

#### Adding Images

1. Place images in `assets/img/`
2. Use WebP format with JPEG fallback for best performance
3. Include width/height attributes to prevent layout shift
4. Add descriptive alt text for accessibility

## 🚀 Deployment

### GitHub Actions Workflow (Automatic)

This project includes an automated deployment workflow that:

- Triggers on pushes to the `main` branch
- Minifies CSS and JavaScript files
- Validates HTML structure
- Deploys to GitHub Pages automatically

#### Setup GitHub Pages with Actions

1. **Enable GitHub Pages**

   - Go to repository Settings → Pages
   - Source: **GitHub Actions** (not "Deploy from a branch")
   - The workflow will handle deployment automatically

2. **Configure repository permissions**

   - Go to Settings → Actions → General
   - Under "Workflow permissions", select "Read and write permissions"
   - Check "Allow GitHub Actions to create and approve pull requests"

3. **Push changes to trigger deployment**

   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```

4. **Monitor deployment**

   - Go to Actions tab to see workflow progress
   - Deployment typically takes 2-3 minutes
   - Green checkmark indicates successful deployment

5. **Access your site**
   ```
   https://yourusername.github.io/repository-name
   ```

#### Manual Deployment Trigger

You can also trigger deployment manually:

- Go to Actions tab → "Deploy to GitHub Pages"
- Click "Run workflow" → "Run workflow"

### Custom Domain Setup

#### Step 1: Add CNAME File

```bash
echo "yourdomain.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

#### Step 2: Configure DNS Records

**For Apex Domain (example.com):**

```
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153
```

**For WWW Subdomain (www.example.com):**

```
Type: CNAME
Name: www
Value: yourusername.github.io
```

#### Step 3: Enable HTTPS in GitHub

1. Go to repository Settings → Pages
2. Check "Enforce HTTPS" (may take 24-48 hours to be available)
3. GitHub will automatically provision SSL certificate

#### Step 4: Update Site Configuration

1. **Update sitemap.xml**

   ```xml
   <!-- Replace all instances of https://example.com -->
   <loc>https://yourdomain.com/</loc>
   ```

2. **Update meta tags** (if using absolute URLs)

   ```html
   <meta property="og:url" content="https://yourdomain.com/" />
   <link rel="canonical" href="https://yourdomain.com/" />
   ```

3. **Test custom domain**
   - Wait for DNS propagation (up to 48 hours)
   - Test both apex and www versions
   - Verify HTTPS redirect works

#### Testing Deployment Workflow

**Before first deployment:**

1. **Run deployment readiness test:**

   ```bash
   ./test-deployment.sh
   ```

   This script checks:

   - All required files exist
   - HTML syntax validation (if html5validator installed)
   - Asset files are present
   - Translation JSON files are valid
   - GitHub Actions workflow syntax
   - Common deployment issues

2. **Test locally first:**

   ```bash
   python3 -m http.server 8000
   # Visit http://localhost:8000 and test all pages
   ```

3. **Optional: Install HTML validator:**
   ```bash
   pip install html5validator
   # Then re-run ./test-deployment.sh for HTML validation
   ```

**After deployment:**

1. **Check Actions tab** for workflow status
2. **Test all pages** at your GitHub Pages URL
3. **Verify 404 handling**:
   - Visit `https://yourusername.github.io/repository-name/nonexistent`
   - Should show custom 404 page
   - Test project deep-links: `#project-example`
4. **Test minified files** are being served
5. **Run Lighthouse audit** on deployed site

#### Troubleshooting Deployment

**Workflow fails:**

- Check Actions tab for error details
- Verify file permissions and syntax
- Ensure all required files exist
- Check for HTML validation errors

**Site not updating:**

- Clear browser cache (Ctrl+F5 or Cmd+Shift+R)
- Check if workflow completed successfully
- Verify changes were pushed to main branch
- Wait 5-10 minutes for CDN propagation

**Minified files not working:**

- Check console for JavaScript errors
- Verify original files have valid syntax
- Test with unminified versions locally

#### Troubleshooting Custom Domains

**Domain not working:**

- Check DNS propagation: `dig yourdomain.com`
- Verify CNAME file exists in repository root
- Ensure DNS records point to correct GitHub IPs

**HTTPS not available:**

- Wait 24-48 hours after adding custom domain
- Remove and re-add custom domain in GitHub settings
- Check that DNS is properly configured

**404 errors on deep links:**

- Verify 404.html exists and is properly configured
- Test direct URLs like `yourdomain.com/about.html`
- Check that all internal links use correct paths
- Test project deep-links: `yourdomain.com/projects.html#project-example`

## 🎨 Customization

### Design Tokens

Edit `assets/css/tokens.css` to customize:

- **Colors**: Brand colors, backgrounds, text
- **Typography**: Font families, sizes, weights
- **Spacing**: Consistent spacing scale
- **Layout**: Container widths, breakpoints

### Animations

Modify `assets/js/motion.js` to:

- Add new GSAP effects
- Adjust animation timings
- Configure ScrollTrigger settings
- Enable/disable ScrollSmoother

### Performance Budgets

Current targets:

- JavaScript: <150KB gzipped
- CSS: <120KB gzipped
- Images: <200KB each
- Lighthouse Performance: ≥90

## 🔧 GSAP Licensing & Setup

This project uses GSAP (GreenSock Animation Platform) with careful attention to licensing requirements.

### Current GSAP Usage

**FREE PLUGINS (Included by default):**
- ✅ **GSAP Core**: Free for commercial use
- ✅ **ScrollTrigger**: Free for commercial use

**CLUB GREENSOCK PLUGINS (Requires paid membership):**
- ⚠️ **ScrollSmoother**: Requires Club GreenSock membership ($99+/year)

### ScrollSmoother Configuration

**Default Configuration (FREE):**
```javascript
// In assets/js/config.js
FEATURES: {
  GSAP_SCROLL_SMOOTHER: false  // Uses free plugins only
}
```

**With Club GreenSock License:**
```javascript
// In assets/js/config.js
FEATURES: {
  GSAP_SCROLL_SMOOTHER: true   // Enables ScrollSmoother
}
```

### Enabling ScrollSmoother (Club Members Only)

1. **Purchase Club GreenSock membership**:
   - Visit: https://greensock.com/club/
   - Choose appropriate plan ($99+ per year)

2. **Download ScrollSmoother**:
   - Log into your Club GreenSock account
   - Download ScrollSmoother plugin files
   - Add to your project

3. **Include ScrollSmoother in HTML**:
   ```html
   <!-- Add after ScrollTrigger -->
   <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
   <script src="/assets/js/ScrollSmoother.min.js"></script>
   ```

4. **Enable in configuration**:
   ```javascript
   // In assets/js/config.js
   FEATURES: {
     GSAP_SCROLL_SMOOTHER: true
   }
   ```

### Fallback System

The site works perfectly without ScrollSmoother:

- **With ScrollSmoother**: Ultra-smooth scrolling with advanced effects
- **Without ScrollSmoother**: Native smooth scrolling + ScrollTrigger animations

### Testing Both Modes

**Test ScrollSmoother disabled (default):**
```javascript
// In browser console
window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER = false;
location.reload();
```

**Test ScrollSmoother enabled (if licensed):**
```javascript
// In browser console
window.CONFIG.FEATURES.GSAP_SCROLL_SMOOTHER = true;
location.reload();
```

### Licensing Compliance

- ✅ **Free plugins**: No license required for commercial use
- ⚠️ **ScrollSmoother**: Must purchase license before enabling
- 📄 **License verification**: Check console logs for licensing status

**Console Output Examples:**
```
✅ Using free GSAP plugins only (Core + ScrollTrigger)
⚠️ ScrollSmoother enabled - requires Club GreenSock license
```

### Important Legal Notes

1. **Do not enable ScrollSmoother without a valid license**
2. **Club GreenSock licenses are per-developer, not per-project**
3. **Licenses include updates and support for 1 year**
4. **Commercial projects require appropriate licensing**

For complete licensing information: https://greensock.com/licensing/

### Testing GSAP Licensing Compliance

A test page is included to verify both modes work correctly:

```bash
# Serve the site locally
python3 -m http.server 8000

# Open test page
open http://localhost:8000/test-gsap-licensing.html
```

**Test Page Features:**
- ✅ Visual status indicators for each GSAP plugin
- 🧪 Buttons to test both free and licensed modes
- 📊 Real-time console output display
- 🎯 Animation test elements (reveal, parallax, counter)
- 📋 Complete licensing information and links

**Console Commands for Testing:**
```javascript
// Check current status
window.Motion.getStatus()

// Test free mode (ScrollSmoother disabled)
window.Motion.setScrollSmoother(false)

// Test licensed mode (ScrollSmoother enabled - requires license)
window.Motion.setScrollSmoother(true)
```

**Expected Console Output:**

*Free Mode (Default):*
```
✅ Using free GSAP plugins only (Core + ScrollTrigger)
✅ ScrollSmoother loaded successfully (Club GreenSock license active)
🔄 ScrollSmoother requested but not available - using native smooth scroll
```

*Licensed Mode (with ScrollSmoother):*
```
⚠️ ScrollSmoother enabled - requires Club GreenSock license
📄 License info: https://greensock.com/licensing/
✅ ScrollSmoother loaded successfully (Club GreenSock license active)
✅ ScrollSmoother active (Club GreenSock license)
```

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- iOS Safari 14+
- Chrome Mobile 90+

## ♿ Accessibility

- WCAG 2.2 AA compliant
- Keyboard navigation support
- Screen reader compatible
- Color contrast ≥4.5:1
- Reduced motion support
- Semantic HTML structure

## 🔍 SEO Features

- Unique meta titles/descriptions
- Open Graph tags
- Twitter Card support
- JSON-LD structured data
- Hreflang for multilingual SEO
- XML sitemap
- Robots.txt

## ✅ Deployment Verification Checklist

After deploying to GitHub Pages, verify these items:

### Functional Testing

- [ ] All pages load correctly (index, about, projects, contact)
- [ ] Navigation works between all pages
- [ ] Language switcher functions properly
- [ ] Project filtering and expansion works
- [ ] Contact links open correct applications
- [ ] 404 page displays for invalid URLs
- [ ] Deep-links work (e.g., `/projects.html#project-example`)

### Performance Testing

- [ ] Lighthouse Performance score ≥90
- [ ] Lighthouse SEO score ≥90
- [ ] Lighthouse Accessibility score ≥95
- [ ] Page load time <3 seconds on 3G
- [ ] Images load with lazy loading
- [ ] Animations respect reduced motion preferences

### SEO & Meta Testing

- [ ] Unique titles on each page
- [ ] Meta descriptions present
- [ ] Open Graph tags work (test with Facebook debugger)
- [ ] Structured data validates (Google Rich Results Test)
- [ ] Sitemap.xml accessible at `/sitemap.xml`
- [ ] Robots.txt accessible at `/robots.txt`

### Accessibility Testing

- [ ] Keyboard navigation works throughout site
- [ ] Focus indicators visible on all interactive elements
- [ ] Screen reader compatibility (test with browser extensions)
- [ ] Color contrast meets WCAG AA standards
- [ ] Alt text present on all images

### Cross-Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

## 📊 Performance Monitoring

Use these tools to monitor performance:

- **Lighthouse**: Built into Chrome DevTools
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **GTmetrix**: https://gtmetrix.com/
- **WebPageTest**: https://www.webpagetest.org/

## 🐛 Troubleshooting

### Common Issues

1. **Fonts not loading**

   - Check Google Fonts URL
   - Verify preconnect links
   - Test font-display: swap

2. **GSAP animations not working**

   - Check console for errors
   - Verify CDN links
   - Test with USE_SMOOTHER = false

3. **Language switching not working**

   - Check translation JSON syntax
   - Verify data-i18n attributes
   - Test localStorage permissions

4. **Images not loading**
   - Check file paths (case-sensitive)
   - Verify image formats
   - Test lazy loading

### Debug Mode

Add to URL for debugging:

```
?debug=true
```

This enables:

- Console logging
- Animation markers
- Missing translation indicators

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For questions or support:

- Create an issue on GitHub
- Check the troubleshooting section
- Review GSAP documentation for animation issues
