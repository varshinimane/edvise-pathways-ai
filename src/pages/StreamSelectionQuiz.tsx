import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  ArrowRight, 
  CheckCircle, 
  Loader2, 
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
  BookOpen,
  Target,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { STREAMS, getStreamRecommendations, getCoursesForStream, type Stream, type Course } from '@/lib/courseStreamMapping';
import { offlineStorage } from '@/lib/offlineStorage';

interface StreamQuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string;
  weight: number;
}

const STREAM_QUIZ_QUESTIONS: StreamQuizQuestion[] = [
  {
    id: 'q1',
    question: 'What subjects do you enjoy studying the most?',
    options: ['Mathematics and Science', 'Business and Economics', 'Literature and History', 'Practical and Technical Skills'],
    category: 'academic_interests',
    weight: 3
  },
  {
    id: 'q2',
    question: 'How do you prefer to solve problems?',
    options: ['Through logical analysis and experiments', 'By analyzing data and numbers', 'Through discussion and research', 'By hands-on practical methods'],
    category: 'problem_solving',
    weight: 2
  },
  {
    id: 'q3',
    question: 'What type of work environment appeals to you?',
    options: ['Laboratory or research facility', 'Office or corporate setting', 'Classroom or community setting', 'Workshop or field environment'],
    category: 'work_environment',
    weight: 2
  },
  {
    id: 'q4',
    question: 'What motivates you most in your studies?',
    options: ['Discovering new scientific facts', 'Understanding business and finance', 'Learning about society and culture', 'Mastering practical skills'],
    category: 'motivation',
    weight: 3
  },
  {
    id: 'q5',
    question: 'How do you like to learn new concepts?',
    options: ['Through experiments and calculations', 'Through case studies and analysis', 'Through reading and discussion', 'Through hands-on practice'],
    category: 'learning_style',
    weight: 2
  },
  {
    id: 'q6',
    question: 'What kind of impact do you want to make?',
    options: ['Scientific breakthroughs and innovations', 'Economic growth and business success', 'Social change and community development', 'Practical solutions and services'],
    category: 'impact_goals',
    weight: 3
  },
  {
    id: 'q7',
    question: 'What are your strongest skills?',
    options: ['Mathematical reasoning and analysis', 'Business acumen and communication', 'Writing and critical thinking', 'Technical and practical abilities'],
    category: 'skills',
    weight: 2
  },
  {
    id: 'q8',
    question: 'What type of career growth interests you?',
    options: ['Technical specialization and research', 'Management and leadership roles', 'Education and social impact', 'Skill development and entrepreneurship'],
    category: 'career_growth',
    weight: 2
  }
];

const StreamSelectionQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamRecommendations, setStreamRecommendations] = useState<Stream[]>([]);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [streamCourses, setStreamCourses] = useState<Course[]>([]);
  const [error, setError] = useState<string | null>(null);

  const progress = (currentQuestion + 1) / STREAM_QUIZ_QUESTIONS.length * 100;

  const handleAnswerSelect = (answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [STREAM_QUIZ_QUESTIONS[currentQuestion].id]: answer
    }));
  };

  const handleNext = async () => {
    if (currentQuestion < STREAM_QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      await analyzeStreamPreferences();
    }
  };

  const analyzeStreamPreferences = async () => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Extract interests and personality traits from answers
      const interests: string[] = [];
      const personalityTraits: string[] = [];

      Object.entries(answers).forEach(([questionId, answer]) => {
        const question = STREAM_QUIZ_QUESTIONS.find(q => q.id === questionId);
        if (question) {
          // Map answers to interests and traits
          if (answer.includes('Mathematics') || answer.includes('Science')) {
            interests.push('science', 'technology', 'research');
            personalityTraits.push('analytical', 'logical');
          }
          if (answer.includes('Business') || answer.includes('Economics')) {
            interests.push('business', 'finance', 'commerce');
            personalityTraits.push('business-minded', 'strategic');
          }
          if (answer.includes('Literature') || answer.includes('History')) {
            interests.push('humanities', 'social sciences', 'education');
            personalityTraits.push('creative', 'empathetic');
          }
          if (answer.includes('Practical') || answer.includes('Technical')) {
            interests.push('vocational', 'technical', 'hands-on');
            personalityTraits.push('practical', 'technical');
          }
        }
      });

      // Get stream recommendations
      const recommendations = getStreamRecommendations(interests, personalityTraits);
      setStreamRecommendations(recommendations);

      // Save to offline storage
      const quizData = {
        answers,
        interests,
        personalityTraits,
        recommendations,
        timestamp: Date.now()
      };

      await offlineStorage.saveUserData('stream_quiz_results', quizData);
      console.log('Stream quiz results saved offline');

    } catch (error) {
      console.error('Error analyzing stream preferences:', error);
      setError('Failed to analyze your preferences. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleStreamSelect = (stream: Stream) => {
    setSelectedStream(stream);
    const courses = getCoursesForStream(stream.id);
    setStreamCourses(courses);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setStreamRecommendations([]);
    setSelectedStream(null);
    setStreamCourses([]);
    setError(null);
  };

  // Show stream recommendations
  if (streamRecommendations.length > 0 && !selectedStream) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-foreground mb-2">Stream Recommendations</h1>
            <p className="text-muted-foreground">Based on your interests and personality, here are the best streams for you</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {streamRecommendations.map((stream, index) => (
              <Card 
                key={stream.id} 
                className="card-gradient border-border p-6 cursor-pointer hover:shadow-lg transition-all"
                onClick={() => handleStreamSelect(stream)}
              >
                <div className="text-center">
                  <div className="text-4xl mb-4">{stream.icon}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{stream.name}</h3>
                  <p className="text-muted-foreground mb-4 text-sm">{stream.description}</p>
                  
                  <div className="mb-4">
                    <Badge variant="secondary" className="mb-2">
                      Match Score: {index === 0 ? '95%' : index === 1 ? '85%' : '75%'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Key Subjects:</h4>
                      <p className="text-muted-foreground">{stream.subjects.slice(0, 3).join(', ')}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-1">Career Paths:</h4>
                      <p className="text-muted-foreground">{stream.career_paths.slice(0, 3).join(', ')}</p>
                    </div>
                  </div>

                  <Button className="w-full mt-4" variant="outline">
                    Explore {stream.name} Courses
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={handleRestart} variant="outline">
              Retake Quiz
            </Button>
            <Link to="/recommendations">
              <Button className="bg-accent hover:bg-accent/90">
                View All Recommendations
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show courses for selected stream
  if (selectedStream && streamCourses.length > 0) {
    return (
      <div className="min-h-screen bg-gradient-primary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">{selectedStream.icon}</div>
            <h1 className="text-3xl font-bold text-foreground mb-2">{selectedStream.name} Courses</h1>
            <p className="text-muted-foreground">Explore detailed career paths for {selectedStream.name} stream</p>
          </div>

          <div className="space-y-6">
            {streamCourses.map((course) => (
              <Card key={course.id} className="card-gradient border-border p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{course.name}</h3>
                    <p className="text-muted-foreground mb-4">{course.duration} • {course.average_salary_range}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Eligibility:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {course.eligibility.map((req, idx) => (
                            <li key={idx}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground mb-2">Key Subjects:</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {course.subjects.slice(0, 4).map((subject, idx) => (
                            <li key={idx}>• {subject}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-foreground mb-2">Career Opportunities:</h4>
                      <div className="flex flex-wrap gap-2">
                        {course.career_opportunities.slice(0, 3).map((career, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {career.title}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Higher Education:</h4>
                      <div className="text-sm text-muted-foreground">
                        {course.higher_education_options.slice(0, 3).join(', ')}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Government Exams:</h4>
                      <div className="text-sm text-muted-foreground">
                        {course.government_exams.slice(0, 3).join(', ')}
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-foreground mb-2">Growth Prospects:</h4>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-accent mr-1" />
                        <span className="text-sm text-muted-foreground">{course.growth_prospects}</span>
                      </div>
                    </div>

                    <Button className="w-full" variant="outline">
                      View Detailed Career Path
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-center space-x-4 mt-8">
            <Button onClick={() => setSelectedStream(null)} variant="outline">
              Back to Streams
            </Button>
            <Button onClick={handleRestart} variant="outline">
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Brain className="h-12 w-12 text-accent mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground">Stream Selection Quiz</h1>
          <p className="text-muted-foreground mb-4">
            Discover the perfect academic stream for your interests and career goals
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {STREAM_QUIZ_QUESTIONS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <Card className="card-gradient border-border p-8">
          <div className="text-center mb-8">
            <Target className="h-12 w-12 text-accent mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">
              {STREAM_QUIZ_QUESTIONS[currentQuestion]?.question}
            </h2>
            <p className="text-sm text-muted-foreground">
              Category: {STREAM_QUIZ_QUESTIONS[currentQuestion]?.category.replace('_', ' ')}
            </p>
          </div>

          <RadioGroup 
            value={answers[STREAM_QUIZ_QUESTIONS[currentQuestion]?.id] || ''}
            onValueChange={handleAnswerSelect}
            className="space-y-4"
          >
            {STREAM_QUIZ_QUESTIONS[currentQuestion]?.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-300 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
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
              disabled={!answers[STREAM_QUIZ_QUESTIONS[currentQuestion]?.id]}
              className="bg-accent hover:bg-accent/90"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : currentQuestion === STREAM_QUIZ_QUESTIONS.length - 1 ? (
                'Get Recommendations'
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

export default StreamSelectionQuiz;
