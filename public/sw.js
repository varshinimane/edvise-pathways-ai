// Enhanced Service Worker for EdVise PWA - Comprehensive Offline Support
const CACHE_VERSION = 'edvise-v2.0.0';
const APP_CACHE = `edvise-app-${CACHE_VERSION}`;
const DATA_CACHE = `edvise-data-${CACHE_VERSION}`;
const RUNTIME_CACHE = `edvise-runtime-${CACHE_VERSION}`;
const FALLBACK_CACHE = `edvise-fallback-${CACHE_VERSION}`;

// Core app assets for offline functionality
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline',
  '/quiz',
  '/colleges',
  '/scholarships',
  '/timeline-tracker'
];

// Offline fallback pages
const OFFLINE_FALLBACKS = {
  document: '/offline.html',
  image: '/offline-image.svg',
  font: '/offline-font.woff2'
};

// Install event - cache core assets for offline functionality
self.addEventListener('install', (event) => {
  console.log('Service Worker installing with enhanced PWA support...');
  event.waitUntil(
    Promise.all([
      caches.open(APP_CACHE).then((cache) => {
        console.log('Caching core app assets');
        return cache.addAll(CORE_ASSETS.map(url => new Request(url, {cache: 'reload'})));
      }),
      caches.open(FALLBACK_CACHE).then((cache) => {
        console.log('Caching offline fallbacks');
        return cache.addAll([
          '/offline.html',
          '/offline-image.svg'
        ]);
      })
    ]).then(() => {
      console.log('Core assets cached successfully');
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and claim clients
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating with version:', CACHE_VERSION);
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(cacheName => !cacheName.includes(CACHE_VERSION))
            .map(cacheName => {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      }),
      // Claim all clients immediately
      self.clients.claim()
    ]).then(() => {
      console.log('Service Worker activated and claimed clients');
      // Notify all clients about the update
      return self.clients.matchAll().then((clients) => {
        clients.forEach((client) => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION,
            features: ['offline-support', 'background-sync', 'push-notifications']
          });
        });
      });
    })
  );
});

// Enhanced fetch event with comprehensive caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle API calls with network-first strategy and offline fallback
  if (url.hostname.includes('supabase.co') || 
      url.hostname.includes('api.') || 
      url.pathname.startsWith('/api/')) {
    event.respondWith(
      handleApiRequest(request)
    );
    return;
  }

  // Skip external domains (but cache same-origin requests)
  if (url.hostname !== location.hostname) {
    return;
  }

  // Handle navigation requests with cache-first for app shell
  if (request.mode === 'navigate') {
    event.respondWith(
      handleNavigationRequest(request)
    );
    return;
  }

  // Handle static assets with cache-first strategy
  if (url.pathname.match(/\.(js|css|png|jpg|jpeg|svg|ico|woff|woff2|ttf|eot)$/)) {
    event.respondWith(
      handleStaticAssetRequest(request)
    );
    return;
  }

  // Handle other requests with stale-while-revalidate
  event.respondWith(
    handleGenericRequest(request)
  );
});

// Network-first strategy for API calls with offline fallback
async function handleApiRequest(request) {
  const cacheKey = request.url + (request.body ? '#' + await hashRequestBody(request) : '');
  
  try {
    // Try network first
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DATA_CACHE);
      await cache.put(cacheKey, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    console.log('API request failed, checking cache:', request.url);
    const cachedResponse = await caches.match(cacheKey);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response if no cache available
    return new Response(
      JSON.stringify({ 
        error: 'Offline', 
        message: 'This data is not available offline',
        offline: true 
      }),
      { 
        status: 200,
        statusText: 'OK',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Cache-first strategy for navigation requests
async function handleNavigationRequest(request) {
  // Check cache first for app shell
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    // Update cache in background
    fetch(request).then(response => {
      if (response.ok) {
        caches.open(APP_CACHE).then(cache => cache.put(request, response.clone()));
      }
    }).catch(() => {});
    return cachedResponse;
  }

  try {
    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(APP_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Network failed, serve offline page
    console.log('Navigation request failed, serving offline page');
    const offlinePage = await caches.match('/offline.html');
    return offlinePage || new Response('Offline', { status: 200 });
  }
}

// Cache-first strategy for static assets
async function handleStaticAssetRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return fallback for images
    if (request.destination === 'image') {
      const fallbackImage = await caches.match('/offline-image.svg');
      return fallbackImage || new Response('', { status: 200 });
    }
    throw error;
  }
}

// Stale-while-revalidate strategy for generic requests
async function handleGenericRequest(request) {
  const cachedResponse = await caches.match(request);
  
  // Update cache in background
  const networkPromise = fetch(request).then(response => {
    if (response.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then(c => c.put(request, response.clone()));
    }
    return response;
  }).catch(() => null);

  // Return cached response immediately if available
  if (cachedResponse) {
    return cachedResponse;
  }

  // Otherwise wait for network
  return networkPromise || new Response('Not available offline', { status: 404 });
}

// Helper function to hash request body for caching POST requests
async function hashRequestBody(request) {
  try {
    const body = await request.clone().text();
    const encoder = new TextEncoder();
    const data = encoder.encode(body);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (error) {
    return 'no-body';
  }
}

// Background sync for offline actions and notifications
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  } else if (event.tag === 'timeline-notifications') {
    event.waitUntil(checkPendingNotifications());
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  let notificationData = {
    title: 'EdVise Timeline Tracker',
    body: 'You have an important deadline approaching',
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    actions: [
      { action: 'view', title: 'View Timeline', icon: '/calendar-icon.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/close-icon.png' }
    ],
    data: { url: '/timeline-tracker' }
  };

  if (event.data) {
    try {
      const pushData = event.data.json();
      notificationData = { ...notificationData, ...pushData };
    } catch (error) {
      console.error('Error parsing push data:', error);
    }
  }

  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      actions: notificationData.actions,
      data: notificationData.data,
      requireInteraction: true,
      tag: 'timeline-reminder'
    })
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'view' || !event.action) {
    // Open the timeline tracker page
    event.waitUntil(
      self.clients.matchAll({ type: 'window', includeUncontrolled: true })
        .then((clients) => {
          // Check if timeline tracker is already open
          const timelineClient = clients.find(client => 
            client.url.includes('/timeline-tracker')
          );

          if (timelineClient) {
            // Focus existing timeline tracker tab
            return timelineClient.focus();
          } else {
            // Open new timeline tracker tab
            return self.clients.openWindow('/timeline-tracker');
          }
        })
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification (already done above)
    console.log('Notification dismissed');
  }
});

// Notification close handling
self.addEventListener('notificationclose', (event) => {
  console.log('Notification closed:', event.notification.tag);
});

async function doBackgroundSync() {
  // Sync offline actions when back online
  console.log('Background sync triggered');
  // Implementation for syncing offline data
  try {
    // Sync any offline subscriptions or unsubscriptions
    await syncOfflineActions();
    console.log('Background sync completed');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

async function checkPendingNotifications() {
  console.log('Checking pending notifications...');
  try {
    // Get pending notifications from storage
    const pendingNotifications = await getPendingNotificationsFromStorage();
    const now = new Date();
    
    for (const notification of pendingNotifications) {
      const scheduledTime = new Date(notification.scheduled_for);
      
      if (scheduledTime <= now && notification.status === 'pending') {
        await showTimelineNotification(notification);
        await markNotificationAsSent(notification.id);
      }
    }
  } catch (error) {
    console.error('Error checking pending notifications:', error);
  }
}

async function showTimelineNotification(notification) {
  const notificationOptions = {
    body: notification.message,
    icon: '/icon-192.png',
    badge: '/badge-72.png',
    data: {
      eventId: notification.event_id,
      url: '/timeline-tracker',
      actionUrl: notification.data.action_url
    },
    actions: [
      { action: 'view', title: 'View Details' },
      { action: 'apply', title: 'Apply Now' },
      { action: 'dismiss', title: 'Dismiss' }
    ],
    requireInteraction: notification.type === 'deadline',
    tag: `timeline-${notification.event_id}`,
    timestamp: Date.now(),
    silent: false
  };

  return self.registration.showNotification(notification.title, notificationOptions);
}

async function getPendingNotificationsFromStorage() {
  // This would integrate with IndexedDB or other storage
  // For now, return empty array
  return [];
}

async function markNotificationAsSent(notificationId) {
  // Mark notification as sent in storage
  console.log('Marking notification as sent:', notificationId);
}

async function syncOfflineActions() {
  // Sync offline subscription/unsubscription actions
  console.log('Syncing offline actions...');
}

// Message handling from main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data.type === 'SCHEDULE_NOTIFICATION') {
    // Schedule a notification check
    setTimeout(() => {
      checkPendingNotifications();
    }, event.data.delay || 0);
  } else if (event.data.type === 'SYNC_NOTIFICATIONS') {
    // Force sync notifications
    event.waitUntil(checkPendingNotifications());
  }
});

// Periodic notification check (every minute)
setInterval(() => {
  checkPendingNotifications();
}, 60000);
