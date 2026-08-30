// ================================================================
// SERVICE WORKER - PLAZA VIEJA (CON ACTUALIZACIÓN AUTOMÁTICA)
// ================================================================

const CACHE_NAME = 'plaza-vieja-v12';
const urlsToCache = [
    '/plaza-vieja/',
    '/plaza-vieja/index.html',
    '/plaza-vieja/script.js',
    '/plaza-vieja/manifest.json',
    'productos/favicon_io/android-chrome-192x192.png',
    'productos/favicon_io/android-chrome-512x512.png',
    'productos/favicon_io/apple-touch-icon.png',
    'productos/favicon_io/favicon-32x32.png',
    'productos/favicon_io/favicon-16x16.png',
    'productos/favicon_io/favicon.ico',
    'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

const productImages = [
    'productos/chorizo-extra-1.6kg-17000.png',
    'productos/jamon-serrano-5lb-49000.png',
    'productos/jamon-rapido-2kg-10000.png',
    'productos/jamon-barra-2kg-10000.png',
    'productos/beicon-laminado-1kg-9000.png',
    'productos/beicon-laminado-2kg-17000.png',
    'productos/beicon-troceado-3kg-17000.png',
    'productos/beicon-molde-5kg-29000.png',
    'productos/gouda-aleman-3.1kg-20500.png',
    'productos/gouda-holandes-3.1kg-21500.png',
    'productos/queso-azul-3kg-31000.png',
    'productos/queso-cabra-miel-3.5kg-25000.png'
];

const allUrlsToCache = urlsToCache.concat(productImages);

// INSTALACIÓN
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Cacheando recursos...');
                return cache.addAll(allUrlsToCache);
            })
            .then(function() {
                console.log('✅ Cache completado');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.log('⚠️ Error al cachear:', error);
            })
    );
});

// ACTIVACIÓN - Limpiar caches viejos
self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('✅ Service Worker activado');
            return self.clients.claim();
        })
    );
});

// FETCH - Ignorando extensiones de Chrome
self.addEventListener('fetch', function(event) {
    if (event.request.url.startsWith('chrome-extension://')) {
        return;
    }
    
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    return response;
                }
                
                return fetch(event.request).then(function(response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            try {
                                cache.put(event.request, responseToCache);
                            } catch (e) {}
                        });
                    
                    return response;
                }).catch(function() {
                    return new Response('⚠️ Sin conexión', {
                        status: 503,
                        statusText: 'Offline'
                    });
                });
            })
    );
});

// ACTUALIZACIÓN AUTOMÁTICA
self.addEventListener('message', function(event) {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});
