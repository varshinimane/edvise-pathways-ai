// Site configuration utilities
export const getSiteUrl = (): string => {
  // 1. Check for explicit environment variable first (most reliable)
  if (import.meta.env.VITE_SITE_URL) {
    console.log('🔧 Using VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);
    return import.meta.env.VITE_SITE_URL;
  }
  
  // 1.5. Dynamic production URL detection
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const origin = window.location.origin;
    
    // If we're on any Vercel deployment (not localhost), use the current origin
    if (hostname.includes('vercel.app') && !hostname.includes('localhost')) {
      console.log('🚀 Detected Vercel deployment:', hostname, '- using current origin:', origin);
      return origin;
    }
  }

  // 2. For runtime (browser), always use current origin if not localhost
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const origin = window.location.origin;
    
    console.log('🌐 Browser detected - hostname:', hostname, 'origin:', origin);
    
    // If we're NOT on localhost, use the current origin (this handles Vercel deployments)
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      console.log('✅ Using current origin for production:', origin);
      return origin;
    }
    
    // If we're on localhost, use the configured port
    const port = window.location.port || '8080';
    const localUrl = `http://${hostname}:${port}`;
    console.log('🏠 Using localhost URL:', localUrl);
    return localUrl;
  }

  // 3. Server-side: Check Vercel environment variables
  if (import.meta.env.VITE_VERCEL_URL) {
    const vercelUrl = `https://${import.meta.env.VITE_VERCEL_URL}`;
    console.log('🔧 Using VITE_VERCEL_URL:', vercelUrl);
    return vercelUrl;
  }

  // 4. Final fallback for development
  console.log('⚠️ Using fallback localhost URL');
  return 'http://localhost:8080';
};

export const getEmailRedirectUrl = (path: string = '/'): string => {
  const baseUrl = getSiteUrl();
  const fullPath = path.startsWith('/') ? path : `/${path}`;
  const redirectUrl = `${baseUrl}${fullPath}`;
  
  console.log('📧 Email redirect URL generated:');
  console.log('  Base URL:', baseUrl);
  console.log('  Path:', path);
  console.log('  Full Path:', fullPath);
  console.log('  Final Redirect URL:', redirectUrl);
  
  return redirectUrl;
};

// Helper to log the current configuration (useful for debugging)
export const logSiteConfig = (): void => {
  console.log('🌍 Site Configuration:');
  console.log('  Environment VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);
  console.log('  Environment VITE_VERCEL_URL:', import.meta.env.VITE_VERCEL_URL);
  console.log('  Current hostname:', typeof window !== 'undefined' ? window.location.hostname : 'N/A');
  console.log('  Current origin:', typeof window !== 'undefined' ? window.location.origin : 'N/A');
  console.log('  Resolved site URL:', getSiteUrl());
  console.log('  Email redirect URL:', getEmailRedirectUrl('/auth/callback'));
};

// Test function to verify URL generation is working correctly
export const testEmailRedirectGeneration = (): void => {
  console.log('🧪 Testing Email Redirect URL Generation:');
  console.log('  For /auth/callback:', getEmailRedirectUrl('/auth/callback'));
  console.log('  For / (home):', getEmailRedirectUrl('/'));
  console.log('  For dashboard:', getEmailRedirectUrl('/dashboard'));
  
  // Test that we're not generating localhost URLs in production
  const callbackUrl = getEmailRedirectUrl('/auth/callback');
  if (callbackUrl.includes('localhost') && typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    console.error('❌ ERROR: Generated localhost URL in production environment!');
    console.error('  Generated URL:', callbackUrl);
    console.error('  Current hostname:', window.location.hostname);
  } else {
    console.log('✅ URL generation looks correct');
  }
};
