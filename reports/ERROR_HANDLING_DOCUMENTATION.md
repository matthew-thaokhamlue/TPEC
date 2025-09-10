# Error Handling and Fallback Systems Documentation

## Overview

The construction consulting website implements a comprehensive error handling and fallback system to ensure graceful degradation when components fail. This system provides resilience against network issues, script loading failures, missing translations, and other potential problems.

## Components

### 1. Global Error Handler (`assets/js/error-handler.js`)

The main error handling system that catches and manages all types of errors.

#### Features:
- **Global JavaScript Error Handling**: Catches uncaught exceptions and promise rejections
- **Resource Loading Error Handling**: Manages failed script, stylesheet, and image loads
- **Network Error Handling**: Implements retry logic for failed fetch requests
- **Font Fallback System**: Switches to system fonts when web fonts fail
- **Animation Fallbacks**: Provides CSS alternatives when GSAP fails
- **Translation Fallbacks**: Handles missing translation keys gracefully

#### Key Methods:

```javascript
// Initialize the error handling system
window.errorHandler.init()

// Get error report for debugging
window.errorHandler.getErrorReport()

// Clear error history
window.errorHandler.clearErrors()
```

### 2. Enhanced Main Application (`assets/js/main.js`)

Updated with comprehensive error handling throughout all methods.

#### Improvements:
- Safe translation retrieval with fallbacks
- HTML escaping to prevent XSS
- Retry logic for data loading
- Fallback content when data fails to load
- Graceful degradation for all features

### 3. Robust i18n System (`assets/js/i18n.js`)

Enhanced internationalization with error recovery.

#### Features:
- Fallback translations for critical keys
- Cache system for offline resilience
- Missing key handling with readable fallbacks
- Error recovery for failed translation loads

### 4. Motion System Fallbacks (`assets/js/motion.js`)

GSAP animation system with CSS fallbacks.

#### Features:
- Automatic detection of GSAP loading failures
- CSS animation fallbacks using Intersection Observer
- Respect for reduced motion preferences
- Graceful degradation to native smooth scrolling

## Error Types Handled

### 1. JavaScript Errors
- **Uncaught Exceptions**: Global error handler catches and logs
- **Promise Rejections**: Unhandled rejection handler prevents crashes
- **Module Loading Failures**: Graceful degradation when scripts fail

### 2. Network Errors
- **Failed Fetch Requests**: Automatic retry with exponential backoff
- **Translation Loading**: Fallback to cached or default translations
- **Image Loading**: Automatic fallback to placeholder images

### 3. Resource Loading Errors
- **GSAP Loading Failure**: CSS animation fallbacks
- **Font Loading Failure**: System font fallbacks
- **Stylesheet Loading**: Graceful degradation

### 4. Content Errors
- **Missing Translations**: Readable fallback text generation
- **Missing Images**: Placeholder image system
- **Data Loading Failures**: Fallback content display

## Fallback Strategies

### 1. Font Fallbacks

When Google Fonts fail to load:
```css
.font-fallback {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
}

.font-fallback:lang(lo) {
  font-family: 'Phetsarath OT', 'Saysettha OT', 'Lao UI', sans-serif !important;
}
```

### 2. Animation Fallbacks

When GSAP fails to load:
```css
.no-gsap .reveal-up {
  opacity: 1 !important;
  transform: none !important;
  animation: revealUpFallback 0.6s ease-out;
}

@keyframes revealUpFallback {
  from { opacity: 0; transform: translateY(24px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### 3. Translation Fallbacks

When translation keys are missing:
- Convert key names to readable text (e.g., `nav.home` → "Home")
- Show `[MISSING: Key Name]` for debugging
- Use cached translations when available
- Provide essential fallback translations

### 4. Network Fallbacks

When network requests fail:
- Automatic retry with exponential backoff (up to 3 attempts)
- Fallback to cached data when available
- Display user-friendly error messages
- Continue with basic functionality

## Content Security Policy

Enhanced CSP for security while allowing necessary resources:

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

## Testing

### Manual Testing

Use the test page at `test-error-handling.html` to verify:

1. **JavaScript Error Handling**
   - Trigger uncaught exceptions
   - Test promise rejections
   - Verify global error catching

2. **Network Error Handling**
   - Test failed fetch requests
   - Verify retry logic
   - Check fallback responses

3. **Resource Error Handling**
   - Load broken images
   - Simulate script failures
   - Test font fallbacks

4. **Animation Fallbacks**
   - Disable GSAP
   - Verify CSS fallbacks
   - Test reduced motion

### Automated Testing

The error handler provides methods for testing:

```javascript
// Show current error report
window.errorHandler.getErrorReport()

// Clear errors for fresh testing
window.errorHandler.clearErrors()

// Check system status
console.log('Error Handler Status:', window.errorHandler ? 'Loaded' : 'Failed')
```

## Implementation Details

### 1. Script Loading Order

Critical for proper error handling:

```html
<!-- 1. Error handler loads first -->
<script src="assets/js/error-handler.js"></script>

<!-- 2. External libraries with error handlers -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js" 
        onerror="console.warn('GSAP failed'); document.body.classList.add('no-gsap');"></script>

<!-- 3. Application scripts with error handlers -->
<script defer src="assets/js/main.js" onerror="console.warn('Main script failed')"></script>
```

### 2. CSS Classes for Fallback States

The system uses CSS classes to indicate fallback states:

- `.no-gsap`: GSAP failed to load
- `.no-animations`: Animations disabled
- `.font-fallback`: Using system fonts
- `.fallback-mode`: General fallback state
- `.translation-fallback`: Using generated translations

### 3. Error Reporting

Errors are collected and can be reported for debugging:

```javascript
const report = window.errorHandler.getErrorReport();
// Contains: errors[], userAgent, url, timestamp, retryAttempts
```

## Best Practices

### 1. Graceful Degradation
- Always provide fallback functionality
- Never let errors break the entire site
- Maintain core functionality even when features fail

### 2. User Experience
- Show user-friendly error messages
- Auto-hide error notifications
- Provide retry options where appropriate

### 3. Performance
- Use lazy loading for non-critical resources
- Implement caching for resilience
- Minimize impact of error handling on performance

### 4. Accessibility
- Ensure fallbacks maintain accessibility
- Provide alternative content for screen readers
- Respect user preferences (reduced motion, etc.)

## Monitoring and Debugging

### 1. Console Logging
All errors are logged to the console with context:
```
Error caught by global handler: {type: 'javascript', message: '...', stack: '...'}
```

### 2. Error Collection
Errors are stored in memory for analysis:
```javascript
window.errorHandler.errors // Array of all caught errors
```

### 3. System Status
Check system health:
```javascript
// Check if critical systems loaded
console.log('GSAP:', window.gsap ? 'Loaded' : 'Failed');
console.log('i18n:', window.i18n ? 'Loaded' : 'Failed');
console.log('Motion:', window.Motion ? 'Loaded' : 'Failed');
```

## Requirements Satisfied

This implementation satisfies the following requirements:

- **6.4**: Graceful degradation when features fail
- **6.5**: Respect for reduced motion preferences
- **8.5**: Content Security Policy implementation

The error handling system ensures the website remains functional and accessible even when individual components fail, providing a robust user experience across all scenarios.