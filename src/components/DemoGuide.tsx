import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  Zap,
  Target,
  Lightbulb
} from 'lucide-react';

const DemoGuide = () => {
  return (
    <Card className="card-gradient border-border mb-8">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-500" />
          <span>🎯 How to Test Notifications</span>
        </CardTitle>
        <CardDescription>
          Follow these steps to see the notification system in action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Step by Step Guide */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center space-x-2">
              <Lightbulb className="h-4 w-4 text-yellow-500" />
              <span>Quick Test Steps:</span>
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <Badge className="bg-blue-500 text-white">1</Badge>
                <span className="text-sm">Look for the <strong>🧪 DEMO Event</strong> in the timeline</span>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-green-50 dark:bg-green-950">
                <Badge className="bg-green-500 text-white">2</Badge>
                <span className="text-sm">Click <strong>"Subscribe"</strong> on the demo event</span>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg bg-purple-50 dark:bg-purple-950">
                <Badge className="bg-purple-500 text-white">3</Badge>
                <span className="text-sm">Watch for <strong>3 notifications</strong> within 10 seconds!</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-foreground flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-500" />
              <span>What You'll See:</span>
            </h4>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-3 p-2 rounded-lg border border-border">
                <Clock className="h-4 w-4 text-blue-500" />
                <div className="text-sm">
                  <div className="font-medium">🎉 Welcome Notification</div>
                  <div className="text-muted-foreground">After 1 second</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg border border-border">
                <Clock className="h-4 w-4 text-green-500" />
                <div className="text-sm">
                  <div className="font-medium">📝 Demo Reminder</div>
                  <div className="text-muted-foreground">After 5 seconds</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3 p-2 rounded-lg border border-border">
                <Clock className="h-4 w-4 text-red-500" />
                <div className="text-sm">
                  <div className="font-medium">⚠️ Demo Deadline Alert</div>
                  <div className="text-muted-foreground">After 10 seconds</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="space-y-2">
            <div className="font-medium">Important Notes:</div>
            <ul className="text-sm space-y-1 ml-4">
              <li>• Make sure to <strong>allow notifications</strong> when your browser asks</li>
              <li>• Keep the browser tab <strong>active and focused</strong> to see notifications</li>
              <li>• On macOS, check <strong>System Settings → Notifications</strong> if you don't see them</li>
              <li>• Demo notifications will appear in your system notification area</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* What This Demonstrates */}
        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center space-x-2 mb-2">
            <Zap className="h-4 w-4 text-green-600" />
            <span className="font-medium text-green-800 dark:text-green-200">What This Demonstrates:</span>
          </div>
          <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
            <div>✅ <strong>Immediate Notifications:</strong> Shows how the system responds to subscriptions</div>
            <div>✅ <strong>Different Notification Types:</strong> Welcome, reminder, and deadline alerts</div>
            <div>✅ <strong>Real-world Timing:</strong> How notifications would work for actual events</div>
            <div>✅ <strong>Interactive Features:</strong> Click notifications to focus the browser</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemoGuide;