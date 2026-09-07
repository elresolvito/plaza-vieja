// ================================================================
// SERVICE WORKER - PLAZA VIEJA (CON ACTUALIZACIÓN FORZADA)
// ================================================================

const CACHE_NAME = 'plaza-vieja-v' + Date.now(); // <-- CACHE SIEMPRE NUEVA

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

// ================================================================
// INSTALACIÓN
// ================================================================

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('📦 Cacheando recursos...');
                return cache.addAll(urlsToCache);
            })
            .then(function() {
                console.log('✅ Cache completado. Versión:', CACHE_NAME);
                return self.skipWaiting(); // <-- ACTIVAR INMEDIATAMENTE
            })
            .catch(function(error) {
                console.log('⚠️ Error al cachear:', error);
            })
    );
});

// ================================================================
// ACTIVACIÓN - LIMPIAR CACHÉS VIEJOS Y FORZAR ACTUALIZACIÓN
// ================================================================

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.map(function(cacheName) {
                    // Eliminar todas las cachés que no sean la actual
                    if (cacheName !== CACHE_NAME) {
                        console.log('🗑️ Eliminando cache viejo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(function() {
            console.log('✅ Cache limpiado. Versión activa:', CACHE_NAME);
            // Forzar que el Service Worker tome el control de todas las pestañas
            return self.clients.claim();
        })
    );
});

// ================================================================
// FETCH - Buscar en caché primero, pero actualizar en segundo plano
// ================================================================

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                if (response) {
                    // Si está en caché, devolverlo y actualizar en segundo plano
                    fetch(event.request).then(function(networkResponse) {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then(function(cache) {
                                cache.put(event.request, networkResponse);
                            });
                        }
                    }).catch(function() {});
                    return response;
                }
                
                return fetch(event.request).then(function(response) {
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    
                    var responseToCache = response.clone();
                    caches.open(CACHE_NAME).then(function(cache) {
                        cache.put(event.request, responseToCache);
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

// ================================================================
// DETECTAR CAMBIOS Y NOTIFICAR A LA PÁGINA
// ================================================================

self.addEventListener('message', function(event) {
    if (event.data === 'checkForUpdate') {
        // Verificar si hay una nueva versión
        caches.keys().then(function(cacheNames) {
            var latestCache = cacheNames.sort().reverse()[0];
            if (latestCache !== CACHE_NAME) {
                console.log('🔄 Nueva versión disponible:', latestCache);
                self.skipWaiting();
                // Notificar a la página que hay una actualización
                self.clients.matchAll().then(function(clients) {
                    clients.forEach(function(client) {
                        client.postMessage('newVersionAvailable');
                    });
                });
            }
        });
    }
});
