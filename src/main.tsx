import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { useOfflineData } from '@/hooks/useOfflineData'
import { initializeNoCacheStrategy } from '@/lib/noCacheUtils'
import App from './App.tsx'
import './index.css'

// Initialize no-cache strategy immediately
initializeNoCacheStrategy();

const queryClient = new QueryClient()

// Register service worker for offline fallback only
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('✨ Service Worker registered (no-cache mode):', registration);
      })
      .catch((registrationError) => {
        console.warn('⚠️ Service Worker registration failed:', registrationError);
      });
  });
}

function AppWithProviders() {
  const { isInitialized } = useOfflineData();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Initializing offline data...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithProviders />
  </StrictMode>,
)