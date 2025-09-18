# Performance Optimization Guide
Royal Wedding by Ully Sjah Website

## Overview
This document outlines the performance optimizations implemented for the Royal Wedding by Ully Sjah website and provides guidelines for maintaining optimal performance.

## Current Optimizations

### 1. Font Loading Optimization
- **Implementation**: `display=swap` parameter added to Google Fonts URL
- **Benefits**: 
  - Text remains visible during webfont load
  - Improves perceived performance
  - Prevents FOIT (Flash of Invisible Text)
- **Location**: `src/view/pages/index.ejs` line 8

### 2. Image Optimization

#### 2.1 Lazy Loading
- **Implementation**: `loading="lazy"` attribute on all images below the fold
- **Benefits**: 
  - Reduces initial page load time
  - Saves bandwidth
  - Improves Core Web Vitals scores
- **Example**:
```html
<img 
  src="image.jpg" 
  alt="Description"
  loading="lazy"
  class="w-full h-full object-cover"
>
```

#### 2.2 WebP Format Support
- **Implementation**: `<picture>` elements with WebP and fallback formats
- **Benefits**:
  - 25-35% smaller file sizes compared to JPEG
  - Better compression with same quality
  - Wide browser support with fallbacks
- **Example**:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

#### 2.3 Progressive Loading
- **Implementation**: Opacity transition on image load
- **Benefits**: Smooth user experience
- **Code**:
```html
<img 
  onload="this.style.opacity='1'"
  style="opacity:0; transition: opacity 0.3s ease-in-out;"
>
```

### 3. JavaScript Optimizations

#### 3.1 Intersection Observer for Lazy Loading
- **Implementation**: Modern API for efficient lazy loading
- **Benefits**: Better performance than scroll event listeners
- **Location**: `public/js/main.js` - `initLazyLoading()` function

#### 3.2 Critical Image Preloading
- **Implementation**: Preload essential images (hero, about section)
- **Benefits**: Faster rendering of above-the-fold content
- **Location**: `public/js/main.js` - `preloadCriticalImages()` function

#### 3.3 WebP Detection
- **Implementation**: Automatic WebP support detection
- **Benefits**: Serves optimal format based on browser support
- **Location**: `public/js/main.js` - `checkWebPSupport()` function

### 4. Build Process Optimization

#### 4.1 CSS Minification
- **Tool**: Tailwind CSS with `--minify` flag
- **Command**: `npm run build:css`
- **Benefits**: Reduced CSS file size

#### 4.2 JavaScript Minification
- **Tool**: Terser
- **Command**: `npm run build:js`
- **Benefits**: Reduced JavaScript file size and faster execution

#### 4.3 Production vs Development
- **Implementation**: Environment-based asset loading
- **Production**: Uses minified files (`main.min.js`)
- **Development**: Uses source files (`main.js`)

## Performance Best Practices

### Image Guidelines

1. **File Formats**:
   - Use WebP for modern browsers with JPEG/PNG fallback
   - SVG for icons and simple graphics
   - PNG for images requiring transparency

2. **Compression**:
   - JPEG: 80-85% quality for photos
   - WebP: 75-80% quality
   - Use tools like TinyPNG, Squoosh, or ImageOptim

3. **Sizing**:
   - Provide multiple sizes for responsive images
   - Use `srcset` attribute for different screen densities
   - Maximum width: 1920px for hero images
   - Thumbnail: 400x300px
   - Portfolio: 800x600px

4. **Naming Convention**:
   ```
   /assets/images/
   ├── hero/
   │   ├── hero-background.webp
   │   └── hero-background.jpg
   ├── portfolio/
   │   ├── wedding-1.webp
   │   ├── wedding-1.jpg
   │   └── wedding-1-thumb.webp
   └── about/
       ├── ully-sjah-profile.webp
       └── ully-sjah-profile.jpg
   ```

### CSS Guidelines

1. **Critical CSS**: Inline critical above-the-fold styles
2. **Unused CSS**: Remove unused styles regularly
3. **CSS Loading**: Use `preload` for critical stylesheets
4. **Font Loading**: Always use `font-display: swap`

### JavaScript Guidelines

1. **Code Splitting**: Split large JavaScript files
2. **Lazy Loading**: Load non-critical scripts on demand
3. **Debouncing**: Use debouncing for scroll/resize events
4. **Minification**: Always minify for production

## Implementation Checklist

### For New Images:
- [ ] Compress images using optimization tools
- [ ] Create WebP versions
- [ ] Add appropriate `alt` attributes
- [ ] Use `loading="lazy"` for below-the-fold images
- [ ] Implement `<picture>` elements for format selection
- [ ] Add opacity transition for smooth loading

### For New Features:
- [ ] Minimize HTTP requests
- [ ] Use CSS transforms over position changes
- [ ] Implement proper error handling
- [ ] Add loading states for user feedback
- [ ] Test on slow connections (throttling)

## Monitoring & Testing

### Tools for Performance Monitoring:
1. **Google PageSpeed Insights**: Overall performance score
2. **GTmetrix**: Detailed performance analysis
3. **WebPageTest**: Advanced performance testing
4. **Chrome DevTools**: Local debugging and optimization

### Key Metrics to Monitor:
- **First Contentful Paint (FCP)**: < 1.8s
- **Largest Contentful Paint (LCP)**: < 2.5s
- **First Input Delay (FID)**: < 100ms
- **Cumulative Layout Shift (CLS)**: < 0.1

### Testing Procedures:
1. Test on 3G connection speeds
2. Verify WebP support in different browsers
3. Check lazy loading functionality
4. Validate minified assets in production

## Build Commands

```bash
# Development
npm run dev              # Start development with CSS watch and server
npm run dev:css          # Watch CSS changes only
npm run dev:server       # Start server only

# Production Build
npm run build            # Build optimized CSS and JS
npm run build:css        # Build minified CSS only
npm run build:js         # Build minified JavaScript only

# Start Production Server
npm start               # Start production server
```

## Future Optimizations

### Planned Enhancements:
1. **Service Worker**: Implement caching strategy
2. **HTTP/2 Push**: Push critical resources
3. **Image CDN**: Consider using image CDN service
4. **Bundle Analysis**: Implement bundle size monitoring
5. **Progressive Web App**: Add PWA features

### Advanced Techniques:
1. **Critical Resource Hints**: Implement preload, prefetch, preconnect
2. **Resource Budgets**: Set performance budgets
3. **Code Splitting**: Implement dynamic imports
4. **Tree Shaking**: Remove unused code
5. **Brotli Compression**: Server-side compression

## Troubleshooting

### Common Issues:

1. **Images not loading**:
   - Check file paths and extensions
   - Verify WebP fallback implementation
   - Check browser console for errors

2. **Slow performance**:
   - Run PageSpeed Insights
   - Check for unoptimized images
   - Verify minification is working

3. **Layout shifts**:
   - Add explicit width/height to images
   - Use aspect-ratio CSS property
   - Implement skeleton loading states

## Contact

For questions about performance optimization:
- Review this documentation
- Check browser DevTools
- Test with performance monitoring tools
- Consider professional performance audit

---

Last Updated: September 2025