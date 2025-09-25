import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  TestTube,
  Settings,
  Info
} from 'lucide-react';

const NotificationTest: React.FC = () => {
  const [permissionStatus, setPermissionStatus] = useState<NotificationPermission>('default');
  const [testResults, setTestResults] = useState<string[]>([]);
  
  React.useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  const addTestResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      addTestResult('❌ Notifications not supported in this browser');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      addTestResult(`🔔 Permission ${permission}`);
      
      if (permission === 'granted') {
        addTestResult('✅ Permission granted successfully!');
      } else if (permission === 'denied') {
        addTestResult('❌ Permission denied. Check browser settings.');
      }
    } catch (error) {
      addTestResult(`❌ Error requesting permission: ${error}`);
    }
  };

  const testBasicNotification = () => {
    if (Notification.permission !== 'granted') {
      addTestResult('❌ Need permission first');
      return;
    }

    try {
      const notification = new Notification('🧪 Test Notification', {
        body: 'This is a test notification from EdVise Timeline Tracker!',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'test-notification',
        requireInteraction: false
      });

      notification.onclick = () => {
        addTestResult('👆 Notification clicked');
        notification.close();
      };

      notification.onshow = () => {
        addTestResult('✅ Basic notification shown successfully');
      };

      notification.onerror = (error) => {
        addTestResult(`❌ Notification error: ${error}`);
      };

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
        addTestResult('⏰ Notification auto-closed after 5 seconds');
      }, 5000);

    } catch (error) {
      addTestResult(`❌ Error creating notification: ${error}`);
    }
  };

  const testTimelineNotification = () => {
    if (Notification.permission !== 'granted') {
      addTestResult('❌ Need permission first');
      return;
    }

    try {
      const notification = new Notification('📅 Timeline Reminder', {
        body: 'JEE Main 2025 - Application deadline in 3 days! Don\'t miss out.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'timeline-reminder',
        requireInteraction: true,
        actions: [
          { action: 'view', title: 'View Details' },
          { action: 'apply', title: 'Apply Now' },
          { action: 'dismiss', title: 'Dismiss' }
        ] as any,
        data: {
          eventId: 'jee-main-2025-session1',
          url: '/timeline-tracker'
        }
      });

      notification.onclick = () => {
        addTestResult('👆 Timeline notification clicked');
        notification.close();
      };

      notification.onshow = () => {
        addTestResult('✅ Timeline notification shown successfully');
      };

      addTestResult('📅 Timeline-style notification sent');

    } catch (error) {
      addTestResult(`❌ Error creating timeline notification: ${error}`);
    }
  };

  const testServiceWorker = async () => {
    if (!('serviceWorker' in navigator)) {
      addTestResult('❌ Service Worker not supported');
      return;
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        addTestResult('✅ Service Worker is registered');
        addTestResult(`📋 SW State: ${registration.active?.state || 'inactive'}`);
        
        // Test message to service worker
        registration.active?.postMessage({
          type: 'SYNC_NOTIFICATIONS'
        });
        addTestResult('📨 Message sent to Service Worker');
      } else {
        addTestResult('❌ Service Worker not registered');
      }
    } catch (error) {
      addTestResult(`❌ Service Worker error: ${error}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  const getBrowserInfo = () => {
    const info = [];
    info.push(`🌐 Browser: ${navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Firefox') ? 'Firefox' : navigator.userAgent.includes('Safari') ? 'Safari' : 'Other'}`);
    info.push(`🔔 Notifications: ${('Notification' in window) ? 'Supported' : 'Not Supported'}`);
    info.push(`⚙️ Service Worker: ${('serviceWorker' in navigator) ? 'Supported' : 'Not Supported'}`);
    info.push(`🔐 Permission: ${permissionStatus}`);
    info.push(`🌍 Protocol: ${window.location.protocol}`);
    return info;
  };

  const getPermissionIcon = () => {
    switch (permissionStatus) {
      case 'granted': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'denied': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getPermissionColor = () => {
    switch (permissionStatus) {
      case 'granted': return 'bg-green-100 text-green-800 border-green-200';
      case 'denied': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="card-gradient border-border">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Notification System Test</span>
          </CardTitle>
          <CardDescription>
            Test various aspects of the notification system to ensure everything is working correctly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Permission Status */}
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div className="flex items-center space-x-2">
              {getPermissionIcon()}
              <span className="font-medium">Permission Status</span>
            </div>
            <Badge className={getPermissionColor()}>
              {permissionStatus}
            </Badge>
          </div>

          {/* Browser Info */}
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                {getBrowserInfo().map((info, index) => (
                  <div key={index} className="text-sm">{info}</div>
                ))}
              </div>
            </AlertDescription>
          </Alert>

          {/* Test Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Button 
              onClick={requestPermission}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={permissionStatus === 'granted'}
            >
              <Settings className="h-4 w-4" />
              <span>Request Permission</span>
            </Button>

            <Button 
              onClick={testBasicNotification}
              variant="outline"
              className="flex items-center space-x-2"
              disabled={permissionStatus !== 'granted'}
            >
              <Bell className="h-4 w-4" />
              <span>Test Basic Notification</span>
            </Button>

            <Button 
              onClick={testTimelineNotification}
              variant="outline" 
              className="flex items-center space-x-2"
              disabled={permissionStatus !== 'granted'}
            >
              <Bell className="h-4 w-4" />
              <span>Test Timeline Notification</span>
            </Button>

            <Button 
              onClick={testServiceWorker}
              variant="outline"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Test Service Worker</span>
            </Button>
          </div>

          {/* Clear Results */}
          {testResults.length > 0 && (
            <Button 
              onClick={clearResults}
              variant="ghost"
              size="sm"
              className="w-full"
            >
              Clear Results
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="card-gradient border-border">
          <CardHeader>
            <CardTitle className="text-lg">Test Results</CardTitle>
            <CardDescription>
              Real-time feedback from notification tests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-900 dark:bg-slate-800 text-green-400 p-4 rounded-lg font-mono text-sm max-h-60 overflow-y-auto">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  {result}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NotificationTest;