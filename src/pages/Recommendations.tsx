import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Target, 
  Star,
  Download,
  Share2,
  Brain,
  Award,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { offlineStorage } from '@/lib/offlineStorage';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    try {
      const offlineData = await offlineStorage.getUserData('latest_quiz_results');
      if (offlineData && offlineData.recommendations) {
        setRecommendations({
          career_recommendations: offlineData.recommendations.career_recommendations,
          course_recommendations: { courses: offlineData.recommendations.course_recommendations || [] },
          generated_at: new Date(offlineData.timestamp).toISOString(),
          source: 'offline'
        });
        setIsLoading(false);
        return;
      }

      if (user) {
        const { data, error } = await supabase
          .from('recommendations')
          .select('*')
          .eq('user_id', user.id)
          .order('generated_at', { ascending: false })
          .limit(1);

        if (!error && data && data.length > 0) {
          setRecommendations(data[0]);
        }
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Export with jsPDF + html2canvas
  const exportPDF = async () => {
    const element = document.getElementById("recommendations-content");
    if (element) {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("career-recommendations.pdf");
    }
  };

  // ✅ Web Share API
  const shareRecommendations = async () => {
    if (navigator.share) {
      await navigator.share({
        title: "My Career Recommendations",
        text: "Check out my AI-powered career recommendations from EdVise!",
        url: window.location.href,
      });
    } else {
      // Fallback: copy link
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="card-gradient border-border text-center p-12">
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No Recommendations Yet</h2>
            <p className="text-muted-foreground mb-8">
              Take our career assessment quiz to get personalized AI-powered recommendations.
            </p>
            <Link to="/quiz">
              <Button variant="accent" size="lg">
                Take Career Quiz
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="recommendations-content">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Career Recommendations</h1>
              <p className="text-muted-foreground">
                AI-powered insights based on your quiz responses
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" onClick={exportPDF}>
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="accent" onClick={shareRecommendations}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Recommendations */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-primary" />
                  Top Career Matches
                </h2>
                
                <div className="space-y-6">
                  {recommendations.career_recommendations.map((career: any, index: number) => (
                    <div key={index} className="p-6 bg-secondary/20 rounded-lg border border-border/50">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{career.title}</h3>
                            <Badge variant="secondary" className="bg-primary/20 text-primary">
                              {career.match_percentage}% Match
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{career.description}</p>
                          <p className="text-sm text-secondary-foreground">{career.reason}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(career.match_percentage / 20) 
                                  ? 'text-accent fill-current' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <Progress value={career.match_percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Course Recommendations */}
            {recommendations.course_recommendations && (
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-accent" />
                  Recommended Courses
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recommendations.course_recommendations.courses?.map((course: string, index: number) => (
                    <div key={index} className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                        <h4 className="font-medium text-foreground mb-2">{course}</h4>
                        <p className="text-sm text-muted-foreground">Recommended for your career path</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link to="/colleges" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <MapPin className="h-4 w-4 mr-3" />
                      Find Colleges
                    </Button>
                  </Link>
                  <Link to="/scholarships" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Award className="h-4 w-4 mr-3" />
                      Browse Scholarships
                    </Button>
                  </Link>
                  <Link to="/quiz" className="block">
                    <Button variant="outline" className="w-full justify-start">
                      <Brain className="h-4 w-4 mr-3" />
                      Retake Quiz
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>

            {/* Match Summary */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Top Match</span>
                    <span className="text-sm font-medium text-accent">
                      {recommendations.career_recommendations[0]?.match_percentage}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Careers Analyzed</span>
                    <span className="text-sm font-medium">{recommendations.career_recommendations.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Generated</span>
                    <span className="text-sm font-medium">
                      {new Date(recommendations.generated_at).toLocaleDateString()}
                    </span>
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

export default Recommendations;