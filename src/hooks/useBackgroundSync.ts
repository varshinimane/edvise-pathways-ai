import { useEffect, useCallback, useState } from 'react';
import { offlineStorage, BackgroundSyncAction } from '@/lib/offlineStorage';

interface BackgroundSyncState {
  isOnline: boolean;
  isSyncing: boolean;
  pendingActions: number;
  lastSyncTime: Date | null;
  syncError: string | null;
}

export const useBackgroundSync = () => {
  const [syncState, setSyncState] = useState<BackgroundSyncState>({
    isOnline: navigator.onLine,
    isSyncing: false,
    pendingActions: 0,
    lastSyncTime: null,
    syncError: null
  });

  // Queue action for background sync
  const queueAction = useCallback(async (
    type: BackgroundSyncAction['type'],
    data: any
  ): Promise<string> => {
    try {
      const actionId = await offlineStorage.addBackgroundSyncAction({
        type,
        data
      });

      // Update pending count
      const pendingActions = await offlineStorage.getPendingBackgroundSyncActions();
      setSyncState(prev => ({
        ...prev,
        pendingActions: pendingActions.length,
        syncError: null
      }));

      return actionId;
    } catch (error) {
      console.error('Failed to queue background sync action:', error);
      setSyncState(prev => ({
        ...prev,
        syncError: error instanceof Error ? error.message : 'Unknown error'
      }));
      throw error;
    }
  }, []);

  // Manually trigger sync
  const triggerSync = useCallback(async (): Promise<void> => {
    if (!navigator.onLine) {
      setSyncState(prev => ({
        ...prev,
        syncError: 'Cannot sync while offline'
      }));
      return;
    }

    setSyncState(prev => ({ ...prev, isSyncing: true, syncError: null }));

    try {
      await offlineStorage.processBackgroundSync();
      const pendingActions = await offlineStorage.getPendingBackgroundSyncActions();
      
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        pendingActions: pendingActions.length,
        lastSyncTime: new Date()
      }));
    } catch (error) {
      console.error('Background sync failed:', error);
      setSyncState(prev => ({
        ...prev,
        isSyncing: false,
        syncError: error instanceof Error ? error.message : 'Sync failed'
      }));
    }
  }, []);

  // Get pending actions count
  const updatePendingCount = useCallback(async () => {
    try {
      const pendingActions = await offlineStorage.getPendingBackgroundSyncActions();
      setSyncState(prev => ({
        ...prev,
        pendingActions: pendingActions.length
      }));
    } catch (error) {
      console.error('Failed to get pending actions:', error);
    }
  }, []);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setSyncState(prev => ({ ...prev, isOnline: true }));
      // Auto-trigger sync when coming back online
      setTimeout(() => {
        triggerSync();
      }, 1000);
    };

    const handleOffline = () => {
      setSyncState(prev => ({ 
        ...prev, 
        isOnline: false,
        isSyncing: false 
      }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [triggerSync]);

  // Service Worker message handling
  useEffect(() => {
    const handleSWMessage = (event: MessageEvent) => {
      if (event.data.type === 'BACKGROUND_SYNC_COMPLETE') {
        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          lastSyncTime: new Date(),
          pendingActions: event.data.remainingActions || 0
        }));
      } else if (event.data.type === 'BACKGROUND_SYNC_ERROR') {
        setSyncState(prev => ({
          ...prev,
          isSyncing: false,
          syncError: event.data.error
        }));
      }
    };

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', handleSWMessage);
      
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSWMessage);
      };
    }
  }, []);

  // Initialize pending count
  useEffect(() => {
    updatePendingCount();
  }, [updatePendingCount]);

  // Setup sync completion callback
  useEffect(() => {
    const handleSyncComplete = () => {
      updatePendingCount();
    };

    offlineStorage.onSyncComplete(handleSyncComplete);

    return () => {
      offlineStorage.offSyncComplete(handleSyncComplete);
    };
  }, [updatePendingCount]);

  return {
    ...syncState,
    queueAction,
    triggerSync,
    updatePendingCount
  };
};

// Specialized hooks for common sync actions
export const useQuizSync = () => {
  const { queueAction } = useBackgroundSync();

  const syncQuizResults = useCallback(async (quizData: any) => {
    return queueAction('quiz_submission', quizData);
  }, [queueAction]);

  return { syncQuizResults };
};

export const useScholarshipSync = () => {
  const { queueAction } = useBackgroundSync();

  const syncSavedScholarship = useCallback(async (scholarshipData: any) => {
    return queueAction('scholarship_save', scholarshipData);
  }, [queueAction]);

  return { syncSavedScholarship };
};

export const useNotificationSync = () => {
  const { queueAction } = useBackgroundSync();

  const syncNotificationPreferences = useCallback(async (preferences: any) => {
    return queueAction('notification_subscribe', preferences);
  }, [queueAction]);

  return { syncNotificationPreferences };
};