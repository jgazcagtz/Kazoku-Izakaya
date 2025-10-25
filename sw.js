// Service Worker for Kazoku Izakaya PWA
const CACHE_NAME = 'kazoku-izakaya-v1.0.0';
const STATIC_CACHE = 'static-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-v1.0.0';

// Files to cache for offline functionality
const STATIC_FILES = [
    '/',
    '/index.html',
    '/styles.css',
    '/script.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
    'https://i.imgur.com/m6xHJP8.png',
    'https://i.imgur.com/vLBB4FM.png'
];

// Product images to cache
const PRODUCT_IMAGES = [
    'https://i.imgur.com/DSOwAfw.png',
    'https://i.imgur.com/Jhf3oO6.png',
    'https://i.imgur.com/eusN3Bt.png',
    'https://i.imgur.com/wc2orxe.png',
    'https://i.imgur.com/aF9yIXx.png',
    'https://i.imgur.com/LBrhsUp.png',
    'https://i.imgur.com/fYGAy63.png',
    'https://i.imgur.com/KDJ4vmf.png',
    'https://i.imgur.com/cJRM3XV.png',
    'https://i.imgur.com/dYG06Vn.png',
    'https://i.imgur.com/hTljGud.png'
];

// Install event - cache static files
self.addEventListener('install', event => {
    console.log('Service Worker: Installing...');
    
    event.waitUntil(
        Promise.all([
            caches.open(STATIC_CACHE).then(cache => {
                console.log('Service Worker: Caching static files');
                return cache.addAll(STATIC_FILES);
            }),
            caches.open(DYNAMIC_CACHE).then(cache => {
                console.log('Service Worker: Caching product images');
                return cache.addAll(PRODUCT_IMAGES);
            })
        ]).then(() => {
            console.log('Service Worker: Installation complete');
            return self.skipWaiting();
        })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('Service Worker: Activating...');
    
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activation complete');
            return self.clients.claim();
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Handle different types of requests
    if (url.pathname === '/' || url.pathname === '/index.html') {
        // Serve main page from cache
        event.respondWith(
            caches.match('/index.html').then(response => {
                return response || fetch(request);
            })
        );
    } else if (url.pathname.endsWith('.css') || url.pathname.endsWith('.js')) {
        // Serve static assets from cache
        event.respondWith(
            caches.match(request).then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(request).then(fetchResponse => {
                    const responseClone = fetchResponse.clone();
                    caches.open(STATIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                    return fetchResponse;
                });
            })
        );
    } else if (url.hostname === 'i.imgur.com' || url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
        // Handle external resources (images, fonts)
        event.respondWith(
            caches.match(request).then(response => {
                if (response) {
                    return response;
                }
                
                return fetch(request).then(fetchResponse => {
                    if (fetchResponse.status === 200) {
                        const responseClone = fetchResponse.clone();
                        const cacheToUse = url.hostname === 'i.imgur.com' ? DYNAMIC_CACHE : STATIC_CACHE;
                        caches.open(cacheToUse).then(cache => {
                            cache.put(request, responseClone);
                        });
                    }
                    return fetchResponse;
                }).catch(() => {
                    // Return offline fallback for images
                    if (url.hostname === 'i.imgur.com') {
                        return new Response(
                            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#1a1a1a"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="#d4af37" font-family="Arial, sans-serif" font-size="14">Imagen no disponible</text></svg>',
                            { headers: { 'Content-Type': 'image/svg+xml' } }
                        );
                    }
                });
            })
        );
    } else {
        // For other requests, try network first, then cache
        event.respondWith(
            fetch(request).then(response => {
                if (response.status === 200) {
                    const responseClone = response.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            }).catch(() => {
                return caches.match(request);
            })
        );
    }
});

// Background sync for cart data
self.addEventListener('sync', event => {
    if (event.tag === 'cart-sync') {
        console.log('Service Worker: Syncing cart data...');
        event.waitUntil(syncCartData());
    }
});

// Push notifications
self.addEventListener('push', event => {
    console.log('Service Worker: Push received');
    
    const options = {
        body: event.data ? event.data.text() : 'Nueva actualización disponible',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver Menú',
                icon: '/icons/action-menu.png'
            },
            {
                action: 'close',
                title: 'Cerrar',
                icon: '/icons/action-close.png'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification('Kazoku Izakaya', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    console.log('Service Worker: Notification clicked');
    
    event.notification.close();
    
    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('/#menu')
        );
    } else if (event.action === 'close') {
        // Just close the notification
        return;
    } else {
        // Default action - open the app
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

// Helper function to sync cart data
async function syncCartData() {
    try {
        // Get cart data from IndexedDB or localStorage
        const cartData = await getCartData();
        
        if (cartData && cartData.length > 0) {
            // Here you would typically send the cart data to your server
            console.log('Service Worker: Syncing cart data:', cartData);
            
            // For now, just log the data
            // In a real implementation, you would make a fetch request to your API
            return Promise.resolve();
        }
    } catch (error) {
        console.error('Service Worker: Error syncing cart data:', error);
    }
}

// Helper function to get cart data from storage
async function getCartData() {
    return new Promise((resolve) => {
        // Try to get from localStorage first
        const cartData = localStorage.getItem('kazoku-cart');
        if (cartData) {
            resolve(JSON.parse(cartData));
        } else {
            resolve([]);
        }
    });
}

// Message handler for communication with main thread
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_PRODUCT_IMAGES') {
        event.waitUntil(
            caches.open(DYNAMIC_CACHE).then(cache => {
                return cache.addAll(PRODUCT_IMAGES);
            })
        );
    }
});

// Periodic background sync (if supported)
self.addEventListener('periodicsync', event => {
    if (event.tag === 'cart-background-sync') {
        event.waitUntil(syncCartData());
    }
});

console.log('Service Worker: Loaded successfully');
