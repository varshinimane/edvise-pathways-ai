import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Cloud, CloudOff, Loader } from 'lucide-react';

interface OfflineIndicatorProps {
  className?: string;
  showText?: boolean;
  variant?: 'compact' | 'full' | 'badge';
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({
  className = '',
  showText = true,
  variant = 'compact'
}) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);
  const [lastOfflineTime, setLastOfflineTime] = useState<Date | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsRetrying(false);
      if (lastOfflineTime) {
        console.log('Back online after', Date.now() - lastOfflineTime.getTime(), 'ms');
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLastOfflineTime(new Date());
      console.log('Gone offline at', new Date().toISOString());
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connectivity periodically when offline
    let intervalId: NodeJS.Timeout;
    if (!isOnline) {
      intervalId = setInterval(() => {
        setIsRetrying(true);
        // Try to fetch a small resource to check connectivity
        fetch('/manifest.json', { 
          method: 'HEAD',
          cache: 'no-cache'
        }).then(() => {
          if (!navigator.onLine) {
            setIsOnline(true);
          }
        }).catch(() => {
          // Still offline
        }).finally(() => {
          setIsRetrying(false);
        });
      }, 30000); // Check every 30 seconds
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isOnline, lastOfflineTime]);

  const getIcon = () => {
    if (isRetrying) return <Loader className="w-4 h-4 animate-spin" />;
    if (isOnline) return <Wifi className="w-4 h-4" />;
    return <WifiOff className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (isRetrying) return 'text-yellow-500';
    if (isOnline) return 'text-green-500';
    return 'text-red-500';
  };

  const getBackgroundColor = () => {
    if (isRetrying) return 'bg-yellow-50 border-yellow-200';
    if (isOnline) return 'bg-green-50 border-green-200';
    return 'bg-red-50 border-red-200';
  };

  if (variant === 'badge' && isOnline) {
    return null; // Don't show when online in badge mode
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-1 ${getStatusColor()} ${className}`}>
        {getIcon()}
        {showText && (
          <span className="text-sm font-medium">
            {isRetrying ? 'Reconnecting...' : isOnline ? 'Online' : 'Offline'}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-full border text-sm font-medium ${getBackgroundColor()} ${getStatusColor()} ${className}`}>
        {getIcon()}
        {showText && (
          <span>
            {isRetrying ? 'Reconnecting...' : 'Working Offline'}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={`flex items-center justify-between p-4 rounded-lg border ${getBackgroundColor()} ${className}`}>
        <div className="flex items-center gap-3">
          <div className={getStatusColor()}>
            {getIcon()}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {isRetrying ? 'Reconnecting...' : isOnline ? 'Online' : 'Offline Mode'}
            </h3>
            <p className="text-sm text-gray-600">
              {isRetrying 
                ? 'Checking connection...'
                : isOnline 
                  ? 'All features are available' 
                  : 'Some features may be limited'
              }
            </p>
          </div>
        </div>
        {!isOnline && !isRetrying && (
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Retry
          </button>
        )}
      </div>
    );
  }

  return null;
};