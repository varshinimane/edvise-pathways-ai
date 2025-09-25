// Timeline Tracker Notification Service
import { TimelineEvent, UserTimelineSubscription } from './timelineData';
import { offlineStorage } from './offlineStorage';

export interface NotificationPreferences {
  push: boolean;
  email: boolean;
  sms: boolean;
  sound: boolean;
  vibration: boolean;
  reminder_days: number[];
  quiet_hours: {
    enabled: boolean;
    start: string; // HH:MM format
    end: string; // HH:MM format
  };
  categories: {
    engineering: boolean;
    medical: boolean;
    government: boolean;
    commerce: boolean;
    arts: boolean;
    general: boolean;
  };
}

export interface PendingNotification {
  id: string;
  event_id: string;
  user_id: string;
  type: 'reminder' | 'deadline' | 'result' | 'counseling';
  title: string;
  message: string;
  scheduled_for: string;
  data: {
    event: TimelineEvent;
    days_until: number;
    action_url?: string;
  };
  status: 'pending' | 'sent' | 'failed' | 'cancelled';
  created_at: string;
}

class NotificationService {
  private worker: ServiceWorker | null = null;
  private isInitialized = false;

  async init(): Promise<void> {
    if (this.isInitialized) return;

    // Request notification permission
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      console.log('Notification permission:', permission);
    }

    // Register service worker for background notifications
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        this.worker = registration.active;
        console.log('Service Worker registered:', registration);
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    // Setup periodic sync for notifications
    await this.setupPeriodicSync();

    this.isInitialized = true;
  }

  async getNotificationPreferences(userId: string): Promise<NotificationPreferences> {
    const defaultPrefs: NotificationPreferences = {
      push: true,
      email: false,
      sms: false,
      sound: true,
      vibration: true,
      reminder_days: [30, 15, 7, 3, 1],
      quiet_hours: {
        enabled: false,
        start: '22:00',
        end: '08:00'
      },
      categories: {
        engineering: true,
        medical: true,
        government: true,
        commerce: true,
        arts: true,
        general: true
      }
    };

    try {
      const prefs = await offlineStorage.getUserData(`notification_preferences_${userId}`);
      return { ...defaultPrefs, ...prefs };
    } catch (error) {
      console.error('Error loading notification preferences:', error);
      return defaultPrefs;
    }
  }

  async updateNotificationPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<void> {
    try {
      const currentPrefs = await this.getNotificationPreferences(userId);
      const updatedPrefs = { ...currentPrefs, ...preferences };
      await offlineStorage.saveUserData(`notification_preferences_${userId}`, updatedPrefs);
      
      // Reschedule notifications based on new preferences
      await this.rescheduleNotifications(userId);
    } catch (error) {
      console.error('Error updating notification preferences:', error);
      throw error;
    }
  }

  async scheduleNotifications(userId: string, subscription: UserTimelineSubscription, event: TimelineEvent): Promise<void> {
    const preferences = await this.getNotificationPreferences(userId);
    
    if (!preferences.categories[event.category as keyof typeof preferences.categories]) {
      return; // User disabled notifications for this category
    }

    // Special handling for demo event - send immediate notification
    if (event.id === 'demo-notification-test') {
      await this.sendDemoNotification(userId, event);
      return;
    }

    const reminderDays = subscription.notification_preferences.reminder_days || event.notification_settings.reminder_days;
    const eventDate = new Date(event.dates.start);
    const now = new Date();

    // Schedule reminder notifications
    for (const days of reminderDays) {
      const reminderDate = new Date(eventDate.getTime() - (days * 24 * 60 * 60 * 1000));
      
      if (reminderDate > now) {
        const notification: PendingNotification = {
          id: `reminder_${event.id}_${days}days`,
          event_id: event.id,
          user_id: userId,
          type: 'reminder',
          title: `📅 ${days} days left: ${event.title}`,
          message: `Don't forget! Application deadline for ${event.title} is in ${days} days. Apply now to avoid missing out.`,
          scheduled_for: reminderDate.toISOString(),
          data: {
            event,
            days_until: days,
            action_url: event.website
          },
          status: 'pending',
          created_at: new Date().toISOString()
        };

        await this.savePendingNotification(notification);
      }
    }
  }

  async sendDemoNotification(userId: string, event: TimelineEvent): Promise<void> {
    const preferences = await this.getNotificationPreferences(userId);
    
    if (!preferences.push || Notification.permission !== 'granted') {
      console.log('Cannot send demo notification - permission not granted');
      return;
    }

    // Send immediate welcome notification
    setTimeout(() => {
      const welcomeNotification = new Notification('🎉 Demo Subscription Successful!', {
        body: 'You have successfully subscribed to the demo event. This notification confirms the system is working!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'demo-welcome',
        requireInteraction: false,
        data: {
          eventId: event.id,
          type: 'demo',
          url: '/timeline-tracker'
        }
      });

      welcomeNotification.onclick = () => {
        window.focus();
        welcomeNotification.close();
      };
    }, 1000);

    // Send demo reminder notification after 5 seconds
    setTimeout(() => {
      const reminderNotification = new Notification('📝 Demo Event Reminder', {
        body: 'This is a demo reminder notification! In real events, you would get these based on your reminder preferences.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'demo-reminder',
        requireInteraction: true,
        data: {
          eventId: event.id,
          type: 'demo-reminder',
          url: '/timeline-tracker'
        },
        actions: [
          { action: 'view', title: 'View Timeline' },
          { action: 'dismiss', title: 'Dismiss' }
        ] as any
      });

      reminderNotification.onclick = () => {
        window.focus();
        reminderNotification.close();
      };
    }, 5000);

    // Send demo deadline notification after 10 seconds
    setTimeout(() => {
      const deadlineNotification = new Notification('⚠️ Demo Deadline Alert!', {
        body: 'Demo Event: This is how you\'ll be notified of important deadlines. Don\'t miss out on real opportunities!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'demo-deadline',
        requireInteraction: true,
        data: {
          eventId: event.id,
          type: 'demo-deadline',
          url: '/timeline-tracker'
        }
      });

      deadlineNotification.onclick = () => {
        window.focus();
        deadlineNotification.close();
      };
    }, 10000);

    console.log('Demo notifications scheduled successfully!');
  }

  async sendImmediateNotification(notification: PendingNotification): Promise<boolean> {
    const preferences = await this.getNotificationPreferences(notification.user_id);
    
    // Check quiet hours
    if (this.isInQuietHours(preferences)) {
      await this.deferNotification(notification, preferences);
      return false;
    }

    let success = false;

    // Send push notification
    if (preferences.push && 'Notification' in window && Notification.permission === 'granted') {
      try {
        const pushNotification = new Notification(notification.title, {
          body: notification.message,
          icon: '/icon-192.png',
          badge: '/badge-72.png',
          tag: notification.id,
          data: notification.data,
          requireInteraction: notification.type === 'deadline',
          silent: !preferences.sound
        });

        pushNotification.onclick = () => {
          window.open(notification.data.action_url || '/', '_blank');
          pushNotification.close();
        };

        success = true;
      } catch (error) {
        console.error('Error sending push notification:', error);
      }
    }

    notification.status = success ? 'sent' : 'failed';
    await this.updatePendingNotification(notification);

    return success;
  }

  private isInQuietHours(preferences: NotificationPreferences): boolean {
    if (!preferences.quiet_hours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const startTime = parseInt(preferences.quiet_hours.start.replace(':', ''));
    const endTime = parseInt(preferences.quiet_hours.end.replace(':', ''));

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }

  private async deferNotification(notification: PendingNotification, preferences: NotificationPreferences): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(parseInt(preferences.quiet_hours.end.split(':')[0]));
    tomorrow.setMinutes(parseInt(preferences.quiet_hours.end.split(':')[1]));

    notification.scheduled_for = tomorrow.toISOString();
    await this.updatePendingNotification(notification);
  }

  async checkPendingNotifications(): Promise<void> {
    try {
      const now = new Date();
      const pendingNotifications = await this.getPendingNotifications();
      
      for (const notification of pendingNotifications) {
        const scheduledTime = new Date(notification.scheduled_for);
        
        if (scheduledTime <= now && notification.status === 'pending') {
          await this.sendImmediateNotification(notification);
        }
      }
    } catch (error) {
      console.error('Error checking pending notifications:', error);
    }
  }

  private async setupPeriodicSync(): Promise<void> {
    // Setup interval to check notifications every minute
    setInterval(() => {
      this.checkPendingNotifications();
    }, 60000);

    // Setup daily cleanup
    setInterval(() => {
      this.cleanupOldNotifications();
    }, 24 * 60 * 60 * 1000);
  }

  private async cleanupOldNotifications(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date(Date.now() - (30 * 24 * 60 * 60 * 1000));
      const notifications = await this.getPendingNotifications();
      
      const toDelete = notifications.filter(n => 
        new Date(n.created_at) < thirtyDaysAgo && (n.status === 'sent' || n.status === 'failed')
      );

      for (const notification of toDelete) {
        await this.deletePendingNotification(notification.id);
      }
    } catch (error) {
      console.error('Error cleaning up old notifications:', error);
    }
  }

  // Storage methods for pending notifications
  private async savePendingNotification(notification: PendingNotification): Promise<void> {
    const key = `pending_notifications_${notification.user_id}`;
    const existingNotifications = await offlineStorage.getUserData(key) || [];
    existingNotifications.push(notification);
    await offlineStorage.saveUserData(key, existingNotifications);
  }

  private async updatePendingNotification(notification: PendingNotification): Promise<void> {
    const key = `pending_notifications_${notification.user_id}`;
    const existingNotifications = await offlineStorage.getUserData(key) || [];
    const index = existingNotifications.findIndex((n: PendingNotification) => n.id === notification.id);
    
    if (index !== -1) {
      existingNotifications[index] = notification;
      await offlineStorage.saveUserData(key, existingNotifications);
    }
  }

  private async deletePendingNotification(notificationId: string): Promise<void> {
    const userId = 'current_user'; // Simplified for demo
    const key = `pending_notifications_${userId}`;
    const notifications = await offlineStorage.getUserData(key) || [];
    const filtered = notifications.filter((n: PendingNotification) => n.id !== notificationId);
    await offlineStorage.saveUserData(key, filtered);
  }

  private async getPendingNotifications(): Promise<PendingNotification[]> {
    const userId = 'current_user'; // Simplified for demo
    const key = `pending_notifications_${userId}`;
    return await offlineStorage.getUserData(key) || [];
  }

  // Test notification method
  async sendTestNotification(userId: string): Promise<void> {
    const testNotification: PendingNotification = {
      id: `test_${Date.now()}`,
      event_id: 'test',
      user_id: userId,
      type: 'reminder',
      title: '🧪 Test Notification',
      message: 'This is a test notification from EdVise Timeline Tracker!',
      scheduled_for: new Date().toISOString(),
      data: {
        event: {} as TimelineEvent,
        days_until: 0
      },
      status: 'pending',
      created_at: new Date().toISOString()
    };

    await this.sendImmediateNotification(testNotification);
  }

  // Get notification statistics
  async getNotificationStats(userId: string): Promise<{
    total_sent: number;
    total_failed: number;
    total_pending: number;
    last_notification: string | null;
  }> {
    const notifications = await this.getPendingNotifications();
    const userNotifications = notifications.filter(n => n.user_id === userId);

    const stats = {
      total_sent: userNotifications.filter(n => n.status === 'sent').length,
      total_failed: userNotifications.filter(n => n.status === 'failed').length,
      total_pending: userNotifications.filter(n => n.status === 'pending').length,
      last_notification: null as string | null
    };

    const sentNotifications = userNotifications
      .filter(n => n.status === 'sent')
      .sort((a, b) => new Date(b.scheduled_for).getTime() - new Date(a.scheduled_for).getTime());

    if (sentNotifications.length > 0) {
      stats.last_notification = sentNotifications[0].scheduled_for;
    }

    return stats;
  }

  private async rescheduleNotifications(userId: string): Promise<void> {
    // Implementation for rescheduling notifications based on new preferences
    console.log('Rescheduling notifications for user:', userId);
  }

}

// Create singleton instance
export const notificationService = new NotificationService();

// Export types and service
export type { NotificationPreferences, PendingNotification };
export default notificationService;
