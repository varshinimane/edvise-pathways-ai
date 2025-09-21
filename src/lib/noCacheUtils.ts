// No-cache utilities to ensure fresh content loading
export const addTimestampToUrl = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}&_r=${Math.random()}`;
};

// Smart fetch override - only add cache busting to static assets, not API calls
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  try {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  
  // Don't modify API calls (Supabase, external APIs, CDNs, map tiles)
  if (url.includes('supabase.co') || 
      url.includes('/api/') || 
      url.includes('openstreetmap.org') || 
      url.includes('cdnjs.cloudflare.com') || 
      url.includes('tile.') ||
      (url.startsWith('http') && !url.includes(window.location.origin))) {
    return originalFetch(input, init);
  }
  
  // Don't modify same-origin API calls that might be data endpoints
  if (url.startsWith('/') && (url.includes('/api') || url.includes('.json') || url.includes('/data'))) {
    return originalFetch(input, init);
  }
  
  // Only add cache busting to static assets (JS, CSS, images)
  if (url.includes('.js') || url.includes('.css') || url.includes('.png') || url.includes('.jpg') || url.includes('.svg')) {
    const finalInput = typeof input === 'string' 
      ? addTimestampToUrl(input)
      : input instanceof URL 
        ? new URL(addTimestampToUrl(input.href))
        : new Request(addTimestampToUrl(input.url), input);
    
    return originalFetch(finalInput, init);
  }
  
  // For everything else, use original fetch without modification
  return originalFetch(input, init);
  } catch (error) {
    console.warn('Error in fetch override, falling back to original fetch:', error);
    return originalFetch(input, init);
  }
};

// Disable browser back/forward cache
export const disableBFCache = (): void => {
  window.addEventListener('beforeunload', () => {
    // This prevents the page from being cached for back/forward navigation
  });
  
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
      // Force reload if page was restored from cache
      window.location.reload();
    }
  });
};

// Force refresh on visibility change to ensure fresh content
export const setupVisibilityRefresh = (): void => {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      // Check if the page has been hidden for more than 5 minutes
      const lastVisible = parseInt(localStorage.getItem('lastVisible') || '0');
      const now = Date.now();
      
      if (now - lastVisible > 5 * 60 * 1000) { // 5 minutes
        console.log('🔄 Page was hidden for >5min, refreshing for fresh content');
        window.location.reload();
      }
    } else {
      localStorage.setItem('lastVisible', Date.now().toString());
    }
  });
};

// Initialize no-cache strategies
export const initializeNoCacheStrategy = (): void => {
  console.log('🚫 Initializing no-cache strategy...');
  
  disableBFCache();
  setupVisibilityRefresh();
  
  // Add no-cache meta tags if they don't exist
  const metaNoCache = document.createElement('meta');
  metaNoCache.setAttribute('http-equiv', 'Cache-Control');
  metaNoCache.setAttribute('content', 'no-cache, no-store, must-revalidate');
  
  const metaPragma = document.createElement('meta');
  metaPragma.setAttribute('http-equiv', 'Pragma');
  metaPragma.setAttribute('content', 'no-cache');
  
  const metaExpires = document.createElement('meta');
  metaExpires.setAttribute('http-equiv', 'Expires');
  metaExpires.setAttribute('content', '0');
  
  document.head.appendChild(metaNoCache);
  document.head.appendChild(metaPragma);
  document.head.appendChild(metaExpires);
  
  console.log('✅ No-cache strategy initialized');
};