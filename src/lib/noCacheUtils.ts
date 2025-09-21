// No-cache utilities to ensure fresh content loading
export const addTimestampToUrl = (url: string): string => {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}_t=${Date.now()}&_r=${Math.random()}`;
};

// Override fetch to add no-cache headers
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
  
  // Add cache-busting parameters to all requests
  const finalInput = typeof input === 'string' 
    ? addTimestampToUrl(input)
    : input instanceof URL 
      ? new URL(addTimestampToUrl(input.href))
      : new Request(addTimestampToUrl(input.url), input);

  const finalInit: RequestInit = {
    ...init,
    headers: {
      ...init?.headers,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };

  return originalFetch(finalInput, finalInit);
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