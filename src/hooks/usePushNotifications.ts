import { useState, useEffect, useCallback } from 'react';

interface NotificationPermission {
  permission: 'default' | 'granted' | 'denied';
  isSupported: boolean;
}

interface PushNotificationHook {
  permission: NotificationPermission;
  isSubscribed: boolean;
  subscription: PushSubscription | null;
  requestPermission: () => Promise<boolean>;
  subscribe: () => Promise<PushSubscription | null>;
  unsubscribe: () => Promise<boolean>;
  sendTestNotification: (title: string, message: string) => void;
  scheduleLocalNotification: (title: string, message: string, delay: number) => number;
  clearLocalNotification: (id: number) => void;
}

// VAPID public key - In production, this should come from environment variables
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa40HI80NM9f53NXYIKLuxaWUXVrq8-_tHtLl3zUv8xELgtKEWp1VYAkwJ8zl0';

export const usePushNotifications = (): PushNotificationHook => {
  const [permission, setPermission] = useState<NotificationPermission>({
    permission: 'default',
    isSupported: false
  });
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  // Check initial support and permission
  useEffect(() => {
    const checkSupport = async () => {
      const isSupported = 
        'Notification' in window && 
        'serviceWorker' in navigator && 
        'PushManager' in window;

      const currentPermission = isSupported ? Notification.permission : 'denied';
      
      setPermission({
        permission: currentPermission as 'default' | 'granted' | 'denied',
        isSupported
      });

      // Check for existing subscription
      if (isSupported && 'serviceWorker' in navigator) {
        try {
          const registration = await navigator.serviceWorker.getRegistration();
          if (registration) {
            const existingSubscription = await registration.pushManager.getSubscription();
            if (existingSubscription) {
              setSubscription(existingSubscription);
              setIsSubscribed(true);
            }
          }
        } catch (error) {
          console.error('Error checking existing subscription:', error);
        }
      }
    };

    checkSupport();
  }, []);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!permission.isSupported) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(prev => ({ ...prev, permission: result as any }));
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [permission.isSupported]);

  // Subscribe to push notifications
  const subscribe = useCallback(async (): Promise<PushSubscription | null> => {
    if (!permission.isSupported || permission.permission !== 'granted') {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (!registration) {
        console.error('Service worker not registered');
        return null;
      }

      // Convert VAPID key to Uint8Array
      const applicationServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);

      const pushSubscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey
      });

      setSubscription(pushSubscription);
      setIsSubscribed(true);

      // Send subscription to server (implement your API endpoint)
      await sendSubscriptionToServer(pushSubscription);

      return pushSubscription;
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
      return null;
    }
  }, [permission]);

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async (): Promise<boolean> => {
    if (!subscription) {
      return true;
    }

    try {
      const success = await subscription.unsubscribe();
      if (success) {
        setSubscription(null);
        setIsSubscribed(false);
        
        // Remove subscription from server
        await removeSubscriptionFromServer(subscription);
      }
      return success;
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
      return false;
    }
  }, [subscription]);

  // Send test notification (local)
  const sendTestNotification = useCallback((title: string, message: string) => {
    if (permission.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/icon.svg',
        badge: '/icon.svg',
        tag: 'test-notification'
      });
    }
  }, [permission.permission]);

  // Schedule local notification
  const scheduleLocalNotification = useCallback((
    title: string, 
    message: string, 
    delay: number
  ): number => {
    const timeoutId = window.setTimeout(() => {
      if (permission.permission === 'granted') {
        new Notification(title, {
          body: message,
          icon: '/icon.svg',
          badge: '/icon.svg',
          tag: `scheduled-${Date.now()}`
        });
      }
    }, delay);

    return timeoutId;
  }, [permission.permission]);

  // Clear scheduled notification
  const clearLocalNotification = useCallback((id: number) => {
    clearTimeout(id);
  }, []);

  return {
    permission,
    isSubscribed,
    subscription,
    requestPermission,
    subscribe,
    unsubscribe,
    sendTestNotification,
    scheduleLocalNotification,
    clearLocalNotification
  };
};

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Server communication functions
async function sendSubscriptionToServer(subscription: PushSubscription): Promise<void> {
  console.log('Storing subscription locally:', subscription);
  // Store in localStorage as fallback for demo
  localStorage.setItem('push-subscription', JSON.stringify(subscription.toJSON()));
  
  // In production, send to your backend:
  try {
    const response = await fetch('/api/notifications/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON())
    });
    if (!response.ok) {
      console.warn('Failed to send subscription to server, using local storage fallback');
    }
  } catch (error) {
    console.warn('Server unavailable, using local storage fallback:', error);
  }
}

async function removeSubscriptionFromServer(subscription: PushSubscription): Promise<void> {
  console.log('Removing subscription from local storage:', subscription);
  localStorage.removeItem('push-subscription');
  
  // In production, remove from your backend:
  try {
    const response = await fetch('/api/notifications/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription.toJSON())
    });
    if (!response.ok) {
      console.warn('Failed to remove subscription from server');
    }
  } catch (error) {
    console.warn('Server unavailable when removing subscription:', error);
  }
}

// Specialized hook for timeline notifications
export const useTimelineNotifications = () => {
  const {
    permission,
    requestPermission,
    subscribe,
    scheduleLocalNotification,
    clearLocalNotification
  } = usePushNotifications();

  const [scheduledNotifications, setScheduledNotifications] = useState<Map<string, number>>(new Map());

  const scheduleDeadlineNotification = useCallback(async (
    deadline: {
      id: string;
      title: string;
      date: Date;
      type: 'application' | 'exam' | 'scholarship' | 'interview';
    }
  ): Promise<boolean> => {
    if (permission.permission !== 'granted') {
      const granted = await requestPermission();
      if (!granted) return false;
    }

    const now = new Date();
    const deadlineTime = new Date(deadline.date);
    
    // Schedule notifications for different time intervals
    const intervals = [
      { days: 7, label: '1 week before' },
      { days: 3, label: '3 days before' },
      { days: 1, label: '1 day before' },
      { hours: 2, label: '2 hours before' }
    ];

    intervals.forEach(interval => {
      const notificationTime = new Date(deadlineTime);
      
      if ('days' in interval) {
        notificationTime.setDate(notificationTime.getDate() - interval.days);
      } else {
        notificationTime.setHours(notificationTime.getHours() - interval.hours);
      }

      if (notificationTime > now) {
        const delay = notificationTime.getTime() - now.getTime();
        const notificationId = scheduleLocalNotification(
          `${deadline.title} - ${interval.label}`,
          `Don't forget: ${deadline.title} is due on ${deadlineTime.toLocaleDateString()}`,
          delay
        );

        const key = `${deadline.id}-${interval.label}`;
        setScheduledNotifications(prev => new Map(prev).set(key, notificationId));
      }
    });

    return true;
  }, [permission, requestPermission, scheduleLocalNotification]);

  const cancelDeadlineNotifications = useCallback((deadlineId: string) => {
    const notificationsToCancel = Array.from(scheduledNotifications.entries())
      .filter(([key]) => key.startsWith(`${deadlineId}-`));

    notificationsToCancel.forEach(([key, notificationId]) => {
      clearLocalNotification(notificationId);
      setScheduledNotifications(prev => {
        const newMap = new Map(prev);
        newMap.delete(key);
        return newMap;
      });
    });
  }, [scheduledNotifications, clearLocalNotification]);

  return {
    scheduleDeadlineNotification,
    cancelDeadlineNotifications,
    scheduledNotifications: scheduledNotifications.size
  };
};