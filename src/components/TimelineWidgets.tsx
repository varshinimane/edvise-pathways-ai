import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  Bell,
  Star,
  TrendingUp,
  Eye,
  ArrowRight
} from 'lucide-react';
import { 
  TIMELINE_EVENTS, 
  getUpcomingEvents, 
  getActiveEvents, 
  getHighPriorityEvents,
  TimelineEvent 
} from '@/lib/timelineData';
import { useNavigate } from 'react-router-dom';

interface TimelineWidgetProps {
  className?: string;
}

// Upcoming Deadlines Widget
export const UpcomingDeadlinesWidget: React.FC<TimelineWidgetProps> = ({ className }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<TimelineEvent[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const events = getUpcomingEvents(30).slice(0, 5); // Next 5 upcoming events
    setUpcomingEvents(events);
  }, []);

  const getDaysUntilEvent = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getUrgencyColor = (days: number) => {
    if (days <= 3) return 'text-red-600';
    if (days <= 7) return 'text-yellow-600';
    if (days <= 15) return 'text-blue-600';
    return 'text-gray-600';
  };

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Upcoming Deadlines</span>
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => navigate('/timeline-tracker')}
          >
            <Eye className="h-4 w-4 mr-1" />
            View All
          </Button>
        </div>
        <CardDescription>
          Important deadlines in the next 30 days
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>No upcoming deadlines!</p>
          </div>
        ) : (
          <>
            {upcomingEvents.map((event) => {
              const daysUntil = getDaysUntilEvent(event.dates.start);
              return (
                <div key={event.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className={`w-1 h-12 rounded-full ${getPriorityColor(event.priority)}`}></div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{event.title}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {event.type} • {event.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${getUrgencyColor(daysUntil)}`}>
                      {daysUntil === 0 ? 'Today' : 
                       daysUntil === 1 ? 'Tomorrow' : 
                       `${daysUntil} days`}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.dates.start).toLocaleDateString('en-IN', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full mt-3"
              onClick={() => navigate('/timeline-tracker')}
            >
              View Timeline Tracker
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

// Active Applications Widget
export const ActiveApplicationsWidget: React.FC<TimelineWidgetProps> = ({ className }) => {
  const [activeEvents, setActiveEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const events = getActiveEvents().slice(0, 4);
    setActiveEvents(events);
  }, []);

  const getProgressPercentage = (startDate: string, endDate: string) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    
    const progress = ((now - start) / (end - start)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Clock className="h-5 w-5 text-blue-500" />
          <span>Active Applications</span>
        </CardTitle>
        <CardDescription>
          Application windows currently open
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeEvents.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2" />
            <p>No active applications</p>
          </div>
        ) : (
          activeEvents.map((event) => {
            const progress = getProgressPercentage(event.dates.start, event.dates.end);
            const daysLeft = Math.ceil((new Date(event.dates.end).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            
            return (
              <div key={event.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <Badge variant={daysLeft <= 7 ? 'destructive' : 'secondary'} className="text-xs">
                    {daysLeft} days left
                  </Badge>
                </div>
                <Progress value={progress} className="h-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Started {new Date(event.dates.start).toLocaleDateString('en-IN')}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2"
                    onClick={() => window.open(event.website, '_blank')}
                  >
                    Apply <ExternalLink className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

// High Priority Events Widget
export const HighPriorityEventsWidget: React.FC<TimelineWidgetProps> = ({ className }) => {
  const [highPriorityEvents, setHighPriorityEvents] = useState<TimelineEvent[]>([]);

  useEffect(() => {
    const events = getHighPriorityEvents().slice(0, 3);
    setHighPriorityEvents(events);
  }, []);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return '📝';
      case 'admission': return '🎓';
      case 'scholarship': return '💰';
      case 'counseling': return '👥';
      case 'result': return '📊';
      case 'deadline': return '⏰';
      default: return '📅';
    }
  };

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Star className="h-5 w-5 text-yellow-500" />
          <span>High Priority</span>
        </CardTitle>
        <CardDescription>
          Important events requiring immediate attention
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {highPriorityEvents.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <p>All caught up!</p>
          </div>
        ) : (
          highPriorityEvents.map((event) => (
            <div key={event.id} className="flex items-center space-x-3 p-3 bg-red-50 border border-red-100 rounded-lg dark:bg-red-950 dark:border-red-900">
              <div className="text-2xl">{getEventIcon(event.type)}</div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm text-red-900 dark:text-red-100">{event.title}</h4>
                <p className="text-xs text-red-700 dark:text-red-300 capitalize">
                  {event.type} • Deadline: {new Date(event.dates.end).toLocaleDateString('en-IN')}
                </p>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-red-700 hover:text-red-900 dark:text-red-300"
                onClick={() => window.open(event.website, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

// Timeline Stats Widget
export const TimelineStatsWidget: React.FC<TimelineWidgetProps> = ({ className }) => {
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    active: 0,
    highPriority: 0
  });

  useEffect(() => {
    const total = TIMELINE_EVENTS.length;
    const upcoming = getUpcomingEvents(90).length;
    const active = getActiveEvents().length;
    const highPriority = getHighPriorityEvents().length;
    
    setStats({ total, upcoming, active, highPriority });
  }, []);

  const statItems = [
    { 
      label: 'Total Events', 
      value: stats.total, 
      icon: Calendar, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900'
    },
    { 
      label: 'Upcoming', 
      value: stats.upcoming, 
      icon: Clock, 
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    { 
      label: 'Active Now', 
      value: stats.active, 
      icon: TrendingUp, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 dark:bg-orange-900'
    },
    { 
      label: 'High Priority', 
      value: stats.highPriority, 
      icon: AlertTriangle, 
      color: 'text-red-600',
      bgColor: 'bg-red-100 dark:bg-red-900'
    }
  ];

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-purple-500" />
          <span>Timeline Overview</span>
        </CardTitle>
        <CardDescription>
          Quick stats about your educational timeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center">
                <div className={`w-12 h-12 rounded-full ${item.bgColor} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className={`h-6 w-6 ${item.color}`} />
                </div>
                <div className="text-2xl font-bold">{item.value}</div>
                <div className="text-xs text-muted-foreground">{item.label}</div>
              </div>
            );
          })}
        </div>
        <Button 
          className="w-full mt-4" 
          onClick={() => window.location.href = '/timeline-tracker'}
        >
          <Bell className="h-4 w-4 mr-2" />
          Open Timeline Tracker
        </Button>
      </CardContent>
    </Card>
  );
};

// Quick Actions Widget
export const QuickActionsWidget: React.FC<TimelineWidgetProps> = ({ className }) => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'View Timeline',
      description: 'See all events and deadlines',
      icon: Calendar,
      action: () => navigate('/timeline-tracker'),
      color: 'text-blue-600 bg-blue-100 dark:bg-blue-900'
    },
    {
      title: 'Notification Settings',
      description: 'Configure your alerts',
      icon: Bell,
      action: () => navigate('/timeline-tracker'), // Will open notification settings
      color: 'text-purple-600 bg-purple-100 dark:bg-purple-900'
    },
    {
      title: 'Export Calendar',
      description: 'Download events to your calendar',
      icon: ExternalLink,
      action: () => {
        // Import calendar export service
        import('@/lib/calendarExport').then(({ calendarExportService }) => {
          calendarExportService.generateICS(TIMELINE_EVENTS);
        });
      },
      color: 'text-green-600 bg-green-100 dark:bg-green-900'
    }
  ];

  return (
    <Card className={`card-gradient ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Quick Actions</CardTitle>
        <CardDescription>
          Timeline management shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Button
              key={action.title}
              variant="ghost"
              className="w-full justify-start h-auto p-3"
              onClick={action.action}
            >
              <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-left">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default {
  UpcomingDeadlinesWidget,
  ActiveApplicationsWidget,
  HighPriorityEventsWidget,
  TimelineStatsWidget,
  QuickActionsWidget
};