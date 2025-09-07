import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  ArrowRight, 
  RotateCcw, 
  CheckCircle, 
  Loader2, 
  AlertCircle,
  TrendingUp,
  Users,
  Briefcase,
  Code,
  Heart,
  GraduationCap,
  Palette,
  BarChart3,
  Microscope,
  Wrench,
  Wifi,
  WifiOff,
  Globe
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { generateOfflineRecommendations } from '@/lib/offlineRecommendationEngine';

interface QuizQuestion {
  id: string;
  question: string;  
  options: string[];
  category: string;
  language: string;
}

interface CareerRecommendation {
  title: string;
  description: string;
  match_percentage: number;
  reason: string;
  required_education: string[];
  skills: string[];
  salary_range: string;
  growth_prospects: string;
  icon?: any;
}

interface QuizAnalysis {
  summary: string;
  strengths: string[];
  work_style: string;
  career_recommendations: CareerRecommendation[];
  course_recommendations?: string[];
}

// Simple fallback questions that always work
const FALLBACK_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What subjects do you enjoy studying the most?',
    options: ['Science and Mathematics', 'Languages and Literature', 'Social Sciences', 'Arts and Design', 'Business and Economics'],
    category: 'academic_interests',
    language: 'en'
  },
  {
    id: 'q2',
    question: 'What type of work environment do you prefer?',
    options: ['Research laboratory', 'Office setting', 'Outdoor/Field work', 'Creative studio', 'Classroom/Teaching'],
    category: 'work_environment',
    language: 'en'
  },
  {
    id: 'q3',
    question: 'How do you like to solve problems?',
    options: ['Through data analysis', 'By discussing with others', 'Using creative approaches', 'Following established procedures', 'Through experimentation'],
    category: 'problem_solving',
    language: 'en'
  },
  {
    id: 'q4',
    question: 'What motivates you most in your work?',
    options: ['Making discoveries', 'Helping others', 'Creating something new', 'Leading teams', 'Teaching and mentoring'],
    category: 'motivation',
    language: 'en'
  },
  {
    id: 'q5',
    question: 'How do you prefer to learn new things?',
    options: ['Through hands-on practice', 'By reading and research', 'Through group discussions', 'By watching demonstrations', 'Through trial and error'],
    category: 'learning_style',
    language: 'en'
  },
  {
    id: 'q6',
    question: 'What type of impact do you want to make?',
    options: ['Scientific breakthroughs', 'Social change', 'Economic growth', 'Cultural enrichment', 'Educational advancement'],
    category: 'impact_goals',
    language: 'en'
  },
  {
    id: 'q7',
    question: 'How do you handle challenges?',
    options: ['Analyze systematically', 'Seek help from others', 'Try multiple approaches', 'Follow proven methods', 'Learn from mistakes'],
    category: 'challenge_handling',
    language: 'en'
  },
  {
    id: 'q8',
    question: 'What kind of team role do you prefer?',
    options: ['Technical expert', 'Team leader', 'Creative contributor', 'Supporting role', 'Independent worker'],
    category: 'team_role',
    language: 'en'
  },
  {
    id: 'q9',
    question: 'How important is work-life balance to you?',
    options: ['Very important', 'Somewhat important', 'Not very important', 'Depends on the job', 'I prefer flexible schedules'],
    category: 'work_life_balance',
    language: 'en'
  },
  {
    id: 'q10',
    question: 'What type of career growth interests you?',
    options: ['Technical specialization', 'Management roles', 'Entrepreneurship', 'Research and development', 'Consulting'],
    category: 'career_growth',
    language: 'en'
  }
];

// Hindi questions
const HINDI_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'आप किन विषयों का अध्ययन करना सबसे अधिक पसंद करते हैं?',
    options: ['विज्ञान और गणित', 'भाषा और साहित्य', 'सामाजिक विज्ञान', 'कला और डिजाइन', 'व्यापार और अर्थशास्त्र'],
    category: 'academic_interests',
    language: 'hi'
  },
  {
    id: 'q2',
    question: 'आप किस प्रकार के कार्य वातावरण को पसंद करते हैं?',
    options: ['अनुसंधान प्रयोगशाला', 'कार्यालय सेटिंग', 'बाहरी/क्षेत्र कार्य', 'रचनात्मक स्टूडियो', 'कक्षा/शिक्षण'],
    category: 'work_environment',
    language: 'hi'
  },
  {
    id: 'q3',
    question: 'आप समस्याओं को कैसे हल करना पसंद करते हैं?',
    options: ['डेटा विश्लेषण के माध्यम से', 'दूसरों के साथ चर्चा करके', 'रचनात्मक दृष्टिकोण का उपयोग करके', 'स्थापित प्रक्रियाओं का पालन करके', 'प्रयोग के माध्यम से'],
    category: 'problem_solving',
    language: 'hi'
  },
  {
    id: 'q4',
    question: 'आपके काम में आपको क्या सबसे अधिक प्रेरित करता है?',
    options: ['खोज करना', 'दूसरों की मदद करना', 'कुछ नया बनाना', 'टीमों का नेतृत्व करना', 'शिक्षण और मार्गदर्शन'],
    category: 'motivation',
    language: 'hi'
  },
  {
    id: 'q5',
    question: 'आप नई चीजें कैसे सीखना पसंद करते हैं?',
    options: ['हाथों से अभ्यास के माध्यम से', 'पढ़ने और शोध के माध्यम से', 'समूह चर्चा के माध्यम से', 'प्रदर्शन देखकर', 'प्रयास और त्रुटि के माध्यम से'],
    category: 'learning_style',
    language: 'hi'
  },
  {
    id: 'q6',
    question: 'आप किस प्रकार का प्रभाव डालना चाहते हैं?',
    options: ['वैज्ञानिक सफलताएं', 'सामाजिक परिवर्तन', 'आर्थिक विकास', 'सांस्कृतिक समृद्धि', 'शैक्षिक प्रगति'],
    category: 'impact_goals',
    language: 'hi'
  },
  {
    id: 'q7',
    question: 'आप चुनौतियों का सामना कैसे करते हैं?',
    options: ['व्यवस्थित रूप से विश्लेषण करके', 'दूसरों से मदद मांगकर', 'कई दृष्टिकोण आजमाकर', 'सिद्ध तरीकों का पालन करके', 'गलतियों से सीखकर'],
    category: 'challenge_handling',
    language: 'hi'
  },
  {
    id: 'q8',
    question: 'आप किस प्रकार की टीम भूमिका पसंद करते हैं?',
    options: ['तकनीकी विशेषज्ञ', 'टीम लीडर', 'रचनात्मक योगदानकर्ता', 'सहायक भूमिका', 'स्वतंत्र कार्यकर्ता'],
    category: 'team_role',
    language: 'hi'
  },
  {
    id: 'q9',
    question: 'आपके लिए काम-जीवन संतुलन कितना महत्वपूर्ण है?',
    options: ['बहुत महत्वपूर्ण', 'कुछ हद तक महत्वपूर्ण', 'बहुत महत्वपूर्ण नहीं', 'नौकरी पर निर्भर करता है', 'मैं लचीले समय को पसंद करता हूं'],
    category: 'work_life_balance',
    language: 'hi'
  },
  {
    id: 'q10',
    question: 'किस प्रकार का करियर विकास आपको रुचिकर लगता है?',
    options: ['तकनीकी विशेषज्ञता', 'प्रबंधन भूमिकाएं', 'उद्यमिता', 'अनुसंधान और विकास', 'परामर्श'],
    category: 'career_growth',
    language: 'hi'
  }
];

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' }
];

const Quiz = () => {
  const [questions, setQuestions] = useState<QuizQuestion[]>(FALLBACK_QUESTIONS);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<QuizAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [language, setLanguage] = useState<string>('en');

  const { user } = useAuth();

  // Load questions when language changes
  useEffect(() => {
    const loadQuestions = () => {
      console.log('Loading questions for language:', language);
      if (language === 'hi') {
        setQuestions(HINDI_QUESTIONS);
      } else {
        setQuestions(FALLBACK_QUESTIONS);
      }
    };

    loadQuestions();
  }, [language]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const progress = questions.length > 0 ? ((currentQuestion + 1) / questions.length) * 100 : 0;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questions[currentQuestion].id]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < questions.length - 1) {
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
      const quizData = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || 'No answer',
        category: q.category
      }));

      console.log('Using rule-based analysis for reliable results');
      
      // Use offline recommendation engine for consistent results
      const analysisData = generateOfflineRecommendations(quizData);
      console.log('Rule-based analysis completed:', analysisData);

      // Save to database
      const { error: quizError } = await supabase
        .from('quiz_responses')
        .insert({
          user_id: user.id,
          responses: quizData
        });

      if (quizError) {
        console.error('Error saving quiz responses:', quizError);
      }

      // Save recommendations
      const { error: recError } = await supabase
        .from('recommendations')
        .insert({
          user_id: user.id,
          career_recommendations: analysisData.career_recommendations as any,
          course_recommendations: { courses: analysisData.course_recommendations || [] } as any,
          college_recommendations: [],
          scholarship_matches: []
        });

      if (recError) {
        console.error('Error saving recommendations:', recError);
      }

      // Map icons to recommendations
      const iconMap: { [key: string]: any } = {
        'Software Engineer': Code,
        'Data Scientist': TrendingUp,
        'Doctor': Heart,
        'Doctor (MBBS)': Heart,
        'Teacher': GraduationCap,
        'School Teacher': GraduationCap,
        'Designer': Palette,
        'Graphic Designer': Palette,
        'Business Analyst': BarChart3,
        'Researcher': Microscope,
        'Research Scientist': Microscope,
        'Engineer': Wrench,
        'Electronics Engineer': Wrench,
        'Marketing Manager': BarChart3,
        'Content Writer': Palette,
        'Corporate Trainer': Users,
        'Nurse': Heart,
        'Social Worker': Users
      };

      analysisData.career_recommendations = analysisData.career_recommendations.map((rec: any) => ({
        ...rec,
        icon: iconMap[rec.title] || Briefcase
      }));

      setAnalysis(analysisData);

    } catch (error) {
      console.error('Error analyzing quiz:', error);
      // Fallback to offline analysis
      const quizData = questions.map(q => ({
        questionId: q.id,
        answer: answers[q.id] || 'No answer',
        category: q.category
      }));
      const fallbackAnalysis = generateOfflineRecommendations(quizData);
      setAnalysis(fallbackAnalysis);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setAnalysis(null);
    setError(null);
  };

  if (analysis) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Complete!</h1>
            <p className="text-muted-foreground">Here are your personalized career recommendations</p>
          </div>

          {/* Analysis Summary */}
          <Card className="card-gradient border-border p-6 mb-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">Your Career Profile</h2>
            <p className="text-muted-foreground mb-4">{analysis.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Key Strengths</h3>
                <ul className="space-y-1">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-center">
                      <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Work Style</h3>
                <p className="text-sm text-muted-foreground">{analysis.work_style}</p>
              </div>
            </div>
          </Card>

          {/* Career Recommendations */}
          <div className="space-y-6 mb-8">
            <h2 className="text-2xl font-bold text-foreground">Career Recommendations</h2>
            {analysis.career_recommendations.map((career, index) => {
              const IconComponent = career.icon || Briefcase;
              return (
                <Card key={index} className="card-gradient border-border p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-accent/10 rounded-lg">
                      <IconComponent className="h-6 w-6 text-accent" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{career.title}</h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-accent">{career.match_percentage}%</div>
                          <div className="text-xs text-muted-foreground">Match</div>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-3">{career.description}</p>
                      <p className="text-sm text-accent mb-4">{career.reason}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Education Required</h4>
                          <ul className="space-y-1">
                            {career.required_education.slice(0, 3).map((edu, idx) => (
                              <li key={idx} className="text-muted-foreground">• {edu}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Key Skills</h4>
                          <ul className="space-y-1">
                            {career.skills.slice(0, 3).map((skill, idx) => (
                              <li key={idx} className="text-muted-foreground">• {skill}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-semibold text-foreground mb-1">Salary Range</h4>
                          <p className="text-muted-foreground font-medium">{career.salary_range}</p>
                          <h4 className="font-semibold text-foreground mb-1 mt-2">Growth</h4>
                          <p className="text-muted-foreground text-xs">{career.growth_prospects}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={handleRestart} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Button>
            <Button onClick={() => window.location.href = '/recommendations'} className="bg-accent hover:bg-accent/90">
              View All Recommendations
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    console.log('No questions found, using fallback');
    setQuestions(FALLBACK_QUESTIONS);
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            {isOffline ? <WifiOff className="h-6 w-6 text-orange-500" /> : <Wifi className="h-6 w-6 text-green-500" />}
            <h1 className="text-3xl font-bold text-foreground">Career Assessment Quiz</h1>
          </div>
          <p className="text-muted-foreground mb-4">
            {isOffline 
              ? 'Working offline - using cached questions and offline recommendations' 
              : 'AI-powered career guidance based on your interests and preferences'
            }
          </p>
          
          {/* Language Selector */}
          <div className="flex justify-center space-x-2 mb-6">
            {LANGUAGE_OPTIONS.map((lang) => (
              <Button
                key={lang.code}
                variant={language === lang.code ? "default" : "outline"}
                size="sm"
                onClick={() => setLanguage(lang.code)}
              >
                <Globe className="h-4 w-4 mr-1" />
                {lang.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="card-gradient border-border p-8">
          <div className="text-center mb-8">
            <Brain className="h-12 w-12 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {questions[currentQuestion]?.question}
            </h2>
            <p className="text-sm text-muted-foreground">
              Category: {questions[currentQuestion]?.category.replace('_', ' ')}
            </p>
          </div>

          <RadioGroup 
            value={answers[questions[currentQuestion]?.id] || ''}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
          >
            {questions[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {error && (
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline" 
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
            >
              Previous
            </Button>

            <Button 
              onClick={handleNext}
              disabled={!answers[questions[currentQuestion]?.id]}
              className="bg-accent hover:bg-accent/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : currentQuestion === questions.length - 1 ? (
                'Complete Quiz'
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Quiz;