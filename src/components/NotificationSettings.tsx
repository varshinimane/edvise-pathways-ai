import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  Bell, 
  Volume2, 
  VolumeX, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  Settings, 
  Save, 
  TestTube,
  Moon,
  Sun,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { notificationService, NotificationPreferences } from '@/lib/notificationService';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  open: boolean;
  onClose: () => void;
  userId: string;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  open,
  onClose,
  userId
}) => {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState<NotificationPreferences>({
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
  });

  const [isLoading, setIsLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'default' | 'unknown'>('unknown');
  const [stats, setStats] = useState({
    total_sent: 0,
    total_failed: 0,
    total_pending: 0,
    last_notification: null as string | null
  });

  useEffect(() => {
    if (open) {
      loadPreferences();
      loadStats();
      checkPermissionStatus();
    }
  }, [open, userId]);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const prefs = await notificationService.getNotificationPreferences(userId);
      setPreferences(prefs);
    } catch (error) {
      console.error('Error loading preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const notificationStats = await notificationService.getNotificationStats(userId);
      setStats(notificationStats);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const checkPermissionStatus = () => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  };

  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      
      if (permission === 'granted') {
        toast({
          title: 'Permission Granted',
          description: 'You will now receive push notifications',
          variant: 'default'
        });
      } else if (permission === 'denied') {
        toast({
          title: 'Permission Denied',
          description: 'Push notifications are disabled. You can enable them in browser settings.',
          variant: 'destructive'
        });
      }
    }
  };

  const savePreferences = async () => {
    try {
      setIsLoading(true);
      await notificationService.updateNotificationPreferences(userId, preferences);
      
      toast({
        title: 'Settings Saved',
        description: 'Your notification preferences have been updated',
        variant: 'default'
      });
      
      onClose();
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast({
        title: 'Error',
        description: 'Failed to save notification preferences',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendTestNotification = async () => {
    try {
      if (permissionStatus !== 'granted') {
        await requestPermission();
        return;
      }

      await notificationService.sendTestNotification(userId);
      
      toast({
        title: 'Test Notification Sent',
        description: 'Check if you received the test notification',
        variant: 'default'
      });
    } catch (error) {
      console.error('Error sending test notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to send test notification',
        variant: 'destructive'
      });
    }
  };

  const updatePreference = (key: keyof NotificationPreferences, value: any) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateCategory = (category: keyof NotificationPreferences['categories'], enabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      categories: {
        ...prev.categories,
        [category]: enabled
      }
    }));
  };

  const updateReminderDays = (days: string) => {
    const reminderDays = days.split(',')
      .map(d => parseInt(d.trim()))
      .filter(d => !isNaN(d) && d > 0)
      .sort((a, b) => b - a);
    
    updatePreference('reminder_days', reminderDays);
  };

  const getPermissionIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPermissionText = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'Notifications are enabled';
      case 'denied':
        return 'Notifications are blocked';
      default:
        return 'Permission not requested';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>Notification Settings</span>
          </DialogTitle>
          <DialogDescription>
            Configure how and when you receive notifications for important educational events
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Permission Status */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getPermissionIcon()}
                <div>
                  <h3 className="font-medium">Browser Permissions</h3>
                  <p className="text-sm text-muted-foreground">{getPermissionText()}</p>
                </div>
              </div>
              {permissionStatus !== 'granted' && (
                <Button onClick={requestPermission} variant="outline" size="sm">
                  Enable Notifications
                </Button>
              )}
            </div>
          </Card>

          {/* Notification Statistics */}
          <Card className="p-4">
            <h3 className="font-medium mb-3">Notification Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.total_sent}</div>
                <div className="text-sm text-muted-foreground">Sent</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total_pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.total_failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
              <div className="text-center">
                <Button onClick={sendTestNotification} variant="outline" size="sm" className="w-full">
                  <TestTube className="h-4 w-4 mr-1" />
                  Test
                </Button>
              </div>
            </div>
          </Card>

          {/* Notification Types */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Notification Types</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-4 w-4 text-blue-500" />
                  <div>
                    <Label htmlFor="push">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Browser notifications</p>
                  </div>
                </div>
                <Switch 
                  id="push"
                  checked={preferences.push}
                  onCheckedChange={(checked) => updatePreference('push', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-4 w-4 text-green-500" />
                  <div>
                    <Label htmlFor="email">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive emails for important deadlines</p>
                  </div>
                </div>
                <Switch 
                  id="email"
                  checked={preferences.email}
                  onCheckedChange={(checked) => updatePreference('email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <MessageSquare className="h-4 w-4 text-purple-500" />
                  <div>
                    <Label htmlFor="sms">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Text messages for urgent updates</p>
                  </div>
                </div>
                <Switch 
                  id="sms"
                  checked={preferences.sms}
                  onCheckedChange={(checked) => updatePreference('sms', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Notification Behavior */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Notification Behavior</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {preferences.sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  <div>
                    <Label htmlFor="sound">Sound</Label>
                    <p className="text-sm text-muted-foreground">Play notification sound</p>
                  </div>
                </div>
                <Switch 
                  id="sound"
                  checked={preferences.sound}
                  onCheckedChange={(checked) => updatePreference('sound', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <Label htmlFor="vibration">Vibration</Label>
                    <p className="text-sm text-muted-foreground">Vibrate on mobile devices</p>
                  </div>
                </div>
                <Switch 
                  id="vibration"
                  checked={preferences.vibration}
                  onCheckedChange={(checked) => updatePreference('vibration', checked)}
                />
              </div>
            </div>
          </Card>

          {/* Reminder Schedule */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Reminder Schedule</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="reminderDays">Reminder Days (comma-separated)</Label>
                <Input
                  id="reminderDays"
                  value={preferences.reminder_days.join(', ')}
                  onChange={(e) => updateReminderDays(e.target.value)}
                  placeholder="30, 15, 7, 3, 1"
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Days before deadline to send reminders
                </p>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {preferences.reminder_days.map((days) => (
                  <Badge key={days} variant="secondary">
                    {days} day{days !== 1 ? 's' : ''} before
                  </Badge>
                ))}
              </div>
            </div>
          </Card>

          {/* Quiet Hours */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Quiet Hours</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Moon className="h-4 w-4" />
                  <div>
                    <Label htmlFor="quietHours">Enable Quiet Hours</Label>
                    <p className="text-sm text-muted-foreground">No notifications during these hours</p>
                  </div>
                </div>
                <Switch 
                  id="quietHours"
                  checked={preferences.quiet_hours.enabled}
                  onCheckedChange={(checked) => 
                    updatePreference('quiet_hours', { ...preferences.quiet_hours, enabled: checked })
                  }
                />
              </div>

              {preferences.quiet_hours.enabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input
                      id="startTime"
                      type="time"
                      value={preferences.quiet_hours.start}
                      onChange={(e) => 
                        updatePreference('quiet_hours', { 
                          ...preferences.quiet_hours, 
                          start: e.target.value 
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={preferences.quiet_hours.end}
                      onChange={(e) => 
                        updatePreference('quiet_hours', { 
                          ...preferences.quiet_hours, 
                          end: e.target.value 
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Event Categories */}
          <Card className="p-4">
            <h3 className="font-medium mb-4">Event Categories</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Choose which types of events you want to receive notifications for
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(preferences.categories).map(([category, enabled]) => (
                <div key={category} className="flex items-center space-x-2">
                  <Switch 
                    id={category}
                    checked={enabled}
                    onCheckedChange={(checked) => 
                      updateCategory(category as keyof NotificationPreferences['categories'], checked)
                    }
                  />
                  <Label htmlFor={category} className="capitalize">
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={savePreferences} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Settings'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationSettings;