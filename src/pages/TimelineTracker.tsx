import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NotificationSettings from '@/components/NotificationSettings';
import NotificationTest from '@/components/NotificationTest';
import DemoGuide from '@/components/DemoGuide';
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
import { notificationService } from '@/lib/notificationService';
import { calendarExportService } from '@/lib/calendarExport';

const TimelineTracker = () => {
  const [events, setEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);
  const [filteredEvents, setFilteredEvents] = useState<TimelineEvent[]>(TIMELINE_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [subscribedEvents, setSubscribedEvents] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('upcoming');
  const [notificationSettingsOpen, setNotificationSettingsOpen] = useState(false);
  const [showNotificationTest, setShowNotificationTest] = useState(false);
  const [savedSearches, setSavedSearches] = useState<Array<{name: string, filters: any}>>([]);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateRange, setDateRange] = useState<{start: string, end: string}>({start: '', end: ''});
  const [feeRange, setFeeRange] = useState<{min: number, max: number}>({min: 0, max: 10000});

  const categories = getAllCategories();
  const types = getAllTypes();

  useEffect(() => {
    loadSubscribedEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchQuery, selectedType, selectedCategory, selectedPriority, dateRange, feeRange, events]);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      const searches = await offlineStorage.getUserData('saved_searches') || [];
      setSavedSearches(searches);
    } catch (error) {
      console.error('Error loading saved searches:', error);
    }
  };

  const saveCurrentSearch = async () => {
    const searchName = prompt('Enter a name for this search:');
    if (!searchName) return;

    const searchFilter = {
      searchQuery,
      selectedType,
      selectedCategory,
      selectedPriority,
      dateRange,
      feeRange
    };

    const newSearch = { name: searchName, filters: searchFilter };
    const updatedSearches = [...savedSearches, newSearch];
    
    try {
      await offlineStorage.saveUserData('saved_searches', updatedSearches);
      setSavedSearches(updatedSearches);
    } catch (error) {
      console.error('Error saving search:', error);
    }
  };

  const applySavedSearch = (savedSearch: {name: string, filters: any}) => {
    const { filters } = savedSearch;
    setSearchQuery(filters.searchQuery || '');
    setSelectedType(filters.selectedType || 'all');
    setSelectedCategory(filters.selectedCategory || 'all');
    setSelectedPriority(filters.selectedPriority || 'all');
    setDateRange(filters.dateRange || {start: '', end: ''});
    setFeeRange(filters.feeRange || {min: 0, max: 10000});
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedPriority('all');
    setDateRange({start: '', end: ''});
    setFeeRange({min: 0, max: 10000});
  };

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

    // Apply date range filter
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      filtered = filtered.filter(event => {
        const eventStart = new Date(event.dates.start);
        return eventStart >= startDate && eventStart <= endDate;
      });
    }

    // Apply fee range filter
    if (feeRange.min > 0 || feeRange.max < 10000) {
      filtered = filtered.filter(event => {
        const fee = event.fees.application_fee;
        return fee >= feeRange.min && fee <= feeRange.max;
      });
    }

    // Sort by relevance and urgency
    filtered.sort((a, b) => {
      // First priority: high priority events
      if (a.priority === 'high' && b.priority !== 'high') return -1;
      if (b.priority === 'high' && a.priority !== 'high') return 1;
      
      // Second priority: upcoming events (sooner first)
      const aDaysUntil = Math.ceil((new Date(a.dates.start).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      const bDaysUntil = Math.ceil((new Date(b.dates.start).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      
      if (aDaysUntil >= 0 && bDaysUntil >= 0) {
        return aDaysUntil - bDaysUntil;
      }
      
      return new Date(a.dates.start).getTime() - new Date(b.dates.start).getTime();
    });

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
      
      // Initialize and schedule notifications
      await notificationService.init();
      await notificationService.scheduleNotifications('current_user', subscription, event);
      
    } catch (error) {
      console.error('Error subscribing to event:', error);
    }
  };

  const handleUnsubscribe = async (eventId: string) => {
    try {
      const existingSubscriptions = await offlineStorage.getUserData('timeline_subscriptions') || [];
      const updatedSubscriptions = existingSubscriptions.filter((sub: any) => sub.event_id !== eventId);
      
      await offlineStorage.saveUserData('timeline_subscriptions', updatedSubscriptions);
      
      // Cancel scheduled notifications
      await notificationService.cancelNotifications(eventId, 'current_user');
      
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
    const isDemoEvent = event.id === 'demo-notification-test';

    return (
      <Card key={event.id} className={`card-gradient border-border p-6 hover:shadow-lg transition-all ${
        isDemoEvent ? 'ring-2 ring-blue-500 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950' : ''
      }`}>
        {isDemoEvent && (
          <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700 rounded-lg">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                🎯 Demo Event: Subscribe to test notifications instantly! You'll receive 3 demo notifications within 10 seconds.
              </span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isDemoEvent ? 'bg-blue-500/20' : 'bg-accent/10'
            }`}>
              {isDemoEvent ? <Bell className="h-5 w-5 text-blue-600" /> : getEventIcon(event.type)}
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
          <div className="flex items-center space-x-2 flex-wrap gap-2">
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
              onClick={() => isSubscribed ? handleUnsubscribe(event.id) : handleSubscribe(event.id)}
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
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                const urls = calendarExportService.generateSharingUrls(event);
                window.open(urls.google, '_blank');
              }}
            >
              <Calendar className="h-4 w-4 mr-1" />
              Add to Calendar
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

        {/* Demo Guide */}
        <DemoGuide />

        {/* Filters */}
        <Card className="card-gradient border-border p-6 mb-8">
          <div className="space-y-4">
            {/* Basic Filters Row */}
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

            {/* Advanced Filters Toggle */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Advanced Filters</span>
              </Button>
              
              <div className="flex items-center space-x-2">
                {savedSearches.length > 0 && (
                  <Select onValueChange={(value) => {
                    const savedSearch = savedSearches.find(s => s.name === value);
                    if (savedSearch) applySavedSearch(savedSearch);
                  }}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Saved Searches" />
                    </SelectTrigger>
                    <SelectContent>
                      {savedSearches.map(search => (
                        <SelectItem key={search.name} value={search.name}>
                          {search.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                
                <Button variant="outline" size="sm" onClick={saveCurrentSearch}>
                  Save Search
                </Button>
                
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </div>

            {/* Advanced Filters Panel */}
            {showAdvancedFilters && (
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Date Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) => setDateRange(prev => ({...prev, start: e.target.value}))}
                        placeholder="Start Date"
                      />
                      <Input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) => setDateRange(prev => ({...prev, end: e.target.value}))}
                        placeholder="End Date"
                      />
                    </div>
                  </div>

                  {/* Fee Range Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Application Fee Range</label>
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="number"
                        value={feeRange.min}
                        onChange={(e) => setFeeRange(prev => ({...prev, min: parseInt(e.target.value) || 0}))}
                        placeholder="Min Fee (₹)"
                      />
                      <Input
                        type="number"
                        value={feeRange.max}
                        onChange={(e) => setFeeRange(prev => ({...prev, max: parseInt(e.target.value) || 10000}))}
                        placeholder="Max Fee (₹)"
                      />
                    </div>
                  </div>

                  {/* Filter Summary */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Active Filters</label>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && <Badge variant="secondary">Search: {searchQuery}</Badge>}
                      {selectedType !== 'all' && <Badge variant="secondary">Type: {selectedType}</Badge>}
                      {selectedCategory !== 'all' && <Badge variant="secondary">Category: {selectedCategory}</Badge>}
                      {selectedPriority !== 'all' && <Badge variant="secondary">Priority: {selectedPriority}</Badge>}
                      {dateRange.start && <Badge variant="secondary">Date Range</Badge>}
                      {(feeRange.min > 0 || feeRange.max < 10000) && <Badge variant="secondary">Fee Range</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Showing {filteredEvents.length} of {events.length} events
                    </p>
                  </div>
                </div>
              </div>
            )}
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
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => setNotificationSettingsOpen(true)}
            >
              <Bell className="h-4 w-4" />
              <span>Notification Settings</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => setShowNotificationTest(!showNotificationTest)}
            >
              <Settings className="h-4 w-4" />
              <span>{showNotificationTest ? 'Hide' : 'Show'} Test Panel</span>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center space-x-2"
              onClick={() => calendarExportService.generateICS(filteredEvents)}
            >
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

        {/* Notification Test Panel */}
        {showNotificationTest && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">🧪 Notification Testing</h2>
            <NotificationTest />
          </div>
        )}
      </div>

      {/* Notification Settings Dialog */}
      <NotificationSettings
        open={notificationSettingsOpen}
        onClose={() => setNotificationSettingsOpen(false)}
        userId="current_user"
      />
    </div>
  );
};

export default TimelineTracker;


