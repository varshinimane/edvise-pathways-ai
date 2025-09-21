// Site configuration utilities
export const getSiteUrl = (): string => {
  // 1. Check for explicit environment variable first (most reliable)
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }

  // 2. Check if we're running in Vercel (production)
  if (import.meta.env.VITE_VERCEL_URL) {
    return `https://${import.meta.env.VITE_VERCEL_URL}`;
  }

  // 3. Check for common Vercel environment variables
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If we're on a Vercel deployment
    if (hostname.includes('vercel.app') || hostname.includes('vercel.dev')) {
      return `https://${hostname}`;
    }
    
    // If we're on localhost
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:${window.location.port || '8080'}`;
    }
    
    // For any other custom domain
    return window.location.origin;
  }

  // 4. Final fallback (shouldn't reach here in normal operation)
  return 'http://localhost:8080';
};

export const getEmailRedirectUrl = (path: string = '/'): string => {
  const baseUrl = getSiteUrl();
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Helper to log the current configuration (useful for debugging)
export const logSiteConfig = (): void => {
  console.log('🌐 Site Configuration:');
  console.log('  Environment VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);
  console.log('  Environment VITE_VERCEL_URL:', import.meta.env.VITE_VERCEL_URL);
  console.log('  Current origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
  console.log('  Resolved site URL:', getSiteUrl());
  console.log('  Email redirect URL:', getEmailRedirectUrl());
};