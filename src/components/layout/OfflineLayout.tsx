import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { OfflineIndicator } from '../offline/OfflineIndicator';
import { InstallPrompt } from '../pwa/InstallPrompt';
import { useBackgroundSync } from '@/hooks/useBackgroundSync';
import { useOfflineData } from '@/hooks/useOfflineData';
import { CachedContentIndicator } from '../offline/CachedContentIndicator';
import { RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface OfflineLayoutProps {
  children?: React.ReactNode;
}

export const OfflineLayout: React.FC<OfflineLayoutProps> = ({ children }) => {
  const [showSyncStatus, setShowSyncStatus] = useState(false);
  const { 
    isOnline, 
    isSyncing, 
    pendingActions, 
    lastSyncTime, 
    syncError,
    triggerSync 
  } = useBackgroundSync();
  
  const { 
    isInitialized, 
    isLoading: isOfflineDataLoading, 
    error: offlineDataError 
  } = useOfflineData();

  // Auto-hide sync status after showing success
  useEffect(() => {
    if (showSyncStatus && !isSyncing && !syncError) {
      const timer = setTimeout(() => {
        setShowSyncStatus(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSyncStatus, isSyncing, syncError]);

  // Show sync status when sync starts
  useEffect(() => {
    if (isSyncing) {
      setShowSyncStatus(true);
    }
  }, [isSyncing]);

  const handleSyncClick = () => {
    setShowSyncStatus(true);
    triggerSync();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Offline indicator - fixed position */}
      <OfflineIndicator variant="badge" />
      
      {/* PWA install prompt */}
      <InstallPrompt />
      
      {/* Sync status bar */}
      {showSyncStatus && (pendingActions > 0 || isSyncing || syncError) && (
        <div className="fixed top-16 left-4 right-4 z-40">
          <div className={`p-3 rounded-lg shadow-lg border ${
            syncError 
              ? 'bg-red-50 border-red-200 text-red-800' 
              : isSyncing 
                ? 'bg-blue-50 border-blue-200 text-blue-800'
                : 'bg-green-50 border-green-200 text-green-800'
          }`}>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {syncError ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : isSyncing ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm">
                  {syncError 
                    ? 'Sync failed' 
                    : isSyncing 
                      ? 'Syncing data...' 
                      : 'Sync completed'
                  }
                </div>
                <div className="text-xs opacity-75">
                  {syncError 
                    ? syncError
                    : isSyncing 
                      ? `${pendingActions} actions pending`
                      : `${pendingActions} actions remaining`
                  }
                </div>
              </div>
              
              {syncError && isOnline && (
                <button
                  onClick={handleSyncClick}
                  className="px-3 py-1 text-xs font-medium bg-white border border-current rounded-md hover:bg-gray-50"
                >
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Offline data loading indicator */}
      {isOfflineDataLoading && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-blue-600 text-white">
          <div className="flex items-center justify-center gap-2 p-2 text-sm">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Preparing offline content...</span>
          </div>
        </div>
      )}
      
      {/* Offline data error */}
      {offlineDataError && (
        <div className="fixed top-0 left-0 right-0 z-30 bg-red-600 text-white">
          <div className="flex items-center justify-center gap-2 p-2 text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Failed to initialize offline data: {offlineDataError}</span>
          </div>
        </div>
      )}
      
      {/* App header with offline status */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-bold text-gray-900">EdVise Pathways</h1>
              {!isOnline && (
                <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                  Offline Mode
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4">
              {pendingActions > 0 && (
                <button
                  onClick={handleSyncClick}
                  disabled={isSyncing || !isOnline}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  title={`${pendingActions} actions pending sync`}
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {pendingActions}
                </button>
              )}
              
              <OfflineIndicator variant="compact" showText={false} />
            </div>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Global cached content indicator */}
        {!isOnline && isInitialized && (
          <div className="mb-6">
            <CachedContentIndicator
              content="colleges"
              variant="banner"
              className="mb-4"
            />
          </div>
        )}
        
        {children || <Outlet />}
      </main>
      
      {/* Service Worker status */}
      <ServiceWorkerStatus />
    </div>
  );
};

// Component to show Service Worker status and updates
const ServiceWorkerStatus: React.FC = () => {
  const [swStatus, setSWStatus] = useState<'checking' | 'updated' | 'error' | null>(null);
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const handleSWMessage = (event: MessageEvent) => {
        if (event.data.type === 'SW_UPDATED') {
          setSWStatus('updated');
          setShowUpdate(true);
        } else if (event.data.type === 'SW_ERROR') {
          setSWStatus('error');
        }
      };

      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      
      // Check for service worker updates
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration) {
          registration.addEventListener('updatefound', () => {
            setSWStatus('checking');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  setSWStatus('updated');
                  setShowUpdate(true);
                }
              });
            }
          });
        }
      });

      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      };
    }
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleDismiss = () => {
    setShowUpdate(false);
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg text-blue-600">
            <RefreshCw className="w-5 h-5" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-sm">
              App Updated
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              A new version of EdVise is available with improved offline features.
            </p>
            
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={handleRefresh}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Refresh App
              </button>
              
              <button
                onClick={handleDismiss}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Later
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};