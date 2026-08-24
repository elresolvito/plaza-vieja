// ================================================================
// SERVICE WORKER - PLAZA VIEJA (CON CACHÉ DE PRODUCTOS)
// ================================================================

const CACHE_NAME = 'plaza-vieja-v2.0';
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

// LISTA DE IMÁGENES DE PRODUCTOS PARA CACHEAR
const productImages = [
    'productos/chorizo-extra-1.6kg-17000.png',
    'productos/jamon-serrano-5lb-49000.png',
    'productos/jamon-rapido-2kg-9000.png',
    'productos/jamon-barra-2kg-9000.png',
    'productos/beicon-laminado-1kg-9000.png',
    'productos/beicon-laminado-2kg-17000.png',
    'productos/beicon-troceado-3kg-17000.png',
    'productos/beicon-molde-5kg-29000.png',
    'productos/gouda-aleman-3.1kg-20500.png',
    'productos/gouda-holandes-3.1kg-21500.png',
    'productos/queso-azul-3kg-31000.png',
    'productos/queso-cabra-miel-3.5kg-25000.png'
];

// Unir todas las URLs para cachear
const allUrlsToCache = urlsToCache.concat(productImages);

// ================================================================
// INSTALACIÓN - Cachear todo
// ================================================================

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Cacheando todos los recursos...');
                return cache.addAll(allUrlsToCache);
            })
            .then(function() {
                console.log('✅ Todos los recursos cacheados correctamente');
                return self.skipWaiting();
            })
            .catch(function(error) {
                console.log('⚠️ Error al cachear:', error);
            })
    );
});

// ================================================================
// ACTIVACIÓN - Limpiar caches viejos
// ================================================================

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('✅ Service Worker activado y listo');
            return self.clients.claim();
        })
    );
});

// ================================================================
// FETCH - Estrategia: Cache First (Muy rápido)
// ================================================================

self.addEventListener('fetch', function(event) {
    // Estrategia: Cache First - Buscar en caché primero
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Si está en caché, devolverlo (MUY RÁPIDO)
                if (response) {
                    return response;
                }
                
                // Si no está en caché, buscar en la red
                var fetchRequest = event.request.clone();
                
                return fetch(fetchRequest).then(function(response) {
                    // Verificar si es una respuesta válida
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    // Clonar la respuesta para cachearla
                    var responseToCache = response.clone();
                    
                    // Guardar en caché para futuras visitas
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                            try {
                                cache.put(event.request, responseToCache);
                                console.log('📦 Nuevo recurso cacheado:', event.request.url);
                            } catch (e) {
                                // Ignorar errores
                            }
                        });
                    
                    return response;
                }).catch(function() {
                    // Si offline y no está en caché
                    return new Response('⚠️ Sin conexión a internet', {
                        status: 503,
                        statusText: 'Service Unavailable'
                    });
                });
            })
    );
});

// ================================================================
// ACTUALIZACIÓN AUTOMÁTICA - Cuando hay cambios
// ================================================================

self.addEventListener('message', function(event) {
    if (event.data === 'skipWaiting') {
        self.skipWaiting();
    }
});

// ================================================================
// SINCERONIZACIÓN - Para pedidos pendientes (opcional)
// ================================================================

self.addEventListener('sync', function(event) {
    if (event.tag === 'sync-orders') {
        event.waitUntil(
            // Aquí se podría implementar sincronización de pedidos pendientes
            console.log('🔄 Sincronizando pedidos pendientes...')
        );
    }
});
