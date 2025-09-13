import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Award, 
  GraduationCap, 
  TrendingUp, 
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useGemini } from '@/hooks/useGemini';

interface PersonalizedRecommendation {
  type: 'college' | 'scholarship' | 'course' | 'career';
  title: string;
  description: string;
  location?: string;
  amount?: number;
  eligibility?: string[];
  link?: string;
  match_score?: number;
}

const PersonalizedRecommendations = () => {
  const { user } = useAuth();
  const { callGeminiAPI, isLoading } = useGemini();
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      generatePersonalizedRecommendations();
    }
  }, [user]);

  const generatePersonalizedRecommendations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      // Get user profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (!profile) {
        setError('Please complete your profile to get personalized recommendations.');
        setLoading(false);
        return;
      }

      // Get nearby colleges
      const { data: colleges } = await supabase.rpc('get_personalized_recommendations', {
        input_user_id: user.id
      });

      // Get scholarships
      const { data: scholarships } = await supabase
        .from('scholarships')
        .select('*')
        .eq('is_active', true)
        .limit(5);

      // Use AI to generate personalized recommendations
      const prompt = `Based on this user profile, generate personalized recommendations:
      Profile: ${JSON.stringify(profile)}
      
      Available colleges: ${JSON.stringify(colleges)}
      Available scholarships: ${JSON.stringify(scholarships)}
      
      Generate 8-10 personalized recommendations including:
      1. Top 3 colleges based on location and interests
      2. Top 3 scholarships they're eligible for
      3. 2-3 career paths aligned with their profile
      4. 2-3 courses/certifications they should consider
      
      Return as JSON array with: type, title, description, location, amount, eligibility, link, match_score`;

      const aiResponse = await callGeminiAPI(prompt, 'career_guidance');
      
      if (aiResponse) {
        try {
          const parsedRecommendations = JSON.parse(aiResponse.response);
          setRecommendations(parsedRecommendations);
        } catch (parseError) {
          // Fallback to basic recommendations
          const basicRecommendations = [
            ...colleges?.slice(0, 3).map((college: any) => ({
              type: 'college' as const,
              title: college.name,
              description: college.description || 'Government college with quality education',
              location: college.location,
              match_score: 85
            })) || [],
            ...scholarships?.slice(0, 3).map((scholarship: any) => ({
              type: 'scholarship' as const,
              title: scholarship.name,
              description: scholarship.description,
              amount: scholarship.amount,
              eligibility: scholarship.eligibility_criteria,
              match_score: 80
            })) || []
          ];
          setRecommendations(basicRecommendations);
        }
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setError('Failed to generate recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'college': return <GraduationCap className="h-5 w-5" />;
      case 'scholarship': return <Award className="h-5 w-5" />;
      case 'course': return <TrendingUp className="h-5 w-5" />;
      case 'career': return <TrendingUp className="h-5 w-5" />;
      default: return <GraduationCap className="h-5 w-5" />;
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'college': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'scholarship': return 'bg-green-100 text-green-800 border-green-200';
      case 'course': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'career': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <Card className="card-gradient border-border p-6">
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generating personalized recommendations...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="card-gradient border-border p-6">
        <div className="flex items-center space-x-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Personalized for You</h2>
        <p className="text-muted-foreground">AI-powered recommendations based on your profile</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec, index) => (
          <Card key={index} className="card-gradient border-border p-6 hover:shadow-lg transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  {getRecommendationIcon(rec.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{rec.title}</h3>
                  <Badge className={getRecommendationColor(rec.type)}>
                    {rec.type}
                  </Badge>
                </div>
              </div>
              {rec.match_score && (
                <div className="text-right">
                  <div className="text-lg font-bold text-accent">{rec.match_score}%</div>
                  <div className="text-xs text-muted-foreground">match</div>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mb-4">{rec.description}</p>

            <div className="space-y-2">
              {rec.location && (
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{rec.location}</span>
                </div>
              )}
              
              {rec.amount && (
                <div className="flex items-center space-x-2 text-sm">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span>₹{rec.amount.toLocaleString()}</span>
                </div>
              )}

              {rec.eligibility && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {rec.eligibility.slice(0, 2).map((criteria, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {criteria}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {rec.link && (
              <div className="mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(rec.link, '_blank')}
                  className="w-full"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn More
                </Button>
              </div>
            )}
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={generatePersonalizedRecommendations}
          disabled={isLoading}
          variant="outline"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Updating...
            </>
          ) : (
            'Refresh Recommendations'
          )}
        </Button>
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;