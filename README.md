# Kazoku Izakaya - Digital Menu PWA

A luxurious, modern Progressive Web App (PWA) for Kazoku Izakaya, featuring authentic Japanese cuisine with premium design and advanced user experience.

## 🍱 Features

### Modern Design (2026 Trends)
- **Glassmorphism Effects**: Frosted glass backgrounds with blur effects
- **Micro-interactions**: Smooth animations and hover effects
- **Premium Typography**: Playfair Display for headings, Inter for body text
- **Luxury Color Palette**: Gold accents with sophisticated dark themes
- **Advanced Animations**: CSS keyframes with performance optimization

### PWA Capabilities
- **Offline Functionality**: Full menu available without internet
- **Install Prompt**: Native app-like installation
- **Service Worker**: Background sync and caching
- **Push Notifications**: Order updates and promotions
- **Responsive Design**: Optimized for all devices

### User Experience
- **Smooth Scrolling**: Enhanced navigation with scroll effects
- **Touch Gestures**: Swipe navigation for mobile
- **Keyboard Navigation**: Full accessibility support
- **Lazy Loading**: Performance optimization for images
- **Cart Management**: Persistent shopping cart with local storage

### Technical Features
- **Modern ES6+ JavaScript**: Class-based architecture
- **Performance Monitoring**: Load time tracking
- **Memory Management**: Efficient resource handling
- **Error Handling**: Graceful fallbacks for offline scenarios
- **Form Validation**: Enhanced user input handling

## 🚀 Getting Started

### Prerequisites
- Modern web browser with PWA support
- Local web server (for development)

### Installation
1. Clone or download the project files
2. Serve the files from a web server
3. Open in a modern browser
4. Install as PWA when prompted

### Development
```bash
# Serve locally (example with Python)
python -m http.server 8000

# Or with Node.js
npx serve .
```

## 📱 PWA Installation

### Desktop
1. Open the website in Chrome/Edge
2. Click the install button in the address bar
3. Follow the installation prompts

### Mobile
1. Open in Safari (iOS) or Chrome (Android)
2. Tap "Add to Home Screen"
3. The app will appear on your home screen

## 🎨 Design System

### Colors
- **Primary Black**: #0a0a0a
- **Secondary Black**: #1a1a1a
- **Accent Gold**: #d4af37
- **Text Primary**: #ffffff
- **Text Secondary**: #e0e0e0

### Typography
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)
- **Code**: JetBrains Mono (monospace)

### Spacing
- **XS**: 0.25rem (4px)
- **SM**: 0.5rem (8px)
- **MD**: 1rem (16px)
- **LG**: 1.5rem (24px)
- **XL**: 2rem (32px)

## 🔧 Customization

### Adding Products
Edit the `products` array in `script.js`:

```javascript
{
    id: 41,
    name: "New Product",
    price: 300,
    includes: "Product description",
    category: "Category",
    image: "image-url"
}
```

### Styling
Modify CSS custom properties in `styles.css`:

```css
:root {
    --primary-black: #0a0a0a;
    --accent-gold: #d4af37;
    /* Add your custom colors */
}
```

## 📊 Performance

### Optimizations
- **Image Lazy Loading**: Loads images as needed
- **Service Worker Caching**: Offline functionality
- **Code Splitting**: Modular JavaScript architecture
- **CSS Optimization**: Efficient selectors and properties
- **Font Optimization**: Preloaded critical fonts

### Metrics
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Time to Interactive**: < 3.5s

## 🌐 Browser Support

### Fully Supported
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### PWA Features
- Service Worker: Chrome 40+, Firefox 44+, Safari 11.1+
- Web App Manifest: Chrome 38+, Firefox 41+, Safari 11.1+
- Push Notifications: Chrome 42+, Firefox 44+, Safari 16+

## 📱 Mobile Features

### Touch Gestures
- **Swipe Left/Right**: Navigate menu categories
- **Pinch to Zoom**: Image viewing
- **Pull to Refresh**: Update content

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🔒 Security

### Data Protection
- **Local Storage**: Cart data stored locally
- **HTTPS Required**: PWA installation requires secure connection
- **Content Security Policy**: XSS protection
- **Input Validation**: Form data sanitization

## 🚀 Deployment

### Static Hosting
- **Netlify**: Drag and drop deployment
- **Vercel**: Git-based deployment
- **GitHub Pages**: Free hosting option
- **Firebase Hosting**: Google's hosting platform

### Requirements
- HTTPS enabled
- Service Worker support
- Web App Manifest accessible

## 📈 Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **User Interactions**: Click and scroll tracking
- **Error Monitoring**: JavaScript error reporting
- **Offline Usage**: Service Worker analytics

## 🛠️ Development Tools

### Recommended
- **VS Code**: Code editor with PWA extensions
- **Chrome DevTools**: PWA debugging
- **Lighthouse**: Performance auditing
- **WebPageTest**: Load time analysis

### Extensions
- **PWA Builder**: Microsoft's PWA toolkit
- **Workbox**: Google's service worker library
- **Lighthouse CI**: Automated performance testing

## 📄 License

This project is proprietary software for Kazoku Izakaya. All rights reserved.

## 🤝 Support

For technical support or customization requests, contact the development team.

---

**Kazoku Izakaya** - Auténtica Cocina Japonesa en Guadalajara
