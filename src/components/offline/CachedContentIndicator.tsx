import React, { useState, useEffect } from 'react';
import { Archive, Clock, RefreshCw, AlertTriangle } from 'lucide-react';

interface CachedContentIndicatorProps {
  content?: 'colleges' | 'scholarships' | 'quiz' | 'recommendations';
  lastUpdated?: string | Date;
  isStale?: boolean;
  className?: string;
  variant?: 'inline' | 'banner' | 'badge';
  onRefresh?: () => Promise<void>;
}

export const CachedContentIndicator: React.FC<CachedContentIndicatorProps> = ({
  content = 'colleges',
  lastUpdated,
  isStale = false,
  className = '',
  variant = 'inline',
  onRefresh
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
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

  const handleRefresh = async () => {
    if (!onRefresh || !isOnline) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
    } catch (error) {
      console.error('Failed to refresh content:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const formatTimeAgo = (date: string | Date) => {
    if (!date) return 'Unknown';
    
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getContentName = () => {
    switch (content) {
      case 'colleges': return 'Colleges';
      case 'scholarships': return 'Scholarships';
      case 'quiz': return 'Quiz Questions';
      case 'recommendations': return 'Recommendations';
      default: return 'Content';
    }
  };

  const getIcon = () => {
    if (isRefreshing) return <RefreshCw className="w-4 h-4 animate-spin" />;
    if (isStale) return <AlertTriangle className="w-4 h-4" />;
    return <Archive className="w-4 h-4" />;
  };

  const getStatusColor = () => {
    if (isStale) return 'text-amber-600';
    return 'text-blue-600';
  };

  const getBackgroundColor = () => {
    if (isStale) return 'bg-amber-50 border-amber-200';
    return 'bg-blue-50 border-blue-200';
  };

  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getBackgroundColor()} ${getStatusColor()} ${className}`}>
        {getIcon()}
        <span>Cached</span>
        {lastUpdated && (
          <span className="opacity-75">
            • {formatTimeAgo(lastUpdated)}
          </span>
        )}
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`flex items-center justify-between p-3 rounded-lg border ${getBackgroundColor()} ${className}`}>
        <div className="flex items-center gap-3">
          <div className={getStatusColor()}>
            {getIcon()}
          </div>
          <div>
            <div className="font-medium text-sm text-gray-900">
              {isStale ? 'Content may be outdated' : 'Viewing cached content'}
            </div>
            <div className="text-xs text-gray-600">
              {getContentName()} {lastUpdated ? `last updated ${formatTimeAgo(lastUpdated)}` : 'cached locally'}
            </div>
          </div>
        </div>
        
        {onRefresh && isOnline && (
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRefreshing ? (
              <RefreshCw className="w-3 h-3 animate-spin" />
            ) : (
              <RefreshCw className="w-3 h-3" />
            )}
            Update
          </button>
        )}
      </div>
    );
  }

  // inline variant
  return (
    <div className={`inline-flex items-center gap-1 text-sm ${getStatusColor()} ${className}`}>
      {getIcon()}
      <span>
        {isStale ? 'Outdated' : 'Cached'}
        {lastUpdated && ` • ${formatTimeAgo(lastUpdated)}`}
      </span>
      {onRefresh && isOnline && (
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="ml-2 p-1 rounded hover:bg-gray-100 disabled:opacity-50"
          title="Refresh content"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};