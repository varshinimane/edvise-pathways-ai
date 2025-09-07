// public/sw.js - Service Worker for PWA
const CACHE_NAME = 'edvise-v1';
const STATIC_CACHE = 'edvise-static-v1';
const DATA_CACHE = 'edvise-data-v1';

// Static assets to cache
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/quiz',
  '/recommendations',
  '/colleges',
  '/scholarships',
  '/profile',
  '/auth',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/colleges',
  '/api/scholarships',
  '/api/recommendations'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DATA_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      caches.open(DATA_CACHE)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              if (response) {
                // Return cached data immediately
                return response;
              }
              
              // Fetch from network
              return fetch(request)
                .then((networkResponse) => {
                  // Cache successful responses
                  if (networkResponse.ok) {
                    cache.put(request, networkResponse.clone());
                  }
                  return networkResponse;
                })
                .catch(() => {
                  // Return offline fallback for API requests
                  return new Response(
                    JSON.stringify({ 
                      error: 'Offline', 
                      message: 'No internet connection. Using cached data.' 
                    }),
                    { 
                      status: 200,
                      headers: { 'Content-Type': 'application/json' }
                    }
                  );
                });
            });
        })
    );
    return;
  }

  // Handle static assets
  event.respondWith(
    caches.match(request)
      .then((response) => {
        if (response) {
          return response;
        }
        
        return fetch(request)
          .then((networkResponse) => {
            if (networkResponse.ok) {
              const responseClone = networkResponse.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/');
            }
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Sync offline actions when back online
  console.log('Background sync triggered');
  // Implementation for syncing offline data
}
