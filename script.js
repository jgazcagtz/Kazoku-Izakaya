// ===== KAZOKU IZAKAYA - ADVANCED JAVASCRIPT =====
// Modern ES6+ features with performance optimization and PWA capabilities

class KazokuIzakayaApp {
    constructor() {
        this.products = [];
        this.cart = [];
        this.total = 0;
        this.selectedProduct = null;
        this.selectedPaymentMethod = 'online';
        this.isOnline = navigator.onLine;
        this.observer = null;
        this.debounceTimer = null;
        
        this.init();
    }

    // ===== INITIALIZATION =====
    async init() {
        this.setupServiceWorker();
        this.setupEventListeners();
        this.setupIntersectionObserver();
        this.setupPerformanceOptimizations();
        this.loadProducts();
        this.setupOfflineHandling();
        this.hideLoadingScreen();
    }

    // ===== SERVICE WORKER SETUP =====
    async setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Handle updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    // ===== EVENT LISTENERS =====
    setupEventListeners() {
        // Navigation
        this.setupNavigation();
        
        // Menu interactions
        this.setupMenuNavigation();
        
        // Cart functionality
        this.setupCartHandlers();
        
        // Modal handlers
        this.setupModalHandlers();
        
        // Form handlers
        this.setupFormHandlers();
        
        // Scroll effects
        this.setupScrollEffects();
        
        // Touch gestures
        this.setupTouchGestures();
        
        // Keyboard navigation
        this.setupKeyboardNavigation();
        
        // Online/offline status
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }

    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
                
                // Close mobile menu
                if (navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', this.throttle(() => {
            const navbar = document.getElementById('navbar');
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }, 100));
    }

    setupMenuNavigation() {
        const menuNavBtns = document.querySelectorAll('.menu-nav-btn');
        const menuCategories = document.querySelectorAll('.menu-category');

        menuNavBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const category = btn.dataset.category;
                
                // Update active states
                menuNavBtns.forEach(b => b.classList.remove('active'));
                menuCategories.forEach(c => c.classList.remove('active'));
                
                btn.classList.add('active');
                document.getElementById(category).classList.add('active');
                
                // Smooth scroll to menu section
                this.scrollToSection('menu');
            });
        });
    }

    setupCartHandlers() {
        // Cart toggle - Multiple event types for better mobile support
        const cartBtn = document.getElementById('floating-cart-btn');
        const cartCloseBtn = document.querySelector('.cart-close');
        
        if (cartBtn) {
            // Primary click event
            cartBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cart button clicked');
                this.toggleCart();
            });
            
            // Touch events for mobile
            cartBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Cart button touched');
                this.toggleCart();
            });
            
            // Prevent double-tap zoom on mobile
            cartBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
            });
        }
        
        if (cartCloseBtn) {
            cartCloseBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCart();
            });
            
            cartCloseBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleCart();
            });
        }

        // Payment method changes
        const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.selectedPaymentMethod = e.target.value;
                this.updateCart();
            });
        });

        // Delivery address and notes
        const deliveryAddress = document.getElementById('delivery-address');
        const orderNotes = document.getElementById('order-notes');
        
        if (deliveryAddress) {
            deliveryAddress.addEventListener('input', this.debounce(() => {
                this.updateCart();
            }, 300));
        }
        
        if (orderNotes) {
            orderNotes.addEventListener('input', this.debounce(() => {
                this.updateCart();
            }, 300));
        }
    }

    setupModalHandlers() {
        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeAllModals();
            }
        });

        // Close modals with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    setupFormHandlers() {
        // Form validation and enhancement
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(form);
            });
        });
    }

    setupScrollEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', this.throttle(() => {
            const scrolled = window.pageYOffset;
            const heroSection = document.querySelector('.hero-section');
            if (heroSection) {
                heroSection.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        }, 16));

        // Reveal animations
        this.setupRevealAnimations();
    }

    setupTouchGestures() {
        // Swipe gestures for mobile
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Horizontal swipe
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.handleSwipeRight();
                } else {
                    this.handleSwipeLeft();
                }
            }
        });
    }

    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Tab navigation enhancement
            if (e.key === 'Tab') {
                this.enhanceTabNavigation();
            }
            
            // Arrow key navigation for product grid
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.handleArrowNavigation(e.key);
            }
        });
    }

    // ===== INTERSECTION OBSERVER =====
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Lazy load images
                    if (entry.target.tagName === 'IMG') {
                        this.lazyLoadImage(entry.target);
                    }
                }
            });
        }, options);

        // Observe elements for animations
        document.addEventListener('DOMContentLoaded', () => {
            const elementsToObserve = document.querySelectorAll('.product-item, .section-title, .intro-text');
            elementsToObserve.forEach(el => this.observer.observe(el));
        });
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    setupPerformanceOptimizations() {
        // Preload critical resources
        this.preloadCriticalResources();
        
        // Optimize images
        this.optimizeImages();
        
        // Setup lazy loading
        this.setupLazyLoading();
        
        // Memory management
        this.setupMemoryManagement();
    }

    preloadCriticalResources() {
        const criticalResources = [
            {
                href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
                as: 'style',
                crossorigin: 'anonymous'
            },
            {
                href: 'https://i.imgur.com/m6xHJP8.png',
                as: 'image'
            },
            {
                href: 'https://i.imgur.com/vLBB4FM.png',
                as: 'image'
            }
        ];

        criticalResources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.href;
            link.as = resource.as;
            if (resource.crossorigin) {
                link.crossOrigin = resource.crossorigin;
            }
            document.head.appendChild(link);
        });
    }

    optimizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            // Add loading="lazy" for non-critical images
            if (!img.closest('.hero-section, .loading-screen')) {
                img.loading = 'lazy';
            }
            
            // Add error handling
            img.addEventListener('error', () => {
                img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzFhMWExYSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iI2Q0YWYzNyIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0Ij5JbWFnZW4gbm8gZGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
            });
        });
    }

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    setupMemoryManagement() {
        // Clean up event listeners on page unload
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    // ===== PRODUCT MANAGEMENT =====
    loadProducts() {
        this.products = [
            { id: 1, name: "Edamame Trufado", price: 150, includes: "Edamame al vapor con sal marina y aceite de trufa negra.", category: "Entradas", image: "https://i.imgur.com/DSOwAfw.png" },
            { id: 2, name: "Tartar de Atún Bluefin", price: 350, includes: "Atún Bluefin finamente picado con aguacate, tobiko y aderezo de ponzu y yuzu.", category: "Entradas", image: "https://i.imgur.com/Jhf3oO6.png" },
            { id: 3, name: "Tempura de Langosta", price: 450, includes: "Langosta fresca frita en una ligera tempura con salsa de soya dulce.", category: "Entradas", image: "https://i.imgur.com/eusN3Bt.png" },
            { id: 4, name: "Tataki de Wagyu", price: 500, includes: "Finas láminas de wagyu sellado, acompañadas de salsa ponzu y jengibre fresco.", category: "Entradas", image: "https://i.imgur.com/wc2orxe.png" },
            { id: 5, name: "Sashimi de Hamachi", price: 400, includes: "Láminas de hamachi fresco servidas con rodajas de jalapeño, cilantro y ponzu.", category: "Entradas", image: "https://i.imgur.com/aF9yIXx.png" },
            { id: 6, name: "Sopa Miso con Trufa Blanca", price: 200, includes: "Clásica sopa miso con un toque de trufa blanca y setas shiitake.", category: "Sopas", image: "https://i.imgur.com/LBrhsUp.png" },
            { id: 7, name: "Ramen de Pato", price: 350, includes: "Caldo de pato confitado, fideos ramen caseros, huevo pochado y nori.", category: "Sopas", image: "https://i.imgur.com/fYGAy63.png" },
            { id: 8, name: "Dobin Mushi", price: 300, includes: "Sopa al vapor con mariscos frescos, servida en una tetera de cerámica.", category: "Sopas", image: "https://i.imgur.com/KDJ4vmf.png" },
            { id: 9, name: "Sopa de Almejas en Dashi", price: 280, includes: "Almejas frescas cocidas en un caldo de dashi y sake, con cebolleta y jengibre.", category: "Sopas", image: "https://i.imgur.com/cJRM3XV.png" },
            { id: 10, name: "Sopa de Erizo de Mar", price: 380, includes: "Crema de erizo de mar con un toque de yuzu y alga nori.", category: "Sopas", image: "https://i.imgur.com/dYG06Vn.png" },
            { id: 11, name: "Sukiyaki de Wagyu A5", price: 1200, includes: "Lonjas de wagyu A5 cocidas en mesa en una olla de hierro, con vegetales frescos y tofu.", category: "Platos Principales", image: "https://i.imgur.com/hTljGud.png" },
            { id: 12, name: "Nigiri Omakase", price: 850, includes: "Selección de 10 piezas de nigiri de temporada, elegidas por el chef.", category: "Platos Principales", image: "https://i.imgur.com/DSOwAfw.png" },
            { id: 13, name: "Chirashi Don", price: 700, includes: "Arroz de sushi cubierto con una selección premium de mariscos frescos.", category: "Platos Principales", image: "https://i.imgur.com/Jhf3oO6.png" },
            { id: 14, name: "Katsuo Tataki con Salsa Ponzu", price: 600, includes: "Bonito ligeramente asado, servido con salsa ponzu y ensalada de daikon.", category: "Platos Principales", image: "https://i.imgur.com/eusN3Bt.png" },
            { id: 15, name: "Unagi Kabayaki", price: 550, includes: "Anguila asada con salsa dulce de soya, servida con arroz al vapor.", category: "Platos Principales", image: "https://i.imgur.com/wc2orxe.png" },
            { id: 16, name: "Robata de Mariscos", price: 750, includes: "Selección de mariscos frescos a la parrilla, servidos con salsa de miso y limón.", category: "Platos Principales", image: "https://i.imgur.com/aF9yIXx.png" },
            { id: 17, name: "Salmón Teriyaki con Yuzu", price: 650, includes: "Filete de salmón a la parrilla con una salsa teriyaki de yuzu, acompañado de espárragos.", category: "Platos Principales", image: "https://i.imgur.com/LBrhsUp.png" },
            { id: 18, name: "Pollo Karaage con Salsa de Sésamo", price: 450, includes: "Muslos de pollo crujientes, marinados y fritos, servidos con una salsa de sésamo y jengibre.", category: "Platos Principales", image: "https://i.imgur.com/fYGAy63.png" },
            { id: 19, name: "Tonkatsu de Iberico", price: 550, includes: "Chuleta de cerdo ibérico empanizada, servida con repollo y salsa tonkatsu casera.", category: "Platos Principales", image: "https://i.imgur.com/KDJ4vmf.png" },
            { id: 20, name: "Shabu-Shabu de Mariscos", price: 900, includes: "Caldo de kombu y sake para cocinar mariscos frescos en la mesa.", category: "Platos Principales", image: "https://i.imgur.com/cJRM3XV.png" },
            { id: 21, name: "Fugu Sashimi", price: 1500, includes: "Sashimi de pez globo preparado por un chef con licencia, acompañado de salsa ponzu.", category: "Especialidades", image: "https://i.imgur.com/dYG06Vn.png" },
            { id: 22, name: "Tempura de Erizo de Mar", price: 800, includes: "Erizo de mar fresco envuelto en alga y frito en tempura, servido con salsa tentsuyu.", category: "Especialidades", image: "https://i.imgur.com/hTljGud.png" },
            { id: 23, name: "Takoyaki de Pulpo de Profundidad", price: 450, includes: "Bolas de masa frita rellenas de pulpo capturado en aguas profundas, con salsa de okonomiyaki.", category: "Especialidades", image: "https://i.imgur.com/DSOwAfw.png" },
            { id: 24, name: "Omakase Chef's Table", price: 2500, includes: "Experiencia de degustación de 12 tiempos, personalizada por el chef.", category: "Especialidades", image: "https://i.imgur.com/Jhf3oO6.png" },
            { id: 25, name: "Matsusaka Beef Teppanyaki", price: 1800, includes: "Filete de Matsusaka cocinado al estilo teppanyaki, acompañado de vegetales de temporada.", category: "Especialidades", image: "https://i.imgur.com/eusN3Bt.png" },
            { id: 26, name: "Sushi Incrustado con Oro", price: 1000, includes: "Nigiri de atún bluefin cubierto con una hoja de oro comestible y caviar.", category: "Especialidades", image: "https://i.imgur.com/wc2orxe.png" },
            { id: 27, name: "King Crab Gratinado con Miso", price: 1200, includes: "Cangrejo real gratinado con una mezcla de miso blanco y queso gruyere.", category: "Especialidades", image: "https://i.imgur.com/aF9yIXx.png" },
            { id: 28, name: "Toro Tartare con Caviar Oscietra", price: 1300, includes: "Tartar de ventresca de atún acompañado de caviar Oscietra y hojas de shiso.", category: "Especialidades", image: "https://i.imgur.com/LBrhsUp.png" },
            { id: 29, name: "Ikura Don", price: 850, includes: "Bol de arroz con huevas de salmón frescas, servidas con salsa de soya y wasabi.", category: "Especialidades", image: "https://i.imgur.com/fYGAy63.png" },
            { id: 30, name: "Yakiniku de Wagyu", price: 1100, includes: "Láminas de wagyu A5 cocidas en una parrilla de mesa, acompañadas de salsas caseras.", category: "Especialidades", image: "https://i.imgur.com/KDJ4vmf.png" },
            { id: 31, name: "Matcha Tiramisu", price: 250, includes: "Capas de bizcocho y mascarpone infusionado con matcha, espolvoreado con cacao japonés.", category: "Postres", image: "https://i.imgur.com/cJRM3XV.png" },
            { id: 32, name: "Mochi de Sésamo Negro", price: 200, includes: "Tradicional mochi relleno de pasta de sésamo negro, servido con una bola de helado de vainilla.", category: "Postres", image: "https://i.imgur.com/dYG06Vn.png" },
            { id: 33, name: "Helado de Wasabi y Yuzu", price: 180, includes: "Helado artesanal con un toque de wasabi fresco y cítricos yuzu.", category: "Postres", image: "https://i.imgur.com/hTljGud.png" },
            { id: 34, name: "Crema Catalana de Sake", price: 220, includes: "Versión japonesa de la crema catalana, infusionada con sake y servida con una capa crujiente de azúcar.", category: "Postres", image: "https://i.imgur.com/DSOwAfw.png" },
            { id: 35, name: "Tarta de Frutas con Gelatina de Sakura", price: 280, includes: "Tarta de frutas frescas con una gelatina de flor de cerezo, servida con crema batida.", category: "Postres", image: "https://i.imgur.com/Jhf3oO6.png" },
            { id: 36, name: "Cheesecake de Tofu y Miso", price: 260, includes: "Cheesecake ligero de tofu con un toque de miso dulce, servido con coulis de frambuesa.", category: "Postres", image: "https://i.imgur.com/eusN3Bt.png" },
            { id: 37, name: "Parfait de Matcha y Azuki", price: 300, includes: "Parfait de matcha con capas de helado de azuki, nata montada y crujientes de arroz.", category: "Postres", image: "https://i.imgur.com/wc2orxe.png" },
            { id: 38, name: "Pudding de Kabocha", price: 240, includes: "Pudding de calabaza japonesa con caramelo de soya y crema de jengibre.", category: "Postres", image: "https://i.imgur.com/aF9yIXx.png" },
            { id: 39, name: "Soufflé de Yuzu y Chocolate Blanco", price: 320, includes: "Soufflé ligero con notas de yuzu y un centro de chocolate blanco derretido.", category: "Postres", image: "https://i.imgur.com/LBrhsUp.png" },
            { id: 40, name: "Daifuku de Fresas y Crema", price: 280, includes: "Mochi suave relleno de fresas frescas y crema batida, servido con salsa de frambuesa.", category: "Postres", image: "https://i.imgur.com/fYGAy63.png" }
        ];

        this.displayProducts();
        this.loadCartFromStorage();
    }

    displayProducts() {
        // Display favorites (top 10 most expensive items)
        const favorites = [...this.products].sort((a, b) => b.price - a.price).slice(0, 10);
        this.renderProductGrid(favorites, 'favorites-grid', 'horizontal');

        // Display other categories
        const categories = {
            'soups': this.products.filter(p => p.category === 'Sopas'),
            'mains': this.products.filter(p => p.category === 'Platos Principales'),
            'specialties': this.products.filter(p => p.category === 'Especialidades'),
            'desserts': this.products.filter(p => p.category === 'Postres')
        };

        Object.entries(categories).forEach(([category, products]) => {
            this.renderProductGrid(products, `${category}-grid`, 'vertical');
        });
    }

    renderProductGrid(products, containerId, layout = 'vertical') {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = '';

        products.forEach(product => {
            const productElement = this.createProductElement(product, layout);
            container.appendChild(productElement);
        });
    }

    createProductElement(product, layout = 'vertical') {
        const productDiv = document.createElement('div');
        productDiv.className = `product-item ${layout === 'horizontal' ? 'horizontal' : ''}`;
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-content">
                <h3>${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <p class="product-description">${product.includes}</p>
                <div class="product-actions">
                    <select class="quantity-select" data-product-id="${product.id}">
                        ${Array.from({length: 10}, (_, i) => 
                            `<option value="${i + 1}">${i + 1}</option>`
                        ).join('')}
                    </select>
                    <button class="choose-btn" onclick="app.showProductModal(${product.id})">
                        Elegir
                    </button>
                </div>
            </div>
        `;

        return productDiv;
    }

    // ===== CART FUNCTIONALITY =====
    showProductModal(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const quantitySelect = document.querySelector(`select[data-product-id="${productId}"]`);
        const quantity = parseInt(quantitySelect?.value || 1);
        
        this.selectedProduct = { ...product, quantity };
        
        const modalContent = document.getElementById('product-modal-content');
        if (modalContent) {
            modalContent.innerHTML = `
                <div class="product-modal-info">
                    <img src="${product.image}" alt="${product.name}" class="modal-product-image">
                    <div class="modal-product-details">
                        <h3>${product.name}</h3>
                        <p class="modal-price">$${product.price.toFixed(2)}</p>
                        <p class="modal-description">${product.includes}</p>
                        <p class="modal-quantity">Cantidad: ${quantity}</p>
                    </div>
                </div>
            `;
        }
        
        this.toggleProductModal();
    }

    addProductToCart() {
        if (!this.selectedProduct) return;

        const existingProduct = this.cart.find(item => item.name === this.selectedProduct.name);
        
        if (existingProduct) {
            existingProduct.quantity += this.selectedProduct.quantity;
        } else {
            this.cart.push({
                name: this.selectedProduct.name,
                price: this.selectedProduct.price,
                quantity: this.selectedProduct.quantity,
                image: this.selectedProduct.image
            });
        }

        this.updateCart();
        this.toggleProductModal();
        this.showNotification(`Producto agregado: ${this.selectedProduct.name} x ${this.selectedProduct.quantity}`);
    }

    updateCart() {
        this.updateCartBadge();
        this.saveCartToStorage();
    }

    updatePaymentModal() {
        this.renderOrderItems();
        this.updateOrderTotals();
        this.setupPaymentHandlers();
    }

    renderOrderItems() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;

        orderItems.innerHTML = '';

        if (this.cart.length === 0) {
            orderItems.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: var(--space-lg);">No hay productos en el carrito</p>';
            return;
        }

        this.cart.forEach((item, index) => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div>
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-quantity">Cantidad: ${item.quantity}</div>
                </div>
                <div class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
            `;
            orderItems.appendChild(orderItem);
        });
    }

    updateOrderTotals() {
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tip = subtotal * 0.10; // 10% tip
        const total = subtotal + tip;

        const subtotalEl = document.getElementById('subtotal');
        const tipAmountEl = document.getElementById('tip-amount');
        const finalTotalEl = document.getElementById('final-total');

        if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
        if (tipAmountEl) tipAmountEl.textContent = `$${tip.toFixed(2)}`;
        if (finalTotalEl) finalTotalEl.textContent = `$${total.toFixed(2)}`;
    }

    setupPaymentHandlers() {
        // Payment method change handler
        const paymentRadios = document.querySelectorAll('input[name="payment-method"]');
        const onlinePayment = document.getElementById('online-payment');
        
        paymentRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                if (e.target.value === 'online') {
                    onlinePayment.style.display = 'block';
                    this.updatePayPalForm();
                } else {
                    onlinePayment.style.display = 'none';
                }
            });
        });
    }

    updateCartTotal() {
        this.total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            cartTotal.textContent = `Total: $${this.total.toFixed(2)}`;
        }
    }

    updateCartBadge() {
        const badge = document.getElementById('cart-badge');
        if (badge) {
            const itemCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = itemCount;
            badge.style.display = itemCount > 0 ? 'flex' : 'none';
        }
    }

    updateCartItemQuantity(index, change) {
        this.cart[index].quantity += change;
        if (this.cart[index].quantity <= 0) {
            this.cart[index].quantity = 1;
        }
        this.updateCart();
    }

    removeCartItem(index) {
        this.cart.splice(index, 1);
        this.updateCart();
    }

    clearCart() {
        this.cart = [];
        this.updateCart();
        this.showNotification('Carrito limpiado');
    }

    confirmOrder() {
        // Validate form
        const customerName = document.getElementById('customer-name');
        const customerPhone = document.getElementById('customer-phone');
        const deliveryAddress = document.getElementById('delivery-address');
        
        if (!customerName.value.trim()) {
            this.showNotification('Por favor ingresa tu nombre completo', 'error');
            customerName.focus();
            return;
        }
        
        if (!customerPhone.value.trim()) {
            this.showNotification('Por favor ingresa tu teléfono', 'error');
            customerPhone.focus();
            return;
        }
        
        if (!deliveryAddress.value.trim()) {
            this.showNotification('Por favor ingresa tu dirección', 'error');
            deliveryAddress.focus();
            return;
        }

        if (this.cart.length === 0) {
            this.showNotification('Tu carrito está vacío', 'error');
            return;
        }

        // Get form data
        const orderNotes = document.getElementById('order-notes').value;
        const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
        
        // Calculate totals
        const subtotal = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const tip = subtotal * 0.10;
        const total = subtotal + tip;

        // Create WhatsApp message
        const message = `🍱 *NUEVO PEDIDO - KAZOKU IZAKAYA* 🍱\n\n` +
            `👤 *Cliente:* ${customerName.value}\n` +
            `📞 *Teléfono:* ${customerPhone.value}\n` +
            `📍 *Dirección:* ${deliveryAddress.value}\n\n` +
            `📋 *PEDIDO:*\n` +
            `${this.cart.map(item => `• ${item.name} (${item.quantity}) - $${item.price} c/u`).join('\n')}\n\n` +
            `💰 *RESUMEN:*\n` +
            `Subtotal: $${subtotal.toFixed(2)}\n` +
            `Propina (10%): $${tip.toFixed(2)}\n` +
            `*TOTAL: $${total.toFixed(2)}*\n\n` +
            `💳 *Método de pago:* ${paymentMethod === 'cash' ? 'Efectivo' : paymentMethod === 'online' ? 'Pago en línea' : 'Transferencia'}\n` +
            `📝 *Notas:* ${orderNotes || 'Ninguna'}\n\n` +
            `¡Gracias por elegirnos! 🙏`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/525533355687?text=${encodedMessage}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Show success message
        this.showNotification('¡Pedido enviado! Te contactaremos pronto', 'success');
        
        // Close modal
        this.togglePaymentModal();
        
        // Clear cart
        this.clearCart();
    }

    // ===== PAYMENT INTEGRATION =====
    updatePayPalForm() {
        const paypalForm = document.getElementById('paypal-form');
        if (!paypalForm) return;

        if (this.total > 0) {
            paypalForm.innerHTML = `
                <form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">
                    <input type="hidden" name="cmd" value="_xclick" />
                    <input type="hidden" name="business" value="gascagtz@gmail.com" />
                    <input type="hidden" name="currency_code" value="MXN" />
                    <input type="hidden" name="amount" value="${this.total.toFixed(2)}" />
                    <input type="hidden" name="item_name" value="${this.cart.map(item => `${item.name} (${item.quantity})`).join(', ')}" />
                    <input type="image" src="https://www.paypalobjects.com/webstatic/en_US/i/btn/png/silver-pill-paypal-44px.png" 
                           border="0" name="submit" title="Pay with PayPal" alt="PayPal - The safer, easier way to pay online!" />
                </form>
            `;
        } else {
            paypalForm.innerHTML = '';
        }
    }

    updateWhatsAppLink() {
        const whatsappBtn = document.getElementById('whatsapp-btn');
        if (!whatsappBtn) return;

        const deliveryAddress = document.getElementById('delivery-address')?.value || '';
        const orderNotes = document.getElementById('order-notes')?.value || '';
        
        const message = `🍱 *Orden de Kazoku Izakaya* 🍱\n\n` +
            `${this.cart.map(item => `• ${item.name} (${item.quantity}) - $${item.price} c/u`).join('\n')}\n\n` +
            `💰 *Total: $${this.total.toFixed(2)}*\n` +
            `💳 *Método de pago: ${this.selectedPaymentMethod}*\n` +
            `📍 *Dirección: ${deliveryAddress}*\n` +
            `📝 *Notas: ${orderNotes}*\n\n` +
            `¡Gracias por elegirnos! 🙏`;
        
        const encodedMessage = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/525533355687?text=${encodedMessage}`;
        whatsappBtn.style.display = this.total > 0 ? 'flex' : 'none';
    }

    // ===== MODAL MANAGEMENT =====
    toggleCart() {
        this.togglePaymentModal();
    }

    togglePaymentModal() {
        const paymentModal = document.getElementById('payment-modal');
        
        if (paymentModal) {
            const isOpen = paymentModal.classList.contains('show');
            
            if (isOpen) {
                // Close modal
                paymentModal.classList.remove('show');
                document.body.style.overflow = '';
                document.body.classList.remove('modal-open');
            } else {
                // Open modal
                paymentModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                document.body.classList.add('modal-open');
                
                // Update payment content when opening
                this.updatePaymentModal();
            }
        }
    }

    toggleProductModal() {
        const modal = document.getElementById('product-modal');
        if (modal) {
            modal.classList.toggle('show');
        }
    }

    toggleEditModal() {
        const modal = document.getElementById('edit-modal');
        if (modal) {
            modal.classList.toggle('show');
        }
    }

    toggleMapModal() {
        const modal = document.getElementById('map-modal');
        if (modal) {
            modal.classList.toggle('show');
        }
    }

    closeAllModals() {
        const modals = document.querySelectorAll('.modal');
        modals.forEach(modal => modal.classList.remove('show'));
    }

    // ===== UTILITY FUNCTIONS =====
    scrollToSection(sectionId) {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(this.debounceTimer);
                func(...args);
            };
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(later, wait);
        };
    }

    // ===== NOTIFICATIONS =====
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    showUpdateNotification() {
        this.showNotification('Nueva versión disponible. Recarga la página para actualizar.', 'info');
    }

    // ===== OFFLINE HANDLING =====
    setupOfflineHandling() {
        // Check online status
        this.handleOnlineStatus(navigator.onLine);
        
        // Listen for online/offline events
        window.addEventListener('online', () => this.handleOnlineStatus(true));
        window.addEventListener('offline', () => this.handleOnlineStatus(false));
    }

    handleOnlineStatus(isOnline) {
        this.isOnline = isOnline;
        const statusIndicator = document.createElement('div');
        statusIndicator.className = `connection-status ${isOnline ? 'online' : 'offline'}`;
        statusIndicator.textContent = isOnline ? 'Conectado' : 'Sin conexión';
        
        if (!document.querySelector('.connection-status')) {
            document.body.appendChild(statusIndicator);
        }
    }

    // ===== STORAGE MANAGEMENT =====
    saveCartToStorage() {
        try {
            localStorage.setItem('kazoku-cart', JSON.stringify(this.cart));
        } catch (error) {
            console.error('Error saving cart to storage:', error);
        }
    }

    loadCartFromStorage() {
        try {
            const savedCart = localStorage.getItem('kazoku-cart');
            if (savedCart) {
                this.cart = JSON.parse(savedCart);
                this.updateCart();
            }
        } catch (error) {
            console.error('Error loading cart from storage:', error);
        }
    }

    // ===== ANIMATIONS =====
    setupRevealAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for reveal animations
        const elementsToReveal = document.querySelectorAll('.product-item, .section-title, .intro-text');
        elementsToReveal.forEach(el => revealObserver.observe(el));
    }

    // ===== GESTURE HANDLING =====
    handleSwipeLeft() {
        // Navigate to next category
        const activeBtn = document.querySelector('.menu-nav-btn.active');
        if (activeBtn) {
            const nextBtn = activeBtn.nextElementSibling;
            if (nextBtn && nextBtn.classList.contains('menu-nav-btn')) {
                nextBtn.click();
            }
        }
    }

    handleSwipeRight() {
        // Navigate to previous category
        const activeBtn = document.querySelector('.menu-nav-btn.active');
        if (activeBtn) {
            const prevBtn = activeBtn.previousElementSibling;
            if (prevBtn && prevBtn.classList.contains('menu-nav-btn')) {
                prevBtn.click();
            }
        }
    }

    // ===== KEYBOARD NAVIGATION =====
    enhanceTabNavigation() {
        // Add focus indicators for keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-navigation');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }

    handleArrowNavigation(direction) {
        const focusedElement = document.activeElement;
        if (focusedElement.classList.contains('product-item')) {
            const productItems = Array.from(document.querySelectorAll('.product-item'));
            const currentIndex = productItems.indexOf(focusedElement);
            
            if (direction === 'ArrowLeft' && currentIndex > 0) {
                productItems[currentIndex - 1].focus();
            } else if (direction === 'ArrowRight' && currentIndex < productItems.length - 1) {
                productItems[currentIndex + 1].focus();
            }
        }
    }

    // ===== FORM HANDLING =====
    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (this.validateFormData(data)) {
            this.submitForm(data);
        } else {
            this.showNotification('Por favor, completa todos los campos requeridos', 'error');
        }
    }

    validateFormData(data) {
        // Add validation logic here
        return true;
    }

    submitForm(data) {
        // Handle form submission
        console.log('Form submitted:', data);
        this.showNotification('Formulario enviado correctamente');
    }

    // ===== LOADING SCREEN =====
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.remove();
                }, 500);
            }, 2000);
        }
    }

    // ===== CLEANUP =====
    cleanup() {
        if (this.observer) {
            this.observer.disconnect();
        }
        
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }
    }
}

// ===== GLOBAL FUNCTIONS FOR HTML ONCLICK =====
window.toggleCart = () => {
    if (app) app.toggleCart();
};
window.togglePaymentModal = () => {
    if (app) app.togglePaymentModal();
};
window.toggleProductModal = () => {
    if (app) app.toggleProductModal();
};
window.toggleEditModal = () => {
    if (app) app.toggleEditModal();
};
window.toggleMapModal = () => {
    if (app) app.toggleMapModal();
};
window.clearCart = () => {
    if (app) app.clearCart();
};
window.addProductToCart = () => {
    if (app) app.addProductToCart();
};
window.confirmOrder = () => {
    if (app) app.confirmOrder();
};
window.scrollToSection = (sectionId) => {
    if (app) app.scrollToSection(sectionId);
};

// ===== INITIALIZE APP =====
let app;

document.addEventListener('DOMContentLoaded', () => {
    app = new KazokuIzakayaApp();
    
    // Fallback cart button handler in case the main setup fails
    const cartBtn = document.getElementById('floating-cart-btn');
    if (cartBtn && !cartBtn.hasAttribute('data-listener-added')) {
        cartBtn.setAttribute('data-listener-added', 'true');
        cartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Fallback cart button clicked');
            if (app && app.toggleCart) {
                app.toggleCart();
            } else {
                console.error('App not initialized or toggleCart method not available');
            }
        });
        
        cartBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Fallback cart button touched');
            if (app && app.toggleCart) {
                app.toggleCart();
            } else {
                console.error('App not initialized or toggleCart method not available');
            }
        });
    }
});

// ===== PWA INSTALL PROMPT =====
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // Show install button or notification
    const installBtn = document.createElement('button');
    installBtn.className = 'install-btn';
    installBtn.textContent = 'Instalar App';
    installBtn.onclick = () => {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    };
    
    document.body.appendChild(installBtn);
});

// ===== PERFORMANCE MONITORING =====
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart);
        }, 0);
    });
}
