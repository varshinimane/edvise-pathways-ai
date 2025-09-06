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

const Dashboard = () => {
  const quickActions = [
    {
      title: 'Take Career Quiz',
      description: 'Discover your ideal career path with our AI-powered assessment',
      icon: Brain,
      href: '/quiz',
      gradient: 'bg-gradient-accent',
      progress: 0
    },
    {
      title: 'Explore Colleges',
      description: 'Find colleges near you with interactive maps',
      icon: MapPin,
      href: '/colleges',
      gradient: 'bg-primary',
      progress: null
    },
    {
      title: 'Find Scholarships',
      description: 'Browse government scholarships matching your profile',
      icon: Award,
      href: '/scholarships',
      gradient: 'bg-secondary',
      progress: null
    }
  ];

  const recentActivity = [
    { action: 'Completed Career Interest Quiz', time: '2 hours ago', icon: Brain },
    { action: 'Viewed IIT Delhi profile', time: '1 day ago', icon: MapPin },
    { action: 'Applied to Merit Scholarship', time: '3 days ago', icon: Award }
  ];

  const recommendations = [
    {
      title: 'Computer Science Engineering',
      match: 92,
      reason: 'Strong analytical skills and programming interest',
      colleges: 15
    },
    {
      title: 'Data Science',
      match: 87,
      reason: 'Excellent mathematical foundation',
      colleges: 8
    },
    {
      title: 'Artificial Intelligence',
      match: 84,
      reason: 'High logical reasoning scores',
      colleges: 12
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Welcome back, Student! 👋
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
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Profile Complete</p>
              </div>
            </div>
          </Card>
          
          <Card className="card-gradient border-border p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">47</p>
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
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Applications</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
                {quickActions.map((action, index) => (
                  <Card key={index} className="card-gradient border-border overflow-hidden group">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 ${action.gradient} rounded-xl`}>
                          <action.icon className="h-6 w-6 text-white" />
                        </div>
                        <Link to={action.href}>
                          <Button 
                            variant="accent" 
                            size="lg"
                            className="group-hover:shadow-strong transition-all"
                          >
                            Get Started
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{action.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                      
                      {action.progress !== null && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-primary font-medium">{action.progress}%</span>
                          </div>
                          <Progress value={action.progress} className="h-2" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* AI Recommendations */}
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-4">AI Career Recommendations</h2>
              <Card className="card-gradient border-border">
                <div className="p-6">
                  <div className="space-y-4">
                    {recommendations.map((rec, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg border border-border/50">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-medium text-foreground">{rec.title}</h3>
                            <div className="flex items-center space-x-1">
                              <Star className="h-4 w-4 text-accent fill-current" />
                              <span className="text-sm font-medium text-accent">{rec.match}% match</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">{rec.reason}</p>
                          <p className="text-xs text-primary">{rec.colleges} colleges available</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Explore
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Activity Sidebar */}
          <div className="space-y-6">
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="p-2 bg-muted/50 rounded-lg">
                        <activity.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-foreground">{activity.action}</p>
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Next Steps */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
                <div className="space-y-3">
                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-sm text-foreground font-medium">Complete your profile</p>
                    <p className="text-xs text-muted-foreground mt-1">Add skills and preferences</p>
                  </div>
                  <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                    <p className="text-sm text-foreground font-medium">Take aptitude test</p>
                    <p className="text-xs text-muted-foreground mt-1">Get personalized recommendations</p>
                  </div>
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