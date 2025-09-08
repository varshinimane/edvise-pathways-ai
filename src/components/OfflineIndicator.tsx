import { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Wifi, WifiOff } from 'lucide-react';

const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) {
    return null;
  }

  return (
    <div className="fixed top-16 left-4 right-4 z-50">
      <Alert className="bg-orange-100 border-orange-300 text-orange-800">
        <WifiOff className="h-4 w-4" />
        <AlertDescription>
          You're offline. EdVise is working with cached data. Your quiz results will be saved locally and synced when you're back online.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default OfflineIndicator;


