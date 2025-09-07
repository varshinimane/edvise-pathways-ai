import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Brain, 
  MapPin, 
  Award, 
  TrendingUp, 
  Users, 
  BookOpen, 
  Target,
  ArrowRight,
  Clock,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    profileComplete: 0,
    matchesFound: 0,
    collegesViewed: 0,
    applications: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Helper function to calculate time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch user profile for completion calculation
        const { data: profileData } = await supabase
          .from('profiles')
          .select('full_name, location, phone')
          .eq('user_id', user.id)
          .single();

        // Calculate real profile completion
        let profileComplete = 0;
        if (profileData) {
          const fields = [profileData.full_name, profileData.location, profileData.phone];
          const completedFields = fields.filter(field => field && field.trim() !== '').length;
          profileComplete = Math.round((completedFields / fields.length) * 100);
        }

        // Fetch quiz responses count
        const { data: quizData } = await supabase
          .from('quiz_responses')
          .select('id, completed_at')
          .eq('user_id', user.id);

        // Fetch recommendations count
        const { data: recommendationsData } = await supabase
          .from('recommendations')
          .select('id, created_at')
          .eq('user_id', user.id);

        // Fetch colleges viewed (if you have a colleges_viewed table)
        const { data: collegesData } = await supabase
          .from('colleges_viewed')
          .select('id')
          .eq('user_id', user.id);

        // Fetch applications (if you have an applications table)
        const { data: applicationsData } = await supabase
          .from('applications')
          .select('id')
          .eq('user_id', user.id);

        setStats({
          profileComplete,
          matchesFound: recommendationsData?.length || 0,
          collegesViewed: collegesData?.length || 0,
          applications: applicationsData?.length || 0
        });

        // Generate recent activity based on real data
        const activity = [];
        
        if (quizData?.length > 0) {
          const latestQuiz = quizData.sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0];
          const timeAgo = getTimeAgo(new Date(latestQuiz.completed_at));
          activity.push({
            id: 'quiz-1',
            action: 'Completed Career Interest Quiz',
            time: timeAgo,
            type: 'quiz'
          });
        }
        
        if (recommendationsData?.length > 0) {
          const latestRec = recommendationsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
          const timeAgo = getTimeAgo(new Date(latestRec.created_at));
          activity.push({
            id: 'rec-1',
            action: 'Received Career Recommendations',
            time: timeAgo,
            type: 'recommendation'
          });
        }
        
        if (profileComplete > 0) {
          activity.push({
            id: 'profile-1',
            action: 'Updated Profile',
            time: 'Recently',
            type: 'profile'
          });
        }

        // Add welcome activity if no other activities
        if (activity.length === 0) {
          activity.push({
            id: 'welcome-1',
            action: 'Welcome to EdVise!',
            time: 'Just now',
            type: 'welcome'
          });
        }

        setRecentActivity(activity);
        setRecommendations(recommendationsData || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        // Set fallback data
        setStats({
          profileComplete: 0,
          matchesFound: 0,
          collegesViewed: 0,
          applications: 0
        });
        setRecentActivity([{
          id: 'welcome-1',
          action: 'Welcome to EdVise!',
          time: 'Just now',
          type: 'welcome'
        }]);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Please log in to view your dashboard</h1>
          <Link to="/auth">
            <Button>Go to Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  const quickActions = [
    {
      id: 'quiz',
      title: 'Take Career Quiz',
      description: 'Discover your ideal career path with our AI-powered assessment',
      icon: Brain,
      progress: stats.matchesFound > 0 ? 100 : 0,
      action: 'Get Started →',
      href: '/quiz'
    },
    {
      id: 'recommendations',
      title: 'View Recommendations',
      description: 'Explore personalized career and college recommendations',
      icon: TrendingUp,
      progress: stats.matchesFound > 0 ? 100 : 0,
      action: 'View All →',
      href: '/recommendations'
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'quiz': return Brain;
      case 'recommendation': return TrendingUp;
      case 'profile': return Users;
      case 'college': return MapPin;
      case 'application': return Award;
      default: return Star;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Student'}! 👋
              </h1>
              <p className="text-muted-foreground">
                Continue your journey to finding the perfect career path
              </p>
            </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.profileComplete}%</p>
                <p className="text-sm text-muted-foreground">Profile Complete</p>
              </div>
            </div>
          </Card>
          
          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.matchesFound}</p>
                <p className="text-sm text-muted-foreground">Matches Found</p>
              </div>
            </div>
          </Card>
          
          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-secondary/30 rounded-lg">
                <BookOpen className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.collegesViewed}</p>
                <p className="text-sm text-muted-foreground">Colleges Viewed</p>
              </div>
            </div>
          </Card>
          
          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.applications}</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-foreground mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Card key={action.id} className="card-gradient border-border p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-accent/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-accent" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground mb-1">{action.title}</h3>
                          <p className="text-sm text-muted-foreground mb-3">{action.description}</p>
                          <div className="flex items-center space-x-2">
                            <Progress value={action.progress} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground">{action.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <Link to={action.href}>
                        <Button variant="accent" size="sm">
                          {action.action}
                        </Button>
                      </Link>
                </div>
              </Card>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-6">Recent Activity</h2>
            <Card className="card-gradient border-border p-6">
                <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => {
                    const IconComponent = getActivityIcon(activity.type);
                    return (
                      <div key={activity.id} className="flex items-center space-x-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                          <IconComponent className="h-4 w-4 text-accent" />
                      </div>
                      <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-4">
                    <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                    </div>
                )}
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="card-gradient border-border p-6 mt-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
                <div className="space-y-3">
                {stats.profileComplete < 100 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <Link to="/profile" className="text-sm text-accent hover:underline">
                      Complete your profile
                    </Link>
                  </div>
                )}
                {stats.matchesFound === 0 && (
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <Link to="/quiz" className="text-sm text-accent hover:underline">
                      Take the career quiz
                    </Link>
                  </div>
                )}
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <Link to="/colleges" className="text-sm text-accent hover:underline">
                    Explore colleges
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;