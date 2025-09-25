import NotificationTest from '@/components/NotificationTest';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const NotificationTestPage = () => {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link to="/timeline-tracker">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Timeline
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">🧪 Notification Testing</h1>
            <p className="text-muted-foreground mt-2">
              Test the Timeline Tracker notification system functionality
            </p>
          </div>
        </div>

        {/* Test Component */}
        <NotificationTest />

        {/* Instructions */}
        <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-3">
            📋 Testing Instructions
          </h3>
          <div className="space-y-2 text-blue-800 dark:text-blue-200">
            <p>1. <strong>Request Permission</strong> - Click to enable browser notifications</p>
            <p>2. <strong>Test Basic Notification</strong> - Verify simple notifications work</p>
            <p>3. <strong>Test Timeline Notification</strong> - Test advanced timeline-style notifications</p>
            <p>4. <strong>Test Service Worker</strong> - Check if background service is running</p>
            <p>5. Check the test results panel for detailed feedback</p>
          </div>
        </div>

        {/* Browser-specific Notes */}
        <div className="mt-6 p-6 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-3">
            ⚠️ Browser-specific Notes
          </h3>
          <div className="space-y-2 text-yellow-800 dark:text-yellow-200 text-sm">
            <p><strong>Chrome/Edge:</strong> Full notification support including actions</p>
            <p><strong>Firefox:</strong> Good notification support, some action limitations</p>
            <p><strong>Safari:</strong> Basic notifications only, requires user interaction</p>
            <p><strong>Mobile:</strong> Notifications may require the website to be added to home screen</p>
            <p><strong>HTTPS:</strong> Required for service workers and advanced notification features</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationTestPage;