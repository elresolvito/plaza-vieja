// ================================================================
// SERVICE WORKER - PLAZA VIEJA
// ================================================================

const CACHE_NAME = 'plaza-vieja-v1.2';
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

// Instalación
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('📦 Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
      .catch(function(error) {
        console.log('⚠️ Error al cachear:', error);
      })
  );
});

// Activación
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Cache viejo eliminado:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch: Cache First (excepto imágenes de productos)
self.addEventListener('fetch', function(event) {
  // No cachear imágenes de productos (para que se actualicen)
  if (event.request.url.includes('/productos/') && 
      !event.request.url.includes('favicon_io')) {
    event.respondWith(fetch(event.request));
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              try {
                cache.put(event.request, responseToCache);
              } catch (e) {
                // Ignorar errores de caché
              }
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
