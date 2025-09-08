import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  Bell, 
  Search, 
  Filter, 
  ExternalLink,
  MapPin,
  Users,
  BookOpen,
  Award,
  GraduationCap,
  Building,
  AlertCircle,
  CheckCircle,
  XCircle,
  Plus,
  Settings,
  Download,
  Share2,
  Star,
  StarOff
} from 'lucide-react';
import { 
  TIMELINE_EVENTS, 
  getUpcomingEvents, 
  getEventsByType, 
  getEventsByCategory, 
  getHighPriorityEvents,
  getActiveEvents,
  searchEvents,
  getAllCategories,
  getAllTypes,
  type TimelineEvent 
} from '@/lib/timelineData';
import { offlineStorage } from '@/lib/offlineStorage';

const TimelineTracker = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [subscribedEvents, setSubscribedEvents] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('upcoming');

  const categories = getAllCategories();
  const types = getAllTypes();

  useEffect(() => {
    loadSubscribedEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedType, selectedCategory, selectedPriority, events]);

  const loadSubscribedEvents = async () => {
    try {
      const subscriptions = await offlineStorage.getUserData('timeline_subscriptions') || [];
      const eventIds = subscriptions.map((sub: any) => sub.event_id);
      setSubscribedEvents(new Set(eventIds));
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    // Apply search filter
    if (searchQuery) {
      filtered = searchEvents(searchQuery);
    }

    // Apply type filter
    if (selectedType !== 'all') {
      filtered = filtered.filter(event => event.type === selectedType);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(event => event.category === selectedCategory);
    }

    // Apply priority filter
    if (selectedPriority !== 'all') {
      filtered = filtered.filter(event => event.priority === selectedPriority);
    }

    setFilteredEvents(filtered);
  };

  const handleSubscribe = async (eventId: string) => {
    try {
      const event = events.find(e => e.id === eventId);
      if (!event) return;

      const subscription = {
        id: `sub_${eventId}_${Date.now()}`,
        user_id: 'current_user', // This would come from auth context
        event_id: eventId,
        subscribed_at: new Date().toISOString(),
        notification_preferences: {
          push: true,
          email: true,
          sms: false,
          reminder_days: event.notification_settings.reminder_days
        },
        status: 'active'
      };

      const existingSubscriptions = await offlineStorage.getUserData('timeline_subscriptions') || [];
      const updatedSubscriptions = [...existingSubscriptions, subscription];
      
      await offlineStorage.saveUserData('timeline_subscriptions', updatedSubscriptions);
      
      setSubscribedEvents(prev => new Set([...prev, eventId]));
      
      // Request notification permission
      if ('Notification' in window && Notification.permission === 'default') {
        await Notification.requestPermission();
      }
      
    } catch (error) {
      console.error('Error subscribing to event:', error);
    }
  };

  const handleUnsubscribe = async (eventId: string) => {
    try {
      const existingSubscriptions = await offlineStorage.getUserData('timeline_subscriptions') || [];
      const updatedSubscriptions = existingSubscriptions.filter((sub: any) => sub.event_id !== eventId);
      
      await offlineStorage.saveUserData('timeline_subscriptions', updatedSubscriptions);
      setSubscribedEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    } catch (error) {
      console.error('Error unsubscribing from event:', error);
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'exam': return <BookOpen className="h-5 w-5" />;
      case 'admission': return <GraduationCap className="h-5 w-5" />;
      case 'scholarship': return <Award className="h-5 w-5" />;
      case 'counseling': return <Users className="h-5 w-5" />;
      case 'result': return <CheckCircle className="h-5 w-5" />;
      case 'deadline': return <AlertCircle className="h-5 w-5" />;
      default: return <Calendar className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'completed': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilEvent = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const renderEventCard = (event: TimelineEvent) => {
    const daysUntil = getDaysUntilEvent(event.dates.start);
    const isSubscribed = subscribedEvents.has(event.id);

    return (
      <Card key={event.id} className="card-gradient border-border p-6 hover:shadow-lg transition-all">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              {getEventIcon(event.type)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{event.title}</h3>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getPriorityColor(event.priority)}>
              {event.priority}
            </Badge>
            <Badge className={getStatusColor(event.status)}>
              {event.status}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>Application Period</span>
            </div>
            <p className="text-sm font-medium">
              {formatDate(event.dates.start)} - {formatDate(event.dates.end)}
            </p>
            {event.dates.exam_date && (
              <p className="text-xs text-muted-foreground mt-1">
                Exam: {formatDate(event.dates.exam_date)}
              </p>
            )}
          </div>
          
          <div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
              <Clock className="h-4 w-4" />
              <span>Time Remaining</span>
            </div>
            <p className="text-sm font-medium">
              {daysUntil > 0 ? `${daysUntil} days left` : 
               daysUntil === 0 ? 'Today' : 
               `${Math.abs(daysUntil)} days ago`}
            </p>
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <Building className="h-4 w-4" />
            <span>Category</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {event.category}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => window.open(event.website, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Apply
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => handleSubscribe(event.id)}
              disabled={isSubscribed}
            >
              {isSubscribed ? (
                <>
                  <Star className="h-4 w-4 mr-1 fill-current" />
                  Subscribed
                </>
              ) : (
                <>
                  <StarOff className="h-4 w-4 mr-1" />
                  Subscribe
                </>
              )}
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Fee: ₹{event.fees.application_fee}
          </div>
        </div>
      </Card>
    );
  };

  const getTabEvents = () => {
    switch (activeTab) {
      case 'upcoming':
        return getUpcomingEvents(90);
      case 'active':
        return getActiveEvents();
      case 'high-priority':
        return getHighPriorityEvents();
      case 'exams':
        return getEventsByType('exam');
      case 'scholarships':
        return getEventsByType('scholarship');
      case 'admissions':
        return getEventsByType('admission');
      default:
        return filteredEvents;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Timeline Tracker</h1>
          <p className="text-muted-foreground">
            Stay updated with important dates for exams, admissions, and scholarships
          </p>
        </div>

        {/* Filters */}
        <Card className="card-gradient border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Event Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {types.map(type => (
                  <SelectItem key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedPriority} onValueChange={setSelectedPriority}>
              <SelectTrigger>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="high-priority">High Priority</TabsTrigger>
            <TabsTrigger value="exams">Exams</TabsTrigger>
            <TabsTrigger value="scholarships">Scholarships</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {getTabEvents().map(renderEventCard)}
            </div>
            
            {getTabEvents().length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No Events Found</h3>
                <p className="text-muted-foreground">
                  No events match your current filters. Try adjusting your search criteria.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="card-gradient border-border p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span>Notification Settings</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export Calendar</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Share2 className="h-4 w-4" />
              <span>Share Timeline</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Manage Subscriptions</span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TimelineTracker;
