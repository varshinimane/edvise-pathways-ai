import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  BookOpen,
  Code,
  Palette,
  Stethoscope,
  Calculator,
  Loader2,
  AlertCircle,
  TrendingUp,
  Users,
  Briefcase
} from 'lucide-react';
import { useGemini } from '@/hooks/useGemini';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: string[];
  icon: any;
}

interface CareerRecommendation {
  title: string;
  match: number;
  description: string;
  icon: any;
  reasons: string[];
  salary_range?: string;
  growth_prospect?: string;
}

interface QuizAnalysis {
  personality_traits: string[];
  strengths: string[];
  interests: string[];
  work_style: string;
  career_recommendations: CareerRecommendation[];
  summary: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Interests',
    question: 'Which activities do you find most engaging?',
    options: [
      'Solving complex mathematical problems',
      'Creating art or design projects', 
      'Building or fixing things',
      'Helping and caring for others',
      'Analyzing data and patterns'
    ],
    icon: Brain
  },
  {
    id: 2,
    category: 'Skills',
    question: 'What are your strongest skills?',
    options: [
      'Logical reasoning and problem-solving',
      'Creative thinking and innovation',
      'Communication and leadership', 
      'Technical and analytical skills',
      'Interpersonal and empathy skills'
    ],
    icon: Sparkles
  },
  {
    id: 3,
    category: 'Work Environment',
    question: 'What type of work environment appeals to you?',
    options: [
      'Quiet office with individual focus',
      'Collaborative team environment',
      'Hands-on workshop or lab',
      'Dynamic field work',
      'Research and academic setting'
    ],
    icon: BookOpen
  },
  {
    id: 4,
    category: 'Career Goals',
    question: 'What motivates you most in a career?',
    options: [
      'Making a positive impact on society',
      'Financial stability and growth',
      'Creative expression and innovation',
      'Continuous learning and discovery',
      'Leadership and influence'
    ],
    icon: CheckCircle
  },
  {
    id: 5,
    category: 'Subjects',
    question: 'Which subjects interest you the most?',
    options: [
      'Mathematics and Physics',
      'Biology and Chemistry',
      'Arts and Literature',
      'Computer Science and Technology',
      'Business and Economics'
    ],
    icon: Calculator
  }
];

const Quiz = () => {
  const { user } = useAuth();
  const { callGeminiAPI, isLoading: geminiLoading, error: geminiError } = useGemini();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
  const CurrentIcon = quizQuestions[currentQuestion]?.icon || Brain;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      await analyzeQuizResponses();
    }
  };

  const analyzeQuizResponses = async () => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Prepare quiz data for Gemini analysis
      const quizData = {
        responses: answers,
        questions: quizQuestions.map(q => ({
          id: q.id,
          category: q.category,
          question: q.question,
          options: q.options
        }))
      };

      // Create a comprehensive prompt for Gemini
      const prompt = `Analyze this career assessment quiz responses and provide personalized career recommendations.

Quiz Responses:
${Object.entries(answers).map(([questionId, answer]) => {
  const question = quizQuestions.find(q => q.id === parseInt(questionId));
  return `Q${questionId} (${question?.category}): ${question?.question}\nAnswer: ${answer}`;
}).join('\n\n')}

IMPORTANT: Respond ONLY with valid JSON. Do not include any markdown formatting, explanations, or additional text. The response must be parseable JSON.

Required JSON format:
{
  "personality_traits": ["trait1", "trait2", "trait3"],
  "strengths": ["strength1", "strength2", "strength3"],
  "interests": ["interest1", "interest2", "interest3"],
  "work_style": "description of preferred work style",
  "career_recommendations": [
    {
      "title": "Career Title",
      "match": 85,
      "description": "Brief description of the career",
      "reasons": ["reason1", "reason2", "reason3"],
      "salary_range": "₹X-Y LPA",
      "growth_prospect": "High/Medium/Low"
    }
  ],
  "summary": "Overall assessment summary"
}

Focus on Indian career opportunities and provide realistic salary ranges in INR. Include at least 3 career recommendations with match percentages between 70-95.`;

      const geminiResponse = await callGeminiAPI(prompt, 'quiz_analysis');

      if (geminiResponse?.response) {
        try {
          // Clean the response to extract JSON
          let responseText = geminiResponse.response;
          
          // Try to extract JSON from the response if it's wrapped in markdown or other text
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            responseText = jsonMatch[0];
          }
          
          // Parse the JSON response from Gemini
          const parsedAnalysis = JSON.parse(responseText);
          
          // Validate the response structure
          if (!parsedAnalysis.career_recommendations || !Array.isArray(parsedAnalysis.career_recommendations)) {
            throw new Error('Invalid response structure from AI');
          }
          
          // Map icons to recommendations
          const iconMap = {
            'Computer Science': Code,
            'Data Science': Calculator,
            'Engineering': Briefcase,
            'Medicine': Stethoscope,
            'Design': Palette,
            'Business': TrendingUp,
            'Education': BookOpen,
            'Research': Brain,
            'default': Briefcase
          };

          parsedAnalysis.career_recommendations = parsedAnalysis.career_recommendations.map((rec: any) => {
            const iconKey = Object.keys(iconMap).find(key => 
              rec.title.toLowerCase().includes(key.toLowerCase())
            );
            return {
              ...rec,
              icon: iconMap[iconKey as keyof typeof iconMap] || iconMap.default
            };
          });

          setAnalysis(parsedAnalysis);

          // Save quiz responses and analysis to database
          await saveQuizData(parsedAnalysis);

          setIsCompleted(true);
        } catch (parseError) {
          console.error('Error parsing Gemini response:', parseError);
          console.error('Raw response:', geminiResponse.response);
          
          // Fallback: Create a basic analysis from quiz responses
          const fallbackAnalysis = createFallbackAnalysis(answers);
          setAnalysis(fallbackAnalysis);
          setIsCompleted(true);
        }
      } else {
        setError('Failed to get AI analysis. Please try again.');
      }
    } catch (err) {
      console.error('Error analyzing quiz:', err);
      setError('An error occurred while analyzing your responses. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const createFallbackAnalysis = (answers: Record<number, string>): QuizAnalysis => {
    // Analyze answers to create basic recommendations
    const answerText = Object.values(answers).join(' ').toLowerCase();
    
    let recommendations = [];
    
    // Simple keyword-based analysis
    if (answerText.includes('mathematical') || answerText.includes('physics') || answerText.includes('computer science')) {
      recommendations.push({
        title: 'Computer Science Engineering',
        match: 88,
        description: 'Perfect for analytical minds who enjoy problem-solving and technology',
        reasons: ['Strong mathematical foundation', 'Logical thinking skills', 'Interest in technology'],
        salary_range: '₹6-15 LPA',
        growth_prospect: 'High',
        icon: Code
      });
    }
    
    if (answerText.includes('data') || answerText.includes('analytical') || answerText.includes('patterns')) {
      recommendations.push({
        title: 'Data Science & Analytics',
        match: 85,
        description: 'Ideal for those who love working with data and finding insights',
        reasons: ['Analytical mindset', 'Pattern recognition skills', 'Data-driven approach'],
        salary_range: '₹5-12 LPA',
        growth_prospect: 'High',
        icon: Calculator
      });
    }
    
    if (answerText.includes('helping') || answerText.includes('caring') || answerText.includes('biology')) {
      recommendations.push({
        title: 'Medicine & Healthcare',
        match: 82,
        description: 'Great for compassionate individuals who want to help others',
        reasons: ['Caring nature', 'Interest in biology', 'Desire to help others'],
        salary_range: '₹8-20 LPA',
        growth_prospect: 'High',
        icon: Stethoscope
      });
    }
    
    // Default recommendations if no specific matches
    if (recommendations.length === 0) {
      recommendations = [
        {
          title: 'Business Administration',
          match: 75,
          description: 'Versatile career path with opportunities in various industries',
          reasons: ['Broad skill set', 'Leadership potential', 'Communication skills'],
          salary_range: '₹4-10 LPA',
          growth_prospect: 'Medium',
          icon: TrendingUp
        },
        {
          title: 'Engineering',
          match: 78,
          description: 'Technical career with strong problem-solving focus',
          reasons: ['Technical aptitude', 'Problem-solving skills', 'Innovation mindset'],
          salary_range: '₹5-12 LPA',
          growth_prospect: 'High',
          icon: Briefcase
        }
      ];
    }
    
    return {
      personality_traits: ['Analytical', 'Problem-solver', 'Goal-oriented'],
      strengths: ['Logical thinking', 'Attention to detail', 'Persistence'],
      interests: ['Technology', 'Problem-solving', 'Learning'],
      work_style: 'Prefers structured environments with clear goals and challenges',
      career_recommendations: recommendations,
      summary: 'Based on your responses, you show strong analytical thinking and problem-solving abilities. These traits align well with technical and analytical career paths.'
    };
  };

  const saveQuizData = async (analysis: QuizAnalysis) => {
    if (!user) return;

    try {
      // Save quiz responses
      const { error: quizError } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user.id,
          responses: answers,
          completed_at: new Date().toISOString()
        });

      if (quizError) {
        console.error('Error saving quiz responses:', quizError);
        return;
      }

      // Get the quiz response ID
      const { data: quizData } = await supabase
        .from('quiz_responses')
        .select('id')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
        .limit(1)
        .single();

      if (quizData) {
        // Save recommendations
        const { error: recError } = await supabase
          .from('recommendations')
          .insert({
            user_id: user.id,
            quiz_response_id: quizData.id,
            career_recommendations: analysis.career_recommendations,
            course_recommendations: analysis.interests,
            college_recommendations: [], // Can be populated later
            scholarship_matches: [], // Can be populated later
            generated_at: new Date().toISOString()
          });

        if (recError) {
          console.error('Error saving recommendations:', recError);
        }
      }
    } catch (err) {
      console.error('Error saving quiz data:', err);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setIsCompleted(false);
    setIsAnalyzing(false);
    setAnalysis(null);
    setError(null);
  };

  if (isCompleted && analysis) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="card-gradient border-border overflow-hidden">
            <div className="p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                
                <h1 className="text-2xl font-bold text-foreground mb-4">
                  Quiz Completed Successfully! 🎉
                </h1>
                
                <p className="text-muted-foreground mb-6">
                  {analysis.summary}
                </p>
              </div>

              {/* Personality Analysis */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Profile Analysis</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="p-4 bg-primary/5 border border-primary/20">
                    <h3 className="font-medium text-primary mb-3">Strengths</h3>
                    <div className="space-y-2">
                      {analysis.strengths.map((strength, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="text-sm text-foreground">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                  
                  <Card className="p-4 bg-accent/5 border border-accent/20">
                    <h3 className="font-medium text-accent mb-3">Work Style</h3>
                    <p className="text-sm text-foreground">{analysis.work_style}</p>
                  </Card>
                </div>
              </div>

              {/* Career Recommendations */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">Your Career Recommendations</h2>
                <div className="space-y-4">
                  {analysis.career_recommendations.map((rec, index) => {
                    const RecIcon = rec.icon;
                    return (
                      <Card key={index} className="p-6 bg-secondary/5 border border-secondary/20 hover:shadow-lg transition-all">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              <RecIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-foreground">{rec.title}</h3>
                              <p className="text-sm text-muted-foreground">{rec.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">{rec.match}%</div>
                            <div className="text-xs text-muted-foreground">Match</div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Why this career fits you:</h4>
                            <ul className="space-y-1">
                              {rec.reasons.map((reason, reasonIndex) => (
                                <li key={reasonIndex} className="flex items-start space-x-2 text-sm text-muted-foreground">
                                  <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                                  <span>{reason}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm">
                            {rec.salary_range && (
                              <div className="flex items-center space-x-1">
                                <TrendingUp className="h-4 w-4 text-accent" />
                                <span className="text-foreground font-medium">{rec.salary_range}</span>
                              </div>
                            )}
                            {rec.growth_prospect && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-4 w-4 text-primary" />
                                <span className="text-foreground font-medium">{rec.growth_prospect} Growth</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="accent"
                  size="lg"
                  onClick={() => window.location.href = '/recommendations'}
                >
                  View Detailed Report
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  onClick={handleRestart}
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="card-gradient border-border overflow-hidden">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
              
              <h1 className="text-2xl font-bold text-foreground mb-4">
                Analyzing Your Responses...
              </h1>
              
              <p className="text-muted-foreground mb-8">
                Our AI is processing your quiz responses to generate personalized career recommendations.
                This may take a few moments.
              </p>

              <div className="flex items-center justify-center space-x-2 text-primary">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  const question = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-primary">
      {error && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <Alert className="border-destructive/50 text-destructive mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      )}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-accent rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Career Assessment Quiz</h1>
              <p className="text-muted-foreground">Discover your ideal career path</p>
            </div>
          </div>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary font-medium">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{question.category}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="card-gradient border-border overflow-hidden mb-8">
          <div className="p-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-xl">
                <CurrentIcon className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="mb-2">
                  <span className="text-xs font-medium text-primary uppercase tracking-wide">
                    {question.category}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-foreground leading-relaxed">
                  {question.question}
                </h2>
              </div>
            </div>

            <RadioGroup 
              value={answers[currentQuestion] || ''} 
              onValueChange={handleAnswerSelect}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 rounded-lg hover:bg-secondary/20 transition-colors border border-transparent hover:border-border/50">
                  <RadioGroupItem 
                    value={option} 
                    id={`option-${index}`}
                    className="text-primary" 
                  />
                  <Label 
                    htmlFor={`option-${index}`} 
                    className="flex-1 text-foreground font-medium cursor-pointer"
                  >
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </Button>

          <div className="flex space-x-2">
            {quizQuestions.map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion 
                    ? 'bg-primary' 
                    : index < currentQuestion 
                      ? 'bg-accent' 
                      : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <Button 
            onClick={handleNext}
            disabled={!answers[currentQuestion] || isAnalyzing}
            variant="accent"
            className="font-medium flex items-center space-x-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>{currentQuestion === quizQuestions.length - 1 ? 'Complete' : 'Next'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;