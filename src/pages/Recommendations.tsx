import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
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
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import jsPDF from 'jspdf';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadRecommendations();
  }, [user]);

  const loadRecommendations = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('recommendations')
        .select('*')
        .eq('user_id', user.id)
        .order('generated_at', { ascending: false })
        .limit(1);

      if (data && data.length > 0) {
        setRecommendations(data[0]);
      }
    } catch (error) {
      console.error('Error loading recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = () => {
    if (!recommendations) return;

    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('EdVise Career Recommendations', 20, 30);
    
    doc.setFontSize(14);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 20, 50);
    
    let yPosition = 70;
    
    // Career Recommendations
    doc.setFontSize(16);
    doc.text('Career Recommendations:', 20, yPosition);
    yPosition += 20;
    
    recommendations.career_recommendations.forEach((career: any, index: number) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${career.title} (${career.match}% match)`, 20, yPosition);
      yPosition += 10;
      doc.text(`   ${career.description}`, 20, yPosition);
      yPosition += 15;
    });

    doc.save('career-recommendations.pdf');
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

  const careerData = {
    labels: recommendations.career_recommendations.map((c: any) => c.title),
    datasets: [
      {
        label: 'Match Percentage',
        data: recommendations.career_recommendations.map((c: any) => c.match),
        backgroundColor: [
          'rgba(78, 205, 196, 0.6)',
          'rgba(74, 229, 74, 0.6)',
          'rgba(178, 190, 195, 0.6)',
        ],
        borderColor: [
          'rgba(78, 205, 196, 1)',
          'rgba(74, 229, 74, 1)',
          'rgba(178, 190, 195, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const skillsData = {
    labels: recommendations.skills_to_develop?.map((s: any) => s.name) || [],
    datasets: [
      {
        data: recommendations.skills_to_develop?.map((s: any) => s.importance) || [],
        backgroundColor: [
          '#4ECDC4',
          '#4AE54A',
          '#B2BEC3',
          '#A29BFE',
          '#FD79A8',
        ],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <Button onClick={exportToPDF} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button variant="accent">
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
                              {career.match}% Match
                            </Badge>
                          </div>
                          <p className="text-muted-foreground mb-3">{career.description}</p>
                          <p className="text-sm text-secondary-foreground">{career.reasoning}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${
                                i < Math.floor(career.match / 20) 
                                  ? 'text-accent fill-current' 
                                  : 'text-muted-foreground'
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <Progress value={career.match} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Course Recommendations */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-accent" />
                  Recommended Courses
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendations.course_recommendations.map((course: any, index: number) => (
                    <div key={index} className="p-4 bg-secondary/20 rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">{course.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">{course.duration}</Badge>
                        <span className="text-sm text-primary">{course.difficulty}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Visualization */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-secondary-foreground" />
                  Career Match Analysis
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-4">Match Percentages</h3>
                    <Bar 
                      data={careerData} 
                      options={{
                        responsive: true,
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            max: 100,
                          },
                        },
                      }} 
                    />
                  </div>
                  
                  {recommendations.skills_to_develop && (
                    <div>
                      <h3 className="text-lg font-medium text-foreground mb-4">Skills to Develop</h3>
                      <Doughnut 
                        data={skillsData}
                        options={{
                          responsive: true,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Steps */}
            <Card className="card-gradient border-border">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Next Steps</h3>
                <div className="space-y-3">
                  {recommendations.next_steps?.map((step: string, index: number) => (
                    <div key={index} className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm text-foreground">{step}</p>
                    </div>
                  )) || (
                    <>
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg">
                        <p className="text-sm text-foreground">Explore relevant colleges</p>
                      </div>
                      <div className="p-3 bg-accent/5 border border-accent/20 rounded-lg">
                        <p className="text-sm text-foreground">Apply for scholarships</p>
                      </div>
                      <div className="p-3 bg-secondary/20 border border-border/50 rounded-lg">
                        <p className="text-sm text-foreground">Start skill development</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </Card>

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
                      {recommendations.career_recommendations[0]?.match}%
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