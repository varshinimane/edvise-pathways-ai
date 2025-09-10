// Notification Service for Timeline Tracker
export interface NotificationData {
  id: string;
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: any;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  timestamp?: number;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

class NotificationService {
  private isSupported: boolean;
  private permission: NotificationPermission;

  constructor() {
    this.isSupported = 'Notification' in window;
    this.permission = this.getPermissionStatus();
  }

  private getPermissionStatus(): NotificationPermission {
    if (!this.isSupported) {
      return { granted: false, denied: true, default: false };
    }

    const permission = Notification.permission;
    return {
      granted: permission === 'granted',
      denied: permission === 'denied',
      default: permission === 'default'
    };
  }

  async requestPermission(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (this.permission.granted) {
      return true;
    }

    if (this.permission.denied) {
      console.warn('Notification permission has been denied');
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = this.getPermissionStatus();
      return permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(data: NotificationData): Promise<void> {
    if (!this.isSupported || !this.permission.granted) {
      console.warn('Cannot show notification: permission not granted');
      return;
    }

    try {
      const notification = new Notification(data.title, {
        body: data.body,
        icon: data.icon || '/favicon.ico',
        badge: data.badge || '/favicon.ico',
        tag: data.tag,
        data: data.data,
        requireInteraction: data.requireInteraction || false,
        silent: data.silent || false
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!data.requireInteraction) {
        setTimeout(() => {
          notification.close();
        }, 5000);
      }

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();
        
        // Handle custom actions
        if (data.data && data.data.url) {
          window.open(data.data.url, '_blank');
        }
      };

      // Handle notification close
      notification.onclose = () => {
        console.log('Notification closed');
      };

      // Handle notification error
      notification.onerror = (error) => {
        console.error('Notification error:', error);
      };

    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }

  async scheduleNotification(data: NotificationData, delay: number): Promise<void> {
    setTimeout(() => {
      this.showNotification(data);
    }, delay);
  }

  async scheduleTimelineReminder(eventId: string, eventTitle: string, daysUntil: number): Promise<void> {
    const reminderData: NotificationData = {
      id: `reminder_${eventId}_${daysUntil}`,
      title: `⏰ Timeline Reminder`,
      body: `${eventTitle} - ${daysUntil} day${daysUntil > 1 ? 's' : ''} remaining`,
      icon: '/favicon.ico',
      tag: `timeline_${eventId}`,
      data: {
        eventId,
        type: 'timeline_reminder',
        url: `/timeline-tracker`
      },
      requireInteraction: daysUntil <= 3, // Require interaction for urgent reminders
      timestamp: Date.now()
    };

    await this.showNotification(reminderData);
  }

  async scheduleEventStartNotification(eventId: string, eventTitle: string): Promise<void> {
    const startData: NotificationData = {
      id: `start_${eventId}`,
      title: `🚀 Event Started`,
      body: `${eventTitle} application period has begun`,
      icon: '/favicon.ico',
      tag: `timeline_${eventId}`,
      data: {
        eventId,
        type: 'event_start',
        url: `/timeline-tracker`
      },
      requireInteraction: true,
      timestamp: Date.now()
    };

    await this.showNotification(startData);
  }

  async scheduleEventEndNotification(eventId: string, eventTitle: string): Promise<void> {
    const endData: NotificationData = {
      id: `end_${eventId}`,
      title: `⚠️ Deadline Approaching`,
      body: `${eventTitle} application deadline is today`,
      icon: '/favicon.ico',
      tag: `timeline_${eventId}`,
      data: {
        eventId,
        type: 'event_end',
        url: `/timeline-tracker`
      },
      requireInteraction: true,
      timestamp: Date.now()
    };

    await this.showNotification(endData);
  }

  async scheduleExamReminder(eventId: string, eventTitle: string, examDate: string): Promise<void> {
    const examData: NotificationData = {
      id: `exam_${eventId}`,
      title: `📝 Exam Tomorrow`,
      body: `${eventTitle} exam is scheduled for tomorrow`,
      icon: '/favicon.ico',
      tag: `exam_${eventId}`,
      data: {
        eventId,
        type: 'exam_reminder',
        examDate,
        url: `/timeline-tracker`
      },
      requireInteraction: true,
      timestamp: Date.now()
    };

    await this.showNotification(examData);
  }

  async scheduleResultNotification(eventId: string, eventTitle: string): Promise<void> {
    const resultData: NotificationData = {
      id: `result_${eventId}`,
      title: `📊 Results Available`,
      body: `${eventTitle} results have been declared`,
      icon: '/favicon.ico',
      tag: `result_${eventId}`,
      data: {
        eventId,
        type: 'result_available',
        url: `/timeline-tracker`
      },
      requireInteraction: true,
      timestamp: Date.now()
    };

    await this.showNotification(resultData);
  }

  // Service Worker notification handling
  async registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker not supported');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }

  // Background sync for offline notifications
  async scheduleBackgroundSync(tag: string, data: any): Promise<void> {
    if (!('serviceWorker' in navigator) || !('sync' in window.ServiceWorkerRegistration.prototype)) {
      console.warn('Background Sync not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      // Background sync for notifications (if supported)
      try {
        const syncManager = (registration as any).sync;
        if (syncManager && typeof syncManager.register === 'function') {
          await syncManager.register(tag);
        }
      } catch (syncError) {
        console.warn('Background sync not supported or failed:', syncError);
      }
      
      // Store data for background sync
      await this.storeSyncData(tag, data);
    } catch (error) {
      console.error('Background sync registration failed:', error);
    }
  }

  private async storeSyncData(tag: string, data: any): Promise<void> {
    try {
      const syncData = await this.getSyncData();
      syncData[tag] = data;
      localStorage.setItem('notification_sync_data', JSON.stringify(syncData));
    } catch (error) {
      console.error('Error storing sync data:', error);
    }
  }

  private async getSyncData(): Promise<Record<string, any>> {
    try {
      const data = localStorage.getItem('notification_sync_data');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error getting sync data:', error);
      return {};
    }
  }

  // Notification history
  async getNotificationHistory(): Promise<NotificationData[]> {
    try {
      const history = localStorage.getItem('notification_history');
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting notification history:', error);
      return [];
    }
  }

  async addToHistory(notification: NotificationData): Promise<void> {
    try {
      const history = await this.getNotificationHistory();
      history.unshift(notification);
      
      // Keep only last 100 notifications
      if (history.length > 100) {
        history.splice(100);
      }
      
      localStorage.setItem('notification_history', JSON.stringify(history));
    } catch (error) {
      console.error('Error adding to notification history:', error);
    }
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    try {
      const registration = await navigator.serviceWorker.ready;
      const notifications = await registration.getNotifications();
      
      notifications.forEach(notification => {
        notification.close();
      });
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  }

  // Get notification statistics
  async getNotificationStats(): Promise<{
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    try {
      const history = await this.getNotificationHistory();
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      return {
        total: history.length,
        today: history.filter(n => new Date(n.timestamp || 0) >= today).length,
        thisWeek: history.filter(n => new Date(n.timestamp || 0) >= weekAgo).length,
        thisMonth: history.filter(n => new Date(n.timestamp || 0) >= monthAgo).length
      };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, today: 0, thisWeek: 0, thisMonth: 0 };
    }
  }

  // Check if notifications are supported and enabled
  isNotificationSupported(): boolean {
    return this.isSupported;
  }

  isPermissionGranted(): boolean {
    return this.permission.granted;
  }

  canRequestPermission(): boolean {
    return this.isSupported && this.permission.default;
  }

  isPermissionDenied(): boolean {
    return this.permission.denied;
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Export types and service
export default notificationService;
