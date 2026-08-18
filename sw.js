// ================================================================
// SERVICE WORKER - PLAZA VIEJA
// Permite que la app funcione offline y se instale
// ================================================================

const CACHE_NAME = 'plaza-vieja-v1.0';
const urlsToCache = [
  '/plaza-vieja/',
  '/plaza-vieja/index.html',
  '/plaza-vieja/script.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Instalación: cachear recursos estáticos
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

// Activación: limpiar caches viejos
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Cache viejo eliminado:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Estrategia: Cache First con fallback a red
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - devolver respuesta
        if (response) {
          return response;
        }
        
        // Clonar la solicitud porque puede ser usada una vez
        var fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(function(response) {
          // Verificar si es una respuesta válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clonar la respuesta porque puede ser usada una vez
          var responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(function(cache) {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(function() {
          // Si falla la red, mostrar página offline
          return caches.match('/plaza-vieja/offline.html');
        });
      })
  );
});

// Sincronización en segundo plano para pedidos pendientes
self.addEventListener('sync', function(event) {
  if (event.tag === 'sync-orders') {
    event.waitUntil(syncOrders());
  }
});

function syncOrders() {
  return new Promise(function(resolve, reject) {
    // Aquí se podría implementar sincronización de pedidos pendientes
    console.log('Sincronizando pedidos pendientes...');
    resolve();
  });
}
