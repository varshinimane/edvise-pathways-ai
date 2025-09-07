import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Brain, 
  Award, 
  Target, 
  Star, 
  Zap, 
  CheckCircle, 
  Building, 
  DollarSign, 
  MapPin,
  ArrowRight,
  Sparkles,
  Shield,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const features = [
    {
      icon: Target,
      title: "Smart Recommendations",
      description: "AI analyzes your interests and skills to suggest perfect career paths.",
      color: "text-accent"
    },
    {
      icon: Star,
      title: "Verified Data",
      description: "Access government-verified college and scholarship information.",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get personalized recommendations in minutes, not hours.",
      color: "text-accent"
    }
  ];

  const benefits = [
    {
      icon: CheckCircle,
      title: "Personalized Approach",
      description: "Our AI analyzes your unique profile to suggest career paths that align with your interests and strengths.",
      color: "text-accent"
    },
    {
      icon: Building,
      title: "Verified Data",
      description: "Access authentic information from UGC, AISHE, and other government sources.",
      color: "text-accent"
    },
    {
      icon: DollarSign,
      title: "Scholarship Discovery",
      description: "Find scholarships you qualify for and never miss funding opportunities.",
      color: "text-accent"
    },
    {
      icon: MapPin,
      title: "Location-Based",
      description: "Discover colleges and opportunities near you with integrated maps.",
      color: "text-accent"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-primary">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">EdVise</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/quiz" className="text-muted-foreground hover:text-foreground transition-colors">
                Quiz
              </Link>
              <Link to="/recommendations" className="text-muted-foreground hover:text-foreground transition-colors">
                Recommendations
              </Link>
              <Link to="/scholarships" className="text-muted-foreground hover:text-foreground transition-colors">
                Scholarships
              </Link>
              <Link to="/colleges" className="text-muted-foreground hover:text-foreground transition-colors">
                Colleges
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-sm">🔔</span>
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"></div>
              </div>
              <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-white">VM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Illustration */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <Badge className="mb-6 bg-accent/10 text-accent border-accent/20 hover:bg-accent/20">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Career Guidance
            </Badge>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Your One-Stop{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">
                Career & Education
              </span>{' '}
              Advisor
            </h1>

            {/* Description */}
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover your perfect career path with AI-powered recommendations, explore scholarships, 
              find nearby colleges, and make informed decisions about your educational future.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Start Your Career Quiz
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/scholarships">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 text-primary hover:bg-primary/5 px-8 py-4 text-lg font-semibold"
                >
                  Explore Scholarships
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-gradient border-border p-8 text-center group hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-accent/20 transition-colors">
                <feature.icon className={`h-8 w-8 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Why Choose EdVise Section */}
      <div className="bg-secondary/5 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose EdVise?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine cutting-edge AI technology with verified government data to provide you with 
              the most accurate and personalized educational guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="card-gradient border-border p-6 group hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <benefit.icon className={`h-6 w-6 ${benefit.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Card className="card-gradient border-border p-12 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Journey?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students who have found their perfect career path with EdVise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/quiz">
                <Button 
                  size="lg" 
                  className="bg-accent hover:bg-accent/90 text-white px-8 py-4 text-lg font-semibold"
                >
                  <Brain className="mr-2 h-5 w-5" />
                  Take Career Quiz
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-primary/20 text-primary hover:bg-primary/5 px-8 py-4 text-lg font-semibold"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
