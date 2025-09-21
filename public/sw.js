// public/sw.js - Service Worker with No-Cache Strategy
// This service worker prioritizes fresh content over caching
const CACHE_VERSION = 'no-cache-1.0.0';
const MINIMAL_CACHE = `edvise-minimal-${CACHE_VERSION}`;
// Only cache absolute essentials for offline fallback

// Minimal offline fallback assets only
const OFFLINE_FALLBACK_ASSETS = [
  '/index.html',
  '/manifest.json'
];

// Install event - minimal caching for offline fallback only
self.addEventListener('install', (event) => {
  console.log('Service Worker installing (no-cache strategy)...');
  event.waitUntil(
    caches.open(MINIMAL_CACHE)
      .then((cache) => {
        console.log('Caching minimal offline fallback assets');
        return cache.addAll(OFFLINE_FALLBACK_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating with version:', CACHE_VERSION);
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Delete any cache that doesn't match current version
            if (!cacheName.includes(CACHE_VERSION)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Cache cleanup complete, claiming clients');
        return self.clients.claim();
      })
      .then(() => {
        // Notify clients about the update
        return self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({ 
              type: 'CACHE_UPDATED', 
              version: CACHE_VERSION 
            });
          });
        });
      })
  );
});

// Fetch event - Let API calls pass through, only handle static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Let API calls pass through untouched (Supabase, external APIs)
  if (url.hostname.includes('supabase.co') || 
      url.hostname.includes('api.') || 
      url.pathname.startsWith('/api/') ||
      url.hostname !== location.hostname) {
    // Don't intercept API calls at all
    return;
  }

  // For navigation requests, always fetch fresh HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => response)
        .catch(() => {
          // Offline fallback for navigation only
          console.log('Network failed, serving offline fallback');
          return caches.match('/index.html');
        })
    );
    return;
  }

  // For static assets, fetch fresh but don't add aggressive headers
  event.respondWith(
    fetch(request)
      .then((response) => response)
      .catch(() => {
        return new Response('Asset not available', { 
          status: 404,
          statusText: 'Not Found'
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
